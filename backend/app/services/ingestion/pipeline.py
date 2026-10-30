"""One 15-minute ingestion run: poll sources -> drop seen/duplicate items -> extract -> classify -> store.

Safe to call repeatedly or concurrently: a Postgres advisory lock allows one run at a time, and the
unique url_hash makes every insert idempotent.
"""

import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from urllib.parse import urlsplit

import httpx
from bs4 import BeautifulSoup
from sqlalchemy import delete, select, text
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.config import get_settings
from app.core.db import SessionLocal, engine
from app.core.logging import get_logger
from app.models import Article, ArticleKeywordHit, IngestionRun, Keyword, SeenItem, Source
from app.services.ingestion.classifier import Match, build_rules, classify
from app.services.ingestion.dedupe import canonical_url, sha256, strip_media_suffix, title_fingerprint, url_hash
from app.services.ingestion.extractor import fetch_article
from app.services.ingestion.fetchers.google_news import decode_link, fetch_google_news
from app.services.ingestion.fetchers.rss import fetch_rss
from app.services.ingestion.raw import RawItem

log = get_logger()
LOCK_KEY = 7_315_001
SEEN_RETENTION_DAYS = 14
FEED_BODY_MIN_CHARS = 1200  # feed already carries the full text -> skip the page download

FETCHERS = {"rss": fetch_rss, "google_news": fetch_google_news}


@dataclass
class Candidate:
    item: RawItem
    url: str
    headline: str
    body: str
    author: str | None
    published_at: datetime | None
    match: Match
    keys: list[str]


@dataclass
class RunStats:
    sources_polled: int = 0
    found: int = 0
    inserted: int = 0
    duplicates: int = 0
    errors: int = 0
    error_detail: dict = field(default_factory=dict)


def html_to_text(html: str) -> str:
    if not html:
        return ""
    return BeautifulSoup(html, "lxml").get_text(" ", strip=True)


def item_key(item: RawItem) -> str:
    return sha256("gn:" + item.url) if item.is_google_news else url_hash(item.url)


async def _poll_sources(client: httpx.AsyncClient, sources: list[Source], stats: RunStats) -> list[RawItem]:
    sem = asyncio.Semaphore(get_settings().fetch_concurrency)

    async def poll(source: Source) -> list[RawItem]:
        async with sem:
            try:
                items = await FETCHERS[source.kind](client, source)
                source.last_error = None
                return items
            except Exception as exc:  # one bad feed must not stop the run
                source.last_error = f"{type(exc).__name__}: {exc}"[:500]
                stats.errors += 1
                stats.error_detail[source.feed_url] = source.last_error
                return []
            finally:
                source.last_polled_at = datetime.now(timezone.utc)

    results = await asyncio.gather(*(poll(s) for s in sources))
    stats.sources_polled = len(sources)
    return [item for items in results for item in items]


async def _filter_known(session, items: list[RawItem]) -> tuple[list[RawItem], int]:
    """Drop items already seen or stored; collapse repeats inside this batch."""
    unique: dict[str, RawItem] = {}
    for item in items:
        unique.setdefault(item_key(item), item)
    if not unique:
        return [], 0
    keys = list(unique)
    seen = set((await session.scalars(select(SeenItem.key_hash).where(SeenItem.key_hash.in_(keys)))).all())
    stored = set((await session.scalars(select(Article.url_hash).where(Article.url_hash.in_(keys)))).all())
    fresh = [item for key, item in unique.items() if key not in seen and key not in stored]
    return fresh, len(items) - len(fresh)


async def _process(client: httpx.AsyncClient, rules, item: RawItem, stats: RunStats) -> tuple[Candidate | None, list[str]]:
    """Returns (candidate or None, keys to mark as seen)."""
    keys = [item_key(item)]
    url = item.url
    if item.is_google_news:
        decoded = await decode_link(item.url)
        if not decoded:
            stats.errors += 1
            stats.error_detail.setdefault("google_news_decode", 0)
            stats.error_detail["google_news_decode"] += 1
            return None, []  # retry on a later run; never store a Google redirect as the source URL
        url = decoded
        real_key = url_hash(url)
        async with SessionLocal() as lookup:
            if await lookup.scalar(select(Article.id).where(Article.url_hash == real_key)):
                return None, keys
        keys.append(real_key)

    if not urlsplit(url).path.strip("/"):
        return None, keys  # a site's front page, not an article
    headline = strip_media_suffix(item.title) if item.is_google_news else item.title.strip()
    body, author, published = html_to_text(item.content), item.author, item.published_at
    if len(body) < FEED_BODY_MIN_CHARS:
        try:
            page = await fetch_article(client, url)
            if len(page.text) > len(body):
                body = page.text
            author = author or page.author
            published = published or page.published_at
        except Exception:
            body = body or html_to_text(item.summary)  # keep going on title + feed summary

    match = classify(rules, headline, body)
    if match is None:
        return None, keys
    return Candidate(item, url, headline, body, author, published, match, keys), keys


async def _store(session, candidates: list[Candidate], stats: RunStats) -> None:
    window = datetime.now(timezone.utc) - timedelta(hours=get_settings().title_dedupe_hours)
    fingerprints = {c.headline: title_fingerprint(c.headline) for c in candidates}
    recent = set(
        (
            await session.scalars(
                select(Article.title_fingerprint).where(
                    Article.collected_at >= window, Article.title_fingerprint.in_(set(fingerprints.values()))
                )
            )
        ).all()
    )
    for cand in candidates:
        fp = fingerprints[cand.headline]
        if fp in recent:
            stats.duplicates += 1  # same story already collected (syndication / repost)
            continue
        stmt = (
            pg_insert(Article)
            .values(
                url=cand.url,
                url_hash=url_hash(cand.url),
                title_fingerprint=fp,
                headline=cand.headline,
                media_name=cand.item.media_name,
                source_id=cand.item.source_id,
                author=cand.author,
                body=cand.body or None,
                published_at=cand.published_at,
                keyword_trigger=cand.match.trigger,
                category=cand.match.category,
                company=cand.match.company,
            )
            .on_conflict_do_nothing(index_elements=["url_hash"])
            .returning(Article.id)
        )
        article_id = (await session.execute(stmt)).scalar()
        if article_id is None:
            stats.duplicates += 1
            continue
        recent.add(fp)
        stats.inserted += 1
        session.add_all(ArticleKeywordHit(article_id=article_id, keyword_id=k) for k in cand.match.keyword_ids)


async def _run() -> dict:
    settings = get_settings()
    stats = RunStats()
    async with SessionLocal() as session:
        run = IngestionRun()
        session.add(run)
        await session.commit()

        sources = list((await session.scalars(select(Source).where(Source.is_active))).all())
        rules = build_rules((await session.scalars(select(Keyword).where(Keyword.is_active))).all())
        headers = {"User-Agent": settings.user_agent, "Accept-Language": "id,en;q=0.8"}
        async with httpx.AsyncClient(headers=headers, timeout=settings.fetch_timeout_s) as client:
            raw = await _poll_sources(client, sources, stats)
            cutoff = datetime.now(timezone.utc) - timedelta(hours=settings.max_article_age_hours)
            raw = [i for i in raw if i.published_at is None or i.published_at >= cutoff]
            stats.found = len(raw)

            fresh, skipped = await _filter_known(session, raw)
            stats.duplicates += skipped

            sem = asyncio.Semaphore(settings.fetch_concurrency)

            async def guarded(item: RawItem):
                async with sem:
                    try:
                        return await _process(client, rules, item, stats)
                    except Exception as exc:
                        stats.errors += 1
                        stats.error_detail[item.url] = f"{type(exc).__name__}: {exc}"[:300]
                        return None, []

            results = await asyncio.gather(*(guarded(i) for i in fresh))

        candidates = [c for c, _ in results if c is not None]
        await _store(session, candidates, stats)
        seen_keys = {k for _, keys in results for k in keys}
        if seen_keys:
            await session.execute(pg_insert(SeenItem).values([{"key_hash": k} for k in seen_keys]).on_conflict_do_nothing())
        await session.execute(
            delete(SeenItem).where(SeenItem.seen_at < datetime.now(timezone.utc) - timedelta(days=SEEN_RETENTION_DAYS))
        )

        run.finished_at = datetime.now(timezone.utc)
        run.sources_polled, run.found, run.inserted = stats.sources_polled, stats.found, stats.inserted
        run.duplicates, run.errors, run.error_detail = stats.duplicates, stats.errors, stats.error_detail or None
        await session.commit()

    summary = {k: getattr(stats, k) for k in ("sources_polled", "found", "inserted", "duplicates", "errors")}
    log.info("ingestion_done", **summary)
    return {"status": "ok", **summary}


async def run_ingestion() -> dict:
    async with engine.connect() as lock_conn:
        got = (await lock_conn.execute(text("SELECT pg_try_advisory_lock(:k)"), {"k": LOCK_KEY})).scalar()
        if not got:
            return {"status": "skipped", "reason": "another run is in progress"}
        try:
            return await _run()
        finally:
            await lock_conn.execute(text("SELECT pg_advisory_unlock(:k)"), {"k": LOCK_KEY})

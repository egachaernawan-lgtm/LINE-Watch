"""Stages that run after ingestion: Gemini analysis, then Google Sheets sync."""

import asyncio
from datetime import datetime, timezone

from sqlalchemy import case, select

from app.core.config import get_settings
from app.core.db import SessionLocal
from app.core.logging import get_logger
from app.models import AnalysisStatus, Article, ArticleCategory
from app.services import sheets
from app.services.ai.gemini import QuotaExceeded, analyze_batch

log = get_logger()
MAX_ATTEMPTS = 3


async def analyze_pending(limit: int | None = None) -> dict:
    """Analyse PENDING articles (and FAILED ones with attempts left): LINE coverage first, then newest first.

    Articles go to Gemini in batches (one request per `gemini_batch_size` articles) because the free
    tier allows few requests per day. Hitting the quota stops the batch without counting against the
    articles; they stay pending and are picked up by the next run.
    """
    settings = get_settings()
    if not settings.gemini_api_key:
        return {"status": "skipped", "reason": "GEMINI_API_KEY not set"}
    async with SessionLocal() as session:
        articles = (
            await session.scalars(
                select(Article)
                .where(Article.analysis_status != AnalysisStatus.DONE, Article.analysis_attempts < MAX_ATTEMPTS)
                # LINE coverage first: when the free quota runs out, the rest waits for the next run
                .order_by(case((Article.category == ArticleCategory.LINE, 0), else_=1), Article.collected_at.desc())
                .limit(limit or settings.gemini_max_per_run)
            )
        ).all()
        size = max(1, settings.gemini_batch_size)
        batches = [articles[i : i + size] for i in range(0, len(articles), size)]
        sem = asyncio.Semaphore(settings.gemini_concurrency)
        done = failed = 0
        quota_hit = False

        async def work(batch: list[Article]) -> None:
            nonlocal done, failed, quota_hit
            async with sem:
                if quota_hit:
                    return
                for a in batch:
                    a.analysis_attempts += 1
                items = [
                    {"id": a.id, "headline": a.headline, "media": a.media_name, "category": a.category.value,
                     "keyword": a.keyword_trigger, "body": a.body or a.headline}
                    for a in batch
                ]
                try:
                    results = await analyze_batch(items)
                except QuotaExceeded as exc:
                    quota_hit = True
                    for a in batch:
                        a.analysis_attempts -= 1  # not the articles' fault
                    log.warning("gemini_quota_exceeded", error=str(exc)[:200])
                    return
                except Exception as exc:
                    for a in batch:
                        a.analysis_status = AnalysisStatus.FAILED
                    failed += len(batch)
                    log.warning("analysis_failed", article_ids=[a.id for a in batch], error=str(exc)[:200])
                    return
                for a in batch:
                    r = results.get(a.id)
                    if r is None:  # the model skipped this one; it is retried on a later run
                        a.analysis_status = AnalysisStatus.FAILED
                        failed += 1
                        continue
                    a.is_relevant = r.is_relevant
                    a.summary, a.sentiment = r.summary, r.sentiment
                    a.importance, a.business_impact = r.importance, r.business_impact
                    a.recommended_action = r.recommended_action
                    a.analysis_status, a.analyzed_at = AnalysisStatus.DONE, datetime.now(timezone.utc)
                    done += 1

        await asyncio.gather(*(work(b) for b in batches))
        await session.commit()
    result = {"status": "ok", "analyzed": done, "failed": failed}
    if quota_hit:
        result["note"] = "Gemini quota reached; remaining articles will be analysed on the next run"
    return result


async def sync_sheets(limit: int = 500) -> dict:
    """Append analysed (or permanently failed) articles to Google Sheets exactly once."""
    if not sheets.sheets_configured():
        return {"status": "skipped", "reason": "Google Sheets not configured"}
    async with SessionLocal() as session:
        articles = (
            await session.scalars(
                select(Article)
                .where(
                    Article.sheet_synced_at.is_(None),
                    Article.is_relevant.is_(True),
                    (Article.analysis_status == AnalysisStatus.DONE) | (Article.analysis_attempts >= MAX_ATTEMPTS),
                )
                .order_by(Article.collected_at)
                .limit(limit)
            )
        ).all()
        if not articles:
            return {"status": "ok", "synced": 0}
        await sheets.append_articles(list(articles))
        now = datetime.now(timezone.utc)
        for a in articles:
            a.sheet_synced_at = now
        await session.commit()
    return {"status": "ok", "synced": len(articles)}

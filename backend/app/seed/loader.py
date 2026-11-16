"""Load keywords.yaml / sources.yaml into the database (idempotent; safe to re-run).

    python -m app.seed.loader
"""

import asyncio
from pathlib import Path

import yaml
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.db import SessionLocal
from sqlalchemy import select

from app.models import ArticleCategory, Keyword, Source, Topic
from app.services.ingestion.fetchers.google_news import build_query, google_news_url

SEED_DIR = Path(__file__).parent


def _load(name: str):
    return yaml.safe_load((SEED_DIR / name).read_text(encoding="utf-8"))


def topic_rows() -> list[dict]:
    data = _load("topics.yaml")
    groups = data["groups"]
    return [
        {
            "group_name": t["group"],
            "name": t["name"],
            "category": ArticleCategory(t["category"]),
            "description": t.get("description"),
            "group_description": groups.get(t["group"]),
            "report_cap": t.get("cap"),
            "judged": t.get("judged", False),
            "sort_order": i,
        }
        for i, t in enumerate(data["topics"])
    ]


def keyword_rows(topic_ids: dict[str, int] | None = None) -> list[dict]:
    """`topic_ids` maps "<group>/<name>" to its topics.id; without it keywords get no topic (tests)."""
    rows = []
    for k in _load("keywords.yaml"):
        key = k.get("topic")
        if topic_ids is not None and key not in topic_ids:
            raise ValueError(f"keyword {k['term']!r} points at unknown topic {key!r} (see topics.yaml)")
        rows.append(
            {
                "term": k["term"],
                "category": ArticleCategory(k["category"]),
                "company": k.get("company"),
                "aliases": k.get("aliases", []),
                "case_sensitive": k.get("case_sensitive", False),
                "scope": k.get("scope"),
                "topic_id": topic_ids[key] if topic_ids else None,
            }
        )
    return rows


def source_rows() -> list[dict]:
    data = _load("sources.yaml")
    rows = [
        {"media_name": s["media"], "kind": "rss", "feed_url": s["url"], "media_type": s.get("media_type")}
        for s in data["rss"]
    ]
    for s in data["google_news"]:
        query = build_query(s.get("media_type"), s.get("site"), s.get("query"))
        rows.append(
            {"media_name": s["media"], "kind": "google_news", "feed_url": google_news_url(query), "media_type": s.get("media_type")}
        )
    return rows


async def main() -> None:
    async with SessionLocal() as session:
        tp = pg_insert(Topic).values(topic_rows())
        await session.execute(
            tp.on_conflict_do_update(
                constraint="uq_topics_group_name",
                set_={c: tp.excluded[c] for c in ("category", "description", "group_description", "report_cap", "judged", "sort_order")},
            )
        )
        topic_ids = {f"{t.group_name}/{t.name}": t.id for t in (await session.scalars(select(Topic))).all()}
        kw = pg_insert(Keyword).values(keyword_rows(topic_ids))
        await session.execute(
            kw.on_conflict_do_update(
                index_elements=["term"],
                set_={c: kw.excluded[c] for c in ("category", "company", "aliases", "case_sensitive", "scope", "topic_id")},
            )
        )
        await session.execute(pg_insert(Source).values(source_rows()).on_conflict_do_nothing(index_elements=["feed_url"]))
        await session.commit()
    print(f"seeded {len(topic_rows())} topics, {len(keyword_rows())} keywords and {len(source_rows())} sources")


if __name__ == "__main__":
    asyncio.run(main())

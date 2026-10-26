"""Load keywords.yaml / sources.yaml into the database (idempotent; safe to re-run).

    python -m app.seed.loader
"""

import asyncio
from pathlib import Path

import yaml
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.core.db import SessionLocal
from app.models import ArticleCategory, Keyword, Source
from app.services.ingestion.fetchers.google_news import build_query, google_news_url

SEED_DIR = Path(__file__).parent


def _load(name: str):
    return yaml.safe_load((SEED_DIR / name).read_text(encoding="utf-8"))


def keyword_rows() -> list[dict]:
    return [
        {
            "term": k["term"],
            "category": ArticleCategory(k["category"]),
            "company": k.get("company"),
            "aliases": k.get("aliases", []),
            "case_sensitive": k.get("case_sensitive", False),
        }
        for k in _load("keywords.yaml")
    ]


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
        kw = pg_insert(Keyword).values(keyword_rows())
        await session.execute(
            kw.on_conflict_do_update(
                index_elements=["term"],
                set_={c: kw.excluded[c] for c in ("category", "company", "aliases", "case_sensitive")},
            )
        )
        await session.execute(pg_insert(Source).values(source_rows()).on_conflict_do_nothing(index_elements=["feed_url"]))
        await session.commit()
    print(f"seeded {len(keyword_rows())} keywords and {len(source_rows())} sources")


if __name__ == "__main__":
    asyncio.run(main())

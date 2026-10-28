"""Export real, analysed articles to the JSON snapshot that powers the Vercel demo.

    python -m app.seed.export_snapshot [--days 14] [--out ../frontend/src/data/snapshot.json]

Reads the same database the collector writes to. Nothing is generated or invented here: only rows
that were collected from media feeds and analysed by Gemini are exported.
"""

import argparse
import asyncio
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from sqlalchemy import func, select

from app.core.db import SessionLocal
from app.models import AnalysisStatus, Article

BODY_EXCERPT_CHARS = 600  # the demo links to the original; it does not republish full articles
DEFAULT_OUT = Path(__file__).resolve().parents[3] / "frontend" / "src" / "data" / "snapshot.json"


def _value(x):
    return getattr(x, "value", x)


async def export(days: int, out: Path) -> None:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    effective = func.coalesce(Article.published_at, Article.collected_at)
    async with SessionLocal() as session:
        rows = (
            await session.scalars(
                select(Article)
                .where(
                    Article.is_relevant.is_(True),
                    Article.analysis_status == AnalysisStatus.DONE,
                    effective >= since,
                )
                .order_by(effective.desc(), Article.id.desc())
            )
        ).all()

    articles = [
        {
            "id": a.id,
            "headline": a.headline,
            "media_name": a.media_name,
            "author": a.author,
            "published_at": a.published_at.isoformat() if a.published_at else None,
            "collected_at": a.collected_at.isoformat(),
            "url": a.url,
            "keyword_trigger": a.keyword_trigger,
            "category": _value(a.category),
            "company": a.company,
            "sentiment": _value(a.sentiment),
            "importance": _value(a.importance),
            "business_impact": _value(a.business_impact),
            "recommended_action": _value(a.recommended_action),
            "summary": a.summary,
            "analysis_status": _value(a.analysis_status),
            "body": (a.body or "")[:BODY_EXCERPT_CHARS] or None,
        }
        for a in rows
    ]
    snapshot = {"generated_at": datetime.now(timezone.utc).isoformat(), "articles": articles, "reports": []}
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(snapshot, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"Wrote {len(articles)} analysed articles (last {days} days) to {out}")
    if not articles:
        print("Nothing to export: run an ingestion and the analysis first (see README).")
        return
    times = [a["published_at"] or a["collected_at"] for a in articles]
    print(f"Newest: {max(times)}   Oldest: {min(times)}")
    for a in articles[:5]:
        print(f"  - [{a['category']}] {a['media_name']}: {a['headline'][:80]}\n    {a['url']}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--days", type=int, default=14, help="how far back to export (default 14)")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    asyncio.run(export(args.days, args.out))


if __name__ == "__main__":
    main()

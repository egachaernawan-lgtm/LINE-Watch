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
from zoneinfo import ZoneInfo

from sqlalchemy import func, select

from app.core.config import get_settings
from app.core.db import SessionLocal
from app.models import AnalysisStatus, Article
from app.seed.export_live_config import write as write_live_config
from app.services.reports.daily_report import ENDING, build_daily_report

BODY_EXCERPT_CHARS = 600  # the demo links to the original; it does not republish full articles
DEFAULT_OUT = Path(__file__).resolve().parents[3] / "frontend" / "src" / "data" / "snapshot.json"


def _value(x):
    return getattr(x, "value", x)


async def build_reports(report_days: int) -> list[dict]:
    """The daily report for each of the last `report_days` days that has coverage, already rendered."""
    reports = []
    today = datetime.now(timezone.utc).astimezone(ZoneInfo(get_settings().timezone)).date()
    async with SessionLocal() as session:
        for back in range(report_days):
            r = await build_daily_report(session, today - timedelta(days=back))
            if sum(r.counts.values()) == 0:
                continue
            reports.append(
                {"date": r.on.isoformat(), "label": r.label, "subject": r.subject, "html": r.html,
                 "sections": r.sections, "ending": ENDING, "counts": r.counts, "translated_all": r.translated_all}
            )
            print(f"  report {r.on}: {r.counts}" + ("" if r.translated_all else "  (some headlines not translated: quota)"))
    return reports


async def export(days: int, report_days: int, out: Path) -> None:
    write_live_config()  # keywords + feeds for the demo's Fetch latest news button
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
    print("Rendering daily reports (English translation uses a few Gemini requests the first time)...")
    reports = await build_reports(report_days)
    snapshot = {"generated_at": datetime.now(timezone.utc).isoformat(), "articles": articles, "reports": reports}
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(snapshot, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"Wrote {len(articles)} analysed articles and {len(reports)} daily reports to {out}")
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
    parser.add_argument("--report-days", type=int, default=7, help="how many daily reports to render (default 7)")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    asyncio.run(export(args.days, args.report_days, args.out))


if __name__ == "__main__":
    main()

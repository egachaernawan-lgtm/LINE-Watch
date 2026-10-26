"""Stages that run after ingestion: Gemini analysis, then Google Sheets sync."""

import asyncio
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.config import get_settings
from app.core.db import SessionLocal
from app.core.logging import get_logger
from app.models import AnalysisStatus, Article
from app.services import sheets
from app.services.ai.gemini import QuotaExceeded, analyze_article

log = get_logger()
MAX_ATTEMPTS = 3


async def analyze_pending(limit: int | None = None) -> dict:
    """Analyse PENDING articles (and FAILED ones with attempts left), newest first.

    Hitting the Gemini quota stops the batch without counting against the articles; they stay
    pending and are picked up by the next run.
    """
    settings = get_settings()
    if not settings.gemini_api_key:
        return {"status": "skipped", "reason": "GEMINI_API_KEY not set"}
    async with SessionLocal() as session:
        articles = (
            await session.scalars(
                select(Article)
                .where(Article.analysis_status != AnalysisStatus.DONE, Article.analysis_attempts < MAX_ATTEMPTS)
                .order_by(Article.collected_at.desc())
                .limit(limit or settings.gemini_max_per_run)
            )
        ).all()
        sem = asyncio.Semaphore(settings.gemini_concurrency)
        done = failed = 0
        quota_hit = False

        async def work(a: Article) -> None:
            nonlocal done, failed, quota_hit
            async with sem:
                if quota_hit:
                    return
                a.analysis_attempts += 1
                try:
                    r = await analyze_article(
                        headline=a.headline, media=a.media_name, category=a.category.value,
                        keyword=a.keyword_trigger, body=a.body or a.headline,
                    )
                except QuotaExceeded as exc:
                    quota_hit = True
                    a.analysis_attempts -= 1  # not the article's fault
                    log.warning("gemini_quota_exceeded", error=str(exc)[:200])
                    return
                except Exception as exc:
                    a.analysis_status = AnalysisStatus.FAILED
                    failed += 1
                    log.warning("analysis_failed", article_id=a.id, error=str(exc)[:200])
                    return
                a.is_relevant = r.is_relevant
                a.summary, a.sentiment = r.summary, r.sentiment
                a.importance, a.business_impact = r.importance, r.business_impact
                a.recommended_action = r.recommended_action
                a.analysis_status, a.analyzed_at = AnalysisStatus.DONE, datetime.now(timezone.utc)
                done += 1

        await asyncio.gather(*(work(a) for a in articles))
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

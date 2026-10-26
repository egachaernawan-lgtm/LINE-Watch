"""Endpoints called by Cloud Scheduler (OIDC-protected), never by the browser."""

from datetime import date

from fastapi import APIRouter, Depends

from app.core.security import verify_scheduler
from app.services.analysis_runner import analyze_pending, sync_sheets
from app.services.ingestion.pipeline import run_ingestion
from app.services.reports.runner import generate_report

router = APIRouter(prefix="/internal", tags=["internal"], dependencies=[Depends(verify_scheduler)])


@router.post("/ingest")
async def ingest() -> dict:
    """Every 15 minutes: collect new articles, analyse them, mirror them to Google Sheets."""
    result = {"ingest": await run_ingestion()}
    if result["ingest"]["status"] == "ok":
        result["analysis"] = await analyze_pending()
        try:
            result["sheets"] = await sync_sheets()
        except Exception as exc:  # Sheets problems must not fail the run; rows stay unsynced and retry
            result["sheets"] = {"status": "error", "error": str(exc)[:300]}
    return result


@router.post("/reports/daily")
async def daily_report(on: date | None = None) -> dict:
    return await generate_report("daily", on, send_email=True)


@router.post("/reports/monthly")
async def monthly_report(on: date | None = None) -> dict:
    return await generate_report("monthly", on, send_email=True)

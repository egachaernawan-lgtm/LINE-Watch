from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_admin
from app.models import Report
from app.schemas.article import ReportOut
from app.services.reports.runner import generate_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=list[ReportOut], dependencies=[Depends(get_current_user)])
async def list_reports(kind: str | None = None, session: AsyncSession = Depends(get_session)):
    stmt = select(Report).order_by(Report.period_start.desc()).limit(100)
    if kind:
        stmt = stmt.where(Report.kind == kind)
    return list(await session.scalars(stmt))


@router.post("/generate", response_model=dict, dependencies=[Depends(require_admin)])
async def generate(kind: str, on: date | None = None, send_email: bool = False) -> dict:
    """Manually (re)build a report. `on` is the report day (daily) or any day in the month (monthly)."""
    if kind not in ("daily", "monthly"):
        raise HTTPException(422, "kind must be 'daily' or 'monthly'")
    return await generate_report(kind, on, send_email=send_email)

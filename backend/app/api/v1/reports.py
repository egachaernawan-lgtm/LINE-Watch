from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.logging import get_logger
from app.core.security import CurrentUser, get_current_user, require_admin
from app.models import EmailSend, RecipientGroup, Report
from app.schemas.article import ReportOut
from app.schemas.email import MAX_RECIPIENTS, DailyPreview, SendIn, SendLogOut, SendOut, clean_emails
from app.services.notifications.mailer import send_html_to, sending_configured
from app.services.reports.email_report import build_daily_email
from app.services.reports.runner import generate_report

router = APIRouter(prefix="/reports", tags=["reports"])
log = get_logger()


@router.get("", response_model=list[ReportOut], dependencies=[Depends(get_current_user)])
async def list_reports(kind: str | None = None, session: AsyncSession = Depends(get_session)):
    stmt = select(Report).order_by(Report.period_start.desc()).limit(100)
    if kind:
        stmt = stmt.where(Report.kind == kind)
    return list(await session.scalars(stmt))


@router.get("/daily/preview", response_model=DailyPreview, dependencies=[Depends(get_current_user)])
async def preview_daily(on: date | None = None, session: AsyncSession = Depends(get_session)) -> DailyPreview:
    """The exact email that would be sent for `on` (default today): the report covers the 24 h before 08:00 WIB."""
    report = await build_daily_email(session, on)
    return DailyPreview(
        date=report.on, label=report.label, subject=report.subject, html=report.html,
        counts=report.counts, translated_all=report.translated_all,
    )


@router.post("/daily/send", response_model=SendOut)
async def send_daily(
    body: SendIn,
    user: CurrentUser = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
) -> SendOut:
    """Blast the daily report to the chosen groups and/or extra addresses (or only to yourself with test)."""
    if not sending_configured():
        raise HTTPException(503, "Email is not configured: set SENDGRID_API_KEY and EMAIL_FROM")

    names: list[str] = []
    emails: list[str] = []
    if body.test:
        names, emails = ["Test (sender only)"], [user.email]
    else:
        if body.group_ids:
            groups = (await session.scalars(select(RecipientGroup).where(RecipientGroup.id.in_(body.group_ids)))).all()
            for g in groups:
                names.append(g.name)
                emails += [m.email for m in g.members]
        if body.emails:
            names.append("Extra addresses")
            emails += body.emails
    try:
        emails = clean_emails(emails)
    except ValueError as exc:
        raise HTTPException(422, f"{exc} (the test email goes to your own account address)") from exc
    if not emails:
        raise HTTPException(422, "No recipients selected")
    if len(emails) > MAX_RECIPIENTS:
        raise HTTPException(422, f"Too many recipients ({len(emails)}); the limit per send is {MAX_RECIPIENTS}")

    report = await build_daily_email(session, body.on)
    status, error = "sent", None
    try:
        await send_html_to(emails, subject=report.subject, html=report.html)
    except Exception as exc:
        status, error = "failed", str(exc)[:300]
        log.warning("report_email_failed", error=error)
    session.add(
        EmailSend(
            report_date=report.on, subject=report.subject, recipient_count=len(emails), groups=names,
            sent_by=user.email, status=status, error=error,
        )
    )
    await session.commit()
    if status == "failed":
        raise HTTPException(502, f"The email service refused the message: {error}")
    return SendOut(status=status, recipients=len(emails), subject=report.subject)


@router.get("/sends", response_model=list[SendLogOut], dependencies=[Depends(get_current_user)])
async def list_sends(session: AsyncSession = Depends(get_session)):
    return list(await session.scalars(select(EmailSend).order_by(EmailSend.sent_at.desc()).limit(100)))


@router.post("/generate", response_model=dict, dependencies=[Depends(require_admin)])
async def generate(kind: str, on: date | None = None, send_email: bool = False) -> dict:
    """Manually (re)build a report. `on` is the report day (daily) or any day in the month (monthly)."""
    if kind not in ("daily", "monthly"):
        raise HTTPException(422, "kind must be 'daily' or 'monthly'")
    return await generate_report(kind, on, send_email=send_email)

"""Build, store and send the daily (08:00 WIB) and monthly (1st of month) reports."""

import asyncio
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

from sqlalchemy import select

from app.core.config import get_settings
from app.core.db import SessionLocal
from app.core.logging import get_logger
from app.models import Report
from app.services import drive
from app.services.ai.gemini import monthly_narrative
from app.services.notifications.mailer import email_configured, send_report_email
from app.services.reports import charts
from app.services.reports.data import daily_data, facts_for_narrative, monthly_data
from app.services.reports.render import html_to_pdf, render_html

log = get_logger()


def daily_period(on: date | None) -> tuple[datetime, datetime, str]:
    """The report issued at 08:00 WIB on `on` covers the 24 hours before that."""
    zone = ZoneInfo(get_settings().timezone)
    day = on or datetime.now(zone).date()
    end = datetime.combine(day, time(8, 0), tzinfo=zone)
    return end - timedelta(days=1), end, f"{day:%A, %d %B %Y}"


def monthly_period(on: date | None) -> tuple[datetime, datetime, datetime, str]:
    """`on` = any day of the month to report; default is the previous month."""
    zone = ZoneInfo(get_settings().timezone)
    ref = on or (datetime.now(zone).date().replace(day=1) - timedelta(days=1))
    start = datetime.combine(ref.replace(day=1), time(0, 0), tzinfo=zone)
    end = datetime.combine((ref.replace(day=28) + timedelta(days=4)).replace(day=1), time(0, 0), tzinfo=zone)
    prev_start = datetime.combine((start - timedelta(days=1)).replace(day=1), time(0, 0), tzinfo=zone)
    return start, end, prev_start, f"{start:%B %Y}"


async def _build(kind: str, on: date | None):
    async with SessionLocal() as session:
        if kind == "daily":
            start, end, label = daily_period(on)
            d = await daily_data(session, start, end)
            html = render_html("daily.html", d=d, label=label)
            return start, end, label, html, html, d.total
        start, end, prev_start, label = monthly_period(on)
        d = await monthly_data(session, start, end, prev_start)
        narrative = None
        if get_settings().gemini_api_key and d.total:
            try:
                narrative = await monthly_narrative(facts_for_narrative(d))
            except Exception as exc:
                log.warning("monthly_narrative_failed", error=str(exc)[:200])
        chart_set = {
            "daily": charts.daily_line(d.daily),
            "sov": charts.share_of_voice_bar(d.share_of_voice),
            "sentiment": charts.sentiment_donut(d.sentiment),
        }
        pdf_html = render_html("monthly.html", d=d, label=label, narrative=narrative, charts=chart_set)
        # Google Docs / email: no charts (data-URI images are not reliably imported or shown)
        plain_html = render_html("monthly.html", d=d, label=label, narrative=narrative, charts=None)
        return start, end, label, pdf_html, plain_html, d.total


async def generate_report(kind: str, on: date | None = None, *, send_email: bool = False) -> dict:
    settings = get_settings()
    start, end, label, pdf_html, plain_html, total = await _build(kind, on)
    title = f"LINE WATCH {kind.title()} Report - {label}"
    result: dict = {"kind": kind, "period": label, "articles": total}

    async with SessionLocal() as session:
        report = await session.scalar(select(Report).where(Report.kind == kind, Report.period_start == start))
        if report is not None and report.emailed_at and send_email:
            return {**result, "status": "already_sent"}  # a retried Scheduler call must not email twice
        if report is None:
            report = Report(kind=kind, period_start=start, period_end=end)
            session.add(report)

        pdf: bytes | None = None
        try:
            pdf = await asyncio.to_thread(html_to_pdf, pdf_html)
        except Exception as exc:  # e.g. native PDF libraries missing
            result["pdf_error"] = f"{type(exc).__name__}: {exc}"[:300]
        if drive.drive_configured():
            doc = await drive.upload_doc_from_html(title, plain_html)
            report.gdoc_url, report.drive_file_id = doc.url, doc.file_id
            if pdf:
                report.pdf_url = (await drive.upload_pdf(f"{title}.pdf", pdf)).url
        else:
            result["drive"] = "skipped (Google Drive not configured)"
        await session.commit()

        if send_email:
            if email_configured():
                links = "".join(
                    f'<p><a href="{url}">{name}</a></p>'
                    for name, url in (("Open Google Doc", report.gdoc_url), ("Open PDF", report.pdf_url),
                                      ("Open dashboard", settings.frontend_url))
                    if url
                )
                await send_report_email(
                    subject=title, html=links + plain_html, pdf=pdf, pdf_name=f"{title}.pdf"
                )
                report.emailed_at = datetime.now(timezone.utc)
                await session.commit()
            else:
                result["email"] = "skipped (SendGrid not configured)"

        result.update(status="ok", report_id=report.id, gdoc_url=report.gdoc_url, pdf_url=report.pdf_url)
    return result

"""One-way mirror of the articles table into Google Sheets (PostgreSQL is the source of truth)."""

import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo

import gspread

from app.core.config import get_settings
from app.models import Article
from app.services.google_auth import service_account_credentials

HEADERS = [
    "Date Published", "Date Collected", "Headline", "Media", "Author", "URL", "Keyword",
    "Category", "Company", "Sentiment", "Importance", "Summary", "Recommended Action",
]


def _fmt(dt: datetime | None) -> str:
    if not dt:
        return ""
    return dt.astimezone(ZoneInfo(get_settings().timezone)).strftime("%Y-%m-%d %H:%M")


def _hyperlink(url: str, label: str) -> str:
    return '=HYPERLINK("{}","{}")'.format(url.replace('"', "%22"), label)


def article_row(a: Article) -> list[str]:
    return [
        _fmt(a.published_at),
        _fmt(a.collected_at),
        a.headline,
        a.media_name,
        a.author or "",
        _hyperlink(a.url, "Open article"),  # clickable
        a.keyword_trigger,
        a.category.value.title(),
        a.company or "",
        a.sentiment.value.title() if a.sentiment else "",
        a.importance.value.title() if a.importance else "",
        "\n".join(f"• {s}" for s in (a.summary or [])),
        a.recommended_action.value.replace("_", " ").title() if a.recommended_action else "",
    ]


def _worksheet():
    settings = get_settings()
    client = gspread.authorize(service_account_credentials())
    book = client.open_by_key(settings.sheets_spreadsheet_id)
    try:
        ws = book.worksheet(settings.sheets_worksheet)
    except gspread.WorksheetNotFound:
        ws = book.add_worksheet(settings.sheets_worksheet, rows=1000, cols=len(HEADERS))
    if ws.row_values(1) != HEADERS:
        ws.update(range_name="A1", values=[HEADERS])
        ws.freeze(rows=1)
    return ws


def _append(rows: list[list[str]]) -> None:
    # USER_ENTERED so =HYPERLINK(...) becomes a clickable link
    _worksheet().append_rows(rows, value_input_option="USER_ENTERED", table_range="A1")


async def append_articles(articles: list[Article]) -> None:
    if articles:
        await asyncio.to_thread(_append, [article_row(a) for a in articles])


def sheets_configured() -> bool:
    s = get_settings()
    return bool(s.sheets_spreadsheet_id and s.google_service_account_json)

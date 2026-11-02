"""The Global Daily Monitoring email: LINE / Competitor / Industry / Government tables in the global format."""

from dataclasses import dataclass
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.models import Article, ArticleCategory
from app.services.ai.gemini import QuotaExceeded, translate_batch
from app.services.reports.data import articles_between
from app.services.reports.render import render_html
from app.services.reports.runner import daily_period

log = get_logger()

REGION = "ID"  # every monitored source is Indonesian media
MAX_PER_SECTION = 30
TRANSLATE_BATCH = 8

ENDING = (
    "This news monitoring report is intended solely for the internal reference of relevant LINE Plus employees. "
    "The contents herein may not be distributed or transmitted externally in their current form. Should you wish "
    "to share any portion of this report with external parties, it is your responsibility to ensure that the "
    "content is appropriately edited prior to transmission. Please be advised that any legal liability arising "
    "from such external distribution shall rest with the individual responsible for the transmission."
)

# (section title, category, show the summary paragraph under each headline)
SECTIONS = [
    ("LINE", ArticleCategory.LINE, True),
    ("Competitor", ArticleCategory.COMPETITOR, False),
    ("Industry", ArticleCategory.INDUSTRY, False),
    ("Government & policy", ArticleCategory.GOVERNMENT, False),
]
GENERAL_LINE_KEYWORDS = {"line", "line indonesia", "ly corporation", "ly corp", "line yahoo"}
TOPIC_LABELS = {"artificial intelligence": "AI", "social media": "Social Media", "fintech": "Fintech"}


@dataclass
class Row:
    region: str
    category: str
    media: str
    headline: str
    url: str
    summary: str | None
    show_region: bool = True
    show_category: bool = True


@dataclass
class EmailReport:
    on: date
    label: str
    subject: str
    html: str
    counts: dict[str, int]
    translated_all: bool  # False when Gemini ran out of quota and some headlines are still in Indonesian


def sub_category(a: Article) -> str:
    """The 'Category' column: LINE product, competitor company or industry topic."""
    if a.category == ArticleCategory.COMPETITOR:
        return a.company or a.keyword_trigger
    if a.category == ArticleCategory.LINE:
        return "General" if a.keyword_trigger.lower() in GENERAL_LINE_KEYWORDS else a.keyword_trigger
    return TOPIC_LABELS.get(a.keyword_trigger.lower(), a.keyword_trigger)


def media_label(a: Article) -> str:
    return f"{a.media_name} (+{a.duplicate_count})" if a.duplicate_count else a.media_name


def build_rows(articles: list[Article], *, with_summary: bool) -> list[Row]:
    """`articles` arrive best-first (importance, then newest); equal categories are kept together."""
    groups: dict[str, list[Article]] = {}
    for a in articles[:MAX_PER_SECTION]:
        groups.setdefault(sub_category(a), []).append(a)  # dicts keep first-seen order = best-ranked group first
    rows: list[Row] = []
    last_region = None
    for category, items in groups.items():
        for i, a in enumerate(items):
            rows.append(
                Row(
                    region=REGION,
                    category=category,
                    media=media_label(a),
                    headline=a.headline_en or a.headline,
                    url=a.url,
                    summary=(a.summary_en or " ".join(a.summary or [])) if with_summary else None,
                    show_region=REGION != last_region,
                    show_category=i == 0,
                )
            )
            last_region = REGION
    return rows


def shown_articles(articles: list[Article]) -> list[Article]:
    """The articles that actually appear in the email: the best MAX_PER_SECTION of each section."""
    return [a for _, category, _ in SECTIONS for a in [x for x in articles if x.category == category][:MAX_PER_SECTION]]


def render_email(on: date, label: str, articles: list[Article]) -> tuple[str, dict[str, int]]:
    sections, counts = [], {}
    for title, category, with_summary in SECTIONS:
        items = [a for a in articles if a.category == category]
        counts[category.value] = len(items)
        sections.append({"title": title, "rows": build_rows(items, with_summary=with_summary)})
    return render_html("email_daily.html", label=label, sections=sections, ending=ENDING), counts


async def ensure_english(session: AsyncSession, articles: list[Article]) -> bool:
    """Fill headline_en / summary_en once per article. Returns False if quota ran out before finishing."""
    missing = [a for a in articles if not a.headline_en and a.summary]
    if not get_settings().gemini_api_key:
        return not missing
    complete = True
    for i in range(0, len(missing), TRANSLATE_BATCH):
        chunk = missing[i : i + TRANSLATE_BATCH]
        items = [{"id": a.id, "media": a.media_name, "headline": a.headline, "summary": a.summary} for a in chunk]
        try:
            results = await translate_batch(items)
        except QuotaExceeded:
            complete = False
            break
        except Exception as exc:
            log.warning("translation_failed", error=str(exc)[:200])
            complete = False
            continue
        for a in chunk:
            r = results.get(a.id)
            if r:
                a.headline_en, a.summary_en = r.headline_en.strip(), r.summary_en.strip()
            else:
                complete = False
    await session.commit()
    return complete


async def build_daily_email(session: AsyncSession, on: date | None = None, *, translate: bool = True) -> EmailReport:
    start, end, _ = daily_period(on)
    day = end.date()
    label = f"{day.day} {day:%B %Y}"
    articles = await articles_between(session, start, end)
    complete = await ensure_english(session, shown_articles(articles)) if translate else False
    html, counts = render_email(day, label, articles)
    return EmailReport(
        on=day,
        label=label,
        subject=f"[LINE WATCH] Global Daily Monitoring report - {label}",
        html=html,
        counts=counts,
        translated_all=complete,
    )

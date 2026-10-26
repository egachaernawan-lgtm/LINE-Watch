"""Queries that feed the daily and monthly reports."""

from collections import Counter
from dataclasses import dataclass, field
from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models import (
    Article,
    ArticleCategory,
    Level,
    RecommendedAction,
    Sentiment,
)

EFFECTIVE_TIME = func.coalesce(Article.published_at, Article.collected_at)
_LEVEL_ORDER = {Level.HIGH: 0, Level.MEDIUM: 1, Level.LOW: 2, None: 3}


def sort_articles(articles: list[Article]) -> list[Article]:
    return sorted(
        articles,
        key=lambda a: (_LEVEL_ORDER[a.importance], -(a.published_at or a.collected_at).timestamp()),
    )


async def articles_between(session: AsyncSession, start: datetime, end: datetime) -> list[Article]:
    rows = await session.scalars(
        select(Article).where(
            Article.is_relevant.is_(True), EFFECTIVE_TIME >= start, EFFECTIVE_TIME < end
        )
    )
    return sort_articles(list(rows))


@dataclass
class DailyData:
    start: datetime
    end: datetime
    total: int
    line: list[Article]
    competitors: list[Article]
    industry: list[Article]
    government: list[Article]
    negative: list[Article]  # negative coverage of LINE
    opportunities: list[Article]  # competitor setbacks + strongly positive LINE coverage
    actions: dict[str, list[Article]] = field(default_factory=dict)


async def daily_data(session: AsyncSession, start: datetime, end: datetime) -> DailyData:
    arts = await articles_between(session, start, end)
    by_cat = lambda c: [a for a in arts if a.category == c]  # noqa: E731
    line = by_cat(ArticleCategory.LINE)
    competitors = by_cat(ArticleCategory.COMPETITOR)
    actions = {
        "Prepare response": [a for a in arts if a.recommended_action == RecommendedAction.PREPARE_RESPONSE],
        "Share internally": [a for a in arts if a.recommended_action == RecommendedAction.SHARE_INTERNALLY],
        "Monitor": [
            a for a in arts if a.recommended_action == RecommendedAction.MONITOR and a.importance == Level.HIGH
        ],
    }
    return DailyData(
        start=start,
        end=end,
        total=len(arts),
        line=line,
        competitors=competitors,
        industry=by_cat(ArticleCategory.INDUSTRY),
        government=by_cat(ArticleCategory.GOVERNMENT),
        negative=[a for a in line if a.sentiment == Sentiment.NEGATIVE],
        opportunities=[a for a in competitors if a.sentiment == Sentiment.NEGATIVE]
        + [a for a in line if a.sentiment == Sentiment.POSITIVE and a.importance == Level.HIGH],
        actions={k: v for k, v in actions.items() if v},
    )


def _pct(part: int, whole: int) -> float:
    return round(100 * part / whole, 1) if whole else 0.0


def _sentiment_counts(arts: list[Article]) -> dict[str, int]:
    c = Counter(a.sentiment.value if a.sentiment else "UNANALYSED" for a in arts)
    return {s.value: c.get(s.value, 0) for s in Sentiment}


@dataclass
class MonthlyData:
    start: datetime
    end: datetime
    total: int
    by_category: dict[str, int]
    sentiment: dict[str, int]
    line_sentiment: dict[str, int]
    share_of_voice: list[dict]
    top_media: list[tuple[str, int]]
    top_topics: list[tuple[str, int]]
    competitor_table: list[dict]
    weekly: list[tuple[str, int, int]]  # (week label, total, negative)
    daily: list[tuple[str, int]]
    top_negative: list[Article]
    top_positive: list[Article]
    prev_total: int | None = None


def facts_for_narrative(d: MonthlyData) -> str:
    """Plain-text numbers + headlines handed to Gemini for trends/recommendations."""
    lines = [
        f"Period: {d.start:%Y-%m-%d} to {d.end:%Y-%m-%d}",
        f"Total coverage: {d.total}" + (f" (previous month: {d.prev_total})" if d.prev_total is not None else ""),
        f"By category: {d.by_category}",
        f"Sentiment (all): {d.sentiment}; LINE only: {d.line_sentiment}",
        "Share of voice: " + ", ".join(f"{r['company']} {r['share']}%" for r in d.share_of_voice),
        "Top media: " + ", ".join(f"{m} ({n})" for m, n in d.top_media[:5]),
        "Top topics: " + ", ".join(f"{t} ({n})" for t, n in d.top_topics[:8]),
        "Weekly volume (total/negative): " + ", ".join(f"{w}: {t}/{n}" for w, t, n in d.weekly),
        "Top negative headlines: " + " | ".join(a.headline for a in d.top_negative[:5]),
        "Top positive headlines: " + " | ".join(a.headline for a in d.top_positive[:5]),
    ]
    return "\n".join(lines)


async def monthly_data(session: AsyncSession, start: datetime, end: datetime, prev_start: datetime) -> MonthlyData:
    arts = await articles_between(session, start, end)
    prev_total = await session.scalar(
        select(func.count()).select_from(Article).where(
            Article.is_relevant.is_(True), EFFECTIVE_TIME >= prev_start, EFFECTIVE_TIME < start
        )
    )
    zone = ZoneInfo(get_settings().timezone)

    def local(a: Article) -> datetime:
        return (a.published_at or a.collected_at).astimezone(zone)

    line = [a for a in arts if a.category == ArticleCategory.LINE]
    voice = Counter(a.company for a in arts if a.category in (ArticleCategory.LINE, ArticleCategory.COMPETITOR) and a.company)
    voice_total = sum(voice.values())
    competitors = sorted({a.company for a in arts if a.category == ArticleCategory.COMPETITOR and a.company})
    table = []
    for company in ["LINE", *competitors]:
        subset = [a for a in arts if a.company == company]
        s = _sentiment_counts(subset)
        table.append({"company": company, "total": len(subset), "positive": s["POSITIVE"], "neutral": s["NEUTRAL"], "negative": s["NEGATIVE"], "share": _pct(len(subset), voice_total)})

    weekly: dict[str, list[int]] = {}
    for a in arts:
        d = local(a).date()
        label = f"Week {min((d.day - 1) // 7 + 1, 5)}"
        row = weekly.setdefault(label, [0, 0])
        row[0] += 1
        row[1] += a.sentiment == Sentiment.NEGATIVE
    daily = Counter(local(a).strftime("%Y-%m-%d") for a in arts)

    return MonthlyData(
        start=start,
        end=end,
        total=len(arts),
        by_category={c.value: sum(a.category == c for a in arts) for c in ArticleCategory},
        sentiment=_sentiment_counts(arts),
        line_sentiment=_sentiment_counts(line),
        share_of_voice=[{"company": c, "count": n, "share": _pct(n, voice_total)} for c, n in voice.most_common()],
        top_media=Counter(a.media_name for a in arts).most_common(10),
        top_topics=Counter(a.keyword_trigger for a in arts).most_common(10),
        competitor_table=table,
        weekly=[(k, v[0], v[1]) for k, v in sorted(weekly.items())],
        daily=sorted(daily.items()),
        top_negative=[a for a in line if a.sentiment == Sentiment.NEGATIVE][:8],
        top_positive=[a for a in line if a.sentiment == Sentiment.POSITIVE][:8],
        prev_total=prev_total,
    )

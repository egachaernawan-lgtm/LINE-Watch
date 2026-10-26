from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import get_session
from app.core.security import get_current_user
from app.models import Article, ArticleCategory, Sentiment
from app.schemas.article import CountItem, DayPoint, Overview

router = APIRouter(prefix="/stats", tags=["stats"], dependencies=[Depends(get_current_user)])

EFFECTIVE_TIME = func.coalesce(Article.published_at, Article.collected_at)


@router.get("/overview", response_model=Overview)
async def overview(days: int = Query(default=7, ge=1, le=365), session: AsyncSession = Depends(get_session)) -> Overview:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    base = [Article.is_relevant.is_(True), EFFECTIVE_TIME >= since]

    async def grouped(column, *extra, limit: int | None = None) -> list[CountItem]:
        stmt = (
            select(column, func.count().label("n"))
            .where(*base, *extra)
            .group_by(column)
            .order_by(func.count().desc())
        )
        if limit:
            stmt = stmt.limit(limit)
        return [
            CountItem(label=getattr(label, "value", label) or "Unknown", count=n)
            for label, n in (await session.execute(stmt)).all()
        ]

    local_day = func.date_trunc("day", func.timezone(get_settings().timezone, EFFECTIVE_TIME))
    day_rows = (
        await session.execute(
            select(
                local_day.label("d"),
                func.count(),
                func.count(case((Article.sentiment == Sentiment.NEGATIVE, 1))),
            )
            .where(*base)
            .group_by(local_day)
            .order_by(local_day)
        )
    ).all()

    return Overview(
        days=days,
        total=await session.scalar(select(func.count()).select_from(Article).where(*base)) or 0,
        by_category=await grouped(Article.category),
        by_sentiment=await grouped(Article.sentiment, Article.sentiment.is_not(None)),
        top_media=await grouped(Article.media_name, limit=10),
        share_of_voice=await grouped(
            Article.company,
            Article.category.in_([ArticleCategory.LINE, ArticleCategory.COMPETITOR]),
            Article.company.is_not(None),
        ),
        daily=[DayPoint(day=d.strftime("%Y-%m-%d"), total=t, negative=n) for d, t, n in day_rows],
        negative_recent=await session.scalar(
            select(func.count()).where(
                *base, Article.sentiment == Sentiment.NEGATIVE, Article.category == ArticleCategory.LINE
            )
        )
        or 0,
        last_collected_at=await session.scalar(select(func.max(Article.collected_at))),
    )

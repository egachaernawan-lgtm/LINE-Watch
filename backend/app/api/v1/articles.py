from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.models import Article, ArticleCategory, Level, Sentiment
from app.schemas.article import ArticleDetail, ArticlePage

router = APIRouter(prefix="/articles", tags=["articles"], dependencies=[Depends(get_current_user)])

EFFECTIVE_TIME = func.coalesce(Article.published_at, Article.collected_at)


@router.get("", response_model=ArticlePage)
async def list_articles(
    category: ArticleCategory | None = None,
    sentiment: Sentiment | None = None,
    importance: Level | None = None,
    media: str | None = None,
    company: str | None = None,
    q: str | None = Query(default=None, max_length=200),
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
) -> ArticlePage:
    conditions = [Article.is_relevant.is_(True)]
    if category:
        conditions.append(Article.category == category)
    if sentiment:
        conditions.append(Article.sentiment == sentiment)
    if importance:
        conditions.append(Article.importance == importance)
    if media:
        conditions.append(Article.media_name == media)
    if company:
        conditions.append(Article.company == company)
    if date_from:
        conditions.append(EFFECTIVE_TIME >= date_from)
    if date_to:
        conditions.append(EFFECTIVE_TIME < date_to)
    if q:
        escaped = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        conditions.append(
            or_(
                Article.search_vector.op("@@")(func.websearch_to_tsquery("simple", q)),
                Article.headline.ilike(f"%{escaped}%"),
            )
        )
    total = await session.scalar(select(func.count()).select_from(Article).where(*conditions))
    rows = await session.scalars(
        select(Article)
        .where(*conditions)
        .order_by(EFFECTIVE_TIME.desc(), Article.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    return ArticlePage(items=list(rows), total=total or 0, page=page, page_size=page_size)


@router.get("/media", response_model=list[str])
async def media_names(session: AsyncSession = Depends(get_session)) -> list[str]:
    rows = await session.scalars(select(Article.media_name).distinct().order_by(Article.media_name))
    return list(rows)


@router.get("/{article_id}", response_model=ArticleDetail)
async def get_article(article_id: int, session: AsyncSession = Depends(get_session)) -> Article:
    article = await session.get(Article, article_id)
    if article is None:
        raise HTTPException(404, "Article not found")
    return article

"""The topic library as the app shows it: groups -> topics -> keywords, with article counts."""

from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import ArticleCategory, Article, Keyword, Topic
from app.schemas.library import Library, LibraryGroup, LibraryKeyword, LibraryTopic
from app.services.reports.data import prominent_media

EFFECTIVE_TIME = func.coalesce(Article.published_at, Article.collected_at)
_ANYWHERE = {ArticleCategory.LINE, ArticleCategory.COMPETITOR}


async def build_library(session: AsyncSession) -> Library:
    since = datetime.now(timezone.utc) - timedelta(days=30)
    counts = {
        topic_id: (recent, total)
        for topic_id, recent, total in (
            await session.execute(
                select(
                    Article.topic_id,
                    func.count().filter(EFFECTIVE_TIME >= since),
                    func.count(),
                )
                .where(Article.is_relevant.is_(True), Article.topic_id.is_not(None))
                .group_by(Article.topic_id)
            )
        ).all()
    }
    keywords: dict[int, list[Keyword]] = {}
    for kw in await session.scalars(select(Keyword).where(Keyword.topic_id.is_not(None)).order_by(Keyword.term)):
        keywords.setdefault(kw.topic_id, []).append(kw)

    groups: dict[str, LibraryGroup] = {}
    for t in await session.scalars(select(Topic).where(Topic.is_active).order_by(Topic.sort_order, Topic.id)):
        recent, total = counts.get(t.id, (0, 0))
        group = groups.setdefault(t.group_name, LibraryGroup(name=t.group_name, description=t.group_description, topics=[]))
        group.topics.append(
            LibraryTopic(
                key=t.key,
                name=t.name,
                category=t.category,
                description=t.description,
                report_cap=t.report_cap,
                judged=t.judged,
                keywords=[
                    LibraryKeyword(
                        term=k.term,
                        aliases=k.aliases or [],
                        case_sensitive=k.case_sensitive,
                        scope=k.scope or ("anywhere" if k.category in _ANYWHERE else "lead"),
                        is_active=k.is_active,
                    )
                    for k in keywords.get(t.id, [])
                ],
                articles_30d=recent,
                articles_total=total,
            )
        )
    return Library(groups=list(groups.values()), prominent_media=list(prominent_media()))

from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    Computed,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import AnalysisStatus, ArticleCategory, Base, Level, RecommendedAction, Sentiment


def _enum(py_enum, name: str) -> Enum:
    return Enum(py_enum, name=name, values_callable=lambda e: [m.value for m in e])


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = (
        CheckConstraint("length(trim(url)) > 0", name="url_not_blank"),
        Index("ix_articles_published", text("published_at DESC")),
        Index("ix_articles_category", "category", text("published_at DESC")),
        Index("ix_articles_sentiment", "sentiment", text("published_at DESC")),
        Index("ix_articles_media", "media_name"),
        Index("ix_articles_title_fp", "title_fingerprint"),
        Index("ix_articles_search", "search_vector", postgresql_using="gin"),
        Index("ix_articles_pending", "analysis_status", postgresql_where=text("analysis_status <> 'DONE'")),
        Index("ix_articles_unsynced", "id", postgresql_where=text("sheet_synced_at IS NULL")),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    # ORIGINAL article URL: required, shown everywhere.
    url: Mapped[str] = mapped_column(Text)
    url_hash: Mapped[str] = mapped_column(String(64), unique=True)
    title_fingerprint: Mapped[str] = mapped_column(String(64))
    headline: Mapped[str] = mapped_column(Text)
    media_name: Mapped[str] = mapped_column(Text)
    source_id: Mapped[int | None] = mapped_column(ForeignKey("sources.id"))
    author: Mapped[str | None] = mapped_column(Text)
    body: Mapped[str | None] = mapped_column(Text)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    collected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    keyword_trigger: Mapped[str] = mapped_column(Text)
    category: Mapped[ArticleCategory] = mapped_column(_enum(ArticleCategory, "article_category"))
    company: Mapped[str | None] = mapped_column(Text)
    is_relevant: Mapped[bool] = mapped_column(server_default=text("true"))

    analysis_status: Mapped[AnalysisStatus] = mapped_column(
        _enum(AnalysisStatus, "analysis_status"), server_default=AnalysisStatus.PENDING.value
    )
    analysis_attempts: Mapped[int] = mapped_column(Integer, server_default=text("0"))
    summary: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    sentiment: Mapped[Sentiment | None] = mapped_column(_enum(Sentiment, "sentiment_t"))
    importance: Mapped[Level | None] = mapped_column(_enum(Level, "level_t"))
    business_impact: Mapped[Level | None] = mapped_column(_enum(Level, "level_t"))
    recommended_action: Mapped[RecommendedAction | None] = mapped_column(_enum(RecommendedAction, "action_t"))
    analyzed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sheet_synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    search_vector = mapped_column(
        TSVECTOR,
        Computed("to_tsvector('simple', coalesce(headline,'') || ' ' || coalesce(body,''))", persisted=True),
    )

    keyword_hits: Mapped[list["ArticleKeywordHit"]] = relationship(cascade="all, delete-orphan")


class ArticleKeywordHit(Base):
    __tablename__ = "article_keyword_hits"

    article_id: Mapped[int] = mapped_column(ForeignKey("articles.id", ondelete="CASCADE"), primary_key=True)
    keyword_id: Mapped[int] = mapped_column(ForeignKey("keywords.id"), primary_key=True)

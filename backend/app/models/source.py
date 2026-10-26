from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, Text, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import ArticleCategory, Base


class Source(Base):
    """A monitored feed: an RSS URL or a Google News RSS query."""

    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(primary_key=True)
    media_name: Mapped[str] = mapped_column(Text)
    kind: Mapped[str] = mapped_column(String(32))  # rss | google_news
    feed_url: Mapped[str] = mapped_column(Text, unique=True)
    media_type: Mapped[str | None] = mapped_column(String(32))
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    last_polled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_error: Mapped[str | None] = mapped_column(Text)


class Keyword(Base):
    __tablename__ = "keywords"

    id: Mapped[int] = mapped_column(primary_key=True)
    term: Mapped[str] = mapped_column(Text, unique=True)
    category: Mapped[ArticleCategory] = mapped_column(
        Enum(ArticleCategory, name="article_category", values_callable=lambda e: [m.value for m in e])
    )
    company: Mapped[str | None] = mapped_column(Text)
    # Extra spellings/translations, e.g. Indonesian terms. Matched case-insensitively.
    aliases: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    # Short ambiguous terms (e.g. "LINE") must match exactly as written.
    case_sensitive: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))

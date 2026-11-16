from sqlalchemy import Boolean, Enum, Integer, String, Text, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import ArticleCategory, Base


class Topic(Base):
    """One subtopic of the monitoring library, e.g. Service / LINE Bank or Competitor / WhatsApp."""

    __tablename__ = "topics"
    __table_args__ = (UniqueConstraint("group_name", "name", name="uq_topics_group_name"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    group_name: Mapped[str] = mapped_column(String(32))  # Business | Tech | Service | Leadership | Competitor | Industry
    name: Mapped[str] = mapped_column(Text)
    category: Mapped[ArticleCategory] = mapped_column(
        Enum(ArticleCategory, name="article_category", values_callable=lambda e: [m.value for m in e])
    )
    description: Mapped[str | None] = mapped_column(Text)
    group_description: Mapped[str | None] = mapped_column(Text)
    # Max articles shown per day in the report for this topic (external topics only; NULL = no cap)
    report_cap: Mapped[int | None] = mapped_column(Integer)
    # No search term can find this topic (Earnings, HR...): Gemini picks it while analysing
    judged: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    sort_order: Mapped[int] = mapped_column(Integer, server_default=text("0"))

    @property
    def key(self) -> str:
        return f"{self.group_name}/{self.name}"

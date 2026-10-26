from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import ArticleCategory, Level, RecommendedAction, Sentiment


class ArticleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    headline: str
    media_name: str
    author: str | None
    published_at: datetime | None
    collected_at: datetime
    url: str  # original article URL, always present
    keyword_trigger: str
    category: ArticleCategory
    company: str | None
    sentiment: Sentiment | None
    importance: Level | None
    business_impact: Level | None
    recommended_action: RecommendedAction | None
    summary: list[str] | None
    analysis_status: str


class ArticleDetail(ArticleOut):
    body: str | None


class ArticlePage(BaseModel):
    items: list[ArticleOut]
    total: int
    page: int
    page_size: int


class CountItem(BaseModel):
    label: str
    count: int


class DayPoint(BaseModel):
    day: str
    total: int
    negative: int


class Overview(BaseModel):
    days: int
    total: int
    by_category: list[CountItem]
    by_sentiment: list[CountItem]
    top_media: list[CountItem]
    share_of_voice: list[CountItem]
    daily: list[DayPoint]
    negative_recent: int
    last_collected_at: datetime | None


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    kind: str
    period_start: datetime
    period_end: datetime
    gdoc_url: str | None
    pdf_url: str | None
    emailed_at: datetime | None
    created_at: datetime


class KeywordIn(BaseModel):
    term: str
    category: ArticleCategory
    company: str | None = None
    aliases: list[str] = []
    case_sensitive: bool = False
    is_active: bool = True


class KeywordOut(KeywordIn):
    model_config = ConfigDict(from_attributes=True)
    id: int


class SourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    media_name: str
    kind: str
    feed_url: str
    media_type: str | None
    is_active: bool
    last_polled_at: datetime | None
    last_error: str | None

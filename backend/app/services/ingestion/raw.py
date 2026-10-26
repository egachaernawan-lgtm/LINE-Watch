from dataclasses import dataclass
from datetime import datetime


@dataclass
class RawItem:
    url: str  # real article URL, or a Google News redirect link until decoded
    title: str
    media_name: str
    source_id: int | None = None
    published_at: datetime | None = None
    summary: str = ""
    content: str = ""  # full text if the feed already carries it
    author: str | None = None
    is_google_news: bool = False

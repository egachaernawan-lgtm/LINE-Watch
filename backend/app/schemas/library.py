from pydantic import BaseModel

from app.models import ArticleCategory


class LibraryKeyword(BaseModel):
    term: str
    aliases: list[str]
    case_sensitive: bool
    scope: str  # "anywhere" | "lead"
    is_active: bool


class LibraryTopic(BaseModel):
    key: str  # "<group>/<name>", also the value of the feed's `topic` filter
    name: str
    category: ArticleCategory
    description: str | None
    report_cap: int | None
    judged: bool  # no search term finds it: Gemini picks it while analysing
    keywords: list[LibraryKeyword]
    articles_30d: int
    articles_total: int


class LibraryGroup(BaseModel):
    name: str
    description: str | None
    topics: list[LibraryTopic]


class Library(BaseModel):
    groups: list[LibraryGroup]
    prominent_media: list[str]

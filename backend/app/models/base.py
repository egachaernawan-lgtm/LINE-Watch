import enum

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class ArticleCategory(str, enum.Enum):
    LINE = "LINE"
    COMPETITOR = "COMPETITOR"
    INDUSTRY = "INDUSTRY"
    GOVERNMENT = "GOVERNMENT"


class Sentiment(str, enum.Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"


class Level(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RecommendedAction(str, enum.Enum):
    MONITOR = "MONITOR"
    SHARE_INTERNALLY = "SHARE_INTERNALLY"
    PREPARE_RESPONSE = "PREPARE_RESPONSE"
    NO_ACTION_REQUIRED = "NO_ACTION_REQUIRED"


class AnalysisStatus(str, enum.Enum):
    PENDING = "PENDING"
    DONE = "DONE"
    FAILED = "FAILED"

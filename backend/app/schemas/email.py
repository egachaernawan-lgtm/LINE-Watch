import re
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

EMAIL_RE = re.compile(r"^[^@\s,;<>]+@[^@\s,;<>]+\.[^@\s,;<>]+$")
MAX_RECIPIENTS = 500


def clean_emails(values: list[str]) -> list[str]:
    """Lower-case, strip, drop duplicates (order kept), reject anything that is not an address."""
    seen: dict[str, None] = {}
    for raw in values:
        email = raw.strip().lower()
        if not email:
            continue
        if not EMAIL_RE.match(email):
            raise ValueError(f"Not a valid email address: {raw.strip()[:80]}")
        seen.setdefault(email)
    return list(seen)


class GroupIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None
    emails: list[str] = []

    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        return v.strip()

    @field_validator("emails")
    @classmethod
    def _emails(cls, v: list[str]) -> list[str]:
        return clean_emails(v)


class GroupOut(BaseModel):
    id: int
    name: str
    description: str | None
    emails: list[str]


class DailyPreview(BaseModel):
    date: date
    label: str
    subject: str
    html: str
    counts: dict[str, int]
    translated_all: bool


class SendIn(BaseModel):
    on: date | None = None
    group_ids: list[int] = []
    emails: list[str] = []
    test: bool = False  # only send to the person pressing the button

    @field_validator("emails")
    @classmethod
    def _emails(cls, v: list[str]) -> list[str]:
        return clean_emails(v)


class SendOut(BaseModel):
    status: str
    recipients: int
    subject: str


class SendLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_date: date
    subject: str
    recipient_count: int
    groups: list | None
    sent_by: str
    status: str
    error: str | None
    sent_at: datetime

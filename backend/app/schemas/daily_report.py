from datetime import date

from pydantic import BaseModel


class ReportRow(BaseModel):
    region: str
    category: str
    media: str
    headline: str
    url: str
    summary: str | None = None


class ReportSection(BaseModel):
    title: str
    rows: list[ReportRow]


class DailyPreview(BaseModel):
    date: date
    label: str
    subject: str
    html: str  # the finished report as a standalone HTML document (also the .html download)
    sections: list[ReportSection]  # the same content as plain rows, for the CSV / Excel / PDF downloads
    ending: str
    counts: dict[str, int]
    translated_all: bool

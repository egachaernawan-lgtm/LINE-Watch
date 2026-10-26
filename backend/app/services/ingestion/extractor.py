import asyncio
from dataclasses import dataclass
from datetime import datetime, timezone

import httpx
import trafilatura
from dateutil import parser as dateparser


@dataclass
class Extracted:
    text: str
    author: str | None
    published_at: datetime | None


def _extract(html: str, url: str) -> Extracted:
    doc = trafilatura.bare_extraction(html, url=url, include_comments=False, include_tables=False)
    if doc is None:
        return Extracted("", None, None)
    published = None
    if getattr(doc, "date", None):
        try:
            published = dateparser.parse(doc.date)
            if published.tzinfo is None:
                published = published.replace(tzinfo=timezone.utc)
        except (ValueError, OverflowError):
            published = None
    return Extracted((doc.text or "").strip(), getattr(doc, "author", None) or None, published)


async def fetch_article(client: httpx.AsyncClient, url: str) -> Extracted:
    resp = await client.get(url, follow_redirects=True)
    resp.raise_for_status()
    return await asyncio.to_thread(_extract, resp.text, str(resp.url))

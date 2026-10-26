import asyncio
from calendar import timegm
from datetime import datetime, timezone

import feedparser
import httpx

from app.core.config import get_settings
from app.services.ingestion.raw import RawItem


def entry_datetime(entry) -> datetime | None:
    parsed = entry.get("published_parsed") or entry.get("updated_parsed")
    if not parsed:
        return None
    return datetime.fromtimestamp(timegm(parsed), tz=timezone.utc)


def entry_content(entry) -> str:
    blocks = entry.get("content") or []
    return " ".join(b.get("value", "") for b in blocks)


async def fetch_feed_text(client: httpx.AsyncClient, url: str) -> str:
    resp = await client.get(url, follow_redirects=True)
    resp.raise_for_status()
    return resp.text


async def fetch_rss(client: httpx.AsyncClient, source) -> list[RawItem]:
    settings = get_settings()
    text = await fetch_feed_text(client, source.feed_url)
    feed = await asyncio.to_thread(feedparser.parse, text)
    if feed.bozo and not feed.entries:
        raise ValueError(f"unparseable feed: {feed.bozo_exception}")
    items = []
    for entry in feed.entries[: settings.max_items_per_source]:
        link, title = entry.get("link"), (entry.get("title") or "").strip()
        if not link or not title:
            continue
        items.append(
            RawItem(
                url=link,
                title=title,
                media_name=source.media_name,
                source_id=source.id,
                published_at=entry_datetime(entry),
                summary=entry.get("summary", ""),
                content=entry_content(entry),
                author=entry.get("author"),
            )
        )
    return items

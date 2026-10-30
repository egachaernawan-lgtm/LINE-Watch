"""Google News RSS search -> items whose links are decoded to the original publisher URL.

Google News feeds only expose redirect links (news.google.com/rss/articles/...). The original
URL is mandatory for LINE WATCH, so items that cannot be decoded are dropped, never shown with
a Google redirect link.
"""

import asyncio
import re
from urllib.parse import quote_plus, urlsplit

import feedparser
import httpx
from googlenewsdecoder import gnewsdecoder

from app.core.config import get_settings
from app.services.ingestion.fetchers.rss import entry_datetime, fetch_feed_text
from app.services.ingestion.raw import RawItem

BASE = "https://news.google.com/rss/search?q={q}&hl=id&gl=ID&ceid=ID:id"
CORE_TERMS = (
    '"LINE Indonesia" OR "LINE Pay" OR "LINE MAN" OR "LY Corporation" OR WhatsApp OR Telegram '
    'OR WeChat OR KakaoTalk OR "aplikasi pesan" OR "media sosial" OR "keamanan siber" OR "UU PDP"'
)


def build_query(media_type: str | None, site: str | None, query: str | None) -> str:
    if query:
        q = query
    elif site and media_type == "government":
        q = f"site:{site}"
    else:
        q = f"site:{site} ({CORE_TERMS})"
    return f"{q} when:1d"


def google_news_url(query: str) -> str:
    return BASE.format(q=quote_plus(query))


def with_window(url: str, window: str) -> str:
    """Swap the `when:` time window baked into a stored feed URL (e.g. 1d -> 30d for a backfill)."""
    return re.sub(r"when%3A\d+[hdm]", f"when%3A{window}", url)


def is_google_link(url: str) -> bool:
    return urlsplit(url).netloc.endswith("news.google.com")


async def fetch_google_news(client: httpx.AsyncClient, source) -> list[RawItem]:
    settings = get_settings()
    text = await fetch_feed_text(client, with_window(source.feed_url, settings.google_news_window))
    feed = await asyncio.to_thread(feedparser.parse, text)
    items = []
    for entry in feed.entries[: settings.max_items_per_source]:
        link, title = entry.get("link"), (entry.get("title") or "").strip()
        if not link or not title:
            continue
        publisher = (entry.get("source") or {}).get("title") or source.media_name
        items.append(
            RawItem(
                url=link,
                title=title,
                media_name=publisher,
                source_id=source.id,
                published_at=entry_datetime(entry),
                summary=entry.get("summary", ""),
                is_google_news=True,
            )
        )
    return items


async def decode_link(link: str) -> str | None:
    """Resolve a Google News redirect link to the publisher URL (None if it cannot be resolved)."""
    try:
        result = await asyncio.to_thread(gnewsdecoder, link, 1)
    except Exception:
        return None
    url = result.get("decoded_url") if result.get("status") or result.get("success") else None
    return url if url and not is_google_link(url) else None

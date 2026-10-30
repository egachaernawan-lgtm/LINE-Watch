import re

from app.seed.loader import keyword_rows, source_rows
from app.services.ingestion.fetchers.google_news import build_query, google_news_url
from app.services.sheets import HEADERS


def test_seed_keywords_cover_the_brief():
    terms = {k["term"] for k in keyword_rows()}
    for required in ["LINE Indonesia", "LINE TODAY", "LY Corporation", "WhatsApp", "KakaoTalk", "Komdigi", "OJK", "KPPU", "PDP Law"]:
        assert required in terms
    assert {k["category"].value for k in keyword_rows()} == {"LINE", "COMPETITOR", "INDUSTRY", "GOVERNMENT"}


def test_seed_sources_are_unique_https_urls():
    urls = [s["feed_url"] for s in source_rows()]
    assert len(urls) == len(set(urls))
    assert all(u.startswith("https://") for u in urls)


def test_google_news_queries_are_recent_and_site_scoped():
    q = build_query("government", "ojk.go.id", None)
    assert q == "site:ojk.go.id when:1d"
    assert "site:kompas.com" in build_query("national", "kompas.com", None)
    assert re.search(r"q=site%3Aojk.go.id", google_news_url(q))


def test_sheet_columns_match_the_brief():
    assert HEADERS == [
        "Date Published", "Date Collected", "Headline", "Media", "Author", "URL", "Keyword",
        "Category", "Company", "Sentiment", "Importance", "Summary", "Recommended Action",
    ]


def test_with_window_widens_google_news_query():
    from app.services.ingestion.fetchers.google_news import build_query, google_news_url, with_window

    url = google_news_url(build_query("government", "ojk.go.id", None))
    assert "when%3A1d" in url
    assert "when%3A30d" in with_window(url, "30d") and "when%3A1d" not in with_window(url, "30d")

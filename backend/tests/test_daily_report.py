from datetime import date
from types import SimpleNamespace

from app.models import ArticleCategory as C
from app.services.reports.daily_report import ENDING, build_rows, render_report, sub_category


def art(category, trigger, *, company=None, media="CNBC Indonesia", dup=0, en=None, summary_en=None, n=1):
    return SimpleNamespace(
        category=category, keyword_trigger=trigger, company=company, media_name=media, duplicate_count=dup,
        headline=f"Judul {n}", headline_en=en, url=f"https://example.com/{n}", summary=["a", "b"], summary_en=summary_en,
    )


def test_category_column_uses_product_company_or_topic():
    assert sub_category(art(C.LINE, "LINE")) == "General"
    assert sub_category(art(C.LINE, "LINE Stickers")) == "LINE Stickers"
    assert sub_category(art(C.COMPETITOR, "Meta AI", company="Meta")) == "Meta"
    assert sub_category(art(C.INDUSTRY, "Artificial Intelligence")) == "AI"


def test_rows_group_by_category_blank_repeats_and_show_duplicates():
    rows = build_rows(
        [art(C.COMPETITOR, "x", company="Meta", n=1), art(C.COMPETITOR, "x", company="Google", n=2),
         art(C.COMPETITOR, "x", company="Meta", dup=4, n=3)],
        with_summary=False,
    )
    assert [r.category for r in rows] == ["Meta", "Meta", "Google"]
    assert [r.show_category for r in rows] == [True, False, True]
    assert [r.show_region for r in rows] == [True, False, False]
    assert rows[1].media == "CNBC Indonesia (+4)" and rows[0].summary is None


def test_report_has_greeting_ending_links_and_english_text():
    html, _, counts = render_report(
        date(2026, 11, 2), "2 November 2026",
        [art(C.LINE, "LINE Stickers", en="LINE launches stickers", summary_en="LINE added new stickers.")],
    )
    assert "Dear all," in html
    assert "Please find below the Global Daily Monitoring report for 2 November 2026." in html
    assert 'href="https://example.com/1"' in html and "LINE launches stickers" in html
    assert "LINE added new stickers." in html  # LINE section shows the summary row
    assert "No relevant coverage in the last 24 hours." in html  # empty sections say so
    assert ENDING in html
    assert counts == {"LINE": 1, "COMPETITOR": 0, "INDUSTRY": 0, "GOVERNMENT": 0}


def test_report_escapes_html_in_headlines():
    html, _, _ = render_report(date(2026, 11, 2), "d", [art(C.INDUSTRY, "AI", en="<script>alert(1)</script>")])
    assert "<script>alert(1)</script>" not in html


def test_plain_rows_for_downloads_repeat_every_cell():
    _, sections, _ = render_report(
        date(2026, 11, 2), "d",
        [art(C.COMPETITOR, "x", company="Meta", n=1), art(C.COMPETITOR, "x", company="Meta", dup=2, n=2)],
    )
    assert [s["title"] for s in sections] == ["LINE", "Competitor", "Industry", "Government & policy"]
    rows = sections[1]["rows"]
    assert [r["category"] for r in rows] == ["Meta", "Meta"]  # not blanked like the HTML table
    assert [r["region"] for r in rows] == ["ID", "ID"]
    assert rows[1]["media"] == "CNBC Indonesia (+2)" and rows[0]["url"] == "https://example.com/1"
    assert sections[0]["rows"] == []

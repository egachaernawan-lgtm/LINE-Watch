from types import SimpleNamespace

from app.models import ArticleCategory as C
from app.services.ingestion.classifier import build_rules, classify


def kw(id, term, category, company=None, aliases=None, case_sensitive=False):
    return SimpleNamespace(id=id, term=term, category=category, company=company, aliases=aliases or [], case_sensitive=case_sensitive)


RULES = build_rules(
    [
        kw(1, "LINE", C.LINE, "LINE", case_sensitive=True),
        kw(2, "LINE Pay", C.LINE, "LINE"),
        kw(3, "WhatsApp", C.COMPETITOR, "WhatsApp"),
        kw(4, "Privacy", C.INDUSTRY, aliases=["privasi"]),
        kw(5, "OJK", C.GOVERNMENT, aliases=["Otoritas Jasa Keuangan"], case_sensitive=True),
    ]
)


def test_ordinary_word_line_is_not_a_match():
    assert classify(RULES, "Antrean panjang di line produksi", "The assembly line stopped.") is None


def test_line_brand_matches_and_prefers_longer_term():
    m = classify(RULES, "LINE Pay luncurkan fitur baru", "")
    assert m.category == C.LINE and m.trigger == "LINE Pay" and m.company == "LINE"


def test_line_beats_competitor_when_both_present():
    m = classify(RULES, "LINE dan WhatsApp saling bersaing", "")
    assert m.category == C.LINE
    assert set(m.keyword_ids) == {1, 3}


def test_competitor_mention_deep_in_body_counts():
    assert classify(RULES, "Aplikasi baru", "x" * 2000 + " WhatsApp ").category == C.COMPETITOR


def test_industry_term_deep_in_body_is_ignored_but_lead_counts():
    assert classify(RULES, "Berita lain", "y" * 2000 + " privasi ") is None
    assert classify(RULES, "Berita lain", "Isu privasi data menguat.").category == C.INDUSTRY


def test_government_case_sensitive_abbreviation_and_alias():
    assert classify(RULES, "Kata ojk kecil", "") is None
    assert classify(RULES, "OJK keluarkan aturan", "").category == C.GOVERNMENT
    assert classify(RULES, "Otoritas Jasa Keuangan umumkan", "").category == C.GOVERNMENT

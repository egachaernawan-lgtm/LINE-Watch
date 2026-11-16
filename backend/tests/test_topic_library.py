from types import SimpleNamespace

import yaml

from app.models import ArticleCategory as C
from app.seed.loader import SEED_DIR, keyword_rows, topic_rows
from app.services.ingestion.classifier import build_rules, classify
from app.services.ingestion.region import is_indonesian_url
from app.services.reports.data import cap_per_topic, is_prominent


def kw(id, term, category, scope=None, topic_id=None, aliases=None, case_sensitive=False):
    return SimpleNamespace(
        id=id, term=term, category=category, company=None, aliases=aliases or [],
        case_sensitive=case_sensitive, scope=scope, topic_id=topic_id,
    )


def test_every_keyword_points_at_a_topic_and_topics_are_unique():
    topics = topic_rows()
    keys = [f"{t['group_name']}/{t['name']}" for t in topics]
    assert len(keys) == len(set(keys))
    ids = {k: i for i, k in enumerate(keys, start=1)}
    rows = keyword_rows(ids)  # raises if a keyword names an unknown topic
    assert len({r["term"] for r in rows}) == len(rows)
    assert all(r["topic_id"] for r in rows)


def test_requested_priority_services_are_in_the_library():
    terms = {r["term"].lower() for r in keyword_rows()}
    aliases = {a.lower() for k in yaml.safe_load((SEED_DIR / "keywords.yaml").read_text()) for a in k.get("aliases", [])}
    seen = terms | aliases
    for needed in ["line bank by hana bank", "line webtoon", "webtoon", "line games", "let's get rich", "line rangers", "line music"]:
        assert needed in seen, needed


def test_passing_mention_of_a_line_service_is_collected():
    rules = build_rules([kw(1, "LINE MUSIC", C.LINE, topic_id=7)])
    body = "Voting global top 10 dibuka. " + "x" * 3000 + " Fans bisa memilih lewat LINE MUSIC."
    m = classify(rules, "Voting MMA 2026 resmi dibuka", body)
    assert m is not None and m.topic_id == 7


def test_lead_scope_ignores_deep_mentions_of_broad_competitors():
    rules = build_rules([kw(1, "Google", C.COMPETITOR, scope="lead", case_sensitive=True)])
    assert classify(rules, "Harga ponsel baru", "x" * 2000 + " Google ") is None
    assert classify(rules, "Google rilis fitur baru", "") is not None


def test_match_carries_the_topic_of_the_best_keyword():
    rules = build_rules([kw(1, "LINE", C.LINE, topic_id=1, case_sensitive=True), kw(2, "LINE Bank", C.LINE, topic_id=2)])
    assert classify(rules, "LINE Bank by Hana Bank tambah fitur", "").topic_id == 2


def art(id, topic_id, media, minutes=0):
    return SimpleNamespace(id=id, topic_id=topic_id, media_name=media)


def test_cap_keeps_prominent_media_first_and_leaves_uncapped_topics_alone():
    topics = {1: SimpleNamespace(report_cap=2), 2: SimpleNamespace(report_cap=None)}
    arts = [art(1, 1, "blog kecil"), art(2, 1, "Kompas.com"), art(3, 1, "situs lain"), art(4, 1, "CNBC Indonesia"),
            art(5, 2, "blog kecil"), art(6, 2, "blog kecil"), art(7, 2, "blog kecil"), art(8, None, "x")]
    kept = {a.id for a in cap_per_topic(arts, topics)}
    assert kept == {2, 4, 5, 6, 7, 8}


def test_is_prominent_matches_by_name():
    assert is_prominent("Kompas.com") and is_prominent("detikinet") and is_prominent("CNBC Indonesia")
    assert not is_prominent("blog kecil")


def test_indonesian_media_only():
    assert is_indonesian_url("https://www.kompas.com/a") and is_indonesian_url("https://tempo.co/a")
    assert is_indonesian_url("https://herald.id/a") and is_indonesian_url("https://lombokpost.jawapos.com/a")
    assert not is_indonesian_url("https://www.vietnam.vn/id/x") and not is_indonesian_url("https://site.it/id/x")
    assert not is_indonesian_url("https://pasqualepillitteri.it/id/news/1")

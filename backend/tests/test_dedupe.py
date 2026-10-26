from app.services.ingestion.dedupe import canonical_url, title_fingerprint, url_hash


def test_canonical_url_strips_tracking_and_www():
    a = "https://www.Kompas.com/tekno/read/2026/10/20/abc/?utm_source=x&fbclid=1#top"
    b = "https://kompas.com/tekno/read/2026/10/20/abc"
    assert canonical_url(a) == b
    assert url_hash(a) == url_hash(b)


def test_canonical_url_drops_page_all_but_keeps_real_params():
    assert canonical_url("https://x.com/a?page=all") == "https://x.com/a"
    assert canonical_url("https://x.com/a?id=5&page=2") == "https://x.com/a?id=5&page=2"


def test_title_fingerprint_ignores_case_punctuation_and_media_suffix():
    assert title_fingerprint("WhatsApp Tambah Fitur Baru! - Kompas.com") == title_fingerprint("whatsapp tambah fitur baru")

import time

from google.genai import errors

from app.core.config import get_settings
from app.services.ai.gemini import RateLimiter, _is_transient


def _api_error(code: int) -> errors.APIError:
    exc = errors.APIError.__new__(errors.APIError)  # skip the SDK's response-parsing constructor
    exc.code = code
    return exc


def test_quota_auth_and_bad_model_errors_are_not_retried():
    assert not _is_transient(_api_error(429))
    assert not _is_transient(_api_error(404))
    assert not _is_transient(_api_error(403))


def test_server_errors_and_bad_output_are_retried():
    assert _is_transient(_api_error(503))
    assert _is_transient(ValueError("no json"))


async def test_rate_limiter_spaces_requests(monkeypatch):
    monkeypatch.setattr(get_settings(), "gemini_requests_per_minute", 600)  # 0.1 s apart
    limiter = RateLimiter()
    start = time.monotonic()
    for _ in range(4):
        await limiter.wait()
    assert time.monotonic() - start >= 0.28


def test_exhausted_model_is_skipped_and_fallback_used(monkeypatch):
    from app.services.ai import gemini

    settings = get_settings()
    monkeypatch.setattr(settings, "gemini_model", "primary")
    monkeypatch.setattr(settings, "gemini_fallback_models", ["backup"])
    monkeypatch.setattr(gemini, "_exhausted", {})
    assert gemini._candidate_models() == ["primary", "backup"]
    gemini._exhausted["primary"] = time.monotonic()
    assert gemini._candidate_models() == ["backup"]
    gemini._exhausted["backup"] = time.monotonic()
    assert gemini._candidate_models() == []


async def test_batch_maps_results_by_id_and_ignores_unknown_ids(monkeypatch):
    from app.services.ai import gemini

    def item(i: int) -> gemini.ItemAnalysis:
        return gemini.ItemAnalysis(
            id=i, is_relevant=True, summary=[" a ", "", "b", "c", "d"][:3], sentiment="NEUTRAL",
            importance="LOW", business_impact="LOW", recommended_action="MONITOR",
        )

    async def fake_generate(system, prompt, schema):
        assert "id=1" in prompt and "id=2" in prompt
        return gemini.BatchAnalysis(results=[item(2), item(99)])  # article 1 skipped, 99 unknown

    monkeypatch.setattr(gemini, "_generate", fake_generate)
    items = [{"id": i, "headline": "h", "media": "m", "category": "LINE", "keyword": "LINE", "body": "b"} for i in (1, 2)]
    results = await gemini.analyze_batch(items)
    assert list(results) == [2]
    assert results[2].summary == ["a", "b"]

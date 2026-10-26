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

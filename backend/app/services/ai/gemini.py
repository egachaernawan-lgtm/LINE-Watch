import asyncio
import time

from google import genai
from google.genai import errors, types
from pydantic import BaseModel, Field
from tenacity import retry, retry_if_exception, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.core.logging import get_logger
from app.models import Level, RecommendedAction, Sentiment
from app.services.ai.prompts import ANALYSIS_SYSTEM, REPORT_NARRATIVE_SYSTEM, batch_prompt

log = get_logger()


class QuotaExceeded(Exception):
    """Gemini rate limit / quota hit. Not the article's fault: do not count it as a failed attempt."""


class Analysis(BaseModel):
    is_relevant: bool
    summary: list[str] = Field(max_length=3)
    sentiment: Sentiment
    importance: Level
    business_impact: Level
    recommended_action: RecommendedAction


class ItemAnalysis(Analysis):
    id: int  # echoes the id of the article in the request


class BatchAnalysis(BaseModel):
    results: list[ItemAnalysis]


class MonthlyNarrative(BaseModel):
    key_trends: list[str] = Field(max_length=5)
    recommendations: list[str] = Field(max_length=5)


class RateLimiter:
    """Spaces requests evenly so we stay under GEMINI_REQUESTS_PER_MINUTE."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._next = 0.0

    async def wait(self) -> None:
        interval = 60.0 / max(1, get_settings().gemini_requests_per_minute)
        async with self._lock:
            now = time.monotonic()
            delay = max(0.0, self._next - now)
            self._next = max(now, self._next) + interval
        if delay:
            await asyncio.sleep(delay)


limiter = RateLimiter()

_EXHAUSTED_SECONDS = 3600
_exhausted: dict[str, float] = {}  # model -> monotonic time its quota ran out


def _candidate_models() -> list[str]:
    """Primary model first, then the fallbacks. Each model has its own free-tier quota, so a model
    that just ran out is skipped for an hour instead of burning more rejected requests."""
    settings = get_settings()
    now = time.monotonic()
    models = [settings.gemini_model, *settings.gemini_fallback_models]
    return [m for m in models if now - _exhausted.get(m, -_EXHAUSTED_SECONDS) >= _EXHAUSTED_SECONDS]


def _client() -> genai.Client:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")
    return genai.Client(api_key=settings.gemini_api_key)


def _is_transient(exc: BaseException) -> bool:
    """Retry server-side hiccups and unparsable output; never retry quota, auth or bad-model errors."""
    if isinstance(exc, errors.APIError):
        return exc.code is not None and exc.code >= 500
    return isinstance(exc, ValueError)


@retry(retry=retry_if_exception(_is_transient), stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, max=20), reraise=True)
async def _generate(system: str, prompt: str, schema: type[BaseModel]):
    for model in _candidate_models():
        await limiter.wait()
        try:
            resp = await _client().aio.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    response_mime_type="application/json",
                    response_schema=schema,
                    temperature=0.2,
                    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),  # no tools; silences the "AFC is enabled" log
                ),
            )
        except errors.APIError as exc:
            if exc.code == 429:
                _exhausted[model] = time.monotonic()
                log.warning("gemini_model_quota_exhausted", model=model)
                continue  # try the next configured model
            raise
        if resp.parsed is None:
            raise ValueError("Gemini returned no parsable JSON")
        return resp.parsed
    raise QuotaExceeded("every configured Gemini model is out of quota")


async def analyze_batch(items: list[dict]) -> dict[int, ItemAnalysis]:
    """Analyse several articles in one request: the free tier allows only ~20 requests a day.

    `items` are dicts with id, headline, media, category, keyword, body. Articles the model skipped
    are simply absent from the result.
    """
    wanted = {i["id"] for i in items}
    out: BatchAnalysis = await _generate(ANALYSIS_SYSTEM, batch_prompt(items), BatchAnalysis)
    results: dict[int, ItemAnalysis] = {}
    for r in out.results:
        if r.id in wanted:
            r.summary = [s.strip() for s in r.summary if s.strip()][:3]
            results[r.id] = r
    return results


async def monthly_narrative(facts: str) -> MonthlyNarrative:
    return await _generate(REPORT_NARRATIVE_SYSTEM, facts, MonthlyNarrative)

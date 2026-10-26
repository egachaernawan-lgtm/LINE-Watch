import asyncio
import time

from google import genai
from google.genai import errors, types
from pydantic import BaseModel, Field
from tenacity import retry, retry_if_exception, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.core.logging import get_logger
from app.models import Level, RecommendedAction, Sentiment
from app.services.ai.prompts import ANALYSIS_SYSTEM, REPORT_NARRATIVE_SYSTEM, analysis_prompt

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
    settings = get_settings()
    await limiter.wait()
    try:
        resp = await _client().aio.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system,
                response_mime_type="application/json",
                response_schema=schema,
                temperature=0.2,
            ),
        )
    except errors.APIError as exc:
        if exc.code == 429:
            raise QuotaExceeded(str(exc)[:200]) from exc
        raise
    if resp.parsed is None:
        raise ValueError("Gemini returned no parsable JSON")
    return resp.parsed


async def analyze_article(*, headline: str, media: str, category: str, keyword: str, body: str) -> Analysis:
    prompt = analysis_prompt(headline=headline, media=media, category=category, keyword=keyword, body=body)
    result: Analysis = await _generate(ANALYSIS_SYSTEM, prompt, Analysis)
    result.summary = [s.strip() for s in result.summary if s.strip()][:3]
    return result


async def monthly_narrative(facts: str) -> MonthlyNarrative:
    return await _generate(REPORT_NARRATIVE_SYSTEM, facts, MonthlyNarrative)

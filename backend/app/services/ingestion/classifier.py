"""Keyword matching -> category, company, trigger.

LINE and competitor mentions count anywhere in the article, so a passing mention of a LINE service
(for example LINE MUSIC inside a K-pop story) is still collected. Broad industry/government terms
("privacy", "OJK", "fintech") only count when they appear in the headline or the lead
paragraph, otherwise every passing mention would flood the feed. A keyword's own `scope`
("lead" or "anywhere") overrides that default, e.g. Google and Meta are lead-only.
"""

import re
from dataclasses import dataclass

from app.models import ArticleCategory

LEAD_CHARS = 600
CATEGORY_PRIORITY = [
    ArticleCategory.LINE,
    ArticleCategory.COMPETITOR,
    ArticleCategory.GOVERNMENT,
    ArticleCategory.INDUSTRY,
]
ANYWHERE = {ArticleCategory.LINE, ArticleCategory.COMPETITOR}


@dataclass
class KeywordRule:
    id: int
    term: str
    category: ArticleCategory
    company: str | None
    patterns: list[re.Pattern]
    anywhere: bool
    topic_id: int | None = None


@dataclass
class Match:
    category: ArticleCategory
    company: str | None
    trigger: str
    keyword_ids: list[int]
    topic_id: int | None = None


def _compile(text: str, case_sensitive: bool) -> re.Pattern:
    flags = 0 if case_sensitive else re.IGNORECASE
    return re.compile(rf"(?<![A-Za-z0-9]){re.escape(text)}(?![A-Za-z0-9])", flags)


def build_rules(keywords) -> list[KeywordRule]:
    rules = []
    for kw in keywords:
        patterns = [_compile(kw.term, kw.case_sensitive)]
        patterns += [_compile(a, False) for a in (kw.aliases or [])]
        scope = getattr(kw, "scope", None)
        anywhere = scope == "anywhere" if scope else kw.category in ANYWHERE
        rules.append(KeywordRule(kw.id, kw.term, kw.category, kw.company, patterns, anywhere, getattr(kw, "topic_id", None)))
    return rules


def classify(rules: list[KeywordRule], title: str, body: str) -> Match | None:
    lead = f"{title}\n{body[:LEAD_CHARS]}"
    full = f"{title}\n{body}"
    hits: list[KeywordRule] = []
    for rule in rules:
        haystack = full if rule.anywhere else lead
        if any(p.search(haystack) for p in rule.patterns):
            hits.append(rule)
    if not hits:
        return None

    def rank(rule: KeywordRule) -> tuple[int, int, int]:
        in_title = any(p.search(title) for p in rule.patterns)
        # longer terms first so "LINE Pay" wins over bare "LINE"
        return (CATEGORY_PRIORITY.index(rule.category), 0 if in_title else 1, -len(rule.term))

    best = min(hits, key=rank)
    return Match(best.category, best.company, best.term, [h.id for h in hits], best.topic_id)

"""Keyword matching -> category, company, trigger.

LINE and competitor mentions count anywhere in the article. Broad industry/government terms
("privacy", "OJK", "fintech") only count when they appear in the headline or the lead
paragraph, otherwise every passing mention would flood the feed.
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


@dataclass
class Match:
    category: ArticleCategory
    company: str | None
    trigger: str
    keyword_ids: list[int]


def _compile(text: str, case_sensitive: bool) -> re.Pattern:
    flags = 0 if case_sensitive else re.IGNORECASE
    return re.compile(rf"(?<![A-Za-z0-9]){re.escape(text)}(?![A-Za-z0-9])", flags)


def build_rules(keywords) -> list[KeywordRule]:
    rules = []
    for kw in keywords:
        patterns = [_compile(kw.term, kw.case_sensitive)]
        patterns += [_compile(a, False) for a in (kw.aliases or [])]
        rules.append(KeywordRule(kw.id, kw.term, kw.category, kw.company, patterns))
    return rules


def classify(rules: list[KeywordRule], title: str, body: str) -> Match | None:
    lead = f"{title}\n{body[:LEAD_CHARS]}"
    full = f"{title}\n{body}"
    hits: list[KeywordRule] = []
    for rule in rules:
        haystack = full if rule.category in ANYWHERE else lead
        if any(p.search(haystack) for p in rule.patterns):
            hits.append(rule)
    if not hits:
        return None

    def rank(rule: KeywordRule) -> tuple[int, int, int]:
        in_title = any(p.search(title) for p in rule.patterns)
        # longer terms first so "LINE Pay" wins over bare "LINE"
        return (CATEGORY_PRIORITY.index(rule.category), 0 if in_title else 1, -len(rule.term))

    best = min(hits, key=rank)
    return Match(best.category, best.company, best.term, [h.id for h in hits])

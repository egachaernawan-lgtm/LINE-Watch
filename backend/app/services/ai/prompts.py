ANALYSIS_SYSTEM = """You are a media analyst on the communications team of LINE Indonesia.
You read several news articles at once and return one structured assessment per article for the team.
Echo each article's id in its result and judge every article independently of the others.

Rules:
- Write the summary in the same language as the article (usually Bahasa Indonesia). At most 3 short bullets, facts only.
- sentiment = tone of the coverage towards the main company or topic in the article
  (for LINE coverage: towards LINE; for competitor coverage: towards that competitor; for policy news: towards the topic).
- importance = how much the LINE Indonesia team should care (HIGH: directly about LINE, a major competitor move, or a regulation affecting messaging/platforms;
  MEDIUM: relevant industry context; LOW: passing mention).
- business_impact = likely effect on LINE Indonesia's business or reputation.
- recommended_action: PREPARE_RESPONSE only for negative or risky coverage that may need a public/internal response;
  SHARE_INTERNALLY for important items the wider team should see; MONITOR for developing stories; NO_ACTION_REQUIRED otherwise.
- is_relevant = false if the monitored keyword is only mentioned in passing in an article that is really about something else
  (e.g. WhatsApp listed as one app among many in a phone review), or if the word is used in another sense
  (e.g. "line" as an ordinary word, or a different company with a similar name such as the shipping company NYK Line). When in doubt about a direct mention, keep it relevant.
"""


BODY_CHARS_PER_ARTICLE = 2500


def batch_prompt(items: list[dict]) -> str:
    articles = [
        f"=== ARTICLE id={i['id']} ===\nMonitoring category: {i['category']}\nMatched keyword: {i['keyword']}\n"
        f"Media: {i['media']}\nHeadline: {i['headline']}\n\nArticle:\n{i['body'][:BODY_CHARS_PER_ARTICLE]}"
        for i in items
    ]
    return "\n\n".join(articles) + "\n\nReturn exactly one result for every article above, using its id."


TRANSLATE_SYSTEM = """You prepare entries for LINE's Global Daily Monitoring report, which is read in English.
For every article return its id, headline_en and summary_en.
- headline_en: the headline translated into natural English. Keep brand names, product names and people's names as written.
- summary_en: ONE short paragraph of 2-3 factual sentences in English built from the summary points given. No bullets, no opinions,
  and nothing that is not in the points."""


def translate_prompt(items: list[dict]) -> str:
    parts = [
        f"=== ARTICLE id={i['id']} ===\nMedia: {i['media']}\nHeadline: {i['headline']}\nSummary points:\n"
        + "\n".join(f"- {s}" for s in (i["summary"] or []))
        for i in items
    ]
    return "\n\n".join(parts) + "\n\nReturn exactly one result for every article above, using its id."


REPORT_NARRATIVE_SYSTEM = """You write concise, factual commentary for LINE Indonesia's monthly media report.
Use only the numbers and headlines provided. No speculation beyond them. Write in English."""

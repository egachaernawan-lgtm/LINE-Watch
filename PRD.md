# LINE WATCH: Product Requirements Document

Status: draft v2 (adds the Google Apps Script rollout). Owner: Ega Chaernawan. Last updated: 2026-11-10.

Related: [README.md](README.md) (run and deploy), [ARCHITECTURE.md](ARCHITECTURE.md) (current Python/GCP design), [DEMO-SCRIPT.md](DEMO-SCRIPT.md) (stakeholder demo), `design/wireframes/design_handoff_line_watch/README.md` (screen spec and tokens).

## 1. Summary

LINE WATCH is an AI media-monitoring platform for the LINE Indonesia comms, PR and policy teams. It collects news about LINE, competitors, the industry and government policy from Indonesian media, removes duplicates, analyses each article with Gemini, and presents the results in a dashboard and a daily/monthly report.

The global team has asked for the product to be rolled out on **Google Apps Script** inside the company's Google Workspace. The existing Vercel demo and the Python (FastAPI + Postgres) implementation stay in place.

## 2. Problem and goals

Comms teams monitor coverage by hand. It is slow, inconsistent, and misses negative coverage until it spreads.

Goals:
1. Collect relevant coverage automatically every 15 minutes from the configured sources.
2. Give every article an AI summary (max 3 bullets), sentiment, importance, business impact and a recommended action.
3. Show LINE coverage first, so it is never buried behind other news.
4. Produce the Global Daily Monitoring report without manual work.
5. Keep every claim verifiable: every article card links to the original source.

Non-goals (this version):
- Mobile layouts, a notification centre, settings screens and drag-reorder in reports (listed as not yet designed in the design handoff).
- Social-media monitoring. Sources are news media, publisher feeds and government pages.
- Automated emailing of reports. The Reports menu downloads PDF, Excel, CSV or HTML; scheduled email was removed from the Python design.

## 3. Users

| User | Needs |
|---|---|
| Comms / PR analyst | Latest coverage, filters, article detail with AI analysis, daily report |
| Policy / government relations | Government and regulation coverage, negative-sentiment alerts |
| Team lead / stakeholder | Dashboard: volume, negative coverage about LINE, share of voice, top media |
| Admin (`ADMIN_EMAILS`) | Edit keywords and sources, regenerate reports |

Access is restricted to an allow-list of up to 10 operator emails (decision D2, section 9).

## 4. Functional requirements

| # | Requirement | Status in current implementation |
|---|---|---|
| F1 | Collect from RSS feeds, Google News RSS per keyword, and government pages; 35 sources and 35 keywords seeded | Done (Python) |
| F2 | Keep only recent items (last 48 hours) that match a keyword; classify as LINE, Competitor, Industry or Government | Done |
| F3 | Deduplicate by canonical URL hash and by title fingerprint (48 hours); count other outlets as `Media (+N)` | Done |
| F4 | Gemini analysis with structured JSON output: relevance, summary (max 3), sentiment, importance, business impact, recommended action | Done |
| F5 | LINE items analysed first; failed items stay pending and retry, up to 3 attempts; quota errors do not count as attempts | Done |
| F6 | Dashboard: coverage volume, negative coverage about LINE, share of voice, top media | Done (Next.js) |
| F7 | Feed with filters (sentiment, category, period, media) and search; detail view; every card shows a clickable source link | Done |
| F8 | Reports: pick a date, preview, download PDF, Excel, CSV or HTML; English headlines and LINE summaries via Gemini | Done |
| F9 | Mirror analysed articles to Google Sheets | Done (Python), skipped when not configured |
| F10 | Google Login with allow-list; admin role | Done (NextAuth + backend JWT) |
| F11 | Demo mode: read-only snapshot plus a live "Fetch latest news" button (Vercel, no backend) | Done |
| F12 | Narratives and Alerts screens | Designed, not built. In scope for the Apps Script rollout (phase 3, decision D5) |
| F13 | Topic library: topics and subtopics from the team's keyword sheets (`docs/keywords.md`, `docs/keywords-external.md`) with keywords, per-topic article counts, feed filter and a Library page; Indonesian media only; LINE service mentions kept even in passing; daily report capped at 5 articles per competitor/industry topic | Done (Python + Next.js demo) |

## 5. Delivery targets

Three targets share one product definition. Features are kept consistent across them.

| Target | Purpose | Stack | State |
|---|---|---|---|
| **A. Vercel demo** | Stakeholder demo, zero infrastructure | Next.js, `snapshot.json`, `/api/fetch-latest` | Live. Keep as is. |
| **B. Python full stack** | Reference implementation, local development | FastAPI, Postgres, Gemini, Cloud Scheduler | Working locally. Keep as reference and fallback. |
| **C. Google Apps Script** | Production rollout inside Google Workspace | Apps Script, Google Sheets, Gemini REST, `clasp` | New. Scope in section 6. |

Rule: changes to analysis rules (prompts, categories, keywords) are made in one place and exported to the others (`keywords.yaml`, `sources.yaml`, `live-config.json`) so targets do not drift.

## 6. Apps Script rollout (target C)

### 6.1 Decision

The global team requires the full rollout on Apps Script and the company has Google Workspace. The goal is production use, not only a demo.

### 6.2 Architecture

```
LINE-Watch/
├── frontend/      Next.js, Vercel (unchanged)
├── backend/       FastAPI + Postgres (unchanged, reference)
└── appsscript/    new, deployed with clasp from git
```

- **Data:** Google Sheets, one tab each for `articles`, `sources`, `keywords`, `reports`, `runs`. The schema mirrors the Postgres tables. Postgres is not reachable from Apps Script's JDBC service. Move older rows to archive tabs monthly. BigQuery is the upgrade path if volume outgrows Sheets.
- **Access:** web app executing as the user accessing it, restricted to an allow-list of up to 10 emails plus the admin list, both in Script Properties. Owner account: ega.chaernawan@linecorp.com. The default `script.google.com` web app URL is used (no custom domain).
- **Scheduling:** time-driven triggers replace Cloud Scheduler (every 15 minutes; daily report at 08:00 Asia/Jakarta).
- **Gemini:** REST API with the key in Script Properties; `UrlFetchApp.fetchAll` for parallel requests; retry with backoff on 429 and 5xx.
- **UI:** plain HTML, CSS and JS served by `HtmlService`, ported from the Next.js screens and design tokens.
- **Operations:** separate dev and production deployments, failure emails to the admin, run history in the `runs` tab.

### 6.3 Phases (all three are in scope)

1. **Foundation and dashboard (read-only).**
   - `clasp` project in git, Sheet schema, web app shell with Workspace access control.
   - Load the existing snapshot into the Sheet so the dashboard shows real data on day one.
   - Home dashboard and article feed with filters, search and the original-source link on every card.
   - Done when: the global team can open the web app with their Workspace account and browse real analysed articles.
2. **Ingestion and analysis.**
   - Collect the feeds from `sources.yaml` and `keywords.yaml`; keyword filter and classification (F1, F2).
   - Decode Google News links to the original article URL (D4); fall back to the Google News link if decoding fails.
   - Dedupe by URL hash and title fingerprint (F3).
   - Gemini analysis in small batches that fit one execution; LINE first; retry rules as F5.
   - Done when: new articles appear in the Sheet and dashboard within 15 minutes of publication, with analysis, and a failed Gemini call never loses an article.
3. **Reports and operations.**
   - Daily and monthly report (F8): HTML preview, PDF, Excel, CSV, plus a Google Doc/Drive export.
   - Narratives and Alerts screens (F12): ported from the design handoff (Narratives, Alerts list, Create alert).
   - Admin page for keywords and sources; failure alerts; dev/prod deployments; runbook.
   - Done when: the 08:00 WIB daily report is generated without manual steps, an alert fires for matching new coverage, and the team has a runbook for failures.

### 6.4 Known constraints and risks

| Risk | Impact | Mitigation |
|---|---|---|
| Per-execution time limit (about 6 minutes; confirm the limit for the Workspace edition) | A full ingest plus analysis cannot run in one execution | Split into small batches per trigger run; keep a work queue in the Sheet |
| Daily quotas (URL fetches, trigger runtime, email) | Runs stop when exhausted | Measure real usage in phase 2; budget for 35 sources every 15 minutes; alert on quota errors |
| No article-extraction library | Less accurate body text and summaries | Use feed text plus simple HTML cleaning; check accuracy against labelled samples (section 7) |
| Google News links need decoding | Outlets that only have a Google News feed (for example Detik, Kompas, Kontan) cannot be linked to the original; Google may rate-limit decoding | Implement decoding (D4); fall back to the Google News link, which still opens the publisher page; log decode failures |
| Gemini billing deferred (D6) | Free-tier quotas returned 429 errors in testing, so live analysis in phase 2 may be incomplete | Billing must be enabled before M2 (live ingestion); until then phase 1 runs on existing data |
| Sheets as database | Slow past tens of thousands of rows; 10M-cell limit | Monthly archive tabs; BigQuery later |
| Gemini model availability | On 2026-11-05 `gemini-3.8-flash` hung without error while `gemini-3.1-flash-lite` answered in about 1.5 seconds | Configurable model name, request timeout, fallback model |
| Platform lock-in | Apps Script limits may become a ceiling | Keep the Python backend as reference and fallback |

## 7. Non-functional requirements and success metrics

Proposed targets, to be confirmed with the global team:

- **Freshness:** new relevant articles visible within 15 minutes of collection.
- **Reliability:** no article lost when Gemini fails or is rate-limited; failures retried automatically.
- **Accuracy:** AI relevance and sentiment agree with analyst judgement on at least 85% of a labelled sample of 30 articles (target to agree with the team; measure before launch).
- **Traceability:** 100% of article cards link to the original source.
- **Cost:** Gemini roughly $0.08 to $0.50 per day at about 100 articles per day, depending on the model (estimate from 2026-10-27 pricing; Flash prices are scheduled to change on 2027-01-01).
- **Security:** Workspace-only access; secrets in Script Properties, never in code or Sheets.
- **Language:** articles in Indonesian; report headlines and LINE summaries in English.

## 8. Milestones

| Milestone | Content |
|---|---|
| M0 | PRD approved; `appsscript/` skeleton, `clasp` login, Sheet schema (owner account confirmed) |
| M1 | Phase 1 complete: read-only dashboard on real data |
| M2 | Phase 2 complete: live ingestion and analysis every 15 minutes. Needs Gemini billing (about 2026-11-24) |
| M3 | Phase 3 complete: reports, admin, alerts, runbook; pilot with the comms team |
| M4 | Full rollout |

Dates are to be set after M0.

## 9. Open decisions

Decided on 2026-11-10:

| # | Decision | Outcome |
|---|---|---|
| D1 | Owner account | ega.chaernawan@linecorp.com owns the Apps Script project and the Sheets |
| D2 | Access model | Allow-list of up to 10 operator emails. Starts with 2 admins: bambang.ramdhan@linecorp.com and wulandari.fajarriani@linecorp.com |
| D3 | Custom domain | Not needed; use the default web app URL |
| D4 | Google News-only outlets | Implement link decoding in phase 2, with fallback to the Google News link |
| D5 | Narratives and Alerts (F12) | In scope for rollout (phase 3) |
| D6 | Gemini | Keep the current model for now. Billing owner: bambang.ramdhan@linecorp.com; billing expected to be available about 2026-11-24 (two weeks from 2026-11-10). Must be on before M2 |
| D7 | Retention | 90 days in the main `articles` tab; older rows moved monthly to a yearly archive spreadsheet and kept; reports kept forever |
| D8 | Alert delivery | Alerts are emailed to the admins (D2) via Apps Script `MailApp`, and also shown on the Alerts screen |
| D9 | Narratives | Gemini groups recent articles by topic into narratives (accepted as the starting approach; review after the pilot) |

Still open:
1. **Remaining operators:** up to 8 more emails can be added later; roles (admin or operator) to be set when they are.
2. **Alert rules:** which conditions trigger an alert by default (for example negative LINE coverage with high importance), to be defined in phase 3 with the admins.

## 10. Current status (2026-11-16)

- Python stack: ingestion, analysis and reports work locally. About 800 articles are stored; analysis is being caught up at about 50 articles per run on `gemini-3.1-flash-lite`.
- Vercel demo: live from `snapshot.json`.
- Apps Script: **postponed** (2026-11-16) while the topic library (F13) was built. Not started. Decisions D1 to D9 are resolved (section 9). `clasp` login is blocked by the Workspace policy, so the plan uses manual paste deployment. Next step when resumed is M0 (skeleton, Sheet schema).
- Topic library (F13): built on the Python stack and the Next.js app (Library page, topic filter). Apps Script phases will need to port the topic model.

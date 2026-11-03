# LINE WATCH

AI media monitoring for LINE Indonesia. Architecture: [ARCHITECTURE.md](ARCHITECTURE.md). Design reference: `design/`.

```
backend/   FastAPI + SQLAlchemy + Alembic (ingestion, Gemini analysis, Sheets/Drive/email, reports)
frontend/  Next.js 15 (App Router) + Tailwind, Google Login via NextAuth
```

## Run locally

Prerequisite: Docker (PostgreSQL 16) or any PostgreSQL 16 you can reach.

```bash
docker compose up -d db
cd backend
cp .env.example .env            # fill in values
python -m venv .venv && .venv/Scripts/pip install -r requirements.txt   # Linux/macOS: .venv/bin/pip
.venv/Scripts/alembic upgrade head
.venv/Scripts/python -m app.seed.loader      # 35 keywords + 35 sources
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

```bash
cd frontend
cp .env.example .env.local      # fill in values; BACKEND_URL=http://localhost:8000
npm install
npm run dev
```

Trigger a collection run by hand (what Cloud Scheduler calls every 15 minutes):

```bash
curl -X POST http://localhost:8000/internal/ingest -H "X-Internal-Key: <INTERNAL_API_KEY>"
```

## What you must provide

| Item | Used for |
|---|---|
| Google OAuth client (Web) | Google Login. Redirect URI: `<frontend>/api/auth/callback/google` |
| `ALLOWED_EMAILS` (frontend **and** backend) | Who may sign in; `ADMIN_EMAILS` may also edit keywords and regenerate reports |
| `BACKEND_JWT_SECRET` (same value in both apps) | Frontend signs short-lived tokens for the API |
| `GEMINI_API_KEY` | Summaries, sentiment, importance, impact, actions |
| Google service account JSON | Sheets + Drive. Share the Sheet with its email; put the reports folder in a **Shared Drive** and add the account |
| `SHEETS_SPREADSHEET_ID`, `DRIVE_REPORTS_FOLDER_ID` | Targets |
| `SENDGRID_API_KEY`, `EMAIL_FROM`, `REPORT_RECIPIENTS` | Optional scheduled report email (not used by the demo or the Reports menu) |

Anything left blank is skipped with a message in the run result (ingestion still works without Gemini, Sheets, Drive or email).

## Cloud Scheduler jobs (timezone Asia/Jakarta)

| Schedule | Target (POST, OIDC auth) |
|---|---|
| `*/15 * * * *` | `/internal/ingest` |
| `0 8 * * *` | `/internal/reports/daily` |
| `0 8 1 * *` | `/internal/reports/monthly` |

## Tests

```bash
cd backend && .venv/Scripts/python -m pytest
cd frontend && npm run typecheck && npm run lint && npm run build
```

## Demo deployment (Vercel, free, no backend)

The demo serves a snapshot of **real, analysed articles** from `frontend/src/data/snapshot.json`; nothing is mocked.

1. Collect and analyse (backend + Docker Postgres running): `POST /internal/ingest` a few times so Gemini analyses the backlog.
2. Export the snapshot (from `backend/`, venv active): `python -m app.seed.export_snapshot --days 14`. It prints the article count, newest/oldest times and sample headlines.
3. Commit `frontend/src/data/snapshot.json` and push. Vercel redeploys.
4. Vercel project: root directory `frontend`, environment variable `NEXT_PUBLIC_DEMO_MODE=true` (nothing else needed).

Repeat steps 1-3 before the presentation to refresh the feed. Article bodies are cut to a 600-character excerpt; every card links to the original source.

## Fetch latest news button (demo)

The Home page has a **Fetch latest news** button. It calls `/api/fetch-latest`, a Vercel server function that reads the 16 direct publisher RSS feeds right now, keeps items from the last 48 hours that match the keywords, and drops anything already in the snapshot. Results show as "Not analysed yet" with a link to the original; nothing is stored and Gemini is not used, so it costs nothing and cannot use up the quota. The CDN reuses one answer for 2 minutes, so a crowd clicking together makes one round of requests to the publishers.

- Outlets that only have a Google News feed (Detik, Kompas, Kontan, ...) are not included: their links need the decoding the Python collector does.
- Keywords and feeds come from `backend/app/seed/keywords.yaml` and `sources.yaml` via `frontend/src/data/live-config.json`. After editing either yaml, run `python -m app.seed.export_live_config` (`export_snapshot` does it too) and commit the JSON.

## Reports (Global Daily Monitoring)

**Reports** menu: pick a day, check the preview, download it as **PDF, Excel (.xlsx), CSV or HTML**. Nothing is emailed.
The report follows the global format (Dear all / tables for LINE, Competitor, Industry, Government & policy / disclaimer). Headlines and LINE summaries are translated to English by Gemini the first time an article appears in a report (cached in `articles.headline_en`, `articles.summary_en`). `Media (+N)` counts other outlets that ran the same story.

- The files are built in the browser from the report data (`frontend/src/lib/report-export.ts`), so the demo and the full app share one code path. PDF and Excel libraries load only when you click. Excel has one sheet per section with clickable headlines; CSV is one flat table (UTF-8 with BOM so Excel shows accents correctly); HTML is the standalone preview document.
- **Full app:** `GET /reports/daily/preview?on=YYYY-MM-DD` returns the HTML plus the same content as rows. Run `alembic upgrade head` once (it also drops the unused recipient/send-log tables from the earlier email design).
- **Vercel demo:** the reports are rendered at export time (`python -m app.seed.export_snapshot --report-days 7`). No email service or extra Vercel variables are needed.

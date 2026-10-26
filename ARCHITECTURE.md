# LINE WATCH — Architecture Proposal (for approval)

## 1. Directory structure

```
LINE WATCH/
├── CLAUDE.md
├── ARCHITECTURE.md
├── design/                         # design system + wireframes (reference only)
├── docker-compose.yml              # local: postgres + backend + frontend
├── .github/workflows/              # CI: lint, test, deploy to Cloud Run
│
├── backend/                        # Python FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/versions/
│   ├── app/
│   │   ├── main.py                 # FastAPI app factory, routers, CORS
│   │   ├── core/
│   │   │   ├── config.py           # pydantic-settings (env / Secret Manager)
│   │   │   ├── db.py               # async engine + session
│   │   │   ├── security.py         # verify Google ID token, allowed-domain check
│   │   │   └── logging.py
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── article.py  source.py  keyword.py  report.py  user.py  ingestion_run.py
│   │   ├── schemas/                # Pydantic request/response models
│   │   ├── api/v1/
│   │   │   ├── articles.py         # list/filter/search/detail
│   │   │   ├── stats.py            # sentiment distribution, top media, share of voice
│   │   │   ├── reports.py          # list, download links, manual generate
│   │   │   ├── keywords.py  sources.py
│   │   │   ├── auth.py             # /me
│   │   │   └── internal.py         # Cloud Scheduler targets (OIDC-protected)
│   │   ├── services/
│   │   │   ├── ingestion/
│   │   │   │   ├── pipeline.py     # orchestrates one 15-min run
│   │   │   │   ├── fetchers/       # rss.py, google_news.py, sitemap.py, gov_site.py
│   │   │   │   ├── extractor.py    # article body/author/date (trafilatura)
│   │   │   │   ├── dedupe.py       # url canonicalisation + title fingerprint
│   │   │   │   └── classifier.py   # keyword match -> category + company
│   │   │   ├── ai/
│   │   │   │   ├── gemini.py       # client, retries, JSON-schema output
│   │   │   │   └── prompts.py
│   │   │   ├── sheets.py           # append rows, clickable HYPERLINK URL
│   │   │   ├── drive.py            # upload Docs/PDF to Drive folder
│   │   │   ├── reports/
│   │   │   │   ├── daily.py  monthly.py  charts.py  pdf.py  gdoc.py
│   │   │   │   └── templates/      # Jinja2 HTML -> PDF
│   │   │   └── notifications/email.py
│   │   ├── seed/keywords.yaml      # all keyword groups from the brief
│   │   └── seed/sources.yaml       # RSS / site list per media
│   └── tests/
│
└── frontend/                       # Next.js (App Router) + TypeScript
    ├── package.json
    ├── next.config.mjs  tailwind.config.ts  tsconfig.json
    ├── public/fonts/               # LINE Seed Sans (from design/_ds/.../fonts)
    └── src/
        ├── app/
        │   ├── layout.tsx  globals.css      # design tokens as CSS variables
        │   ├── login/page.tsx
        │   ├── api/auth/[...nextauth]/route.ts   # Google Login
        │   └── (dashboard)/
        │       ├── layout.tsx               # 240px sidebar + 64px top bar
        │       ├── page.tsx                 # Home: KPIs, sentiment, volume, latest
        │       ├── feed/page.tsx            # Latest feed + filters + search
        │       ├── coverage/[category]/page.tsx   # line | competitors | industry | government
        │       ├── articles/[id]/page.tsx   # detail (always shows Original Source link)
        │       ├── media/page.tsx           # Top media
        │       └── reports/page.tsx         # Daily / Monthly archive
        ├── components/
        │   ├── ui/            # Button, Tag, Badge, StatTile, SentimentBar, Banner, Toast, Tabs...
        │   ├── articles/      # ArticleCard (headline, media, date, sentiment, summary, Original Source)
        │   ├── charts/        # SentimentDonut, VolumeLine, TopMediaBar
        │   └── layout/        # Sidebar, Topbar
        ├── lib/   (api client, auth, formatters)
        ├── hooks/
        └── types/
```

Design mapping: `design/.../_ds/tokens/*.css` -> `globals.css` + Tailwind theme; DS components in `_ds_bundle.js` -> `components/ui/`.
Design screens Narratives / Alerts are NOT in your brief; they stay out of phase 1 (can be added later).

## 2. PostgreSQL schema

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE article_category AS ENUM ('LINE','COMPETITOR','INDUSTRY','GOVERNMENT');
CREATE TYPE sentiment_t      AS ENUM ('POSITIVE','NEUTRAL','NEGATIVE');
CREATE TYPE level_t          AS ENUM ('HIGH','MEDIUM','LOW');
CREATE TYPE action_t         AS ENUM ('MONITOR','SHARE_INTERNALLY','PREPARE_RESPONSE','NO_ACTION_REQUIRED');
CREATE TYPE analysis_status  AS ENUM ('PENDING','DONE','FAILED');

CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  google_sub    TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  role          TEXT NOT NULL DEFAULT 'viewer',      -- viewer | admin
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sources (                                 -- monitored feeds / sites
  id            SERIAL PRIMARY KEY,
  media_name    TEXT NOT NULL,
  kind          TEXT NOT NULL,                       -- rss | sitemap | google_news | gov_page
  feed_url      TEXT NOT NULL UNIQUE,
  media_type    TEXT,                                -- national | business | tech | government | press_release | industry
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_polled_at TIMESTAMPTZ,
  last_error    TEXT
);

CREATE TABLE keywords (
  id            SERIAL PRIMARY KEY,
  term          TEXT NOT NULL UNIQUE,
  category      article_category NOT NULL,
  company       TEXT,                                -- LINE, WhatsApp, Telegram, ...
  is_active     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE articles (
  id               BIGSERIAL PRIMARY KEY,
  url              TEXT NOT NULL,                    -- ORIGINAL article URL (required, never null)
  url_hash         CHAR(64) NOT NULL UNIQUE,         -- sha256(canonical url) => dedupe
  title_fingerprint CHAR(64) NOT NULL,               -- sha256(normalised headline) => syndication dedupe
  headline         TEXT NOT NULL,
  media_name       TEXT NOT NULL,
  source_id        INT REFERENCES sources(id),
  author           TEXT,
  body             TEXT,
  published_at     TIMESTAMPTZ,
  collected_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  keyword_trigger  TEXT NOT NULL,                    -- first/primary matched term
  category         article_category NOT NULL,
  company          TEXT,
  -- AI analysis (Gemini)
  analysis_status  analysis_status NOT NULL DEFAULT 'PENDING',
  summary          TEXT[],                           -- max 3 bullets
  sentiment        sentiment_t,
  importance       level_t,
  business_impact  level_t,
  recommended_action action_t,
  analyzed_at      TIMESTAMPTZ,
  -- Google Sheets sync
  sheet_synced_at  TIMESTAMPTZ,
  search_vector    TSVECTOR GENERATED ALWAYS AS
                   (to_tsvector('simple', coalesce(headline,'') || ' ' || coalesce(body,''))) STORED,
  CONSTRAINT url_not_blank CHECK (length(trim(url)) > 0)
);
CREATE INDEX ix_articles_published   ON articles (published_at DESC);
CREATE INDEX ix_articles_category    ON articles (category, published_at DESC);
CREATE INDEX ix_articles_sentiment   ON articles (sentiment, published_at DESC);
CREATE INDEX ix_articles_media       ON articles (media_name);
CREATE INDEX ix_articles_pending     ON articles (analysis_status) WHERE analysis_status <> 'DONE';
CREATE INDEX ix_articles_unsynced    ON articles (id) WHERE sheet_synced_at IS NULL;
CREATE INDEX ix_articles_title_fp    ON articles (title_fingerprint);
CREATE INDEX ix_articles_search      ON articles USING GIN (search_vector);

CREATE TABLE article_keyword_hits (                  -- every keyword matched (not just the trigger)
  article_id  BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  keyword_id  INT    REFERENCES keywords(id),
  PRIMARY KEY (article_id, keyword_id)
);

CREATE TABLE reports (
  id            BIGSERIAL PRIMARY KEY,
  kind          TEXT NOT NULL,                       -- daily | monthly
  period_start  TIMESTAMPTZ NOT NULL,
  period_end    TIMESTAMPTZ NOT NULL,
  gdoc_url      TEXT,
  pdf_url       TEXT,
  drive_file_id TEXT,
  emailed_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, period_start)                        -- idempotent: no duplicate report on retry
);

CREATE TABLE ingestion_runs (                        -- observability for the 15-min job
  id             BIGSERIAL PRIMARY KEY,
  started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at    TIMESTAMPTZ,
  sources_polled INT DEFAULT 0,
  found          INT DEFAULT 0,
  inserted       INT DEFAULT 0,
  duplicates     INT DEFAULT 0,
  errors         INT DEFAULT 0,
  error_detail   JSONB
);
```

Google Sheets columns (one row per article, same order as brief): Date Published, Date Collected, Headline, Media, Author, URL (`=HYPERLINK(url, "Open")`), Keyword, Category, Company, Sentiment, Importance, Summary, Recommended Action. PostgreSQL is the source of truth; Sheets is a one-way mirror (`sheet_synced_at`).
Business impact is stored in PostgreSQL and shown in the dashboard; it is not in your Sheets column list, so I'll leave it out of the Sheet unless you want it added.

## 3. backend/requirements.txt

```
fastapi==0.115.6
uvicorn[standard]==0.34.0
gunicorn==23.0.0
pydantic==2.10.4
pydantic-settings==2.7.0
SQLAlchemy[asyncio]==2.0.36
asyncpg==0.30.0
alembic==1.14.0
cloud-sql-python-connector[asyncpg]==1.15.0
httpx==0.28.1
tenacity==9.0.0
feedparser==6.0.11
trafilatura==2.0.0
beautifulsoup4==4.12.3
lxml==5.3.0
python-dateutil==2.9.0.post0
PyYAML==6.0.2
google-genai==1.2.0
google-api-python-client==2.158.0
google-auth==2.37.0
google-auth-httplib2==0.2.0
gspread==6.1.4
PyJWT[crypto]==2.10.1
Jinja2==3.1.5
WeasyPrint==63.1
matplotlib==3.10.0
sendgrid==6.11.0
structlog==24.4.0
orjson==3.10.13
pytest==8.3.4
pytest-asyncio==0.25.2
```
Pins are my best known-good set; I'll run `pip install` and freeze the resolved versions when we scaffold, and fix any that don't resolve.

## 4. frontend/package.json

```json
{
  "name": "line-watch-frontend",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.1.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "next-auth": "4.24.11",
    "@tanstack/react-query": "5.62.11",
    "recharts": "2.15.0",
    "lucide-react": "0.460.0",
    "date-fns": "4.1.0",
    "clsx": "2.1.1",
    "zod": "3.24.1"
  },
  "devDependencies": {
    "typescript": "5.7.2",
    "@types/node": "22.10.5",
    "@types/react": "19.0.2",
    "@types/react-dom": "19.0.2",
    "tailwindcss": "3.4.17",
    "postcss": "8.4.49",
    "autoprefixer": "10.4.20",
    "eslint": "9.17.0",
    "eslint-config-next": "15.1.3"
  }
}
```
`lucide-react` 0.460.0 matches the icon version in your design handoff.

## 5. The 15-minute monitoring job

**Recommendation: GCP Cloud Scheduler -> authenticated HTTP call to a Cloud Run endpoint.** No Celery, no Redis, no always-on worker.

```
Cloud Scheduler (*/15 * * * *, Asia/Jakarta)
   -> POST /internal/ingest   (OIDC token; Cloud Run verifies caller)
        1. poll active sources (RSS, Google News RSS per keyword, sitemaps, gov pages) concurrently via httpx
        2. canonicalise URL -> sha256 -> INSERT ... ON CONFLICT (url_hash) DO NOTHING   (no duplicates)
           also skip if title_fingerprint already seen in last 48h (syndicated copies)
        3. for new items only: fetch page, extract body/author/date, match keywords -> category + company
        4. Gemini analysis (batched, JSON schema output): 3-bullet summary, sentiment, importance,
           business impact, recommended action. Failures stay PENDING and are retried next run.
        5. append new rows to Google Sheets (batch append, HYPERLINK url), set sheet_synced_at
        6. record ingestion_runs row
```
- Only new content: the unique `url_hash` guarantees idempotency, so overlapping or retried runs are safe.
- Reports: Scheduler job `0 8 * * *` (Asia/Jakarta = 08:00 WIB) -> `/internal/reports/daily`; job `0 8 1 * *` -> `/internal/reports/monthly`. Each builds the Google Doc + PDF, saves to Drive, emails it, and records a row in `reports` (unique per period, so retries don't double-send).
- Why not Celery: at this volume (a few hundred articles/day) a single request-per-run is simpler, cheaper (Cloud Run scales to zero) and needs no broker. If runs approach Cloud Run's request timeout (up to 60 min), we can fan out with Cloud Tasks without changing the design.
- Limitation to know: "real-time" is bounded by what sources publish. RSS/sitemaps cover most Indonesian media; sites without feeds need a custom fetcher, and Google News RSS fills gaps.

## 6. GCP deployment

Cloud Run (backend, frontend) · Cloud SQL for PostgreSQL · Secret Manager (Gemini key, OAuth secrets, SendGrid key) · Cloud Scheduler · Artifact Registry · Google Drive + Sheets via a service account · Google Login via NextAuth, backend verifies the Google ID token and restricts access by allowed email domain.

## Decisions I need from you
1. **Email provider:** SendGrid (assumed above) or Gmail API / SMTP from a company Google account?
2. **Who can log in:** restrict to one company domain (which?) or an allow-list of emails?
3. **Media sources:** do you have a list of target outlets/URLs, or should I start with a default Indonesian set (Kompas, Detik, CNBC Indonesia, Kontan, Bisnis, Tempo, Liputan6, Antara, DailySocial, Komdigi, OJK, BI, etc.)?
4. **Phase 1 scope:** skip the design's Narratives and Alerts screens until the brief's features work?

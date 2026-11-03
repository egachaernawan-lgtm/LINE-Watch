# LINE WATCH demo script (about 5 minutes)

Open the **production Vercel domain** (not a deployment-specific URL). Share the same link with participants: no login needed.
Everything on screen is real: articles collected from Indonesian media, summarised and rated by Gemini. The data is a snapshot taken on the date in the blue banner.

## Flow

1. **Latest feed** (opens here). "Every 15 minutes the system collects new articles from 35 Indonesian media sources and Google News, removes duplicates, and classifies them as LINE, Competitor, Industry or Government."
   - Point at one card: AI summary (max 3 bullets), sentiment, importance, recommended action.
   - Click **Original Source** on a card: it opens the real article. Every card links back to the publisher.
2. **Filter and search.** Sentiment = Negative, then clear; search "WhatsApp" or "Binance"; set Period = 30 days.
   - Negative examples in the data: the Binance hack coverage, "Ancaman Pembatasan Konten di Media Sosial Cederai Kebebasan Sipil" (policy).
3. **LINE coverage** (sidebar). The UMEUS sticker launch, covered by Selular.ID, Nextren, Olenka and indotelko.com, plus the LINE Indonesia creators story. "LINE items are analysed first, so they are never stuck behind other news."
   - If a period has no LINE news the page says so: "no alert needed".
4. **Competitors**. WhatsApp feature stories and security tips. "Share of voice and sentiment per competitor on the dashboard."
5. **Home** (dashboard). Click **Fetch latest news**: it reads the media feeds live (about 5 seconds) and shows what is new in the last hours, each linked to the original. Invite a participant to click it. "In production Gemini then analyses each one." Then the dashboard numbers: Coverage volume, negative coverage about LINE, share of voice, top media.
6. **Top media**. Which outlets write most about the topics we monitor.
7. **Reports.** Preview the Global Daily Monitoring report (English headlines, LINE summaries, "Media (+N)"), pick a date, then download it as PDF, Excel, CSV or HTML. Open the PDF and click a headline: it goes to the original article.
8. **Close.** "In production this also fills a Google Sheet and builds the daily report at 08:00 WIB. Today's demo is a read-only snapshot so it cannot fail on stage."

## Likely questions

- *Is it live?* The collector runs every 15 minutes in production. This demo is a snapshot of real data (see banner). Can show the collector running on the laptop (plan B below).
- *Cost?* Demo: $0 (Vercel free plan, Gemini free tier). Production estimate is in ARCHITECTURE.md.
- *Accuracy of AI?* Summaries and ratings are model output; each card links to the original so the team can verify. The relevance check removes passing mentions (for example a shipping company named "NYK Line").

## Plan B (internet or Vercel problem)

1. Run the demo locally. From `frontend\`:
   ```powershell
   $env:NEXT_PUBLIC_DEMO_MODE="true"; npm run dev
   ```
   Open http://localhost:3000 (the snapshot is in the repo, no database needed). "Original Source" links need internet.
2. Keep 4 screenshots ready: feed, an article's AI summary, LINE coverage, dashboard.

## Before the event (day before and morning of)

- Start Docker Desktop, then `docker compose up -d db`, and start the backend.
- Run the ingestion 2-3 times (see README), then `python -m app.seed.export_snapshot --days 30` from `backend\`, commit and push `frontend/src/data/snapshot.json`.
- On the Reports page download each format once (PDF, Excel, CSV, HTML) and open them.
- Wait for Vercel to show Ready, open the production domain in a private window, click through every sidebar item and one Original Source link.

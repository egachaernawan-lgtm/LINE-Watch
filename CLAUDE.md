# LINE WATCH

AI media monitoring platform for LINE Indonesia. Stack: Next.js frontend, FastAPI backend, PostgreSQL + Google Sheets, Gemini API, GCP.

## Design source of truth
- `design/wireframes/design_handoff_line_watch/README.md` — screen-by-screen spec, tokens, state model. Read this first.
- `design/wireframes/design_handoff_line_watch/LINE Watch Prototype.dc.html` — hi-fi clickable prototype (serve with `npx serve .`, don't open via file://).
- `design/wireframes/design_handoff_line_watch/_ds/` — design tokens (`tokens/*.css`), LINE Seed Sans fonts, component source in `_ds_bundle.js`.
- `design/design-system/LINE Watch App.html` — standalone design-system export (12MB; read in portions or grep, never whole).
- Prototype HTML is a reference, not production code: rebuild as Next.js + Tailwind components.
- Every article card must show the clickable original source URL.

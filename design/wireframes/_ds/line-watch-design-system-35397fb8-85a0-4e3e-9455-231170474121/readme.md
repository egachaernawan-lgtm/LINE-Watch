# LINE Watch Design System

LINE Watch is an internal media-monitoring service: it ingests media coverage (online news, print, broadcast, social), and analyses the **narration** — how a topic is being framed, by whom, and with what tone. Users are comms / PR / policy teams who scan feeds, spot narrative shifts, set alerts and build reports.

The visual language follows the **LINE Design System Guide (LDSG)**: bright, flat, friendly, LINE Green for the single primary action, LINE Seed type.

## Sources
- `uploads/line_design_system.md` — "Design System Inspired by LINE (LDSG)": colour, type, components, spacing, elevation, responsive rules. This is the only source provided.
- No codebase, Figma, screenshots, logo or icon set were provided. Product screens in the UI kit are compositions, not recreations.
- Font: LINE Seed — https://seed.line.me/ ; LINE Seed JP on Google Fonts: https://fonts.google.com/specimen/LINE+Seed+JP

## Index
- `styles.css` — entry point (imports only). Link this one file.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css`
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives (see below), one card per folder
- `ui_kits/line-watch/` — desktop web app click-through (Overview, Media feed, Narratives, Alerts)
- `fonts/` — LINE Seed Sans woff2 files
- `SKILL.md` — Agent Skill wrapper
- `thumbnail.html` — project tile

## Components
- **icons/** — Icon
- **actions/** — Button, IconButton
- **forms/** — Input, Select, Checkbox, Switch
- **display/** — Badge, Tag, Avatar, Card, ListRow
- **navigation/** — Tabs
- **feedback/** — Dialog, Toast, Tooltip, Banner
- **monitoring/** — StatTile, SentimentBar, MentionItem

The spec defines Buttons, Inputs, List rows, Badges, Modals/Bottom sheets. The remaining standard primitives (Select, Checkbox, Switch, Card, Tag, Avatar, Tabs, Toast, Tooltip) were authored from spec tokens.

### Intentional additions
- **Icon** — wrapper for Lucide glyphs (no icon set was provided).
- **Banner** — spec mentions "warning banners" but gives no styling.
- **StatTile, SentimentBar, MentionItem** — domain components for media monitoring (KPIs, tone split, feed row).
- **Sentiment tokens** (`--sentiment-*`) — mapped onto existing semantic colours: positive=green, negative=error red, mixed=warning orange, neutral=gray.

---

## CONTENT FUNDAMENTALS
- **Tone:** friendly, reliable, plain. Calm and factual — this is an analysis tool, so copy reports what happened, never editorialises. "Negative coverage is up 3× in the last hour", not "Uh-oh! Bad press!".
- **Casing:** sentence case everywhere, including buttons, tabs and titles ("Create alert", "Media feed"). Never all-caps labels; the only exception is the tiny `NEW` badge.
- **Person:** address the user as *you* ("You'll stop receiving notifications for this keyword."). The product doesn't say *I/we* in UI; system messages are impersonal ("Alert saved").
- **Verbs first** on actions: Create alert, Export CSV, Add to report, View feed.
- **Numbers:** always concrete and formatted (1,092; 18.6M; 28%; +42%). Relative times for recency ("12 min ago", "Yesterday"). Use "·" as the inline separator ("Online news · 2h ago").
- **Domain vocabulary:** mention, source, outlet, reach, share of voice, narrative, tone/sentiment (Positive / Neutral / Mixed / Negative), spike, alert, digest.
- **Empty states:** one short sentence, no illustration ("No mentions match these filters.").
- **Emoji:** not used.

## VISUAL FOUNDATIONS
- **Colour:** white base (#FFFFFF), Gray 100 (#F4F4F4) for app backdrop, inputs and inset panels. Text is Gray 900 #111 / 700 #555 / 500 #888. LINE Green #06C755 is reserved for the one primary action per screen, active nav, positive sentiment and focus. Semantic: error #FF334B, warning #FF9900, notice/link #007AFF, each with a pale tint for banners and tags.
- **Type:** LINE Seed throughout — geometric with softened corners. Titles Bold 700 (Display ExtraBold 800) at 1.4 line height; body 16/1.5; subtext 14/1.5; caption 12/1.4; badge 10 bold. Big numbers in KPIs use 800 weight + tabular numerals.
- **Spacing:** 8pt grid, 4px micro steps. Scale 4/8/12/16/20/24/32/40/48/64. Page padding 32px on desktop, 16–20px on mobile. 16–24px between content groups. List rows 16px vertical × 20px horizontal.
- **Backgrounds:** flat solid colour only. No gradients, textures, patterns, photography or illustration in chrome. The only fill gradient is the 10% green under the volume chart line.
- **Corner radii:** 4px tags/checkboxes · 8px buttons, inputs, banners · 12px inset panels/toasts · 16px cards and dialogs · 24px bottom-sheet top corners · full for avatars, badges, pills, switches, icon buttons.
- **Cards:** white, 1px #EBEBEB border, 16px radius, no shadow. Interactive cards may gain the popover shadow on hover. Selected cards: green 1px border + green tint fill.
- **Borders / dividers:** 1px #EBEBEB; inset under list text (not under the avatar). Strong border #CCCCCC for secondary-button outlines and checkbox boxes.
- **Elevation:** flat. Shadows only for floating layers: sticky `0 2px 8px /8%`, popover `0 4px 16px /12%`, modal `0 8px 24px /16%`, sheet `0 -4px 16px /10%`. Always soft and low-opacity.
- **Overlays / transparency:** dim layer is black 40% behind dialogs, drawers and sheets. No blur / glassmorphism. Toasts are near-opaque Gray 900 (92%).
- **Hover:** neutral surfaces get a 5% black overlay; primary green darkens to #05B04B. Links underline.
- **Press:** 8% black overlay; buttons scale to 0.98.
- **Focus:** input border turns LINE Green.
- **Motion:** short and functional — 120ms (hover/press), 200ms (menus, tabs, switches, tooltips), 300ms (dialogs, sheets), ease `cubic-bezier(.2,0,0,1)`. Fades and small slides; no bounce, no spring.
- **Layout:** desktop = fixed 240px left sidebar + sticky top bar + scrolling content; optional right filter rail (260px) or detail drawer (480px). Mobile: bottom nav, modals become bottom sheets. Breakpoints 360 / 600 / 1024.
- **Imagery:** none supplied. Source logos render as square avatars (initials on Gray 100) until real logos exist.
- **Data viz:** green line for volume; sentiment always uses the four tone colours in fixed order positive → neutral → mixed → negative, 2px gaps between segments, fully rounded bars.

## ICONOGRAPHY
- **No icon set was provided.** Substituted **Lucide** (outline, 2px stroke, round caps) via CDN — `https://unpkg.com/lucide-static@0.460.0/icons/<name>.svg` — which matches the friendly, rounded geometry of LINE Seed. ⚠️ Flagged substitution; replace with the company's own icon set if one exists.
- Use the `Icon` component (CSS mask → inherits `currentColor`). Sizes: 16 inline / captions, 20 default UI, 24 nav and headers.
- Icons are outline only; never filled except inside a filled container (FAB).
- Common glyphs: search, bell, newspaper, tv, radio, rss, waypoints (narratives), trending-up/down, arrow-up-right/down-right (deltas), eye (reach), filter, sliders-horizontal, download, file-text, plus, x, check, chevron-down/right.
- No emoji, no unicode pictographs. "·" is used only as a text separator.

## Brand mark
**No logo was provided.** The name "LINE Watch" is set in LINE Seed ExtraBold wherever a mark is needed (white on green, or Gray 900 with "Watch" in green). Do not draw or approximate the LINE logo.

## Fonts
- **LINE Seed Sans** (EN) is self-hosted from `fonts/` and covers Thin 100, Regular 400, Bold 700, ExtraBold 800 and Heavy 900.
- **LINE Seed JP** is loaded from Google Fonts as the fallback for Japanese glyphs.
- `--font-sans` is `"LINE Seed Sans","LINE Seed JP",` followed by the system stack.

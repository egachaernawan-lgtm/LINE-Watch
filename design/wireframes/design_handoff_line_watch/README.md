# Handoff: LINE Watch — core product flow

## Overview
LINE Watch is a media-monitoring tool for comms / PR / policy teams. This package covers the core desktop flow:

Set up → Home dashboard → Media feed (with chip filters) → Mention detail → Add to report → Reports
Home → Narratives → View coverage (filtered feed) · Home / Narratives / Saved search → Create alert → Alerts

## About the design files
The files in this bundle are **design references built in HTML**. They are prototypes that show the intended look and behaviour; they are not production code to copy directly. Rebuild these designs in the target codebase using its existing patterns and libraries. If there is no codebase yet, React + TypeScript + Vite is a sensible default, with the LINE Watch design-system components re-implemented as real components.

- `LINE Watch Prototype.dc.html` is the **high-fidelity clickable prototype** and the source of truth.
- `LINE Watch Wireframes.dc.html` holds the lo-fi exploration. Turn 2 (2a–2g) is the chosen flow; turn 1 lists the alternatives that were considered.
- `_ds/…` contains the design-system tokens, fonts and component bundle. Use it as a reference for exact values; the component source is inside `_ds_bundle.js`.

To run the prototype, serve the folder (`npx serve .`) and open `LINE Watch Prototype.dc.html`. Opening it from `file://` will not load the bundle. Clear `localStorage['lw-proto-v1']` to restart from Set up.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii and component styling are final and come from the LINE Watch Design System. Data is mocked.

## Global layout (desktop, ≥1024px)
- **Sidebar:** fixed, 240px, white, 1px `#EBEBEB` right border, padding 20px 12px.
  - Wordmark "LINE **Watch**" at 800 20px, with "Watch" in `#06C755`.
  - Nav items: 10px 12px padding, radius 8, 700 15px, 20px Lucide icon. Active item: bg `#E6F9EE`, text `#05A648`. Hover: 5% black overlay.
  - Nav order: Home, Media feed, Narratives, Alerts, Reports. Reports shows a count badge of saved mentions.
  - User block pinned to the bottom.
- **Top bar:** sticky, 64px, white, bottom border. Contains a back IconButton (detail screens only), the page title (700 20px), a 320px search Input (small size; Enter opens the feed with a text filter) and a bell IconButton with a badge.
- **Content:** bg `#F4F4F4`, padding 32px, 24px gap between groups.
- **Cards:** white, 1px `#EBEBEB` border, radius 16, no shadow. Interactive cards get `0 4px 16px rgba(0,0,0,.12)` on hover.

## Screens

### 1. Set up (first run, no sidebar)
- **Layout:** centred, max-width 1040. Two columns, 1.3fr form card + 1fr sticky preview card, 24px gap.
- **Form:**
  - Title "Set up monitoring" (800 28px) and subtitle.
  - Keywords: removable Tags plus an Input. Enter adds a keyword; duplicates are ignored.
  - Sources: 4 Checkboxes (Online news, Print, Broadcast on by default; Social off).
  - Language and Region Selects.
  - Primary "Start monitoring". It is disabled when there are no keywords or no sources, and the helper text explains why.
- **Preview card:** "~N mentions/day", which recalculates live (`sum(source rates) × (0.4 + 0.3 × keywordCount)`; rates: online 620, print 180, broadcast 240, social 2100). Below it: a SentimentBar and 3 sample ListRows.
- **Action:** "Start monitoring" → Home.

### 2. Home dashboard
- **Header row:** segmented Tabs (24 hours / 7 days / 30 days) and primary "Create alert" (bell-plus icon) → Create alert, scoped to the brand.
- **Warning Banner:** "Negative coverage is up 3× since Thursday 14:00" with a "View the spike" link → Feed filtered to spike + negative. Hidden in the 30-day range.
- **KPI row:** 4 StatTiles (Mentions, Reach, Negative [inverted delta colour], Share of voice).
  - Each tile is clickable: Mentions and Reach → Feed; Negative → Feed filtered to negative; Share of voice → Narratives.
  - Values change with the range tab.
- **Volume card:**
  - Line chart: 28 points at 6-hour intervals, 2.5px `#06C755` line, 10% green area fill, 200px tall.
  - Red spike marker: 18px circle, 3px white ring, labelled "Thu 14:00 · 560". Clicking it → Feed filtered to spike + negative.
  - Day labels underneath.
- **Two columns:**
  - Top narratives: 3 rows of name, count · delta and a 6px SentimentBar. Clicking a row → Narratives with that narrative selected.
  - Latest mentions: 3 MentionItems → Mention detail.

### 3. Media feed + filters
- **Filter row:**
  - Active filters show as selected Tags (dark) with ×. "Last 7 days" is fixed.
  - Filters that can appear: Spike: Thu 14:00–20:00, “query”, Tone, Media type, Narrative.
  - Then outline Selects (sm) for Tone, Media type and Narrative, plus "Clear all" (tertiary; shown only when filters are active).
  - "Save search" (secondary) → toast with a "Create alert" action → alert scoped to that saved search.
  - "Export CSV" (secondary) → toast.
- **List card:**
  - Header: "**N** mentions · Newest first".
  - MentionItems with excerpt, sentiment tag, narrative tag and reach. Clicking one → Mention detail.
  - Empty state: "No mentions match these filters."
- **Incoming filters:** filters set by other screens arrive already applied.

### 4. Mention detail ("in context")
- **Toolbar:**
  - "3 of N" position, with prev/next outline IconButtons that cycle through the current filtered list.
  - "Open source" (secondary, ↗).
  - Primary "Add to report". After adding it becomes disabled with the label "Added to report" and a check icon, and a toast "Added to Weekly brand report" offers "View report" → Reports.
- **Headline block:**
  - Headline at 800 28px.
  - Meta line: source · medium · time · reach.
  - Tone Tag (dot).
  - Narrative Tag (outline, waypoints icon) → Narratives with it selected.
  - Excerpt.
- **Pick-up card:**
  - Horizontal timeline: a 2px track with an 18px dot for the original (red) and gray dots for each pick-up, delay labels below.
  - Summary: "Picked up by 5 outlets within 9 hours".
- **Two columns:**
  - Picked up by: ListRows showing source, medium and delay.
  - Similar coverage: up to 3 MentionItems from the same narrative.

### 5. Narratives
- **Layout:** grid of `1fr` + a 340px sticky detail panel. Segmented Tabs switch between Map and List.
- **Map:**
  - 460px `#F4F4F4` canvas, radius 12.
  - Bubbles: absolutely positioned, diameter = volume. Fill and border use the dominant tone colour (tints: positive `rgba(6,199,85,.14)`, negative `rgba(255,51,75,.14)`, mixed `rgba(255,153,0,.16)`, neutral white with a `#888` border).
  - Selected bubble gets a 3px border. Caption: "Size = volume · colour = dominant tone · closer = shared outlets".
- **List:** rows in a `1fr 200px 80px` grid: name + count · outlets, SentimentBar, delta. The selected row gets a green tint.
- **Detail panel:**
  - Name (700 20px), meta line, SentimentBar with legend.
  - Key phrases as Tags; top voices as square Avatars.
  - Primary "View coverage" → Feed filtered by narrative.
  - Secondary "Create alert" → alert scoped to the narrative.

### 6. Alerts (list)
- **Header:** "You're notified when a rule is met." and primary "Create alert".
- **List card:** rows with a bell icon, name and rule summary, a NEW badge on newly created alerts, and a Switch. Toggling shows a toast "Alert paused" / "Alert resumed".

### 7. Create alert
- **Layout:** grid of `1fr` + a 380px sticky preview.
- **Form:**
  - Scope as single-select Tags. Options: brand, Narrative: Earnings miss, Saved search: Brand crisis, plus the incoming narrative if different. Scope is pre-filled from wherever the user came from.
  - When (metric), Rises above (1.5× / 2× / 3× normal), Within (1 hour / 6 hours / 1 day), Alert name (optional; auto-named if empty).
  - Notify via: Email, LINE, Slack checkboxes.
  - Validation: at least one channel is required, otherwise show the red caption "Choose at least one channel."
  - "Save alert" / "Cancel".
- **Preview:**
  - "In the last 30 days this alert would have fired **N times**" (1.5× → 9, 2× → 4, 3× → 1).
  - Volume chart with a red dashed threshold line that animates its `top` (200ms, `cubic-bezier(.2,0,0,1)`).
  - Hint copy that changes with the fire count.
- **Save:** returns to the origin screen with the toast "Alert saved". If the origin isn't Alerts, the toast has a "View alerts" action. The new alert is prepended to the list with a NEW badge.

### 8. Reports (block builder)
- **Layout:** a 240px sticky palette and a centred page canvas (max 760, padding 40, radius 16, sticky shadow `0 2px 8px rgba(0,0,0,.08)`).
- **Palette:** Key numbers, Volume, Tone split, Narratives, Saved mentions, Note. Click to append a block, with a toast "X added". (In production, support drag-to-reorder.)
- **Blocks:** each shows a dashed `#CCC` outline on hover and a × IconButton to remove.
  - Saved mentions lists the mentions added from Mention detail. Empty state: "No saved mentions yet. Use "Add to report" on a mention."
  - Note is editable text.
- **Toolbar:** meta "N blocks · N saved mentions", "Schedule" (secondary) → toast "Scheduled every Monday at 09:00", primary "Export PDF" → toast.

## State
```
screen: 'setup'|'home'|'feed'|'mention'|'narratives'|'alerts'|'alertNew'|'reports'
filters: { tone, medium, narrative, spike:boolean, q }
mentionId, narrId, narrView:'map'|'list', range:'24h'|'7d'|'30d'
keywords[], sources{online,print,broadcast,social}
alerts[{id,name,rule,on,isNew}]
alertForm{scope,metric,threshold,window,name,ch{Email,LINE,Slack},err}, returnTo
savedMentionIds[], reportBlocks[{id,type}]
toast{text,action,onAction}  // auto-dismiss after 3.5s
```
- Cross-screen navigation always passes context: filters, the selected narrative, or alert scope.
- The prototype persists state in `localStorage['lw-proto-v1']`.

## Interactions & motion
- **Hover:** 5% black overlay on neutral surfaces; primary green → `#05B04B`.
- **Press:** 8% black overlay; buttons scale to 0.98.
- **Durations:** 120ms hover/press, 200ms tabs/switches/tooltips, 300ms dialogs/sheets. Ease `cubic-bezier(.2,0,0,1)`. No bounce.
- **Toast:** Gray 900 at 92%, radius 12, fixed bottom-centre 32px, green action text.
- **Focus:** input border turns `#06C755`.

## Design tokens
- **Colours:**
  - Brand: green `#06C755`, pressed `#05B04B`, tint `#E6F9EE`.
  - Grays: 900 `#111`, 700 `#555`, 500 `#888`, 300 `#CCC`, 200 `#EBEBEB`, 100 `#F4F4F4`.
  - Semantic: error `#FF334B` / tint `#FFEBEE`; warning `#FF9900` / `#FFF4E0`; info `#007AFF` / `#E5F1FF`.
  - Sentiment: positive green, neutral gray, mixed orange, negative red. Always in that order, with 2px gaps and fully rounded bars.
- **Type:** LINE Seed Sans (fonts in `_ds/…/fonts/`).
  - Display 800 28–32px / 1.2–1.4; titles 700 18–20px / 1.4.
  - Body 16/1.5; subtext 14/1.5; caption 12/1.4; badge 10 bold.
  - KPIs: 800 with tabular numbers.
- **Spacing:** 8pt grid (4/8/12/16/20/24/32/40/48/64). Page padding 32. List rows 16×20.
- **Radii:** 4 tags · 8 buttons/inputs/banners · 12 inset panels/toasts · 16 cards/dialogs · 24 sheet tops · full for pills, avatars and switches.
- **Shadows:** sticky `0 2px 8px /8%` · popover `0 4px 16px /12%` · modal `0 8px 24px /16%` · sheet `0 -4px 16px /10%`.

## Components used (from the LINE Watch DS)
Button (primary / secondary / tertiary / link; sm/md; icon, iconRight, fullWidth), IconButton (ghost/outline; badge), Input (icon, helper, error; sm), Select (filled/outline; sm), Checkbox, Switch, Tag (tone, dot, icon, selected, onRemove, onClick), Badge (notification/new/neutral), Avatar (square), ListRow, Banner (warning), Toast (success + action), Tabs (segmented), StatTile (delta, invert, icon), SentimentBar (showLegend, height), MentionItem, Icon (Lucide).

## Assets
- **Icons:** Lucide outline 0.460.0 (`https://unpkg.com/lucide-static@0.460.0/icons/<name>.svg`). This is a flagged substitution; swap in the company icon set if one exists.
- **Logos:** there are no logos or imagery. The wordmark is text, and source logos render as initial Avatars.

## Not yet designed
- Mobile layouts. The wireframes show the intent: bottom nav, bottom sheets, and Article/Analysis tabs.
- Loading and error states, notification centre, settings, drag-reorder in reports, real chart axes and tooltips.

## Files
- `LINE Watch Prototype.dc.html` — hi-fi prototype (logic in the `<script data-dc-script>` block: mock data, state, navigation)
- `LINE Watch Wireframes.dc.html` — lo-fi exploration
- `support.js` — runtime the `.dc.html` files need
- `_ds/line-watch-design-system-…/` — tokens, fonts, component bundle

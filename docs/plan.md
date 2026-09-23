# Build Plan

## Phase 0 — Target confirmation
- Primary target: Parchment-hosted games (iplayif.com and self-hosted instances).
- Confirm `window.GlkOte` is reachable as a page global on the target site.

## Phase 1 — Hook (bookmarklet)
- `hook/hook.js`: wraps `GlkOte.update`, forwards every payload via `postMessage`.
- `hook/bookmarklet.js`: the tiny `javascript:` URI that injects a `<script src="...hook.js">`
  tag into the current page (the "live" bookmarklet pattern — small, always up to date).
- Also capture outgoing player commands by listening on the game's input `<input>`/`<textarea>`
  element directly (submit/keydown), rather than trying to wrap game-defined accept logic.

## Phase 2 — Parser
- `parser/directions.js`: canonical direction alias table (n/north, u/up, enter X, etc).
- `parser/rooms.js`: room-name extraction — grid window line first, prose fallback second.
- `parser/exits.js`: edge inference — snapshot currentRoom before a movement command,
  compare after next update; only record an edge if the room actually changed.
- `parser/objects.js`: best-effort "you can see X, Y, and Z" extraction; flag low-confidence
  matches rather than trusting them silently.

## Phase 3 — Renderer (React PWA)
- Mobile-first responsive layout; media queries add a side panel at tablet/laptop widths.
- Graph state via React context/reducer, fed by parser output.
- D3 force layout + `d3-zoom` for pan/zoom, scoped to the graph's own `<svg>` (not a
  full-page overlay) to avoid trapping page scroll on touch devices.
- `ResizeObserver` on the graph container to recompute layout on resize/orientation change.
- Web App Manifest + service worker for installability and asset caching.

## Phase 4 — Bridging hook and renderer
- Same-tab mode: split-pane page hosting both the game iframe and the renderer, connected
  via `postMessage`.
- Cross-tab/device mode: `BroadcastChannel` for same-browser cross-tab, or a lightweight
  WebSocket relay if game and map need to live on genuinely different devices.

## Phase 5 — Robustness
- Per-interpreter-format parser profiles (Inform vs TADS vs ADRIFT prose conventions differ).
- Dedupe rooms by name, not by description hash (some games vary description text per visit).
- Never create an edge from prose pattern-matching alone — only from an actual observed
  room-name transition following a movement command.

## MVP scope cut
- Single target site (iplayif.com).
- Inform-only parsing heuristics.
- Grid-window room name only (skip prose fallback initially).
- Simple node-link SVG, append-in-visit-order, no smart layout yet.
- Objects only parsed on explicit `look` commands, not every buffer update.

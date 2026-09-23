# if-loupe

A live map viewer for interactive fiction. Peer into any Parchment-hosted IF game and watch
the room graph — exits, adjacency, and visible objects — build itself as you play.

## Architecture

if-loupe is split into two independent halves so it works across laptops, tablets, and
(with caveats) phones, without depending on any browser extension platform.

```
┌─────────────────────┐        postMessage /        ┌──────────────────────┐
│   Bookmarklet Hook   │  ──── BroadcastChannel ───▶ │   Loupe Renderer      │
│   (hook/)            │                              │   (app/)              │
│                       │                              │                       │
│ Wraps GlkOte.update   │                              │ React PWA             │
│ on the game page,     │                              │ Parses turns → graph  │
│ posts raw JSON turns  │                              │ Renders SVG map       │
└─────────────────────┘                              └──────────────────────┘
```

### Why this split

- **Hook**: a bookmarklet, not a Chrome extension. Bookmarklets work identically on
  desktop Chrome, Android browsers, and iOS Safari — no extension store, no install step
  beyond saving a bookmark. It loads a small hosted script that wraps `GlkOte.update`
  (the single function Parchment's interpreters use to paint every window) and forwards
  every turn's JSON payload before the default renderer touches it.
- **Renderer**: an ordinary responsive React PWA. Because it's decoupled from the hook,
  it can be installed to a home screen, opened full-screen on a tablet next to the game,
  or run in a second desktop window. It owns all the parsing and graph state.

### Data flow

1. Player loads an IF game in Parchment (e.g. iplayif.com).
2. Player clicks the if-loupe bookmarklet. It injects `hook.js` into the page's **main**
   JS world (required — GlkOte is a page global, invisible to an isolated content script).
3. `hook.js` wraps `GlkOte.update`, and on every call `postMessage`s the raw update JSON
   to the renderer (same tab via a split pane, or another tab/device via a relay channel).
4. The renderer's parser layer extracts room name (grid window), exits (movement command →
   room-name-change inference), and objects (best-effort text extraction) and updates a
   client-side graph.
5. The graph renders as an SVG force-directed map, redrawn incrementally per turn.

## Project layout

```
/hook           Bookmarklet source — the GlkOte.update wrapper
/parser         Pure functions: turn text -> {room, exits, objects} deltas
/app            React PWA — graph state, SVG rendering, responsive layout
/docs           Architecture notes and protocol references
```

## Status

Early scaffold. See `/docs/plan.md` for the full build plan and phased rollout.

## Non-goals (for now)

- No support for non-Parchment interpreters (native TADS/Hugo clients, etc.) — Parchment/
  GlkOte only, for now.
- No attempt to reconcile conditional/dynamic room logic that only exists in game code
  (e.g. a room that changes based on a flag) — the map reflects what's actually been
  observed at runtime, not a ground-truth compiled graph.
- No phone-first design yet; tablet and laptop are the primary targets.

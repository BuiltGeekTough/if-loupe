// Room name extraction from a GlkOte update payload.
//
// Strategy:
//   1. Primary: grid window content (classic Inform status-bar room name).
//   2. Fallback: first emphasized/bold run in buffer text right after a movement command.
//
// This is intentionally conservative for the MVP — only the grid-window strategy is
// wired up by default; the prose fallback is stubbed for later hardening per format.

function extractRoomNameFromGrid(update) {
  if (!update || !Array.isArray(update.content)) return null;

  const gridWindowIds = new Set(
    (update.windows || [])
      .filter((w) => w.type === "grid")
      .map((w) => w.id)
  );

  for (const contentEntry of update.content) {
    if (!gridWindowIds.has(contentEntry.id)) continue;
    if (!Array.isArray(contentEntry.lines) || contentEntry.lines.length === 0) continue;

    const firstLine = contentEntry.lines[0];
    if (!firstLine || !Array.isArray(firstLine.content)) continue;

    const text = firstLine.content
      .map((run) => (typeof run === "string" ? run : run.text || ""))
      .join("")
      .trim();

    if (text) return text;
  }
  return null;
}

// Stub — to be hardened against real game output during Phase 5.
function extractRoomNameFromProse(_bufferText) {
  return null;
}

module.exports = { extractRoomNameFromGrid, extractRoomNameFromProse };

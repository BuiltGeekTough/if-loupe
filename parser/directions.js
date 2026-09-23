// Canonical direction alias table used for exit inference.
// Maps every recognized input alias to a normalized direction key.

const DIRECTION_ALIASES = {
  n: "north", north: "north",
  s: "south", south: "south",
  e: "east", east: "east",
  w: "west", west: "west",
  ne: "northeast", northeast: "northeast",
  nw: "northwest", northwest: "northwest",
  se: "southeast", southeast: "southeast",
  sw: "southwest", southwest: "southwest",
  u: "up", up: "up",
  d: "down", down: "down",
  in: "in", enter: "in",
  out: "out", exit: "out",
};

function normalizeDirection(command) {
  if (!command) return null;
  const word = command.trim().toLowerCase().split(/\s+/)[0];
  return DIRECTION_ALIASES[word] || null;
}

module.exports = { DIRECTION_ALIASES, normalizeDirection };

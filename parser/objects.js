// Best-effort object extraction from buffer text.
// Matches conventional Inform/TADS "you can see X, Y and Z here" phrasing.
// Low-confidence by design -- treat results as hints, not ground truth.

const SEE_PATTERN = /you (?:can )?see (.+?) here\.?/i;

function extractObjectsFromText(text) {
  if (!text) return [];
  const match = text.match(SEE_PATTERN);
  if (!match) return [];

  const listPart = match[1]
    .replace(/,? and /gi, ", ")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return listPart;
}

module.exports = { extractObjectsFromText };

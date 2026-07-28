// SafeAI - free-text option matching.
// Pure: no DOM, no network. Resolves typed text against a fixed option list
// before we spend an API call on it. Anything this cannot resolve confidently
// falls through to POST /api/classify.

export const CONFIDENT = 0.6;

// Words too common to carry meaning on their own. Without this, "and" would
// match "Financial and Insurance Activities".
const STOP = new Set(['and', 'or', 'of', 'the', 'a', 'an', 'in', 'for', 'to', 'activities', 'services', 'service']);

export function normalise(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(s) {
  return normalise(s).split(' ').filter(t => t && !STOP.has(t));
}

export function fuzzyMatch(input, entries, synonyms = {}) {
  const norm = normalise(input);
  if (!norm) return null;

  // 1. Exact synonym hit. Synonyms are keyed on the normalised form.
  for (const [term, value] of Object.entries(synonyms)) {
    if (normalise(term) === norm) return { value, confidence: 1 };
  }

  // 2. Exact label hit.
  for (const e of entries) {
    if (normalise(e.label) === norm) return { value: e.value, confidence: 1 };
  }

  const inTokens = tokens(input);
  if (!inTokens.length) return null;

  // 3. Best token-overlap score.
  let best = null;
  for (const e of entries) {
    const labelTokens = tokens(e.label);
    if (!labelTokens.length) continue;
    const labelSet = new Set(labelTokens);
    const hits = inTokens.filter(t => labelSet.has(t)).length;
    if (!hits) continue;
    // Reward covering the input, and covering the label, but weight the input
    // more: "financial services" should find "Financial and Insurance Activities".
    const coverInput = hits / inTokens.length;
    const coverLabel = hits / labelTokens.length;
    const score = coverInput * 0.7 + coverLabel * 0.3;
    if (!best || score > best.confidence) best = { value: e.value, confidence: score };
  }

  if (best && best.confidence >= CONFIDENT) {
    return { value: best.value, confidence: Number(best.confidence.toFixed(3)) };
  }
  return null;
}

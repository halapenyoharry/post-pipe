// Canonical-label scoring. IMPORT-FREE ON PURPOSE: the viewer inlines this file so the
// weights can be changed live in the browser and the winning label re-chosen instantly.
//
// A concept has several variants (terms), e.g. "ai", "artificial intelligence", "machine intelligence".
// Each variant is scored on four independent parts, each in 0..1:
//   freq    how often it is used (log-scaled, relative to the most used variant)
//   cover   what share of the concept's tag-systems use it
//   trust   how much the TRUSTED systems favour it (per-system share of usage, weighted by system trust)
//   quality how clean it is as a display label (no hyphen/camelCase artifacts; expanded vs short preference)
// The canonical label is the variant with the highest weighted sum. All parts are returned so the
// choice is explainable and can be argued with.

export const DEFAULT_CANON = {
  weights: { freq: 0.35, cover: 0.25, trust: 0.25, quality: 0.15 },
  prefer: 'expanded', // expanded | short | neutral
};

function lengthPreference(v, prefer) {
  const single = v.tokens <= 1;
  const acro = single && v.acronym;
  if (prefer === 'neutral') return 0.8;
  if (prefer === 'short') return acro ? 1 : single ? 0.8 : v.tokens === 2 ? 0.65 : 0.5;
  return v.tokens >= 2 ? 1 : acro ? 0.5 : 0.8; // expanded
}

function cleanliness(label) {
  let c = 1;
  if (/[-_]/.test(label)) c -= 0.35;
  if (/[a-z][A-Z]/.test(label)) c -= 0.25;
  if (/[^\p{L}\p{N}\s'’&+#.-]/u.test(label)) c -= 0.2;
  return Math.max(0, c);
}

// The ranking pool: the spellings a human wrote, whenever there are any. A spelling only discovery
// proposed may join a concept but never outranks a human's; only a concept nobody wrote ranks among
// its own spellings. Every caller that picks a canonical (the stone, the viewer's live re-ranking)
// scores this pool, so the two never disagree.
export function rankingPool(variants) {
  return variants.some((v) => v.explicit > 0) ? variants.filter((v) => v.explicit > 0) : variants;
}

export function scoreVariants(variants, canon = DEFAULT_CANON, sourceWeights = {}) {
  const weights = { ...DEFAULT_CANON.weights, ...(canon.weights || {}) };
  const prefer = canon.prefer || 'expanded';
  const wsum = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

  const sources = new Set();
  const sourceTotal = {};
  let maxCount = 0;
  for (const v of variants) {
    maxCount = Math.max(maxCount, v.count);
    for (const [s, n] of Object.entries(v.bySource)) {
      sources.add(s);
      sourceTotal[s] = (sourceTotal[s] || 0) + n;
    }
  }
  const sw = (s) => (sourceWeights[s] === undefined ? 1 : sourceWeights[s]);
  const swSum = [...sources].reduce((a, s) => a + sw(s), 0) || 1;

  const ranked = variants.map((v) => {
    const vs = Object.keys(v.bySource);
    const parts = {
      freq: maxCount ? Math.log1p(v.count) / Math.log1p(maxCount) : 0,
      cover: sources.size ? vs.length / sources.size : 0,
      trust: [...sources].reduce((a, s) => a + sw(s) * ((v.bySource[s] || 0) / sourceTotal[s]), 0) / swSum,
      quality: 0.5 * lengthPreference(v, prefer) + 0.5 * cleanliness(v.label),
    };
    const score = (weights.freq * parts.freq + weights.cover * parts.cover + weights.trust * parts.trust + weights.quality * parts.quality) / wsum;
    return { norm: v.norm, label: v.label, score, parts };
  });
  ranked.sort((a, b) => b.score - a.score || (a.label < b.label ? -1 : 1));
  return ranked;
}

// pin: explicit canonical label chosen by a human; it wins regardless of score
export function canonicalOf(ranked, pin) {
  if (pin) return { label: pin, pinned: true };
  return { label: ranked[0].label, pinned: false };
}

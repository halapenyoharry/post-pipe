// Distributional evidence: two tags are used on texts that look alike.
// Capped low on purpose. Text similarity alone says "adjacent", not "identical";
// it only tips a merge when a lexical or curated signal is already present.
import { buildItemVectors, buildIdf, profileFor, candidatePairs } from '../text.js';
import { cosine, orderPair } from '../similarity.js';

export function textSignals(corpus, caps, { minCosine = 0.2 } = {}) {
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);
  const profiles = new Map();
  for (const t of corpus.terms.values()) profiles.set(t.norm, profileFor(t.items, vecs, idf));
  const out = [];
  for (const [x, y] of candidatePairs(profiles)) {
    const c = cosine(profiles.get(x), profiles.get(y));
    if (c < minCosine) continue;
    const n = Math.min(corpus.terms.get(x).count, corpus.terms.get(y).count);
    if (n < 2) continue; // a tag seen on one item has no distribution, only that item's text
    const shrink = (n - 1) / (n + 1); // 2 items: 0.33, 5: 0.67, 10: 0.82
    const [a, b] = orderPair(x, y);
    out.push({ a, b, signal: 'text', score: Math.min(caps.text, c * shrink), why: `used on similar texts (cosine ${c.toFixed(2)}, support ${n})` });
  }
  return out;
}

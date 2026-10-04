// Distributional evidence: two tags are used on texts that look alike.
// Capped low on purpose. Text similarity alone says "adjacent", not "identical";
// it only tips a merge when a lexical or curated signal is already present.
import { buildItemVectors, buildIdf, profileFor, candidatePairs } from '../text.js';
import { cosine, orderPair } from '../similarity.js';
import { entitySet } from '../corpus.js';

export function textSignals(corpus, caps, { minCosine = 0.2 } = {}) {
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);
  const profiles = new Map();
  const support = new Map();
  for (const t of corpus.terms.values()) {
    const entities = entitySet(corpus, t.items); // one essay in two tag-systems is one text, not two
    profiles.set(t.norm, profileFor(entities, vecs, idf));
    support.set(t.norm, entities.size);
  }
  const out = [];
  for (const [x, y] of candidatePairs(profiles)) {
    const c = cosine(profiles.get(x), profiles.get(y));
    if (c < minCosine) continue;
    const n = Math.min(support.get(x), support.get(y));
    if (n < 2) continue; // a tag seen on one item has no distribution, only that item's text
    const shrink = (n - 1) / (n + 1); // 2 items: 0.33, 5: 0.67, 10: 0.82
    const [a, b] = orderPair(x, y);
    out.push({ a, b, signal: 'text', score: Math.min(caps.text, c * shrink), why: `used on similar texts (cosine ${c.toFixed(2)}, support ${n})` });
  }
  return out;
}

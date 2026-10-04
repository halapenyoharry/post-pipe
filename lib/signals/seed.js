// Curated knowledge: groups of labels a human (or a shipped seed list) says are the same.
// Only terms actually present in the corpus produce evidence.
import { normalizeLabel } from '../normalize.js';
import { orderPair } from '../similarity.js';

export function seedSignals(corpus, caps, seeds = []) {
  const out = [];
  for (const seed of seeds) {
    for (const group of seed.same ?? []) {
      const present = [...new Set(group.map((l) => normalizeLabel(l).norm))].filter((n) => corpus.terms.has(n));
      for (let i = 0; i < present.length; i++) {
        for (let j = i + 1; j < present.length; j++) {
          const [a, b] = orderPair(present[i], present[j]);
          out.push({ a, b, signal: 'seed', score: caps.seed, why: `curated: ${group.join(' = ')}` });
        }
      }
    }
  }
  return out;
}

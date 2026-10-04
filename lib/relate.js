// Concept <-> concept relations. Everything here is computed from usage, no model:
//   broader   A is broader than B  (subsumption: A appears wherever B appears, not vice versa;
//                                   Sanderson & Croft 1999 — P(A|B) >= 0.8, P(B|A) < 0.6)
//   related   A and B co-occur more than chance predicts (normalized PMI)
//   adjacent  A and B are used on texts that look alike but are not co-tagged: the
//             cross-vocabulary neighbour that no shared label would ever reveal
// Human-authored relations (synergy, opposes, containment, …) are merged in by stone.js and win.
import { buildItemVectors, buildIdf, profileFor, candidatePairs } from './text.js';
import { cosine, pairKey } from './similarity.js';
import { entitySet } from './corpus.js';

export function deriveRelations(corpus, concepts, cfg) {
  const R = cfg.relate;
  const itemsOf = new Map();
  const conceptsOf = new Map();
  for (const c of concepts) {
    // items are counted as distinct real-world things: the same essay in two tag-systems is one
    const set = entitySet(corpus, [...c.terms].flatMap((norm) => [...corpus.terms.get(norm).items]));
    itemsOf.set(c.id, set);
    for (const k of set) {
      if (!conceptsOf.has(k)) conceptsOf.set(k, []);
      conceptsOf.get(k).push(c.id);
    }
  }
  const N = conceptsOf.size || 1;

  const together = new Map();
  for (const ids of conceptsOf.values()) {
    if (ids.length < 2 || ids.length > 40) continue;
    const sorted = [...ids].sort();
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const k = `${sorted[i]}\u0000${sorted[j]}`;
        together.set(k, (together.get(k) ?? 0) + 1);
      }
    }
  }

  const out = new Map();
  const put = (a, b, type, weight, evidence) => {
    const key = type === 'broader' ? `${a}\u0000${b}\u0000broader` : `${pairKey(a, b)}\u0000${type}`;
    out.set(key, { a, b, type, weight: Number(weight.toFixed(4)), evidence, locked: false });
  };
  const covered = new Set();

  for (const [k, n] of together) {
    const [x, y] = k.split('\u0000');
    const nx = itemsOf.get(x).size;
    const ny = itemsOf.get(y).size;
    const pXgY = n / ny;
    const pYgX = n / nx;
    let made = false;
    if (ny >= R.minSupport && pXgY >= R.broaderP && pYgX <= R.narrowerMaxP && nx > ny) {
      put(x, y, 'broader', pXgY, { n, na: nx, nb: ny });
      made = true;
    } else if (nx >= R.minSupport && pYgX >= R.broaderP && pXgY <= R.narrowerMaxP && ny > nx) {
      put(y, x, 'broader', pYgX, { n, na: ny, nb: nx });
      made = true;
    }
    if (!made && n >= R.minCooc) {
      const pab = n / N;
      const npmi = Math.log(pab / ((nx / N) * (ny / N))) / -Math.log(pab);
      if (Number.isFinite(npmi) && npmi >= R.minNpmi) {
        put(x, y, 'related', npmi * (n / (n + 1)), { n, na: nx, nb: ny, npmi: Number(npmi.toFixed(3)) });
        made = true;
      }
    }
    if (made) covered.add(pairKey(x, y));
  }

  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);
  const profiles = new Map();
  for (const c of concepts) profiles.set(c.id, profileFor(itemsOf.get(c.id), vecs, idf));
  for (const [x, y] of candidatePairs(profiles)) {
    // adjacent = never co-tagged. A pair already sharing an item is connected through that item.
    if (covered.has(pairKey(x, y)) || together.has(pairKey(x, y))) continue;
    const cos = cosine(profiles.get(x), profiles.get(y));
    if (cos < R.minAdjacent) continue;
    const nx = itemsOf.get(x).size;
    const ny = itemsOf.get(y).size;
    const n = Math.min(nx, ny);
    put(x, y, 'adjacent', cos * (n / (n + 1.5)), { cosine: Number(cos.toFixed(3)), na: nx, nb: ny });
  }

  // keep each concept's strongest K relations; an edge survives if either endpoint keeps it
  const all = [...out.values()];
  const keep = new Set();
  const byConcept = new Map();
  for (const r of all) {
    for (const id of [r.a, r.b]) {
      if (!byConcept.has(id)) byConcept.set(id, []);
      byConcept.get(id).push(r);
    }
  }
  for (const list of byConcept.values()) {
    list.sort((p, q) => q.weight - p.weight);
    for (const r of list.slice(0, R.perConcept)) keep.add(r);
  }
  return all
    .filter((r) => keep.has(r))
    .sort((p, q) => (p.a + p.b + p.type < q.a + q.b + q.type ? -1 : 1));
}

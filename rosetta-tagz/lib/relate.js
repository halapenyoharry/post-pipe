// Concept <-> concept relations. Everything here is computed from usage and text, no model:
//   broader   A is broader than B. Two derivations, which may corroborate each other:
//               usage    subsumption: A appears wherever B appears, not vice versa
//                        (Sanderson & Croft 1999 — P(A|B) >= 0.8, P(B|A) <= 0.6, B on >= 3 items)
//               lexical  the words of A are a proper subset of the words of B ("brain" ⊂ "brain scans"),
//                        corroborated by usage: P(A|B) >= lexicalBroader.minP on >= minN shared items
//   related   A and B co-occur more than chance predicts (normalized PMI)
//   adjacent  A and B are used on texts that look alike but are not co-tagged: the
//             cross-vocabulary neighbour that no shared label would ever reveal
// Every relation says why in plain words (`why`), what it was derived from (`wasDerivedFrom`) and
// which activity made it with which thresholds (`wasGeneratedBy`). Co-tagged pairs also record the
// text cosine of the two concepts' profiles (`evidence.cosine`) so a later pass can tell a related
// pair with text support from one without. SKOS typing (closeMatch, broadMatch, relatedMatch) is
// stone.js's job: it needs to know the schemes, which this file does not.
// Human-authored relations (synergy, opposes, containment, …) are merged in by stone.js and win.
import { buildItemVectors, buildIdf, profileFor, candidatePairs } from './text.js';
import { cosine, pairKey } from './similarity.js';
import { entitySet } from './corpus.js';

const p2 = (x) => x.toFixed(2);
const quote = (s) => `"${s}"`;

export function deriveRelations(corpus, concepts, cfg) {
  const R = cfg.relate;
  const LB = R.lexicalBroader ?? { minP: 0.5, minN: 2 };
  const labelOf = new Map(concepts.map((c) => [c.id, c.label ?? c.id]));
  const name = (id) => quote(labelOf.get(id) ?? id);
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
  const shared = (x, y) => together.get(pairKey(x, y)) ?? 0;

  // text profiles first: co-tagged pairs record their cosine, and adjacency needs them anyway
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);
  const profiles = new Map();
  for (const c of concepts) profiles.set(c.id, profileFor(itemsOf.get(c.id), vecs, idf));
  const cosineOf = (x, y) => {
    const px = profiles.get(x);
    const py = profiles.get(y);
    if (!px?.size || !py?.size) return null;
    return Number(cosine(px, py).toFixed(3));
  };

  const out = new Map();
  const relKey = (a, b, type) => (type === 'broader' ? `${a}\u0000${b}\u0000broader` : `${pairKey(a, b)}\u0000${type}`);
  const put = (a, b, type, weight, evidence, why, wasDerivedFrom, parameters) => {
    const cos = type === 'adjacent' ? null : cosineOf(a, b);
    out.set(relKey(a, b, type), {
      a,
      b,
      type,
      weight: Number(weight.toFixed(4)),
      evidence: cos === null ? evidence : { ...evidence, cosine: cos },
      locked: false,
      why,
      wasDerivedFrom,
      wasGeneratedBy: { activity: 'relate', parameters },
    });
  };
  const covered = new Set();

  const usageBroader = (a, b, n) => {
    const na = itemsOf.get(a).size;
    const nb = itemsOf.get(b).size;
    put(
      a, b, 'broader', n / nb,
      { n, na, nb, derivation: ['usage'] },
      `${name(a)} is broader than ${name(b)} by usage: ${n} of ${nb} ${labelOf.get(b)} items also carry ${labelOf.get(a)} (P=${p2(n / nb)}), while only ${n} of ${na} ${labelOf.get(a)} items carry ${labelOf.get(b)} (P=${p2(n / na)})`,
      [{ type: 'cooccurrence', items: n }],
      { minSupport: R.minSupport, broaderP: R.broaderP, narrowerMaxP: R.narrowerMaxP },
    );
  };

  for (const [k, n] of together) {
    const [x, y] = k.split('\u0000');
    const nx = itemsOf.get(x).size;
    const ny = itemsOf.get(y).size;
    const pXgY = n / ny;
    const pYgX = n / nx;
    let made = false;
    if (ny >= R.minSupport && pXgY >= R.broaderP && pYgX <= R.narrowerMaxP && nx > ny) {
      usageBroader(x, y, n);
      made = true;
    } else if (nx >= R.minSupport && pYgX >= R.broaderP && pXgY <= R.narrowerMaxP && ny > nx) {
      usageBroader(y, x, n);
      made = true;
    }
    if (!made && n >= R.minCooc) {
      const pab = n / N;
      const npmi = Math.log(pab / ((nx / N) * (ny / N))) / -Math.log(pab);
      if (Number.isFinite(npmi) && npmi >= R.minNpmi) {
        put(
          x, y, 'related', npmi * (n / (n + 1)),
          { n, na: nx, nb: ny, npmi: Number(npmi.toFixed(3)) },
          `${name(x)} and ${name(y)} share ${n} of their ${nx} and ${ny} items, more than chance predicts (NPMI ${npmi.toFixed(2)})`,
          [{ type: 'cooccurrence', items: n }],
          { minNpmi: R.minNpmi, minCooc: R.minCooc },
        );
        made = true;
      }
    }
    if (made) covered.add(pairKey(x, y));
  }

  // lexical broader: the words of A are a proper subset of the words of B, and usage agrees.
  // Candidates are blocked by A's first stem (B must contain it), so the pass stays near-linear.
  const stemSets = new Map(); // cid -> [{stems:Set, norm}]
  const byStem = new Map(); // stem -> Set<cid> whose some variant contains it
  for (const c of concepts) {
    const sets = [];
    for (const norm of c.terms) {
      const t = corpus.terms.get(norm);
      const stems = new Set(t.stems);
      sets.push({ stems, norm, first: t.stems[0] });
      for (const s of stems) (byStem.get(s) ?? byStem.set(s, new Set()).get(s)).add(c.id);
    }
    stemSets.set(c.id, sets);
  }
  const visited = new Set(); // a pair is judged once, whichever of A's spellings the words came from
  for (const c of concepts) {
    for (const va of stemSets.get(c.id)) {
      if (!va.first) continue;
      for (const other of byStem.get(va.first) ?? []) {
        if (other === c.id) continue;
        const vb = stemSets.get(other).find((v) => v.stems.size > va.stems.size && [...va.stems].every((s) => v.stems.has(s)));
        if (!vb) continue;
        const a = c.id; // the shorter label is the broader one: "brain" ⊃ "brain scans"
        const b = other;
        const key = relKey(a, b, 'broader');
        if (visited.has(key)) continue;
        visited.add(key);
        // usage already put the hierarchy the other way round (B wherever A, P >= broaderP): the words
        // alone (P >= minP, a lower bar) do not overturn it, and a hierarchy never runs both ways
        if (out.has(relKey(b, a, 'broader'))) continue;
        const n = shared(a, b);
        const nb = itemsOf.get(b).size;
        const p = nb ? n / nb : 0;
        if (n < LB.minN || p < LB.minP) continue;
        const stemKey = [...va.stems].join(' ');
        const contains = `${name(b)} contains the words of ${name(a)}; ${n} of ${nb} ${labelOf.get(b)} items also carry ${labelOf.get(a)} (P=${p2(p)})`;
        const have = out.get(key);
        if (have) {
          // usage already made it: the words corroborate, the relation stays one
          have.evidence.derivation = [...new Set([...(have.evidence.derivation ?? []), 'lexical'])];
          have.evidence.stem = stemKey;
          have.why = `${have.why}; and ${name(b)} contains the words of ${name(a)}`;
          have.wasDerivedFrom.push({ type: 'stem', key: stemKey });
          have.wasGeneratedBy.parameters.lexicalBroader = { minP: LB.minP, minN: LB.minN };
          continue;
        }
        // SKOS keeps `related` and `broader` apart (S27): the hierarchy, now known, replaces the
        // weaker symmetric reading of the same pair; the replacement is recorded, not silent
        const replaced = out.delete(relKey(a, b, 'related'));
        put(
          a, b, 'broader', p,
          { n, na: itemsOf.get(a).size, nb, derivation: ['lexical'], stem: stemKey, ...(replaced ? { replaced: 'related' } : {}) },
          contains,
          [{ type: 'cooccurrence', items: n }, { type: 'stem', key: stemKey }],
          { lexicalBroader: { minP: LB.minP, minN: LB.minN } },
        );
        covered.add(pairKey(a, b));
      }
    }
  }

  for (const [x, y] of candidatePairs(profiles)) {
    // adjacent = never co-tagged. A pair already sharing an item is connected through that item.
    if (covered.has(pairKey(x, y)) || together.has(pairKey(x, y))) continue;
    const cos = cosine(profiles.get(x), profiles.get(y));
    if (cos < R.minAdjacent) continue;
    const nx = itemsOf.get(x).size;
    const ny = itemsOf.get(y).size;
    const n = Math.min(nx, ny);
    put(
      x, y, 'adjacent', cos * (n / (n + 1.5)),
      { cosine: Number(cos.toFixed(3)), na: nx, nb: ny },
      `${name(x)} and ${name(y)} are used on texts that read alike (cosine ${cos.toFixed(2)}) but never on the same item (${nx} and ${ny} items)`,
      [{ type: 'text', cosine: Number(cos.toFixed(3)) }],
      { minAdjacent: R.minAdjacent },
    );
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

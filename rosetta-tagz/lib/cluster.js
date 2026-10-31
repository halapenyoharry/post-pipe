// Terms -> concepts. Agglomerative clustering over combined pair confidence, with
// human locks (must-link / cannot-link) honoured absolutely.
import { noisyOr, pairKey, orderPair } from './similarity.js';

// Signals that are structural or curated are never penalised by co-occurrence.
// Distributional / fuzzy / external ones are.
const PROTECTED = new Set(['stem', 'tokenset', 'seed', 'anchor']);

export function aggregatePairs(records, cfg) {
  const pairs = new Map();
  for (const r of records) {
    const [a, b] = orderPair(r.a, r.b);
    if (a === b) continue;
    const key = pairKey(a, b);
    let p = pairs.get(key);
    if (!p) pairs.set(key, (p = { a, b, by: {} }));
    const w = cfg.signalWeights?.[r.signal] ?? 1;
    const score = Math.min(1, r.score * w);
    const prev = p.by[r.signal];
    if (!prev || score > prev.score) p.by[r.signal] = { score, why: r.why };
  }
  return pairs;
}

// highest share of the smaller tag set that co-occurs on the same items, within one tag-system
function sameSourceCooccurrence(ta, tb) {
  let best = 0;
  for (const [src, setA] of ta.itemsBySource) {
    const setB = tb.itemsBySource.get(src);
    if (!setB) continue;
    let both = 0;
    const [small, big] = setA.size < setB.size ? [setA, setB] : [setB, setA];
    for (const k of small) if (big.has(k)) both++;
    best = Math.max(best, both / Math.min(setA.size, setB.size));
  }
  return best;
}

export function pairConfidence(p, corpus, cfg) {
  const prot = [];
  const soft = [];
  for (const [sig, v] of Object.entries(p.by)) (PROTECTED.has(sig) ? prot : soft).push(v.score);
  const r = soft.length ? sameSourceCooccurrence(corpus.terms.get(p.a), corpus.terms.get(p.b)) : 0;
  const softConf = noisyOr(soft) * (1 - cfg.antiSynonymPenalty * r);
  return { conf: noisyOr([noisyOr(prot), softConf]), coocRatio: r };
}

export function resolveConcepts(corpus, signalRecords, cfg, locks = { same: [], notSame: [] }) {
  const pairs = aggregatePairs(signalRecords, cfg);
  const conf = new Map();
  const detail = new Map();
  for (const [key, p] of pairs) {
    if (!corpus.terms.has(p.a) || !corpus.terms.has(p.b)) continue;
    const pc = pairConfidence(p, corpus, cfg);
    conf.set(key, pc.conf);
    detail.set(key, { a: p.a, b: p.b, conf: pc.conf, coocRatio: pc.coocRatio, signals: p.by });
  }

  const members = new Map(); // cid -> {set:Set<norm>, locked}
  const of = new Map(); // norm -> cid
  let n = 0;
  for (const norm of [...corpus.terms.keys()].sort()) {
    const cid = n++;
    members.set(cid, { set: new Set([norm]), locked: false });
    of.set(norm, cid);
  }
  const merge = (ca, cb, locked) => {
    if (ca === cb) return;
    const A = members.get(ca);
    const B = members.get(cb);
    for (const m of B.set) {
      A.set.add(m);
      of.set(m, ca);
    }
    A.locked = A.locked || B.locked || locked;
    members.delete(cb);
  };

  const cannot = new Set();
  for (const [x, y] of locks.notSame) if (corpus.terms.has(x) && corpus.terms.has(y)) cannot.add(pairKey(x, y));
  const blocked = (A, B) => {
    if (!cannot.size) return false;
    for (const x of A) for (const y of B) if (cannot.has(pairKey(x, y))) return true;
    return false;
  };

  for (const group of locks.same) {
    const present = group.filter((x) => corpus.terms.has(x));
    for (let i = 1; i < present.length; i++) merge(of.get(present[0]), of.get(present[i]), true);
  }

  const ordered = [...detail.values()]
    .filter((d) => d.conf >= cfg.mergeThreshold)
    .sort((x, y) => y.conf - x.conf || (x.a + x.b < y.a + y.b ? -1 : 1));

  for (const d of ordered) {
    const ca = of.get(d.a);
    const cb = of.get(d.b);
    if (ca === cb) continue;
    const A = members.get(ca);
    const B = members.get(cb);
    if (A.set.size + B.set.size > cfg.maxClusterSize) continue;
    if (blocked(A.set, B.set)) continue;
    if (cfg.link === 'average') {
      let sum = 0;
      for (const x of A.set) for (const y of B.set) sum += conf.get(pairKey(x, y)) ?? 0;
      if (sum / (A.set.size * B.set.size) < cfg.mergeThreshold) continue;
    }
    merge(ca, cb, false);
  }

  const clusters = [...members.values()].map((m) => {
    const norms = [...m.set].sort();
    const links = [];
    for (let i = 0; i < norms.length; i++) {
      for (let j = i + 1; j < norms.length; j++) {
        const d = detail.get(pairKey(norms[i], norms[j]));
        if (d && d.conf > 0) links.push(d);
      }
    }
    links.sort((x, y) => y.conf - x.conf);
    return { terms: norms, locked: m.locked, links };
  });
  clusters.sort((x, y) => (x.terms[0] < y.terms[0] ? -1 : 1));
  return { clusters, pairDetail: detail };
}

// The second pass, for spellings only below-bar evidence wrote (rtz-discover's floor). `early` is
// what resolveConcepts made from the at-bar corpus, exactly as a build at the bar makes it; `corpus`
// and `signalRecords` hold everything. A late spelling may join a concept at the bar or form its own
// with other late spellings, by the same rules (merge threshold, link, size, human locks), but two
// clusters that both hold at-bar spellings never merge here, and nothing at the bar is moved: an
// at-bar concept keeps every member and link it had, late members and their links are added after.
export function attachLate(early, corpus, signalRecords, cfg, locks = { same: [], notSame: [] }) {
  const isEarly = new Set(early.clusters.flatMap((c) => c.terms));
  const pairs = aggregatePairs(signalRecords, cfg);
  const conf = new Map();
  const detail = new Map();
  for (const [key, p] of pairs) {
    if (!corpus.terms.has(p.a) || !corpus.terms.has(p.b)) continue;
    if (isEarly.has(p.a) && isEarly.has(p.b)) continue; // decided at the bar
    const pc = pairConfidence(p, corpus, cfg);
    conf.set(key, pc.conf);
    detail.set(key, { a: p.a, b: p.b, conf: pc.conf, coocRatio: pc.coocRatio, signals: p.by });
  }

  const members = new Map(); // cid -> {set, locked, early, links}
  const of = new Map();
  early.clusters.forEach((cl, cid) => {
    members.set(cid, { set: new Set(cl.terms), locked: cl.locked, early: true, links: cl.links });
    for (const n of cl.terms) of.set(n, cid);
  });
  let n = early.clusters.length;
  for (const norm of [...corpus.terms.keys()].filter((x) => !isEarly.has(x)).sort()) {
    members.set(n, { set: new Set([norm]), locked: false, early: false, links: [] });
    of.set(norm, n++);
  }
  const merge = (ca, cb, locked) => {
    if (ca === cb) return;
    const A = members.get(ca);
    const B = members.get(cb);
    if (A.early && B.early) return;
    const [keep, gone] = B.early ? [B, A] : [A, B]; // an at-bar cluster keeps its place
    const keepId = B.early ? cb : ca;
    for (const m of gone.set) {
      keep.set.add(m);
      of.set(m, keepId);
    }
    if (!keep.early) keep.locked = keep.locked || gone.locked || locked; // an at-bar concept stays as the bar made it
    members.delete(B.early ? ca : cb);
  };
  const cannot = new Set();
  for (const [x, y] of locks.notSame) if (corpus.terms.has(x) && corpus.terms.has(y)) cannot.add(pairKey(x, y));
  const blocked = (A, B) => {
    for (const x of A) for (const y of B) if (cannot.has(pairKey(x, y))) return true;
    return false;
  };
  for (const group of locks.same) {
    const present = group.filter((x) => corpus.terms.has(x));
    if (!present.some((x) => !isEarly.has(x))) continue; // applied at the bar already
    for (let i = 1; i < present.length; i++) merge(of.get(present[0]), of.get(present[i]), true);
  }
  const ordered = [...detail.values()]
    .filter((d) => d.conf >= cfg.mergeThreshold)
    .sort((x, y) => y.conf - x.conf || (x.a + x.b < y.a + y.b ? -1 : 1));
  for (const d of ordered) {
    const ca = of.get(d.a);
    const cb = of.get(d.b);
    if (ca === cb) continue;
    const A = members.get(ca);
    const B = members.get(cb);
    if (A.early && B.early) continue;
    if (A.set.size + B.set.size > cfg.maxClusterSize) continue;
    if (blocked(A.set, B.set)) continue;
    if (cfg.link === 'average') {
      let sum = 0;
      for (const x of A.set) for (const y of B.set) sum += conf.get(pairKey(x, y)) ?? 0;
      if (sum / (A.set.size * B.set.size) < cfg.mergeThreshold) continue;
    }
    merge(ca, cb, false);
  }

  const clusters = [...members.values()].map((m) => {
    const norms = [...m.set].sort();
    const late = [];
    for (let i = 0; i < norms.length; i++) {
      for (let j = i + 1; j < norms.length; j++) {
        const d = detail.get(pairKey(norms[i], norms[j]));
        if (d && d.conf > 0) late.push(d);
      }
    }
    late.sort((x, y) => y.conf - x.conf);
    return { terms: norms, early: norms.filter((x) => isEarly.has(x)), locked: m.locked, links: [...m.links, ...late] };
  });
  clusters.sort((x, y) => (x.terms[0] < y.terms[0] ? -1 : 1));
  return { clusters, pairDetail: new Map([...early.pairDetail, ...detail]) };
}

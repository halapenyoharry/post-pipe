// The stone itself: concepts (clusters of equivalent tags across tag-systems), each with a
// canonical label chosen by weight, plus relations between concepts.
//
// overrides.json (human-edited, never overwritten by the engine) wins over everything computed:
//   { "pin":       { "ai": "Artificial Intelligence" },      canonical label for the concept containing "ai"
//     "same":      [["ai", "artificial intelligence"]],       must merge
//     "notSame":   [["ai", "air"]],                           must never merge
//     "relations": [{"a":"ai","b":"labor","type":"synergy"}],  broader|related|adjacent|synergy|opposes|contains
//     "ignore":    ["untagged"],                              drop these tags entirely
//     "sourceWeights": {"ScienceDaily": 0.4},                 trust per tag-system
//     "canon":     {"weights": {...}, "prefer": "short"} }
// Seeds use the same shape (same/broader/related) but are evidence, not commands.
import { makeConfig } from './config.js';
import { normalizeLabel, slugify } from './normalize.js';
import { loadCorpus, displayForm, preferredForm, SITE_SCHEME } from './corpus.js';
import { computeSignals } from './signals/index.js';
import { resolveConcepts } from './cluster.js';
import { scoreVariants, canonicalOf, rankingPool } from './canon.js';
import { deriveRelations } from './relate.js';

export const STONE_SCHEMA = 'rosetta-tagz/stone@1';

const normOf = (label) => normalizeLabel(label).norm;

function labelGroups(groups = []) {
  return groups.map((g) => [...new Set(g.map(normOf))].filter(Boolean)).filter((g) => g.length > 1);
}

// One concept, seen from every scheme that wrote any of its spellings (SKOS: inScheme, prefLabel,
// altLabel). A scheme's prefLabel is the spelling that scheme used most, as written; its altLabel
// is every other spelling it wrote. The `site` scheme is always present: its prefLabel is the
// canonical and its altLabel every other spelling anyone wrote. Nothing here is invented.
// (Also used by the universe for its unmapped `u_` concepts; a form filed under `site` itself, which
// only an emergent label on a stale stone does, counts toward the site scheme alone.)
export function schemeLabels(variants, canonical) {
  const formsByScheme = new Map();
  for (const v of variants) {
    for (const [scheme, forms] of Object.entries(v.formsBySource)) {
      if (!formsByScheme.has(scheme)) formsByScheme.set(scheme, {});
      const acc = formsByScheme.get(scheme);
      for (const [raw, n] of Object.entries(forms)) acc[raw] = (acc[raw] ?? 0) + n;
    }
  }
  const inScheme = [...formsByScheme.keys()].filter((s) => s !== SITE_SCHEME).sort();
  const prefLabel = {};
  const altLabel = {};
  for (const scheme of inScheme) {
    const forms = formsByScheme.get(scheme);
    prefLabel[scheme] = preferredForm(forms);
    altLabel[scheme] = Object.keys(forms).filter((raw) => raw !== prefLabel[scheme]).sort();
  }
  const allForms = new Set(variants.flatMap((v) => Object.keys(v.forms)));
  inScheme.push(SITE_SCHEME);
  prefLabel[SITE_SCHEME] = canonical;
  altLabel[SITE_SCHEME] = [...allForms].filter((raw) => raw !== canonical).sort();
  return { inScheme, prefLabel, altLabel };
}

export function buildStone(records, { cfg: userCfg = {}, overrides = {}, seeds = [], extraSignals = [], builtin = true, now = null } = {}) {
  const cfg = makeConfig(userCfg, overrides.config, { canon: overrides.canon, sourceWeights: overrides.sourceWeights });
  const ignore = new Set((overrides.ignore ?? []).map(normOf));
  const corpus = loadCorpus(records, { ignore });

  const signals = [...(builtin ? computeSignals(corpus, cfg, { seeds }) : []), ...extraSignals];
  const locks = { same: labelGroups(overrides.same), notSame: labelGroups(overrides.notSame) };
  locks.notSame = locks.notSame.flatMap((g) => g.flatMap((x, i) => g.slice(i + 1).map((y) => [x, y])));
  const { clusters, pairDetail } = resolveConcepts(corpus, signals, cfg, locks);

  const pinByNorm = new Map(Object.entries(overrides.pin ?? {}).map(([k, v]) => [normOf(k), v]));
  const usedIds = new Set();
  const conceptOfNorm = new Map();
  const concepts = clusters.map((cl) => {
    let id = `c_${slugify(cl.terms[0])}`;
    while (usedIds.has(id)) id += '_';
    usedIds.add(id);
    const variants = cl.terms.map((norm) => {
      const t = corpus.terms.get(norm);
      return {
        norm,
        label: displayForm(t),
        forms: Object.fromEntries([...t.forms.entries()].sort()),
        formsBySource: Object.fromEntries([...t.formsBySource.entries()].sort().map(([s, m]) => [s, Object.fromEntries([...m.entries()].sort())])),
        count: t.count,
        explicit: t.explicit,
        bySource: Object.fromEntries([...t.bySource.entries()].sort()),
        acronym: t.acronymLike,
        tokens: t.tokens.length,
      };
    });
    // The canonical is chosen among the spellings a human wrote whenever there are any: a
    // spelling only discovery proposed may join the concept, but it never outranks a human's.
    const rank = scoreVariants(rankingPool(variants), cfg.canon, cfg.sourceWeights);
    const pin = cl.terms.map((n) => pinByNorm.get(n)).find(Boolean);
    const canonical = canonicalOf(rank, pin);
    const { inScheme, prefLabel, altLabel } = schemeLabels(variants, canonical.label);
    const itemSet = new Set();
    const perSource = {};
    for (const norm of cl.terms) {
      const t = corpus.terms.get(norm);
      for (const k of t.items) itemSet.add(k);
    }
    for (const k of itemSet) {
      const s = corpus.items.get(k).source;
      perSource[s] = (perSource[s] ?? 0) + 1;
    }
    for (const norm of cl.terms) conceptOfNorm.set(norm, id);
    return {
      id,
      canonical: canonical.label,
      pinned: canonical.pinned,
      locked: cl.locked,
      discovered: variants.every((v) => v.explicit === 0), // only ever proposed by rtz-discover, never written by a human
      inScheme,
      prefLabel,
      altLabel,
      items: itemSet.size,
      sources: perSource,
      variants,
      rank,
      links: cl.links.slice(0, 24).map((l) => ({ a: l.a, b: l.b, conf: Number(l.conf.toFixed(3)), cooc: Number(l.coocRatio.toFixed(2)), signals: l.signals })),
    };
  });

  const conceptRefs = clusters.map((cl, i) => ({ id: concepts[i].id, terms: cl.terms }));
  const derived = [...deriveRelations(corpus, conceptRefs, cfg), ...nearRelations(pairDetail, conceptOfNorm, cfg)];
  const aliasGroups = seeds.flatMap((s) => labelGroups(s.same));
  const conceptFor = (label) => {
    const n = normOf(label);
    if (conceptOfNorm.has(n)) return conceptOfNorm.get(n);
    const group = aliasGroups.find((g) => g.includes(n)); // "artificial general intelligence" -> corpus only has "agi"
    return group?.map((x) => conceptOfNorm.get(x)).find(Boolean);
  };
  const relations = mergeManualRelations(derived, [...seeds.flatMap(seedRelations), ...(overrides.relations ?? [])], conceptFor, overrides.relations);

  // A system's distinct tags are the terms on any of its items, from any origin (`bySource` is keyed
  // by scheme, so it cannot say this: a discovered spelling on a wire item sits under `discovered`).
  const systems = {};
  const sourcesOfTerm = [...corpus.terms.values()].map((t) => new Set([...t.items].map((k) => corpus.items.get(k).source)));
  for (const s of corpus.sources.values()) {
    systems[s.name] = {
      items: s.items.size,
      tagged: s.tagged.size,
      untagged: s.items.size - s.tagged.size,
      occurrences: s.occurrences,
      distinctTags: sourcesOfTerm.filter((srcs) => srcs.has(s.name)).length,
      weight: cfg.sourceWeights[s.name] ?? 1,
      color: s.color,
    };
  }

  const merged = concepts.filter((c) => c.variants.length > 1);
  return {
    schema: STONE_SCHEMA,
    generated: now,
    config: { mergeThreshold: cfg.mergeThreshold, link: cfg.link, canon: cfg.canon, sourceWeights: cfg.sourceWeights, signals: cfg.signals },
    stats: {
      tags: corpus.terms.size,
      concepts: concepts.length,
      merged: merged.length,
      tagsFolded: corpus.terms.size - concepts.length,
      relations: relations.length,
      items: corpus.items.size,
    },
    systems,
    concepts,
    relations,
  };
}

// Pairs with real evidence of being the SAME but not enough to merge: the review queue.
// Needs an identity-oriented signal (spelling, initials, curated, or a strong shared-item anchor).
// Similar usage alone (text) only ever says "adjacent", and corroborates; it never qualifies a pair.
const IDENTITY_SIGNALS = new Set(['stem', 'tokenset', 'edit', 'acronym', 'seed']);
const STRONG_ANCHOR = 0.45;

function nearRelations(pairDetail, conceptOfNorm, cfg) {
  const best = new Map();
  for (const d of pairDetail.values()) {
    if (d.conf < cfg.nearThreshold) continue;
    const ca = conceptOfNorm.get(d.a);
    const cb = conceptOfNorm.get(d.b);
    if (!ca || !cb || ca === cb) continue;
    const kinds = Object.keys(d.signals);
    const identity = kinds.some((k) => IDENTITY_SIGNALS.has(k) || !['text', 'anchor'].includes(k));
    const anchored = (d.signals.anchor?.score ?? 0) >= STRONG_ANCHOR;
    if (!identity && !anchored) continue;
    const [x, y] = ca < cb ? [ca, cb] : [cb, ca];
    const key = `${x}\u0000${y}`;
    if (best.has(key) && best.get(key).weight >= d.conf) continue;
    best.set(key, {
      a: x,
      b: y,
      type: 'near',
      weight: Number(d.conf.toFixed(4)),
      evidence: { terms: [d.a, d.b], signals: Object.fromEntries(Object.entries(d.signals).map(([k, v]) => [k, v.why])) },
      locked: false,
    });
  }
  return [...best.values()];
}

function seedRelations(seed) {
  const out = [];
  for (const [a, b] of seed.broader ?? []) out.push({ a, b, type: 'broader', weight: 0.9, _seed: true });
  for (const [a, b] of seed.related ?? []) out.push({ a, b, type: 'related', weight: 0.7, _seed: true });
  return out;
}

const SYMMETRIC = new Set(['related', 'adjacent', 'near', 'synergy', 'opposes']);

function mergeManualRelations(derived, manual, conceptFor, humanList = []) {
  const key = (r) => (SYMMETRIC.has(r.type) ? [r.a, r.b].sort().join('\u0000') : `${r.a}\u0000${r.b}`) + `\u0000${r.type}`;
  const map = new Map(derived.map((r) => [key(r), r]));
  const human = new Set(humanList);
  for (const m of manual) {
    let ca = conceptFor(m.a);
    let cb = conceptFor(m.b);
    if (!ca || !cb || ca === cb) continue;
    let type = m.type;
    if (type === 'narrower') {
      [ca, cb] = [cb, ca];
      type = 'broader';
    } else if (type === 'contains') {
      type = 'broader';
    }
    const full = {
      a: ca,
      b: cb,
      type,
      weight: m.weight ?? 1,
      evidence: { note: m.note ?? (m._seed ? 'seed' : 'manual') },
      locked: !m._seed && human.has(m),
    };
    map.set(key(full), full);
  }
  // `near` already says "probably the same"; a weaker `adjacent` on the same pair is redundant
  const pairs = (type) => new Set([...map.values()].filter((r) => r.type === type).map((r) => [r.a, r.b].sort().join('\u0000')));
  const near = pairs('near');
  return [...map.values()]
    .filter((r) => r.type !== 'adjacent' || !near.has([r.a, r.b].sort().join('\u0000')))
    .sort((p, q) => (p.a + p.b + p.type < q.a + q.b + q.type ? -1 : 1));
}

// ---- reading a stone -------------------------------------------------------

export function indexStone(stone) {
  const byNorm = new Map();
  const bySkey = new Map();
  const byTkey = new Map();
  const add = (map, key, cid) => {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(cid);
  };
  for (const c of stone.concepts) {
    for (const v of c.variants) {
      byNorm.set(v.norm, c.id);
      const info = normalizeLabel(v.norm);
      add(bySkey, info.skey, c.id);
      add(byTkey, info.tkey, c.id);
    }
  }
  const concepts = new Map(stone.concepts.map((c) => [c.id, c]));
  return { byNorm, bySkey, byTkey, concepts };
}

const only = (set) => (set && set.size === 1 ? [...set][0] : null);

// Map any label (even one the stone has never seen) to a concept, with provenance.
export function resolveLabel(index, label) {
  const info = normalizeLabel(label);
  if (!info.norm) return null;
  if (index.byNorm.has(info.norm)) return { concept: index.byNorm.get(info.norm), via: 'known', conf: 1 };
  const s = only(index.bySkey.get(info.skey));
  if (s) return { concept: s, via: 'stem', conf: 0.92 };
  const t = only(index.byTkey.get(info.tkey));
  if (t) return { concept: t, via: 'tokenset', conf: 0.78 };
  return null;
}

// The stone itself: concepts (clusters of equivalent tags across tag-systems), each with a
// canonical label chosen by weight, plus relations between concepts.
//
// overrides.json (human-edited, never overwritten by the engine) wins over everything computed:
//   { "pin":       { "ai": "Artificial Intelligence" },      canonical label for the concept containing "ai"
//     "same":      [["ai", "artificial intelligence"]],       must merge
//     "notSame":   [["ai", "air"]],                           must never merge
//     "relations": [{"a":"ai","b":"labor","type":"synergy"}],  broader|narrower|contains|related|adjacent|synergy|opposes,
//                                                               or a SKOS mapping name (closeMatch|broadMatch|narrowMatch|relatedMatch|exactMatch);
//                                                               b may be "<schemeId>:<externalId>" for a published vocabulary
//     "notRelated": [{"a":"ai","b":"art","type?":"related"}],   forbid a relation (every type when `type` is absent)
//     "ignore":    ["untagged"],                              drop these tags entirely
//     "sourceWeights": {"ScienceDaily": 0.4},                 trust per tag-system
//     "canon":     {"weights": {...}, "prefer": "short"} }
// Seeds use the same shape (same/broader/related) but are evidence, not commands.
import { makeConfig } from './config.js';
import { normalizeLabel } from './normalize.js';
import { loadCorpus, displayForm, preferredForm, belowBar, ratioOf, SITE_SCHEME } from './corpus.js';
import { computeSignals } from './signals/index.js';
import { resolveConcepts, attachLate } from './cluster.js';
import { scoreVariants, canonicalOf, rankingPool } from './canon.js';
import { deriveRelations } from './relate.js';
import { assignIds } from './ledger.js';

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

// One spelling of a concept, as stone.json reports it. `sourceRatio` is there when every record of
// the spelling is a discovered one carrying its measured ratio: a viewer shows the spelling when set
// at or below it.
function variantOf(t) {
  const ratio = ratioOf(t);
  return {
    norm: t.norm,
    label: displayForm(t),
    forms: Object.fromEntries([...t.forms.entries()].sort()),
    formsBySource: Object.fromEntries([...t.formsBySource.entries()].sort().map(([s, m]) => [s, Object.fromEntries([...m.entries()].sort())])),
    count: t.count,
    explicit: t.explicit,
    bySource: Object.fromEntries([...t.bySource.entries()].sort()),
    acronym: t.acronymLike,
    tokens: t.tokens.length,
    ...(ratio === null ? {} : { sourceRatio: ratio }),
  };
}

// `ledger` is in/out: { prior, path } read from disk by the caller (prior null when there is none);
// on return `ledger.next` is the ledger to write. Without it ids are minted exactly as a first
// ledgered build mints them, and the stone carries no ledger fields.
//
// Below-bar records (discovered tags rtz-discover's floor admitted under its sourceCoherenceRatio,
// `belowBar` in lib/corpus.js) are layered on, never mixed in. Everything a build at the bar holds is
// computed from the at-bar records alone, exactly as that build computes it: the clustering of their
// spellings, every canonical, rank and scheme label, every id, and the relations between those
// concepts. The below-bar spellings are then attached (lib/cluster.js attachLate): one may join a
// concept at the bar, as a variant with its sourceRatio, without moving its canonical, its items or
// its id; the rest form concepts of their own, whose relations are computed with everything. A viewer
// set at the bar therefore shows exactly the build at the bar.
export function buildStone(records, { cfg: userCfg = {}, overrides = {}, seeds = [], extraSignals = [], builtin = true, now = null, ledger = null, warn = () => {} } = {}) {
  const cfg = makeConfig(userCfg, overrides.config, { canon: overrides.canon, sourceWeights: overrides.sourceWeights });
  const ignore = new Set((overrides.ignore ?? []).map(normOf));
  const corpus = loadCorpus(records, { ignore });
  const late = records.some(belowBar);
  const atBar = late ? loadCorpus(records.filter((r) => !belowBar(r)), { ignore }) : corpus;

  const signals = [...(builtin ? computeSignals(atBar, cfg, { seeds }) : []), ...extraSignals];
  const locks = { same: labelGroups(overrides.same), notSame: labelGroups(overrides.notSame) };
  locks.notSame = locks.notSame.flatMap((g) => g.flatMap((x, i) => g.slice(i + 1).map((y) => [x, y])));
  const early = resolveConcepts(atBar, signals, cfg, locks);
  const { clusters, pairDetail } = late ? attachLate(early, corpus, [...(builtin ? computeSignals(corpus, cfg, { seeds }) : []), ...extraSignals], cfg, locks) : early;
  // the spellings a build at the bar holds in each cluster (all of them when nothing is below the bar)
  const atBarTerms = (cl) => (late ? cl.early : cl.terms);

  const pinByNorm = new Map(Object.entries(overrides.pin ?? {}).map(([k, v]) => [normOf(k), v]));
  // The canonical never depended on the id, so it is chosen first; the ledger then matches each
  // cluster to the id it continues (or mints one), with the canonical recorded beside the members.
  // A spelling at the bar is read from the at-bar records only, so its counts are the bar's.
  const named = clusters.map((cl) => {
    const variants = cl.terms.map((norm) => variantOf(atBar.terms.get(norm) ?? corpus.terms.get(norm)));
    // The canonical is chosen among the spellings a human wrote whenever there are any: a
    // spelling only discovery proposed may join the concept, but it never outranks a human's. A
    // concept at the bar is named from its at-bar spellings alone; a below-bar one never ranks.
    const own = atBarTerms(cl);
    const basis = own.length ? variants.filter((v) => own.includes(v.norm)) : variants;
    const rank = scoreVariants(rankingPool(basis), cfg.canon, cfg.sourceWeights);
    const pin = (own.length ? own : cl.terms).map((n) => pinByNorm.get(n)).find(Boolean);
    const canonical = canonicalOf(rank, pin);
    return { variants, basis, rank, canonical };
  });
  const assigned = assignIds(
    clusters.map((cl, i) => {
      const own = atBarTerms(cl);
      return { terms: cl.terms, label: named[i].canonical.label, ...(own.length && own.length < cl.terms.length ? { mint: own } : {}) };
    }),
    ledger?.prior ?? null,
    { pins: pinByNorm.keys(), now },
  );
  if (ledger) ledger.next = assigned.next;

  const conceptOfNorm = new Map();
  const concepts = clusters.map((cl, i) => {
    const id = assigned.ids[i];
    const { variants, basis, rank, canonical } = named[i];
    const { inScheme, prefLabel, altLabel } = schemeLabels(basis, canonical.label);
    const own = atBarTerms(cl);
    const itemSet = new Set();
    const perSource = {};
    for (const norm of own.length ? own : cl.terms) {
      const t = (own.length ? atBar : corpus).terms.get(norm);
      for (const k of t.items) itemSet.add(k);
    }
    for (const k of itemSet) {
      const s = corpus.items.get(k).source;
      perSource[s] = (perSource[s] ?? 0) + 1;
    }
    for (const norm of cl.terms) conceptOfNorm.set(norm, id);
    // a concept made only of rated discovered evidence shows when any of its spellings would
    const ratios = variants.map((v) => v.sourceRatio);
    const sourceRatio = ratios.every((r) => typeof r === 'number') ? Math.max(...ratios) : null;
    return {
      id,
      canonical: canonical.label,
      pinned: canonical.pinned,
      locked: cl.locked,
      discovered: basis.every((v) => v.explicit === 0), // only ever proposed by rtz-discover, never written by a human
      ...(sourceRatio === null ? {} : { sourceRatio }),
      inScheme,
      prefLabel,
      altLabel,
      items: itemSet.size,
      sources: perSource,
      variants,
      rank,
      links: cl.links.slice(0, 24).map((l) => ({ a: l.a, b: l.b, conf: Number(l.conf.toFixed(3)), cooc: Number(l.coocRatio.toFixed(2)), signals: l.signals })),
      ...(ledger ? { ledger: assigned.concepts[i] } : {}), // {since, event, previousLabel?}
    };
  });

  const conceptRefs = clusters.map((cl, i) => ({ id: concepts[i].id, terms: cl.terms, label: concepts[i].canonical }));
  const labelOf = new Map(concepts.map((c) => [c.id, c.canonical]));
  // Relations between concepts at the bar come from the at-bar records, as at the bar; a relation
  // touching a concept only below-bar evidence made is computed with everything.
  const lateIds = new Set(late ? concepts.filter((c, i) => !clusters[i].early.length).map((c) => c.id) : []);
  const touchesLate = (r) => lateIds.has(r.a) || lateIds.has(r.b);
  const derived = !late
    ? [...deriveRelations(corpus, conceptRefs, cfg), ...nearRelations(pairDetail, conceptOfNorm, cfg, labelOf)]
    : [
        ...deriveRelations(atBar, conceptRefs.map((c, i) => ({ ...c, terms: clusters[i].early })).filter((c) => c.terms.length).sort((x, y) => (x.terms[0] < y.terms[0] ? -1 : 1)), cfg),
        ...nearRelations(early.pairDetail, new Map([...conceptOfNorm].filter(([n]) => atBar.terms.has(n))), cfg, labelOf),
        ...deriveRelations(corpus, conceptRefs, cfg).filter(touchesLate),
        ...nearRelations(pairDetail, conceptOfNorm, cfg, labelOf).filter(touchesLate),
      ];
  const aliasGroups = seeds.flatMap((s) => labelGroups(s.same));
  const lookup = (n, ok) => {
    if (conceptOfNorm.has(n) && ok(n)) return conceptOfNorm.get(n);
    const group = aliasGroups.find((g) => g.includes(n)); // "artificial general intelligence" -> corpus only has "agi"
    return group?.map((x) => (ok(x) ? conceptOfNorm.get(x) : undefined)).find(Boolean);
  };
  // a seed's or a human's label resolves as it would at the bar first; only failing that, to a
  // concept only below-bar evidence made (a below-bar spelling inside a concept at the bar was not
  // there at the bar, and names nothing)
  const conceptFor = !late
    ? (label) => lookup(normOf(label), () => true)
    : (label) => {
        const n = normOf(label);
        return lookup(n, (x) => atBar.terms.has(x)) ?? lookup(n, (x) => lateIds.has(conceptOfNorm.get(x)));
      };
  const merged0 = mergeManualRelations(derived, [...seeds.flatMap(seedRelations), ...(overrides.relations ?? [])], conceptFor, overrides.relations, labelOf, warn);
  const typed = typeRelations(merged0, concepts, cfg);
  const { relations, forbidden } = forbidRelations(typed, overrides.notRelated ?? [], conceptFor);

  // A system's distinct tags are the terms on any of its items, from any origin (`bySource` is keyed
  // by scheme, so it cannot say this: a discovered spelling on a wire item sits under `discovered`).
  const systems = {};
  // (described at the bar: below-bar tags do not change a system's coverage)
  const sourcesOfTerm = [...atBar.terms.values()].map((t) => new Set([...t.items].map((k) => atBar.items.get(k).source)));
  for (const s of atBar.sources.values()) {
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
    forbidden, // [{a, b, type, why: 'override'}]: relations an overrides.notRelated entry removed, this build
    ...(ledger ? { ledger: { path: ledger.path ?? null, ...assigned.summary, events: assigned.events } } : {}), // {path, minted, reused, retired, splits, merges, events[]} (this build's events only)
  };
}

// Pairs with real evidence of being the SAME but not enough to merge: the review queue.
// Needs an identity-oriented signal (spelling, initials, curated, or a strong shared-item anchor).
// Similar usage alone (text) only ever says "adjacent", and corroborates; it never qualifies a pair.
const IDENTITY_SIGNALS = new Set(['stem', 'tokenset', 'edit', 'acronym', 'seed']);
const STRONG_ANCHOR = 0.45;

function nearRelations(pairDetail, conceptOfNorm, cfg, labelOf = new Map()) {
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
    const signalNames = Object.keys(d.signals).sort();
    best.set(key, {
      a: x,
      b: y,
      type: 'near',
      weight: Number(d.conf.toFixed(4)),
      evidence: { terms: [d.a, d.b], signals: Object.fromEntries(Object.entries(d.signals).map(([k, v]) => [k, v.why])) },
      locked: false,
      why: `"${labelOf.get(x) ?? x}" and "${labelOf.get(y) ?? y}" are probably the same: "${d.a}" ~ "${d.b}" by ${signalNames.join(', ')} (confidence ${d.conf.toFixed(2)}, short of the merge threshold ${cfg.mergeThreshold}); a human should decide`,
      wasDerivedFrom: Object.entries(d.signals).map(([name, v]) => ({ type: 'signal', name, score: Number(v.score.toFixed(3)) })),
      wasGeneratedBy: { activity: 'relate', parameters: { nearThreshold: cfg.nearThreshold, mergeThreshold: cfg.mergeThreshold } },
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

const SYMMETRIC = new Set(['related', 'adjacent', 'near', 'synergy', 'opposes', 'closeMatch', 'relatedMatch', 'exactMatch']);
// Relation names SKOS defines. `narrower` and `narrowMatch` are accepted in overrides and stored
// flipped (broader {a,b} means b skos:broader a; broadMatch {a,b} means b skos:broadMatch a), so the
// stone never emits them: the inverse is implied.
const SKOS_NAMES = new Set(['broader', 'related', 'closeMatch', 'broadMatch', 'relatedMatch', 'exactMatch']);
const MAPPING_NAMES = new Set(['closeMatch', 'broadMatch', 'relatedMatch', 'exactMatch']);
// The names an override may use (the header above): anything else is a typo, dropped with one line.
const MANUAL_TYPES = new Set(['broader', 'narrower', 'contains', 'related', 'adjacent', 'synergy', 'opposes', 'closeMatch', 'broadMatch', 'narrowMatch', 'relatedMatch', 'exactMatch']);
// A within-scheme name and the mapping it becomes across schemes say the same thing of a pair; a
// human's relation replaces the computed one of either name, and a `notRelated` written in one name
// removes the row whatever name typing gave it.
const SAME_SAYING = { near: 'near', closeMatch: 'near', related: 'related', relatedMatch: 'related', broader: 'broader', broadMatch: 'broader' };
const saysTheSame = (x, y) => x === y || (SAME_SAYING[x] !== undefined && SAME_SAYING[x] === SAME_SAYING[y]);
const relationKey = (r) => (SYMMETRIC.has(r.type) ? [r.a, r.b].sort().join('\u0000') : `${r.a}\u0000${r.b}`) + `\u0000${r.type}`;

// "<schemeId>:<externalId>" names a concept of a published vocabulary the stone does not hold; it is
// kept verbatim. A label that merely contains a colon but resolves to a concept is that concept.
const EXTERNAL_REF = /^[^\s:]+:\S+$/;
const isExternalRef = (label) => typeof label === 'string' && EXTERNAL_REF.test(label);

// Normalise a human's or a seed's type: old names map onto SKOS ones, the narrow side is flipped.
function normalizeManualType(type, ca, cb) {
  if (type === 'narrower') return { type: 'broader', a: cb, b: ca };
  if (type === 'contains') return { type: 'broader', a: ca, b: cb };
  if (type === 'narrowMatch') return { type: 'broadMatch', a: cb, b: ca };
  return { type, a: ca, b: cb };
}

function mergeManualRelations(derived, manual, conceptFor, humanList = [], labelOf = new Map(), warn = () => {}) {
  const map = new Map(derived.map((r) => [relationKey(r), r]));
  const human = new Set(humanList);
  const name = (id) => `"${labelOf.get(id) ?? id}"`;
  for (const m of manual) {
    if (!MANUAL_TYPES.has(m.type)) {
      warn(`overrides.relations: "${m.type}" is not a relation type (${[...MANUAL_TYPES].join(', ')}); ${JSON.stringify(m.a)} ${JSON.stringify(m.b)} dropped`);
      continue;
    }
    const ca = conceptFor(m.a);
    let cb = conceptFor(m.b);
    let external = false;
    if (!cb && !m._seed && isExternalRef(m.b)) {
      cb = m.b; // a published vocabulary's concept: not ours to resolve, kept as written
      external = true;
    }
    if (!ca || !cb || ca === cb) continue;
    const t = normalizeManualType(m.type, ca, cb);
    if (external && t.a !== ca) continue; // narrower/narrowMatch toward an external id would put the external id in `a`; the inverse cannot be stated here
    const isHuman = !m._seed && human.has(m);
    const full = {
      a: t.a,
      b: t.b,
      type: t.type,
      weight: m.weight ?? 1,
      evidence: { note: m.note ?? (m._seed ? 'seed' : 'manual'), ...(external ? { external: true } : {}) },
      locked: isHuman,
      why: isHuman
        ? `overrides.json says ${name(t.a)} ${t.type} ${name(t.b)}${m.note ? `: ${m.note}` : ''}`
        : `curated seed: ${name(t.a)} ${t.type} ${name(t.b)}`,
      wasDerivedFrom: isHuman ? [{ type: 'override', ...(m.note ? { note: m.note } : {}) }] : [{ type: 'seed' }],
      wasGeneratedBy: { activity: 'relate', parameters: { source: isHuman ? 'overrides' : 'seed' } },
      ...(external ? { external: true } : {}),
    };
    // the human's (or seed's) row replaces a computed one saying the same of the pair under either name
    for (const twin of Object.keys(SAME_SAYING)) if (twin !== full.type && saysTheSame(twin, full.type)) map.delete(relationKey({ ...full, type: twin }));
    map.set(relationKey(full), full);
  }
  // `near` already says "probably the same"; a weaker `adjacent` on the same pair is redundant
  const pairs = (type) => new Set([...map.values()].filter((r) => r.type === type).map((r) => [r.a, r.b].sort().join('\u0000')));
  const near = pairs('near');
  return [...map.values()]
    .filter((r) => r.type !== 'adjacent' || !near.has([r.a, r.b].sort().join('\u0000')))
    .sort((p, q) => (p.a + p.b + p.type < q.a + q.b + q.type ? -1 : 1));
}

// ---- SKOS typing -------------------------------------------------------------------------------
// Two concepts share a scheme when some tag-system (or `discovered`) wrote both; `site` holds every
// concept and so says nothing. Within a scheme a relation is semantic (skos:broader, skos:related);
// across schemes it is a mapping (skos:closeMatch, broadMatch, relatedMatch). `skos:false` marks the
// stone's own vocabulary that SKOS has no word for (adjacent, synergy, opposes, a within-scheme
// `near`, a cross-scheme `related` with no text support): kept, named as before, for readers that
// speak SKOS to ignore. A human's relation (locked) keeps the name the human wrote. A relation to an
// external vocabulary id is a mapping by definition.
function typeRelations(relations, concepts, cfg) {
  const schemesOf = new Map(concepts.map((c) => [c.id, new Set(c.inScheme.filter((s) => s !== SITE_SCHEME))]));
  const shareScheme = (a, b) => {
    const sa = schemesOf.get(a);
    const sb = schemesOf.get(b);
    return !!sa && !!sb && [...sa].some((s) => sb.has(s));
  };
  const R = cfg.relate;
  return relations.map((r) => {
    const out = { ...r };
    const external = r.external === true || !schemesOf.has(r.b);
    if (r.locked) {
      out.skos = SKOS_NAMES.has(r.type); // a human's `adjacent` or `synergy` is not SKOS, even toward a published vocabulary
      return out;
    }
    if (external) {
      if (r.type === 'broader') out.type = 'broadMatch';
      else if (r.type === 'related') out.type = 'relatedMatch';
      else if (r.type === 'near') out.type = 'closeMatch';
      out.skos = true;
      return out;
    }
    if (MAPPING_NAMES.has(r.type)) {
      out.skos = true;
      return out;
    }
    if (shareScheme(r.a, r.b)) {
      out.skos = r.type === 'broader' || r.type === 'related';
      return out;
    }
    // across schemes
    if (r.type === 'near' && r.weight >= cfg.nearThreshold && r.weight < cfg.mergeThreshold) {
      out.type = 'closeMatch';
      out.skos = true;
    } else if (r.type === 'broader') {
      out.type = 'broadMatch';
      out.skos = true;
    } else if (r.type === 'related' && typeof r.evidence?.cosine === 'number' && r.evidence.cosine >= R.minAdjacent) {
      out.type = 'relatedMatch';
      out.skos = true;
      out.why = `${r.why}, and their items read alike (cosine ${r.evidence.cosine.toFixed(2)})`;
      out.wasDerivedFrom = [...(r.wasDerivedFrom ?? []), { type: 'text', cosine: r.evidence.cosine }];
      out.wasGeneratedBy = { activity: 'relate', parameters: { ...(r.wasGeneratedBy?.parameters ?? {}), minAdjacent: R.minAdjacent } };
    } else {
      out.skos = false;
    }
    return out;
  });
}

// overrides.notRelated: [{a, b, type?}], resolved by label like `relations`, applied after everything
// else. Without `type` every relation between the pair goes, in both directions; with one, that type
// (old names normalised and flipped as for `relations`; a name and the mapping typing turns it into,
// near/closeMatch, related/relatedMatch, broader/broadMatch, name the same row). What went is listed
// in `forbidden`.
function forbidRelations(relations, notRelated, conceptFor) {
  const rules = [];
  for (const m of notRelated ?? []) {
    const ca = conceptFor(m.a);
    const cb = conceptFor(m.b) ?? (isExternalRef(m.b) ? m.b : null);
    if (!ca || !cb || ca === cb) continue;
    if (m.type) {
      const t = normalizeManualType(m.type, ca, cb);
      rules.push({ a: t.a, b: t.b, type: t.type });
    } else {
      rules.push({ a: ca, b: cb, type: null });
    }
  }
  if (!rules.length) return { relations, forbidden: [] };
  const hits = (r) => rules.some((x) => (x.type === null || saysTheSame(x.type, r.type)) && ((x.a === r.a && x.b === r.b) || (x.a === r.b && x.b === r.a && (x.type === null || SYMMETRIC.has(r.type)))));
  const forbidden = relations.filter(hits).map((r) => ({ a: r.a, b: r.b, type: r.type, why: 'override' }));
  return { relations: relations.filter((r) => !hits(r)), forbidden };
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

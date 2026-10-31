// Emergent tags: items nobody tagged (or under-tagged) get concept tags because their TEXT
// contains a concept's labels. Deterministic phrase matching against stone.json's vocabulary,
// no model. Every emitted tag carries `why` so it can be inspected and argued with.
//
// Guards against noise (all learned from running on a real corpus):
//  - phrases present in more than maxDfRatio of all items are too common to mean anything
//  - a SINGLE generic word ("process", "water", "power") is not evidence on its own: the item must
//    also read like the items that carry the tag (TF-IDF cosine against the concept's profile)
//  - single short words and stopwords are never matched
//  - acronyms (AI, ML) only match in their original capitalised form, never as lowercase "ai" in a word
//
// Concepts that only discovery proposed are matched like any other: discovery attached them where its
// candidate scan found the phrase, emergence catches what that scan missed (a tagged item the site
// keeps off the bridge, a stem the scan did not line up). Whatever an item already carries, from any
// system or stage, is never doubled. Every record carries wasDerivedFrom (the span of the item's own
// words that matched, how often, whether in the title) and wasGeneratedBy (this stage, its
// thresholds and, for a lone word, the context score that admitted it).
//
// A tag earned only through spellings a viewer can hide (discovered ones that carry a sourceRatio)
// carries the ratio a viewer must be set at or below to show it: the highest of the matched
// spellings'. Records under their build's bar (rtz-discover's floor, `belowBar` in lib/corpus.js)
// never change what emergence decides at the bar: it decides on the other records exactly as a build
// at the bar decides, then finds, concept by concept, what the below-bar records add. For each concept
// with below-bar records, from its highest below-bar ratio down, it decides again with the records at
// or above that ratio added; a tag that first appears at ratio r carries r (whatever the concept's
// other spellings), and `sourceCoherenceRatio` in its parameters says it is under the bar. So a viewer
// set at the bar shows exactly what a build at the bar earned.
import { normalizeLabel, looksLikeAcronym, stem, STOP } from './normalize.js';
import { words, STOPWORDS, buildItemVectors, buildIdf, profileFor } from './text.js';
import { cosine } from './similarity.js';
import { loadCorpus, entitySet, belowBar } from './corpus.js';
import { indexStone, resolveLabel } from './stone.js';
import { makeConfig } from './config.js';

const MAX_PHRASE = 4;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// the item's words, and the stems of its content words with the index each one came from, so a
// matched stem window can be read back as the span the item actually wrote (stop words included)
function stemSeq(text) {
  const ws = words(text);
  const seq = [];
  for (let i = 0; i < ws.length; i++) if (!STOP.has(ws[i])) seq.push({ stem: stem(ws[i]), at: i });
  return { ws, seq };
}

// Each entry keeps the ratio a viewer must be set at or below to show what it earns: null (always)
// when any spelling behind it has no sourceRatio. `first` holds the first stem of every phrase.
export function buildPhraseTable(stone) {
  const phrases = new Map(); // "stem stem" -> Map<cid, {norm, single, ratio}>
  const acronyms = new Map(); // "AI" -> {cid, ratio}
  const first = new Set();
  const both = (x, y) => (x === undefined ? y : x === null || y === null ? null : Math.max(x, y));
  const add = (key, cid, norm, single, ratio) => {
    if (!phrases.has(key)) phrases.set(key, new Map());
    const was = phrases.get(key).get(cid);
    phrases.get(key).set(cid, { norm, single, ratio: both(was?.ratio, ratio) });
    first.add(key.split(' ')[0]);
  };
  for (const c of stone.concepts) {
    const labels = new Set(c.variants.map((v) => v.norm));
    labels.add(normalizeLabel(c.canonical).norm);
    for (const norm of labels) {
      const info = normalizeLabel(norm);
      const variant = c.variants.find((v) => v.norm === norm);
      const ratio = typeof variant?.sourceRatio === 'number' ? variant.sourceRatio : null; // the canonical of a pin is a human's
      if (info.tokens.length === 1 && variant?.acronym) {
        for (const raw of Object.keys(variant.forms)) if (looksLikeAcronym(raw)) acronyms.set(raw.replace(/[.\s]/g, ''), { cid: c.id, ratio });
        continue;
      }
      if (!info.stems.length || info.stems.length > MAX_PHRASE) continue;
      if (info.stems.length === 1 && (info.norm.length < 4 || STOPWORDS.has(info.norm))) continue;
      add(info.stems.join(' '), c.id, norm, info.stems.length === 1, ratio);
    }
  }
  return { phrases, acronyms, first };
}

// `seq` is stemSeq(text), passed in when it was read already
function matchText(text, table, { ws, seq } = stemSeq(text)) {
  const found = new Map(); // cid -> {tf, phrase, single, ratio}; phrase is the first matching span of the item's own words
  const bump = (cid, phrase, single, ratio) => {
    const f = found.get(cid) ?? { tf: 0, phrase, single, ratio };
    f.tf += 1;
    f.ratio = f.ratio === null || ratio === null ? null : Math.max(f.ratio, ratio);
    found.set(cid, f);
  };
  for (let i = 0; i < seq.length; i++) {
    if (!table.first.has(seq[i].stem)) continue; // no phrase starts with this word
    for (let n = 1; n <= MAX_PHRASE && i + n <= seq.length; n++) {
      const hit = table.phrases.get(seq.slice(i, i + n).map((s) => s.stem).join(' '));
      if (!hit) continue;
      const span = ws.slice(seq[i].at, seq[i + n - 1].at + 1).join(' ');
      for (const [cid, h] of hit) bump(cid, span, h.single, h.ratio);
    }
  }
  for (const [acr, { cid, ratio }] of table.acronyms) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(acr)}(?![\\p{L}\\p{N}])`, 'gu');
    const m = text.match(re);
    if (m) for (let i = 0; i < m.length; i++) bump(cid, acr, false, ratio); // an acronym in capitals is specific enough
  }
  return found;
}

// What every decision over these items shares: their TF-IDF vectors and the stems of their text.
function prepare(records) {
  const corpus = loadCorpus(records);
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);
  const items = records
    .filter((r) => r.type === 'item')
    .map((it) => {
      const body = `${it.title ?? ''}. ${it.text ?? ''}`;
      const title = it.title ?? '';
      return { it, body, title, bodySeq: stemSeq(body), titleSeq: stemSeq(title) };
    });
  return { vecs, idf, items };
}

// The stone as a build holding only some spellings would hand it over: every concept keeps the
// variants `keep` admits, a concept left with none is gone, and the order is a stone's (by smallest
// spelling). `only` limits it to some concepts.
function viewOf(stone, keep, only = null) {
  const concepts = stone.concepts
    .filter((c) => !only || only.has(c.id))
    .map((c) => ({ ...c, variants: c.variants.filter((v) => keep(v.norm)) }))
    .filter((c) => c.variants.length)
    .sort((x, y) => (x.variants[0].norm < y.variants[0].norm ? -1 : 1));
  return { ...stone, concepts };
}

// One emergence decision over `records` with `stone`'s vocabulary. `only` limits what is earned to
// some concepts (everything else still resolves what items carry); `level` marks every tag as one
// only below-bar records at or above `level.ratio` made possible.
function earn(stone, records, cfg, shared, { only = null, level = null } = {}) {
  const E = cfg.emerge;
  const index = indexStone(stone);
  const earning = only ? { ...stone, concepts: stone.concepts.filter((c) => only.has(c.id)) } : stone;
  const table = buildPhraseTable(earning);
  const canonical = new Map(earning.concepts.map((c) => [c.id, c.canonical]));
  const corpus = loadCorpus(records);
  const { vecs, idf, items } = shared;

  // what each concept's tagged items read like, to vet single-word matches
  const profile = new Map();
  for (const c of earning.concepts) {
    const keys = c.variants.flatMap((v) => [...(corpus.terms.get(v.norm)?.items ?? [])]);
    if (keys.length) profile.set(c.id, profileFor(entitySet(corpus, keys), vecs, idf));
  }

  // what each item already carries, from any system or stage but emergence itself: a record that names
  // a concept stone.json knows is taken at its word, otherwise its label is resolved
  const carried = new Map(); // "source::item" -> Set<cid>
  for (const r of records) {
    if (r.type !== 'tag' || (r.origin ?? 'explicit') === 'emergent') continue;
    const cid = r.concept && index.concepts.has(r.concept) ? r.concept : resolveLabel(index, r.label)?.concept;
    if (!cid) continue;
    const k = `${r.source}::${r.item}`;
    if (!carried.has(k)) carried.set(k, new Set());
    carried.get(k).add(cid);
  }

  const perItem = items.map(({ it, body, title, bodySeq, titleSeq }) => ({ it, inBody: matchText(body, table, bodySeq), inTitle: matchText(title, table, titleSeq) }));

  const df = new Map();
  for (const { inBody } of perItem) for (const cid of inBody.keys()) df.set(cid, (df.get(cid) ?? 0) + 1);
  const N = items.length || 1;

  const out = [];
  for (const { it, inBody, inTitle } of perItem) {
    const have = carried.get(`${it.source}::${it.id}`) ?? new Set();
    const itemVec = profileFor([`${it.source}::${it.id}`], vecs, idf);
    for (const [cid, f] of [...inBody.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
      if (have.has(cid)) continue;
      if ((df.get(cid) ?? 0) / N > E.maxDfRatio) continue;
      let weight = Math.min(0.9, 0.3 + 0.2 * Math.log2(1 + f.tf) + (inTitle.has(cid) ? 0.2 : 0));
      let context = null;
      if (f.single) {
        // a lone word only counts if the item reads like the items that carry the tag
        context = profile.has(cid) ? cosine(itemVec, profile.get(cid)) : 0;
        if (context < E.minContext) continue;
        weight = Math.min(weight, 0.3 + context); // and never more confident than the context supports
      }
      if (weight < E.minWeight) continue;
      const ratio = level ? level.ratio : typeof f.ratio === 'number' ? f.ratio : null;
      out.push({
        type: 'tag',
        source: it.source,
        item: it.id,
        label: canonical.get(cid),
        weight: Number(weight.toFixed(3)),
        origin: 'emergent',
        concept: cid,
        ...(ratio === null ? {} : { sourceRatio: ratio }),
        why: `text mentions "${f.phrase}" ×${f.tf}${inTitle.has(cid) ? ' (in title)' : ''}${context === null ? '' : `; reads like its other items (${context.toFixed(2)})`}${level ? `; only with discovered tags under the ${level.bar}× bar (${level.ratio})` : ''}`,
        wasDerivedFrom: [{ type: 'text', phrase: f.phrase, count: f.tf, inTitle: inTitle.has(cid) }],
        wasGeneratedBy: {
          activity: 'emerge',
          // `context` only when it was computed (a lone word); a PROV field is never present with null
          parameters: {
            maxDfRatio: E.maxDfRatio,
            minWeight: E.minWeight,
            minContext: E.minContext,
            ...(context === null ? {} : { context: Number(context.toFixed(3)) }),
            ...(level ? { sourceCoherenceRatio: level.bar } : {}),
          },
        },
      });
    }
  }
  return out;
}

export function emerge(stone, records, cfg = makeConfig()) {
  const under = records.filter((r) => r.origin === 'discovered' && belowBar(r));
  if (!under.length) return earn(stone, records, cfg, prepare(records));

  // at the bar: the other records and the spellings they wrote, decided as a build at the bar decides
  const atBarRecords = records.filter((r) => !belowBar(r));
  const shared = prepare(atBarRecords);
  const atBarTerms = loadCorpus(atBarRecords).terms;
  const early = (norm) => atBarTerms.has(norm);
  const base = earn(viewOf(stone, early), atBarRecords, cfg, shared);

  // what the below-bar records add, concept by concept (a decision about one concept depends only on
  // its own spellings, items and records), from its highest below-bar ratio down
  const index = indexStone(stone);
  const byConcept = new Map(); // cid -> its below-bar records
  for (const r of under) {
    const cid = r.concept && index.concepts.has(r.concept) ? r.concept : resolveLabel(index, r.label)?.concept;
    if (!cid) continue;
    if (!byConcept.has(cid)) byConcept.set(cid, []);
    byConcept.get(cid).push(r);
  }
  const seen = new Set(base.map((t) => `${t.source}::${t.item}\u0000${t.concept}`));
  const extra = [];
  for (const cid of [...byConcept.keys()].sort()) {
    const own = byConcept.get(cid);
    for (const ratio of [...new Set(own.map((r) => r.sourceRatio))].sort((x, y) => y - x)) {
      const taken = own.filter((r) => r.sourceRatio >= ratio);
      const norms = new Set(taken.map((r) => normalizeLabel(r.label).norm));
      const level = { ratio, bar: Math.min(...taken.map((r) => r.wasGeneratedBy.parameters.sourceCoherenceRatio)) };
      const view = viewOf(stone, (n) => early(n) || norms.has(n));
      for (const t of earn(view, [...atBarRecords, ...taken], cfg, shared, { only: new Set([cid]), level })) {
        const k = `${t.source}::${t.item}\u0000${t.concept}`;
        if (seen.has(k)) continue;
        seen.add(k);
        extra.push(t);
      }
    }
  }

  // in emergence's own order: by item, then by concept
  const order = new Map(shared.items.map(({ it }, i) => [`${it.source}::${it.id}`, i]));
  return [...base, ...extra].sort((a, b) => order.get(`${a.source}::${a.item}`) - order.get(`${b.source}::${b.item}`) || (a.concept < b.concept ? -1 : a.concept > b.concept ? 1 : 0));
}

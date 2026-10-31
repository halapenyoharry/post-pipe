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
// spellings'. A spelling that only below-bar evidence wrote (rtz-discover's floor) never earns a
// concept at the bar anything, never shapes what that concept's items read like, and a below-bar tag
// on an item never stops emergence from earning a concept at the bar there: so a viewer set at the bar
// shows exactly what a build at the bar earned.
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

// `skip(norm)` leaves a spelling out of the table. Each entry keeps the ratio a viewer must be set at
// or below to show what it earns: null (always) when any spelling behind it has no sourceRatio.
export function buildPhraseTable(stone, skip = () => false) {
  const phrases = new Map(); // "stem stem" -> Map<cid, {norm, single, ratio}>
  const acronyms = new Map(); // "AI" -> {cid, ratio}
  const both = (x, y) => (x === undefined ? y : x === null || y === null ? null : Math.max(x, y));
  const add = (key, cid, norm, single, ratio) => {
    if (!phrases.has(key)) phrases.set(key, new Map());
    const was = phrases.get(key).get(cid);
    phrases.get(key).set(cid, { norm, single, ratio: both(was?.ratio, ratio) });
  };
  for (const c of stone.concepts) {
    const labels = new Set(c.variants.map((v) => v.norm).filter((n) => !skip(n)));
    if (!labels.size) continue;
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
  return { phrases, acronyms };
}

function matchText(text, table) {
  const found = new Map(); // cid -> {tf, phrase, single, ratio}; phrase is the first matching span of the item's own words
  const bump = (cid, phrase, single, ratio) => {
    const f = found.get(cid) ?? { tf: 0, phrase, single, ratio };
    f.tf += 1;
    f.ratio = f.ratio === null || ratio === null ? null : Math.max(f.ratio, ratio);
    found.set(cid, f);
  };
  const { ws, seq } = stemSeq(text);
  for (let i = 0; i < seq.length; i++) {
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

export function emerge(stone, records, cfg = makeConfig()) {
  const E = cfg.emerge;
  const index = indexStone(stone);
  const canonical = new Map(stone.concepts.map((c) => [c.id, c.canonical]));
  const corpus = loadCorpus(records);

  // a spelling only below-bar records wrote, inside a concept that has spellings at the bar, is left
  // out of everything that concept earns (a concept made only of below-bar spellings keeps them all)
  const below = (norm) => corpus.terms.get(norm)?.atBar === 0;
  const lateOnly = new Set(stone.concepts.filter((c) => c.variants.every((v) => below(v.norm))).map((c) => c.id));
  const conceptOf = new Map(stone.concepts.flatMap((c) => c.variants.map((v) => [v.norm, c.id])));
  const skip = (norm) => below(norm) && !lateOnly.has(conceptOf.get(norm));
  const table = buildPhraseTable(stone, skip);

  // what each concept's tagged items read like, to vet single-word matches
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);
  const profile = new Map();
  for (const c of stone.concepts) {
    const keys = c.variants.filter((v) => !skip(v.norm)).flatMap((v) => [...(corpus.terms.get(v.norm)?.items ?? [])]);
    if (keys.length) profile.set(c.id, profileFor(entitySet(corpus, keys), vecs, idf));
  }

  // what each item already carries, from any system or stage but emergence itself: a record that names
  // a concept stone.json knows is taken at its word, otherwise its label is resolved
  const carried = new Map(); // "source::item" -> Set<cid>
  for (const r of records) {
    if (r.type !== 'tag' || (r.origin ?? 'explicit') === 'emergent') continue;
    const cid = r.concept && index.concepts.has(r.concept) ? r.concept : resolveLabel(index, r.label)?.concept;
    if (!cid || (belowBar(r) && !lateOnly.has(cid))) continue;
    const k = `${r.source}::${r.item}`;
    if (!carried.has(k)) carried.set(k, new Set());
    carried.get(k).add(cid);
  }

  const items = records.filter((r) => r.type === 'item');
  const perItem = items.map((it) => {
    const body = `${it.title ?? ''}. ${it.text ?? ''}`;
    return { it, inBody: matchText(body, table), inTitle: matchText(it.title ?? '', table) };
  });

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
      out.push({
        type: 'tag',
        source: it.source,
        item: it.id,
        label: canonical.get(cid),
        weight: Number(weight.toFixed(3)),
        origin: 'emergent',
        concept: cid,
        ...(typeof f.ratio === 'number' ? { sourceRatio: f.ratio } : {}),
        why: `text mentions "${f.phrase}" ×${f.tf}${inTitle.has(cid) ? ' (in title)' : ''}${context === null ? '' : `; reads like its other items (${context.toFixed(2)})`}`,
        wasDerivedFrom: [{ type: 'text', phrase: f.phrase, count: f.tf, inTitle: inTitle.has(cid) }],
        wasGeneratedBy: {
          activity: 'emerge',
          // `context` only when it was computed (a lone word); a PROV field is never present with null
          parameters: { maxDfRatio: E.maxDfRatio, minWeight: E.minWeight, minContext: E.minContext, ...(context === null ? {} : { context: Number(context.toFixed(3)) }) },
        },
      });
    }
  }
  return out;
}

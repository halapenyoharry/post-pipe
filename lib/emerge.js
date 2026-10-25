// Emergent tags: items nobody tagged (or under-tagged) get concept tags because their TEXT
// contains a concept's labels. Deterministic phrase matching against the stone's vocabulary,
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
import { normalizeLabel, looksLikeAcronym, stem, STOP } from './normalize.js';
import { words, STOPWORDS, buildItemVectors, buildIdf, profileFor } from './text.js';
import { cosine } from './similarity.js';
import { loadCorpus, entitySet } from './corpus.js';
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

export function buildPhraseTable(stone) {
  const phrases = new Map(); // "stem stem" -> Map<cid, {norm, single}>
  const acronyms = new Map(); // "AI" -> cid
  const add = (key, cid, norm, single) => {
    if (!phrases.has(key)) phrases.set(key, new Map());
    phrases.get(key).set(cid, { norm, single });
  };
  for (const c of stone.concepts) {
    const labels = new Set(c.variants.map((v) => v.norm));
    labels.add(normalizeLabel(c.canonical).norm);
    for (const norm of labels) {
      const info = normalizeLabel(norm);
      const variant = c.variants.find((v) => v.norm === norm);
      if (info.tokens.length === 1 && variant?.acronym) {
        for (const raw of Object.keys(variant.forms)) if (looksLikeAcronym(raw)) acronyms.set(raw.replace(/[.\s]/g, ''), c.id);
        continue;
      }
      if (!info.stems.length || info.stems.length > MAX_PHRASE) continue;
      if (info.stems.length === 1 && (info.norm.length < 4 || STOPWORDS.has(info.norm))) continue;
      add(info.stems.join(' '), c.id, norm, info.stems.length === 1);
    }
  }
  return { phrases, acronyms };
}

function matchText(text, table) {
  const found = new Map(); // cid -> {tf, phrase, single}; phrase is the first matching span of the item's own words
  const bump = (cid, phrase, single) => {
    const f = found.get(cid) ?? { tf: 0, phrase, single };
    f.tf += 1;
    found.set(cid, f);
  };
  const { ws, seq } = stemSeq(text);
  for (let i = 0; i < seq.length; i++) {
    for (let n = 1; n <= MAX_PHRASE && i + n <= seq.length; n++) {
      const hit = table.phrases.get(seq.slice(i, i + n).map((s) => s.stem).join(' '));
      if (!hit) continue;
      const span = ws.slice(seq[i].at, seq[i + n - 1].at + 1).join(' ');
      for (const [cid, h] of hit) bump(cid, span, h.single);
    }
  }
  for (const [acr, cid] of table.acronyms) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(acr)}(?![\\p{L}\\p{N}])`, 'gu');
    const m = text.match(re);
    if (m) for (let i = 0; i < m.length; i++) bump(cid, acr, false); // an acronym in capitals is specific enough
  }
  return found;
}

export function emerge(stone, records, cfg = makeConfig()) {
  const E = cfg.emerge;
  const index = indexStone(stone);
  const table = buildPhraseTable(stone);
  const canonical = new Map(stone.concepts.map((c) => [c.id, c.canonical]));

  // what each concept's tagged items read like, to vet single-word matches
  const corpus = loadCorpus(records);
  const vecs = buildItemVectors(corpus.items);
  const idf = buildIdf(vecs);
  const profile = new Map();
  for (const c of stone.concepts) {
    const keys = c.variants.flatMap((v) => [...(corpus.terms.get(v.norm)?.items ?? [])]);
    if (keys.length) profile.set(c.id, profileFor(entitySet(corpus, keys), vecs, idf));
  }

  // what each item already carries, from any system or stage but emergence itself: a record that names
  // a concept the stone knows is taken at its word, otherwise its label is resolved
  const carried = new Map(); // "source::item" -> Set<cid>
  for (const r of records) {
    if (r.type !== 'tag' || (r.origin ?? 'explicit') === 'emergent') continue;
    const cid = r.concept && index.concepts.has(r.concept) ? r.concept : resolveLabel(index, r.label)?.concept;
    if (!cid) continue;
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

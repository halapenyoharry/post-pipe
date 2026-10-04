// Emergent tags: items nobody tagged (or under-tagged) get concept tags because their TEXT
// contains a concept's labels. Deterministic phrase matching against the stone's vocabulary,
// no model. Every emitted tag carries `why` so it can be inspected and argued with.
//
// Guards against noise:
//  - phrases present in more than maxDfRatio of all items are too common to mean anything
//  - single short words and stopwords are never matched
//  - acronyms (AI, ML) only match in their original capitalised form, never as lowercase "ai" in a word
import { normalizeLabel, looksLikeAcronym, stem, STOP } from './normalize.js';
import { words, STOPWORDS } from './text.js';
import { indexStone, resolveLabel } from './stone.js';
import { makeConfig } from './config.js';

const MAX_PHRASE = 4;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function stemSeq(text) {
  return words(text).filter((w) => !STOP.has(w)).map(stem);
}

export function buildPhraseTable(stone) {
  const phrases = new Map(); // "stem stem" -> Map<cid, phraseNorm>
  const acronyms = new Map(); // "AI" -> cid
  const add = (key, cid, norm) => {
    if (!phrases.has(key)) phrases.set(key, new Map());
    phrases.get(key).set(cid, norm);
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
      add(info.stems.join(' '), c.id, norm);
    }
  }
  return { phrases, acronyms };
}

function matchText(text, table) {
  const found = new Map(); // cid -> {tf, phrase}
  const bump = (cid, phrase) => {
    const f = found.get(cid) ?? { tf: 0, phrase };
    f.tf += 1;
    found.set(cid, f);
  };
  const seq = stemSeq(text);
  for (let i = 0; i < seq.length; i++) {
    for (let n = 1; n <= MAX_PHRASE && i + n <= seq.length; n++) {
      const hit = table.phrases.get(seq.slice(i, i + n).join(' '));
      if (hit) for (const [cid, norm] of hit) bump(cid, norm);
    }
  }
  for (const [acr, cid] of table.acronyms) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(acr)}(?![\\p{L}\\p{N}])`, 'gu');
    const m = text.match(re);
    if (m) for (let i = 0; i < m.length; i++) bump(cid, acr);
  }
  return found;
}

export function emerge(stone, records, cfg = makeConfig()) {
  const E = cfg.emerge;
  const index = indexStone(stone);
  const table = buildPhraseTable(stone);
  const canonical = new Map(stone.concepts.map((c) => [c.id, c.canonical]));

  const explicit = new Map(); // "source::item" -> Set<cid>
  for (const r of records) {
    if (r.type !== 'tag' || (r.origin ?? 'explicit') !== 'explicit') continue;
    const hit = resolveLabel(index, r.label);
    if (!hit) continue;
    const k = `${r.source}::${r.item}`;
    if (!explicit.has(k)) explicit.set(k, new Set());
    explicit.get(k).add(hit.concept);
  }

  const items = records.filter((r) => r.type === 'item');
  const perItem = items.map((it) => {
    const body = `${it.title ?? ''}. ${it.text ?? ''}`;
    const inBody = matchText(body, table);
    const inTitle = matchText(it.title ?? '', table);
    return { it, inBody, inTitle };
  });

  const df = new Map();
  for (const { inBody } of perItem) for (const cid of inBody.keys()) df.set(cid, (df.get(cid) ?? 0) + 1);
  const N = items.length || 1;

  const out = [];
  for (const { it, inBody, inTitle } of perItem) {
    const have = explicit.get(`${it.source}::${it.id}`) ?? new Set();
    for (const [cid, f] of [...inBody.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
      if (have.has(cid)) continue;
      if ((df.get(cid) ?? 0) / N > E.maxDfRatio) continue;
      const weight = Math.min(0.9, 0.3 + 0.2 * Math.log2(1 + f.tf) + (inTitle.has(cid) ? 0.2 : 0));
      if (weight < E.minWeight) continue;
      out.push({
        type: 'tag',
        source: it.source,
        item: it.id,
        label: canonical.get(cid),
        weight: Number(weight.toFixed(3)),
        origin: 'emergent',
        concept: cid,
        why: `text mentions "${f.phrase}" ×${f.tf}${inTitle.has(cid) ? ' (in title)' : ''}`,
      });
    }
  }
  return out;
}

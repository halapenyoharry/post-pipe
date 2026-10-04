// Turns the JSONL record stream into an in-memory corpus: items, terms, sources.
//
// Record shapes (see docs/FORMATS.md):
//   {"type":"item","source":"posts","id":"smile","title":"…","text":"…","url":"…","date":"…","kind":"essay"}
//   {"type":"tag","source":"posts","item":"smile","label":"AI","weight":1,"origin":"explicit"}
//
// A "term" is one normalized label (norm key). Several raw spellings (AI, ai, A.I.) are
// forms of the same term. A "concept" (built later) is a cluster of terms across sources.
import { normalizeLabel, looksLikeAcronym } from './normalize.js';
import { itemIdentity } from './signals/anchor.js';

export const itemKey = (source, id) => `${source}::${id}`;

// The same article listed in two tag-systems (same URL, or same long title) is ONE thing.
// Returns Map<itemKey, representativeItemKey>; the representative is the member with the most text.
export function canonicalItems(items) {
  const groups = new Map();
  for (const it of items.values()) {
    const id = itemIdentity(it);
    if (!id) continue;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(it);
  }
  const canon = new Map();
  for (const members of groups.values()) {
    const rep = [...members].sort((a, b) => b.text.length - a.text.length || (a.key < b.key ? -1 : 1))[0];
    for (const m of members) canon.set(m.key, rep.key);
  }
  return canon;
}

// set of item keys -> set of representative keys (distinct real-world items)
export const entitySet = (corpus, keys) => new Set([...keys].map((k) => corpus.canonItem.get(k) ?? k));

export function loadCorpus(records, { ignore = new Set(), includeEmergent = false } = {}) {
  const items = new Map();
  const sources = new Map();
  const terms = new Map();

  const source = (name) => {
    if (!sources.has(name)) sources.set(name, { name, color: null, items: new Set(), tagged: new Set(), occurrences: 0 });
    return sources.get(name);
  };

  for (const r of records) {
    if (r.type !== 'item') continue;
    const key = itemKey(r.source, r.id);
    items.set(key, {
      key,
      source: r.source,
      id: String(r.id),
      title: r.title ?? String(r.id),
      text: r.text ?? '',
      url: r.url ?? '',
      date: r.date ?? '',
      kind: r.kind ?? '',
    });
    const s = source(r.source);
    if (r.color && !s.color) s.color = r.color;
    s.items.add(key);
  }

  const seenRow = new Set();
  for (const r of records) {
    const isTag = r.type === 'tag' || (!r.type && r.label !== undefined && r.item !== undefined);
    if (!isTag) continue;
    const origin = r.origin ?? 'explicit';
    if (origin === 'emergent' && !includeEmergent) continue;
    const info = normalizeLabel(r.label);
    if (!info.norm || ignore.has(info.norm)) continue;
    const key = itemKey(r.source, r.item);
    if (!items.has(key)) {
      items.set(key, { key, source: r.source, id: String(r.item), title: String(r.item), text: '', url: '', date: '', kind: '' });
      source(r.source).items.add(key);
    }
    const s = source(r.source);
    const rowId = `${key}\u0000${info.norm}`;
    let t = terms.get(info.norm);
    if (!t) {
      t = {
        norm: info.norm,
        tokens: info.tokens,
        content: info.content,
        stems: info.stems,
        skey: info.skey,
        tkey: info.tkey,
        forms: new Map(),
        formsBySource: new Map(),
        count: 0,
        explicit: 0,
        bySource: new Map(),
        items: new Set(),
        itemsBySource: new Map(),
        acronymLike: false,
      };
      terms.set(info.norm, t);
    }
    t.forms.set(info.raw, (t.forms.get(info.raw) ?? 0) + 1);
    if (!t.formsBySource.has(r.source)) t.formsBySource.set(r.source, new Map());
    const fs = t.formsBySource.get(r.source);
    fs.set(info.raw, (fs.get(info.raw) ?? 0) + 1);
    if (looksLikeAcronym(info.raw)) t.acronymLike = true;
    if (seenRow.has(rowId)) continue; // same tag twice on one item counts once
    seenRow.add(rowId);
    t.count += 1;
    if (origin === 'explicit') t.explicit += 1;
    t.bySource.set(r.source, (t.bySource.get(r.source) ?? 0) + 1);
    t.items.add(key);
    if (!t.itemsBySource.has(r.source)) t.itemsBySource.set(r.source, new Set());
    t.itemsBySource.get(r.source).add(key);
    s.tagged.add(key);
    s.occurrences += 1;
  }

  return { items, sources, terms, canonItem: canonicalItems(items) };
}

// Best display form of a term. Acronyms show as plain capitals ("A.I." -> "AI"); otherwise a
// spelling without hyphen/underscore joiners wins if any source wrote one (slugs are storage
// artifacts, not names), then the most frequent, then one with capitals.
export function displayForm(term) {
  const entries = [...term.forms.entries()];
  const byCount = (a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1);
  if (term.acronymLike && term.tokens.length === 1) {
    const acro = entries.filter(([raw]) => looksLikeAcronym(raw)).sort(byCount);
    return acro[0][0].replace(/[.\s]/g, '');
  }
  const clean = entries.filter(([raw]) => !/[-_]/.test(raw));
  const pool = clean.length ? clean : entries;
  return pool.sort((a, b) => b[1] - a[1] || Number(/[A-Z]/.test(b[0])) - Number(/[A-Z]/.test(a[0])) || (a[0] < b[0] ? -1 : 1))[0][0];
}

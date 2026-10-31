// Turns the JSONL record stream into an in-memory corpus: items, terms, sources.
//
// Record shapes (see docs/FORMATS.md):
//   {"type":"item","source":"posts","id":"smile","title":"…","text":"…","url":"…","date":"…","kind":"essay"}
//   {"type":"tag","source":"posts","item":"smile","label":"AI","weight":1,"origin":"explicit"}
//
// A "term" is one normalized label (norm key). Several raw spellings (AI, ai, A.I.) are
// forms of the same term. A "concept" (built later) is a cluster of terms across sources.
// A term's forms, counts and item sets are filed by scheme (see schemeOf below): the source for
// a human-written tag, `discovered` for one rtz-discover proposed. `sources` and `items` stay
// keyed by the real source, so coverage is still reported per tag-system.
import { normalizeLabel, looksLikeAcronym } from './normalize.js';
import { itemIdentity } from './signals/anchor.js';

export const itemKey = (source, id) => `${source}::${id}`;

// Schemes (SKOS concept schemes). Each tag-system is a scheme whose id is its source name; the
// discovered phrases rosetta-tagz finds are their own scheme, so a spelling only discovery wrote is never
// filed as if a human in that system had written it. `site` is the cross-scheme canonical. Both
// names are provisional; a real system that happens to be named `site` or `discovered` gets
// ` (system)` appended to its scheme id so the two never collide.
export const SITE_SCHEME = 'site';
export const DISCOVERED_SCHEME = 'discovered';
export const schemeOfSource = (source) => (source === SITE_SCHEME || source === DISCOVERED_SCHEME ? `${source} (system)` : source);
export const schemeOf = (record) => ((record.origin ?? 'explicit') === 'discovered' ? DISCOVERED_SCHEME : schemeOfSource(record.source));

// A discovered record under its own build's bar: its measured `sourceRatio` is below the
// `sourceCoherenceRatio` it was generated with, so only rtz-discover's lower floor admitted it. A
// viewer shows it when set at or below its ratio; rtz-stone never lets it move anything a build at
// the bar holds (lib/stone.js).
export const belowBar = (r) =>
  (r.origin ?? 'explicit') === 'discovered' &&
  typeof r.sourceRatio === 'number' &&
  typeof r.wasGeneratedBy?.parameters?.sourceCoherenceRatio === 'number' &&
  r.sourceRatio < r.wasGeneratedBy.parameters.sourceCoherenceRatio;

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

  const seenRow = new Map(); // "item\0norm" -> the scheme credited with the first row
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
        ratio: null, // the highest sourceRatio its discovered records carry
        unrated: false, // a record that a viewer cannot filter by ratio (human, emergent, or discovered without one)
        atBar: 0, // records that are not under their build's bar
      };
      terms.set(info.norm, t);
    }
    if (origin === 'discovered' && typeof r.sourceRatio === 'number') t.ratio = Math.max(t.ratio ?? -Infinity, r.sourceRatio);
    else t.unrated = true;
    if (!belowBar(r)) t.atBar += 1;
    // forms, counts and item sets are filed by SCHEME: a discovered spelling goes under
    // `discovered`, never under the system of the item it was found on
    const scheme = schemeOf(r);
    t.forms.set(info.raw, (t.forms.get(info.raw) ?? 0) + 1);
    if (!t.formsBySource.has(scheme)) t.formsBySource.set(scheme, new Map());
    const fs = t.formsBySource.get(scheme);
    fs.set(info.raw, (fs.get(info.raw) ?? 0) + 1);
    if (looksLikeAcronym(info.raw)) t.acronymLike = true;
    const credited = seenRow.get(rowId);
    if (credited !== undefined) {
      // the same tag twice on one item counts once; when discovery's row came first and a human's
      // follows, the credit moves to the human's system, whatever order the rows arrived in
      if (origin === 'explicit' && credited === DISCOVERED_SCHEME) {
        seenRow.set(rowId, scheme);
        t.explicit += 1;
        const left = t.bySource.get(credited) - 1;
        if (left) t.bySource.set(credited, left);
        else t.bySource.delete(credited);
        t.bySource.set(scheme, (t.bySource.get(scheme) ?? 0) + 1);
        const was = t.itemsBySource.get(credited);
        was.delete(key);
        if (!was.size) t.itemsBySource.delete(credited);
        if (!t.itemsBySource.has(scheme)) t.itemsBySource.set(scheme, new Set());
        t.itemsBySource.get(scheme).add(key);
      }
      continue;
    }
    seenRow.set(rowId, scheme);
    t.count += 1;
    if (origin === 'explicit') t.explicit += 1;
    t.bySource.set(scheme, (t.bySource.get(scheme) ?? 0) + 1);
    t.items.add(key);
    if (!t.itemsBySource.has(scheme)) t.itemsBySource.set(scheme, new Set());
    t.itemsBySource.get(scheme).add(key);
    s.tagged.add(key);
    s.occurrences += 1;
  }

  return { items, sources, terms, canonItem: canonicalItems(items) };
}

// The ratio a viewer must be set at or below to show this term: the highest of its discovered
// records' `sourceRatio`, when every record it has carries one; null when something always shows it.
export const ratioOf = (term) => (term.unrated || term.ratio === null ? null : term.ratio);

// Best display form of a term, always a spelling somebody wrote. An acronym shows as its most
// written acronym spelling, a tie going to plain capitals ("AI" over "A.I."; "A.I." stays "A.I."
// when it is the only one written, never rewritten to "AI"); otherwise a spelling without
// hyphen/underscore joiners wins if any source wrote one (slugs are storage artifacts, not names),
// then the most frequent, then one with capitals.
export function displayForm(term) {
  const entries = [...term.forms.entries()];
  if (term.acronymLike && term.tokens.length === 1) {
    const plain = (raw) => Number(!/[.\s]/.test(raw));
    const acro = entries.filter(([raw]) => looksLikeAcronym(raw)).sort((a, b) => b[1] - a[1] || plain(b[0]) - plain(a[0]) || (a[0] < b[0] ? -1 : 1));
    return acro[0][0];
  }
  const clean = entries.filter(([raw]) => !/[-_]/.test(raw));
  const pool = clean.length ? clean : entries;
  return pool.sort(byFormPreference)[0][0];
}

// displayForm's order among spellings: most used, then one with capitals, then alphabetical.
const byFormPreference = (a, b) => b[1] - a[1] || Number(/[A-Z]/.test(b[0])) - Number(/[A-Z]/.test(a[0])) || (a[0] < b[0] ? -1 : 1);

// The preferred spelling among `{raw: count}` entries of ONE scheme: the most frequent raw form as
// written, ties broken as displayForm breaks them (a spelling without joiners first, then one with
// capitals, then alphabetical). Never rewritten: a scheme's prefLabel is always something that
// scheme actually wrote.
export function preferredForm(formCounts) {
  const entries = Object.entries(formCounts);
  if (!entries.length) return null;
  const clean = (raw) => Number(!/[-_]/.test(raw));
  return entries.sort((a, b) => b[1] - a[1] || clean(b[0]) - clean(a[0]) || byFormPreference(a, b))[0][0];
}

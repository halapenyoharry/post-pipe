// The universe: the stone joined to the items it describes. One self-contained JSON document
// with everything a viewer (or any other tool, e.g. exoskeleton) needs to draw any projection.
//
// Two rules worth knowing:
//  - The same article listed in several tag-systems (same URL, or same long title) becomes ONE item
//    that carries the tags of all of them (item.alsoIn lists the other systems; each tag lists `sys`).
//  - Tags the stone has never seen become singleton "unmapped" concepts instead of being dropped,
//    so a stale stone degrades gracefully.
import { normalizeLabel, slugify } from './normalize.js';
import { indexStone, resolveLabel, schemeLabels } from './stone.js';
import { canonicalItems, schemeOfSource, SITE_SCHEME, DISCOVERED_SCHEME } from './corpus.js';

export const UNIVERSE_SCHEMA = 'rosetta-tagz/universe@1';

// The scheme an unmapped label is filed under: a human's category under its system, a discovered
// phrase under `discovered` (never under the system of the item it was found on), an emergent label
// under `site` alone, since it is a canonical of the stone that earned it, not a word any system wrote.
const schemeOfUnmapped = (r, origin) => (origin === 'discovered' ? DISCOVERED_SCHEME : origin === 'emergent' ? SITE_SCHEME : schemeOfSource(r.source));

// Golden-angle hues keep adjacent sources visibly distinct without a hand-made palette.
function sourceColor(i) {
  return `hsl(${Math.round((i * 137.508 + 25) % 360)}, 62%, 58%)`;
}

export function buildUniverse(stone, records) {
  const index = indexStone(stone);
  const concepts = new Map(stone.concepts.map((c) => [c.id, { ...c, n: 0, nEmergent: 0 }]));
  const items = new Map();
  const sourceNames = Object.keys(stone.systems);
  const ensureSource = (name) => {
    if (!sourceNames.includes(name)) sourceNames.push(name);
  };
  const bare = (source, id, title = String(id)) => ({ key: `${source}::${id}`, source, id: String(id), title, excerpt: '', url: '', kind: '', date: '', tags: new Map() });

  for (const r of records) {
    if (r.type !== 'item') continue;
    ensureSource(r.source);
    items.set(`${r.source}::${r.id}`, {
      ...bare(r.source, r.id, r.title ?? String(r.id)),
      excerpt: (r.text ?? '').slice(0, 280),
      url: r.url ?? '',
      kind: r.kind ?? '',
      date: r.date ?? '',
    });
  }

  const unmapped = new Map();
  const unmappedRows = new Set(); // "cid\0item\0scheme": a label counts once per item per scheme
  for (const r of records) {
    const isTag = r.type === 'tag' || (!r.type && r.label !== undefined && r.item !== undefined);
    if (!isTag) continue;
    ensureSource(r.source);
    const key = `${r.source}::${r.item}`;
    if (!items.has(key)) items.set(key, bare(r.source, r.item));
    const info = normalizeLabel(r.label);
    if (!info.norm) continue;
    const origin = r.origin ?? 'explicit';
    let cid = r.concept && concepts.has(r.concept) ? r.concept : null;
    let via = cid ? 'given' : null;
    if (!cid) {
      const hit = resolveLabel(index, r.label);
      if (hit) ({ concept: cid, via } = hit);
    }
    if (!cid) {
      cid = `u_${slugify(info.norm)}`;
      via = 'unmapped';
      const scheme = schemeOfUnmapped(r, origin);
      if (!concepts.has(cid)) {
        const c = {
          id: cid,
          canonical: r.label,
          pinned: false,
          locked: false,
          unmapped: true,
          inScheme: [], // filled from the forms once every record is in (schemeLabels, below)
          prefLabel: {},
          altLabel: {},
          items: 0,
          sources: {},
          variants: [{ norm: info.norm, label: r.label, forms: {}, formsBySource: {}, count: 0, explicit: 0, bySource: {}, acronym: false, tokens: info.tokens.length }],
          rank: [{ norm: info.norm, label: r.label, score: 1, parts: { freq: 1, cover: 1, trust: 1, quality: 1 } }],
          links: [],
          n: 0,
          nEmergent: 0,
        };
        concepts.set(cid, c);
        unmapped.set(cid, c);
      }
      // the spelling is evidence in the scheme that wrote it, exactly as the stone files its own
      const v = concepts.get(cid).variants[0];
      v.forms[r.label] = (v.forms[r.label] ?? 0) + 1;
      const written = (v.formsBySource[scheme] ??= {});
      written[r.label] = (written[r.label] ?? 0) + 1;
      const row = `${cid}\u0000${key}\u0000${scheme}`;
      if (!unmappedRows.has(row)) {
        unmappedRows.add(row);
        v.bySource[scheme] = (v.bySource[scheme] ?? 0) + 1;
        if (origin === 'explicit') v.explicit += 1;
      }
    }
    const item = items.get(key);
    const entry = item.tags.get(cid) ?? { c: cid, w: 0, origin, raw: [], via, why: r.why, sys: [r.source] };
    entry.w = Math.max(entry.w, r.weight ?? 1);
    if (origin === 'explicit') {
      entry.origin = 'explicit';
      entry.via = via;
      if (!entry.raw.some((x) => x.n === info.norm && x.l === r.label)) entry.raw.push({ l: r.label, n: info.norm, s: r.source });
    } else {
      if (!entry.why) entry.why = r.why;
      // an earned tag keeps the provenance its stage wrote, when it wrote any
      if (!entry.wasDerivedFrom && Array.isArray(r.wasDerivedFrom)) entry.wasDerivedFrom = r.wasDerivedFrom;
      if (!entry.wasGeneratedBy && r.wasGeneratedBy && typeof r.wasGeneratedBy === 'object') entry.wasGeneratedBy = r.wasGeneratedBy;
    }
    item.tags.set(cid, entry);
  }

  // per tag-system coverage is measured BEFORE merging identical items across systems
  const perSystem = {};
  for (const it of items.values()) {
    const s = (perSystem[it.source] ??= { items: 0, tagged: 0 });
    s.items += 1;
    if ([...it.tags.values()].some((t) => t.origin === 'explicit')) s.tagged += 1;
  }

  const merged = mergeIdentical(items);

  for (const item of merged.values()) {
    for (const t of item.tags) {
      provenance(t);
      const c = concepts.get(t.c);
      if (t.origin === 'explicit') c.n += 1;
      else c.nEmergent += 1;
      if (c.unmapped) {
        c.items += 1;
        for (const s of t.sys) c.sources[s] = (c.sources[s] ?? 0) + 1;
        c.variants[0].count += 1;
      }
    }
  }
  for (const c of unmapped.values()) Object.assign(c, schemeLabels(c.variants, c.canonical));

  const sources = sourceNames.map((name, i) => {
    const sys = stone.systems[name] ?? {};
    return {
      name,
      color: sys.color || sourceColor(i),
      weight: sys.weight ?? 1,
      items: perSystem[name]?.items ?? 0,
      tagged: perSystem[name]?.tagged ?? 0,
    };
  });

  const ids = new Set(concepts.keys());
  const list = [...merged.values()];
  return {
    schema: UNIVERSE_SCHEMA,
    generated: stone.generated ?? null,
    canon: stone.config.canon,
    sourceWeights: stone.config.sourceWeights ?? {},
    stats: {
      ...stone.stats,
      items: list.length,
      itemRecords: items.size,
      unmapped: unmapped.size,
      emergentTags: list.reduce((a, it) => a + it.tags.filter((t) => t.origin !== 'explicit').length, 0),
    },
    sources,
    concepts: [...concepts.values()].sort((a, b) => (a.id < b.id ? -1 : 1)),
    relations: stone.relations.filter((r) => ids.has(r.a) && ids.has(r.b)),
    items: list,
  };
}

// PROV on a tag entry. An explicit tag was derived from the categories the tag-systems wrote (one
// per `raw` entry) and generated by ingest (the record stream does not say which adapter, so the
// activity has no parameters); an earned tag carries whatever its stage recorded, or nothing. A PROV
// field is never present with a null value.
function provenance(t) {
  if (t.origin === 'explicit') {
    t.wasDerivedFrom = t.raw.map((r) => ({ type: 'category', scheme: schemeOfSource(r.s), label: r.l }));
    t.wasGeneratedBy = { activity: 'ingest', parameters: {} };
    return;
  }
  if (t.wasDerivedFrom == null) delete t.wasDerivedFrom;
  if (t.wasGeneratedBy == null) delete t.wasGeneratedBy;
}

// Collapse items that are the same real-world article in different tag-systems.
function mergeIdentical(items) {
  const forCanon = new Map([...items.values()].map((it) => [it.key, { key: it.key, title: it.title, url: it.url, text: it.excerpt }]));
  const canon = canonicalItems(forCanon);
  const out = new Map();
  for (const it of [...items.values()].sort((a, b) => (a.key < b.key ? -1 : 1))) {
    const repKey = canon.get(it.key) ?? it.key;
    if (!out.has(repKey)) {
      const rep = items.get(repKey);
      out.set(repKey, { ...rep, alsoIn: [], tags: new Map() });
    }
    const target = out.get(repKey);
    if (it.source !== target.source && !target.alsoIn.includes(it.source)) target.alsoIn.push(it.source);
    for (const [cid, entry] of it.tags) {
      const have = target.tags.get(cid);
      if (!have) {
        target.tags.set(cid, { ...entry, raw: [...entry.raw], sys: [...entry.sys] });
        continue;
      }
      have.w = Math.max(have.w, entry.w);
      if (entry.origin === 'explicit') have.origin = 'explicit';
      have.why ??= entry.why;
      if (!have.wasDerivedFrom && entry.wasDerivedFrom) have.wasDerivedFrom = entry.wasDerivedFrom;
      if (!have.wasGeneratedBy && entry.wasGeneratedBy) have.wasGeneratedBy = entry.wasGeneratedBy;
      for (const r of entry.raw) if (!have.raw.some((x) => x.n === r.n && x.l === r.l && x.s === r.s)) have.raw.push(r);
      for (const s of entry.sys) if (!have.sys.includes(s)) have.sys.push(s);
    }
  }
  for (const it of out.values()) it.tags = [...it.tags.values()].sort((a, b) => (a.c < b.c ? -1 : 1));
  return out;
}

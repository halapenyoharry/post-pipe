// The universe: the stone joined to the items it describes. One self-contained JSON document
// with everything a viewer (or any other tool, e.g. exoskeleton) needs to draw any projection.
// Unknown labels (data newer than the stone) become singleton "unmapped" concepts instead of
// being dropped, so a stale stone degrades gracefully.
import { normalizeLabel, slugify } from './normalize.js';
import { indexStone, resolveLabel } from './stone.js';

export const UNIVERSE_SCHEMA = 'rosetta-tagz/universe@1';

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

  for (const r of records) {
    if (r.type !== 'item') continue;
    ensureSource(r.source);
    const key = `${r.source}::${r.id}`;
    items.set(key, {
      key,
      source: r.source,
      id: String(r.id),
      title: r.title ?? String(r.id),
      excerpt: (r.text ?? '').slice(0, 280),
      url: r.url ?? '',
      kind: r.kind ?? '',
      date: r.date ?? '',
      tags: new Map(),
    });
  }

  const unmapped = new Map();
  for (const r of records) {
    const isTag = r.type === 'tag' || (!r.type && r.label !== undefined && r.item !== undefined);
    if (!isTag) continue;
    ensureSource(r.source);
    const key = `${r.source}::${r.item}`;
    if (!items.has(key)) {
      items.set(key, { key, source: r.source, id: String(r.item), title: String(r.item), excerpt: '', url: '', kind: '', date: '', tags: new Map() });
    }
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
      if (!concepts.has(cid)) {
        const c = {
          id: cid,
          canonical: r.label,
          pinned: false,
          locked: false,
          unmapped: true,
          items: 0,
          sources: {},
          variants: [{ norm: info.norm, label: r.label, forms: { [r.label]: 1 }, count: 0, bySource: {}, acronym: false, tokens: info.tokens.length }],
          rank: [{ norm: info.norm, label: r.label, score: 1, parts: { freq: 1, cover: 1, trust: 1, quality: 1 } }],
          links: [],
          n: 0,
          nEmergent: 0,
        };
        concepts.set(cid, c);
        unmapped.set(cid, c);
      }
    }
    const item = items.get(key);
    const entry = item.tags.get(cid) ?? { c: cid, w: 0, origin, raw: [], via, why: r.why };
    entry.w = Math.max(entry.w, r.weight ?? 1);
    if (origin === 'explicit') {
      entry.origin = 'explicit';
      entry.via = via;
      if (!entry.raw.some((x) => x.n === info.norm && x.l === r.label)) entry.raw.push({ l: r.label, n: info.norm });
    } else if (!entry.why) {
      entry.why = r.why;
    }
    item.tags.set(cid, entry);
  }

  for (const item of items.values()) {
    for (const t of item.tags.values()) {
      const c = concepts.get(t.c);
      if (t.origin === 'explicit') c.n += 1;
      else c.nEmergent += 1;
      if (c.unmapped) {
        c.items += 1;
        c.sources[item.source] = (c.sources[item.source] ?? 0) + 1;
        const v = c.variants[0];
        v.count += 1;
        v.bySource[item.source] = (v.bySource[item.source] ?? 0) + 1;
      }
    }
  }

  const sources = sourceNames.map((name, i) => {
    const sys = stone.systems[name] ?? {};
    const own = [...items.values()].filter((it) => it.source === name);
    return {
      name,
      color: sys.color || sourceColor(i),
      weight: sys.weight ?? 1,
      items: own.length,
      tagged: own.filter((it) => [...it.tags.values()].some((t) => t.origin === 'explicit')).length,
    };
  });

  const ids = new Set(concepts.keys());
  return {
    schema: UNIVERSE_SCHEMA,
    generated: stone.generated ?? null,
    canon: stone.config.canon,
    sourceWeights: stone.config.sourceWeights ?? {},
    stats: { ...stone.stats, unmapped: unmapped.size, emergentTags: [...items.values()].reduce((a, it) => a + [...it.tags.values()].filter((t) => t.origin !== 'explicit').length, 0) },
    sources,
    concepts: [...concepts.values()].sort((a, b) => (a.id < b.id ? -1 : 1)),
    relations: stone.relations.filter((r) => ids.has(r.a) && ids.has(r.b)),
    items: [...items.values()].map((it) => ({ ...it, tags: [...it.tags.values()].sort((a, b) => (a.c < b.c ? -1 : 1)) })),
  };
}

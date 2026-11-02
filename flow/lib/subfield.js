// flow-select: from a post-pipe feed.json to a subfield. A subfield is the part
// of the field the flow is projected from: cards with their tag references as
// the feed carries them, tagz as hyperedges, the tag-to-tag relations, the
// other edges on cards, the position (if any) and each card's distance from it.
// Nothing is added that the feed does not carry.

/** The SKOS relation layers post-pipe writes between two tagz (src/corpus/relationEdges.js). */
export const RELATION_LAYERS = ['broader', 'narrower', 'related', 'closeMatch', 'exactMatch', 'broadMatch', 'narrowMatch', 'relatedMatch'];

/** The fields of a tag reference the subfield keeps, in this order. */
const TAG_REF_FIELDS = ['type', 'concept', 'value', 'weight', 'origin', 'why', 'prefLabel', 'sourceRatio', 'systems'];

/** A hyperedge's id: the concept when rosetta-tagz gave one, else the tag string as the viewer names it. */
export function hyperedgeId(ref) {
  if (ref && typeof ref.concept === 'string' && ref.concept) return ref.concept;
  return `tag:${ref.value}`;
}

function tagRefsOf(item) {
  const refs = Array.isArray(item._references) ? item._references : [];
  const tagRefs = refs.filter((r) => r && r.type === 'tag' && typeof r.value === 'string' && r.value);
  if (tagRefs.length) return tagRefs;
  // Without references (a feed built without rosetta-tagz) a tag string is
  // read as an explicit tag of weight 1, the weight rosetta-tagz gives an
  // explicit tag. This fallback is the worker's; the reference path is the one
  // the frozen corpus takes.
  const tags = Array.isArray(item.tags) ? item.tags : [];
  return tags
    .filter((t) => typeof t === 'string' && t.trim())
    .map((t) => ({ type: 'tag', value: t, weight: 1, origin: 'explicit', why: null }));
}

function trimRef(ref) {
  const out = {};
  for (const k of TAG_REF_FIELDS) if (ref[k] !== undefined) out[k] = ref[k];
  return out;
}

function numberOr(v, d) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

/** Everything flow-select may carry, built once from the feed. */
export function buildField(feed) {
  if (!feed || !Array.isArray(feed.items)) throw new Error('feed has no items array');
  const items = feed.items.filter((it) => it && typeof it.id === 'string');
  const cardIds = new Set(items.map((it) => it.id));
  const rt = feed._rtagz && typeof feed._rtagz === 'object' ? feed._rtagz : {};
  const concepts = new Map();
  for (const c of Array.isArray(rt.concepts) ? rt.concepts : []) {
    if (c && typeof c.id === 'string') concepts.set(c.id, c);
  }
  const schemes = Array.isArray(rt.schemes)
    ? rt.schemes.filter((s) => s && typeof s.id === 'string').map((s) => ({ id: s.id, label: s.label, kind: s.kind }))
    : [];

  const cards = items.map((it, index) => {
    const refs = Array.isArray(it._references) ? it._references : [];
    const tagRefs = tagRefsOf(it).map(trimRef);
    const untagged = refs.filter((r) => r && r.type === 'untagged');
    return {
      id: it.id,
      title: typeof it.title === 'string' ? it.title : '',
      url: typeof it.url === 'string' ? it.url : '',
      source: it._source && typeof it._source.title === 'string' ? it._source.title : null,
      date: typeof it.date_published === 'string' ? it.date_published : null,
      kind: typeof it.kind === 'string' ? it.kind : null,
      index,
      distance: null,
      references: [...tagRefs, ...untagged],
    };
  });

  // Tagz as hyperedges: one per concept (or tag string), members with weights.
  const tagz = new Map();
  for (const card of cards) {
    for (const ref of card.references) {
      if (ref.type !== 'tag') continue;
      const id = hyperedgeId(ref);
      let h = tagz.get(id);
      if (!h) {
        const c = ref.concept ? concepts.get(ref.concept) : null;
        h = { id, concept: ref.concept || null, label: ref.value, members: [] };
        if (c && c.prefLabel && typeof c.prefLabel === 'object') h.prefLabel = c.prefLabel;
        else if (ref.prefLabel && typeof ref.prefLabel === 'object') h.prefLabel = ref.prefLabel;
        if (c && Array.isArray(c.inScheme)) h.inScheme = c.inScheme;
        tagz.set(id, h);
      }
      if (!h.members.some((m) => m.card === card.id)) {
        h.members.push({ card: card.id, weight: numberOr(ref.weight, 1), origin: ref.origin ?? null });
      }
    }
  }
  const labelToTag = new Map();
  for (const h of tagz.values()) if (!labelToTag.has(h.label)) labelToTag.set(h.label, h.id);

  const tagIdOf = (endpoint) => {
    if (typeof endpoint !== 'string' || !endpoint.startsWith('tag:')) return null;
    const label = endpoint.slice(4);
    return labelToTag.get(label) || null;
  };

  const relations = [];
  const links = [];
  for (const e of Array.isArray(feed.edges) ? feed.edges : []) {
    if (!e || typeof e.source !== 'string' || typeof e.target !== 'string') continue;
    if (e.layer === 'containment' || e.role === 'contains') continue;
    if (RELATION_LAYERS.includes(e.layer)) {
      const attrs = e.attrs || {};
      // rosetta-tagz's {a, b} (a is the broader for broader and broadMatch) when
      // the edge carries concept ids; else the two tag strings as named.
      const a = typeof attrs.concept === 'string' && tagz.has(attrs.concept) ? attrs.concept : tagIdOf(e.source);
      const b = typeof attrs.target === 'string' && tagz.has(attrs.target) ? attrs.target : tagIdOf(e.target);
      if (!a || !b || a === b) continue;
      const r = { type: e.layer, a, b, directed: Boolean(e.directed), weight: numberOr(attrs.weight, 1) };
      if (typeof attrs.why === 'string') r.why = attrs.why;
      relations.push(r);
      continue;
    }
    if (e.layer === 'tag') continue; // already a hyperedge, from the references
    if (!cardIds.has(e.source) && !cardIds.has(e.target)) continue;
    links.push({ source: e.source, target: e.target, layer: e.layer ?? null, role: e.role ?? null, directed: Boolean(e.directed) });
  }

  return { schemes, cards, tagz: [...tagz.values()], relations, links };
}

/** Adjacency over cards and tagz: card to tag (a member), card to card (a link between two cards). */
export function adjacencyOf(sub) {
  const adj = new Map();
  const add = (x, y) => {
    if (!adj.has(x)) adj.set(x, new Set());
    if (!adj.has(y)) adj.set(y, new Set());
    adj.get(x).add(y);
    adj.get(y).add(x);
  };
  const cardIds = new Set(sub.cards.map((c) => c.id));
  for (const c of sub.cards) if (!adj.has(c.id)) adj.set(c.id, new Set());
  for (const h of sub.tagz) {
    if (!adj.has(h.id)) adj.set(h.id, new Set());
    for (const m of h.members) if (cardIds.has(m.card)) add(h.id, m.card);
  }
  for (const l of sub.links) if (cardIds.has(l.source) && cardIds.has(l.target) && l.source !== l.target) add(l.source, l.target);
  return adj;
}

/** Hops from start to every reachable node, breadth first; deterministic given the adjacency's insertion order. */
export function hopsFrom(adj, start) {
  const hops = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const x = queue.shift();
    const d = hops.get(x);
    for (const y of adj.get(x) || []) {
      if (!hops.has(y)) {
        hops.set(y, d + 1);
        queue.push(y);
      }
    }
  }
  return hops;
}

function restrict(field, keep, selector, position) {
  const keepSet = new Set(keep);
  const cards = field.cards.filter((c) => keepSet.has(c.id)).map((c) => ({ ...c }));
  const tagz = field.tagz
    .map((h) => ({ ...h, members: h.members.filter((m) => keepSet.has(m.card)) }))
    .filter((h) => h.members.length);
  const tagIds = new Set(tagz.map((h) => h.id));
  const relations = field.relations.filter((r) => tagIds.has(r.a) && tagIds.has(r.b));
  const links = field.links.filter((l) => (keepSet.has(l.source) || keepSet.has(l.target))
    && (!field.cardIds.has(l.source) || keepSet.has(l.source))
    && (!field.cardIds.has(l.target) || keepSet.has(l.target)));
  const sub = { selector, position, schemes: field.schemes, cards, tagz, relations, links };
  if (position) {
    const hops = hopsFrom(adjacencyOf(sub), position);
    for (const c of sub.cards) c.distance = hops.has(c.id) ? hops.get(c.id) : null;
  }
  return sub;
}

/**
 * The selectors. `hops` for --around counts card steps: one step is a shared
 * tag or a direct link between two cards. `distance` on each card is in the
 * finer unit the task names (card to tag to card counts 2).
 */
export function select(feed, selector) {
  const field = buildField(feed);
  field.cardIds = new Set(field.cards.map((c) => c.id));
  const mode = selector.mode || 'all';
  if (mode === 'all') {
    return restrict(field, field.cards.map((c) => c.id), { mode: 'all' }, null);
  }
  if (mode === 'set') {
    const ids = (selector.ids || []).filter(Boolean);
    if (!ids.length) throw new Error('--set needs at least one card id');
    const missing = ids.filter((id) => !field.cardIds.has(id));
    if (missing.length) throw new Error(`--set names cards the feed does not have: ${missing.join(', ')}`);
    return restrict(field, ids, { mode: 'set', ids }, null);
  }
  if (mode === 'around') {
    const id = selector.id;
    if (!id || !field.cardIds.has(id)) throw new Error(`--around names a card the feed does not have: ${id}`);
    const hops = Number.isInteger(selector.hops) && selector.hops >= 0 ? selector.hops : 1;
    const whole = { cards: field.cards, tagz: field.tagz, links: field.links };
    const adj = adjacencyOf(whole);
    const fine = hopsFrom(adj, id);
    // A card step through a tag is two fine hops; a direct link is one. A card
    // is within n steps when its fine distance is at most 2n.
    const keep = field.cards.filter((c) => fine.has(c.id) && fine.get(c.id) <= 2 * hops).map((c) => c.id);
    return restrict(field, keep, { mode: 'around', id, hops }, id);
  }
  throw new Error(`unknown selector ${mode}`);
}

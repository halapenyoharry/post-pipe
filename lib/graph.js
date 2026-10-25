// Graph projections of a universe. IMPORT-FREE: shared by the rtz-graph CLI and the browser viewer.
//
//   raw       items + one tag node per (tag-system, spelling). Shows the duplication the stone removes.
//   hyper     items + one node per CONCEPT. Tags are vertices (hypergraph incidence form).
//   dyadic    items only. A tag is no longer a node: it is the label on the edge between two items.
//   concepts  concepts only, joined by their relations.
//
// All modes accept {focus: conceptId, hops: n} to cut a neighbourhood: the "pull the tag up and
// explore" view. Every node/link carries plain data so any force-graph renderer can draw it.

export const MODES = ['raw', 'hyper', 'dyadic', 'concepts'];
// SKOS names last: closeMatch (a cross-scheme `near`), broadMatch (a cross-scheme `broader`), relatedMatch
// (a cross-scheme `related` with text support), exactMatch (human-asserted, or a vocabulary mapping)
export const RELATION_TYPES = ['broader', 'related', 'adjacent', 'near', 'synergy', 'opposes', 'closeMatch', 'broadMatch', 'relatedMatch', 'exactMatch'];

const defaults = {
  labels: null, // Map<conceptId, label> to override canonical labels (live re-ranking)
  focus: null,
  hops: 2,
  relations: true,
  relationTypes: null, // Set of types to show; null = all
  emergent: true,
  minWeight: 0,
  neighbors: 6, // dyadic: strongest neighbours kept per item
  maxCommon: 0.5, // dyadic: ignore concepts on more than this share of items
  hiddenSources: null, // Set of source names to hide
};

export function projectGraph(U, mode = 'hyper', options = {}) {
  const o = { ...defaults, ...options };
  const concept = new Map(U.concepts.map((c) => [c.id, c]));
  const label = (cid) => o.labels?.get(cid) ?? concept.get(cid)?.canonical ?? cid;
  const srcOk = (s) => !o.hiddenSources || !o.hiddenSources.has(s);
  const items = U.items.filter((it) => srcOk(it.source) || (it.alsoIn ?? []).some(srcOk));
  const tagsOf = (it) => it.tags.filter((t) => (o.emergent || t.origin === 'explicit') && t.w >= o.minWeight && (!t.sys || t.sys.some(srcOk)));
  const relOk = (r) => o.relations && (!o.relationTypes || o.relationTypes.has(r.type));

  const nodes = new Map();
  const links = [];
  const addNode = (n) => {
    if (!nodes.has(n.id)) nodes.set(n.id, n);
    return nodes.get(n.id);
  };
  const itemNode = (it) =>
    addNode({ id: `i:${it.key}`, type: 'item', label: it.title, source: it.source, alsoIn: it.alsoIn ?? [], kind: it.kind, url: it.url, val: 1, itemKey: it.key });
  const conceptNode = (cid) => {
    const c = concept.get(cid);
    return addNode({
      id: `c:${cid}`,
      type: 'concept',
      label: label(cid),
      concept: cid,
      val: 2 + Math.sqrt(c.n + c.nEmergent) * 2.2,
      n: c.n,
      nEmergent: c.nEmergent,
      sources: c.sources,
      merged: c.variants.length > 1,
      unmapped: !!c.unmapped,
    });
  };

  if (mode === 'raw') {
    for (const it of items) {
      itemNode(it);
      for (const t of it.tags) {
        if (t.origin !== 'explicit') continue;
        for (const r of t.raw) {
          if (!srcOk(r.s ?? it.source)) continue;
          const id = `t:${r.s ?? it.source}:${r.n}`;
          const node = addNode({ id, type: 'term', label: r.l, source: r.s ?? it.source, concept: t.c, val: 1.2, count: 0 });
          node.count += 1;
          node.val = 1.2 + Math.sqrt(node.count) * 1.4;
          links.push({ source: `i:${it.key}`, target: id, type: 'tag', weight: 1 });
        }
      }
    }
  } else if (mode === 'hyper') {
    for (const it of items) {
      itemNode(it);
      for (const t of tagsOf(it)) {
        conceptNode(t.c);
        links.push({ source: `i:${it.key}`, target: `c:${t.c}`, type: 'tag', origin: t.origin, weight: t.w, why: t.why });
      }
    }
    if (o.relations) {
      for (const r of U.relations) {
        if (relOk(r) && nodes.has(`c:${r.a}`) && nodes.has(`c:${r.b}`)) links.push({ source: `c:${r.a}`, target: `c:${r.b}`, type: r.type, weight: r.weight, relation: true });
      }
    }
  } else if (mode === 'dyadic') {
    const N = items.length || 1;
    const df = new Map();
    for (const it of items) for (const t of tagsOf(it)) df.set(t.c, (df.get(t.c) ?? 0) + 1);
    const byConcept = new Map();
    for (const it of items) {
      itemNode(it);
      for (const t of tagsOf(it)) {
        if ((df.get(t.c) ?? 0) / N > o.maxCommon) continue;
        if (!byConcept.has(t.c)) byConcept.set(t.c, []);
        byConcept.get(t.c).push([it, t.w]);
      }
    }
    const pair = new Map();
    for (const [cid, members] of byConcept) {
      if (members.length > 60) continue;
      const idf = Math.log(1 + N / members.length);
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          const [a, wa] = members[i];
          const [b, wb] = members[j];
          const k = a.key < b.key ? `${a.key}\u0000${b.key}` : `${b.key}\u0000${a.key}`;
          const e = pair.get(k) ?? { a: a.key < b.key ? a.key : b.key, b: a.key < b.key ? b.key : a.key, weight: 0, tags: [] };
          e.weight += idf * Math.min(wa, wb);
          e.tags.push(cid);
          pair.set(k, e);
        }
      }
    }
    const perItem = new Map();
    for (const e of pair.values()) for (const k of [e.a, e.b]) (perItem.get(k) ?? perItem.set(k, []).get(k)).push(e);
    const keep = new Set();
    for (const list of perItem.values()) {
      list.sort((x, y) => y.weight - x.weight);
      for (const e of list.slice(0, o.neighbors)) keep.add(e);
    }
    for (const e of keep) {
      links.push({
        source: `i:${e.a}`,
        target: `i:${e.b}`,
        type: 'shared',
        weight: Number(e.weight.toFixed(3)),
        tags: e.tags,
        label: e.tags.map(label).join(' · '),
      });
    }
  } else if (mode === 'concepts') {
    for (const c of U.concepts) {
      if (c.n + c.nEmergent === 0) continue;
      if (o.hiddenSources && !Object.keys(c.sources).some(srcOk)) continue;
      conceptNode(c.id);
    }
    for (const r of U.relations) {
      if (relOk(r) && nodes.has(`c:${r.a}`) && nodes.has(`c:${r.b}`)) links.push({ source: `c:${r.a}`, target: `c:${r.b}`, type: r.type, weight: r.weight, relation: true });
    }
  } else {
    throw new Error(`unknown mode "${mode}" (${MODES.join(', ')})`);
  }

  let graph = { nodes: [...nodes.values()], links };
  if (o.focus) graph = neighborhood(graph, mode, o.focus, o.hops);
  graph.meta = { mode, focus: o.focus, nodes: graph.nodes.length, links: graph.links.length };
  return graph;
}

// k-hop neighbourhood around a concept (or around the items/terms that carry it in dyadic/raw modes)
export function neighborhood(graph, mode, conceptId, hops = 2) {
  const seeds = new Set();
  for (const n of graph.nodes) if (n.concept === conceptId) seeds.add(n.id);
  if (mode === 'dyadic') {
    for (const l of graph.links) if (l.tags?.includes(conceptId)) {
      seeds.add(l.source.id ?? l.source);
      seeds.add(l.target.id ?? l.target);
    }
  }
  const adj = new Map();
  for (const l of graph.links) {
    const s = l.source.id ?? l.source;
    const t = l.target.id ?? l.target;
    (adj.get(s) ?? adj.set(s, new Set()).get(s)).add(t);
    (adj.get(t) ?? adj.set(t, new Set()).get(t)).add(s);
  }
  const seen = new Set(seeds);
  let frontier = [...seeds];
  for (let h = 0; h < hops; h++) {
    const next = [];
    for (const id of frontier) for (const n of adj.get(id) ?? []) if (!seen.has(n)) {
      seen.add(n);
      next.push(n);
    }
    frontier = next;
  }
  return {
    nodes: graph.nodes.filter((n) => seen.has(n.id)),
    links: graph.links.filter((l) => seen.has(l.source.id ?? l.source) && seen.has(l.target.id ?? l.target)),
  };
}

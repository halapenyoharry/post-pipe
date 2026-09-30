// ─── Build edges ─────────────────────────────────────────────────────────────
// Edges are emitted into feed.json as a sibling of `items` so the corpus is a
// graph on disk rather than a list that a renderer has to infer edges from.
//
// The shape matches the GraphLink contract shared by the Exoskeleton graph
// panels (source/target/label/directed/role/layer/attrs), so any consumer that
// speaks it — json-graph, json-cytoscape, json-graph3d, topoviewer, and
// graph-reader — can render the corpus without a post-pipe-specific transform.
//
// `layer` is the toggle/color axis: 'authored' | 'tag' | 'topology' | 'sequence'
// | 'containment'.
// Authored edges are the ones Harold wrote by hand; inferred ones are derived
// from shared vocabulary. They are deliberately separable.

function slugOf(item) {
  return item.url.split('/').pop().replace('.html', '');
}

function buildEdges(items, options = {}) {
  const edges = [];
  const idBySlug = new Map();
  for (const item of items) idBySlug.set(slugOf(item), item.id);

  // An authored target that has no bundle yet keeps its slug as the id. The
  // consumer materializes it as a bare node, so an edge can point at a piece
  // that has not been written. Not an error — a placeholder with gravity.
  const resolve = (slug) => idBySlug.get(slug) || slug;

  const containmentConfigs = options.containment || [];
  const containerByTag = new Map();
  for (const c of containmentConfigs) {
    if (c.tag) containerByTag.set(c.tag, c);
  }

  // Hierarchical containment edges between containers (e.g. Epic contains Act 1)
  for (const c of containmentConfigs) {
    if (c.parent) {
      edges.push({
        source: c.parent,
        target: c.id,
        directed: true,
        role: 'contains',
        layer: 'containment',
        attrs: { parent: c.parent, child: c.id, label: c.label || c.id },
      });
    }
  }

  const seriesMembers = new Map();

  for (const item of items) {
    const source = item.id;

    // Authored. Directional: A claims a connection to B; B need not reciprocate.
    for (const slug of item.connected_to || []) {
      edges.push({
        source,
        target: resolve(slug),
        directed: true,
        role: 'connected_to',
        layer: 'authored',
        attrs: { resolved: idBySlug.has(slug) },
      });
    }

    // Subject keywords. Check if any tags belong to containment hierarchy.
    const itemContainers = [];
    for (const tag of item.tags || []) {
      const container = containerByTag.get(tag);
      if (container) {
        itemContainers.push(container);
      } else {
        // Regular tag -> normal undirected tag edge
        edges.push({
          source,
          target: `tag:${tag}`,
          directed: false,
          role: 'tagged',
          layer: 'tag',
        });
      }
    }

    // Connect item to its immediate enclosing container.
    // If multiple container tags apply (e.g. Epic and Act 1), connect to the leaf container;
    // the parent container already hierarchically contains the child container.
    if (itemContainers.length > 0) {
      const parentIds = new Set(itemContainers.map((c) => c.parent).filter(Boolean));
      const leafContainers = itemContainers.filter((c) => !parentIds.has(c.id));
      const targetContainer = leafContainers[0] || itemContainers[0];

      edges.push({
        source: targetContainer.id,
        target: source,
        directed: true,
        role: 'contains',
        layer: 'containment',
        attrs: { container: targetContainer.id, label: targetContainer.label || targetContainer.id },
      });
    }

    // Substrate-independent structural pattern. A separate vocabulary from
    // tags on purpose — they cluster differently, so they get their own layer.
    for (const topo of item.topology || []) {
      edges.push({
        source,
        target: `topology:${topo}`,
        directed: false,
        role: 'exhibits',
        layer: 'topology',
      });
    }

    if (item.series) {
      if (!seriesMembers.has(item.series)) seriesMembers.set(item.series, []);
      seriesMembers.get(item.series).push(item);
    }
  }

  // Ordered sequence. A series is a path, not a cluster — this is the relation
  // a serialized novel needs, and the only one where edge order is meaningful.
  for (const [series, members] of seriesMembers) {
    members.sort((a, b) => (Number(a.series_part) || 0) - (Number(b.series_part) || 0));
    for (let i = 0; i < members.length - 1; i++) {
      edges.push({
        source: members[i].id,
        target: members[i + 1].id,
        directed: true,
        role: 'next',
        layer: 'sequence',
        attrs: { series, from_part: members[i].series_part, to_part: members[i + 1].series_part },
      });
    }
  }

  return mergeSequenceDuplicates(edges);
}

// An authored connected_to between two pieces that already follow one another
// in a series says nothing the `next` edge doesn't. A site that writes prev/next
// links as connected_to would otherwise draw three lines per pair, two of them
// unlabeled. So such an edge, in either direction, folds into the `next` edge
// (which records that it was also authored). Authored edges between pieces that
// are not neighbours in a series stay as they are.
function mergeSequenceDuplicates(edges) {
  const pairKey = (a, b) => (a < b ? a + '\u0000' + b : b + '\u0000' + a);
  const nextByPair = new Map();
  for (const e of edges) {
    if (e.layer === 'sequence') nextByPair.set(pairKey(e.source, e.target), e);
  }
  if (nextByPair.size === 0) return edges;
  return edges.filter((e) => {
    if (e.layer !== 'authored') return true;
    const next = nextByPair.get(pairKey(e.source, e.target));
    if (!next) return true;
    const dir = e.source === next.source ? 'forward' : 'backward';
    next.attrs.authored = [...new Set([...(next.attrs.authored || []), dir])];
    return false;
  });
}

module.exports = { buildEdges, slugOf };

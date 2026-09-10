// ─── Build edges ─────────────────────────────────────────────────────────────
// Edges are emitted into feed.json as a sibling of `items` so the corpus is a
// graph on disk rather than a list that a renderer has to infer edges from.
//
// The shape matches the GraphLink contract shared by the Exoskeleton graph
// panels (source/target/label/directed/role/layer/attrs), so any consumer that
// speaks it — json-graph, json-cytoscape, json-graph3d, topoviewer, and
// graph-reader — can render the corpus without a post-pipe-specific transform.
//
// `layer` is the toggle/color axis: 'authored' | 'tag' | 'topology' | 'sequence'.
// Authored edges are the ones Harold wrote by hand; inferred ones are derived
// from shared vocabulary. They are deliberately separable.

function slugOf(item) {
  return item.url.split('/').pop().replace('.html', '');
}

function buildEdges(items) {
  const edges = [];
  const idBySlug = new Map();
  for (const item of items) idBySlug.set(slugOf(item), item.id);

  // An authored target that has no bundle yet keeps its slug as the id. The
  // consumer materializes it as a bare node, so an edge can point at a piece
  // that has not been written. Not an error — a placeholder with gravity.
  const resolve = (slug) => idBySlug.get(slug) || slug;

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

    // Subject keywords. Membership, so undirected. The tag id is materialized
    // by the consumer; it is not an item.
    for (const tag of item.tags || []) {
      edges.push({
        source,
        target: `tag:${tag}`,
        directed: false,
        role: 'tagged',
        layer: 'tag',
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

  return edges;
}

module.exports = { buildEdges, slugOf };

// The tags in the top bar's list (the tag button beside the graph's controls
// when they sit in the top bar, src/components/Toolbar): one row per tag the
// graph draws, from the feed's edges of layer 'tag', with the pieces it joins
// counted and its colour blended from their feeds (src/lib/blendColors.js),
// the way the graph paints the tag node (paintTagColors in
// src/components/GraphViewer). A hidden feed's pieces count for nothing, so a
// tag with every piece hidden leaves the list as its node leaves the graph.
//
// Pure, so it can be tested without the DOM.

const { blendColors } = require('./blendColors');

// The list offers a search field once it is longer than this.
const SEARCH_FROM = 20;

// Whether the graph draws tag nodes at all: the tag layer is on
// (graph.visibleLayers names it) and the feed has an edge of that layer.
function hasTagNodes(feedData, graphSettings) {
  const layers = graphSettings && Array.isArray(graphSettings.visibleLayers) ? graphSettings.visibleLayers : ['sequence'];
  if (!layers.includes('tag')) return false;
  const edges = feedData && Array.isArray(feedData.edges) ? feedData.edges : [];
  return edges.some((e) => e && e.layer === 'tag');
}

// The rows, alphabetical by tag:
//   { id, label, count, color, contributors: [{ sourceId, title, count }] }
// id is the node's ('tag:<name>'), label the name. color is '#rrggbb', or
// null when no piece has a readable colour and no fallback was given.
// contributors are the feeds the pieces come from, most pieces first.
//   hiddenSources: Set (or array) of source ids whose pieces do not count
//   sourceColorOf: (sourceId) => the reader's own colour for that feed, or null
//   fallbackColor: the colour a piece without a feed colour weighs in as (the
//                  theme's tag colour)
function tagListModel(feedData, { hiddenSources, sourceColorOf, fallbackColor } = {}) {
  const items = feedData && Array.isArray(feedData.items) ? feedData.items : [];
  const edges = feedData && Array.isArray(feedData.edges) ? feedData.edges : [];
  const sources = feedData && Array.isArray(feedData._sources) ? feedData._sources : [];
  const hidden = hiddenSources instanceof Set ? hiddenSources : new Set(hiddenSources || []);
  const byId = new Map(items.map((it) => [it.id, it]));
  const sourceById = new Map(sources.map((s) => [s.id, s]));

  const tags = new Map(); // tag id -> Set of piece ids
  for (const e of edges) {
    if (!e || e.layer !== 'tag') continue;
    const isTag = (v) => typeof v === 'string' && v.startsWith('tag:');
    const tagId = isTag(e.target) ? e.target : (isTag(e.source) ? e.source : null);
    const pieceId = tagId === e.target ? e.source : e.target;
    if (!tagId || !byId.has(pieceId)) continue;
    if (!tags.has(tagId)) tags.set(tagId, new Set());
    tags.get(tagId).add(pieceId);
  }

  const sourceIdOf = (item) => (item && item._source && item._source.id) || null;
  const colorOf = (item) => {
    const sid = sourceIdOf(item);
    if (!sid) return null;
    const own = typeof sourceColorOf === 'function' ? sourceColorOf(sid) : null;
    const src = sourceById.get(sid) || item._source;
    return own || (src && src.color) || null;
  };

  const rows = [];
  for (const [id, pieceIds] of tags) {
    const pieces = [...pieceIds].map((pid) => byId.get(pid)).filter((it) => !hidden.has(sourceIdOf(it)));
    if (!pieces.length) continue;
    const perSource = new Map();
    for (const it of pieces) {
      const sid = sourceIdOf(it);
      const key = sid || '';
      if (!perSource.has(key)) {
        const src = sid ? (sourceById.get(sid) || it._source) : null;
        perSource.set(key, { sourceId: sid, title: (src && (src.title || src.id)) || '', count: 0 });
      }
      perSource.get(key).count += 1;
    }
    const contributors = [...perSource.values()].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
    rows.push({
      id,
      label: id.slice(4),
      count: pieces.length,
      color: blendColors(pieces.map((it) => ({ color: colorOf(it), weight: 1 })), fallbackColor),
      contributors,
    });
  }
  rows.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }) || a.label.localeCompare(b.label));
  return rows;
}

// The rows whose label has the text typed, case aside; all of them for
// nothing typed.
function filterTagRows(rows, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => r.label.toLowerCase().includes(q));
}

// What a row says when hovered: its colour, then the feeds its pieces come
// from with how many each brings ("#a1b2c3 · Example pieces 3, Posts 1").
function tagRowTitle(row) {
  const parts = [];
  if (row.color) parts.push(row.color);
  const feeds = (row.contributors || []).filter((c) => c.title).map((c) => `${c.title} ${c.count}`);
  if (feeds.length) parts.push(feeds.join(', '));
  return parts.join(' · ');
}

module.exports = { SEARCH_FROM, hasTagNodes, tagListModel, filterTagRows, tagRowTitle };

// The tags in the top bar's list (the tag button beside the graph's controls
// when they sit in the top bar, src/components/Toolbar): one row per tag the
// graph draws, from the feed's edges of layer 'tag', with the pieces it joins
// counted and its colour blended from their feeds (src/lib/blendColors.js),
// the way the graph paints the tag node (paintTagColors in
// src/components/GraphViewer). A hidden feed's pieces count for nothing, so a
// tag with every piece hidden leaves the list as its node leaves the graph.
// A tag the panel's pieces per tag slider hides (the preference minTagPieces,
// src/lib/minPieces.js) leaves it too. The rows run from the tag on the most
// pieces to the fewest, counted as the slider counts them (every feed's
// pieces, so a row keeps its place when a feed is hidden), ties by name; so
// raising the slider trims the list from its end. (Harold chose this order
// on 2026-10-31; it replaced the alphabetical one.)
//
// Pure, so it can be tested without the DOM.

const { blendColors } = require('./blendColors');
const { clampMinPieces } = require('./minPieces');

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

// The rows, the tag on the most pieces first, ties by name (case aside):
//   { id, label, count, pieces, color, contributors: [{ sourceId, title, count }] }
// id is the node's ('tag:<name>'), label the name. pieces is the number the
// slider reads, the rows are ordered by and the list shows: the distinct
// pieces the tag is on, every feed counted (the graph's own count when
// tagCounts has the tag). count is the pieces showing (a hidden feed's left
// out). color is '#rrggbb', or null when no piece has a readable colour and
// no fallback was given. contributors are the feeds the showing pieces come
// from, most pieces first.
//   hiddenSources: Set (or array) of source ids whose pieces do not count
//   sourceColorOf: (sourceId) => the reader's own colour for that feed, or null
//   fallbackColor: the colour a piece without a feed colour weighs in as (the
//                  theme's tag colour)
//   minPieces:     the pieces per tag chosen (the preference minTagPieces,
//                  null for 1): a tag on fewer is left out. It is clamped to
//                  the slider's top, as the graph and the panel clamp it.
//   tagCounts:     the graph's count for each tag, by id (a Map or a plain
//                  object, where a tag collapsed into another at a depth
//                  above 0 has the count of the bubble that shows it), or
//                  null to count from the feed
//   maxPieces:     the slider's top, the largest count the graph published
//                  (window.PostPipeGraphTags.counts), or null for the largest
//                  of tagCounts, else of the feed's counts
function tagListModel(feedData, { hiddenSources, sourceColorOf, fallbackColor, minPieces = null, tagCounts = null, maxPieces = null } = {}) {
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

  // The slider's count for each tag, and the value in force, clamped to the
  // slider's top: the largest count among every tag (a hidden feed's tags
  // too), as the graph and the panel read it.
  const graphCounts = tagCounts instanceof Map ? tagCounts
    : (tagCounts && typeof tagCounts === 'object' ? new Map(Object.entries(tagCounts)) : null);
  const sliderCount = (id) => {
    const n = graphCounts && graphCounts.has(id) ? Number(graphCounts.get(id)) : NaN;
    return Number.isFinite(n) ? n : tags.get(id).size;
  };
  let most = Number(maxPieces);
  if (maxPieces === null || maxPieces === undefined || !Number.isFinite(most)) {
    most = 0;
    for (const n of (graphCounts ? graphCounts.values() : [...tags.values()].map((set) => set.size))) {
      if (Number(n) > most) most = Number(n);
    }
  }
  const min = clampMinPieces(minPieces, most);

  const rows = [];
  for (const [id, pieceIds] of tags) {
    const total = sliderCount(id);
    if (total < 1 || (min > 1 && total < min)) continue;
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
      pieces: total,
      color: blendColors(pieces.map((it) => ({ color: colorOf(it), weight: 1 })), fallbackColor),
      contributors,
    });
  }
  rows.sort((a, b) => (b.pieces - a.pieces)
    || a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    || a.label.localeCompare(b.label));
  return rows;
}

// The rows whose label has the text typed, case aside; all of them for
// nothing typed.
function filterTagRows(rows, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => r.label.toLowerCase().includes(q));
}

// What a row says when hovered: how many cards the tag is on (the number
// the row shows), its colour, then the feeds its showing pieces come from
// with how many each brings ("3 cards · #a1b2c3 · Example pieces 2, Posts 1").
function tagRowTitle(row) {
  const parts = [];
  const n = Number.isFinite(row.pieces) ? row.pieces : row.count;
  if (Number.isFinite(n)) parts.push(`${n} ${n === 1 ? 'card' : 'cards'}`);
  if (row.color) parts.push(row.color);
  const feeds = (row.contributors || []).filter((c) => c.title).map((c) => `${c.title} ${c.count}`);
  if (feeds.length) parts.push(feeds.join(', '));
  return parts.join(' · ');
}

module.exports = { SEARCH_FROM, hasTagNodes, tagListModel, filterTagRows, tagRowTitle };

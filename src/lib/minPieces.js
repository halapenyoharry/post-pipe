// Pieces per tag: the panel's slider for the fewest pieces a tag node must
// join to be drawn (the viewState preference 'minTagPieces', null for 1),
// shown as "Hide tagz on fewer than N cards" with "S of T tagz" beside it
// (src/components/Settings; cards and tagz are the viewer's words).
// A tag joining fewer is hidden with its edges, through the graph's own
// visibility path (applyVisibility in src/components/GraphViewer); the pieces
// themselves are never hidden by it. At 1, the default, nothing is hidden,
// a tag with no counted piece included, so the view is as it was.
//
// A tag's pieces are the distinct items with a tag edge to it, as the graph
// counts them (piecesByTag): at a depth above 0 a tag standing for a group
// counts the pieces of the whole group, each once. Every piece counts,
// whether or not its feed is showing, so the number on a tag does not move
// when a feed is turned off.
//
// Pure, so it can be tested without the DOM.

const PREF = 'minTagPieces';

// The value in force: a whole number from 1 to max (max below 1 is read as
// 1). Nothing chosen, or anything that is not a number, is 1.
function clampMinPieces(value, max) {
  const top = Number.isFinite(Number(max)) ? Math.max(1, Math.floor(Number(max))) : 1;
  if (value === null || value === undefined || value === '') return 1;
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(top, Math.round(n)));
}

const idOf = (p) => (p && typeof p === 'object' ? p.id : p);

// Each tag's number of distinct pieces, by tag id. pieces: a Map (or an
// iterable of [tagId, list]) from tag id to its pieces, as ids or as nodes
// with an id. tagIds: every tag drawn; a tag with no entry counts 0. Without
// tagIds, the tags in pieces.
function pieceCounts(pieces, tagIds) {
  const lists = pieces instanceof Map ? pieces : new Map(pieces || []);
  const counts = new Map();
  const ids = tagIds ? [...tagIds] : [...lists.keys()];
  for (const id of ids) {
    const list = lists.get(id) || [];
    const seen = new Set();
    for (const p of list) {
      const pid = idOf(p);
      if (pid !== undefined && pid !== null) seen.add(pid);
    }
    counts.set(id, seen.size);
  }
  return counts;
}

// The tags hidden at a value: those with fewer pieces than it. None at 1 or
// below.
function tagsBelow(counts, min) {
  const out = new Set();
  const m = Number(min);
  if (!Number.isFinite(m) || m <= 1) return out;
  for (const [id, n] of counts) if (n < m) out.add(id);
  return out;
}

// What the panel shows beside the slider: the value in force (clamped to
// the largest count), the largest count, and how many of all the tags are
// drawn at it. counts: a Map from tag id to count, or a plain list of counts.
function minPiecesSummary(counts, value) {
  const list = counts instanceof Map ? [...counts.values()] : [...(counts || [])];
  const max = list.reduce((m, n) => (n > m ? n : m), 0);
  const min = clampMinPieces(value, max);
  const shown = min <= 1 ? list.length : list.filter((n) => n >= min).length;
  return { min, max, shown, total: list.length };
}

// The counts read from a feed's edges of layer 'tag', for when the graph has
// not said: each tag's distinct pieces among the feed's items.
function pieceCountsFromFeed(feedData) {
  const items = feedData && Array.isArray(feedData.items) ? feedData.items : [];
  const edges = feedData && Array.isArray(feedData.edges) ? feedData.edges : [];
  const itemIds = new Set(items.map((it) => it && it.id));
  const isTag = (v) => typeof v === 'string' && v.startsWith('tag:');
  const pieces = new Map();
  for (const e of edges) {
    if (!e || e.layer !== 'tag') continue;
    const tagId = isTag(e.target) ? e.target : (isTag(e.source) ? e.source : null);
    const pieceId = tagId === e.target ? e.source : e.target;
    if (!tagId || !itemIds.has(pieceId)) continue;
    if (!pieces.has(tagId)) pieces.set(tagId, []);
    pieces.get(tagId).push(pieceId);
  }
  return pieceCounts(pieces);
}

module.exports = { PREF, clampMinPieces, pieceCounts, tagsBelow, minPiecesSummary, pieceCountsFromFeed };

// The source coherence ratio. rosetta-tagz measures each tag it discovers
// against how alike items from the same sources are anyway and records the
// multiple as sourceRatio (rosetta-tagz/docs/FORMATS.md, "Trying another
// bar"). Its build admits a hub at or above its bar
// (discover.sourceCoherenceRatio, 1.6) and, in a second layer that never
// changes what the bar admits, down to a floor (discover.sourceRatioFloor,
// 1.0). The panel's slider "Source coherence ratio" (the viewState
// preference 'minSourceRatio', null for the build's bar) applies
// rosetta-tagz's viewer rule to the graph's tag edges: an attachment shows
// when it has no sourceRatio or one at or above the value. A tag node shows
// while any of its attachments does (a tag a human wrote never carries a
// ratio, so it always shows), and the graph counts only what shows. It is
// hidden through the graph's own visibility path (applyVisibility in
// src/components/GraphViewer): nothing moves and nothing restarts.
//
// Pure, so it can be tested without the DOM.

const PREF = 'minSourceRatio';
// rosetta-tagz's bar when no record says what the build's was.
const DEFAULT_BAR = 1.6;
// The slider never goes under this.
const LOWEST = 1.0;
// The slider's step.
const STEP = 0.1;

// A sourceRatio: a finite number, or null.
function ratioOf(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

// Tenths, without the float noise of x * 0.1.
const toGrid = (x) => Math.round(x * 10) / 10;
const downToGrid = (x) => Math.floor(x * 10 + 1e-9) / 10;

// The parameters rosetta-tagz generated a tag with, if the edge carries them.
const paramsOf = (attrs) => {
  const g = attrs && attrs.wasGeneratedBy;
  return g && g.parameters && typeof g.parameters === 'object' ? g.parameters : null;
};

// What a feed says about the ratio, for the slider: { has, lo, hi, bar }.
//   has  some tag edge carries a sourceRatio (the slider is offered only then)
//   bar  the build's own bar: sourceCoherenceRatio in a discovered tag's
//        parameters, DEFAULT_BAR when none says
//   lo   the lowest floor the feed records (sourceRatioFloor in those
//        parameters), else the lowest ratio present, in tenths rounded
//        down, never under 1.0, and never above the bar
//   hi   the largest ratio present in tenths rounded down, so the top still
//        shows the strongest; never under lo or the bar
function ratioRange(feedData) {
  const edges = feedData && Array.isArray(feedData.edges) ? feedData.edges : [];
  let lowest = Infinity;
  let highest = -Infinity;
  let floor = Infinity;
  let bar = null;
  for (const e of edges) {
    if (!e || e.layer !== 'tag' || !e.attrs) continue;
    const r = ratioOf(e.attrs.sourceRatio);
    if (r === null) continue;
    if (r < lowest) lowest = r;
    if (r > highest) highest = r;
    const p = paramsOf(e.attrs);
    if (p) {
      const f = ratioOf(p.sourceRatioFloor);
      if (f !== null && f < floor) floor = f;
      const b = ratioOf(p.sourceCoherenceRatio);
      if (bar === null && b !== null && b > 0) bar = b;
    }
  }
  if (highest === -Infinity) return { has: false, lo: LOWEST, hi: DEFAULT_BAR, bar: DEFAULT_BAR };
  const theBar = bar === null ? DEFAULT_BAR : bar;
  const lo = Math.min(Math.max(LOWEST, downToGrid(Number.isFinite(floor) ? floor : lowest)), theBar);
  const hi = Math.max(downToGrid(highest), lo, theBar);
  return { has: true, lo, hi, bar: theBar };
}

// The value in force: null when the feed carries no ratio (nothing is
// filtered); the build's bar when nothing is chosen (null) or the choice is
// not a number; otherwise the choice in tenths, kept within lo and hi.
function clampRatio(value, range) {
  if (!range || !range.has) return null;
  if (value === null || value === undefined || value === '') return range.bar;
  const n = Number(value);
  if (!Number.isFinite(n)) return range.bar;
  return Math.max(range.lo, Math.min(range.hi, toGrid(n)));
}

// Whether an attachment with this ratio shows at min (null: no filtering).
function ratioShows(ratio, min) {
  if (min === null || min === undefined) return true;
  const r = ratioOf(ratio);
  return r === null || r >= min - 1e-9;
}

const pairKey = (piece, bubble) => `${piece}\u0000${bubble}`;

// Which of the graph's tag attachments show at min. entries: one per tag
// edge, { piece, bubble, tag, ratio }: the card's id, the bubble the edge is
// drawn to, the tag it was written as (the bubble's own unless the depth
// folds it into another, _groupedInto) and its sourceRatio (null for none).
// Returns
//   pairs          the piece and bubble pairs with an attachment showing
//                  (pairKey(piece, bubble)): one is enough for the pair
//   hiddenTags     the tags with attachments and none showing
//   hiddenBubbles  the bubbles with attachments and none showing
function shownAt(entries, min) {
  const pairs = new Set();
  const tagsSeen = new Set();
  const tagsShown = new Set();
  const bubblesSeen = new Set();
  const bubblesShown = new Set();
  for (const e of entries || []) {
    if (!e) continue;
    tagsSeen.add(e.tag);
    bubblesSeen.add(e.bubble);
    if (!ratioShows(e.ratio, min)) continue;
    pairs.add(pairKey(e.piece, e.bubble));
    tagsShown.add(e.tag);
    bubblesShown.add(e.bubble);
  }
  const hiddenTags = new Set([...tagsSeen].filter((t) => !tagsShown.has(t)));
  const hiddenBubbles = new Set([...bubblesSeen].filter((b) => !bubblesShown.has(b)));
  return { pairs, hiddenTags, hiddenBubbles };
}

// What the slider shows as its value: tenths, always with the decimal.
const ratioText = (v) => (v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Number(v).toFixed(1) : '');

module.exports = {
  PREF, DEFAULT_BAR, LOWEST, STEP,
  ratioOf, ratioRange, clampRatio, ratioShows, shownAt, pairKey, ratioText,
};

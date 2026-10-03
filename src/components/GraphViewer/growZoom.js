// graph.zoomMode 'grow-in-place': a zoom makes each anchored container
// larger or smaller about its own centre, which stays where it is drawn at
// the zoom the graph rests at (homeK), on its anchor on the cover's art;
// the containers are not moved apart. Pure math, so it can be tested.
//
// The view still zooms as a whole about one screen point (the pivot), so
// what is not anchored zooms as before, and a pan still moves everything.
// Each anchored container is then drawn with an offset in the world:
//   growShift(G, P, r) = (1/r - 1) (G - P)
// G its centre (where it was placed), P the world point under the pivot at
// the home view, r = k / homeK. Its centre is then drawn at P + (G - P) / r,
// which the view at k puts on the screen exactly where the home view puts
// G; every other point of it lies r times farther from that centre on the
// screen than at the home view. A zoom keeps the pivot's world point where
// it is on the screen (so a pan made before it is kept, not scaled).
//
// When grown containers would come within `gap` px of each other, the zoom
// in stops there (growCap): the largest r at which their boxes, each grown
// about its own centre, keep that gap.

const { zoomAbout, fitRatioAbout } = require('./zoomPivot');

// graph.zoomMode: 'grow-in-place', or 'geometric' (the default: the whole
// graph zooms as one picture about the pivot, as before).
function zoomModeOf(graphSettings) {
  return graphSettings && graphSettings.zoomMode === 'grow-in-place' ? 'grow-in-place' : 'geometric';
}

// graph.growCap (default true): whether a grow-in-place zoom stops where two
// containers would come within 16 px. false: the reader zooms as far as they
// like (to the zoom's own limits) and the containers may grow into each other.
function growCapOn(graphSettings) {
  return !(graphSettings && graphSettings.growCap === false);
}

// The world offset a container centred on G is drawn with at ratio r (see
// above). { x: 0, y: 0 } at r = 1.
function growShift(G, P, r) {
  if (!G || !P || !(r > 0)) return { x: 0, y: 0 };
  const f = 1 / r - 1;
  if (f === 0) return { x: 0, y: 0 };
  return { x: f * (G.x - P.x), y: f * (G.y - P.y) };
}

// A gesture asked for `next` from `prev`. A pan stays as it is. A zoom
// becomes the same zoom about the screen point (px, py), and a zoom in
// stops at kMax (one already past it is not taken further in; a zoom out
// still works). Returns the view to take.
function growConstrain(prev, next, px, py, kMax = Infinity) {
  if (!prev || !next || !(prev.k > 0) || !(next.k > 0)) return next;
  if (Math.abs(next.k - prev.k) <= 1e-9 * prev.k) return next;
  let k = next.k;
  if (k > prev.k && k > kMax) k = Math.max(prev.k, kMax);
  if (Math.abs(k - prev.k) <= 1e-9 * prev.k) return { x: prev.x, y: prev.y, k: prev.k };
  return zoomAbout(prev, k / prev.k, px, py);
}

// The largest ratio r (against the home view) at which no two of `acts`,
// each grown about its own centre, come within `gap` screen px: acts are
// [{ id, centre: { x, y }, box: { x0, y0, x1, y1 } }] in the world at the
// home view (homeK screen px per world unit). Two boxes are clear when they
// are apart along x or along y. Infinity with fewer than two; at least
// `floor` (default 1: a zoom never has to go below the home view).
function growCap(acts, { gap = 16, homeK = 1, floor = 1 } = {}) {
  const g = gap / (homeK > 0 ? homeK : 1);
  let cap = Infinity;
  const list = (acts || []).filter((a) => a && a.centre && a.box);
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      const along = (lo, hi, aLo, aHi, bLo, bHi) => {
        // a before b along this axis: a's far side (aHi) and b's near side (bLo).
        const reach = (aHi - lo) + (hi - bLo);
        const room = hi - lo - g;
        return reach > 1e-9 ? room / reach : -Infinity;
      };
      const ax = a.centre.x, bx = b.centre.x, ay = a.centre.y, by = b.centre.y;
      const rx = ax <= bx
        ? along(ax, bx, a.box.x0, a.box.x1, b.box.x0, b.box.x1)
        : along(bx, ax, b.box.x0, b.box.x1, a.box.x0, a.box.x1);
      const ry = ay <= by
        ? along(ay, by, a.box.y0, a.box.y1, b.box.y0, b.box.y1)
        : along(by, ay, b.box.y0, b.box.y1, a.box.y0, a.box.y1);
      cap = Math.min(cap, Math.max(rx, ry));
    }
  }
  return Math.max(floor, cap);
}

// Zoom to fit, each container grown about its own centre on the screen:
// items [{ box: { x0, y0, x1, y1 }, at: { x, y } }] in screen px. The
// largest ratio at which every box fits inside the area; null when none can
// (no box, or every centre outside the area). A centre outside the area is
// left out.
function growFitRatio(items, area) {
  let r = Infinity;
  for (const it of items || []) {
    if (!it || !it.box || !it.at) continue;
    const q = fitRatioAbout(it.box, it.at.x, it.at.y, area);
    if (q !== null) r = Math.min(r, q);
  }
  return Number.isFinite(r) ? r : null;
}

module.exports = { zoomModeOf, growCapOn, growShift, growConstrain, growCap, growFitRatio };

// Zooming about a fixed point on the screen. By default the keys and Zoom to
// fit zoom about the middle of the viewport, as the wheel and a pinch zoom
// about the pointer and the fingers. With graph.zoomPivot 'art' every zoom,
// the wheel's and a pinch's too, is about one point on the cover's art
// (opening.zoomPivot): repivot turns whatever zoom a gesture asked for into
// the same zoom about that point. Either way the view is never moved to
// re-centre on the graph's own middle, which would pull whatever hangs from
// the cover's art away from it. Pure math, so it can be tested.

// The view after zooming by `ratio` about the screen point (px, py): that
// point shows the same place in the world before and after.
function zoomAbout(view, ratio, px, py) {
  const k = view.k * ratio;
  return { x: px - (px - view.x) * ratio, y: py - (py - view.y) * ratio, k };
}

// The largest ratio, zooming about (px, py), at which the screen box
// { x0, y0, x1, y1 } fits inside the area { x0, y0, x1, y1 }. Each side of
// the box moves away from the pivot in proportion, so each side the pivot is
// inside gives a limit. null when the box is empty or the pivot is outside
// the area.
function fitRatioAbout(box, px, py, area) {
  if (!box || !(box.x1 > box.x0) || !(box.y1 > box.y0)) return null;
  if (px < area.x0 || px > area.x1 || py < area.y0 || py > area.y1) return null;
  let r = Infinity;
  const limit = (room, reach) => { if (reach > 1e-9) r = Math.min(r, room / reach); };
  limit(px - area.x0, px - box.x0);
  limit(area.x1 - px, box.x1 - px);
  limit(py - area.y0, py - box.y0);
  limit(area.y1 - py, box.y1 - py);
  return Number.isFinite(r) ? r : null;
}

// A gesture moved the view from prev to next. When it zoomed, the same zoom
// about the screen point (px, py) instead: only next's scale is kept, and the
// world point under (px, py) stays there. When it only panned (the scale
// unchanged), next as it is.
function repivot(prev, next, px, py) {
  if (!prev || !next || !(prev.k > 0) || !(next.k > 0)) return next;
  if (Math.abs(next.k - prev.k) <= 1e-9 * prev.k) return next;
  return zoomAbout(prev, next.k / prev.k, px, py);
}

// graph.zoomPivot: 'art' (every zoom about opening.zoomPivot on the cover's
// art) or 'pointer' (the default).
function zoomPivotMode(graphSettings) {
  return graphSettings && graphSettings.zoomPivot === 'art' ? 'art' : 'pointer';
}

module.exports = { zoomAbout, fitRatioAbout, repivot, zoomPivotMode };

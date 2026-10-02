// Zooming about a fixed point on the screen. The keys and Zoom to fit zoom
// about the middle of the viewport, as the wheel and a pinch zoom about the
// pointer and the fingers: the view is never moved to re-centre on the
// graph's own middle, which would pull whatever hangs from the cover's art
// away from it. Pure math, so it can be tested.

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

module.exports = { zoomAbout, fitRatioAbout };

// The roots reach for the containers (settings.opening.reach). The cover's
// art sits fixed behind the page and the graph pans and zooms over it; from
// root tips named on the art, drawn rootlets grow toward each container the
// art's roots should hold, closed or open, and stop a little short of its
// hull. The tips are fixed on the art; the ends are projected from the
// graph's world, so when a container is dragged, or the graph pans or
// zooms, the ends move. They follow with a lag (an ease over lagMs), and
// each rootlet keeps its seeded shape, stored relative to its two ends, so
// it looks like reaching rather than snapping.
//
// Also here: the backdrop's strength as the reader zooms in
// (opening.backdrop), and an anchor's place, a point on the art named as
// fractions of its width and height, in screen and world terms.
//
// Pure, so it can be tested. Screen points are { x, y } in px.

const { rootShape, rng, hashString } = require('../components/GraphViewer/roots');

const REACH_DEFAULTS = {
  enabled: false,
  tips: [],
  perContainer: 3,
  stopShort: 18,
  lagMs: 600,
  drawMs: 1800,
};

const BACKDROP_DEFAULTS = {
  opacity: 1,
  opacityZoomedIn: 0.3,
  zoomForFloor: 2.5,
  keepAbove: 0,
};

const num = (v, d) => (v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v)) ? Number(v) : d);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

// A point on the art as fractions of its width and height: { x, y }, or
// null when either is missing.
function fraction(p) {
  if (!p || typeof p !== 'object') return null;
  const x = num(p.x, NaN), y = num(p.y, NaN);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

// opening.reach with its defaults, or null when it is off or names no tips.
function reachConfig(opening) {
  const r = opening && opening.reach;
  if (!r || r.enabled !== true) return null;
  const tips = (Array.isArray(r.tips) ? r.tips : []).map(fraction).filter(Boolean);
  if (!tips.length) return null;
  return {
    enabled: true,
    tips,
    perContainer: Math.max(1, Math.round(num(r.perContainer, REACH_DEFAULTS.perContainer))),
    stopShort: Math.max(0, num(r.stopShort, REACH_DEFAULTS.stopShort)),
    lagMs: Math.max(0, num(r.lagMs, REACH_DEFAULTS.lagMs)),
    drawMs: Math.max(0, num(r.drawMs, REACH_DEFAULTS.drawMs)),
  };
}

// opening.backdrop with its defaults. The resting opacity falls back to the
// earlier opening.graph.artOpacity.
function backdropConfig(opening) {
  const b = (opening && opening.backdrop && typeof opening.backdrop === 'object') ? opening.backdrop : {};
  const legacy = opening && opening.graph && opening.graph.artOpacity;
  return {
    opacity: clamp01(num(b.opacity, num(legacy, BACKDROP_DEFAULTS.opacity))),
    opacityZoomedIn: clamp01(num(b.opacityZoomedIn, BACKDROP_DEFAULTS.opacityZoomedIn)),
    zoomForFloor: Math.max(1.01, num(b.zoomForFloor, BACKDROP_DEFAULTS.zoomForFloor)),
    keepAbove: clamp01(num(b.keepAbove, BACKDROP_DEFAULTS.keepAbove)),
  };
}

// The backdrop's roots at zoom k, against the zoom the graph state rests at
// (homeK): the resting opacity there and below, easing down to the floor at
// zoomForFloor times homeK, and held there further in.
function backdropOpacity(cfg, k, homeK) {
  const c = cfg || BACKDROP_DEFAULTS;
  if (!(k > 0) || !(homeK > 0)) return c.opacity;
  const r = k / homeK;
  if (r <= 1) return c.opacity;
  const t = smooth((r - 1) / (c.zoomForFloor - 1));
  return c.opacity + (c.opacityZoomedIn - c.opacity) * t;
}

// A fraction of the art to a screen point, for the art drawn in box
// { left, top, width, height }.
function artPoint(frac, box) {
  return { x: box.left + frac.x * box.width, y: box.top + frac.y * box.height };
}

// An anchor (a fraction of the art) to the graph's world, under the view
// { x, y, k } (translate, then scale; upright). origin is where the graph's
// own frame sits on the screen.
function anchorWorld(anchor, box, view, origin = { x: 0, y: 0 }) {
  const s = artPoint(anchor, box);
  return { x: (s.x - origin.x - view.x) / view.k, y: (s.y - origin.y - view.y) / view.k };
}

// The view that rests at scale k: the graph's world drawn at k from the
// frame's corner. Anchors are placed through it.
function homeView(k) {
  return { x: 0, y: 0, k };
}

// The n tips nearest a target, as indices, nearest first (ties to the
// earlier tip).
function nearestTips(tips, target, n) {
  return tips
    .map((t, i) => ({ i, d: Math.hypot(t.x - target.x, t.y - target.y) }))
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .slice(0, Math.max(0, n))
    .map((t) => t.i);
}

function insidePolygon(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

// Where the segment from -> to first crosses the polygon's edge: { x, y, t }
// with t the share of the way from `from`, or null.
function rayHit(from, to, poly) {
  const dx = to.x - from.x, dy = to.y - from.y;
  let best = null;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j], b = poly[i];
    const ex = b.x - a.x, ey = b.y - a.y;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((a.x - from.x) * ey - (a.y - from.y) * ex) / den;
    const u = ((a.x - from.x) * dy - (a.y - from.y) * dx) / den;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { x: from.x + dx * t, y: from.y + dy * t, t };
  }
  return best;
}

// A rootlet's end: aimed from the tip at the container's centre, it stops
// stopShort px before the hull's edge. null when the tip is inside the hull
// or too close to it to grow at all.
function reachEnd(tip, centre, hull, stopShort) {
  if (!hull || hull.length < 3) return null;
  if (insidePolygon(tip, hull)) return null;
  const hit = rayHit(tip, centre, hull);
  if (!hit) return null;
  const len = Math.hypot(hit.x - tip.x, hit.y - tip.y);
  if (len <= stopShort + 2) return null;
  const k = (len - stopShort) / len;
  return { end: { x: tip.x + (hit.x - tip.x) * k, y: tip.y + (hit.y - tip.y) * k }, hit, length: len - stopShort };
}

// The rootlets for one container: its nearest tips that can reach it (a tip
// under its outline, or too close to grow, is passed over for the next),
// up to n. Each { tip: index, end, hit, length }.
function reachFor(tips, container, n, stopShort) {
  const out = [];
  for (const i of nearestTips(tips, container.centre, tips.length)) {
    if (out.length >= n) break;
    const r = reachEnd(tips[i], container.centre, container.hull, stopShort);
    if (r) out.push({ tip: i, ...r });
  }
  return out;
}

const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);

// The lag: a point that follows its target, each new target eased to from
// wherever the point is over lagMs. lagMs 0 follows at once.
//   to(target, now)   a new target (ignored when it has not moved)
//   at(now)           where the point is
//   settled(now)      whether it has arrived
function createLag(lagMs, { ease = easeOutCubic, epsilon = 0.25 } = {}) {
  let from = null, target = null, t0 = 0;
  const at = (now) => {
    if (!target) return null;
    if (!from || lagMs <= 0) return { x: target.x, y: target.y };
    const k = ease((now - t0) / lagMs);
    return { x: from.x + (target.x - from.x) * k, y: from.y + (target.y - from.y) * k };
  };
  return {
    to(next, now) {
      if (!next) return;
      if (!target) { target = { x: next.x, y: next.y }; from = null; return; }
      if (Math.hypot(next.x - target.x, next.y - target.y) < epsilon) return;
      from = at(now);
      target = { x: next.x, y: next.y };
      t0 = now;
    },
    at,
    settled(now) { return !target || !from || lagMs <= 0 || now - t0 >= lagMs; },
    jump(next) { target = next ? { x: next.x, y: next.y } : null; from = null; },
  };
}

const fmt = (n) => (Math.round(n * 10) / 10).toString();
function pathFrom(pts) {
  if (!pts.length) return '';
  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) d += `L${fmt(pts[i][0])} ${fmt(pts[i][1])}`;
  return d;
}

// A rootlet's shape, seeded: the main line's wander (the roots' own), and
// forks that leave it at a shallow angle and taper off before its end.
function reachShape(seedKey) {
  const base = rootShape(seedKey);
  const r = rng(hashString(String(seedKey) + '|forks'));
  const between = (a, b) => a + (b - a) * r();
  const forks = [];
  const n = 2 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const fork = {
      t: between(0.18, 0.7),
      angle: (r() < 0.5 ? -1 : 1) * between(0.28, 0.62),
      length: between(0.16, 0.34),
      bend: between(-0.35, 0.35),
      twig: r() < 0.5 ? { t: between(0.4, 0.75), angle: (r() < 0.5 ? -1 : 1) * between(0.35, 0.7), length: between(0.3, 0.55) } : null,
    };
    forks.push(fork);
  }
  return { waves: base.waves, grain: base.grain, forks };
}

function wander(p0, p1, shape, steps) {
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const env = Math.sin(Math.PI * t);
    let off = 0;
    for (const w of shape.waves) off += w.amp * Math.sin(w.freq * Math.PI * 2 * t + w.phase);
    off = off * env * len * 0.8 + shape.grain[i % shape.grain.length] * Math.min(1.6, len * 0.005) * env;
    pts.push([p0.x + dx * t + nx * off, p0.y + dy * t + ny * off]);
  }
  return pts;
}

function bent(origin, heading, angle, length, bend, steps) {
  const pts = [[origin[0], origin[1]]];
  let a = heading + angle, x = origin[0], y = origin[1];
  const step = length / steps;
  for (let i = 1; i <= steps; i++) {
    a += bend / steps;
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    pts.push([x, y]);
  }
  return pts;
}

// The rootlet from p0 (the tip on the art) to p1 (its end) as SVG path
// data: { main, fine }. The main line starts and ends exactly on its two
// points. No fork reaches further along the way than the main line's end,
// so the whole rootlet stops short of the hull.
function reachPath(p0, p1, shape) {
  if (!p0 || !p1 || !Number.isFinite(p0.x) || !Number.isFinite(p1.x)) return { main: '', fine: '' };
  const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  if (len < 4) return { main: '', fine: '' };
  const steps = Math.max(8, Math.min(40, Math.round(len / 12)));
  const pts = wander(p0, p1, shape, steps);
  const heading = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  let fine = '';
  for (const f of shape.forks) {
    const at = pts[Math.round(f.t * steps)];
    // Along the way, a fork may reach no further than 85% of what is left.
    const room = (1 - f.t) * len * 0.85;
    const reach = Math.cos(Math.abs(f.angle)) || 1;
    const fl = Math.max(0, Math.min(f.length * len, room / reach, 160));
    if (fl < 6) continue;
    const pts2 = bent(at, heading, f.angle, fl, f.bend * 0.5, 5);
    fine += pathFrom(pts2);
    if (f.twig) {
      const tat = pts2[Math.round(f.twig.t * (pts2.length - 1))];
      const tl = fl * f.twig.length * (1 - f.twig.t);
      if (tl >= 4) fine += pathFrom(bent(tat, heading + f.angle, f.twig.angle * 0.6, tl, 0, 3));
    }
  }
  return { main: pathFrom(pts), fine };
}

module.exports = {
  REACH_DEFAULTS, BACKDROP_DEFAULTS,
  reachConfig, backdropConfig, backdropOpacity, fraction,
  artPoint, anchorWorld, homeView,
  nearestTips, reachFor, insidePolygon, rayHit, reachEnd, createLag,
  reachShape, reachPath,
};

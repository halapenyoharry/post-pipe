// Hand-drawn lines for the sketchbook theme: a pencil's wobble and a second,
// lighter pass, generated from a seed so a line looks the same on every
// frame and every visit. Pure geometry.

const { hashString, rng } = require('../components/GraphViewer/roots');

const fmt = (n) => (Math.round(n * 10) / 10).toString();

// Points along a rounded rectangle's outline, about every `step` px.
function roundedRectPoints(w, h, r, step = 12) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const pts = [];
  const line = (x0, y0, x1, y1) => {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let i = 0; i < n; i++) pts.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]);
  };
  const arc = (cx, cy, a0) => {
    const n = Math.max(2, Math.round((Math.PI / 2) * r / step));
    for (let i = 0; i < n; i++) {
      const a = a0 + (Math.PI / 2) * i / n;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  line(r, 0, w - r, 0); arc(w - r, r, -Math.PI / 2);
  line(w, r, w, h - r); arc(w - r, h - r, 0);
  line(w - r, h, r, h); arc(r, h - r, Math.PI / 2);
  line(0, h - r, 0, r); arc(r, r, Math.PI);
  return pts;
}

// A card's border drawn twice in pencil: a firm pass that overshoots where it
// closes, and a lighter one a little off it. Inset by `inset` px so the
// wobble stays inside the card. Returns { main, ghost } path data.
function roughRect(w, h, radius, seed, { inset = 1.5, wobble = 0.9 } = {}) {
  const r = rng(hashString(String(seed)));
  const base = roundedRectPoints(w - inset * 2, h - inset * 2, radius).map(([x, y]) => [x + inset, y + inset]);
  const pass = (amp, start, overshoot) => {
    const n = base.length;
    const out = [];
    for (let i = 0; i <= n + overshoot; i++) {
      const [x, y] = base[(start + i) % n];
      out.push([x + (r() - 0.5) * 2 * amp, y + (r() - 0.5) * 2 * amp]);
    }
    return out;
  };
  const toD = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${fmt(p[0])} ${fmt(p[1])}`).join('');
  return {
    main: toD(pass(wobble, 0, 2)),
    ghost: toD(pass(wobble * 1.8, Math.floor(r() * base.length), 1)),
  };
}

// A second pencil pass along an edge path ("M x y L x y" or "M x y Q cx cy x y"):
// the ends nudged a pixel or two and the curve's middle a few, the same way
// every time for the same seed.
function ghostOf(d, seed) {
  if (!d) return '';
  const nums = String(d).match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gi);
  if (!nums || nums.length < 4) return '';
  const v = nums.map(Number);
  const r = rng(hashString(String(seed)));
  const j = (a) => (r() - 0.5) * 2 * a;
  const [x1, y1] = [v[0], v[1]];
  const [x2, y2] = [v[v.length - 2], v[v.length - 1]];
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const bow = j(Math.min(6, len * 0.03));
  const cx = (v.length >= 6 ? v[2] : (x1 + x2) / 2) + nx * bow;
  const cy = (v.length >= 6 ? v[3] : (y1 + y2) / 2) + ny * bow;
  return `M${fmt(x1 + j(1.5))} ${fmt(y1 + j(1.5))}Q${fmt(cx)} ${fmt(cy)} ${fmt(x2 + j(1.5))} ${fmt(y2 + j(1.5))}`;
}

// A hull's outline points, each nudged by a seeded amount (by its index), for
// the lighter pencil pass round a container.
function jitterPoints(points, seed, amp = 3) {
  const r = rng(hashString(String(seed)));
  const offs = [];
  return points.map((p, i) => {
    while (offs.length <= i) offs.push([(r() - 0.5) * 2 * amp, (r() - 0.5) * 2 * amp]);
    return [p[0] + offs[i][0], p[1] + offs[i][1]];
  });
}

module.exports = { roughRect, ghostOf, jitterPoints, roundedRectPoints };

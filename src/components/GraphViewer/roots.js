// Roots: thin, branching lines in the manner of an agarita's roots, grown
// along the reading path behind the graph. Pure geometry, so it can be
// tested: a segment's shape comes from a seed (the book's, plus the
// segment's own key), never from Math.random, so the same book draws the
// same roots on every visit, and a root keeps its shape while the nodes it
// joins move — the shape is stored relative to its two ends.

// 32-bit string hash, then a small PRNG (mulberry32).
function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The shape of one root, in its own frame: t runs 0..1 from one end to the
// other, offsets are fractions of the root's length. A meandering main line
// (two slow waves and a little grain), and rootlets forking off it, some
// forking again.
function rootShape(seedKey) {
  const r = rng(hashString(String(seedKey)));
  const between = (a, b) => a + (b - a) * r();
  const waves = [
    { amp: between(0.03, 0.07), freq: between(0.6, 1.2), phase: between(0, Math.PI * 2) },
    { amp: between(0.01, 0.03), freq: between(2.0, 3.5), phase: between(0, Math.PI * 2) },
  ];
  const grain = Array.from({ length: 24 }, () => between(-1, 1));
  const branches = [];
  const nBranches = 2 + Math.floor(r() * 3);
  for (let i = 0; i < nBranches; i++) {
    const side = r() < 0.5 ? -1 : 1;
    const b = {
      t: between(0.12, 0.88),
      angle: side * between(0.45, 1.1), // radians off the main line
      length: between(0.12, 0.3),
      bend: between(-0.5, 0.5),
      width: between(0.45, 0.7),
      forks: [],
    };
    const nForks = r() < 0.6 ? 1 + Math.floor(r() * 2) : 0;
    for (let k = 0; k < nForks; k++) {
      b.forks.push({ t: between(0.35, 0.8), angle: (r() < 0.5 ? -1 : 1) * between(0.4, 0.9), length: between(0.35, 0.6) });
    }
    branches.push(b);
  }
  return { waves, grain, branches };
}

const fmt = (n) => (Math.round(n * 10) / 10).toString();

// The main line as points, from p0 to p1.
function mainPoints(p0, p1, shape, steps) {
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Ends stay on their nodes: the wander fades in and out.
    const env = Math.sin(Math.PI * t);
    let off = 0;
    for (const w of shape.waves) off += w.amp * Math.sin(w.freq * Math.PI * 2 * t + w.phase);
    off = off * env * len + shape.grain[i % shape.grain.length] * Math.min(2.2, len * 0.006) * env;
    pts.push([p0.x + dx * t + nx * off, p0.y + dy * t + ny * off]);
  }
  return pts;
}

function pathFrom(pts) {
  if (!pts.length) return '';
  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) d += `L${fmt(pts[i][0])} ${fmt(pts[i][1])}`;
  return d;
}

// A rootlet: a short curving line from a point, at an angle to a heading.
function rootletPoints(origin, heading, angle, length, bend, steps = 6) {
  const pts = [];
  let a = heading + angle;
  let x = origin[0], y = origin[1];
  pts.push([x, y]);
  const step = length / steps;
  for (let i = 1; i <= steps; i++) {
    a += (bend / steps);
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    pts.push([x, y]);
  }
  return pts;
}

// The whole root between p0 and p1 as SVG path data: { main, fine } — the
// main line, and the rootlets drawn thinner.
function rootPath(p0, p1, shape) {
  if (!p0 || !p1 || !Number.isFinite(p0.x) || !Number.isFinite(p1.x)) return { main: '', fine: '' };
  const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  if (len < 4) return { main: '', fine: '' };
  const steps = Math.max(8, Math.min(48, Math.round(len / 16)));
  const pts = mainPoints(p0, p1, shape, steps);
  const heading = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  let fine = '';
  for (const b of shape.branches) {
    const at = pts[Math.round(b.t * steps)];
    // Long enough to show past the cards at the ends, never sprawling.
    const bl = Math.min(Math.max(b.length * len, 44), 220);
    const twig = rootletPoints(at, heading, b.angle, bl, b.bend);
    fine += pathFrom(twig);
    for (const f of b.forks) {
      const fat = twig[Math.round(f.t * (twig.length - 1))];
      const fh = heading + b.angle + b.bend * f.t;
      fine += pathFrom(rootletPoints(fat, fh, f.angle, bl * f.length, b.bend * 0.5, 4));
    }
  }
  return { main: pathFrom(pts), fine };
}

// The reading path as root segments, from the graph's own structure:
//   containers: [{ id, parent }]
//   memberOf: id -> the innermost container of a piece
//   sequence: [{ source, target }] along the reading order
// A segment joins a container to each child container, a container to the
// first piece of each run in it, and each piece to the next one. Keys are
// stable, so each segment keeps its shape.
function rootSegments({ containers = [], memberOf = new Map(), sequence = [] }) {
  const segs = [];
  for (const c of containers) {
    if (c.parent) segs.push({ key: `c:${c.parent}>${c.id}`, from: { container: c.parent }, to: { container: c.id }, reach: { container: c.id } });
  }
  const incoming = new Set(sequence.map((e) => e.target));
  const starts = new Set();
  for (const e of sequence) if (!incoming.has(e.source)) starts.add(e.source);
  for (const s of starts) {
    const c = memberOf.get(s);
    if (c) segs.push({ key: `s:${c}>${s}`, from: { container: c }, to: { node: s }, reach: { node: s } });
  }
  for (const e of sequence) {
    segs.push({ key: `e:${e.source}>${e.target}`, from: { node: e.source }, to: { node: e.target }, reach: { node: e.target } });
  }
  return segs;
}

module.exports = { hashString, rng, rootShape, rootPath, rootSegments };

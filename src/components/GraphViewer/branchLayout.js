// The branch layout (graph.containerLayout 'branches'): a container's items
// on the ends of the branches of a traced picture. Pure geometry, no D3, no
// DOM, so it can be tested.
//
// The skeleton is an SVG in the form of opening.art.rootsVector (read by
// src/lib/rootsVector.js: edges from node to node, node 0 the crown, tips
// named), in the art's own px. Each container owns some of its tips
// (containers.<id>.branches). Its items go on them easiest first: the tips
// in order of their distance along the skeleton from the crown, nearest
// first (ties: the smaller angle from the tap root, the crown's longest
// branch), item 1 in reading order on the first, item 2 on the next, and so
// on. When an act has more items than tips, new branches are grown for the
// rest (growBranches): from points on its own branches into the empty space
// near them, as the skeleton's own branches are drawn (traceStyle), inside
// its own space (actSpaces), seeded by its id and its item count.
//
// Then, in the graph's world (the caller maps the art there):
//   placeLabels: each act's label on its main root, as large as fits in its
//     own space, under the crown, on the screen, clear of the tips;
//   placeCards: each card's near edge on its tip, set outward along the
//     branch's last direction; where cards would meet, a card shrinks (to
//     minScale) and then slides along its branch toward the crown until it
//     is clear.

const { rng, hashString } = require('./roots');

// ── Small geometry ────────────────────────────────────────────────────────

const TAU = Math.PI * 2;
const angleDiff = (a, b) => {
  let d = (a - b) % TAU;
  if (d <= -Math.PI) d += TAU;
  if (d > Math.PI) d -= TAU;
  return d;
};
const lerp = (a, b, t) => a + (b - a) * t;
const quantile = (arr, f) => {
  if (!arr.length) return NaN;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(f * s.length)))];
};

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const L2 = dx * dx + dy * dy;
  let t = L2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// Whether segments ab and cd cross (touching at an end does not count).
function segCross(ax, ay, bx, by, cx, cy, dx, dy) {
  const o = (px, py, qx, qy, rx, ry) => (qx - px) * (ry - py) - (qy - py) * (rx - px);
  const d1 = o(cx, cy, dx, dy, ax, ay), d2 = o(cx, cy, dx, dy, bx, by);
  const d3 = o(ax, ay, bx, by, cx, cy), d4 = o(ax, ay, bx, by, dx, dy);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

const rectsMeet = (a, b, gap = 0) => a.x0 < b.x1 + gap && b.x0 < a.x1 + gap && a.y0 < b.y1 + gap && b.y0 < a.y1 + gap;

// An edge's points, its parts joined, each with its part and index in it.
function flatOf(edge) {
  if (edge._flat) return edge._flat;
  const out = [];
  edge.parts.forEach((part, pi) => part.pts.forEach((pt, k) => {
    if (out.length && k === 0) {
      const last = out[out.length - 1];
      if (last.x === pt[0] && last.y === pt[1]) return;
    }
    out.push({ x: pt[0], y: pt[1], part: pi, k });
  }));
  let s = 0;
  out.forEach((q, i) => { if (i) s += Math.hypot(q.x - out[i - 1].x, q.y - out[i - 1].y); q.s = s; });
  Object.defineProperty(edge, '_flat', { value: out, enumerable: false, configurable: true });
  return out;
}

// A polyline's point at arc length s, with the direction there (toward its
// end).
function pointAlong(poly, s) {
  if (!poly.length) return null;
  if (poly.length === 1) return { x: poly[0].x, y: poly[0].y, dir: { x: 0, y: 1 }, i: 0 };
  let acc = 0;
  for (let i = 1; i < poly.length; i++) {
    const a = poly[i - 1], b = poly[i];
    const l = Math.hypot(b.x - a.x, b.y - a.y);
    if (acc + l >= s || i === poly.length - 1) {
      const t = l > 0 ? Math.max(0, Math.min(1, (s - acc) / l)) : 0;
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), dir: l > 0 ? { x: (b.x - a.x) / l, y: (b.y - a.y) / l } : { x: 0, y: 1 }, i };
    }
    acc += l;
  }
  return null;
}
const polyLength = (poly) => poly.reduce((t, q, i) => (i ? t + Math.hypot(q.x - poly[i - 1].x, q.y - poly[i - 1].y) : 0), 0);

// The direction over a polyline's last `span` of length (outward, toward its
// end).
function endDirection(poly, span) {
  const L = polyLength(poly);
  const a = pointAlong(poly, Math.max(0, L - span));
  const b = poly[poly.length - 1];
  const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy);
  if (l > 1e-9) return { x: dx / l, y: dy / l };
  return a.dir;
}

// ── The skeleton ──────────────────────────────────────────────────────────

// The crown: where the edges from node 0 start (or the file's own word).
function crownOf(model) {
  const e = model.edges.find((x) => x.a === 0 && x.parts.length && x.parts[0].pts.length);
  if (e) return { x: e.parts[0].pts[0][0], y: e.parts[0].pts[0][1] };
  if (model.crown) return { x: model.crown.x, y: model.crown.y };
  return { x: model.w / 2, y: 0 };
}

// For each node, the edge that reaches it from the crown (loops and free
// edges left out), and each node's distance along the skeleton.
function treeOf(model) {
  if (model._tree) return model._tree;
  const into = new Map();
  for (const e of model.edges) if (!e.loop && !e.free && !into.has(e.b)) into.set(e.b, e);
  const lengthTo = new Map([[0, 0]]);
  const at = (n, guard = 0) => {
    if (lengthTo.has(n)) return lengthTo.get(n);
    const e = into.get(n);
    if (!e || guard > 100000) return NaN;
    const v = at(e.a, guard + 1) + polyLength(flatOf(e));
    lengthTo.set(n, v);
    return v;
  };
  for (const n of into.keys()) at(n);
  const tree = { into, lengthTo };
  Object.defineProperty(model, '_tree', { value: tree, enumerable: false, configurable: true });
  return tree;
}

// What the ordering needs: the crown, each tip's distance along the skeleton
// and the tap root's direction (from the crown to the end of its longest
// branch).
function skeletonInfo(model) {
  const crown = crownOf(model);
  const { lengthTo } = treeOf(model);
  const tipL = new Map();
  for (const [name, t] of model.tips) {
    const L = lengthTo.get(t.node);
    if (Number.isFinite(L)) tipL.set(name, L);
  }
  let tap = null, best = -Infinity;
  for (const [name, L] of tipL) if (L > best) { best = L; tap = name; }
  const tp = tap ? model.tips.get(tap) : null;
  const tapAngle = tp ? Math.atan2(tp.y - crown.y, tp.x - crown.x) : Math.PI / 2;
  return { crown, tipL, tap, tapAngle };
}

// Tips in the order items take them: nearest the crown along the skeleton
// first; tips the same distance along, the smaller angle from the tap root
// first; then as given. Names the skeleton does not have are left out.
// extra: Map name -> { x, y, L } for tips not in the file (grown).
function orderTips(model, names, info = skeletonInfo(model), extra = null) {
  const crown = info.crown;
  const rows = [];
  (names || []).forEach((name, i) => {
    const t = (extra && extra.get(name)) || model.tips.get(name);
    const L = extra && extra.has(name) ? extra.get(name).L : info.tipL.get(name);
    if (!t || !Number.isFinite(L)) return;
    const ang = Math.abs(angleDiff(Math.atan2(t.y - crown.y, t.x - crown.x), info.tapAngle));
    rows.push({ name, L, ang, i });
  });
  rows.sort((a, b) => {
    const tie = 1e-6 * Math.max(1, Math.abs(a.L), Math.abs(b.L));
    if (Math.abs(a.L - b.L) > tie) return a.L - b.L;
    if (Math.abs(a.ang - b.ang) > 1e-9) return a.ang - b.ang;
    return a.i - b.i;
  });
  return rows.map((r) => r.name);
}

// The polyline from the crown to a node (its edges' points joined).
function pathToNode(model, node) {
  const { into } = treeOf(model);
  const chain = [];
  let n = node;
  for (let guard = 0; guard < 100000 && n !== 0; guard++) {
    const e = into.get(n);
    if (!e) return null;
    chain.push(e);
    n = e.a;
  }
  chain.reverse();
  const out = [];
  for (const e of chain) for (const q of flatOf(e)) {
    const last = out[out.length - 1];
    if (last && last.x === q.x && last.y === q.y) continue;
    out.push({ x: q.x, y: q.y });
  }
  if (!out.length) { const c = crownOf(model); out.push({ x: c.x, y: c.y }); }
  return out;
}

// The polyline from the crown to a tip, grown ones included.
function pathToTip(model, name) {
  const t = model.tips.get(name);
  if (!t) return null;
  if (t.grown) {
    const edge = model.edges.find((e) => e.tip === name && e.grown);
    if (!edge) return null;
    return [...pathToHost(model, edge.host), ...flatOf(edge).slice(1).map((q) => ({ x: q.x, y: q.y }))];
  }
  return pathToNode(model, t.node);
}
// The polyline from the crown to a point on an edge ({ e, i }: its index in
// the edge's joined points).
function pathToHost(model, host) {
  const edge = model.edges.find((e) => e.e === host.e);
  if (!edge) return [];
  const flat = flatOf(edge).slice(0, host.i + 1).map((q) => ({ x: q.x, y: q.y }));
  const before = edge.grown ? pathToHost(model, edge.host) : (pathToNode(model, edge.a) || []);
  const last = before[before.length - 1];
  return last && flat.length && last.x === flat[0].x && last.y === flat[0].y ? [...before, ...flat.slice(1)] : [...before, ...flat];
}

// Which act owns each edge: the edges on the way from the crown to its tips
// (an edge on the way to two acts' tips is nobody's).
function edgeOwners(model, acts) {
  const owner = new Map();
  const { into } = treeOf(model);
  for (const act of acts) {
    for (const name of act.tips || []) {
      const t = model.tips.get(name);
      if (!t || t.grown) continue;
      let n = t.node;
      for (let guard = 0; guard < 100000 && n !== 0; guard++) {
        const e = into.get(n);
        if (!e) break;
        const was = owner.get(e.e);
        if (was === undefined) owner.set(e.e, act.id);
        else if (was !== act.id) owner.set(e.e, null);
        n = e.a;
      }
    }
  }
  return owner;
}

// A grid of segments, for asking what is near a point quickly.
function segmentGrid(cell) {
  const cells = new Map();
  const list = [];
  const key = (i, j) => i * 100003 + j;
  return {
    list,
    add(s) {
      list.push(s);
      const i0 = Math.floor(Math.min(s.ax, s.bx) / cell), i1 = Math.floor(Math.max(s.ax, s.bx) / cell);
      const j0 = Math.floor(Math.min(s.ay, s.by) / cell), j1 = Math.floor(Math.max(s.ay, s.by) / cell);
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
        const k = key(i, j);
        if (!cells.has(k)) cells.set(k, []);
        cells.get(k).push(s);
      }
    },
    // Segments in the cells a box touches.
    near(x0, y0, x1, y1) {
      const out = new Set();
      for (let i = Math.floor(x0 / cell); i <= Math.floor(x1 / cell); i++) {
        for (let j = Math.floor(y0 / cell); j <= Math.floor(y1 / cell); j++) {
          const c = cells.get(key(i, j));
          if (c) for (const s of c) out.add(s);
        }
      }
      return out;
    },
    // The nearest segment to a point: { s, d }, or null when there is none.
    nearest(x, y) {
      if (!list.length) return null;
      const ci = Math.floor(x / cell), cj = Math.floor(y / cell);
      let best = null, bd = Infinity;
      for (let r = 0; r < 4096; r++) {
        for (let i = ci - r; i <= ci + r; i++) {
          for (let j = cj - r; j <= cj + r; j++) {
            if (Math.max(Math.abs(i - ci), Math.abs(j - cj)) !== r) continue;
            const c = cells.get(key(i, j));
            if (!c) continue;
            for (const s of c) {
              const d = segDist(x, y, s.ax, s.ay, s.bx, s.by);
              if (d < bd) { bd = d; best = s; }
            }
          }
        }
        // Everything farther out is at least r cells away.
        if (best && bd <= r * cell) break;
        if (r * cell > 4 * (cell * 64) && !best) break;
      }
      return best ? { s: best, d: bd } : null;
    },
  };
}

// Each act's space: the points nearer one of its own branches than any
// other act's (by the traced skeleton). actAt(x, y) in the art's px: the
// act's id, or null.
function actSpaces(model, acts, { cell = 32 } = {}) {
  const owner = edgeOwners(model, acts);
  const grid = segmentGrid(cell);
  for (const e of model.edges) {
    if (e.grown) continue;
    const id = owner.get(e.e);
    if (!id) continue;
    const f = flatOf(e);
    for (let i = 1; i < f.length; i++) grid.add({ ax: f[i - 1].x, ay: f[i - 1].y, bx: f[i].x, by: f[i].y, act: id, e: e.e });
  }
  const memo = new Map();
  const actAt = (x, y) => {
    const k = `${Math.round(x * 4)},${Math.round(y * 4)}`;
    if (memo.has(k)) return memo.get(k);
    const n = grid.nearest(x, y);
    const v = n ? n.s.act : null;
    if (memo.size > 200000) memo.clear();
    memo.set(k, v);
    return v;
  };
  return { actAt, owner, grid };
}

// ── How the skeleton's own branches are drawn ────────────────────────────

const hexGrey = (v) => { const c = Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); return `#${c}${c}${c}`; };
const greyOf = (stroke) => {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(stroke || '');
  if (!m) return null;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => parseInt(h, 16));
  return Math.abs(r - g) <= 2 && Math.abs(g - b) <= 2 ? (r + g + b) / 3 : null;
};

// Measured off the skeleton itself, so grown branches look like its own:
//   forkAngle   the angle between two branches where one forks off another
//               (radians, its 10th to 90th percentile)
//   length      a last branch's length (to a tip), 10th to 90th percentile
//   partLength  how long each drawn part is (its median)
//   widthRatio  a branch's starting width against its parent's (median)
//   startWidth  a last branch's starting width, 10th to 90th percentile
//   tipWidth    the width at a tip (median)
//   turn        how much a branch turns along its length (radians per px,
//               the median)
//   grey        { a, b, lo, hi }: the stroke's grey as a + b * width, kept
//               within lo..hi (null when the strokes are not greys)
//   spacing     the median distance from a tip to the nearest other tip
//   outward     how far a branch heads from straight out from the crown
//               (radians, the most any of its own does)
// A skeleton too small to measure falls back on the roots' own values.
const STYLE_FALLBACK = {
  forkAngle: [0.534, 0.848], length: [66, 143], partLength: 24.3, widthRatio: 0.7,
  startWidth: [3.6, 6.2], tipWidth: 2.0, turn: 0.004, grey: { a: 139, b: 5.63, lo: 127, hi: 228 }, spacing: 60,
  outward: 0.716,
};
function traceStyle(model) {
  const tree = model.edges.filter((e) => !e.loop && !e.free && !e.grown);
  const children = new Map();
  for (const e of tree) { if (!children.has(e.a)) children.set(e.a, []); children.get(e.a).push(e); }
  const dirOf = (e, fromStart, span = 25) => {
    const f = flatOf(e).map((q) => ({ x: q.x, y: q.y }));
    if (f.length < 2) return null;
    const poly = fromStart ? f : [...f].reverse();
    const a = poly[0], b = pointAlong(poly, span);
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    return fromStart ? ang : ang + Math.PI;
  };
  const between = [];
  for (const ch of children.values()) {
    if (ch.length < 2) continue;
    const ds = ch.map((e) => dirOf(e, true)).filter((x) => x !== null).sort((a, b) => a - b);
    for (let i = 1; i < ds.length; i++) between.push(Math.abs(angleDiff(ds[i], ds[i - 1])));
  }
  const tipEdges = tree.filter((e) => e.tip);
  const lengths = tipEdges.map((e) => polyLength(flatOf(e)));
  const parts = tree.flatMap((e) => e.parts.map((p) => p.pts.reduce((t, q, i) => (i ? t + Math.hypot(q[0] - p.pts[i - 1][0], q[1] - p.pts[i - 1][1]) : 0), 0)));
  const into = new Map(tree.map((e) => [e.b, e]));
  const ratios = [];
  for (const e of tree) {
    const p = into.get(e.a);
    if (p && p.parts.length) ratios.push(e.parts[0].width / p.parts[p.parts.length - 1].width);
  }
  const turns = [];
  for (const e of tree) {
    const f = flatOf(e);
    if (f.length < 3) continue;
    let total = 0;
    for (let i = 2; i < f.length; i++) {
      const a1 = Math.atan2(f[i - 1].y - f[i - 2].y, f[i - 1].x - f[i - 2].x);
      const a2 = Math.atan2(f[i].y - f[i - 1].y, f[i].x - f[i - 1].x);
      total += Math.abs(angleDiff(a2, a1));
    }
    const L = polyLength(f);
    if (L > 0) turns.push(total / L);
  }
  const pairs = [];
  for (const e of tree) for (const p of e.parts) { const g = greyOf(p.stroke); if (g !== null) pairs.push([p.width, g]); }
  let grey = null;
  if (pairs.length >= 8) {
    const mx = pairs.reduce((t, p) => t + p[0], 0) / pairs.length;
    const my = pairs.reduce((t, p) => t + p[1], 0) / pairs.length;
    const sxx = pairs.reduce((t, p) => t + (p[0] - mx) ** 2, 0);
    const b = sxx > 0 ? pairs.reduce((t, p) => t + (p[0] - mx) * (p[1] - my), 0) / sxx : 0;
    grey = { a: my - b * mx, b, lo: Math.min(...pairs.map((p) => p[1])), hi: Math.max(...pairs.map((p) => p[1])) };
  }
  const tips = [...model.tips.values()].filter((t) => !t.grown);
  const nn = tips.map((t) => Math.min(...tips.filter((q) => q !== t).map((q) => Math.hypot(q.x - t.x, q.y - t.y)))).filter(Number.isFinite);
  const crown = crownOf(model);
  const outs = [];
  for (const e of tree) {
    if (e.a === 0) continue;
    const f = flatOf(e);
    const a = f[0], z = f[f.length - 1];
    const rx = a.x - crown.x, ry = a.y - crown.y, gx = z.x - a.x, gy = z.y - a.y;
    const l = Math.hypot(rx, ry) * Math.hypot(gx, gy);
    if (l > 1e-9) outs.push(Math.acos(Math.max(-1, Math.min(1, (rx * gx + ry * gy) / l))));
  }
  const F = STYLE_FALLBACK;
  const enough = (arr, n = 6) => arr.length >= n;
  return {
    forkAngle: enough(between) ? [quantile(between, 0.1), quantile(between, 0.9)] : F.forkAngle,
    length: enough(lengths) ? [quantile(lengths, 0.1), quantile(lengths, 0.9)] : F.length,
    partLength: enough(parts) ? quantile(parts, 0.5) : F.partLength,
    widthRatio: enough(ratios) ? quantile(ratios, 0.5) : F.widthRatio,
    startWidth: enough(tipEdges) ? [quantile(tipEdges.map((e) => e.parts[0].width), 0.1), quantile(tipEdges.map((e) => e.parts[0].width), 0.9)] : F.startWidth,
    tipWidth: enough(tipEdges) ? quantile(tipEdges.map((e) => e.parts[e.parts.length - 1].width), 0.5) : F.tipWidth,
    turn: enough(turns) ? quantile(turns, 0.5) : F.turn,
    grey: grey || (pairs.length ? null : F.grey),
    spacing: enough(nn, 3) ? quantile(nn, 0.5) : F.spacing,
    outward: enough(outs) ? Math.max(...outs) : F.outward,
  };
}

// ── Growing branches ──────────────────────────────────────────────────────


// The skeleton with grown edges added: edges, tips (grown ones marked), and
// the order the bend walks (rootsVector.bentRoots: a grown edge moves with
// the point it grows from).
function withGrown(model, grown) {
  if (!grown || !grown.length) return model;
  const tips = new Map(model.tips);
  for (const e of grown) {
    const f = flatOf(e);
    const end = f[f.length - 1];
    tips.set(e.tip, { x: end.x, y: end.y, node: e.b, grown: true });
  }
  return { ...model, edges: [...model.edges, ...grown], tips, order: [...(model.order || []), ...grown] };
}

// New branches for every act with more items than tips. acts: [{ id, tips:
// [names], count }]. Returns { model (with them), grown: [edges], order: Map
// id -> [tip names in the order items take them], style, levels: Map id ->
// [the relaxation each grown branch needed (0 = none)] }. The same on every
// call for the same skeleton, acts and counts.
//
// Each new branch grows from a point on the act's own branches (traced or
// already grown; not in the fifth of its reach nearest the crown, nor the
// last stretch before a tip), off to one side at a fork angle of the
// skeleton's own, a length of its own last branches, curving gently back
// toward the branch it left, tapering from widthRatio of that branch's
// width to the tip's width. Of every such candidate, the one whose tip is
// farthest from every other tip (the emptiest space within reach) is taken,
// among those that keep the act's space, the picture, a clearance from the
// other branches and cross none; when none does, those rules are relaxed in
// turn (levels), crossing last.
function growBranches(model, acts, opts = {}) {
  const style = opts.style || traceStyle(model);
  const info = skeletonInfo(model);
  const spaces = opts.spaces || actSpaces(model, acts);
  const crownY = Number.isFinite(opts.crownY) ? opts.crownY : info.crown.y;
  const margin = Number.isFinite(opts.margin) ? opts.margin : 8;
  const D = Math.max(8, style.spacing * 0.8);
  const outward = Math.cos(style.outward);
  const clear = Math.max(3, style.tipWidth * 2.5);
  const LEVELS = [
    { dmin: D, clear, cross: false },
    { dmin: D * 0.66, clear, cross: false },
    { dmin: D * 0.4, clear: clear / 2, cross: false },
    { dmin: D * 0.2, clear: 0, cross: true },
    { dmin: 0, clear: 0, cross: true },
  ];
  const grid = segmentGrid(32);
  const addEdgeSegs = (e) => {
    const f = flatOf(e);
    for (let i = 1; i < f.length; i++) grid.add({ ax: f[i - 1].x, ay: f[i - 1].y, bx: f[i].x, by: f[i].y, e: e.e, i });
  };
  for (const e of model.edges) addEdgeSegs(e);
  const allTips = [...model.tips.values()].map((t) => ({ x: t.x, y: t.y }));
  let nextE = Math.max(0, ...model.edges.map((e) => e.e)) + 1;
  let nextNode = Math.max(0, ...model.edges.map((e) => Math.max(e.a, e.b))) + 1;
  const { lengthTo } = treeOf(model);
  const grown = [];
  const grownL = new Map(); // edge e -> L at its start
  const order = new Map();
  const levels = new Map();
  const extra = new Map();
  const owners = spaces.owner || edgeOwners(model, acts);

  for (const act of acts) {
    const own = orderTips(model, (act.tips || []).filter((n) => model.tips.has(n)), info);
    const count = Math.max(0, Math.round(act.count || 0));
    const need = Math.max(0, count - own.length);
    if (!need) { order.set(act.id, own.slice(0, count)); continue; }
    const rand = rng(hashString(`${act.id}|${count}`));
    // The act's edges: its own traced ones, then what grows.
    const mine = model.edges.filter((e) => !e.grown && owners.get(e.e) === act.id).sort((a, b) => a.e - b.e);
    const reach = Math.max(1, ...own.map((n) => info.tipL.get(n) || 0));
    const startL = (e) => (e.grown ? grownL.get(e.e) : lengthTo.get(e.a) || 0);
    const names = [];
    const used = [];
    for (let g = 0; g < need; g++) {
      const cands = [];
      for (const host of mine) {
        const f = flatOf(host);
        const Lhost = polyLength(f);
        const toTip = !!host.tip;
        for (let i = 1; i < f.length - 1; i++) {
          const q = f[i];
          const L = startL(host) + q.s;
          if (L < reach * 0.2) continue;
          if (toTip && Lhost - q.s < style.partLength * 0.75) continue;
          const a = f[i - 1], b = f[i + 1];
          const dir = Math.atan2(b.y - a.y, b.x - a.x);
          const hostW = host.parts[q.part] ? host.parts[q.part].width : style.tipWidth;
          for (const side of [-1, 1]) {
            for (let v = 0; v < 2; v++) {
              const angle = lerp(style.forkAngle[0], style.forkAngle[1], rand());
              const len = lerp(style.length[0], style.length[1], rand());
              const back = lerp(0.2, 0.6, rand());
              const phase = rand() * TAU;
              cands.push({ host, i, q, L, dir, hostW, side, angle, len, back, phase });
            }
          }
        }
      }
      // Each candidate's path and how it fares.
      let best = null;
      for (const c of cands) {
        const steps = Math.max(3, Math.round(c.len / (style.partLength / 2)));
        const h0 = c.dir + c.side * c.angle;
        const h1 = c.dir + c.side * c.angle * (1 - c.back);
        const pts = [{ x: c.q.x, y: c.q.y }];
        for (let j = 1; j <= steps; j++) {
          const t = j / steps;
          const h = lerp(h0, h1, t) + Math.sin(c.phase + t * Math.PI) * style.turn * c.len * 0.15;
          const p = pts[j - 1];
          pts.push({ x: p.x + Math.cos(h) * (c.len / steps), y: p.y + Math.sin(h) * (c.len / steps) });
        }
        const tip = pts[pts.length - 1];
        // Away from the crown, as the skeleton's own branches grow: the new
        // branch heads no further from straight out than they do.
        const rx = c.q.x - info.crown.x, ry = c.q.y - info.crown.y, rl = Math.hypot(rx, ry);
        const gx = tip.x - c.q.x, gy = tip.y - c.q.y, gl = Math.hypot(gx, gy);
        if (rl > 1e-9 && gl > 1e-9 && (rx * gx + ry * gy) / (rl * gl) < outward) continue;
        // The picture, under the crown, and the act's own space.
        let inside = true;
        for (const p of pts.slice(1)) {
          if (p.x < margin || p.x > model.w - margin || p.y < crownY + margin || p.y > model.h - margin) { inside = false; break; }
          if (spaces.actAt(p.x, p.y) !== act.id) { inside = false; break; }
        }
        if (!inside) continue;
        // Clearance from the other branches (past its first stretch) and
        // whether it crosses any.
        let minClear = Infinity, crosses = false;
        const near = grid.near(Math.min(...pts.map((p) => p.x)) - 24, Math.min(...pts.map((p) => p.y)) - 24, Math.max(...pts.map((p) => p.x)) + 24, Math.max(...pts.map((p) => p.y)) + 24);
        const leave = Math.min(c.len * 0.3, style.partLength);
        let s = 0;
        for (let j = 1; j < pts.length; j++) {
          const a = pts[j - 1], b = pts[j];
          s += Math.hypot(b.x - a.x, b.y - a.y);
          for (const seg of near) {
            const atHost = seg.e === c.host.e && Math.abs(seg.i - c.i) <= 2;
            if (atHost) continue;
            if (segCross(a.x, a.y, b.x, b.y, seg.ax, seg.ay, seg.bx, seg.by)) crosses = true;
            if (s > leave) minClear = Math.min(minClear, segDist(b.x, b.y, seg.ax, seg.ay, seg.bx, seg.by));
          }
        }
        let minTip = Infinity;
        for (const t of allTips) minTip = Math.min(minTip, Math.hypot(t.x - tip.x, t.y - tip.y));
        const level = LEVELS.findIndex((l) => minTip >= l.dmin && (l.clear <= 0 || minClear >= l.clear) && (l.cross || !crosses));
        if (level < 0) continue;
        const score = Math.min(minTip, Number.isFinite(minClear) ? minClear * 2 : Infinity);
        const better = !best || level < best.level || (level === best.level && (score > best.score + 1e-9
          || (Math.abs(score - best.score) <= 1e-9 && c.L + c.len < best.c.L + best.c.len)));
        if (better) best = { c, pts, level, score };
      }
      if (!best) break;
      // The new edge, in parts, tapering.
      const { c, pts } = best;
      const startW = Math.max(style.startWidth[0], Math.min(style.startWidth[1], c.hostW * style.widthRatio));
      const tipW = Math.min(style.tipWidth, startW);
      const total = polyLength(pts);
      const nParts = Math.max(1, Math.round(total / style.partLength));
      const parts = [];
      let acc = 0, k = 0;
      const cum = pts.map((p, j) => (j ? (acc += Math.hypot(p.x - pts[j - 1].x, p.y - pts[j - 1].y)) : 0));
      for (let pi = 0; pi < nParts; pi++) {
        const s0 = (total * pi) / nParts, s1 = (total * (pi + 1)) / nParts;
        const ptsIn = [];
        const a = pointAlong(pts, s0);
        ptsIn.push([a.x, a.y]);
        while (k < pts.length && cum[k] <= s0 + 1e-9) k++;
        for (let j = k; j < pts.length && cum[j] < s1 - 1e-9; j++) ptsIn.push([pts[j].x, pts[j].y]);
        const b = pointAlong(pts, s1);
        ptsIn.push([b.x, b.y]);
        const w = lerp(startW, tipW, (s0 + s1) / 2 / total);
        const grey = style.grey ? Math.max(style.grey.lo, Math.min(style.grey.hi, style.grey.a + style.grey.b * w)) : null;
        parts.push({ i: pi, pts: ptsIn, width: Math.round(w * 10) / 10, stroke: grey !== null ? hexGrey(grey) : (c.host.parts[0] && c.host.parts[0].stroke) || '' });
      }
      const name = `${act.id.replace(/^container:/, '')}~g${g + 1}`;
      const edge = {
        e: nextE++, a: nextNode++, b: nextNode++, tip: name, loop: false, free: false, grown: true, act: act.id,
        host: { e: c.host.e, i: c.i, part: c.q.part, k: c.q.k }, parts, length: total,
      };
      grown.push(edge);
      grownL.set(edge.e, c.L);
      mine.push(edge);
      addEdgeSegs(edge);
      const end = pts[pts.length - 1];
      allTips.push({ x: end.x, y: end.y });
      extra.set(name, { x: end.x, y: end.y, L: c.L + total });
      names.push(name);
      used.push(best.level);
    }
    levels.set(act.id, used);
    const grownOrder = orderTips(model, names, info, extra);
    order.set(act.id, [...own, ...grownOrder].slice(0, count));
  }
  return { model: withGrown(model, grown), grown, order, style, levels, extra };
}

// ── Cards and labels, in the graph's world ───────────────────────────────

// A card w x h whose edge meets `at` where a ray from its centre toward -dir
// leaves it: its near edge on that point, the card set outward along dir.
function cardAt(at, dir, w, h) {
  const hw = w / 2, hh = h / 2;
  const ax = Math.abs(dir.x), ay = Math.abs(dir.y);
  const d = Math.min(ax > 1e-9 ? hw / ax : Infinity, ay > 1e-9 ? hh / ay : Infinity);
  const cx = at.x + dir.x * d, cy = at.y + dir.y * d;
  return { cx, cy, x0: cx - hw, y0: cy - hh, x1: cx + hw, y1: cy + hh };
}

// Every card on its tip, none meeting another. slots: [{ id, act, path:
// [{ x, y }] from the crown to its tip, w, h (full size), minScale }], in
// the order they are placed (easiest first). opts: { gap, obstacles:
// [rects], bounds: { x0, y0, x1, y1 }, actAt(x, y) -> id (the world), step,
// shrinkStep, span }. Returns { cards: Map id -> { cx, cy, w, h, scale,
// tip, anchor, slid, rect, act, unresolved }, stats: Map act -> { cards,
// shrunk, slid, unresolved, scales: [], slides: [] } }.
//
// Each card starts on its tip at full size. Cards that meet (or leave the
// bounds, or their act's space, or meet an obstacle) shrink together a
// step at a time, as far as minScale. A card that still meets one placed
// before it, at minScale, slides along its branch toward the crown until
// it is clear. Then each card, in order, grows back as far as it has room,
// up to its full size.
function placeCards(slots, opts = {}) {
  const gap = opts.gap || 0;
  const obstacles = opts.obstacles || [];
  const b = opts.bounds || null;
  const step = opts.step || 2;
  const span = opts.span || 12;
  const shrink = opts.shrinkStep || 0.04;
  const st = slots.map((slot) => {
    const path = slot.path;
    const tip = path[path.length - 1];
    return {
      slot, path, L: polyLength(path), tip: { x: tip.x, y: tip.y }, anchor: { x: tip.x, y: tip.y }, dir: endDirection(path, span),
      s: 1, min: Math.max(0.05, Math.min(1, slot.minScale || 1)), slid: 0, unresolved: false,
    };
  });
  const rectOf = (c, s = c.s, anchor = c.anchor, dir = c.dir) => cardAt(anchor, dir, c.slot.w * s, c.slot.h * s);
  // Whether a card's rectangle keeps the bounds, its act's space and clear
  // of the obstacles.
  const alone = (r, c) => {
    if (b && (r.x0 < b.x0 - 1e-9 || r.x1 > b.x1 + 1e-9 || r.y0 < b.y0 - 1e-9 || r.y1 > b.y1 + 1e-9)) return false;
    if (opts.actAt && opts.actAt(r.cx, r.cy) !== c.slot.act) return false;
    for (const o of obstacles) if (rectsMeet(r, o, gap)) return false;
    return true;
  };
  // Shrink together.
  for (let guard = 0; guard < 400; guard++) {
    const rects = st.map((c) => rectOf(c));
    const bad = new Set();
    st.forEach((c, i) => {
      if (!alone(rects[i], c)) bad.add(i);
      for (let j = i + 1; j < st.length; j++) if (rectsMeet(rects[i], rects[j], gap)) { bad.add(i); bad.add(j); }
    });
    let changed = false;
    for (const i of bad) {
      const c = st[i];
      if (c.s > c.min + 1e-9) { c.s = Math.max(c.min, c.s * (1 - shrink)); changed = true; }
    }
    if (!changed) break;
  }
  // Slide, in order, what still meets a card placed before it.
  const placed = [];
  const clearOf = (r, c, others) => alone(r, c) && others.every((o) => !rectsMeet(r, o, gap));
  for (const c of st) {
    let r = rectOf(c);
    if (!clearOf(r, c, placed)) {
      c.s = c.min;
      r = rectOf(c);
      let found = clearOf(r, c, placed) ? { anchor: c.anchor, dir: c.dir, slid: 0 } : null;
      let least = null;
      for (let d = step; !found && d < c.L; d += step) {
        const p = pointAlong(c.path, c.L - d);
        const back = c.path.slice(0, p.i).concat([{ x: p.x, y: p.y }]);
        const dir = endDirection(back.length > 1 ? back : [c.path[0], { x: p.x, y: p.y }], span);
        const q = rectOf(c, c.min, p, dir);
        if (clearOf(q, c, placed)) found = { anchor: { x: p.x, y: p.y }, dir, slid: d };
        else {
          let miss = 0;
          for (const o of placed) {
            const w = Math.min(q.x1, o.x1 + gap) - Math.max(q.x0, o.x0 - gap), h = Math.min(q.y1, o.y1 + gap) - Math.max(q.y0, o.y0 - gap);
            if (w > 0 && h > 0) miss += w * h;
          }
          if (!alone(q, c)) miss += (q.x1 - q.x0) * (q.y1 - q.y0);
          if (!least || miss < least.miss) least = { miss, anchor: { x: p.x, y: p.y }, dir, slid: d };
        }
      }
      if (!found) { found = least || { anchor: c.anchor, dir: c.dir, slid: 0 }; c.unresolved = true; }
      c.anchor = found.anchor; c.dir = found.dir; c.slid = found.slid;
      r = rectOf(c);
    }
    placed.push(r);
  }
  // Grow back, in order, as far as there is room.
  st.forEach((c, i) => {
    if (c.unresolved) return;
    const others = placed.filter((_, j) => j !== i);
    let s = c.s;
    while (s < 1 - 1e-9) {
      const next = Math.min(1, s / (1 - shrink));
      if (!clearOf(rectOf(c, next), c, others)) break;
      s = next;
    }
    c.s = s;
    placed[i] = rectOf(c);
  });
  const cards = new Map();
  const stats = new Map();
  for (const c of st) {
    const act = c.slot.act;
    if (!stats.has(act)) stats.set(act, { cards: 0, shrunk: 0, slid: 0, unresolved: 0, scales: [], slides: [] });
    const sa = stats.get(act);
    sa.cards++;
    if (c.s < 1 - 1e-9) sa.shrunk++;
    if (c.slid > 0) { sa.slid++; sa.slides.push(c.slid); }
    if (c.unresolved) sa.unresolved++;
    sa.scales.push(c.s);
    const r = rectOf(c);
    cards.set(c.slot.id, {
      cx: r.cx, cy: r.cy, w: c.slot.w * c.s, h: c.slot.h * c.s, scale: c.s,
      tip: c.tip, anchor: c.anchor, slid: c.slid, rect: r, act, unresolved: c.unresolved,
    });
  }
  return { cards, stats };
}

// The act's main root: from the crown along its own branches, at each fork
// the widest way on, to a tip. One for each of its branches that leaves the
// crown. model: the skeleton; returns [[{ x, y }]] in its px.
function mainRoots(model, owner, actId) {
  const tree = model.edges.filter((e) => !e.loop && !e.free && !e.grown);
  const from = new Map();
  for (const e of tree) { if (!from.has(e.a)) from.set(e.a, []); from.get(e.a).push(e); }
  const width = (e) => Math.max(...e.parts.map((p) => p.width));
  const starts = tree.filter((e) => e.a === 0 && owner.get(e.e) === actId).sort((a, b) => a.e - b.e);
  // An act whose branches leave from further down (a shared trunk): the
  // first edge of its own on the way to each of its tips.
  const firsts = starts.length ? starts : tree.filter((e) => owner.get(e.e) === actId && owner.get((treeOf(model).into.get(e.a) || {}).e) !== actId).sort((a, b) => a.e - b.e);
  return firsts.map((first) => {
    const out = [...(pathToNode(model, first.a) || [])];
    let e = first;
    for (let guard = 0; e && guard < 10000; guard++) {
      for (const q of flatOf(e)) {
        const last = out[out.length - 1];
        if (!last || last.x !== q.x || last.y !== q.y) out.push({ x: q.x, y: q.y });
      }
      const next = (from.get(e.b) || []).filter((x) => owner.get(x.e) === actId);
      next.sort((a, b) => width(b) - width(a) || a.e - b.e);
      e = next[0];
    }
    return out;
  });
}

// Each act's label on its main root, as large as fits there. acts: [{ id,
// roots: [[{ x, y }]] in the world, size(f) -> { w, h } }]. opts: { bounds,
// actAt(x, y) -> id, tips: [{ x, y }] (no label covers one), tipPad,
// obstacles: [rects] (no label meets one: the cards' room on their tips),
// gap, min, max, step, reach (how far down the main root a label may sit,
// a share of its length) }. Returns Map id -> { cx, cy, size, rect, along,
// relaxed }.
// A label is centred on a point of its main root; of all of them, the one
// that takes the largest label, nearer the crown when two take the same.
// The label's box keeps to the bounds, its own act's space, clear of the
// tips, the obstacles and the labels placed before it. Where it fits
// nowhere, those are let go in turn (relaxed 1: its act's space; 2: the
// tips and obstacles too), never the bounds or the other labels.
function placeLabels(acts, opts = {}) {
  const out = new Map();
  const min = opts.min || 8;
  const max = opts.max || 400;
  const step = opts.step || 4;
  const reach = opts.reach || 0.5;
  const tipPad = opts.tipPad || 0;
  const gap = opts.gap || 0;
  const placed = [];
  const ok = (act, cx, cy, f, relax) => {
    const { w, h } = act.size(f);
    const r = { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 };
    const b = opts.bounds;
    if (b && (r.x0 < b.x0 || r.x1 > b.x1 || r.y0 < b.y0 || r.y1 > b.y1)) return null;
    for (const p of placed) if (rectsMeet(r, p, gap)) return null;
    if (relax < 2) {
      for (const o of opts.obstacles || []) if (rectsMeet(r, o, gap)) return null;
      for (const t of opts.tips || []) {
        if (t.x > r.x0 - tipPad && t.x < r.x1 + tipPad && t.y > r.y0 - tipPad && t.y < r.y1 + tipPad) return null;
      }
    }
    if (relax < 1 && opts.actAt) {
      for (let i = 0; i <= 4; i++) for (let j = 0; j <= 2; j++) {
        if (opts.actAt(lerp(r.x0, r.x1, i / 4), lerp(r.y0, r.y1, j / 2)) !== act.id) return null;
      }
    }
    return r;
  };
  for (const act of acts) {
    let best = null;
    for (let relax = 0; relax <= 2 && !best; relax++) {
      for (const root of act.roots || []) {
        const L = polyLength(root);
        for (let s = 0; s <= L * reach + 1e-9; s += step) {
          const p = pointAlong(root, s);
          if (!ok(act, p.x, p.y, min, relax)) continue;
          let lo = min, hi = max;
          if (ok(act, p.x, p.y, hi, relax)) lo = hi;
          else for (let it = 0; it < 24 && hi - lo > 0.05; it++) { const mid = (lo + hi) / 2; if (ok(act, p.x, p.y, mid, relax)) lo = mid; else hi = mid; }
          if (!best || lo > best.size * 1.01 || (lo >= best.size * 0.99 && s < best.along - 1e-9)) {
            best = { cx: p.x, cy: p.y, size: lo, along: s, relaxed: relax };
          }
        }
      }
    }
    if (!best) {
      // Nowhere at all: where its main root starts, at the least size.
      const root = (act.roots || [])[0] || [];
      const p = root.length ? pointAlong(root, Math.min(polyLength(root) * reach, step)) : { x: 0, y: 0 };
      best = { cx: p.x, cy: p.y, size: min, along: 0, relaxed: 3 };
    }
    const { w, h } = act.size(best.size);
    best.rect = { x0: best.cx - w / 2, y0: best.cy - h / 2, x1: best.cx + w / 2, y1: best.cy + h / 2 };
    placed.push(best.rect);
    out.set(act.id, best);
  }
  return out;
}

// The room each card needs at least: its rectangle at its least size on
// its tip (slots as placeCards takes them).
function cardRoom(slots, span = 12) {
  return slots.map((slot) => {
    const tip = slot.path[slot.path.length - 1];
    const s = Math.max(0.05, Math.min(1, slot.minScale || 1));
    return cardAt(tip, endDirection(slot.path, span), slot.w * s, slot.h * s);
  });
}

module.exports = {
  crownOf, treeOf, skeletonInfo, orderTips, pathToNode, pathToTip, edgeOwners, actSpaces, traceStyle,
  growBranches, withGrown, cardAt, cardRoom, placeCards, mainRoots, placeLabels, pointAlong, polyLength, endDirection,
  flatOf, segCross, rectsMeet, STYLE_FALLBACK,
};

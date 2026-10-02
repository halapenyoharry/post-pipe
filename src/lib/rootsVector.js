// The cover's roots as vector paths (opening.art.rootsVector), and how they
// bend toward their acts. Pure: no DOM, so it can be tested.
//
// The file is an SVG of the form a site's trace writes (the novel's site:
// scripts/roots.js): <path>s, each a part of an edge of the roots' tree,
//   data-e     the edge's number; data-part, the part's place along it
//   data-a     the node the edge starts from (nearer the crown), data-b the
//              node it ends at; node 0 is the crown
//   data-tip   the tip's name when the edge ends at a root's tip
//   data-loop  an edge that closes a loop (off the way from the crown)
//   data-free  an edge not joined to the crown
//   stroke, stroke-width, d (M x,y L x,y ...)
// and <circle data-tip cx cy> for every tip, in the art's own px (its
// viewBox is the art's natural size).
//
// An act's roots (containers.<id>.rootTips, or else the tip nearest its
// anchor) are the edges from the crown to those tips. When the act is
// moved by (dx, dy), each of its roots bends: the points along its last
// third move toward the act, eased in from nothing at two thirds of its
// length to the whole move at its tip; whatever grows off those points
// moves with the point it grows from; the rest stays where it was drawn.

const attr = (tag, name) => {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? m[1] : null;
};

function pointsOf(d) {
  const nums = (d || '').match(/-?\d+(?:\.\d+)?(?:e-?\d+)?/gi) || [];
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([Number(nums[i]), Number(nums[i + 1])]);
  return pts;
}

// The file read: { w, h, edges: [{ e, a, b, tip, loop, free, parts: [{ pts,
// width, stroke }] }] in the file's order of edges, tips: Map name -> { x,
// y, node } }. null for a file that is not one.
function parseRoots(text) {
  if (typeof text !== 'string' || !/<svg[\s>]/.test(text)) return null;
  const svgTag = /<svg[^>]*>/.exec(text)[0];
  const vb = (attr(svgTag, 'viewBox') || '').split(/[\s,]+/).map(Number);
  const w = vb.length === 4 && vb[2] > 0 ? vb[2] : Number(attr(svgTag, 'width')) || 0;
  const h = vb.length === 4 && vb[3] > 0 ? vb[3] : Number(attr(svgTag, 'height')) || 0;
  const byE = new Map();
  for (const m of text.matchAll(/<path\b[^>]*>/g)) {
    const tag = m[0];
    const e = attr(tag, 'data-e');
    if (e === null) continue;
    let edge = byE.get(e);
    if (!edge) {
      edge = {
        e: Number(e),
        a: Number(attr(tag, 'data-a')),
        b: Number(attr(tag, 'data-b')),
        tip: attr(tag, 'data-tip'),
        loop: attr(tag, 'data-loop') !== null,
        free: attr(tag, 'data-free') !== null,
        parts: [],
      };
      byE.set(e, edge);
    }
    edge.parts.push({
      i: Number(attr(tag, 'data-part')) || 0,
      pts: pointsOf(attr(tag, 'd')),
      width: Number(attr(tag, 'stroke-width')) || 1,
      stroke: attr(tag, 'stroke') || '',
    });
  }
  const edges = [...byE.values()];
  for (const edge of edges) edge.parts.sort((p, q) => p.i - q.i);
  const tips = new Map();
  for (const m of text.matchAll(/<circle\b[^>]*>/g)) {
    const name = attr(m[0], 'data-tip');
    if (!name) continue;
    tips.set(name, { x: Number(attr(m[0], 'cx')), y: Number(attr(m[0], 'cy')), node: Number(attr(m[0], 'data-node')) });
  }
  if (!w || !h || !edges.length) return null;
  return { w, h, edges, tips };
}

const segLen = (pts) => pts.reduce((t, p, i) => (i ? t + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);

// The tree: for each node the edge that reaches it from the crown, the
// edges in an order where an edge's start is reached before it, each
// edge's length, and the chain of edges from the crown to each tip.
function rootsModel(parsed) {
  if (!parsed) return null;
  const into = new Map();
  for (const edge of parsed.edges) {
    edge.length = edge.parts.reduce((t, p) => t + segLen(p.pts), 0);
    if (!edge.loop && !edge.free && !into.has(edge.b)) into.set(edge.b, edge);
  }
  // Breadth first from the crown.
  const from = new Map();
  for (const edge of parsed.edges) {
    if (edge.loop || edge.free) continue;
    if (!from.has(edge.a)) from.set(edge.a, []);
    from.get(edge.a).push(edge);
  }
  const order = [];
  const queue = [0];
  const seen = new Set([0]);
  while (queue.length) {
    const n = queue.shift();
    for (const edge of from.get(n) || []) {
      order.push(edge);
      if (!seen.has(edge.b)) { seen.add(edge.b); queue.push(edge.b); }
    }
  }
  const chainTo = (node) => {
    const chain = [];
    let n = node;
    for (let guard = 0; guard < 100000 && n !== 0; guard++) {
      const edge = into.get(n);
      if (!edge) return null;
      chain.push(edge);
      n = edge.a;
    }
    return n === 0 ? chain.reverse() : null;
  };
  const chains = new Map();
  for (const [name, tip] of parsed.tips) {
    const node = Number.isFinite(tip.node) ? tip.node : (parsed.edges.find((e) => e.tip === name) || {}).b;
    const chain = chainTo(node);
    if (chain && chain.length) chains.set(name, chain);
  }
  return { ...parsed, order, chains };
}

// The tip nearest a point (art px), by name; null without tips.
function nearestTip(model, p) {
  let best = null, bd = Infinity;
  for (const [name, t] of model.tips) {
    if (!model.chains.has(name)) continue;
    const d = Math.hypot(t.x - p.x, t.y - p.y);
    if (d < bd) { bd = d; best = name; }
  }
  return best;
}

// Each act's roots: its rootTips that the file has, or else the tip nearest
// its anchor (fractions of the art). acts: [{ id, anchor, rootTips }] ->
// Map id -> [tip names].
function actRoots(model, acts) {
  const out = new Map();
  if (!model) return out;
  for (const a of acts || []) {
    const named = Array.isArray(a.rootTips) ? a.rootTips.filter((t) => model.chains.has(t)) : [];
    if (named.length) { out.set(a.id, named); continue; }
    if (!a.anchor) continue;
    const tip = nearestTip(model, { x: a.anchor.x * model.w, y: a.anchor.y * model.h });
    if (tip) out.set(a.id, [tip]);
  }
  return out;
}

const ease = (u) => { const t = Math.max(0, Math.min(1, (u - 2 / 3) * 3)); return t * t * (3 - 2 * t); };

// Where every point is with the acts moved: drifts, Map id -> { dx, dy } in
// art px; roots, from actRoots. Returns, per edge (by its number), per part,
// the points moved; an edge nothing moves keeps its own arrays.
function bentRoots(model, roots, drifts) {
  const moved = new Map();
  if (!model) return moved;
  // Per edge, per part, per point: the move; per node: the move.
  const field = new Map(model.edges.map((e) => [e.e, e.parts.map((p) => p.pts.map(() => [0, 0]))]));
  let any = false;
  for (const [id, tips] of roots) {
    const d = drifts && drifts.get(id);
    if (!d || (Math.abs(d.dx) < 0.01 && Math.abs(d.dy) < 0.01)) continue;
    any = true;
    // This act's own weights: on its roots' last thirds, the largest over
    // its tips where they share an edge.
    const weight = new Map();   // edge -> per part, per point
    const nodeW = new Map([[0, 0]]);
    for (const tip of tips) {
      const chain = model.chains.get(tip);
      if (!chain) continue;
      const L = chain.reduce((t, e) => t + e.length, 0) || 1;
      let s = 0;
      for (const edge of chain) {
        const ws = weight.get(edge.e) || edge.parts.map((p) => p.pts.map(() => 0));
        edge.parts.forEach((part, pi) => {
          part.pts.forEach((pt, k) => {
            if (k > 0) s += Math.hypot(pt[0] - part.pts[k - 1][0], pt[1] - part.pts[k - 1][1]);
            ws[pi][k] = Math.max(ws[pi][k], ease(s / L));
          });
        });
        weight.set(edge.e, ws);
        nodeW.set(edge.b, Math.max(nodeW.get(edge.b) || 0, ease(s / L)));
      }
    }
    // Down the tree: an edge on a root bends by its weights; any other edge
    // moves with the node it grows from.
    const nodeMove = new Map([[0, 0]]);
    for (const edge of model.order) {
      const ws = weight.get(edge.e);
      const f = field.get(edge.e);
      if (ws) {
        ws.forEach((row, pi) => row.forEach((wt, k) => { f[pi][k][0] += wt * d.dx; f[pi][k][1] += wt * d.dy; }));
        nodeMove.set(edge.b, nodeW.get(edge.b) || 0);
      } else {
        const wa = nodeMove.get(edge.a) || 0;
        if (wa) f.forEach((row) => row.forEach((q) => { q[0] += wa * d.dx; q[1] += wa * d.dy; }));
        if (!nodeMove.has(edge.b)) nodeMove.set(edge.b, wa);
      }
    }
    // A loop's ends may move apart: it is stretched between them.
    for (const edge of model.edges) {
      if (!edge.loop) continue;
      const wa = nodeMove.get(edge.a) || 0, wb = nodeMove.get(edge.b) || 0;
      if (!wa && !wb) continue;
      const total = edge.length || 1;
      let s = 0;
      const f = field.get(edge.e);
      edge.parts.forEach((part, pi) => part.pts.forEach((pt, k) => {
        if (k > 0) s += Math.hypot(pt[0] - part.pts[k - 1][0], pt[1] - part.pts[k - 1][1]);
        const wt = wa + (wb - wa) * (s / total);
        f[pi][k][0] += wt * d.dx; f[pi][k][1] += wt * d.dy;
      }));
    }
  }
  for (const edge of model.edges) {
    const f = field.get(edge.e);
    const still = !any || f.every((row) => row.every((q) => q[0] === 0 && q[1] === 0));
    moved.set(edge.e, still
      ? edge.parts.map((p) => p.pts)
      : edge.parts.map((p, pi) => p.pts.map((pt, k) => [pt[0] + f[pi][k][0], pt[1] + f[pi][k][1]])));
  }
  return moved;
}

const pathD = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`).join('L') : '');

module.exports = { parseRoots, rootsModel, actRoots, nearestTip, bentRoots, pathD, easeRoot: ease };

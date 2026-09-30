// Container layout — pure position assignment for nested containers, no D3,
// no DOM.
//
// Each container is laid out in its own frame, with its label at the origin:
// the label is a reserved rectangle and the first unit sits directly below it.
// A unit is either a member node or a child container, which is laid out the
// same way first and then placed as one box. Doing it bottom-up is what keeps
// a book's label off its acts' labels: an act is a solid box by the time the
// book places it, label and all.
//
// Where the rest go depends on what the container holds:
//   - members with a reading order (mode 'path', the default): one after
//     another along a golden spiral, the radius growing by φ every quarter
//     turn, each the next free spot along the curve. Consecutive members are
//     neighbours, so the next-edges between them are short and trace the curve.
//   - child containers: beside the first one, alternating right and left, lifted
//     so the label ends up about a third of the way down the whole.
//   - mode 'scatter', or members with no order: the golden-angle spiral, each
//     unit pushed out along its ray until it clears the label and everything
//     already placed.
//
// The renderer turns this into a gentle positional force, so the result is a
// target the simulation settles into rather than coordinates it is nailed to.

const GOLDEN = 137.508 * (Math.PI / 180);
const PHI = (1 + Math.sqrt(5)) / 2;
// r = a · φ^(turn / quarter turn): the golden spiral.
const SPIRAL_B = Math.log(PHI) / (Math.PI / 2);

function rectsOverlap(a, b, gap = 0) {
  return a.x0 < b.x1 + gap && b.x0 < a.x1 + gap && a.y0 < b.y1 + gap && b.y0 < a.y1 + gap;
}

function rectAt(cx, cy, w, h) {
  return { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 };
}

function union(rects) {
  return {
    x0: Math.min(...rects.map((r) => r.x0)),
    y0: Math.min(...rects.map((r) => r.y0)),
    x1: Math.max(...rects.map((r) => r.x1)),
    y1: Math.max(...rects.map((r) => r.y1)),
  };
}

// Order within a container: its own order (chapter number / series_part /
// manuscript order), falling back to date, then to the order given.
function compareUnits(a, b) {
  const ao = Number.isFinite(a.order) ? a.order : null;
  const bo = Number.isFinite(b.order) ? b.order : null;
  if (ao !== null && bo !== null && ao !== bo) return ao - bo;
  if (ao !== null && bo === null) return -1;
  if (ao === null && bo !== null) return 1;
  const ad = Date.parse(a.date || '') || 0;
  const bd = Date.parse(b.date || '') || 0;
  if (ad !== bd) return ad - bd;
  return a.index - b.index;
}

/**
 * @param {Object}   input
 * @param {Array}    input.containers  [{ id, parent }] in declaration order
 * @param {Map}      input.members     containerId -> [{ id, w, h, order, date }] direct member nodes
 * @param {Function} input.labelSize   (container, depth) -> { w, h } of its label block
 * @param {Function} [input.macroSize] (container) -> { w, h } of its closed form
 * @param {Set}      [input.closed]    ids of closed containers
 * @param {Object}   [input.options]   { spacing, gap, padding(container), mode, startRadius }
 *   mode: 'path' (default) | 'scatter'; startRadius: the spiral's radius at its first member
 * @returns {{ roots: string[], nodes: Map, containers: Map }}
 *   nodes:      nodeId -> { root, x, y }          position in its root container's frame
 *   containers: id -> { root, label: rect, box: rect, center: {x, y}, closed }  in the root frame
 */
function containerLayout({ containers, members, labelSize, macroSize, closed, options = {} }) {
  const spacing = options.spacing != null ? options.spacing : 20;
  const gap = options.gap != null ? options.gap : 16;
  const paddingOf = options.padding || (() => 40);
  const mode = options.mode === 'scatter' ? 'scatter' : 'path';
  const closedSet = closed || new Set();
  const byId = new Map(containers.map((c) => [c.id, c]));
  const childrenOf = new Map(containers.map((c) => [c.id, []]));
  containers.forEach((c, index) => {
    if (c.parent && childrenOf.has(c.parent)) childrenOf.get(c.parent).push({ c, index });
  });

  // Returns the container's layout in its own frame (label centred on the origin).
  function layoutOne(c, depth, seen) {
    if (seen.has(c.id)) return null;
    seen.add(c.id);

    const descendantsOf = (id) => {
      const out = [...(members.get(id) || []).map((m) => m.id)];
      for (const { c: ch } of childrenOf.get(id) || []) out.push(...descendantsOf(ch.id));
      return out;
    };

    if (closedSet.has(c.id)) {
      const m = (macroSize && macroSize(c)) || { w: 260, h: 90 };
      const box = rectAt(0, 0, m.w, m.h);
      const nodes = new Map(descendantsOf(c.id).map((id) => [id, { x: 0, y: 0 }]));
      const self = { label: box, box, center: { x: 0, y: 0 }, closed: true };
      return { box, nodes, containers: new Map([[c.id, self]]) };
    }

    const units = [];
    for (const { c: ch, index } of childrenOf.get(c.id) || []) {
      const sub = layoutOne(ch, depth + 1, seen);
      if (!sub) continue;
      if (sub.nodes.size === 0 && !closedSet.has(ch.id)) continue;
      units.push({
        kind: 'container', id: ch.id, sub,
        w: sub.box.x1 - sub.box.x0, h: sub.box.y1 - sub.box.y0,
        order: Number.isFinite(ch.order) ? ch.order : null, index: -10000 + index,
      });
    }
    (members.get(c.id) || []).forEach((m, index) => {
      units.push({ kind: 'node', id: m.id, w: m.w, h: m.h, order: m.order, date: m.date, index });
    });
    units.sort(compareUnits);

    const lab = labelSize(c, depth) || { w: 160, h: 60 };
    const labelRect = rectAt(0, 0, lab.w, lab.h);
    const nodes = new Map();
    const cmap = new Map();
    const placed = [];

    let spiral = null;
    if (units.length) {
      const first = units[0];
      const fx = 0;
      const fy = lab.h / 2 + gap + first.h / 2;
      const clear = (rect) => !rectsOverlap(rect, labelRect, gap) && !placed.some((p) => rectsOverlap(rect, p, spacing));
      const hasChildContainers = units.some((u) => u.kind === 'container');
      const ordered = units.some((u) => Number.isFinite(u.order));
      const arrangement = mode === 'scatter' ? 'scatter'
        : hasChildContainers ? 'beside'
        : ordered ? 'path' : 'scatter';
      const positions = [];

      if (arrangement === 'path') {
        // The curve starts at the first member, at the top of the spiral, and
        // winds clockwise and outward around a centre below it.
        const maxSide = Math.max(...units.map((u) => Math.max(u.w, u.h)));
        const a = options.startRadius != null ? options.startRadius : maxSide * 0.65;
        const cx0 = fx;
        const cy0 = fy + a;
        const t0 = -Math.PI / 2;
        const at = (t) => {
          const r = a * Math.exp(SPIRAL_B * (t - t0));
          return { x: cx0 + r * Math.cos(t), y: cy0 + r * Math.sin(t) };
        };
        spiral = { cx: cx0, cy: cy0, a, b: SPIRAL_B };
        let t = t0;
        units.forEach((u, k) => {
          let p = { x: fx, y: fy };
          if (k > 0) {
            // Walk along the curve, a few pixels at a time, to the first spot
            // where this unit clears the label and every unit already placed:
            // one unit size plus spacing from the previous one.
            for (let guard = 0; guard < 200000; guard++) {
              const r = a * Math.exp(SPIRAL_B * (t - t0));
              t += 3 / (r * Math.sqrt(1 + SPIRAL_B * SPIRAL_B));
              p = at(t);
              if (clear(rectAt(p.x, p.y, u.w, u.h))) break;
            }
          }
          positions.push(p);
          placed.push(rectAt(p.x, p.y, u.w, u.h));
        });
      } else if (arrangement === 'beside') {
        // First unit under the label; the rest alternate right and left of
        // everything placed so far, their tops lifted so the label sits about
        // a third of the way down. Nothing goes above the label.
        positions.push({ x: fx, y: fy });
        placed.push(rectAt(fx, fy, first.w, first.h));
        let right = Math.max(labelRect.x1, fx + first.w / 2);
        let left = Math.min(labelRect.x0, fx - first.w / 2);
        let bottom = fy + first.h / 2;
        units.slice(1).forEach((u, i) => {
          // Label centre at 0: top T with (0 - T) = (bottom - T) / 3.
          let top = -bottom / 2;
          if (top + u.h > bottom) top = -u.h / 3;
          const y = top + u.h / 2;
          let x;
          if (i % 2 === 0) { x = right + spacing * 2 + u.w / 2; right = x + u.w / 2; }
          else { x = left - spacing * 2 - u.w / 2; left = x - u.w / 2; }
          bottom = Math.max(bottom, top + u.h);
          positions.push({ x, y });
          placed.push(rectAt(x, y, u.w, u.h));
        });
      } else {
        const typical = units.reduce((s, u) => s + Math.hypot(u.w, u.h), 0) / units.length;
        const step = typical / 2 + spacing;
        units.forEach((u, k) => {
          let cx = fx;
          let cy = fy;
          if (k > 0) {
            const angle = k * GOLDEN;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            let r = step * Math.sqrt(k);
            // Push outward along the ray until clear of the label and of every
            // unit already placed.
            for (let guard = 0; guard < 2000; guard++) {
              cx = fx + dx * r;
              cy = fy + dy * r;
              if (clear(rectAt(cx, cy, u.w, u.h))) break;
              r += 8;
            }
          }
          positions.push({ x: cx, y: cy });
          placed.push(rectAt(cx, cy, u.w, u.h));
        });
      }

      units.forEach((u, k) => {
        const cx = positions[k].x;
        const cy = positions[k].y;
        if (u.kind === 'node') {
          nodes.set(u.id, { x: cx, y: cy });
        } else {
          // Place the child so its box is centred on the unit.
          const ox = cx - (u.sub.box.x0 + u.sub.box.x1) / 2;
          const oy = cy - (u.sub.box.y0 + u.sub.box.y1) / 2;
          for (const [id, p] of u.sub.nodes) nodes.set(id, { x: p.x + ox, y: p.y + oy });
          for (const [id, info] of u.sub.containers) {
            const shift = (r) => ({ x0: r.x0 + ox, y0: r.y0 + oy, x1: r.x1 + ox, y1: r.y1 + oy });
            cmap.set(id, {
              ...info,
              label: shift(info.label),
              box: shift(info.box),
              center: { x: info.center.x + ox, y: info.center.y + oy },
              spiral: info.spiral ? { ...info.spiral, cx: info.spiral.cx + ox, cy: info.spiral.cy + oy } : info.spiral,
            });
          }
        }
      });
    }

    // The hull is a smoothed curve through padded corners and bulges a little
    // past them; the box allows for that.
    const pad = paddingOf(c, depth) * 1.25;
    const inner = placed.length ? union([labelRect, ...placed]) : labelRect;
    const box = { x0: inner.x0 - pad, y0: inner.y0 - pad, x1: inner.x1 + pad, y1: inner.y1 + pad };
    cmap.set(c.id, { label: labelRect, box, center: { x: 0, y: 0 }, closed: false, spiral });
    return { box, nodes, containers: cmap };
  }

  const roots = containers.filter((c) => !c.parent || !byId.has(c.parent)).map((c) => c.id);
  const outNodes = new Map();
  const outContainers = new Map();
  for (const rootId of roots) {
    const res = layoutOne(byId.get(rootId), 0, new Set());
    if (!res) continue;
    for (const [id, p] of res.nodes) {
      if (!outNodes.has(id)) outNodes.set(id, { root: rootId, x: p.x, y: p.y });
    }
    for (const [id, info] of res.containers) outContainers.set(id, { root: rootId, ...info });
  }
  return { roots, nodes: outNodes, containers: outContainers };
}

module.exports = { containerLayout, rectsOverlap, compareUnits };

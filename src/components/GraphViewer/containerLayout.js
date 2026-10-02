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
//   - mode 'ring' (the ring layout): members on a circle round the label, in
//     order, clockwise from the top; child containers as for 'path'.
//
//   - layout 'hang' (options.layoutOf(container) === 'hang'): the container
//     hangs from its anchor. Its frame's origin is the top of its hull, and
//     its members run below in a chain at most `columns` cards wide: down the
//     far side, round, and up the near side, so one end of the chain is low
//     and the other is at the top, under the anchor (hangChain below).
//
//   - the spiral's own settings (options.spiralOf(container), spiralOptions
//     below): anchorEnd 'outer' puts the spiral's outer end, its last member,
//     at the frame's origin (the container's anchor), turned so the first
//     member lies from it toward openTowards ('down', 'down-left' or
//     'down-right'); keepBelowY keeps every card and the hull at or below
//     that line of the frame, turning the spiral or else moving it down;
//     cardScale draws the container's cards at that scale and spaces them
//     for it; spacing overrides options.spacing for that container.
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

// How a container is laid out: containers.<id>.layout, else
// graph.containerLayout. 'hang' hangs it from its anchor (containerLayout.js);
// anything else, the spiral.
function containerLayoutOf(c, GS) {
  const l = (c && c.layout) || (GS && GS.containerLayout);
  return l === 'hang' ? 'hang' : null;
}

// Whether a container's hull is drawn: containers.<id>.hull false leaves it
// undrawn (a book whose acts and cover stand in for it).
function hullDrawn(c) {
  return !(c && c.hull === false);
}

// The closed pill's scale against its full size (graph.closedPillScale).
function closedPillScaleOf(GS) {
  const v = Number(GS && GS.closedPillScale);
  return Number.isFinite(v) && v > 0 ? v : 1;
}

// Where a spiral with anchorEnd 'outer' opens: the direction, from its last
// member, in which its first member lies (screen angles, y down).
const SPIRAL_TOWARDS = { down: Math.PI / 2, 'down-right': Math.PI / 4, 'down-left': (3 * Math.PI) / 4 };

// A container's spiral settings with their defaults: containers.<id>.spiral
// over graph.spiral. keepBelowY is a y in the container's frame (the anchor
// at 0), worked out by the renderer from spiral.keepBelow; null for none.
function spiralOptions(s) {
  const o = s && typeof s === 'object' ? s : {};
  const num = (v) => (v !== null && v !== '' && v !== undefined && Number.isFinite(Number(v)) ? Number(v) : null);
  const scale = num(o.cardScale);
  const spacing = num(o.spacing);
  return {
    anchorEnd: o.anchorEnd === 'outer' ? 'outer' : 'center',
    openTowards: Object.prototype.hasOwnProperty.call(SPIRAL_TOWARDS, o.openTowards) ? o.openTowards : 'down',
    keepBelowY: num(o.keepBelowY),
    cardScale: scale !== null && scale > 0 ? scale : 1,
    spacing: spacing !== null && spacing >= 0 ? spacing : null,
  };
}

// The signed difference a - b of two angles, in (-π, π].
function angleDiff(a, b) {
  let d = (a - b) % (2 * Math.PI);
  if (d <= -Math.PI) d += 2 * Math.PI;
  if (d > Math.PI) d -= 2 * Math.PI;
  return d;
}

const HANG_DIRECTIONS = ['down', 'down-left', 'down-right'];

// A hanging container's settings with their defaults: containers.<id>.hang
// over graph.hang.
function hangOptions(h) {
  const o = h && typeof h === 'object' ? h : {};
  const columns = Math.max(1, Math.round(Number(o.columns) || 2));
  const gap = Number.isFinite(Number(o.gap)) && o.gap !== null && o.gap !== '' ? Math.max(0, Number(o.gap)) : 12;
  return {
    direction: HANG_DIRECTIONS.includes(o.direction) ? o.direction : 'down',
    firstAt: o.firstAt === 'top' ? 'top' : 'bottom',
    columns,
    gap,
  };
}

// How many rows a chain of n takes in `columns` columns. With one column,
// one row each. With more, the near column (the one that comes back up to
// the top) is the long one, about three-fifths of the chain for two columns,
// so the far side starts well down and the first member is low.
function hangRows(n, columns) {
  if (n <= 0) return 0;
  if (columns <= 1) return n;
  return Math.max(Math.ceil(n / columns), Math.ceil((0.6 * n) / (columns - 1)));
}

/**
 * A hanging chain, in a frame whose origin is the anchor: the top of the
 * hull. Pure geometry, so it can be tested on its own.
 *
 * The slots run, from the top end of the chain: down the near column, up the
 * next one, down the one after, and so on out to the far side. The chain
 * takes the first n of them, so it ends partway along the far column. With
 * firstAt 'bottom' the first member takes that far, low end and the last one
 * the top of the near column, under the anchor; with 'top', the reverse.
 *
 * The near column is the one under the anchor. 'down' centres the chain on
 * the anchor, its far side to the right; 'down-right' hangs it to the right of
 * the anchor, the hull's left edge (the near card's, padded) under it, so
 * nothing of it reaches back past the anchor; 'down-left' mirrors that.
 *
 * The label goes in the far column's empty top, when there is one it fits
 * (beside the near column's top); otherwise above the chain. Either way the
 * top of everything, padded by `pad`, is at y = 0.
 *
 * @param {Array}  units  [{ w, h }] in reading order
 * @param {Object} lab    { w, h } of the label
 * @param {Object} opts   { direction, firstAt, columns, gap, pad, labelGap }
 * @returns {{ positions: [{x, y}], label: rect, rows, columns, slots: [{col, row}] }}
 */
function hangChain(units, lab, opts = {}) {
  const o = { ...hangOptions(opts), pad: opts.pad != null ? opts.pad : 40, labelGap: opts.labelGap != null ? opts.labelGap : 12 };
  const n = units.length;
  const cw = n ? Math.max(...units.map((u) => u.w)) : 0;
  const ch = n ? Math.max(...units.map((u) => u.h)) : 0;
  const cols = Math.max(1, Math.min(o.columns, n || 1));
  const R = hangRows(n, cols);
  // Slots from the top end of the chain.
  const slots = [];
  for (let j = 0; j < cols && slots.length < n; j++) {
    for (let i = 0; i < R && slots.length < n; i++) slots.push({ col: j, row: j % 2 === 0 ? i : R - 1 - i });
  }
  // Member k's slot: from the far, low end for 'bottom'.
  const slotOf = (k) => (o.firstAt === 'bottom' ? slots[n - 1 - k] : slots[k]);
  const usedCols = n ? Math.max(...slots.map((s) => s.col)) + 1 : 1;
  const far = o.direction === 'down-left' ? -1 : 1;
  const stepX = cw + o.gap;
  const stepY = ch + o.gap;
  // x of the near column's centre.
  const nearX = o.direction === 'down' ? -far * ((usedCols - 1) * stepX) / 2
    : o.direction === 'down-right' ? o.pad + cw / 2 : -(o.pad + cw / 2);
  const colX = (j) => nearX + far * j * stepX;

  // The far column's empty top, above the far end of the chain: rows before
  // the first one it uses.
  const farCol = usedCols - 1;
  const farRows = slots.filter((s) => s.col === farCol).map((s) => s.row);
  const emptyRows = farCol > 0 ? Math.min(...farRows) : 0;
  const emptyH = emptyRows * stepY - o.gap;
  const chainX0 = Math.min(colX(0), colX(farCol)) - cw / 2;
  const chainX1 = Math.max(colX(0), colX(farCol)) + cw / 2;
  // The label may spill past its column outward, never inward over the
  // next column's cards.
  const besideRoom = cw + o.gap;
  const fitsBeside = farCol > 0 && lab.w <= besideRoom && lab.h <= emptyH;

  let top = o.pad; // the top of the first row
  let label;
  if (fitsBeside) {
    // Centred in the empty space, on the far column.
    const cy = o.pad + emptyH / 2;
    const cx = colX(farCol);
    label = { x0: cx - lab.w / 2, y0: cy - lab.h / 2, x1: cx + lab.w / 2, y1: cy + lab.h / 2 };
  } else {
    // Above the chain, centred over it; the hull pads a label by half.
    const cx = n ? (chainX0 + chainX1) / 2 : 0;
    const y0 = o.pad / 2;
    label = { x0: cx - lab.w / 2, y0, x1: cx + lab.w / 2, y1: y0 + lab.h };
    top = Math.max(o.pad, label.y1 + o.labelGap);
  }
  const positions = units.map((u, k) => {
    const s = slotOf(k);
    return { x: colX(s.col), y: top + s.row * stepY + ch / 2 };
  });
  return { positions, label, rows: R, columns: usedCols, slots: units.map((u, k) => slotOf(k)), labelBeside: fitsBeside };
}

/**
 * @param {Object}   input
 * @param {Array}    input.containers  [{ id, parent }] in declaration order
 * @param {Map}      input.members     containerId -> [{ id, w, h, order, date }] direct member nodes
 * @param {Function} input.labelSize   (container, depth) -> { w, h } of its label block
 * @param {Function} [input.macroSize] (container) -> { w, h } of its closed form
 * @param {Set}      [input.closed]    ids of closed containers
 * @param {Object}   [input.options]   { spacing, gap, padding(container), mode, startRadius }
 *   layoutOf(container): 'hang' lays that container out as a hanging chain (hangChain);
 *   hangOf(container): its hang settings { direction, firstAt, columns, gap }
 *   mode: 'path' (default) | 'scatter' | 'ring'; startRadius: the spiral's radius at its first member;
 *   direction: 'outward' (default, the first member beside the label) | 'inward' (the first member on the outer end)
 *   spiralOf(container): its spiral settings { anchorEnd, openTowards, keepBelowY, cardScale, spacing } (spiralOptions)
 * @returns {{ roots: string[], nodes: Map, containers: Map }}
 *   nodes:      nodeId -> { root, x, y, scale }   position in its root container's frame; scale, the card's (cardScale)
 *   containers: id -> { root, label: rect, box: rect, center: {x, y}, closed }  in the root frame
 */
function containerLayout({ containers, members, labelSize, macroSize, closed, options = {} }) {
  const spacing = options.spacing != null ? options.spacing : 20;
  const gap = options.gap != null ? options.gap : 16;
  const paddingOf = options.padding || (() => 40);
  const mode = options.mode === 'scatter' || options.mode === 'ring' ? options.mode : 'path';
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
    // The spiral's own settings; its cards are spaced at the scale they are
    // drawn at.
    const so = spiralOptions(options.spiralOf ? options.spiralOf(c) : null);
    const ownSpacing = so.spacing !== null ? so.spacing : spacing;
    (members.get(c.id) || []).forEach((m, index) => {
      units.push({ kind: 'node', id: m.id, w: m.w * so.cardScale, h: m.h * so.cardScale, scale: so.cardScale, order: m.order, date: m.date, index });
    });
    units.sort(compareUnits);

    const lab = labelSize(c, depth) || { w: 160, h: 60 };

    // A hanging container: its frame's origin is its anchor, the top of
    // its hull. Only members hang; a container holding containers is laid
    // out as below.
    if (options.layoutOf && options.layoutOf(c) === 'hang' && units.every((u) => u.kind === 'node')) {
      const pad = paddingOf(c, depth);
      const hang = hangOptions(options.hangOf ? options.hangOf(c) : null);
      const res = hangChain(units, lab, { ...hang, pad, labelGap: gap / 2 });
      const nodes = new Map();
      const placed = units.map((u, k) => {
        nodes.set(u.id, { x: res.positions[k].x, y: res.positions[k].y, scale: u.scale });
        return rectAt(res.positions[k].x, res.positions[k].y, u.w, u.h);
      });
      const inner = placed.length ? union([res.label, ...placed]) : res.label;
      // The hull's top is at the origin; the box allows for its curve
      // bulging a little past the padded corners at the sides and the foot.
      const bulge = pad * 1.25;
      const box = { x0: inner.x0 - bulge, y0: 0, x1: inner.x1 + bulge, y1: inner.y1 + bulge };
      const self = {
        label: res.label, box, center: { x: 0, y: 0 }, closed: false, spiral: null,
        hang: { ...hang, pad, rows: res.rows, columns: res.columns, labelBeside: res.labelBeside },
      };
      return { box, nodes, containers: new Map([[c.id, self]]) };
    }

    let labelRect = rectAt(0, 0, lab.w, lab.h);
    const nodes = new Map();
    const cmap = new Map();
    const placed = [];

    let spiral = null;
    if (units.length) {
      const first = units[0];
      const fx = 0;
      const fy = lab.h / 2 + gap + first.h / 2;
      const clear = (rect) => !rectsOverlap(rect, labelRect, gap) && !placed.some((p) => rectsOverlap(rect, p, ownSpacing));
      const hasChildContainers = units.some((u) => u.kind === 'container');
      const ordered = units.some((u) => Number.isFinite(u.order));
      const arrangement = hasChildContainers ? (mode === 'scatter' ? 'scatter' : 'beside')
        : mode === 'ring' ? 'ring'
        : mode === 'scatter' ? 'scatter'
        : ordered ? 'path' : 'scatter';
      const positions = [];

      if (arrangement === 'path') {
        // The curve starts at the first member, at the top of the spiral, and
        // winds clockwise and outward around a centre below it.
        //
        // direction 'inward' keeps the reading order and turns the walk
        // round: the curve is laid out from the last member outward, then
        // mirrored, so the first member sits on the outer end (where the eye
        // lands first, at the top) and the order winds clockwise and inward
        // to the last one beside the label.
        //
        // The curve can be turned by theta about the first member it is
        // laid out from (the label stays above that member); each unit is
        // still placed at the first spot along it that clears the rest, so a
        // turned spiral is packed as tightly as an upright one.
        const inward = options.direction === 'inward';
        const order = inward ? units.slice().reverse() : units;
        const sy = lab.h / 2 + gap + order[0].h / 2;
        const maxSide = Math.max(...order.map((u) => Math.max(u.w, u.h)));
        const a = options.startRadius != null ? options.startRadius : maxSide * 0.65;
        const t0 = -Math.PI / 2;
        const walk = (theta) => {
          const cos = Math.cos(theta), sin = Math.sin(theta);
          const rot = (x, y) => ({ x: x * cos - y * sin, y: x * sin + y * cos });
          const c0 = rot(0, a);
          const cx0 = fx + c0.x;
          const cy0 = sy + c0.y;
          const at = (t) => {
            const r = a * Math.exp(SPIRAL_B * (t - t0));
            const d = rot(Math.cos(t), Math.sin(t));
            return { x: cx0 + r * d.x, y: cy0 + r * d.y };
          };
          const pos = [];
          const rects = [];
          const free = (rect) => !rectsOverlap(rect, labelRect, gap) && !rects.some((p) => rectsOverlap(rect, p, ownSpacing));
          let t = t0;
          order.forEach((u, k) => {
            let p = { x: fx, y: sy };
            if (k > 0) {
              // Walk along the curve, a few pixels at a time, to the first spot
              // where this unit clears the label and every unit already placed:
              // one unit size plus spacing from the previous one.
              for (let guard = 0; guard < 200000; guard++) {
                const r = a * Math.exp(SPIRAL_B * (t - t0));
                t += 3 / (r * Math.sqrt(1 + SPIRAL_B * SPIRAL_B));
                p = at(t);
                if (free(rectAt(p.x, p.y, u.w, u.h))) break;
              }
            }
            pos.push(p);
            rects.push(rectAt(p.x, p.y, u.w, u.h));
          });
          let sp = { cx: cx0, cy: cy0, a, b: SPIRAL_B, theta };
          if (inward) {
            pos.reverse();
            rects.reverse();
            for (const p of pos) p.x = -p.x;
            for (const r of rects) { const x0 = -r.x1; r.x1 = -r.x0; r.x0 = x0; }
            sp = { ...sp, cx: -sp.cx, mirrored: true, inward: true };
          }
          return { pos, rects, sp };
        };
        // The direction from the last member to the first.
        const opening = (res) => {
          const f = res.pos[0], l = res.pos[res.pos.length - 1];
          return Math.atan2(f.y - l.y, f.x - l.x);
        };
        // Turned by theta, then moved so the last member is at the origin.
        const outerEnd = so.anchorEnd === 'outer';
        const shifted = (theta) => {
          const res = walk(theta);
          const last = res.pos[res.pos.length - 1];
          const dx = outerEnd ? -last.x : 0, dy = outerEnd ? -last.y : 0;
          return { ...res, dx, dy };
        };
        let theta = 0;
        let res = shifted(theta);
        if (outerEnd && order.length > 1) {
          // Turn the curve until its first member lies from its last toward
          // openTowards. Mirrored (inward), a turn of the curve turns the
          // result the other way.
          const want = SPIRAL_TOWARDS[so.openTowards];
          const sign = inward ? -1 : 1;
          const miss = (r) => Math.abs(angleDiff(want, opening(r)));
          for (let i = 0; i < 16; i++) {
            const err = angleDiff(want, opening(res));
            if (Math.abs(err) < 0.002) break;
            theta += sign * err;
            res = shifted(theta);
          }
          // A turn can move a member past the label to another spot, so the
          // steps above need not settle: then search, every 3 degrees round,
          // and finer about the best.
          if (miss(res) >= 0.002) {
            let best = { theta, res };
            const tryAt = (th) => {
              const r = shifted(th);
              if (miss(r) < miss(best.res)) best = { theta: th, res: r };
            };
            for (let s = 0; s < 120; s++) tryAt((s * Math.PI) / 60);
            for (let span = Math.PI / 60; span > 0.0005; span /= 3) {
              const c0 = best.theta;
              for (let s = -3; s <= 3; s++) tryAt(c0 + (s * span) / 3);
            }
            theta = best.theta;
            res = best.res;
          }
          // What is left (a few degrees where the packing jumps) is taken
          // up by turning the placed centres, and the label's, about the last
          // member: as far as they go without any two meeting.
          const rest = angleDiff(want, opening(res));
          if (Math.abs(rest) >= 0.002 && Math.abs(rest) < (15 * Math.PI) / 180) {
            const L = res.pos[res.pos.length - 1];
            const turnBy = (ang) => {
              const cos = Math.cos(ang), sin = Math.sin(ang);
              const turn = (p) => ({ x: L.x + (p.x - L.x) * cos - (p.y - L.y) * sin, y: L.y + (p.x - L.x) * sin + (p.y - L.y) * cos });
              const pos = res.pos.map(turn);
              const rects = res.rects.map((r, k) => rectAt(pos[k].x, pos[k].y, r.x1 - r.x0, r.y1 - r.y0));
              const lc = turn({ x: (labelRect.x0 + labelRect.x1) / 2, y: (labelRect.y0 + labelRect.y1) / 2 });
              const lr = rectAt(lc.x, lc.y, labelRect.x1 - labelRect.x0, labelRect.y1 - labelRect.y0);
              const sc = turn({ x: res.sp.cx, y: res.sp.cy });
              const ok = rects.every((r, i) => !rectsOverlap(r, lr, gap / 2) && rects.every((q, j) => j <= i || !rectsOverlap(r, q, ownSpacing / 4)));
              return ok ? { ...res, pos, rects, lab: lr, sp: { ...res.sp, cx: sc.x, cy: sc.y } } : null;
            };
            let lo = 0, hi = 1, done = turnBy(rest);
            if (!done) {
              for (let i = 0; i < 12; i++) {
                const mid = (lo + hi) / 2;
                const r = turnBy(rest * mid);
                if (r) { lo = mid; done = r; } else hi = mid;
              }
            }
            if (done) res = done;
          }
        }
        // Nothing above keepBelowY: the top of the cards (and the label),
        // padded as the hull pads them, allowing for its curve.
        let drop = 0;
        if (so.keepBelowY !== null) {
          const bulge = paddingOf(c, depth) * 1.25;
          const topOf = (r) => Math.min((r.lab || labelRect).y0, ...r.rects.map((q) => q.y0)) + r.dy - bulge;
          if (topOf(res) < so.keepBelowY) {
            // The smallest turn either way that clears it, up to a quarter
            // turn; past that, the spiral as it was, moved down.
            let found = null;
            for (let step = 1; step <= 18 && !found; step++) {
              for (const s of [1, -1]) {
                const r = shifted(theta + s * step * (Math.PI / 36));
                if (topOf(r) >= so.keepBelowY) { found = r; break; }
              }
            }
            if (found) res = found;
            else drop = so.keepBelowY - topOf(res);
          }
        }
        const dx = res.dx, dy = res.dy + drop;
        res.pos.forEach((p, k) => { positions[k] = { x: p.x + dx, y: p.y + dy }; });
        res.rects.forEach((r) => placed.push({ x0: r.x0 + dx, y0: r.y0 + dy, x1: r.x1 + dx, y1: r.y1 + dy }));
        const lr = res.lab || labelRect;
        labelRect = { x0: lr.x0 + dx, y0: lr.y0 + dy, x1: lr.x1 + dx, y1: lr.y1 + dy };
        spiral = { ...res.sp, cx: res.sp.cx + dx, cy: res.sp.cy + dy };
        if (outerEnd) spiral = { ...spiral, anchorEnd: 'outer', openTowards: so.openTowards, drop };
      } else if (arrangement === 'ring') {
        // One ring per container, its label in the middle. The radius gives
        // every member a card's diagonal plus spacing of arc, and clears the
        // label.
        const diag = Math.max(...units.map((u) => Math.hypot(u.w, u.h)));
        const n = units.length;
        let R = Math.max(
          n > 1 ? (n * (diag + spacing)) / (2 * Math.PI) : 0,
          Math.hypot(lab.w, lab.h) / 2 + diag / 2 + gap,
        );
        const cy0 = 0;
        for (let guard = 0; guard < 400; guard++) {
          positions.length = 0;
          placed.length = 0;
          let ok = true;
          units.forEach((u, k) => {
            const t = -Math.PI / 2 + (k / n) * 2 * Math.PI;
            const p = { x: R * Math.cos(t), y: cy0 + R * Math.sin(t) };
            const rect = rectAt(p.x, p.y, u.w, u.h);
            if (!clear(rect)) ok = false;
            positions.push(p);
            placed.push(rect);
          });
          if (ok) break;
          R += 8;
        }
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
          nodes.set(u.id, { x: cx, y: cy, scale: u.scale });
        } else {
          // Place the child so its box is centred on the unit.
          const ox = cx - (u.sub.box.x0 + u.sub.box.x1) / 2;
          const oy = cy - (u.sub.box.y0 + u.sub.box.y1) / 2;
          for (const [id, p] of u.sub.nodes) nodes.set(id, { x: p.x + ox, y: p.y + oy, scale: p.scale });
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
      if (!outNodes.has(id)) outNodes.set(id, { root: rootId, x: p.x, y: p.y, scale: p.scale || 1 });
    }
    for (const [id, info] of res.containers) outContainers.set(id, { root: rootId, ...info });
  }
  return { roots, nodes: outNodes, containers: outContainers };
}

module.exports = {
  containerLayout, rectsOverlap, compareUnits, hangChain, hangOptions, hangRows, spiralOptions,
  containerLayoutOf, hullDrawn, closedPillScaleOf,
};

// Open acts never overlap. Pure: no D3, no DOM.
//
// Each act is a box in the world where it would rest (its hull's box when
// open, its pill's when closed). An open act whose box meets another act's
// box, with `gap` between them, is pushed along the way its spiral opens
// (openTowards: down, down-left or down-right) until it clears every other
// act. The box holds the hull with room to spare (containerLayout pads it
// for the hull's curve), so clear boxes mean clear hulls.
//
// The acts are taken in the order given; each open one is cleared against
// every other as they stand then, and a later one against the earlier ones
// where they were pushed to, so at the end no two meet. Closed acts, and
// acts marked fixed (a reader dragged them there), never move.
//
//   actsApart([{ id, box: { x0, y0, x1, y1 }, open, towards, fixed }], { gap })
//     -> Map id -> { dx, dy }, for each act that moved.

const TOWARDS = {
  down: [0, 1],
  'down-right': [Math.SQRT1_2, Math.SQRT1_2],
  'down-left': [-Math.SQRT1_2, Math.SQRT1_2],
};

function meet(a, b, gap) {
  return a.x0 < b.x1 + gap && b.x0 < a.x1 + gap && a.y0 < b.y1 + gap && b.y0 < a.y1 + gap;
}

const shifted = (r, dx, dy) => ({ x0: r.x0 + dx, y0: r.y0 + dy, x1: r.x1 + dx, y1: r.y1 + dy });

function actsApart(acts, { gap = 16 } = {}) {
  const boxes = acts.map((a) => ({ ...a, box: { ...a.box } }));
  const out = new Map();
  for (const a of boxes) {
    if (!a.open || a.fixed) continue;
    const [ux, uy] = TOWARDS[a.towards] || TOWARDS.down;
    const others = boxes.filter((b) => b !== a);
    const hit = (d) => {
      const r = shifted(a.box, ux * d, uy * d);
      return others.some((b) => meet(r, b.box, gap));
    };
    if (!hit(0)) continue;
    // Step along until clear, then find the edge of that step: the least
    // push that clears.
    const size = Math.max(a.box.x1 - a.box.x0, a.box.y1 - a.box.y0);
    const step = Math.max(1, size / 32);
    let d = 0;
    for (let guard = 0; guard < 4096 && hit(d); guard++) d += step;
    let lo = Math.max(0, d - step), hi = d;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (hit(mid)) lo = mid; else hi = mid;
    }
    const dx = ux * hi, dy = uy * hi;
    a.box = shifted(a.box, dx, dy);
    out.set(a.id, { dx, dy });
  }
  return out;
}

module.exports = { actsApart, boxesMeet: meet, TOWARDS };

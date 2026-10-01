// Open cards must not sit on top of each other. A stored arrangement, or a
// layout spaced for closed cards, can leave two open cards (which are larger)
// overlapping; separateOpen nudges them apart and touches nothing else.
//
// rects: [{ id, x, y, w, h }] centred boxes, the open cards only.
// Each overlapping pair moves apart along the axis where they overlap least,
// half each, until no pair overlaps (with `gap` between) or `maxRounds`
// passes. Deterministic: the same input always gives the same result.
// Returns Map id -> { x, y } for the cards that moved.

function separateOpen(rects, { gap = 12, maxRounds = 200 } = {}) {
  const boxes = rects.map((r) => ({ ...r }));
  const moved = new Map();
  for (let round = 0; round < maxRounds; round++) {
    let any = false;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        const ox = (a.w + b.w) / 2 + gap - Math.abs(a.x - b.x);
        const oy = (a.h + b.h) / 2 + gap - Math.abs(a.y - b.y);
        if (ox <= 0 || oy <= 0) continue;
        any = true;
        if (ox < oy) {
          const s = a.x < b.x || (a.x === b.x && i < j) ? -1 : 1;
          a.x += (s * ox) / 2; b.x -= (s * ox) / 2;
        } else {
          const s = a.y < b.y || (a.y === b.y && i < j) ? -1 : 1;
          a.y += (s * oy) / 2; b.y -= (s * oy) / 2;
        }
        moved.set(a.id, a); moved.set(b.id, b);
      }
    }
    if (!any) break;
  }
  const out = new Map();
  for (const [id, b] of moved) out.set(id, { x: b.x, y: b.y });
  return out;
}

function overlappingPairs(rects, gap = 0) {
  let n = 0;
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      if (Math.abs(a.x - b.x) < (a.w + b.w) / 2 + gap && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + gap) n++;
    }
  }
  return n;
}

module.exports = { separateOpen, overlappingPairs };

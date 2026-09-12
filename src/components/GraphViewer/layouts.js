// Layouts — pure position assignment, no D3, no DOM.
//
// A layout answers one question: given these nodes, where does each one go?
// Keeping that separate from the renderer is the Layer 3 / Layer 4 split in
// DECOMPOSITION, and it has an immediate practical payoff — a layout is a pure
// function of its input, so it can be tested without a browser.
//
// Every layout returns { id: {x, y} } in graph space. The renderer decides how
// to get there; whether that is a jump or a transition is not the layout's
// business.

const DEFAULT_CARD = { width: 180, height: 140 };

function articlesAndTags(nodes) {
  return {
    articles: nodes.filter((n) => n.type === 'article'),
    tags: nodes.filter((n) => n.type !== 'article'),
  };
}

/**
 * Radial. Articles ride the rim of an ellipse; tags gather in the middle.
 *
 * Nodes are spaced by arc length rather than by angle. Equal angles on an
 * ellipse do not give equal spacing — cards bunch where the curve is tightest
 * and gap where it is flattest, which looks like a mistake rather than a shape.
 */
function radialLayout(nodes, opts = {}) {
  const { cardW = DEFAULT_CARD.width, cardH = DEFAULT_CARD.height, gap = 28, flatten = 0.62 } = opts;
  const { articles, tags } = articlesAndTags(nodes);
  const out = {};
  if (!articles.length) return out;

  // Sort by source, then date, so a feed arrives as a contiguous arc rather
  // than scattered around the ring.
  const ordered = [...articles].sort((a, b) => {
    const sa = (a._source && a._source.title) || '';
    const sb = (b._source && b._source.title) || '';
    if (sa !== sb) return sa < sb ? -1 : 1;
    return String(a.date || '').localeCompare(String(b.date || ''));
  });

  // Sizing the ring from arc length under-spaces it: neighbours sit a chord
  // apart, and a chord is shorter than the arc it subtends — more so the
  // tighter the curve, which is exactly where an ellipse is tightest. So size
  // from arc as a first guess, then measure the real chord and grow until it
  // clears a card. Converges in a couple of passes and stays deterministic.
  const needed = ordered.length * (cardW + gap);
  let rx = Math.max(needed / (2 * Math.PI), cardW * 2);
  let ry = Math.max(rx * flatten, cardH * 2);

  // Arc-length table around the ellipse.
  const STEPS = 2048;
  const cum = [0];
  for (let i = 1; i <= STEPS; i++) {
    const t0 = ((i - 1) / STEPS) * 2 * Math.PI;
    const t1 = (i / STEPS) * 2 * Math.PI;
    const dx = rx * (Math.cos(t1) - Math.cos(t0));
    const dy = ry * (Math.sin(t1) - Math.sin(t0));
    cum.push(cum[i - 1] + Math.hypot(dx, dy));
  }
  const total = cum[STEPS];

  const angleAtArc = (target) => {
    let lo = 0;
    let hi = STEPS;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return (lo / STEPS) * 2 * Math.PI;
  };

  const thetas = ordered.map((_, i) => angleAtArc((i / ordered.length) * total));
  const place = () => {
    ordered.forEach((n, i) => {
      out[n.id] = { x: rx * Math.cos(thetas[i]), y: ry * Math.sin(thetas[i]) };
    });
  };
  place();

  const minChord = () => {
    let m = Infinity;
    for (let i = 0; i < ordered.length; i++) {
      const a = out[ordered[i].id];
      const b = out[ordered[(i + 1) % ordered.length].id];
      m = Math.min(m, Math.hypot(a.x - b.x, a.y - b.y));
    }
    return m;
  };

  const required = cardW + gap * 0.5;
  for (let pass = 0; pass < 6 && ordered.length > 1; pass++) {
    const m = minChord();
    if (m >= required) break;
    const grow = (required / Math.max(m, 1)) * 1.01;
    rx *= grow;
    ry *= grow;
    place();
  }

  // Tags fill the interior on a phyllotaxis spiral — even density, no rings,
  // no preferred direction.
  const inner = Math.min(rx, ry) * 0.66;
  const golden = Math.PI * (3 - Math.sqrt(5));
  tags.forEach((n, i) => {
    const f = tags.length === 1 ? 0 : Math.sqrt(i / (tags.length - 1));
    const r = f * inner;
    const theta = i * golden;
    out[n.id] = { x: r * Math.cos(theta), y: r * Math.sin(theta) * flatten };
  });

  return out;
}

/**
 * Timeline. One real axis spent on time, which is the cheapest legibility a
 * corpus of this shape can buy: your own writing becomes a sparse spine across
 * years and a subscribed feed becomes a dense bar at today.
 *
 * Undated items are not guessed at. They go in their own block to the left of
 * the axis, visibly outside it.
 */
function timelineLayout(nodes, opts = {}) {
  const { cardW = DEFAULT_CARD.width, cardH = DEFAULT_CARD.height, gap = 24, span = 4200 } = opts;
  const { articles, tags } = articlesAndTags(nodes);
  const out = {};
  if (!articles.length) return out;

  const timeOf = (n) => {
    const t = Date.parse(n.date || '');
    return Number.isNaN(t) ? null : t;
  };

  const dated = articles.filter((n) => timeOf(n) !== null);
  const undated = articles.filter((n) => timeOf(n) === null);

  // Time does not get a linear axis, because this corpus is not linearly
  // distributed in time: years of writing sit alongside eighty feed items from
  // the last two days. On a true scale the feed collapses into a single column
  // and everything older smears into the left edge — accurate, unreadable.
  //
  // Gaps are compressed by a fourth root instead. A year still reads as much
  // wider than an hour, about ten times so rather than nine thousand, so the
  // shape of the corpus survives without any part of it being crushed. Order
  // is exact; only the spacing is compressed.
  const COMPRESSION = 0.25;
  const MIN_ADVANCE = cardW * 0.12;

  const sortedTimes = [...new Set(dated.map(timeOf))].sort((a, b) => a - b);
  const xOfTime = new Map();
  let cursor = 0;
  sortedTimes.forEach((t, i) => {
    if (i > 0) {
      const gap = t - sortedTimes[i - 1];
      cursor += Math.max(MIN_ADVANCE, Math.pow(gap, COMPRESSION));
    }
    xOfTime.set(t, cursor);
  });
  const rawSpan = Math.max(cursor, 1);

  // Greedy lane packing: put each card in the topmost lane whose last card
  // has already ended. Cards never overlap, and a busy day grows downward
  // instead of sideways, which is the shape a timeline should have.
  const laneEnds = [];
  const place = (n, x) => {
    const left = x - cardW / 2;
    let lane = laneEnds.findIndex((end) => left > end + gap);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(-Infinity); }
    laneEnds[lane] = x + cardW / 2;
    out[n.id] = { x, y: lane * (cardH + gap) };
  };

  [...dated]
    .sort((a, b) => timeOf(a) - timeOf(b))
    .forEach((n) => place(n, (xOfTime.get(timeOf(n)) / rawSpan) * span));

  // Undated, to the left of everything dated and clearly apart from it.
  const undatedRight = -span * 0.12;
  undated.forEach((n, i) => {
    const col = Math.floor(i / 4);
    const row = i % 4;
    out[n.id] = {
      x: undatedRight - col * (cardW + gap) - cardW,
      y: row * (cardH + gap),
    };
  });

  // Tags in a band above the axis. They have no date; pretending otherwise
  // would put them somewhere that means something when it does not.
  const bandY = -(cardH * 2.2);
  let tx = 0;
  let trow = 0;
  tags.forEach((n) => {
    const w = (n._r ? n._r * 1.6 : 90) + gap;
    if (tx + w > span) { tx = 0; trow++; }
    out[n.id] = { x: tx, y: bandY - trow * (cardH * 0.55) };
    tx += w;
  });

  return out;
}

const LAYOUTS = {
  force: null,        // the simulation owns this one; see GraphViewer
  radial: radialLayout,
  timeline: timelineLayout,
};

function layoutNames() {
  return Object.keys(LAYOUTS);
}

function computeLayout(name, nodes, opts) {
  const fn = LAYOUTS[name];
  return fn ? fn(nodes, opts) : null;
}

module.exports = { radialLayout, timelineLayout, computeLayout, layoutNames, LAYOUTS };

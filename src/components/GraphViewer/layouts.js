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
  const {
    cardW = DEFAULT_CARD.width,
    cardH = DEFAULT_CARD.height,
    gap = 28,
    flatten = 0.62,
    maxRings = 4,
  } = opts;
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

  // Neighbours sit a chord apart and a chord is shorter than the arc it
  // subtends, so the arc budget carries a margin over the card width.
  const arcNeed = (cardW + gap) * 1.14;
  // Flattening squashes the rings together vertically: two rings whose radii
  // differ by R are only R * flatten apart at the top of the figure, which is
  // exactly where they are closest. Budget in that direction or the rings
  // overlap where they touch, however generous the number looks.
  const ringGap = (cardH + gap) / flatten;

  const perimeter = (rx) => {
    const ry = rx * flatten;
    // Ramanujan's approximation; exact enough to budget with.
    const h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
    return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  };

  const ringCount = Math.max(1, Math.min(maxRings, Math.ceil(ordered.length / 26)));
  const radiiFor = (inner) =>
    [...Array(ringCount)].map((_, i) => inner + i * ringGap);
  const capacity = (inner) =>
    radiiFor(inner).reduce((sum, rx) => sum + Math.floor(perimeter(rx) / arcNeed), 0);

  // Smallest innermost radius whose rings hold the corpus. Concentric rings
  // pack the same number of pieces into a far smaller figure than one giant
  // circle, which is what makes the whole thing read larger on screen — the
  // fit has less empty middle to spend the viewport on — and leaves room
  // between rings for the edges to be followed.
  let lo = cardW;
  let hi = cardW;
  while (capacity(hi) < ordered.length && hi < 1e6) hi *= 1.6;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (capacity(mid) >= ordered.length) hi = mid;
    else lo = mid;
  }
  const innerRx = hi;
  const radii = radiiFor(innerRx);

  // Share out by circumference, so density is even rather than the inner
  // rings being crowded and the outer ones sparse.
  const perims = radii.map(perimeter);
  const totalPerim = perims.reduce((x, y) => x + y, 0);
  const counts = perims.map((p) => Math.floor((p / totalPerim) * ordered.length));
  let assigned = counts.reduce((x, y) => x + y, 0);
  for (let i = counts.length - 1; assigned < ordered.length; i = (i - 1 + counts.length) % counts.length) {
    counts[i]++;
    assigned++;
  }

  let cursor = 0;
  radii.forEach((rx, ringIndex) => {
    const ry = rx * flatten;
    const members = ordered.slice(cursor, cursor + counts[ringIndex]);
    cursor += counts[ringIndex];
    if (!members.length) return;

    // Equal spacing by arc length. Equal angles on an ellipse bunch cards
    // where the curve is tightest and gap where it is flattest, which reads as
    // a mistake rather than as a shape.
    const STEPS = 1024;
    const cum = [0];
    for (let i = 1; i <= STEPS; i++) {
      const t0 = ((i - 1) / STEPS) * 2 * Math.PI;
      const t1 = (i / STEPS) * 2 * Math.PI;
      cum.push(cum[i - 1] + Math.hypot(rx * (Math.cos(t1) - Math.cos(t0)), ry * (Math.sin(t1) - Math.sin(t0))));
    }
    const total = cum[STEPS];
    const angleAtArc = (target) => {
      let lo2 = 0;
      let hi2 = STEPS;
      while (lo2 < hi2) {
        const mid = (lo2 + hi2) >> 1;
        if (cum[mid] < target) lo2 = mid + 1;
        else hi2 = mid;
      }
      return (lo2 / STEPS) * 2 * Math.PI;
    };

    // Offset alternate rings by half a step so cards do not line up radially,
    // which is what leaves a clear diagonal for an edge to travel along.
    const offset = (ringIndex % 2) * (total / members.length) * 0.5;
    members.forEach((n, i) => {
      const theta = angleAtArc(((i / members.length) * total + offset) % total);
      out[n.id] = { x: rx * Math.cos(theta), y: ry * Math.sin(theta) };
    });
  });

  // Tags fill the interior on a phyllotaxis spiral — even density, no rings,
  // no preferred direction — kept clear of the innermost ring of cards.
  const innerRoom = Math.max(innerRx - cardW * 0.75, cardW * 0.5);
  const golden = Math.PI * (3 - Math.sqrt(5));
  tags.forEach((n, i) => {
    const f = tags.length === 1 ? 0 : Math.sqrt(i / (tags.length - 1));
    const r = f * innerRoom;
    const theta = i * golden;
    out[n.id] = { x: r * Math.cos(theta), y: r * Math.sin(theta) * flatten };
  });

  return out;
}

/**
 * Map times onto a compressed axis, shared by the timeline layout and the time
 * axis so the two can never disagree about where a date sits.
 *
 * Gaps are compressed by a fourth root. This corpus is not linearly
 * distributed in time — years of writing alongside eighty feed items from the
 * last two days — and on a true scale the feed collapses into a single column
 * while everything older smears into one edge. A year still reads as much
 * wider than an hour, about ten times so rather than nine thousand. Order is
 * exact; only spacing is compressed.
 *
 * @returns {{ position: (t:number)=>number, times: number[], span: number }}
 */
function compressedTimeScale(times, { span = 4200, minAdvance = 22, compression = 0.25 } = {}) {
  const sorted = [...new Set(times)].sort((a, b) => a - b);
  const raw = new Map();
  let cursor = 0;
  sorted.forEach((t, i) => {
    if (i > 0) cursor += Math.max(minAdvance, Math.pow(t - sorted[i - 1], compression));
    raw.set(t, cursor);
  });
  const rawSpan = Math.max(cursor, 1);

  // Interpolate for a time that is not one of the corpus's own, which is what
  // axis ticks are: round dates that no piece happens to sit on.
  const position = (t) => {
    if (raw.has(t)) return (raw.get(t) / rawSpan) * span;
    if (!sorted.length) return 0;
    if (t <= sorted[0]) return 0;
    if (t >= sorted[sorted.length - 1]) return span;
    let lo = 0;
    let hi = sorted.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] <= t) lo = mid;
      else hi = mid;
    }
    const a = sorted[lo];
    const b = sorted[hi];
    const f = (t - a) / Math.max(b - a, 1);
    const p = raw.get(a) + (raw.get(b) - raw.get(a)) * f;
    return (p / rawSpan) * span;
  };

  return { position, times: sorted, span };
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

/**
 * Is this set of positions a real arrangement, or a heap?
 *
 * The simulation runs on requestAnimationFrame, so a page that is never looked
 * at never lays out, and its nodes sit in d3's initial spiral — a couple of
 * hundred pixels across whatever the corpus size. Persisting that heap and
 * restoring it later breaks the graph permanently: it looks like an
 * arrangement, so the next load skips both the settle and the fit.
 *
 * Area is the test. A layout needs room for its nodes; anything occupying a
 * small fraction of that is not one, whatever produced it. Deliberately
 * generous, because the cost of rejecting a real arrangement is one relayout
 * and the cost of accepting a heap is a permanently broken graph.
 *
 * @param {Array<{x:number,y:number}>} positions
 * @param {{width:number,height:number}} card
 * @param {number} [fraction] share of the needed area below which it is a heap
 */
function layoutIsDegenerate(positions, card, fraction = 0.3) {
  const pts = (positions || []).filter(
    (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y),
  );
  if (pts.length <= 8) return false;   // too few to judge; leave it alone

  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
  const needed = pts.length * card.width * card.height;
  return area < needed * fraction;
}

/**
 * The time axis: a spine with pieces hanging off their own date.
 *
 * Different from the timeline layout, and complementary to it. The layout
 * spends position on time, so it answers "when" at the cost of every other
 * arrangement. The axis leaves position alone and draws time as a relation
 * instead — which means it composes with the cluster or the ring, and you can
 * read topic and chronology at the same time.
 *
 * Direction is a setting rather than an assumption. Left-to-right is one
 * culture's reading order, not time's; right-to-left and both verticals are
 * as valid, and a person who reads Arabic or traditional Japanese should not
 * have to read this backwards.
 *
 * @param {Array} nodes
 * @param {Object} axis
 * @param {'ltr'|'rtl'|'ttb'|'btt'} axis.orientation
 * @param {{x:number,y:number}} axis.origin  where the axis begins
 * @param {number} axis.length
 * @returns {{from, to, ticks, anchors, connectors}|null}
 */
function timeAxisGeometry(nodes, axis = {}) {
  const { orientation = 'ltr', origin = { x: 0, y: 0 }, length = 4200 } = axis;

  const timeOf = (n) => {
    const t = Date.parse(n.date || '');
    return Number.isNaN(t) ? null : t;
  };
  const dated = (nodes || []).filter((n) => n.type === 'article' && timeOf(n) !== null);
  if (dated.length < 2) return null;

  const scale = compressedTimeScale(dated.map(timeOf), { span: length });

  // One vector for the whole thing. Everything downstream — the spine, the
  // ticks, where a piece attaches — is this vector times a distance, so a new
  // orientation is four numbers rather than four code paths.
  const dir = {
    ltr: { x: 1, y: 0 },
    rtl: { x: -1, y: 0 },
    ttb: { x: 0, y: 1 },
    btt: { x: 0, y: -1 },
  }[orientation] || { x: 1, y: 0 };

  const along = (d) => ({ x: origin.x + dir.x * d, y: origin.y + dir.y * d });

  const anchors = {};
  dated.forEach((n) => { anchors[n.id] = along(scale.position(timeOf(n))); });

  // Ticks on round dates rather than on the corpus's own timestamps, so the
  // axis reads as a calendar and not as a list of when things happened to be
  // published. Years while the span is long, months once it is not.
  const first = scale.times[0];
  const last = scale.times[scale.times.length - 1];
  const YEAR = 365.25 * 24 * 3600 * 1000;
  const byMonth = (last - first) < YEAR * 2;

  const ticks = [];
  const cursor = new Date(first);
  cursor.setUTCDate(1);
  cursor.setUTCHours(0, 0, 0, 0);
  if (!byMonth) cursor.setUTCMonth(0);
  for (let guard = 0; guard < 400; guard++) {
    const t = cursor.getTime();
    if (t > last) break;
    if (t >= first) {
      ticks.push({
        t,
        label: byMonth
          ? cursor.toLocaleDateString('en', { month: 'short', year: '2-digit', timeZone: 'UTC' })
          : String(cursor.getUTCFullYear()),
        ...along(scale.position(t)),
      });
    }
    if (byMonth) cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    else cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
  }

  return {
    orientation,
    vertical: dir.x === 0,
    from: along(0),
    to: along(length),
    ticks,
    anchors,
  };
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

module.exports = {
  radialLayout, timelineLayout, computeLayout, layoutNames,
  layoutIsDegenerate, timeAxisGeometry, compressedTimeScale, LAYOUTS,
};

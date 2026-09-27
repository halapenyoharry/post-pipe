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

  // Plain min/max is fooled by a couple of legitimately far-flung nodes —
  // this corpus has plenty of orphans (no edges at all), which charge
  // repulsion flings away from the mass with nothing to pull them back.
  // One such node sitting far from an otherwise crushed-to-a-point pile
  // makes the bounding box look roomy even though the pile itself never
  // settled — seen for real on a phone whose tab was throttled/backgrounded
  // mid-settle, which persisted the pile because this check passed it.
  // Measuring the middle 80% of each axis instead of the full extent keeps
  // a few real outliers from masking a collapsed core.
  const trimmedSpan = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const lo = sorted[Math.floor(sorted.length * 0.1)];
    const hi = sorted[Math.ceil(sorted.length * 0.9) - 1];
    return hi - lo;
  };

  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const area = trimmedSpan(xs) * trimmedSpan(ys);
  const needed = pts.length * 0.8 * card.width * card.height;
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

/**
 * parseLooseDate(str, side) where side is 'start' or 'end':
 * strip a trailing ?; split an optional THH:MM.
 * Year all X -> return null.
 * Month XX -> January (start) / December (end).
 * Day XX -> 1st (start) / last day of that month (end).
 * Without a time: 00:00 (start) / 23:59 (end).
 * Return UTC milliseconds.
 */
function parseLooseDate(str, side = 'start') {
  if (!str || typeof str !== 'string') return null;
  let s = str.trim();
  if (s.endsWith('?')) s = s.slice(0, -1).trim();
  if (!s) return null;

  const [datePart, timePart] = s.split('T');
  const dParts = datePart.split('-');
  const rawYear = dParts[0];
  const rawMonth = dParts[1];
  const rawDay = dParts[2];

  if (!rawYear || /^X+$/i.test(rawYear)) return null;
  const year = parseInt(rawYear, 10);
  if (!Number.isFinite(year)) return null;

  let month; // 1-12
  if (!rawMonth || /^X+$/i.test(rawMonth)) {
    month = side === 'start' ? 1 : 12;
  } else {
    month = parseInt(rawMonth, 10);
    if (!Number.isFinite(month)) return null;
  }

  const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();

  let day;
  if (!rawDay || /^X+$/i.test(rawDay)) {
    day = side === 'start' ? 1 : daysInMonth(year, month);
  } else {
    day = parseInt(rawDay, 10);
    if (!Number.isFinite(day)) return null;
  }

  let hours = 0;
  let minutes = 0;
  if (timePart) {
    const tParts = timePart.split(':');
    hours = parseInt(tParts[0], 10) || 0;
    minutes = parseInt(tParts[1], 10) || 0;
  } else {
    if (side === 'start') {
      hours = 0;
      minutes = 0;
    } else {
      hours = 23;
      minutes = 59;
    }
  }

  return Date.UTC(year, month - 1, day, hours, minutes, 0, 0);
}

/**
 * dimensionIntervals(nodes, dimension)
 * returning a Map from node id -> array of { start, end } (numbers; end may equal start).
 * Only nodes with type === 'article' and at least one interval appear.
 */
function dimensionIntervals(nodes, dimension = 'time') {
  const map = new Map();
  const articles = (nodes || []).filter((n) => n && n.type === 'article');

  if (dimension === 'time') {
    for (const n of articles) {
      if (n.date) {
        const t = Date.parse(n.date);
        if (Number.isFinite(t)) {
          map.set(n.id, [{ start: t, end: t }]);
        }
      }
    }
  } else if (dimension === 'commits') {
    for (const n of articles) {
      if (Array.isArray(n.commit_times)) {
        const intervals = [];
        for (const c of n.commit_times) {
          const t = Date.parse(c);
          if (Number.isFinite(t)) {
            intervals.push({ start: t, end: t });
          }
        }
        if (intervals.length > 0) {
          map.set(n.id, intervals);
        }
      }
    }
  } else if (dimension === 'chronology') {
    for (const n of articles) {
      const cal = n.timeline && n.timeline.calendar_time;
      if (!cal) continue;

      if (cal.span) {
        const startStr = cal.span.start;
        const endStr = cal.span.end;
        if (!startStr) continue;
        const start = parseLooseDate(startStr, 'start');
        if (start === null) continue;
        let end;
        if (endStr) {
          end = parseLooseDate(endStr, 'end');
          if (end === null) end = parseLooseDate(startStr, 'end');
        } else {
          end = parseLooseDate(startStr, 'end');
        }
        if (end === null) end = start;
        map.set(n.id, [{ start, end }]);
      } else if (cal.date) {
        const start = parseLooseDate(cal.date, 'start');
        if (start === null) continue;
        const end = parseLooseDate(cal.date, 'end') ?? start;
        map.set(n.id, [{ start, end }]);
      }
    }
  } else if (dimension === 'narrative') {
    // Determine maxPart per series for numeric series_part
    const seriesMaxPart = new Map();
    for (const n of articles) {
      if (n.series && typeof n.series_part === 'number') {
        const cur = seriesMaxPart.get(n.series) || 0;
        if (n.series_part > cur) seriesMaxPart.set(n.series, n.series_part);
      }
    }

    for (const n of articles) {
      let value = null;
      let isSeries = false;
      const narrPos = n.timeline && n.timeline.narrative_position;
      const narrStr = narrPos !== undefined && narrPos !== null ? String(narrPos).trim() : '';
      const match = narrStr.match(/^(\d+)/);

      if (match) {
        const digits = match[1];
        const digitCount = digits.length;
        const denom = Math.pow(10, digitCount) - 1;
        value = denom === 0 ? 0 : parseInt(digits, 10) / denom;
      } else if (typeof n.series_part === 'number') {
        isSeries = true;
        const maxPart = seriesMaxPart.get(n.series) || 1;
        value = maxPart === 1 ? 0 : (n.series_part - 1) / (maxPart - 1);
      }

      if (value !== null && Number.isFinite(value)) {
        const item = { start: value, end: value };
        if (isSeries) item._series_part = n.series_part;
        map.set(n.id, [item]);
      }
    }
  }

  return map;
}

// Helpers for date bucketing in UTC
function getBucketKey(timeMs, unit) {
  const d = new Date(timeMs);
  if (unit === 'day') {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  if (unit === 'week') {
    // ISO week starting Monday
    const day = d.getUTCDay(); // 0 is Sunday, 1 is Monday, ...
    const diff = (day + 6) % 7; // days since Monday
    const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff));
    return Date.UTC(mon.getUTCFullYear(), mon.getUTCMonth(), mon.getUTCDate());
  }
  if (unit === 'month') {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
  }
  if (unit === 'year') {
    return Date.UTC(d.getUTCFullYear(), 0, 1);
  }
  return timeMs;
}

function nextBucketKey(bucketKey, unit) {
  const d = new Date(bucketKey);
  if (unit === 'day') {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
  }
  if (unit === 'week') {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 7);
  }
  if (unit === 'month') {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
  }
  if (unit === 'year') {
    return Date.UTC(d.getUTCFullYear() + 1, 0, 1);
  }
  return bucketKey + 1;
}

function getBucketsForInterval(startMs, endMs, unit) {
  const s = Math.min(startMs, endMs);
  const e = Math.max(startMs, endMs);
  const startBucket = getBucketKey(s, unit);
  const endBucket = getBucketKey(e, unit);
  const buckets = [];
  let cur = startBucket;
  while (cur <= endBucket) {
    buckets.push(cur);
    cur = nextBucketKey(cur, unit);
  }
  return buckets;
}

function formatBucketTick(timeMs, unit) {
  const d = new Date(timeMs);
  if (unit === 'day') {
    // day -> Jun 3
    const m = d.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' });
    const day = d.getUTCDate();
    return `${m} ${day}`;
  }
  if (unit === 'week') {
    // week -> wk Jun 1
    const m = d.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' });
    const day = d.getUTCDate();
    return `wk ${m} ${day}`;
  }
  if (unit === 'month') {
    // month -> Jun '30
    const m = d.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' });
    const yr = String(d.getUTCFullYear()).slice(-2);
    return `${m} '${yr}`;
  }
  if (unit === 'year') {
    // year -> 2030
    return String(d.getUTCFullYear());
  }
  return String(d.getUTCFullYear());
}

/**
 * dimensionAxisGeometry(nodes, axis)
 */
function dimensionAxisGeometry(nodes, axis = {}) {
  const dimension = axis.dimension || 'time';
  const {
    orientation = 'ltr',
    origin = { x: 0, y: 0 },
    length = 4200,
    granularity = 'auto',
  } = axis;

  const dir = {
    ltr: { x: 1, y: 0 },
    rtl: { x: -1, y: 0 },
    ttb: { x: 0, y: 1 },
    btt: { x: 0, y: -1 },
  }[orientation] || { x: 1, y: 0 };

  const along = (d) => ({ x: origin.x + dir.x * d, y: origin.y + dir.y * d });

  if (dimension === 'time') {
    const singleGeo = timeAxisGeometry(nodes, axis);
    if (!singleGeo) return null;
    const wrappedAnchors = {};
    for (const [id, pt] of Object.entries(singleGeo.anchors)) {
      wrappedAnchors[id] = [pt];
    }
    return {
      orientation: singleGeo.orientation,
      vertical: singleGeo.vertical,
      from: singleGeo.from,
      to: singleGeo.to,
      ticks: singleGeo.ticks,
      anchors: wrappedAnchors,
    };
  }

  const intervalsMap = dimensionIntervals(nodes, dimension);
  if (intervalsMap.size < 2) return null;

  if (dimension === 'narrative') {
    // Linear positions, position = value * length.
    // Ticks at every distinct value, labelled with the node's series_part when it came from series_part,
    // otherwise the value as a percentage (42%).
    const anchors = {};
    const ticksMap = new Map(); // value -> label

    for (const [id, intervals] of intervalsMap.entries()) {
      const nodeAnchors = [];
      for (const inv of intervals) {
        const val = inv.start;
        const pos = val * length;
        nodeAnchors.push(along(pos));

        if (!ticksMap.has(val)) {
          if (inv._series_part !== undefined) {
            ticksMap.set(val, String(inv._series_part));
          } else {
            const pct = Math.round(val * 100);
            ticksMap.set(val, `${pct}%`);
          }
        }
      }
      if (nodeAnchors.length > 0) {
        anchors[id] = nodeAnchors;
      }
    }

    if (Object.keys(anchors).length < 2) return null;

    const ticks = [...ticksMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([val, label]) => ({
        t: val,
        label,
        ...along(val * length),
      }));

    return {
      orientation,
      vertical: dir.x === 0,
      from: along(0),
      to: along(length),
      ticks,
      anchors,
    };
  }

  // Date dimensions: 'commits' and 'chronology'
  const units = ['day', 'week', 'month', 'year'];

  function evaluateUnit(unit) {
    const nodeBucketsMap = new Map();
    const allBuckets = new Set();

    for (const [id, intervals] of intervalsMap.entries()) {
      const bucketsForNode = new Set();
      for (const inv of intervals) {
        const bList = getBucketsForInterval(inv.start, inv.end, unit);
        for (const b of bList) {
          bucketsForNode.add(b);
        }
      }
      const sorted = [...bucketsForNode].sort((a, b) => a - b);
      const finalBuckets = sorted.length > 12 ? [sorted[0], sorted[sorted.length - 1]] : sorted;
      nodeBucketsMap.set(id, finalBuckets);
      for (const b of finalBuckets) allBuckets.add(b);
    }

    return { unit, nodeBucketsMap, allBuckets };
  }

  let chosenUnit = granularity;
  let evaluation;

  if (granularity === 'auto') {
    for (const u of units) {
      const ev = evaluateUnit(u);
      if (ev.allBuckets.size <= 60) {
        chosenUnit = u;
        evaluation = ev;
        break;
      }
    }
    if (!evaluation) {
      chosenUnit = 'year';
      evaluation = evaluateUnit('year');
    }
  } else {
    evaluation = evaluateUnit(granularity);
  }

  const { nodeBucketsMap, allBuckets } = evaluation;
  const sortedBucketKeys = [...allBuckets].sort((a, b) => a - b);
  if (sortedBucketKeys.length === 0) return null;

  const scale = compressedTimeScale(sortedBucketKeys, { span: length });

  const anchors = {};
  for (const [id, buckets] of nodeBucketsMap.entries()) {
    if (buckets.length > 0) {
      anchors[id] = buckets.map((b) => along(scale.position(b)));
    }
  }

  if (Object.keys(anchors).length < 2) return null;

  const ticks = sortedBucketKeys.map((b) => ({
    t: b,
    label: formatBucketTick(b, chosenUnit),
    ...along(scale.position(b)),
  }));

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
  layoutIsDegenerate, timeAxisGeometry, dimensionAxisGeometry,
  dimensionIntervals, parseLooseDate, compressedTimeScale, LAYOUTS,
};

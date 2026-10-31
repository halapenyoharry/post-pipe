// The source coherence ratio: the panel's slider hides a discovered tag's
// edges under its value, as a build at that bar would not have made them.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  PREF, DEFAULT_BAR, ratioOf, ratioRange, clampRatio, ratioShows, shownAt, pairKey, ratioText,
} = require('../src/lib/sourceRatio');

const tagEdge = (item, tag, ratio, params) => ({
  source: item,
  target: `tag:${tag}`,
  layer: 'tag',
  attrs: {
    concept: `c_${tag}`, weight: 0.4, origin: ratio === undefined ? 'explicit' : 'discovered',
    ...(ratio === undefined ? {} : { sourceRatio: ratio }),
    ...(params ? { wasGeneratedBy: { activity: 'discover', parameters: params } } : {}),
  },
});

test('the preference has a plain key, and the default bar is rosetta-tagz\'s', () => {
  assert.strictEqual(PREF, 'minSourceRatio');
  assert.strictEqual(DEFAULT_BAR, 1.6);
});

test('a ratio is a finite number, nothing else', () => {
  assert.strictEqual(ratioOf(2.964), 2.964);
  assert.strictEqual(ratioOf(0), 0);
  for (const v of [undefined, null, '2.9', NaN, Infinity, {}]) assert.strictEqual(ratioOf(v), null);
});

test('no ratio in the feed: nothing to offer and nothing filtered', () => {
  const feed = { edges: [tagEdge('i1', 'ai'), { source: 'tag:a', target: 'tag:b', layer: 'related', attrs: { weight: 1 } }] };
  const range = ratioRange(feed);
  assert.strictEqual(range.has, false);
  assert.strictEqual(clampRatio(2, range), null);
  assert.strictEqual(clampRatio(null, range), null);
  assert.strictEqual(ratioRange(null).has, false);
});

test('the range: from the floor the build recorded, at least 1.0, to the largest ratio in tenths rounded down; the bar the build\'s', () => {
  const feed = {
    edges: [
      tagEdge('i1', 'cancer', 2.964, { sourceCoherenceRatio: 1.6 }),
      tagEdge('i2', 'instead', 1.008, { sourceCoherenceRatio: 1.6, sourceRatioFloor: 1 }),
      tagEdge('i3', 'blood pressure', 5.734, { sourceCoherenceRatio: 1.6 }),
      tagEdge('i4', 'ai'),
    ],
  };
  assert.deepStrictEqual(ratioRange(feed), { has: true, lo: 1, hi: 5.7, bar: 1.6 });
});

test('without a recorded floor the lowest ratio sets the bottom, never under 1.0 nor above the bar', () => {
  assert.deepStrictEqual(ratioRange({ edges: [tagEdge('i1', 'a', 1.234), tagEdge('i2', 'b', 2.5)] }), { has: true, lo: 1.2, hi: 2.5, bar: 1.6 });
  assert.deepStrictEqual(ratioRange({ edges: [tagEdge('i1', 'a', 0.7), tagEdge('i2', 'b', 2.5)] }).lo, 1, 'never under 1.0');
  assert.deepStrictEqual(ratioRange({ edges: [tagEdge('i1', 'a', 2.1), tagEdge('i2', 'b', 3.3)] }).lo, 1.6, 'never above the bar, so the default is on the slider');
  assert.deepStrictEqual(ratioRange({ edges: [tagEdge('i1', 'a', 1.2), tagEdge('i2', 'b', 1.4)] }).hi, 1.6, 'the top reaches the bar');
  assert.strictEqual(ratioRange({ edges: [tagEdge('i1', 'a', 2.5, { sourceCoherenceRatio: 2 })] }).bar, 2, 'a build with another bar says so');
});

test('the value in force: the build\'s bar for nothing chosen, else the choice in tenths within the range', () => {
  const range = { has: true, lo: 1, hi: 5.7, bar: 1.6 };
  assert.strictEqual(clampRatio(null, range), 1.6);
  assert.strictEqual(clampRatio(undefined, range), 1.6);
  assert.strictEqual(clampRatio('', range), 1.6);
  assert.strictEqual(clampRatio('abc', range), 1.6);
  assert.strictEqual(clampRatio(2.04, range), 2);
  assert.strictEqual(clampRatio('1.25', range), 1.3);
  assert.strictEqual(clampRatio(0.4, range), 1);
  assert.strictEqual(clampRatio(9, range), 5.7);
  assert.strictEqual(clampRatio(1.1 + 0.2, range), 1.3, 'no float noise');
});

test('an attachment shows with no ratio, or one at or above the value', () => {
  assert.ok(ratioShows(null, 1.6));
  assert.ok(ratioShows(undefined, 1.6));
  assert.ok(ratioShows(1.6, 1.6), 'the bar itself is in');
  assert.ok(ratioShows(2.964, 1.6));
  assert.ok(!ratioShows(1.523, 1.6));
  assert.ok(ratioShows(1.008, 1));
  assert.ok(ratioShows(0.5, null), 'no value, no filtering');
});

test('which attachments show: a pair needs one, a tag or bubble with none is hidden', () => {
  const entries = [
    { piece: 'p1', bubble: 'tag:cancer', tag: 'tag:cancer', ratio: 2.964 },
    { piece: 'p2', bubble: 'tag:instead', tag: 'tag:instead', ratio: 1.008 },
    { piece: 'p3', bubble: 'tag:instead', tag: 'tag:instead', ratio: 1.2 },
    { piece: 'p4', bubble: 'tag:ai', tag: 'tag:ai', ratio: null },
    // At a depth above 0: warm (1.2) is the bubble, global warming (a person's) folds into it.
    { piece: 'p5', bubble: 'tag:warm', tag: 'tag:warm', ratio: 1.2 },
    { piece: 'p5', bubble: 'tag:warm', tag: 'tag:global warming', ratio: null },
    { piece: 'p6', bubble: 'tag:warm', tag: 'tag:warm', ratio: 1.3 },
  ];
  const at16 = shownAt(entries, 1.6);
  assert.deepStrictEqual([...at16.pairs].sort(), [pairKey('p1', 'tag:cancer'), pairKey('p4', 'tag:ai'), pairKey('p5', 'tag:warm')].sort());
  assert.deepStrictEqual([...at16.hiddenTags].sort(), ['tag:instead', 'tag:warm']);
  assert.deepStrictEqual([...at16.hiddenBubbles], ['tag:instead'], 'warm shows: global warming, folded into it, has a pair');
  const at1 = shownAt(entries, 1);
  assert.strictEqual(at1.pairs.size, 6);
  assert.strictEqual(at1.hiddenTags.size, 0);
  assert.strictEqual(at1.hiddenBubbles.size, 0);
  const none = shownAt(entries, null);
  assert.strictEqual(none.hiddenTags.size, 0, 'no value, nothing hidden');
  const at3 = shownAt(entries, 3);
  assert.deepStrictEqual([...at3.hiddenBubbles].sort(), ['tag:cancer', 'tag:instead'], 'raised, the strongest hub goes too');
});

test('the value as the panel shows it: always one decimal', () => {
  assert.strictEqual(ratioText(1.6), '1.6');
  assert.strictEqual(ratioText(1), '1.0');
  assert.strictEqual(ratioText(5.7), '5.7');
  assert.strictEqual(ratioText('2.04'), '2.0');
  for (const v of [null, undefined, '', 'x']) assert.strictEqual(ratioText(v), '');
});

// ── The slider's logarithmic travel ────────────────────────────────────

const { travelLength, ratioAt, positionOf } = require('../src/lib/sourceRatio');

const tenthsOf = ({ lo, hi }) => {
  const out = [];
  for (let k = Math.round(lo * 10); k <= Math.round(hi * 10); k++) out.push(k / 10);
  return out;
};
const RANGES = [
  { has: true, lo: 1, hi: 15, bar: 1.6 },
  { has: true, lo: 1, hi: 5.7, bar: 1.6 },
  { has: true, lo: 1.2, hi: 2.5, bar: 1.6 },
  { has: true, lo: 1, hi: 100, bar: 1.6 },
];

test('the travel\'s two ends are the range\'s two ends, exactly', () => {
  for (const range of RANGES) {
    const n = travelLength(range);
    assert.ok(Number.isInteger(n) && n >= 1000, `${n} positions`);
    assert.strictEqual(ratioAt(0, range), range.lo);
    assert.strictEqual(ratioAt(n, range), range.hi);
    assert.strictEqual(positionOf(range.lo, range), 0);
    assert.strictEqual(positionOf(range.hi, range), n);
    assert.strictEqual(ratioAt(-5, range), range.lo, 'before the start is the start');
    assert.strictEqual(ratioAt(n + 5, range), range.hi, 'past the end is the end');
  }
});

test('every tenth of the range goes to a position and back to itself', () => {
  for (const range of RANGES) {
    let last = -1;
    for (const r of tenthsOf(range)) {
      const p = positionOf(r, range);
      assert.ok(Number.isInteger(p), `${r}: a whole position`);
      assert.ok(p > last, `${r}: further along than the tenth before`);
      last = p;
      assert.strictEqual(ratioAt(p, range), r, `${r} -> ${p} -> ${ratioAt(p, range)} on ${range.lo}..${range.hi}`);
    }
  }
});

test('every position lands on a tenth within the range', () => {
  const range = RANGES[0];
  const n = travelLength(range);
  for (let p = 0; p <= n; p += 7) {
    const r = ratioAt(p, range);
    assert.ok(r >= range.lo && r <= range.hi);
    assert.strictEqual(Math.round(r * 10) / 10, r, `${p} -> ${r}`);
  }
});

test('the travel is logarithmic: equal stretches multiply the ratio by equal factors', () => {
  const range = { has: true, lo: 1, hi: 16, bar: 1.6 };
  const n = travelLength(range);
  assert.strictEqual(positionOf(4, range), n / 2, 'the geometric middle is the middle');
  assert.strictEqual(positionOf(2, range), n / 4);
  assert.strictEqual(positionOf(8, range), (3 * n) / 4);
  const wide = RANGES[0];
  const share = (r) => positionOf(r, wide) / travelLength(wide);
  assert.ok(Math.abs(share(1.6) - Math.log(1.6) / Math.log(15)) < 0.001, `1.6 at ${share(1.6)}`);
  assert.ok(share(3) > 0.4, `1.0 to 3.0 takes ${share(3)} of the travel, not a sliver`);
});

test('a range with nothing to travel stays at its one value', () => {
  const flat = { has: true, lo: 1.6, hi: 1.6, bar: 1.6 };
  assert.strictEqual(travelLength(flat), 1);
  assert.strictEqual(ratioAt(0, flat), 1.6);
  assert.strictEqual(ratioAt(1, flat), 1.6);
  assert.strictEqual(positionOf(1.6, flat), 0);
});

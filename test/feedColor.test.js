// The per-feed color seam. Colors are how a reader tells one source from
// another at a glance, so "distinct" is the whole requirement — and it is a
// property of the SET, which is exactly what per-feed hashing cannot see.

const { test } = require('node:test');
const assert = require('node:assert');
const { hashFeedColor, hueOf, hueDistance } = require('../src/adapters/detectFeedColor');

const feed = (id) => ({ id });

test('hueOf reads the formats we actually emit and scrape', () => {
  assert.strictEqual(hueOf('hsl(210, 65%, 58%)'), 210);
  assert.strictEqual(Math.round(hueOf('#2ecc71')), 145);
  assert.strictEqual(Math.round(hueOf('#f00')), 0);
  assert.strictEqual(Math.round(hueOf('rgb(0, 0, 255)')), 240);
});

test('hueOf declines to guess rather than guessing wrong', () => {
  assert.strictEqual(hueOf('rebeccapurple'), null, 'named colors are not parsed');
  assert.strictEqual(hueOf('#808080'), null, 'grey has no hue to separate on');
  assert.strictEqual(hueOf(undefined), null);
});

test('hue distance is circular', () => {
  assert.strictEqual(hueDistance(350, 10), 20);
  assert.strictEqual(hueDistance(10, 350), 20);
  assert.strictEqual(hueDistance(0, 180), 180);
});

test('a feed alone keeps its own hash hue', () => {
  const a = hashFeedColor(feed('https://example.test/rss'), []);
  const b = hashFeedColor(feed('https://example.test/rss'), []);
  assert.strictEqual(a, b, 'stable for a given feed');
});

test('generated hues stay clear of colors already taken', () => {
  // The real regression: sciencedaily, propublica and the local folder all
  // hashed into green — 126, 133 and 145 degrees. Indistinguishable.
  const taken = ['#2ecc71'];
  const ids = [
    'https://www.sciencedaily.com/rss/all.xml',
    'https://www.propublica.org/feeds/propublica/main',
    'https://example.test/three',
    'https://example.test/four',
  ];
  for (const id of ids) {
    const color = hashFeedColor(feed(id), taken);
    taken.push(color);
  }
  const hues = taken.map(hueOf);
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      assert.ok(
        hueDistance(hues[i], hues[j]) >= 30,
        `feeds ${i} and ${j} are only ${hueDistance(hues[i], hues[j]).toFixed(0)} degrees apart`,
      );
    }
  }
});

test('an explicit color is never moved to make room', () => {
  // A feed's own theme-color is its identity. Only generated hues yield.
  const mine = '#2ecc71';
  const generated = hashFeedColor(feed('https://example.test/x'), [mine]);
  assert.notStrictEqual(generated, mine);
  assert.ok(hueDistance(hueOf(generated), hueOf(mine)) >= 30);
});

test('separation degrades gracefully rather than failing when crowded', () => {
  const taken = [];
  for (let i = 0; i < 24; i++) taken.push(hashFeedColor(feed(`feed-${i}`), taken));
  assert.strictEqual(new Set(taken).size, 24, 'no two feeds share a color');
});

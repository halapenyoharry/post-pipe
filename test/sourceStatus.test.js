// What a feed's pill says about the build's fetch of it (src/lib/sourceStatus.js):
// nothing for a feed that loaded; a stale mark with the copy's age and the
// error for a feed whose cards come from a copy; the error for a feed that
// failed with no copy. And the lines of the pill's popover (sourceLines,
// 2026-11-05): when each kind of source's items were taken in.

const { test } = require('node:test');
const assert = require('node:assert');
const { sourceStatus, sourceLines, formatWhen, copyAge, copyDay } = require('../src/lib/sourceStatus');

// Noon UTC, so the day is the same in every time zone the tests run in.
const NOW = Date.parse('2026-10-31T12:00:00Z');

test('a feed that loaded says nothing more', () => {
  assert.strictEqual(sourceStatus({ id: 'a', ok: true, itemCount: 3 }, NOW), null);
  assert.strictEqual(sourceStatus({ id: 'a' }, NOW), null, 'an older feed.json without ok');
  assert.strictEqual(sourceStatus(null, NOW), null);
});

test('stale: the copy\'s day and age, and what went wrong', () => {
  const st = sourceStatus({ ok: true, stale: true, copyDate: '2026-10-29T12:00:00.000Z', error: 'fetch failed (ECONNREFUSED)' }, NOW);
  assert.strictEqual(st.kind, 'stale');
  assert.strictEqual(st.date, '2026-10-29');
  assert.deepStrictEqual({ short: st.age.short, long: st.age.long }, { short: '2d', long: '2 days old' });
  assert.strictEqual(st.note, 'Not fetched for this build (fetch failed (ECONNREFUSED)); these cards are from the copy of 2026-10-29, 2 days old');
});

test('stale without a readable date or an error still says the cards are a copy\'s', () => {
  const st = sourceStatus({ ok: true, stale: true, copyDate: null }, NOW);
  assert.strictEqual(st.kind, 'stale');
  assert.strictEqual(st.age, null);
  assert.strictEqual(st.note, 'Not fetched for this build; these cards are from an earlier copy');
});

test('failed with no copy: the error, and that there is no earlier copy', () => {
  const st = sourceStatus({ ok: false, itemCount: 0, error: 'HTTP 503 Service Unavailable' }, NOW);
  assert.strictEqual(st.kind, 'failed');
  assert.strictEqual(st.note, 'Not fetched for this build (HTTP 503 Service Unavailable), and there is no earlier copy');
  assert.strictEqual(sourceStatus({ ok: false }, NOW).note, 'Not fetched for this build, and there is no earlier copy', 'an older feed.json without an error');
});

test('age: under an hour, hours to two days, days to two weeks, weeks to two months, then months', () => {
  const ago = (ms) => copyAge(new Date(NOW - ms).toISOString(), NOW);
  const H = 3600e3; const D = 24 * H;
  assert.deepStrictEqual([ago(5 * 60e3).short, ago(5 * 60e3).long], ['<1h', 'less than an hour old']);
  assert.deepStrictEqual([ago(H).short, ago(H).long], ['1h', '1 hour old']);
  assert.deepStrictEqual([ago(47 * H).short, ago(47 * H).long], ['47h', '47 hours old']);
  assert.deepStrictEqual([ago(2 * D).short, ago(2 * D).long], ['2d', '2 days old']);
  assert.deepStrictEqual([ago(13 * D).short], ['13d']);
  assert.deepStrictEqual([ago(14 * D).short, ago(14 * D).long], ['2w', '2 weeks old']);
  assert.deepStrictEqual([ago(90 * D).short, ago(90 * D).long], ['3mo', '3 months old']);
  assert.strictEqual(copyAge(new Date(NOW + 5 * H).toISOString(), NOW).short, '<1h', 'a copy dated ahead of the clock counts as new');
  assert.strictEqual(copyAge('not a date', NOW), null);
  assert.strictEqual(copyAge('2026-10-30T12:00:00Z', new Date(NOW)).short, '24h', 'now may be a Date');
});

test('the copy\'s day is the viewer\'s calendar day', () => {
  assert.strictEqual(copyDay('2026-10-29T12:00:00Z'), '2026-10-29');
  assert.strictEqual(copyDay(''), null);
});

test('age: span, for "2 days ago", beside long, for "2 days old"', () => {
  const ago = (ms) => copyAge(new Date(NOW - ms).toISOString(), NOW);
  const H = 3600e3;
  assert.deepStrictEqual([ago(5 * 60e3).span, ago(5 * 60e3).long], ['less than an hour', 'less than an hour old']);
  assert.deepStrictEqual([ago(3 * H).span, ago(3 * H).long], ['3 hours', '3 hours old']);
  assert.strictEqual(ago(49 * H).span, '2 days');
});

// The popover's lines, in a fixed locale and zone so they read the same
// wherever the tests run; the page passes neither, and the viewer's own
// are used.
const AT = { now: Date.parse('2026-11-05T15:00:00Z'), locale: 'en-GB', timeZone: 'UTC' };

test('popover: dates in the viewer\'s locale and zone, medium date and short time', () => {
  assert.strictEqual(formatWhen('2026-11-05T12:34:00Z', { locale: 'en-GB', timeZone: 'UTC' }), '5 Nov 2026, 12:34');
  assert.strictEqual(formatWhen('2026-11-05T12:34:00Z', { locale: 'en-GB', timeZone: 'Asia/Tokyo' }), '5 Nov 2026, 21:34');
  assert.strictEqual(formatWhen('2026-11-05T12:34:00Z', { locale: 'de-DE', timeZone: 'Europe/Berlin' }), '05.11.2026, 13:34');
  assert.strictEqual(formatWhen('not a date'), null);
  assert.strictEqual(formatWhen(null), null);
  assert.ok(formatWhen('2026-11-05T12:34:00Z').includes('2026'), 'the viewer\'s own locale and zone when none is given');
});

test('popover: a feed fetched for this build, with the feed\'s own date', () => {
  assert.deepStrictEqual(sourceLines({ type: 'rss', ok: true, fetchedAt: '2026-11-05T12:34:00.000Z', feedUpdated: '2026-11-05T12:00:00.000Z' }, AT), [
    'Fetched 5 Nov 2026, 12:34, 2 hours ago',
    'The feed says it was updated 5 Nov 2026, 12:00',
  ]);
  assert.deepStrictEqual(sourceLines({ type: 'atom', ok: true, fetchedAt: '2026-11-05T14:50:00.000Z', feedUpdated: '2026-11-04T23:00:00.000Z' }, AT), [
    'Fetched 5 Nov 2026, 14:50, less than an hour ago',
    'The feed says it was updated 4 Nov 2026, 23:00',
  ]);
});

test('popover: a JSON Feed gives no date of its own, so one line', () => {
  assert.deepStrictEqual(sourceLines({ type: 'json-feed', ok: true, fetchedAt: '2026-11-03T15:00:00.000Z', feedUpdated: null }, AT), [
    'Fetched 3 Nov 2026, 15:00, 2 days ago',
  ]);
});

test('popover: cards from the site\'s saved copy', () => {
  const src = {
    type: 'rss', ok: true, stale: true, copyFrom: 'site', error: 'fetch failed (ECONNREFUSED)',
    copyDate: '2026-11-03T09:00:00.000Z', fetchedAt: '2026-11-03T09:00:00.000Z', feedUpdated: '2026-11-03T08:00:00.000Z',
  };
  assert.deepStrictEqual(sourceLines(src, AT), [
    'Not fetched for this build (fetch failed (ECONNREFUSED)); these cards are from the site\'s saved copy of 3 Nov 2026, 09:00, 2 days old',
    'The feed says it was updated 3 Nov 2026, 08:00',
  ]);
});

test('popover: cards from an earlier build\'s copy (the engine\'s last good copy)', () => {
  const src = { type: 'rss', ok: true, stale: true, copyFrom: 'engine', error: 'no answer within 15 s', copyDate: '2026-11-05T11:00:00.000Z', fetchedAt: '2026-11-05T11:00:00.000Z', feedUpdated: null };
  assert.deepStrictEqual(sourceLines(src, AT), [
    'Not fetched for this build (no answer within 15 s); these cards are from an earlier build\'s copy of 5 Nov 2026, 11:00, 4 hours old',
  ]);
});

test('popover: a stale feed from an earlier build says what it can', () => {
  assert.deepStrictEqual(sourceLines({ type: 'rss', ok: true, stale: true, copyDate: '2026-11-03T09:00:00.000Z' }, AT), [
    'Not fetched for this build; these cards are from the copy of 3 Nov 2026, 09:00, 2 days old',
  ], 'no copyFrom, no error: a feed.json from before they were written');
  assert.deepStrictEqual(sourceLines({ type: 'rss', ok: true, stale: true, copyFrom: 'site', copyDate: null }, AT), [
    'Not fetched for this build; these cards are from the site\'s saved copy',
  ]);
  assert.deepStrictEqual(sourceLines({ type: 'rss', ok: true, stale: true }, AT), [
    'Not fetched for this build; these cards are from an earlier copy',
  ]);
});

test('popover: a feed that failed with no copy says so, as its title did', () => {
  assert.deepStrictEqual(sourceLines({ type: 'rss', ok: false, error: 'HTTP 503 Service Unavailable', fetchedAt: null, feedUpdated: null }, AT), [
    'Not fetched for this build (HTTP 503 Service Unavailable), and there is no earlier copy',
  ]);
});

test('popover: a local folder, a page and a list of pages say when the build read them', () => {
  assert.deepStrictEqual(sourceLines({ type: 'local', ok: true, readAt: '2026-11-05T14:00:00.000Z' }, AT), ['Read at build 5 Nov 2026, 14:00']);
  assert.deepStrictEqual(sourceLines({ type: 'page', ok: true, fetchedAt: '2026-11-05T14:00:00.000Z', feedUpdated: null }, AT), ['Read at build 5 Nov 2026, 14:00'],
    'a page is fetched at build, and that is when it was read');
  assert.deepStrictEqual(sourceLines({ type: 'pages', ok: true, readAt: '2026-11-05T14:00:00.000Z' }, AT), ['Read at build 5 Nov 2026, 14:00']);
});

test('popover: nothing to say for a source from a feed.json without times, or no source', () => {
  assert.deepStrictEqual(sourceLines({ type: 'rss', ok: true, itemCount: 3 }, AT), []);
  assert.deepStrictEqual(sourceLines({ type: 'local', ok: true }, AT), []);
  assert.deepStrictEqual(sourceLines(null, AT), []);
});

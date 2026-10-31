// What a feed's pill says about the build's fetch of it (src/lib/sourceStatus.js):
// nothing for a feed that loaded; a stale mark with the copy's age and the
// error for a feed whose cards come from its last good copy; the error for a
// feed that failed with no copy.

const { test } = require('node:test');
const assert = require('node:assert');
const { sourceStatus, copyAge, copyDay } = require('../src/lib/sourceStatus');

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

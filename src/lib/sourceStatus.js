// What a feed's pill in the top bar says about the build's fetch of it
// (src/components/FeedZ). The build records it on the feed's source in
// feed.json (src/aggregator.js): a feed that loaded carries nothing; a feed
// whose fetch failed carries error, and stale with copyDate when its cards
// come from its last good copy. So:
//   null                 the feed loaded; the pill says nothing more
//   { kind: 'stale' }    the fetch failed and its cards are the copy's: the
//                        pill shows a small mark, and its title says how old
//                        the copy is and what went wrong
//   { kind: 'failed' }   the fetch failed with no copy: the pill is struck
//                        through as before, and its title says what went wrong
// with note (the sentence for the title), date (the copy's day, YYYY-MM-DD,
// in the viewer's time zone) and age ({ short: '2d', long: '2 days old' },
// from now; null when the copy's date is unknown).
//
// Pure, so it can be tested without the DOM.

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const plural = (n, one) => `${n} ${one}${n === 1 ? '' : 's'}`;

// How old a copy fetched at copyDate is at now (ms or a Date), or null.
function copyAge(copyDate, now = Date.now()) {
  const t = Date.parse(copyDate);
  const at = now instanceof Date ? now.getTime() : Number(now);
  if (!Number.isFinite(t) || !Number.isFinite(at)) return null;
  const ms = Math.max(0, at - t);
  if (ms < HOUR) return { ms, short: '<1h', long: 'less than an hour old' };
  if (ms < 2 * DAY) { const h = Math.floor(ms / HOUR); return { ms, short: `${h}h`, long: `${plural(h, 'hour')} old` }; }
  if (ms < 14 * DAY) { const d = Math.floor(ms / DAY); return { ms, short: `${d}d`, long: `${plural(d, 'day')} old` }; }
  if (ms < 60 * DAY) { const w = Math.floor(ms / (7 * DAY)); return { ms, short: `${w}w`, long: `${plural(w, 'week')} old` }; }
  const m = Math.floor(ms / (30 * DAY));
  return { ms, short: `${m}mo`, long: `${plural(m, 'month')} old` };
}

// The copy's day as YYYY-MM-DD in the viewer's time zone, or null.
function copyDay(copyDate) {
  const t = Date.parse(copyDate);
  if (!Number.isFinite(t)) return null;
  const d = new Date(t);
  const two = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
}

function sourceStatus(source, now = Date.now()) {
  if (!source || typeof source !== 'object') return null;
  const error = typeof source.error === 'string' && source.error.trim() ? source.error.trim() : '';
  const why = error ? ` (${error})` : '';
  if (source.stale === true) {
    const date = copyDay(source.copyDate);
    const age = copyAge(source.copyDate, now);
    const from = date ? `the copy of ${date}${age ? `, ${age.long}` : ''}` : 'an earlier copy';
    return { kind: 'stale', date, age, note: `Not fetched for this build${why}; these cards are from ${from}` };
  }
  if (source.ok === false) {
    return { kind: 'failed', date: null, age: null, note: `Not fetched for this build${why}, and there is no earlier copy` };
  }
  return null;
}

module.exports = { sourceStatus, copyAge, copyDay };

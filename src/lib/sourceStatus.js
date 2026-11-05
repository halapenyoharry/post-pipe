// What a feed's pill in the top bar says about the build's fetch of it
// (src/components/FeedZ). The build records it on the feed's source in
// feed.json (src/aggregator.js): a feed whose fetch failed carries error,
// and stale with copyDate and copyFrom when its cards come from a copy (the
// site's saved copy or this machine's last good copy). So, sourceStatus:
//   null                 the feed loaded; the pill shows no mark
//   { kind: 'stale' }    the fetch failed and its cards are the copy's: the
//                        pill shows a small mark, and its popover says how old
//                        the copy is, which copy, and what went wrong
//   { kind: 'failed' }   the fetch failed with no copy: the pill is struck
//                        through as before, and its popover says what went wrong
// with note (the sentence of earlier builds' titles), date (the copy's day,
// YYYY-MM-DD, in the viewer's time zone) and age ({ short: '2d', span:
// '2 days', long: '2 days old' }, from now; null when the copy's date is
// unknown).
//
// sourceLines gives the lines of the pill's popover (shown on a mouse's
// hover, the keyboard's focus or a finger's dwell): when the source's items
// were taken in (fetchedAt, readAt), the feed's own date for itself
// (feedUpdated), and the stale or failed sentence, with dates in the
// viewer's locale and time zone.
//
// Pure, so it can be tested without the DOM.

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const plural = (n, one) => `${n} ${one}${n === 1 ? '' : 's'}`;

// How old a copy fetched at copyDate is at now (ms or a Date), or null:
// short ('2d'), span ('2 days', for "2 days ago") and long ('2 days old').
function copyAge(copyDate, now = Date.now()) {
  const t = Date.parse(copyDate);
  const at = now instanceof Date ? now.getTime() : Number(now);
  if (!Number.isFinite(t) || !Number.isFinite(at)) return null;
  const ms = Math.max(0, at - t);
  const age = (short, span) => ({ ms, short, span, long: `${span} old` });
  if (ms < HOUR) return age('<1h', 'less than an hour');
  if (ms < 2 * DAY) { const h = Math.floor(ms / HOUR); return age(`${h}h`, plural(h, 'hour')); }
  if (ms < 14 * DAY) { const d = Math.floor(ms / DAY); return age(`${d}d`, plural(d, 'day')); }
  if (ms < 60 * DAY) { const w = Math.floor(ms / (7 * DAY)); return age(`${w}w`, plural(w, 'week')); }
  const m = Math.floor(ms / (30 * DAY));
  return age(`${m}mo`, plural(m, 'month'));
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

// A date and time (an ISO string) as the viewer reads one: Intl's medium
// date and short time, in locale and timeZone (the viewer's own when not
// given; tests give both). null for no date or one that does not read.
const formats = new Map();
function formatWhen(iso, { locale, timeZone } = {}) {
  const t = typeof iso === 'string' ? Date.parse(iso) : NaN;
  if (!Number.isFinite(t)) return null;
  const key = `${locale || ''}|${timeZone || ''}`;
  try {
    if (!formats.has(key)) {
      formats.set(key, new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', ...(timeZone ? { timeZone } : {}) }));
    }
    return formats.get(key).format(new Date(t));
  } catch (_) {
    // A locale or zone Intl cannot use: the date as written, to the minute.
    return new Date(t).toISOString().slice(0, 16).replace('T', ' ');
  }
}

// The copy a stale source's cards came from, as the popover names it.
// What a viewer reads: the engine's copy is named by what made it, an
// earlier build, since "this machine" would read as the viewer's own device.
const COPY_NAMES = { site: "the site's saved copy", engine: "an earlier build's copy" };

// Sources the build reads rather than fetches as a feed: their popover says
// when the build read them.
const READ_TYPES = new Set(['local', 'page', 'pages']);

// The lines of a source pill's popover, those that apply, in order:
//   Fetched <date, time>, <age> ago                        a feed this build fetched
//   Not fetched for this build (<reason>); these cards are from
//     <the site's saved copy | an earlier build's copy> of <date, time>, <age> old
//                                                          a feed whose cards are a copy's
//   Not fetched for this build (<reason>), and there is no earlier copy
//                                                          a feed with no copy
//   The feed says it was updated <date, time>              when the feed gives its own date
//   Read at build <date, time>                             a local folder, a page, a list of pages
// [] when the source says nothing of the sort (a feed.json from before
// these fields). options: now (ms or a Date), locale and timeZone (the
// viewer's when not given).
function sourceLines(source, { now = Date.now(), locale, timeZone } = {}) {
  if (!source || typeof source !== 'object') return [];
  const when = (iso) => formatWhen(iso, { locale, timeZone });
  const status = sourceStatus(source, now);
  const updated = when(source.feedUpdated);
  const lines = [];
  if (status && status.kind === 'stale') {
    const error = typeof source.error === 'string' && source.error.trim() ? source.error.trim() : '';
    const which = COPY_NAMES[source.copyFrom] || null;
    const at = when(source.copyDate);
    const from = at
      ? `${which || 'the copy'} of ${at}${status.age ? `, ${status.age.long}` : ''}`
      : (which || 'an earlier copy');
    lines.push(`Not fetched for this build${error ? ` (${error})` : ''}; these cards are from ${from}`);
    if (updated) lines.push(`The feed says it was updated ${updated}`);
    return lines;
  }
  if (status && status.kind === 'failed') return [status.note];
  if (READ_TYPES.has(source.type)) {
    const at = when(source.readAt || source.fetchedAt);
    return at ? [`Read at build ${at}`] : [];
  }
  const at = when(source.fetchedAt);
  if (at) {
    const age = copyAge(source.fetchedAt, now);
    lines.push(`Fetched ${at}${age ? `, ${age.span} ago` : ''}`);
  }
  if (updated) lines.push(`The feed says it was updated ${updated}`);
  return lines;
}

module.exports = { sourceStatus, sourceLines, formatWhen, copyAge, copyDay };

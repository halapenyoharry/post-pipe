// A piece's scene: when and where it happens, for the reader's surroundings
// (the background follows the time of day). Three fields:
//
//   time_of_day  dawn | morning | midday | afternoon | dusk | evening | night | late-night
//   date         a calendar date, YYYY-MM-DD; X for an unknown digit and a
//                trailing ? for an uncertain one are kept as written
//   place        free text
//
// Read from the first source that has a value for each field, in the order
// given: the text's own front matter first, then the per-piece metadata (its
// `scene` object, or the same fields at its top level).

const TIMES_OF_DAY = ['dawn', 'morning', 'midday', 'afternoon', 'dusk', 'evening', 'night', 'late-night'];

function clean(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function sceneFrom(...sources) {
  const out = { time_of_day: '', date: '', place: '' };
  for (const src of sources) {
    if (!src || typeof src !== 'object') continue;
    const s = src.scene && typeof src.scene === 'object' ? { ...src, ...src.scene } : src;
    for (const k of Object.keys(out)) {
      if (!out[k] && clean(s[k])) out[k] = clean(s[k]);
    }
  }
  if (out.time_of_day) {
    const t = out.time_of_day.toLowerCase().replace(/\s+/g, '-');
    out.time_of_day = TIMES_OF_DAY.includes(t) ? t : '';
  }
  return out.time_of_day || out.date || out.place ? out : null;
}

// The month of a scene date (1-12), or null: "2030-06-02", "2030-06-XX",
// "2030-06-03?" all give 6; "XXXX-XX-XX" gives null.
function sceneMonth(date) {
  const m = /^(?:\d{4}|X{4})-(\d{2})/.exec(clean(date));
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= 12 ? n : null;
}

module.exports = { sceneFrom, sceneMonth, TIMES_OF_DAY };

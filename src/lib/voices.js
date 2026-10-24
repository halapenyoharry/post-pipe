// The browser's voices for the reader's voice picker. The voices are the
// device's own, not the site's: Apple's on a Mac or an iPhone, Microsoft's on
// Windows, Google's on Android and in Chrome. Every voice the device has is
// offered; the site only orders them, and may cap the list. The order:
// Google's voices first (the name starts with "Google": Chrome's own, better
// than the system defaults), then the site's preferred names in the site's
// order (a device voice matches a name exactly or by its start, so "Samantha"
// finds "Samantha (Enhanced)"), then every other voice. Within each of the
// three, the page's language first (settings.site.lang, "en" by default),
// then the rest, each by label. Each is labelled by its name and its region
// only; the picker groups them by language.
//
// Plain functions: tts.js uses them on the page (generate-index.js puts them
// there as window.PPVoices) and the tests use them here.

function langOf(lang) {
  return String(lang || '').toLowerCase().split(/[-_]/)[0];
}

// The voice's name without what the device appends about its language
// ("Microsoft Aria Online (Natural) - English (United States)", "Eddy
// (English (United States))"); a plain note such as "(Enhanced)" stays.
function voiceName(v) {
  return String((v && v.name) || '').split(' - ')[0].replace(/\s*\([^()]*\([^()]*\)\)\s*$/, '').trim();
}

// The region of a voice's lang ("en-GB" → "United Kingdom"), or '' for none.
function regionName(lang, displayNames) {
  const parts = String(lang || '').split(/[-_]/);
  const code = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
  if (!/^[A-Z]{2}$|^\d{3}$/.test(code)) return '';
  try {
    const dn = displayNames || (typeof Intl !== 'undefined' && Intl.DisplayNames ? new Intl.DisplayNames(['en'], { type: 'region' }) : null);
    return (dn && dn.of(code)) || code;
  } catch (_) {
    return code;
  }
}

// The language's name in English ("en" → "English").
function languageName(lang) {
  const code = langOf(lang) || 'en';
  try {
    const dn = typeof Intl !== 'undefined' && Intl.DisplayNames ? new Intl.DisplayNames(['en'], { type: 'language' }) : null;
    return (dn && dn.of(code)) || code;
  } catch (_) {
    return code;
  }
}

function voiceLabel(v, displayNames) {
  const name = voiceName(v);
  const region = regionName(v && v.lang, displayNames);
  return region ? `${name} · ${region}` : name;
}

function isGoogle(v) {
  return /^google\b/i.test(String((v && v.name) || ''));
}

// The page's language first, then the rest, each by label.
function byLanguageThenLabel(voices, want, displayNames) {
  return voices.slice().sort((a, b) => {
    const am = langOf(a.lang) === want ? 0 : 1;
    const bm = langOf(b.lang) === want ? 0 : 1;
    if (am !== bm) return am - bm;
    return voiceLabel(a, displayNames).localeCompare(voiceLabel(b, displayNames));
  });
}

// all: the device's voices ({ name, lang, default }). Options: lang (the
// page's language), preferred (names, best first), max (a cap; none by
// default). Returns every voice as [{ voice, label }], ordered: Google's,
// the preferred in order, the rest; the page's language first within each.
function voiceList(all, { lang = 'en', preferred = [], max = Infinity, displayNames } = {}) {
  const want = langOf(lang) || 'en';
  const have = (all || []).filter((v) => v && v.name);
  const google = byLanguageThenLabel(have.filter(isGoogle), want, displayNames);
  const taken = new Set(google);
  const picked = [];
  for (const name of preferred || []) {
    const pool = byLanguageThenLabel(have.filter((v) => !taken.has(v)), want, displayNames);
    const exact = pool.find((v) => v.name === name);
    const start = exact || pool.find((v) => v.name.indexOf(name) === 0);
    if (start) { picked.push(start); taken.add(start); }
  }
  const rest = byLanguageThenLabel(have.filter((v) => !taken.has(v)), want, displayNames);
  const cap = Number.isFinite(max) && max > 0 ? max : Infinity;
  return [...google, ...picked, ...rest].slice(0, cap).map((v) => ({ voice: v, label: voiceLabel(v, displayNames) }));
}

// The voice to start with: the first in the order above that speaks the
// page's language (in Chrome, a Google voice; on a Mac without one, the
// first preferred voice the device has), else the first voice; null for none.
// Within the site's cap, so the default is always on offer.
function defaultVoice(all, opts = {}) {
  const want = langOf(opts.lang) || 'en';
  const list = voiceList(all, opts);
  const mine = list.find((e) => langOf(e.voice.lang) === want);
  return (mine || list[0]) ? (mine || list[0]).voice.name : null;
}

// The picker's groups, one per language: the page's language first, then
// the rest by language name; the voices in each keep the list's order.
// entries: [{ lang, ... }] (voiceList's output, or the engine's
// { id, label, lang }). Returns [{ label, voices }].
function voiceGroups(entries, { lang = 'en' } = {}) {
  const want = langOf(lang) || 'en';
  const groups = new Map();
  for (const e of entries || []) {
    const code = langOf(e && (e.lang || (e.voice && e.voice.lang)));
    if (!groups.has(code)) groups.set(code, { code, label: languageName(code), voices: [] });
    groups.get(code).voices.push(e);
  }
  return [...groups.values()].sort((a, b) => {
    const am = a.code === want ? 0 : 1;
    const bm = b.code === want ? 0 : 1;
    if (am !== bm) return am - bm;
    return a.label.localeCompare(b.label);
  }).map(({ label, voices }) => ({ label, voices }));
}

module.exports = { voiceList, defaultVoice, voiceGroups, voiceLabel, voiceName, regionName, languageName, langOf };

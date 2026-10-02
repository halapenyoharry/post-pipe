// The browser's voices for the reader's voice picker. The voices are the
// device's own, not the site's: Apple's on a Mac or an iPhone, Microsoft's on
// Windows, Google's on Android and in Chrome. The site can only prefer names
// and fall back. A chapter is spoken in its own language (settings.site.lang,
// "en" by default); the engine never translates, so only the voices for
// that language are offered: the preferred ones first, in the site's order
// (a device voice matches a name exactly or by its start, so "Samantha"
// finds "Samantha (Enhanced)"), then the rest by name. Each is labelled by
// its name and its region only.
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

// all: the device's voices ({ name, lang, default }). Options: lang (the
// chapter's language), preferred (names, best first), max (a cap; none by
// default). Returns [{ voice, label }].
function voiceList(all, { lang = 'en', preferred = [], max = Infinity, displayNames } = {}) {
  const want = langOf(lang) || 'en';
  const mine = (all || []).filter((v) => v && v.name && langOf(v.lang) === want);
  const picked = [];
  for (const name of preferred || []) {
    const exact = mine.find((v) => v.name === name && !picked.includes(v));
    const start = exact || mine.find((v) => v.name.indexOf(name) === 0 && !picked.includes(v));
    if (start) picked.push(start);
  }
  const rest = mine.filter((v) => !picked.includes(v))
    .sort((a, b) => voiceLabel(a, displayNames).localeCompare(voiceLabel(b, displayNames)));
  const cap = Number.isFinite(max) && max > 0 ? max : Infinity;
  return [...picked, ...rest].slice(0, cap).map((v) => ({ voice: v, label: voiceLabel(v, displayNames) }));
}

module.exports = { voiceList, voiceLabel, voiceName, regionName, languageName, langOf };

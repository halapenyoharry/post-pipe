// When the voice reading aloud fails (an engine's request errors, a browser
// voice errors or is missing from the device), reading goes on in another
// voice instead of stopping, and says so quietly: one line in the console
// and a small note under the voice picker (src/components/TTS), nothing over
// the text.
//
// The order is the site's choice (settings.tts.fallback, TTS_CONFIG.fallback
// on the page):
//   'voice-then-browser'  the default. Another voice of the same engine (its
//                         default voice, else the next in its list in the
//                         failing voice's language), then the browser's
//                         default voice, then the device's own voice.
//   'browser'             straight to the browser's default voice, then the
//                         device's own voice.
//   'off'                 no fallback: reading stops with the error, as it
//                         did before.
// Each voice is tried once per sentence. The first that speaks reads on for
// the rest of the chapter, so a failing voice costs one sentence's attempt,
// not one per sentence.
//
// Plain functions: tts.js uses them on the page (generate-index.js puts them
// there as window.PPVoiceFallback) and the tests use them here.

const FALLBACK_MODES = ['voice-then-browser', 'browser', 'off'];
const DEFAULT_FALLBACK = 'voice-then-browser';

function fallbackMode(v) {
  return FALLBACK_MODES.indexOf(v) !== -1 ? v : DEFAULT_FALLBACK;
}

function langCode(lang) {
  return String(lang || '').toLowerCase().split(/[-_]/)[0];
}

// Another voice of the failing one's engine: the engine's default when that
// is not the failing voice (and is on offer), else the first other voice in
// the failing voice's language, else the first other voice; null for none.
function otherVoice(voice, voices, engineDefault) {
  const list = (voices || []).filter((v) => v && v.id);
  const on = (id) => !list.length || list.some((v) => v.id === id);
  if (engineDefault && engineDefault !== voice && on(engineDefault)) return engineDefault;
  const failing = list.find((v) => v.id === voice);
  const lang = failing ? langCode(failing.lang) : '';
  const same = list.find((v) => v.id !== voice && (!lang || langCode(v.lang) === lang));
  if (same) return same.id;
  const any = list.find((v) => v.id !== voice);
  return any ? any.id : null;
}

// The voices to try after { engine, voice } failed, in order, each once:
// [{ engine, voice }], voice null for the device's own (no voice named).
//   mode           settings.tts.fallback
//   engine, voice  what failed (voice null: none was named)
//   voices         the failing engine's voices, [{ id, lang }]
//   engineDefault  the failing engine's default voice id
//   browser        the browser engine, when the page has it:
//                  { defaultVoice, deviceVoice } (the device's own voice by
//                  name, when known), else null
//   engineFailed   true when the engine itself would not start: its other
//                  voices are not tried
//   skip           [{ engine, voice }] already found failing this chapter
function fallbackPlan({ mode, engine, voice = null, voices = [], engineDefault = null, browser = null, engineFailed = false, skip = [] } = {}) {
  const m = fallbackMode(mode);
  if (m === 'off') return [];
  const key = (e, v) => `${e}\u0000${v || ''}`;
  const seen = new Set([key(engine, voice), ...(skip || []).map((s) => key(s.engine, s.voice))]);
  const out = [];
  const add = (e, v) => {
    const k = key(e, v);
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ engine: e, voice: v || null });
  };
  if (m === 'voice-then-browser' && !engineFailed) {
    const alt = otherVoice(voice, voices, engineDefault);
    if (alt) add(engine, alt);
  }
  if (browser && !(engineFailed && engine === 'browser')) {
    if (browser.defaultVoice) add('browser', browser.defaultVoice);
    add('browser', browser.deviceVoice || null);
  }
  return out;
}

// Whether a failure is reading being stopped or interrupted (not a voice
// failing): it is never answered with another voice.
function isInterruption(err) {
  return Boolean(err && (err.interrupted === true || err.code === 'interrupted' || err.code === 'canceled'));
}

// What a failure says, in one line.
function errorText(err) {
  if (!err) return 'unknown error';
  if (typeof err === 'string') return err;
  return String(err.message || err.error || err.code || err).trim() || 'unknown error';
}

// Speaks text in current ({ engine, voice }); when that fails, in each
// voice of plan (a list, or a function making it, called only on a failure)
// until one speaks. speak(engine, voice, text) resolves once the sentence is
// spoken and rejects when it fails. Resolves { used, fellBack, error, tried }
// (error: the first failure; tried: every voice that failed); rejects with
// the last failure, carrying tried, when every voice failed; an interruption
// is passed on at once.
async function speakWithFallback({ text, current, plan, speak }) {
  try {
    await speak(current.engine, current.voice, text);
    return { used: current, fellBack: false, error: null, tried: [] };
  } catch (first) {
    if (isInterruption(first)) throw first;
    const tried = [current];
    let last = first;
    const list = typeof plan === 'function' ? plan(first) : (plan || []);
    for (const next of list) {
      try {
        await speak(next.engine, next.voice, text);
        return { used: next, fellBack: true, error: first, tried };
      } catch (err) {
        if (isInterruption(err)) throw err;
        tried.push(next);
        last = err;
      }
    }
    if (last && typeof last === 'object') last.tried = tried;
    throw last;
  }
}

// The quiet note under the voice picker, and the console's line, for a
// fallback: { from, to } ({ engine, voice } each). label(engine, voice): a
// voice's name, null for the device's own; engineLabel(engine): an engine's
// name. The engines are named only when they differ, the browser's as "on
// this device" (its voices are the device's own).
function fallbackNote(fb, { label, engineLabel } = {}) {
  if (!fb || !fb.from || !fb.to) return '';
  const name = (e, v) => {
    if (!v) return e === 'browser' ? "this device's own voice" : ((engineLabel && engineLabel(e)) || e);
    return (label && label(e, v)) || v;
  };
  const crossed = fb.from.engine !== fb.to.engine;
  const tag = (e) => {
    if (!crossed) return '';
    return e === 'browser' ? ' on this device' : ` (${(engineLabel && engineLabel(e)) || e})`;
  };
  const fromName = name(fb.from.engine, fb.from.voice);
  const toName = name(fb.to.engine, fb.to.voice);
  const fromTag = fb.from.voice ? tag(fb.from.engine) : '';
  const toTag = fb.to.voice ? tag(fb.to.engine) : '';
  return `${fromName}${fromTag} did not work; reading with ${toName}${toTag}.`;
}

module.exports = { FALLBACK_MODES, DEFAULT_FALLBACK, fallbackMode, otherVoice, fallbackPlan, isInterruption, errorText, speakWithFallback, fallbackNote };

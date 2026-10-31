// The voice fallback (src/lib/voiceFallback.js): when the voice reading
// aloud fails, another voice of the same engine, then the browser's default,
// then the device's own, each tried once; the order is the site's choice
// (settings.tts.fallback). Engines are stubs: nothing speaks or fetches.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  FALLBACK_MODES, DEFAULT_FALLBACK, fallbackMode, otherVoice, fallbackPlan,
  isInterruption, errorText, speakWithFallback, fallbackNote,
} = require('../src/lib/voiceFallback');

const gemini = [
  { id: 'Zephyr', lang: 'multi' }, { id: 'Kore', lang: 'multi' }, { id: 'Puck', lang: 'multi' },
];
const browserVoices = [
  { id: 'Google US English', lang: 'en-US' },
  { id: 'Google UK English Female', lang: 'en-GB' },
  { id: 'Google Deutsch', lang: 'de-DE' },
  { id: 'Samantha', lang: 'en-US' },
];
const browser = { defaultVoice: 'Google US English', deviceVoice: 'Samantha' };

test('the order is a setting: voice-then-browser by default, browser, or off', () => {
  assert.deepStrictEqual(FALLBACK_MODES, ['voice-then-browser', 'browser', 'off']);
  assert.strictEqual(DEFAULT_FALLBACK, 'voice-then-browser');
  assert.strictEqual(fallbackMode(undefined), 'voice-then-browser');
  assert.strictEqual(fallbackMode('sideways'), 'voice-then-browser');
  assert.strictEqual(fallbackMode('browser'), 'browser');
  assert.strictEqual(fallbackMode('off'), 'off');
});

test('another voice of the engine: its default, else the next in the failing voice\'s language, else any', () => {
  assert.strictEqual(otherVoice('Puck', gemini, 'Kore'), 'Kore');
  assert.strictEqual(otherVoice('Kore', gemini, 'Kore'), 'Zephyr', 'the default is the one that failed');
  assert.strictEqual(otherVoice('Google US English', browserVoices, 'Google US English'), 'Google UK English Female', 'same language first');
  assert.strictEqual(otherVoice('Google Deutsch', browserVoices, 'Google Deutsch'), 'Google US English', 'no other German voice: any other');
  assert.strictEqual(otherVoice('Kore', [{ id: 'Kore' }], 'Kore'), null, 'the only voice');
  assert.strictEqual(otherVoice('Puck', [], 'Kore'), 'Kore', 'a list not known yet still offers the default');
  assert.strictEqual(otherVoice('Puck', gemini, 'Gone'), 'Zephyr', 'a default not on offer is passed over');
});

test('plan, default order: a Gemini voice fails → another Gemini voice, the browser\'s default, the device\'s own', () => {
  const plan = fallbackPlan({ engine: 'gemini', voice: 'Puck', voices: gemini, engineDefault: 'Kore', browser });
  assert.deepStrictEqual(plan, [
    { engine: 'gemini', voice: 'Kore' },
    { engine: 'browser', voice: 'Google US English' },
    { engine: 'browser', voice: 'Samantha' },
  ]);
});

test('plan: a browser voice fails → another browser voice, then the device\'s own; nothing listed twice', () => {
  const plan = fallbackPlan({ engine: 'browser', voice: 'Google US English', voices: browserVoices, engineDefault: 'Google US English', browser });
  assert.deepStrictEqual(plan, [
    { engine: 'browser', voice: 'Google UK English Female' },
    { engine: 'browser', voice: 'Samantha' },
  ]);
  // The device's own voice unnamed when the device does not say which it is.
  const unnamed = fallbackPlan({ engine: 'browser', voice: 'Samantha', voices: browserVoices, engineDefault: 'Google US English', browser: { defaultVoice: 'Google US English' } });
  assert.deepStrictEqual(unnamed, [
    { engine: 'browser', voice: 'Google US English' },
    { engine: 'browser', voice: null },
  ]);
});

test('plan: mode browser skips the engine\'s other voices; mode off has none', () => {
  assert.deepStrictEqual(fallbackPlan({ mode: 'browser', engine: 'gemini', voice: 'Puck', voices: gemini, engineDefault: 'Kore', browser }), [
    { engine: 'browser', voice: 'Google US English' },
    { engine: 'browser', voice: 'Samantha' },
  ]);
  assert.deepStrictEqual(fallbackPlan({ mode: 'off', engine: 'gemini', voice: 'Puck', voices: gemini, engineDefault: 'Kore', browser }), []);
});

test('plan: no browser engine on the page leaves only the engine\'s own voices; an engine that would not start skips them', () => {
  assert.deepStrictEqual(fallbackPlan({ engine: 'gemini', voice: 'Puck', voices: gemini, engineDefault: 'Kore', browser: null }), [
    { engine: 'gemini', voice: 'Kore' },
  ]);
  assert.deepStrictEqual(fallbackPlan({ engine: 'gemini', voice: 'Puck', voices: gemini, engineDefault: 'Kore', browser, engineFailed: true }), [
    { engine: 'browser', voice: 'Google US English' },
    { engine: 'browser', voice: 'Samantha' },
  ]);
});

test('plan: voices already found failing this chapter are not tried again', () => {
  const plan = fallbackPlan({ engine: 'gemini', voice: 'Puck', voices: gemini, engineDefault: 'Kore', browser, skip: [{ engine: 'gemini', voice: 'Kore' }, { engine: 'browser', voice: 'Google US English' }] });
  assert.deepStrictEqual(plan, [{ engine: 'browser', voice: 'Samantha' }]);
});

// A stub speak: the voices in `failing` reject, every other resolves; the
// calls are kept.
function stubSpeak(failing = {}) {
  const calls = [];
  const speak = async (engine, voice, text) => {
    calls.push(`${engine}:${voice || '-'}`);
    const why = failing[`${engine}:${voice || '-'}`];
    if (why) throw why;
    return text;
  };
  speak.calls = calls;
  return speak;
}

test('speak: the chosen voice speaks; the plan is not even made', async () => {
  const speak = stubSpeak();
  let made = 0;
  const r = await speakWithFallback({ text: 'One.', current: { engine: 'gemini', voice: 'Puck' }, plan: () => { made += 1; return []; }, speak });
  assert.deepStrictEqual(r, { used: { engine: 'gemini', voice: 'Puck' }, fellBack: false, error: null, tried: [] });
  assert.strictEqual(made, 0);
  assert.deepStrictEqual(speak.calls, ['gemini:Puck']);
});

test('speak: an engine request that fails falls through the plan to the first voice that speaks, each tried once', async () => {
  const down = new Error('Failed to fetch');
  const speak = stubSpeak({ 'gemini:Puck': down, 'gemini:Kore': new Error('Failed to fetch') });
  const plan = fallbackPlan({ engine: 'gemini', voice: 'Puck', voices: gemini, engineDefault: 'Kore', browser });
  const r = await speakWithFallback({ text: 'One.', current: { engine: 'gemini', voice: 'Puck' }, plan, speak });
  assert.deepStrictEqual(r.used, { engine: 'browser', voice: 'Google US English' });
  assert.strictEqual(r.fellBack, true);
  assert.strictEqual(r.error, down, 'the first failure is the one reported');
  assert.deepStrictEqual(r.tried, [{ engine: 'gemini', voice: 'Puck' }, { engine: 'gemini', voice: 'Kore' }]);
  assert.deepStrictEqual(speak.calls, ['gemini:Puck', 'gemini:Kore', 'browser:Google US English']);
});

test('speak: a missing browser voice falls back to the device\'s own', async () => {
  const missing = Object.assign(new Error('the voice "Moira" is not on this device'), { code: 'voice-missing' });
  const speak = stubSpeak({ 'browser:Moira': missing, 'browser:Google US English': new Error('speech synthesis-failed') });
  const plan = () => fallbackPlan({ engine: 'browser', voice: 'Moira', voices: browserVoices, engineDefault: 'Google US English', browser });
  const r = await speakWithFallback({ text: 'One.', current: { engine: 'browser', voice: 'Moira' }, plan, speak });
  assert.deepStrictEqual(r.used, { engine: 'browser', voice: 'Samantha' });
  assert.deepStrictEqual(speak.calls, ['browser:Moira', 'browser:Google US English', 'browser:Samantha']);
});

test('speak: every voice failing rejects with the last failure; an interruption is never answered with another voice', async () => {
  const last = new Error('speech synthesis-unavailable');
  const speak = stubSpeak({ 'gemini:Puck': new Error('a'), 'browser:Google US English': new Error('b'), 'browser:Samantha': last });
  const plan = [{ engine: 'browser', voice: 'Google US English' }, { engine: 'browser', voice: 'Samantha' }];
  await assert.rejects(speakWithFallback({ text: 'x', current: { engine: 'gemini', voice: 'Puck' }, plan, speak }), (err) => {
    assert.strictEqual(err, last);
    assert.strictEqual(err.tried.length, 3);
    return true;
  });
  const stopped = Object.assign(new Error('speech interrupted'), { code: 'interrupted', interrupted: true });
  const speak2 = stubSpeak({ 'browser:Samantha': stopped });
  await assert.rejects(speakWithFallback({ text: 'x', current: { engine: 'browser', voice: 'Samantha' }, plan: [{ engine: 'browser', voice: null }], speak: speak2 }), stopped);
  assert.deepStrictEqual(speak2.calls, ['browser:Samantha'], 'no other voice tried');
  assert.strictEqual(isInterruption({ code: 'canceled' }), true);
  assert.strictEqual(isInterruption(new Error('x')), false);
});

test('note: plain, naming the engines only when they differ, the browser\'s as this device', () => {
  const labels = {
    label: (e, v) => (e === 'gemini' ? `${v} — Firm` : v),
    engineLabel: (e) => ({ gemini: 'Google Gemini', browser: 'Browser (Device)' })[e],
  };
  assert.strictEqual(
    fallbackNote({ from: { engine: 'gemini', voice: 'Kore' }, to: { engine: 'browser', voice: 'Samantha' } }, labels),
    'Kore — Firm (Google Gemini) did not work; reading with Samantha on this device.',
  );
  assert.strictEqual(
    fallbackNote({ from: { engine: 'browser', voice: 'Google US English' }, to: { engine: 'browser', voice: 'Samantha' } }, labels),
    'Google US English did not work; reading with Samantha.',
  );
  assert.strictEqual(
    fallbackNote({ from: { engine: 'browser', voice: 'Moira' }, to: { engine: 'browser', voice: null } }, labels),
    "Moira did not work; reading with this device's own voice.",
  );
  assert.strictEqual(
    fallbackNote({ from: { engine: 'gemini', voice: 'Puck' }, to: { engine: 'gemini', voice: 'Kore' } }, labels),
    'Puck — Firm did not work; reading with Kore — Firm.',
  );
  assert.strictEqual(fallbackNote(null), '');
  assert.strictEqual(errorText({ error: 'network' }), 'network');
  assert.strictEqual(errorText('plain'), 'plain');
});

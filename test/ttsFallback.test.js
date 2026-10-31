// The voice fallback inside tts.js, end to end on stubs: the page's tts.js
// and src/lib/voiceFallback.js (as generate-index.js puts them on the page)
// run in a sandbox with a stand-in DOM, speechSynthesis and Gemini engine.
// When the chosen voice fails, reading goes on in the next voice of the
// site's order, said once in the console and by one 'fallback' event (for
// the note under the voice picker), never by an 'error'.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const TTS_SRC = fs.readFileSync(path.join(ROOT, 'tts.js'), 'utf8');
const FALLBACK_SRC = fs.readFileSync(path.join(ROOT, 'src/lib/voiceFallback.js'), 'utf8');
// As generate-index.js puts it on the page.
const FALLBACK_PAGE = `window.PPVoiceFallback = (function () {
${FALLBACK_SRC.replace(/module\.exports\s*=\s*\{[^}]*\};?/, '')}
  return { fallbackMode: fallbackMode, fallbackPlan: fallbackPlan, isInterruption: isInterruption, errorText: errorText, speakWithFallback: speakWithFallback, fallbackNote: fallbackNote };
})();`;

const DEVICE_VOICES = [
  { name: 'Google US English', lang: 'en-US' },
  { name: 'Samantha', lang: 'en-US', default: true },
  { name: 'Thomas', lang: 'fr-FR' },
];

// A page: the sandbox, its log of what was spoken by whom, its console lines.
function page({ fallback, defaultEngine = 'browser', failingDevice = [], failingGemini = [], withFallback = true } = {}) {
  const spoken = [];
  const info = [];
  const synth = {
    getVoices: () => DEVICE_VOICES,
    addEventListener: () => {},
    cancel: () => {}, pause: () => {}, resume: () => {},
    speak(utt) {
      const name = utt.voice ? utt.voice.name : '(device)';
      setTimeout(() => {
        if (failingDevice.includes(name)) { spoken.push(`browser:${name}:failed`); utt.onerror({ error: 'synthesis-failed' }); }
        else { spoken.push(`browser:${name}:${utt.text}`); utt.onend(); }
      }, 0);
    },
  };
  const NodeFilter = { SHOW_TEXT: 4, SHOW_ELEMENT: 1, FILTER_ACCEPT: 1, FILTER_REJECT: 2, FILTER_SKIP: 3 };
  const document = {
    createTreeWalker(container, _what, filter) {
      const nodes = container._textNodes.slice();
      return {
        nextNode() {
          while (nodes.length) {
            const n = nodes.shift();
            if (filter.acceptNode(n) === NodeFilter.FILTER_ACCEPT) return n;
          }
          return null;
        },
      };
    },
    querySelectorAll: () => [],
  };
  const sandbox = {
    console: { info: (...a) => info.push(a.join(' ')), log: () => {}, warn: () => {}, error: () => {} },
    setTimeout, clearTimeout, Promise,
    speechSynthesis: synth,
    SpeechSynthesisUtterance: function (text) { this.text = text; },
    document, NodeFilter,
  };
  sandbox.window = sandbox;
  sandbox.TTS_CONFIG = { exposedEngines: ['browser', 'gemini'], defaultEngine, lang: 'en', preferredVoices: ['Samantha'], fallback };
  vm.createContext(sandbox);
  if (withFallback) vm.runInContext(FALLBACK_PAGE, sandbox);
  vm.runInContext(TTS_SRC, sandbox);
  // A stand-in Gemini: its requests fail for the voices in failingGemini.
  sandbox.TTS.register({
    id: 'gemini', label: 'Google Gemini',
    capabilities: { voice: { type: 'voice', label: 'Voice', default: 'Kore' } },
    init: async () => {},
    voices: () => [{ id: 'Kore', label: 'Kore — Firm', lang: 'multi' }, { id: 'Puck', label: 'Puck — Upbeat', lang: 'multi' }],
    speak: async (text, p) => {
      if (failingGemini.includes(p.voice)) { spoken.push(`gemini:${p.voice}:failed`); throw new TypeError('Failed to fetch'); }
      spoken.push(`gemini:${p.voice}:${text}`);
    },
    pause() {}, resume() {}, stop() {},
  });
  return { T: sandbox.TTS, spoken, info };
}

// A chapter of three sentences, as the reader's body holds it.
function chapter() {
  const container = { tagName: 'DIV', scrollTop: 0, getBoundingClientRect: () => ({ top: 0, height: 600 }), scrollTo() {} };
  const p = { tagName: 'P', parentElement: container, style: { removeProperty() {} }, dataset: {}, getBoundingClientRect: () => ({ top: 0, height: 20 }), closest: () => null };
  container._textNodes = [{ nodeType: 3, textContent: 'One here. Two here. Three here.', parentElement: p }];
  return container;
}

// Plays the chapter to its end; resolves with what was said along the way.
function read(T) {
  return new Promise((resolve) => {
    const events = { fallback: [], error: [] };
    T.on('fallback', (e) => events.fallback.push(e));
    T.on('error', (e) => events.error.push(e));
    let started = false;
    T.on('state', (s) => {
      if (s === 'playing') started = true;
      if (s === 'stopped' && started) resolve(events);
    });
    const c = chapter();
    T.play(c, { scrollContainer: c });
  });
}

test('a Gemini request that fails: another Gemini voice, then the browser\'s default reads on, said once', async () => {
  const { T, spoken, info } = page({ defaultEngine: 'gemini', failingGemini: ['Puck', 'Kore'] });
  T.select('gemini');
  T.set('voice', 'Puck');
  const events = await read(T);
  assert.deepStrictEqual(spoken, [
    'gemini:Puck:failed', 'gemini:Kore:failed', 'browser:Google US English:One here.',
    'browser:Google US English:Two here.', 'browser:Google US English:Three here.',
  ], 'each voice tried once, then the one that spoke reads the rest');
  assert.strictEqual(events.error.length, 0, 'no error over the text');
  assert.strictEqual(events.fallback.length, 1);
  assert.strictEqual(events.fallback[0].note, 'Puck — Upbeat (Google Gemini) did not work; reading with Google US English on this device.');
  assert.deepStrictEqual(info, ['[tts] Puck — Upbeat (Google Gemini) did not work; reading with Google US English on this device. (Failed to fetch)']);
  assert.strictEqual(T.selected(), 'browser', 'the picker follows: the browser engine now reads');
  assert.strictEqual(T.get('voice'), 'Google US English');
  assert.strictEqual(T.lastFallback().to.voice, 'Google US English');
});

test('a browser voice that errors: the next voice of the device in its language reads on', async () => {
  const { T, spoken } = page({ failingDevice: ['Google US English'] });
  T.set('voice', 'Google US English');
  const events = await read(T);
  assert.deepStrictEqual(spoken, [
    'browser:Google US English:failed', 'browser:Samantha:One here.', 'browser:Samantha:Two here.', 'browser:Samantha:Three here.',
  ]);
  assert.strictEqual(events.error.length, 0);
  assert.strictEqual(events.fallback[0].note, 'Google US English did not work; reading with Samantha.');
});

test('a browser voice the device does not have: the browser\'s default reads instead', async () => {
  const { T, spoken } = page();
  T.set('voice', 'Moira');
  const events = await read(T);
  assert.deepStrictEqual(spoken.slice(0, 1), ['browser:Google US English:One here.']);
  assert.strictEqual(events.fallback.length, 1);
  assert.match(events.fallback[0].error, /not on this device/);
});

test('mode browser: straight to the browser\'s default, no other Gemini voice tried', async () => {
  const { T, spoken } = page({ fallback: 'browser', defaultEngine: 'gemini', failingGemini: ['Puck', 'Kore'] });
  T.select('gemini');
  T.set('voice', 'Puck');
  await read(T);
  assert.deepStrictEqual(spoken.slice(0, 2), ['gemini:Puck:failed', 'browser:Google US English:One here.']);
});

test('mode off, or a page without the fallback: reading stops with the error, as before', async () => {
  for (const opts of [{ fallback: 'off' }, { withFallback: false }]) {
    const { T, spoken, info } = page({ ...opts, defaultEngine: 'gemini', failingGemini: ['Puck'] });
    T.select('gemini');
    T.set('voice', 'Puck');
    const events = await read(T);
    assert.deepStrictEqual(spoken, ['gemini:Puck:failed']);
    assert.strictEqual(events.error.length, 1);
    assert.strictEqual(events.fallback.length, 0);
    assert.deepStrictEqual(info, []);
    assert.strictEqual(T.selected(), 'gemini');
  }
});

test('the reader choosing an engine forgets the fallback', async () => {
  const { T } = page({ defaultEngine: 'gemini', failingGemini: ['Puck', 'Kore'] });
  T.select('gemini');
  T.set('voice', 'Puck');
  await read(T);
  assert.ok(T.lastFallback());
  T.select('gemini');
  assert.strictEqual(T.lastFallback(), null);
});

// One reading on the page (tts.js), as a card's strip and the reader's
// transport share it: play() says where it is reading (target()) and what
// it is doing (state()); a play on another container ends the reading going
// and starts there; a play on the container paused in reads on; set() says
// so ('paramChanged'), so every view of the voice follows. On a sandbox with
// a stand-in speechSynthesis whose sentences end when the test says.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const TTS_SRC = fs.readFileSync(path.join(ROOT, 'tts.js'), 'utf8');

const DEVICE_VOICES = [{ name: 'Samantha', lang: 'en-US', default: true }];

// A page: the sandbox, what was spoken, and finish(), which ends the
// sentence being spoken.
function page() {
  const spoken = [];
  let current = null;
  const synth = {
    getVoices: () => DEVICE_VOICES,
    addEventListener: () => {},
    cancel: () => { current = null; }, pause: () => {}, resume: () => {},
    speak(utt) { current = utt; spoken.push(utt.text); },
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
    console: { info() {}, log() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, Promise,
    speechSynthesis: synth,
    SpeechSynthesisUtterance: function (text) { this.text = text; },
    document, NodeFilter,
  };
  sandbox.window = sandbox;
  sandbox.TTS_CONFIG = { exposedEngines: ['browser'], defaultEngine: 'browser', lang: 'en', preferredVoices: ['Samantha'], fallback: 'off' };
  vm.createContext(sandbox);
  vm.runInContext(TTS_SRC, sandbox);
  const finish = async () => { const u = current; current = null; if (u) u.onend(); await tick(); };
  return { T: sandbox.TTS, spoken, finish };
}

// A body of text: the reader's, or a card's.
function body(name) {
  const container = { name, tagName: 'DIV', scrollTop: 0, getBoundingClientRect: () => ({ top: 0, height: 600 }), scrollTo() {} };
  const p = { tagName: 'P', parentElement: container, style: { removeProperty() {} }, dataset: {}, getBoundingClientRect: () => ({ top: 0, height: 20 }), closest: () => null };
  container._textNodes = [{ nodeType: 3, textContent: `${name} one. ${name} two.`, parentElement: p }];
  return container;
}

// Lets the promises inside tts.js settle.
const tick = () => new Promise((r) => setTimeout(r, 5));

test('play() says where it reads and what it does; stop() clears both', async () => {
  const { T, spoken, finish } = page();
  const reader = body('reader');
  assert.strictEqual(T.state(), 'stopped');
  assert.strictEqual(T.target(), null);
  const states = [];
  T.on('state', (s) => states.push(s));
  T.play(reader, { scrollContainer: reader });
  await tick();
  assert.strictEqual(T.state(), 'playing');
  assert.strictEqual(T.target(), reader);
  assert.deepStrictEqual(spoken, ['reader one.']);
  T.pause();
  assert.strictEqual(T.state(), 'paused');
  assert.strictEqual(T.target(), reader, 'paused, it is still the reader\'s');
  T.resume();
  assert.strictEqual(T.state(), 'playing');
  await finish();
  await finish();
  assert.strictEqual(T.state(), 'stopped');
  assert.strictEqual(T.target(), null);
  assert.deepStrictEqual(spoken, ['reader one.', 'reader two.']);
  // The first start says 'loading' twice (play, then the engine's start).
  const run = states.filter((st, i) => st !== states[i - 1]);
  assert.deepStrictEqual(run, ['loading', 'playing', 'paused', 'playing', 'stopped']);
});

test('a play on another container ends the reading going and reads there, once', async () => {
  const { T, spoken, finish } = page();
  const card = body('card');
  const reader = body('reader');
  T.play(card, { scrollContainer: card });
  await tick();
  assert.deepStrictEqual(spoken, ['card one.']);
  // Reading the card; the reader's Play: the reader, from its start.
  T.play(reader, { scrollContainer: reader });
  await tick();
  assert.strictEqual(T.target(), reader);
  assert.strictEqual(T.state(), 'playing');
  await finish();
  await finish();
  await tick();
  assert.deepStrictEqual(spoken, ['card one.', 'reader one.', 'reader two.'], 'the card\'s loop does not read on beside the reader\'s');
  assert.strictEqual(T.state(), 'stopped');
});

test('paused in one container, play() there reads on; play() elsewhere starts there', async () => {
  const { T, spoken, finish } = page();
  const card = body('card');
  const other = body('other');
  T.play(card, { scrollContainer: card });
  await tick();
  T.pause();
  // The reader's transport, paused: play() with its own container or none
  // reads on where it was paused.
  T.play(card, { scrollContainer: card });
  await tick();
  assert.strictEqual(T.state(), 'playing');
  assert.strictEqual(T.target(), card);
  assert.deepStrictEqual(spoken, ['card one.'], 'reading on, not from the start');
  T.pause();
  T.play();
  await tick();
  assert.strictEqual(T.target(), card);
  assert.deepStrictEqual(spoken, ['card one.']);
  // Paused in the card, another card's play: that card, from its start.
  T.pause();
  T.play(other, { scrollContainer: other });
  await tick();
  assert.strictEqual(T.target(), other);
  assert.deepStrictEqual(spoken, ['card one.', 'other one.']);
  await finish();
  await finish();
  await tick();
  assert.deepStrictEqual(spoken, ['card one.', 'other one.', 'other two.']);
});

test('set() says what changed, so every view of the voice follows', () => {
  const { T } = page();
  const heard = [];
  T.on('paramChanged', (p) => heard.push(p));
  T.set('speed', 1.5);
  T.set('voice', 'Samantha');
  // Through JSON: the events are objects of the sandbox's realm.
  assert.deepStrictEqual(JSON.parse(JSON.stringify(heard)), [{ key: 'speed', value: 1.5 }, { key: 'voice', value: 'Samantha' }]);
  assert.strictEqual(T.get('speed'), 1.5);
});

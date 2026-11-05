// Listening in the card (src/lib/listenInCard.js): the setting, and what the
// card's play and stop buttons do against the one reading, on a stand-in
// window.TTS that records what it was told.

const { test } = require('node:test');
const assert = require('node:assert');
const { listenInCard, listenState, toggleListen, stopListening } = require('../src/lib/listenInCard');

// A stand-in for window.TTS: one reading, where it is and what it does.
function fakeTTS() {
  const calls = [];
  let state = 'stopped';
  let target = null;
  return {
    calls,
    state: () => state,
    target: () => target,
    play(body, opts) { calls.push(['play', body, opts]); target = body; state = 'playing'; },
    pause() { calls.push(['pause']); state = 'paused'; },
    resume() { calls.push(['resume']); state = 'playing'; },
    stop() { calls.push(['stop']); state = 'stopped'; target = null; },
    _set(s) { state = s; },
  };
}

test('cards.listen is on unless a site turns it off', () => {
  for (const s of [undefined, null, {}, { cards: {} }, { cards: { listen: true } }, { cards: { listen: 'yes' } }]) {
    assert.strictEqual(listenInCard(s), true);
  }
  assert.strictEqual(listenInCard({ cards: { listen: false } }), false);
});

test('a card is off unless the reading is its own', () => {
  const T = fakeTTS();
  const a = { id: 'a' };
  const b = { id: 'b' };
  assert.strictEqual(listenState(T, a), 'off');
  assert.strictEqual(listenState(null, a), 'off');
  assert.strictEqual(listenState(T, null), 'off');
  T.play(a, {});
  assert.strictEqual(listenState(T, a), 'playing');
  assert.strictEqual(listenState(T, b), 'off');
  T._set('loading');
  assert.strictEqual(listenState(T, a), 'loading');
  T.pause();
  assert.strictEqual(listenState(T, a), 'paused');
  T.stop();
  assert.strictEqual(listenState(T, a), 'off');
});

test('the play button reads, pauses, reads on, and takes the reading from another card', () => {
  const T = fakeTTS();
  const a = { id: 'a' };
  const b = { id: 'b' };
  assert.strictEqual(toggleListen(T, a), 'play');
  assert.deepStrictEqual(T.calls[0], ['play', a, { scrollContainer: a }]);
  assert.strictEqual(toggleListen(T, a), 'pause');
  assert.strictEqual(toggleListen(T, a), 'resume');
  // Reading a: b's play starts b (tts.js ends a's reading itself).
  assert.strictEqual(toggleListen(T, b), 'play');
  assert.strictEqual(T.target(), b);
  // Paused in b: a's play starts a, not b.
  T.pause();
  assert.strictEqual(toggleListen(T, a), 'play');
  assert.strictEqual(T.target(), a);
  assert.strictEqual(toggleListen(null, a), null);
  assert.strictEqual(toggleListen(T, null), null);
});

test('the play button passes its options on to play()', () => {
  const T = fakeTTS();
  const a = { id: 'a' };
  const scroller = { id: 'scroller' };
  toggleListen(T, a, { scrollContainer: scroller });
  assert.deepStrictEqual(T.calls[0], ['play', a, { scrollContainer: scroller }]);
});

test('the stop button ends only its own reading', () => {
  const T = fakeTTS();
  const a = { id: 'a' };
  const b = { id: 'b' };
  assert.strictEqual(stopListening(T, a), false);
  T.play(a, {});
  assert.strictEqual(stopListening(T, b), false);
  assert.strictEqual(T.state(), 'playing');
  assert.strictEqual(stopListening(T, a), true);
  assert.strictEqual(T.state(), 'stopped');
  T.play(a, {});
  T.pause();
  assert.strictEqual(stopListening(T, a), true);
});

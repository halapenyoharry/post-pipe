// Listening in the card: the setting that puts the voice's controls inside
// an open card, and what its play button does against the one reading
// (window.TTS). Pure, so the card's strip, the graph's node.listen action
// and the tests agree. The reading itself, its highlight and its scroll are
// tts.js's, the same for the reader's body and a card's text: play() is
// handed the card's text and does there what it does in the reader.

// settings.cards.listen: whether an open card holds the listening controls
// (play or pause, stop, the voice and the speed as the panel has them).
// Default true; false leaves them out, and the reader's own stay.
function listenInCard(settings) {
  return !(settings && settings.cards && settings.cards.listen === false);
}

// What the reading is doing in this body: 'playing', 'paused' or 'loading'
// when it is this body being read, else 'off' (stopped, or reading another).
function listenState(T, body) {
  if (!T || !body) return 'off';
  const mine = typeof T.target === 'function' && T.target() === body;
  if (!mine) return 'off';
  const s = typeof T.state === 'function' ? T.state() : 'stopped';
  return s === 'stopped' ? 'off' : s;
}

// The play button: reading this body, pause; paused in it, read on; else
// read it from its start (a reading elsewhere ends). Returns what it did:
// 'pause', 'resume', 'play', or null with nothing to act on. opts go to
// play() (scrollContainer: the element that scrolls to keep the sentence
// in view; the body itself when not given).
function toggleListen(T, body, opts) {
  if (!T || !body) return null;
  const s = listenState(T, body);
  if (s === 'playing' || s === 'loading') { T.pause(); return 'pause'; }
  if (s === 'paused') { T.resume(); return 'resume'; }
  T.play(body, Object.assign({ scrollContainer: body }, opts || {}));
  return 'play';
}

// The stop button: ends the reading only when it is this body's. Returns
// whether it stopped anything.
function stopListening(T, body) {
  if (listenState(T, body) === 'off') return false;
  T.stop();
  return true;
}

module.exports = { listenInCard, listenState, toggleListen, stopListening };

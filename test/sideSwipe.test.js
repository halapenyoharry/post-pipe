// Turning the reader's card with a sideways gesture (sideSwipe.js): a
// trackpad's two-finger swipe, added up through one gesture and turning the
// card once, and a finger on a touch screen that the card follows.

const test = require('node:test');
const assert = require('node:assert');
const {
  TURN_PX, QUIET_MS, SWIPE_PX, wheelPixels, createWheelTurn, touchIntent, touchTurn, followOffset,
} = require('../src/lib/sideSwipe');

// A run of wheel events 16 ms apart from time t0: each [deltaX, deltaY],
// with extra fields for all of them. Gives the turns, in order.
function run(w, deltas, { t0 = 0, gap = 16, ...extra } = {}) {
  const turns = [];
  deltas.forEach(([dx, dy], i) => {
    const out = w.wheel({ deltaX: dx, deltaY: dy, deltaMode: 0, ...extra }, t0 + i * gap);
    if (out.turn) turns.push(out.turn);
  });
  return turns;
}
const times = (n, d) => Array.from({ length: n }, () => d);

// ── The trackpad ────────────────────────────────────────────────────────────

test('the thresholds: about 100 px for a turn, 300 ms of quiet between gestures', () => {
  assert.strictEqual(TURN_PX, 100);
  assert.strictEqual(QUIET_MS, 300);
});

test('a sideways swipe adds up through the gesture and turns past 100 px: next for deltaX > 0, previous for < 0', () => {
  const w = createWheelTurn();
  // 30 + 30 + 30 is not yet a turn; the fourth event carries it past 100.
  assert.deepStrictEqual(run(w, times(3, [30, 0])), []);
  assert.deepStrictEqual(run(w, [[30, 0]], { t0: 48 }), ['next']);
  const b = createWheelTurn();
  assert.deepStrictEqual(run(b, times(4, [-30, 2])), ['prev']);
});

test('one turn per gesture: the rest of it, coasting included, is let pass until 300 ms of quiet', () => {
  const w = createWheelTurn();
  // A long swipe with its coasting tail: one turn.
  assert.deepStrictEqual(run(w, [...times(20, [40, 0]), ...times(30, [6, 0]), ...times(10, [1, 0])]), ['next']);
  // Still within 300 ms of the last event: nothing.
  assert.deepStrictEqual(run(w, times(5, [40, 0]), { t0: 59 * 16 + 200 }), []);
  // After quiet, a new gesture turns again.
  const t = 59 * 16 + 200 + 4 * 16 + QUIET_MS + 1;
  assert.deepStrictEqual(run(w, times(5, [40, 0]), { t0: t }), ['next']);
});

test('quiet between two short swipes starts the count again', () => {
  const w = createWheelTurn();
  assert.deepStrictEqual(run(w, [[60, 0]]), []);
  assert.deepStrictEqual(run(w, [[60, 0]], { t0: 400 }), []);
  // Close enough together, they are one gesture.
  const v = createWheelTurn();
  assert.deepStrictEqual(run(v, [[60, 0], [60, 0]], { gap: 200 }), ['next']);
});

test('a vertical scroll never turns the card, however long, and its own sideways drift does not either', () => {
  const w = createWheelTurn();
  assert.deepStrictEqual(run(w, times(200, [8, 40])), []);
  // Mostly vertical, with now and then an event that leans sideways.
  const v = createWheelTurn();
  const drift = [];
  for (let i = 0; i < 120; i++) drift.push(i % 6 === 0 ? [12, 4] : [3, 30]);
  assert.deepStrictEqual(run(v, drift), []);
  // A vertical event is never claimed from the browser.
  assert.strictEqual(createWheelTurn().wheel({ deltaX: 2, deltaY: 30 }, 0).claim, false);
});

test('a sideways event is claimed while the gesture is sideways, and not in a gesture that is a scroll', () => {
  const w = createWheelTurn();
  assert.strictEqual(w.wheel({ deltaX: 20, deltaY: 1 }, 0).claim, true);
  const v = createWheelTurn();
  run(v, times(10, [0, 40]));
  assert.strictEqual(v.wheel({ deltaX: 20, deltaY: 1 }, 170).claim, false);
});

test('ctrl or meta held (a pinch, a zoom) is no part of a swipe', () => {
  const w = createWheelTurn();
  assert.deepStrictEqual(run(w, times(10, [40, 0]), { ctrlKey: true }), []);
  assert.deepStrictEqual(run(w, times(10, [40, 0]), { metaKey: true, t0: 1000 }), []);
  assert.deepStrictEqual(w.wheel({ deltaX: 400, deltaY: 0, ctrlKey: true }, 2000), { turn: null, claim: false });
});

test('a gesture that starts inside something that scrolls sideways is left to it, whole', () => {
  const w = createWheelTurn();
  // Starts in a wide table, then runs on outside it: still the table's.
  assert.deepStrictEqual(run(w, [[40, 0], [40, 0]], { aside: true }), []);
  assert.deepStrictEqual(run(w, times(10, [40, 0]), { t0: 32 }), []);
  assert.strictEqual(w.wheel({ deltaX: 40, deltaY: 0, aside: false }, 200).claim, false);
  // The next gesture, after quiet, starting on the text, turns.
  assert.deepStrictEqual(run(w, times(5, [40, 0]), { t0: 600 }), ['next']);
});

test('lines and pages are counted in pixels', () => {
  assert.strictEqual(wheelPixels(3, 1), 48);
  assert.strictEqual(wheelPixels(1, 2), 800);
  assert.strictEqual(wheelPixels(-12, 0), -12);
  assert.strictEqual(wheelPixels(undefined, 0), 0);
  const w = createWheelTurn();
  assert.strictEqual(w.wheel({ deltaX: 3, deltaY: 0, deltaMode: 1 }, 0).turn, null);
  assert.strictEqual(w.wheel({ deltaX: 4, deltaY: 0, deltaMode: 1 }, 16).turn, 'next');
});

test('reset forgets the gesture', () => {
  const w = createWheelTurn();
  assert.deepStrictEqual(run(w, times(5, [40, 0])), ['next']);
  w.reset();
  assert.deepStrictEqual(run(w, times(5, [40, 0]), { t0: 100 }), ['next']);
});

// ── A finger ────────────────────────────────────────────────────────────────

test('a drag is decided once the finger has moved 10 px: sideways is followed, the rest is a scroll', () => {
  assert.strictEqual(touchIntent({ dx: 6, dy: 2, held: 50 }), null);
  assert.strictEqual(touchIntent({ dx: -24, dy: 5, held: 80 }), 'follow');
  assert.strictEqual(touchIntent({ dx: 30, dy: 14, held: 80 }), 'follow');
  assert.strictEqual(touchIntent({ dx: 20, dy: 12, held: 80 }), 'none', 'not sideways enough');
  assert.strictEqual(touchIntent({ dx: 3, dy: -40, held: 80 }), 'none');
  // A finger that rested first is a long press, a selection's start.
  assert.strictEqual(touchIntent({ dx: -40, dy: 0, held: 650 }), 'none');
});

test('a followed drag turns past 70 px, however slow; short of it the card goes back', () => {
  assert.strictEqual(SWIPE_PX, 70);
  assert.strictEqual(touchTurn({ dx: -80, dy: 10, dt: 2500, followed: true }), 'next');
  assert.strictEqual(touchTurn({ dx: 90, dy: 0, dt: 300, followed: true }), 'prev');
  assert.strictEqual(touchTurn({ dx: -60, dy: 0, dt: 300, followed: true }), null);
  // Dragged out and back again: where it ends counts.
  assert.strictEqual(touchTurn({ dx: -20, dy: 0, dt: 900, followed: true }), null);
  assert.strictEqual(touchTurn({ dx: -80, dy: 90, dt: 400, followed: true }), null);
});

test('without following, the quick flick of the reader\'s swipe still turns, as it always did', () => {
  assert.strictEqual(touchTurn({ dx: -80, dy: 20, dt: 300, followed: false }), 'next');
  assert.strictEqual(touchTurn({ dx: 80, dy: 0, dt: 700, followed: false }), 'prev');
  assert.strictEqual(touchTurn({ dx: -80, dy: 0, dt: 701, followed: false }), null, 'too slow');
  assert.strictEqual(touchTurn({ dx: -80, dy: 41, dt: 300, followed: false }), null, 'too vertical');
  assert.strictEqual(touchTurn({ dx: -69, dy: 0, dt: 200, followed: false }), null, 'too short');
});

test('the card goes with the finger toward a card, a quarter as far toward none', () => {
  assert.strictEqual(followOffset(-120, true), -120);
  assert.strictEqual(followOffset(-120, false), -30);
  assert.strictEqual(followOffset(40, false), 10);
  assert.strictEqual(followOffset(undefined, true), 0);
});

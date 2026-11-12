// sideSwipe.js — turning the reader's card with a sideways gesture. Harold,
// 2026-11-11: "For reading: one card fills the screen. Swipe sideways for
// the next or previous card, scroll down to read the one you're in. [...]
// This is the same on phones and on desktop, and it means one solution for
// every site."
//
// Two gestures, the same turn (the reader's goStep, as Next and Previous):
//
// A trackpad's two-finger sideways swipe (createWheelTurn). It arrives as
// wheel events. The deltaX of the events in which it outweighs deltaY is
// added up through one gesture, and the deltaY of the others apart; past
// TURN_PX of sideways travel, and more sideways than up and down, the card
// turns: next for deltaX > 0 (the fingers moving left, as a page is turned),
// previous for deltaX < 0. One gesture is a run of wheel events with no
// QUIET_MS gap; it turns the card once, and every event after the turn,
// the trackpad's own coasting included, is let pass until that quiet. A
// wheel event with ctrl or meta held (a pinch, a zoom) is no part of it. A
// gesture that starts inside something that itself scrolls sideways (a wide
// table, a code block) is left to it, whole, even once it reaches its end.
//
// A finger on a touch screen (touchIntent, touchTurn, followOffset). The
// card follows the finger while a sideways drag is under way, and past
// SWIPE_PX the page turns, otherwise the card eases back; the reader draws
// it. A drag is decided the first time the finger has moved SLOP_PX: a
// mostly sideways one (sideways more than twice up and down) is followed,
// anything else is a scroll and left alone, and so is a finger that rested
// LONG_PRESS_MS first (a long press, which starts a text selection). Where
// a drag is not followed (reduced motion, or it was not decided sideways),
// a quick flick still turns the page as the reader's swipe always did:
// within FLICK_MS, at least SWIPE_PX sideways and up and down at most half
// of that. The reader also stands aside for a selection made, for a drag on
// the text while the follow-along highlighter is on, and for a drag inside
// something that scrolls sideways; those are read from the page, not here.
//
// Pure: times come in as numbers, so it is tested without a DOM or timers.

const TURN_PX = 100;
const QUIET_MS = 300;

const SWIPE_PX = 70;
const FLICK_MS = 700;
const SLOP_PX = 10;
const LONG_PRESS_MS = 500;
// How far the card goes with the finger toward a side with no card: a
// quarter of the drag, so it gives a little and comes back.
const EDGE_GIVE = 0.25;

// A wheel delta in pixels: deltaMode 1 counts lines, 2 pages.
function wheelPixels(delta, mode) {
  const d = Number(delta) || 0;
  if (mode === 1) return d * 16;
  if (mode === 2) return d * 800;
  return d;
}

// One reader's trackpad gesture state. wheel(event, now) takes a wheel
// event's { deltaX, deltaY, deltaMode, ctrlKey, metaKey } and aside (the
// event starts inside something that scrolls sideways), at time now (ms),
// and gives { turn, claim }: turn 'next', 'prev' or null; claim true when
// the event is the gesture's own (sideways, and the gesture sideways so
// far), so the page may keep it from the browser's own back and forward.
function createWheelTurn({ turnPx = TURN_PX, quietMs = QUIET_MS } = {}) {
  let last = -Infinity;
  let sumX = 0;
  let sumY = 0;
  let done = false;
  let aside = false;
  return {
    wheel(e, now) {
      if (!e || e.ctrlKey || e.metaKey) return { turn: null, claim: false };
      const t = Number(now) || 0;
      if (t - last > quietMs) {
        sumX = 0;
        sumY = 0;
        done = false;
        aside = !!e.aside;
      }
      last = t;
      if (aside) return { turn: null, claim: false };
      const dx = wheelPixels(e.deltaX, e.deltaMode);
      const dy = wheelPixels(e.deltaY, e.deltaMode);
      const sideways = Math.abs(dx) > Math.abs(dy);
      if (done) return { turn: null, claim: sideways };
      if (sideways) sumX += dx;
      else sumY += Math.abs(dy);
      const claim = sideways && Math.abs(sumX) >= sumY;
      if (Math.abs(sumX) >= turnPx && Math.abs(sumX) > sumY) {
        done = true;
        return { turn: sumX > 0 ? 'next' : 'prev', claim: true };
      }
      return { turn: null, claim };
    },
    // Forget the gesture (a new card, the reader closed).
    reset() {
      last = -Infinity;
      sumX = 0;
      sumY = 0;
      done = false;
      aside = false;
    },
  };
}

// What a touch drag is, once decided: 'follow' (mostly sideways: the card
// follows the finger), 'none' (a scroll, or a long press), or null while
// the finger has not yet moved SLOP_PX. held: ms from the touch's start to
// this move.
function touchIntent({ dx, dy, held }) {
  const ax = Math.abs(Number(dx) || 0);
  const ay = Math.abs(Number(dy) || 0);
  if (Math.max(ax, ay) < SLOP_PX) return null;
  if ((Number(held) || 0) > LONG_PRESS_MS) return 'none';
  return ax > ay * 2 ? 'follow' : 'none';
}

// Where a touch drag ends: 'next' (the finger went left), 'prev', or null.
// followed: the card was following the finger, so a slow drag counts too:
// past SWIPE_PX sideways, and more sideways than up and down. Otherwise the
// quick flick of the reader's swipe: within FLICK_MS, SWIPE_PX sideways, up
// and down at most half of it.
function touchTurn({ dx, dy, dt, followed }) {
  const x = Number(dx) || 0;
  const ax = Math.abs(x);
  const ay = Math.abs(Number(dy) || 0);
  if (ax < SWIPE_PX) return null;
  if (followed) {
    if (ay >= ax) return null;
  } else if ((Number(dt) || 0) > FLICK_MS || ay > ax * 0.5) {
    return null;
  }
  return x < 0 ? 'next' : 'prev';
}

// How far the card is drawn with the finger: the drag itself toward a side
// with a card to turn to (canGo), a quarter of it toward one without.
function followOffset(dx, canGo) {
  const x = Number(dx) || 0;
  return canGo ? x : x * EDGE_GIVE;
}

module.exports = {
  TURN_PX, QUIET_MS, SWIPE_PX, FLICK_MS, SLOP_PX, LONG_PRESS_MS, EDGE_GIVE,
  wheelPixels, createWheelTurn, touchIntent, touchTurn, followOffset,
};

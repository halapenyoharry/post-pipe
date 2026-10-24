// One wheel click is one step. d3.zoom scales by 2^delta for each wheel
// event, with its default delta
//
//   -deltaY * (deltaMode === 1 ? 0.05 : deltaMode ? 1 : 0.002) * (ctrlKey ? 10 : 1)
//
// which is fine for a trackpad (many small deltas) and far too much for a
// mouse in Chrome, where one click can report hundreds of pixels: a single
// click took the graph from cards to dots. The delta is kept, but no one
// event may move the scale by more than 2^WHEEL_STEP_MAX (about 1.25x in
// or 0.8x out). A trackpad's small deltas stay under the cap and scroll as
// smoothly as before; a pinch (ctrlKey in Chrome and Safari) still gets its
// 10x, capped the same way per event.
//
// Pure, so it can be tested without the DOM.

const WHEEL_STEP_MAX = 0.32;

function wheelDelta(event, maxStep = WHEEL_STEP_MAX) {
  const unit = event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002;
  const raw = -event.deltaY * unit * (event.ctrlKey ? 10 : 1);
  if (!Number.isFinite(raw)) return 0;
  return Math.max(-maxStep, Math.min(maxStep, raw));
}

module.exports = { wheelDelta, WHEEL_STEP_MAX };

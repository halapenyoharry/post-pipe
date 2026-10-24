// The chronology stack (settings.timeOverlay): the months-by-week panel down
// the left of the graph page, src/components/TimeOverlay.
//
//   "timeOverlay": { "show": true }
//
// show true (default): the stack is on the page, as it always was. show
// false: the page is generated without it, not hidden, not mounted at all.
// generate-index.js reads this at build time.

// settings.timeOverlay with its default.
function timeOverlayConfig(settings) {
  const t = (settings && settings.timeOverlay && typeof settings.timeOverlay === 'object') ? settings.timeOverlay : {};
  return { show: t.show !== false };
}

module.exports = { timeOverlayConfig };

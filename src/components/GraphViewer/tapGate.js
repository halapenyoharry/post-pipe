// One tap or two. tap(x, y, single, double) runs `single` once `ms` have
// passed with no second tap, or a double at once when a second tap lands
// within `ms` and `px` of the first; neither tap's `single` then runs. The
// double is the first tap's (it says what was double-tapped: a double tap
// that starts on a card is on that card though the second tap lands just
// off it), or the second's when the first gave none. A tap somewhere else
// settles the earlier one as single straight away.
// Timers and the clock are injectable so the timing can be tested.

function createTapGate({ ms = 250, px = 32, now = () => Date.now(), setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  let pending = null; // { t, x, y, timer, run, double }

  function tap(x, y, single, double) {
    const t = now();
    if (pending && t - pending.t <= ms && Math.hypot(x - pending.x, y - pending.y) <= px) {
      clearTimer(pending.timer);
      const first = pending.double;
      pending = null;
      const run = first || double;
      if (run) run();
      return 'double';
    }
    if (pending) {
      clearTimer(pending.timer);
      const run = pending.run;
      pending = null;
      run();
    }
    const entry = { t, x, y, run: single, double };
    entry.timer = setTimer(() => {
      if (pending === entry) pending = null;
      single();
    }, ms);
    pending = entry;
    return 'pending';
  }

  function cancel() {
    if (pending) clearTimer(pending.timer);
    pending = null;
  }

  return { tap, cancel };
}

module.exports = { createTapGate };

// One tap or two. tap(x, y, single, double) runs `single` once `ms` have
// passed with no second tap, or `double` at once when a second tap lands
// within `ms` and `px` of the first; the first tap's `single` then never
// runs. A tap somewhere else settles the earlier one as single straight away.
// Timers and the clock are injectable so the timing can be tested.

function createTapGate({ ms = 250, px = 32, now = () => Date.now(), setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
  let pending = null; // { t, x, y, timer, run }

  function tap(x, y, single, double) {
    const t = now();
    if (pending && t - pending.t <= ms && Math.hypot(x - pending.x, y - pending.y) <= px) {
      clearTimer(pending.timer);
      pending = null;
      if (double) double();
      return 'double';
    }
    if (pending) {
      clearTimer(pending.timer);
      const run = pending.run;
      pending = null;
      run();
    }
    const entry = { t, x, y, run: single };
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

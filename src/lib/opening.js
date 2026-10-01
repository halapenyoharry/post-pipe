// The opening (settings.opening): the site starts on a full-viewport image,
// and on a tap, a scroll, a key or a dwell the image breaks up (an optional
// broken-up version, then a blur) and fades while the graph's roots draw in
// behind it. Pure, so it can be tested: the settings with their defaults,
// whether a reader sees it at all, and the state machine with its timings.
// Timers are injectable.

// Every duration of the play, in one place (ms).
const TIMINGS = {
  swapMs: 250,          // the image crossfades to the broken-up version
  dissolveMs: 1350,     // then the blur ramps up and the layer fades out
  reducedFadeMs: 300,   // reduced motion: one plain fade, nothing else
  rootsDrawMs: 1400,    // each root's draw-in while the image dissolves
  rootsSpreadMs: 600,   // the farthest root starts this long after the nearest
  rootsHoldMs: 1600,    // roots this reader has not reached stay this long after the play
  rootsRecedeMs: 1400,  // then fade back out
};

// Where the roots start when the opening plays from the bottom of the
// viewport: the middle, a little below centre, where a cover's roots sit.
const VIEWPORT_ORIGIN = { x: 0.5, y: 0.6 };

const DEFAULTS = {
  enabled: false,
  image: '',
  broken: '',
  blur: 9,
  alt: '',
  dwellMs: 3200,
  once: true,
  byline: { text: '', href: '' },
  skipLabel: 'Skip',
};

// settings.opening with its defaults, or null when it is off or has no image.
function openingConfig(settings) {
  const o = settings && settings.opening;
  if (!o || o.enabled !== true || typeof o.image !== 'string' || !o.image) return null;
  const num = (v, d) => (Number.isFinite(Number(v)) && v !== '' && v !== null ? Number(v) : d);
  const byline = o.byline && typeof o.byline === 'object' ? o.byline : {};
  return {
    enabled: true,
    image: o.image,
    broken: typeof o.broken === 'string' ? o.broken : '',
    blur: Math.max(0, num(o.blur, DEFAULTS.blur)),
    alt: typeof o.alt === 'string' ? o.alt : '',
    dwellMs: Math.max(0, num(o.dwellMs, DEFAULTS.dwellMs)),
    once: o.once !== false,
    byline: {
      text: typeof byline.text === 'string' ? byline.text : '',
      href: typeof byline.href === 'string' ? byline.href : '',
    },
    skipLabel: typeof o.skipLabel === 'string' && o.skipLabel ? o.skipLabel : DEFAULTS.skipLabel,
  };
}

// Anything this reader has left on this site: having seen the opening, a
// chapter opened or read into, a reading position, a bookmark, or a card
// they placed themselves.
function hasStoredUsage(state) {
  if (!state || typeof state !== 'object') return false;
  if (state.opening && state.opening.seenAt) return true;
  if (Array.isArray(state.bookmarks) && state.bookmarks.length) return true;
  for (const r of Object.values(state.reading || {})) {
    if (r && (r.seenAt || Number(r.scroll) > 0 || Number(r.max) > 0 || r.done)) return true;
  }
  for (const n of Object.values(state.nodes || {})) {
    if (n && !n.auto) return true;
  }
  return false;
}

// Whether the page starts with the opening. A link straight to a chapter
// (#read=) goes to the chapter.
function shouldShowOpening(config, { state, hash } = {}) {
  if (!config) return false;
  if (typeof hash === 'string' && hash.startsWith('#read=')) return false;
  if (config.once && hasStoredUsage(state)) return false;
  return true;
}

// The play as steps: what the layer shows from each moment on.
//   phase 'broken'   the broken-up image is showing (crossfading in)
//   phase 'dissolve' the blur ramps up and the layer fades out
//   phase 'fade'     reduced motion: the layer fades, nothing else
function playSteps(config, { reducedMotion = false } = {}) {
  if (reducedMotion) return [{ phase: 'fade', at: 0, ms: TIMINGS.reducedFadeMs }];
  const steps = [];
  let at = 0;
  if (config && config.broken) {
    steps.push({ phase: 'broken', at, ms: TIMINGS.swapMs });
    at += TIMINGS.swapMs;
  }
  steps.push({ phase: 'dissolve', at, ms: TIMINGS.dissolveMs });
  return steps;
}

function playDuration(config, opts) {
  const steps = playSteps(config, opts);
  const last = steps[steps.length - 1];
  return last.at + last.ms;
}

// idle -> playing -> done, or idle/playing -> done at once by skip.
//   onState(state, info)   every change; info.phase on each step while playing
//   play(cause)            tap, wheel, touch, key or dwell; only from idle
//   skip()                 straight to done
//   start()                arms the dwell timer
function createOpening(config, {
  reducedMotion = false,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  onState = () => {},
} = {}) {
  let state = 'idle';
  let cause = null;
  let dwell = null;
  let timers = [];

  function clearAll() {
    if (dwell) { clearTimer(dwell); dwell = null; }
    for (const t of timers) clearTimer(t);
    timers = [];
  }

  function finish(how) {
    if (state === 'done') return false;
    clearAll();
    state = 'done';
    onState('done', { how, cause });
    return true;
  }

  function play(why) {
    if (state !== 'idle') return false;
    if (dwell) { clearTimer(dwell); dwell = null; }
    state = 'playing';
    cause = why || 'tap';
    onState('playing', { cause, reducedMotion, phase: null });
    for (const step of playSteps(config, { reducedMotion })) {
      const fire = () => { if (state === 'playing') onState('playing', { cause, reducedMotion, phase: step.phase, ms: step.ms }); };
      if (step.at === 0) fire();
      else timers.push(setTimer(fire, step.at));
    }
    timers.push(setTimer(() => finish('played'), playDuration(config, { reducedMotion })));
    return true;
  }

  function start() {
    if (state !== 'idle' || dwell || !config) return;
    dwell = setTimer(() => { dwell = null; play('dwell'); }, config.dwellMs);
  }

  return {
    get state() { return state; },
    get cause() { return cause; },
    start,
    play,
    skip: () => finish('skipped'),
    dispose: clearAll,
  };
}

module.exports = {
  TIMINGS, VIEWPORT_ORIGIN, DEFAULTS,
  openingConfig, hasStoredUsage, shouldShowOpening, playSteps, playDuration, createOpening,
};

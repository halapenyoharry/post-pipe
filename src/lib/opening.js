// The two-state page (settings.opening, mode 'two-state'): the page's top is
// the cover art, full size on a dark ground; below it hangs the graph. One
// progress value p runs between the two rests, art (0) and graph (1): the
// bush shrinks into a band across the top, the roots keep their size and rise
// under it, and the graph's top edge rises to meet the root tips. A reader can
// scrub partway; let go and it snaps to a rest. Nothing is unmounted: the
// graph is below the fold in the art state and exactly as it was on return.
//
// Pure, so it can be tested: the settings with their defaults, the geometry
// at any p, the state a page starts on, and the state machine that turns
// wheels, touches, keys and taps into p. Frames and the clock are injectable.

const DEFAULTS = {
  enabled: false,
  mode: 'two-state',
  art: { bush: '', roots: '', full: '' },
  alt: '',
  ground: 'dark',
  band: { height: 22, bushScale: 0.3 },
  byline: { text: '', href: '' },
  startOn: 'remembered',
  snapMs: 420,
};

const STATES = ['art', 'graph'];

// Tuning that is not a setting, in one place.
const TUNING = {
  pad: 16,               // px around the art in the art state
  bylineSpace: 52,       // px kept under the art for the byline
  bylineSize: 20,        // byline font size under the art, px
  bandBylineSize: 14,    // and in the band
  bandBylineGap: 14,     // px between the small plant and the byline
  wheelIdleMs: 140,      // no wheel for this long and the page snaps
  lineHeightPx: 40,      // a wheel's line (deltaMode 1) in px
  onward: 0.22,          // past this share of the way, a let-go goes on to the other rest
  flickPxPerMs: 0.35,    // a touch faster than this goes on, however short
  minSnapMs: 140,        // the shortest snap
  quietMs: 380,          // after a page move, the graph ignores wheels this long (trackpad momentum)
  edgePx: 28,            // in the graph state, a wheel up within this of the graph's top edge moves the page
  reducedFadeMs: 200,    // reduced motion: the states swap in one crossfade this long
  reducedWheelPx: 40,    // reduced motion: this much wheel or touch moves to the other state
};

const num = (v, d) => (v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v)) ? Number(v) : d);
const str = (v) => (typeof v === 'string' ? v : '');
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, t) => a + (b - a) * t;

// settings.opening with its defaults, or null when it is off, in another mode,
// or has no art.
function openingConfig(settings) {
  const o = settings && settings.opening;
  if (!o || o.enabled !== true) return null;
  if (o.mode !== undefined && o.mode !== 'two-state') return null;
  const art = o.art && typeof o.art === 'object' ? o.art : {};
  const bush = str(art.bush), roots = str(art.roots);
  if (!bush || !roots) return null;
  const band = o.band && typeof o.band === 'object' ? o.band : {};
  const byline = o.byline && typeof o.byline === 'object' ? o.byline : {};
  return {
    enabled: true,
    mode: 'two-state',
    art: { bush, roots, full: str(art.full) },
    alt: str(o.alt),
    ground: o.ground === 'paper' ? 'paper' : 'dark',
    band: {
      height: Math.max(5, Math.min(60, num(band.height, DEFAULTS.band.height))),
      bushScale: Math.max(0.05, Math.min(1, num(band.bushScale, DEFAULTS.band.bushScale))),
    },
    byline: { text: str(byline.text), href: str(byline.href) },
    startOn: ['remembered', 'art', 'graph'].includes(o.startOn) ? o.startOn : DEFAULTS.startOn,
    snapMs: Math.max(0, num(o.snapMs, DEFAULTS.snapMs)),
  };
}

// The state the page opens on. A link straight to a chapter (#read=) opens
// on the graph with the chapter; otherwise startOn, and for 'remembered' the
// state this reader left, or the art for a reader with no memory here.
function startState(config, { stored, hash } = {}) {
  if (!config) return 'graph';
  if (typeof hash === 'string' && hash.startsWith('#read=')) return 'graph';
  if (config.startOn === 'art' || config.startOn === 'graph') return config.startOn;
  return STATES.includes(stored) ? stored : 'art';
}

// Where everything is at progress p, in px, for a viewport (vw, vh) and the
// art's natural sizes (bush and roots, the same width, stacked). The art state
// fits the whole plant in the viewport, centred, with room for the byline
// under it. The graph state scales the bush by band.bushScale, anchored top
// centre in a band band.height tall; the roots keep their scale and sit right
// under the small bush; the graph's top is at the root tips.
//   bush, roots   { top, scale, width, height }: the image at its own scale
//                 (width and height are its box at that scale)
//   artTop, artHeight, artWidth   the art state's whole plant (for `full`)
//   graphTop      the graph section's top edge (the ground ends here)
//   graphRestTop  where the graph's top rests in the graph state
//   band          the band's height in the graph state
//   byline        { x, y, size, anchor }: the point (x, y) is the top of
//                 the text, `anchor` of its width to the right of x (0.5
//                 centred under the art, 0 starting there in the band)
function coverGeometry(config, { vw, vh, bush, roots }, p) {
  const t = clamp01(p);
  const T = TUNING;
  const bw = Math.max(1, (bush && bush.w) || 1), bh = Math.max(1, (bush && bush.h) || 1);
  const rw = Math.max(1, (roots && roots.w) || bw), rh = Math.max(1, (roots && roots.h) || 1);
  const naturalW = Math.max(bw, rw), naturalH = bh + rh;
  const hasByline = Boolean(config && config.byline && config.byline.text);
  const below = hasByline ? T.bylineSpace : 0;
  const pad = Math.min(T.pad, vh * 0.03);
  const scale0 = Math.max(0.01, Math.min((vh - 2 * pad - below) / naturalH, (vw - 2 * pad) / naturalW));
  const artHeight = naturalH * scale0, artWidth = naturalW * scale0;
  const artTop = Math.max(0, (vh - artHeight - below) / 2);
  const bushK = config ? config.band.bushScale : DEFAULTS.band.bushScale;
  const band = (config ? config.band.height : DEFAULTS.band.height) / 100 * vh;
  const scale1 = scale0 * bushK;
  const bushTop1 = Math.max(0, (band - bh * scale1) / 2);
  const rootsTop1 = bushTop1 + bh * scale1;
  const graphRestTop = rootsTop1 + rh * scale0;

  const bushScale = lerp(scale0, scale1, t);
  const bushTop = lerp(artTop, bushTop1, t);
  const rootsTop = lerp(artTop + bh * scale0, rootsTop1, t);
  const graphTop = lerp(vh, graphRestTop, t);

  // The byline: centred under the art, then to the right of the small plant,
  // level with it, smaller.
  const size = lerp(T.bylineSize, T.bandBylineSize, t);
  const x0 = vw / 2;
  const x1 = vw / 2 + (bw * scale1) / 2 + T.bandBylineGap;
  const y0 = artTop + artHeight + (below - T.bylineSize * 1.3) / 2;
  const y1 = bushTop1 + (bh * scale1) / 2 - (T.bandBylineSize * 1.3) / 2;

  return {
    p: t,
    vw, vh,
    bush: { top: bushTop, scale: bushScale, width: bw * bushScale, height: bh * bushScale },
    roots: { top: rootsTop, scale: scale0, width: rw * scale0, height: rh * scale0 },
    artTop, artHeight, artWidth,
    graphTop,
    graphRestTop,
    band,
    byline: { x: lerp(x0, x1, t), y: lerp(y0, y1, t), size, anchor: 0.5 * (1 - t) },
  };
}

const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// The state machine. p is the truth; a rest is where it settles.
//   onChange(p, info)   every change of p (info.swap: reduced motion jumped)
//   onRest(state)       settled at 'art' or 'graph' (also once at start)
// Inputs:
//   wheel(deltaY, { deltaMode, where })   where: 'stage' (the art or band),
//        'graph' (inside the graph), 'edge' (the graph's top edge); returns
//        true when the page took it (the caller then stops it)
//   touchStart(y), touchMove(y, t), touchEnd(t)   a drag on the stage
//   key(name)   'down' (ArrowDown, PageDown, Space) or 'up' (ArrowUp, PageUp);
//        returns true when it moved the page
//   tapArt(), tapBand()   to the graph, to the art
//   go(state, { instant })   to a rest
//   resize(travel)   px of travel for a whole scrub (the graph's rise)
function createCover(config, {
  start = 'art',
  reducedMotion = false,
  travel = 600,
  now = () => Date.now(),
  frame = (fn) => setTimeout(() => fn(), 16),
  cancelFrame = (h) => clearTimeout(h),
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  onChange = () => {},
  onRest = () => {},
} = {}) {
  const snapMs = config ? config.snapMs : DEFAULTS.snapMs;
  let p = start === 'graph' ? 1 : 0;
  let rest = start === 'graph' ? 'graph' : 'art';
  let from = rest;          // the rest a scrub started from
  let anim = null;          // { handle, target }
  let wheelTimer = null;
  let reducedAcc = 0;
  let quietUntil = 0;       // wheels inside the graph are the page's until then
  let touch = null;         // { y, p, lastY, lastT, v }
  let span = Math.max(120, travel);

  const valueOf = (s) => (s === 'graph' ? 1 : 0);
  const other = (s) => (s === 'graph' ? 'art' : 'graph');

  function set(next, info) {
    const v = clamp01(next);
    if (v === p && !(info && info.swap)) return;
    p = v;
    onChange(p, info || {});
  }

  function stop() {
    if (anim) { cancelFrame(anim.handle); anim = null; }
  }

  function settle(state) {
    stop();
    rest = state;
    from = state;
    set(valueOf(state));
    quietUntil = now() + TUNING.quietMs;
    onRest(state);
  }

  function animateTo(state, { ease = easeOut } = {}) {
    stop();
    const target = valueOf(state);
    if (reducedMotion) { swap(state); return; }
    const p0 = p;
    const dist = Math.abs(target - p0);
    if (dist < 1e-4 || snapMs === 0) { settle(state); return; }
    const ms = Math.max(TUNING.minSnapMs, snapMs * dist);
    const t0 = now();
    anim = { target: state, handle: null };
    const step = () => {
      const k = Math.min(1, (now() - t0) / ms);
      set(lerp(p0, target, ease(k)));
      if (k >= 1) { anim = null; settle(state); return; }
      anim.handle = frame(step);
    };
    anim.handle = frame(step);
  }

  // Reduced motion: no scrub; the two states swap in one short crossfade,
  // which the page draws (info.swap).
  function swap(state) {
    stop();
    if (rest === state && p === valueOf(state)) return;
    rest = state;
    from = state;
    p = valueOf(state);
    onChange(p, { swap: true, ms: TUNING.reducedFadeMs });
    quietUntil = now() + TUNING.quietMs;
    onRest(state);
  }

  // Let go of a scrub: on to the other rest past `onward` of the way, else back.
  function letGo(velocity = 0) {
    const origin = valueOf(from);
    const moved = p - origin;
    let target = from;
    const dir = origin === 0 ? 1 : -1;
    if (moved * dir > TUNING.onward) target = other(from);
    if (velocity * dir > TUNING.flickPxPerMs) target = other(from);
    if (velocity * dir < -TUNING.flickPxPerMs) target = from;
    animateTo(target);
  }

  function scrubBy(dp) {
    if (!anim) from = p >= 1 ? 'graph' : p <= 0 ? 'art' : from;
    stop();
    set(p + dp);
  }

  function go(state, { instant = false } = {}) {
    if (!STATES.includes(state)) return false;
    if (instant) { settle(state); return true; }
    if (rest === state && p === valueOf(state) && !anim) return false;
    animateTo(state, { ease: easeInOut });
    return true;
  }

  function wheel(deltaY, { deltaMode = 0, where = 'stage' } = {}) {
    const dy = deltaY * (deltaMode === 1 ? TUNING.lineHeightPx : deltaMode === 2 ? span : 1);
    if (!dy) return false;
    const resting = !anim && (p === 0 || p === 1);
    if (where === 'graph' || where === 'edge') {
      // In the graph state the graph's wheel is its own zoom: only a scroll
      // up at its top edge moves the page, and a trackpad's momentum just
      // after a page move is swallowed rather than zooming.
      if (resting && p === 1) {
        if (now() < quietUntil) return true;
        if (!(where === 'edge' && dy < 0)) return false;
      }
    }
    if (reducedMotion) {
      if (now() < quietUntil) return true;
      reducedAcc += dy;
      if (Math.abs(reducedAcc) >= TUNING.reducedWheelPx) {
        const want = reducedAcc > 0 ? 'graph' : 'art';
        reducedAcc = 0;
        if (want !== rest) swap(want);
      }
      return true;
    }
    if (resting && ((p === 0 && dy < 0) || (p === 1 && dy > 0))) return true;
    scrubBy(dy / span);
    if (wheelTimer) clearTimer(wheelTimer);
    wheelTimer = setTimer(() => {
      wheelTimer = null;
      if (p > 0 && p < 1) letGo(0);
      else settle(p >= 1 ? 'graph' : 'art');
    }, TUNING.wheelIdleMs);
    return true;
  }

  function touchStart(y, t = now()) {
    if (anim) { from = anim.target === 'graph' ? 'art' : 'graph'; stop(); }
    touch = { y, p, lastY: y, lastT: t, v: 0, total: 0 };
    reducedAcc = 0;
  }

  function touchMove(y, t = now()) {
    if (!touch) return false;
    const dy = touch.lastY - y; // finger up = towards the graph
    const dt = Math.max(1, t - touch.lastT);
    touch.v = 0.6 * (dy / dt) + 0.4 * touch.v;
    touch.lastY = y;
    touch.lastT = t;
    touch.total += dy;
    if (reducedMotion) return true;
    set(touch.p + (touch.y - y) / span);
    return true;
  }

  function touchEnd(t = now()) {
    if (!touch) return false;
    const { v, total, lastT } = touch;
    touch = null;
    if (reducedMotion) {
      if (Math.abs(total) >= TUNING.reducedWheelPx) {
        const want = total > 0 ? 'graph' : 'art';
        if (want !== rest) swap(want);
      }
      return true;
    }
    const velocity = t - lastT > 120 ? 0 : v;
    if (p === 0 || p === 1) { settle(p === 1 ? 'graph' : 'art'); return true; }
    letGo(velocity);
    return true;
  }

  function key(name) {
    if (name === 'down') return go('graph');
    if (name === 'up') return go('art');
    return false;
  }

  return {
    get p() { return p; },
    get rest() { return rest; },
    get moving() { return Boolean(anim) || (p > 0 && p < 1); },
    wheel,
    touchStart,
    touchMove,
    touchEnd,
    key,
    tapArt: () => go('graph'),
    tapBand: () => go('art'),
    go,
    resize(px) { span = Math.max(120, px); },
    dispose() {
      stop();
      if (wheelTimer) { clearTimer(wheelTimer); wheelTimer = null; }
    },
  };
}

// Which page key a keydown is: 'down', 'up' or null.
function pageKey(e) {
  if (!e || e.altKey || e.ctrlKey || e.metaKey) return null;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') return 'down';
  if ((e.key === ' ' || e.key === 'Spacebar') && !e.shiftKey) return 'down';
  if (e.key === 'ArrowUp' || e.key === 'PageUp') return 'up';
  return null;
}

module.exports = {
  DEFAULTS, TUNING, STATES,
  openingConfig, startState, coverGeometry, createCover, pageKey,
};

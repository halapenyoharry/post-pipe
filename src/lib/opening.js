// The two-state page (settings.opening, mode 'two-state'). The cover art
// sits fixed behind the page on a dark ground: two images of one canvas,
// stacked at the same place and size, the art state's (the whole plant) and
// the graph state's (a small plant at the crown over the same roots). At the
// top state (art) the canvas is scrolled so the whole plant fits, with the
// byline under it. At the other (graph) it is scrolled up until the roots
// fill the view; the graph is drawn over the roots. One progress value p runs
// between the two rests, art (0) and graph (1): the canvas moves up, the two
// images crossfade (the art state's at 1 - p, the graph state's at p), and
// the graph layer fades and rises in over them. A reader can scrub partway; let go and it snaps to a
// rest. Nothing is unmounted: the graph is only hidden in the art state, and
// exactly as it was on return. The art never moves with the graph's own pan
// and zoom.
//
// Pure, so it can be tested: the settings with their defaults, the geometry
// at any p, the state a page starts on, and the state machine that turns
// wheels, touches, keys and taps into p. Frames and the clock are injectable.

const DEFAULTS = {
  enabled: false,
  mode: 'two-state',
  art: { artState: '', graphState: '', full: '' },
  alt: '',
  ground: 'dark',
  graph: { artOffset: 0.33, artStateOpacity: 0.6 },
  top: null,
  backdrop: { opacity: 1, opacityZoomedIn: 0.3, zoomForFloor: 2.5, keepAbove: 0 },
  reach: { enabled: false, tips: [], perContainer: 3, stopShort: 18, lagMs: 600, drawMs: 1800 },
  byline: { text: '', href: '', opacity: { art: 0.35, graph: 0.56 }, size: 0.25, gap: 0.3, minSize: 0, case: 'lower' },
  startOn: 'remembered',
  snapMs: 420,
  title: null,
};

// The title set over the cover (opening.title), off unless it has lines.
const TITLE_DEFAULTS = {
  text: '',
  font: '',
  color: '',
  opacity: 1,
  hideGraphTitle: true,
};
// After the title's own face: what draws when that face is not there.
const TITLE_FALLBACK = "'Arial Black', Impact, sans-serif";

const STATES = ['art', 'graph'];

// One layout of the title: lines, each with its left edge x and baseline y
// as fractions of the canvas's width and height, and spans, each with its
// text, its size and an optional rise above the baseline as fractions of the
// canvas's width (so the title scales with the art).
function titleLayoutConfig(layout) {
  const lines = layout && Array.isArray(layout.lines) ? layout.lines : [];
  const out = [];
  for (const line of lines) {
    if (!line || typeof line !== 'object') continue;
    const spans = (Array.isArray(line.spans) ? line.spans : [])
      .filter((sp) => sp && typeof sp.text === 'string' && sp.text !== '')
      .map((sp) => ({ text: sp.text, size: Math.max(0, num(sp.size, 0.05)), rise: num(sp.rise, 0) }));
    if (!spans.length) continue;
    out.push({ x: num(line.x, 0), y: num(line.y, 0), spans });
  }
  return { lines: out };
}

// opening.title with its defaults, or null. A state without lines shows no
// title in that state.
function titleConfig(t) {
  if (!t || typeof t !== 'object') return null;
  const art = titleLayoutConfig(t.art);
  const graph = titleLayoutConfig(t.graph);
  if (!art.lines.length && !graph.lines.length) return null;
  const joined = (art.lines.length ? art : graph).lines.map((l) => l.spans.map((sp) => sp.text).join('')).join(' ');
  const font = str(t.font).trim();
  return {
    text: str(t.text).trim() || joined.replace(/\s+/g, ' ').trim(),
    font,
    family: font ? `'${font.replace(/'/g, '')}', ${TITLE_FALLBACK}` : TITLE_FALLBACK,
    color: str(t.color).trim(),
    opacity: clamp01(num(t.opacity, TITLE_DEFAULTS.opacity)),
    hideGraphTitle: t.hideGraphTitle !== false,
    art,
    graph,
  };
}

// A title layout in px for the canvas drawn in box { left, top, width,
// height }: each line's left edge and baseline, each span's size and rise.
function titleLayout(layout, box) {
  const { left = 0, top = 0, width = 1, height = 1 } = box || {};
  return {
    lines: ((layout && layout.lines) || []).map((l) => ({
      x: left + l.x * width,
      y: top + l.y * height,
      spans: l.spans.map((sp) => ({ text: sp.text, size: sp.size * width, rise: sp.rise * width })),
    })),
  };
}

// opening.byline with its defaults. With a title over the cover the byline
// sits directly under it in each state, in the title's face and colour, at
// `size` of the title's size (its largest span) and never under minSize px,
// its top `gap` of the title's size under the last line's baseline, at
// opacity.art in the art state and opacity.graph in the graph state. case
// 'lower' (the default) draws it in lower case; 'as-written' as written.
// Without a title it sits under the art, as before.
function bylineConfig(b) {
  const o = b && typeof b === 'object' ? b : {};
  const d = DEFAULTS.byline;
  const op = o.opacity;
  const opacity = op && typeof op === 'object'
    ? { art: clamp01(num(op.art, d.opacity.art)), graph: clamp01(num(op.graph, d.opacity.graph)) }
    : Number.isFinite(Number(op)) && op !== '' && op !== null
      ? { art: clamp01(Number(op)), graph: clamp01(Number(op)) }
      : { ...d.opacity };
  return {
    text: str(o.text),
    href: str(o.href),
    opacity,
    size: Math.max(0.01, Math.min(1, num(o.size, d.size))),
    gap: Math.max(0, Math.min(2, num(o.gap, d.gap))),
    minSize: Math.max(0, num(o.minSize, d.minSize)),
    case: o.case === 'as-written' ? 'as-written' : 'lower',
  };
}

// The byline's text as drawn.
function bylineText(byline) {
  if (!byline || !byline.text) return '';
  return byline.case === 'as-written' ? byline.text : byline.text.toLowerCase();
}

// Where the byline sits under one layout of the title, for the art drawn in
// box { left, top, width, height }: the last line's left edge, its top, its
// size; null for a layout without lines.
function bylineUnder(layout, box, byline) {
  const lines = (layout && layout.lines) || [];
  if (!lines.length) return null;
  const last = lines[lines.length - 1];
  const titleSize = Math.max(...lines.flatMap((l) => l.spans.map((sp) => sp.size))) * box.width;
  return {
    x: box.left + last.x * box.width,
    y: box.top + last.y * box.height + byline.gap * titleSize,
    size: Math.max(byline.minSize, byline.size * titleSize),
    titleSize,
  };
}

// Tuning that is not a setting, in one place.
const TUNING = {
  pad: 16,               // px around the art in the art state
  bylineSpace: 52,       // px kept under the art for the byline
  bylineSize: 20,        // byline font size, px
  rise: 0.18,            // the graph layer rises in from this share of the viewport height below
  graphFrom: 0.2,        // the graph layer starts to show past this p
  wheelIdleMs: 140,      // no wheel for this long and the page snaps
  lineHeightPx: 40,      // a wheel's line (deltaMode 1) in px
  onward: 0.22,          // past this share of the way, a let-go goes on to the other rest
  flickPxPerMs: 0.35,    // a touch faster than this goes on, however short
  minSnapMs: 140,        // the shortest snap
  quietMs: 380,          // after a page move, the graph ignores wheels this long (trackpad momentum)
  edgePx: 28,            // in the graph state, a wheel up within this of the top edge moves the page
  reducedFadeMs: 200,    // reduced motion: the states swap in one crossfade this long
  reducedWheelPx: 40,    // reduced motion: this much wheel or touch moves to the other state
};

const { reachConfig, backdropConfig, backdropOpacity } = require('./reach');

const num = (v, d) => (v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v)) ? Number(v) : d);
const str = (v) => (typeof v === 'string' ? v : '');
const clamp01 = (x) => Math.max(0, Math.min(1, x));
// A colour as a stylesheet takes it (#hex, rgb(), a name, var()), or ''.
const colour = (v) => (typeof v === 'string' && v.trim() && !/[;{}<>]/.test(v) ? v.trim() : '');
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

// The art state's ground (opening.ground). 'dark' (the theme's dark paper,
// and the page kept in dark mode) or 'paper' (the theme's paper), or an
// object for a night sky: { top, bottom, textureFrom, colorFrom, texture }.
// The base colour holds at top down to colorFrom (a share of the viewport's
// height, textureFrom unless set), then runs to bottom at the foot (bottom
// empty: the theme's dark paper); the paper's grain and fibres are absent
// above textureFrom and come in toward the foot, where the ground adds its
// own copy at `texture` strength (so they are stronger low). An object is a
// dark ground.
function groundConfig(g) {
  if (g && typeof g === 'object') {
    const textureFrom = clamp01(num(g.textureFrom, 0.35));
    return {
      mode: g.mode === 'paper' ? 'paper' : 'dark',
      sky: {
        top: colour(g.top) || '#050505',
        bottom: colour(g.bottom),
        textureFrom,
        colorFrom: clamp01(num(g.colorFrom, textureFrom)),
        texture: Math.max(0, Math.min(3, num(g.texture, 1))),
      },
    };
  }
  return { mode: g === 'paper' ? 'paper' : 'dark', sky: null };
}

// How close the plant comes to the top (opening.top): { art, graph }, px of
// space between the page's top controls (or the screen's top, without them)
// and the plant's top edge, in each state. Either may be left out: the art
// state then centres the whole canvas, and the graph state scrolls it up by
// graph.artOffset, as before. Unset: null.
function topConfig(t) {
  if (!t || typeof t !== 'object') return null;
  const px = (v) => (v === '' || v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Math.max(0, Number(v)));
  const art = px(t.art), graph = px(t.graph);
  return art === null && graph === null ? null : { art, graph };
}

// The first row, as a share of the image's height, where the image has ink:
// any pixel at least `threshold` opaque (0..255). Rows of RGBA bytes, w x h.
// 0 for an image with ink on its first row, 1 for one with none.
function firstInkRow(data, w, h, threshold = 64) {
  for (let y = 0; y < h; y += 1) {
    for (let x = 0, i = y * w * 4 + 3; x < w; x += 1, i += 4) {
      if (data[i] >= threshold) return y / h;
    }
  }
  return 1;
}

// settings.opening with its defaults, or null when it is off, in another mode,
// or has no art: artState and graphState, or full alone (one image for both
// states, no crossfade).
function openingConfig(settings) {
  const o = settings && settings.opening;
  if (!o || o.enabled !== true) return null;
  if (o.mode !== undefined && o.mode !== 'two-state') return null;
  const art = o.art && typeof o.art === 'object' ? o.art : {};
  let artState = str(art.artState), graphState = str(art.graphState);
  const full = str(art.full);
  if (!(artState && graphState)) {
    if (!full) return null;
    artState = full;
    graphState = '';
  }
  const graph = o.graph && typeof o.graph === 'object' ? o.graph : {};
  const ground = groundConfig(o.ground);
  return {
    enabled: true,
    mode: 'two-state',
    art: { artState, graphState, full },
    alt: str(o.alt),
    ground: ground.mode,
    sky: ground.sky,
    graph: {
      artOffset: Math.max(0, Math.min(0.95, num(graph.artOffset, DEFAULTS.graph.artOffset))),
      artStateOpacity: clamp01(num(graph.artStateOpacity, DEFAULTS.graph.artStateOpacity)),
    },
    top: topConfig(o.top),
    backdrop: backdropConfig(o),
    reach: reachConfig(o),
    byline: bylineConfig(o.byline),
    startOn: ['remembered', 'art', 'graph'].includes(o.startOn) ? o.startOn : DEFAULTS.startOn,
    snapMs: Math.max(0, num(o.snapMs, DEFAULTS.snapMs)),
    title: titleConfig(o.title),
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

// Where everything is at progress p, in px, for a viewport (vw, vh), the
// art's natural size (w, h: the canvas both state images share), and the
// space the page keeps at the bottom (bottom: the rights line, say), the
// graph's zoom (zoom: { k, homeK }), the bottom edge of the page's top
// controls (controls, px; opening.top is measured from it), and where each
// state image's plant starts (ink: { art, graph }, shares of the canvas's
// height; firstInkRow). The art
// keeps one scale throughout, the largest that fits the whole plant, with
// the byline under it, in the art state; only its top moves.
//   art         { top, left, width, height, scale, opacity }: the canvas
//   roots       the backdrop's roots' strength at p: 1 at art, and at graph
//               backdrop.opacity, lowered as the graph is zoomed in past the
//               zoom it rests at (zoom: { k, homeK }; reach.js backdropOpacity)
//   fade        { art, graph }: the two state images' opacities (1 - p, p),
//               and the title's two layouts'
//   artTop0, artTop1   its top at the two rests (artTop1 = -artOffset of its
//               height, or from opening.top.graph)
//   travel      px the art moves between the rests (a whole scrub)
//   graph       { opacity, shift }: the graph's controls (the bottom bar and
//               the like), coming in over the art, shift px below their rest
//   layer       { opacity, follow }: the graph itself, which hangs from the
//               roots in both states: follow px below its graph-state place
//               (it moves with the art), at graph.artStateOpacity at the art
//   ground      the art state's ground's opacity (1 at art, 0 at graph)
//   byline      { x, y, size, opacity, align, under }: (x, y) is the centre
//               of its top (align 'center', under the art, without a title),
//               or its top left corner (align 'left', under the title: under
//               'title'), between the two layouts' places as the page moves
function coverGeometry(config, { vw, vh, art, bottom = 0, zoom = null, controls = 0, ink = null } = {}, p = 0) {
  const t = clamp01(p);
  const T = TUNING;
  const W = Math.max(1, (art && art.w) || 1), H = Math.max(1, (art && art.h) || 1);
  const hasByline = Boolean(config && config.byline && config.byline.text);
  const below = hasByline ? T.bylineSpace : 0;
  const pad = Math.min(T.pad, vh * 0.03);
  const floor = Math.max(pad, bottom);
  const topCfg = (config && config.top) || null;
  // With opening.top.art the plant's top edge (ink.art of the canvas down)
  // sits that far under the top controls, and the art is as large as fits
  // from there down; otherwise the whole canvas is centred in the room.
  const inkArt = clamp01(num(ink && ink.art, 0));
  const inkGraph = ink && Number.isFinite(ink.graph) ? clamp01(ink.graph) : null;
  const from = topCfg && topCfg.art !== null ? Math.max(0, controls) + topCfg.art : null;
  const room = Math.max(1, vh - (from === null ? pad : from) - floor - below);
  const tall = from === null ? H : H * Math.max(0.05, 1 - inkArt);
  const scale = Math.max(0.01, Math.min(room / tall, (vw - 2 * pad) / W));
  const width = W * scale, height = H * scale;
  const g = (config && config.graph) || DEFAULTS.graph;
  const bd = (config && config.backdrop) || DEFAULTS.backdrop;
  const artTop0 = from === null ? pad + Math.max(0, (room - height) / 2) : from - inkArt * height;
  // With opening.top.graph the graph state's plant (ink.graph of the canvas
  // down) sits that far under the top controls; otherwise artOffset.
  const artTop1 = topCfg && topCfg.graph !== null && inkGraph !== null
    ? Math.min(artTop0 - 1, Math.max(0, controls) + topCfg.graph - inkGraph * height)
    : -g.artOffset * height;
  const top = lerp(artTop0, artTop1, t);
  const show = smooth((t - T.graphFrom) / (1 - T.graphFrom));
  return {
    p: t,
    vw, vh,
    art: { top, left: (vw - width) / 2, width, height, scale, opacity: 1 },
    roots: lerp(1, zoom ? backdropOpacity(bd, zoom.k, zoom.homeK) : bd.opacity, t),
    fade: { art: 1 - t, graph: t },
    artTop0, artTop1,
    travel: Math.max(1, artTop0 - artTop1),
    graph: { opacity: show, shift: (1 - show) * T.rise * vh },
    // The graph itself is never hidden: it hangs from the roots in both
    // states, moved with the art (follow: px below where it rests in the
    // graph state) and at artStateOpacity in the art state.
    layer: {
      opacity: lerp(num(g.artStateOpacity, DEFAULTS.graph.artStateOpacity), 1, t),
      follow: top - artTop1,
    },
    ground: 1 - t,
    byline: bylineAt(config, { left: (vw - width) / 2, top, width, height }, t, {
      x: vw / 2,
      y: top + height + (below - T.bylineSize * 1.3) / 2,
      size: T.bylineSize,
      opacity: clamp01(1 - t * 2.5),
      align: 'center',
      under: 'art',
    }),
  };
}

// The byline at progress t: under the title's art layout at the art rest,
// under its graph layout at the graph rest, between the two on the way (a
// state without lines keeps the other's place); `fallback` without a title.
function bylineAt(config, box, t, fallback) {
  const title = config && config.title;
  const byline = config && config.byline;
  if (!title || !byline || !byline.text) return fallback;
  const a = bylineUnder(title.art, box, byline);
  const g = bylineUnder(title.graph, box, byline);
  const from = a || g, to = g || a;
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    size: lerp(from.size, to.size, t),
    opacity: lerp(byline.opacity.art, byline.opacity.graph, t),
    align: 'left',
    under: 'title',
  };
}

const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// The state machine. p is the truth; a rest is where it settles.
//   onChange(p, info)   every change of p (info.swap: reduced motion jumped)
//   onRest(state)       settled at 'art' or 'graph' (also once at start)
// Inputs:
//   wheel(deltaY, { deltaMode, where })   where: 'stage' (the art),
//        'graph' (inside the graph), 'edge' (the page's top edge, or the
//        cover handle); returns true when the page took it (the caller then stops it)
//   touchStart(y), touchMove(y, t), touchEnd(t)   a drag on the art, or on the
//        cover handle
//   key(name)   'down' (ArrowDown, PageDown, Space) or 'up' (ArrowUp, PageUp);
//        returns true when it moved the page
//   tapArt(), tapTop()   to the graph; the cover handle, to the art
//   go(state, { instant })   to a rest
//   resize(travel)   px of travel for a whole scrub (the art's move)
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
    tapTop: () => go('art'),
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
  DEFAULTS, TUNING, STATES, TITLE_DEFAULTS, TITLE_FALLBACK,
  openingConfig, bylineConfig, bylineText, groundConfig, topConfig, firstInkRow, titleConfig, titleLayout, startState, coverGeometry, createCover, pageKey,
};

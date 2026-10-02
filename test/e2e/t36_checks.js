// Browser checks for Harold's notes of 2026-10-02 11:15 to 11:24 on the two
// screens: the acts keep their own shape in the title's teal, open and closed
// alike (part 1); a zoom grows each act in place on its root tip instead of
// spreading the acts apart (part 2); the roots answer their act, a little
// behind it, never leading it (part 2b); the byline smaller in the graph
// state (part 3); the rights line at the screen's very foot (part 4); the
// roots darker in the graph state and a node colour to choose in the panel
// (part 4b). On a built site:
//   - part 1: each closed act in the engine's own soft shape (not the blob),
//     its outline and fill in the title's teal (the fill at 0.35), its label
//     in the title's face in the lighter teal; every act opened: its hull's
//     outline and fill the same, its title in the same face and colour;
//   - part 2: ten wheel steps in at two points under the crown, the + key,
//     a pinch on a phone, Zoom to fit and Reset: every act's centre stays on
//     its root tip within 2 px and on the screen, each act's width grows by
//     the zoom (or stops at the cap where two would come within 16 px), the
//     roots stay where they are; with Act One open, its last chapter stays
//     where it rests and its hull grows by the zoom; open acts never meet;
//     a pan, reported;
//   - part 2b: a closed act dragged 120 px in 12 steps: at every frame its
//     root's tip has moved no further than the act as drawn, and in some
//     frame mid-drag measurably less; after the release the root is on the
//     act within 300 ms; on Reset the root follows the act back, never
//     ahead of it; and the drag again after the Reset;
//   - part 3: the byline in the art state as wide as the title's last line;
//     in the graph state a quarter of that title's size, in lower case, the
//     title's face and colour, a link to the jacket (sizes reported);
//   - part 4: the rights line's bottom within 8 px of the screen's, its
//     baseline 6 px up, one line on a desktop and at most two on a phone, at
//     10 or 11 px, taking no taps; faded to a quarter while a card is under
//     it and not otherwise;
//   - part 4b: the graph state's roots drawn at the set brightness against
//     the same roots undimmed (sampled), the art state's untouched, the
//     roots' median luminance and the acts' contrast against the roots
//     beside them reported; the panel's node colour choice (two labelled
//     swatches); berry recolours every act and card outline, not the cards'
//     text; a reload keeps it; Forget goes back to teal.
// Chromium and WebKit, desktop (1280x800) and phone (390x844 at 3x). With
// PP_E2E_SHOTS set, screenshots, and composites: the closed and open states
// beside the mockup at its scale, and a zoom sequence on the phone.
//
//   node test/e2e/t36_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const zlib = require('zlib');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39466;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const OPENING = SETTINGS.opening || {};
const GS = SETTINGS.graph || {};
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const MOCKUP = path.resolve(__dirname, '../../_handoff/T35-mockup-iphone13-two-states.png');
const MOCK = { art: { x: 5, y: 87, w: 293, h: 493 }, graph: { x: 345, y: 87, w: 292, h: 493 } };
const LABELS = Object.fromEntries((SETTINGS.containment || []).map((c) => [c.id, c.label]));
const ACTS = Object.entries(SETTINGS.containers || {})
  .filter(([id, c]) => id.startsWith('container:') && c && typeof c === 'object' && c.anchor)
  .map(([id, c]) => ({ id, anchor: c.anchor, name: LABELS[id] || id }));
const PALETTES = Array.isArray(GS.nodePalettes) ? GS.nodePalettes : [];
const TEAL = PALETTES[0], BERRY = PALETTES[1];
const RIGHTS = SETTINGS.rights || {};
const BRIGHT = OPENING.graph && OPENING.graph.rootsBrightness;
const CROWN = OPENING.crownY;

if (GS.zoomMode !== 'grow-in-place' || ACTS.length < 3 || PALETTES.length < 2 || RIGHTS.position !== 'bottom-edge'
  || !(OPENING.byline && OPENING.byline.graphScale > 0) || !(OPENING.art && OPENING.art.rootsFollowMs > 0) || !(BRIGHT > 0 && BRIGHT < 1)) {
  console.error('this site does not set the T36 settings (graph.zoomMode grow-in-place, graph.nodePalettes, rights.position bottom-edge, opening.byline.graphScale, opening.art.rootsFollowMs, opening.graph.rootsBrightness); nothing to check');
  process.exit(1);
}

// ── PNG (8-bit RGB or RGBA, as a screenshot is) ──
function readPng(buf) {
  let pos = 8, width = 0, height = 0, type = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), kind = buf.toString('ascii', pos + 4, pos + 8);
    const body = buf.subarray(pos + 8, pos + 8 + len);
    if (kind === 'IHDR') { width = body.readUInt32BE(0); height = body.readUInt32BE(4); type = body[9]; }
    else if (kind === 'IDAT') idat.push(body);
    else if (kind === 'IEND') break;
    pos += 12 + len;
  }
  const bpp = type === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * bpp, px = Buffer.alloc(stride * height);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = px.subarray(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = row[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[i] = v & 0xff;
    }
    prev = cur;
  }
  const at = (x, y) => { const i = (y * width + x) * bpp; return [px[i], px[i + 1], px[i + 2]]; };
  return { width, height, at };
}
const lin = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const median = (v) => { if (!v.length) return NaN; const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const hexRgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h); const n = parseInt(m[1], 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };
const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const r2 = (n) => (Number.isFinite(n) ? n.toFixed(2) : String(n));

async function open(bt, name, size) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: 'dark',
  });
  await ctx.addInitScript(pageHelpers);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await ready(page);
  // Chromium's emulated 3x phone hands the page a third of a wheel's delta,
  // so there a wheel step is sent three times as large: 100 CSS px a step,
  // as on the desktop and in WebKit.
  const k = phone && name === 'chromium' ? 3 : 1;
  const wheel = (dy) => page.mouse.wheel(0, dy * k);
  return { browser, ctx, page, errors, phone, name, wheel };
}

async function ready(page) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame && window.PostPipeGraphWorld && window.PostPipeGraph, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
}

// In the page, before its own scripts: readers for what is drawn.
function pageHelpers() {
  window.__touchEvent = (type, el, pts, changed) => {
    const mk = (q, i) => ({ identifier: i + 1, target: el, clientX: q[0], clientY: q[1], pageX: q[0], pageY: q[1], screenX: q[0], screenY: q[1] });
    const touches = pts.map(mk);
    const ch = (changed || pts).map(mk);
    try {
      const T = (f) => new Touch(f);
      return new TouchEvent(type, { bubbles: true, cancelable: true, composed: true, touches: touches.map(T), targetTouches: touches.map(T), changedTouches: ch.map(T) });
    } catch (_) {
      const ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
      const list = (a) => Object.assign([...a], { item: (i) => a[i] || null });
      Object.defineProperty(ev, 'touches', { value: list(touches) });
      Object.defineProperty(ev, 'targetTouches', { value: list(touches) });
      Object.defineProperty(ev, 'changedTouches', { value: list(ch) });
      return ev;
    }
  };
  const box = (r) => ({ x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, w: r.width, h: r.height });
  const group = (id) => document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
  // Each act as drawn: closed or open, its box, its centre (a closed act's
  // node origin; an open act's last chapter's card), colours and face.
  window.__act = (id) => {
    const g = group(id);
    if (!g || getComputedStyle(g).display === 'none') return null;
    const macro = g.querySelector('.container-macro-node');
    const closed = !!macro && getComputedStyle(macro).display !== 'none';
    const el = closed ? macro.querySelector('.container-macro-bg') : g.querySelector('.container-hull');
    const cs = getComputedStyle(el);
    const label = closed ? macro.querySelector('.container-macro-text') : g.querySelector('.container-badge-text');
    const ls = label ? getComputedStyle(label) : null;
    let centre = null;
    if (closed) { const m = macro.getScreenCTM(); centre = { x: m.e, y: m.f }; }
    else {
      const cards = [...document.querySelectorAll('.node-card')].filter((c) => c.__data__ && (c.__data__.tags || []).includes(id.replace(/^container:/, '')) && c.style.display !== 'none');
      cards.sort((a, b) => (a.__data__.series_part || 0) - (b.__data__.series_part || 0));
      const last = cards[cards.length - 1];
      if (last) { const r = last.getBoundingClientRect(); centre = { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }; }
    }
    return {
      id, closed, box: box(el.getBoundingClientRect()), centre,
      segs: ((el.getAttribute('d') || '').match(/C/g) || []).length,
      stroke: cs.stroke, fill: cs.fill, fillOpacity: Number(cs.fillOpacity),
      labelFace: ls ? ls.fontFamily : '', labelFill: ls ? ls.fill : '', labelOpacity: label ? Number(label.getAttribute('opacity') || 1) : 0,
      labelText: label ? label.textContent : '',
    };
  };
  window.__acts = (ids) => Object.fromEntries(ids.map((id) => [id, window.__act(id)]));
  // The tip of an act's root as drawn (the last point of its last part).
  window.__tip = (id) => {
    const parts = [...document.querySelectorAll(`[data-roots-vector] path[data-act-root="${CSS.escape(id)}"]`)];
    const last = parts[parts.length - 1];
    if (!last) return null;
    const q = last.getPointAtLength(last.getTotalLength());
    const m = last.getScreenCTM();
    return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
  };
  // Where an anchor falls on the art, on the screen.
  window.__anchor = (a) => { const r = document.querySelector('[data-cover-art]').getBoundingClientRect(); return { x: r.left + a.x * r.width, y: r.top + a.y * r.height }; };
  window.__zoom = () => { const w = window.PostPipeGraphWorld.snapshot(); return w.k / w.homeK; };
  window.__cards = () => [...document.querySelectorAll('.node-card')].filter((c) => c.style.display !== 'none' && getComputedStyle(c).display !== 'none').map((c) => {
    const p = c.querySelector('svg path:last-child');
    const t = c.querySelector('[class*="title"]');
    return { id: c.__data__ && c.__data__.id, box: box(c.getBoundingClientRect()), outline: p ? getComputedStyle(p).stroke : '', text: t ? getComputedStyle(t).color : '' };
  }).filter((c) => c.box.w > 0);
  window.__rights = () => {
    const el = document.querySelector('[data-rights]');
    if (!el) return null;
    const mk = document.createElement('span');
    mk.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    el.appendChild(mk);
    const base = mk.getBoundingClientRect().top;
    mk.remove();
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { box: box(r), baseline: innerHeight - base, bottomGap: innerHeight - r.bottom, lines: Math.round(r.height / parseFloat(cs.lineHeight)), fontSize: parseFloat(cs.fontSize), opacity: Number(cs.opacity), over: el.hasAttribute('data-rights-over'), events: cs.pointerEvents, W: innerWidth, H: innerHeight };
  };
}

async function scrollOnce(s) {
  await s.page.mouse.move(s.phone ? 195 : 640, s.phone ? 420 : 400);
  await s.wheel(120);
  await s.page.waitForFunction(() => window.PostPipeCover.state === 'graph', null, { timeout: 5000 }).catch(() => {});
  await s.page.waitForTimeout(1600);
}
// Until the graph has stopped redrawing (its first settle runs a few
// seconds): no word from it for 400 ms.
const quiet = (page) => page.evaluate(() => new Promise((done) => {
  let last = performance.now();
  const on = () => { last = performance.now(); };
  addEventListener('graph:world', on);
  const t0 = performance.now();
  const check = () => {
    if (performance.now() - last > 400 || performance.now() - t0 > 12000) { removeEventListener('graph:world', on); done(); return; }
    setTimeout(check, 100);
  };
  check();
}));
const reset = async (page) => { await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all'))); await page.waitForTimeout(1500); };
const acts = (page) => page.evaluate((ids) => window.__acts(ids), ACTS.map((a) => a.id));
const tips = (page) => page.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, window.__tip(id)])), ACTS.map((a) => a.id));
const anchors = (page) => page.evaluate((list) => Object.fromEntries(list.map((a) => [a.id, window.__anchor(a.anchor)])), ACTS);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const gapBetween = (a, b) => Math.max(b.x0 - a.x1, a.x0 - b.x1, b.y0 - a.y1, a.y0 - b.y1);
const leastGap = (m, onlyOpen) => {
  const ids = Object.keys(m).filter((id) => m[id]);
  let least = Infinity, pair = '';
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    if (onlyOpen && m[ids[i]].closed && m[ids[j]].closed) continue;
    const d = gapBetween(m[ids[i]].box, m[ids[j]].box);
    if (d < least) { least = d; pair = `${LABELS[ids[i]]} and ${LABELS[ids[j]]}`; }
  }
  return { least, pair };
};

// Pixels: a screenshot at CSS px, read.
async function grab(page, clip) {
  const buf = await page.screenshot({ scale: 'css', ...(clip ? { clip } : {}) });
  return readPng(buf);
}

// What the drawing of the roots gives in the graph state: with the graph
// hidden, the roots as drawn and the same roots undimmed (the filter taken
// off), sampled under the crown; and each act's inside against the roots
// beside it, with and without.
async function rootsSample(page, phone) {
  const g = await page.evaluate((crown) => {
    const r = document.querySelector('[data-cover-art]').getBoundingClientRect();
    return { crownY: r.top + crown * r.height, W: innerWidth, H: innerHeight };
  }, CROWN);
  const region = { x: 0, y: Math.ceil(g.crownY + 30), width: g.W, height: Math.floor(g.H - 40 - (g.crownY + 30)) };
  // The brightness taken off with a rule of the page's own that wins over
  // the cover's per-frame paint, and put back by removing it.
  const setFilter = (off) => page.evaluate((off) => {
    let st = document.getElementById('t36-no-filter');
    if (off && !st) {
      st = document.createElement('style');
      st.id = 't36-no-filter';
      st.textContent = '[data-roots-vector], [data-cover-image="graph"] { filter: none !important; }';
      document.head.appendChild(st);
    } else if (!off && st) st.remove();
  }, off);
  await quiet(page);
  const hideGraph = (hide) => page.evaluate((hide) => {
    for (const el of document.querySelectorAll('[data-graph-root], [data-rights]')) el.style.visibility = hide ? 'hidden' : '';
  }, hide);
  const filter = await page.evaluate(() => getComputedStyle(document.querySelector('[data-roots-vector]')).filter);
  await hideGraph(true);
  await page.waitForTimeout(250);
  const dim = await grab(page, region);
  await setFilter(true);
  await page.waitForTimeout(250);
  const full = await grab(page, region);
  await setFilter(false);
  await hideGraph(false);
  await page.waitForTimeout(250);
  // Root pixels: bright on the undimmed drawing; the core of them for the ratio.
  const ratios = [], before = [], after = [];
  const isRoot = (c) => Math.max(...c) >= 90;
  for (let y = 0; y < full.height; y += 1) for (let x = 0; x < full.width; x += 1) {
    const a = full.at(x, y);
    if (!isRoot(a)) continue;
    const b = dim.at(x, y);
    before.push(lum(a)); after.push(lum(b));
    if (Math.max(...a) >= 170) ratios.push((b[0] + b[1] + b[2]) / Math.max(1, a[0] + a[1] + a[2]));
  }
  // Each act against the roots beside it: its inside (the middle half of
  // its box) and the root pixels in a band 28 px round it, with and without.
  const m = await acts(page);
  const withActs = await grab(page);
  await setFilter(true);
  await page.waitForTimeout(250);
  const withActsFull = await grab(page);
  await hideGraph(true);
  await page.waitForTimeout(250);
  const rootsOnlyFull = await grab(page);
  await hideGraph(false);
  await setFilter(false);
  await page.waitForTimeout(250);
  const per = {};
  for (const [id, a] of Object.entries(m)) {
    if (!a || !a.closed) continue;
    const b = a.box;
    const inside = (img) => {
      const v = [];
      for (let y = Math.round(b.y0 + b.h / 4); y < b.y1 - b.h / 4; y += 2) for (let x = Math.round(b.x0 + b.w / 4); x < b.x1 - b.w / 4; x += 2) {
        if (x >= 0 && y >= 0 && x < img.width && y < img.height) v.push(lum(img.at(x, y)));
      }
      return median(v);
    };
    const beside = (img) => {
      const v = [];
      for (let y = Math.round(b.y0 - 28); y < b.y1 + 28; y += 1) for (let x = Math.round(b.x0 - 28); x < b.x1 + 28; x += 1) {
        if (x < 0 || y < 0 || x >= img.width || y >= img.height) continue;
        if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) continue;
        if (!isRoot(rootsOnlyFull.at(x, y))) continue;
        v.push(lum(img.at(x, y)));
      }
      return median(v);
    };
    const inB = inside(withActsFull), inA = inside(withActs);
    const rootB = beside(withActsFull), rootA = beside(withActs);
    per[id] = { before: contrast(inB, rootB), after: contrast(inA, rootA), rootB, rootA };
  }
  return { filter, ratio: median(ratios), n: ratios.length, before: median(before), after: median(after), per };
}

async function run(bt, name, size, record, shots) {
  const s = await open(bt, name, size);
  const { page, phone } = s;
  const tag = (t) => `${name} ${size} ${t}`;
  const shot = async (label) => {
    if (!SHOTS) return null;
    fs.mkdirSync(SHOTS, { recursive: true });
    const f = path.join(SHOTS, `${label}-${size}-${name}.png`);
    await page.screenshot({ path: f });
    return f;
  };
  const ids = ACTS.map((a) => a.id);
  const byName = (n) => ACTS.find((a) => a.name === n);
  const titleColour = hexRgb(OPENING.title.color);

  // ── Part 3: the byline, in the art state ──
  const bylineNow = () => page.evaluate(() => {
    const by = document.querySelector('[data-cover-byline]');
    const r = by.getBoundingClientRect();
    const lines = (w) => [...document.querySelectorAll(`[data-cover-title="${w}"] [data-cover-title-line]`)];
    const svg = document.querySelector('[data-cover-title-svg]');
    const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
    const graphSpans = [...document.querySelectorAll('[data-cover-title="graph"] tspan')].map((t) => parseFloat(t.getAttribute('font-size')) * scale);
    const lastArt = lines('art').pop().getBoundingClientRect();
    const lastGraph = lines('graph').pop().getBoundingClientRect();
    const cs = getComputedStyle(by);
    return {
      size: parseFloat(cs.fontSize), w: r.width, x0: r.left, y0: r.top, text: by.textContent, face: cs.fontFamily, color: cs.color,
      href: by.getAttribute('href'), opacity: Number(cs.opacity),
      lastArt: { w: lastArt.width, x0: lastArt.left, y1: lastArt.bottom }, lastGraph: { w: lastGraph.width, x0: lastGraph.left, y1: lastGraph.bottom, y0: lastGraph.top },
      graphTitlePx: Math.max(...graphSpans),
    };
  });
  const b0 = await bylineNow();
  record(tag('part 3 art: the byline as wide as the title\'s last line (within 10%)'), Math.abs(b0.w / b0.lastArt.w - 1) <= 0.1, `${r1(b0.w)} against ${r1(b0.lastArt.w)}, ${r1(b0.size)} px`);
  shots.art = await shot('art');

  // ── The graph state ──
  await scrollOnce(s);
  const state = await page.evaluate(() => window.PostPipeCover.state);
  record(tag('the graph state after one scroll'), state === 'graph', state);

  // ── Part 3: the byline, in the graph state ──
  const b1 = await bylineNow();
  const want = OPENING.byline.graphScale * b1.graphTitlePx;
  record(tag(`part 3 graph: the byline ${OPENING.byline.graphScale} of the graph title's size`), Math.abs(b1.size / want - 1) <= 0.03, `${r1(b1.size)} px against ${r1(want)} (the title ${r1(b1.graphTitlePx)} px); art state ${r1(b0.size)} px`);
  record(tag('part 3 graph: the byline under the title, at its left edge'), b1.y0 >= b1.lastGraph.y0 + 0.5 * (b1.lastGraph.y1 - b1.lastGraph.y0) && Math.abs(b1.x0 - b1.lastGraph.x0) <= 3, `byline ${r1(b1.x0)},${r1(b1.y0)}; line ${r1(b1.lastGraph.x0)}, ${r1(b1.lastGraph.y0)}-${r1(b1.lastGraph.y1)}`);
  record(tag('part 3 graph: lower case, the title\'s face and colour, a link to the jacket'), b1.text === b1.text.toLowerCase() && /Dela Gothic One/.test(b1.face) && b1.color === titleColour && /eoej-about\.html$/.test(b1.href || ''),
    `"${b1.text}", ${b1.face.split(',')[0]}, ${b1.color}, ${b1.href}`);

  // ── Part 1: the closed acts ──
  const teal = hexRgb(TEAL.color), tealLabel = hexRgb(TEAL.labelColor || TEAL.color);
  const m0 = await acts(page);
  const an0 = await anchors(page);
  for (const a of ACTS) {
    const x = m0[a.id];
    record(tag(`part 1 ${a.name} closed: the engine's own soft shape (14 segments; the blob had 24)`), !!x && x.closed && x.segs === 14, x ? `${x.segs} segments` : 'missing');
    record(tag(`part 1 ${a.name} closed: outline and fill in the title's teal, the fill at ${TEAL.fillOpacity}`), !!x && x.stroke === teal && x.fill === teal && Math.abs(x.fillOpacity - TEAL.fillOpacity) < 0.005, x ? `${x.stroke}, ${x.fill} at ${x.fillOpacity}` : '');
    record(tag(`part 1 ${a.name} closed: label in the title's face, the lighter teal`), !!x && /Dela Gothic One/.test(x.labelFace) && x.labelFill === tealLabel, x ? `${x.labelFace.split(',')[0]}, ${x.labelFill}` : '');
    record(tag(`part 2 ${a.name} at rest: on its root tip`), !!x && dist(x.centre, an0[a.id]) <= 2, x ? `${r1(dist(x.centre, an0[a.id]))} px off` : '');
  }
  shots.closed = await shot('closed');

  // ── Part 4: the rights line ──
  const rt = await page.evaluate(() => window.__rights());
  const maxLines = phone ? 2 : 1;
  record(tag('part 4: the rights line at the very foot (its bottom within 8 px of the screen\'s)'), rt.bottomGap >= 0 && rt.bottomGap <= 8, `${r1(rt.bottomGap)} px up`);
  record(tag('part 4: its baseline 6 px above the foot'), Math.abs(rt.baseline - 6) <= 1, `${r2(rt.baseline)} px`);
  record(tag(`part 4: ${maxLines === 1 ? 'one line' : 'at most two lines'} at ${phone ? 10 : 11} px`), rt.lines <= maxLines && rt.fontSize === (phone ? 10 : 11), `${rt.lines} line(s), ${rt.fontSize} px, ${r1(rt.box.w)} wide`);
  record(tag('part 4: it takes no taps, and no card is under it with every act closed (not faded)'), rt.events === 'none' && !rt.over && rt.opacity === 1, `${rt.events}, opacity ${rt.opacity}`);

  // ── Part 4b: the roots, darker in the graph state ──
  const rs = await rootsSample(page, phone);
  const set = Number((/brightness\(([\d.]+)\)/.exec(rs.filter) || [])[1]);
  record(tag(`part 4b graph: the roots drawn at brightness ${BRIGHT}`), Math.abs(set - BRIGHT) < 0.002 && Math.abs(rs.ratio - BRIGHT) <= 0.06, `${rs.filter}; sampled ${r2(rs.ratio)} of the undimmed roots over ${rs.n} px`);
  console.log(`      roots' median luminance in the graph state: ${r2(rs.before)} undimmed, ${r2(rs.after)} at ${BRIGHT}`);
  const lumHex = (h) => { const n = parseInt(h.replace('#', ''), 16); return lum([n >> 16, (n >> 8) & 255, n & 255]); };
  const labelL = lumHex(TEAL.labelColor || TEAL.color), lineL = lumHex(TEAL.color);
  for (const [id, c] of Object.entries(rs.per)) {
    console.log(`      ${LABELS[id]} against the roots beside it (the roots' median luminance ${r2(c.rootB)} -> ${r2(c.rootA)}): its inside ${r2(c.before)} -> ${r2(c.after)}; its label ${r2(contrast(labelL, c.rootB))} -> ${r2(contrast(labelL, c.rootA))}; its outline ${r2(contrast(lineL, c.rootB))} -> ${r2(contrast(lineL, c.rootA))}`);
  }
  shots.roots = rs;

  // ── Part 2: the zoom grows the acts in place ──
  const zoomCheck = async (label, act) => {
    const a0 = await acts(page), t0 = await tips(page), an = await anchors(page);
    const r0 = await page.evaluate(() => window.__zoom());
    await act();
    await page.waitForTimeout(800);
    const a1 = await acts(page), t1 = await tips(page);
    const r = await page.evaluate(() => window.__zoom());
    const off = ACTS.map((x) => (a1[x.id] && a0[x.id] ? dist(a1[x.id].centre, a0[x.id].centre) : Infinity));
    const onTip = ACTS.filter((x) => a0[x.id].closed).map((x) => dist(a1[x.id].centre, an[x.id]));
    const growth = ACTS.map((x) => a1[x.id].box.w / a0[x.id].box.w);
    const W = phone ? 390 : 1280, H = phone ? 844 : 800;
    const onScreen = ACTS.filter((x) => a1[x.id].closed).every((x) => { const c = a1[x.id].centre; return c.x >= 0 && c.x <= W && c.y >= 0 && c.y <= H; });
    const rootsStill = ACTS.every((x) => !t0[x.id] || dist(t0[x.id], t1[x.id]) <= 1);
    record(tag(`part 2 ${label}: every act stays where it was (closed ones on their tips) within 2 px`), Math.max(...off) <= 2 && Math.max(0, ...onTip) <= 2, `zoom ${r2(r)}x; moved ${off.map(r1).join(', ')} px`);
    record(tag(`part 2 ${label}: each act's width grows by the zoom (within 2%)`), growth.every((gw) => Math.abs(gw / (r / r0) - 1) <= 0.02 || Math.abs(gw - 1) < 0.005 && Math.abs(r - 1) < 0.005), growth.map(r2).join(', '));
    record(tag(`part 2 ${label}: every closed act still on the screen, and the roots where they were`), onScreen && rootsStill, `${onScreen ? 'on' : 'off'}; roots ${rootsStill ? 'still' : 'moved'}`);
    return { r, a1 };
  };
  const at1 = phone ? { x: 330, y: 844 - 110 } : { x: 1200, y: 760 };
  const at2 = phone ? { x: 60, y: 844 - 200 } : { x: 120, y: 700 };
  await page.mouse.move(at1.x, at1.y);
  const zw = await zoomCheck('ten wheel steps low on the right', async () => { for (let i = 0; i < 10; i++) { await s.wheel(-100); await page.waitForTimeout(60); } });
  const capClosed = zw.r;
  const g1 = leastGap(zw.a1, false);
  record(tag('part 2: at the furthest zoom no two acts come within 16 px'), g1.least >= 15.5, `stopped at ${r2(capClosed)}x; the closest, ${g1.pair}, ${r1(g1.least)} px apart`);
  shots.zoomCap = await shot('zoom-cap');
  await reset(page);
  await page.mouse.move(at2.x, at2.y);
  await zoomCheck('ten wheel steps low on the left', async () => { for (let i = 0; i < 10; i++) { await s.wheel(-100); await page.waitForTimeout(60); } });
  await reset(page);
  await zoomCheck('the + key', async () => { await page.keyboard.press('='); await page.waitForTimeout(350); });
  await reset(page);
  if (phone) {
    await zoomCheck('a pinch low on the left', () => page.evaluate(async ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      let d = 64;
      el.dispatchEvent(window.__touchEvent('touchstart', el, [[x - d / 2, y], [x + d / 2, y]]));
      for (let i = 0; i < 8; i += 1) {
        d += 2;
        await new Promise((r) => setTimeout(r, 30));
        el.dispatchEvent(window.__touchEvent('touchmove', el, [[x - d / 2, y], [x + d / 2, y]]));
      }
      el.dispatchEvent(window.__touchEvent('touchend', el, [], [[x - d / 2, y], [x + d / 2, y]]));
    }, { x: 90, y: 844 - 160 }));
    await reset(page);
  }
  await page.keyboard.press('='); await page.waitForTimeout(350);
  await zoomCheck('Zoom to fit', async () => { await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:zoom-to-fit'))); await page.waitForTimeout(400); });
  // Reset from a zoom in: part way and at the end, every act where it was.
  await page.keyboard.press('='); await page.keyboard.press('='); await page.waitForTimeout(600);
  const ar0 = await acts(page);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
  await page.waitForTimeout(330);
  const arMid = await acts(page);
  await page.waitForTimeout(1300);
  const ar1 = await acts(page);
  const zr = await page.evaluate(() => window.__zoom());
  const midOff = Math.max(...ACTS.map((x) => dist(arMid[x.id].centre, ar0[x.id].centre)));
  const endOff = Math.max(...ACTS.map((x) => dist(ar1[x.id].centre, ar0[x.id].centre)));
  record(tag('part 2 Reset: back to the home zoom, every act on its tip part way and at the end'), Math.abs(zr - 1) < 1e-6 && midOff <= 2 && endOff <= 2, `zoom ${r2(zr)}; part way ${r1(midOff)} px, at the end ${r1(endOff)} px`);

  // Act One open: its last chapter stays, its hull grows by the zoom.
  const one = byName('Act One');
  await page.evaluate((id) => window.PostPipeGraph.openContainer(id), one.id);
  await page.waitForTimeout(1300);
  const o0 = await acts(page);
  await page.mouse.move(at1.x, at1.y);
  for (let i = 0; i < 10; i++) { await s.wheel(-100); await page.waitForTimeout(60); }
  await page.waitForTimeout(800);
  const o1 = await acts(page);
  const capOne = await page.evaluate(() => window.__zoom());
  const lastMoved = o0[one.id] && o1[one.id] && o0[one.id].centre && o1[one.id].centre ? dist(o0[one.id].centre, o1[one.id].centre) : Infinity;
  const hullGrew = o1[one.id].box.w / o0[one.id].box.w;
  record(tag('part 2 Act One open: ten wheel steps in, its last chapter stays where it rests (within 2 px)'), lastMoved <= 2, `zoom ${r2(capOne)}x; moved ${r1(lastMoved)} px`);
  record(tag('part 2 Act One open: its hull grows by the zoom (within 3%)'), Math.abs(hullGrew / capOne - 1) <= 0.03, `${r2(hullGrew)} against ${r2(capOne)}`);
  const go = leastGap(o1, true);
  record(tag('part 2 Act One open, zoomed in: it meets no other act, 16 px apart at the least'), go.least >= 15.5, `${go.pair}: ${r1(go.least)} px`);
  shots.oneOpen = await shot('act-one-open-zoomed');
  await reset(page);

  // Every act open: the furthest zoom, and no two meet.
  await page.evaluate(() => window.PostPipeGraph.openAllContainers());
  await page.waitForTimeout(1300);
  await page.mouse.move(at1.x, at1.y);
  for (let i = 0; i < 10; i++) { await s.wheel(-100); await page.waitForTimeout(60); }
  await page.waitForTimeout(800);
  const capAll = await page.evaluate(() => window.__zoom());
  const ao = await acts(page);
  const ga = leastGap(ao, true);
  record(tag('part 2 every act open, ten wheel steps in: no two meet, 16 px apart at the least'), ga.least >= 15.5, `stopped at ${r2(capAll)}x; ${ga.pair}: ${r1(ga.least)} px`);
  console.log(`      the zoom stops at: ${r2(capClosed)}x every act closed, ${r2(capOne)}x Act One open, ${r2(capAll)}x every act open`);
  shots.caps = { closed: capClosed, one: capOne, all: capAll };

  // ── Part 4: faded while a card is under it ──
  await reset(page);
  await page.evaluate(() => window.PostPipeGraph.openAllContainers());
  await page.waitForTimeout(1300);
  let rf = await page.evaluate(() => ({ r: window.__rights(), cards: window.__cards().map((c) => c.box) }));
  const meets = (r, cards) => cards.some((c) => c.x0 < r.box.x1 && r.box.x0 < c.x1 && c.y0 < r.box.y1 && r.box.y0 < c.y1);
  if (!meets(rf.r, rf.cards)) {
    // No card at the foot: the view panned up until one is.
    const lowest = Math.max(...rf.cards.map((c) => c.y1).filter((y) => y < rf.r.box.y0));
    const by = Math.ceil(rf.r.box.y0 - lowest + 6);
    const crownY = await page.evaluate((crown) => { const r = document.querySelector('[data-cover-art]').getBoundingClientRect(); return r.top + crown * r.height; }, CROWN);
    const from = { x: phone ? 385 : 1272, y: Math.round(crownY + 40) };
    await page.mouse.move(from.x, from.y); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(from.x, from.y + (by * i) / 8);
    await page.mouse.up();
    await page.waitForTimeout(500);
    rf = await page.evaluate(() => ({ r: window.__rights(), cards: window.__cards().map((c) => c.box) }));
  }
  record(tag('part 4: a card under the rights line, and it fades to a quarter'), meets(rf.r, rf.cards) && rf.r.over && Math.abs(rf.r.opacity - 0.25) < 0.01, `opacity ${rf.r.opacity}`);
  shots.rightsOver = await shot('rights-over-card');
  await reset(page);
  await page.waitForTimeout(400);
  const rb = await page.evaluate(() => window.__rights());
  record(tag('part 4: no card under it again, and it is back to full'), !rb.over && rb.opacity === 1, `opacity ${rb.opacity}`);

  // ── Part 1: every act open, in the same teal and face ──
  await page.evaluate(() => window.PostPipeGraph.openAllContainers());
  await page.waitForTimeout(1300);
  const op = await acts(page);
  for (const a of ACTS) {
    const x = op[a.id];
    record(tag(`part 1 ${a.name} open: hull outline and fill in the teal, the fill at ${TEAL.fillOpacity}`), !!x && !x.closed && x.stroke === teal && x.fill === teal && Math.abs(x.fillOpacity - TEAL.fillOpacity) < 0.005, x ? `${x.stroke}, ${x.fill} at ${x.fillOpacity}` : '');
    record(tag(`part 1 ${a.name} open: its title in the title's face and the lighter teal, as the closed act's`), !!x && /Dela Gothic One/.test(x.labelFace) && x.labelFill === tealLabel && x.labelOpacity === 1, x ? `${x.labelFace.split(',')[0]}, ${x.labelFill} at ${x.labelOpacity}` : '');
  }
  const cardsTeal = await page.evaluate(() => window.__cards());
  shots.open = await shot('all-open');
  await reset(page);
  await page.evaluate((id) => window.PostPipeGraph.openContainer(id), one.id);
  await page.waitForTimeout(1300);
  shots.oneOpenRest = await shot('act-one-open');
  await reset(page);

  // ── Part 2b: the roots answer the act ──
  const follow = async (label, act, { ahead }) => {
    // Recorded at every frame: the act as drawn (its node's origin) and its
    // root's tip, along the drag's line (x).
    await page.evaluate((id) => {
      window.__rec = [];
      window.__recOn = true;
      const macro = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"] .container-macro-node`);
      const loop = () => {
        if (!window.__recOn) return;
        const m = macro.getScreenCTM();
        const t = window.__tip(id);
        window.__rec.push({ t: performance.now(), x: m.e, y: m.f, tx: t ? t.x : NaN, ty: t ? t.y : NaN });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }, two.id);
    const t0 = await act();
    await page.waitForTimeout(1000);
    const rec = await page.evaluate(() => { window.__recOn = false; return window.__rec; });
    return { rec, t0 };
  };
  const two = byName('Act Two');
  const dragOnce = async (label) => {
    const start = (await acts(page))[two.id].centre;
    const tipStart = (await tips(page))[two.id];
    const { rec, t0 } = await follow(label, async () => {
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      for (let i = 1; i <= 12; i++) { await page.mouse.move(start.x + 10 * i, start.y); await page.waitForTimeout(40); }
      await page.mouse.up();
      return page.evaluate(() => performance.now());
    }, { ahead: false });
    const rows = rec.map((r) => ({ t: r.t, act: r.x - start.x, root: r.tx - tipStart.x })).filter((r) => Number.isFinite(r.root));
    const behind = rows.every((r) => r.root <= r.act + 0.5);
    const lagged = rows.filter((r) => r.t < t0 && r.act - r.root >= 3).length;
    const after = rows.filter((r) => r.t >= t0);
    const caught = after.find((r, i) => after.slice(i).every((q) => Math.abs(q.act - q.root) <= 2));
    const worst = Math.max(...rows.map((r) => r.root - r.act));
    record(tag(`part 2b ${label}: Act Two dragged 120 px, at every frame its root has moved no further than the act as drawn`), behind && rows.length > 10, `${rows.length} frames; the root ahead by ${r1(Math.max(0, worst))} px at most`);
    record(tag(`part 2b ${label}: mid-drag the root measurably behind`), lagged >= 2, `${lagged} frames 3 px or more behind; most ${r1(Math.max(...rows.map((r) => r.act - r.root)))} px`);
    record(tag(`part 2b ${label}: after the release the root is on the act within 300 ms`), !!caught && caught.t - t0 <= 300, caught ? `${r1(caught.t - t0)} ms` : 'never');
    return { start, tipStart };
  };
  await dragOnce('first drag');
  // Reset: the act goes back to its tip, its root after it.
  {
    const nowAct = (await acts(page))[two.id].centre;
    const home = (await anchors(page))[two.id];
    const tipNow = (await tips(page))[two.id];
    const { rec, t0 } = await follow('Reset', async () => {
      const t = await page.evaluate(() => performance.now());
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
      return t;
    }, { ahead: true });
    // Distance from home along x: the root never nearer home than the act.
    const span = nowAct.x - home.x;
    const tipHome = tipNow.x - span;
    const rows = rec.map((r) => ({ t: r.t, act: r.x - home.x, root: r.tx - tipHome })).filter((r) => Number.isFinite(r.root) && r.t >= t0);
    const behind = rows.every((r) => r.root >= r.act - 0.5);
    const lagged = rows.filter((r) => r.root - r.act >= 3).length;
    const end = rows[rows.length - 1];
    record(tag('part 2b Reset: the act goes back first, its root after it, never ahead'), behind && lagged >= 2, `${rows.length} frames, ${lagged} 3 px or more behind; ahead by ${r1(Math.max(0, ...rows.map((r) => r.act - r.root)))} px at most`);
    record(tag('part 2b Reset: both back home'), !!end && Math.abs(end.act) <= 1 && Math.abs(end.root) <= 1.5, end ? `act ${r1(end.act)}, root ${r1(end.root)} px from home` : 'no frames');
  }
  await page.waitForTimeout(600);
  await dragOnce('after a Reset');
  await reset(page);

  // A pan: reported.
  {
    const a0 = await acts(page), an = await anchors(page);
    const from = phone ? { x: 300, y: 790 } : { x: 1200, y: 740 };
    await page.mouse.move(from.x, from.y); await page.mouse.down();
    for (let i = 1; i <= 8; i++) await page.mouse.move(from.x - 5 * i, from.y - 5 * i);
    await page.mouse.up();
    await page.waitForTimeout(500);
    const a1 = await acts(page);
    const offTip = ACTS.map((x) => r1(dist(a1[x.id].centre, an[x.id])));
    console.log(`      a pan of 40,40 px: the acts move with it, off their tips by ${offTip.join(', ')} px (the art does not pan)`);
    await reset(page);
  }

  // ── Part 4b: the node colour ──
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('postpipe:toggle-settings', { detail: { where: 'graph', open: true } })));
  await page.waitForTimeout(500);
  const choice = await page.evaluate(() => {
    const row = document.querySelector('[data-settings-panel] [data-choice="nodePalette"]');
    if (!row) return null;
    return [...row.querySelectorAll('[role="radio"]')].map((b) => ({ id: b.dataset.value, label: b.textContent.trim(), on: b.getAttribute('aria-checked') === 'true', swatch: !!b.querySelector('[data-palette-swatch]') }));
  });
  record(tag('part 4b: the panel offers the node colour, two labelled swatches, teal chosen'), !!choice && choice.length === 2 && choice[0].label === TEAL.label && choice[1].label === BERRY.label && choice.every((c) => c.swatch) && choice[0].on,
    choice ? choice.map((c) => `${c.label}${c.on ? ' (on)' : ''}`).join(', ') : 'missing');
  shots.panel = await shot('panel-node-colour');
  const textBefore = cardsTeal.map((c) => c.text);
  await page.click(`[data-settings-panel] [data-choice="nodePalette"] [data-value="${BERRY.id}"]`);
  await page.waitForTimeout(300);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('postpipe:toggle-settings', { detail: { where: 'graph', open: false } })));
  await page.waitForTimeout(300);
  const berry = hexRgb(BERRY.color), berryLabel = hexRgb(BERRY.labelColor || BERRY.color);
  const closedB = await acts(page);
  record(tag('part 4b berry: every closed act\'s outline, fill and label in berry'), ACTS.every((a) => closedB[a.id].stroke === berry && closedB[a.id].fill === berry && closedB[a.id].labelFill === berryLabel),
    ACTS.map((a) => `${closedB[a.id].stroke}/${closedB[a.id].labelFill}`).join('; '));
  await page.evaluate(() => window.PostPipeGraph.openAllContainers());
  await page.waitForTimeout(1300);
  const openB = await acts(page);
  const cardsB = await page.evaluate(() => window.__cards());
  record(tag('part 4b berry: every open hull and title in berry'), ACTS.every((a) => openB[a.id].stroke === berry && openB[a.id].fill === berry && openB[a.id].labelFill === berryLabel),
    ACTS.map((a) => `${openB[a.id].stroke}/${openB[a.id].labelFill}`).join('; '));
  record(tag('part 4b berry: every card\'s outline in berry, its text as it was'), cardsB.length > 10 && cardsB.every((c) => c.outline === berry) && cardsB.every((c, i) => c.text === textBefore[i] || textBefore[i] === undefined),
    `${cardsB.length} cards, outlines ${[...new Set(cardsB.map((c) => c.outline))].join(', ')}; teal before: ${[...new Set(cardsTeal.map((c) => c.outline))].join(', ')}`);
  shots.berry = await shot('berry-all-open');
  await reset(page);
  await page.waitForTimeout(1200);
  await page.reload();
  await ready(page);
  await scrollOnce(s);
  const kept = await acts(page);
  record(tag('part 4b: a reload keeps berry'), ACTS.every((a) => kept[a.id] && kept[a.id].stroke === berry), ACTS.map((a) => kept[a.id] && kept[a.id].stroke).join('; '));
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('postpipe:toggle-settings', { detail: { where: 'graph', open: true } })));
  await page.waitForTimeout(500);
  await page.click('[data-forget-ask]');
  await page.waitForTimeout(200);
  await Promise.all([page.waitForNavigation({ timeout: 15000 }).catch(() => {}), page.click('[data-forget-yes]')]);
  await ready(page);
  await scrollOnce(s);
  const after = await acts(page);
  record(tag('part 4b: Forget goes back to teal'), ACTS.every((a) => after[a.id] && after[a.id].stroke === teal), ACTS.map((a) => after[a.id] && after[a.id].stroke).join('; '));

  // ── Part 4b: the art state's roots untouched ──
  await page.evaluate(() => window.PostPipeCover.go('art'));
  await page.waitForTimeout(1500);
  const artFilter = await page.evaluate(() => [...document.querySelectorAll('[data-roots-vector], [data-cover-image="graph"], [data-cover-image="art"]')].map((e) => getComputedStyle(e).filter));
  const H = phone ? 844 : 800;
  const clip = { x: 0, y: Math.round(H * 0.6), width: phone ? 390 : 1280, height: Math.round(H * 0.4) - 40 };
  const artA = await grab(page, clip);
  await page.evaluate(() => {
    const st = document.createElement('style');
    st.textContent = '[data-roots-vector], [data-cover-image="graph"] { filter: none !important; }';
    document.head.appendChild(st);
  });
  await page.waitForTimeout(250);
  const artB = await grab(page, clip);
  let diff = 0;
  for (let y = 0; y < artA.height; y += 2) for (let x = 0; x < artA.width; x += 2) {
    const a = artA.at(x, y), b = artB.at(x, y);
    diff = Math.max(diff, Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
  }
  record(tag('part 4b art: the art state\'s roots as drawn (no brightness on them, the same pixels with it taken off)'), artFilter.every((f) => f === 'none') && diff <= 2, `${artFilter.join(', ')}; at most ${diff} apart`);

  record(tag('no page errors'), s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// A zoom sequence on the phone: at rest, a 2x zoom asked for, and 4x, each
// as drawn, with the zoom it reached.
async function zoomSequence() {
  if (!SHOTS) return;
  const s = await open(chromium, 'chromium', 'phone');
  await scrollOnce(s);
  const out = [];
  for (const ask of [1, 2, 4]) {
    await reset(s.page);
    if (ask > 1) {
      await s.page.mouse.move(330, 844 - 110);
      // d3's wheel: 2^(-deltaY * 0.002) a step.
      await s.wheel(-500 * Math.log2(ask));
      await s.page.waitForTimeout(900);
    }
    const r = await s.page.evaluate(() => window.__zoom());
    const f = path.join(SHOTS, `zoom-${ask}x-phone-chromium.png`);
    await s.page.screenshot({ path: f });
    out.push({ ask, r, f });
  }
  await s.browser.close();
  return out;
}

// Pictures side by side on one canvas, at given scales, each with a label.
async function strip(file, items) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
  const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const url = await page.evaluate(async (items) => {
    const load = async (src) => { const i = new Image(); i.src = src; await i.decode(); return i; };
    const imgs = await Promise.all(items.map((it) => load(it.src)));
    const pad = 20;
    const dims = items.map((it, i) => ({ w: (it.crop ? it.crop.w : imgs[i].width) * it.scale, h: (it.crop ? it.crop.h : imgs[i].height) * it.scale }));
    const c = document.createElement('canvas');
    c.width = dims.reduce((t, d) => t + d.w + pad, pad);
    c.height = Math.max(...dims.map((d) => d.h)) + 50;
    const x = c.getContext('2d');
    x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#ddd'; x.font = '13px sans-serif';
    let dx = pad;
    items.forEach((it, i) => {
      const cr = it.crop || { x: 0, y: 0, w: imgs[i].width, h: imgs[i].height };
      x.drawImage(imgs[i], cr.x, cr.y, cr.w, cr.h, dx, 34, dims[i].w, dims[i].h);
      x.fillText(it.label, dx, 20);
      dx += dims[i].w + pad;
    });
    return c.toDataURL('image/png');
  }, items.map((it) => ({ ...it, src: b64(it.file) })));
  fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  await browser.close();
  console.log(`composite -> ${path.relative(process.cwd(), file)}`);
}

(async () => {
  const server = http.createServer((req, res) => handler(req, res, { public: SITE }));
  await new Promise((r) => server.listen(PORT, r));
  const engines = { chromium, webkit };
  const results = [];
  const tally = {};
  const forComposite = {};
  for (const name of ENGINES) {
    for (const size of ['desktop', 'phone']) {
      const key = `${name} ${size}`;
      tally[key] = { pass: 0, fail: 0 };
      const record = (label, ok, detail = '') => {
        results.push({ key, label, ok, detail });
        tally[key][ok ? 'pass' : 'fail']++;
        console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
      };
      const shots = {};
      try {
        await run(engines[name], name, size, record, shots);
        if (name === 'chromium') forComposite[size] = shots;
      } catch (e) {
        console.log(`NOT RUN  ${key}: ${e.message.split('\n')[0]}`);
        tally[key].notRun = true;
      }
    }
  }
  if (SHOTS && forComposite.phone && forComposite.phone.closed) {
    // The mockup's phone is 293 of its px across for the phone's 390; the
    // phone's shots are at 3x.
    const k = 293 / 390 / 3;
    const p = forComposite.phone;
    await strip(path.join(SHOTS, 'composite-phone.png'), [
      { file: MOCKUP, scale: 1, crop: MOCK.art, label: 'mockup, art' },
      { file: p.art, scale: k, label: 'preview, art (x0.751)' },
      { file: MOCKUP, scale: 1, crop: MOCK.graph, label: 'mockup, graph' },
      { file: p.closed, scale: k, label: 'preview, every act closed' },
      { file: p.oneOpenRest, scale: k, label: 'preview, Act One open' },
      { file: p.open, scale: k, label: 'preview, every act open' },
    ]);
    const seq = await zoomSequence();
    if (seq) {
      await strip(path.join(SHOTS, 'zoom-sequence-phone.png'), seq.map((z) => ({
        file: z.f, scale: k, label: z.ask === 1 ? `at rest (1x)` : `${z.ask}x asked, ${z.r.toFixed(2)}x reached${z.r < z.ask - 0.01 ? ' (the cap)' : ''}`,
      })));
    }
  }
  server.close();
  console.log('\nsummary');
  for (const [k, t] of Object.entries(tally)) console.log(`  ${k}: ${t.notRun ? 'NOT RUN' : `${t.pass} pass, ${t.fail} fail`}`);
  const failed = results.filter((r) => !r.ok).length;
  const notRun = Object.values(tally).filter((t) => t.notRun).length;
  console.log(`\n${results.length - failed} PASS, ${failed} FAIL${notRun ? `, ${notRun} NOT RUN` : ''}`);
  process.exit(failed || notRun ? 1 : 0);
})();

// Browser checks for the two screens of Harold's iPhone 13 mockup
// (_handoff/T35-mockup-iphone13-two-states.png): opening.fit width,
// opening.graph.rootsFit width and artStateOpacity 0, the top bar in the
// graph state alone on its band, opening.returnAbove crown, the title set to
// its widths and the byline to its last line's, the acts as teal blobs in
// the title's face at the mockup's places, open acts kept apart, and the
// roots drawn from cover/roots.svg and bent toward a moved act. On a built
// site:
//   - the art state, as it loads: nothing of the graph drawn or under the
//     pointer anywhere, no top bar; the plant across the screen's width (on
//     a phone 14 px in from each edge; on a desktop as wide as keeps the
//     crown on the screen) and the roots running off the bottom;
//   - the byline under the title's last line and within 10% of its width,
//     in the art state and in the graph state;
//   - after one scroll, the graph state: the top bar shown on its band, the
//     roots' widest row edge to edge on a phone (on a desktop the whole
//     picture on the screen), the small plant under the band;
//   - the three closed acts: blobs (not capsules), filled with the title's
//     teal at 0.35, their labels in the title's face, each centred on its
//     anchor, Act Two at the left, Act Three at the right, Act One at the
//     bottom centre, all on the screen;
//   - the roots: drawn from the svg in place of the picture's, no rootlets
//     for an act with its own roots; Act Two dragged, its root's tip moves
//     with it; Reset, and it is back;
//   - a scroll up below the crown stays in the graph state; above it (on
//     the title) goes back to the art; on a phone a drag down above the
//     crown does too;
//   - every act open: no two hulls meet, 16 px apart at the least.
// Chromium and WebKit, desktop (1280x800) and phone (390x844). With
// PP_E2E_SHOTS set, a screenshot per state, size and engine, and composites
// of the mockup's two screens beside the preview at the mockup's scale
// (and laid over it, on a phone).
//
//   node test/e2e/t35_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39465;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const OPENING = SETTINGS.opening || {};
const GS = SETTINGS.graph || {};
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const MOCKUP = path.resolve(__dirname, '../../_handoff/T35-mockup-iphone13-two-states.png');
const CONTAINERS = SETTINGS.containers || {};
const ACTS = Object.entries(CONTAINERS)
  .filter(([id, c]) => id.startsWith('container:') && c && c.anchor)
  .map(([id, c]) => ({ id, anchor: c.anchor, fill: c.fill, fillOpacity: c.fillOpacity, face: c.labelFace, rootTips: c.rootTips || [] }));
const LABELS = Object.fromEntries((SETTINGS.containment || []).map((c) => [c.id, c.label]));
const byLabel = (l) => ACTS.find((a) => LABELS[a.id] === l);
const CROWN = OPENING.crownY;
// The mockup's two screens, in its own px: the left (art) and right (graph).
const MOCK = { art: { x: 5, y: 87, w: 293, h: 493 }, graph: { x: 345, y: 87, w: 292, h: 493 } };

if (OPENING.fit !== 'width' || !OPENING.graph || OPENING.graph.rootsFit !== 'width' || OPENING.returnAbove !== 'crown'
  || !byLabel('Act One') || !byLabel('Act Two') || !byLabel('Act Three') || !(OPENING.art && OPENING.art.rootsVector)) {
  console.error('this site does not set the two screens (opening.fit width, graph.rootsFit width, returnAbove crown, art.rootsVector, acts labelled Act One, Act Two and Act Three); nothing to check');
  process.exit(1);
}

async function open(bt, name, size) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame && window.PostPipeGraphWorld && window.PostPipeGraph, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(touchEvents);
  await page.waitForTimeout(900);
  return { browser, ctx, page, errors, phone, name };
}

function touchEvents() {
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
}

async function scrollOnce(s) {
  await s.page.mouse.move(s.phone ? 195 : 640, s.phone ? 420 : 400);
  await s.page.mouse.wheel(0, 120);
  await s.page.waitForFunction(() => window.PostPipeCover.state === 'graph', null, { timeout: 5000 }).catch(() => {});
  await s.page.waitForTimeout(1600);
}

// The pictures' ink, read in the page: the art state's plant (its columns
// above the crown) and the graph state's widest row of roots (below it), as
// shares of the picture's width.
const inks = (page, crown) => page.evaluate(async (crown) => {
  const read = async (img) => {
    const i = new Image();
    i.src = img.currentSrc || img.src;
    await i.decode();
    const c = document.createElement('canvas');
    c.width = i.naturalWidth; c.height = i.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(i, 0, 0);
    return { w: c.width, h: c.height, d: x.getImageData(0, 0, c.width, c.height).data };
  };
  const a = await read(document.querySelector('[data-cover-image="art"]'));
  const g = await read(document.querySelector('[data-cover-image="graph"]'));
  const cy = Math.round(crown * a.h);
  let l = a.w, r = -1;
  for (let y = 0; y < cy; y++) for (let x = 0; x < a.w; x++) if (a.d[(y * a.w + x) * 4 + 3] >= 64) { if (x < l) l = x; if (x > r) r = x; }
  let best = null;
  for (let y = cy; y < g.h; y++) {
    let lo = -1, hi = -1;
    for (let x = 0; x < g.w; x++) if (g.d[(y * g.w + x) * 4 + 3] >= 64) { if (lo < 0) lo = x; hi = x; }
    if (lo >= 0 && (!best || hi - lo > best.r - best.l)) best = { l: lo, r: hi, y };
  }
  let top = 0;
  outer: for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) if (g.d[(y * g.w + x) * 4 + 3] >= 64) { top = y; break outer; }
  return { bush: { l: l / a.w, r: (r + 1) / a.w }, roots: { l: best.l / g.w, r: (best.r + 1) / g.w }, graphTop: top / g.h };
}, crown);

// The cover as it is drawn: the art's box, the title's last line, the
// byline, the top bar, the graph's layers.
const cover = (page) => page.evaluate(() => {
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, w: r.width, h: r.height }; };
  const art = box(document.querySelector('[data-cover-art]'));
  const lastLine = (which) => {
    const lines = [...document.querySelectorAll(`[data-cover-title="${which}"] [data-cover-title-line]`)];
    return box(lines[lines.length - 1]);
  };
  const by = document.querySelector('[data-cover-byline]');
  const bar = document.querySelector('[data-feeds]');
  const band = document.querySelector('[data-top-band]');
  const barCs = bar && getComputedStyle(bar);
  const root = document.querySelector('[data-graph-root]');
  const layers = root ? [...root.children].map((c) => getComputedStyle(c).display) : [];
  return {
    W: innerWidth, H: innerHeight, state: window.PostPipeCover.state,
    art, lineArt: lastLine('art'), lineGraph: lastLine('graph'), byline: box(by),
    bylineOpacity: by ? Number(getComputedStyle(by).opacity) : 0,
    bar: bar ? { visibility: barCs.visibility, opacity: Number(barCs.opacity), box: box(bar) } : null,
    band: band ? { opacity: Number(getComputedStyle(band).opacity), box: box(band), bg: getComputedStyle(band).backgroundColor } : null,
    layers,
    frame: window.PostPipeCoverFrame.art,
  };
});

// What is under the pointer on a grid over the whole screen: anything of
// the graph, and anything of the top bar.
const hits = (page) => page.evaluate(() => {
  const out = { graph: 0, bar: 0, n: 0 };
  for (let y = 4; y < innerHeight; y += 23) {
    for (let x = 4; x < innerWidth; x += 23) {
      const el = document.elementFromPoint(x, y);
      out.n++;
      if (!el) continue;
      if (el.closest('[data-graph-root], .container-group, .node-card')) out.graph++;
      if (el.closest('[data-feeds], [data-settings-gear], [data-top-band]')) out.bar++;
    }
  }
  return out;
});

// Each act as drawn: closed or open, its outline in screen px, the fill and
// the label's face.
const actsNow = (page) => page.evaluate((ids) => {
  const outline = (path) => {
    const m = path.getScreenCTM();
    const len = path.getTotalLength();
    const pts = [];
    for (let i = 0; i < 180; i++) {
      const q = path.getPointAtLength((len * i) / 180);
      pts.push({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f });
    }
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return { pts, x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  };
  const out = {};
  for (const id of ids) {
    const g = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
    if (!g) { out[id] = null; continue; }
    const macro = g.querySelector('.container-macro-node');
    const closed = !!macro && getComputedStyle(macro).display !== 'none';
    if (closed) {
      const bg = macro.querySelector('.container-macro-bg');
      const text = macro.querySelector('.container-macro-text');
      const cs = getComputedStyle(bg), ts = getComputedStyle(text);
      const o = outline(bg);
      const mm = macro.getScreenCTM();
      out[id] = { closed, ...o, centre: { x: mm.e, y: mm.f }, fill: cs.fill, fillOpacity: Number(cs.fillOpacity), stroke: cs.stroke, face: ts.fontFamily, label: text.textContent, labelFill: ts.fill };
    } else {
      const hull = g.querySelector('.container-hull');
      out[id] = { closed, ...outline(hull) };
    }
  }
  return out;
}, ACTS.map((a) => a.id));

// The roots as drawn from the svg: the layer's state and strength, the
// picture's own roots' strength, the rootlets, and the tip of each act's
// root (the last point of its last part), in screen px.
const rootsNow = (page) => page.evaluate((acts) => {
  const svg = document.querySelector('[data-roots-vector]');
  const img = document.querySelector('[data-cover-image="graph"]');
  const tips = {};
  for (const a of acts) {
    const parts = [...document.querySelectorAll(`[data-roots-vector] path[data-act-root="${CSS.escape(a)}"]`)];
    const last = parts[parts.length - 1];
    if (!last) { tips[a] = null; continue; }
    const n = last.getTotalLength();
    const q = last.getPointAtLength(n);
    const m = last.getScreenCTM();
    tips[a] = { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
  }
  return {
    state: svg && svg.getAttribute('data-roots-vector'),
    paths: svg ? svg.querySelectorAll('path').length : 0,
    opacity: svg ? Number(getComputedStyle(svg).opacity) : 0,
    imageOpacity: img ? Number(getComputedStyle(img).opacity) : 1,
    rootlets: [...document.querySelectorAll('[data-reach]')].map((g) => g.getAttribute('data-reach-container')),
    tips,
  };
}, ACTS.map((a) => a.id));

const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const gapBetween = (a, b) => Math.max(b.x0 - a.x1, a.x0 - b.x1, b.y0 - a.y1, a.y0 - b.y1);

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
  const ink = await inks(page, CROWN);

  // ── The art state, as it loads ──
  const a = await cover(page);
  record(tag('art: the page opens on the art'), a.state === 'art', a.state);
  record(tag('art: the graph is not drawn (its layers display none)'), a.layers.length > 0 && a.layers.every((d) => d === 'none'), a.layers.join(','));
  const h0 = await hits(page);
  record(tag('art: nothing of the graph under the pointer anywhere'), h0.graph === 0, `${h0.graph} of ${h0.n} points`);
  record(tag('art: no top bar (hidden and nothing of it under the pointer)'), !!a.bar && a.bar.visibility === 'hidden' && a.bar.opacity === 0 && h0.bar === 0, a.bar ? `${a.bar.visibility}, ${a.bar.opacity}, ${h0.bar} hits` : 'no bar');
  const bushL = a.art.x0 + ink.bush.l * a.art.w, bushR = a.art.x0 + ink.bush.r * a.art.w;
  const crownY = a.art.y0 + CROWN * a.art.h;
  const side = Number(OPENING.sideMargin) || 0;
  if (phone) {
    record(tag(`art: the plant spans the screen's width, ${side} px in from each edge`), Math.abs(bushL - side) <= 2 && Math.abs(bushR - (a.W - side)) <= 2, `${r1(bushL)} to ${r1(bushR)} of ${a.W}`);
  } else {
    const byWidth = Math.abs(bushL - side) <= 2 && Math.abs(bushR - (a.W - side)) <= 2;
    record(tag('art: the plant as wide as keeps the crown on the screen (desktop)'), byWidth || (crownY <= a.H + 1 && crownY >= a.H - 140), `plant ${r1(bushL)} to ${r1(bushR)}, crown at ${r1(crownY)} of ${a.H}`);
  }
  record(tag('art: the plant across the middle'), Math.abs((bushL + bushR) / 2 - a.W / 2) <= 2, r1((bushL + bushR) / 2));
  record(tag('art: the crown on the screen and the roots running off its bottom'), crownY < a.H && a.art.y1 >= a.H - 1, `crown ${r1(crownY)}, art to ${r1(a.art.y1)} of ${a.H}`);
  const byArt = a.byline, lineArt = a.lineArt;
  record(tag('art: the byline under the title\'s last line, at its left edge'), !!byArt && !!lineArt && byArt.y0 > lineArt.y0 + lineArt.h * 0.5 && byArt.y0 < lineArt.y1 + lineArt.h && Math.abs(byArt.x0 - lineArt.x0) <= lineArt.h * 0.25,
    byArt && lineArt ? `line ${r1(lineArt.x0)},${r1(lineArt.y0)}-${r1(lineArt.y1)}; byline ${r1(byArt.x0)},${r1(byArt.y0)}` : 'missing');
  record(tag('art: the byline within 10% of the last line\'s width'), !!byArt && Math.abs(byArt.w / lineArt.w - 1) <= 0.1, byArt ? `${r1(byArt.w)} against ${r1(lineArt.w)}` : 'missing');
  record(tag('art: the title over the plant\'s lower half'), lineArt.y0 > a.art.y0 + CROWN * a.art.h * 0.4 && lineArt.y1 < crownY, `last line ${r1(lineArt.y0)}-${r1(lineArt.y1)}, crown ${r1(crownY)}`);
  shots.art = await shot('art');

  // ── The graph state ──
  await scrollOnce(s);
  const g = await cover(page);
  record(tag('graph: one scroll down reaches the graph state'), g.state === 'graph', g.state);
  record(tag('graph: the graph drawn again'), g.layers.every((d) => d !== 'none'), g.layers.join(','));
  record(tag('graph: the top bar shown, on its band'), g.bar.visibility === 'visible' && g.bar.opacity === 1 && !!g.band && g.band.opacity === 1 && g.band.box.x0 <= 0 && g.band.box.x1 >= g.W && g.band.box.y1 >= g.bar.box.y1,
    `bar ${g.bar.visibility} ${g.bar.opacity}; band ${g.band ? `${r1(g.band.box.x0)}-${r1(g.band.box.x1)} to ${r1(g.band.box.y1)}, ${g.band.bg}` : 'none'}`);
  const rootsL = g.art.x0 + ink.roots.l * g.art.w, rootsR = g.art.x0 + ink.roots.r * g.art.w;
  if (phone) {
    record(tag("graph: the roots' widest row edge to edge"), Math.abs(rootsL) <= 2 && Math.abs(rootsR - g.W) <= 2, `${r1(rootsL)} to ${r1(rootsR)} of ${g.W}`);
  } else {
    record(tag('graph: the whole picture on the screen, the roots across the middle (desktop)'), g.art.y1 <= g.H + 1 && Math.abs((rootsL + rootsR) / 2 - g.W / 2) <= 2, `art to ${r1(g.art.y1)}, roots ${r1(rootsL)} to ${r1(rootsR)}`);
  }
  const plantTop = g.art.y0 + ink.graphTop * g.art.h;
  record(tag('graph: the small plant at the top, under the band'), plantTop >= g.band.box.y1 - 1 && plantTop <= g.band.box.y1 + 20, `plant ${r1(plantTop)}, band to ${r1(g.band.box.y1)}`);
  const lineGraph = g.lineGraph, byG = g.byline;
  const crownG = g.art.y0 + CROWN * g.art.h;
  record(tag('graph: the title under the small plant, above the crown'), lineGraph.y0 > plantTop && lineGraph.y1 <= crownG + 2, `title ${r1(lineGraph.y0)}-${r1(lineGraph.y1)}, crown ${r1(crownG)}`);
  record(tag('graph: the byline under the title\'s last line, at its left edge'), !!byG && byG.y0 > lineGraph.y0 + lineGraph.h * 0.5 && byG.y0 < lineGraph.y1 + lineGraph.h && Math.abs(byG.x0 - lineGraph.x0) <= lineGraph.h * 0.25 && g.bylineOpacity > 0.3,
    `line ${r1(lineGraph.x0)},${r1(lineGraph.y0)}-${r1(lineGraph.y1)}; byline ${r1(byG.x0)},${r1(byG.y0)}, opacity ${r1(g.bylineOpacity)}`);
  record(tag('graph: the byline within 10% of the last line\'s width'), Math.abs(byG.w / lineGraph.w - 1) <= 0.1, `${r1(byG.w)} against ${r1(lineGraph.w)}`);

  // The closed acts: blobs in the teal, in the title's face, at the mockup's places.
  const acts = await actsNow(page);
  const one = byLabel('Act One'), two = byLabel('Act Two'), three = byLabel('Act Three');
  for (const act of ACTS) {
    const m = acts[act.id];
    const at = { x: g.frame.left + act.anchor.x * g.frame.width, y: g.frame.top + act.anchor.y * g.frame.height };
    record(tag(`${LABELS[act.id]}: closed, centred on its anchor`), !!m && m.closed && Math.hypot(m.centre.x - at.x, m.centre.y - at.y) <= 2, m ? `${r1(Math.hypot(m.centre.x - at.x, m.centre.y - at.y))} px off` : 'missing');
    if (!m || !m.closed) continue;
    const rgb = /rgb\((\d+), (\d+), (\d+)\)/.exec(m.fill);
    const hex = rgb ? '#' + rgb.slice(1, 4).map((v) => Number(v).toString(16).padStart(2, '0')).join('') : m.fill;
    record(tag(`${LABELS[act.id]}: filled with the title's teal at ${act.fillOpacity}, no outline`), hex.toLowerCase() === String(act.fill).toLowerCase() && Math.abs(m.fillOpacity - act.fillOpacity) < 0.01 && m.stroke === 'none', `${hex} at ${m.fillOpacity}, stroke ${m.stroke}`);
    record(tag(`${LABELS[act.id]}: its label "${LABELS[act.id]}" in the title's face`), m.label.trim() === LABELS[act.id] && m.face.includes(act.face), `"${m.label}" in ${m.face}`);
    // A blob, not a capsule: its outline is not symmetric about its centre.
    const c = m.centre;
    const radial = (ang) => {
      let best = 0;
      for (const p of m.pts) {
        const a1 = Math.atan2(p.y - c.y, p.x - c.x);
        const d = Math.abs(Math.atan2(Math.sin(a1 - ang), Math.cos(a1 - ang)));
        if (d < 0.06) best = Math.max(best, Math.hypot(p.x - c.x, p.y - c.y));
      }
      return best;
    };
    let asym = 0;
    for (let k = 0; k < 24; k++) {
      const ang = (k / 24) * Math.PI * 2;
      const r = radial(ang), rm = radial(ang + Math.PI);
      if (r && rm) asym = Math.max(asym, Math.abs(r - rm) / Math.max(r, rm));
    }
    record(tag(`${LABELS[act.id]}: a blob, uneven all round, not a capsule`), asym > 0.04 && (m.x1 - m.x0) / (m.y1 - m.y0) < 2.2, `unevenness ${(asym * 100).toFixed(0)}%, ${r1(m.x1 - m.x0)} by ${r1(m.y1 - m.y0)}`);
    record(tag(`${LABELS[act.id]}: on the screen`), m.x0 >= -0.5 * (m.x1 - m.x0) && m.x1 <= g.W + 0.5 * (m.x1 - m.x0) && m.y1 <= g.H, `${r1(m.x0)}-${r1(m.x1)}, ${r1(m.y0)}-${r1(m.y1)}`);
  }
  const c1 = acts[one.id].centre, c2 = acts[two.id].centre, c3 = acts[three.id].centre;
  record(tag('the acts: Act Two at the left, Act Three at the right, Act One at the bottom centre'), c2.x < c1.x && c1.x < c3.x && c1.y > c2.y && c1.y > c3.y && Math.abs(c1.x - g.W / 2) < g.W * 0.12,
    `Two ${r1(c2.x)},${r1(c2.y)}; One ${r1(c1.x)},${r1(c1.y)}; Three ${r1(c3.x)},${r1(c3.y)}`);
  if (phone) {
    // The mockup's blobs, in its px, as shares of its screen; the preview's
    // as shares of the art's width and height from the roots' crown.
    const mockAt = { 'Act Two': [51.5, 235], 'Act Three': [231, 251], 'Act One': [134, 381] };
    for (const [label, [mx, my]] of Object.entries(mockAt)) {
      const act = byLabel(label);
      const fx = (mx + 12) / 0.3028 / 1045, fy = (my + 253) / 0.3028 / 2111;
      record(tag(`${label}: its anchor is where the mockup draws it`), Math.abs(fx - act.anchor.x) < 0.005 && Math.abs(fy - act.anchor.y) < 0.005, `mockup ${fx.toFixed(4)}, ${fy.toFixed(4)}; anchor ${act.anchor.x}, ${act.anchor.y}`);
    }
  }

  // The roots, as vectors.
  const rv = await rootsNow(page);
  record(tag('roots: drawn from the svg, the picture\'s own roots given way'), rv.state === 'ready' && rv.paths > 100 && rv.opacity > 0.9 && rv.imageOpacity === 0, `${rv.state}, ${rv.paths} paths, at ${r1(rv.opacity)}; the picture's at ${rv.imageOpacity}`);
  const vectorActs = ACTS.filter((x) => rv.tips[x.id]).map((x) => x.id);
  record(tag('roots: each act has its own root, and no rootlets'), vectorActs.length === ACTS.length && !rv.rootlets.some((id) => vectorActs.includes(id)), `roots for ${vectorActs.length}, rootlets for ${[...new Set(rv.rootlets)].join(',') || 'none'}`);
  for (const act of ACTS) {
    const t = rv.tips[act.id], m = acts[act.id];
    if (!t || !m) continue;
    record(tag(`${LABELS[act.id]}: its root's tip under its blob`), t.x >= m.x0 - 4 && t.x <= m.x1 + 4 && t.y >= m.y0 - 4 && t.y <= m.y1 + 4, `tip ${r1(t.x)},${r1(t.y)}; blob ${r1(m.x0)}-${r1(m.x1)}, ${r1(m.y0)}-${r1(m.y1)}`);
  }
  shots.graph = await shot('graph');

  // Act Two dragged: its root's tip goes with it.
  const before = rv.tips[two.id];
  const start = acts[two.id].centre;
  const move = { x: phone ? 60 : 90, y: phone ? 45 : 60 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(start.x + (move.x * i) / 12, start.y + (move.y * i) / 12); await page.waitForTimeout(25); }
  await page.mouse.up();
  await page.waitForTimeout(900);
  const actsD = await actsNow(page);
  const rvD = await rootsNow(page);
  const moved = { x: actsD[two.id].centre.x - start.x, y: actsD[two.id].centre.y - start.y };
  const tipMoved = { x: rvD.tips[two.id].x - before.x, y: rvD.tips[two.id].y - before.y };
  record(tag('roots: Act Two dragged, its root\'s tip goes with it'), Math.hypot(moved.x, moved.y) > 20 && Math.hypot(tipMoved.x - moved.x, tipMoved.y - moved.y) <= Math.max(3, 0.1 * Math.hypot(moved.x, moved.y)),
    `act moved ${r1(moved.x)},${r1(moved.y)}; tip ${r1(tipMoved.x)},${r1(tipMoved.y)}`);
  const otherStill = [one.id, three.id].every((id) => Math.hypot(rvD.tips[id].x - rv.tips[id].x, rvD.tips[id].y - rv.tips[id].y) < 1);
  record(tag('roots: the other acts\' roots stay'), otherStill);
  shots.dragged = await shot('dragged');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
  await page.waitForTimeout(1600);
  const rvR = await rootsNow(page);
  record(tag('roots: Reset, and Act Two\'s root is back'), Math.hypot(rvR.tips[two.id].x - before.x, rvR.tips[two.id].y - before.y) < 2, `${r1(Math.hypot(rvR.tips[two.id].x - before.x, rvR.tips[two.id].y - before.y))} px off`);

  // The way back: below the crown the graph keeps its wheel; above it, back to the art.
  const below = { x: g.W / 2, y: Math.min(g.H - 40, crownG + (g.art.y1 - crownG) * 0.5) };
  await page.mouse.move(below.x, below.y);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(900);
  const stay = await page.evaluate(() => window.PostPipeCover.state);
  record(tag('a scroll up below the crown stays in the graph state'), stay === 'graph', stay);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
  await page.waitForTimeout(1200);
  const above = { x: (lineGraph.x0 + lineGraph.x1) / 2, y: (lineGraph.y0 + lineGraph.y1) / 2 };
  await page.mouse.move(above.x, above.y);
  await page.mouse.wheel(0, -120);
  await page.waitForFunction(() => window.PostPipeCover.state === 'art', null, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(700);
  const back = await page.evaluate(() => window.PostPipeCover.state);
  record(tag('a scroll up on the title, above the crown, goes back to the art'), back === 'art', back);
  const smallPlant = { x: g.W / 2, y: plantTop + 12 };
  await scrollOnce(s);
  await page.mouse.move(smallPlant.x, smallPlant.y);
  await page.mouse.wheel(0, -120);
  await page.waitForFunction(() => window.PostPipeCover.state === 'art', null, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(700);
  record(tag('a scroll up on the small plant goes back to the art'), (await page.evaluate(() => window.PostPipeCover.state)) === 'art');
  if (phone) {
    await scrollOnce(s);
    const y0 = (lineGraph.y0 + lineGraph.y1) / 2;
    await page.evaluate(({ x, y0 }) => {
      const el = document.elementFromPoint(x, y0);
      el.dispatchEvent(window.__touchEvent('touchstart', el, [[x, y0]]));
      for (let i = 1; i <= 8; i++) el.dispatchEvent(window.__touchEvent('touchmove', el, [[x, y0 + i * 30]]));
      el.dispatchEvent(window.__touchEvent('touchend', el, [], [[x, y0 + 240]]));
    }, { x: g.W / 2, y0 });
    await page.waitForFunction(() => window.PostPipeCover.state === 'art', null, { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(600);
    record(tag('a drag down on the title goes back to the art (touch)'), (await page.evaluate(() => window.PostPipeCover.state)) === 'art');
  }
  const a2 = await cover(page);
  record(tag('back on the art: the top bar gone again, the graph not drawn'), a2.bar.visibility === 'hidden' && a2.layers.every((d) => d === 'none'), `${a2.bar.visibility}; ${a2.layers.join(',')}`);

  // Every act open: no two meet.
  await scrollOnce(s);
  await page.evaluate(() => window.PostPipeGraph.openAllContainers());
  await page.waitForTimeout(2200);
  const opened = await actsNow(page);
  const ids = ACTS.map((x) => x.id);
  record(tag('every act open'), ids.every((id) => opened[id] && !opened[id].closed));
  let least = Infinity, pair = '';
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const d = gapBetween(opened[ids[i]], opened[ids[j]]);
    if (d < least) { least = d; pair = `${LABELS[ids[i]]} and ${LABELS[ids[j]]}`; }
  }
  const k = await page.evaluate(() => window.PostPipeGraphWorld.snapshot().k);
  record(tag('every act open: no two hulls meet, 16 px apart at the least'), least >= 16 * (k / 0.4) - 1.5, `the closest, ${pair}, ${r1(least)} px apart`);
  shots.allOpen = await shot('all-open');

  record(tag('no page errors'), s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// The mockup's two screens beside the preview's, at the mockup's scale: on a
// phone the mockup's screen (293 of its px across) is the phone's 390 px,
// so the preview is drawn at 293/390 of its size; on a desktop the preview
// is drawn so its plant (art state) and its roots (graph state) are as wide
// as the mockup's. On a phone the preview is also laid over the mockup at
// half strength.
async function composite(size, shots, art) {
  if (!SHOTS || !shots.art || !shots.graph) return;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
  const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const files = [['composite', false]];
  if (size === 'phone') files.push(['overlay', true]);
  for (const [kind, over] of files) {
    const url = await page.evaluate(async ({ mock, artShot, graphShot, MOCK, size, over, scales }) => {
      const load = async (src) => { const i = new Image(); i.src = src; await i.decode(); return i; };
      const mi = await load(mock), ai = await load(artShot), gi = await load(graphShot);
      const pad = 20;
      const c = document.createElement('canvas');
      const pw = (img, s) => img.width * s, ph = (img, s) => img.height * s;
      const colW = Math.max(MOCK.art.w, pw(ai, scales.art), pw(gi, scales.graph));
      c.width = over ? (MOCK.art.w + MOCK.graph.w + pad * 3) : (colW * 4 + pad * 5);
      c.height = Math.max(MOCK.art.h, ph(ai, scales.art), ph(gi, scales.graph)) + 50;
      const x = c.getContext('2d');
      x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = '#ddd'; x.font = '13px sans-serif';
      const put = (img, sx, sy, sw, sh, dx, dw, dh, alpha = 1) => { x.globalAlpha = alpha; x.drawImage(img, sx, sy, sw, sh, dx, 34, dw, dh); x.globalAlpha = 1; };
      if (over) {
        put(mi, MOCK.art.x, MOCK.art.y, MOCK.art.w, MOCK.art.h, pad, MOCK.art.w, MOCK.art.h);
        put(ai, 0, 0, ai.width, MOCK.art.h / scales.art, pad, MOCK.art.w, MOCK.art.h, 0.5);
        put(mi, MOCK.graph.x, MOCK.graph.y, MOCK.graph.w, MOCK.graph.h, pad * 2 + MOCK.art.w, MOCK.graph.w, MOCK.graph.h);
        put(gi, 0, 0, gi.width, MOCK.graph.h / scales.graph, pad * 2 + MOCK.art.w, MOCK.graph.w, MOCK.graph.h, 0.5);
        x.fillText('art state: the preview over the mockup, half strength', pad, 20);
        x.fillText('graph state: the same', pad * 2 + MOCK.art.w, 20);
      } else {
        let dx = pad;
        put(mi, MOCK.art.x, MOCK.art.y, MOCK.art.w, MOCK.art.h, dx, MOCK.art.w, MOCK.art.h); x.fillText('mockup, art', dx, 20); dx += colW + pad;
        put(ai, 0, 0, ai.width, ai.height, dx, pw(ai, scales.art), ph(ai, scales.art)); x.fillText(`preview ${size}, art, x${scales.art.toFixed(3)}`, dx, 20); dx += colW + pad;
        put(mi, MOCK.graph.x, MOCK.graph.y, MOCK.graph.w, MOCK.graph.h, dx, MOCK.graph.w, MOCK.graph.h); x.fillText('mockup, graph', dx, 20); dx += colW + pad;
        put(gi, 0, 0, gi.width, gi.height, dx, pw(gi, scales.graph), ph(gi, scales.graph)); x.fillText(`preview ${size}, graph, x${scales.graph.toFixed(3)}`, dx, 20);
      }
      return c.toDataURL('image/png');
    }, { mock: b64(MOCKUP), artShot: b64(shots.art), graphShot: b64(shots.graph), MOCK, size, over, scales: art });
    const out = path.join(SHOTS, `${kind}-${size}.png`);
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
    console.log(`${kind} ${size} -> ${path.relative(process.cwd(), out)}`);
  }
  await browser.close();
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
  // The mockup's phone is 293 of its px across for the phone's 390. On a
  // desktop the plant is 362 px across on that phone and the roots 390; the
  // desktop's are read from its own shots' scale.
  const MOCK_PX = 293 / 390;
  for (const [size, shots] of Object.entries(forComposite)) {
    let scales = { art: MOCK_PX, graph: MOCK_PX };
    if (size === 'desktop' && shots.art) {
      const b = await chromium.launch();
      const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
      await p.goto(BASE);
      await p.waitForFunction(() => window.PostPipeCoverFrame && window.PostPipeCover, null, { timeout: 15000 });
      await p.waitForTimeout(1200);
      const artW = await p.evaluate(() => document.querySelector('[data-cover-art]').getBoundingClientRect().width);
      const graphW = await p.evaluate(() => window.PostPipeCoverFrame.art.width);
      await b.close();
      // On the phone the art is drawn 0.379 (art) and 0.4025 (graph) px per
      // px of the picture; the mockup at 0.7513 of that.
      scales = { art: (MOCK_PX * 0.379 * 1045) / artW, graph: (MOCK_PX * 0.4025 * 1045) / graphW };
    }
    await composite(size, shots, scales);
  }
  server.close();
  console.log('\nsummary');
  for (const [k, t] of Object.entries(tally)) console.log(`  ${k}: ${t.notRun ? 'NOT RUN' : `${t.pass} pass, ${t.fail} fail`}`);
  const failed = results.filter((r) => !r.ok).length;
  const notRun = Object.values(tally).filter((t) => t.notRun).length;
  console.log(`\n${results.length - failed} PASS, ${failed} FAIL${notRun ? `, ${notRun} NOT RUN` : ''}`);
  process.exit(failed || notRun ? 1 : 0);
})();

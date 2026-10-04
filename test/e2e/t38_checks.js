// Browser checks for Harold's note of 2026-10-04 (standing requirements 34
// to 38): double taps do what he said, no drag resizes a card, and the
// actions and their triggers live in one table (graph.bindings,
// docs/ACTIONS.md). On a built site whose table is his:
//   - a single tap on a closed act does not open it; a double tap does, and
//     another (on its title) closes it;
//   - a double tap on empty space zooms in one step of the + key (1.25x);
//   - a double tap on a card whose title renders under graph.readablePx
//     zooms until it is at least that (16 px), and does not open the
//     reader; where the zoom panned to keep the card under the finger, how
//     far that took each act from its root tip, reported;
//   - a double tap on that card, now readable, opens the reader;
//   - a drag from a card's edge and from its corner never changes its size
//     (its own size measured before and after, and its size at rest), the
//     card draws no resize handles, and "Reset sizes" is not in the panel;
//   - a single tap on a card selects it (opens it in place) and opens
//     neither the reader nor anything else;
//   - the browser's own double-tap zoom stays off (visualViewport.scale 1);
//   - no page errors.
// Chromium and WebKit, desktop (1280x800, a mouse) and phone (390x844 at 3x,
// touch: taps from the touchscreen; a drag as real touch input in Chromium,
// and as touch and pointer events dispatched to the page in WebKit, which
// has no touch input to drive).
//
//   node test/e2e/t38_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39468;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const GS = SETTINGS.graph || {};
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const READABLE = Number(GS.readablePx) > 0 ? Number(GS.readablePx) : 16;
const LABELS = Object.fromEntries((SETTINGS.containment || []).map((c) => [c.id, c.label]));
const ACTS = Object.entries(SETTINGS.containers || {})
  .filter(([id, c]) => id.startsWith('container:') && c && typeof c === 'object' && c.anchor)
  .map(([id, c]) => ({ id, anchor: c.anchor, name: LABELS[id] || id }));
const has = (target, gesture, action) => (GS.bindings || []).some((b) => b.target === target && b.gesture === gesture && b.action === action);

if (!Array.isArray(GS.bindings) || !has('container', 'doubletap', 'container.toggle') || !has('space', 'doubletap', 'view.zoomInStep')
  || !has('node', 'doubletap', 'node.zoomToReadable') || !has('node.readable', 'doubletap', 'node.openReader')
  || GS.bindings.some((b) => b.action === 'node.resize') || ACTS.length < 3) {
  console.error('this site does not set Harold\'s table of 2026-10-04 (graph.bindings: container, space, node and node.readable double taps; no node.resize); nothing to check');
  process.exit(1);
}

const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const r2 = (n) => (Number.isFinite(n) ? n.toFixed(2) : String(n));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

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
  // Chromium's emulated 3x phone hands the page a third of a wheel's delta.
  const k = phone && name === 'chromium' ? 3 : 1;
  const wheel = (dy) => page.mouse.wheel(0, dy * k);
  const cdp = phone && name === 'chromium' ? await ctx.newCDPSession(page) : null;
  return { browser, ctx, page, errors, phone, name, wheel, cdp };
}

async function ready(page) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame && window.PostPipeGraphWorld && window.PostPipeGraph, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
}

// In the page, before its own scripts: readers for what is drawn.
function pageHelpers() {
  const box = (r) => ({ x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, w: r.width, h: r.height });
  const group = (id) => document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
  const graphSvg = () => { const l = document.querySelector('.cards-layer'); return l && l.parentElement.querySelector(':scope > svg'); };
  window.__act = (id) => {
    const g = group(id);
    if (!g || getComputedStyle(g).display === 'none') return null;
    const macro = g.querySelector('.container-macro-node');
    const closed = !!macro && getComputedStyle(macro).display !== 'none';
    let centre = null;
    if (closed) { const m = macro.getScreenCTM(); centre = { x: m.e, y: m.f }; }
    else {
      const cards = [...document.querySelectorAll('.node-card')].filter((c) => c.__data__ && (c.__data__.tags || []).includes(id.replace(/^container:/, '')) && c.style.display !== 'none');
      cards.sort((a, b) => (a.__data__.series_part || 0) - (b.__data__.series_part || 0));
      const last = cards[cards.length - 1];
      if (last) { const r = last.getBoundingClientRect(); centre = { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }; }
    }
    return { id, closed, centre };
  };
  // A point inside an element's box that the element itself is hit at.
  const hitPoint = (el, test) => {
    const r = el.getBoundingClientRect();
    const pts = [[0.5, 0.5]];
    for (let i = 1; i < 8; i++) for (let j = 1; j < 8; j++) pts.push([i / 8, j / 8]);
    for (const [fx, fy] of pts) {
      const x = r.left + fx * r.width, y = r.top + fy * r.height;
      if (x < 2 || y < 2 || x > innerWidth - 2 || y > innerHeight - 2) continue;
      const hit = document.elementFromPoint(x, y);
      if (hit && test(hit)) return { x, y };
    }
    return null;
  };
  // Where a tap on a closed act's node, or on an open act's title, lands.
  window.__actPoint = (id) => {
    const g = group(id);
    if (!g) return null;
    const macro = g.querySelector('.container-macro-node');
    if (macro && getComputedStyle(macro).display !== 'none') return hitPoint(macro.querySelector('.container-macro-bg') || macro, (h) => h.closest('.container-macro-node') === macro);
    const badge = g.querySelector('.container-badge');
    return badge ? hitPoint(badge, (h) => h.closest('.container-badge') === badge) : null;
  };
  // A point of empty canvas: the graph's own svg, not a container or a node.
  window.__spacePoint = () => {
    const svg = graphSvg();
    for (let y = innerHeight * 0.55; y < innerHeight * 0.95; y += 13) {
      for (let x = innerWidth * 0.08; x < innerWidth * 0.92; x += 17) {
        const hit = document.elementFromPoint(x, y);
        if (hit && hit.closest('svg') === svg && !hit.closest('.container-group, .node')) return { x, y };
      }
    }
    return null;
  };
  // A card as drawn: its own size (CSS px, before the zoom), its box on the
  // screen, its title's size on the screen, its resize handles.
  window.__card = (id) => {
    const c = [...document.querySelectorAll('.node-card')].find((el) => el.__data__ && el.__data__.id === id);
    if (!c || c.style.display === 'none') return null;
    const r = c.getBoundingClientRect();
    const t = c.querySelector('[data-card-title]');
    const scale = c.offsetWidth ? r.width / c.offsetWidth : 0;
    const font = t ? parseFloat(getComputedStyle(t).fontSize) : 0;
    return {
      id, w: c.offsetWidth, h: c.offsetHeight, box: box(r), centre: { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 },
      font, scale, titlePx: font * scale, handles: c.querySelectorAll('[class*="handle"]').length,
      onScreen: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight,
    };
  };
  // The cards of an act that a tap at their centre reaches.
  window.__cardsOf = (id) => [...document.querySelectorAll('.node-card')]
    .filter((c) => c.__data__ && (c.__data__.tags || []).includes(id.replace(/^container:/, '')) && c.style.display !== 'none' && !c.__data__.link)
    .map((c) => {
      const r = c.getBoundingClientRect();
      const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
      const hit = x > 4 && y > 4 && x < innerWidth - 4 && y < innerHeight - 4 ? document.elementFromPoint(x, y) : null;
      return { id: c.__data__.id, reach: !!hit && hit.closest('.node-card') === c };
    });
  // A point on a card's edge or corner that the card is hit at.
  window.__edgePoint = (id, where) => {
    const c = [...document.querySelectorAll('.node-card')].find((el) => el.__data__ && el.__data__.id === id);
    if (!c) return null;
    const r = c.getBoundingClientRect();
    const tries = where === 'corner'
      ? [[r.right - 2, r.bottom - 2], [r.right - 3, r.bottom - 3], [r.left + 2, r.bottom - 2], [r.right - 2, r.top + 2]]
      : [[r.right - 2, (r.top + r.bottom) / 2], [r.right - 3, (r.top + r.bottom) / 2], [r.left + 2, (r.top + r.bottom) / 2], [(r.left + r.right) / 2, r.bottom - 2]];
    for (const [x, y] of tries) {
      if (x < 2 || y < 2 || x > innerWidth - 2 || y > innerHeight - 2) continue;
      const hit = document.elementFromPoint(x, y);
      if (hit && hit.closest('.node-card') === c) return { x, y };
    }
    return null;
  };
  window.__zoom = () => { const w = window.PostPipeGraphWorld.snapshot(); return w.k / w.homeK; };
  window.__reader = () => { const p = document.querySelector('[data-reader-panel]'); if (!p) return false; const r = p.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(p).visibility !== 'hidden'; };
  window.__tip = (id) => {
    const parts = [...document.querySelectorAll(`[data-roots-vector] path[data-act-root="${CSS.escape(id)}"]`)];
    const last = parts[parts.length - 1];
    if (!last) return null;
    const q = last.getPointAtLength(last.getTotalLength());
    const m = last.getScreenCTM();
    return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
  };
  window.__anchor = (a) => { const r = document.querySelector('[data-cover-art]').getBoundingClientRect(); return { x: r.left + a.x * r.width, y: r.top + a.y * r.height }; };
  // A finger's drag as the page receives it, for an engine with no touch
  // input to drive: touch events (what moves a card) and pointer events of
  // the touch type (what a resize handle listens for), at the same points.
  window.__fingerDrag = async (x, y, dx, dy, steps) => {
    const target = document.elementFromPoint(x, y);
    if (!target) return false;
    const touch = (type, px, py, ended) => {
      const mk = () => ({ identifier: 7, target, clientX: px, clientY: py, pageX: px, pageY: py, screenX: px, screenY: py });
      let ev;
      try {
        const T = new Touch(mk());
        ev = new TouchEvent(type, { bubbles: true, cancelable: true, composed: true, touches: ended ? [] : [T], targetTouches: ended ? [] : [T], changedTouches: [T] });
      } catch (_) {
        ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
        const list = (a) => Object.assign([...a], { item: (i) => a[i] || null });
        Object.defineProperty(ev, 'touches', { value: list(ended ? [] : [mk()]) });
        Object.defineProperty(ev, 'targetTouches', { value: list(ended ? [] : [mk()]) });
        Object.defineProperty(ev, 'changedTouches', { value: list([mk()]) });
      }
      target.dispatchEvent(ev);
    };
    const pointer = (type, px, py, el) => {
      (el || target).dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, composed: true, pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: px, clientY: py, button: 0, buttons: type === 'pointerup' ? 0 : 1 }));
    };
    const wait = () => new Promise((r) => setTimeout(r, 16));
    pointer('pointerdown', x, y);
    touch('touchstart', x, y);
    for (let i = 1; i <= steps; i++) {
      const px = x + (dx * i) / steps, py = y + (dy * i) / steps;
      await wait();
      pointer('pointermove', px, py);
      pointer('pointermove', px, py, window);
      touch('touchmove', px, py);
    }
    await wait();
    pointer('pointerup', x + dx, y + dy);
    pointer('pointerup', x + dx, y + dy, window);
    touch('touchend', x + dx, y + dy, true);
    return true;
  };
}

// ── Gestures ──
// Under a mouse, the pointer comes to rest on what it clicks first, as a
// person's does (a card under it shows its text), then clicks.
async function hover(s, p) {
  await s.page.mouse.move(p.x, p.y);
  await s.page.waitForTimeout(300);
}
async function tap(s, p) {
  if (s.phone) { await s.page.touchscreen.tap(p.x, p.y); return; }
  await hover(s, p);
  await s.page.mouse.click(p.x, p.y);
}
async function doubleTap(s, p) {
  if (s.phone) { await s.page.touchscreen.tap(p.x, p.y); await s.page.touchscreen.tap(p.x, p.y); return; }
  await hover(s, p);
  await s.page.mouse.dblclick(p.x, p.y);
}
async function drag(s, p, dx, dy, steps = 8) {
  const { page } = s;
  if (!s.phone) {
    await page.mouse.move(p.x, p.y);
    await page.mouse.down();
    for (let i = 1; i <= steps; i++) await page.mouse.move(p.x + (dx * i) / steps, p.y + (dy * i) / steps);
    await page.mouse.up();
    return 'mouse';
  }
  if (s.cdp) {
    const send = (type, pts) => s.cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
    await send('touchStart', [{ x: p.x, y: p.y, id: 1 }]);
    for (let i = 1; i <= steps; i++) {
      await page.waitForTimeout(16);
      await send('touchMove', [{ x: p.x + (dx * i) / steps, y: p.y + (dy * i) / steps, id: 1 }]);
    }
    await send('touchEnd', []);
    return 'touch input';
  }
  await page.evaluate(([x, y, ddx, ddy, n]) => window.__fingerDrag(x, y, ddx, ddy, n), [p.x, p.y, dx, dy, steps]);
  return 'touch and pointer events';
}

async function scrollToGraph(s) {
  await s.page.mouse.move(s.phone ? 195 : 640, s.phone ? 420 : 400);
  await s.wheel(120);
  await s.page.waitForFunction(() => window.PostPipeCover.state === 'graph', null, { timeout: 5000 }).catch(() => {});
  await s.page.waitForTimeout(1600);
}
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
const reset = async (page) => { await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all'))); await page.waitForTimeout(1500); await quiet(page); };
const openAct = async (page, id) => { await page.evaluate((i) => window.dispatchEvent(new CustomEvent('graph:open-container', { detail: { id: i } })), id); await page.waitForTimeout(1200); await quiet(page); };
const act = (page, id) => page.evaluate((i) => window.__act(i), id);
const card = (page, id) => page.evaluate((i) => window.__card(i), id);
const reader = (page) => page.evaluate(() => window.__reader());
const zoomNow = (page) => page.evaluate(() => window.__zoom());
// Each act's centre against its root tip and its anchor on the art.
const drift = (page) => page.evaluate((list) => Object.fromEntries(list.map((a) => {
  const x = window.__act(a.id);
  const tip = window.__tip(a.id);
  const an = window.__anchor(a.anchor);
  const d = (p, q) => (p && q ? Math.hypot(p.x - q.x, p.y - q.y) : NaN);
  return [a.id, { closed: x && x.closed, tip: x ? d(x.centre, tip) : NaN, anchor: x ? d(x.centre, an) : NaN }];
})), ACTS);
const driftText = (m) => ACTS.map((a) => `${a.name}${m[a.id].closed ? '' : ' (open)'} ${r1(m[a.id].anchor)} px from its anchor, ${r1(m[a.id].tip)} from its root tip`).join('; ');

async function run(bt, name, size, record, notes) {
  const s = await open(bt, name, size);
  const { page, phone } = s;
  const tag = (t) => `${name} ${size} ${t}`;

  await scrollToGraph(s);
  record(tag('the graph state after one scroll'), (await page.evaluate(() => window.PostPipeCover.state)) === 'graph');
  await quiet(page);

  // ── An act: a single tap does not open it; a double tap does; another closes it ──
  // The act tapped: one whose closed node and, once open, whose title are
  // on the screen (on a phone, open Act Two's and Act Three's titles lie
  // past the screen's edges; which ones, reported).
  let pick = null, p0 = null;
  const titleOff = [];
  for (const a of [...new Set([ACTS.find((x) => x.name === 'Act Two'), ...ACTS].filter(Boolean))]) {
    if (pick) break;
    const x = await act(page, a.id);
    const p = await page.evaluate((i) => window.__actPoint(i), a.id);
    if (!x || !x.closed || !p) continue;
    await openAct(page, a.id);
    const t = await page.evaluate((i) => window.__actPoint(i), a.id);
    await reset(page);
    if (t) { pick = a; p0 = (await page.evaluate((i) => window.__actPoint(i), a.id)) || p; } else titleOff.push(a.name);
  }
  if (titleOff.length) notes.push(`${name} ${size}: open, ${titleOff.join(' and ')} ${titleOff.length > 1 ? 'have their titles' : 'has its title'} off the screen at rest, so a double tap cannot reach ${titleOff.length > 1 ? 'them' : 'it'} there to close ${titleOff.length > 1 ? 'them' : 'it'} without a pan first.`);
  record(tag('a closed act to tap'), !!pick, pick ? `${pick.name} at ${r1(p0.x)},${r1(p0.y)}` : 'none reachable');
  if (pick) {
    await tap(s, p0);
    await page.waitForTimeout(800);
    const a1 = await act(page, pick.id);
    record(tag(`a single tap on ${pick.name}, closed, does not open it`), !!a1 && a1.closed, a1 && a1.closed ? 'still closed' : 'opened');
    const zBefore = await zoomNow(page);
    await doubleTap(s, p0);
    await page.waitForTimeout(1300);
    await quiet(page);
    const a2 = await act(page, pick.id);
    record(tag(`a double tap on ${pick.name} opens it`), !!a2 && !a2.closed, a2 ? (a2.closed ? 'still closed' : 'open') : 'missing');
    // The browser's own click and double-click after the second tap land on
    // the act's cards, now under the finger; they must not count.
    const zAfter = await zoomNow(page);
    const opened = await page.evaluate((w) => [...document.querySelectorAll('.node-card')].filter((c) => c.style.display !== 'none' && c.offsetWidth === w).length, (GS.card && GS.card.pinnedWidth) || 230);
    record(tag('... and does nothing else: no zoom, no card under the finger opened'), Math.abs(zAfter / zBefore - 1) < 0.002 && opened === 0, `zoom ${r2(zBefore)}x to ${r2(zAfter)}x; ${opened} cards opened`);
    const pt = await page.evaluate((i) => window.__actPoint(i), pick.id);
    record(tag(`... its open title is there to tap`), !!pt, pt ? `${r1(pt.x)},${r1(pt.y)}` : 'not reachable');
    if (pt) {
      await tap(s, pt);
      await page.waitForTimeout(800);
      const a3 = await act(page, pick.id);
      record(tag(`... a single tap on its title leaves it open`), !!a3 && !a3.closed, a3 && !a3.closed ? 'open' : 'closed');
      const pt2 = (await page.evaluate((i) => window.__actPoint(i), pick.id)) || pt;
      await doubleTap(s, pt2);
      await page.waitForTimeout(1300);
      await quiet(page);
      const a4 = await act(page, pick.id);
      record(tag(`... another double tap, on its title, closes it`), !!a4 && a4.closed, a4 ? (a4.closed ? 'closed' : 'still open') : 'missing');
    }
    record(tag('... and nothing opened the reader'), !(await reader(page)));
  }

  // ── Empty space: a double tap zooms in one step ──
  await reset(page);
  const sp = await page.evaluate(() => window.__spacePoint());
  record(tag('a point of empty canvas to tap'), !!sp, sp ? `${r1(sp.x)},${r1(sp.y)}` : 'none');
  if (sp) {
    const z0 = await zoomNow(page);
    await tap(s, sp);
    await page.waitForTimeout(700);
    const z1 = await zoomNow(page);
    record(tag('a single tap on empty space does not zoom'), Math.abs(z1 / z0 - 1) < 0.002, `${r2(z0)}x then ${r2(z1)}x`);
    await doubleTap(s, sp);
    await page.waitForTimeout(900);
    await quiet(page);
    const z2 = await zoomNow(page);
    record(tag('a double tap on empty space zooms in one step of the + key (1.25x)'), Math.abs(z2 / z1 - 1.25) < 0.01, `${r2(z1)}x to ${r2(z2)}x, ${r2(z2 / z1)} times`);
  }

  // ── A card: a double tap zooms until its title reads; another opens the reader ──
  await reset(page);
  let host = null, target = null;
  const readableAt = async () => {
    for (const a of [...new Set([ACTS.find((x) => x.name === 'Act Two'), ...ACTS].filter(Boolean))]) {
      await openAct(page, a.id);
      const list = await page.evaluate((i) => window.__cardsOf(i), a.id);
      for (const c of list.filter((x) => x.reach)) {
        const info = await card(page, c.id);
        if (info && info.titlePx < READABLE) return { a, info };
      }
      await reset(page);
    }
    return null;
  };
  let found = await readableAt();
  if (!found) {
    // Every reachable card already reads: zoom out with the - key and look again.
    for (let i = 0; i < 4 && !found; i++) { await page.keyboard.press('-'); await page.waitForTimeout(400); }
    await quiet(page);
    found = await readableAt();
  }
  record(tag(`a card whose title renders under ${READABLE} px`), !!found, found ? `${found.info.id} in ${found.a.name}, title ${r1(found.info.titlePx)} px (font ${r1(found.info.font)} x ${r2(found.info.scale)})` : 'none reachable');
  if (found) {
    host = found.a; target = found.info;
    const d0 = await drift(page);
    const z0 = await zoomNow(page);
    await doubleTap(s, target.centre);
    await page.waitForTimeout(1500);
    await quiet(page);
    const after = await card(page, target.id);
    const z1 = await zoomNow(page);
    const d1 = await drift(page);
    record(tag(`a double tap on it zooms until its title is at least ${READABLE} px`), !!after && after.titlePx >= READABLE - 0.05,
      after ? `title ${r1(target.titlePx)} px to ${r2(after.titlePx)} px; zoom ${r2(z0)}x to ${r2(z1)}x` : 'card gone');
    record(tag('... and does not open the reader'), !(await reader(page)));
    const moved = ACTS.some((a) => Math.abs(d1[a.id].anchor - d0[a.id].anchor) > 2);
    notes.push(`${name} ${size}: ${target.id} in ${host.name}: zoom ${r2(z0)}x to ${r2(z1)}x; the card ${after && after.onScreen ? 'wholly on the screen' : 'not wholly on the screen'} after (${after ? `${r1(after.box.x0)},${r1(after.box.y0)} to ${r1(after.box.x1)},${r1(after.box.y1)}` : ''}); ${moved ? 'the view panned to keep it under the finger' : 'no pan'}. Before: ${driftText(d0)}. After: ${driftText(d1)}.`);
    record(tag('... the card under the finger or wholly on the screen after it'), !!after && (after.onScreen || (target.centre.x >= after.box.x0 - 1 && target.centre.x <= after.box.x1 + 1 && target.centre.y >= after.box.y0 - 1 && target.centre.y <= after.box.y1 + 1)),
      after ? `finger ${r1(target.centre.x)},${r1(target.centre.y)}; card ${r1(after.box.x0)},${r1(after.box.y0)} to ${r1(after.box.x1)},${r1(after.box.y1)}` : '');
    if (after) {
      const hit = await page.evaluate(([i, c]) => { const h = document.elementFromPoint(c.x, c.y); const el = h && h.closest('.node-card'); return !!el && el.__data__ && el.__data__.id === i; }, [target.id, after.centre]);
      const p = hit ? after.centre : target.centre;
      await doubleTap(s, p);
      await page.waitForTimeout(1200);
      const open = await reader(page);
      const title = await page.evaluate(() => { const p = document.querySelector('[data-reader-panel]'); const h = p && p.querySelector('h1, h2, [data-reader-title]'); return h ? h.textContent.trim().slice(0, 60) : ''; });
      record(tag('a double tap on the card, now readable, opens the reader'), open, open ? `"${title}"` : 'reader closed');
    }
  }

  // ── A drag from a card's edge or corner never changes its size ──
  await reset(page);
  for (const where of ['edge', 'corner']) {
    await openAct(page, (host || ACTS[0]).id);
    const list = await page.evaluate((i) => window.__cardsOf(i), (host || ACTS[0]).id);
    // Under a mouse a card's own size is compared in the same state before
    // and after: at rest (the pointer away), and under the pointer (it
    // shows its text, larger). The edge or corner is found with the pointer
    // on the card, where the drag starts.
    let c0 = null, ep = null, rest = null;
    for (const c of list.filter((x) => x.reach)) {
      if (!phone) { await page.mouse.move(5, 5); await page.waitForTimeout(300); rest = await card(page, c.id); await hover(s, rest.centre); }
      ep = await page.evaluate(([i, w]) => window.__edgePoint(i, w), [c.id, where]);
      if (ep) { c0 = await card(page, c.id); break; }
    }
    record(tag(`a card's ${where} to drag`), !!c0, c0 ? `${c0.id} at ${r1(ep.x)},${r1(ep.y)}` : 'none reachable');
    if (!c0) continue;
    if (!phone) await hover(s, ep);
    const before = await card(page, c0.id);
    const how = await drag(s, ep, where === 'edge' ? 48 : 36, where === 'edge' ? 0 : 36);
    await page.waitForTimeout(500);
    let after = await card(page, c0.id);
    if (!phone && after) { await hover(s, after.centre); after = await card(page, c0.id); }
    record(tag(`a drag from its ${where} (${how}) leaves its size as it was`), !!after && after.w === before.w && after.h === before.h,
      after ? `${before.w}x${before.h} before, ${after.w}x${after.h} after${phone ? '' : ', under the pointer'}; moved ${r1(dist(before.centre, after.centre))} px` : 'card gone');
    if (!phone) {
      await page.mouse.move(5, 5);
      await page.waitForTimeout(300);
      const restAfter = await card(page, c0.id);
      record(tag(`... and its size at rest too`), !!restAfter && restAfter.w === rest.w && restAfter.h === rest.h, restAfter ? `${rest.w}x${rest.h} before, ${restAfter.w}x${restAfter.h} after` : '');
    }
    record(tag(`... the card draws no resize handles`), before.handles === 0 && (!after || after.handles === 0), `${before.handles} handles`);
    await reset(page);
  }

  // ── A single tap on a card selects it and opens nothing ──
  await openAct(page, (host || ACTS[0]).id);
  const list2 = await page.evaluate((i) => window.__cardsOf(i), (host || ACTS[0]).id);
  const sel = list2.find((x) => x.reach);
  if (sel) {
    const c1 = await card(page, sel.id);
    const actsBefore = await page.evaluate((ids) => ids.map((i) => { const x = window.__act(i); return x && x.closed; }), ACTS.map((a) => a.id));
    const z0 = await zoomNow(page);
    await tap(s, c1.centre);
    await page.waitForTimeout(900);
    const c2 = await card(page, sel.id);
    const actsAfter = await page.evaluate((ids) => ids.map((i) => { const x = window.__act(i); return x && x.closed; }), ACTS.map((a) => a.id));
    const z1 = await zoomNow(page);
    const pinned = !!c2 && c2.w === (GS.card && GS.card.pinnedWidth || 230);
    record(tag('a single tap on a card selects it: opened in place'), pinned, c2 ? `${c1.w}x${c1.h} to ${c2.w}x${c2.h}` : 'card gone');
    record(tag('... and opens nothing else: no reader, no act, no zoom'), !(await reader(page)) && JSON.stringify(actsBefore) === JSON.stringify(actsAfter) && Math.abs(z1 / z0 - 1) < 0.002,
      `reader ${(await reader(page)) ? 'open' : 'closed'}; zoom ${r2(z0)}x to ${r2(z1)}x`);
  } else record(tag('a card to tap once'), false, 'none reachable');

  // ── "Reset sizes" is not in the panel ──
  await reset(page);
  const opener = (await page.$('[data-settings-open]')) ? '[data-settings-open]' : '[data-settings-gear]';
  await page.click(opener);
  await page.waitForTimeout(600);
  const view = await page.evaluate(() => {
    const panel = document.querySelector('[data-settings-panel]');
    return panel ? { open: true, actions: [...panel.querySelectorAll('[data-view-action]')].map((b) => b.textContent.trim()), sizes: !!panel.querySelector('[data-view-action="graph:reset-sizes"]'), text: /Reset sizes/.test(panel.textContent) } : { open: false };
  });
  record(tag('"Reset sizes" is not in the panel'), view.open && !view.sizes && !view.text, view.open ? view.actions.join(', ') : 'panel did not open');
  await page.keyboard.press('Escape');

  if (phone) {
    const scale = await page.evaluate(() => (window.visualViewport ? window.visualViewport.scale : 1));
    record(tag('the browser\'s own double-tap zoom stayed off'), Math.abs(scale - 1) < 1e-6, `visualViewport.scale ${scale}`);
  }
  record(tag('no page errors'), s.errors.length === 0, s.errors.slice(0, 3).join(' | '));
  await s.browser.close();
}

(async () => {
  const server = http.createServer((req, res) => handler(req, res, { public: SITE }));
  await new Promise((r) => server.listen(PORT, r));
  const engines = { chromium, webkit };
  const results = [];
  const tally = {};
  const notes = [];
  for (const name of ENGINES) {
    for (const size of ['desktop', 'phone']) {
      const key = `${name} ${size}`;
      tally[key] = { pass: 0, fail: 0 };
      const record = (label, ok, detail = '') => {
        results.push({ key, label, ok, detail });
        tally[key][ok ? 'pass' : 'fail']++;
        console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
      };
      try {
        await run(engines[name], name, size, record, notes);
      } catch (e) {
        console.log(`NOT RUN  ${key}: ${e.message.split('\n')[0]}`);
        tally[key].notRun = true;
      }
    }
  }
  server.close();
  if (notes.length) {
    console.log('\nthe zoom to a readable card, and the acts on their roots');
    for (const n of notes) console.log(`  ${n}`);
  }
  console.log('\nsummary');
  for (const [k, t] of Object.entries(tally)) console.log(`  ${k}: ${t.notRun ? 'NOT RUN' : `${t.pass} pass, ${t.fail} fail`}`);
  const failed = results.filter((r) => !r.ok).length;
  const notRun = Object.values(tally).filter((t) => t.notRun).length;
  console.log(`\n${results.length - failed} PASS, ${failed} FAIL${notRun ? `, ${notRun} NOT RUN` : ''}`);
  process.exit(failed || notRun ? 1 : 0);
})();

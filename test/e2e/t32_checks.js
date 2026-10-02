// Browser checks for the reader and the settings made simple, and the acts
// that wait for a move, on a built site:
//   1. bugs: Close all leaves every act at its closed size with no chapter
//      nodes and the book open, with no page error; Open all brings them
//      back; closing the acts one by one does the same; a wheel zoom keeps
//      the point under the pointer (at the screen's centre, the crown of
//      the roots stays where it was, and the acts' screen positions scale
//      about it); + and - and Zoom to fit zoom about the viewport's centre;
//      the graph's colours are left out of the panel when nothing they
//      colour is drawn, and the theme changes the main view and the reader;
//   2. one sliders button in the top bar after the hourglass, no gear; the
//      hourglass menu holds only the timelines and the bucket size; the main
//      view's panel holds the look, the time of day switch (no description),
//      Zoom to fit, Close and Open all, Unpin, Reset sizes, Reset and Forget
//      with its confirmation, and nothing of the reader's; the reader's panel
//      holds reading, paper and listening, and nothing of the main view's;
//      both panels have the same background;
//   3. the reader: an X at its top right; the chapters either side as an
//      arrow and a title at the top and the bottom, absent where there is
//      none, no words for the direction; no border on any button in the
//      reader; grow, expand and minimise together (grow hidden on a phone);
//      the link icon copies the address with the reading position and shows
//      copied for a second; no Copy of the text, no "Link here"; Bookmark,
//      one per chapter, replacing, and away where it is; no bookmarks list;
//      no source pill; about as its icon alone;
//   4. opening.graph.hiddenUntilMove: a fresh load draws no hull and no
//      rootlet; a 1 px wheel shows them; a tap on the art shows them and
//      moves to the graph; a tap on a top-bar control does not; once shown
//      they stay in the art state;
// and no page errors, nothing fetched from elsewhere. Chromium and WebKit,
// desktop (1280x800) and phone (390x844). Screenshots go to PP_E2E_SHOTS.
//
//   node test/e2e/t32_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines, PP_E2E_SIZES=desktop,phone
// sizes. An engine that cannot start is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { openingConfig } = require('../../src/lib/opening');
const { panelTitle } = require('../../src/lib/panels');
const { dimensionLabels } = require('../../src/lib/dimensionLabels');
const { topBarConfig } = require('../../src/lib/topBar');
const { neighbours } = require('../../src/lib/readerNav');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39472;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const OPENING = openingConfig(SETTINGS);
const HIDDEN_UNTIL_MOVE = !!(OPENING && OPENING.graph.hiddenUntilMove);
const ART_OPACITY = OPENING ? OPENING.graph.artStateOpacity : 1;
const NOUN = (SETTINGS.graph && SETTINGS.graph.containersName) || 'containers';
const TOP = topBarConfig(SETTINGS);
const DIMS = dimensionLabels(SETTINGS);
const ACTS = (FEED.containers || []).filter((c) => c.parent).map((c) => c.id);
const BOOK = (FEED.containers || []).filter((c) => !c.parent).map((c) => c.id);
// The reading path along the sequence edges, from the chapter nothing
// leads to: the first, a middle one with a neighbour either side.
const READABLE = (FEED.items || []).filter((i) => i._posted !== 'title' && (i.tags || []).some((t) => /^act-/.test(t)));
const FIRST = READABLE.find((i) => neighbours(FEED, i.id).prev.length === 0 && neighbours(FEED, i.id).next.length > 0);
const MIDDLE = READABLE.find((i) => { const n = neighbours(FEED, i.id); return n.prev.length === 1 && n.next.length === 1; });

const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));

async function open(bt, name, size, { hash = '', reduced = false } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    ...(reduced ? { reducedMotion: 'reduce' } : {}),
  });
  // The clipboard, kept where the checks can read it.
  await ctx.addInitScript(() => {
    window.__copied = [];
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: (t) => { window.__copied.push(t); return Promise.resolve(); } } });
    } catch (_) { /* left as is */ }
  });
  await ctx.addInitScript(touchEvents);
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  await page.goto(BASE + hash);
  await ready(page);
  return { browser, ctx, page, errors, outside, phone, name, W: phone ? 390 : 1280, H: phone ? 844 : 800 };
}

async function ready(page) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame
    && document.querySelector('[data-cover-art]') && document.querySelector('[data-cover-art]').style.opacity !== '0', null, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
}

const settle = (page) => page.waitForFunction(() => window.PostPipeCover && window.PostPipeCover.state !== 'moving', null, { timeout: 4000 }).then(() => page.waitForTimeout(200));
async function go(s, to) {
  await s.page.evaluate((t) => window.PostPipeCover.go(t), to);
  await settle(s.page);
  await s.page.waitForTimeout(500);
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

async function shot(s, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await s.page.screenshot({ path: path.join(SHOTS, `${name}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
}

// Each container: closed (its small node shown, its hull not) or open, and
// how big what is drawn for it is.
const containers = (page) => page.evaluate(() => [...document.querySelectorAll('.container-group')].map((g) => {
  const shown = (el) => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
  const hull = g.querySelector('.container-hull');
  const macro = g.querySelector('.container-macro-node');
  const groupShown = getComputedStyle(g).display !== 'none';
  const hr = hull && shown(hull) ? hull.getBoundingClientRect() : null;
  const mr = macro && shown(macro) ? macro.getBoundingClientRect() : null;
  return { id: g.getAttribute('data-container-id'), groupShown, hull: hr ? { w: hr.width, h: hr.height } : null, macro: mr ? { w: mr.width, h: mr.height } : null };
}));
const nodesShown = (page) => page.evaluate(() => [...document.querySelectorAll('g.node')].filter((n) => getComputedStyle(n).display !== 'none').length);

// The zoom: the view, and the world point at a screen point.
const zoomAt = (page, x, y) => page.evaluate(([x, y]) => {
  const sv = [...document.querySelectorAll('svg')].find((s) => s.querySelector('.container-group'));
  const t = sv.__zoom; const r = sv.getBoundingClientRect();
  return { k: t.k, wx: (x - r.left - t.x) / t.k, wy: (y - r.top - t.y) / t.k };
}, [x, y]);
// With graph.zoomPivot art (T34) every zoom is about one point on the
// cover's art, opening.zoomPivot, wherever the pointer, the fingers or the
// viewport's middle are: the zoom checks below then measure that point
// instead.
const ART_PIVOT = (SETTINGS.graph || {}).zoomPivot === 'art' && SETTINGS.opening && SETTINGS.opening.zoomPivot;
const fixedPoint = (page, x, y) => (ART_PIVOT ? page.evaluate((pv) => {
  const a = document.querySelector('[data-cover-art]').getBoundingClientRect();
  return [a.left + a.width * pv.x, a.top + a.height * pv.y];
}, ART_PIVOT) : Promise.resolve([x, y]));
const pivotWord = (what) => (ART_PIVOT ? 'the art\'s pivot (graph.zoomPivot art)' : what);
const artCrown = (page) => page.evaluate(() => {
  const a = document.querySelector('[data-cover-art]').getBoundingClientRect();
  return { x: a.left + a.width * (523 / 1045), y: a.top + a.height * (1330 / 2111) };
});
const actScreen = (page) => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.container-group')]
  .filter((g) => getComputedStyle(g).display !== 'none' && g.getBoundingClientRect().width > 0)
  .map((g) => { const r = g.getBoundingClientRect(); return [g.getAttribute('data-container-id'), { x: r.left + r.width / 2, y: r.top + r.height / 2 }]; })));

async function openPanel(page, where) {
  if (where === 'graph') await page.click('[data-settings-open]');
  else await page.click('[data-reader-settings]');
  await page.waitForSelector(`[data-settings-panel="${where}"]`);
  await page.waitForTimeout(350);
}
const panelInfo = (page) => page.evaluate(() => {
  const d = document.querySelector('[data-settings-panel]');
  if (!d) return null;
  const cs = getComputedStyle(d);
  return {
    where: d.getAttribute('data-settings-panel'),
    title: (d.querySelector('[class*="title"]') || {}).textContent,
    sections: [...d.querySelectorAll('[data-section]')].map((x) => x.getAttribute('data-section')),
    text: d.innerText,
    bg: cs.backgroundColor,
    bgImage: cs.backgroundImage.slice(0, 120),
    pref: (() => { const sw = d.querySelector('[data-pref="timeOfDay"]'); return sw ? { text: sw.innerText, hint: !!sw.querySelector('[class*="aidHint"]') } : null; })(),
    actions: [...d.querySelectorAll('[data-view-action]')].map((b) => b.textContent.trim()),
    forget: !!d.querySelector('[data-forget-ask]'),
    voice: !!d.querySelector('[data-tts-voice]'),
    font: !!d.querySelector('[data-font]'),
    colors: /\bColors\b/.test(d.innerText),
    bookmarks: !!d.querySelector('[data-bookmark-row], [data-section="place"]'),
  };
});
async function closePanel(page) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
}

// ── 1. bugs ──────────────────────────────────────────────────────────────────
async function part1(bt, name, size, record) {
  const s = await open(bt, name, size);
  const p = s.page;
  await go(s, 'graph');
  const total = await nodesShown(p);

  // Close all, from the main view's panel.
  await openPanel(p, 'graph');
  await p.click('[data-view-action="graph:close-all-containers"]');
  await p.waitForTimeout(1300);
  const closed = await containers(p);
  const actsClosed = ACTS.every((id) => { const c = closed.find((x) => x.id === id); return c && c.groupShown && c.macro && !c.hull; });
  const bookOpen = BOOK.every((id) => { const c = closed.find((x) => x.id === id); return c && c.groupShown && !c.macro; });
  const smallest = Math.max(...closed.filter((c) => ACTS.includes(c.id) && c.macro).map((c) => Math.max(c.macro.w, c.macro.h)));
  record(`1.1 close all: every act at its closed size (its small node, no hull), the book open`, actsClosed && bookOpen,
    closed.map((c) => `${c.id.replace('container:', '')} ${c.hull ? `hull ${r1(c.hull.w)}x${r1(c.hull.h)}` : c.macro ? `node ${r1(c.macro.w)}x${r1(c.macro.h)}` : 'none'}`).join(', '));
  record('1.1 close all: the closed acts are small (under 200 px)', smallest < 200, `largest ${r1(smallest)} px`);
  record('1.1 close all: no chapter nodes', (await nodesShown(p)) === 0, `${await nodesShown(p)} shown`);
  await shot(s, 't32-close-all');

  await p.click('[data-view-action="graph:open-all-containers"]');
  await p.waitForTimeout(1300);
  const opened = await containers(p);
  record('1.1 open all: every act open again with its hull', ACTS.every((id) => { const c = opened.find((x) => x.id === id); return c && c.hull && !c.macro; }),
    opened.map((c) => `${c.id.replace('container:', '')} ${c.hull ? 'hull' : 'node'}`).join(', '));
  record('1.1 open all: the chapter nodes are back', (await nodesShown(p)) >= total && (await nodesShown(p)) > 0, `${await nodesShown(p)} shown, ${total} at the start`);
  await closePanel(p);

  // One by one.
  for (const id of ACTS) { await p.evaluate((id) => window.PostPipeGraph.closeContainer(id), id); await p.waitForTimeout(500); }
  await p.waitForTimeout(800);
  const each = await containers(p);
  record('1.1 closing the acts one by one: each at its closed size, no chapter nodes',
    ACTS.every((id) => { const c = each.find((x) => x.id === id); return c && c.macro && !c.hull; }) && (await nodesShown(p)) === 0);
  record('1.1 no page errors while closing and opening', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));

  // Zoom. Back home first.
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
  await p.waitForTimeout(1500);
  const cx = s.W / 2, cy = s.H / 2;
  const [fx, fy] = await fixedPoint(p, cx, cy);
  const before = await zoomAt(p, fx, fy);
  const crown0 = await artCrown(p);
  const acts0 = await actScreen(p);
  await p.mouse.move(cx, cy);
  for (let i = 0; i < 3; i += 1) { await p.mouse.wheel(0, -100); await p.waitForTimeout(120); }
  await p.waitForTimeout(700);
  const after = await zoomAt(p, fx, fy);
  const crown1 = await artCrown(p);
  const acts1 = await actScreen(p);
  const ratio = after.k / before.k;
  const drift = Math.max(...Object.keys(acts0).filter((id) => acts1[id]).map((id) => {
    const want = { x: fx + (acts0[id].x - fx) * ratio, y: fy + (acts0[id].y - fy) * ratio };
    return Math.hypot(acts1[id].x - want.x, acts1[id].y - want.y);
  }));
  record(`1.2 a wheel zoom at the screen's centre keeps the point under ${pivotWord('it')}`, ratio > 1.2 && Math.hypot(after.wx - before.wx, after.wy - before.wy) * after.k < 0.5,
    `zoom ${r1(ratio)}x, the fixed point's point moved ${r1(Math.hypot(after.wx - before.wx, after.wy - before.wy) * after.k)} px`);
  record('1.2 ... the crown of the roots stays where it was', Math.hypot(crown1.x - crown0.x, crown1.y - crown0.y) < 0.5,
    `crown (${r1(crown0.x)}, ${r1(crown0.y)}) → (${r1(crown1.x)}, ${r1(crown1.y)})`);
  record(`1.2 ... and the acts move about ${pivotWord('the centre')}, not toward the graph's middle`, drift < 3, `largest drift from zooming about it ${r1(drift)} px`);

  // A point on the empty canvas (a card takes the wheel for its own text).
  const off = await p.evaluate(({ W, H }) => {
    for (const fy of [0.65, 0.7, 0.6, 0.75, 0.55, 0.8]) for (const fx of [0.3, 0.25, 0.7, 0.75, 0.2, 0.8]) {
      const t = document.elementFromPoint(W * fx, H * fy);
      if (t && t.tagName === 'svg' && t.querySelector('.container-group')) return { x: W * fx, y: H * fy, where: 'canvas' };
    }
    return { x: W * 0.3, y: H * 0.65, where: 'fallback' };
  }, { W: s.W, H: s.H });
  const [ox, oy] = await fixedPoint(p, off.x, off.y);
  const b2 = await zoomAt(p, ox, oy);
  await p.mouse.move(off.x, off.y);
  await p.mouse.wheel(0, 120);
  await p.waitForTimeout(600);
  const a2 = await zoomAt(p, ox, oy);
  record(`1.2 a wheel zoom elsewhere keeps the point under ${pivotWord('the pointer')}`, a2.k < b2.k && Math.hypot(a2.wx - b2.wx, a2.wy - b2.wy) * a2.k < 0.5,
    `at (${r1(off.x)}, ${r1(off.y)}) on the ${off.where}: zoom ${r1(a2.k / b2.k)}x, moved ${r1(Math.hypot(a2.wx - b2.wx, a2.wy - b2.wy) * a2.k)} px`);

  if (!s.phone) {
    const b3 = await zoomAt(p, fx, fy);
    await p.keyboard.press('=');
    await p.waitForTimeout(500);
    const a3 = await zoomAt(p, fx, fy);
    await p.keyboard.press('-');
    await p.waitForTimeout(500);
    const a4 = await zoomAt(p, fx, fy);
    record(`1.2 + and - zoom about ${pivotWord("the viewport's centre")}`, a3.k > b3.k * 1.2 && Math.abs(a4.k - b3.k) < 1e-6
      && Math.hypot(a3.wx - b3.wx, a3.wy - b3.wy) * a3.k < 0.5 && Math.hypot(a4.wx - b3.wx, a4.wy - b3.wy) * a4.k < 0.5,
      `+ ${r1(a3.k / b3.k)}x, - back to ${r1(a4.k / b3.k)}x, centre moved ${r1(Math.hypot(a3.wx - b3.wx, a3.wy - b3.wy) * a3.k)} px`);
  } else {
    // A pinch spread about a point keeps the point between the fingers.
    const at = await p.evaluate(({ W, H }) => {
      for (const fy of [0.6, 0.65, 0.55, 0.7, 0.5]) for (const fx of [0.5, 0.4, 0.6, 0.3, 0.7]) {
        const t = document.elementFromPoint(W * fx, H * fy);
        if (t && t.tagName === 'svg' && t.querySelector('.container-group')) return { x: W * fx, y: H * fy };
      }
      return { x: W / 2, y: H * 0.6 };
    }, { W: s.W, H: s.H });
    const [px, py] = await fixedPoint(p, at.x, at.y);
    const b4 = await zoomAt(p, px, py);
    await p.evaluate(async ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      let d = 40;
      el.dispatchEvent(window.__touchEvent('touchstart', el, [[x - d, y], [x + d, y]]));
      for (let i = 0; i < 8; i += 1) {
        d += 8;
        await new Promise((r) => setTimeout(r, 30));
        el.dispatchEvent(window.__touchEvent('touchmove', el, [[x - d, y], [x + d, y]]));
      }
      el.dispatchEvent(window.__touchEvent('touchend', el, [], [[x - d, y], [x + d, y]]));
    }, at);
    await p.waitForTimeout(600);
    const a4 = await zoomAt(p, px, py);
    record(`1.2 a pinch keeps the point between ${pivotWord('the fingers')}`, a4.k > b4.k * 1.3 && Math.hypot(a4.wx - b4.wx, a4.wy - b4.wy) * a4.k < 1,
      `zoom ${r1(a4.k / b4.k)}x, moved ${r1(Math.hypot(a4.wx - b4.wx, a4.wy - b4.wy) * a4.k)} px`);
  }

  const b5 = await zoomAt(p, fx, fy);
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:zoom-to-fit')));
  await p.waitForTimeout(900);
  const a5 = await zoomAt(p, fx, fy);
  record(`1.2 Zoom to fit zooms about ${pivotWord("the viewport's centre")} (no re-centring)`, Math.hypot(a5.wx - b5.wx, a5.wy - b5.wy) * a5.k < 0.5,
    `zoom ${r1(a5.k / b5.k)}x, centre moved ${r1(Math.hypot(a5.wx - b5.wx, a5.wy - b5.wy) * a5.k)} px`);

  // Colours: nothing they colour is drawn here, so they are not offered.
  await openPanel(p, 'graph');
  const look = await panelInfo(p);
  record('1.3 the graph\'s colours are not offered when nothing they colour is drawn', !look.colors, look.colors ? 'Colors shown' : 'none');
  const theme0 = await p.evaluate(() => document.documentElement.getAttribute('data-pp-theme'));
  const other = theme0 === 'default' ? 'sketchbook' : 'default';
  // The acts' titles' face and their small nodes' fill: what a theme draws.
  const graphLook = () => p.evaluate(() => {
    const t = document.querySelector('.container-macro-node text, .container-badge-text');
    const m = document.querySelector('.container-macro-bg');
    return (t ? getComputedStyle(t).fontFamily : '') + ' / ' + (m ? getComputedStyle(m).fill : '');
  });
  const g0 = await graphLook();
  await p.click(`[data-choice="theme"] [data-value="${other}"]`);
  await p.waitForTimeout(400);
  const g1 = await graphLook();
  const theme1 = await p.evaluate(() => document.documentElement.getAttribute('data-pp-theme'));
  await closePanel(p);
  await p.evaluate((id) => { window.location.hash = '#read=' + encodeURIComponent(id); }, MIDDLE.id);
  await p.waitForTimeout(1500);
  const readerBg = () => p.evaluate(() => getComputedStyle(document.querySelector('[data-reader-panel]')).backgroundColor);
  const rOther = await readerBg();
  await p.evaluate(() => { history.replaceState(null, '', location.pathname); window.dispatchEvent(new HashChangeEvent('hashchange')); });
  await p.waitForTimeout(500);
  await openPanel(p, 'graph');
  await p.click(`[data-choice="theme"] [data-value="${theme0}"]`);
  await p.waitForTimeout(400);
  await closePanel(p);
  await p.evaluate((id) => { window.location.hash = '#read=' + encodeURIComponent(id); }, MIDDLE.id);
  await p.waitForTimeout(1500);
  const rBack = await readerBg();
  record('1.3 the theme changes the main view and the reader', theme1 === other && g0 !== g1 && rOther !== rBack,
    `theme ${theme0} → ${theme1}; graph "${g0}" → "${g1}"; reader ${rBack} → ${rOther}`);
  record('1 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// ── 2. one settings control, two panels ──────────────────────────────────────
async function part2(bt, name, size, record) {
  const s = await open(bt, name, size);
  const p = s.page;
  await go(s, 'graph');
  const top = await p.evaluate(() => {
    const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom }; };
    const sl = document.querySelector('[data-top-graph-controls] [data-settings-open]');
    const hg = document.querySelector('[data-top-graph-controls] [data-top-menu-button]');
    return { gear: document.querySelectorAll('[data-settings-gear]').length, sliders: box(sl), hourglass: box(hg), svg: !!(sl && sl.querySelector('svg[data-icon] line')), label: sl && sl.getAttribute('aria-label'), next: !!(hg && sl && hg.compareDocumentPosition(sl) & Node.DOCUMENT_POSITION_FOLLOWING) };
  });
  record('2 no gear at the top right', top.gear === 0, `${top.gear} gear`);
  record('2 one sliders button in the top bar, after the hourglass, in its row', !!top.sliders && !!top.hourglass && top.next && top.sliders.left >= top.hourglass.right - 1 && Math.abs(top.sliders.top - top.hourglass.top) <= 2 && top.svg,
    top.sliders ? `sliders at ${r1(top.sliders.left)}, hourglass ends ${r1(top.hourglass.right)}; "${top.label}"` : 'missing');

  await p.click('[data-top-menu-button]');
  await p.waitForSelector('[data-top-menu]');
  const menu = await p.evaluate(() => ({
    dims: document.querySelectorAll('[data-top-menu] [data-dimension]').length,
    actions: document.querySelectorAll('[data-top-menu] [data-view-action]').length,
    layout: document.querySelectorAll('[data-top-menu] [data-layout]').length,
    other: [...document.querySelectorAll('[data-top-menu] [data-menu-item]')].filter((e) => !e.matches('[data-dimension], [data-granularity]')).length,
  }));
  record('2 the hourglass menu keeps only the timelines rows and the bucket size', menu.dims === DIMS.length && menu.actions === 0 && menu.layout === 0 && menu.other === 0, JSON.stringify(menu));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);

  await openPanel(p, 'graph');
  const g = await panelInfo(p);
  await shot(s, 't32-panel-main');
  record('2 the main view\'s panel: its title and groups (look, view, memory)', g.where === 'graph' && g.title === panelTitle(SETTINGS, 'graph') && g.sections.join() === 'look,view,memory', `"${g.title}": ${g.sections.join(', ')}`);
  record('2 ... the switch "narrative time of day background", with no description', !!g.pref && /narrative time of day background/.test(g.pref.text) && !g.pref.hint, g.pref && JSON.stringify(g.pref));
  const want = ['Zoom to fit', `Close all ${NOUN}`, `Open all ${NOUN}`, 'Unpin all', 'Reset sizes'];
  record(`2 ... Zoom to fit, Close all ${NOUN}, Open all ${NOUN}, Unpin all, Reset sizes`, want.every((w) => g.actions.includes(w)), g.actions.join(', '));
  await p.click('[data-forget-ask]');
  const confirm = await p.$('[data-forget-confirm]');
  record('2 ... Forget with its confirmation', g.forget && !!confirm);
  await p.click('[data-forget-no]');
  record('2 ... nothing of the reader\'s (no face, voice or bookmarks)', !g.font && !g.voice && !g.bookmarks);
  await closePanel(p);

  await p.evaluate((id) => { window.location.hash = '#read=' + encodeURIComponent(id); }, MIDDLE.id);
  await p.waitForSelector('[data-reader-settings]');
  await p.waitForTimeout(1200);
  await openPanel(p, 'reader');
  const r = await panelInfo(p);
  await shot(s, 't32-panel-reader');
  record('2 the reader\'s panel: reading settings only', r.where === 'reader' && r.sections.every((x) => ['reading', 'paper', 'listening'].includes(x)) && r.font && !r.forget && r.actions.length === 0 && !r.colors && !r.bookmarks,
    `"${r.title}": ${r.sections.join(', ')}`);
  record('2 ... the voice and its speed are there', r.voice);
  record('2 both panels have the same background (one surface, one look)', g.bg === r.bg && g.bgImage === r.bgImage, `${g.bg} / ${r.bg}; image ${g.bgImage === r.bgImage ? 'same' : 'differs'}`);
  record('2 only one panel open at a time', (await p.$$('[data-settings-panel]')).length === 1);
  record('2 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// ── 3. the reader's chrome ───────────────────────────────────────────────────
const readerInfo = (page) => page.evaluate(() => {
  const panel = document.querySelector('[data-reader-panel]');
  const pr = panel.getBoundingClientRect();
  const x = document.querySelector('[data-reader-close]');
  const xr = x ? x.getBoundingClientRect() : null;
  const navs = (where) => [...document.querySelectorAll(`[data-reader-nav-row="${where}"] [data-reader-nav]`)].map((n) => ({ dir: n.getAttribute('data-reader-nav'), text: n.innerText.trim(), arrow: !!n.querySelector('svg[data-icon]') }));
  const buttons = [...panel.querySelectorAll('button, a')].filter((b) => b.getBoundingClientRect().width > 0);
  const bordered = buttons.filter((b) => { const c = getComputedStyle(b); return ['Top', 'Right', 'Bottom', 'Left'].some((k) => parseFloat(c[`border${k}Width`]) > 0 && c[`border${k}Style`] !== 'none'); });
  const set = [...document.querySelectorAll('[data-reader-window] button')].map((b) => ({ what: Object.keys(b.dataset).find((k) => k.startsWith('reader')), shown: b.getBoundingClientRect().width > 0, w: b.getBoundingClientRect().width, top: b.getBoundingClientRect().top }));
  return {
    panel: { left: pr.left, top: pr.top, right: pr.right, bottom: pr.bottom },
    close: xr ? { right: xr.right, top: xr.top, label: x.getAttribute('aria-label'), svg: !!x.querySelector('svg[data-icon]') } : null,
    top: navs('top'), bottom: navs('bottom'),
    bordered: bordered.map((b) => b.getAttribute('aria-label') || b.getAttribute('title') || b.textContent.trim().slice(0, 20)),
    set,
    link: (() => { const l = document.querySelector('[data-reader-link]'); return l ? { title: l.getAttribute('title'), svg: !!l.querySelector('svg[data-icon]'), text: l.textContent.trim() } : null; })(),
    copyText: [...panel.querySelectorAll('button')].some((b) => /copy to clipboard/i.test(b.title) || /^copy$/i.test(b.textContent.trim())),
    linkHere: /link here\?|link here/i.test(panel.innerText) || [...panel.querySelectorAll('[title]')].some((e) => /link here\??$/i.test(e.title) && !/copy a link to here/i.test(e.title)),
    bookmark: (() => { const b = document.querySelector('[data-bookmark-toggle]'); return b ? { text: b.textContent.trim(), pressed: b.getAttribute('aria-pressed') } : null; })(),
    list: document.querySelectorAll('[data-bookmark-list]').length,
    words: /\b(previous|next)\b/i.test([...document.querySelectorAll('[data-reader-nav]')].map((n) => n.innerText).join(' ')),
  };
});

async function part3(bt, name, size, record) {
  const ch = MIDDLE;
  const s = await open(bt, name, size, { hash: '#read=' + encodeURIComponent(ch.id) });
  const p = s.page;
  await p.waitForSelector('[data-reader-close]');
  await p.waitForTimeout(1500);
  const r = await readerInfo(p);
  await shot(s, 't32-reader-top');
  record('3 close is an X at the reader\'s top right', !!r.close && r.close.svg && r.panel.right - r.close.right <= 16 && r.close.top - r.panel.top <= 16,
    r.close ? `${r1(r.panel.right - r.close.right)} px from the right, ${r1(r.close.top - r.panel.top)} px from the top; "${r.close.label}"` : 'missing');

  // The neighbours, along the reading order.
  const prev = neighbours(FEED, ch.id).prev[0];
  const next = neighbours(FEED, ch.id).next[0];
  const navOk = (row) => row.some((n) => n.dir === 'prev' && n.arrow && n.text.includes(prev.title)) && row.some((n) => n.dir === 'next' && n.arrow && n.text.includes(next.title));
  record('3 the chapters either side at the top: an arrow and the title', navOk(r.top), r.top.map((n) => `${n.dir}: ${n.text}`).join(' | '));
  record('3 ... and at the bottom', navOk(r.bottom), r.bottom.map((n) => `${n.dir}: ${n.text}`).join(' | '));
  record('3 ... no word "previous" or "next"', !r.words);
  record('3 no outline or border on any button in the reader', r.bordered.length === 0, r.bordered.join(', ') || 'none');
  const shownSet = r.set.filter((b) => b.shown);
  const wantSet = s.phone ? ['readerExpand', 'readerMinimise'] : ['readerGrow', 'readerExpand', 'readerMinimise'];
  record('3 grow, expand and minimise side by side, the same size' + (s.phone ? ' (grow hidden: the reader is already the screen\'s width)' : ''),
    wantSet.every((w) => shownSet.some((b) => b.what === w)) && new Set(shownSet.map((b) => Math.round(b.w))).size === 1 && new Set(shownSet.map((b) => Math.round(b.top))).size === 1,
    shownSet.map((b) => `${b.what} ${r1(b.w)}@${r1(b.top)}`).join(', '));
  record('3 the link icon: "Copy a link to here", an icon and no text', !!r.link && r.link.title === 'Copy a link to here' && r.link.svg && r.link.text === '');
  record('3 no Copy of the text, no "Link here"', !r.copyText && !r.linkHere);
  record('3 no bookmarks list (reader.bookmarksList false)', SETTINGS.reader && SETTINGS.reader.bookmarksList === false ? r.list === 0 : r.list === 1, `${r.list} list button`);
  record('3 Mark here is Bookmark', !!r.bookmark && r.bookmark.text === 'Bookmark', r.bookmark && r.bookmark.text);

  // The link copies the address with the place.
  await p.evaluate(() => { const b = document.querySelector('[data-tts-target]'); b.scrollTop = b.scrollHeight * 0.4; });
  await p.waitForTimeout(400);
  await p.click('[data-reader-link]');
  await p.waitForTimeout(150);
  const copied = await p.evaluate(() => ({ text: (document.querySelector('[data-reader-copied]') || {}).textContent, url: window.__copied[window.__copied.length - 1] }));
  await p.waitForTimeout(1200);
  const gone = !(await p.$('[data-reader-copied]'));
  const urlOk = !!copied.url && copied.url.startsWith(BASE) && copied.url.includes('#read=' + encodeURIComponent(ch.id)) && /&p=\d+$/.test(copied.url);
  record('3 a tap on the link copies the chapter\'s address with the reading position, shows "copied" for a second', copied.text === 'copied' && gone && urlOk,
    `"${copied.text}", then ${gone ? 'gone' : 'still there'}; ${copied.url}`);

  // Bookmark: one per chapter, replacing; away where it is.
  const marks = () => p.evaluate((id) => { const st = JSON.parse(localStorage.getItem('post-pipe:viewstate') || '{}'); return (st.bookmarks || []).filter((b) => b.item === id).map((b) => b.para); }, ch.id);
  await p.click('[data-bookmark-toggle]');
  await p.waitForTimeout(700);
  const m1 = await marks();
  await p.evaluate(() => { const b = document.querySelector('[data-tts-target]'); b.scrollTop = b.scrollHeight * 0.7; });
  await p.waitForTimeout(400);
  await p.click('[data-bookmark-toggle]');
  await p.waitForTimeout(700);
  const m2 = await marks();
  await p.click('[data-bookmark-toggle]');
  await p.waitForTimeout(700);
  const m3 = await marks();
  record('3 Bookmark: one per chapter, a new one replaces it, a tap where it is takes it away', m1.length === 1 && m2.length === 1 && m2[0] !== m1[0] && m3.length === 0,
    `after a tap ${JSON.stringify(m1)}, further down ${JSON.stringify(m2)}, again ${JSON.stringify(m3)}`);

  await p.evaluate(() => { const b = document.querySelector('[data-tts-target]'); b.scrollTop = b.scrollHeight; });
  await p.waitForTimeout(500);
  await shot(s, 't32-reader-bottom');

  // The first chapter has nothing before it: absent, not disabled.
  await p.evaluate((id) => { window.location.hash = '#read=' + encodeURIComponent(id); }, FIRST.id);
  await p.waitForTimeout(1500);
  const first = await readerInfo(p);
  record('3 no chapter before the first: absent, not disabled', !first.top.some((n) => n.dir === 'prev') && !first.bottom.some((n) => n.dir === 'prev') && first.top.some((n) => n.dir === 'next'),
    first.top.map((n) => `${n.dir}: ${n.text}`).join(' | '));

  // Expand fills the window.
  await p.click('[data-reader-expand]');
  await p.waitForTimeout(500);
  const full = await p.evaluate(() => { const r = document.querySelector('[data-reader-panel]').getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; });
  record('3 expand: the reader fills the window', full.l <= 1 && full.t <= 1 && full.w >= s.W - 1 && full.h >= s.H - 1, `${r1(full.w)}x${r1(full.h)} at ${r1(full.l)},${r1(full.t)}`);
  await p.click('[data-reader-expand]');

  // The top bar: no source pill, about as its icon.
  const bar = await p.evaluate(() => {
    const about = document.querySelector('[data-top-page]');
    return { pills: document.querySelectorAll('[data-source-pill]').length, about: about ? { text: about.textContent.trim(), label: about.getAttribute('aria-label'), svg: !!about.querySelector('svg[data-icon]') } : null };
  });
  record('3 no source pill in the top bar', TOP.showSourcePills ? bar.pills > 0 : bar.pills === 0, `${bar.pills} pills`);
  const aboutPage = TOP.pages[0];
  record('3 about shows its icon only', !!bar.about && bar.about.svg && (aboutPage && aboutPage.showLabel === false ? bar.about.text === '' : true) && !!bar.about.label, bar.about && JSON.stringify(bar.about));
  record('3 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  record('3 nothing fetched from elsewhere', s.outside.length === 0, s.outside.slice(0, 2).join(' | '));
  await s.browser.close();
}

// ── 4. the acts appear when the reader moves ─────────────────────────────────
const actsShown = (page) => page.evaluate(() => {
  const root = document.querySelector('[data-graph-root]');
  const reach = document.querySelector('[data-cover-reach]');
  const hulls = [...document.querySelectorAll('.container-group')].filter((g) => getComputedStyle(g).display !== 'none' && g.getBoundingClientRect().width > 0).length;
  return { opacity: Number(getComputedStyle(root).opacity), reach: reach ? Number(getComputedStyle(reach).opacity) : null, hulls, acts: window.PostPipeCover.acts, state: window.PostPipeCover.state, attr: document.documentElement.getAttribute('data-pp-cover-acts') };
});

async function part4(bt, name, size, record) {
  if (!HIDDEN_UNTIL_MOVE) { record('4 opening.graph.hiddenUntilMove is off on this site: nothing to check', true); return; }
  let s = await open(bt, name, size);
  let p = s.page;
  const fresh = await actsShown(p);
  await shot(s, 't32-fresh');
  record('4 a fresh load: no hull or pill drawn (the graph and the rootlets at 0)', fresh.state === 'art' && fresh.opacity === 0 && (fresh.reach === null || fresh.reach === 0) && fresh.attr === 'hidden',
    `${fresh.state}, graph ${fresh.opacity}, rootlets ${fresh.reach}, ${fresh.hulls} containers in the DOM`);

  // A tap on a top-bar control is not a move.
  if (await p.$('[data-top-subscribe]')) {
    await (s.phone ? p.tap('[data-top-subscribe]') : p.click('[data-top-subscribe]'));
    await p.waitForTimeout(450);
    const t = await actsShown(p);
    record('4 a tap on a top-bar control does not show them', t.opacity === 0 && t.acts === 0, `graph ${t.opacity}`);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(200);
  }

  // A 1 px scroll.
  await p.mouse.move(s.W / 2, s.H * 0.55);
  await p.mouse.wheel(0, 1);
  await p.waitForTimeout(80);
  const mid = await actsShown(p);
  await p.waitForTimeout(450);
  const shown = await actsShown(p);
  record('4 a 1 px scroll shows them, fading in', mid.acts > 0 && Math.abs(shown.opacity - ART_OPACITY) < 0.02 && shown.acts === 1 && shown.attr === 'shown',
    `after 80 ms ${r1(mid.acts)}, then graph ${shown.opacity} (artStateOpacity ${ART_OPACITY}), rootlets ${shown.reach}`);
  await go(s, 'graph');
  await go(s, 'art');
  const back = await actsShown(p);
  record('4 they stay, back in the art state', back.state === 'art' && Math.abs(back.opacity - ART_OPACITY) < 0.02, `${back.state}, graph ${back.opacity}`);
  record('4 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();

  // A tap on the art.
  s = await open(bt, name, size);
  p = s.page;
  const t0 = await actsShown(p);
  const at = { x: s.W / 2, y: s.H * 0.4 };
  if (s.phone) await p.touchscreen.tap(at.x, at.y); else await p.mouse.click(at.x, at.y);
  await settle(p);
  await p.waitForTimeout(400);
  const t1 = await actsShown(p);
  record('4 a tap on the art shows them and moves to the graph state as before', t0.opacity === 0 && t1.acts === 1 && t1.state === 'graph' && t1.opacity === 1,
    `before ${t0.opacity}; after ${t1.state}, graph ${t1.opacity}`);
  await s.browser.close();

  // A drag on the art (a swipe on a phone).
  s = await open(bt, name, size);
  p = s.page;
  if (s.phone) {
    await p.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      el.dispatchEvent(window.__touchEvent('touchstart', el, [[x, y]]));
      el.dispatchEvent(window.__touchEvent('touchmove', el, [[x, y - 6]]));
    }, { x: s.W / 2, y: s.H * 0.5 });
  } else {
    await p.mouse.move(s.W / 2, s.H * 0.5);
    await p.mouse.down();
    await p.mouse.move(s.W / 2 + 4, s.H * 0.5 - 6);
    await p.mouse.up();
  }
  await p.waitForTimeout(450);
  const d1 = await actsShown(p);
  record(`4 a ${s.phone ? 'swipe' : 'drag or press'} on the page shows them`, d1.acts === 1 && d1.opacity > 0, `graph ${d1.opacity}, ${d1.state}`);
  await s.browser.close();

  // Reduced motion: the page swaps states, and the swap is a first move.
  s = await open(bt, name, size, { reduced: true });
  p = s.page;
  const k0 = await actsShown(p);
  await p.keyboard.press('ArrowDown');
  await settle(p);
  await p.waitForTimeout(700);
  const k1 = await actsShown(p);
  record('4 reduced motion: a key to the graph shows them there at full strength', k0.opacity === 0 && k1.state === 'graph' && k1.acts === 1 && k1.opacity === 1,
    `before ${k0.opacity}; after ${k1.state}, graph ${k1.opacity}`);
  record('4 reduced motion: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

async function run(bt, name, size, record) {
  await part1(bt, name, size, record);
  await part2(bt, name, size, record);
  await part3(bt, name, size, record);
  await part4(bt, name, size, record);
}

(async () => {
  const server = http.createServer((req, res) => handler(req, res, { public: SITE }));
  await new Promise((r) => server.listen(PORT, r));
  const results = [];
  const runs = [];
  for (const name of ENGINES) {
    const bt = name === 'webkit' ? webkit : chromium;
    for (const size of (process.env.PP_E2E_SIZES || 'desktop,phone').split(',')) {
      const label = `${name} ${size === 'phone' ? '390x844' : '1280x800'}`;
      const rec = (check, ok, note = '') => { results.push({ run: label, check, ok, note }); console.log(`${ok ? 'PASS' : 'FAIL'}  [${label}] ${check}${note ? ' — ' + note : ''}`); };
      try {
        await run(bt, name, size, rec);
        runs.push({ label, ran: true });
      } catch (e) {
        const msg = String(e.message || e).split('\n')[0] + ' @' + ((String(e.stack).match(/t32_checks\.js:(\d+)/) || [])[1] || '?');
        if (/Executable doesn't exist|Failed to launch|browserType\.launch/.test(msg)) {
          runs.push({ label, ran: false });
          console.log(`NOT RUN  [${label}] ${msg}`);
        } else {
          rec('run', false, msg);
          runs.push({ label, ran: true });
        }
      }
    }
  }
  server.close();
  const pass = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  const notRun = runs.filter((r) => !r.ran).length;
  console.log(`\n${pass} PASS, ${fail} FAIL, ${notRun} not run`);
  if (process.env.PP_E2E_JSON) fs.writeFileSync(process.env.PP_E2E_JSON, JSON.stringify({ results, runs }, null, 2));
  process.exit(fail ? 1 : 0);
})();

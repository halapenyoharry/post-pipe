// Browser checks for the two-state page (settings.opening, mode two-state) on
// a built site: the art first on a fresh profile; a scroll (a wheel on a
// desktop, a touch drag on a phone) scrubs partway and settles on the graph,
// with the art still behind it; the graph is interactive (a card opens);
// scrolling back up returns to the art with the graph unchanged (the same
// open card, the same positions and view); a tap on the art and on the grip;
// the keys; a #read= link; a returning reader lands on the remembered state;
// the byline navigates without changing state; a wheel or a drag inside the
// graph moves the graph, not the page, and the art stays where it was;
// reduced motion swaps without a scrub; a light-mode reader keeps a light
// reader over the dark page; nothing fetched from elsewhere and no page
// errors. Chromium and WebKit, desktop (1280x800) and phone (390x844).
// Screenshots of both states in both modes go to PP_E2E_SHOTS when set.
//
//   node test/e2e/t25_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines; PP_E2E_SINGLE_PROCESS=1
// launches Chromium single-process. An engine that cannot start is reported
// as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39451;
const BASE = `http://localhost:${PORT}/`;
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const OPENING = SETTINGS.opening;
const { openingConfig, bylineText } = require('../../src/lib/opening');
const BYLINE = openingConfig(SETTINGS).byline;
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SINGLE = process.env.PP_E2E_SINGLE_PROCESS === '1';
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const CORPUS = FEED.feed_url || FEED.home_page_url || 'corpus';
const ACT1 = FEED.items.filter((i) => /a1-/.test(i.id)).sort((a, b) => a.series_part - b.series_part);
const FIRST = ACT1[0];
const SETTLE = (OPENING.snapMs || 420) + 400;

function viewstate(extra = {}) {
  return {
    version: 1, corpusId: CORPUS, layoutVersion: 'per-layout-positions-5', layout: 'force',
    hiddenSources: [], sourceColors: {}, graphColors: {}, colorProfileId: null,
    paragraphIndent: false, paragraphSpace: true, readerAids: {}, prefs: {},
    nodes: {}, timeAxis: { on: false, x: 0, y: -1000 }, reading: {}, bookmarks: [], opening: {},
    ...extra,
  };
}

// Every frame once the page is up: the cover's progress, so a check can say
// whether it ever stood in between.
function watchCover() {
  window.__cover = { ps: [] };
  const tick = () => {
    const c = window.PostPipeCover;
    if (c) {
      const p = Math.round(c.p * 1000) / 1000;
      const ps = window.__cover.ps;
      if (!ps.length || ps[ps.length - 1][0] !== p) ps.push([p, Math.round(performance.now())]);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

async function open(bt, name, size, { seed, reduced = false, scheme = 'light', hash = '', wait = true } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch(name === 'chromium' && SINGLE ? { args: ['--single-process', '--no-zygote'] } : {});
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: scheme,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  if (seed) {
    await ctx.addInitScript((vs) => {
      if (sessionStorage.getItem('t25-seeded')) return;
      sessionStorage.setItem('t25-seeded', '1');
      localStorage.setItem('post-pipe:viewstate', vs);
    }, JSON.stringify(seed));
  }
  await ctx.addInitScript(watchCover);
  await ctx.addInitScript(touchEvents);
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  await page.goto(BASE + hash);
  if (wait) await ready(page);
  return { browser, ctx, page, errors, outside, phone, name };
}

async function ready(page) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && document.querySelector('[data-cover-art]') && document.querySelector('[data-cover-art]').style.opacity !== '0', null, { timeout: 8000 });
  await page.waitForTimeout(700);
}

const state = (page) => page.evaluate(() => (window.PostPipeCover ? window.PostPipeCover.state : null));
const progress = (page) => page.evaluate(() => (window.PostPipeCover ? window.PostPipeCover.p : null));
const settle = (page) => page.waitForFunction(() => window.PostPipeCover && window.PostPipeCover.state !== 'moving', null, { timeout: 4000 }).then(() => page.waitForTimeout(150));
const stored = (page) => page.evaluate(() => {
  const vs = JSON.parse(localStorage.getItem('post-pipe:viewstate') || 'null');
  return (vs && vs.opening && vs.opening.state) || null;
});

// Where things are: the art, the byline, the graph layer, what is on top.
const coverInfo = (page) => page.evaluate(() => {
  const art = document.querySelector('[data-cover-art]');
  const imgs = art ? [...art.querySelectorAll('img')] : [];
  const r = art.getBoundingClientRect();
  const by = document.querySelector('[data-cover-byline]');
  const br = by ? by.getBoundingClientRect() : null;
  const sec = document.querySelector('[data-cover-section]');
  const cover = document.querySelector('[data-cover]');
  const handle = document.querySelector('[data-cover-handle]');
  const top = document.elementFromPoint(innerWidth / 2, innerHeight * 0.45);
  const bg = (el) => getComputedStyle(el).backgroundColor;
  return {
    W: innerWidth, H: innerHeight,
    art: { top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height, opacity: getComputedStyle(art).opacity },
    imgs: imgs.map((img) => {
      const ir = img.getBoundingClientRect();
      return { which: img.getAttribute('data-cover-image'), src: img.getAttribute('src'), url: img.currentSrc || img.src, loaded: img.complete && img.naturalWidth > 0, natural: [img.naturalWidth, img.naturalHeight], opacity: Number(getComputedStyle(img).opacity), box: [ir.left, ir.top, ir.width, ir.height].map(Math.round) };
    }),
    alt: (document.querySelector('[data-cover-alt]') || {}).getAttribute ? document.querySelector('[data-cover-alt]').getAttribute('aria-label') : null,
    byline: by ? { text: by.textContent, top: br.top, bottom: br.bottom, cx: br.left + br.width / 2, opacity: getComputedStyle(by).opacity, font: getComputedStyle(by).fontFamily, href: by.getAttribute('href') } : null,
    section: { opacity: getComputedStyle(sec).opacity, inert: !!sec.inert, events: getComputedStyle(sec).pointerEvents, bg: bg(sec) },
    graphBg: bg(document.querySelector('[data-graph-root]')),
    graph: { opacity: Number(getComputedStyle(document.querySelector('[data-graph-root]')).opacity), inert: !!document.querySelector('[data-graph-root]').inert },
    coverVisible: getComputedStyle(cover).visibility === 'visible' && getComputedStyle(cover).opacity === '1',
    groundBg: bg(document.querySelector('[data-cover] > div')),
    body: getComputedStyle(document.body).backgroundColor,
    mode: document.documentElement.getAttribute('data-pp-mode'),
    readerMode: document.documentElement.getAttribute('data-pp-reader-mode'),
    onTop: top ? (top.closest('[data-cover-stage]') ? 'art' : top.closest('[data-cover-section]') ? 'graph' : top.tagName) : null,
    handle: handle ? { opacity: getComputedStyle(handle).opacity, events: getComputedStyle(handle).pointerEvents } : null,
    gear: (() => { const g = document.querySelector('[data-settings-gear]'); return g ? getComputedStyle(g).visibility : null; })(),
  };
});

// The graph as it stands: its view, every node's place, the open cards.
const graphSnapshot = (page) => page.evaluate(() => {
  const svg = document.querySelector('[data-graph-root] svg');
  const view = svg && svg.querySelector(':scope > g');
  const nodes = {};
  for (const n of document.querySelectorAll('[data-graph-root] g.node')) {
    const d = n.__data__;
    if (d && d.id) nodes[d.id] = n.getAttribute('transform');
  }
  const open = [...document.querySelectorAll('.node-card div[data-popout="1"]')].map((e) => {
    let g = e;
    while (g && !(g.__data__ && g.__data__.id)) g = g.parentElement;
    return g ? g.__data__.id : '?';
  }).sort();
  return { view: view ? view.getAttribute('transform') : null, nodes, open };
});

// The same place to half a pixel: the simulation still settles by fractions
// of a pixel while the page is idle.
const xy = (t) => (String(t).match(/-?[\d.]+(e-?\d+)?/g) || []).map(Number);
const near = (t1, t2) => { const a = xy(t1), b = xy(t2); return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.5); };
// The same view: the translate to a hundredth of a pixel (float noise, as
// -5.7e-14 for 0, is the same place), the rotate and scale to a millionth.
const sameView = (t1, t2) => { const a = xy(t1), b = xy(t2); return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < (i < 2 ? 0.01 : 1e-6)); };
const sameGraph = (a, b) => {
  const ids = Object.keys(a.nodes);
  const moved = ids.filter((id) => !near(a.nodes[id], b.nodes[id]));
  return { ok: sameView(a.view, b.view) && moved.length === 0 && JSON.stringify(a.open) === JSON.stringify(b.open) && ids.length > 0, moved, n: ids.length };
};

async function tapAt(s, p) {
  if (s.phone) await s.page.touchscreen.tap(p.x, p.y); else await s.page.mouse.click(p.x, p.y);
}

// A touch drag on an element, from y0 to y1, in steps; `hold` leaves the
// finger down at the end.
async function touchDrag(page, selector, x, y0, y1, { steps = 8, stepMs = 30, hold = false } = {}) {
  await page.evaluate(async ({ selector, x, y0, y1, steps, stepMs, hold }) => {
    const el = selector ? document.querySelector(selector) : document.elementFromPoint(x, y0);
    const mk = (type, y, ended) => window.__touchEvent(type, el, x, y, ended);
    el.dispatchEvent(mk('touchstart', y0));
    for (let i = 1; i <= steps; i += 1) {
      await new Promise((r) => setTimeout(r, stepMs));
      el.dispatchEvent(mk('touchmove', y0 + ((y1 - y0) * i) / steps));
    }
    window.__lastTouch = { el: selector, x, y: y1 };
    if (!hold) el.dispatchEvent(mk('touchend', y1, true));
  }, { selector, x, y0, y1, steps, stepMs, hold });
}
const touchRelease = (page, selector) => page.evaluate((selector) => {
  const el = document.querySelector(selector);
  const { x, y } = window.__lastTouch;
  el.dispatchEvent(window.__touchEvent('touchend', el, x, y, true));
}, selector);

// A touch event: a real one where the engine can build it (Chromium), else
// (WebKit has no Touch constructor) an event carrying the same fields.
function touchEvents() {
  window.__touchEvent = (type, el, x, y, ended) => {
    const fields = { identifier: 7, target: el, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y };
    try {
      const t = new Touch(fields);
      return new TouchEvent(type, { bubbles: true, cancelable: true, composed: true, touches: ended ? [] : [t], targetTouches: ended ? [] : [t], changedTouches: [t] });
    } catch (_) {
      const ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
      const list = (a) => Object.assign([...a], { item: (i) => a[i] || null });
      Object.defineProperty(ev, 'touches', { value: list(ended ? [] : [fields]) });
      Object.defineProperty(ev, 'targetTouches', { value: list(ended ? [] : [fields]) });
      Object.defineProperty(ev, 'changedTouches', { value: list([fields]) });
      return ev;
    }
  };
}

// To the graph by scrolling: a wheel over the art, or a drag up on it.
async function scrollDown(s) {
  if (s.phone) await touchDrag(s.page, '[data-cover-stage]', s.W / 2, 600, 250);
  else { await s.page.mouse.move(640, 400); await s.page.mouse.wheel(0, 500); }
  await settle(s.page);
}
// Back to the art: a wheel up at the top edge, or a drag down on the grip.
async function scrollUp(s) {
  if (s.phone) await touchDrag(s.page, '[data-cover-handle]', s.W / 2, 4, 400);
  else { await s.page.mouse.move(640, 6); await s.page.mouse.wheel(0, -500); }
  await settle(s.page);
}

// A card opens on a tap. With every act closed (as a site may start them),
// one is opened first, so there are cards to tap.
async function opensCard(s) {
  await s.page.evaluate(() => {
    if (document.querySelector('.node-card div[data-card]:not([style*="display: none"])')) return;
    const visible = [...document.querySelectorAll('.node-card')].some((e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 40);
    if (visible) return;
    const g = document.querySelector('.container-group .container-macro-node:not([style*="display: none"])');
    const id = g && g.closest('.container-group').getAttribute('data-container-id');
    if (id) window.dispatchEvent(new CustomEvent('graph:open-container', { detail: { id } }));
  });
  await s.page.waitForTimeout(900);
  const p = await s.page.evaluate(() => {
    const W = innerWidth, H = innerHeight;
    for (const e of document.querySelectorAll('.node-card')) {
      const r = e.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const at = document.elementFromPoint(x, y);
      if (x > 20 && y > 60 && x < W - 20 && y < H - 120 && at && at.closest('.node-card') && !at.closest('[data-popout]')) return { x, y };
    }
    return null;
  });
  if (!p) return { ok: false, note: 'no card on screen to tap' };
  if (!s.phone) { await s.page.mouse.move(p.x, p.y); await s.page.waitForTimeout(200); }
  await tapAt(s, p);
  await s.page.waitForFunction(() => document.querySelectorAll('.node-card div[data-popout="1"]').length > 0, null, { timeout: 3000 }).catch(() => {});
  const n = await s.page.evaluate(() => document.querySelectorAll('.node-card div[data-popout="1"]').length);
  return { ok: n === 1, note: `${n} open` };
}

// A point on bare canvas, away from cards, hulls' titles and the controls.
const bareCanvas = (page) => page.evaluate(() => {
  const W = innerWidth, H = innerHeight;
  for (let y = H * 0.3; y < H * 0.8; y += 23) {
    for (let x = W * 0.1; x < W * 0.9; x += 29) {
      const at = document.elementFromPoint(x, y);
      if (at && at.tagName.toLowerCase() === 'svg' && at.closest('[data-graph-root]')) return { x, y };
    }
  }
  return null;
});

async function shot(s, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await s.page.screenshot({ path: path.join(SHOTS, `${name}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
}

const between = (v, a, b) => v > a && v < b;

async function run(bt, name, size, record) {
  // ── fresh: the art first, scrub, the graph, back, the graph unchanged ──
  {
    const s = await open(bt, name, size);
    s.W = s.phone ? 390 : 1280;
    const st = await state(s.page);
    const c = await coverInfo(s.page);
    // Since T30 the graph is never hidden: in the art state it hangs under
    // the roots at graph.artStateOpacity, and takes no taps.
    record('fresh: the art state first, the graph under the roots taking no taps', st === 'art' && c.onTop === 'art' && Math.abs(c.graph.opacity - OPENING.graph.artStateOpacity) < 0.01 && c.graph.inert, `state ${st}, on top ${c.onTop}, graph opacity ${c.graph.opacity}, inert ${c.graph.inert}`);
    const artImg = c.imgs.find((i) => i.which === 'art');
    const graphImg = c.imgs.find((i) => i.which === 'graph');
    record('fresh: the whole plant fits, loaded, with its alt', !!artImg && artImg.loaded && artImg.src === OPENING.art.artState && c.art.top >= 0 && c.art.bottom <= c.H && c.art.left >= 0 && c.art.right <= c.W && c.alt === OPENING.alt,
      `${artImg && artImg.src} ${artImg && artImg.natural.join('x')} at ${Math.round(c.art.left)},${Math.round(c.art.top)}–${Math.round(c.art.right)},${Math.round(c.art.bottom)}, alt "${c.alt}"`);
    record('art state: the full-bush image is the visible one', !!artImg && !!graphImg && artImg.opacity === 1 && graphImg.opacity === 0,
      `${artImg && artImg.src} at ${artImg && artImg.opacity}, ${graphImg && graphImg.src} at ${graphImg && graphImg.opacity}`);
    const own = await s.page.evaluate(async (list) => Promise.all(list.map(async (u) => {
      const r = await fetch(u); const b = await r.arrayBuffer(); return { u, ok: r.ok, bytes: b.byteLength };
    })), c.imgs.map((i) => i.url));
    const files = c.imgs.map((i) => fs.statSync(path.join(SITE, i.src)).size);
    // Two state images; the graph state's may be drawn twice (the copy that
    // keeps the small plant at its own strength, opening.backdrop.keepAbove).
    const states = new Set(c.imgs.map((i) => i.src));
    record('both state images are the site\'s own files, stacked on one canvas', states.size === 2 && c.imgs.length === 2 + (c.imgs.some((i) => i.which === 'graph-keep') ? 1 : 0) && own.every((o, i) => o.ok && o.u.startsWith(BASE) && o.bytes === files[i]) && c.imgs.every((i) => i.loaded && JSON.stringify(i.box) === JSON.stringify(c.imgs[0].box) && i.natural.join('x') === c.imgs[0].natural.join('x')),
      c.imgs.map((i, k) => `${i.src} ${i.natural.join('x')} ${own[k].bytes} bytes (file ${files[k]})`).join('; ') + `, both at ${c.imgs[0] && c.imgs[0].box.join(',')}`);
    const b = c.byline;
    // Since T29 a byline under a title sits under the title, in its face
    // (the T29 checks measure it); without a title, under the art as before.
    const underTitle = !!OPENING.title;
    record(underTitle ? 'fresh: the byline shown, in lower case, in the title face' : 'fresh: the byline under the art, centred, in the title face',
      underTitle
        ? !!b && b.text === bylineText(BYLINE) && Math.abs(Number(b.opacity) - BYLINE.opacity.art) < 0.005 && b.font.includes(OPENING.title.font)
        : !!b && b.text === OPENING.byline.text && b.top >= c.art.bottom - 2 && Math.abs(b.cx - c.W / 2) < 3 && b.opacity === '1' && /PP Sketch Title/.test(b.font),
      b ? `"${b.text}" ${Math.round(b.top)}–${Math.round(b.bottom)}, art ending ${Math.round(c.art.bottom)}, opacity ${b.opacity}, ${b.font.split(',')[0]}` : 'none');
    const dark = (rgb) => { const m = rgb.match(/\d+/g).map(Number); return (m[0] + m[1] + m[2]) / 3 < 80; };
    record('fresh: on the dark ground in light mode', dark(c.groundBg) && dark(c.body) && c.mode === 'dark' && c.readerMode === 'light', `ground ${c.groundBg}, page ${c.body}, mode ${c.mode}, reader's mode ${c.readerMode}`);
    // Since T30 the top bar (the gear with it) stays in both states.
    record('fresh: the top bar stays, the grip waits for the graph', c.gear === 'visible' && c.handle.events === 'none', `gear ${c.gear}, grip ${c.handle.events}`);
    record('fresh: nothing stored yet but the state', (await stored(s.page)) === 'art', String(await stored(s.page)));
    await shot(s, 'art-light');

    // Scrub partway.
    let mid = null;
    if (s.phone) {
      await touchDrag(s.page, '[data-cover-stage]', s.W / 2, 600, 560, { hold: true });
      await s.page.waitForTimeout(200);
      mid = { p: await progress(s.page), c: await coverInfo(s.page) };
      await touchRelease(s.page, '[data-cover-stage]');
    } else {
      await s.page.mouse.move(640, 400);
      await s.page.mouse.wheel(0, 40);
      await s.page.waitForTimeout(40);
      mid = { p: await progress(s.page), c: await coverInfo(s.page) };
    }
    record('scrub: partway shows the in-between', between(mid.p, 0.05, 0.95) && mid.c.art.top < c.art.top - 5 && mid.c.graph.opacity < 1 && mid.c.graph.opacity > c.graph.opacity,
      `p ${mid.p.toFixed(2)}, art top ${Math.round(c.art.top)} → ${Math.round(mid.c.art.top)}, graph opacity ${mid.c.graph.opacity.toFixed(2)}`);
    const mA = mid.c.imgs.find((i) => i.which === 'art'), mG = mid.c.imgs.find((i) => i.which === 'graph');
    record('scrub: partway the two images crossfade with p', !!mA && !!mG && Math.abs(mA.opacity - (1 - mid.p)) < 0.03 && Math.abs(mG.opacity - mid.p) < 0.03 && mG.opacity > 0,
      `p ${mid.p.toFixed(2)}: art-state image ${mA && mA.opacity.toFixed(2)}, graph-state image ${mG && mG.opacity.toFixed(2)}`);
    await settle(s.page);
    record('scrub: let go short, it settles back on the art', (await state(s.page)) === 'art' && (await progress(s.page)) === 0, `${await state(s.page)}`);

    await scrollDown(s);
    const g = await coverInfo(s.page);
    // Where the plant meets the roots: row 1330 of the 2111-row canvas.
    const crown = (g.art.top + g.art.height * (1330 / 2111)) / g.H;
    const gArt = g.imgs.find((i) => i.which === 'art');
    const gGraph = g.imgs.find((i) => i.which === 'graph');
    record('graph state: the small-plant image is the visible one', !!gArt && !!gGraph && gGraph.opacity === 1 && gArt.opacity === 0 && gGraph.src === OPENING.art.graphState,
      `${gGraph && gGraph.src} at ${gGraph && gGraph.opacity}, ${gArt && gArt.src} at ${gArt && gArt.opacity}`);
    record('scroll down: reaches the graph', (await state(s.page)) === 'graph' && g.onTop === 'graph' && g.section.opacity === '1' && !g.section.inert, `state ${await state(s.page)}, on top ${g.onTop}`);
    record('graph state: the art is still there, behind the graph', g.coverVisible && g.art.opacity === '1' && g.art.bottom > g.H * 0.4 && g.art.top < 0 && /rgba\(0, 0, 0, 0\)|transparent/.test(g.section.bg) && /rgba\(0, 0, 0, 0\)|transparent/.test(g.graphBg),
      `art ${Math.round(g.art.top)}–${Math.round(g.art.bottom)} of ${g.H}, opacity ${g.art.opacity}, layer ${g.section.bg}`);
    // With opening.top.graph (T30) the small plant's top sets the scroll,
    // not artOffset; the T30 checks measure it.
    const byTop = OPENING.top && OPENING.top.graph !== null;
    record(`graph state: scrolled up by ${byTop ? 'opening.top' : 'artOffset'}, the crown about a quarter down`, (byTop ? g.art.top < 0 : Math.abs(-g.art.top / g.art.height - OPENING.graph.artOffset) < 0.01) && between(crown, 0.12, 0.38),
      `${(-g.art.top / g.art.height).toFixed(3)} of the art above the top, crown at ${crown.toFixed(2)} of the height`);
    record(OPENING.title ? 'graph state: the byline under the small title, the grip and gear are there' : 'graph state: the byline is out of the way, the grip and gear are there',
      (OPENING.title ? Math.abs(Number(g.byline.opacity) - BYLINE.opacity.graph) < 0.005 : Number(g.byline.opacity) === 0) && g.handle.events === 'auto' && g.gear === 'visible', `byline ${g.byline.opacity}, grip ${g.handle.events}, gear ${g.gear}`);
    record('graph state: remembered', (await stored(s.page)) === 'graph', String(await stored(s.page)));
    const card = await opensCard(s);
    record('graph state: interactive (a card opens)', card.ok, card.note);
    await s.page.waitForTimeout(400);
    await shot(s, 'graph-light');

    const before = await graphSnapshot(s.page);
    const artBefore = (await coverInfo(s.page)).art;
    await scrollUp(s);
    const a2 = await coverInfo(s.page);
    record('scroll up: back to the art', (await state(s.page)) === 'art' && a2.onTop === 'art' && Math.abs(a2.art.top - c.art.top) < 1, `state ${await state(s.page)}, art top ${Math.round(a2.art.top)}`);
    const hidden = await graphSnapshot(s.page);
    await scrollDown(s);
    const after = await graphSnapshot(s.page);
    const same = sameGraph(before, after);
    record('down again: the graph exactly as it was (open card, positions, view)', same.ok && sameGraph(before, hidden).ok && (await state(s.page)) === 'graph',
      `${same.n} nodes, ${same.moved.length} moved, open ${after.open.join(',') || 'none'}, view ${sameView(after.view, before.view) ? 'same' : `changed (${before.view} → ${after.view})`}`);
    const artAfter = (await coverInfo(s.page)).art;
    record('down again: the art back where it was', Math.abs(artAfter.top - artBefore.top) < 1, `${Math.round(artBefore.top)} / ${Math.round(artAfter.top)}`);

    // Inside the graph the wheel (or a drag) is the graph's.
    await s.page.waitForTimeout(600);
    const v0 = await graphSnapshot(s.page);
    const bare = await bareCanvas(s.page);
    if (!s.phone) {
      await s.page.mouse.move(bare ? bare.x : 640, bare ? bare.y : 420);
      await s.page.mouse.wheel(0, 240);
      await s.page.waitForTimeout(500);
      const v1 = await graphSnapshot(s.page);
      record('graph: a wheel down zooms the graph, the page stays', v1.view !== v0.view && (await state(s.page)) === 'graph', `view ${v1.view !== v0.view ? 'changed' : 'same'}, state ${await state(s.page)}`);
      await s.page.mouse.wheel(0, -240);
      await s.page.waitForTimeout(500);
      const v2 = await graphSnapshot(s.page);
      record('graph: a wheel up in the middle zooms too, no flip', v2.view !== v1.view && (await state(s.page)) === 'graph', `state ${await state(s.page)}`);
    }
    if (bare) {
      if (s.phone) await touchDrag(s.page, null, bare.x, bare.y, bare.y + 120, { steps: 10 });
      else {
        await s.page.mouse.move(bare.x, bare.y); await s.page.mouse.down();
        for (let i = 1; i <= 8; i += 1) await s.page.mouse.move(bare.x + i * 10, bare.y + i * 12);
        await s.page.mouse.up();
      }
      await s.page.waitForTimeout(500);
    }
    const v3 = await graphSnapshot(s.page);
    record('graph: a drag pans the graph, the page stays', !!bare && v3.view !== v0.view && (await state(s.page)) === 'graph', bare ? `view ${v3.view !== v0.view ? 'changed' : 'same'}, state ${await state(s.page)}` : 'no bare canvas found');
    const g3 = await coverInfo(s.page);
    record('graph: after zoom and pan, the art is still behind, unmoved', g3.coverVisible && g3.art.opacity === '1' && Math.abs(g3.art.top - artBefore.top) < 1 && Math.abs(g3.art.left - artBefore.left) < 1,
      `art at ${Math.round(g3.art.left)},${Math.round(g3.art.top)} (was ${Math.round(artBefore.left)},${Math.round(artBefore.top)})`);
    record('fresh: nothing fetched from outside', s.outside.length === 0, s.outside.slice(0, 2).join(' '));
    record('fresh: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── taps: the art, then the grip ──
  {
    const s = await open(bt, name, size);
    const c = await coverInfo(s.page);
    await tapAt(s, { x: c.W / 2, y: (c.art.top + c.art.bottom) / 2 });
    await s.page.waitForTimeout(80);
    const moving = await state(s.page);
    await settle(s.page);
    record('tap on the art: to the graph, over snapMs', (await state(s.page)) === 'graph' && (moving === 'moving' || moving === 'graph'), `${moving} → ${await state(s.page)}`);
    await s.page.waitForTimeout(450);
    const h = await s.page.evaluate(() => { const r = document.querySelector('[data-cover-handle]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, hgt: r.height }; });
    await tapAt(s, h);
    await settle(s.page);
    record('tap on the grip: back to the art', (await state(s.page)) === 'art', `grip ${Math.round(h.w)}x${Math.round(h.hgt)} at the top centre`);
    const ps = await s.page.evaluate(() => window.__cover.ps.map((x) => x[0]));
    record('taps: the move is drawn frame by frame', ps.filter((p) => p > 0 && p < 1).length >= 5, `${ps.filter((p) => p > 0 && p < 1).length} frames in between`);
    record('taps: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── keys ──
  {
    const s = await open(bt, name, size);
    const seq = [];
    for (const [key, want] of [['ArrowDown', 'graph'], ['ArrowUp', 'art'], ['PageDown', 'graph'], ['PageUp', 'art'], ['Space', 'graph']]) {
      await s.page.keyboard.press(key);
      await settle(s.page);
      await s.page.waitForTimeout(400);
      seq.push([key, await state(s.page), want]);
    }
    record('keys: ArrowDown, PageDown, Space to the graph; ArrowUp, PageUp to the art', seq.every(([, got, want]) => got === want), seq.map(([k, g]) => `${k}→${g}`).join(' '));
    record('keys: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── a link straight to a chapter ──
  {
    const s = await open(bt, name, size, { hash: `#read=${FIRST.id}` });
    await s.page.waitForTimeout(800);
    const st = await state(s.page);
    const reader = await s.page.evaluate(() => {
      const p = document.querySelector('[data-reader-panel]');
      const r = p.getBoundingClientRect();
      return { shown: r.left < innerWidth - 40 && r.right > 40 && r.top < innerHeight - 40, bg: getComputedStyle(p).backgroundColor };
    });
    const ps = await s.page.evaluate(() => window.__cover.ps.map((x) => x[0]));
    record('#read= link: opens on the graph, with the chapter', st === 'graph' && reader.shown && ps.every((p) => p === 1), `state ${st}, reader shown ${reader.shown}, p ${[...new Set(ps)].join(',')}`);
    const light = (rgb) => { const m = rgb.match(/\d+/g).map(Number); return (m[0] + m[1] + m[2]) / 3 > 200; };
    record('#read= link: a light-mode reader keeps a light reader over the dark page', light(reader.bg), `reader ${reader.bg}`);
    await s.page.evaluate(() => { const b = document.querySelector('[data-reader-panel] button, [data-reader-panel] [tabindex]'); if (b) b.focus(); });
    await s.page.keyboard.press('ArrowUp');
    await s.page.waitForTimeout(600);
    record('#read= link: a key in the reader does not move the page', (await state(s.page)) === 'graph', await state(s.page));
    record('#read= link: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── a returning reader lands where they left (startOn remembered), or
  // where the site says (startOn art or graph) ──
  const startOn = openingConfig(SETTINGS).startOn;
  for (const left of ['graph', 'art']) {
    const s = await open(bt, name, size, { seed: viewstate({ opening: { state: left, t: 1 } }) });
    const ps = await s.page.evaluate(() => window.__cover.ps.map((x) => x[0]));
    const lands = startOn === 'remembered' ? left : startOn;
    const want = lands === 'graph' ? 1 : 0;
    record(`returning reader, left on the ${left}: lands ${startOn === 'remembered' ? 'there' : `on the ${lands} (startOn ${startOn})`}, no animation`, (await state(s.page)) === lands && ps.length > 0 && ps.every((p) => p === want), `state ${await state(s.page)}, p ${[...new Set(ps)].join(',')}`);
    if (left === 'graph') {
      if (lands !== 'graph') {
        await s.page.evaluate(() => window.PostPipeCover.go('graph'));
        await s.page.waitForFunction(() => window.PostPipeCover.state === 'graph', null, { timeout: 4000 }).catch(() => {});
        await s.page.waitForTimeout(500);
      }
      const card = await opensCard(s);
      record('returning reader: the graph is interactive', card.ok, card.note);
    }
    record(`returning reader (${left}): no page errors`, s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── the byline ──
  {
    const s = await open(bt, name, size);
    const c = await coverInfo(s.page);
    const expect = new URL(OPENING.byline.href, BASE).href;
    const nav = s.page.waitForNavigation({ timeout: 5000 }).then(() => true, () => false);
    await tapAt(s, { x: c.byline.cx, y: (c.byline.top + c.byline.bottom) / 2 });
    const navigated = await nav;
    const url = s.page.url();
    // The test server serves a.html as /a (clean urls).
    const bare = (u) => u.replace(/\/$/, '').replace(/\.html$/, '');
    record('byline: follows the link, same tab', navigated && bare(url) === bare(expect), url);
    record('byline: does not change the state', (await stored(s.page)) === 'art', `stored ${await stored(s.page)}`);
    record('byline: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── reduced motion ──
  {
    const s = await open(bt, name, size, { reduced: true });
    await s.page.evaluate(() => {
      window.__cover.ps = [];
      // The cover's opacity and the art's top, every frame until it settles.
      window.__fade = [];
      const t0 = performance.now();
      const tick = () => {
        const c = getComputedStyle(document.querySelector('[data-cover]')).opacity;
        const top = Math.round(document.querySelector('[data-cover-art]').getBoundingClientRect().top);
        const last = window.__fade[window.__fade.length - 1];
        const row = [Math.round(performance.now() - t0), Number(c).toFixed(2).replace(/\.?0+$/, '') || '0', top];
        if (!last || last[1] !== row[1] || last[2] !== row[2]) window.__fade.push(row);
        if (performance.now() - t0 < 900) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const t0 = Date.now();
    await s.page.keyboard.press('ArrowDown');
    await s.page.waitForFunction(() => { const s = document.querySelector('[data-cover-section]'); return s && getComputedStyle(s).opacity === '1' && window.PostPipeCover.state === 'graph'; }, null, { timeout: 3000 }).catch(() => {});
    const ms = Date.now() - t0;
    await s.page.waitForTimeout(500);
    const ps = await s.page.evaluate(() => window.__cover.ps.map((x) => x[0]));
    record('reduced motion: no scrub, the states swap', ps.every((p) => p === 0 || p === 1) && (await state(s.page)) === 'graph', `p ${ps.join(',')}`);
    const fade = await s.page.evaluate(() => window.__fade);
    // Sampled once a frame: the art's move falls in the frame where the
    // cover is at its faintest.
    const moved = fade.findIndex(([, , top]) => Math.abs(top - fade[0][2]) > 1);
    const artJumpedWhileShown = moved < 0 || Number(fade[moved][1]) > 0.25;
    const outThenIn = Math.min(...fade.map(([, c]) => Number(c))) <= 0.25 && fade[fade.length - 1][1] === '1';
    record('reduced motion: a 200 ms crossfade, out and in, the art moved out of sight', ms < 700 && outThenIn && !artJumpedWhileShown && fade[fade.length - 1][0] >= 150 && fade[fade.length - 1][0] <= 450,
      fade.map(([t, c, top]) => `${t}ms ${c} @${top}`).join(', '));
    if (s.phone) await touchDrag(s.page, '[data-cover-handle]', 195, 4, 200);
    else { await s.page.mouse.move(640, 6); await s.page.mouse.wheel(0, -200); }
    await s.page.waitForTimeout(600);
    record(`reduced motion: ${s.phone ? 'a drag on the grip' : 'a wheel up at the top'} still goes back`, (await state(s.page)) === 'art', await state(s.page));
    record('reduced motion: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── dark mode: the two states, for the screenshots ──
  {
    const s = await open(bt, name, size, { scheme: 'dark' });
    const c = await coverInfo(s.page);
    await shot(s, 'art-dark');
    await s.page.keyboard.press('ArrowDown');
    await settle(s.page);
    await s.page.waitForTimeout(500);
    const g = await coverInfo(s.page);
    await shot(s, 'graph-dark');
    record('dark mode: art, then the graph over the art', c.onTop === 'art' && g.onTop === 'graph' && g.coverVisible && c.mode === 'dark', `${c.onTop} → ${g.onTop}, mode ${c.mode}`);
    record('dark mode: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }
}

(async () => {
  const server = http.createServer((req, res) => handler(req, res, { public: SITE })).listen(PORT);
  const rows = [];
  const engines = { chromium, webkit };
  if (!OPENING || !OPENING.enabled || OPENING.mode !== 'two-state') { console.log('this build has no two-state cover'); process.exit(1); }
  for (const name of ENGINES) {
    const bt = engines[name];
    try { const b = await bt.launch(name === 'chromium' && SINGLE ? { args: ['--single-process', '--no-zygote'] } : {}); await b.close(); } catch (e) {
      rows.push({ engine: name, size: '-', check: 'engine starts', ok: null, note: 'NOT RUN: ' + e.message.split('\n')[0] });
      continue;
    }
    for (const size of ['desktop', 'phone']) {
      const record = (check, ok, note = '') => rows.push({ engine: name, size, check, ok, note });
      try { await run(bt, name, size, record); } catch (e) { record('run', false, e.message.split('\n')[0]); }
    }
  }
  server.close();
  const pass = rows.filter((r) => r.ok === true).length;
  const fail = rows.filter((r) => r.ok === false).length;
  const na = rows.filter((r) => r.ok === null).length;
  console.log('| engine | size | check | result | note |');
  console.log('|---|---|---|---|---|');
  for (const r of rows) console.log(`| ${r.engine} | ${r.size} | ${r.check} | ${r.ok === null ? 'n/a' : r.ok ? 'PASS' : 'FAIL'} | ${String(r.note).replace(/\|/g, '/')} |`);
  console.log(`\n${pass} PASS, ${fail} FAIL, ${na} n/a`);
  process.exit(fail ? 1 : 0);
})();

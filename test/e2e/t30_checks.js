// Browser checks for the launch polish on a built site:
//   1. the art state's ground is a night sky (near-black at the top, the
//      paper's texture coming in low), the bush's leaves measured against it
//      at their edges (at least 3:1) and the roots' glow measured too;
//   2. the plant's top edge within 12% of the screen's height in both states;
//   3. the graph stays visible in the art state, hanging under the roots with
//      the acts on their anchors, moving with the art, and a scroll up from
//      the graph state's top edge returns to the art;
//   4. containers start as graph.containersStart says (or, without it, as
//      graph.initialCollapsed says), on their anchors;
//      opening keeps an act centred on its anchor (since T33, an act that
//      hangs from its anchor keeps its hull's top on it), a drag leaves it where it
//      was dropped (across a reload, and when it opens), Reset returns it;
//      the other start (open) as a variant;
//   5. the top bar's page (labelled as the site says) in line with the title pill and the gear in
//      both states, opening its item in the reader, the item out of the graph;
//   6. no add-a-feed + in the top bar;
//   7. the group of dimensions named as the site says (in the bottom bar, or
//      the top bar's menu with toolbar.position top);
// and no page errors, nothing fetched from elsewhere. Chromium and WebKit,
// desktop (1280x800) and phone (390x844). The leaf contrast is measured on a
// 390x844 screenshot at an iPhone 13's pixel ratio (3). Screenshots of both
// states go to PP_E2E_SHOTS when set.
//
//   node test/e2e/t30_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines, PP_E2E_SIZES=desktop,phone sizes. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { openingConfig } = require('../../src/lib/opening');
const { artPoint } = require('../../src/lib/reach');
const { topBarConfig } = require('../../src/lib/topBar');
const { dimensionGroupLabel } = require('../../src/lib/dimensionLabels');
const { toolbarConfig } = require('../../src/lib/toolbar');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39460;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS_TEXT = HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1];
const SETTINGS = JSON.parse(SETTINGS_TEXT);
const OPENING = openingConfig(SETTINGS);
const TOP = topBarConfig(SETTINGS);
const GROUP = dimensionGroupLabel(SETTINGS);
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const ACTS = Object.entries(SETTINGS.containers || {})
  .filter(([id, c]) => id.startsWith('container:') && c && c.anchor)
  .map(([id, c]) => ({ id, anchor: c.anchor, hang: (SETTINGS.graph || {}).containerLayout === 'hang' || c.layout === 'hang' ? ((c.hang && c.hang.direction) || ((SETTINGS.graph || {}).hang || {}).direction || 'down') : null,
    // Since T34 an open act's spiral can sit on its anchor by its outer end
    // (spiral.anchorEnd outer): its last chapter is the point on the anchor.
    outer: (SETTINGS.graph || {}).containerLayout !== 'hang' && c.layout !== 'hang'
      && ((c.spiral && c.spiral.anchorEnd) || ((SETTINGS.graph || {}).spiral || {}).anchorEnd) === 'outer' }));
const BOOK = (SETTINGS.containment || []).find((c) => !c.parent).id;
const START = (SETTINGS.graph && SETTINGS.graph.containersStart) || '';
// How each act starts, as the site says: graph.containersStart (closed or
// open) for all of them, or else closed when graph.initialCollapsed names it.
const startsClosed = (id) => (START === 'closed' ? true : START === 'open' ? false
  : ((SETTINGS.graph && SETTINGS.graph.initialCollapsed) || []).includes(id));
const START_TEXT = START || 'as graph.initialCollapsed says';
// Where the graph's controls are: the bottom bar, or the top bar.
const AT_TOP = toolbarConfig(SETTINGS).position === 'top';
const CROWN = 1330 / 2111; // where the stem meets the roots on the cover's canvas
const PAGE = TOP.pages[0];

if (!OPENING || !OPENING.sky || !OPENING.top || !ACTS.length || !PAGE) {
  console.error('this site has no night-sky ground, no opening.top, no anchored containers or no top-bar page; nothing to check');
  process.exit(1);
}

const off = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const r2 = (n) => (Number.isFinite(n) ? n.toFixed(2) : String(n));

async function open(bt, name, size, { scheme = 'light', dpr = 1, variant = null } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    deviceScaleFactor: dpr,
    colorScheme: scheme,
  });
  if (variant) {
    // The same site with one setting changed: the page as served, edited.
    await ctx.route(BASE, async (route) => {
      const res = await route.fetch();
      route.fulfill({ response: res, body: variant(await res.text()) });
    });
  }
  await ctx.addInitScript(touchEvents);
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  await page.goto(BASE);
  await ready(page);
  return { browser, ctx, page, errors, outside, phone, name, scheme, W: phone ? 390 : 1280, H: phone ? 844 : 800 };
}

async function ready(page) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame && window.PostPipeGraphWorld
    && document.querySelector('[data-cover-art]') && document.querySelector('[data-cover-art]').style.opacity !== '0', null, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
}

const state = (page) => page.evaluate(() => (window.PostPipeCover ? window.PostPipeCover.state : null));
const settle = (page) => page.waitForFunction(() => window.PostPipeCover && window.PostPipeCover.state !== 'moving', null, { timeout: 4000 }).then(() => page.waitForTimeout(200));
async function go(s, to) {
  await s.page.evaluate((t) => window.PostPipeCover.go(t), to);
  await settle(s.page);
  await s.page.waitForTimeout(450); // past the cover's quiet time for wheels
}

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
async function touchDrag(page, selector, x, y0, y1, steps = 8) {
  await page.evaluate(async ({ selector, x, y0, y1, steps }) => {
    const el = document.querySelector(selector);
    el.dispatchEvent(window.__touchEvent('touchstart', el, x, y0));
    for (let i = 1; i <= steps; i += 1) {
      await new Promise((r) => setTimeout(r, 30));
      el.dispatchEvent(window.__touchEvent('touchmove', el, x, y0 + ((y1 - y0) * i) / steps));
    }
    el.dispatchEvent(window.__touchEvent('touchend', el, x, y1, true));
  }, { selector, x, y0, y1, steps });
}
async function drag(page, from, by, steps = 8) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) await page.mouse.move(from.x + (by.x * i) / steps, from.y + (by.y * i) / steps);
  await page.mouse.up();
}
async function tapAt(s, p) {
  if (s.phone) await s.page.touchscreen.tap(p.x, p.y); else await s.page.mouse.click(p.x, p.y);
}

// Everything measured in one go, in screen px.
const measure = (page) => page.evaluate(({ acts, book }) => {
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, w: r.width, h: r.height, cy: r.top + r.height / 2 }; };
  const art = document.querySelector('[data-cover-art]').getBoundingClientRect();
  // An act's place: its closed node's centre, or open, its title; or, for
  // an act that hangs from its anchor (T33), the point of its hull's top
  // that hangs there: the middle for down, the inner edge for the sides.
  // An act whose spiral sits by its outer end (T34): its last chapter, the
  // card with the highest series_part, is the point on the anchor.
  const centre = (id, hang, outer) => {
    const g = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
    if (!g || getComputedStyle(g).display === 'none') return null;
    const macro = g.querySelector('.container-macro-node');
    const closed = !!macro && getComputedStyle(macro).display !== 'none';
    if (!closed && hang) {
      const r = g.querySelector('.container-hull').getBoundingClientRect();
      const x = hang === 'down-right' ? r.left : hang === 'down-left' ? r.right : (r.left + r.right) / 2;
      const t = g.querySelector('.container-badge').getScreenCTM();
      return { closed, x, y: r.top, title: { x: t.e, y: t.f } };
    }
    const n = /act-(\d+)/.exec(id);
    if (!closed && outer && n) {
      const last = [...document.querySelectorAll('.node-card')]
        .filter((c) => c.__data__ && new RegExp(`-a${n[1]}-`).test(c.__data__.id) && getComputedStyle(c).display !== 'none')
        .sort((p, q) => q.__data__.series_part - p.__data__.series_part)[0];
      if (last) {
        const r = (last.firstElementChild || last).getBoundingClientRect();
        const t = g.querySelector('.container-badge').getScreenCTM();
        return { closed, x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, title: { x: t.e, y: t.f } };
      }
    }
    const el = closed ? macro : g.querySelector('.container-badge');
    const m = el.getScreenCTM();
    return { closed, x: m.e, y: m.f };
  };
  const root = document.querySelector('[data-graph-root]');
  const cs = getComputedStyle(root);
  const ground = document.querySelector('[data-cover-ground]');
  const gs = ground ? getComputedStyle(ground) : null;
  const tex = document.querySelector('[data-cover-ground-texture]');
  const after = getComputedStyle(document.body, '::after');
  const items = [...document.querySelectorAll('[data-graph-root] .container-group')].length;
  return {
    W: innerWidth, H: innerHeight,
    state: window.PostPipeCover.state, p: window.PostPipeCover.p,
    art: { left: art.left, top: art.top, width: art.width, height: art.height },
    acts: Object.fromEntries(acts.map((a) => [a.id, centre(a.id, a.hang, a.outer)])),
    book: centre(book),
    graph: { opacity: Number(cs.opacity), inert: root.inert === true, transform: cs.transform, pointer: cs.pointerEvents, containers: items },
    ground: gs ? { image: gs.backgroundImage, color: gs.backgroundColor, opacity: Number(gs.opacity) } : null,
    texture: tex ? { opacity: Number(getComputedStyle(tex).opacity), mask: getComputedStyle(tex).maskImage || getComputedStyle(tex).webkitMaskImage, image: getComputedStyle(tex).backgroundImage.slice(0, 30) } : null,
    grainMask: after.maskImage || after.webkitMaskImage || '',
    // The title pill, or the top bar's first control when a site leaves the
    // source pills out (T32).
    pill: box(document.querySelector('[data-feeds] > [role="button"]') || document.querySelector('[data-feeds] > *')),
    page: box(document.querySelector('[data-top-pages]')),
    pageLabel: (() => { const e = document.querySelector('[data-top-pages]'); return e ? (e.textContent.trim() || e.getAttribute('aria-label') || '') : ''; })(),
    // The settings control: the gear, or since T32 the sliders in the top bar.
    gear: box(document.querySelector('[data-settings-gear], [data-settings-open]')),
    gearVis: document.querySelector('[data-settings-gear], [data-settings-open]') ? getComputedStyle(document.querySelector('[data-settings-gear], [data-settings-open]')).visibility : null,
    add: document.querySelectorAll('[data-feeds] button[title="Add a feed"], [data-feeds] form').length,
    feedsChildren: [...document.querySelectorAll('[data-feeds] > *')].map((e) => e.getAttribute('data-top-page') || e.getAttribute('title') || e.tagName),
  };
}, { acts: ACTS, book: BOOK });

const anchorAt = (m, a) => artPoint(a.anchor, m.art);
// Moved from its anchor only the way it opens (openTowards), forward.
function pushedAway(m, a) {
  const c = m.acts[a.id];
  if (!c) return false;
  const at = anchorAt(m, a);
  const t = ((SETTINGS.containers[a.id] || {}).spiral || {}).openTowards || 'down';
  const d = { down: [0, 1], 'down-left': [-Math.SQRT1_2, Math.SQRT1_2], 'down-right': [Math.SQRT1_2, Math.SQRT1_2] }[t];
  const dx = c.x - at.x, dy = c.y - at.y;
  return Math.abs(dx * d[1] - dy * d[0]) <= 2 && dx * d[0] + dy * d[1] > 0;
}
const anchorOff = (m, a) => (m.acts[a.id] ? off(m.acts[a.id], anchorAt(m, a)) : Infinity);
const crownY = (m) => m.art.top + CROWN * m.art.height;

// Where the plant's top edge is on the screen: the first row of the visible
// state image with ink (alpha >= 64), drawn at the art's box.
const plantTop = (page, which) => page.evaluate(async (which) => {
  const img = document.querySelector(`[data-cover-image="${which}"]`);
  const r = img.getBoundingClientRect();
  const im = new Image();
  im.src = img.currentSrc || img.src;
  await im.decode();
  const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.drawImage(im, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data;
  for (let y = 0; y < h; y++) for (let i = y * w * 4 + 3, e = i + w * 4; i < e; i += 4) if (d[i] >= 64) return { y: r.top + y, artTop: r.top };
  return { y: Infinity, artTop: r.top };
}, which);

// The bush's leaves against the ground, on a screenshot: the edge pixels of
// the art-state image (opaque, with a clear pixel 3 device px away) in the
// canvas's top 30% (above the title), each against that clear pixel's
// colour on screen; and the roots (opaque, rows 65–95% of the canvas)
// against the ground beside them. Luminance contrast (WCAG).
async function contrast(s) {
  const png = (await s.page.screenshot()).toString('base64');
  return s.page.evaluate(async ({ png }) => {
    const dpr = devicePixelRatio;
    const shot = new Image(); shot.src = 'data:image/png;base64,' + png; await shot.decode();
    const W = shot.naturalWidth, H = shot.naturalHeight;
    const sc = document.createElement('canvas'); sc.width = W; sc.height = H;
    const sx = sc.getContext('2d'); sx.drawImage(shot, 0, 0);
    const S = sx.getImageData(0, 0, W, H).data;
    const el = document.querySelector('[data-cover-image="art"]');
    const r = el.getBoundingClientRect();
    const im = new Image(); im.src = el.currentSrc || el.src; await im.decode();
    const mc = document.createElement('canvas'); mc.width = W; mc.height = H;
    const mx = mc.getContext('2d'); mx.drawImage(im, r.left * dpr, r.top * dpr, r.width * dpr, r.height * dpr);
    const A = mx.getImageData(0, 0, W, H).data;
    const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const L = (i) => 0.2126 * lin(S[i]) + 0.7152 * lin(S[i + 1]) + 0.0722 * lin(S[i + 2]);
    const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const a = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : A[(y * W + x) * 4 + 3]);
    const y0 = Math.max(0, Math.round(r.top * dpr)), y1 = Math.min(H - 1, Math.round((r.top + 0.30 * r.height) * dpr));
    const D = 3, RIM = 4;
    const edges = [], rims = [], bodies = [], grounds = [];
    for (let y = y0; y < y1; y++) {
      for (let x = D; x < W - D; x++) {
        if (a(x, y) < 250) continue;
        const i = (y * W + x) * 4;
        bodies.push(L(i));
        for (const [dx, dy] of [[D, 0], [-D, 0], [0, D], [0, -D]]) {
          if (a(x + dx, y + dy) < 13) {
            const o = ((y + dy) * W + (x + dx)) * 4;
            const g = L(o);
            edges.push(ratio(L(i), g));
            // The leaf's rim: its brightest pixel within RIM device px in
            // from the edge, along the same line.
            let rim = L(i);
            for (let k = 1; k <= RIM; k++) {
              const xx = x - Math.sign(dx) * k, yy = y - Math.sign(dy) * k;
              if (a(xx, yy) < 250) break;
              rim = Math.max(rim, L((yy * W + xx) * 4));
            }
            rims.push(ratio(rim, g));
            grounds.push(g);
            break;
          }
        }
      }
    }
    // The roots' glow: the roots' pixels (opaque, rows 65–95% of the canvas)
    // against the ground's (clear) pixels in the same rows.
    const rootL = [], rootGround = [];
    const ry0 = Math.round((r.top + 0.65 * r.height) * dpr), ry1 = Math.min(H - 1, Math.round((r.top + 0.95 * r.height) * dpr));
    const rx0 = Math.max(0, Math.round(r.left * dpr)), rx1 = Math.min(W, Math.round((r.left + r.width) * dpr));
    for (let y = Math.max(0, ry0); y < ry1; y += 2) {
      for (let x = rx0; x < rx1; x += 2) {
        const al = a(x, y);
        if (al >= 250) rootL.push(L((y * W + x) * 4));
        else if (al === 0) rootGround.push(L((y * W + x) * 4));
      }
    }
    const q = (arr, p) => { const s2 = [...arr].sort((m, n) => m - n); return s2.length ? s2[Math.min(s2.length - 1, Math.floor(s2.length * p))] : NaN; };
    const top = S.slice(0, 4);
    return {
      dpr, n: edges.length,
      edge: { p25: q(edges, 0.25), median: q(edges, 0.5), p75: q(edges, 0.75), share3: edges.filter((v) => v >= 3).length / Math.max(1, edges.length) },
      rim: { p25: q(rims, 0.25), median: q(rims, 0.5), p75: q(rims, 0.75), share3: rims.filter((v) => v >= 3).length / Math.max(1, rims.length) },
      body: { median: q(bodies, 0.5) }, ground: { median: q(grounds, 0.5) },
      bodyRatio: ratio(q(bodies, 0.5), q(grounds, 0.5)),
      blackBody: ratio(q(bodies, 0.5), 0), blackEdge: ratio(q(edges.map((v) => v * (q(grounds, 0.5) + 0.05) - 0.05), 0.5), 0),
      roots: { n: rootL.length, median: q(rootL, 0.5), p75: q(rootL, 0.75), ground: q(rootGround, 0.5), ratio: ratio(q(rootL, 0.5), q(rootGround, 0.5)), ratio75: ratio(q(rootL, 0.75), q(rootGround, 0.5)) },
      topPixel: [top[0], top[1], top[2]],
    };
  }, { png });
}

async function shot(s, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await s.page.screenshot({ path: path.join(SHOTS, `${name}-${s.scheme}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
}

const hexLum = (rgb) => { const m = (rgb.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number); return m.length === 3 ? (m[0] + m[1] + m[2]) / 3 : NaN; };

const HIDDEN_IN_ART = openingConfig(SETTINGS).graph.artStateOpacity === 0;
const BAR_IN_ART = openingConfig(SETTINGS).topBarInArt;

async function run(bt, name, size, record) {
  // ── light, fresh ──
  {
    const s = await open(bt, name, size);
    const p = s.page;
    let m = await measure(p);

    // 1. The night sky.
    record('1 art state: the ground is near-black at the top, the theme\'s dark paper at the foot',
      m.state === 'art' && m.ground && m.ground.opacity === 1 && /linear-gradient/.test(m.ground.image) && m.ground.image.includes('rgb(5, 5, 5)'),
      `ground ${m.ground && m.ground.image.replace(/\s+/g, ' ').slice(0, 120)}`);
    record('1 art state: the paper\'s texture is absent high and comes in low (its own layer, and the page\'s grain masked)',
      !!m.texture && m.texture.opacity > 0 && /linear-gradient/.test(m.texture.mask) && /transparent|rgba\(0, 0, 0, 0\)/.test(m.texture.mask) && /linear-gradient/.test(m.grainMask) && /rgba\(0, 0, 0, 0\)/.test(m.grainMask),
      `texture ${m.texture && m.texture.opacity}, mask ${m.texture && m.texture.mask.replace(/\s+/g, ' ').slice(0, 90)}; page grain ${m.grainMask.replace(/\s+/g, ' ').slice(0, 90)}`);

    // 2. The plant's top edge, art state.
    const ta = await plantTop(p, 'art');
    const ctrl = Math.max(m.pill ? m.pill.bottom : 0, m.gear ? m.gear.bottom : 0, m.page ? m.page.bottom : 0);
    record(`2 art state: the plant's top edge within 12% of the height (${Math.round(s.H * 0.12)} px), under the top controls`,
      ta.y <= s.H * 0.12 && ta.y >= ctrl,
      `plant top ${r1(ta.y)} px (${r2(ta.y / s.H)} of ${s.H}), ${r1(ta.y - ctrl)} px under the controls ending at ${r1(ctrl)}`);

    // 3. The graph in the art state. A site can keep it off the cover until
    // the first move (T32, opening.graph.hiddenUntilMove): a 1 px wheel first.
    if (openingConfig(SETTINGS).graph.hiddenUntilMove) {
      await p.mouse.move(s.W / 2, s.H * 0.55);
      await p.mouse.wheel(0, 1);
      await p.waitForTimeout(500);
      m = await measure(p);
    }
    const below = ACTS.map((a) => ({ a, c: m.acts[a.id] })).filter((x) => x.c);
    const onAnchors = ACTS.map((a) => anchorOff(m, a));
    if (HIDDEN_IN_ART) {
      // Since T35 a site can show nothing of the graph in the art state
      // (graph.artStateOpacity 0): its layers are display none there.
      const layers = await p.evaluate(() => [...document.querySelector('[data-graph-root]').children].map((c) => getComputedStyle(c).display));
      record('3 art state: nothing of the graph drawn (graph.artStateOpacity 0)', layers.length > 0 && layers.every((d) => d === 'none') && m.graph.inert, `${layers.join(',')}, inert ${m.graph.inert}`);
    } else {
    record('3 art state: the graph is there, visible (opacity > 0.3)', m.graph.opacity > 0.3 && m.graph.containers > 0,
      `graph opacity ${r2(m.graph.opacity)}, ${m.graph.containers} containers drawn, inert ${m.graph.inert}`);
    record('3 art state: the graph hangs under the roots, each act on its anchor on the art, below the crown',
      below.length === ACTS.length && below.every((x) => x.c.y > crownY(m)) && onAnchors.every((d) => d <= 2),
      `crown at y ${r1(crownY(m))}; ${below.map((x) => `${x.a.id.replace('container:', '')} y ${r1(x.c.y)}, ${r1(anchorOff(m, x.a))} px off its anchor`).join('; ')}`);
    }

    // 5, 6. The top bar in the art state.
    const inLine = (mm) => mm.page && mm.pill && mm.gear && Math.abs(mm.page.cy - mm.pill.cy) <= 1 && mm.page.top < mm.gear.bottom && mm.page.bottom > mm.gear.top;
    // Since T35 the top bar is in the graph state alone unless
    // opening.topBarInArt: "about" is then checked there.
    if (BAR_IN_ART) record(`5 art state: "${PAGE.label}" at the top, in line with the title pill and the gear`, !!inLine(m) && m.pageLabel === PAGE.label && m.gearVis === 'visible',
      m.page ? `${m.pageLabel} ${r1(m.page.left)},${r1(m.page.top)}–${r1(m.page.right)},${r1(m.page.bottom)}; pill ${r1(m.pill.top)}–${r1(m.pill.bottom)}; gear ${r1(m.gear.top)}–${r1(m.gear.bottom)} ${m.gearVis}` : 'no button');
    else {
      const hid = await p.evaluate(() => { const b = document.querySelector('[data-feeds]'); return getComputedStyle(b).visibility; });
      record(`5 art state: no top bar, so no "${PAGE.label}" (opening.topBarInArt false)`, hid === 'hidden', hid);
    }
    record('6 no add-a-feed + in the top bar', m.add === 0 && !TOP.addFeed, `top bar: ${m.feedsChildren.join(' | ')}`);
    await shot(s, 'art');

    // 5. The page opens in the reader from the art state (or, without the
    // top bar there, from the graph state), and comes back.
    const tapAbout = async (where) => {
      await tapAt(s, { x: (m.page.left + m.page.right) / 2, y: m.page.cy });
      await p.waitForTimeout(900);
      const rd = await p.evaluate(() => ({ hash: decodeURIComponent(location.hash), shown: !!document.querySelector('[data-reader-panel]'), title: (document.querySelector('[data-reader-panel] h1, [data-reader-panel] h2') || {}).textContent || '' }));
      record(`5 ${where}: a tap on "${PAGE.label}" opens its item in the reader`, rd.shown && rd.hash.includes(PAGE.id),
        `${rd.hash}, reader ${rd.shown ? 'open' : 'closed'}, heading "${rd.title}"`);
      await p.keyboard.press('Escape');
      await p.waitForTimeout(500);
    };
    if (BAR_IN_ART) await tapAbout('art state');

    // 3, 4. To the graph: the acts as they start, on their anchors.
    await go(s, 'graph');
    m = await measure(p);
    const startOk = ACTS.every((a) => m.acts[a.id] && m.acts[a.id].closed === startsClosed(a.id));
    record(`4 fresh: the acts start ${START_TEXT}, each on its anchor`, startOk && ACTS.every((a) => anchorOff(m, a) <= 2),
      ACTS.map((a) => `${a.id.replace('container:', '')} ${m.acts[a.id] && (m.acts[a.id].closed ? 'closed' : 'open')} ${r1(anchorOff(m, a))} px off`).join('; '));
    const tg = await plantTop(p, 'graph');
    const ctrl2 = Math.max(m.pill ? m.pill.bottom : 0, m.gear ? m.gear.bottom : 0, m.page ? m.page.bottom : 0);
    record(`2 graph state: the small plant's top edge within 12% of the height (${Math.round(s.H * 0.12)} px), just under the top controls`,
      tg.y <= s.H * 0.12 && tg.y >= ctrl2,
      `plant top ${r1(tg.y)} px (${r2(tg.y / s.H)} of ${s.H}), ${r1(tg.y - ctrl2)} px under the controls ending at ${r1(ctrl2)}`);
    record('3 graph state: the graph at full strength, interactive', m.graph.opacity === 1 && !m.graph.inert && m.graph.transform === 'none',
      `opacity ${m.graph.opacity}, inert ${m.graph.inert}, transform ${m.graph.transform}`);
    record(`5 graph state: "${PAGE.label}" ${BAR_IN_ART ? 'still ' : ''}at the top, in line with the title pill and the gear`, !!inLine(m),
      m.page ? `${r1(m.page.top)}–${r1(m.page.bottom)}, pill ${r1(m.pill.top)}–${r1(m.pill.bottom)}` : 'no button');
    if (!BAR_IN_ART) {
      await tapAbout('graph state');
      if ((await state(p)) !== 'graph') await go(s, 'graph');
      m = await measure(p);
    }
    const world = await p.evaluate(() => fetch('./feed.json').then((r) => r.json()).then((f) => f.items.map((i) => i.url.split('/').pop().replace('.html', ''))));
    const drawn = await p.evaluate(() => {
      const ids = new Set();
      for (const el of document.querySelectorAll('[data-graph-root] *')) {
        const d = el.__data__;
        if (d && d.type === 'article' && d.id) ids.add(d.id);
      }
      return [...ids];
    });
    record(`5 the page's item (${PAGE.id}) is not in the graph; the book holds only the acts' chapters`,
      !drawn.includes(PAGE.id) && drawn.length === world.length - 1,
      `${drawn.length} items drawn of ${world.length} in the feed; ${PAGE.id} ${drawn.includes(PAGE.id) ? 'drawn' : 'not drawn'}`);

    // 7. The group of dimensions.
    const grp = await p.evaluate(() => [...document.querySelectorAll('[data-group-label]')].map((e) => ({ text: e.textContent, shown: e.getClientRects().length > 0 && getComputedStyle(e).display !== 'none' })));
    let sheet = [];
    if (AT_TOP) {
      // The controls are in the top bar: the hourglass menu is headed with it.
      await p.click('[data-top-menu-button]');
      await p.waitForTimeout(300);
      sheet = await p.evaluate(() => [...document.querySelectorAll('[data-top-menu] [data-group-label]')].map((e) => e.textContent));
      await p.keyboard.press('Escape');
      await p.waitForTimeout(200);
    } else if (s.phone) {
      await p.click('[data-toolbar-more]', { timeout: 5000 }).catch(async (e) => {
        const why = await p.evaluate(() => { const m = document.querySelector('[data-toolbar-more]'); const r = m.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return `${r.top},${r.height} under ${el && el.outerHTML.slice(0, 120)} reader ${!!document.querySelector('[data-reader-panel]')} hash ${location.hash}`; });
        throw new Error(`More: ${why} ${String(e.message).split('\n')[0]}`);
      });
      await p.waitForTimeout(300);
      sheet = await p.evaluate(() => [...document.querySelectorAll('[data-toolbar-sheet] [data-group-label]')].map((e) => e.textContent));
      await p.keyboard.press('Escape'); // the sheet's backdrop covers the button
      await p.waitForTimeout(200);
    }
    const want = GROUP.charAt(0).toUpperCase() + GROUP.slice(1);
    record(`7 the ${AT_TOP ? 'top bar\'s menu' : 'bottom bar'} names the dimensions "${GROUP}"`,
      AT_TOP || s.phone ? sheet.includes(want) : grp.some((g) => g.shown && g.text === GROUP),
      AT_TOP ? `menu heading: ${sheet.join(', ') || 'none'}` : s.phone ? `More sheet heading: ${sheet.join(', ') || 'none'}` : `bar label: ${grp.filter((g) => g.shown).map((g) => g.text).join(', ') || 'none'}`);

    // 4. Open an act: centred on its anchor, and still there once settled.
    // The highest act but the one dragged below: since T35 Act One sits at
    // the screen's foot on a desktop, where its open title is below it.
    const a2 = ACTS.find((a) => /act-2/.test(a.id)) || ACTS[1];
    const a1 = ACTS.filter((a) => a !== a2).sort((p, q) => p.anchor.y - q.anchor.y)[0];
    if (m.acts[a1.id].closed) await tapAt(s, m.acts[a1.id]);
    await p.waitForTimeout(900);
    const o1 = await measure(p);
    await p.waitForTimeout(2200);
    const o2 = await measure(p);
    record('4 open an act: it opens centred on its anchor and stays there',
      // Since T35 an open act that would meet another is pushed the way it
      // opens until clear (open acts never overlap).
      !o2.acts[a1.id].closed && (anchorOff(o1, a1) <= 2 || pushedAway(o1, a1)) && (anchorOff(o2, a1) <= 2 || pushedAway(o2, a1)),
      `${a1.id.replace('container:', '')} ${a1.outer ? 'last chapter' : 'title'} ${r1(anchorOff(o1, a1))} px from its anchor after 0.9 s, ${r1(anchorOff(o2, a1))} px after 3.1 s`);
    // A tap on its title closes it (an open act that hangs is measured at
    // its hull's top, which is not its title).
    // Since T35 Act Three sits near a phone's right edge and opens down-right,
    // so its open title can fall off the screen: then it is closed through
    // the graph's own call, and the detail says so.
    const tgt = o2.acts[a1.id].title || o2.acts[a1.id];
    const tappable = tgt.x >= 0 && tgt.x <= s.W && tgt.y >= 0 && tgt.y <= s.H;
    if (tappable) await tapAt(s, tgt);
    else await p.evaluate((id) => window.PostPipeGraph.closeContainer(id), a1.id);
    await p.waitForTimeout(1500);
    const c1 = await measure(p);
    record('4 close it again: back on its anchor', c1.acts[a1.id].closed && anchorOff(c1, a1) <= 2, `${c1.acts[a1.id].closed ? 'closed' : 'still open'}, ${r1(anchorOff(c1, a1))} px off; ${tappable ? 'its title tapped' : `its title off the screen (${r1(tgt.x)}, ${r1(tgt.y)}), closed by PostPipeGraph.closeContainer`}`);
    await shot(s, 'graph');

    // 4. Drag one: it stays where dropped, opens there, and comes back there.
    const from = c1.acts[a2.id];
    const by = { x: s.phone ? -40 : -60, y: s.phone ? 50 : 40 };
    await drag(p, from, by);
    await p.waitForTimeout(1500);
    const d1 = await measure(p);
    const dropped = d1.acts[a2.id];
    record('4 drag an act: it stays where it was dropped', off(dropped, { x: from.x + by.x, y: from.y + by.y }) <= 3 && anchorOff(d1, a2) > 30,
      `${a2.id.replace('container:', '')} ${r1(off(dropped, { x: from.x + by.x, y: from.y + by.y }))} px from the drop, ${r1(anchorOff(d1, a2))} px from its anchor`);
    if (d1.acts[a2.id].closed) await tapAt(s, dropped);
    await p.waitForTimeout(2500);
    const d2 = await measure(p);
    record('4 a dragged act opens where it was dropped, not on its anchor', !d2.acts[a2.id].closed && off(d2.acts[a2.id], dropped) <= 3,
      `${ACTS.find((a) => a.id === a2.id).outer ? 'last chapter' : 'title'} ${r1(off(d2.acts[a2.id], dropped))} px from where it was dropped`);
    await tapAt(s, d2.acts[a2.id].title || d2.acts[a2.id]);
    await p.waitForTimeout(1200);
    const marks = await p.evaluate(() => {
      const nodes = (JSON.parse(localStorage.getItem('post-pipe:viewstate') || '{}').nodes) || {};
      const e = Object.entries(nodes);
      return e.filter(([k]) => k.includes('container:')).map(([k, v]) => `${k.split('::')[1]}${v.auto ? ' (auto)' : ''}`)
        .concat([`${e.filter(([k, v]) => !k.includes('container:') && Number.isFinite(v.x) && !v.auto).length} placed by the reader, ${e.filter(([, v]) => v.auto).length} by the layout`]);
    });
    await p.reload();
    await ready(p);
    await go(s, 'graph');
    const d3 = await measure(p);
    record('4 after a reload the dragged act is where the reader left it, the others on their anchors',
      off(d3.acts[a2.id], dropped) <= 3 && ACTS.filter((a) => a.id !== a2.id).every((a) => anchorOff(d3, a) <= 2),
      `${a2.id.replace('container:', '')} ${r1(off(d3.acts[a2.id], dropped))} px from where it was left (kept as dragged: ${marks.join(', ') || 'none'}); others ${ACTS.filter((a) => a.id !== a2.id).map((a) => r1(anchorOff(d3, a))).join(', ')} px off`);
    await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
    await p.waitForTimeout(1800);
    const rs = await measure(p);
    record('4 Reset: every act back on its anchor, open or closed as it started', ACTS.every((a) => anchorOff(rs, a) <= 2 && rs.acts[a.id].closed === startsClosed(a.id)),
      ACTS.map((a) => `${r1(anchorOff(rs, a))}`).join(', ') + ' px off');

    // 5. The page opens from the graph state too.
    m = await measure(p);
    await tapAt(s, { x: (m.page.left + m.page.right) / 2, y: m.page.cy });
    await p.waitForTimeout(900);
    const rd2 = await p.evaluate(() => ({ hash: decodeURIComponent(location.hash), shown: !!document.querySelector('[data-reader-panel]') }));
    record(`5 graph state: a tap on "${PAGE.label}" opens its item in the reader`, rd2.shown && rd2.hash.includes(PAGE.id), `${rd2.hash}, reader ${rd2.shown ? 'open' : 'closed'}`);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(500);

    // 3. Back to the art from the graph state's top edge; the graph stays,
    // following the art down, on its anchors all the way.
    const frames = [];
    // Followed: an act that starts closed (its closed node), or else act 1
    // (its title, open).
    const a1def = ACTS.find((a) => startsClosed(a.id)) || ACTS.find((a) => /act-1/.test(a.id)) || ACTS[0];
    await p.evaluate(({ id, closed }) => {
      window.__t30 = [];
      const tick = () => {
        const art = document.querySelector('[data-cover-art]').getBoundingClientRect();
        const g = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"] ${closed ? '.container-macro-node' : '.container-badge'}`);
        const m2 = g ? g.getScreenCTM() : null;
        window.__t30.push({ p: window.PostPipeCover.p, op: Number(getComputedStyle(document.querySelector('[data-graph-root]')).opacity), art: { left: art.left, top: art.top, width: art.width, height: art.height }, c: m2 ? { x: m2.e, y: m2.f } : null });
        if (window.__t30.length < 400) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { id: a1def.id, closed: startsClosed(a1def.id) });
    if (s.phone) await touchDrag(p, '[data-cover-handle]', 195, 4, 420);
    else {
      // A wheel up at the top edge, in notches, so the page is seen between.
      await p.mouse.move(640, 6);
      for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, -40); await p.waitForTimeout(25); }
    }
    await settle(p);
    frames.push(...(await p.evaluate(() => window.__t30.filter((f) => f.p > 0.02 && f.p < 0.98))));
    const st = await state(p);
    const back = await measure(p);
    const drift = frames.filter((f) => f.c).map((f) => off(f.c, artPoint(a1def.anchor, f.art)));
    record(`3 a scroll up from the graph state's top edge (${s.phone ? 'a drag down on the grip' : 'a wheel up at the top'}) returns to the art`, st === 'art', `state ${st}`);
    if (HIDDEN_IN_ART) {
      // With graph.artStateOpacity 0 the graph fades out on the way, and
      // the art scales between the states (T35), so an act need not ride
      // its anchor while it fades.
      record('3 on the way the graph fades out with the page', frames.length > 3 && frames[frames.length - 1].op < frames[0].op,
        `${frames.length} frames, graph opacity ${r2(frames[0].op)} to ${r2(frames[frames.length - 1].op)}`);
      const layers = await p.evaluate(() => [...document.querySelector('[data-graph-root]').children].map((c) => getComputedStyle(c).display));
      record('3 back in the art state: nothing of the graph drawn', layers.every((d) => d === 'none'), layers.join(','));
    } else {
    record('3 on the way the graph keeps to the art (an act on its anchor in every frame) and stays visible',
      frames.length > 3 && drift.length > 3 && Math.max(...drift) <= 2 && frames.every((f) => f.op > 0.3),
      `${frames.length} frames between the states, act off its anchor at most ${r1(Math.max(...drift))} px, graph opacity ${r2(Math.min(...frames.map((f) => f.op)))}–${r2(Math.max(...frames.map((f) => f.op)))}`);
    record('3 back in the art state: the graph still there, under the roots', back.graph.opacity > 0.3 && ACTS.every((a) => back.acts[a.id] && back.acts[a.id].y > crownY(back) && anchorOff(back, a) <= 2),
      `opacity ${r2(back.graph.opacity)}, acts ${ACTS.map((a) => r1(anchorOff(back, a))).join(', ')} px off their anchors`);
    }
    record('light run: nothing fetched from elsewhere, no page errors', s.outside.length === 0 && s.errors.length === 0,
      `${s.outside.length} outside, ${s.errors.length} errors${s.errors.length ? ': ' + s.errors.slice(0, 2).join(' | ') : ''}`);
    await s.browser.close();
  }

  // ── dark: both states' screenshots ──
  {
    const s = await open(bt, name, size, { scheme: 'dark' });
    const m = await measure(s.page);
    record('1 dark mode: the same night sky', /linear-gradient/.test(m.ground.image) && m.ground.image.includes('rgb(5, 5, 5)'), m.ground.image.replace(/\s+/g, ' ').slice(0, 80));
    await shot(s, 'art');
    await go(s, 'graph');
    await s.page.waitForTimeout(1900);
    await shot(s, 'graph');
    record('dark run: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── the leaves against the sky, at an iPhone 13's pixel ratio ──
  if (size === 'phone') {
    const s = await open(bt, name, size, { dpr: 3 });
    const c = await contrast(s);
    // At their edges: each leaf's rim (its brightest pixel within 4 device
    // px, 1.3 CSS px, in from the edge) against the ground just outside. The
    // outermost pixel alone, the leaf bodies, and what pure black would give
    // are in the note.
    record('1 the bush\'s leaves against the night sky at their edges (the rim), at least 3:1 (median)', c.rim.median >= 3,
      `${c.n} edge points at ${c.dpr}x: rim median ${r2(c.rim.median)}:1 (quartiles ${r2(c.rim.p25)}, ${r2(c.rim.p75)}; ${Math.round(c.rim.share3 * 100)}% at 3:1 or more); the outermost pixel alone median ${r2(c.edge.median)}:1 (${Math.round(c.edge.share3 * 100)}%); leaf bodies (median L ${c.body.median.toFixed(4)}) ${r2(c.bodyRatio)}:1, on pure black ${r2(c.blackBody)}:1; ground there L ${c.ground.median.toFixed(4)}, the screen's top pixel rgb(${c.topPixel.join(', ')})`);
    record('1 the roots\' glow still reads: the roots against the ground beside them, 3:1 or more (median)', c.roots.ratio >= 3,
      `${c.roots.n} root pixels, median L ${c.roots.median.toFixed(3)} (upper quartile ${c.roots.p75.toFixed(3)}) on ground L ${c.roots.ground.toFixed(4)}: ${r2(c.roots.ratio)}:1 (upper quartile ${r2(c.roots.ratio75)}:1)`);
    s.contrast = c;
    await s.browser.close();
  }

  // ── the other start: open ──
  {
    const flip = (html) => html.replace(/"containersStart":"[a-z]*"/, '"containersStart":"open"');
    const s = await open(bt, name, size, { variant: flip });
    await s.page.evaluate(() => localStorage.clear());
    await go(s, 'graph');
    await s.page.waitForTimeout(1500);
    const m = await measure(s.page);
    // Since T35 open acts never overlap: one that would meet another is
    // pushed straight along the way it opens (openTowards), so it is on its
    // anchor or moved only that way.
    const along = (a) => {
      const c = m.acts[a.id], at = anchorAt(m, a);
      const t = ((SETTINGS.containers[a.id] || {}).spiral || {}).openTowards || 'down';
      const dir = { down: [0, 1], 'down-left': [-Math.SQRT1_2, Math.SQRT1_2], 'down-right': [Math.SQRT1_2, Math.SQRT1_2] }[t];
      const dx = c.x - at.x, dy = c.y - at.y;
      return Math.abs(dx * dir[1] - dy * dir[0]) <= 2 && dx * dir[0] + dy * dir[1] > 0;
    };
    record('4 variant containersStart open: the acts start open, each on its anchor or pushed the way it opens',
      ACTS.every((a) => m.acts[a.id] && !m.acts[a.id].closed && (anchorOff(m, a) <= 2 || along(a))),
      ACTS.map((a) => `${a.id.replace('container:', '')} ${m.acts[a.id] && (m.acts[a.id].closed ? 'closed' : 'open')} ${r1(anchorOff(m, a))} px off`).join('; '));
    record('variant: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }
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
        const msg = String(e.message || e).split('\n')[0] + ' @' + ((String(e.stack).match(/t30_checks\.js:(\d+)/) || [])[1] || '?');
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

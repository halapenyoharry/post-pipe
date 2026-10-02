// Browser checks for the roots reaching for the acts (settings.opening.reach,
// opening.backdrop, containers[].anchor and labelPosition) on a built site:
// on a fresh profile the closed acts sit on their anchors on the art; each
// act is reached by rootlets from its nearest tips, which start on the art
// and stop stopShort before the act's outline; they draw in when they first
// show; they re-aim with a lag after a drag, and follow a zoom and a pan;
// the art's roots and the rootlets fade as the graph is zoomed in while the
// small plant keeps its strength; the cover's title stays at the crown; the
// book's own title is hidden (or, as the alternative, at the top of its
// hull); Reset puts the acts back, saved positions bring them back where the
// reader left them; an act opens in place; reduced motion; no page errors.
// Chromium and WebKit, desktop (1280x800) and phone (390x844). Screenshots
// (closed and open, light and dark, and the title at the top) go to
// PP_E2E_SHOTS when set.
//
//   node test/e2e/t27_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { reachConfig, backdropConfig, artPoint, rayHit } = require('../../src/lib/reach');
const { openingConfig } = require('../../src/lib/opening');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39453;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const REACH = reachConfig(SETTINGS.opening);
const BACKDROP = backdropConfig(SETTINGS.opening);
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const ACTS = Object.entries(SETTINGS.containers || {})
  .filter(([id, c]) => id.startsWith('container:') && c && c.anchor)
  .map(([id, c]) => ({ id, anchor: c.anchor }));
const BOOK = (SETTINGS.containment || []).find((c) => !c.parent).id;
const CROWN = 1330 / 2111;

if (!REACH || !ACTS.length) {
  console.error('this site has no opening.reach or no anchored containers; nothing to check');
  process.exit(1);
}

async function open(bt, name, size, { scheme = 'light', reduced = false, variant = null, ctx: reuse = null } = {}) {
  const phone = size === 'phone';
  const browser = reuse ? reuse.browser : await bt.launch();
  const ctx = reuse ? reuse.ctx : await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: scheme,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  if (variant && !reuse) await variant(ctx);
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  await page.goto(BASE);
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame && window.PostPipeGraphWorld, null, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  return { browser, ctx, page, errors, outside, phone, name, scheme };
}

const settle = (page) => page.waitForFunction(() => window.PostPipeCover && window.PostPipeCover.state !== 'moving', null, { timeout: 4000 }).then(() => page.waitForTimeout(150));

async function toGraph(s) {
  await s.page.evaluate(() => window.PostPipeCover.go('graph'));
  await settle(s.page);
  await s.page.waitForTimeout(450); // past the cover's quiet time for wheels
}

// Everything measured in one go, in screen px: the art's box, each act's
// outline as drawn (closed node or open hull) and centre, every rootlet's
// start, end, target and drawing state, the zoom, the opacities.
const measure = (page) => page.evaluate(({ acts, book }) => {
  const art = document.querySelector('[data-cover-art]').getBoundingClientRect();
  const outline = (id) => {
    const g = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
    if (!g || getComputedStyle(g).display === 'none') return null;
    const macro = g.querySelector('.container-macro-node');
    const closed = !!macro && getComputedStyle(macro).display !== 'none';
    const path = g.querySelector(closed ? '.container-macro-bg' : '.container-hull');
    const m = path.getScreenCTM();
    const len = path.getTotalLength();
    const pts = [];
    for (let i = 0; i < 240; i++) {
      const q = path.getPointAtLength((len * i) / 240);
      pts.push({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f });
    }
    let centre = null;
    if (closed) { const mm = macro.getScreenCTM(); centre = { x: mm.e, y: mm.f }; }
    const badge = g.querySelector('.container-badge');
    let label = null;
    if (!closed && badge && getComputedStyle(badge).display !== 'none') { const bm = badge.getScreenCTM(); label = { x: bm.e, y: bm.f }; }
    return { closed, pts, centre, label };
  };
  const nums = (d) => (d.match(/-?[\d.]+/g) || []).map(Number);
  const rootlets = [...document.querySelectorAll('[data-reach]')].map((g) => {
    const main = g.querySelector('.reach-main');
    const n = nums(main.getAttribute('d') || '');
    const t = (g.getAttribute('data-target') || '').split(',').map(Number);
    return {
      key: g.getAttribute('data-reach'), c: g.getAttribute('data-reach-container'), tip: Number(g.getAttribute('data-reach-tip')),
      start: { x: n[0], y: n[1] }, end: { x: n[n.length - 2], y: n[n.length - 1] }, pts: n.length / 2,
      wander: (() => { const x0 = n[0], y0 = n[1], x1 = n[n.length - 2], y1 = n[n.length - 1], L = Math.hypot(x1 - x0, y1 - y0) || 1; let w = 0; for (let i = 0; i < n.length; i += 2) w = Math.max(w, Math.abs((n[i] - x0) * (y1 - y0) - (n[i + 1] - y0) * (x1 - x0)) / L); return w; })(),
      target: { x: t[0], y: t[1] }, drawn: g.getAttribute('data-drawn'), visible: getComputedStyle(g).visibility !== 'hidden',
      dash: getComputedStyle(main).strokeDashoffset, dasharray: getComputedStyle(main).strokeDasharray,
      fine: (g.querySelector('.reach-fine').getAttribute('d') || '').length,
    };
  });
  const op = (sel) => { const el = document.querySelector(sel); return el ? Number(getComputedStyle(el).opacity) : null; };
  const w = window.PostPipeGraphWorld.snapshot();
  const top = document.querySelector(`.container-group[data-container-id="${CSS.escape(book)}"] .container-badge`);
  const titleLine = document.querySelector('[data-cover-title="graph"] [data-cover-title-line]');
  const tl = titleLine ? titleLine.getBoundingClientRect() : null;
  return {
    W: innerWidth, H: innerHeight,
    art: { left: art.left, top: art.top, width: art.width, height: art.height },
    acts: Object.fromEntries(acts.map((a) => [a.id, outline(a.id)])),
    book: outline(book),
    bookLabel: top ? { display: getComputedStyle(top).display, vis: getComputedStyle(top).visibility, pos: top.getAttribute('data-label-position'), box: (() => { const r = top.querySelector('.container-badge-text').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; })() } : null,
    rootlets, k: w.k, homeK: w.homeK,
    roots: op('[data-cover-image="graph"]'), keep: op('[data-cover-image="graph-keep"]'), layer: op('[data-cover-reach]'),
    title: tl ? { x: tl.left, y: tl.bottom } : null,
  };
}, { acts: ACTS, book: BOOK });

// How far a rootlet's end stops short of its act's outline, along its way.
function gap(r, o) {
  const dx = r.end.x - r.start.x, dy = r.end.y - r.start.y;
  const len = Math.hypot(dx, dy) || 1;
  const far = { x: r.start.x + (dx / len) * 5000, y: r.start.y + (dy / len) * 5000 };
  const hit = rayHit(r.start, far, o.pts);
  return hit ? Math.hypot(hit.x - r.end.x, hit.y - r.end.y) : Infinity;
}
// How each act starts, as the site says: graph.containersStart (closed or
// open) for all of them, or else closed when graph.initialCollapsed names it.
const GSET = SETTINGS.graph || {};
const startsClosed = (id) => (GSET.containersStart === 'closed' ? true : GSET.containersStart === 'open' ? false
  : (GSET.initialCollapsed || []).includes(id));
// An act's centre: its closed node, or its title when it is open.
const centreOf = (a) => (a ? (a.closed ? a.centre : a.label) : null);
const off = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const anchorAt = (m, a) => artPoint(a.anchor, m.art);
const stray = (m) => Math.max(0, ...m.rootlets.map((r) => off(r.end, r.target)));
const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));

// Until every end is on its target, read twice in a row a few frames apart
// (a frame may not have been drawn yet when the input has just landed).
async function waitSettled(page, maxMs) {
  const t0 = Date.now();
  await page.waitForTimeout(120);
  let m = await measure(page), calm = 0;
  while (calm < 2 && Date.now() - t0 < maxMs) {
    calm = stray(m) <= 1 ? calm + 1 : 0;
    if (calm >= 2) break;
    await page.waitForTimeout(50);
    m = await measure(page);
  }
  return { m, ms: Date.now() - t0 };
}

async function drag(page, from, by, steps = 8) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) await page.mouse.move(from.x + (by.x * i) / steps, from.y + (by.y * i) / steps);
  await page.mouse.up();
}

async function shot(s, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await s.page.screenshot({ path: path.join(SHOTS, `${name}-${s.scheme}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
}

// Zoom the graph by the wheel at (x, y) until k reaches `ratio` times homeK.
async function zoomTo(s, ratio) {
  const at = { x: s.phone ? 195 : 640, y: s.phone ? 600 : 560 };
  await s.page.mouse.move(at.x, at.y);
  let m = await measure(s.page);
  for (let i = 0; i < 60 && m.k / m.homeK < ratio; i++) {
    await s.page.mouse.wheel(0, -40);
    await s.page.waitForTimeout(30);
    m = await measure(s.page);
  }
  for (let i = 0; i < 60 && m.k / m.homeK > ratio + 0.01 && ratio <= 1; i++) {
    await s.page.mouse.wheel(0, 20);
    await s.page.waitForTimeout(30);
    m = await measure(s.page);
  }
  await s.page.waitForTimeout(150);
  return measure(s.page);
}

function checkStopShort(m, ids) {
  const gaps = [];
  for (const r of m.rootlets) {
    if (ids && !ids.includes(r.c)) continue;
    const o = m.acts[r.c];
    if (o) gaps.push(gap(r, o));
  }
  return { ok: gaps.length > 0 && gaps.every((g) => Math.abs(g - REACH.stopShort) <= 2), gaps };
}

async function run(bt, name, size, record) {
  // ── light, fresh: anchors, draw-in, counts, stop short, zoom, pan, drag, reset, open ──
  {
    const s = await open(bt, name, size, { scheme: 'light' });
    const p = s.page;
    // Since T30 the graph hangs under the roots in the art state too, so the
    // rootlets first show there, on load, and draw in then. Since T32 a site
    // can keep them back until the first move (opening.graph.hiddenUntilMove):
    // then a 1 px wheel first, and they draw in from it.
    if (openingConfig(SETTINGS).graph.hiddenUntilMove) {
      await p.mouse.move(s.phone ? 195 : 640, s.phone ? 500 : 450);
      await p.mouse.wheel(0, 1);
      await p.waitForTimeout(350);
    }
    const first = await measure(p);
    const drawing = first.rootlets.filter((r) => r.visible);
    const dashes = drawing.map((r) => Number.parseFloat(r.dash)).filter(Number.isFinite);
    record('fresh: the rootlets draw in when they first show (in the art state, with the graph under the roots)', drawing.length > 0 && drawing.every((r) => r.drawn === 'drawing') && dashes.length > 0 && dashes.every((d) => d > 0.02 && d < 0.98),
      `${drawing.length} drawing, dash offsets ${Math.min(...dashes).toFixed(2)}–${Math.max(...dashes).toFixed(2)} of 1, ${REACH.drawMs} ms`);
    await toGraph(s);
    await p.waitForTimeout(REACH.drawMs + 250);
    const m = await measure(p);
    record('fresh: drawn in by drawMs', m.rootlets.length > 0 && m.rootlets.every((r) => r.drawn === 'drawn' && (r.dasharray === 'none' || r.dasharray === '')),
      `${m.rootlets.filter((r) => r.drawn === 'drawn').length} of ${m.rootlets.length} drawn`);

    const anchorOff = ACTS.map((a) => ({ id: a.id, closed: m.acts[a.id] && m.acts[a.id].closed, d: centreOf(m.acts[a.id]) ? off(centreOf(m.acts[a.id]), anchorAt(m, a)) : Infinity }));
    record('fresh: the acts start open or closed as the site says, each on its anchor', anchorOff.every((a) => a.closed === startsClosed(a.id) && a.d <= 2),
      anchorOff.map((a) => `${a.id.replace('container:', '')} ${a.closed ? 'closed' : 'open'} ${r1(a.d)} px off`).join(', '));
    record('fresh: the graph rests at the home view', Math.abs(m.k - m.homeK) < 1e-6, `k ${m.k}, homeK ${m.homeK}`);

    const counts = ACTS.map((a) => m.rootlets.filter((r) => r.c === a.id).length);
    record(`rootlets: each closed act reached from ${REACH.perContainer} tips, an open one from at least one`, ACTS.every((a, i) => (m.acts[a.id] && m.acts[a.id].closed ? counts[i] === REACH.perContainer : counts[i] >= 1)),
      ACTS.map((a, i) => `${a.id.replace('container:', '')} ${counts[i]} (tips ${m.rootlets.filter((r) => r.c === a.id).map((r) => r.tip).join(',')})`).join('; '));
    const starts = m.rootlets.map((r) => off(r.start, artPoint(REACH.tips[r.tip], m.art)));
    record('rootlets: each starts on its tip on the art', starts.every((d) => d < 0.6), `furthest ${r1(Math.max(...starts))} px`);
    const forked = m.rootlets.filter((r) => r.fine > 0).length;
    const wander = m.rootlets.map((r) => r.wander);
    // A fork needs room (reachPath leaves out one under 6 px), so a rootlet
    // of 60 px or more always forks; a shorter one may not. The wander is a
    // share of the length, so one under 20 px may stay within 0.5 px.
    const long = m.rootlets.filter((r) => off(r.start, r.end) >= 60);
    record('rootlets: seeded, forking, wandering lines, not straight strokes', m.rootlets.every((r) => r.pts > 8 && (r.wander > 0.5 || off(r.start, r.end) < 20)) && long.length > 0 && long.every((r) => r.fine > 0),
      `${Math.min(...m.rootlets.map((r) => r.pts))}+ points on each main line, off the straight line by ${r1(Math.min(...wander))}–${r1(Math.max(...wander))} px; ${forked} of ${m.rootlets.length} forked, every one of the ${long.length} of 60 px or more; lengths ${m.rootlets.map((r) => Math.round(off(r.start, r.end))).sort((a, b) => a - b).join(', ')} px`);
    const ss = checkStopShort(m);
    record(`rootlets: end ${REACH.stopShort} ± 2 px short of the act's outline`, ss.ok, `${ss.gaps.length} rootlets, gaps ${r1(Math.min(...ss.gaps))}–${r1(Math.max(...ss.gaps))} px`);
    record('the book\'s own title: hidden as set', m.bookLabel && m.bookLabel.pos === 'hidden' && m.bookLabel.display === 'none', m.bookLabel ? `labelPosition ${m.bookLabel.pos}, display ${m.bookLabel.display}` : 'no badge');
    const crown = m.art.top + CROWN * m.art.height;
    record('the cover\'s title at the crown', m.title && m.title.y < crown + 4 && crown - m.title.y < m.art.height * 0.08, m.title ? `title line bottom ${r1(m.title.y)}, crown ${r1(crown)}` : 'none');
    record('backdrop at the home view: roots, rootlets and the small plant at full strength', Math.abs(m.roots - BACKDROP.opacity) < 0.01 && Math.abs(m.layer - BACKDROP.opacity) < 0.01 && m.keep === 1,
      `roots ${m.roots}, rootlets ${m.layer}, small plant ${m.keep}`);
    await shot(s, 'closed');

    // A drag: the ends lag, then arrive within lagMs + 100 of the act's
    // last move. Timed in the page, frame by frame.
    const act = ACTS.find((x) => m.acts[x.id] && m.acts[x.id].closed) || ACTS[0];
    const c0 = m.acts[act.id].centre;
    await p.evaluate((id) => {
      const t0 = performance.now();
      const log = window.__lag = { lastMove: null, settled: null, behind: 0, frames: 0 };
      let prev = null;
      const tick = () => {
        const now = performance.now() - t0;
        const mm = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"] .container-macro-node`).getScreenCTM();
        const at = `${mm.e.toFixed(2)},${mm.f.toFixed(2)}`;
        if (prev !== null && at !== prev) { log.lastMove = now; log.settled = null; }
        prev = at;
        let worst = 0;
        for (const g of document.querySelectorAll(`[data-reach-container="${CSS.escape(id)}"]`)) {
          const n = (g.querySelector('.reach-main').getAttribute('d').match(/-?[\d.]+/g) || []).map(Number);
          const t = (g.getAttribute('data-target') || '').split(',').map(Number);
          if (n.length < 4 || !Number.isFinite(t[1]) || g.style.visibility === 'hidden') continue;
          worst = Math.max(worst, Math.hypot(n[n.length - 2] - t[0], n[n.length - 1] - t[1]));
        }
        if (log.lastMove !== null && now - log.lastMove < 20) log.behind = Math.max(log.behind, worst);
        if (log.lastMove !== null && log.settled === null && worst <= 0.5) log.settled = now;
        log.frames++;
        if (now < 3500) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, act.id);
    await drag(p, c0, { x: 50, y: 30 });
    await p.waitForTimeout(2600);
    const lag = await p.evaluate(() => window.__lag);
    const done = await measure(p);
    const moved = done.acts[act.id].centre;
    const took = lag.settled !== null && lag.lastMove !== null ? lag.settled - lag.lastMove : Infinity;
    const ssd = checkStopShort(done, [act.id]);
    record(`drag: the rootlets re-aim with a lag, arriving within lagMs + 100 (${REACH.lagMs + 100} ms) of the act's last move`, off(moved, c0) > 40 && lag.behind > 2 && took <= REACH.lagMs + 100 && ssd.ok,
      `${act.id.replace('container:', '')} moved ${r1(off(moved, c0))} px; the ends up to ${r1(lag.behind)} px behind as it stopped; on target ${Math.round(took)} ms after its last move; gaps ${ssd.gaps.map(r1).join(', ')}`);

    // A zoom: the targets move, the ends follow and stop short again.
    const before = await measure(p);
    const z = await zoomTo(s, 1.4);
    const zs = await waitSettled(p, 1500);
    const ssz = checkStopShort(zs.m);
    const targetsMoved = Math.max(...zs.m.rootlets.map((r) => { const b = before.rootlets.find((x) => x.key === r.key); return b ? off(b.target, r.target) : 0; }));
    record('zoom: the rootlets follow, still short of each act', z.k / z.homeK > 1.3 && targetsMoved > 5 && ssz.ok,
      `zoom ${r1(z.k / z.homeK)}x, targets moved up to ${r1(targetsMoved)} px, settled in ${zs.ms} ms, gaps ${r1(Math.min(...ssz.gaps))}–${r1(Math.max(...ssz.gaps))}`);

    // A pan on empty canvas.
    const bp = await measure(p);
    await drag(p, { x: s.phone ? 60 : 200, y: s.phone ? 690 : 640 }, { x: 70, y: -40 }, 6);
    const ps = await waitSettled(p, 1500);
    const ssp = checkStopShort(ps.m);
    const panned = Math.max(...ps.m.rootlets.map((r) => { const b = bp.rootlets.find((x) => x.key === r.key); return b ? off(b.target, r.target) : 0; }));
    record('pan: the rootlets follow, still short of each act', panned > 20 && ssp.ok,
      `targets moved up to ${r1(panned)} px, settled in ${ps.ms} ms, gaps ${r1(Math.min(...ssp.gaps))}–${r1(Math.max(...ssp.gaps))}`);
    record('pan and zoom: the cover\'s title has not moved', ps.m.title && Math.abs(ps.m.title.y - m.title.y) < 0.5 && Math.abs(ps.m.title.x - m.title.x) < 0.5,
      `${r1(m.title.x)},${r1(m.title.y)} → ${r1(ps.m.title.x)},${r1(ps.m.title.y)}`);

    // Reset: back on the anchors at the home view.
    await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
    await p.waitForTimeout(1300);
    const rs = (await waitSettled(p, 1500)).m;
    const back = ACTS.map((a) => (centreOf(rs.acts[a.id]) ? off(centreOf(rs.acts[a.id]), anchorAt(rs, a)) : Infinity));
    record('Reset: the acts back on their anchors, the view at home', back.every((d) => d <= 2) && Math.abs(rs.k - rs.homeK) < 1e-6, back.map(r1).join(', ') + ' px off; k ' + rs.k);

    // Zoom in: the roots and the rootlets fade to the floor; the plant stays.
    const z25 = await zoomTo(s, 2.5);
    record(`zoom in to ${BACKDROP.zoomForFloor}x: the roots and the rootlets fade to opacityZoomedIn, the small plant keeps its strength`,
      z25.k / z25.homeK >= BACKDROP.zoomForFloor - 0.01 && Math.abs(z25.roots - BACKDROP.opacityZoomedIn) < 0.02 && Math.abs(z25.layer - BACKDROP.opacityZoomedIn) < 0.02 && z25.keep === 1,
      `at 1x roots ${rs.roots}, rootlets ${rs.layer}, plant ${rs.keep}; at ${r1(z25.k / z25.homeK)}x roots ${r1(z25.roots)}, rootlets ${r1(z25.layer)}, plant ${z25.keep}`);
    const zo = await zoomTo(s, 1);
    record('zoom back out: the roots return', Math.abs(zo.roots - BACKDROP.opacity) < 0.02, `at ${(zo.k / zo.homeK).toFixed(2)}x roots ${zo.roots.toFixed(2)}`);

    // Open an act: in place, the rootlets reaching to its hull's near edge.
    await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
    await p.waitForTimeout(1200);
    // Act 1, closed first when the site starts it open, so it opens by a tap
    // as it did when every act started closed.
    const a1 = ACTS.find((a) => /act-1/.test(a.id)) || ACTS[0];
    if (!(await measure(p)).acts[a1.id].closed) {
      await p.evaluate((id) => window.dispatchEvent(new CustomEvent('graph:close-container', { detail: { id } })), a1.id);
      await p.waitForTimeout(1300);
      await waitSettled(p, 1500);
    }
    const pre = await measure(p);
    await p.mouse.click(pre.acts[a1.id].centre.x, pre.acts[a1.id].centre.y);
    await p.waitForTimeout(1300);
    const op = (await waitSettled(p, 1500)).m;
    const o = op.acts[a1.id];
    const inPlace = o && !o.closed && o.label ? off(o.label, anchorAt(op, a1)) : Infinity;
    const sso = checkStopShort(op, [a1.id]);
    const n1 = op.rootlets.filter((r) => r.c === a1.id).length;
    record('open: the act opens in place, its title on its anchor', inPlace <= 3, `${a1.id.replace('container:', '')} title ${r1(inPlace)} px from its anchor`);
    record('open: the rootlets reach to the open hull\'s near edge, stopping short', n1 >= 1 && sso.ok, `${n1} rootlets, gaps ${sso.gaps.map(r1).join(', ')}`);
    for (const a of ACTS) if (a.id !== a1.id) await p.evaluate((id) => window.dispatchEvent(new CustomEvent('graph:open-container', { detail: { id } })), a.id);
    await p.waitForTimeout(1500);
    await shot(s, 'open');
    record('light run: nothing fetched from elsewhere, no page errors', s.outside.length === 0 && s.errors.length === 0, `${s.outside.length} outside, ${s.errors.length} errors${s.errors.length ? ': ' + s.errors.slice(0, 2).join(' | ') : ''}`);
    await s.browser.close();
  }

  // ── dark: screenshots, saved positions ──
  {
    const s = await open(bt, name, size, { scheme: 'dark' });
    const p = s.page;
    await toGraph(s);
    await p.waitForTimeout(REACH.drawMs + 200);
    await shot(s, 'closed');
    const m = await measure(p);
    const a3 = ACTS.find((a) => /act-3/.test(a.id) && m.acts[a.id].closed) || ACTS.find((a) => m.acts[a.id].closed) || ACTS[ACTS.length - 1];
    const c0 = m.acts[a3.id].centre;
    await drag(p, c0, { x: 40, y: 30 });
    await p.waitForTimeout(800);
    const dragged = (await measure(p)).acts[a3.id].centre;
    await p.reload();
    await p.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame && window.PostPipeGraphWorld, null, { timeout: 10000 });
    await p.waitForTimeout(500);
    await toGraph(s);
    await p.waitForTimeout(600);
    const r = await measure(p);
    const kept = off(r.acts[a3.id].centre, dragged);
    const others = ACTS.filter((a) => a.id !== a3.id).map((a) => off(centreOf(r.acts[a.id]), anchorAt(r, a)));
    record('saved positions: a dragged act comes back where the reader left it, the others on their anchors', kept <= 3 && others.every((d) => d <= 3),
      `${a3.id.replace('container:', '')} ${r1(kept)} px from where it was left (${r1(off(dragged, c0))} px from its anchor); others ${others.map(r1).join(', ')} px off`);
    await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
    await p.waitForTimeout(1200);
    for (const a of ACTS) await p.evaluate((id) => window.dispatchEvent(new CustomEvent('graph:open-container', { detail: { id } })), a.id);
    await p.waitForTimeout(1600);
    await shot(s, 'open');
    record('dark run: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── reduced motion: no drawing in, no lag ──
  {
    const s = await open(bt, name, size, { reduced: true });
    const p = s.page;
    await p.keyboard.press('ArrowDown');
    await p.waitForTimeout(450);
    const m = await measure(p);
    record('reduced motion: the rootlets are there at once, not drawn in', m.rootlets.length > 0 && m.rootlets.every((r) => r.drawn === 'drawn' && r.visible && (r.dasharray === 'none' || r.dasharray === '')),
      `${m.rootlets.length} rootlets, ${m.rootlets.filter((r) => r.drawn === 'drawn').length} drawn at once`);
    const a = ACTS.filter((x) => m.acts[x.id] && m.acts[x.id].closed)[1] || ACTS[1] || ACTS[0];
    await drag(p, m.acts[a.id].centre, { x: -40, y: 25 });
    await p.waitForTimeout(60);
    const j = await measure(p);
    record('reduced motion: the rootlets re-aim with no lag', stray(j) <= 1 && checkStopShort(j, [a.id]).ok, `60 ms after the drag, ends ${r1(stray(j))} px from their targets`);
    record('reduced motion: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── the alternative: the book's title at the top of its hull ──
  {
    const variant = async (ctx) => {
      await ctx.route('**/*', async (route) => {
        const url = route.request().url();
        if (url === BASE || url.endsWith('/index.html')) {
          const resp = await route.fetch();
          let body = await resp.text();
          body = body.replace(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/, (all, json) => {
            const st = JSON.parse(json);
            st.opening.title.hideGraphTitle = false;
            st.containers[BOOK] = { ...(st.containers[BOOK] || {}), labelPosition: 'top' };
            return `window.SETTINGS = ${JSON.stringify(st)};\n</script>`;
          });
          body = body.replace(/"labelPosition":\s*"hidden"/g, '"labelPosition":"top"');
          return route.fulfill({ response: resp, body });
        }
        if (/feed\.json(\?|$)/.test(url)) {
          const resp = await route.fetch();
          const feed = await resp.json();
          for (const c of feed.containers || []) if (c.id === BOOK) c.labelPosition = 'top';
          return route.fulfill({ response: resp, json: feed });
        }
        return route.continue();
      });
    };
    const s = await open(bt, name, size, { variant });
    const p = s.page;
    await toGraph(s);
    await p.waitForTimeout(800);
    const m = await measure(p);
    const L = m.bookLabel;
    const hullTop = Math.min(...m.book.pts.map((q) => q.y));
    const xs = m.book.pts.map((q) => q.x);
    const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
    const ok = L && L.pos === 'top' && L.display !== 'none' && L.vis === 'visible' && L.box[1] >= hullTop - 1 && L.box[1] - hullTop < 80 && Math.abs((L.box[0] + L.box[2]) / 2 - mid) < 4;
    record('alternative: labelPosition top puts the book\'s title at the top of its hull, centred', ok,
      L ? `title ${L.box.map(Math.round).join(',')} under the hull's top ${r1(hullTop)}, centre ${r1((L.box[0] + L.box[2]) / 2)} of ${r1(mid)}` : 'no badge');
    if (s.scheme === 'light') await shot(s, 'top-label');
    record('alternative: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
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
    for (const size of ['desktop', 'phone']) {
      const label = `${name} ${size === 'phone' ? '390x844' : '1280x800'}`;
      const rec = (check, ok, note = '') => { results.push({ run: label, check, ok, note }); console.log(`${ok ? 'PASS' : 'FAIL'}  [${label}] ${check}${note ? ' — ' + note : ''}`); };
      try {
        await run(bt, name, size, rec);
        runs.push({ label, ran: true });
      } catch (e) {
        const msg = String(e.message || e).split('\n')[0] + ' @' + ((String(e.stack).match(/t27_checks\.js:(\d+)/) || [])[1] || '?');
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

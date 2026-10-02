// Browser checks for the golden spirals on the root tips and the zoom about
// the roots (graph.spiral anchorEnd outer, openTowards, keepBelow crown,
// cardScale; graph.zoomPivot art, opening.zoomPivot, opening.crownY), on a
// built site, in the graph state after one scroll:
//   - the fresh default: the three acts closed, each a pill on its tip, all
//     on the screen, nothing above the crown, no book hull;
//   - Act 1 open (the others closed): its last chapter within 8 px of its
//     tip, chapter one below it and the spiral opening down, no card, hull
//     point or title above the crown, its hull 0.45 to 0.65 of the roots'
//     width, its cards apart and titled, all three acts on the screen;
//   - Act 2 and Act 3 open on their own: the same, opening down-right and
//     down-left;
//   - every act open, for the composite;
//   - the zoom: ten wheel steps in at the screen's corner (desktop), a pinch
//     (phone), the + key, Zoom to fit, and Reset all keep the graph's point
//     under the pivot within 2 px of it; the crown on the art does not move;
//     the closed pills stay on the screen.
// The roots' width is the span of the root tips the site names
// (opening.reach.tips), where the rootlets start: 0.828 of the art's width.
// Chromium and WebKit, desktop (1280x800) and phone (390x844). A screenshot
// per state, size and engine goes to PP_E2E_SHOTS when set, with a
// composite per size of each mockup beside the preview at the mockup's
// scale (see MOCK_SIDE_GAP).
//
//   node test/e2e/t34_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { artPoint } = require('../../src/lib/reach');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39464;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const GS = SETTINGS.graph || {};
const OPENING = SETTINGS.opening || {};
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const MOCKUPS = path.resolve(__dirname, '../../_handoff');
const CONTAINERS = SETTINGS.containers || {};
const towardsOf = (c) => (c.spiral && c.spiral.openTowards) || (GS.spiral && GS.spiral.openTowards) || 'down';
const ACTS = Object.entries(CONTAINERS)
  .filter(([id, c]) => id.startsWith('container:') && c && c.anchor)
  .map(([id, c]) => ({ id, anchor: c.anchor, towards: towardsOf(c), name: id.replace('container:', '') }));
const MIDDLE = ACTS.find((a) => a.towards === 'down');
const SIDES = ACTS.filter((a) => a !== MIDDLE);
const BOOK = (SETTINGS.containment || []).find((c) => !c.parent).id;
const CROWN = OPENING.crownY;
const PIVOT = OPENING.zoomPivot;
const TIPS = ((OPENING.reach && OPENING.reach.tips) || []).map((t) => t.x);
const ROOTS = Math.max(...TIPS) - Math.min(...TIPS);
const ANGLE = { down: 90, 'down-right': 45, 'down-left': 135 };
const actOfCard = (id) => { const m = /-a(\d+)-/.exec(id); return m ? `container:act-${m[1]}` : null; };

if (!MIDDLE || SIDES.length !== 2 || !GS.spiral || GS.spiral.anchorEnd !== 'outer' || GS.zoomPivot !== 'art' || !Number.isFinite(CROWN) || !PIVOT || !TIPS.length) {
  console.error('this site does not set the spiral on its tips (graph.spiral.anchorEnd outer, one act down and two at the sides), graph.zoomPivot art, opening.crownY, opening.zoomPivot and opening.reach.tips; nothing to check');
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
  await page.waitForTimeout(500);
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

// One scroll down, as a reader would: the acts come in and the page moves to
// the graph state.
async function scrollOnce(s) {
  await s.page.mouse.move(s.phone ? 195 : 640, s.phone ? 420 : 400);
  await s.page.mouse.wheel(0, 120);
  await s.page.waitForFunction(() => window.PostPipeCover.state === 'graph', null, { timeout: 5000 }).catch(() => {});
  await s.page.waitForTimeout(1600);
}

// Everything measured at once, in screen px.
const measure = (page, { acts, book }) => page.evaluate(({ acts, book }) => {
  const art = document.querySelector('[data-cover-art]').getBoundingClientRect();
  const outline = (path) => {
    const m = path.getScreenCTM();
    const len = path.getTotalLength();
    const pts = [];
    for (let i = 0; i < 240; i++) {
      const q = path.getPointAtLength((len * i) / 240);
      pts.push({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f });
    }
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return { pts, x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  };
  const group = (id) => document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
  const act = (id) => {
    const g = group(id);
    if (!g || getComputedStyle(g).display === 'none') return null;
    const macro = g.querySelector('.container-macro-node');
    const closed = !!macro && getComputedStyle(macro).display !== 'none';
    const hullEl = g.querySelector('.container-hull');
    const hull = !closed && hullEl && getComputedStyle(hullEl).display !== 'none' && (hullEl.getAttribute('d') || '').length ? outline(hullEl) : null;
    let pill = null;
    if (closed) {
      const o = outline(macro.querySelector('.container-macro-bg'));
      const mm = macro.getScreenCTM();
      pill = { ...o, centre: { x: mm.e, y: mm.f } };
    }
    const badge = g.querySelector('.container-badge');
    let label = null;
    if (!closed && badge && getComputedStyle(badge).display !== 'none') {
      const r = badge.querySelector('.container-badge-text').getBoundingClientRect();
      if (r.width && r.height) label = { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom };
    }
    return { closed, hull, pill, label };
  };
  const cards = [...document.querySelectorAll('.node-card')]
    .filter((c) => getComputedStyle(c).display !== 'none' && c.__data__)
    .map((c) => {
      const d = c.__data__;
      const r = (c.firstElementChild || c).getBoundingClientRect();
      const title = (d.originalItem && d.originalItem.title) || d.title || '';
      let titleH = 0;
      const els = [...c.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim() && title.startsWith(e.textContent.trim().slice(0, 4)));
      if (els.length) {
        const range = document.createRange();
        range.selectNodeContents(els[0]);
        titleH = range.getBoundingClientRect().height;
        if (getComputedStyle(els[0]).visibility === 'hidden' || Number(getComputedStyle(els[0]).opacity) === 0) titleH = 0;
      }
      return { id: d.id, order: d.series_part, title, titleH, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, w: r.width, h: r.height };
    })
    .filter((c) => c.w > 0 && c.h > 0);
  const bookG = group(book);
  const bookHull = bookG && bookG.querySelector('.container-hull');
  const w = window.PostPipeGraphWorld.snapshot();
  return {
    W: innerWidth, H: innerHeight,
    art: { left: art.left, top: art.top, width: art.width, height: art.height },
    acts: Object.fromEntries(acts.map((a) => [a.id, act(a.id)])),
    cards,
    bookHullDrawn: !!(bookHull && getComputedStyle(bookHull).display !== 'none' && (bookHull.getAttribute('d') || '').length),
    k: w.k, homeK: w.homeK, state: window.PostPipeCover.state,
  };
}, { acts, book });

// The view as drawn, and the graph's point under the pivot: where it is in
// the graph's world, and where that point is on the screen.
const pivotView = (page, pivot) => page.evaluate((pivot) => {
  const f = window.PostPipeCoverFrame;
  const s = { x: f.art.left + pivot.x * f.art.width, y: f.art.top + pivot.y * f.art.height };
  const ct = document.querySelector('.cards-transform');
  const m = /translate3d\(([-\d.e]+)px, ([-\d.e]+)px/.exec(ct.style.transform);
  const k = /scale\(([-\d.e]+)\)/.exec(ct.style.transform);
  const r = ct.parentElement.getBoundingClientRect();
  const v = { x: +m[1], y: +m[2], k: +k[1] };
  return { s, v, r: { left: r.left, top: r.top }, w: { x: (s.x - r.left - v.x) / v.k, y: (s.y - r.top - v.y) / v.k } };
}, pivot);
// How far (screen px) the world point that was under the pivot has moved.
const drift = (before, after) => Math.hypot(after.r.left + after.v.x + before.w.x * after.v.k - before.s.x, after.r.top + after.v.y + before.w.y * after.v.k - before.s.y);

// A point moved from `at` only along the way an act opens (within 2 px of
// that line, and forward).
function pushedAlong(p, at, towards) {
  const d = { down: [0, 1], 'down-right': [Math.SQRT1_2, Math.SQRT1_2], 'down-left': [-Math.SQRT1_2, Math.SQRT1_2] }[towards] || [0, 1];
  const dx = p.x - at.x, dy = p.y - at.y;
  return Math.abs(dx * d[1] - dy * d[0]) <= 2 && dx * d[0] + dy * d[1] > 0;
}
// Since T35 the acts sit where Harold's iPhone mockup draws them, and it
// draws Act Two cut by the screen's left edge and Act Three at its right:
// a closed pill at rest counts as on the screen with at most a third of
// its width past an edge. (Zooming in keeps the stricter rule.)
const pillOnScreen = (o, m) => { const w = o.x1 - o.x0; return o.x0 >= -w / 3 && o.y0 >= -0.5 && o.x1 <= m.W + w / 3 && o.y1 <= m.H + 0.5; };

const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const boxesMeet = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const onScreen = (o, m) => o.x0 >= -0.5 && o.y0 >= -0.5 && o.x1 <= m.W + 0.5 && o.y1 <= m.H + 0.5;
const deg = (from, to) => (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

async function shot(s, state) {
  if (!SHOTS) return null;
  fs.mkdirSync(SHOTS, { recursive: true });
  const file = path.join(SHOTS, `${state}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`);
  await s.page.screenshot({ path: file });
  return file;
}

// Nothing of the graph above the crown, and no book hull.
function checkAll(record, tag, m) {
  const crown = m.art.top + CROWN * m.art.height;
  record(`${tag}: in the graph state`, m.state === 'graph', m.state);
  record(`${tag}: no book hull drawn`, !m.bookHullDrawn);
  const above = [];
  for (const c of m.cards) if (c.y0 < crown - 0.5) above.push(`card ${c.id} at ${r1(c.y0)}`);
  for (const [id, a] of Object.entries(m.acts)) {
    if (!a) continue;
    const o = a.hull || a.pill;
    if (o && o.y0 < crown - 0.5) above.push(`${id} at ${r1(o.y0)}`);
    if (a.label && a.label.y0 < crown - 0.5) above.push(`${id} title at ${r1(a.label.y0)}`);
  }
  record(`${tag}: no card, hull point, pill or title above the crown`, above.length === 0, above.length ? above.join(', ') : `crown at ${r1(crown)}`);
}

// A closed act: its pill centred on its tip.
function checkPill(record, tag, m, act) {
  const a = m.acts[act.id];
  const at = artPoint(act.anchor, m.art);
  if (!a || !a.pill) { record(`${tag}: ${act.name} closed, a pill`, false, a ? 'open' : 'not drawn'); return; }
  const c = a.pill.centre;
  record(`${tag}: ${act.name}'s pill on its tip`, Math.hypot(c.x - at.x, c.y - at.y) <= 4, `centre ${r1(c.x)}, ${r1(c.y)}; tip ${r1(at.x)}, ${r1(at.y)}`);
}

// An open act: its last chapter on its tip, its spiral opening toward its
// side, its cards apart and titled, inside its hull.
function checkOpen(record, tag, m, act) {
  const a = m.acts[act.id];
  const at = artPoint(act.anchor, m.art);
  if (!a || !a.hull) { record(`${tag}: ${act.name} open with its hull`, false, 'no hull'); return null; }
  const cards = m.cards.filter((c) => actOfCard(c.id) === act.id).sort((p, q) => p.order - q.order);
  const first = cards[0], last = cards[cards.length - 1];
  // Since T35 an open act that would meet a closed one is pushed the way it
  // opens until clear (open acts never overlap).
  const pushed = pushedAlong(last, at, act.towards);
  record(`${tag}: ${act.name}'s last chapter within 8 px of its tip, or pushed the way it opens`, Math.hypot(last.x - at.x, last.y - at.y) <= 8 || pushed,
    `last (${last.order}) at ${r1(last.x)}, ${r1(last.y)}; tip ${r1(at.x)}, ${r1(at.y)}; off ${r1(Math.hypot(last.x - at.x, last.y - at.y))}${pushed ? ', along its way' : ''}`);
  record(`${tag}: ${act.name}'s chapter one below its last`, first.y > last.y + first.h / 2, `chapter one at ${r1(first.y)}, last at ${r1(last.y)}`);
  const angle = deg(last, first);
  record(`${tag}: ${act.name}'s spiral opens ${act.towards} (chapter one from the last within 10 degrees of ${ANGLE[act.towards]})`,
    Math.abs(angle - ANGLE[act.towards]) <= 10, `${r1(angle)} degrees`);
  const overlaps = [];
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) if (boxesMeet(cards[i], cards[j])) overlaps.push(`${cards[i].order}/${cards[j].order}`);
  record(`${tag}: no two of ${act.name}'s ${cards.length} cards overlap`, cards.length > 1 && overlaps.length === 0, overlaps.join(', '));
  const untitled = cards.filter((c) => !(c.titleH > 0));
  record(`${tag}: every one of ${act.name}'s cards keeps its title as text`, untitled.length === 0,
    untitled.length ? untitled.map((c) => c.order).join(', ') : `titles ${r1(Math.min(...cards.map((c) => c.titleH)))} px tall or more`);
  return { a, cards };
}

async function setOpen(p, ids) {
  await p.evaluate(() => window.PostPipeGraph.closeAllContainers());
  await p.waitForTimeout(300);
  for (const id of ids) await p.evaluate((id) => window.dispatchEvent(new CustomEvent('graph:open-container', { detail: { id } })), id);
  await p.waitForTimeout(1500);
}

async function run(bt, name, size, record, shots) {
  const s = await open(bt, name, size);
  const p = s.page;
  await scrollOnce(s);
  const tagOf = (state) => `${name} ${size} ${state}`;
  const roots = (m) => ROOTS * m.art.width;

  // The fresh default: every act closed, on its tip.
  let m = await measure(p, { acts: ACTS, book: BOOK });
  let tag = tagOf('default');
  checkAll(record, tag, m);
  for (const a of ACTS) checkPill(record, tag, m, a);
  const offPills = ACTS.filter((a) => !(m.acts[a.id] && m.acts[a.id].pill && pillOnScreen(m.acts[a.id].pill, m)));
  record(`${tag}: the three pills on the screen`, offPills.length === 0, offPills.map((a) => a.name).join(', '));
  record(`${tag}: no chapter cards`, m.cards.length === 0, `${m.cards.length} shown`);
  shots.closed = await shot(s, 'default-closed');
  shots.closedArt = m.art;
  const home = await pivotView(p, PIVOT);

  // Each act open on its own.
  for (const act of [MIDDLE, ...SIDES]) {
    await setOpen(p, [act.id]);
    m = await measure(p, { acts: ACTS, book: BOOK });
    tag = tagOf(`${act.name} open`);
    checkAll(record, tag, m);
    const res = checkOpen(record, tag, m, act);
    for (const other of ACTS) if (other !== act) checkPill(record, tag, m, other);
    const pillsOn = ACTS.filter((o) => o !== act).every((o) => m.acts[o.id] && m.acts[o.id].pill && pillOnScreen(m.acts[o.id].pill, m));
    if (res && act === MIDDLE) {
      const ratio = (res.a.hull.x1 - res.a.hull.x0) / roots(m);
      record(`${tag}: Act 1's hull 0.45 to 0.65 of the roots' width`, ratio >= 0.45 && ratio <= 0.65,
        `${r1(res.a.hull.x1 - res.a.hull.x0)} px of ${r1(roots(m))}: ${ratio.toFixed(3)}`);
      const cw = res.cards.reduce((t, c) => t + c.w, 0) / res.cards.length;
      record(`${tag}: Act 1's cards about 0.12 of the roots' width (0.09 to 0.15)`, cw / roots(m) >= 0.09 && cw / roots(m) <= 0.15, `${r1(cw)} px: ${(cw / roots(m)).toFixed(3)}`);
      record(`${tag}: all three acts on the screen (Act 1's hull and both pills)`, onScreen(res.a.hull, m) && pillsOn,
        `hull ${r1(res.a.hull.x0)}..${r1(res.a.hull.x1)} x ${r1(res.a.hull.y0)}..${r1(res.a.hull.y1)}`);
      shots.act1 = await shot(s, 'act-1-open');
    } else if (res) {
      // A side act opens outward from a tip near the screen's edge on a
      // phone, so there it is checked to start on the screen (its last
      // chapter wholly on it), and how much runs off is reported.
      const lastOn = onScreen(res.cards[res.cards.length - 1], m);
      const hullOn = onScreen(res.a.hull, m);
      const off = Math.max(0, -res.a.hull.x0, res.a.hull.x1 - m.W);
      if (s.phone) {
        record(`${tag}: ${act.name} on the screen at its tip (its last chapter wholly on it) and the other pills on it`, lastOn && pillsOn,
          `hull ${r1(res.a.hull.x0)}..${r1(res.a.hull.x1)}, ${r1(off)} px of it past the edge`);
      } else {
        record(`${tag}: all three acts on the screen (${act.name}'s hull and both pills)`, hullOn && pillsOn,
          `hull ${r1(res.a.hull.x0)}..${r1(res.a.hull.x1)} x ${r1(res.a.hull.y0)}..${r1(res.a.hull.y1)}`);
      }
      const ratio = (res.a.hull.x1 - res.a.hull.x0) / roots(m);
      console.log(`      ${act.name}'s hull ${ratio.toFixed(3)} of the roots' width`);
      shots[act.name] = await shot(s, `${act.name}-open`);
    }
  }

  // Every act open, for the composite.
  await setOpen(p, ACTS.map((a) => a.id));
  m = await measure(p, { acts: ACTS, book: BOOK });
  tag = tagOf('all open');
  checkAll(record, tag, m);
  for (const act of ACTS) {
    const a = m.acts[act.id];
    const cards = m.cards.filter((c) => actOfCard(c.id) === act.id).sort((q, r) => q.order - r.order);
    const at = artPoint(act.anchor, m.art);
    const last = cards[cards.length - 1];
    // Since T35 open acts never overlap: with every act open, one that
    // would meet another is pushed the way it opens, so its last chapter is
    // on its tip or straight along openTowards from it.
    const pushed = last && pushedAlong(last, at, act.towards);
    record(`${tag}: ${act.name}'s last chapter within 8 px of its tip, or pushed the way it opens`, !!(a && a.hull && last) && (Math.hypot(last.x - at.x, last.y - at.y) <= 8 || pushed),
      last ? `off ${r1(Math.hypot(last.x - at.x, last.y - at.y))}${pushed ? ', along its way' : ''}` : 'no cards');
  }
  shots.open = await shot(s, 'all-open');
  shots.openArt = m.art;

  // The zoom, from every act closed at the home view.
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
  await p.waitForTimeout(1500);
  const reset = await pivotView(p, PIVOT);
  record(`${tagOf('zoom')}: Reset comes back to the first frame (the same zoom, the pivot's point under it)`,
    Math.abs(reset.v.k - home.v.k) < 1e-6 && drift(home, reset) <= 2, `zoom ${r1(reset.v.k)} against ${r1(home.v.k)}, moved ${r1(drift(home, reset))} px`);
  // Since T36 (graph.zoomMode grow-in-place) a zoom grows each pill about
  // its own tip instead of moving it: a pill at the screen's edge then
  // reaches past it while its tip stays on the art. There a pill is on the
  // screen when its centre is; the T36 checks hold the tips to 2 px.
  const GROW = GS.zoomMode === 'grow-in-place';
  const pillShown = (o, mm) => (GROW
    ? (o.x0 + o.x1) / 2 >= 0 && (o.x0 + o.x1) / 2 <= mm.W && (o.y0 + o.y1) / 2 >= 0 && (o.y0 + o.y1) / 2 <= mm.H
    : onScreen(o, mm));
  const pills = async () => {
    const mm = await measure(p, { acts: ACTS, book: BOOK });
    return { mm, off: ACTS.filter((a) => !(mm.acts[a.id] && mm.acts[a.id].pill && pillShown(mm.acts[a.id].pill, mm))).map((a) => a.name) };
  };
  const crownAt = (mm) => mm.art.top + CROWN * mm.art.height;
  const m0 = await measure(p, { acts: ACTS, book: BOOK });
  // One zoom: what it did to the pivot's point, the crown and the pills.
  const zoomCheck = async (label, act, { wantRatio, pillsCheck = 'all' }) => {
    const b = await pivotView(p, PIVOT);
    await act();
    await p.waitForTimeout(700);
    const a = await pivotView(p, PIVOT);
    const { mm, off } = await pills();
    const ratio = a.v.k / b.v.k;
    record(`${tagOf('zoom')}: ${label} zooms in about the roots' middle (the graph's point under the pivot moves under 2 px)`,
      // Growing in place, a zoom in stops where two acts would come within
      // 16 px (the T36 checks measure where): here only that it zoomed in.
      ratio >= (GROW ? Math.min(wantRatio, 1.2) : wantRatio) && drift(b, a) <= 2, `zoom ${r1(ratio)}x, moved ${r1(drift(b, a))} px`);
    record(`${tagOf('zoom')}: ${label}: the crown on the art stays where it was (within 2 px)`, Math.abs(crownAt(mm) - crownAt(m0)) <= 2
      && Math.abs(mm.art.left - m0.art.left) <= 2, `crown at ${r1(crownAt(mm))}, was ${r1(crownAt(m0))}`);
    if (pillsCheck === 'all' || GROW) record(`${tagOf('zoom')}: ${label}: every closed pill on the screen${GROW ? ' (its centre, on its tip)' : ''}`, off.length === 0, off.length ? `off: ${off.join(', ')}` : `at ${r1(ratio)}x`);
    else console.log(`      ${label}: at ${r1(ratio)}x, pills off the screen: ${off.length ? off.join(', ') : 'none'}`);
    return { b, a, mm };
  };
  const toHome = async () => { await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all'))); await p.waitForTimeout(1500); };

  // Ten wheel steps in, at the screen's corner. On a phone a 4x zoom about
  // any one point cannot keep pills that span 0.78 of the screen's width on
  // it, so there the pills are reported, not checked (the pinch below is).
  await p.mouse.move(m0.W - 10, m0.H - 10);
  await zoomCheck('ten wheel steps at the screen\'s corner', async () => {
    for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, -100); await p.waitForTimeout(60); }
  }, { wantRatio: 3.5, pillsCheck: s.phone ? 'report' : 'all' });
  if (!s.phone) shots.zoomed = await shot(s, 'zoom-ten-wheel-steps');
  await toHome();

  // The + key: six presses on a desktop (1.25 each, 3.8x), one on a phone.
  await zoomCheck(s.phone ? 'the + key' : 'the + key six times', async () => {
    for (let i = 0; i < (s.phone ? 1 : 6); i++) { await p.keyboard.press('='); await p.waitForTimeout(320); }
  }, { wantRatio: s.phone ? 1.2 : 3.5 });
  await toHome();

  if (s.phone) {
    // A pinch, the fingers low on the left, away from the pivot, spread
    // 1.25 times apart.
    const at = { x: 90, y: m0.H - 160 };
    await zoomCheck('a pinch low on the left', () => p.evaluate(async ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      let d = 64;
      el.dispatchEvent(window.__touchEvent('touchstart', el, [[x - d / 2, y], [x + d / 2, y]]));
      for (let i = 0; i < 8; i += 1) {
        d += 2;
        await new Promise((r) => setTimeout(r, 30));
        el.dispatchEvent(window.__touchEvent('touchmove', el, [[x - d / 2, y], [x + d / 2, y]]));
      }
      el.dispatchEvent(window.__touchEvent('touchend', el, [], [[x - d / 2, y], [x + d / 2, y]]));
    }, at), { wantRatio: 1.2 });
    await toHome();
  }

  // Zoom to fit, from a zoom in: about the pivot too.
  await p.keyboard.press('='); await p.waitForTimeout(400);
  await p.keyboard.press('='); await p.waitForTimeout(400);
  const bf = await pivotView(p, PIVOT);
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:zoom-to-fit')));
  await p.waitForTimeout(1000);
  const af = await pivotView(p, PIVOT);
  record(`${tagOf('zoom')}: Zoom to fit zooms about the roots' middle`, drift(bf, af) <= 2 && Math.abs(af.v.k - bf.v.k) > 1e-6,
    `zoom ${r1(af.v.k / bf.v.k)}x, moved ${r1(drift(bf, af))} px`);

  // Reset from there, part way through and at the end: the pivot's point stays.
  const br = await pivotView(p, PIVOT);
  await p.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
  await p.waitForTimeout(330);
  const mid = await pivotView(p, PIVOT);
  await p.waitForTimeout(1200);
  const ar = await pivotView(p, PIVOT);
  record(`${tagOf('zoom')}: Reset zooms back about the roots' middle, all the way`, drift(br, mid) <= 2 && drift(br, ar) <= 2 && Math.abs(ar.v.k - home.v.k) < 1e-6,
    `part way at ${r1(mid.v.k)}: moved ${r1(drift(br, mid))} px; at the end ${r1(drift(br, ar))} px, zoom ${r1(ar.v.k)}`);

  // A pan still moves the view.
  const bp = await pivotView(p, PIVOT);
  const from = { x: s.phone ? 60 : 200, y: m0.H - 120 };
  if (s.phone) {
    await p.evaluate(async ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      el.dispatchEvent(window.__touchEvent('touchstart', el, [[x, y]]));
      for (let i = 1; i <= 8; i += 1) {
        await new Promise((r) => setTimeout(r, 20));
        el.dispatchEvent(window.__touchEvent('touchmove', el, [[x + i * 5, y - i * 5]]));
      }
      el.dispatchEvent(window.__touchEvent('touchend', el, [], [[x + 40, y - 40]]));
    }, from);
  } else {
    await p.mouse.move(from.x, from.y);
    await p.mouse.down();
    for (let i = 1; i <= 8; i += 1) await p.mouse.move(from.x + i * 5, from.y - i * 5);
    await p.mouse.up();
  }
  await p.waitForTimeout(500);
  const ap = await pivotView(p, PIVOT);
  record(`${tagOf('zoom')}: a drag still pans the view, at the same zoom`, Math.abs(ap.v.k - bp.v.k) < 1e-6 && Math.hypot(ap.v.x - bp.v.x, ap.v.y - bp.v.y) > 20,
    `moved ${r1(ap.v.x - bp.v.x)}, ${r1(ap.v.y - bp.v.y)}`);

  record(`${name} ${size}: no page errors`, s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// Each mockup beside the preview at the mockup's scale. The closed mockup's
// side pills sit on the outer tips, their centres 370.5 px apart (x 153.5 and
// 524 of its 708); the preview's side anchors are (x2 - x3) of the art's
// width apart, so the preview is scaled to make those the same. The open
// mockup is drawn at the same scale as the closed one: the red drop and the
// stem are 230.5 px apart across it (x 158.5 and 389) and 230 across the
// closed one (117.5 and 347.5), so the same scale serves both.
const MOCK_SIDE_GAP = 370.5;
async function composite(size, shots) {
  if (!SHOTS) return;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } });
  const b64 = (f) => fs.readFileSync(f).toString('base64');
  for (const [state, mock, file, art] of [
    ['open', 'T27-mockup-open-containers-cards.png', shots.open, shots.openArt],
    ['closed', 'T27-mockup-closed-containers.png', shots.closed, shots.closedArt],
  ]) {
    if (!file || !art) continue;
    const out = path.join(SHOTS, `composite-${state}-${size}.png`);
    const sides = SIDES.map((x) => x.anchor.x);
    const gapPx = Math.abs(sides[0] - sides[1]) * art.width;
    const scale = MOCK_SIDE_GAP / gapPx;
    const info = await page.evaluate(async ({ mock, prev, scale, note }) => {
      const load = async (src) => { const i = new Image(); i.src = src; await i.decode(); return i; };
      const mi = await load('data:image/png;base64,' + mock);
      const pi = await load('data:image/png;base64,' + prev);
      const ph = pi.height * scale, pw = pi.width * scale;
      const H = Math.max(mi.height, ph) + 40;
      const c = document.createElement('canvas'); c.width = mi.width + pw + 60; c.height = H;
      const x = c.getContext('2d');
      x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
      x.drawImage(mi, 20, 30);
      x.drawImage(pi, mi.width + 40, 30, pw, ph);
      x.fillStyle = '#ddd'; x.font = '14px sans-serif';
      x.fillText('mockup', 20, 20);
      x.fillText(note, mi.width + 40, 20);
      return { url: c.toDataURL('image/png') };
    }, { mock: b64(path.join(MOCKUPS, mock)), prev: b64(file), scale, note: `preview, scaled ${scale.toFixed(3)} to the mockup's scale` });
    fs.writeFileSync(out, Buffer.from(info.url.split(',')[1], 'base64'));
    console.log(`composite ${state} ${size}: the preview's side anchors ${gapPx.toFixed(1)} px apart, scaled ${scale.toFixed(3)} -> ${path.relative(process.cwd(), out)}`);
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
  for (const [size, shots] of Object.entries(forComposite)) await composite(size, shots);
  server.close();
  console.log('\nsummary');
  for (const [k, t] of Object.entries(tally)) console.log(`  ${k}: ${t.notRun ? 'NOT RUN' : `${t.pass} pass, ${t.fail} fail`}`);
  const failed = results.filter((r) => !r.ok).length;
  const notRun = Object.values(tally).filter((t) => t.notRun).length;
  console.log(`\n${results.length - failed} PASS, ${failed} FAIL${notRun ? `, ${notRun} NOT RUN` : ''}`);
  process.exit(failed || notRun ? 1 : 0);
})();

// Browser checks for the acts hanging from the roots as Harold's mockups
// show (graph.containerLayout hang, containers[].hang, graph.hull.padding,
// graph.closedPillScale, containers[].hull false, graph.initialScale), on a
// built site, in the graph state after one scroll:
//   - the fresh default (Act 1 open, Acts 2 and 3 closed), every act open,
//     and every act closed;
//   - Act 1's hull top within 4 px of its anchor, at most 2.5 cards wide,
//     nothing of it above the crown; its cards in reading order along the
//     chain, one card step apart, none overlapping, chapter one the chain's
//     low end (down the far side first, as the mockup has it) and the last
//     chapter highest;
//   - Acts 2 and 3: open, the hull wholly on its side of the roots' centre
//     line and below its anchor, and clear of Act 1's hull; closed, a pill
//     centred on its outer tip at the set scale, clear of Act 1's hull;
//   - no book hull drawn;
//   - at the default zoom a card at least minCardWidthPx wide, its title
//     drawn as text;
//   - no node, hull or label above the crown line.
// Chromium and WebKit, desktop (1280x800) and phone (390x844). A screenshot
// per state, size and engine goes to PP_E2E_SHOTS when set, with a composite
// per size of each mockup beside the preview at the same scale (see
// MOCK_SIDE_GAP).
//
//   node test/e2e/t33_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { artPoint } = require('../../src/lib/reach');
const { closedPillScaleOf } = require('../../src/components/GraphViewer/containerLayout');
const { minCardScale } = require('../../src/components/GraphViewer/initialScale');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39463;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const GS = SETTINGS.graph || {};
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const MOCKUPS = path.resolve(__dirname, '../../_handoff');
const CONTAINERS = SETTINGS.containers || {};
const ACTS = Object.entries(CONTAINERS)
  .filter(([id, c]) => id.startsWith('container:') && c && c.anchor)
  .map(([id, c]) => ({ id, anchor: c.anchor, direction: (c.hang && c.hang.direction) || (GS.hang && GS.hang.direction) || 'down' }));
const MIDDLE = ACTS.find((a) => a.direction === 'down');
const SIDES = ACTS.filter((a) => a !== MIDDLE);
const BOOK = (SETTINGS.containment || []).find((c) => !c.parent).id;
const CARD_W = (GS.card && GS.card.width) || 180;
const PILL = closedPillScaleOf(GS);
const MIN_CARD = minCardScale(GS.initialScale, CARD_W) * CARD_W;
// On cover/graph-state.png (1045 x 2111): the crown, where the stem meets the
// roots, and the stem's centre line, measured by scanning its rows.
const CROWN = 1330 / 2111;
const STEM_X = 0.495;
// Which act a chapter is in, and its place in the act: the site's ids are
// eoej-a<act>-<nn>-..., and series_part is its order.
const actOfCard = (id) => { const m = /-a(\d+)-/.exec(id); return m ? `container:act-${m[1]}` : null; };

if (!MIDDLE || SIDES.length !== 2 || GS.containerLayout !== 'hang') {
  console.error('this site has no hanging acts (graph.containerLayout hang, one act down and two at the sides); nothing to check');
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
  await page.waitForTimeout(500);
  return { browser, ctx, page, errors, phone, name };
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
  const shown = (el) => el && getComputedStyle(el).display !== 'none' && !el.closest('[style*="display: none"]');
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
      const bg = macro.querySelector('.container-macro-bg');
      const o = outline(bg);
      const local = bg.getBBox();
      const mm = macro.getScreenCTM();
      const k = window.PostPipeGraphWorld.snapshot().k;
      pill = { ...o, centre: { x: mm.e, y: mm.f }, scale: (o.x1 - o.x0) / (local.width * k) };
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
      // The title drawn as text: the element whose text is the title, and
      // how tall its glyphs are on the screen.
      let titleH = 0, titleText = '';
      const els = [...c.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim() && title.startsWith(e.textContent.trim().slice(0, 4)));
      if (els.length) {
        const range = document.createRange();
        range.selectNodeContents(els[0]);
        const rr = range.getBoundingClientRect();
        titleH = rr.height; titleText = els[0].textContent.trim();
        if (getComputedStyle(els[0]).visibility === 'hidden' || Number(getComputedStyle(els[0]).opacity) === 0) titleH = 0;
      }
      return { id: d.id, order: d.series_part, title, titleH, titleText, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, w: r.width, h: r.height };
    })
    .filter((c) => c.w > 0 && c.h > 0);
  const bookG = group(book);
  const bookHull = bookG && bookG.querySelector('.container-hull');
  const bookBadge = bookG && bookG.querySelector('.container-badge');
  const w = window.PostPipeGraphWorld.snapshot();
  return {
    W: innerWidth, H: innerHeight,
    art: { left: art.left, top: art.top, width: art.width, height: art.height },
    acts: Object.fromEntries(acts.map((a) => [a.id, act(a.id)])),
    cards,
    bookHullDrawn: !!(bookHull && getComputedStyle(bookHull).display !== 'none' && (bookHull.getAttribute('d') || '').length),
    bookLabelDrawn: !!(bookBadge && getComputedStyle(bookBadge).display !== 'none'),
    k: w.k, homeK: w.homeK, state: window.PostPipeCover.state,
  };
}, { acts, book });

const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const boxesMeet = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function inside(pt, poly) {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) ins = !ins;
  }
  return ins;
}
// Two outlines intersect: their boxes meet and a point of one is inside the
// other (sampled at 240 points each).
const outlinesMeet = (a, b) => boxesMeet(a, b) && (a.pts.some((p) => inside(p, b.pts)) || b.pts.some((p) => inside(p, a.pts)));

async function shot(s, state) {
  if (!SHOTS) return null;
  fs.mkdirSync(SHOTS, { recursive: true });
  const file = path.join(SHOTS, `${state}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`);
  await s.page.screenshot({ path: file });
  return file;
}

function checkAct1(record, tag, m) {
  const a = m.acts[MIDDLE.id];
  const at = artPoint(MIDDLE.anchor, m.art);
  const crown = m.art.top + CROWN * m.art.height;
  if (!a || !a.hull) { record(`${tag}: Act 1 is open with its hull`, false, 'no hull'); return; }
  const cardW = Math.max(...m.cards.map((c) => c.w));
  record(`${tag}: Act 1's hull top within 4 px of its anchor`, Math.abs(a.hull.y0 - at.y) <= 4 && a.hull.x0 <= at.x && at.x <= a.hull.x1,
    `top ${r1(a.hull.y0)}, anchor ${r1(at.x)}, ${r1(at.y)} (off ${r1(a.hull.y0 - at.y)})`);
  record(`${tag}: Act 1 at most 2.5 cards wide`, (a.hull.x1 - a.hull.x0) <= 2.5 * cardW + 0.5,
    `${r1(a.hull.x1 - a.hull.x0)} px, ${r1((a.hull.x1 - a.hull.x0) / cardW)} cards of ${r1(cardW)}`);
  record(`${tag}: nothing of Act 1 above the crown`, a.hull.y0 >= crown && (!a.label || a.label.y0 >= crown), `hull top ${r1(a.hull.y0)}, crown ${r1(crown)}`);
  const cards = m.cards.filter((c) => actOfCard(c.id) === MIDDLE.id).sort((p, q) => p.order - q.order);
  const step = Math.hypot(cards[0].w, cards[0].h) * 1.2;
  const far = [];
  for (let i = 1; i < cards.length; i++) {
    const d = Math.hypot(cards[i].x - cards[i - 1].x, cards[i].y - cards[i - 1].y);
    if (d > step) far.push(`${cards[i - 1].order}-${cards[i].order} ${r1(d)}`);
  }
  record(`${tag}: Act 1's ${cards.length} cards in reading order along the chain, each one card step from the last`, cards.length > 1 && far.length === 0,
    far.length ? far.join(', ') : `steps under ${r1(step)} px`);
  const overlaps = [];
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) if (boxesMeet(cards[i], cards[j])) overlaps.push(`${cards[i].order}/${cards[j].order}`);
  record(`${tag}: no two of Act 1's cards overlap`, overlaps.length === 0, overlaps.join(', '));
  // The chain goes down the far side and back up the near side (the
  // mockup: chapter one part way down the far side, chapters four and five
  // at the foot). So chapter one is the chain's low end: on the far side, at
  // or below the middle of the cards' height; the last chapter is the
  // highest card, under the anchor.
  const ys = cards.map((c) => c.y);
  const mid = (Math.min(...ys) + Math.max(...ys)) / 2;
  const first = cards[0], last = cards[cards.length - 1];
  const farSide = Math.abs(first.x - last.x) > first.w / 2;
  record(`${tag}: chapter one the low end of the chain (far side, at or below the middle), the last chapter highest`,
    first.y >= mid - 0.5 && farSide && last.y <= Math.min(...ys) + 0.5,
    `chapter one at ${r1(first.y)} (middle ${r1(mid)}, lowest card ${r1(Math.max(...ys))}), ${farSide ? 'far side' : 'near side'}; last at ${r1(last.y)}, highest ${r1(Math.min(...ys))}`);
  const inHull = cards.every((c) => [[c.x0, c.y0], [c.x1, c.y0], [c.x1, c.y1], [c.x0, c.y1]].every(([x, y]) => inside({ x, y }, a.hull.pts)));
  record(`${tag}: Act 1's hull holds all its cards`, inHull);
}

function checkSides(record, tag, m) {
  const a1 = m.acts[MIDDLE.id];
  const stem = m.art.left + STEM_X * m.art.width;
  for (const s of SIDES) {
    const a = m.acts[s.id];
    const at = artPoint(s.anchor, m.art);
    const name = s.id.replace('container:', '');
    const left = s.direction === 'down-left';
    if (!a) { record(`${tag}: ${name} drawn`, false); continue; }
    if (a.closed) {
      const c = a.pill.centre;
      record(`${tag}: ${name}'s pill centred on its tip`, Math.hypot(c.x - at.x, c.y - at.y) <= 4, `centre ${r1(c.x)}, ${r1(c.y)}; tip ${r1(at.x)}, ${r1(at.y)}`);
      record(`${tag}: ${name}'s pill at the set scale (${PILL})`, Math.abs(a.pill.scale - PILL) <= 0.02, `${r1(a.pill.scale * 100)}% of full size, ${r1(a.pill.x1 - a.pill.x0)} px wide`);
      record(`${tag}: ${name}'s pill on the ${left ? 'left' : 'right'} of the roots' centre line`, left ? a.pill.x1 <= stem : a.pill.x0 >= stem, `${r1(a.pill.x0)} to ${r1(a.pill.x1)}, centre line ${r1(stem)}`);
      if (a1 && a1.hull) record(`${tag}: ${name}'s pill clear of Act 1's hull`, !outlinesMeet(a.pill, a1.hull));
      else if (a1 && a1.pill) record(`${tag}: ${name}'s pill clear of Act 1's pill`, !outlinesMeet(a.pill, a1.pill));
    } else {
      record(`${tag}: ${name}'s hull wholly ${left ? 'left' : 'right'} of the roots' centre line`, left ? a.hull.x1 <= stem : a.hull.x0 >= stem, `${r1(a.hull.x0)} to ${r1(a.hull.x1)}, centre line ${r1(stem)}`);
      record(`${tag}: ${name}'s hull below its anchor`, a.hull.y0 >= at.y - 4, `top ${r1(a.hull.y0)}, anchor ${r1(at.y)}`);
      record(`${tag}: ${name}'s hull hangs outward from its tip`, left ? a.hull.x1 <= at.x + 1 : a.hull.x0 >= at.x - 1, `${r1(a.hull.x0)} to ${r1(a.hull.x1)}, tip ${r1(at.x)}`);
      if (a1 && a1.hull) record(`${tag}: ${name}'s hull clear of Act 1's hull`, !outlinesMeet(a.hull, a1.hull));
    }
  }
}

function checkAll(record, tag, m) {
  const crown = m.art.top + CROWN * m.art.height;
  record(`${tag}: in the graph state`, m.state === 'graph', m.state);
  record(`${tag}: no book hull drawn`, !m.bookHullDrawn && !m.bookLabelDrawn);
  const above = [];
  for (const c of m.cards) if (c.y0 < crown - 0.5) above.push(`card ${c.order} at ${r1(c.y0)}`);
  for (const [id, a] of Object.entries(m.acts)) {
    if (!a) continue;
    const o = a.hull || a.pill;
    if (o && o.y0 < crown - 0.5) above.push(`${id} at ${r1(o.y0)}`);
    if (a.label && a.label.y0 < crown - 0.5) above.push(`${id} label at ${r1(a.label.y0)}`);
  }
  record(`${tag}: no node, hull or label above the crown line`, above.length === 0, above.length ? above.join(', ') : `crown at ${r1(crown)}`);
}

async function run(bt, name, size, record, shots) {
  const s = await open(bt, name, size);
  const p = s.page;
  await scrollOnce(s);
  const tagOf = (state) => `${name} ${size} ${state}`;

  // The fresh default.
  let m = await measure(p, { acts: ACTS, book: BOOK });
  let tag = tagOf('default');
  checkAll(record, tag, m);
  checkAct1(record, tag, m);
  checkSides(record, tag, m);
  const cardW = Math.min(...m.cards.map((c) => c.w));
  record(`${tag}: a card at least ${MIN_CARD} px wide`, cardW >= MIN_CARD - 0.5, `${r1(cardW)} px at zoom ${r1(m.k)}`);
  const untitled = m.cards.filter((c) => !(c.titleH >= 8));
  record(`${tag}: every card's title drawn as text`, m.cards.length > 0 && untitled.length === 0,
    untitled.length ? untitled.map((c) => c.order).join(', ') : `${m.cards.length} cards, titles ${r1(Math.min(...m.cards.map((c) => c.titleH)))} px tall or more`);
  shots.default = await shot(s, 'default');

  // Every act open.
  await p.evaluate(() => window.PostPipeGraph.openAllContainers());
  await p.waitForTimeout(1500);
  m = await measure(p, { acts: ACTS, book: BOOK });
  tag = tagOf('all open');
  checkAll(record, tag, m);
  checkAct1(record, tag, m);
  checkSides(record, tag, m);
  for (const sd of SIDES) {
    const cards = m.cards.filter((c) => actOfCard(c.id) === sd.id);
    const ov = [];
    for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) if (boxesMeet(cards[i], cards[j])) ov.push(`${cards[i].order}/${cards[j].order}`);
    record(`${tag}: no two of ${sd.id.replace('container:', '')}'s cards overlap`, cards.length > 0 && ov.length === 0, ov.join(', '));
  }
  shots.open = await shot(s, 'all-open');
  shots.openArt = m.art;

  // Every act closed.
  await p.evaluate(() => window.PostPipeGraph.closeAllContainers());
  await p.waitForTimeout(1500);
  m = await measure(p, { acts: ACTS, book: BOOK });
  tag = tagOf('all closed');
  checkAll(record, tag, m);
  checkSides(record, tag, m);
  const a1 = m.acts[MIDDLE.id];
  const at1 = artPoint(MIDDLE.anchor, m.art);
  record(`${tag}: Act 1's pill centred on its tip, at the set scale`, !!(a1 && a1.pill) && Math.hypot(a1.pill.centre.x - at1.x, a1.pill.centre.y - at1.y) <= 4 && Math.abs(a1.pill.scale - PILL) <= 0.02,
    a1 && a1.pill ? `centre ${r1(a1.pill.centre.x)}, ${r1(a1.pill.centre.y)}; tip ${r1(at1.x)}, ${r1(at1.y)}; ${r1(a1.pill.scale * 100)}%` : 'no pill');
  record(`${tag}: no chapter cards`, m.cards.length === 0, `${m.cards.length} shown`);
  shots.closed = await shot(s, 'all-closed');
  shots.closedArt = m.art;

  record(`${name} ${size}: no page errors`, s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// Each mockup beside the preview at the same scale. The closed mockup's side
// pills sit on the outer tips, their centres 370.5 px apart (x 153.5 and
// 524 of its 708); the preview's side anchors are (x2 - x3) of the art's
// width apart, so the preview is scaled to make those the same. The open
// mockup is drawn larger than the closed one: its widest row of bright root
// (near-white grey, every channel over 95) is 489 px against the closed one's
// 399, so it takes 1.226 times that scale.
const MOCK_SIDE_GAP = 370.5;
const MOCK_OPEN_OVER_CLOSED = 489 / 399;
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
    const scale = (MOCK_SIDE_GAP / gapPx) * (state === 'open' ? MOCK_OPEN_OVER_CLOSED : 1);
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
    info.scale = scale; info.gapPx = gapPx;
    fs.writeFileSync(out, Buffer.from(info.url.split(',')[1], 'base64'));
    console.log(`composite ${state} ${size}: the preview's side anchors ${info.gapPx.toFixed(1)} px apart, scaled ${info.scale.toFixed(3)} -> ${path.relative(process.cwd(), out)}`);
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

// Browser checks for the branch layout (graph.containerLayout 'branches'):
// Harold, 2026-10-03, "just first one in sequence goes to the next open
// branch off the tap root". On a built site:
//   - closed by default: each act its label alone, on its own main root,
//     under the crown; no hull, no outline, no closed shape, no cards;
//   - each act open, and every act open: every chapter on a tip of its own
//     act's branches (or a grown one), in reading order nearest the crown
//     first, its card's near edge within 2 px of its tip (or, slid toward
//     the crown, of its place on its branch); no two cards meeting; no card
//     in another act's space; how many shrank and slid, reported;
//   - grown branches: none needed on the site as built (reported); and, to
//     see them work, Act Three given four of its tips in the feed (in the
//     browser only): its other four chapters on branches grown for them,
//     drawn in the roots' own layer, inside its space, the same on two
//     reloads and in both engines;
//   - the cards' title and chapter line, their rendered px at rest
//     (reported, against main's preview when it is up);
//   - a tap on a label opens and closes its act; a drag moves the label,
//     its cards with it, its root following it, never ahead;
//   - a zoom in: every card grows about its tip;
//   - no page errors.
// Chromium and WebKit, desktop (1280x800) and phone (390x844 at 3x). With
// PP_E2E_SHOTS set, screenshots and composites: main's preview (8431, only
// read) beside this site, every act closed, Act One open and every act
// open, phone and desktop; and the grown branches.
//
//   node test/e2e/t37_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { parseRoots, rootsModel } = require('../../src/lib/rootsVector');
const BL = require('../../src/components/GraphViewer/branchLayout');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39467;
const BASE = `http://localhost:${PORT}/`;
const MAIN = process.env.PP_E2E_MAIN || 'http://localhost:8431/';
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const OPENING = SETTINGS.opening || {};
const GS = SETTINGS.graph || {};
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const LABELS = Object.fromEntries((FEED.containers || []).map((c) => [c.id, c.label]));
const ACTS = (FEED.containers || []).filter((c) => Array.isArray(c.branches) && c.branches.length)
  .map((c) => ({ id: c.id, name: c.label, tag: c.tag, tips: c.branches }));
const SRC = (GS.branches && GS.branches.source) || (OPENING.art && OPENING.art.rootsVector);

if (GS.containerLayout !== 'branches' || ACTS.length < 3 || !SRC) {
  console.error('this site does not set graph.containerLayout branches with containers.<id>.branches; nothing to check');
  process.exit(1);
}

// The skeleton, read here as the page reads it.
const MODEL = rootsModel(parseRoots(fs.readFileSync(path.join(SITE, SRC), 'utf8')));
const SPACES = BL.actSpaces(MODEL, ACTS);
// Each act's chapters in reading order (as the feed numbers them).
const slugOf = (it) => it.url.split('/').pop().replace('.html', '');
const CHAPTERS = Object.fromEntries(ACTS.map((a) => [a.id, FEED.items
  .filter((it) => (it.tags || []).includes(a.tag))
  .sort((p, q) => (p.series_part ?? 1e9) - (q.series_part ?? 1e9) || String(p.date_published || '').localeCompare(String(q.date_published || '')))
  .map(slugOf)]));
// The tips each act's chapters take, nearest the crown first.
const EXPECTED = Object.fromEntries(ACTS.map((a) => [a.id, BL.orderTips(MODEL, a.tips)]));
const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const r2 = (n) => (Number.isFinite(n) ? n.toFixed(2) : String(n));
const med = (v) => { if (!v.length) return NaN; const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

async function open(bt, name, size, { url = BASE, route = null } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: 'dark',
  });
  await ctx.addInitScript(pageHelpers);
  if (route) await ctx.route('**/feed.json*', route);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await ready(page);
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
  const box = (r) => ({ x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, w: r.width, h: r.height });
  const group = (id) => document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
  // An act's label as drawn: its box, its centre, whether it is shown.
  window.__label = (id) => {
    const g = group(id);
    if (!g || getComputedStyle(g).display === 'none') return null;
    const badge = g.querySelector('.container-badge');
    const hit = g.querySelector('.container-badge-hit');
    const text = g.querySelector('.container-badge-text');
    const hull = g.querySelector('.container-hull');
    const macro = g.querySelector('.container-macro-node');
    const m = badge.getScreenCTM();
    const ts = getComputedStyle(text);
    const k = Math.hypot(m.a, m.b);
    return {
      shown: getComputedStyle(badge).display !== 'none', position: badge.getAttribute('data-label-position'),
      centre: { x: m.e, y: m.f }, box: box(hit.getBoundingClientRect()), ink: box(text.getBoundingClientRect()),
      text: text.textContent, px: parseFloat(text.getAttribute('font-size')) * k, face: ts.fontFamily, fill: ts.fill,
      hull: !!hull && getComputedStyle(hull).display !== 'none' && (hull.getAttribute('d') || '').length > 0,
      macro: !!macro && getComputedStyle(macro).display !== 'none',
      hitFill: getComputedStyle(hit).fill, hitStroke: getComputedStyle(hit).stroke,
    };
  };
  // Every card as drawn: its box, its act, its rendered type sizes.
  window.__cardsNow = () => [...document.querySelectorAll('.node-card')]
    .filter((c) => c.style.display !== 'none' && getComputedStyle(c).display !== 'none' && c.__data__)
    .map((c) => {
      const r = c.getBoundingClientRect();
      const scale = r.width / (c.offsetWidth || 1);
      const t = c.querySelector('[data-card-title], [class*="cardTitle"]');
      const s = c.querySelector('[data-card-subtitle], [class*="cardSubtitle"]');
      return {
        id: c.__data__.id, tags: c.__data__.tags || [], box: box(r), scale,
        titlePx: t ? parseFloat(getComputedStyle(t).fontSize) * scale : 0,
        linePx: s ? parseFloat(getComputedStyle(s).fontSize) * scale : 0,
        titleOver: t ? t.scrollWidth > t.clientWidth + 1 || t.scrollHeight > t.parentElement.clientHeight + 1 : false,
      };
    }).filter((c) => c.box.w > 0);
  // Where a tip is drawn: the end of the last part of its edge.
  window.__tipAt = (name) => {
    const parts = [...document.querySelectorAll('[data-roots-vector] path')].filter((p) => p.getAttribute('data-tip') === name);
    if (!parts.length) return null;
    parts.sort((a, b) => Number(a.getAttribute('data-part')) - Number(b.getAttribute('data-part')));
    const last = parts[parts.length - 1];
    const q = last.getPointAtLength(last.getTotalLength());
    const m = last.getScreenCTM();
    return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
  };
  // The tip of an act's own root (the one that bends toward it).
  window.__rootTip = (id) => {
    const parts = [...document.querySelectorAll(`[data-roots-vector] path[data-act-root="${CSS.escape(id)}"]`)];
    const last = parts[parts.length - 1];
    if (!last) return null;
    const q = last.getPointAtLength(last.getTotalLength());
    const m = last.getScreenCTM();
    return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
  };
  window.__art = () => { const r = document.querySelector('[data-cover-art]').getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; };
  window.__zoom = () => { const w = window.PostPipeGraphWorld.snapshot(); return w.k / w.homeK; };
  window.__grownDrawn = () => [...document.querySelectorAll('[data-roots-vector] path[data-grown]')].map((p) => ({
    act: p.getAttribute('data-grown'), tip: p.getAttribute('data-tip'), d: p.getAttribute('d'), w: Number(p.getAttribute('stroke-width')), stroke: p.getAttribute('stroke'),
    same: p.parentNode === document.querySelector('[data-roots-vector]'), filter: getComputedStyle(p.parentNode).filter,
  }));
}

async function scrollOnce(s) {
  await s.page.mouse.move(s.phone ? 195 : 640, s.phone ? 420 : 400);
  await s.wheel(120);
  await s.page.waitForFunction(() => window.PostPipeCover.state === 'graph', null, { timeout: 5000 }).catch(() => {});
  await s.page.waitForTimeout(1800);
}
// The pointer out of the way (a card under it opens on hover).
const park = async (page) => { const v = page.viewportSize(); await page.mouse.move(1, v.height - 2); await page.waitForTimeout(150); };
const reset = async (page) => { await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all'))); await page.waitForTimeout(1500); };
const settle = (page) => page.waitForTimeout(1400);

// Points of the art (its own px) on the screen now.
const toScreen = (art) => (p) => ({ x: art.left + (p.x / MODEL.w) * art.width, y: art.top + (p.y / MODEL.h) * art.height });
const toArt = (art) => (p) => ({ x: ((p.x - art.left) / art.width) * MODEL.w, y: ((p.y - art.top) / art.height) * MODEL.h });
// Distance from a point to a box (0 inside), and to its edge.
const toBox = (p, b) => Math.hypot(Math.max(b.x0 - p.x, 0, p.x - b.x1), Math.max(b.y0 - p.y, 0, p.y - b.y1));
const toEdge = (p, b) => {
  const out = toBox(p, b);
  if (out > 0) return out;
  return Math.min(p.x - b.x0, b.x1 - p.x, p.y - b.y0, b.y1 - p.y);
};
const toPoly = (p, poly) => poly.slice(1).reduce((d, q, i) => {
  const a = poly[i], vx = q.x - a.x, vy = q.y - a.y, L2 = vx * vx + vy * vy;
  const t = L2 ? Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / L2)) : 0;
  return Math.min(d, Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy)));
}, Infinity);
const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

// Every visible card against its act, its tip, the others.
async function checkCards(page, record, tag, label, actIds, { model = MODEL, grown = null, tipsOf = (id) => ACTS.find((x) => x.id === id).tips } = {}) {
  await park(page);
  const snap = await page.evaluate(() => window.PostPipeGraphWorld.branches());
  const cards = await page.evaluate(() => window.__cardsNow());
  const art = await page.evaluate(() => window.__art());
  const scr = toScreen(art), artOf = toArt(art);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const m = grown ? BL.withGrown(model, grown) : model;
  const problems = { tip: [], order: [], space: [], missing: [], edge: [] };
  let slid = 0, shrunk = 0, total = 0, worstEdge = 0;
  const slides = [];
  for (const id of actIds) {
    const a = snap.acts.find((x) => x.id === id);
    const given = tipsOf(id);
    const own = new Set([...given, ...(grown || []).filter((e) => e.act === id).map((e) => e.tip)]);
    // The tips in the order the chapters take them: the act's own nearest
    // the crown first, then the grown ones, nearest first among them.
    const traced = BL.orderTips(model, given);
    const grownL = (n) => BL.polyLength(BL.pathToTip(m, n) || []);
    const grownNames = a.tips.slice(traced.length);
    const grownSorted = grownNames.every((n, i) => !i || grownL(grownNames[i - 1]) <= grownL(n) + 1e-6);
    if (!grownSorted) problems.order.push('the grown tips not nearest first');
    CHAPTERS[id].forEach((slug, rank) => {
      const c = byId.get(slug);
      const info = a.cards.find((x) => x.id === slug);
      if (!c || !info || !info.placed) { problems.missing.push(slug); return; }
      total++;
      // On a tip of its own, in order: the traced ones nearest first, then
      // the grown ones.
      if (!own.has(info.tip)) problems.tip.push(`${slug} on ${info.tip}`);
      const want = rank < traced.length ? traced[rank] : a.tips[rank];
      if (info.tip !== want || (rank >= traced.length && !grownNames.includes(info.tip))) problems.order.push(`${rank + 1}: ${info.tip}, not ${want}`);
      // Its near edge on its tip, or on its place along its branch.
      const path = BL.pathToTip(m, info.tip);
      if (!path) { problems.tip.push(`${slug}: no path to ${info.tip}`); return; }
      const tip = scr(path[path.length - 1]);
      const anchor = info.slidPx > 0.01 ? info.anchor : tip;
      if (info.slidPx > 0.01) { slid++; slides.push(info.slidPx); }
      if (info.fit < 0.999) shrunk++;
      const onBranch = toPoly(anchor, path.map(scr));
      const edge = toEdge(anchor, c.box);
      worstEdge = Math.max(worstEdge, edge, onBranch);
      if (edge > 2 || onBranch > 2) problems.edge.push(`${slug} ${r1(edge)} px from its ${info.slidPx > 0.01 ? 'place' : 'tip'}${onBranch > 2 ? `, ${r1(onBranch)} px off its branch` : ''}`);
      // In its own act's space.
      const centre = artOf({ x: (c.box.x0 + c.box.x1) / 2, y: (c.box.y0 + c.box.y1) / 2 });
      if (SPACES.actAt(centre.x, centre.y) !== id) problems.space.push(slug);
    });
  }
  record(tag(`${label}: every chapter on a tip of its own act's branches`), !problems.missing.length && !problems.tip.length, problems.missing.length ? `missing ${problems.missing.join(', ')}` : problems.tip.join('; ') || `${total} chapters`);
  record(tag(`${label}: in reading order, nearest the crown first`), !problems.order.length, problems.order.slice(0, 4).join('; ') || 'as ordered');
  record(tag(`${label}: each card's near edge within 2 px of its tip (or of its place along its branch, slid)`), !problems.edge.length, problems.edge.slice(0, 3).join('; ') || `${r1(worstEdge)} px at most; ${slid} slid toward the crown (${slides.map((d) => r1(d)).join(', ') || 'none'} px), ${shrunk} shrunk`);
  // No two meeting.
  let worst = 0, pair = '';
  for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
    const o = overlap(cards[i].box, cards[j].box);
    if (o > worst) { worst = o; pair = `${cards[i].id} and ${cards[j].id}`; }
  }
  record(tag(`${label}: no two cards overlap`), worst <= 0.5, worst > 0.5 ? `${pair}: ${r1(worst)} px²` : `${cards.length} cards`);
  record(tag(`${label}: no card in another act's space`), !problems.space.length, problems.space.join(', ') || 'each in its own');
  return { cards, snap, slid, shrunk };
}

async function run(bt, name, size, record, shots, report) {
  const s = await open(bt, name, size);
  const { page, phone } = s;
  const tag = (l) => `[${name} ${size}] ${l}`;
  const shot = async (n) => {
    if (!SHOTS) return null;
    fs.mkdirSync(SHOTS, { recursive: true });
    const f = path.join(SHOTS, `branch-${n}-${size}-${name}.png`);
    await page.screenshot({ path: f });
    return f;
  };
  await scrollOnce(s);
  await settle(page);

  // ── Closed by default ──
  const snap0 = await page.evaluate(() => window.PostPipeGraphWorld.branches());
  record(tag('closed default: the skeleton read and every act placed'), !!snap0 && snap0.acts.every((a) => a.labelSize > 0), snap0 ? snap0.acts.map((a) => `${LABELS[a.id]} ${r1(a.labelPx)} px`).join(', ') : 'no plan');
  record(tag('closed default: every act closed'), snap0.acts.every((a) => a.closed), snap0.acts.filter((a) => !a.closed).map((a) => a.id).join(', ') || 'all three');
  const art = await page.evaluate(() => window.__art());
  const scr = toScreen(art);
  const crownY = art.top + OPENING.crownY * art.height;
  for (const a of ACTS) {
    const l = await page.evaluate((id) => window.__label(id), a.id);
    record(tag(`closed default: ${a.name} is its label alone (no hull, no outline, no closed shape)`), !!l && l.shown && l.position === 'branches' && !l.hull && !l.macro && (l.hitStroke === 'none' || /rgba\(0, 0, 0, 0\)/.test(l.hitStroke)) && /transparent|rgba\(0, 0, 0, 0\)/.test(l.hitFill), l ? `"${l.text}", ${r1(l.px)} px in ${l.face.split(',')[0]}` : 'not drawn');
    if (!l) continue;
    const roots = BL.mainRoots(MODEL, SPACES.owner, a.id).map((poly) => poly.map(scr));
    const off = Math.min(...roots.map((poly) => toPoly(l.centre, poly)));
    record(tag(`closed default: ${a.name}'s label on its main root`), off <= 2, `${r1(off)} px off it`);
    record(tag(`closed default: ${a.name}'s label under the crown and on the screen`), l.ink.y0 >= crownY - 0.5 && l.box.x0 >= -0.5 && l.box.x1 <= (phone ? 390 : 1280) + 0.5, `its top ${r1(l.ink.y0)} px, the crown ${r1(crownY)} px`);
    const inOwn = [[l.box.x0 + 2, l.box.y0 + 2], [l.box.x1 - 2, l.box.y0 + 2], [l.box.x0 + 2, l.box.y1 - 2], [l.box.x1 - 2, l.box.y1 - 2], [l.centre.x, l.centre.y]]
      .every(([x, y]) => { const q = toArt(art)({ x, y }); return SPACES.actAt(q.x, q.y) === a.id; });
    record(tag(`closed default: ${a.name}'s label in its own act's space`), inOwn, inOwn ? 'yes' : 'reaches into another act\'s');
    report.labels[`${name} ${size}`] = report.labels[`${name} ${size}`] || {};
    report.labels[`${name} ${size}`][a.name] = { px: l.px, alongPx: snap0.acts.find((x) => x.id === a.id).labelAlongPx };
  }
  const cards0 = await page.evaluate(() => window.__cardsNow());
  record(tag('closed default: no cards'), cards0.length === 0, `${cards0.length} drawn`);
  record(tag('closed default: no branches grown (every act has tips enough)'), snap0.grown.length === 0, `${snap0.grown.length} grown; ${ACTS.map((a) => `${a.name} ${CHAPTERS[a.id].length} chapters on ${a.tips.length} tips`).join(', ')}`);
  shots.closed = await shot('closed');

  // ── Each act open, then every act ──
  for (const a of ACTS) {
    await page.evaluate((id) => window.PostPipeGraph.openContainer(id), a.id);
    await settle(page);
    await checkCards(page, record, tag, `${a.name} open`, [a.id]);
    if (a === ACTS.find((x) => /one/i.test(x.name))) shots.one = await shot('act-one-open');
    await reset(page);
  }
  await page.evaluate(() => window.PostPipeGraph.openAllContainers());
  await settle(page);
  const all = await checkCards(page, record, tag, 'every act open', ACTS.map((a) => a.id));
  shots.all = await shot('all-open');
  // Shrinking and sliding, per act.
  report.stats[`${name} ${size}`] = Object.fromEntries(all.snap.acts.map((a) => [LABELS[a.id], a.stats]));
  // The type on the cards.
  const tp = all.cards.map((c) => c.titlePx), lp = all.cards.map((c) => c.linePx);
  report.type[`${name} ${size}`] = { title: [Math.min(...tp), med(tp), Math.max(...tp)], line: [Math.min(...lp), med(lp), Math.max(...lp)] };
  record(tag('cards: the title and the chapter line drawn, nothing spilling out of a card'), all.cards.every((c) => c.titlePx > 0 && c.linePx > 0) && all.cards.every((c) => !c.titleOver), `title ${r1(Math.min(...tp))} to ${r1(Math.max(...tp))} px (median ${r1(med(tp))}), line ${r1(Math.min(...lp))} to ${r1(Math.max(...lp))} px (median ${r1(med(lp))})`);

  // ── A zoom in: each card about its tip ──
  {
    await park(page);
    const before = await page.evaluate(() => window.__cardsNow());
    const snapB = await page.evaluate(() => window.PostPipeGraphWorld.branches());
    const z0 = await page.evaluate(() => window.__zoom());
    await page.keyboard.press('+'); await page.waitForTimeout(450);
    await page.keyboard.press('+'); await page.waitForTimeout(700);
    const z1 = await page.evaluate(() => window.__zoom());
    const after = await page.evaluate(() => window.__cardsNow());
    const snapA = await page.evaluate(() => window.PostPipeGraphWorld.branches());
    const artNow = await page.evaluate(() => window.__art());
    const scrNow = toScreen(artNow);
    let worst = 0, worstGrow = 0;
    for (const c of after) {
      const info = snapA.acts.flatMap((x) => x.cards).find((x) => x.id === c.id);
      const was = before.find((x) => x.id === c.id);
      if (!info || !was) continue;
      const tip = info.slidPx > 0.01 ? snapB.acts.flatMap((x) => x.cards).find((x) => x.id === c.id).anchor : scrNow(BL.pathToTip(MODEL, info.tip).slice(-1)[0]);
      worst = Math.max(worst, toEdge(tip, c.box));
      worstGrow = Math.max(worstGrow, Math.abs(c.box.w / was.box.w - z1 / z0));
    }
    record(tag('zoom in: every card grows about its tip, its near edge still on it'), z1 > z0 * 1.4 && worst <= 2 && worstGrow < 0.02, `zoom ${r2(z0)} to ${r2(z1)}; edges ${r1(worst)} px from their tips at most; widths grew by the zoom within ${r2(worstGrow)}`);
    await reset(page);
  }

  // ── A tap on a label opens and closes its act ──
  {
    const a = ACTS[0];
    const tapAt = async (p) => {
      if (phone) await page.touchscreen.tap(p.x, p.y);
      else await page.mouse.click(p.x, p.y);
      await page.waitForTimeout(1200);
    };
    const l = await page.evaluate((id) => window.__label(id), a.id);
    await tapAt(l.centre);
    const opened = await page.evaluate(() => window.PostPipeGraphWorld.branches());
    const shown = (await page.evaluate(() => window.__cardsNow())).length;
    const l2 = await page.evaluate((id) => window.__label(id), a.id);
    await tapAt(l2.centre);
    const closed = await page.evaluate(() => window.PostPipeGraphWorld.branches());
    const after = (await page.evaluate(() => window.__cardsNow())).length;
    const isOpen = (sn) => !sn.acts.find((x) => x.id === a.id).closed;
    record(tag(`tap: ${a.name}'s label opens it and a second tap closes it`), isOpen(opened) && shown === CHAPTERS[a.id].length && !isOpen(closed) && after === 0, `opened with ${shown} cards; closed again with ${after} left`);
  }

  // ── A drag on a label: the act moves, its roots follow, never lead ──
  for (const state of ['closed', 'open']) {
    const a = ACTS.find((x) => /two/i.test(x.name)) || ACTS[1];
    if (state === 'open') { await page.evaluate((id) => window.PostPipeGraph.openContainer(id), a.id); await settle(page); }
    const start = (await page.evaluate((id) => window.__label(id), a.id)).centre;
    const tipStart = await page.evaluate((id) => window.__rootTip(id), a.id);
    const cardsStart = await page.evaluate(() => window.__cardsNow());
    await page.evaluate((id) => {
      window.__rec = []; window.__recOn = true;
      const badge = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"] .container-badge`);
      const loop = () => {
        if (!window.__recOn) return;
        const m = badge.getScreenCTM();
        const t = window.__rootTip(id);
        window.__rec.push({ t: performance.now(), x: m.e, y: m.f, tx: t ? t.x : NaN });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }, a.id);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) { await page.mouse.move(start.x + 10 * i, start.y); await page.waitForTimeout(40); }
    await page.mouse.up();
    const t0 = await page.evaluate(() => performance.now());
    await page.waitForTimeout(1000);
    const rec = await page.evaluate(() => { window.__recOn = false; return window.__rec; });
    const rows = rec.map((r) => ({ t: r.t, act: r.x - start.x, root: r.tx - tipStart.x })).filter((r) => Number.isFinite(r.root));
    const behind = rows.every((r) => r.root <= r.act + 0.5);
    const lagged = rows.filter((r) => r.t < t0 && r.act - r.root >= 3).length;
    const afterRows = rows.filter((r) => r.t >= t0);
    const caught = afterRows.find((r, i) => afterRows.slice(i).every((q) => Math.abs(q.act - q.root) <= 2));
    const end = await page.evaluate((id) => window.__label(id), a.id);
    record(tag(`drag (${state}): ${a.name}'s label moves 120 px with the pointer`), Math.abs(end.centre.x - start.x - 120) <= 1.5 && Math.abs(end.centre.y - start.y) <= 1.5, `${r1(end.centre.x - start.x)}, ${r1(end.centre.y - start.y)} px`);
    record(tag(`drag (${state}): its root follows, never ahead of the label, and catches up after`), behind && rows.length > 10 && lagged >= 1 && !!caught && caught.t - t0 <= 400, `${rows.length} frames, ${lagged} 3 px or more behind, ahead by ${r1(Math.max(0, ...rows.map((r) => r.root - r.act)))} px at most; caught up ${caught ? `${r1(caught.t - t0)} ms` : 'never'} after the release`);
    if (state === 'open') {
      const cardsEnd = await page.evaluate(() => window.__cardsNow());
      const moved = cardsEnd.map((c) => { const w = cardsStart.find((x) => x.id === c.id); return w ? c.box.x0 - w.box.x0 : NaN; }).filter(Number.isFinite);
      record(tag(`drag (open): ${a.name}'s cards move with it`), moved.length > 0 && moved.every((d) => Math.abs(d - 120) <= 1.5), `${moved.length} cards moved ${r1(Math.min(...moved))} to ${r1(Math.max(...moved))} px`);
    }
    await reset(page);
  }

  record(tag('no page errors'), s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// Act Three given four of its tips in the feed (in this browser only): its
// other chapters on grown branches.
async function growth(bt, name, size, record, report, shots) {
  const third = ACTS.find((a) => /three/i.test(a.name)) || ACTS[ACTS.length - 1];
  const keep = EXPECTED[third.id].slice(0, 4);
  const route = async (rt) => {
    const res = await rt.fetch();
    const feed = await res.json();
    for (const c of feed.containers || []) if (c.id === third.id) c.branches = keep;
    await rt.fulfill({ response: res, json: feed });
  };
  const tag = (l) => `[${name} ${size}] growth: ${l}`;
  const drawnSets = [];
  let s = null;
  for (let load = 0; load < 3; load++) {
    if (s) await s.browser.close();
    s = await open(bt, name, size, { route });
    await scrollOnce(s);
    await settle(s.page);
    drawnSets.push(await s.page.evaluate(() => window.__grownDrawn()));
  }
  const { page } = s;
  const snap = await page.evaluate(() => window.PostPipeGraphWorld.branches());
  const need = CHAPTERS[third.id].length - keep.length;
  const mine = snap.grown.filter((e) => e.act === third.id);
  record(tag(`${third.name} with ${keep.length} tips and ${CHAPTERS[third.id].length} chapters grows ${need} branches`), mine.length === need, `${mine.length} grown, ${JSON.stringify(snap.levels[third.id] || [])} relaxations (0: none)`);
  const drawn = drawnSets[0];
  record(tag('drawn in the roots\' own layer, with the same brightness'), drawn.length > 0 && drawn.every((p) => p.same) && new Set(drawn.map((p) => p.filter)).size === 1, `${drawn.length} parts; filter ${drawn[0] && drawn[0].filter}`);
  const same = drawnSets.every((d) => JSON.stringify(d.map((p) => p.d)) === JSON.stringify(drawn.map((p) => p.d)));
  record(tag('the same branches on two reloads'), same, same ? `${drawn.length} parts identical three times` : 'they differ');
  report.grownD[`${name} ${size}`] = drawnSets[0].map((p) => p.d);
  // Inside its space, tapering, in the trace's greys and widths.
  const out = [];
  for (const e of mine) for (const part of e.parts) for (const [x, y] of part.pts.slice(1)) if (SPACES.actAt(x, y) !== third.id) out.push(`${e.tip} ${r1(x)},${r1(y)}`);
  record(tag('every grown branch inside its act\'s space'), out.length === 0, out.slice(0, 3).join('; ') || 'yes');
  const taper = mine.every((e) => e.parts[0].width >= e.parts[e.parts.length - 1].width);
  const widths = mine.flatMap((e) => e.parts.map((p) => p.width));
  record(tag('tapering toward the tip, as wide as the trace\'s last branches'), taper && Math.max(...widths) <= snap.style.startWidth[1] + 1e-9 && Math.min(...widths) >= Math.min(snap.style.tipWidth, snap.style.startWidth[0]) - 1e-9, `${r1(Math.max(...widths))} to ${r1(Math.min(...widths))} px wide`);
  report.style = snap.style;
  await page.evaluate((id) => window.PostPipeGraph.openContainer(id), third.id);
  await settle(page);
  // Its chapters: the four tips nearest first, then the grown ones.
  const grownEdges = snap.grown.map((e) => ({ ...e, a: -1, b: -2 - e.e, grown: true, loop: false, free: false }));
  const res = await checkCards(page, record, (l) => `[${name} ${size}] growth: ${l}`, `${third.name} open on grown branches`, [third.id], { grown: grownEdges, tipsOf: (id) => (id === third.id ? keep : ACTS.find((x) => x.id === id).tips) });
  const onGrown = res.snap.acts.find((a) => a.id === third.id).cards.filter((c) => c.grown).length;
  record(tag(`${need} of ${third.name}'s chapters on grown branches`), onGrown === need, `${onGrown}`);
  if (SHOTS && name === 'chromium') {
    await park(page);
    const f = path.join(SHOTS, `growth-${size}-chromium.png`);
    await page.screenshot({ path: f });
    shots[size] = f;
    // A close-up of the act's corner, as drawn and with the grown branches
    // marked in yellow.
    const art = await page.evaluate(() => window.__art());
    const pts = mine.flatMap((e) => e.parts.flatMap((q) => q.pts)).map(([x, y]) => toScreen(art)({ x, y }));
    const vw = page.viewportSize();
    const x0 = Math.max(0, Math.min(...pts.map((q) => q.x)) - 60), y0 = Math.max(0, Math.min(...pts.map((q) => q.y)) - 60);
    const clip = { x: x0, y: y0, width: Math.min(vw.width - x0, Math.max(...pts.map((q) => q.x)) + 60 - x0), height: Math.min(vw.height - y0, Math.max(...pts.map((q) => q.y)) + 60 - y0) };
    await page.evaluate((id) => window.PostPipeGraph.closeContainer(id), third.id);
    await settle(page);
    const plain = path.join(SHOTS, `growth-closeup-${size}-chromium.png`);
    await page.screenshot({ path: plain, clip });
    await page.addStyleTag({ content: '[data-roots-vector] path[data-grown] { stroke: #ffd400 !important; }' });
    await page.waitForTimeout(200);
    const marked = path.join(SHOTS, `growth-closeup-marked-${size}-chromium.png`);
    await page.screenshot({ path: marked, clip });
    shots[`${size}Plain`] = plain;
    shots[`${size}Marked`] = marked;
  }
  record(tag('no page errors'), s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// Main's preview (read only): the same states, and the cards' type, for the
// pictures beside this one.
async function mainPreview(size, shots, report) {
  let s;
  try {
    s = await open(chromium, 'chromium', size, { url: MAIN });
  } catch (e) {
    console.log(`      main's preview (${MAIN}) not reachable: ${e.message.split('\n')[0]}`);
    return;
  }
  const { page } = s;
  await scrollOnce(s);
  await settle(page);
  const shot = async (n) => {
    if (!SHOTS) return null;
    const f = path.join(SHOTS, `main-${n}-${size}-chromium.png`);
    await page.screenshot({ path: f });
    return f;
  };
  shots.closed = await shot('closed');
  const ids = (FEED.containers || []).filter((c) => c.parent).map((c) => c.id);
  const one = ids.find((id) => /act-1$/.test(id)) || ids[0];
  await page.evaluate((id) => window.PostPipeGraph.openContainer(id), one);
  await settle(page);
  shots.one = await shot('act-one-open');
  await reset(page);
  await page.evaluate(() => window.PostPipeGraph.openAllContainers());
  await settle(page);
  await park(page);
  shots.all = await shot('all-open');
  const cards = await page.evaluate(() => window.__cardsNow());
  const tp = cards.map((c) => c.titlePx), lp = cards.map((c) => c.linePx);
  report.mainType[size] = { title: [Math.min(...tp), med(tp), Math.max(...tp)], line: [Math.min(...lp), med(lp), Math.max(...lp)] };
  await s.browser.close();
}

// Pictures in rows on one canvas, at given scales, each with a label.
async function grid(file, rows) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
  const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const url = await page.evaluate(async (rows) => {
    const load = async (src) => { const i = new Image(); i.src = src; await i.decode(); return i; };
    const imgs = await Promise.all(rows.map((r) => Promise.all(r.map((it) => load(it.src)))));
    const pad = 20, head = 34;
    const dims = rows.map((r, i) => r.map((it, j) => ({ w: imgs[i][j].width * it.scale, h: imgs[i][j].height * it.scale })));
    const rowW = dims.map((r) => r.reduce((t, d) => t + d.w + pad, pad));
    const rowH = dims.map((r) => Math.max(...r.map((d) => d.h)) + head + pad);
    const c = document.createElement('canvas');
    c.width = Math.max(...rowW);
    c.height = rowH.reduce((t, h) => t + h, pad);
    const x = c.getContext('2d');
    x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#ddd'; x.font = '15px sans-serif';
    let dy = pad;
    rows.forEach((r, i) => {
      let dx = pad;
      r.forEach((it, j) => {
        x.drawImage(imgs[i][j], dx, dy + head - 10, dims[i][j].w, dims[i][j].h);
        x.fillText(it.label, dx, dy + 12);
        dx += dims[i][j].w + pad;
      });
      dy += rowH[i];
    });
    return c.toDataURL('image/png');
  }, rows.map((r) => r.filter((it) => it.file).map((it) => ({ ...it, src: b64(it.file) }))));
  fs.writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  await browser.close();
  console.log(`composite -> ${path.relative(process.cwd(), file)}`);
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
    const dims = items.map((it, i) => ({ w: imgs[i].width * it.scale, h: imgs[i].height * it.scale }));
    const c = document.createElement('canvas');
    c.width = dims.reduce((t, d) => t + d.w + pad, pad);
    c.height = Math.max(...dims.map((d) => d.h)) + 50;
    const x = c.getContext('2d');
    x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#ddd'; x.font = '13px sans-serif';
    let dx = pad;
    items.forEach((it, i) => {
      x.drawImage(imgs[i], dx, 34, dims[i].w, dims[i].h);
      x.fillText(it.label, dx, 20);
      dx += dims[i].w + pad;
    });
    return c.toDataURL('image/png');
  }, items.filter((it) => it.file).map((it) => ({ ...it, src: b64(it.file) })));
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
  const growthShots = {};
  const report = { labels: {}, stats: {}, type: {}, mainType: {}, grownD: {}, style: null };
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
        await run(engines[name], name, size, record, shots, report);
        await growth(engines[name], name, size, record, report, growthShots);
        if (name === 'chromium') forComposite[size] = shots;
      } catch (e) {
        console.log(`NOT RUN  ${key}: ${e.message.split('\n')[0]}`);
        tally[key].notRun = true;
      }
    }
  }
  // The grown branches the same in every engine and size.
  const ds = Object.values(report.grownD).map((d) => JSON.stringify(d));
  if (ds.length > 1) {
    const ok = ds.every((d) => d === ds[0]);
    results.push({ key: 'all', label: 'growth: the same grown branches in every engine and size', ok });
    console.log(`${ok ? 'PASS' : 'FAIL'}  growth: the same grown branches in every engine and size  (${Object.keys(report.grownD).join(', ')})`);
  }
  // Main's preview beside this one.
  const mainShots = {};
  for (const size of ['phone', 'desktop']) { mainShots[size] = {}; await mainPreview(size, mainShots[size], report); }
  if (SHOTS) {
    for (const size of ['phone', 'desktop']) {
      const b = forComposite[size], m = mainShots[size];
      if (!b) continue;
      const k = size === 'phone' ? 0.5 : 0.75;
      await grid(path.join(SHOTS, `composite-${size}.png`), [
        [
          { file: m.closed, scale: k, label: 'main (8431): every act closed' },
          { file: m.one, scale: k, label: 'main: Act One open' },
          { file: m.all, scale: k, label: 'main: every act open' },
        ],
        [
          { file: b.closed, scale: k, label: 'branch (8433): every act closed' },
          { file: b.one, scale: k, label: 'branch: Act One open' },
          { file: b.all, scale: k, label: 'branch: every act open' },
        ],
      ]);
    }
    if (growthShots.phone || growthShots.desktop) {
      await grid(path.join(SHOTS, 'composite-growth.png'), [
        [
          { file: growthShots.phone, scale: 0.5, label: 'test only: Act Three given 4 tips, 4 branches grown (phone)' },
          { file: growthShots.desktop, scale: 0.75, label: 'the same on a desktop' },
        ],
        [
          { file: growthShots.phonePlain, scale: 1, label: 'phone close-up, as drawn' },
          { file: growthShots.phoneMarked, scale: 1, label: 'the same, the grown branches marked yellow' },
          { file: growthShots.desktopPlain, scale: 1.5, label: 'desktop close-up, as drawn' },
          { file: growthShots.desktopMarked, scale: 1.5, label: 'marked' },
        ],
      ]);
    }
  }
  server.close();
  console.log('\nlabels (px on the screen at rest, and how far down the main root):');
  for (const [k, v] of Object.entries(report.labels)) console.log(`  ${k}: ${Object.entries(v).map(([n, x]) => `${n} ${r1(x.px)} px, ${r1(x.alongPx)} px down`).join('; ')}`);
  console.log('cards shrunk and slid, every act open:');
  for (const [k, v] of Object.entries(report.stats)) {
    console.log(`  ${k}: ${Object.entries(v).map(([n, st]) => `${n} ${st.cards} cards, ${st.shrunk} shrunk (to ${r2(Math.min(...st.fits))} at least), ${st.slid} slid (${st.slidesPx.map((d) => r1(d)).join(', ') || 'none'} px)${st.unresolved ? `, ${st.unresolved} unresolved` : ''}`).join('; ')}`);
  }
  console.log('the cards\' type at rest, every act open (min, median, max px):');
  for (const [k, v] of Object.entries(report.mainType)) console.log(`  main (8431) chromium ${k}: title ${v.title.map(r1).join(', ')}; line ${v.line.map(r1).join(', ')}`);
  for (const [k, v] of Object.entries(report.type)) console.log(`  branch ${k}: title ${v.title.map(r1).join(', ')}; line ${v.line.map(r1).join(', ')}`);
  if (report.style) {
    const st = report.style, deg = (r) => r1((r * 180) / Math.PI);
    console.log(`grown branches drawn as the trace measures: forks ${deg(st.forkAngle[0])} to ${deg(st.forkAngle[1])} deg, last branches ${r1(st.length[0])} to ${r1(st.length[1])} px, parts ${r1(st.partLength)} px, width ${r2(st.widthRatio)} of the parent's from ${r1(st.startWidth[0])} to ${r1(st.startWidth[1])} down to ${r1(st.tipWidth)}, no more than ${deg(st.outward)} deg from straight out, grey ${r1(st.grey.a)} + ${r2(st.grey.b)} x width`);
  }
  console.log('\nsummary');
  for (const [k, t] of Object.entries(tally)) console.log(`  ${k}: ${t.notRun ? 'NOT RUN' : `${t.pass} pass, ${t.fail} fail`}`);
  const failed = results.filter((r) => !r.ok).length;
  const notRun = Object.values(tally).filter((t) => t.notRun).length;
  console.log(`\n${results.length - failed} PASS, ${failed} FAIL${notRun ? `, ${notRun} NOT RUN` : ''}`);
  process.exit(failed || notRun ? 1 : 0);
})();

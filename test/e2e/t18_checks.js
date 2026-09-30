// Browser checks for a built site: edges, labels, the first screen, and the
// ring layout. Chromium and WebKit, desktop (1280x800) and phone (390x844,
// touch).
//
//   node test/e2e/t18_checks.js [path/to/_site] [act-id-prefix]
//
// Defaults are the Elinor Jones site: Act 1 (ids eoej-a1-), which the site
// frames on first load.
// Prints a markdown table: engine x size x check.

const path = require('path');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PREFIX = process.argv[3] || 'eoej-a1-';
const PORT = 39434;
const BASE = `http://localhost:${PORT}/`;

async function settle(page, ms = 5500) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForTimeout(ms);
}

// Edges drawn on screen, with their endpoints and label.
const visibleEdges = (page) => page.evaluate(() => [...document.querySelectorAll('path.link')]
  .filter((e) => getComputedStyle(e).display !== 'none' && e.getAttribute('d') && e.getAttribute('d') !== 'M 0 0')
  .map((e) => {
    const d = e.__data__;
    const id = (n) => (typeof n === 'object' ? n.id : n);
    return { source: id(d.source), target: id(d.target), label: e.getAttribute('data-label') || '' };
  }));

// Screen boxes of every visible container label and every visible card.
const boxes = (page) => page.evaluate(() => {
  const vis = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (getComputedStyle(e).display === 'none') return false;
    }
    return true;
  };
  const box = (r) => ({ x0: r.left, y0: r.top, x1: r.right, y1: r.bottom });
  const labels = [...document.querySelectorAll('.container-group')]
    .map((g) => ({ id: g.getAttribute('data-container-id'), el: g.querySelector('.container-badge-text') }))
    .filter((l) => l.el && vis(l.el))
    .map((l) => ({ id: l.id, ...box(l.el.getBoundingClientRect()) }))
    .filter((b) => b.x1 > b.x0);
  const cards = [...document.querySelectorAll('.node-card')]
    .filter((c) => vis(c))
    .map((c) => ({ id: c.__data__.id, ...box(c.getBoundingClientRect()) }));
  return { labels, cards };
});
const overlap = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

async function labelChecks(page, record, when) {
  const { labels, cards } = await boxes(page);
  const ll = [];
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) if (overlap(labels[i], labels[j])) ll.push(labels[i].id + ' / ' + labels[j].id);
  }
  record(`no two labels overlap (${when})`, ll.length === 0, ll.length ? ll.slice(0, 3).join(', ') : `${labels.length} labels`);
  const lc = [];
  for (const l of labels) for (const c of cards) if (overlap(l, c)) lc.push(l.id + ' on ' + c.id);
  record(`no label overlaps a card (${when})`, lc.length === 0, lc.length ? lc.slice(0, 3).join(', ') : `${cards.length} cards`);
}

// For every container, no hull of a container that neither is it nor holds
// it covers any of its cards (corners and centre, in graph coordinates).
const hullIntrusions = (page) => page.evaluate(() => {
  const groups = [...document.querySelectorAll('.container-group')];
  const byId = new Map(groups.map((g) => [g.getAttribute('data-container-id'), g.__data__]));
  const ancestors = (id) => {
    const out = new Set([id]);
    let p = byId.get(id) && byId.get(id).parent;
    while (p && !out.has(p)) { out.add(p); p = byId.get(p) && byId.get(p).parent; }
    return out;
  };
  const hulls = groups
    .filter((g) => getComputedStyle(g).display !== 'none')
    .map((g) => ({ id: g.getAttribute('data-container-id'), path: g.querySelector('.container-hull') }))
    .filter((h) => h.path && getComputedStyle(h.path).display !== 'none' && h.path.getAttribute('d'));
  const cards = [...document.querySelectorAll('.node-card')]
    .filter((c) => getComputedStyle(c).display !== 'none')
    .map((c) => c.__data__);
  const tagOf = new Map([...byId.values()].filter((c) => c && c.tag).map((c) => [c.id, c.tag]));
  // A card belongs to the deepest container whose tag it carries.
  const home = (d) => {
    let best = null; let depth = -1;
    for (const [id, tag] of tagOf) {
      if (!(d.tags || []).includes(tag)) continue;
      const k = ancestors(id).size;
      if (k > depth) { depth = k; best = id; }
    }
    return best;
  };
  const svg = document.querySelector('svg');
  const bad = [];
  let tested = 0;
  // Positive control: a card's own container's hull does hold its centre.
  let held = 0;
  let own = 0;
  for (const d of cards) {
    const c = home(d);
    if (!c) continue;
    const mine = ancestors(c);
    const pts = [[0, 0], [-90, -70], [90, -70], [90, 70], [-90, 70]].map(([dx, dy]) => {
      const p = svg.createSVGPoint(); p.x = d.x + dx; p.y = d.y + dy; return p;
    });
    for (const h of hulls) {
      if (h.id === c) { own++; if (h.path.isPointInFill(pts[0])) held++; }
      if (mine.has(h.id)) continue;
      tested++;
      if (pts.some((p) => h.path.isPointInFill(p))) bad.push(`${h.id} over ${d.id}`);
    }
  }
  return { bad, tested, held, own };
});

async function run(browserType, engineName, size) {
  const phone = size === 'phone';
  const browser = await browserType.launch();
  const ctxOpts = phone
    ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engineName === 'chromium' }
    : { viewport: { width: 1280, height: 800 } };
  const results = [];
  const record = (check, ok, note = '') => results.push({ engine: engineName, size, check, ok, note });
  const errors = [];
  const context = await browser.newContext(ctxOpts);
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await settle(page);

  // ── edges ──
  const edges = await visibleEdges(page);
  const act = edges.filter((e) => e.source.startsWith(PREFIX) && e.target.startsWith(PREFIX));
  record('act shows 10 visible edges', act.length === 10, `${act.length} in the act, ${edges.length} in all`);
  record('every visible edge is a labelled next', edges.every((e) => e.label === 'next'), [...new Set(edges.map((e) => e.label))].join(', '));

  // Hover (desktop) or tap (phone) the middle of the act's first edge.
  const mid = await page.evaluate((prefix) => {
    const el = [...document.querySelectorAll('path.link-hit')].find((e) => {
      const d = e.__data__;
      return d.source.id && d.source.id.startsWith(prefix) && d.target.id.startsWith(prefix);
    });
    if (!el) return null;
    const p = el.getPointAtLength(el.getTotalLength() / 2);
    const m = el.getScreenCTM();
    return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f };
  }, PREFIX);
  if (mid) {
    if (phone) await page.touchscreen.tap(mid.x, mid.y);
    else await page.mouse.move(mid.x, mid.y);
    await page.waitForTimeout(300);
    const shown = await page.evaluate(() => {
      const g = document.querySelector('.edge-label');
      return g && g.style.display !== 'none' ? g.textContent : null;
    });
    record(`edge says what it is on ${phone ? 'tap' : 'hover'}`, shown === 'next', shown || 'no label');
    if (!phone) await page.mouse.move(5, 400);
  } else {
    record(`edge says what it is on ${phone ? 'tap' : 'hover'}`, false, 'no edge found');
  }

  // ── first screen ──
  const first = await page.evaluate((prefix) => {
    const k = Number((document.querySelector('.cards-transform').style.transform.match(/scale\(([\d.]+)\)/) || [])[1]);
    const cards = [...document.querySelectorAll('.node-card')].filter((c) => c.__data__.id.startsWith(prefix));
    const r = cards.map((c) => c.getBoundingClientRect());
    return {
      k, n: cards.length,
      minW: Math.min(...r.map((b) => b.width)),
      inView: r.filter((b) => b.left + b.width / 2 >= 0 && b.left + b.width / 2 <= innerWidth && b.top + b.height / 2 >= 0 && b.top + b.height / 2 <= innerHeight).length,
    };
  }, PREFIX);
  record('first load: act cards are cards, not dots', first.minW >= 50, `scale ${first.k.toFixed(2)}, narrowest card ${Math.round(first.minW)}px`);
  record('first load: every act card on screen', first.inView === first.n, `${first.inView} of ${first.n}`);

  await labelChecks(page, record, 'first screen');
  let hi = await hullIntrusions(page);
  record('cluster: no hull over a card it does not hold', hi.bad.length === 0, hi.bad.slice(0, 3).join(', ') || `${hi.tested} pairs`);

  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:zoom-to-fit')));
  await page.waitForTimeout(1200);
  await labelChecks(page, record, 'zoom to fit');

  // ── ring ──
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'ring').click());
  await page.waitForTimeout(2500);
  hi = await hullIntrusions(page);
  record('ring: no hull over a ring it does not hold', hi.bad.length === 0, hi.bad.slice(0, 3).join(', ') || `${hi.tested} pairs`);
  record('ring: each hull holds its own ring (control)', hi.own > 0 && hi.held === hi.own, `${hi.held} of ${hi.own}`);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:zoom-to-fit')));
  await page.waitForTimeout(1200);
  await labelChecks(page, record, 'ring');
  const ringEdges = (await visibleEdges(page)).filter((e) => e.source.startsWith(PREFIX) && e.target.startsWith(PREFIX));
  record('ring: act shows 10 visible edges', ringEdges.length === 10, `${ringEdges.length}`);

  // Back to cluster: the spiral again.
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'cluster').click());
  await page.waitForTimeout(3000);
  hi = await hullIntrusions(page);
  record('back to cluster: no hull over a card it does not hold', hi.bad.length === 0, hi.bad.slice(0, 3).join(', ') || `${hi.tested} pairs`);

  record('no page errors', errors.length === 0, errors.slice(0, 3).join(' / '));
  await context.close();
  await browser.close();
  return results;
}

const server = http.createServer((req, res) => handler(req, res, {
  public: SITE,
  headers: [{ source: '**', headers: [{ key: 'Cache-Control', value: 'no-store' }] }],
}));

server.listen(PORT, async () => {
  const all = [];
  try {
    for (const [bt, name] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
      for (const size of ['desktop', 'phone']) {
        all.push(...(await run(bt, name, size)));
      }
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    server.close();
  }
  console.log('| engine | size | check | result | note |');
  console.log('|---|---|---|---|---|');
  for (const r of all) {
    const res = r.ok === null ? 'n/a' : r.ok ? 'PASS' : 'FAIL';
    console.log(`| ${r.engine} | ${r.size} | ${r.check} | ${res} | ${r.note} |`);
  }
  if (all.some((r) => r.ok === false)) process.exitCode = 1;
});

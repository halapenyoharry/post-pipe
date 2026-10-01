// Browser checks for the opening (settings.opening) on a built site: the
// cover first on a fresh profile; a tap, the dwell, a scroll and a key play
// it; skip and Escape end it at once; the byline navigates and does not
// play; a profile with stored progress sees the graph with no layer; the
// panel's "Show the opening again" mounts it; after the play the roots that
// drew in recede and the graph is interactive (a card opens); reduced
// motion fades only; nothing from elsewhere and no page errors. Chromium and
// WebKit, desktop (1280x800) and phone (390x844). Screenshots go to
// PP_E2E_SHOTS when set.
//
//   node test/e2e/t24_checks.js [path/to/_site]
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
const PORT = 39441;
const BASE = `http://localhost:${PORT}/`;
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const OPENING = SETTINGS.opening;
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SINGLE = process.env.PP_E2E_SINGLE_PROCESS === '1';
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const CORPUS = FEED.feed_url || FEED.home_page_url || 'corpus';
const ACT1 = FEED.items.filter((i) => /a1-/.test(i.id)).sort((a, b) => a.series_part - b.series_part);
const FIRST = ACT1[0];
const PLAY_MS = 1600;

function viewstate(extra = {}) {
  return {
    version: 1, corpusId: CORPUS, layoutVersion: 'per-layout-positions-5', layout: 'force',
    hiddenSources: [], sourceColors: {}, graphColors: {}, colorProfileId: null,
    paragraphIndent: false, paragraphSpace: true, readerAids: {}, prefs: {},
    nodes: {}, timeAxis: { on: false, x: 0, y: -1000 }, reading: {}, bookmarks: [],
    ...extra,
  };
}

// A returning reader: chapter one read part of the way.
const returning = () => viewstate({ reading: { [FIRST.id]: { scroll: 300, at: 0.4, max: 0.4, seenAt: 1, t: 1 } } });

// Every frame, the layer's phase when it changes, and the roots' states.
function watchOpening() {
  window.__opening = { phases: [], glimpse: 0, taproot: false };
  let last = null;
  const t0 = performance.now();
  const tick = () => {
    const el = document.querySelector('[data-opening]');
    const ph = el ? el.getAttribute('data-phase') : 'gone';
    if (ph !== last) { window.__opening.phases.push([ph, Math.round(performance.now() - t0)]); last = ph; }
    const g = document.querySelectorAll('.root[data-state="glimpse"]:not([style*="display: none"])').length;
    if (g > window.__opening.glimpse) window.__opening.glimpse = g;
    const tap = document.querySelector('.root[data-root="opening"]');
    if (tap && tap.style.display !== 'none' && tap.querySelector('.root-main').getAttribute('d')) window.__opening.taproot = true;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

async function open(bt, name, size, { seed, reduced = false, wait = true } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch(name === 'chromium' && SINGLE ? { args: ['--single-process', '--no-zygote'] } : {});
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: 'light',
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  if (seed) {
    await ctx.addInitScript((vs) => {
      if (sessionStorage.getItem('t24-seeded')) return;
      sessionStorage.setItem('t24-seeded', '1');
      localStorage.setItem('post-pipe:viewstate', vs);
    }, JSON.stringify(seed));
  }
  await ctx.addInitScript(watchOpening);
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  await page.goto(BASE);
  if (wait) {
    await page.waitForSelector('.container-group', { state: 'attached' });
    await page.waitForTimeout(600);
  }
  return { browser, ctx, page, errors, outside, phone, name };
}

const layerInfo = (page) => page.evaluate(() => {
  const el = document.querySelector('[data-opening]');
  if (!el) return null;
  const img = el.querySelector('img:not([data-opening-broken])');
  const r = el.getBoundingClientRect();
  const ir = el.querySelector('[data-opening-frame]').getBoundingClientRect();
  const by = el.querySelector('[data-opening-byline]');
  const br = by ? by.getBoundingClientRect() : null;
  const skip = el.querySelector('[data-opening-skip]');
  const cs = getComputedStyle(el);
  // What is on top at a few points: the layer, or something of the graph.
  const pts = [[0.5, 0.5], [0.1, 0.1], [0.9, 0.9], [0.05, 0.5]].map(([x, y]) => document.elementFromPoint(innerWidth * x, innerHeight * y));
  return {
    W: innerWidth, H: innerHeight,
    covers: r.left <= 0 && r.top <= 0 && r.right >= innerWidth && r.bottom >= innerHeight,
    onTop: pts.every((p) => p && p.closest('[data-opening]')),
    opacity: cs.opacity, bg: cs.backgroundColor, bgImage: cs.backgroundImage.slice(0, 20),
    phase: el.getAttribute('data-phase'),
    role: el.getAttribute('role'), label: el.getAttribute('aria-label'),
    alt: img && img.getAttribute('alt'), loaded: !!img && img.complete && img.naturalWidth > 0, src: img && img.getAttribute('src'),
    natural: img ? [img.naturalWidth, img.naturalHeight] : null,
    frame: { x0: ir.left, y0: ir.top, x1: ir.right, y1: ir.bottom },
    byline: br ? { x0: br.left, y0: br.top, x1: br.right, y1: br.bottom, text: by.textContent, href: by.getAttribute('href'), font: getComputedStyle(by).fontFamily, scrim: getComputedStyle(by).backgroundColor } : null,
    skip: skip ? { text: skip.textContent, focused: document.activeElement === skip, r: skip.getBoundingClientRect().toJSON() } : null,
  };
});

const phases = (page) => page.evaluate(() => window.__opening);

// A point on the layer away from the byline and the skip control.
const bare = (info) => ({ x: info.W * 0.5, y: info.H * 0.32 });

async function tapAt(s, p) {
  if (s.phone) await s.page.touchscreen.tap(p.x, p.y); else await s.page.mouse.click(p.x, p.y);
}

async function shot(s, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await s.page.screenshot({ path: path.join(SHOTS, `${name}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
}

// A card opens on a tap once the layer is gone.
async function opensCard(s) {
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

const seenStored = (page) => page.evaluate(() => {
  const vs = JSON.parse(localStorage.getItem('post-pipe:viewstate') || 'null');
  return !!(vs && vs.opening && vs.opening.seenAt);
});

function playedRows(ph, label, record, { reduced = false } = {}) {
  // Before the page mounts the layer there is none: leave that out.
  const seen = ph.phases.slice(ph.phases.findIndex((p) => p[0] !== 'gone'));
  const names = seen.map((p) => p[0]);
  const gone = seen.length > 1 && names[names.length - 1] === 'gone' ? seen[seen.length - 1] : null;
  if (reduced) {
    record(`${label}: reduced motion fades only`, names.includes('fade') && !names.includes('broken') && !names.includes('dissolve'), names.join(' > '));
  } else {
    record(`${label}: breaks up, then blurs and fades`, names.indexOf('broken') >= 0 && names.indexOf('dissolve') > names.indexOf('broken'), names.join(' > '));
  }
  record(`${label}: the layer is removed at the end`, !!gone, seen.map((p) => `${p[0]}@${p[1]}`).join(' '));
  return gone;
}

async function run(bt, name, size, record) {
  // ── a fresh profile: the cover first, then a tap ──
  let s = await open(bt, name, size);
  try {
    const info = await layerInfo(s.page);
    record('fresh: the cover shows first', !!info && info.covers && info.onTop && info.phase === 'idle', info ? `covers ${info.covers}, on top ${info.onTop}, phase ${info.phase}` : 'no layer');
    if (!info) throw new Error('no opening layer');
    await s.page.waitForFunction(() => { const i = document.querySelector('[data-opening] img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 5000 }).catch(() => {});
    const info2 = await layerInfo(s.page);
    record('fresh: the image is the site\'s cover, loaded, with its alt', info2.loaded && info2.src === OPENING.image && info2.alt === OPENING.alt, `${info2.src} ${info2.natural && info2.natural.join('x')} alt "${info2.alt}"`);
    record('fresh: nothing of the graph shows through', info2.opacity === '1' && !/rgba\(.*, 0\)|transparent/.test(info2.bg), `opacity ${info2.opacity}, ${info2.bg}, ${info2.bgImage}`);
    record('fresh: a dialog labelled by the alt, focus on skip', info2.role === 'dialog' && info2.label === OPENING.alt && info2.skip && info2.skip.focused, `${info2.role} "${info2.label}", skip focused ${info2.skip && info2.skip.focused}`);
    const f = info2.frame, b = info2.byline;
    const inBand = b && b.x0 >= f.x0 && b.x1 <= f.x1 && b.y1 <= f.y1 + 1 && b.y0 >= f.y1 - (f.y1 - f.y0) * 0.12 - 1;
    const centred = b && Math.abs((b.x0 + b.x1) / 2 - (f.x0 + f.x1) / 2) < 2;
    record('fresh: byline inside the image, bottom 12%, centred', !!(inBand && centred), b ? `"${b.text}" ${Math.round(b.y0)}–${Math.round(b.y1)} in image ${Math.round(f.y0)}–${Math.round(f.y1)}, ${b.font.split(',')[0]}, scrim ${b.scrim}` : 'no byline');
    record('fresh: skip is small, top right', !!info2.skip && info2.skip.text === OPENING.skipLabel && info2.skip.r.right > info2.W - 60 && info2.skip.r.top < 60 && info2.skip.r.height <= 44, info2.skip ? `"${info2.skip.text}" at ${Math.round(info2.skip.r.left)},${Math.round(info2.skip.r.top)} ${Math.round(info2.skip.r.width)}x${Math.round(info2.skip.r.height)}` : 'none');
    await shot(s, 'cover');

    await tapAt(s, bare(info2));
    await s.page.waitForTimeout(PLAY_MS * 0.55);
    await shot(s, 'dissolving');
    await s.page.waitForFunction(() => !document.querySelector('[data-opening]'), null, { timeout: 4000 }).catch(() => {});
    const ph = await phases(s.page);
    const gone = playedRows(ph, `fresh, ${s.phone ? 'tap' : 'click'}`, record);
    const start = ph.phases.find((p) => p[0] === 'broken');
    record(`fresh, ${s.phone ? 'tap' : 'click'}: about 1.6 s`, !!(gone && start) && gone[1] - start[1] > 1300 && gone[1] - start[1] < 2300, gone && start ? `${gone[1] - start[1]}ms` : 'n/a');
    record('fresh: the roots draw in as it dissolves', ph.glimpse > 0, `${ph.glimpse} roots`);
    record('fresh: the roots start at the bottom of the screen (rootsOrigin)', ph.taproot === (SETTINGS.graph.rootsOrigin === 'viewport-bottom'), `taproot ${ph.taproot}, rootsOrigin ${SETTINGS.graph.rootsOrigin}`);
    await shot(s, 'after-play');
    const card = await opensCard(s);
    record('fresh: after the play the graph is interactive (a card opens)', card.ok, card.note);
    await s.page.waitForTimeout(4000);
    const left = await s.page.evaluate(() => document.querySelectorAll('.root[data-state="glimpse"]:not([style*="display: none"])').length);
    record('fresh: the roots not yet reached recede afterwards', left === 0, `${left} still shown`);
    record('fresh: seeing it is stored', await seenStored(s.page), '');
    await s.page.evaluate(() => sessionStorage.clear());
    await s.page.reload();
    await s.page.waitForSelector('.container-group', { state: 'attached' });
    await s.page.waitForTimeout(800);
    const again = await s.page.evaluate(() => !!document.querySelector('[data-opening]'));
    record('fresh: once seen, a reload goes straight to the graph', !again, again ? 'layer shown again' : 'no layer');
    record('fresh: nothing fetched from outside', s.outside.length === 0, s.outside.slice(0, 2).join(' '));
    record('fresh: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }

  // ── dwell ──
  s = await open(bt, name, size);
  try {
    await s.page.waitForTimeout(OPENING.dwellMs - 1200);
    const still = await layerInfo(s.page);
    record('dwell: idle before dwellMs', !!still && still.phase === 'idle', still ? still.phase : 'no layer');
    await s.page.waitForFunction(() => !document.querySelector('[data-opening]'), null, { timeout: OPENING.dwellMs + 4000 }).catch(() => {});
    const ph = await phases(s.page);
    const gone = playedRows(ph, 'dwell', record);
    const start = ph.phases.find((p) => p[0] === 'broken');
    record('dwell: plays by itself after dwellMs', !!start && start[1] >= OPENING.dwellMs - 200 && start[1] < OPENING.dwellMs + 1500, start ? `started at ${start[1]}ms` : 'did not start');
    record('dwell: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }

  // ── scroll: a wheel on a desktop, a touch scroll on a phone ──
  s = await open(bt, name, size);
  try {
    const info = await layerInfo(s.page);
    if (s.phone) {
      await s.page.evaluate(() => {
        const el = document.querySelector('[data-opening-frame]');
        let ev;
        try {
          const t = new Touch({ identifier: 1, target: el, clientX: 200, clientY: 500 });
          ev = new TouchEvent('touchmove', { bubbles: true, cancelable: true, touches: [t], changedTouches: [t] });
        } catch (_) { ev = new Event('touchmove', { bubbles: true, cancelable: true }); }
        el.dispatchEvent(ev);
      });
    } else {
      await s.page.mouse.move(info.W / 2, info.H / 3);
      await s.page.mouse.wheel(0, 240);
    }
    await s.page.waitForFunction(() => !document.querySelector('[data-opening]'), null, { timeout: 4000 }).catch(() => {});
    const ph = await phases(s.page);
    playedRows(ph, s.phone ? 'touch scroll' : 'wheel', record);
    record(`${s.phone ? 'touch scroll' : 'wheel'}: no page errors`, s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }

  // ── skip ──
  s = await open(bt, name, size);
  try {
    const t0 = Date.now();
    if (s.phone) await s.page.tap('[data-opening-skip]'); else await s.page.click('[data-opening-skip]');
    await s.page.waitForFunction(() => !document.querySelector('[data-opening]'), null, { timeout: 2000 }).catch(() => {});
    const ms = Date.now() - t0;
    await s.page.waitForTimeout(150);
    const ph = await phases(s.page);
    const names = ph.phases.map((p) => p[0]).filter((n, i, a) => !(i === 0 && n === 'gone' && a.length > 1));
    record('skip: ends at once, nothing plays', names.join(' > ') === 'idle > gone' && ms < 600, `${names.join(' > ')} in ${ms}ms`);
    await s.page.waitForTimeout(300);
    record('skip: seeing it is stored', await seenStored(s.page), '');
    const card = await opensCard(s);
    record('skip: the graph is interactive', card.ok, card.note);
    record('skip: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }

  // ── the byline ──
  s = await open(bt, name, size);
  try {
    const target = new URL(OPENING.byline.href, BASE).pathname.replace(/\/$/, '');
    const nav = s.page.waitForURL((u) => new URL(u).pathname.replace(/\/$/, '') === target, { timeout: 5000 }).then(() => true).catch(() => false);
    const before = await phases(s.page);
    const bp = await s.page.evaluate(() => { const r = document.querySelector('[data-opening-byline]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const phaseAtClick = await s.page.evaluate(() => {
      const el = document.querySelector('[data-opening]');
      window.__bylinePhases = [];
      new MutationObserver(() => window.__bylinePhases.push(el.getAttribute('data-phase'))).observe(el, { attributes: true, attributeFilter: ['data-phase'] });
      return el.getAttribute('data-phase');
    });
    await tapAt(s, bp);
    const navigated = await nav;
    const url = s.page.url();
    const expect = new URL(OPENING.byline.href, BASE).href;
    record('byline: follows the link', navigated && url.replace(/\/$/, '') === expect.replace(/\/$/, ''), url);
    record('byline: does not play the opening', phaseAtClick === 'idle' && !before.phases.some((p) => ['broken', 'dissolve', 'fade'].includes(p[0])), `phase ${phaseAtClick} when tapped`);
    record('byline: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }

  // ── a returning reader ──
  s = await open(bt, name, size, { seed: returning() });
  try {
    await s.page.waitForTimeout(OPENING.dwellMs);
    const ph = await phases(s.page);
    const ever = ph.phases.some((p) => p[0] !== 'gone');
    record('stored progress: the graph, no layer', !ever, ph.phases.map((p) => p[0]).join(' > '));
    const reached = await s.page.evaluate(() => document.querySelectorAll('.root[data-state="seen"]:not([style*="display: none"])').length);
    record('stored progress: their own roots are there', reached > 0, `${reached} reached`);
    await shot(s, 'returning');

    // The panel shows it again; a key plays it.
    if (s.phone) await s.page.tap('[data-settings-gear]'); else await s.page.click('[data-settings-gear]');
    await s.page.waitForTimeout(500);
    const btn = await s.page.evaluate(() => { const b = document.querySelector('[data-show-opening]'); return b ? b.textContent : null; });
    record('panel: "Show the opening again" is in View', btn === 'Show the opening again', btn || 'not there');
    if (btn) {
      await s.page.evaluate(() => document.querySelector('[data-show-opening]').scrollIntoView({ block: 'center' }));
      if (s.phone) await s.page.tap('[data-show-opening]'); else await s.page.click('[data-show-opening]');
      await s.page.waitForTimeout(400);
      const info = await layerInfo(s.page);
      record('panel: it mounts the opening, waiting for input', !!info && info.phase === 'idle' && info.covers && info.onTop, info ? `phase ${info.phase}, focus on skip ${info.skip && info.skip.focused}` : 'no layer');
      await s.page.evaluate(() => { window.__opening.phases = []; });
      await s.page.keyboard.press('ArrowDown');
      await s.page.waitForFunction(() => !document.querySelector('[data-opening]'), null, { timeout: 4000 }).catch(() => {});
      playedRows(await phases(s.page), 'panel, then a key', record);
      const reader = await s.page.evaluate(() => location.hash);
      record('panel, then a key: the key does nothing else', reader === '', `hash "${reader}"`);

      // Again, and Escape skips.
      if (s.phone) await s.page.tap('[data-settings-gear]'); else await s.page.click('[data-settings-gear]');
      await s.page.waitForTimeout(500);
      await s.page.evaluate(() => document.querySelector('[data-show-opening]').scrollIntoView({ block: 'center' }));
      if (s.phone) await s.page.tap('[data-show-opening]'); else await s.page.click('[data-show-opening]');
      await s.page.waitForTimeout(300);
      await s.page.evaluate(() => { window.__opening.phases = []; });
      const t0 = Date.now();
      await s.page.keyboard.press('Escape');
      await s.page.waitForFunction(() => !document.querySelector('[data-opening]'), null, { timeout: 2000 }).catch(() => {});
      const ms = Date.now() - t0;
      await s.page.waitForTimeout(150);
      // The log was emptied with the layer idle, so all it can hold is its end.
      const names = (await phases(s.page)).phases.map((p) => p[0]);
      record('Escape: skips at once', names.join(' > ') === 'gone' && ms < 600, `idle > ${names.join(' > ')} in ${ms}ms`);
    }
    const card = await opensCard(s);
    record('stored progress: the graph is interactive', card.ok, card.note);
    record('stored progress: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }

  // ── reduced motion ──
  s = await open(bt, name, size, { reduced: true });
  try {
    const info = await layerInfo(s.page);
    await tapAt(s, bare(info));
    await s.page.waitForFunction(() => !document.querySelector('[data-opening]'), null, { timeout: 3000 }).catch(() => {});
    const ph = await phases(s.page);
    const gone = playedRows(ph, 'reduced motion', record, { reduced: true });
    const start = ph.phases.find((p) => p[0] === 'fade');
    record('reduced motion: about 300 ms', !!(gone && start) && gone[1] - start[1] < 700, gone && start ? `${gone[1] - start[1]}ms` : 'n/a');
    record('reduced motion: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }
}

(async () => {
  const server = http.createServer((req, res) => handler(req, res, { public: SITE })).listen(PORT);
  const rows = [];
  const engines = { chromium, webkit };
  if (!OPENING || !OPENING.enabled) { console.log('this build has no opening'); process.exit(1); }
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

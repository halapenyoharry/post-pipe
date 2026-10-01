// Browser checks for T21: double-tap zoom, reader navigation and the panel,
// time of day, reading progress on the nodes, roots, the sketchbook theme,
// and "revisions". Chromium and WebKit, desktop (1280x800) and phone
// (390x844). Screenshots go to _handoff/T21-shots/ when PP_E2E_SHOTS is set.
//
//   node test/e2e/t21_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines; PP_E2E_PARTS=0,6 picks parts.
// An engine that cannot start is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const SETTINGS = JSON.parse(fs.readFileSync(path.join(SITE, '..', 'settings.json'), 'utf8'));
const PORT = 39437;
const BASE = `http://localhost:${PORT}/`;
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const byPart = (n) => FEED.items.find((i) => i.series_part === n && /a1-/.test(i.id));
const FIRST = byPart(1);
const SECOND = byPart(2);
const ACT = (FEED.containers || []).find((c) => c.parent && /act-1/.test(c.id));
const READ = (item) => BASE + '#read=' + encodeURIComponent(item.id);
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const PARTS = process.env.PP_E2E_PARTS ? process.env.PP_E2E_PARTS.split(',').map((s) => s.trim()) : null;
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const slugOf = (item) => item.id.split('/').pop().replace('.html', '');

async function open(bt, name, size, url, { width, colorScheme, storage } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: width || 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: width || 1280, height: 800 } }),
    colorScheme: colorScheme || 'dark',
  });
  if (storage) await ctx.addInitScript((s) => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, storage);
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  await page.goto(url);
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForTimeout(4500);
  return { browser, ctx, page, errors, outside, phone, name };
}

const view = (page) => page.evaluate(() => {
  const g = document.querySelector('svg > g:not(.time-axis-layer)').getAttribute('transform');
  const m = /translate\(([-\d.e]+),([-\d.e]+)\) rotate\(([-\d.e]+)\) scale\(([-\d.e]+)\)/.exec(g);
  return m ? { x: +m[1], y: +m[2], rot: +m[3], k: +m[4] } : null;
});

// What is going on that a stray tap could have changed.
const snapshot = (page) => page.evaluate(() => ({
  containers: JSON.stringify(window.PostPipeGraph.getContainerState()),
  pinned: [...document.querySelectorAll('.node-card div[data-popout="1"]')].length,
  reader: location.hash.startsWith('#read='),
}));

// A point on screen whose top element matches `kind`: empty canvas (the svg
// itself), a hull, a card, or a container title.
const findPoint = (page, kind, prefix) => page.evaluate(([kind, prefix]) => {
  const W = innerWidth, H = innerHeight;
  const ok = (el) => {
    if (!el) return false;
    if (kind === 'canvas') return el.tagName === 'svg';
    if (kind === 'hull') return el.tagName === 'svg' || (el.classList && el.classList.contains('container-hull'));
    if (kind === 'card') { const c = el.closest && el.closest('.node-card'); return !!c && (!prefix || c.__data__.id.startsWith(prefix)) && !el.closest('[data-popout]'); }
    if (kind === 'title') return el.classList && el.classList.contains('container-badge-hit');
    return false;
  };
  if (kind === 'card' || kind === 'title') {
    const els = kind === 'card' ? [...document.querySelectorAll('.node-card')] : [...document.querySelectorAll('.container-badge-hit')];
    for (const e of els) {
      const r = e.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (x > 20 && y > 60 && x < W - 20 && y < H - 120 && ok(document.elementFromPoint(x, y))) return { x, y };
    }
    return null;
  }
  // Inside a hull's outline (hulls take no pointer of their own, so the
  // canvas is what is under it), or outside every hull for the canvas.
  const hulls = [...document.querySelectorAll('.container-hull')].filter((h) => h.getAttribute('d') && getComputedStyle(h).display !== 'none');
  const inHull = (x, y) => hulls.some((h) => { const m = h.getScreenCTM().inverse(); const q = new DOMPoint(x, y).matrixTransform(m); const sp = h.ownerSVGElement.createSVGPoint(); sp.x = q.x; sp.y = q.y; return h.isPointInFill(sp); });
  for (let y = 80; y < H - 140; y += 23) for (let x = 30; x < W - 30; x += 29) {
    if (!ok(document.elementFromPoint(x, y))) continue;
    if (kind === 'hull' && inHull(x, y)) return { x, y };
    if (kind === 'canvas' && !inHull(x, y)) return { x, y };
  }
  return null;
}, [kind, prefix || '']);

async function doubleAt(s, p, { shift = false } = {}) {
  if (s.phone) {
    await s.page.touchscreen.tap(p.x, p.y);
    await s.page.waitForTimeout(60);
    await s.page.touchscreen.tap(p.x, p.y);
  } else {
    // A pointer hovers before it clicks; the card redraws on hover.
    await s.page.mouse.move(p.x, p.y);
    await s.page.waitForTimeout(300);
    if (shift) await s.page.keyboard.down('Shift');
    await s.page.mouse.dblclick(p.x, p.y);
    if (shift) await s.page.keyboard.up('Shift');
  }
  await s.page.waitForTimeout(800);
}

async function singleAt(s, p) {
  if (s.phone) await s.page.touchscreen.tap(p.x, p.y);
  else { await s.page.mouse.move(p.x, p.y); await s.page.waitForTimeout(300); await s.page.mouse.click(p.x, p.y); }
  await s.page.waitForTimeout(900);
}

// ── 0. double-tap zooms ────────────────────────────────────────────────────
async function part0(bt, name, size, record) {
  const s = await open(bt, name, size, BASE);
  const { page } = s;
  try {
    for (const kind of ['canvas', 'hull', 'card', 'title']) {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
      await page.waitForTimeout(1500);
      const p = await findPoint(page, kind);
      if (!p) { record(`0 double-${s.phone ? 'tap' : 'click'} on ${kind} zooms in`, false, 'no such point on screen'); continue; }
      const before = await view(page);
      const snap = await snapshot(page);
      await doubleAt(s, p);
      const after = await view(page);
      const snap2 = await snapshot(page);
      const ratio = after.k / before.k;
      // The point under the finger stays put (within a few pixels).
      const under = await page.evaluate(([bx, by, b, a]) => {
        const gx = (bx - b.x) / b.k, gy = (by - b.y) / b.k;
        return Math.hypot(a.x + gx * a.k - bx, a.y + gy * a.k - by);
      }, [p.x, p.y, before, after]);
      record(`0 double-${s.phone ? 'tap' : 'click'} on ${kind} zooms in about 2x at the point`, ratio > 1.8 && ratio < 2.2 && under < 4, `x${ratio.toFixed(2)}, point moved ${under.toFixed(1)}px`);
      record(`0 double-${s.phone ? 'tap' : 'click'} on ${kind} opens and toggles nothing`, JSON.stringify(snap) === JSON.stringify(snap2), JSON.stringify(snap) === JSON.stringify(snap2) ? 'unchanged' : JSON.stringify(snap2));
    }

    if (!s.phone) {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
      await page.waitForTimeout(1500);
      const p = await findPoint(page, 'canvas');
      const before = await view(page);
      await doubleAt(s, p, { shift: true });
      const after = await view(page);
      record('0 shift+double-click zooms out', after.k / before.k > 0.45 && after.k / before.k < 0.55, `x${(after.k / before.k).toFixed(2)}`);
    } else if (name === 'chromium') {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
      await page.waitForTimeout(1500);
      const before = await view(page);
      const cdp = await s.ctx.newCDPSession(page);
      const pts = [{ x: 170, y: 420, id: 1 }, { x: 230, y: 440, id: 2 }];
      for (let i = 0; i < 2; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts });
        await page.waitForTimeout(60);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(700);
      const after = await view(page);
      record('0 two-finger double-tap zooms out', after.k / before.k > 0.45 && after.k / before.k < 0.55, `x${(after.k / before.k).toFixed(2)}`);
    } else {
      record('0 two-finger double-tap zooms out', null, 'needs two touch points; only Chromium can send them here');
    }

    // Single taps still work, and soon enough.
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
    await page.waitForTimeout(1500);
    const c = await findPoint(page, 'card', 'eoej-a1-');
    if (!s.phone) { await page.mouse.move(c.x, c.y); await page.waitForTimeout(300); }
    if (s.phone) await page.touchscreen.tap(c.x, c.y); else await page.mouse.click(c.x, c.y);
    const t0 = Date.now();
    await page.waitForFunction(() => document.querySelectorAll('.node-card div[data-popout="1"]').length > 0, null, { timeout: 3000 }).catch(() => {});
    const waited = Date.now() - t0;
    const opened = await page.evaluate(() => document.querySelectorAll('.node-card div[data-popout="1"]').length);
    record(`0 a single ${s.phone ? 'tap' : 'click'} still opens a card`, opened === 1, `${opened} open after ${waited}ms`);
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
    await page.waitForTimeout(1500);
    const t = await findPoint(page, 'title');
    const st0 = await page.evaluate(() => JSON.stringify(window.PostPipeGraph.getContainerState()));
    await singleAt(s, t);
    const st1 = await page.evaluate(() => JSON.stringify(window.PostPipeGraph.getContainerState()));
    record(`0 a single ${s.phone ? 'tap' : 'click'} on a container title still toggles it`, st0 !== st1, st0 !== st1 ? 'toggled' : 'unchanged');
    record('0 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally {
    await s.browser.close();
  }
}


// ── 6. reader navigation and the panel ─────────────────────────────────────
const A2 = FEED.items.filter((i) => /a2-/.test(i.id)).sort((a, b) => a.series_part - b.series_part);

async function swipe(s, dx, { from } = {}) {
  // One finger across the reader's text, sent as touch events from inside
  // the page (Playwright's touchscreen only taps).
  return s.page.evaluate(([dx, from]) => {
    const body = document.querySelector('[data-tts-target]');
    const r = body.getBoundingClientRect();
    let target = body;
    if (from === 'text') target = body.querySelector('p') || body;
    if (from === 'header') target = body.querySelector('h1') || body;
    const tr = target.getBoundingClientRect();
    const x0 = Math.min(tr.left + tr.width / 2 + (dx < 0 ? 60 : -60), r.right - 20), y0 = tr.top + Math.min(tr.height / 2, 12);
    const mk = (x, y) => new Touch({ identifier: 7, target, clientX: x, clientY: y, pageX: x, pageY: y });
    try {
      target.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [mk(x0, y0)], changedTouches: [mk(x0, y0)] }));
      target.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [mk(x0 + dx, y0 + 4)] }));
      return true;
    } catch (e) { return 'no touch events: ' + e.message; }
  }, [dx, from || 'header']);
}

const openId = (page) => page.evaluate(() => decodeURIComponent((location.hash.match(/#read=([^&]+)/) || [])[1] || ''));

async function part6(bt, name, size, record) {
  const s = await open(bt, name, size, READ(SECOND));
  const { page } = s;
  try {
    const navs = await page.evaluate(() => ({
      top: [...document.querySelectorAll('nav[aria-label="Previous chapter"] [data-reader-nav="prev"]')].map((e) => e.textContent),
      bottom: [...document.querySelectorAll('[data-reader-nav-bottom] [data-reader-nav="next"]')].map((e) => e.textContent),
    }));
    record('6 previous at the top of the reader, with its title', navs.top.length === 1 && navs.top[0].includes(FIRST.title), navs.top.join(' / '));
    record('6 next at the bottom of the reader, with its title', navs.bottom.length === 1 && navs.bottom[0].includes(byPart(3).title), navs.bottom.join(' / '));
    await page.evaluate(() => { const b = document.querySelector('[data-tts-target]'); b.scrollTop = b.scrollHeight; });
    await page.waitForTimeout(300);
    if (s.phone) await page.tap('[data-reader-nav-bottom] [data-reader-nav="next"]'); else await page.click('[data-reader-nav-bottom] [data-reader-nav="next"]');
    await page.waitForTimeout(1200);
    const after = await openId(page);
    const top = await page.evaluate(() => document.querySelector('[data-tts-target]').scrollTop);
    record('6 next opens the next chapter at its start', after === byPart(3).id && top < 40, `${after.split('/').pop()} at ${Math.round(top)}px`);

    // Title-only chapters show their status instead of a link.
    await page.evaluate((u) => { location.hash = u.split('#')[1]; }, READ(A2[0]));
    await page.waitForTimeout(1500);
    const locked = await page.evaluate(() => { const e = document.querySelector('[data-reader-nav="next"]'); return e ? { tag: e.tagName, text: e.textContent, status: !!e.querySelector('[class*="navStatus"]') } : null; });
    const want = (FEED.containers.find((c) => /act-2/.test(c.id)) || {}).status;
    record('6 a chapter not yet published shows its status, not a link', !!locked && locked.tag !== 'BUTTON' && locked.status && (!want || locked.text.includes(want)), locked ? locked.text : 'none');

    if (!s.phone) {
      await page.evaluate((u) => { location.hash = u.split('#')[1]; }, READ(FIRST));
      await page.waitForTimeout(1500);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(1200);
      const r = await openId(page);
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(1200);
      const l = await openId(page);
      record('6 arrow keys turn to the next and previous chapter', r === SECOND.id && l === FIRST.id, `→ ${r.split('/').pop()}, ← ${l.split('/').pop()}`);
    } else {
      await page.evaluate((u) => { location.hash = u.split('#')[1]; }, READ(FIRST));
      await page.waitForTimeout(1500);
      const sw = await swipe(s, -160);
      await page.waitForTimeout(1200);
      const r = await openId(page);
      if (sw !== true) record('6 a swipe turns to the next chapter', null, sw);
      else {
        record('6 a swipe left turns to the next chapter', r === SECOND.id, r.split('/').pop());
        const turned = await page.evaluate(() => getComputedStyle(document.querySelector('[data-tts-target]')).animationName);
        await swipe(s, 160);
        await page.waitForTimeout(1200);
        const l = await openId(page);
        record('6 a swipe right turns back', l === FIRST.id, l.split('/').pop());
        // A selection, or the highlighter's own drag, is not a page turn.
        await page.evaluate(() => { const p = document.querySelector('[data-tts-target] p'); const r = document.createRange(); r.selectNodeContents(p); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
        await swipe(s, -160, { from: 'text' });
        await page.waitForTimeout(900);
        const sel = await openId(page);
        await page.evaluate(() => getSelection().removeAllRanges());
        record('6 a swipe with text selected does not turn the page', sel === FIRST.id, sel.split('/').pop());
      }
    }

    // The panel: from the reader it acts on the open chapter.
    await page.evaluate((u) => { location.hash = u.split('#')[1]; }, READ(FIRST));
    await page.waitForTimeout(1500);
    if (s.phone) await page.tap('[data-reader-settings]'); else await page.click('[data-reader-settings]');
    await page.waitForTimeout(500);
    const panel = await page.evaluate(() => {
      const d = document.querySelector('[data-settings-panel]');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      const over = [...d.querySelectorAll('button, select, input, label')].filter((e) => { const q = e.getBoundingClientRect(); return q.width && (q.right > r.right + 1 || q.left < r.left - 1); }).length;
      return {
        subject: (d.querySelector('[data-settings-subject]') || {}).textContent,
        sections: [...d.querySelectorAll('[data-section]')].map((e) => e.getAttribute('data-section')),
        inView: r.left >= 0 && r.right <= innerWidth + 0.5 && d.scrollWidth <= d.clientWidth + 1,
        over,
        w: Math.round(r.width),
      };
    });
    record('6 the panel opens from the reader, for the open chapter', !!panel && panel.subject === FIRST.title, panel ? panel.subject : 'did not open');
    record('6 the panel groups Reading, Listening, Your place, View', !!panel && panel.sections.join() === 'reading,listening,place,view', panel ? panel.sections.join(', ') : '');
    record('6 the panel fits the screen and its rows wrap', !!panel && panel.inView && panel.over === 0, panel ? `${panel.w}px wide, ${panel.over} controls past its edge` : '');
    const marks0 = await page.evaluate(() => document.querySelectorAll('[data-place-subject] [data-bookmark-row]').length);
    if (s.phone) await page.tap('[data-place-mark]'); else await page.click('[data-place-mark]');
    await page.waitForTimeout(500);
    const marks1 = await page.evaluate(() => document.querySelectorAll('[data-place-subject] [data-bookmark-row]').length);
    const ribbon = await page.evaluate(() => !!document.querySelector('[data-tts-target] .bookmarkRibbon'));
    record('6 Mark here in the panel bookmarks the open chapter', marks1 === marks0 + 1 && ribbon, `${marks0} → ${marks1}, ribbon ${ribbon}`);
    const legend = await page.evaluate(() => (document.querySelector('[data-bookmark-legend]') || {}).textContent || '');
    record('6 Your place explains its bookmark controls', /Jump/.test(legend) && /Mark here/.test(legend), legend.slice(0, 50) + '…');
    const dup = await page.evaluate(() => ({ voiceInReader: !!document.querySelector('#tts-mount-point select'), voiceInPanel: !!document.querySelector('[data-settings-panel] [data-tts-voice]'), legendInReader: !!document.querySelector('[data-tts-target] [data-bookmark-legend]') }));
    record('6 voice and bookmarks live in one place each', !dup.voiceInReader && dup.voiceInPanel && !dup.legendInReader, JSON.stringify(dup));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // From the graph it acts on the card last opened there.
    await page.evaluate(() => { history.replaceState(null, '', location.pathname); dispatchEvent(new HashChangeEvent('hashchange')); });
    await page.waitForTimeout(800);
    const c = await findPoint(page, 'card', slugOf(SECOND));
    if (c) {
      if (s.phone) await page.touchscreen.tap(c.x, c.y); else { await page.mouse.move(c.x, c.y); await page.waitForTimeout(300); await page.mouse.click(c.x, c.y); }
      await page.waitForTimeout(800);
      if (s.phone) await page.tap('[data-settings-gear]'); else await page.click('[data-settings-gear]');
      await page.waitForTimeout(500);
      const subj = await page.evaluate(() => (document.querySelector('[data-settings-subject]') || {}).textContent);
      record('6 the panel opens from the graph, for the selected card', subj === SECOND.title, subj || 'no subject');
    } else {
      record('6 the panel opens from the graph, for the selected card', false, 'no card on screen');
    }
    for (const w of s.phone ? [320, 430] : []) {
      await page.setViewportSize({ width: w, height: 844 });
      await page.waitForTimeout(400);
      const fit = await page.evaluate(() => { const d = document.querySelector('[data-settings-panel]'); if (!d) return null; const r = d.getBoundingClientRect(); const over = [...d.querySelectorAll('button, select, input, label')].filter((e) => { const q = e.getBoundingClientRect(); return q.width && q.right > r.right + 1; }).length; return { ok: r.left >= 0 && r.right <= innerWidth + 0.5 && d.scrollWidth <= d.clientWidth + 1, over }; });
      record(`6 the panel fits at ${w}px`, !!fit && fit.ok && fit.over === 0, fit ? `${fit.over} past the edge` : 'closed');
    }
    record('6 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally {
    await s.browser.close();
  }
}

const PART_FNS = { 0: part0, 6: part6 };

const server = http.createServer((req, res) => handler(req, res, {
  public: SITE,
  headers: [{ source: '**', headers: [{ key: 'Cache-Control', value: 'no-store' }] }],
}));

server.listen(PORT, async () => {
  const all = [];
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  for (const [bt, name] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
    if (!ENGINES.includes(name)) continue;
    for (const size of ['desktop', 'phone']) {
      const record = (check, ok, note = '') => all.push({ engine: name, size, check, ok, note });
      for (const [part, fn] of Object.entries(PART_FNS)) {
        if (PARTS && !PARTS.includes(part)) continue;
        try {
          await fn(bt, name, size, record);
        } catch (e) {
          const msg = String(e.message || e).split('\n')[0];
          const cantStart = /browserType\.launch/.test(msg);
          record(`part ${part}`, cantStart ? null : false, cantStart ? `not run: ${name} did not start (${msg.slice(0, 80)})` : msg);
          if (cantStart) break;
        }
      }
    }
  }
  server.close();
  console.log('| engine | size | check | result | note |');
  console.log('|---|---|---|---|---|');
  for (const r of all) {
    const res = r.ok === null ? (/^not run/.test(r.note) ? 'NOT RUN' : 'n/a') : r.ok ? 'PASS' : 'FAIL';
    console.log(`| ${r.engine} | ${r.size} | ${r.check} | ${res} | ${String(r.note).replace(/\|/g, '/')} |`);
  }
  if (all.some((r) => r.ok === false)) process.exitCode = 1;
});


// Browser checks for the T20 launch fixes: the reader (header, progress,
// controls on a phone, bookmark labels, no download, follow along,
// OpenDyslexic, bold beginnings), the bottom bar, rotation, closed
// containers, reset, the closed book, and the rights line. Chromium and
// WebKit, desktop (1280x800) and phone (390x844, with 320 and 430 for the
// width checks).
//
//   node test/e2e/t20_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines. PP_E2E_SINGLE_PROCESS=1 runs
// Chromium in one process, for a shell that has lost its login session (the
// usual multi-process launch then fails before any page opens). An engine
// that cannot start is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { readerHeader } = require('../../src/lib/readerHeader');
const { rightsLine } = require('../../src/lib/rights');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const SETTINGS = JSON.parse(fs.readFileSync(path.join(SITE, '..', 'settings.json'), 'utf8'));
const PORT = 39436;
const BASE = `http://localhost:${PORT}/`;
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const FIRST = FEED.items.find((i) => i.series_part === 1 && /a1-01/.test(i.id)) || FEED.items[0];
const LONG = FEED.items.filter((i) => /a1-/.test(i.id)).sort((a, b) => (b.reading_time || '').localeCompare(a.reading_time || ''))[0] || FIRST;
const BOOK = (FEED.containers || []).find((c) => !c.parent);
const ACT = (FEED.containers || []).find((c) => c.parent && /act-1/.test(c.id));
const READ = (item) => BASE + '#read=' + encodeURIComponent(item.id);
const EXPECT_KICKER = readerHeader(SETTINGS, FIRST).kicker;
const EXPECT_RIGHTS = rightsLine(SETTINGS.rights);
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SINGLE = process.env.PP_E2E_SINGLE_PROCESS === '1';

const shown = (sel) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return false;
  for (let x = e; x && x.nodeType === 1; x = x.parentNode) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden') return false; }
  const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })()`;

async function open(bt, name, size, url, width) {
  const phone = size === 'phone';
  const browser = await bt.launch(name === 'chromium' && SINGLE ? { args: ['--single-process', '--no-zygote'] } : {});
  const ctx = await browser.newContext(phone
    ? { viewport: { width: width || 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
    : { viewport: { width: width || 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:')) outside.push(u); });
  await page.goto(url);
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForTimeout(4500);
  return { browser, ctx, page, errors, outside, phone };
}

async function tap(s, sel) {
  if (s.phone) await s.page.tap(sel); else await s.page.click(sel);
  await s.page.waitForTimeout(350);
}

async function setAid(s, aid, value) {
  await tap(s, '[data-reader-settings]');
  const on = await s.page.$eval(`[data-aid="${aid}"]`, (e) => e.getAttribute('aria-checked') === 'true');
  if (on !== value) await tap(s, `[data-aid="${aid}"]`);
  await tap(s, '[role="dialog"][aria-label="Settings"] [aria-label="Close"]');
}

// ── the reader ─────────────────────────────────────────────────────────────
async function readerChecks(bt, name, size, record) {
  const s = await open(bt, name, size, READ(FIRST));
  const { page } = s;
  try {
    // 1. header
    const h = await page.evaluate(() => {
      const head = document.querySelector('[data-tts-target] > div');
      const k = head && head.firstElementChild;
      const t = head && head.querySelector('h1');
      return {
        kicker: k && k.tagName !== 'H1' ? k.textContent.trim() : null,
        title: t && t.textContent.trim(),
        kickerAbove: !!(k && t && k.getBoundingClientRect().bottom <= t.getBoundingClientRect().top + 1),
        byline: [...(head ? head.children : [])].filter((e) => /^by\s/i.test(e.textContent.trim())).length,
      };
    });
    record('1 header: chapter, book and author above the title', h.kicker === EXPECT_KICKER && h.kickerAbove, h.kicker || 'none');
    record('1 header: the chapter title is the heading', h.title === FIRST.title, h.title);
    record('1 header: no byline beside the title', h.byline === 0, `${h.byline} byline rows`);

    // 2. progress along the top
    const pr = await page.evaluate(() => {
      const bar = document.querySelector('[role="progressbar"]');
      const panel = bar && bar.parentElement.getBoundingClientRect();
      const r = bar && bar.getBoundingClientRect();
      const body = document.querySelector('[data-tts-target]');
      return { r: r && { w: r.width, h: r.height, top: r.top }, panel: panel && { w: panel.width, top: panel.top }, room: body.scrollHeight - body.clientHeight };
    });
    record('2 progress bar is horizontal along the top of the reader',
      !!pr.r && pr.r.w > pr.panel.w * 0.9 && pr.r.h <= 6 && pr.r.top - pr.panel.top <= 2,
      pr.r ? `${Math.round(pr.r.w)}x${pr.r.h} at +${Math.round(pr.r.top - pr.panel.top)}px` : 'missing');
    await page.evaluate(() => { const b = document.querySelector('[data-tts-target]'); b.scrollTop = (b.scrollHeight - b.clientHeight) / 2; b.dispatchEvent(new Event('scroll')); });
    await page.waitForTimeout(400);
    const mid = await page.evaluate(() => Number(document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')));
    record('2 progress follows the scroll', mid >= 35 && mid <= 65, `${mid}% at half way`);

    // 4. bookmark labels and legend
    const bm = await page.evaluate(() => ({
      mark: (document.querySelector('[data-bookmark-toggle]') || {}).innerText,
      list: (document.querySelector('[data-bookmark-list]') || {}).innerText,
    }));
    record('4 bookmark controls say what they do', /mark/i.test(bm.mark || '') && /bookmarks/i.test(bm.list || ''), `"${(bm.mark || '').trim()}" / "${(bm.list || '').trim()}"`);
    await tap(s, '[data-bookmark-list]');
    const legend = await page.evaluate(`${shown('[data-bookmark-legend]')} && document.querySelector('[data-bookmark-legend]').innerText`);
    record('4 one tap shows the bookmark legend', !!legend && /Mark here/.test(legend), legend ? legend.slice(0, 60) + '…' : 'not shown');
    await tap(s, '[data-bookmark-list]');

    // 5. no download
    const dl = await page.evaluate(() => [...document.querySelectorAll('button, a')]
      .filter((e) => /download|export/i.test(`${e.title} ${e.getAttribute('aria-label') || ''} ${e.textContent} ${e.getAttribute('download') != null ? 'download' : ''}`)).length);
    await tap(s, '[data-reader-settings]');
    const dlPanel = await page.evaluate(() => [...document.querySelectorAll('[role="dialog"] button, [role="dialog"] a')]
      .filter((e) => /download|export/i.test(`${e.title} ${e.textContent}`)).length);
    await tap(s, '[role="dialog"][aria-label="Settings"] [aria-label="Close"]');
    record('5 no download button in the reader or the panel', dl === 0 && dlPanel === 0, `${dl} in reader, ${dlPanel} in panel`);

    // 6. follow along
    await setAid(s, 'followAlong', true);
    const target = await page.evaluate(() => {
      const ps = [...document.querySelectorAll('[data-tts-target] p')].filter((p) => p.innerText.length > 120);
      const p = ps[1] || ps[0];
      p.scrollIntoView({ block: 'center' });
      const r = p.getBoundingClientRect();
      return { x: r.left + 40, y: r.top + 8, text: p.innerText };
    });
    await page.waitForTimeout(300);
    if (s.phone) await page.touchscreen.tap(target.x, target.y);
    else await page.mouse.click(target.x, target.y);
    await page.waitForTimeout(300);
    const f1 = await page.evaluate(() => ({ ...document.querySelector('[data-tts-target]').dataset }));
    record('6 follow along: a tap marks the sentence and word', !!f1.followSentence && target.text.includes(f1.followSentence) && !!f1.followWord,
      `"${(f1.followWord || '')}" in "${(f1.followSentence || '').slice(0, 40)}…"`);
    if (!s.phone) {
      await page.mouse.move(target.x, target.y);
      await page.mouse.down();
      await page.mouse.move(target.x + 160, target.y, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(300);
      const f2 = await page.evaluate(() => document.querySelector('[data-tts-target]').dataset.followWord);
      record('6 follow along: dragging moves the word', !!f2 && f2 !== f1.followWord, `${f1.followWord} → ${f2}`);
    }
    const ttsIdle = await page.evaluate(() => !window.speechSynthesis || !window.speechSynthesis.speaking);
    record('6 follow along runs without the voice', ttsIdle, ttsIdle ? 'voice silent' : 'voice speaking');
    await setAid(s, 'followAlong', false);

    // 8. bold beginnings
    const before = await page.evaluate(() => document.querySelector('[data-tts-target]').innerText);
    await setAid(s, 'boldStart', true);
    const bold = await page.evaluate(() => ({
      n: document.querySelectorAll('[data-tts-target] b.pp-bs').length,
      text: document.querySelector('[data-tts-target]').innerText,
    }));
    record('8 bold word beginnings: words start bold', bold.n > 100, `${bold.n} bold beginnings`);
    record('8 bold word beginnings: the text is unchanged', bold.text === before, bold.text === before ? 'identical' : 'differs');
    await setAid(s, 'boldStart', false);
    const off = await page.evaluate(() => document.querySelectorAll('[data-tts-target] b.pp-bs').length);
    record('8 bold word beginnings turn off', off === 0, `${off} left`);

    // 7. OpenDyslexic
    await tap(s, '[data-reader-settings]');
    await tap(s, '[data-font="opendyslexic"]');
    await tap(s, '[role="dialog"][aria-label="Settings"] [aria-label="Close"]');
    await page.waitForTimeout(800);
    const font = await page.evaluate(async () => {
      await document.fonts.ready;
      const p = document.querySelector('[data-tts-target] p');
      return { family: getComputedStyle(p).fontFamily, loaded: [...document.fonts].some((f) => /OpenDyslexic/.test(f.family) && f.status === 'loaded') };
    });
    record('7 OpenDyslexic is a font choice and loads', /^"?OpenDyslexic/.test(font.family) && font.loaded, `${font.family}; loaded ${font.loaded}`);
    const lic = await page.evaluate(async () => { const r = await fetch('./fonts/OpenDyslexic-OFL.txt'); return r.ok ? await r.text() : ''; });
    record('7 the font ships with its license file', /SIL Open Font License/.test(lic) && /Reserved Font Name OpenDyslexic/.test(lic), lic ? 'fonts/OpenDyslexic-OFL.txt' : 'missing');
    await tap(s, '[data-reader-settings]');
    await tap(s, '[data-font="default"]');
    await tap(s, '[role="dialog"][aria-label="Settings"] [aria-label="Close"]');
    record('7 no remote font or other remote loading', s.outside.length === 0, s.outside.slice(0, 3).join(' ') || 'none');

    // 14. rights in the reader, after the text
    await page.goto(READ(LONG));
    await page.waitForTimeout(3000);
    const rr = await page.evaluate(() => {
      const b = document.querySelector('[data-tts-target]');
      const f = b.querySelector('[data-reader-rights]');
      const ps = b.querySelectorAll('p');
      return { text: f && f.textContent, after: !!(f && ps.length && (ps[ps.length - 1].compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING)), n: b.querySelectorAll('[data-reader-rights], .pp-rights').length };
    });
    record('14 rights line in the reader, once, after the text', rr.text === EXPECT_RIGHTS && rr.after && rr.n === 1, rr.text || 'missing');
    record('no page errors (reader)', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally {
    await s.browser.close();
  }
}

// ── 3. the reader's controls and the panel on phone widths ─────────────────
async function controlChecks(bt, name, size, record) {
  for (const w of (size === 'phone' ? [320, 390, 430] : [1280])) {
    const s = await open(bt, name, size, READ(FIRST), w);
    const { page } = s;
    try {
      const cut = await page.evaluate(() => {
        const panel = document.querySelector('[data-tts-target]').parentElement;
        const pr = panel.getBoundingClientRect();
        return [...panel.querySelectorAll('button, select, input, label, a')]
          .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > Math.min(pr.right, innerWidth) + 0.5 || r.left < Math.max(pr.left, 0) - 0.5); })
          .map((e) => e.title || e.getAttribute('aria-label') || e.tagName);
      });
      record(`3 reader controls fit at ${w}px`, cut.length === 0, cut.join(', ') || 'nothing past the edge');
      await tap(s, '[data-reader-settings]');
      const pop = await page.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-label="Settings"]'); if (!d) return null; const r = d.getBoundingClientRect(); return { l: r.left, r: r.right, w: innerWidth }; });
      record(`3 panel opens from the reader at ${w}px`, !!pop && pop.l >= 0 && pop.r <= pop.w, pop ? `${Math.round(pop.l)}–${Math.round(pop.r)} of ${pop.w}` : 'did not open');
      await tap(s, '[role="dialog"][aria-label="Settings"] [aria-label="Close"]');
      await page.evaluate(() => { history.replaceState(null, '', location.pathname); window.dispatchEvent(new Event('hashchange')); });
      await page.waitForTimeout(800);
      await tap(s, 'button[aria-label="Settings"]');
      const pop2 = await page.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-label="Settings"]'); if (!d) return null; const r = d.getBoundingClientRect(); return { l: r.left, r: r.right, w: innerWidth }; });
      record(`3 panel opens from the graph at ${w}px`, !!pop2 && pop2.l >= 0 && pop2.r <= pop2.w, pop2 ? `${Math.round(pop2.l)}–${Math.round(pop2.r)} of ${pop2.w}` : 'did not open');
    } finally {
      await s.browser.close();
    }
  }
}

// ── 9. the bottom bar ──────────────────────────────────────────────────────
async function toolbarChecks(bt, name, size, record) {
  for (const w of (size === 'phone' ? [320, 390, 430] : [1280])) {
    const s = await open(bt, name, size, BASE, w);
    const { page } = s;
    try {
      const bar = await page.evaluate(() => {
        const groups = [...document.querySelectorAll('[data-toolbar] [data-group]')].filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect());
        let overlap = 0;
        for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
          const a = groups[i], b = groups[j];
          if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) overlap++;
        }
        const out = groups.filter((r) => r.left < 0 || r.right > innerWidth || r.bottom > innerHeight).length;
        const rows = new Set(groups.map((r) => Math.round(r.top))).size;
        const names = [...document.querySelectorAll('[data-toolbar] button')].filter((e) => e.offsetParent).map((e) => e.getAttribute('aria-label') || e.textContent.trim());
        return { overlap, out, rows, names };
      });
      record(`9 bottom bar: one row, no overlap, nothing cut off at ${w}px`, bar.overlap === 0 && bar.out === 0 && bar.rows === 1, bar.names.join(' · '));
      await tap(s, '[data-toolbar-more]');
      const sheet = await page.evaluate(() => {
        const e = document.querySelector('[data-toolbar-sheet]'); if (!e) return null;
        const r = e.getBoundingClientRect();
        return { ok: r.left >= 0 && r.right <= innerWidth && r.top >= 0, items: [...e.querySelectorAll('button')].filter((b) => b.offsetParent).map((b) => b.textContent.trim()) };
      });
      const needDims = w <= 900;
      record(`9 the rest is one tap away under More at ${w}px`, !!sheet && sheet.ok && (!needDims || sheet.items.includes('chronology')),
        sheet ? sheet.items.join(' · ') : 'did not open');
    } finally {
      await s.browser.close();
    }
  }
}

// ── 10–13. rotation, closed containers, reset, the closed book ─────────────
async function graphChecks(bt, name, size, record) {
  const s = await open(bt, name, size, BASE);
  const { page, ctx } = s;
  const view = () => page.evaluate(() => {
    const g = document.querySelector('svg > g:not(.time-axis-layer)').getAttribute('transform');
    const m = /translate\(([-\d.e]+),([-\d.e]+)\) rotate\(([-\d.e]+)\) scale\(([-\d.e]+)\)/.exec(g);
    return m ? { x: +m[1], y: +m[2], rot: +m[3], k: +m[4] } : null;
  });
  try {
    const first = await view();
    const firstState = await page.evaluate(() => JSON.stringify(window.PostPipeGraph.getContainerState()));

    // 10. two-finger rotate (Chromium can send two touch points; WebKit here cannot)
    let rotated = false;
    if (s.phone && name === 'chromium') {
      const cdp = await ctx.newCDPSession(page);
      const cx = 195, cy = 480, r = 70;
      const pts = (deg) => { const a = deg * Math.PI / 180; return [{ x: cx - r * Math.cos(a), y: cy - r * Math.sin(a), id: 1 }, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), id: 2 }]; };
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(0) });
      for (let d = 2; d <= 50; d += 2) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts(d) }); await page.waitForTimeout(16); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(500);
      const v = await view();
      const up = await page.evaluate(() => {
        const ang = (a, b) => Math.round(Math.atan2(b, a) * 180 / Math.PI);
        const labels = [...document.querySelectorAll('.container-badge-text')].filter((t) => t.getBoundingClientRect().width > 0).map((t) => { const m = t.getScreenCTM(); return ang(m.a, m.b); });
        const ct = new DOMMatrix(getComputedStyle(document.querySelector('.cards-transform')).transform);
        const cards = [...document.querySelectorAll('.node-card')].filter((c) => c.offsetParent).map((c) => { const m = ct.multiply(new DOMMatrix(getComputedStyle(c).transform)); return ang(m.a, m.b); });
        return { labels, cards };
      });
      rotated = Math.abs(v.rot) > 20;
      record('10 two fingers turn the graph', rotated, `${Math.round(v.rot)}°`);
      record('10 labels and cards stay upright', up.labels.every((a) => a === 0) && up.cards.every((a) => a === 0), `${up.labels.length} labels, ${up.cards.length} cards at 0°`);
    } else {
      record('10 two-finger rotate', null, s.phone ? 'needs two touch points; only Chromium can send them here' : 'touch only');
    }

    // 11. closed means closed
    const spot = await page.evaluate((prefix) => { const c = [...document.querySelectorAll('.node-card')].find((e) => e.offsetParent && e.__data__.id.startsWith(prefix)); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: c.__data__.id }; }, 'eoej-a1-0');
    await page.evaluate((id) => window.PostPipeGraph.closeContainer(id), ACT.id);
    await page.waitForTimeout(1500);
    const closed = await page.evaluate(() => {
      const vis = (e) => { for (let x = e; x && x.nodeType === 1; x = x.parentNode) if (getComputedStyle(x).display === 'none') return false; return true; };
      const inAct = (d) => /eoej-a1-/.test(typeof d === 'object' ? d.id : d);
      return {
        cards: [...document.querySelectorAll('.node-card')].filter((e) => vis(e) && inAct(e.__data__.id)).length,
        edges: [...document.querySelectorAll('path.link, path.link-hit, path.link-sequence-pulse')].filter((e) => vis(e) && e.getAttribute('d') && (inAct(e.__data__.source) || inAct(e.__data__.target))).length,
      };
    });
    record('11 a closed container hides its members and their edges', closed.cards === 0 && closed.edges === 0, `${closed.cards} cards, ${closed.edges} edges left`);
    if (spot) {
      const before = await page.evaluate((id) => { const d = [...document.querySelectorAll('.node-card')].find((e) => e.__data__.id === id).__data__; return [d.x, d.y, d._size ? d._size.width : null]; }, spot.id);
      await page.mouse.move(spot.x, spot.y); await page.mouse.down(); await page.mouse.move(spot.x + 90, spot.y + 50, { steps: 6 }); await page.mouse.up();
      await page.waitForTimeout(300);
      const after = await page.evaluate((id) => { const d = [...document.querySelectorAll('.node-card')].find((e) => e.__data__.id === id).__data__; return [d.x, d.y, d._size ? d._size.width : null]; }, spot.id);
      record('11 a hidden member cannot be dragged or resized', before.join() === after.join(), `${spot.id.split('/').pop()} unmoved`);
    }

    // 13. the whole book closed: only its blob
    await page.evaluate((id) => window.PostPipeGraph.closeContainer(id), BOOK.id);
    await page.waitForTimeout(1500);
    const stray = await page.evaluate(() => {
      const vis = (e) => { for (let x = e; x && x.nodeType === 1; x = x.parentNode) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden') return false; } return true; };
      return [...document.querySelectorAll('svg > g path, svg > g line, svg > g rect, svg > g text, svg > g circle')]
        .filter((e) => vis(e) && !e.closest('defs') && !e.closest('.container-macro-node') && !e.closest('.time-axis-layer'))
        .filter((e) => e.tagName !== 'path' || e.getAttribute('d'))
        .map((e) => e.getAttribute('class') || e.tagName);
    });
    record('13 the closed book is clean: nothing but its blob', stray.length === 0, stray.length ? stray.slice(0, 4).join(', ') : 'blob only');

    // 12. one reset back to the site's first screen
    await page.evaluate((u) => { location.hash = u.split('#')[1]; }, READ(FIRST));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-all')));
    await page.waitForTimeout(2600);
    const after = await view();
    const st = await page.evaluate(() => JSON.stringify(window.PostPipeGraph.getContainerState()));
    const readerOpen = await page.evaluate(() => !!document.querySelector('[data-tts-target]') && location.hash.startsWith('#read='));
    record('12 reset: rotation back to 0', after.rot === 0, `${after.rot}°`);
    record('12 reset: containers back to how the site starts', st === firstState, st === firstState ? 'same as first load' : st);
    record('12 reset: selection cleared, reader closed', !readerOpen, readerOpen ? 'reader still open' : 'closed');
    record('12 reset: zoom back to the first screen', Math.abs(after.k - first.k) / first.k < 0.05, `scale ${after.k.toFixed(3)} vs ${first.k.toFixed(3)}`);
    const resetBtn = await page.evaluate(`${shown('[data-toolbar-reset]')}`);
    record('12 the reset is one visible control in the bottom bar', resetBtn, resetBtn ? 'Reset' : 'not shown');

    // 14. rights on the graph page
    const gr = await page.evaluate(() => { const f = document.querySelector('body > .pp-rights'); if (!f) return null; const r = f.getBoundingClientRect(); return { text: f.textContent, inView: r.width > 0 && r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight }; });
    record('14 rights line on the graph page', !!gr && gr.text === EXPECT_RIGHTS && gr.inView, gr ? gr.text : 'missing');
    record('no page errors (graph)', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally {
    await s.browser.close();
  }
}

// 14. every chapter page, from the files themselves
function pageChecks(record) {
  const pages = fs.readdirSync(SITE).filter((f) => /\.html$/.test(f) && f !== 'index.html');
  const missing = pages.filter((f) => {
    const html = fs.readFileSync(path.join(SITE, f), 'utf8');
    return !html.includes(`<footer class="pp-rights" data-rights>${EXPECT_RIGHTS.replace(/&/g, '&amp;')}</footer>`)
      || !html.includes('<meta name="copyright"') || (SETTINGS.rights.noAiTraining && !html.includes('noai, noimageai'));
  });
  record('14 every chapter page carries the rights line and meta', pages.length > 0 && missing.length === 0, `${pages.length - missing.length} of ${pages.length}${missing.length ? '; missing ' + missing.join(', ') : ''}`);
  const robots = fs.existsSync(path.join(SITE, 'robots.txt')) ? fs.readFileSync(path.join(SITE, 'robots.txt'), 'utf8') : '';
  record('14 robots.txt turns away AI crawlers', /GPTBot[\s\S]*Disallow: \//.test(robots) && /ClaudeBot/.test(robots), robots ? 'present' : 'missing');
}

const server = http.createServer((req, res) => handler(req, res, {
  public: SITE,
  headers: [{ source: '**', headers: [{ key: 'Cache-Control', value: 'no-store' }] }],
}));

server.listen(PORT, async () => {
  const all = [];
  pageChecks((check, ok, note = '') => all.push({ engine: 'files', size: '-', check, ok, note }));
  for (const [bt, name] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
    if (!ENGINES.includes(name)) continue;
    for (const size of ['desktop', 'phone']) {
      const record = (check, ok, note = '') => all.push({ engine: name, size, check, ok, note });
      for (const fn of [readerChecks, controlChecks, toolbarChecks, graphChecks]) {
        try {
          await fn(bt, name, size, record);
        } catch (e) {
          const msg = String(e.message || e).split('\n')[0];
          const cantStart = /launch|Target page, context or browser has been closed/.test(msg);
          record(`${fn.name}`, cantStart ? null : false, cantStart ? `not run: ${name} did not start in this shell (${msg.slice(0, 80)})` : msg);
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

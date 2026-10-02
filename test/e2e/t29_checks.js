// Browser checks for the byline and for link nodes, on a built site:
//   0. the cover's byline directly under the title in both states: its left
//      edge at the title's last line, its top just under that line's
//      baseline, in the title's face, about a quarter of the title's size,
//      lower case, at opacity.art in the art state and opacity.graph in the
//      graph state, on top where it is drawn, and a link to byline.href in
//      both states;
//   1. the author page (a second site under /haroldyoung/): every item a link
//      node, its card showing its title, subtitle and blurb; a tap follows
//      the link (this tab for this site, a new tab for another), the ↗ too,
//      and Enter from the keyboard; the reader never opens (a tap, a double
//      tap, a #read= link); the intro under the title pill; the default
//      theme; no reading groups in the panel; a link node's own page sends
//      the visitor on;
// and no page errors, nothing fetched from elsewhere before a link is
// followed (pages elsewhere are answered locally, never fetched). Chromium
// and WebKit, desktop (1280x800) and phone (390x844). Screenshots go to
// PP_E2E_SHOTS when set.
//
//   node test/e2e/t29_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines, PP_E2E_SIZES=desktop,phone
// sizes. An engine that cannot start is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { openingConfig, bylineText } = require('../../src/lib/opening');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39461;
const BASE = `http://localhost:${PORT}/`;
const AUTHOR = `${BASE}haroldyoung/`;
const settingsOf = (file) => JSON.parse(fs.readFileSync(file, 'utf8').match(/window\.SETTINGS = (\{[\s\S]*?\});\n/)[1]);
const SETTINGS = settingsOf(path.join(SITE, 'index.html'));
const OPENING = openingConfig(SETTINGS);
const AUTHOR_SETTINGS = settingsOf(path.join(SITE, 'haroldyoung', 'index.html'));
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'haroldyoung', 'feed.json'), 'utf8'));
const LINKS = FEED.items.filter((i) => i.kind === 'link');
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const slugOf = (item) => item.url.split('/').pop().replace('.html', '');
const local = (u) => u.startsWith(BASE) || u.startsWith('data:') || u.startsWith('blob:') || u === 'about:blank';
// A page's address without its query, hash, or .html (the server serves
// clean URLs), and a link as the browser writes it.
const bare = (u) => u.replace(/[#?].*$/, '').replace(/\.html$/, '');
const norm = (u) => { try { return new URL(u, AUTHOR).href; } catch (_) { return u; } };

if (!OPENING || !OPENING.title || !OPENING.byline.text || !LINKS.length) {
  console.error('this site has no title and byline over its cover, or no link nodes on its author page; nothing to check');
  process.exit(1);
}

const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const r2 = (n) => (Number.isFinite(n) ? n.toFixed(2) : String(n));
const r3 = (n) => (Number.isFinite(n) ? n.toFixed(3) : String(n));

async function open(bt, name, size, url) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext(phone
    ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
    : { viewport: { width: 1280, height: 800 } });
  // A page elsewhere is answered here, never fetched: following a link is
  // checked by where the browser went, not by what is there.
  await ctx.route((u) => !String(u).startsWith(BASE), (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>elsewhere</title>' }));
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { if (!local(r.url())) outside.push(r.url()); });
  await page.goto(url);
  return { browser, ctx, page, errors, outside, phone, name, W: phone ? 390 : 1280, H: phone ? 844 : 800 };
}

async function tapAt(s, p) {
  if (s.phone) await s.page.touchscreen.tap(p.x, p.y); else await s.page.mouse.click(p.x, p.y);
}

// ── 0: the byline ──

async function coverReady(page) {
  await page.waitForFunction(() => window.PostPipeCover && document.querySelector('[data-cover-art]')
    && document.querySelector('[data-cover-art]').style.opacity !== '0' && document.querySelector('[data-cover-byline]'), null, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
}
const settleCover = (page) => page.waitForFunction(() => window.PostPipeCover && window.PostPipeCover.state !== 'moving', null, { timeout: 4000 }).then(() => page.waitForTimeout(250));
async function goCover(s, to) {
  await s.page.evaluate((t) => window.PostPipeCover.go(t), to);
  await settleCover(s.page);
  await s.page.waitForTimeout(450);
}

const measureByline = (page) => page.evaluate(() => {
  const by = document.querySelector('[data-cover-byline]');
  const r = by.getBoundingClientRect();
  const cs = getComputedStyle(by);
  const art = document.querySelector('[data-cover-art]').getBoundingClientRect();
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  const svg = document.querySelector('[data-cover-title-svg]');
  return {
    text: by.textContent, href: by.href, under: by.getAttribute('data-cover-byline'),
    left: r.left, top: r.top, w: r.width, h: r.height,
    size: parseFloat(cs.fontSize), opacity: Number(cs.opacity), font: cs.fontFamily, pointer: cs.pointerEvents,
    titleFont: svg ? getComputedStyle(svg).fontFamily : '',
    onTop: !!hit && (hit === by || by.contains(hit)),
    art: { left: art.left, top: art.top, width: art.width, height: art.height },
    state: window.PostPipeCover.state,
  };
});

// Where the byline belongs under one layout of the title, from the settings.
function expected(layout, art) {
  const lines = layout.lines;
  const last = lines[lines.length - 1];
  const titleSize = Math.max(...lines.flatMap((l) => l.spans.map((sp) => sp.size))) * art.width;
  return { x: art.left + last.x * art.width, baseline: art.top + last.y * art.height, titleSize };
}

async function checkByline(s, record) {
  const want = bylineText(OPENING.byline);
  const href = new URL(OPENING.byline.href, BASE).href;
  for (const st of ['art', 'graph']) {
    await goCover(s, st);
    const m = await measureByline(s.page);
    const layout = OPENING.title[st].lines.length ? OPENING.title[st] : OPENING.title.art;
    const e = expected(layout, m.art);
    const below = m.top - e.baseline;
    const ratio = m.size / e.titleSize;
    const op = OPENING.byline.opacity[st];
    record(`0 ${st} state: the byline directly under the title, its left edge at the title's last line`,
      m.under === 'title' && Math.abs(m.left - e.x) <= 1.5 && below >= 0 && below <= 0.5 * e.titleSize,
      `left ${r1(m.left)} vs ${r1(e.x)}; top ${r1(below)} px under the baseline (title ${r1(e.titleSize)} px)`);
    record(`0 ${st} state: in the title's face`, m.font === m.titleFont && m.font.includes(OPENING.title.font), m.font);
    if (st === 'graph' && OPENING.byline.graphScale) {
      // Since T36 the graph state's byline is its own size, a share of that
      // title's drawn size (byline.graphScale; "by harold young is too big
      // in the second frame"), as T29 had it.
      const t = await s.page.evaluate(() => {
        const svg = document.querySelector('[data-cover-title-svg]');
        const k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        return Math.max(...[...document.querySelectorAll('[data-cover-title="graph"] tspan')].map((x) => parseFloat(x.getAttribute('font-size')) * k));
      });
      record(`0 graph state: ${OPENING.byline.graphScale} of the title's size (byline.graphScale)`, Math.abs(m.size / (OPENING.byline.graphScale * t) - 1) <= 0.03, `${r1(m.size)} px / ${r1(t)} px = ${r3(m.size / t)}`);
    } else if (OPENING.title.fit === 'width') {
      // Since T35 the byline is set to the width of the title's last line
      // (title.fit width), not to a quarter of its size.
      const w = await s.page.evaluate((st) => {
        const lines = [...document.querySelectorAll(`[data-cover-title="${st}"] [data-cover-title-line]`)];
        return { line: lines[lines.length - 1].getBoundingClientRect().width, by: document.querySelector('[data-cover-byline]').getBoundingClientRect().width };
      }, st);
      record(`0 ${st} state: as wide as the title's last line (title.fit width)`, Math.abs(w.by / w.line - 1) <= 0.1, `${r1(w.by)} px against ${r1(w.line)} px`);
    } else {
      record(`0 ${st} state: about a quarter of the title's size`, Math.abs(ratio - 0.25) <= 0.02, `${r1(m.size)} px / ${r1(e.titleSize)} px = ${r3(ratio)}`);
    }
    record(`0 ${st} state: opacity ${op}`, Math.abs(m.opacity - op) <= 0.005, r3(m.opacity));
    record(`0 ${st} state: lower case, a link to the jacket, on top and taking taps`,
      m.text === want && m.text === m.text.toLowerCase() && m.href === href && m.onTop && m.pointer === 'auto',
      `"${m.text}" → ${m.href}; on top ${m.onTop}; pointer ${m.pointer}`);
    if (SHOTS) await s.page.screenshot({ path: path.join(SHOTS, `t29-byline-${st}-${s.name}-${s.phone ? 'phone' : 'desktop'}.png`) });
    const p = { x: m.left + m.w / 2, y: m.top + m.h / 2 };
    await Promise.all([
      s.page.waitForURL((u) => bare(String(u)) === bare(href), { timeout: 5000 }).catch(() => {}),
      tapAt(s, p),
    ]);
    record(`0 ${st} state: a tap on the byline goes to the jacket, same tab`, bare(s.page.url()) === bare(href), s.page.url());
    await s.page.goto(BASE);
    await coverReady(s.page);
  }
}

// ── 1: the author page ──

async function authorReady(page) {
  await page.waitForSelector('[data-link-card]', { state: 'attached', timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  // Settled: the cards have stopped moving (the graph is framed once it
  // settles).
  await page.waitForFunction(() => {
    const at = [...document.querySelectorAll('.node-card')].map((e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)}`; }).join(' ');
    const last = window.__ppLast; window.__ppLast = at;
    if (at && at === last) { window.__ppSame = (window.__ppSame || 0) + 1; } else window.__ppSame = 0;
    return window.__ppSame >= 6;
  }, null, { timeout: 15000, polling: 250 });
}

const cards = (page) => page.evaluate(() => [...document.querySelectorAll('.node-card')].map((el) => {
  const r = el.getBoundingClientRect();
  const q = (sel) => { const e = el.querySelector(sel); return e ? e.textContent : null; };
  const out = el.querySelector('[data-link-out]');
  const o = out ? out.getBoundingClientRect() : null;
  return {
    id: el.__data__ && el.__data__.id, link: !!el.querySelector('[data-link-card]'),
    title: q('[data-link-title]'), subtitle: q('[data-link-subtitle]'), blurb: q('[data-link-blurb]'),
    tab: el.getAttribute('tabindex'), role: el.getAttribute('role'),
    x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height,
    out: o ? { x: o.left + o.width / 2, y: o.top + o.height / 2 } : null,
    inView: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight,
  };
}));
const readerOpen = (page) => page.evaluate(() => {
  const p = document.querySelector('[data-reader-panel]');
  return !!p && /open/.test(p.className) && getComputedStyle(p).visibility !== 'hidden';
});

// Follow a card: a tap at p, and what happened (this tab or a new one).
async function follow(s, act) {
  const before = s.page.url();
  const popup = s.ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null);
  const nav = s.page.waitForURL((u) => String(u) !== before, { timeout: 4000 }).then(() => true).catch(() => false);
  await act();
  const [np, moved] = await Promise.all([popup, nav]);
  let opened = null;
  if (np) {
    await np.waitForLoadState('domcontentloaded').catch(() => {});
    opened = np.url();
    await np.close();
  }
  return { opened, here: moved ? s.page.url() : null };
}

async function freshAuthor(s) {
  await s.page.goto(AUTHOR);
  await authorReady(s.page);
}

async function checkAuthor(s, record) {
  await authorReady(s.page);
  const all = await cards(s.page);
  const want = LINKS.map((i) => ({ id: slugOf(i), title: i.title, blurb: i.summary, subtitle: i.subtitle || null, link: i.external_url }));
  record('1 the author page: every item a link node, eight of them', all.length === want.length && all.every((c) => c.link) && want.length === 8, `${all.filter((c) => c.link).length} link cards of ${all.length}; ${want.length} items`);
  const shown = want.every((w) => { const c = all.find((x) => x.id === w.id); return c && c.title === w.title && c.blurb === w.blurb && (c.subtitle || null) === w.subtitle; });
  record('1 each card shows its title, its subtitle and its blurb', shown,
    want.filter((w) => { const c = all.find((x) => x.id === w.id); return !c || c.title !== w.title || c.blurb !== w.blurb || (c.subtitle || null) !== w.subtitle; }).map((w) => w.id).join(', ') || `${want.filter((w) => w.subtitle).length} with a subtitle`);
  record('1 every card in view on the first screen', all.every((c) => c.inView), all.filter((c) => !c.inView).map((c) => c.id).join(', '));
  record('1 every card a link for the keyboard', all.every((c) => c.tab === '0' && c.role === 'link'), all.map((c) => `${c.tab}/${c.role}`).slice(0, 2).join(' '));
  const intro = await s.page.evaluate(() => {
    const el = document.querySelector('[data-graph-intro]');
    const pill = document.querySelector('[data-feeds] > *');
    if (!el || !pill) return null;
    const r = el.getBoundingClientRect(), p = pill.getBoundingClientRect();
    const a = el.querySelector('a');
    return { text: el.textContent, top: r.top, pillBottom: p.bottom, left: r.left, pillLeft: p.left, link: a ? a.href : null, linkText: a ? a.textContent : null, visible: r.height > 0 && getComputedStyle(el).visibility !== 'hidden' };
  });
  const introCfg = AUTHOR_SETTINGS.graph && AUTHOR_SETTINGS.graph.intro;
  const introText = introCfg && typeof introCfg === 'object' ? introCfg.text : String(introCfg || '');
  const firstWords = introText.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').split(/\s+/).slice(0, 5).join(' ');
  record('1 the intro shows once, under the title pill', !!intro && intro.visible && intro.top >= intro.pillBottom - 1 && Math.abs(intro.left - intro.pillLeft) <= 8
    && intro.text.startsWith(firstWords) && (await s.page.locator('[data-graph-intro]').count()) === 1,
    intro ? `top ${r1(intro.top)} under the pill's ${r1(intro.pillBottom)}; "${intro.text.slice(0, 48)}…"` : 'no intro');
  record('1 the intro: the bio, its placeholders left out, the book a link to the main site',
    !!intro && !/\[[^\]]*\]/.test(intro.text) && intro.link === BASE && intro.linkText === 'The Epic of Elinor Jones',
    intro ? `link ${intro.link} "${intro.linkText}"` : '');
  const theme = await s.page.evaluate(() => document.documentElement.getAttribute('data-pp-theme'));
  record('1 the default theme', theme === 'default', theme);
  record('1 no page errors, nothing fetched from elsewhere', s.errors.length === 0 && s.outside.length === 0, [...s.errors, ...s.outside].slice(0, 2).join(' | '));
  if (SHOTS) await s.page.screenshot({ path: path.join(SHOTS, `t29-author-${s.name}-${s.phone ? 'phone' : 'desktop'}.png`) });

  // The panel: no groups about reading.
  // The main view's panel: the sliders in the top bar since T32, else the gear.
  await s.page.click((await s.page.$('[data-settings-open]')) ? '[data-settings-open]' : '[data-settings-gear]');
  await s.page.waitForSelector('[data-settings-panel]');
  const sections = await s.page.evaluate(() => [...document.querySelectorAll('[data-settings-panel] [data-section]')].map((e) => e.getAttribute('data-section')));
  record('1 the panel has no groups about reading', !sections.some((x) => ['reading', 'listening', 'place'].includes(x)) && sections.includes('view'), sections.join(', '));
  await s.page.keyboard.press('Escape');
  await freshAuthor(s);

  // A tap on the novel: this site, this tab.
  const home = want.find((w) => !/^[a-z]+:/i.test(w.link));
  const away = want.find((w) => /^https?:/i.test(w.link));
  let c = (await cards(s.page)).find((x) => x.id === home.id);
  let f = await follow(s, () => tapAt(s, c));
  const homeUrl = new URL(home.link, AUTHOR).href;
  record(`1 a tap on "${home.title}" goes to ${homeUrl}, this tab`, f.here === homeUrl && !f.opened, `here ${f.here}; new tab ${f.opened}`);
  await freshAuthor(s);

  // A tap on another site's link: a new tab, this page stays, no reader.
  c = (await cards(s.page)).find((x) => x.id === away.id);
  f = await follow(s, () => tapAt(s, c));
  record(`1 a tap on "${away.title}" opens ${away.link} in a new tab`, f.opened === norm(away.link) && !f.here, `new tab ${f.opened}; here ${f.here}`);
  record('1 after the tap: no reader, the card not opened', !(await readerOpen(s.page)) && (await s.page.evaluate(() => !document.querySelector('.node-card [data-link-card][class*="pinned"]'))), `reader ${await readerOpen(s.page)}`);

  // The ↗ in its corner.
  const other = want.filter((w) => /^https?:/i.test(w.link))[1];
  c = (await cards(s.page)).find((x) => x.id === other.id);
  f = await follow(s, () => tapAt(s, c.out));
  record(`1 the ↗ on "${other.title}" follows its link`, f.opened === norm(other.link), `new tab ${f.opened}`);

  // Two taps: still no reader.
  if (s.phone) {
    await s.page.touchscreen.tap(c.x, c.y);
    await s.page.touchscreen.tap(c.x, c.y);
  } else {
    await s.page.mouse.dblclick(c.x, c.y);
  }
  await s.page.waitForTimeout(800);
  for (const p of s.ctx.pages()) if (p !== s.page) await p.close();
  record('1 a double tap opens no reader', !(await readerOpen(s.page)), `reader ${await readerOpen(s.page)}`);

  // Keyboard: Tab to a card, Enter follows it.
  await freshAuthor(s);
  await s.page.evaluate(() => { const b = document.querySelector('.node-card[data-link-node]'); b.blur(); document.body.focus(); });
  let focused = null;
  for (let i = 0; i < 40 && !focused; i++) {
    await s.page.keyboard.press('Tab');
    focused = await s.page.evaluate(() => { const a = document.activeElement; return a && a.matches && a.matches('.node-card[data-link-node]') ? a.__data__.id : null; });
  }
  const fItem = want.find((w) => w.id === focused);
  f = fItem ? await follow(s, () => s.page.keyboard.press('Enter')) : { opened: null, here: null };
  const fUrl = fItem ? new URL(fItem.link, AUTHOR).href : '';
  record('1 keyboard: Tab reaches a card, Enter follows its link', !!fItem && (f.opened === fUrl || f.here === fUrl), `${focused} → ${f.opened || f.here}`);

  // A #read= link opens no reader.
  await s.page.goto(`${AUTHOR}#read=${encodeURIComponent(LINKS[0].id)}`);
  await authorReady(s.page);
  record('1 a #read= link to a link node opens no reader', !(await readerOpen(s.page)), `reader ${await readerOpen(s.page)}; ${s.page.url()}`);

  // A link node's own page sends the visitor on.
  await s.page.goto(`${AUTHOR}${home.id}.html`);
  await s.page.waitForURL(homeUrl, { timeout: 5000 }).catch(() => {});
  record(`1 ${home.id}.html sends the visitor to ${homeUrl}`, s.page.url() === homeUrl, s.page.url());
  await s.page.goto(`${AUTHOR}${away.id}.html`);
  await s.page.waitForURL(norm(away.link), { timeout: 5000 }).catch(() => {});
  record(`1 ${away.id}.html sends the visitor to ${away.link}`, s.page.url() === norm(away.link), s.page.url());
  record('1 no page errors after all that', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
}

async function run(bt, name, size, record) {
  {
    const s = await open(bt, name, size, BASE);
    await coverReady(s.page);
    await checkByline(s, record);
    record('0 no page errors, nothing fetched from elsewhere', s.errors.length === 0 && s.outside.length === 0, [...s.errors, ...s.outside].slice(0, 2).join(' | '));
    await s.browser.close();
  }
  {
    const s = await open(bt, name, size, AUTHOR);
    await checkAuthor(s, record);
    await s.browser.close();
  }
}

(async () => {
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
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
        const msg = String(e.message || e).split('\n')[0] + ' @' + ((String(e.stack).match(/t29_checks\.js:(\d+)/) || [])[1] || '?');
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

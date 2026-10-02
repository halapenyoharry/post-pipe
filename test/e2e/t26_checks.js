// Browser checks for the title on the cover and the site's accent
// (settings.opening.title, settings.fonts, settings.accent) on a built site:
// the title in the art state where its layout puts it on the art, in the
// site's own face, colour and opacity; the one-line title in the graph state
// at the crown, the graph's own title for the book not drawn; the two
// layouts crossfading with the images as the page is scrubbed; the face
// served by the site itself and nothing fetched from elsewhere; the accent in
// the panel, the reader and the bottom bar, with its contrast measured; no
// page errors. Chromium and WebKit, desktop (1280x800) and phone (390x844),
// light and dark. Screenshots of both states in both modes go to
// PP_E2E_SHOTS when set.
//
//   node test/e2e/t26_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines; PP_E2E_SINGLE_PROCESS=1
// launches Chromium single-process. An engine that cannot start is reported
// as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { titleConfig, titleLayout } = require('../../src/lib/opening');
const { accentPalette } = require('../../src/lib/accent');
const { contrast } = require('../../src/lib/timeOfDay');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39452;
const BASE = `http://localhost:${PORT}/`;
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS = JSON.parse(HTML.match(/window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/)[1]);
const OPENING = SETTINGS.opening;
const TITLE = titleConfig(OPENING.title);
const ACCENT = accentPalette(SETTINGS);
const { toolbarConfig } = require('../../src/lib/toolbar');
const FONT = (SETTINGS.fonts || [])[0];
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SINGLE = process.env.PP_E2E_SINGLE_PROCESS === '1';
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const FIRST = FEED.items.filter((i) => /a1-/.test(i.id)).sort((a, b) => a.series_part - b.series_part)[0];
// Where the plant meets the roots: row 1330 of the 2111-row canvas.
const CROWN = 1330 / 2111;

if (!TITLE || !ACCENT || !FONT) {
  console.error('this site has no opening.title, accent or fonts; nothing to check');
  process.exit(1);
}

async function open(bt, name, size, { scheme = 'light', hash = '', reduced = false } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch(name === 'chromium' && SINGLE ? { args: ['--single-process', '--no-zygote'] } : {});
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: scheme,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  const fonts = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  page.on('response', (r) => { if (/\.(ttf|otf|woff2?)(\?|$)/.test(r.url())) fonts.push({ url: r.url(), status: r.status() }); });
  await page.goto(BASE + hash);
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && document.querySelector('[data-cover-title-svg]') && document.querySelector('[data-cover-art]').style.opacity !== '0', null, { timeout: 8000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  return { browser, ctx, page, errors, outside, fonts, phone, name, scheme };
}

const settle = (page) => page.waitForFunction(() => window.PostPipeCover && window.PostPipeCover.state !== 'moving', null, { timeout: 4000 }).then(() => page.waitForTimeout(150));

// The title as drawn: each layout's opacity, each line's anchor (its x and
// baseline y, through the SVG's own transform to the screen) and its inked
// box; the art's box; the face, fill and opacity.
const titleInfo = (page) => page.evaluate(() => {
  const svg = document.querySelector('[data-cover-title-svg]');
  const art = document.querySelector('[data-cover-art]').getBoundingClientRect();
  const m = svg.getScreenCTM();
  const layouts = {};
  for (const g of svg.querySelectorAll('[data-cover-title]')) {
    layouts[g.getAttribute('data-cover-title')] = {
      opacity: Number(getComputedStyle(g).opacity),
      lines: [...g.querySelectorAll('[data-cover-title-line]')].map((t) => {
        const p = new DOMPoint(Number(t.getAttribute('x')), Number(t.getAttribute('y'))).matrixTransform(m);
        const r = t.getBoundingClientRect();
        return { text: t.textContent, x: p.x, y: p.y, box: [r.left, r.top, r.right, r.bottom], sizes: [...t.querySelectorAll('tspan')].map((s) => s.getBoundingClientRect().height) };
      }),
    };
  }
  const cs = getComputedStyle(svg);
  const top = [...document.querySelectorAll('[data-container-top]')].map((b) => ({ vis: getComputedStyle(b).visibility, hit: getComputedStyle(b.querySelector('.container-badge-hit') || b).pointerEvents, text: b.textContent.trim() }));
  return {
    W: innerWidth, H: innerHeight, p: window.PostPipeCover ? window.PostPipeCover.p : null,
    art: { left: art.left, top: art.top, width: art.width, height: art.height },
    layouts, family: cs.fontFamily, fill: cs.fill, fillOpacity: cs.fillOpacity,
    loaded: document.fonts.check(`20px "${cs.fontFamily.split(',')[0].replace(/["']/g, '')}"`),
    label: svg.getAttribute('aria-label'),
    top,
  };
});

// Every line's anchor against the layout's, in px on the art as drawn.
function placed(info, which) {
  const want = titleLayout(TITLE[which], info.art).lines;
  const got = info.layouts[which].lines;
  const off = want.map((w, i) => (got[i] ? Math.max(Math.abs(got[i].x - w.x), Math.abs(got[i].y - w.y)) : Infinity));
  return { ok: got.length === want.length && off.every((d) => d < 1.5), off: Math.max(...off), want, got };
}

const rgb = (s) => (String(s).match(/[\d.]+/g) || []).slice(0, 3).map(Number);
const hex = (s) => (/^#[0-9a-f]{6}$/i.test(String(s).trim()) ? String(s).trim().toLowerCase() : '#' + rgb(s).map((n) => Math.round(n).toString(16).padStart(2, '0')).join(''));
const fmtBox = (b) => b.map(Math.round).join(',');

async function shot(s, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await s.page.screenshot({ path: path.join(SHOTS, `${name}-${s.scheme}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
}

async function run(bt, name, size, record) {
  for (const scheme of ['light', 'dark']) {
    const s = await open(bt, name, size, { scheme });
    const m = scheme; // the reader's mode
    // ── the art state ──
    const a = await titleInfo(s.page);
    const pa = placed(a, 'art');
    const artLines = a.layouts.art.lines;
    record(`${m}: art state: the title's lines where the layout puts them on the art`, pa.ok && a.layouts.art.opacity === 1 && a.layouts.graph.opacity === 0,
      `${artLines.map((l) => `"${l.text}" at ${Math.round(l.x - a.art.left)},${Math.round(l.y - a.art.top)} of ${Math.round(a.art.width)}x${Math.round(a.art.height)}`).join('; ')}; furthest ${pa.off.toFixed(2)} px; graph line at ${a.layouts.graph.opacity}`);
    const aligned = artLines.length === 3 && Math.max(...artLines.map((l) => l.x)) - Math.min(...artLines.map((l) => l.x)) < a.art.width * 0.03;
    const firstY = (artLines[0].y - a.art.top) / a.art.height;
    const inkL = (Math.min(...artLines.map((l) => l.box[0])) - a.art.left) / a.art.width;
    const inkR = (Math.max(...artLines.map((l) => l.box[2])) - a.art.left) / a.art.width;
    record(`${m}: art state: three lines, left edges aligned, the first at about 40% of the art, left of centre over the stem`, aligned && firstY > 0.35 && firstY < 0.45 && inkL < 0.5 && inkR > 0.5 && (inkL + inkR) / 2 < 0.55,
      `first baseline at ${firstY.toFixed(3)} of the art's height, ink from ${inkL.toFixed(2)} to ${inkR.toFixed(2)} of its width`);
    const ratio = (l) => l.sizes.map((h) => h / l.sizes[l.sizes.length - 1]);
    const spans = artLines[0].sizes;
    record(`${m}: art state: span sizes as set ("The" smaller, "Epic" larger, "of" between; "Elinor" and "Jones" largest)`, spans.length === 3 && spans[0] < spans[2] && spans[2] < spans[1] && artLines[1].sizes[0] > spans[1] && Math.abs(artLines[1].sizes[0] - artLines[2].sizes[0]) < 1,
      `line heights ${artLines.map((l) => l.sizes.map((h) => Math.round(h)).join('/')).join(', ')} px (${ratio(artLines[0]).map((r) => r.toFixed(2)).join(', ')})`);
    record(`${m}: the title's face, colour and opacity`, new RegExp(`^["']?${TITLE.font}["']?,`).test(a.family) && a.loaded && hex(a.fill) === TITLE.color && Math.abs(Number(a.fillOpacity) - TITLE.opacity) < 0.005 && a.label === TITLE.text,
      `${a.family.split(',')[0]} loaded ${a.loaded}, fill ${hex(a.fill)} at ${a.fillOpacity}, name "${a.label}"`);
    const own = s.fonts.find((f) => f.url === BASE + FONT.file);
    record(`${m}: the face is the site's own file, nothing fetched from elsewhere`, !!own && own.status === 200 && s.outside.length === 0,
      `${own ? own.url.replace(BASE, '/') + ' ' + own.status : 'not requested'}; ${s.outside.length} requests elsewhere${s.outside.length ? ': ' + s.outside.slice(0, 3).join(' ') : ''}`);
    await shot(s, 'art');

    // ── scrub partway: the two layouts crossfade ──
    let mid;
    if (s.phone) {
      await s.page.evaluate(() => {
        const el = document.querySelector('[data-cover-stage]');
        const mk = (type, y, ended) => {
          const f = { identifier: 7, target: el, clientX: 195, clientY: y, pageX: 195, pageY: y, screenX: 195, screenY: y };
          try { const t = new Touch(f); return new TouchEvent(type, { bubbles: true, cancelable: true, touches: ended ? [] : [t], targetTouches: ended ? [] : [t], changedTouches: [t] }); } catch (_) {
            const ev = new Event(type, { bubbles: true, cancelable: true });
            const list = (x) => Object.assign([...x], { item: (i) => x[i] || null });
            Object.defineProperty(ev, 'touches', { value: list(ended ? [] : [f]) });
            Object.defineProperty(ev, 'changedTouches', { value: list([f]) });
            return ev;
          }
        };
        window.__end = () => el.dispatchEvent(mk('touchend', 520, true));
        el.dispatchEvent(mk('touchstart', 600));
        el.dispatchEvent(mk('touchmove', 560));
        el.dispatchEvent(mk('touchmove', 520));
      });
      await s.page.waitForTimeout(120);
      mid = { t: await titleInfo(s.page) }; mid.p = mid.t.p;
      await s.page.evaluate(() => window.__end());
    } else {
      await s.page.mouse.move(640, 400);
      await s.page.mouse.wheel(0, 80);
      await s.page.waitForTimeout(40);
      mid = { t: await titleInfo(s.page) }; mid.p = mid.t.p;
    }
    const fa = mid.t.layouts.art.opacity, fg = mid.t.layouts.graph.opacity;
    record(`${m}: scrub: the two layouts crossfade with the images`, mid.p > 0.03 && mid.p < 0.97 && Math.abs(fa - (1 - mid.p)) < 0.03 && Math.abs(fg - mid.p) < 0.03 && placed(mid.t, 'art').ok,
      `p ${mid.p.toFixed(2)}: art layout ${fa.toFixed(2)}, graph layout ${fg.toFixed(2)}, still on the art (furthest ${placed(mid.t, 'art').off.toFixed(2)} px)`);
    await settle(s.page);

    // ── the graph state ──
    await s.page.evaluate(() => window.PostPipeCover.go('graph'));
    await settle(s.page);
    const g = await titleInfo(s.page);
    const pg = placed(g, 'graph');
    const line = g.layouts.graph.lines[0];
    const crownY = g.art.top + CROWN * g.art.height;
    record(`${m}: graph state: one line at the crown, left side, just above the roots`, pg.ok && g.layouts.graph.opacity === 1 && g.layouts.art.opacity === 0 && g.layouts.graph.lines.length === 1
      && line.y < crownY && crownY - line.y < g.art.height * 0.06 && line.box[0] < g.art.left + g.art.width / 2 && line.box[2] <= g.W + 1 && line.box[0] >= -1,
      `"${line.text}" baseline ${Math.round(line.y)} (${(line.y / g.H).toFixed(3)} of the screen), crown ${Math.round(crownY)}, ink ${fmtBox(line.box)}, art layout ${g.layouts.art.opacity}`);
    record(`${m}: graph state: the graph's own title for the book is not drawn`, g.top.length > 0 && g.top.every((t) => t.vis === 'hidden' && t.hit === 'none'),
      g.top.map((t) => `"${t.text}" ${t.vis}, taps ${t.hit}`).join('; '));
    await shot(s, 'graph');

    // ── the accent: the bar, the panel, the reader ──
    const want = scheme === 'light' ? ACCENT.light : ACCENT.dark;
    // With the controls in the top bar (toolbar.position top) the active
    // control is a row turned on in the hourglass menu.
    const atTop = toolbarConfig(SETTINGS).position === 'top';
    if (atTop) {
      await s.page.click('[data-top-menu-button]');
      await s.page.waitForTimeout(250);
      await s.page.click('[data-top-menu] [role="menuitemcheckbox"]');
      await s.page.waitForTimeout(400);
    }
    const bar = await s.page.evaluate(() => {
      const b = document.querySelector('[data-top-menu] [aria-checked="true"]') || document.querySelector('[data-group="layout"] [role="radio"][aria-checked="true"]');
      return b ? { text: b.textContent.trim(), bg: getComputedStyle(b).backgroundColor } : null;
    });
    record(`${m}: the bar's active ${atTop ? 'menu row' : 'pill'} wears the accent's tint`, !!bar && bar.bg === ACCENT.bg, bar ? `"${bar.text}" ${bar.bg}` : 'no active pill');
    if (atTop) {
      await s.page.click('[data-top-menu] [aria-checked="true"]');
      await s.page.waitForTimeout(300);
      await s.page.keyboard.press('Escape');
      await s.page.waitForTimeout(200);
    }
    // The main view's panel: the sliders in the top bar since T32, else the gear.
    await s.page.click((await s.page.$('[data-settings-open]')) ? '[data-settings-open]' : '[data-settings-gear]');
    await s.page.waitForSelector('[data-settings-panel]');
    await s.page.waitForTimeout(350);
    const panel = await s.page.evaluate(() => {
      const p = document.querySelector('[data-settings-panel]');
      const on = p.querySelector('[role="radio"][aria-checked="true"]');
      return {
        accent: getComputedStyle(p).getPropertyValue('--pp-panel-accent').trim(),
        bg: getComputedStyle(p).backgroundColor,
        on: on ? { text: on.textContent.trim(), border: getComputedStyle(on).borderTopColor, bg: getComputedStyle(on).backgroundColor } : null,
      };
    });
    const panelRatio = contrast(want, hex(panel.bg));
    record(`${m}: the panel's accent and its selected choice`, hex(panel.accent) === want && !!panel.on && hex(panel.on.border) === want && panel.on.bg === ACCENT.bg && panelRatio >= 4.5,
      `accent ${panel.accent} on ${hex(panel.bg)}: ${panelRatio.toFixed(2)}:1; selected "${panel.on && panel.on.text}" border ${panel.on && hex(panel.on.border)}, ${panel.on && panel.on.bg}`);
    await s.page.keyboard.press('Escape');
    if (await s.page.$('[data-settings-panel]')) await s.page.click('[data-settings-open], [data-settings-gear]').catch(() => {});
    await s.page.waitForTimeout(250);

    await s.page.evaluate((id) => { window.location.hash = '#read=' + encodeURIComponent(id); }, FIRST.id);
    await s.page.waitForSelector('[data-reader-panel]');
    await s.page.waitForTimeout(600);
    const reader = await s.page.evaluate(() => {
      const r = document.querySelector('[data-reader-panel]');
      const k = r.querySelector('[class*="articleKicker"]');
      return {
        accent: getComputedStyle(r).getPropertyValue('--rp-accent').trim(),
        bg: getComputedStyle(r).backgroundColor,
        kicker: k ? { text: k.textContent.trim().slice(0, 40), color: getComputedStyle(k).color } : null,
      };
    });
    const readerRatio = contrast(want, hex(reader.bg));
    record(`${m}: the reader's accent (its links and the kicker)`, hex(reader.accent) === want && (!reader.kicker || hex(reader.kicker.color) === want) && readerRatio >= 4.5,
      `accent ${reader.accent} on ${hex(reader.bg)}: ${readerRatio.toFixed(2)}:1${reader.kicker ? `; kicker "${reader.kicker.text}" ${hex(reader.kicker.color)}` : ''}`);
    record(`${m}: no page errors`, s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await s.browser.close();
  }

  // ── reduced motion: the states swap, and the title goes with them ──
  {
    const s = await open(bt, name, size, { reduced: true });
    await s.page.keyboard.press('ArrowDown');
    await s.page.waitForTimeout(500);
    const g = await titleInfo(s.page);
    record('reduced motion: the graph state\'s title after the swap', g.layouts.graph.opacity === 1 && g.layouts.art.opacity === 0 && placed(g, 'graph').ok, `graph layout ${g.layouts.graph.opacity}, art layout ${g.layouts.art.opacity}`);
    record('reduced motion: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
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
        const msg = String(e.message || e).split('\n')[0] + ' @' + ((String(e.stack).match(/t26_checks\.js:(\d+)/) || [])[1] || '?');
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

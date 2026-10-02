// Browser checks for one bar at the top, on a built site:
//   1. toolbar.position top: no bottom bar; undo, redo, Reset and the
//      dimensions menu in the top bar in both states (inert in the art
//      state), in one row with the pills, the pages and the gear; the menu
//      opens, a dimension toggles the time axis, Reset resets, undo undoes a
//      drag, Escape and a tap outside close it; no emoji in the bar; the
//      graph's visible height on a phone with the bar at the bottom and at
//      the top;
//   2. the grip is the whole top strip: a tap at (20, 8) and a drag down from
//      the middle of the bar's row each bring the cover back; a tap on a
//      pill still does the pill's thing;
//   3. topBar.links and page icons: a link with an icon draws the SVG, has
//      its label as its accessible name, and follows its href (the same tab,
//      or a new one with newTab); a page with an icon and showLabel false
//      shows the icon alone;
//   4. the site as built: the bar at the top and none at the bottom, its
//      pages, links and sign-up beside the title pill in one row, the menu
//      headed with the site's group label, the containers open and closed at
//      launch as the site says, and a refresh landing on the cover;
//   5. topBar.subscribe, against a stubbed route: nothing sent on load; the
//      sheet opens with the focus in the field; a submit posts the JSON and
//      the thanks line shows; a 400 with { error } shows that text; Escape
//      closes it;
// and no page errors, nothing fetched from elsewhere. Chromium and WebKit,
// desktop (1280x800) and phone (390x844). The site is checked as built, with
// toolbar.position set to top where it is not (and to bottom for the
// "before" measure). Screenshots go to PP_E2E_SHOTS when set.
//
//   node test/e2e/t31_checks.js [path/to/_site]
//
// PP_E2E_ENGINES=chromium,webkit picks engines, PP_E2E_SIZES=desktop,phone sizes. An engine that cannot start
// is reported as not run, not as passing.

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');
const { toolbarConfig } = require('../../src/lib/toolbar');
const { dimensionGroupLabel, dimensionLabels } = require('../../src/lib/dimensionLabels');
const { iconBody } = require('../../src/lib/icons');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39461;
const BASE = `http://localhost:${PORT}/`;
const HTML = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const SETTINGS_RE = /window\.SETTINGS = (\{[\s\S]*?\});\n<\/script>/;
const SETTINGS = JSON.parse(HTML.match(SETTINGS_RE)[1]);
const GROUP = dimensionGroupLabel(SETTINGS);
const DIMS = dimensionLabels(SETTINGS);
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const ACTS = Object.entries(SETTINGS.containers || {})
  .filter(([id, c]) => id.startsWith('container:') && c && c.anchor)
  .map(([id]) => id);
const EMOJI = /[☀-➿]|[\u{1F300}-\u{1FAFF}]/u;

// The page as served with settings changed.
const withSettings = (edit) => (html) => html.replace(SETTINGS_RE, (all, json) => {
  const s = JSON.parse(json);
  edit(s);
  return all.replace(json, JSON.stringify(s));
});
const atPosition = (position) => withSettings((s) => { s.toolbar = { ...(s.toolbar || {}), position }; });
const TOP_SITE = toolbarConfig(SETTINGS).position === 'top' ? null : atPosition('top');
const SHOW = toolbarConfig(SETTINGS).show;

const r1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : String(n));
const off = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

async function open(bt, name, size, { variant = null } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
  });
  if (variant) {
    await ctx.route(BASE, async (route) => {
      const res = await route.fetch();
      route.fulfill({ response: res, body: variant(await res.text()) });
    });
  }
  await ctx.addInitScript(touchEvents);
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  await page.goto(BASE);
  await ready(page);
  return { browser, ctx, page, errors, outside, phone, name, W: phone ? 390 : 1280, H: phone ? 844 : 800 };
}

async function ready(page) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForFunction(() => window.PostPipeCover && window.PostPipeCoverFrame
    && document.querySelector('[data-cover-art]') && document.querySelector('[data-cover-art]').style.opacity !== '0', null, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
}

const state = (page) => page.evaluate(() => (window.PostPipeCover ? window.PostPipeCover.state : null));
const settle = (page) => page.waitForFunction(() => window.PostPipeCover && window.PostPipeCover.state !== 'moving', null, { timeout: 4000 }).then(() => page.waitForTimeout(200));
async function go(s, to) {
  await s.page.evaluate((t) => window.PostPipeCover.go(t), to);
  await settle(s.page);
  await s.page.waitForTimeout(450);
}

function touchEvents() {
  window.__touchEvent = (type, el, x, y, ended) => {
    const fields = { identifier: 7, target: el, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y };
    try {
      const t = new Touch(fields);
      return new TouchEvent(type, { bubbles: true, cancelable: true, composed: true, touches: ended ? [] : [t], targetTouches: ended ? [] : [t], changedTouches: [t] });
    } catch (_) {
      const ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
      const list = (a) => Object.assign([...a], { item: (i) => a[i] || null });
      Object.defineProperty(ev, 'touches', { value: list(ended ? [] : [fields]) });
      Object.defineProperty(ev, 'targetTouches', { value: list(ended ? [] : [fields]) });
      Object.defineProperty(ev, 'changedTouches', { value: list([fields]) });
      return ev;
    }
  };
}
async function touchDrag(page, selector, x, y0, y1, steps = 8) {
  await page.evaluate(async ({ selector, x, y0, y1, steps }) => {
    const el = document.querySelector(selector);
    el.dispatchEvent(window.__touchEvent('touchstart', el, x, y0));
    for (let i = 1; i <= steps; i += 1) {
      await new Promise((r) => setTimeout(r, 30));
      el.dispatchEvent(window.__touchEvent('touchmove', el, x, y0 + ((y1 - y0) * i) / steps));
    }
    el.dispatchEvent(window.__touchEvent('touchend', el, x, y1, true));
  }, { selector, x, y0, y1, steps });
}
async function drag(page, from, by, steps = 8) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) await page.mouse.move(from.x + (by.x * i) / steps, from.y + (by.y * i) / steps);
  await page.mouse.up();
}
async function tapAt(s, p) {
  if (s.phone) await s.page.touchscreen.tap(p.x, p.y); else await s.page.mouse.click(p.x, p.y);
}

// The top bar: its row, the graph's controls in it, the gear.
const bar = (page) => page.evaluate(() => {
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, w: r.width, h: r.height }; };
  const feeds = document.querySelector('[data-feeds]');
  const row = feeds ? [...feeds.children].filter((el) => !el.matches('[data-graph-intro]') && getComputedStyle(el).position !== 'fixed' && el.getBoundingClientRect().width > 0) : [];
  const controls = document.querySelector('[data-top-graph-controls]');
  const icon = (sel) => {
    const el = document.querySelector(`[data-top-graph-controls] ${sel}`);
    if (!el) return null;
    return { ...box(el), label: el.getAttribute('aria-label') || '', title: el.getAttribute('title') || '', svg: !!el.querySelector('svg[data-icon]'), inert: !!el.closest('[inert]'), text: el.textContent };
  };
  // The settings control: the gear, or since T32 the sliders in the top bar.
  const gear = document.querySelector('[data-settings-gear]');
  return {
    bottomBar: document.querySelectorAll('[data-toolbar]').length,
    row: row.map((el) => ({ ...box(el), what: el.getAttribute('data-top-page') || (el.matches('[data-top-graph-controls]') ? 'controls' : el.getAttribute('title') || el.tagName) })),
    controlsInBar: !!(controls && feeds && feeds.contains(controls)),
    icons: { undo: icon('[data-top-undo]'), redo: icon('[data-top-redo]'), reset: icon('[data-toolbar-reset]'), menu: icon('[data-top-menu-button]') },
    gear: box(gear),
    text: (feeds ? feeds.textContent : '') + (gear ? gear.textContent : ''),
    fit: feeds ? ['data-fit-dots', 'data-fit-icons', 'data-fit-title'].filter((a) => feeds.hasAttribute(a)) : [],
    firstPill: (() => { const p = document.querySelector('[data-source-pill]'); return p ? { w: p.getBoundingClientRect().width, text: p.textContent, title: p.getAttribute('title') } : null; })(),
  };
});

const oneRow = (b) => {
  if (!b.row.length) return false;
  const top = b.row[0].top;
  const same = b.row.every((r) => Math.abs(r.top - top) <= 2);
  const rowMid = top + b.row[0].h / 2;
  const gearOk = !b.gear || (b.gear.top <= rowMid && b.gear.bottom >= rowMid && b.row.every((r) => r.right <= b.gear.left));
  return same && gearOk;
};

const timeAxis = (page) => page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('post-pipe:viewstate') || '{}');
  return s.timeAxis || { on: false };
});

const actCentre = (page, id) => page.evaluate((id) => {
  const g = document.querySelector(`.container-group[data-container-id="${CSS.escape(id)}"]`);
  if (!g) return null;
  const macro = g.querySelector('.container-macro-node');
  const closed = !!macro && getComputedStyle(macro).display !== 'none';
  const m = (closed ? macro : g.querySelector('.container-badge')).getScreenCTM();
  return { closed, x: m.e, y: m.f };
}, id);

// The graph's visible height: from the bottom of the top bar's row (and the
// gear) to the top of the bottom bar, or the screen's foot without one.
const visible = (page) => page.evaluate(() => {
  let top = 0;
  for (const el of document.querySelectorAll('[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]')) {
    const r = el.getBoundingClientRect();
    if (r.width && r.top < innerHeight * 0.2) top = Math.max(top, r.bottom);
  }
  const tb = document.querySelector('[data-toolbar]');
  const bottom = tb ? tb.getBoundingClientRect().top : innerHeight;
  const rights = document.querySelector('[data-rights]');
  return { top, bottom, height: bottom - top, H: innerHeight, rightsTop: rights ? rights.getBoundingClientRect().top : null };
});

async function shot(s, name) {
  if (!SHOTS) return;
  fs.mkdirSync(SHOTS, { recursive: true });
  await s.page.screenshot({ path: path.join(SHOTS, `${name}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
}

const VERTICAL = [];

async function part1(bt, name, size, record) {
  const s = await open(bt, name, size, { variant: TOP_SITE });
  const p = s.page;

  // The art state: present, in one row, not live.
  const a = await bar(p);
  record('1 no bottom bar in the DOM', a.bottomBar === 0, `${a.bottomBar} [data-toolbar]`);
  const icons = Object.entries(a.icons);
  const want = SHOW.history ? ['undo', 'redo', 'reset', 'menu'] : ['reset', 'menu'];
  record('1 art state: the icons are in the top bar', a.controlsInBar && want.every((k) => a.icons[k] && a.icons[k].svg),
    want.map((k) => `${k} ${a.icons[k] ? 'svg' : 'missing'}`).join(', '));
  record('1 art state: they take no taps (inert)', want.every((k) => a.icons[k] && a.icons[k].inert));
  record('1 art state: one row (pills, pages, icons, gear)', oneRow(a), `${a.row.map((r) => `${r.what}@${r.top}`).join(' ')}; gear ${a.gear && a.gear.left}; fit ${a.fit.join(',') || 'none'}`);
  record('1 each icon has an aria-label and a title, and the pills\' height',
    icons.filter(([, v]) => v).every(([, v]) => v.label && v.title && Math.abs(v.h - a.row[0].h) <= 0.5),
    icons.filter(([, v]) => v).map(([k, v]) => `${k} "${v.label}" ${v.h}px`).join(', '));
  record('1 no emoji in the top bar', !EMOJI.test(a.text), JSON.stringify(a.text.match(EMOJI) || ''));
  const tapReset = await p.evaluate(() => { const el = document.querySelector('[data-toolbar-reset]'); const r = el.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!(hit && el.contains(hit)) && !el.closest('[inert]'); });
  record('1 art state: Reset cannot be tapped', !tapReset);
  await shot(s, 't31-art');

  // The graph state: live, still one row.
  await go(s, 'graph');
  const g = await bar(p);
  record('1 graph state: the icons are in the top bar, live', want.every((k) => g.icons[k] && !g.icons[k].inert));
  record('1 graph state: one row', oneRow(g), `${g.row.map((r) => `${r.what}@${r.top}`).join(' ')}; fit ${g.fit.join(',') || 'none'}; first pill ${g.firstPill && r1(g.firstPill.w)} px`);
  // Since T32 a site can leave the source pills out (topBar.showSourcePills).
  if (require('../../src/lib/topBar').topBarConfig(SETTINGS).showSourcePills) {
    record('1 the first pill keeps its whole text as its name', !!g.firstPill && g.firstPill.text.length > 0 && g.firstPill.title.includes(g.firstPill.text.trim()), g.firstPill && `${g.firstPill.text} / ${g.firstPill.title}`);
  } else {
    record('1 no source pill (topBar.showSourcePills false)', !g.firstPill, g.firstPill ? 'a pill is there' : 'none');
  }
  await shot(s, 't31-graph');

  // The menu.
  await p.click('[data-top-menu-button]');
  await p.waitForTimeout(250);
  const menu = await p.evaluate(() => {
    const m = document.querySelector('[role="menu"][data-top-menu]');
    if (!m) return null;
    const r = m.getBoundingClientRect();
    const b = document.querySelector('[data-top-menu-button]').getBoundingClientRect();
    return {
      heading: (m.querySelector('[data-group-label]') || {}).textContent || '',
      dims: [...m.querySelectorAll('[role="menuitemcheckbox"][data-dimension]')].map((e) => e.textContent.trim()),
      actions: [...m.querySelectorAll('[data-view-action]')].map((e) => e.textContent.trim()),
      layout: m.querySelectorAll('[data-layout]').length,
      under: r.top >= b.bottom - 1,
      inView: r.left >= 0 && r.right <= innerWidth,
      focus: document.activeElement && m.contains(document.activeElement),
      expanded: document.querySelector('[data-top-menu-button]').getAttribute('aria-expanded'),
    };
  });
  record('1 the menu opens under the hourglass, within the screen', !!menu && menu.under && menu.inView && menu.expanded === 'true');
  // Since T32 the view actions and the layout are in the main view's panel
  // (the sliders after the hourglass); the menu keeps the timelines.
  record('1 the menu: headed with the group label, a row per dimension, no view actions',
    !!menu && menu.heading.toLowerCase() === GROUP.toLowerCase() && menu.dims.length === DIMS.length && menu.actions.length === 0,
    menu && `"${menu.heading}"; ${menu.dims.join(', ')}; ${menu.actions.length} view actions`);
  record('1 the menu: no layout row (it is in the main view\'s panel)', !!menu && menu.layout === 0, `${menu && menu.layout} layout options`);
  record('1 the menu takes the focus; ArrowDown moves it', !!menu && menu.focus);
  await p.keyboard.press('ArrowDown');
  const second = await p.evaluate(() => document.activeElement && document.activeElement.textContent.trim());
  record('1 ArrowDown moves to the next row', second === (menu && menu.dims[1]), `focus on "${second}"`);

  const before = await timeAxis(p);
  const pick = DIMS[1] || DIMS[0];
  await p.click(`[data-top-menu] [data-dimension="${pick.id}"]`);
  await p.waitForTimeout(500);
  const after = await timeAxis(p);
  const checked = await p.evaluate((id) => (document.querySelector(`[data-top-menu] [data-dimension="${id}"]`) || {}).getAttribute && document.querySelector(`[data-top-menu] [data-dimension="${id}"]`).getAttribute('aria-checked'), pick.id);
  record('1 a dimension row turns its axis on (viewState.timeAxis)', !before.on && after.on === true && after.dimension === pick.id && checked === 'true',
    `before ${JSON.stringify({ on: !!before.on, dimension: before.dimension })}, after ${JSON.stringify({ on: after.on, dimension: after.dimension })}, row ${checked}`);
  await p.click(`[data-top-menu] [data-dimension="${pick.id}"]`);
  await p.waitForTimeout(500);
  const again = await timeAxis(p);
  record('1 the same row again turns it off', again.on === false, JSON.stringify({ on: again.on }));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  const esc = await p.evaluate(() => ({ menu: !!document.querySelector('[data-top-menu]'), focus: document.activeElement && document.activeElement.matches('[data-top-menu-button]') }));
  record('1 Escape closes the menu, the focus back on the hourglass', !esc.menu && esc.focus);
  await p.click('[data-top-menu-button]');
  await p.waitForTimeout(200);
  await p.mouse.click(s.W / 2, s.H - 120);
  await p.waitForTimeout(250);
  record('1 a tap outside closes the menu', !(await p.$('[data-top-menu]')));

  // Undo undoes a drag; Reset resets.
  const id = ACTS[ACTS.length - 1];
  const from = await actCentre(p, id);
  const by = { x: s.phone ? -40 : -60, y: s.phone ? 50 : 40 };
  await drag(p, from, by);
  await p.waitForTimeout(1200);
  const dropped = await actCentre(p, id);
  await p.click('[data-top-undo]');
  await p.waitForTimeout(1500);
  const undone = await actCentre(p, id);
  record('1 undo undoes a drag', off(dropped, from) > 20 && off(undone, from) <= 3,
    `dragged ${r1(off(dropped, from))} px, after undo ${r1(off(undone, from))} px from where it was`);
  await drag(p, undone, by);
  await p.waitForTimeout(1200);
  const moved = await actCentre(p, id);
  await p.click('[data-toolbar-reset]');
  await p.waitForTimeout(1800);
  const reset = await actCentre(p, id);
  record('1 Reset puts it back', off(moved, from) > 20 && off(reset, from) <= 3, `${r1(off(reset, from))} px from its place after Reset`);

  // Cmd+Z and Cmd+Shift+Z.
  await drag(p, reset, by);
  await p.waitForTimeout(1200);
  await p.mouse.click(s.W / 2, s.H - 60);
  await p.keyboard.press(name === 'webkit' ? 'Meta+z' : 'Control+z');
  await p.waitForTimeout(1500);
  const kz = await actCentre(p, id);
  await p.keyboard.press(name === 'webkit' ? 'Meta+Shift+z' : 'Control+Shift+z');
  await p.waitForTimeout(1500);
  const kr = await actCentre(p, id);
  record('1 Cmd+Z undoes, Cmd+Shift+Z redoes', off(kz, from) <= 3 && off(kr, from) > 20, `after undo ${r1(off(kz, from))} px, after redo ${r1(off(kr, from))} px from its place`);

  if (s.phone) {
    const v = await visible(p);
    VERTICAL.push({ run: `${name} top`, ...v });
  }
  record('1 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  record('1 nothing fetched from elsewhere', s.outside.length === 0, s.outside.slice(0, 2).join(' | '));
  await s.browser.close();

  // The space before: the same page with the bar at the bottom.
  if (s.phone) {
    const b = await open(bt, name, size, { variant: atPosition('bottom') });
    await go(b, 'graph');
    const v = await visible(b.page);
    VERTICAL.push({ run: `${name} bottom`, ...v });
    await shot(b, 't31-before');
    await b.browser.close();
  }
}

async function part2(bt, name, size, record) {
  const s = await open(bt, name, size);
  const p = s.page;
  await go(s, 'graph');
  const strip = await p.evaluate(() => {
    const h = document.querySelector('[data-cover-handle]').getBoundingClientRect();
    let row = 0;
    for (const el of document.querySelectorAll('[data-feeds] > *:not([data-graph-intro]), [data-settings-gear]')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.top < innerHeight * 0.2) row = Math.max(row, r.bottom);
    }
    const grip = document.querySelector('[data-cover-handle] > span').getBoundingClientRect();
    return { left: h.left, top: h.top, w: h.width, h: h.height, row, gripX: grip.left + grip.width / 2, gripY: grip.top };
  });
  record('2 the grip spans the width, from the top to 16 px under the bar\'s row',
    strip.left === 0 && Math.abs(strip.w - s.W) <= 0.5 && strip.top === 0 && Math.abs(strip.h - (Math.ceil(strip.row) + 16)) <= 1,
    `${r1(strip.w)} x ${r1(strip.h)} px, row ends at ${r1(strip.row)}`);
  record('2 the grip mark stays at the top centre', Math.abs(strip.gripX - s.W / 2) <= 1 && strip.gripY <= 6, `mark at ${r1(strip.gripX)}, ${r1(strip.gripY)}`);

  // A tap at 20 px from the left, 8 from the top.
  await tapAt(s, { x: 20, y: 8 });
  await settle(p);
  record('2 a tap at (20, 8) brings the cover back', (await state(p)) === 'art', await state(p));
  await go(s, 'graph');

  // A drag down from the middle of the bar's row, in a gap between controls.
  const at = await p.evaluate(() => {
    const feeds = document.querySelector('[data-feeds] > *');
    const y = feeds ? feeds.getBoundingClientRect().top + feeds.getBoundingClientRect().height / 2 : 24;
    const W = innerWidth;
    for (let d = 0; d < W / 2; d += 2) {
      for (const x of [W / 2 + d, W / 2 - d]) {
        const e = document.elementFromPoint(x, y);
        if (e && e.closest('[data-cover-handle]')) return { x, y };
      }
    }
    return null;
  });
  if (at) {
    if (s.phone) await touchDrag(p, '[data-cover-handle]', at.x, at.y, at.y + 320, 10);
    else await drag(p, at, { x: 0, y: 320 }, 10);
    await settle(p);
  }
  record('2 a drag down from the middle of the bar\'s row brings the cover back', !!at && (await state(p)) === 'art', at ? `from (${r1(at.x)}, ${r1(at.y)}): ${await state(p)}` : 'no gap in the row');
  await go(s, 'graph');

  // A tap on a pill still does the pill's thing.
  const pill = await p.evaluate(() => {
    const el = document.querySelector('[data-top-pages]') || document.querySelector('[data-source-pill]');
    const r = el.getBoundingClientRect();
    return { x: r.left + Math.min(16, r.width / 2), y: r.top + r.height / 2, page: el.matches('[data-top-pages]') };
  });
  await tapAt(s, pill);
  await p.waitForTimeout(600);
  const after = await p.evaluate(() => ({ hash: location.hash, hidden: !!document.querySelector('[data-source-pill][class*="hidden"]') }));
  record('2 a tap on a pill still does its thing, the page staying on the graph',
    (pill.page ? after.hash.startsWith('#read=') : after.hidden) && (await state(p)) === 'graph',
    `${pill.page ? 'page: ' + after.hash : 'source hidden ' + after.hidden}; ${await state(p)}`);
  record('2 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// Part 3's site: the first page as an icon alone, and two links of its own.
const ICON = iconBody('check');
const OUT_URL = 'https://example.org/t31-link';
const LINKS_SITE = withSettings((s) => {
  s.topBar = s.topBar || {};
  s.topBar.pages = (s.topBar.pages || []).map((pg, i) => (i === 0 ? { ...pg, icon: ICON, showLabel: false } : pg));
  s.topBar.links = [
    { id: 't31-out', label: 'support the work', href: OUT_URL, icon: ICON, newTab: true },
    { id: 't31-same', label: 'same tab', href: './?t31=same', icon: ICON },
  ];
});

async function part3(bt, name, size, record) {
  const s = await open(bt, name, size, { variant: LINKS_SITE });
  const p = s.page;
  await s.ctx.route(`${OUT_URL}*`, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>out</title>' }));
  const pageId = (SETTINGS.topBar && SETTINGS.topBar.pages && SETTINGS.topBar.pages[0]) ? SETTINGS.topBar.pages[0].id : null;
  const pageLabel = pageId ? (SETTINGS.topBar.pages[0].label || pageId) : null;
  const seen = await p.evaluate(() => [...document.querySelectorAll('[data-top-link]')].map((a) => ({
    id: a.getAttribute('data-top-link'), svg: !!a.querySelector('svg[data-icon] path'), h: a.getBoundingClientRect().height,
    text: a.textContent.trim(), target: a.getAttribute('target'), rel: a.getAttribute('rel'), href: a.getAttribute('href'),
  })));
  const out = seen.find((l) => l.id === 't31-out');
  record('3 a link with an icon draws its SVG at the pills\' height, no text', !!out && out.svg && out.h === 24 && out.text === '', out && `${out.h}px, text "${out.text}"`);
  const named = await p.getByRole('link', { name: 'support the work', exact: true }).count();
  record('3 the link\'s label is its accessible name', named === 1, `${named} link named so`);
  record('3 newTab: target _blank, rel noopener', !!out && out.target === '_blank' && out.rel === 'noopener', out && `${out.target} ${out.rel}`);
  const [popup] = await Promise.all([s.ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), p.click('[data-top-link="t31-out"]')]);
  if (popup) await popup.waitForLoadState().catch(() => {});
  record('3 a tap follows the link in a new tab', !!popup && popup.url().startsWith(OUT_URL) && p.url().startsWith(BASE), popup ? popup.url() : 'no new tab');
  if (popup) await popup.close();
  if (pageId) {
    const pg = await p.evaluate((id) => {
      const b = document.querySelector(`[data-top-page="${CSS.escape(id)}"]`);
      return b && { svg: !!b.querySelector('svg[data-icon] path'), text: b.textContent.trim(), w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height };
    }, pageId);
    const byName = await p.getByRole('button', { name: pageLabel, exact: true }).count();
    record('3 a page with an icon and showLabel false shows the icon alone, its label its name', !!pg && pg.svg && pg.text === '' && pg.w === 24 && byName === 1,
      pg && `text "${pg.text}", ${pg.w}x${pg.h}, ${byName} button named "${pageLabel}"`);
  }
  await p.click('[data-top-link="t31-same"]');
  await p.waitForURL(/t31=same/, { timeout: 5000 }).catch(() => {});
  record('3 a link without newTab follows its href in the same tab', p.url().includes('t31=same'), p.url());
  record('3 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

// Part 5's site: a sign-up of its own, posting to a stubbed route.
const SUB = { action: '/api/t31-subscribe', label: 'notify me', icon: iconBody('check'), placeholder: 'your email', thanks: 'Thanks, you are on the list.', error: 'That did not work.' };
const SUB_SITE = withSettings((s) => { s.topBar = { ...(s.topBar || {}), subscribe: SUB }; });

async function part5(bt, name, size, record) {
  const s = await open(bt, name, size, { variant: SUB_SITE });
  const p = s.page;
  const posts = [];
  let reply = { status: 200, body: { success: true } };
  await s.ctx.route(`${BASE}api/t31-subscribe`, (route) => {
    const r = route.request();
    posts.push({ method: r.method(), type: r.headers()['content-type'], body: r.postData() });
    route.fulfill({ status: reply.status, contentType: 'application/json', body: JSON.stringify(reply.body) });
  });
  await p.waitForTimeout(400);
  record('5 nothing is sent on load', posts.length === 0, `${posts.length} requests`);
  const btn = await p.evaluate(() => { const b = document.querySelector('[data-top-subscribe]'); return b && { label: b.getAttribute('aria-label'), svg: !!b.querySelector('svg[data-icon]'), h: b.getBoundingClientRect().height }; });
  record('5 the sign-up is an icon button in the top bar, its label its name', !!btn && btn.label === SUB.label && btn.svg && btn.h === 24, JSON.stringify(btn));
  await p.click('[data-top-subscribe]');
  await p.waitForTimeout(250);
  const sheet = await p.evaluate(() => {
    const d = document.querySelector('[data-top-subscribe-sheet]');
    if (!d) return null;
    const i = d.querySelector('input');
    const r = d.getBoundingClientRect();
    const bar = document.querySelector('[data-top-subscribe]').getBoundingClientRect();
    return { role: d.getAttribute('role'), type: i.type, required: i.required, placeholder: i.placeholder, focus: document.activeElement === i, under: r.top >= bar.bottom, inView: r.left >= 0 && r.right <= innerWidth, submit: d.querySelector('[data-top-subscribe-submit]').textContent };
  });
  record('5 the sheet opens under the bar: a dialog, an email field (required, its placeholder) with the focus, the submit reading the label',
    !!sheet && sheet.role === 'dialog' && sheet.type === 'email' && sheet.required && sheet.placeholder === SUB.placeholder && sheet.focus && sheet.under && sheet.inView && sheet.submit === SUB.label,
    JSON.stringify(sheet));
  await p.keyboard.type('reader@example.org');
  await p.click('[data-top-subscribe-submit]');
  await p.waitForFunction(() => (document.querySelector('[data-top-subscribe-message]') || {}).textContent, null, { timeout: 4000 }).catch(() => {});
  const ok = await p.evaluate(() => ({ msg: document.querySelector('[data-top-subscribe-message]').textContent, value: document.querySelector('[data-top-subscribe-sheet] input').value }));
  const first = posts[0] || {};
  record('5 a submit posts JSON { email } to the action', posts.length === 1 && first.method === 'POST' && /application\/json/.test(first.type || '') && first.body === JSON.stringify({ email: 'reader@example.org' }),
    `${posts.length} posts: ${first.method} ${first.type} ${first.body}`);
  record('5 a 2xx shows the thanks line and clears the field', ok.msg === SUB.thanks && ok.value === '', JSON.stringify(ok));
  reply = { status: 400, body: { error: 'This email is already on the list.' } };
  await p.fill('[data-top-subscribe-sheet] input', 'reader@example.org');
  await p.click('[data-top-subscribe-submit]');
  await p.waitForFunction(() => /already/.test((document.querySelector('[data-top-subscribe-message]') || {}).textContent || ''), null, { timeout: 4000 }).catch(() => {});
  const bad = await p.evaluate(() => document.querySelector('[data-top-subscribe-message]').textContent);
  record('5 a 400 with { error } shows that text', bad === 'This email is already on the list.', bad);
  reply = { status: 500, body: {} };
  await p.click('[data-top-subscribe-submit]');
  await p.waitForFunction((t) => (document.querySelector('[data-top-subscribe-message]') || {}).textContent === t, SUB.error, { timeout: 4000 }).catch(() => {});
  const plain = await p.evaluate(() => document.querySelector('[data-top-subscribe-message]').textContent);
  record('5 a reply without its own error shows the site\'s error', plain === SUB.error, plain);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  const esc = await p.evaluate(() => ({ open: !!document.querySelector('[data-top-subscribe-sheet]'), reader: location.hash, cover: window.PostPipeCover.state }));
  record('5 Escape closes the sheet', !esc.open, JSON.stringify(esc));
  await p.click('[data-top-subscribe]');
  await p.waitForTimeout(200);
  await p.mouse.click(s.W / 2, s.H - 100);
  await p.waitForTimeout(250);
  record('5 a tap outside closes the sheet', !(await p.$('[data-top-subscribe-sheet]')));
  record('5 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  await s.browser.close();
}

const { topBarConfig } = require('../../src/lib/topBar');
const SITE_TOP = topBarConfig(SETTINGS);
const GRAPH_SET = SETTINGS.graph || {};
// Which acts start closed: graph.containersStart when set, else the ones
// graph.initialCollapsed names.
const startsClosed = (id) => (GRAPH_SET.containersStart === 'closed' ? true
  : GRAPH_SET.containersStart === 'open' ? false
    : (GRAPH_SET.initialCollapsed || []).includes(id));

async function part4(bt, name, size, record) {
  const s = await open(bt, name, size);
  const p = s.page;
  const pos = toolbarConfig(SETTINGS).position;
  const a = await bar(p);
  record(`4 site: the controls ${pos === 'top' ? 'in the top bar, no bottom bar' : 'in the bottom bar'}`,
    pos === 'top' ? a.bottomBar === 0 && a.controlsInBar : a.bottomBar === 1, `toolbar.position ${pos}; ${a.bottomBar} bottom bars`);
  const items = await p.evaluate(() => ({
    pages: [...document.querySelectorAll('[data-top-page]')].map((b) => ({ id: b.getAttribute('data-top-page'), name: b.getAttribute('aria-label') || b.textContent.trim(), svg: !!b.querySelector('svg[data-icon]'), left: b.getBoundingClientRect().left })),
    links: [...document.querySelectorAll('[data-top-link]')].map((l) => ({ id: l.getAttribute('data-top-link'), name: l.getAttribute('aria-label'), href: l.getAttribute('href'), target: l.getAttribute('target'), svg: !!l.querySelector('svg[data-icon]'), left: l.getBoundingClientRect().left })),
    sub: (() => { const b = document.querySelector('[data-top-subscribe]'); return b && { name: b.getAttribute('aria-label'), svg: !!b.querySelector('svg[data-icon]'), left: b.getBoundingClientRect().left }; })(),
    title: (() => { const t = document.querySelector('[data-source-pill]'); return t && t.getBoundingClientRect().right; })(),
  }));
  record('4 site: its pages beside the title pill, with their icons', SITE_TOP.pages.every((pg) => items.pages.some((x) => x.id === pg.id && x.name === pg.label && x.svg === !!pg.icon && x.left > items.title)),
    items.pages.map((x) => `${x.id} "${x.name}"${x.svg ? ' icon' : ''}`).join(', '));
  record('4 site: its links next, each an icon to its address', SITE_TOP.links.every((l) => items.links.some((x) => x.id === l.id && x.name === l.label && x.href === l.href && (x.target === '_blank') === l.newTab && x.svg === !!l.icon)),
    items.links.map((x) => `${x.id} "${x.name}" ${x.href} ${x.target || ''}`).join(', ') || 'none');
  record('4 site: its sign-up after them', !SITE_TOP.subscribe || (!!items.sub && items.sub.name === SITE_TOP.subscribe.label && items.sub.svg === !!SITE_TOP.subscribe.icon),
    items.sub ? `"${items.sub.name}"` : 'none');
  record('4 site: one row in the art state', oneRow(a), `${a.row.map((r) => r.what).join(' | ')}; fit ${a.fit.join(',') || 'none'}`);
  await shot(s, 't31-site-art');
  await go(s, 'graph');
  const g = await bar(p);
  record('4 site: one row in the graph state', oneRow(g), `fit ${g.fit.join(',') || 'none'}; first pill ${g.firstPill && r1(g.firstPill.w)} px`);
  const acts = {};
  for (const id of ACTS) acts[id] = await actCentre(p, id);
  record('4 site: the acts open and closed at launch as the site says', ACTS.every((id) => acts[id] && acts[id].closed === startsClosed(id)),
    ACTS.map((id) => `${id.replace('container:', '')} ${acts[id] && (acts[id].closed ? 'closed' : 'open')}`).join(', '));
  if (pos === 'top') {
    await p.click('[data-top-menu-button]');
    await p.waitForTimeout(250);
    const menu = await p.evaluate(() => ({ heading: (document.querySelector('[data-top-menu] [data-group-label]') || {}).textContent, rows: [...document.querySelectorAll('[data-top-menu] [data-dimension]')].map((e) => e.textContent.trim()), layout: document.querySelectorAll('[data-top-menu] [data-layout]').length }));
    record(`4 site: the hourglass menu lists the "${GROUP}" rows`, menu.heading.toLowerCase() === GROUP.toLowerCase() && menu.rows.length === DIMS.length && (menu.layout > 0) === SHOW.layout,
      `"${menu.heading}": ${menu.rows.join(', ')}; ${menu.layout} layout options`);
    await shot(s, 't31-site-menu');
    await p.keyboard.press('Escape');
  }
  await shot(s, 't31-site-graph');
  await p.reload();
  await ready(p);
  await settle(p);
  record('4 site: a refresh lands on the cover', (await state(p)) === 'art', await state(p));
  record('4 site: no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  record('4 site: nothing fetched from elsewhere', s.outside.length === 0, s.outside.slice(0, 2).join(' | '));
  await s.browser.close();
}

async function run(bt, name, size, record) {
  await part1(bt, name, size, record);
  await part2(bt, name, size, record);
  await part3(bt, name, size, record);
  await part4(bt, name, size, record);
  await part5(bt, name, size, record);
}

(async () => {
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
        const msg = String(e.message || e).split('\n')[0] + ' @' + ((String(e.stack).match(/t31_checks\.js:(\d+)/) || [])[1] || '?');
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
  for (const v of VERTICAL) {
    console.log(`VERTICAL [${v.run}] graph visible ${r1(v.height)} px of ${v.H} (top bar to ${r1(v.top)}, bottom at ${r1(v.bottom)}; rights line at ${r1(v.rightsTop)})`);
  }
  const pass = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  const notRun = runs.filter((r) => !r.ran).length;
  console.log(`\n${pass} PASS, ${fail} FAIL, ${notRun} not run`);
  if (process.env.PP_E2E_JSON) fs.writeFileSync(process.env.PP_E2E_JSON, JSON.stringify({ results, runs, vertical: VERTICAL }, null, 2));
  process.exit(fail ? 1 : 0);
})();

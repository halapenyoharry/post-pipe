// Browser checks for graph.containerCount: on a site that sets it false, no
// container title (open label, closed blob) and no source pill at the top
// shows a count. Chromium and WebKit, desktop (1280x800) and phone (390x844).
//
//   node test/e2e/t19_checks.js [path/to/_site]
//
// A title may carry digits of its own ("Act 1", a status like "beginning
// october 15th"); what must not appear is anything beyond the title and
// status. As a control, the same site is loaded with the setting turned back
// on, and the counts must then be found.

const path = require('path');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39435;
const BASE = `http://localhost:${PORT}/`;
const BOOK = 'container:epic-of-elinor-jones';
const ACT = 'container:act-1';

async function settle(page, ms = 5500) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForTimeout(ms);
}

// Every visible container title (open label or closed blob), with what it
// shows beyond its own title and status.
const titles = (page) => page.evaluate(() => {
  const vis = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (getComputedStyle(e).display === 'none') return false;
    }
    return true;
  };
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const out = [];
  for (const g of document.querySelectorAll('.container-group')) {
    const d = g.__data__;
    for (const sel of ['.container-badge-text', '.container-macro-text']) {
      const t = g.querySelector(sel);
      if (!t || !vis(t)) continue;
      let rest = norm(t.textContent);
      for (const own of [d.label || d.id, d.status || '']) {
        if (own && rest.startsWith(norm(own))) rest = norm(rest.slice(norm(own).length));
        else if (own) rest = norm(rest.replace(norm(own), ''));
      }
      out.push({
        id: d.id, kind: sel === '.container-badge-text' ? 'label' : 'closed',
        text: norm(t.textContent), rest, counts: t.querySelectorAll('.label-count').length,
      });
    }
  }
  return out;
});

// The source pills at the top.
const pills = (page) => page.evaluate(() => [...document.querySelectorAll('[role="button"][title^="Hide "], [role="button"][title^="Show "]')]
  .map((p) => p.innerText.replace(/\s+/g, ' ').trim()));

async function checkScreen(page, record, when, expectCount) {
  const t = await titles(page);
  const withNum = t.filter((x) => /\d/.test(x.rest) || x.counts > 0);
  if (expectCount) {
    record(`control, counts on: titles show a count (${when})`, t.length > 0 && withNum.length === t.length,
      `${withNum.length} of ${t.length}: ${t.map((x) => x.text).join(' | ')}`);
  } else {
    record(`no container title shows a number (${when})`, t.length > 0 && withNum.length === 0,
      withNum.length ? withNum.map((x) => `${x.kind} "${x.text}"`).join(', ') : `${t.length} titles: ${t.map((x) => x.text).join(' | ')}`);
  }
}

async function run(browserType, engineName, size, countsOn) {
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
  if (countsOn) {
    // The control: the same page with the site's setting turned back on.
    await page.route(BASE, async (route) => {
      const res = await route.fetch();
      const body = (await res.text()).replace('"containerCount":false', '"containerCount":true');
      await route.fulfill({ response: res, body });
    });
  }
  await page.goto(BASE);
  await settle(page);

  const p = await pills(page);
  if (countsOn) {
    record('control, counts on: pill shows a count', p.length > 0 && p.every((s) => /\d/.test(s)), p.join(' | '));
  } else {
    record('pill at the top shows no number', p.length > 0 && p.every((s) => !/\d/.test(s)), p.join(' | ') || 'no pill');
  }

  await checkScreen(page, record, 'first screen', countsOn);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:zoom-to-fit')));
  await page.waitForTimeout(1200);
  await checkScreen(page, record, 'zoom to fit', countsOn);

  await page.evaluate((id) => window.PostPipeGraph.closeContainer(id), ACT);
  await page.waitForTimeout(1200);
  const actClosed = (await titles(page)).some((x) => x.id === ACT && x.kind === 'closed');
  record('act 1 closed shows as a blob', actClosed);
  await checkScreen(page, record, 'act 1 closed', countsOn);

  await page.evaluate((id) => window.PostPipeGraph.closeContainer(id), BOOK);
  await page.waitForTimeout(1200);
  const bookClosed = (await titles(page)).some((x) => x.id === BOOK && x.kind === 'closed');
  record('book closed shows as a blob', bookClosed);
  await checkScreen(page, record, 'book closed', countsOn);

  record('no page errors', errors.length === 0, errors.slice(0, 3).join(' / '));
  await context.close();
  await browser.close();
  return results.map((r) => ({ ...r, size: countsOn ? `${size} (control)` : size }));
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
        all.push(...(await run(bt, name, size, false)));
        all.push(...(await run(bt, name, size, true)));
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

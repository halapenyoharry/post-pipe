// Browser checks for a built site: selection, container open/close, voices.
// Runs Chromium and WebKit at desktop (1280x800) and phone (390x844, touch).
//
//   node test/e2e/t17_checks.js [path/to/_site]
//
// Prints a markdown table: engine x size x check.

const path = require('path');
const http = require('http');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const PORT = 39431;
const BASE = `http://localhost:${PORT}/`;

// A device with many voices, five of the preferred names among them.
const MANY_VOICES = [
  ['Albert', 'en-US'], ['Alice', 'it-IT'], ['Amélie', 'fr-CA'], ['Bad News', 'en-US'],
  ['Tessa', 'en-ZA'], ['Daniel', 'en-GB'], ['Moira', 'en-IE'], ['Karen', 'en-AU'],
  ['Samantha', 'en-US'], ['Google US English', 'en-US'], ['Google Deutsch', 'de-DE'],
  ['Zarvox', 'en-US'], ['Whisper', 'en-US'], ['Trinoids', 'en-US'], ['Rishi', 'en-IN'],
];
const NO_PREFERRED = [['Albert', 'en-US'], ['Alice', 'it-IT'], ['Zarvox', 'en-US']];

function stubVoices(list) {
  return `(() => {
    const voices = ${JSON.stringify(list)}.map(([name, lang]) => ({ name, lang, default: false, localService: true, voiceURI: name }));
    if (window.speechSynthesis) {
      Object.defineProperty(window.speechSynthesis, 'getVoices', { value: () => voices });
    }
  })();`;
}

async function settle(page) {
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForTimeout(5000);
}

const hash = (page) => page.evaluate(() => window.location.hash);
const readerOpen = (page) => page.evaluate(() => {
  const el = document.querySelector('[data-tts-target]');
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
});

// A node card by id prefix, and where to click it.
async function cardPoint(page, prefix) {
  return page.evaluate((prefix) => {
    const el = [...document.querySelectorAll('.node-card')].find((e) => e.__data__ && e.__data__.id.startsWith(prefix));
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, id: el.__data__.id };
  }, prefix);
}

// Double-click (desktop) / double-tap (phone) a card. If the reader covers
// it, the event goes to the card element directly.
async function openCard(page, prefix, touch) {
  const p = await cardPoint(page, prefix);
  const covered = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    return !(el && el.closest('.node-card'));
  }, p);
  if (covered) {
    await page.evaluate((prefix) => {
      const el = [...document.querySelectorAll('.node-card')].find((e) => e.__data__.id.startsWith(prefix));
      el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }));
    }, prefix);
  } else if (touch) {
    // Two taps in quick succession; the browser turns them into dblclick
    // only for mouse, so dispatch it the way a double-tap arrives.
    await page.touchscreen.tap(p.x, p.y);
    await page.evaluate(({ x, y }) => {
      document.elementFromPoint(x, y).dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    }, p);
  } else {
    // Hover first, the way a pointer arrives: the card grows on hover.
    await page.mouse.move(p.x, p.y);
    await page.waitForTimeout(250);
    await page.mouse.dblclick(p.x, p.y);
  }
  await page.waitForTimeout(500);
  return { p, covered };
}

// A point on the empty canvas (the svg itself), not under any panel.
async function emptyCanvasPoint(page) {
  return page.evaluate(() => {
    const svg = document.querySelector('svg');
    for (let y = 60; y < window.innerHeight - 60; y += 23) {
      for (let x = 20; x < window.innerWidth - 20; x += 23) {
        if (document.elementFromPoint(x, y) === svg) return { x, y };
      }
    }
    return null;
  });
}

async function tapAt(page, pt, touch) {
  if (touch) await page.touchscreen.tap(pt.x, pt.y);
  else await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(500);
}

async function run(browserType, engineName, size) {
  const phone = size === 'phone';
  const browser = await browserType.launch();
  const ctxOpts = phone
    ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engineName === 'chromium' }
    : { viewport: { width: 1280, height: 800 } };
  const results = [];
  const record = (check, ok, note = '') => results.push({ engine: engineName, size, check, ok, note });
  const errors = [];

  // ── selection ──
  let context = await browser.newContext(ctxOpts);
  let page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await settle(page);

  const A = 'eoej-a1-01';
  const expectHash = async () => '#read=' + encodeURIComponent((await page.evaluate((prefix) => {
    const el = [...document.querySelectorAll('.node-card')].find((e) => e.__data__.id.startsWith(prefix));
    return el.__data__.originalItem.id;
  }, A)));
  const want = await expectHash();

  let o = await openCard(page, A, phone);
  record('select (double-tap chapter)', (await readerOpen(page)) && (await hash(page)) === want, o.covered ? 'event on card' : '');

  o = await openCard(page, A, phone);
  record('unselect: same chapter again', !(await readerOpen(page)) && (await hash(page)) === '', o.covered ? 'card under reader; event on card' : '');

  await openCard(page, A, phone);
  const pt = await emptyCanvasPoint(page);
  if (pt) {
    await tapAt(page, pt, phone);
    record('unselect: empty canvas', !(await readerOpen(page)) && (await hash(page)) === '');
  } else {
    record('unselect: empty canvas', null, 'reader covers the whole canvas at this size');
  }

  if (await readerOpen(page)) await page.keyboard.press('Escape');
  await openCard(page, A, phone);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  record('unselect: Escape', !(await readerOpen(page)) && (await hash(page)) === '');

  await openCard(page, A, phone);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-layout')));
  await page.waitForTimeout(600);
  record('unselect: Reset layout', !(await readerOpen(page)) && (await hash(page)) === '');

  await page.goto(BASE + want);
  await settle(page);
  const opened = await readerOpen(page);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = !(await readerOpen(page)) && (await hash(page)) === '';
  await page.reload();
  await settle(page);
  record('reload with #read= opens once, then unselects and stays closed', opened && closed && !(await readerOpen(page)));

  // ── containers ──
  // The first screen may frame one container; bring every title on screen.
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:zoom-to-fit')));
  await page.waitForTimeout(1200);
  const state = () => page.evaluate(() => window.PostPipeGraph.getContainerState());
  const centerOf = (id, sel) => page.evaluate(([id, sel]) => {
    const e = document.querySelector(`[data-container-id="${id}"] ${sel}`);
    if (!e) return null;
    const g = e.closest('.container-badge, .container-macro-node');
    if (g && getComputedStyle(g).display === 'none') return null;
    const r = e.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, [id, sel]);
  const ID = 'container:act-2';
  let c = await centerOf(ID, '.container-badge-hit');
  await tapAt(page, c, phone);
  await page.waitForTimeout(500);
  const closedOk = (await state())[ID] === 'closed' && !!(await centerOf(ID, '.container-macro-bg'));
  record('tap container title closes it', closedOk);
  c = await centerOf(ID, '.container-macro-bg');
  if (c) await tapAt(page, c, phone);
  await page.waitForTimeout(900);
  record('tap closed container reopens it', (await state())[ID] === 'open');
  if (!phone) {
    c = await centerOf('container:act-3', '.container-badge-hit');
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    await page.mouse.move(c.x + 40, c.y + 30, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    record('drag on title moves, does not toggle', (await state())['container:act-3'] === 'open');
  }
  await context.close();

  // ── voices ──
  const voiceCount = async (stub) => {
    const ctx = await browser.newContext(ctxOpts);
    if (stub) await ctx.addInitScript(stubVoices(stub));
    const pg = await ctx.newPage();
    pg.on('pageerror', (e) => errors.push(e.message));
    await pg.goto(BASE + want);
    await pg.waitForSelector('select[title=Voice]', { timeout: 15000 });
    await pg.waitForTimeout(800);
    const opts = await pg.$$eval('select[title=Voice] option', (os) => os.map((o) => o.textContent));
    await ctx.close();
    return opts;
  };
  const real = await voiceCount(null);
  const realNames = real.filter((t) => t !== 'Loading...');
  record('voice picker, this device', realNames.length <= 5, `${realNames.length} voice(s)${realNames.length ? ': ' + realNames.join(', ') : ' (headless has none)'}`);
  const many = await voiceCount(MANY_VOICES);
  record('voice picker, 15 device voices', many.length === 5 && many[0] === 'Samantha', many.join(', '));
  const none = await voiceCount(NO_PREFERRED);
  record('voice picker, none preferred', none.length === 1, none.join(', '));

  record('no page errors', errors.length === 0, errors.slice(0, 3).join(' / '));
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

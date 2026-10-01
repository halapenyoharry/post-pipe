// Browser checks for T22: readers' contributions as their own layer. Render
// (counts, the From readers section, essays, connections, the readers
// dimension), anchors (found, fallback), escaping, and the local submission
// and moderation round trip. Chromium and WebKit, desktop (1280x800) and
// phone (390x844).
//
//   node test/e2e/t22_checks.js [path/to/_site]
//
// The site as built keeps showTest and submit false; checks that need them on
// rewrite the settings in the page as it is served to the browser, and swap
// in their own contributions file where they test bad input. Nothing in the
// site is changed. The form checks run the site's own local server
// (tools/contributions-server) on a temporary copy of the data.
//
// PP_E2E_ENGINES=chromium,webkit picks engines; PP_E2E_PARTS=1,2 picks parts.
// PP_E2E_SHOTS=<dir> saves screenshots.

const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');
const cp = require('child_process');
const handler = require('serve-handler');
const { chromium, webkit } = require('playwright');

const SITE = path.resolve(process.argv[2] || path.join(process.env.HOME, 'Projects/epicofelinorjones.com/_site'));
const SITE_REPO = path.resolve(SITE, '..');
const SERVER_JS = path.join(SITE_REPO, 'tools/contributions-server/server.js');
const PORT = 39438;
const BASE = `http://localhost:${PORT}/`;
const FEED = JSON.parse(fs.readFileSync(path.join(SITE, 'feed.json'), 'utf8'));
const SEED = JSON.parse(fs.readFileSync(path.join(SITE, 'contributions/contributions.json'), 'utf8'));
const ENGINES = (process.env.PP_E2E_ENGINES || 'chromium,webkit').split(',').map((s) => s.trim());
const PARTS = process.env.PP_E2E_PARTS ? process.env.PP_E2E_PARTS.split(',').map((s) => s.trim()) : null;
const SHOTS = process.env.PP_E2E_SHOTS ? path.resolve(process.env.PP_E2E_SHOTS) : null;
const slugOf = (item) => item.id.split('/').pop().replace('.html', '');
const item = (slug) => FEED.items.find((i) => slugOf(i) === slug);
const BERRY = item('eoej-a1-01-berry-thief');
const DAMNING = item('eoej-a1-11-damning-women');
const READ = (it, base = BASE) => base + '#read=' + encodeURIComponent(it.id);
const PASSAGE = 'Years of riding made the motion second nature.';
// A 1x1 png, for an art item from the site's own store.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

async function open(bt, name, size, url, { settings = {}, data = null, base = BASE, stubVoice = false } = {}) {
  const phone = size === 'phone';
  const browser = await bt.launch();
  const ctx = await browser.newContext({
    ...(phone
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === 'chromium' }
      : { viewport: { width: 1280, height: 800 } }),
    colorScheme: 'light',
  });
  if (stubVoice) {
    // The voice, replaced by a recorder: every utterance's text is kept, and
    // each ends at once.
    await ctx.addInitScript(() => {
      window.__spoken = [];
      const fake = {
        speaking: false, paused: false, pending: false,
        getVoices: () => [{ name: 'Samantha', lang: 'en-US', default: true, localService: true, voiceURI: 'Samantha' }],
        speak(u) { window.__spoken.push(u.text); setTimeout(() => { if (u.onend) u.onend({}); }, 0); },
        cancel() {}, pause() {}, resume() {},
        addEventListener() {}, removeEventListener() {}, onvoiceschanged: null,
      };
      try { Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true }); } catch (_) {}
      // A plain utterance, so the stub voice above can be assigned to it.
      window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    });
  }
  const page = await ctx.newPage();
  const errors = [];
  const outside = [];
  const requests = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    const u = r.url();
    requests.push(r.method() + ' ' + u);
    if (!u.startsWith(base) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u);
  });
  const flags = Object.entries(settings);
  if (flags.length) {
    await page.route((u) => u.href === base || u.href === base + 'index.html', async (route) => {
      const res = await route.fetch();
      let body = await res.text();
      for (const [k, v] of flags) body = body.replace(`"${k}":${!v}`, `"${k}":${v}`);
      await route.fulfill({ response: res, body });
    });
  }
  if (data) {
    await page.route('**/contributions/contributions.json*', (route) => route.fulfill({ body: JSON.stringify(data), contentType: 'application/json' }));
    await page.route('**/contributions/assets/**', (route) => route.fulfill({ body: PNG, contentType: 'image/png' }));
  }
  await page.goto(url);
  await page.waitForSelector('.container-group', { state: 'attached' });
  await page.waitForTimeout(4000);
  return { browser, ctx, page, errors, outside, requests, phone, name };
}

const shot = async (s, label) => {
  if (!SHOTS) return;
  await s.page.screenshot({ path: path.join(SHOTS, `${label}-${s.phone ? 'phone' : 'desktop'}-${s.name}.png`) });
};

const counts = (page) => page.evaluate(() => {
  const out = {};
  for (const el of document.querySelectorAll('[data-contrib-count]')) {
    const card = el.closest('.node-card');
    out[card && card.__data__ ? card.__data__.id : '?'] = Number(el.dataset.contribCount);
  }
  return out;
});

const section = (page) => page.evaluate(() => {
  const s = document.querySelector('[data-contributions]');
  const text = document.querySelector('[data-reader-text]');
  if (!s) return null;
  return {
    head: s.querySelector('div').innerText.replace(/\s+/g, ' ').trim(),
    items: [...s.querySelectorAll('[data-contrib]')].map((e) => ({ id: e.dataset.contrib, type: e.dataset.contribType, text: e.innerText })),
    insideText: !!(text && text.contains(s)),
    afterText: !!(text && (text.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING)),
    notText: s.hasAttribute('data-pp-not-text'),
    form: !!s.querySelector('[data-contrib-add], [data-contrib-form]'),
    overflow: s.scrollWidth - s.clientWidth,
  };
});

async function toggleReaders(s) {
  if (s.phone) {
    await s.page.click('[data-toolbar-more]');
    await s.page.waitForTimeout(250);
  }
  // On a phone the dimensions are in the More sheet; the bar's copy is hidden.
  await s.page.click(s.phone ? '[data-toolbar-sheet] [data-dimension="readers"]' : '[data-group="dimensions"] [data-dimension="readers"]');
  await s.page.waitForTimeout(300);
  if (s.phone) {
    await s.page.keyboard.press('Escape');
    await s.page.waitForTimeout(200);
  }
}

const readersLayer = (page) => page.evaluate(() => {
  const layer = document.querySelector('.readers-layer');
  const line = document.querySelector('.readers-line');
  const seq = document.querySelector('.link-sequence');
  const btn = document.querySelector('[data-dimension="readers"]');
  const cs = line && getComputedStyle(line);
  return {
    button: btn ? btn.getAttribute('aria-pressed') : null,
    shown: !!layer && getComputedStyle(layer).display !== 'none',
    lines: document.querySelectorAll('.readers-line').length,
    drawn: !!line && !!line.getAttribute('d'),
    dash: cs ? cs.strokeDasharray : '',
    stroke: cs ? cs.stroke : '',
    seqStroke: seq ? getComputedStyle(seq).stroke : '',
    seqDash: seq ? getComputedStyle(seq).strokeDasharray : '',
  };
});

// ── 1. Render ───────────────────────────────────────────────────────────────

async function part1(bt, name, size, record) {
  // The site as it is set: test items off, no form.
  let s = await open(bt, name, size, READ(BERRY));
  try {
    const c = await counts(s.page);
    const sec = await section(s.page);
    const btn = await s.page.$('[data-dimension="readers"]');
    record('1 the site as set shows nothing from readers (showTest false)', Object.keys(c).length === 0 && (!sec || sec.items.length === 0) && !btn,
      `${Object.keys(c).length} counts, ${sec ? sec.items.length : 0} items, readers button ${btn ? 'shown' : 'hidden'}`);
    record('1 and no form (submit false)', !sec || !sec.form, sec && sec.form ? 'form shown' : 'none');
    const fetched = s.requests.filter((r) => /contributions\/contributions\.json/.test(r));
    record('1 contributions come from their own file, not the feed', fetched.length === 1 && !('contributions' in FEED) && FEED.items.every((i) => !i.contributions),
      `${fetched.length} GET of contributions.json; feed has none`);
    record('1 no page errors (as set)', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }

  s = await open(bt, name, size, READ(BERRY), { settings: { showTest: true }, stubVoice: true });
  try {
    const page = s.page;
    const c = await counts(page);
    record('1 a chapter\'s card shows how many contributions it has', c['eoej-a1-01-berry-thief'] === 3 && c['eoej-a1-11-damning-women'] === 1,
      JSON.stringify(c));
    const sec = await section(page);
    record('1 the reader lists them in a From readers section', !!sec && sec.items.length === 3 && /^FROM READERS|^From readers/i.test(sec.head),
      sec ? `${sec.items.length}: ${sec.items.map((i) => i.type).join(', ')}; "${sec.head.slice(0, 60)}"` : 'none');
    record('1 under the text and apart from it', !!sec && !sec.insideText && sec.afterText && sec.notText,
      sec ? `inside text ${sec.insideText}, after it ${sec.afterText}` : 'none');
    record('1 test items say they are tests', !!sec && sec.items.every((i) => /· test/.test(i.text)), sec ? 'each marked' : 'none');
    await shot(s, 't22-reader');

    // The voice reads the chapter and stops before what readers wrote.
    await page.click('button[title="Play"]').catch(() => {});
    await page.waitForTimeout(2500);
    const spoken = await page.evaluate(() => window.__spoken || []);
    if (!spoken.length) {
      record('1 the voice does not read the contributions', null, 'no utterances captured in this engine');
    } else {
      const leaked = spoken.filter((t) => /TEST\.|From readers|placeholder/i.test(t));
      record('1 the voice does not read the contributions', leaked.length === 0, `${spoken.length} sentences, ${leaked.length} from readers`);
      await page.click('button[title="Stop"]').catch(() => {});
    }

    // An essay opens in the reader.
    await page.click('[data-contrib="test-essay-1"] [data-contrib-open]');
    await page.waitForTimeout(200);
    const essay = await page.evaluate(() => {
      const e = document.querySelector('[data-contrib="test-essay-1"] [data-contrib-essay]');
      return { state: e && e.dataset.contribEssay, paras: e ? e.querySelectorAll(':scope > div').length : 0 };
    });
    record('1 an essay opens in the reader', essay.state === 'open' && essay.paras === 3, `${essay.state}, ${essay.paras} paragraphs`);

    // The readers dimension: off, on, off.
    await page.evaluate(() => { location.hash = ''; });
    await page.waitForTimeout(800);
    const off = await readersLayer(page);
    record('1 readers dimension is offered, and off at first', off.button === 'false' && !off.shown, `pressed ${off.button}, layer ${off.shown ? 'shown' : 'hidden'}`);
    await toggleReaders(s);
    const on = await readersLayer(page);
    record('1 turned on, readers\' connections are drawn as their own edges', on.shown && on.lines === 1 && on.drawn, `${on.lines} line, drawn ${on.drawn}`);
    record('1 dashed and in another colour than the book\'s edges', /\d/.test(on.dash) && on.dash !== on.seqDash && on.stroke !== on.seqStroke,
      `${on.stroke} dash ${on.dash} vs ${on.seqStroke} dash ${on.seqDash}`);
    await shot(s, 't22-readers-on');
    await toggleReaders(s);
    const again = await readersLayer(page);
    record('1 and off again', again.button === 'false' && !again.shown, `pressed ${again.button}`);

    // A connection leads to its other chapter.
    await page.evaluate((h) => { location.hash = h; }, READ(BERRY).split('#')[1]);
    await page.waitForTimeout(1800);
    await page.click('[data-contrib="test-connection-1"] [data-contrib-goto]');
    await page.waitForTimeout(1500);
    const at = await page.evaluate(() => decodeURIComponent(location.hash));
    record('1 a connection opens the chapter it connects to', /damning-women/.test(at), at.split('/').pop());
    const there = await section(page);
    record('1 and is listed there too', !!there && there.items.some((i) => i.id === 'test-connection-1'), there ? there.items.map((i) => i.id).join(', ') : 'none');

    record('1 nothing fetched from anywhere else', s.outside.length === 0, s.outside.slice(0, 2).join(' '));
    record('1 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }
}

// ── 2. Anchors ──────────────────────────────────────────────────────────────

async function part2(bt, name, size, record) {
  const base = { status: 'approved', created: '2026-09-30', test: true, author: 'Check' };
  const data = { contributions: [
    { ...base, id: 'found', type: 'comment', anchor: { chapter: 'eoej-a1-01-berry-thief', exact: PASSAGE, prefix: 'walking toward a tiny shrub.', suffix: 'She knelt' }, body: 'found' },
    { ...base, id: 'gone', type: 'comment', anchor: { chapter: 'eoej-a1-01-berry-thief', exact: 'These words were never in the chapter at all.' }, body: 'gone' },
    { ...base, id: 'repeat', type: 'comment', anchor: { chapter: 'eoej-a1-01-berry-thief', exact: 'Eli' }, body: 'repeat' },
  ] };
  const s = await open(bt, name, size, READ(BERRY), { settings: { showTest: true }, data });
  try {
    const page = s.page;
    const state = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-contrib]')].map((e) => {
      const a = e.querySelector('[data-contrib-anchor]');
      return [e.dataset.contrib, { anchor: a ? a.dataset.contribAnchor : null, show: !!e.querySelector('[data-contrib-show]'), note: a ? a.innerText : '' }];
    })));
    record('2 a passage still in the text is found', state.found && state.found.anchor === 'found', JSON.stringify(state.found));
    await page.click('[data-contrib="found"] [data-contrib-show]');
    await page.waitForTimeout(300);
    const marked = await page.evaluate(() => {
      const p = document.querySelector('[data-reader-text] [data-contrib-passage]');
      const body = document.querySelector('[data-tts-target]');
      const r = p && p.getBoundingClientRect();
      const b = body.getBoundingClientRect();
      return p ? { text: p.textContent, visible: r.top >= b.top - 2 && r.top < b.bottom } : null;
    });
    record('2 Show the passage marks the paragraph it is in, and brings it into view', !!marked && marked.text.includes(PASSAGE) && marked.visible,
      marked ? `"${marked.text.slice(0, 50)}…", in view ${marked.visible}` : 'nothing marked');
    record('2 a passage no longer in the text falls back to its chapter and says so',
      state.gone && state.gone.anchor === 'fallback' && !state.gone.show && /isn.t in the chapter/.test(state.gone.note), state.gone ? state.gone.note.slice(0, 70) : 'missing');
    record('2 a passage that repeats with nothing to tell them apart falls back too, rather than guess',
      state.repeat && state.repeat.anchor === 'fallback' && !state.repeat.show, JSON.stringify(state.repeat && state.repeat.anchor));
    record('2 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await shot(s, 't22-anchors');
  } finally { await s.browser.close(); }
}

// ── 3. Escaping and what is never shown ─────────────────────────────────────

async function part3(bt, name, size, record) {
  const base = { status: 'approved', created: '2026-09-30', anchor: { chapter: 'eoej-a1-01-berry-thief' } };
  const data = { contributions: [
    { ...base, id: 'x-body', type: 'comment', author: '<b>Bold</b> Name', body: '<img src=x onerror="window.__pwned=1">&lt; <script>window.__pwned=2</script>' },
    { ...base, id: 'x-essay', type: 'essay', title: '<i>Title</i>', author: 'E', body: '<a href="javascript:window.__pwned=3">link</a>\n\nmore' },
    { ...base, id: 'x-art-own', type: 'art', author: 'A', asset: 'fox.png', alt: 'a fox' },
    { ...base, id: 'x-art-remote', type: 'art', author: 'A', asset: 'https://example.com/fox.png' },
    { ...base, id: 'x-art-svg', type: 'art', author: 'A', asset: 'fox.svg' },
    { ...base, id: 'x-pending', type: 'comment', author: 'P', status: 'pending', body: 'waiting' },
    { ...base, id: 'x-nowhere', type: 'comment', author: 'N', anchor: { chapter: 'not-a-chapter' }, body: 'nowhere' },
  ] };
  const s = await open(bt, name, size, READ(BERRY), { data });
  try {
    const page = s.page;
    await page.click('[data-contrib="x-essay"] [data-contrib-open]').catch(() => {});
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const sec = document.querySelector('[data-contributions]');
      const ids = [...sec.querySelectorAll('[data-contrib]')].map((e) => e.dataset.contrib);
      const body = sec.querySelector('[data-contrib="x-body"]');
      return {
        ids,
        pwned: window.__pwned || null,
        tags: [...sec.querySelectorAll('script, b, i, a[href^="javascript"], iframe')].map((e) => e.tagName),
        bodyText: body ? body.innerText : '',
        imgs: [...sec.querySelectorAll('img')].map((i) => i.getAttribute('src')),
      };
    });
    record('3 contributed text is shown as text, never as markup', !r.pwned && r.tags.length === 0 && /<img src=x/.test(r.bodyText) && /<b>Bold<\/b> Name/.test(r.bodyText),
      `run ${r.pwned || 'nothing'}, elements ${r.tags.join(',') || 'none'}`);
    record('3 art only from the site\'s own asset store', r.imgs.length === 1 && r.imgs[0] === './contributions/assets/fox.png' && !r.ids.includes('x-art-remote') && !r.ids.includes('x-art-svg'),
      r.imgs.join(', '));
    record('3 not approved, or about no chapter of the book: not shown', !r.ids.includes('x-pending') && !r.ids.includes('x-nowhere'), r.ids.join(', '));
    record('3 nothing fetched from anywhere else', s.outside.length === 0, s.outside.slice(0, 2).join(' '));
    record('3 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
  } finally { await s.browser.close(); }
}

// ── 4. Sending one, locally ─────────────────────────────────────────────────

async function part4(bt, name, size, record, port) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-contrib-'));
  fs.mkdirSync(path.join(tmp, 'contributions'));
  fs.writeFileSync(path.join(tmp, 'contributions', 'contributions.json'), JSON.stringify(SEED, null, 2));
  const srv = cp.spawn(process.execPath, [SERVER_JS, '--port', String(port), '--site', SITE,
    '--contributions', path.join(tmp, 'contributions'), '--queue', path.join(tmp, 'queue'), '--token', 'check'], { stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}/`;
  await new Promise((r) => setTimeout(r, 600));
  let s;
  try {
    s = await open(bt, name, size, READ(BERRY, base), { settings: { submit: true, showTest: true }, base });
    const page = s.page;
    await page.click('[data-contrib-add]');
    await page.waitForTimeout(150);
    const fit = await section(page);
    record('4 with submit on, the reader offers a form', !!(await page.$('[data-contrib-form]')), 'shown');
    record('4 the form fits the reader', fit && fit.overflow <= 1, `${fit ? fit.overflow : '?'}px over`);
    const fields = await page.evaluate(() => [...document.querySelectorAll('[data-contrib-form] [data-contrib-field]')].map((e) => e.dataset.contribField));
    record('4 it asks for a name to show and nothing else about the reader', fields.join(',') === 'author,type,body', fields.join(', '));

    await page.click('[data-contrib-send]');
    await page.waitForTimeout(200);
    const refused = await page.evaluate(() => [...document.querySelectorAll('[data-contrib-form] [role="alert"] li')].map((l) => l.innerText));
    record('4 an empty form says what is missing, and sends nothing', refused.length >= 2 && (!fs.existsSync(path.join(tmp, 'queue', 'pending')) || fs.readdirSync(path.join(tmp, 'queue', 'pending')).length === 0),
      refused.join(' / '));

    await page.fill('[data-contrib-field="author"]', 'Check Reader');
    await page.fill('[data-contrib-field="body"]', 'A check from the browser test.');
    await page.evaluate((passage) => {
      for (const p of document.querySelectorAll('[data-reader-text] p')) {
        const t = p.firstChild;
        const i = t && t.nodeValue ? t.nodeValue.indexOf(passage) : -1;
        if (i < 0) continue;
        const r = document.createRange();
        r.setStart(t, i); r.setEnd(t, i + passage.length);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
        return;
      }
    }, PASSAGE);
    await page.waitForTimeout(150);
    await page.click('[data-contrib-use-selection]');
    await page.click('[data-contrib-send]');
    await page.waitForTimeout(900);
    const sent = !!(await page.$('[data-contrib-sent]'));
    const pending = fs.readdirSync(path.join(tmp, 'queue', 'pending'));
    const item = pending.length ? JSON.parse(fs.readFileSync(path.join(tmp, 'queue', 'pending', pending[0]), 'utf8')) : null;
    record('4 sent: it waits in the queue on disk, with the passage selected', sent && pending.length === 1 && item.anchor.exact === PASSAGE && item.status === 'pending',
      item ? `${pending[0]}, "${item.anchor.exact.slice(0, 30)}…"` : 'nothing queued');
    record('4 only the name and the words are kept', item && Object.keys(item).sort().join(',') === 'anchor,author,body,created,id,status,type', item ? Object.keys(item).sort().join(',') : '');
    const before = await page.evaluate(() => [...document.querySelectorAll('[data-contrib]')].length);

    const id = pending[0].replace('.json', '');
    const res = await fetch(base + 'moderate/approve', { method: 'POST', body: new URLSearchParams({ token: 'check', id }), redirect: 'manual' });
    await page.reload();
    await page.waitForSelector('.container-group', { state: 'attached' });
    await page.waitForTimeout(3500);
    const after = await page.evaluate((id) => {
      const e = document.querySelector(`[data-contrib="${id}"]`);
      return { n: document.querySelectorAll('[data-contrib]').length, text: e ? e.innerText : '', anchor: e && e.querySelector('[data-contrib-anchor]') ? e.querySelector('[data-contrib-anchor]').dataset.contribAnchor : null };
    }, id);
    record('4 nothing shows until it is approved; approved, it shows with its name and passage',
      before === 3 && res.status === 303 && after.n === 4 && /Check Reader/.test(after.text) && after.anchor === 'found',
      `${before} → ${after.n}, anchor ${after.anchor}`);
    const posts = s.requests.filter((r) => r.startsWith('POST '));
    record('4 the form posts only to the site\'s own server', posts.length >= 1 && posts.every((p) => p.startsWith('POST ' + base + 'api/contributions')) && s.outside.length === 0,
      `${posts.length} POST, ${s.outside.length} elsewhere`);
    record('4 no page errors', s.errors.length === 0, s.errors.slice(0, 2).join(' | '));
    await shot(s, 't22-form');
  } finally {
    if (s) await s.browser.close();
    srv.kill();
  }
}

const PART_FNS = { 1: part1, 2: part2, 3: part3, 4: part4 };

const server = http.createServer((req, res) => handler(req, res, {
  public: SITE,
  headers: [{ source: '**', headers: [{ key: 'Cache-Control', value: 'no-store' }] }],
}));

server.listen(PORT, async () => {
  const all = [];
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  let port = 39610;
  for (const [bt, name] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
    if (!ENGINES.includes(name)) continue;
    for (const size of ['desktop', 'phone']) {
      const record = (check, ok, note = '') => all.push({ engine: name, size, check, ok, note });
      for (const [part, fn] of Object.entries(PART_FNS)) {
        if (PARTS && !PARTS.includes(part)) continue;
        try {
          await fn(bt, name, size, record, port++);
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
  const tally = (k) => all.filter((r) => (k === 'na' ? r.ok === null : r.ok === k)).length;
  console.log(`\n${tally(true)} PASS, ${tally(false)} FAIL, ${tally('na')} n/a`);
  if (all.some((r) => r.ok === false)) process.exitCode = 1;
});

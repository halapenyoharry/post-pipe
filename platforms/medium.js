// platforms/medium.js
// GitHub Pages → Medium import, stopping at the draft.
//
// 1. post() pushes self-contained HTML to GitHub Pages (flat: {slug}.html),
//    then hands the public URL to importUrl().
// 2. importUrl() opens medium.com/me/stories with the saved Medium session,
//    follows "Import a story" (a link to medium.com/p/import), enters the
//    public URL, submits, waits for the imported story's editor and returns
//    its URL. It never clicks Publish.
// 3. login() opens a visible browser at medium.com/m/signin, waits for a
//    person to sign in themselves, and saves the session to
//    auth/medium-session.json. It never enters credentials.
//
// The session file is looked up like auth/.env: the site's auth/ first
// (POSTPIPE_SITE), then the engine's auth/.

const matter = require('gray-matter');
const path   = require('path');
const fs     = require('fs');
const { siteRoot, ENGINE_ROOT } = require('../src/lib/siteRoot');

const SESSION_FILE = 'medium-session.json';
const STORIES_URL  = 'https://medium.com/me/stories';
const SIGNIN_URL   = 'https://medium.com/m/signin';
const LOGIN_WAIT_MS = 10 * 60 * 1000;

// ─── Session file ────────────────────────────────────────────────────────────

// Where the saved session is read from: the site's auth/ first, then the
// engine's. Returns { path, source } with path null when neither exists.
function resolveSessionPath({ site = siteRoot(), engineRoot = ENGINE_ROOT, exists = fs.existsSync } = {}) {
  const siteFile = path.join(site, 'auth', SESSION_FILE);
  if (exists(siteFile)) return { path: siteFile, source: 'site' };
  const engineFile = path.join(engineRoot, 'auth', SESSION_FILE);
  if (exists(engineFile)) return { path: engineFile, source: 'engine' };
  return { path: null, source: null };
}

// Where login() writes the session: over the file that is already read, if
// there is one; else into the site's auth/ when that folder exists; else into
// the engine's auth/.
function sessionSavePath({ site = siteRoot(), engineRoot = ENGINE_ROOT, exists = fs.existsSync } = {}) {
  const found = resolveSessionPath({ site, engineRoot, exists });
  if (found.path) return found.path;
  if (exists(path.join(site, 'auth'))) return path.join(site, 'auth', SESSION_FILE);
  return path.join(engineRoot, 'auth', SESSION_FILE);
}

// ─── Publish guard ───────────────────────────────────────────────────────────
// The import flow stops at the draft. --publish is accepted but does not
// publish through this flow yet; the draft is left for a person to publish.

function publishGuard(publishRequested, draftUrl) {
  if (!publishRequested) return { publish: false, notice: null };
  return {
    publish: false,
    notice: `--publish stops at the draft for now. Nothing was published. The draft is at ${draftUrl || '(no draft URL)'}; publish it on Medium yourself.`,
  };
}

// ─── Reading a page ──────────────────────────────────────────────────────────
// What state a Medium page is in, from its title, URL and visible text.
//   blocked    Cloudflare's "you have been blocked" page
//   signin     the sign-in page
//   signed-out a Medium page showing Sign in / Sign up in the header
//   ok         anything else

function classifyPage({ title = '', url = '', bodyText = '', signInVisible = false } = {}) {
  if (/Attention Required/i.test(title) || /Sorry, you have been blocked/i.test(bodyText)) return 'blocked';
  if (/medium\.com\/m\/signin/.test(url)) return 'signin';
  if (signInVisible) return 'signed-out';
  return 'ok';
}

// An imported story's editor URL: medium.com/p/<id>/edit or
// medium.com/@user/<slug>-<id>/edit style.
function isEditorUrl(url) {
  return /^https:\/\/medium\.com\/.+\/edit(\?|#|$)/.test(url || '');
}

const BLOCKED_HELP = 'Cloudflare blocked the page. Medium does this to headless browsers and to stale saved cookies. ' +
  'Run without --headless, and if it persists run `node index.js medium --login` to save a fresh session.';

async function readPage(page) {
  const title = await page.title().catch(() => '');
  const bodyText = await page.evaluate(() => (document.body && document.body.innerText) || '').catch(() => '');
  // Medium renders the header twice (wide and narrow layouts); one copy is hidden.
  const signInVisible = (await page.locator('[data-testid="headerSignInButton"]:visible').count().catch(() => 0)) > 0;
  return { title, url: page.url(), bodyText, signInVisible };
}

async function signedIn(page) {
  const state = classifyPage(await readPage(page));
  if (state !== 'ok') return false;
  return (await page.locator('[data-testid="headerUserIcon"]').count().catch(() => 0)) > 0;
}

function shooter(page, shotsDir) {
  return async (step) => {
    if (!shotsDir) return;
    fs.mkdirSync(shotsDir, { recursive: true });
    const file = path.join(shotsDir, `medium-${step}.png`);
    await page.screenshot({ path: file }).catch(() => {});
    console.log(`  screenshot: ${file}`);
  };
}

function launchChrome({ headless }) {
  const { chromium } = require('playwright');
  // channel 'chrome' uses the installed Google Chrome; no browser download.
  return chromium.launch({ channel: 'chrome', headless });
}

// ─── Login ───────────────────────────────────────────────────────────────────
// Opens a visible browser at the sign-in page and waits for a person to sign
// in. Starts from a fresh context: stale saved cookies get the sign-in page
// blocked by Cloudflare.

async function login({ sessionPath, waitMs = LOGIN_WAIT_MS, pollMs = 3000 } = {}) {
  const target = sessionPath || sessionSavePath();
  const browser = await launchChrome({ headless: false });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(SIGNIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('Sign in to Medium in the browser window that just opened.');
    console.log('If Medium emails you a sign-in link, copy the link and paste it into that window\'s address bar;');
    console.log('opening it anywhere else signs in that other browser, not this one.');
    console.log(`Waiting up to ${Math.round(waitMs / 60000)} minutes. Nothing is typed for you.`);

    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      for (const p of context.pages()) {
        if (!p.isClosed() && !/\/m\/signin|\/m\/callback/.test(p.url()) && await signedIn(p)) {
          if (fs.existsSync(target)) {
            const backup = `${target}.bak-${new Date().toISOString().slice(0, 10)}`;
            fs.copyFileSync(target, backup);
            console.log(`Previous session kept at ${backup}`);
          }
          fs.mkdirSync(path.dirname(target), { recursive: true });
          await context.storageState({ path: target });
          console.log(`Signed in. Session saved to ${target}`);
          return { path: target };
        }
      }
      if (browser.isConnected() === false || context.pages().length === 0) {
        throw new Error('The sign-in window was closed before sign-in finished. Nothing saved.');
      }
      await new Promise(r => setTimeout(r, pollMs));
    }
    throw new Error(`No sign-in within ${Math.round(waitMs / 60000)} minutes. Nothing saved.`);
  } finally {
    await browser.close().catch(() => {});
  }
}

// ─── Import a public URL as a draft ──────────────────────────────────────────

const IMPORT_CONTROL = '[data-testid="importStoryButton"], a:has-text("Import a story"), button:has-text("Import a story")';
// Tried in this order; the first visible match that is not a search box wins.
const URL_FIELDS = [
  'input[type="url"]',
  'input[placeholder*="URL" i]',
  'input[placeholder*="link" i]',
  'input[placeholder*="http" i]',
  'input[name="url"]',
  'main [contenteditable="true"], [role="dialog"] [contenteditable="true"]',
  'main input[type="text"], [role="dialog"] input[type="text"]',
];

async function findUrlField(page, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const sel of URL_FIELDS) {
      const all = page.locator(sel);
      const n = await all.count().catch(() => 0);
      for (let i = 0; i < n; i++) {
        const el = all.nth(i);
        if (!(await el.isVisible().catch(() => false))) continue;
        const ph = (await el.getAttribute('placeholder').catch(() => '')) || '';
        const testid = (await el.getAttribute('data-testid').catch(() => '')) || '';
        if (/search/i.test(ph) || /search/i.test(testid)) continue;
        return { locator: el, selector: sel };
      }
    }
    await page.waitForTimeout(1000);
  }
  return null;
}

async function importUrl(publicUrl, { sessionPath, headless = false, shotsDir = null, timeoutMs = 90000 } = {}) {
  if (!/^https?:\/\//.test(publicUrl || '')) throw new Error(`Not a public URL: ${publicUrl}`);

  const session = sessionPath ? { path: sessionPath } : resolveSessionPath();
  if (!session.path || !fs.existsSync(session.path)) {
    throw new Error('No saved Medium session (auth/medium-session.json in the site or the engine). Run: node index.js medium --login');
  }
  console.log(`Medium session: ${session.path}`);

  const browser = await launchChrome({ headless });
  try {
    const context = await browser.newContext({ storageState: session.path, viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    const shot = shooter(page, shotsDir);

    // 1. Stories page
    console.log(`Opening ${STORIES_URL}`);
    await page.goto(STORIES_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    await shot('1-stories');
    let state = classifyPage(await readPage(page));
    if (state === 'blocked') throw new Error(`Stories page: ${BLOCKED_HELP}`);
    if (state !== 'ok') throw new Error('The saved Medium session is signed out. Run: node index.js medium --login');

    // 2. "Import a story" (a link to medium.com/p/import)
    const control = page.locator(IMPORT_CONTROL).first();
    await control.waitFor({ state: 'visible', timeout: 20000 });
    await control.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await shot('2-import-page');
    state = classifyPage(await readPage(page));
    if (state === 'blocked') throw new Error(`Import page (${page.url()}): ${BLOCKED_HELP}`);
    if (state !== 'ok') throw new Error('The import page asked for sign-in. Run: node index.js medium --login');

    // 3. Enter the URL
    const found = await findUrlField(page);
    if (!found) throw new Error(`No URL field found on the import page (${page.url()}).`);
    console.log(`  URL field: ${found.selector}`);
    const field = found.locator;
    await field.click();
    await field.fill(publicUrl).catch(async () => { await page.keyboard.type(publicUrl); });
    await shot('3-url-entered');

    // 4. Submit
    const submit = page.getByRole('button', { name: /^\s*import\s*$/i })
      .or(page.locator('button[type="submit"]')).first();
    await submit.click();
    console.log('Import submitted; waiting for the editor...');

    // 5. Wait for the editor: either Medium goes there itself, or it shows a
    //    link to the imported story ("See your story").
    const deadline = Date.now() + timeoutMs;
    let draftUrl = null;
    while (Date.now() < deadline) {
      if (isEditorUrl(page.url())) { draftUrl = page.url(); break; }
      const link = page.locator('a[href*="/edit"]').filter({ hasText: /see your story|edit|open/i }).first();
      if (await link.count().catch(() => 0)) {
        const href = await link.getAttribute('href');
        if (href) {
          await shot('4-after-submit');
          await page.goto(new URL(href, 'https://medium.com').href, { waitUntil: 'domcontentloaded', timeout: 60000 });
          continue;
        }
      }
      if (classifyPage(await readPage(page)) === 'blocked') throw new Error(`After submit: ${BLOCKED_HELP}`);
      await page.waitForTimeout(1500);
    }
    await page.waitForTimeout(3000);
    await shot('5-draft');
    if (!draftUrl) throw new Error(`No editor within ${Math.round(timeoutMs / 1000)}s after submit. Last page: ${page.url()}`);

    console.log(`Draft ready: ${draftUrl}`);
    return { url: draftUrl, draft: true };
  } finally {
    await browser.close().catch(() => {});
  }
}

// ─── Post ─────────────────────────────────────────────────────────────────────
// Expects either:
//   - A path to an article folder (articles/{slug}/) containing index.qmd + compiled index.html
//   - Raw markdown string (legacy path — will compile inline)
// Pushes self-contained HTML to GitHub Pages, then imports it as a Medium draft.

async function post(input, { draft = true, headless = false } = {}) {
  const { pushArticle, pushFile } = require('./github-pages');
  let slug, articleDir, pagesUrl;

  // If input is a directory path with compiled HTML, push the folder
  if (fs.existsSync(input) && fs.statSync(input).isDirectory()) {
    articleDir = input;
    const qmdPath = path.join(articleDir, 'index.qmd');
    if (!fs.existsSync(qmdPath)) throw new Error(`No index.qmd in ${articleDir}`);

    const { data: fm } = matter(fs.readFileSync(qmdPath, 'utf8'));
    slug = fm.slug || path.basename(articleDir);

    const htmlPath = path.join(articleDir, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`No index.html in ${articleDir}. Run: quarto render ${qmdPath} --to html`);
    }

    console.log(`Pushing ${slug}/ to GitHub Pages...`);
    const result = await pushArticle(articleDir, slug);
    pagesUrl = result.url;
    console.log(`Live at: ${pagesUrl}`);
  } else {
    // Legacy: raw markdown string
    const { data: fm, content } = matter(input);
    const title  = fm.title || extractTitle(content);
    slug = fm.slug || slugify(title);

    const { marked } = require('marked');
    const bodyMd = content.replace(/^#[^\n]+\n+/, '');
    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body>
<h1>${title}</h1>
${marked(bodyMd)}
</body>
</html>`;

    console.log(`Pushing to GitHub Pages as ${slug}.html ...`);
    pagesUrl = await pushFile(`${slug}.html`, Buffer.from(html));
    console.log(`Live at: ${pagesUrl}`);
  }

  console.log('Waiting 8s for GitHub Pages to propagate...');
  await new Promise(r => setTimeout(r, 8000));

  const result = await importUrl(pagesUrl, { headless });
  const guard = publishGuard(!draft, result.url);
  if (guard.notice) console.log(guard.notice);
  return { url: result.url, draft: true };
}

function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : 'Untitled';
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

module.exports = {
  login, post, importUrl,
  resolveSessionPath, sessionSavePath, publishGuard, classifyPage, isEditorUrl,
  SESSION_FILE,
};

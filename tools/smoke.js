#!/usr/bin/env node
// Builds the test page (examples/site) from its saved copies without reaching
// the network, serves examples/site/_site on a free local port, loads it in
// headless Chrome at desktop (1280x800) and phone (390x844, 3x, touch) width,
// waits for the graph to settle, and exits 1 on any page error, console error,
// failed or 4xx/5xx request to the local server, or blank graph.
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');
const handler = require('serve-handler');
const { chromium } = require('playwright');

const ENGINE_ROOT = path.resolve(__dirname, '..');
const SITE_ROOT = path.join(ENGINE_ROOT, 'examples', 'site');
const SITE_DIR = path.join(SITE_ROOT, '_site');
const FORBIDDEN_PORTS = new Set([1420, 1421]);
const SETTLE_MS = 6000;
const BLANK_GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

const WIDTHS = [
  {
    name: 'desktop (1280x800)',
    context: { viewport: { width: 1280, height: 800 } },
  },
  {
    name: 'phone (390x844)',
    context: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    },
  },
];

function buildTestPage() {
  const env = { ...process.env, POSTPIPE_SAVED_COPIES: '1' };
  delete env.POSTPIPE_SITE;
  execFileSync(
    process.execPath,
    [path.join(ENGINE_ROOT, 'generate-index.js')],
    { cwd: ENGINE_ROOT, env, stdio: 'inherit' },
  );
}

function listenOnFreePort(siteDir) {
  return new Promise((resolve, reject) => {
    const tryListen = () => {
      const server = http.createServer((req, res) => handler(req, res, { public: siteDir }));
      server.once('error', reject);
      server.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        if (FORBIDDEN_PORTS.has(port)) {
          server.close(() => tryListen());
          return;
        }
        resolve({ server, port, base: `http://127.0.0.1:${port}/` });
      });
    };
    tryListen();
  });
}

async function launchBrowser() {
  const single = process.env.PP_E2E_SINGLE_PROCESS === '1';
  const args = single ? ['--single-process', '--no-zygote'] : [];
  const baseOpts = { headless: true, ...(args.length ? { args } : {}) };
  try {
    return await chromium.launch({ ...baseOpts, channel: 'chrome' });
  } catch (_) {
    return await chromium.launch(baseOpts);
  }
}

async function checkWidth(browser, base, widthSpec) {
  const ctx = await browser.newContext(widthSpec.context);
  const page = await ctx.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  const badRequests = [];

  // Answer requests off the local server locally so loading a card's cover
  // image from a feed never touches the network or hangs an offline smoke check.
  await page.route('**/*', (route) => {
    const req = route.request();
    const u = req.url();
    if (u.startsWith(base) || u.startsWith('data:') || u.startsWith('blob:')) {
      return route.continue();
    }
    if (req.resourceType() === 'image') {
      return route.fulfill({ status: 200, contentType: 'image/gif', body: BLANK_GIF });
    }
    return route.fulfill({ status: 204, body: '' });
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err && err.message ? err.message : String(err));
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      console.error(`  [${widthSpec.name} console.error] ${text}`);
      consoleErrors.push(text);
    }
  });
  page.on('requestfailed', (req) => {
    const u = req.url();
    if (!u.startsWith(base)) return;
    const why = (req.failure() && req.failure().errorText) || 'failed';
    badRequests.push(`request failed ${u} (${why})`);
  });
  page.on('response', (res) => {
    const u = res.url();
    const status = res.status();
    if (u.startsWith(base) && status >= 400) {
      badRequests.push(`HTTP ${status} ${u}`);
    }
  });

  try {
    const mainRes = await page.goto(base, { waitUntil: 'load' });
    if (!mainRes || mainRes.status() >= 400) {
      badRequests.push(`main document HTTP ${mainRes ? mainRes.status() : 'no response'}`);
    }
    await page.waitForTimeout(SETTLE_MS);

    const state = await page.evaluate(() => {
      const errEl = document.getElementById('error');
      const errStyle = errEl ? window.getComputedStyle(errEl) : null;
      const errorShown = errEl && errStyle && errStyle.display !== 'none' && errEl.textContent
        ? errEl.textContent.trim()
        : '';
      const svg = document.querySelector('[data-graph-root] svg');
      const svgRect = svg ? svg.getBoundingClientRect() : null;
      const cards = document.querySelectorAll('.node-card').length;
      const nodes = document.querySelectorAll('svg g.node').length;
      return {
        errorShown,
        hasSvg: Boolean(svgRect && svgRect.width > 0 && svgRect.height > 0),
        cards,
        nodes,
      };
    });

    const reasons = [];
    if (pageErrors.length) reasons.push(`page error: ${pageErrors.join('; ')}`);
    if (consoleErrors.length) reasons.push(`console error: ${consoleErrors.join('; ')}`);
    if (badRequests.length) reasons.push(badRequests.join('; '));
    if (state.errorShown) reasons.push(`#error shown: ${state.errorShown}`);
    if (!state.hasSvg || state.cards <= 0 || state.nodes <= 0) {
      reasons.push(`blank page (svg=${state.hasSvg}, cards=${state.cards}, nodes=${state.nodes})`);
    }

    if (reasons.length) {
      console.log(`${widthSpec.name}: failed — ${reasons.join(' | ')}`);
      return false;
    }
    console.log(`${widthSpec.name}: passed (${state.cards} cards, ${state.nodes} graph nodes)`);
    return true;
  } finally {
    await ctx.close();
  }
}

async function main() {
  buildTestPage();
  if (!fs.existsSync(path.join(SITE_DIR, 'index.html'))) {
    console.error(`smoke: ${path.join(SITE_DIR, 'index.html')} was not built`);
    process.exit(1);
  }

  const { server, base } = await listenOnFreePort(SITE_DIR);
  let browser;
  let allPassed = true;
  try {
    browser = await launchBrowser();
    for (const w of WIDTHS) {
      const ok = await checkWidth(browser, base, w);
      if (!ok) allPassed = false;
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((r) => server.close(r));
  }

  if (!allPassed) process.exit(1);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`smoke: ${err && err.message ? err.message : err}`);
    process.exit(1);
  });
}

module.exports = { WIDTHS, FORBIDDEN_PORTS, SETTLE_MS, buildTestPage, listenOnFreePort, launchBrowser, checkWidth, main };

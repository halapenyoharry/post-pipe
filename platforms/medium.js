// platforms/medium.js
// GitHub Pages → Medium import
// 1. Pushes self-contained HTML to GitHub Pages (flat: {slug}.html)
// 2. Opens medium.com/me/stories → "Import a story", pastes the Pages URL
// No login, no OAuth, no Google.

const { chromium } = require('playwright');
const matter       = require('gray-matter');
const path         = require('path');
const fs           = require('fs');
const { pushArticle, PAGES_BASE } = require('./github-pages');

// ─── Login ───────────────────────────────────────────────────────────────────

async function login() {
  console.log('Medium uses GitHub Pages + import. No login needed.');
  console.log('Make sure auth/.env has GITHUB_TOKEN set.');
}

// ─── Post ─────────────────────────────────────────────────────────────────────
// Expects either:
//   - A path to an article folder (articles/{slug}/) containing index.qmd + compiled index.html
//   - Raw markdown string (legacy path — will compile inline)
// Pushes self-contained HTML to GitHub Pages, then opens Medium import.

async function post(input, { draft = true } = {}) {
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

    const { pushFile } = require('./github-pages');
    console.log(`Pushing to GitHub Pages as ${slug}.html ...`);
    pagesUrl = await pushFile(`${slug}.html`, Buffer.from(html));
    console.log(`Live at: ${pagesUrl}`);
  }

  console.log('Waiting 8s for GitHub Pages to propagate...');
  await new Promise(r => setTimeout(r, 8000));

  console.log('Opening Medium import...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page    = await context.newPage();

  try {
    // medium.com/p/import is dead — go to stories and use Import button
    await page.goto('https://medium.com/me/stories', { waitUntil: 'networkidle' });

    await page.locator('button:has-text("Import a story"), a:has-text("Import a story")').first().click();
    await page.waitForTimeout(2000);

    await page.locator('input[type="url"], input[placeholder*="URL"], input[name="url"]')
      .first().fill(pagesUrl);
    await page.locator('button:has-text("Import"), button[type="submit"]').first().click();
    await page.waitForTimeout(5000);

    const url = page.url();
    console.log(draft ? `Draft ready: ${url}` : `Published: ${url}`);
    return { url, draft };
  } finally {
    await browser.close();
  }
}

function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : 'Untitled';
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

module.exports = { login, post };

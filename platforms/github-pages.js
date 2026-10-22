// platforms/github-pages.js
// Push self-contained articles to GitHub Pages via the Contents API
// Flat structure: {slug}.html at the repo root. Everything is baked into the HTML.

const path = require('path');
const fs   = require('fs');
const { siteRoot, loadSiteEnv } = require('../src/lib/siteRoot');

loadSiteEnv(siteRoot());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const PAGES_BASE   = GITHUB_OWNER && GITHUB_REPO ? `https://${GITHUB_OWNER}.github.io/${GITHUB_REPO}` : '';

// ─── Push a single file to the repo ──────────────────────────────────────────

async function pushFile(repoPath, content) {
  const token = process.env.GITHUB_TOKEN || GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || GITHUB_OWNER;
  const repo  = process.env.GITHUB_REPO  || GITHUB_REPO;

  if (!token) throw new Error('GITHUB_TOKEN missing from auth/.env');
  if (!owner) throw new Error('GITHUB_OWNER environment variable is required when publishing to GitHub Pages');
  if (!repo)  throw new Error('GITHUB_REPO environment variable is required when publishing to GitHub Pages');

  const pagesBase = `https://${owner}.github.io/${repo}`;
  const apiUrl  = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;
  const encoded = Buffer.from(content).toString('base64');

  // Check if file exists (need SHA for update)
  let sha;
  const check = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}`, 'User-Agent': 'post-pipe' }
  });
  if (check.ok) {
    sha = (await check.json()).sha;
  }

  const body = { message: `post: ${repoPath}`, content: encoded };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, {
    method:  'PUT',
    headers: {
      Authorization:  `token ${token}`,
      'Content-Type': 'application/json',
      'User-Agent':   'post-pipe',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error pushing ${repoPath}: ${err}`);
  }

  return `${pagesBase}/${repoPath}`;
}

// ─── Push a self-contained article ───────────────────────────────────────────
// Local: articles/{slug}/index.qmd + images/ (folder-per-article)
// Remote: {slug}.html (flat — everything baked into one file)

async function pushArticle(articleDir, slug) {
  const htmlPath = path.join(articleDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`No index.html in ${articleDir}. Run: quarto render index.qmd --to html -M embed-resources:true`);
  }

  const repoPath = `${slug}.html`;
  console.log(`  pushing ${repoPath}`);
  const url = await pushFile(repoPath, fs.readFileSync(htmlPath));

  return { url };
}

module.exports = { pushFile, pushArticle, PAGES_BASE };

#!/usr/bin/env node
// add-feed.js — append a feed to feeds.opml and rebuild the corpus.
//
// Usage:
//   node add-feed.js <feedUrl> [--title=<title>] [--color=<#rrggbb>]
//
// What it does:
//   1. Validates the URL.
//   2. Appends an <outline> entry to feeds.opml before </body>.
//   3. Runs `node generate-index.js` so feed.json includes the new items.
//
// What it intentionally does NOT do:
//   - Fetch the feed to verify it's reachable (build will surface that)
//   - Remove duplicate entries (no-op if URL already present)
//   - Detect type beyond what the OPML parser already does

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseArgs(argv) {
  const out = { url: '', title: '', color: '' };
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--title='))  out.title = arg.slice(8);
    else if (arg.startsWith('--color=')) out.color = arg.slice(8);
    else if (!arg.startsWith('--'))   out.url = arg;
  }
  return out;
}

function main() {
  const { url, title, color } = parseArgs(process.argv);

  if (!url) {
    console.error('Usage: node add-feed.js <feedUrl> [--title=<title>] [--color=<#rrggbb>]');
    process.exit(1);
  }
  try { new URL(url); }
  catch { console.error(`Invalid URL: ${url}`); process.exit(1); }

  const opmlPath = path.join(__dirname, 'feeds.opml');
  if (!fs.existsSync(opmlPath)) {
    console.error(`feeds.opml not found at ${opmlPath}`);
    process.exit(1);
  }

  const existing = fs.readFileSync(opmlPath, 'utf8');
  if (existing.includes(`xmlUrl="${url}"`)) {
    console.log(`Already present in feeds.opml: ${url}`);
    runBuild();
    return;
  }

  const label = title || urlToLabel(url);
  const colorAttr = color ? ` customColor="${color}"` : '';
  const outline = `    <outline text="${escape(label)}" title="${escape(label)}" xmlUrl="${escape(url)}"${colorAttr}/>`;

  const updated = existing.replace('</body>', `${outline}\n  </body>`);
  fs.writeFileSync(opmlPath, updated);
  console.log(`Added to feeds.opml: ${label} (${url})`);

  runBuild();
}

function runBuild() {
  console.log('Running generate-index.js...');
  try {
    execSync('node generate-index.js', {
      cwd: __dirname,
      stdio: 'inherit',
    });
  } catch (err) {
    console.error('Build failed.');
    process.exit(err.status || 1);
  }
}

function urlToLabel(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

function escape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

main();

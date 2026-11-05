// PageListAdapter — many pages under one entry. A feeds.opml entry
// type="pages" names in xmlUrl a local text file listing page addresses,
// one per line (blank lines and lines starting with # are skipped), so a
// site owner can keep a list. Each address is fetched at build and read as
// PageAdapter reads one page; a page that fails is left out with a warning
// and the others stand. The list file is the source; each item's source is
// the entry's title.

const fs = require('fs');
const { fetchText } = require('./fetchText');
const { pageItem, homeOf } = require('./PageAdapter');

const ID = 'pages';

// Reads the list's addresses: http(s) ones, in order, without repeats.
function readList(text) {
  const seen = new Set();
  const out = [];
  for (const raw of String(text || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (!/^https?:\/\//i.test(line) || seen.has(line)) continue;
    seen.add(line);
    out.push(line);
  }
  return out;
}

async function load(config, { fetchText: fetchPage = fetchText } = {}) {
  const { id, title, path: listPath } = config;
  if (!listPath || !fs.existsSync(listPath)) {
    throw new Error(`PageListAdapter: list file not found at ${listPath}`);
  }
  const urls = readList(fs.readFileSync(listPath, 'utf8'));
  const results = await Promise.all(urls.map(async (url) => {
    try {
      return pageItem(await fetchPage(url), url);
    } catch (err) {
      console.warn(`[pages] ${title || id}: ${url} failed: ${err && err.message ? err.message : err}; left out this build`);
      return null;
    }
  }));
  const items = results.filter(Boolean);
  return {
    items,
    feedMeta: {
      id: id || listPath,
      title: title || listPath,
      home_page_url: items.length ? homeOf(items[0].url) : null,
      favicon: null,
      icon: null,
    },
  };
}

module.exports = { id: ID, load, readList };

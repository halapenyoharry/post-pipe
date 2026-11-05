// opml.js — minimal OPML reader. Parse only; no serializer.
//
// OPML editing happens in dedicated tools (NetNewsWire, Reeder, Inoreader,
// hand-editing). We read what the user brings.
//
// Output is a flat array of FeedEntry — only <outline> nodes with an
// xmlUrl attribute are treated as feeds. Container <outline>s (folders)
// become a `folder` path on their descendants so the graph can cluster
// or filter by folder later.

const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  // Even single <outline> children should be arrays so traversal is uniform.
  isArray: (name) => name === 'outline',
});

/**
 * @typedef {Object} FeedEntry
 *   xmlUrl       — the feed URL (or local:// scheme for the LocalFolderAdapter)
 *   type         — 'rss' | 'atom' | 'json' | 'local' | 'page' | 'pages'
 *   title        — display name (from title || text attribute)
 *   htmlUrl      — optional, the human-readable site URL
 *   folder       — '/'-joined OPML folder path, '' for top level
 *   customColor  — optional, user-defined color override
 *   savedCopy    — optional, a file the site keeps a copy of this feed in,
 *                  relative to the site ({ url, fetchedAt, body }), used only
 *                  when a build's fetch fails (src/adapters/lastGoodCopy.js)
 *   raw          — the original outline attributes (for forward compatibility)
 */

/**
 * Parse an OPML document into a flat list of FeedEntry.
 * Container outlines (no xmlUrl) become folder paths on descendants.
 *
 * @param {string} xmlText
 * @returns {FeedEntry[]}
 */
function parseOpml(xmlText) {
  const doc = parser.parse(xmlText);
  const body = doc?.opml?.body;
  if (!body) return [];

  const out = [];
  walk(body.outline || [], [], out);
  return out;
}

function walk(outlines, folderStack, out) {
  for (const o of outlines) {
    const xmlUrl = o['@_xmlUrl'];
    const children = o.outline;

    if (xmlUrl) {
      // Feed entry. Stop descending — a feed outline shouldn't have feed
      // children, but if it does, treat them as siblings (OPML in the wild
      // is sometimes irregular).
      out.push({
        xmlUrl,
        type: detectType(o['@_type'], xmlUrl),
        title: o['@_title'] || o['@_text'] || xmlUrl,
        htmlUrl: o['@_htmlUrl'] || null,
        folder: folderStack.join('/'),
        customColor: o['@_customColor'] || null,
        // A copy of the feed the site ships in its own folder, for a build
        // whose fetch fails (provisional name).
        savedCopy: typeof o['@_savedCopy'] === 'string' && o['@_savedCopy'].trim() ? o['@_savedCopy'].trim() : null,
        // How loudly this source renders. Your own corpus and a subscribed
        // firehose are not peers, and nothing in the model said so before —
        // the distinction was falling out of the status field by accident.
        // Defaults keep the current behaviour, deliberately this time.
        prominence: normalizeProminence(o['@_prominence'], detectType(o['@_type'], xmlUrl)),
        cardScale: parseCardScale(o['@_cardScale']),
        itemCap: parseItemCap(o['@_itemCap'] !== undefined ? o['@_itemCap'] : o['@_maxItems']),
        defaultHidden: parseDefaultHidden(o['@_defaultHidden'] !== undefined ? o['@_defaultHidden'] : o['@_hidden']),
        raw: stripAtPrefix(o),
      });
      if (Array.isArray(children)) walk(children, folderStack, out);
    } else {
      // Container (folder). Push the folder name and recurse.
      const name = o['@_title'] || o['@_text'] || '';
      const nextStack = name ? [...folderStack, name] : folderStack;
      if (Array.isArray(children)) walk(children, nextStack, out);
    }
  }
}

function normalizeProminence(attr, type) {
  const v = (attr || '').toLowerCase();
  if (v === 'primary' || v === 'secondary') return v;
  return type === 'local' ? 'primary' : 'secondary';
}

function parseCardScale(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseItemCap(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.floor(n);
}

function parseDefaultHidden(v) {
  if (v === true) return true;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes';
  }
  return false;
}

function detectType(typeAttr, xmlUrl) {
  const t = (typeAttr || '').toLowerCase();
  // page: xmlUrl is one article's address; pages: xmlUrl is a local file
  // listing addresses one per line. Neither is inferred: a plain address
  // without a type is a feed, as ever.
  if (t === 'rss' || t === 'atom' || t === 'json' || t === 'local' || t === 'page' || t === 'pages') return t;
  if (xmlUrl.startsWith('local://'))           return 'local';
  if (xmlUrl.endsWith('.json') || xmlUrl.includes('feed.json')) return 'json';
  // Default to RSS — most readers leave type=rss off for plain feeds.
  return 'rss';
}

function stripAtPrefix(obj) {
  const out = {};
  for (const k of Object.keys(obj)) {
    if (k.startsWith('@_')) out[k.slice(2)] = obj[k];
  }
  return out;
}

module.exports = { parseOpml, parseCardScale, parseItemCap, parseDefaultHidden };

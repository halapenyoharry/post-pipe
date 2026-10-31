// feedAutodiscovery — when a reader pastes a site's page URL into the "+"
// control, find its <link rel="alternate"> feed URL (RSS, Atom, or JSON Feed)
// and resolve it against the page URL.
//
// Provisional switch: settings.topBar.autodiscover (default true; set false
// to use the pasted URL as-is without fetching or parsing HTML).

const FEED_MIME_TYPES = new Set([
  'application/rss+xml',
  'application/atom+xml',
  'application/feed+json',
]);

function autodiscoverEnabled(settings) {
  if (!settings || typeof settings !== 'object') return true;
  if (settings.topBar && typeof settings.topBar === 'object' && settings.topBar.autodiscover === false) {
    return false;
  }
  if (settings.autodiscover === false) return false;
  return true;
}

function parseAttributes(tag) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let m;
  while ((m = re.exec(tag)) !== null) {
    const name = m[1].toLowerCase();
    const val = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4];
    attrs[name] = val;
  }
  return attrs;
}

function decodeBasicEntities(str) {
  return String(str || '')
    .replace(/&amp;/gi, '&')
    .replace(/&#38;/g, '&')
    .replace(/&#x26;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}

function looksLikeHtml(text) {
  if (typeof text !== 'string') return false;
  const head = text.slice(0, 65536).trimStart();
  if (!head) return false;
  // Already an XML feed or JSON Feed — do not treat as an HTML page.
  if (/^<\?xml\b[^>]*>?\s*<(rss|feed|rdf:RDF)\b/i.test(head)) return false;
  if (/^<(rss|feed|rdf:RDF)\b/i.test(head)) return false;
  if (head.startsWith('{')) return false;
  return /<(?:!doctype\s+html|html|head|link)\b/i.test(head);
}

/**
 * Parse the first <link rel="alternate" type="application/rss+xml|application/atom+xml|application/feed+json">
 * from an HTML document and resolve its href against `baseUrl`.
 *
 * @param {string} html
 * @param {string} baseUrl
 * @returns {string|null}
 */
function parseAlternateFeedLink(html, baseUrl) {
  if (!looksLikeHtml(html) || !baseUrl) return null;
  const head = html.slice(0, 65536);
  const linkRe = /<link\b[^>]*>/gi;
  let m;
  while ((m = linkRe.exec(head)) !== null) {
    const attrs = parseAttributes(m[0]);
    const relTokens = String(attrs.rel || '').toLowerCase().trim().split(/\s+/);
    if (!relTokens.includes('alternate')) continue;
    const mime = String(attrs.type || '').toLowerCase().split(';')[0].trim();
    if (!FEED_MIME_TYPES.has(mime)) continue;
    const rawHref = decodeBasicEntities(attrs.href || '').trim();
    if (!rawHref) continue;
    try {
      const resolved = new URL(rawHref, baseUrl);
      if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
        return resolved.href;
      }
    } catch (_) {
      // Malformed href; try next <link>.
    }
  }
  return null;
}

/**
 * Fetch `pageUrl` (when `autodiscover` is enabled) and, if the response is
 * HTML with a `<link rel="alternate">` feed tag, return the resolved feed URL;
 * otherwise return `pageUrl` unchanged.
 *
 * @param {string} pageUrl
 * @param {Object} [options]
 * @param {boolean} [options.autodiscover=true]
 * @param {Function} [options.fetchImpl] — browser `fetch` or `(url) => Promise<string|Response>`
 * @returns {Promise<string>}
 */
async function discoverFeedUrl(pageUrl, options = {}) {
  const input = typeof pageUrl === 'string' ? pageUrl.trim() : '';
  if (!input) return input;
  const enabled = options.autodiscover !== false;
  if (!enabled) return input;

  const f = options.fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
  if (typeof f !== 'function') return input;

  try {
    const res = await f(input, { headers: { Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' } });
    let text = '';
    let finalUrl = input;
    if (typeof res === 'string') {
      text = res;
    } else if (res && typeof res === 'object') {
      if (res.ok === false) return input;
      if (typeof res.url === 'string' && res.url) finalUrl = res.url;
      if (typeof res.text === 'function') text = await res.text();
      else if (typeof res.body === 'string') text = res.body;
    }
    const found = parseAlternateFeedLink(text, finalUrl);
    return found || input;
  } catch (_) {
    return input;
  }
}

module.exports = {
  FEED_MIME_TYPES,
  autodiscoverEnabled,
  parseAlternateFeedLink,
  discoverFeedUrl,
};

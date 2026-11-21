// readerUrl.js — clean path-based or hash-based addresses for the reader.
//
// By default (settings.reader.urlStyle unset or 'hash'), the open card lives in
// the URL hash as #read=<id>[&p=<para>]. A site that sets
// settings.reader.urlStyle = 'path' (such as a multi-essay archive served under
// /paperz/) gets clean URLs like /paperz/<slug>[#p=<para>], while still
// honoring incoming #read=<id> links.

const URL_STYLES = ['hash', 'path'];

/**
 * @param {any} settings
 * @returns {'hash'|'path'}
 */
function readerUrlStyle(settings) {
  const v = settings && settings.reader && settings.reader.urlStyle;
  return v === 'path' ? 'path' : 'hash';
}

/**
 * Last path segment of an item's url or id without .html, or item.slug when set.
 *
 * @param {any} item
 * @returns {string}
 */
function itemSlug(item) {
  if (!item) return '';
  if (typeof item.slug === 'string' && item.slug.trim()) return item.slug.trim();
  const raw = String(item.url || item.id || '')
    .split('#')[0]
    .split('?')[0]
    .replace(/\/+$/, '');
  if (!raw) return '';
  const seg = raw.split('/').pop() || '';
  try {
    return decodeURIComponent(seg).replace(/\.html?$/i, '');
  } catch (_) {
    return seg.replace(/\.html?$/i, '');
  }
}

/**
 * Normalized pathname prefix (always leading and trailing slash) from
 * settings.site.base_url, or null when absent or invalid.
 *
 * @param {any} settings
 * @returns {string|null}
 */
function configuredBasePath(settings) {
  const raw =
    settings && settings.site && typeof settings.site.base_url === 'string' ? settings.site.base_url.trim() : '';
  if (!raw) return null;
  try {
    let p = new URL(raw, 'http://localhost').pathname || '/';
    if (!p.startsWith('/')) p = '/' + p;
    if (!p.endsWith('/')) p += '/';
    return p;
  } catch (_) {
    return null;
  }
}

/**
 * Directory URL path where the site root (index.html and feed.json) lives,
 * always starting and ending with '/'.
 *
 * @param {string} [pathname]
 * @param {any} [settings]
 * @returns {string}
 */
function siteBasePath(pathname, settings) {
  let p = String(pathname || '/');
  if (!p.startsWith('/')) p = '/' + p;
  const cfg = configuredBasePath(settings);
  if (cfg && cfg !== '/') {
    const trimmed = cfg.slice(0, -1);
    if (p === trimmed || p.startsWith(cfg)) return cfg;
  }
  if (p.endsWith('/index.html')) return p.slice(0, -'index.html'.length) || '/';
  if (p.endsWith('/')) return p;
  return p.slice(0, p.lastIndexOf('/') + 1) || '/';
}

/**
 * Slug extracted from the current pathname when settings.reader.urlStyle is 'path'.
 *
 * @param {string} [pathname]
 * @param {any} [settings]
 * @returns {string}
 */
function pathSlugFromLocation(pathname, settings) {
  if (readerUrlStyle(settings) !== 'path') return '';
  const base = siteBasePath(pathname, settings);
  let p = String(pathname || '/');
  if (!p.startsWith('/')) p = '/' + p;
  if (!p.startsWith(base)) return '';
  const rest = p.slice(base.length).replace(/\/+$/, '');
  if (!rest || rest === 'index.html' || rest.includes('/')) return '';
  try {
    return decodeURIComponent(rest);
  } catch (_) {
    return rest;
  }
}

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch (_) {
    return s;
  }
}

function parsePara(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Resolve the currently requested item and paragraph from a location object.
 * Always honors #read=<id>[&p=<n>] so older links keep working in path mode.
 *
 * @param {{ pathname?: string, hash?: string }|null|undefined} loc
 * @param {any[]} items
 * @param {any} [settings]
 * @returns {{ item: any|null, paragraph: number|null, legacyHash: boolean }}
 */
function parseReaderLocation(loc, items, settings) {
  const list = Array.isArray(items) ? items : [];
  const hash = loc && typeof loc.hash === 'string' ? loc.hash : '';
  const pathname = loc && typeof loc.pathname === 'string' ? loc.pathname : '/';

  if (hash.startsWith('#read=')) {
    const parts = hash.slice(6).split('&p=');
    const decoded = safeDecode(parts[0]);
    const paragraph = parsePara(parts[1]);
    const item = list.find((i) => i && (i.id === decoded || i.url === decoded || itemSlug(i) === decoded)) || null;
    return { item, paragraph, legacyHash: true };
  }

  const slug = pathSlugFromLocation(pathname, settings);
  if (!slug) return { item: null, paragraph: null, legacyHash: false };

  let paragraph = null;
  if (hash.startsWith('#p=')) paragraph = parsePara(hash.slice(3));
  const item = list.find((i) => i && itemSlug(i) === slug) || null;
  return { item, paragraph, legacyHash: false };
}

/**
 * Relative URL path (pathname + search + optional hash) for opening an item.
 *
 * @param {any} item
 * @param {{ pathname?: string, search?: string, settings?: any, paragraph?: number|null }} [opts]
 * @returns {string}
 */
function articlePath(item, opts) {
  const { pathname = '/', search = '', settings = null, paragraph = null } = opts || {};
  const para = paragraph !== undefined && paragraph !== null ? Number(paragraph) : null;
  const validPara = para !== null && Number.isFinite(para) && para >= 0;
  if (readerUrlStyle(settings) === 'path') {
    const slug = itemSlug(item);
    if (slug) {
      const base = siteBasePath(pathname, settings);
      return `${base}${encodeURIComponent(slug)}${search || ''}${validPara ? `#p=${para}` : ''}`;
    }
  }
  const id = (item && (item.id || item.url)) || '';
  return `${pathname || ''}${search || ''}#read=${encodeURIComponent(id)}${validPara ? `&p=${para}` : ''}`;
}

/**
 * Full URL string for copying/sharing a link to an open item (and optional paragraph).
 *
 * @param {any} item
 * @param {{ origin?: string, pathname?: string, search?: string, settings?: any, paragraph?: number|null }} [opts]
 * @returns {string}
 */
function articleAbsoluteUrl(item, opts) {
  const { origin = '', pathname = '/', search = '', settings = null, paragraph = null } = opts || {};
  const rel = articlePath(item, { pathname, search, settings, paragraph });
  if (origin) {
    if (rel.startsWith('/')) return origin + rel;
    return origin + '/' + rel;
  }
  return rel;
}

/**
 * Address to restore when closing the reader.
 *
 * @param {{ pathname?: string, search?: string, settings?: any }} [opts]
 * @returns {string}
 */
function closedPath(opts) {
  const { pathname = '/', search = '', settings = null } = opts || {};
  if (readerUrlStyle(settings) === 'path') {
    return `${siteBasePath(pathname, settings)}${search || ''}`;
  }
  return `${pathname || ''}${search || ''}`;
}

/**
 * Whether a location currently targets an article (either via #read= or path slug).
 *
 * @param {{ pathname?: string, hash?: string }|null|undefined} loc
 * @param {any} [settings]
 * @returns {boolean}
 */
function hasReaderRoute(loc, settings) {
  const hash = loc && typeof loc.hash === 'string' ? loc.hash : '';
  if (hash.startsWith('#read=')) return true;
  const pathname = loc && typeof loc.pathname === 'string' ? loc.pathname : '/';
  return Boolean(pathSlugFromLocation(pathname, settings));
}

/**
 * Resolve an in-reader anchor href against the current location and corpus items.
 * Returns { item, paragraph } for same-origin links matching an item, else null.
 *
 * @param {string} href
 * @param {string} baseHref
 * @param {any[]} items
 * @param {any} [settings]
 * @returns {{ item: any, paragraph: number|null }|null}
 */
function resolveReaderHref(href, baseHref, items, settings) {
  if (!href || !baseHref) return null;
  const trimmed = String(href).trim();
  if (trimmed.startsWith('#') && !trimmed.startsWith('#read=')) return null;
  let target;
  let current;
  try {
    current = new URL(baseHref);
    target = new URL(trimmed, current);
  } catch (_) {
    return null;
  }
  if (target.origin !== current.origin) return null;
  if (
    target.pathname === current.pathname &&
    target.hash &&
    !target.hash.startsWith('#read=') &&
    !target.hash.startsWith('#p=')
  ) {
    return null;
  }
  const parsed = parseReaderLocation({ pathname: target.pathname, hash: target.hash }, items, settings);
  if (!parsed.item) return null;
  return { item: parsed.item, paragraph: parsed.paragraph };
}

module.exports = {
  URL_STYLES,
  readerUrlStyle,
  itemSlug,
  configuredBasePath,
  siteBasePath,
  pathSlugFromLocation,
  parseReaderLocation,
  articlePath,
  articleAbsoluteUrl,
  closedPath,
  hasReaderRoute,
  resolveReaderHref,
};

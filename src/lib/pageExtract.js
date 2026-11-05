// pageExtract — one article's HTML page in, its parts out: title, author and
// date when the page marks them up, the canonical link, the article's tags
// (article:tag and meta keywords), the cover image, and the main text as HTML
// by a plain readability pass (the block holding the most paragraph text,
// after the page's chrome is dropped). Nothing here fetches; the page adapter
// (src/adapters/PageAdapter.js) fetches and hands the text in.
//
// No dependency: fast-xml-parser does not read HTML in the wild, so a small
// tolerant tree is built here (unclosed <p> and <li>, void tags, stray close
// tags are all taken as browsers take them, near enough for choosing a block).

const { decodeHtmlEntities } = require('./htmlEntities');

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Tags whose content is text, not markup, until their own close tag.
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title', 'noscript']);
// Browsers close an open <p> when one of these opens.
const CLOSES_P = new Set(['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul']);
// An open one of these closes when the same one opens again.
const SELF_CLOSING_SIBLINGS = new Set(['li', 'dt', 'dd', 'tr', 'td', 'th', 'option']);
// Page chrome: never part of the article's text.
const CHROME = new Set(['script', 'style', 'nav', 'header', 'footer', 'aside', 'noscript', 'svg', 'form', 'iframe', 'template', 'button', 'select', 'textarea', 'input']);
// Containers that can be the article's block.
const CANDIDATES = new Set(['article', 'main', 'section', 'div', 'td', 'body', 'blockquote', 'li']);
const BLOCK = new Set(['p', 'div', 'section', 'article', 'main', 'li', 'ul', 'ol', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figure', 'figcaption', 'table', 'tr', 'td', 'th', 'dl', 'dt', 'dd', 'hr', 'br', 'body', 'header', 'footer', 'aside', 'nav']);
const ATTRS_KEPT = new Set(['href', 'src', 'alt', 'title', 'datetime', 'cite', 'colspan', 'rowspan', 'srcset', 'width', 'height', 'start']);

function parseAttributes(s) {
  const attrs = {};
  const re = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const name = m[1].toLowerCase();
    const val = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : '';
    if (!(name in attrs)) attrs[name] = decodeHtmlEntities(val);
  }
  return attrs;
}

// Builds the tree: { name: '#root', children } of elements { name, attrs,
// children, parent } and text nodes { text }.
function parseHtml(html) {
  const root = { name: '#root', attrs: {}, children: [], parent: null };
  let cur = root;
  const src = String(html || '');
  const len = src.length;
  let i = 0;
  const open = (name, attrs) => {
    const el = { name, attrs, children: [], parent: cur };
    cur.children.push(el);
    if (!VOID.has(name)) cur = el;
  };
  const closeTo = (name) => {
    let n = cur;
    while (n && n !== root && n.name !== name) n = n.parent;
    if (n && n !== root) cur = n.parent;
  };
  const text = (t) => { if (t) cur.children.push({ text: t }); };

  while (i < len) {
    const lt = src.indexOf('<', i);
    if (lt < 0) { text(src.slice(i)); break; }
    if (lt > i) text(src.slice(i, lt));
    if (src.startsWith('<!--', lt)) {
      const end = src.indexOf('-->', lt + 4);
      i = end < 0 ? len : end + 3;
      continue;
    }
    if (src[lt + 1] === '!' || src[lt + 1] === '?') {
      const end = src.indexOf('>', lt);
      i = end < 0 ? len : end + 1;
      continue;
    }
    const m = /^<(\/?)([a-zA-Z][^\s\/>]*)([^>]*?)(\/?)>/.exec(src.slice(lt, lt + 4096));
    if (!m) { text('<'); i = lt + 1; continue; }
    i = lt + m[0].length;
    const name = m[2].toLowerCase();
    if (m[1]) { closeTo(name); continue; }
    const attrs = parseAttributes(m[3]);
    if (CLOSES_P.has(name)) {
      let n = cur;
      while (n && n !== root && n.name !== 'p') n = n.parent;
      if (n && n !== root && n.name === 'p') cur = n.parent;
    }
    if (SELF_CLOSING_SIBLINGS.has(name)) {
      let n = cur;
      while (n && n !== root && !CANDIDATES.has(n.name) && n.name !== name && n.name !== 'ul' && n.name !== 'ol' && n.name !== 'table' && n.name !== 'dl') n = n.parent;
      if (n && n !== root && n.name === name) cur = n.parent;
    }
    open(name, attrs);
    if (RAW_TEXT.has(name) && !m[4]) {
      const close = src.toLowerCase().indexOf(`</${name}`, i);
      const end = close < 0 ? len : close;
      text(src.slice(i, end));
      cur = cur.parent;
      const gt = src.indexOf('>', end);
      i = close < 0 ? len : (gt < 0 ? len : gt + 1);
    } else if (m[4] && !VOID.has(name)) {
      cur = cur.parent;
    }
  }
  return root;
}

function* walk(node) {
  if (!node) return;
  yield node;
  if (node.children) for (const c of node.children) yield* walk(c);
}

function find(root, pred) {
  for (const n of walk(root)) if (n.name && pred(n)) return n;
  return null;
}

function findAll(root, pred) {
  const out = [];
  for (const n of walk(root)) if (n.name && pred(n)) out.push(n);
  return out;
}

function isChrome(name) { return CHROME.has(name); }

function textOf(node, { skipChrome = true } = {}) {
  if (!node) return '';
  if (node.text !== undefined) return node.text;
  if (skipChrome && isChrome(node.name)) return '';
  let s = '';
  for (const c of node.children) {
    if (c.text !== undefined) s += c.text;
    else {
      if (BLOCK.has(c.name)) s += ' ';
      s += textOf(c, { skipChrome });
      if (BLOCK.has(c.name)) s += ' ';
    }
  }
  return s;
}

function clean(s) {
  return decodeHtmlEntities(String(s || '')).replace(/\s+/g, ' ').trim();
}

function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function escText(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// The block's inner HTML, chrome dropped, attributes other than the ones a
// reader needs dropped, text re-escaped.
function serializeChildren(node, baseUrl) {
  let out = '';
  for (const c of node.children) {
    if (c.text !== undefined) { out += escText(decodeHtmlEntities(c.text)); continue; }
    if (isChrome(c.name)) continue;
    const attrs = [];
    for (const k of Object.keys(c.attrs)) {
      if (!ATTRS_KEPT.has(k)) continue;
      let v = c.attrs[k];
      if ((k === 'href' || k === 'src') && baseUrl) v = resolveUrl(v, baseUrl) || v;
      attrs.push(` ${k}="${escAttr(v)}"`);
    }
    out += `<${c.name}${attrs.join('')}>`;
    if (!VOID.has(c.name)) out += `${serializeChildren(c, baseUrl)}</${c.name}>`;
  }
  return out;
}

function resolveUrl(href, baseUrl) {
  if (!href) return null;
  try {
    const u = new URL(href, baseUrl);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch (_) {
    return null;
  }
}

// Readability: every paragraph scores by its length and its commas, and
// hands its score to its parent and half to its grandparent; the candidate
// with the most, discounted by its link text, is the article's block.
function mainBlock(root) {
  const body = find(root, (n) => n.name === 'body') || root;
  const scores = new Map();
  const paragraphs = findAll(body, (n) => n.name === 'p' || n.name === 'pre' || n.name === 'blockquote');
  for (const p of paragraphs) {
    if (inChrome(p)) continue;
    const t = clean(textOf(p));
    if (t.length < 25) continue;
    const score = 1 + (t.match(/,/g) || []).length + Math.min(Math.floor(t.length / 100), 3);
    const parent = candidateAncestor(p, 1);
    const grand = parent ? candidateAncestor(parent, 1) : null;
    if (parent) scores.set(parent, (scores.get(parent) || 0) + score);
    if (grand) scores.set(grand, (scores.get(grand) || 0) + score / 2);
  }
  let best = null;
  let bestScore = -1;
  for (const [el, raw] of scores) {
    const all = clean(textOf(el)).length || 1;
    const links = findAll(el, (n) => n.name === 'a').reduce((s, a) => s + clean(textOf(a)).length, 0);
    const score = raw * (1 - links / all);
    if (score > bestScore) { best = el; bestScore = score; }
  }
  if (best) return best;
  // No paragraphs worth the name: the article or main element, else the body.
  return find(body, (n) => n.name === 'article') || find(body, (n) => n.name === 'main') || body;
}

function inChrome(node) {
  for (let n = node.parent; n; n = n.parent) if (n.name && isChrome(n.name)) return true;
  return false;
}

function candidateAncestor(node, from) {
  let n = node.parent;
  let steps = from;
  while (n && n.name !== '#root') {
    if (CANDIDATES.has(n.name) && --steps <= 0) return n;
    if (!CANDIDATES.has(n.name)) { /* inline or other wrapper: keep climbing */ }
    n = n.parent;
  }
  return null;
}

// <meta> values by name or property, in page order.
function metas(root) {
  const out = [];
  for (const m of findAll(root, (n) => n.name === 'meta')) {
    const key = (m.attrs.property || m.attrs.name || m.attrs.itemprop || '').toLowerCase();
    const content = m.attrs.content;
    if (key && content !== undefined) out.push({ key, content: clean(content) });
  }
  return out;
}

function meta(list, ...keys) {
  for (const k of keys) {
    const hit = list.find((m) => m.key === k && m.content);
    if (hit) return hit.content;
  }
  return '';
}

function metaAll(list, key) {
  return list.filter((m) => m.key === key && m.content).map((m) => m.content);
}

// JSON-LD blocks: the first Article-like object's headline, author,
// datePublished and keywords.
function jsonLd(root) {
  const out = { headline: '', author: '', date: '', keywords: [] };
  for (const s of findAll(root, (n) => n.name === 'script' && /ld\+json/i.test(n.attrs.type || ''))) {
    let data;
    try { data = JSON.parse(textOf(s, { skipChrome: false })); } catch (_) { continue; }
    const list = [];
    const push = (v) => {
      if (!v || typeof v !== 'object') return;
      if (Array.isArray(v)) return v.forEach(push);
      list.push(v);
      if (Array.isArray(v['@graph'])) v['@graph'].forEach(push);
    };
    push(data);
    for (const o of list) {
      const type = String(Array.isArray(o['@type']) ? o['@type'].join(' ') : o['@type'] || '');
      if (!/article|posting|webpage|report|review/i.test(type)) continue;
      if (!out.headline && typeof o.headline === 'string') out.headline = clean(o.headline);
      if (!out.author) out.author = personName(o.author);
      if (!out.date && typeof o.datePublished === 'string') out.date = o.datePublished;
      if (!out.keywords.length) out.keywords = keywordList(o.keywords);
      if (out.headline && out.author && out.date) break;
    }
  }
  return out;
}

function personName(a) {
  if (!a) return '';
  if (typeof a === 'string') return clean(a);
  if (Array.isArray(a)) return a.map(personName).filter(Boolean).join(', ');
  if (typeof a === 'object' && typeof a.name === 'string') return clean(a.name);
  return '';
}

function keywordList(k) {
  if (!k) return [];
  if (Array.isArray(k)) return k.map((v) => clean(typeof v === 'string' ? v : v && v.name)).filter(Boolean);
  if (typeof k === 'string') return k.split(',').map(clean).filter(Boolean);
  return [];
}

function parseDate(s) {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function unique(list) {
  const seen = new Set();
  const out = [];
  for (const v of list) {
    const k = v.toLowerCase();
    if (!v || seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
}

/**
 * @param {string} html   the page's text
 * @param {string} url    the address it was fetched from (links resolve against it)
 * @returns {{ title, author, date_published, canonical_link, url, image,
 *             summary, content_html, content_text, article_tags, keywords }}
 *   canonical_link is the page's own <link rel=canonical> (or og:url) as
 *   written, or null; url is that resolved, else the fetched address.
 */
function extractPage(html, url) {
  const root = parseHtml(html);
  const m = metas(root);
  const ld = jsonLd(root);
  const block = mainBlock(root);

  const canonicalEl = find(root, (n) => n.name === 'link' && /(^|\s)canonical(\s|$)/i.test(n.attrs.rel || '') && n.attrs.href);
  const canonical_link = (canonicalEl && clean(canonicalEl.attrs.href)) || meta(m, 'og:url') || null;
  const pageUrl = (canonical_link && resolveUrl(canonical_link, url)) || url || '';

  const h1 = find(block, (n) => n.name === 'h1') || find(root, (n) => n.name === 'h1');
  const titleEl = find(root, (n) => n.name === 'title');
  const title = meta(m, 'og:title', 'twitter:title') || ld.headline || clean(textOf(h1)) || clean(textOf(titleEl, { skipChrome: false }));

  const authorEl = find(root, (n) => (n.name === 'a' || n.name === 'link') && /(^|\s)author(\s|$)/i.test(n.attrs.rel || ''))
    || find(root, (n) => /(^|\s)author(\s|$)/i.test(n.attrs.itemprop || '') && n.name !== 'meta');
  const authorFromEl = authorEl ? (authorEl.name === 'link' ? clean(authorEl.attrs.title) : clean(textOf(authorEl))) : '';
  const author = meta(m, 'author', 'article:author', 'dc.creator', 'dcterms.creator', 'parsely-author', 'sailthru.author') || ld.author || authorFromEl;
  const authorValue = /^https?:\/\//i.test(author) ? (ld.author || authorFromEl) : author;

  const timeEl = find(block, (n) => n.name === 'time' && n.attrs.datetime) || find(root, (n) => n.name === 'time' && n.attrs.datetime);
  const date = meta(m, 'article:published_time', 'datepublished', 'date', 'dc.date', 'dcterms.date', 'dc.date.issued', 'parsely-pub-date', 'sailthru.date', 'pubdate', 'publish_date', 'og:published_time')
    || ld.date || (timeEl ? timeEl.attrs.datetime : '');

  const article_tags = unique(metaAll(m, 'article:tag'));
  const keywords = unique([...keywordList(meta(m, 'keywords', 'news_keywords')), ...ld.keywords]);

  const image = resolveUrl(meta(m, 'og:image', 'og:image:url', 'twitter:image'), url) || '';
  const content_html = serializeChildren(block, url).trim() || null;
  const content_text = clean(textOf(block));
  const summary = meta(m, 'description', 'og:description', 'twitter:description') || content_text.slice(0, 400);

  return {
    title,
    author: authorValue,
    date_published: parseDate(date),
    canonical_link,
    url: pageUrl,
    image,
    summary,
    content_html,
    content_text,
    article_tags,
    keywords,
  };
}

module.exports = { extractPage, parseHtml, textOf, mainBlock };

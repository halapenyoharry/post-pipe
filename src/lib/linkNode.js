// Link nodes: an item that is a link and nothing else. Its front matter has
// `link: <url>` (or `external_url`, as JSON Feed items carry) and it has no
// body text. Its card shows its title, an optional subtitle and its blurb
// (`summary` or `blurb`); a tap on the card, its ↗ control, or Enter follows
// the link, and the reader never opens for it. Its page (<id>.html) is a small
// page that sends the visitor on, so a direct URL still works.
//
// Where it opens: graph.links.newTab
//   'external' (default)  a new tab for links off this site, the same tab here
//   'always'              always a new tab
//   'never'               always the same tab
//
// graph.intro: a short text shown under the title pill, for a site's bio
// line. A string is plain text; { text, format: 'markdown' } is markdown,
// rendered when the site is built. Off when empty.
//
// Pure, so it can be tested.

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// The link a piece's front matter names, or ''.
function linkFromFrontMatter(fm) {
  if (!fm || typeof fm !== 'object') return '';
  return str(fm.link) || str(fm.external_url);
}

// Its blurb: summary, else blurb, or ''.
function blurbFromFrontMatter(fm) {
  if (!fm || typeof fm !== 'object') return '';
  return str(fm.summary) || str(fm.blurb);
}

// Whether a text (front matter already stripped) has anything in it.
function hasBodyText(text) {
  return typeof text === 'string' && /\S/.test(text);
}

// A piece is a link node when it names a link and has no body text.
function isLinkContent({ link, body } = {}) {
  return Boolean(str(link)) && !hasBodyText(body);
}

// Whether a feed item (or a graph node made from one) is a link node: kind
// 'link' with a link to follow. The adapters give that kind (a local piece
// with a link and no text; a JSON Feed item with external_url and no
// content).
function isLinkItem(item) {
  if (!item || typeof item !== 'object') return false;
  const it = item.originalItem || item;
  return it.kind === 'link' && Boolean(linkOf(it));
}

// Whether a JSON Feed item is only a link: external_url and no content.
function isLinkFeedItem(it) {
  return Boolean(it && str(it.external_url)) && !hasBodyText(it.content_html) && !hasBodyText(it.content_text);
}

// The link a link item follows, as written (it may be relative), or ''.
function linkOf(item) {
  if (!item || typeof item !== 'object') return '';
  const it = item.originalItem || item;
  return str(it.external_url) || str(it.link);
}

// graph.links.newTab, checked.
function newTabMode(settings) {
  const v = settings && settings.graph && settings.graph.links && settings.graph.links.newTab;
  return v === 'always' || v === 'never' ? v : 'external';
}

// The link resolved against the page it is followed from.
function resolveLink(href, base) {
  try { return new URL(href, base).href; } catch (_) { return href; }
}

// Where a link opens: '_blank' (a new tab) or '_self' (this tab), for the
// page at `base`.
function linkTarget(href, { mode = 'external', base = '' } = {}) {
  if (mode === 'always') return '_blank';
  if (mode === 'never') return '_self';
  let to, here;
  try {
    here = new URL(base);
    to = new URL(href, here);
  } catch (_) {
    return /^[a-z][a-z0-9+.-]*:/i.test(String(href || '')) ? '_blank' : '_self';
  }
  return to.origin === here.origin ? '_self' : '_blank';
}

// Follow a link item's link from the page in `win`: a new tab or this one,
// per graph.links.newTab. Returns { href, target }, or null for an item with
// no link.
function followLink(item, { settings = null, win = typeof window !== 'undefined' ? window : null } = {}) {
  const raw = linkOf(item);
  if (!raw || !win) return null;
  const base = (win.document && win.document.baseURI) || (win.location && win.location.href) || '';
  const href = resolveLink(raw, base);
  const target = linkTarget(raw, { mode: newTabMode(settings || win.SETTINGS), base });
  if (target === '_blank') win.open(href, '_blank', 'noopener');
  else win.location.assign(href);
  return { href, target };
}

const escapeHtml = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// The page for a link node: it sends the visitor straight on, and shows the
// title, the blurb and the link for anyone whose browser does not.
function redirectPage({ title = '', href = '', blurb = '', head = '' } = {}) {
  const t = escapeHtml(title);
  const h = escapeHtml(href);
  return `<!doctype html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">`
    + `<title>${t}</title><meta http-equiv="refresh" content="0; url=${h}"><link rel="canonical" href="${h}">${head ? '\n' + head : ''}</head>`
    + `<body><h1>${t}</h1>${blurb ? `\n<p>${escapeHtml(blurb)}</p>` : ''}\n<p><a href="${h}">${h}</a></p></body></html>\n`;
}

// graph.intro with its format: { text, format } or null when empty.
function introConfig(settings) {
  const v = settings && settings.graph && settings.graph.intro;
  if (typeof v === 'string') return str(v) ? { text: v.trim(), format: 'plain' } : null;
  if (v && typeof v === 'object' && str(v.text)) {
    return { text: v.text.trim(), format: v.format === 'markdown' ? 'markdown' : 'plain' };
  }
  return null;
}

// The intro as HTML. Plain text: escaped, a paragraph per blank-line block.
// Markdown: through `render` (the build's markdown renderer), scripts and
// inline handlers left out.
function introHtml(intro, render) {
  if (!intro) return '';
  if (intro.format === 'markdown' && typeof render === 'function') {
    return String(render(intro.text))
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .trim();
  }
  return intro.text.split(/\n\s*\n/).map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
}

module.exports = {
  linkFromFrontMatter, blurbFromFrontMatter, hasBodyText, isLinkContent, isLinkItem, isLinkFeedItem, linkOf,
  newTabMode, resolveLink, linkTarget, followLink, redirectPage, introConfig, introHtml,
};

// The page head's share and icon tags, from settings.site (all optional).
//
//   site.description         the page's description and og:/twitter: text
//   site.share_image         { src, width, height, alt }: the picture a link
//                            preview shows (iMessage, social sites). src is
//                            relative to the site; it is made absolute with
//                            the base URL, as preview fetchers need.
//   site.icons               { ico, svg, png, apple_touch, png_sizes }:
//                            the files a browser tab and a home screen use,
//                            relative to the site. Without it the head keeps
//                            the one ./favicon.svg link it always had.
//
// Every value is escaped for an attribute, so a description may hold quotes.
'use strict';

function escAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function absolute(base, src) {
  if (/^https?:\/\//i.test(src)) return src;
  const b = String(base || '').replace(/\/+$/, '');
  return `${b}/${String(src).replace(/^\.?\//, '')}`;
}

function shareMeta(site, base) {
  const S = site || {};
  const title = escAttr(S.title);
  const desc = escAttr(S.description);
  const lines = [
    `<meta name="description" content="${desc}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${desc}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${escAttr(base ? String(base).replace(/\/*$/, '/') : '')}">`,
  ];
  const img = S.share_image;
  if (img && img.src) {
    const url = escAttr(absolute(base, img.src));
    lines.push(`<meta property="og:site_name" content="${title}">`);
    lines.push(`<meta property="og:image" content="${url}">`);
    if (img.width) lines.push(`<meta property="og:image:width" content="${escAttr(img.width)}">`);
    if (img.height) lines.push(`<meta property="og:image:height" content="${escAttr(img.height)}">`);
    if (img.alt) lines.push(`<meta property="og:image:alt" content="${escAttr(img.alt)}">`);
    lines.push(`<meta name="twitter:card" content="summary_large_image">`);
    lines.push(`<meta name="twitter:title" content="${title}">`);
    lines.push(`<meta name="twitter:description" content="${desc}">`);
    lines.push(`<meta name="twitter:image" content="${url}">`);
  }
  return lines.join('\n');
}

function iconLinks(site) {
  const I = site && site.icons;
  if (!I) return '<link rel="icon" type="image/svg+xml" href="./favicon.svg">';
  const out = [];
  const rel = (p) => escAttr('./' + String(p).replace(/^\.?\//, ''));
  if (I.ico) out.push(`<link rel="icon" href="${rel(I.ico)}" sizes="48x48">`);
  if (I.svg) out.push(`<link rel="icon" type="image/svg+xml" href="${rel(I.svg)}">`);
  if (I.png) out.push(`<link rel="icon" type="image/png" sizes="${escAttr(I.png_sizes || '192x192')}" href="${rel(I.png)}">`);
  if (I.apple_touch) out.push(`<link rel="apple-touch-icon" href="${rel(I.apple_touch)}">`);
  return out.join('\n');
}

module.exports = { shareMeta, iconLinks, escAttr };

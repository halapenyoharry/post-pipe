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
//                            the one ./favicon.svg link it always had, and
//                            the build puts a favicon.svg beside the page
//                            (faviconPlan, below).
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

// The grey a placeholder icon is drawn in when the site has no accent.
const NEUTRAL_GREY = '#888888';

// A colour that can go in an SVG fill as it is: #rgb, #rgba, #rrggbb or
// #rrggbbaa, rgb()/rgba()/hsl()/hsla(), or a colour name; else null.
function usableColor(v) {
  const c = typeof v === 'string' ? v.trim() : '';
  if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c)) return c;
  if (/^(rgb|rgba|hsl|hsla)\([0-9.,%\s/+-]+\)$/i.test(c)) return c;
  if (/^[a-z]{3,30}$/i.test(c)) return c;
  return null;
}

// The colour a placeholder icon is drawn in: the site's accent
// (settings.accent), else its theme's accent (settings.theme.accent), else a
// neutral grey.
function faviconColor(settings) {
  const S = settings || {};
  return usableColor(S.accent) || usableColor(S.theme && S.theme.accent) || NEUTRAL_GREY;
}

// The placeholder icon: one filled circle in color, on a 32-unit box.
function placeholderFavicon(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="${escAttr(usableColor(color) || NEUTRAL_GREY)}"/></svg>\n`;
}

// What the build does about the tab icon (generate-index.js), so every site
// has one:
//   { action: 'keep' }                     the site sets site.icons: its own
//                                          icons are left untouched
//   { action: 'copy' }                     the site folder has a favicon.svg:
//                                          it is copied beside the page
//   { action: 'placeholder', color, svg }  neither: a placeholder favicon.svg
//                                          is written beside the page
// hasSiteFavicon: whether the site folder holds a favicon.svg.
function faviconPlan(settings, { hasSiteFavicon = false } = {}) {
  const site = (settings && settings.site) || {};
  if (site.icons) return { action: 'keep' };
  if (hasSiteFavicon) return { action: 'copy' };
  const color = faviconColor(settings);
  return { action: 'placeholder', color, svg: placeholderFavicon(color) };
}

module.exports = { shareMeta, iconLinks, escAttr, faviconPlan, faviconColor, placeholderFavicon, NEUTRAL_GREY };

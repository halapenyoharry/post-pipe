// detectFeedColor — best-effort brand color for a feed.
//
// Cascade:
//   1. customColor override from OPML (returned as-is, no detection needed)
//   2. <meta name="theme-color"> on the feed's home_page_url
//   3. Deterministic hash → HSL hue from the feed id (always succeeds), nudged
//      away from colors already taken by other feeds so two feeds never come
//      out the same green.
//
// Step 2 (favicon dominant color) is a future enhancement that requires a
// color-quantization library; we don't add it until theme-color coverage
// proves insufficient.

const { fetchText } = require('./fetchText');

/**
 * @param {Object} feedMeta — { id, title, home_page_url, favicon, icon }
 * @param {string|null} customColor — OPML customColor override, if any
 * @param {string[]} [taken] — colors already assigned to other feeds. Only the
 *        hash fallback avoids them; an explicit customColor or a site's own
 *        theme-color is that feed's real identity and is never moved.
 * @returns {Promise<string>} CSS color string
 */
async function detectFeedColor(feedMeta, customColor, taken = []) {
  const explicit = await detectExplicitFeedColor(feedMeta, customColor);
  return explicit || hashFeedColor(feedMeta, taken);
}

/**
 * The half of the cascade that is a feed's own identity: an author-set OPML
 * override, or the theme-color the site publishes about itself. Returns null
 * when the feed says nothing about its color, leaving the choice to us.
 *
 * Split out from the fallback so a caller can resolve every feed's real color
 * in parallel first, and only then hand out generated hues — which needs to
 * happen one at a time, because each generated hue has to avoid the others.
 */
async function detectExplicitFeedColor(feedMeta, customColor) {
  if (customColor) return customColor;
  if (feedMeta.home_page_url) {
    try {
      const themeColor = await scrapeThemeColor(feedMeta.home_page_url);
      if (themeColor) return normalizeColor(themeColor);
    } catch (_) {
      // home page unreachable; the caller falls back to a generated hue.
    }
  }
  return null;
}

/** The generated half: a stable hue for this feed that avoids `taken`. */
function hashFeedColor(feedMeta, taken = []) {
  return hashHue(feedMeta.id || feedMeta.home_page_url || feedMeta.title || 'feed', taken);
}

// Scrape the page for <meta name="theme-color" content="…"> — the
// explicit brand color sites set for browser chrome and PWAs.
async function scrapeThemeColor(url) {
  const html = await fetchText(url, { timeoutMs: 8000 });
  // Read just the <head>; case-insensitive; allow single or double quotes.
  const head = html.slice(0, 32_768);
  const m = head.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)
        || head.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i);
  return m ? m[1].trim() : null;
}

// Stable hash → HSL. Lightness/saturation chosen so the result is readable
// against dark backgrounds.
//
// Hashing each feed in isolation cannot guarantee the feeds look different from
// each other: three feeds hashing to hues 126, 133 and 145 are all the same
// green to a human eye, which defeats the point of colouring by feed. So the
// hash picks the preferred hue and a separation pass moves it only if it
// crowds a hue that is already taken.
function hashHue(seed, taken = []) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const preferred = Math.abs(h) % 360;
  const takenHues = taken.map(hueOf).filter((x) => x !== null);
  const minSep = Math.min(40, Math.floor(300 / Math.max(1, takenHues.length + 1)));

  if (minDistance(preferred, takenHues) >= minSep) {
    return `hsl(${preferred}, 65%, 58%)`;
  }
  // Crowded. Take the hue furthest from every taken hue, breaking ties toward
  // the hash's preference so the result stays stable for a given feed set.
  let best = preferred;
  let bestScore = -1;
  for (let offset = 0; offset < 360; offset++) {
    const hue = (preferred + offset) % 360;
    const score = minDistance(hue, takenHues);
    if (score > bestScore) {
      bestScore = score;
      best = hue;
    }
  }
  return `hsl(${best}, 65%, 58%)`;
}

// Circular distance between two hues, in degrees (0..180).
function hueDistance(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function minDistance(hue, hues) {
  if (!hues.length) return 180;
  return Math.min(...hues.map((t) => hueDistance(hue, t)));
}

// Best-effort hue extraction from the CSS colors we actually emit or scrape:
// hsl(), #rgb, #rrggbb, rgb(). Anything else (named colors, lab(), gradients)
// returns null and simply does not participate in separation — better to skip
// a constraint than to guess a hue wrong and move a feed for no reason.
function hueOf(color) {
  if (typeof color !== 'string') return null;
  const c = color.trim().toLowerCase();

  const hsl = c.match(/^hsla?\(\s*([-\d.]+)/);
  if (hsl) return ((parseFloat(hsl[1]) % 360) + 360) % 360;

  let r, g, b;
  const hex = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    const v = hex[1];
    const full = v.length === 3 ? v.split('').map((ch) => ch + ch).join('') : v;
    r = parseInt(full.slice(0, 2), 16);
    g = parseInt(full.slice(2, 4), 16);
    b = parseInt(full.slice(4, 6), 16);
  } else {
    const rgb = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (!rgb) return null;
    [r, g, b] = rgb.slice(1, 4).map(Number);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return null; // greyscale has no hue to separate on

  let hue;
  if (max === r)      hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else                hue = (r - g) / delta + 4;
  hue *= 60;
  return (hue + 360) % 360;
}

// Accept '#rrggbb', '#rgb', 'rgb(…)' or any valid CSS color and return as-is.
// (We could normalize to hex, but downstream just shoves it into CSS.)
function normalizeColor(c) {
  return c.trim();
}

module.exports = { detectFeedColor, detectExplicitFeedColor, hashFeedColor, hueOf, hueDistance };

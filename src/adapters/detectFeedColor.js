// detectFeedColor — best-effort brand color for a feed.
//
// Cascade:
//   1. customColor override from OPML (returned as-is, no detection needed)
//   2. <meta name="theme-color"> on the feed's home_page_url
//   3. Deterministic hash → HSL hue from the feed id (always succeeds)
//
// Step 2 (favicon dominant color) is a future enhancement that requires a
// color-quantization library; we don't add it until theme-color coverage
// proves insufficient.

const { fetchText } = require('./fetchText');

/**
 * @param {Object} feedMeta — { id, title, home_page_url, favicon, icon }
 * @param {string|null} customColor — OPML customColor override, if any
 * @returns {Promise<string>} CSS color string
 */
async function detectFeedColor(feedMeta, customColor) {
  if (customColor) return customColor;
  if (feedMeta.home_page_url) {
    try {
      const themeColor = await scrapeThemeColor(feedMeta.home_page_url);
      if (themeColor) return normalizeColor(themeColor);
    } catch (_) {
      // home page unreachable; fall through to hash fallback.
    }
  }
  return hashHue(feedMeta.id || feedMeta.home_page_url || feedMeta.title || 'feed');
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
// against dark backgrounds and visually distinct across small numbers of feeds.
function hashHue(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 65%, 58%)`;
}

// Accept '#rrggbb', '#rgb', 'rgb(…)' or any valid CSS color and return as-is.
// (We could normalize to hex, but downstream just shoves it into CSS.)
function normalizeColor(c) {
  return c.trim();
}

module.exports = { detectFeedColor };

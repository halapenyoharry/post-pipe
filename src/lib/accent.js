// A site's accent colour (settings.accent): one colour for links, the
// reader's and the panel's accent, the bottom bar's active pill and the
// selected state, in every theme. Kept as given where it is legible, and
// otherwise moved toward black (on paper) or white (on graphite) only as far
// as it takes to reach WCAG AA for text (4.5:1) on every background that
// theme and mode draws text on. The tint behind an active control is the
// colour itself at 12%.
//
// Without settings.accent nothing changes: each theme keeps its own accent.

const { contrast, mix, luminance } = require('./timeOfDay');

const AA = 4.5;
const TINT = 0.12;

// The backgrounds accent text sits on: the sketchbook's paper and card in
// each mode (src/themes/sketchbook.css), and the default theme's bg and
// surface (settings.theme).
const SKETCHBOOK = {
  light: ['#f3ecdc', '#fbf7ec'],
  dark: ['#2a2a2e', '#333337'],
};

function parseHex(color) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(color || '').trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return '#' + h.toLowerCase();
}

const worst = (c, bgs) => Math.min(...bgs.map((b) => contrast(c, b)));
const round2 = (x) => Math.round(x * 100) / 100;

// The colour itself when it reaches `target` on every background; else the
// least step (of 1%) toward black or white, whichever the backgrounds are
// farther from, that does.
function legibleAccent(color, backgrounds, target = AA) {
  const base = parseHex(color);
  const bgs = (backgrounds || []).map(parseHex).filter(Boolean);
  if (!base || !bgs.length) return base;
  if (worst(base, bgs) >= target) return base;
  const dark = bgs.reduce((n, b) => n + (luminance(b) < 0.18 ? 1 : 0), 0) > bgs.length / 2;
  const toward = dark ? '#ffffff' : '#000000';
  for (let i = 1; i <= 100; i += 1) {
    const c = mix(base, toward, i / 100);
    if (worst(c, bgs) >= target) return c;
  }
  return toward;
}

// settings.accent with what is derived from it, or null.
//   color            as given
//   bg               the colour at 12% (behind an active control)
//   light, dark      the sketchbook's text accent in each mode
//   plain            the default theme's (on settings.theme bg and surface)
//   ratios           each one's contrast on each of its backgrounds
function accentPalette(settings) {
  const color = parseHex(settings && settings.accent);
  if (!color) return null;
  const theme = (settings && settings.theme) || {};
  const plainBgs = [theme.bg, theme.surface].map(parseHex).filter(Boolean);
  const n = parseInt(color.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const out = {
    color,
    bg: `rgba(${rgb.join(', ')}, ${TINT})`,
    light: legibleAccent(color, SKETCHBOOK.light),
    dark: legibleAccent(color, SKETCHBOOK.dark),
    plain: plainBgs.length ? legibleAccent(color, plainBgs) : color,
  };
  const ratios = (c, bgs) => Object.fromEntries(bgs.map((b) => [b, round2(contrast(c, b))]));
  out.ratios = {
    color: { ...ratios(color, SKETCHBOOK.light), ...ratios(color, SKETCHBOOK.dark), ...ratios(color, plainBgs) },
    light: ratios(out.light, SKETCHBOOK.light),
    dark: ratios(out.dark, SKETCHBOOK.dark),
    plain: ratios(out.plain, plainBgs),
  };
  return out;
}

// The page's CSS for settings.accent, after the themes' own: the default
// theme on :root, the sketchbook in each mode (and on the reader and the
// panel, which keep a light-mode reader's paper over a dark page).
function accentCss(settings) {
  const a = accentPalette(settings);
  if (!a) return '';
  const SK = 'html[data-pp-theme="sketchbook"]';
  return `
  /* settings.accent ${a.color} */
  :root {
    --pp-accent: ${a.color};
    --accent: ${a.plain};
    --gv-accent: ${a.plain};
    --rp-accent: ${a.plain};
    --tts-accent: ${a.plain};
    --pp-panel-accent: ${a.plain};
    --pp-panel-accent-bg: ${a.bg};
  }
  ${SK},
  ${SK}[data-pp-mode="dark"][data-pp-reader-mode="light"] :is([data-reader-panel], [data-settings-panel]) {
    --sk-accent: ${a.light};
    --sk-accent-bg: ${a.bg};
  }
  ${SK}[data-pp-mode="dark"] {
    --sk-accent: ${a.dark};
    --sk-accent-bg: ${a.bg};
  }`;
}

module.exports = { AA, TINT, SKETCHBOOK, parseHex, legibleAccent, accentPalette, accentCss };

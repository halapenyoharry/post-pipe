// The page background follows the time of day of the piece that is selected
// or open, tinted a little by its season. settings.theme.timeOfDay turns it
// on (engine default: off) and can replace any palette.
//
//   theme.timeOfDay: true, or {
//     enabled: true,
//     transitionSeconds: 4,         how slowly the background changes
//     seasonTint: 0.1,              how much of the season's color, 0..1
//     hemisphere: 'north',          which months are summer
//     palettes: { dusk: { dark: [top, bottom], light: [top, bottom] }, ... },
//     seasons: { summer: '#hex', ... },
//     text: { dark: '#hex', light: '#hex' }   the text drawn on the background
//     quiet: { dark: '#hex', light: '#hex' }  quieter lines drawn on it
//   }
//
// Every palette keeps the text on it at WCAG AA (4.5:1) in both modes, with
// every season's tint; test/timeOfDay.test.js holds the defaults to that.

const { TIMES_OF_DAY, sceneMonth } = require('./scene');

const PALETTES = {
  dawn:         { dark: ['#262036', '#38283a'], light: ['#f6e7e1', '#efe3d6'] },
  morning:      { dark: ['#1b2838', '#26323e'], light: ['#f6f0df', '#eef0e4'] },
  midday:       { dark: ['#1d2b38', '#22323a'], light: ['#f8f5e9', '#f1efe3'] },
  afternoon:    { dark: ['#28282e', '#352c22'], light: ['#f6ecd7', '#efe1c8'] },
  dusk:         { dark: ['#2a1e32', '#3a241e'], light: ['#f0dfd6', '#e9d4c3'] },
  evening:      { dark: ['#1a1c32', '#281f34'], light: ['#e7e2e8', '#ded8dd'] },
  night:        { dark: ['#0d1020', '#141a2c'], light: ['#dcdee6', '#d2d5df'] },
  'late-night': { dark: ['#07080f', '#0d0f18'], light: ['#d0d3dc', '#c7cad4'] },
};

const SEASONS = { winter: '#5878b8', spring: '#5f9a5a', summer: '#d8963a', autumn: '#b8602e' };

// The text drawn straight on the background: body text, and the quieter
// lines (the rights line) at the same AA.
const TEXT = { dark: '#a8b2d1', light: '#2b2722' };
const QUIET = { dark: '#a3abc4', light: '#4d463d' };

function config(settings) {
  const raw = settings && settings.theme && settings.theme.timeOfDay;
  if (!raw) return null;
  const c = raw === true ? {} : raw;
  if (c.enabled === false) return null;
  const palettes = { ...PALETTES };
  for (const [k, v] of Object.entries(c.palettes || {})) palettes[k] = { ...(palettes[k] || {}), ...v };
  return {
    transitionSeconds: Number.isFinite(c.transitionSeconds) ? c.transitionSeconds : 4,
    seasonTint: Number.isFinite(c.seasonTint) ? c.seasonTint : 0.1,
    hemisphere: c.hemisphere === 'south' ? 'south' : 'north',
    palettes,
    seasons: { ...SEASONS, ...(c.seasons || {}) },
    text: { ...TEXT, ...(c.text || {}) },
    quiet: { ...QUIET, ...(c.quiet || {}) },
  };
}

function seasonOf(month, hemisphere = 'north') {
  if (!month) return null;
  const north = month <= 2 || month === 12 ? 'winter' : month <= 5 ? 'spring' : month <= 8 ? 'summer' : 'autumn';
  if (hemisphere !== 'south') return north;
  return { winter: 'summer', summer: 'winter', spring: 'autumn', autumn: 'spring' }[north];
}

// ── color ──────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const str = String(hex).trim();
  const m = /^rgba?\(([^)]+)\)/.exec(str);
  if (m) return m[1].split(',').slice(0, 3).map((n) => Number(n.trim()));
  const h = str.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
}
function rgbToHex(rgb) {
  return '#' + rgb.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')).join('');
}
function mix(a, b, t) {
  const x = hexToRgb(a), y = hexToRgb(b);
  return rgbToHex(x.map((n, i) => n + (y[i] - n) * t));
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((n) => {
    const c = n / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Text drawn straight on the page at some opacity (a container's title) has
// to stay legible on every background it can sit on. The smallest opacity at
// or above `opacity` that reaches `target` on all of them; if even full
// opacity does not, the color is moved toward black or white (whichever the
// backgrounds are farther from) until it does. Large text: target 3.
function legibleOn(color, backgrounds, { target = 3, opacity = 0.55 } = {}) {
  const bgs = (backgrounds || []).filter(Boolean).map((b) => rgbToHex(hexToRgb(b)));
  const base = rgbToHex(hexToRgb(color));
  if (!bgs.length) return { color: base, opacity };
  const worst = (c, op) => Math.min(...bgs.map((b) => contrast(mix(b, c, op), b)));
  for (let op = opacity; op <= 1.0001; op += 0.05) {
    if (worst(base, Math.min(op, 1)) >= target) return { color: base, opacity: Math.round(Math.min(op, 1) * 100) / 100 };
  }
  const darkBgs = bgs.reduce((n, b) => n + (luminance(b) < 0.18 ? 1 : 0), 0) > bgs.length / 2;
  const toward = darkBgs ? '#ffffff' : '#000000';
  for (let t = 0.05; t <= 1.0001; t += 0.05) {
    const c = mix(base, toward, Math.min(t, 1));
    if (worst(c, 1) >= target) return { color: c, opacity: 1 };
  }
  return { color: toward, opacity: 1 };
}

// Every background the page can show in a mode: its own, and each time of
// day's palette with each season's tint.
function allBackgrounds(cfg, mode, pageBg) {
  const out = pageBg ? [pageBg] : [];
  if (!cfg) return out;
  for (const time of TIMES_OF_DAY) {
    for (const date of ['', '2030-01-15', '2030-04-15', '2030-07-15', '2030-10-15']) {
      const a = ambienceFor({ scene: { time_of_day: time, date } }, cfg, mode);
      if (a) out.push(a.top, a.bottom);
    }
  }
  return out;
}

// The background for a piece in a mode ('dark' or 'light'), or null when the
// piece has no time of day (the page keeps its own background).
function ambienceFor(item, cfg, mode = 'dark') {
  if (!cfg || !item) return null;
  const scene = item.scene || {};
  const time = TIMES_OF_DAY.includes(scene.time_of_day) ? scene.time_of_day : null;
  if (!time) return null;
  const pal = cfg.palettes[time] && (cfg.palettes[time][mode] || cfg.palettes[time].dark);
  if (!pal) return null;
  const season = seasonOf(sceneMonth(scene.date), cfg.hemisphere);
  const tint = season && cfg.seasons[season] ? (c) => mix(c, cfg.seasons[season], cfg.seasonTint) : (c) => c;
  return { time, season, mode, top: tint(pal[0]), bottom: tint(pal[1]) };
}

module.exports = { config, ambienceFor, seasonOf, contrast, mix, luminance, legibleOn, allBackgrounds, PALETTES, SEASONS, TEXT, QUIET };

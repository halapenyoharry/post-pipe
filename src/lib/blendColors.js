// A colour between colours. A tag node is filled with the feed colours of
// the pieces it joins, blended, each feed weighing as many pieces as it
// brings: a tag shared 3:1 between two feeds leans 3:1 toward the first.
//
// The mix is made in OKLab, where a straight line between two colours passes
// through what the eye reads as their middle, rather than in sRGB, where it
// passes through mud. No library: the two conversions are a few lines each.
//
// Pure, so it can be tested without the DOM.

// '#rgb', '#rrggbb', '#rrggbbaa', 'rgb(…)', 'rgba(…)', 'hsl(…)', 'hsla(…)'
// to [r, g, b] in 0..1; anything else (a named colour, a var(), nothing)
// to null, so the caller can fall back rather than guess.
function parseColor(str) {
  if (typeof str !== 'string') return null;
  const s = str.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (m) {
    let hex = m[1];
    if (hex.length <= 4) hex = hex.split('').map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  }
  m = s.match(/^rgba?\(\s*([^,\s/]+)\s*[,\s]\s*([^,\s/]+)\s*[,\s]\s*([^,\s/)]+)/);
  if (m) {
    const ch = (v) => (v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v) / 255);
    const rgb = [ch(m[1]), ch(m[2]), ch(m[3])];
    return rgb.every(Number.isFinite) ? rgb.map(clamp01) : null;
  }
  m = s.match(/^hsla?\(\s*([^,\s/]+)\s*[,\s]\s*([^,\s/]+)%?\s*[,\s]\s*([^,\s/)]+)%?/);
  if (m) {
    const h = parseFloat(m[1]);
    const sat = parseFloat(m[2]) / 100;
    const light = parseFloat(m[3]) / 100;
    if (![h, sat, light].every(Number.isFinite)) return null;
    return hslToRgb(((h % 360) + 360) % 360, clamp01(sat), clamp01(light));
  }
  return null;
}

function clamp01(v) { return Math.min(1, Math.max(0, v)); }

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
}

// sRGB <-> OKLab (Björn Ottosson's matrices).
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function rgbToOklab([r, g, b]) {
  const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

function oklabToRgb([L, a, b]) {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * b, 3);
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ].map((c) => clamp01(fromLinear(clamp01(c))));
}

function toHex(rgb) {
  return '#' + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
}

// parts: [{ color, weight }]. A part whose colour cannot be read takes the
// fallback colour at its weight, so a tag mostly on pieces without a feed
// colour stays mostly the tag colour. Returns '#rrggbb', or null when
// nothing could be read at all.
function blendColors(parts, fallback) {
  const fb = parseColor(fallback);
  let L = 0, A = 0, B = 0, total = 0;
  for (const part of parts || []) {
    const w = part && Number.isFinite(part.weight) ? part.weight : 1;
    if (w <= 0) continue;
    const rgb = parseColor(part && part.color) || fb;
    if (!rgb) continue;
    const [l, a, b] = rgbToOklab(rgb);
    L += l * w; A += a * w; B += b * w; total += w;
  }
  if (!total) return null;
  return toHex(oklabToRgb([L / total, A / total, B / total]));
}

module.exports = { blendColors, parseColor, rgbToOklab, oklabToRgb, toHex };

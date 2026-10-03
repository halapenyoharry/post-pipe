// A chapter card's title and the line under it ("chapter one"), each as
// large as fits the card (graph.card.fit). Pure: the caller says how wide a
// text is at a size, in the face it is drawn in.
//
// The title is wrapped at word breaks over at most maxLines lines (a word is
// never broken); the line under it stays on one line. The title is set as
// large as it can be with the line under it as large as it can be on one
// line, but never larger than the title, the two stacked (lineHeight each,
// gap between) within the card's inner box.

// Words into lines no wider than maxW at this size, as many on a line as go;
// null when a word alone is wider.
function wrapWords(words, size, maxW, measure) {
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (measure(w, size) > maxW) return null;
    const next = cur ? `${cur} ${w}` : w;
    if (!cur || measure(next, size) <= maxW) cur = next;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// { title, subtitle, width, height } the card's inner box in px; measure:
// (text, size, which) -> px, which 'title' or 'subtitle'. Returns {
// titleSize, lines, subtitleSize }.
function fitCard({ title, subtitle = '', width, height, measure, maxLines = 3, lineHeight = 1.05, gap = 3, min = 4, max = 400, precision = 0.1 }) {
  const words = String(title || '').trim().split(/\s+/).filter(Boolean);
  const sub = String(subtitle || '').trim();
  const W = Math.max(1, width), H = Math.max(1, height);
  const tm = (t, f) => measure(t, f, 'title');
  // The line under the title: as large as goes on one line.
  const subUnit = sub ? measure(sub, 1, 'subtitle') : 0;
  const subMax = sub && subUnit > 0 ? W / subUnit : 0;
  const layout = (f) => {
    const lines = words.length ? wrapWords(words, f, W, tm) : [];
    if (!lines || lines.length > maxLines) return null;
    const fs = sub ? Math.min(subMax, f) : 0;
    const h = lines.length * lineHeight * f + (sub ? gap + lineHeight * fs : 0);
    return h <= H ? { titleSize: f, lines, subtitleSize: fs } : null;
  };
  let lo = min, hi = max;
  let best = layout(lo);
  if (!best) {
    const lines = wrapWords(words, min, Infinity, tm) || [words.join(' ')];
    return { titleSize: min, lines, subtitleSize: sub ? Math.min(subMax, min) : 0 };
  }
  const top = layout(hi);
  if (top) return top;
  while (hi - lo > precision) {
    const mid = (lo + hi) / 2;
    const r = layout(mid);
    if (r) { lo = mid; best = r; } else hi = mid;
  }
  return best;
}

module.exports = { fitCard, wrapWords };

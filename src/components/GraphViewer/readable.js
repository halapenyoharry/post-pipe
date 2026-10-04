// node.readable and node.zoomToReadable (src/lib/actions.js): how large a
// card's title renders on the screen, the zoom at which it renders
// graph.readablePx, and the pan that keeps the card under the finger when
// that zoom would take it off the screen. Pure, so it can be tested.

// graph.readablePx: the title size, in CSS px, at which a card is readable
// (default 16).
function readablePxOf(graphSettings) {
  const v = Number(graphSettings && graphSettings.readablePx);
  return Number.isFinite(v) && v > 0 ? v : 16;
}

// A title fontPx CSS px in its card, the card drawn at zoom k and at its own
// scale (a spiral's cardScale): its size on the screen. 0 when there is no
// title (a card far out is a marker and draws none).
function titleScreenPx(fontPx, k, cardScale = 1) {
  if (!(fontPx > 0) || !(k > 0)) return 0;
  return fontPx * k * (cardScale > 0 ? cardScale : 1);
}

// The zoom, from k, at which a title nowPx on the screen renders want px or
// a hair more: never less than k (it only zooms in), never more than kMax.
function readableZoom(k, nowPx, want, kMax = Infinity) {
  if (!(k > 0) || !(nowPx > 0) || !(want > 0)) return k;
  return Math.min(kMax, Math.max(k, k * (want / nowPx) * (1 + 1e-6)));
}

// After a zoom, the pan that keeps a card under the finger when the card
// would not lie wholly inside the area; { x: 0, y: 0 } when it would.
// before, after: the card's centre on the screen before and after the zoom
// (without a pan); ratio: how many times larger it is drawn after; half:
// its half width and height on the screen after; finger: where the finger
// was. The point of the card that was under the finger is put back under it.
function keepUnderFinger({ finger, before, after, ratio, half, area }) {
  const inside = after.x - half.w >= area.x0 && after.x + half.w <= area.x1
    && after.y - half.h >= area.y0 && after.y + half.h <= area.y1;
  if (inside || !finger || !before) return { x: 0, y: 0 };
  const r = ratio > 0 ? ratio : 1;
  return {
    x: finger.x - (after.x + (finger.x - before.x) * r),
    y: finger.y - (after.y + (finger.y - before.y) * r),
  };
}

module.exports = { readablePxOf, titleScreenPx, readableZoom, keepUnderFinger };

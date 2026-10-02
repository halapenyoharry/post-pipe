// The first frame's scale (settings.graph.initialScale). A site can ask that
// the first screen shows its cards as cards: { minCardWidthPx }, the least
// width in CSS px a card is drawn at there. The first frame is then zoomed
// in at least that far; if the container it frames no longer fits, the frame
// is the container's top (for a hanging container, its anchor), and the rest
// runs off the bottom, for the reader to scroll and drag to. Pure, so it can
// be tested.

// The scale at which a card cardWidth wide is minCardWidthPx on screen; 0
// when no minimum is set.
function minCardScale(initialScale, cardWidth) {
  const px = Number(initialScale && initialScale.minCardWidthPx);
  if (!Number.isFinite(px) || px <= 0 || !(cardWidth > 0)) return 0;
  return px / cardWidth;
}

// The scale the graph state rests at with anchors (the home view): the
// site's initialFocusMinScale, or larger when cards would be smaller than the
// minimum there.
function homeScale(minScale, initialScale, cardWidth) {
  return Math.max(minScale, minCardScale(initialScale, cardWidth));
}

module.exports = { minCardScale, homeScale };

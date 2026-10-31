// The graph's zoom-aware level of detail, and the size a card is drawn at.
// Two levels: 'title' below LOD_TITLE, 'full' at it and above. At every zoom
// a card is drawn as a card with its title, the same size in the graph, so it
// scales with the zoom like the tagz and the rest of the graph do; zoomed far
// out it is a small card, never something else. The card repaints only when
// the zoom crosses LOD_TITLE. Pure, so it can be tested.

const LOD_TITLE = 0.6;

function getLOD(scale) {
  return scale < LOD_TITLE ? 'title' : 'full';
}

// The size a card is drawn at in its state, from graph.card (CARD, merged
// with its defaults): open (pinned), under the pointer (hovered), or at
// rest. The zoom does not change it.
function makeCardSizeFor(CARD) {
  return function cardSizeFor({ hovered, pinned } = {}) {
    if (pinned) return { width: CARD.pinnedWidth, height: CARD.pinnedHeight };
    if (hovered) return { width: CARD.hoverWidth, height: CARD.hoverHeight };
    return { width: CARD.width, height: CARD.height };
  };
}

module.exports = { LOD_TITLE, getLOD, makeCardSizeFor };

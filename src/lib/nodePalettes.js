// graph.nodePalettes: colours a reader can choose for the nodes, in the main
// view's panel ("node colour", when there are two or more). Each is
// { id, label, color, fillOpacity, labelColor }: the containers (closed and
// open: their outline, their fill at fillOpacity, their labels in
// labelColor, else color) and the outlines of the cards inside them take
// it; the cards' text does not. The first is the one used until a reader
// chooses (viewState preference nodePalette); Forget goes back to it. Pure,
// so it can be tested.

const str = (v) => (typeof v === 'string' && v.trim() && !/[;{}<>]/.test(v) ? v.trim() : '');

function nodePalettesOf(graphSettings) {
  const list = graphSettings && Array.isArray(graphSettings.nodePalettes) ? graphSettings.nodePalettes : [];
  const seen = new Set();
  const out = [];
  for (const p of list) {
    if (!p || typeof p !== 'object') continue;
    const id = str(p.id), color = str(p.color);
    if (!id || !color || seen.has(id)) continue;
    seen.add(id);
    const op = Number(p.fillOpacity);
    out.push({
      id,
      label: str(p.label) || id,
      color,
      fillOpacity: p.fillOpacity !== null && p.fillOpacity !== '' && Number.isFinite(op) ? Math.max(0, Math.min(1, op)) : null,
      labelColor: str(p.labelColor),
    });
  }
  return out;
}

// The palette in use: the one chosen (by id), else the first; null when the
// site has none.
function nodePaletteFor(graphSettings, chosen) {
  const list = nodePalettesOf(graphSettings);
  if (!list.length) return null;
  return list.find((p) => p.id === chosen) || list[0];
}

module.exports = { nodePalettesOf, nodePaletteFor };

// A container's look, open and closed alike. Pure, so it can be tested.
//
// A container's own look (settings.containers.<id>: fill, fillOpacity,
// stroke, labelFace, labelColor; generate-index carries them as look) is
// drawn on its closed node and on its open hull alike, and its label (the
// closed node's and the open hull's title) in that face and colour. Without
// one, each keeps the engine's own: the closed node a soft fill mixed from
// the container's colour with an outline and a glow in it, the open hull the
// containment entry's fill and stroke, the open title in the container's
// colour (its contrast kept by the renderer).
//
// A node palette the reader chose (graph.nodePalettes, nodePalettes.js)
// colours every container over its own look: outline and fill in its
// colour, the fill at its fillOpacity, the labels in its labelColor (else
// its colour); the face stays the container's own.
//
//   containerLook(c, palette) -> {
//     closed: { fill, fillOpacity, stroke, glow },   fillOpacity null: as given;
//                                                     stroke 'none': no outline
//                                                     and no glow (glow null)
//     open:   { fill, fillOpacity, stroke },
//     label:  { face, color },                       face a font-family list, or
//                                                     null; color null: the engine's
//   }

const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : '');
const opacityOf = (v) => (v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v))
  ? Math.max(0, Math.min(1, Number(v))) : null);

// The container's own colour: its badge, else its colour, else its stroke.
function containerColor(c) {
  return (c && (c.badgeColor || c.color || c.stroke)) || '#d4af37';
}

// A face as a font-family list, the face first and a plain fallback after.
function faceFamily(face) {
  const f = str(face).replace(/'/g, '');
  return f ? `'${f}', sans-serif` : null;
}

function containerLook(c, palette) {
  const own = (c && c.look && typeof c.look === 'object') ? c.look : {};
  const pal = palette && str(palette.color) ? palette : null;
  const base = containerColor(c);
  const fill = pal ? str(pal.color) : str(own.fill);
  const stroke = pal ? str(pal.color) : str(own.stroke);
  const fillOpacity = fill ? opacityOf(pal ? pal.fillOpacity : own.fillOpacity) : null;
  const closedStroke = stroke || base;
  return {
    closed: {
      fill: fill || `color-mix(in srgb, ${base} 16%, var(--pp-macro-base, #151826))`,
      fillOpacity,
      stroke: closedStroke,
      glow: closedStroke === 'none' ? null : closedStroke,
    },
    open: {
      fill: fill || (c && c.fill) || 'rgba(212, 175, 55, 0.03)',
      fillOpacity,
      stroke: stroke || (c && c.stroke) || 'rgba(212, 175, 55, 0.45)',
    },
    label: {
      face: faceFamily(own.labelFace),
      color: (pal ? str(pal.labelColor) || str(pal.color) : str(own.labelColor)) || null,
    },
  };
}

// settings.containers.<id> to the look generate-index carries on the feed's
// container: the fields it names that are set, or null for none.
function lookFromSettings(extra) {
  const e = extra && typeof extra === 'object' ? extra : {};
  const out = {};
  if (str(e.fill)) out.fill = str(e.fill);
  const op = opacityOf(e.fillOpacity);
  if (op !== null) out.fillOpacity = op;
  if (str(e.stroke)) out.stroke = str(e.stroke);
  if (str(e.labelFace)) out.labelFace = str(e.labelFace);
  if (str(e.labelColor)) out.labelColor = str(e.labelColor);
  return Object.keys(out).length ? out : null;
}

module.exports = { containerLook, containerColor, faceFamily, lookFromSettings };

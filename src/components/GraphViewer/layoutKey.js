// Where the positions a layout gave its nodes are filed. A node's place
// depends on the layout (a ring is not a cluster) and on the settings that
// shape it: the spiral's mode, spacing, start radius and direction, the card
// size it spaces by, the force simulation, and graph.layoutVersion, which a
// site bumps to retire saved positions on purpose, and the containers'
// anchors (where a site rests them on its cover's art). So the key is the layout's
// name plus a short signature of those settings. When any of them changes,
// positions saved under the old key are no longer read (they stay in storage
// until Forget clears them), and the layout places the nodes afresh.
//
// The key never contains '::', which separates it from the item id.

const SPIRAL_KEYS = ['enabled', 'mode', 'spacing', 'startRadius', 'direction', 'strength'];
const SIM_KEYS = ['linkDistance', 'chargeStrength', 'collidePadding'];

function pick(obj, keys) {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null) out[k] = obj[k];
  return out;
}

// Anchors as { id: { x, y } }, in id order; none, nothing (so a site
// without anchors keeps the keys it had).
function anchorPart(anchors) {
  if (!anchors || typeof anchors !== 'object') return null;
  const ids = Object.keys(anchors).filter((id) => anchors[id] && Number.isFinite(Number(anchors[id].x)) && Number.isFinite(Number(anchors[id].y))).sort();
  if (!ids.length) return null;
  return ids.map((id) => [id, Number(anchors[id].x), Number(anchors[id].y)]);
}

// The settings that move nodes, in a fixed order.
function layoutSignature(graphSettings, { anchors } = {}) {
  const g = graphSettings || {};
  const v = Number.isFinite(Number(g.layoutVersion)) && g.layoutVersion !== null && g.layoutVersion !== '' ? Number(g.layoutVersion) : 1;
  const card = g.card || {};
  const sig = {
    v,
    spiral: pick(g.spiral, SPIRAL_KEYS),
    card: pick(card, ['width', 'height']),
    sim: pick(g.simulation, SIM_KEYS),
  };
  const a = anchorPart(anchors);
  if (a) sig.anchors = a;
  return JSON.stringify(sig);
}

// A short stable hash (FNV-1a, 32 bit) in base 36.
function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

// 'force' + the signature, e.g. 'force@1k3x9z'.
function layoutKey(layout, graphSettings, extra) {
  return `${layout}@${hash(layoutSignature(graphSettings, extra))}`;
}

module.exports = { layoutKey, layoutSignature };

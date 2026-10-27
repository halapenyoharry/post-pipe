// A tag's network: the tags the stone relates to it (feed edges of the SKOS
// layers, src/corpus/relationEdges.js), drawn from a selected tag node to its
// relatives while it is selected (src/components/GraphViewer). The edges are
// kept aside from the graph's links: they never reach the link force, so
// selecting a tag moves nothing, and an edge whose tags are not drawn is
// simply never drawn.
//
// The strongest relatives first, by weight; without a weight a relation
// comes after every weighted one, and ties go by the relative's id. Nothing
// else orders them: where a tag came from is an attribute, never a rank.
//
// Pure, so it can be tested without the DOM.

// The layers a relation edge can be on. narrower and narrowMatch are the same
// assertions read the other way; the stone does not write them.
const RELATION_LAYERS = ['broader', 'broadMatch', 'related', 'relatedMatch', 'closeMatch', 'exactMatch'];
const LAYER_SET = new Set(RELATION_LAYERS);
// broader and broadMatch run from the narrower tag to the broader one.
const DIRECTED = new Set(['broader', 'broadMatch']);

// How many relatives show before the reader asks for all of them.
const STRONGEST = 5;

const isTagId = (v) => typeof v === 'string' && v.startsWith('tag:');

// A feed edge between two tags on one of the relation layers.
function isRelationEdge(edge) {
  return Boolean(edge && LAYER_SET.has(edge.layer) && isTagId(edge.source) && isTagId(edge.target) && edge.source !== edge.target);
}

const weightOf = (r) => {
  const w = r && r.attrs ? Number(r.attrs.weight) : NaN;
  return Number.isFinite(w) ? w : null;
};

// The relatives of tagId:
//   { relatives: [{ id, weight, relations, broader }], total, more }
// relations are the edges joining the two (relations: the feed's relation
// edges, each { source, target, layer, directed, attrs }); weight the
// strongest of them, or null; broader the id of the end a directed relation
// points at (source narrower, target broader), or null for none. visible(id)
// says whether a relative is drawn; one that is not is left out before any
// counting. limit: how many to return (STRONGEST by default; Infinity for
// all). total counts every visible relative, more those beyond the limit.
function relativesOf(relations, tagId, { visible, limit = STRONGEST } = {}) {
  const byRelative = new Map();
  if (!tagId) return { relatives: [], total: 0, more: 0 };
  for (const r of relations || []) {
    if (!r || !LAYER_SET.has(r.layer)) continue;
    const s = typeof r.source === 'object' && r.source ? r.source.id : r.source;
    const t = typeof r.target === 'object' && r.target ? r.target.id : r.target;
    if (s === t) continue;
    const other = s === tagId ? t : (t === tagId ? s : null);
    if (other === null || other === undefined) continue;
    if (typeof visible === 'function' && !visible(other)) continue;
    if (!byRelative.has(other)) byRelative.set(other, { id: other, weight: null, relations: [], broader: null });
    const entry = byRelative.get(other);
    entry.relations.push(r);
    const w = weightOf(r);
    if (w !== null && (entry.weight === null || w > entry.weight)) entry.weight = w;
    if (entry.broader === null && (r.directed || DIRECTED.has(r.layer))) entry.broader = t;
  }
  const all = [...byRelative.values()].sort((a, b) => {
    if (a.weight !== b.weight) {
      if (a.weight === null) return 1;
      if (b.weight === null) return -1;
      return b.weight - a.weight;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  for (const e of all) {
    e.relations.sort((x, y) => {
      const wx = weightOf(x); const wy = weightOf(y);
      if (wx === wy) return 0;
      if (wx === null) return 1;
      if (wy === null) return -1;
      return wy - wx;
    });
  }
  const n = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : all.length;
  const relatives = all.slice(0, n);
  return { relatives, total: all.length, more: all.length - relatives.length };
}

// A line of text broken at spaces into lines of at most width characters; a
// word longer than that keeps a line of its own.
function wrapText(text, width = 48) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (!line) line = w;
    else if (line.length + 1 + w.length <= width) line += ' ' + w;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

// What the line between two related tags says when hovered or tapped: for
// each relation joining them, its type and weight, then its why. One string,
// its lines joined by '\n'.
function relationLabel(relations, { width = 48 } = {}) {
  const lines = [];
  for (const r of relations || []) {
    if (!r) continue;
    const w = weightOf(r);
    lines.push(w === null ? String(r.layer) : `${r.layer} · weight ${w}`);
    const why = r.attrs && typeof r.attrs.why === 'string' ? r.attrs.why : '';
    if (why) lines.push(...wrapText(why, width));
  }
  return lines.join('\n');
}

module.exports = { RELATION_LAYERS, STRONGEST, isRelationEdge, relativesOf, relationLabel, wrapText };

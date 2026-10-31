// A tag's network: the tags rosetta-tagz relates to it (feed edges of the SKOS
// layers, src/corpus/relationEdges.js), drawn from a selected tag node to its
// relatives while it is selected (src/components/GraphViewer). The edges are
// kept aside from the graph's links: they never reach the link force, so
// selecting a tag moves nothing, and an edge whose tags are not drawn is
// simply never drawn. While the depth chosen folds tags into other tags'
// bubbles, a line runs between bubbles (drawnRelativesOf): from the bubble
// showing the selected tag to the bubble showing each relative, one line to
// a bubble however many relatives it stands for, or none to a folded
// relative when the panel says so (the preference foldedRelatives).
//
// The strongest relatives first, by weight; without a weight a relation
// comes after every weighted one, and ties go by the relative's id. Nothing
// else orders them: where a tag came from is an attribute, never a rank.
//
// Pure, so it can be tested without the DOM.

// The layers a relation edge can be on. narrower and narrowMatch are the same
// assertions read the other way; rosetta-tagz does not write them.
const RELATION_LAYERS = ['broader', 'broadMatch', 'related', 'relatedMatch', 'closeMatch', 'exactMatch'];
const LAYER_SET = new Set(RELATION_LAYERS);
// broader and broadMatch run from the narrower tag to the broader one.
const DIRECTED = new Set(['broader', 'broadMatch']);

// How many relatives show before the reader asks for all of them.
const STRONGEST = 5;

// The panel's choice for a relative folded into another tag's bubble at the
// depth chosen (the viewState preference 'foldedRelatives', null for the
// default): 'bubble' draws its line to the bubble that shows it, 'omit'
// leaves it out, as the graph did before the choice existed.
const FOLDED_PREF = 'foldedRelatives';
const FOLDED_CHOICES = ['bubble', 'omit'];
const foldedChoice = (value) => (value === 'omit' ? 'omit' : 'bubble');

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

// Strongest first; without a weight after every weighted one; ties keep
// their order.
const byWeight = (a, b) => {
  if (a.weight === b.weight) return 0;
  if (a.weight === null) return 1;
  if (b.weight === null) return -1;
  return b.weight - a.weight;
};

// The relatives of tagId as the graph draws them while tags are folded into
// other tags' bubbles at the depth chosen (_groupedInto in
// src/components/GraphViewer): { from, relatives, total, more }.
//   bubbleOf(id): the id of the bubble that shows tag id, the tag it is
//                 folded into; id itself, or nothing, when it shows its own.
//                 Without it every tag shows its own bubble, and the
//                 relatives are relativesOf's.
//   folded:       'bubble' (the default): a relative folded into another
//                 tag's bubble draws its line to that bubble; 'omit': it
//                 draws none and is not counted.
//   visible(id):  whether a bubble is drawn; a relative whose bubble is not
//                 is left out before any counting.
//   present(id):  whether a tag itself shows, wherever it is drawn (the
//                 panel's source coherence ratio can hide a tag folded into
//                 a bubble that still shows); a relative that does not is
//                 left out before it is folded or counted, and a tagId that
//                 does not has no relatives. Without it every tag does.
//   limit:        as relativesOf, counted in bubbles.
// from is the bubble the lines start at: tagId's own, or the one it is
// folded into. A relative in that same bubble draws nothing. Each relative
// is a bubble, { id, weight, relations, broader } as relativesOf has it,
// with broader read as a bubble (from, or the relative's id). A bubble that
// relatives folded into it reach also has members: the relatives it stands
// for (the bubble's own tag among them when it is one), each as relativesOf
// has it, the strongest first. Its weight is then the strongest member's,
// its relations every member's, strongest first, and broader the bubble the
// members' directed relations point at, or null when none is directed or
// they point both ways. The bubbles go strongest first, ties by id.
function drawnRelativesOf(relations, tagId, { visible, present, limit = STRONGEST, bubbleOf, folded = 'bubble' } = {}) {
  const isPresent = (id) => typeof present !== 'function' || Boolean(present(id));
  if (!tagId || !isPresent(tagId)) return { from: null, relatives: [], total: 0, more: 0 };
  const bubble = (id) => {
    const b = typeof bubbleOf === 'function' ? bubbleOf(id) : null;
    return typeof b === 'string' && b ? b : id;
  };
  const from = bubble(tagId);
  const omit = foldedChoice(folded) === 'omit';
  // The broader end of a directed relation, read as a bubble.
  const bubbleEnd = (end, relBubble) => (end === null ? null : (end === tagId ? from : relBubble));
  const byBubble = new Map();
  for (const r of relativesOf(relations, tagId, { limit: Infinity }).relatives) {
    if (!isPresent(r.id)) continue;
    const b = bubble(r.id);
    if (b === from) continue;
    if (b !== r.id && omit) continue;
    if (typeof visible === 'function' && !visible(b)) continue;
    if (!byBubble.has(b)) byBubble.set(b, []);
    byBubble.get(b).push(r);
  }
  const all = [];
  for (const [b, members] of byBubble) {
    if (members.length === 1 && members[0].id === b) {
      // A relative in its own bubble is relativesOf's, its broader end moved
      // to from only when tagId is folded into another bubble.
      const r = members[0];
      const end = bubbleEnd(r.broader, b);
      all.push(end === r.broader ? r : { ...r, broader: end });
      continue;
    }
    // relativesOf gave them strongest first, ties by id.
    const ends = new Set(members.map((m) => bubbleEnd(m.broader, b)).filter((e) => e !== null));
    all.push({
      id: b,
      weight: members[0].weight,
      relations: members.flatMap((m) => m.relations).map((r) => ({ r, weight: weightOf(r) })).sort(byWeight).map((x) => x.r),
      broader: ends.size === 1 ? [...ends][0] : null,
      members,
    });
  }
  all.sort((a, b) => byWeight(a, b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const n = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : all.length;
  const shown = all.slice(0, n);
  return { from, relatives: shown, total: all.length, more: all.length - shown.length };
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

// A tag's name, from its node id ('tag:<name>').
const tagName = (id) => (isTagId(id) ? id.slice(4) : String(id));

// What the line to one of drawnRelativesOf's relatives says when hovered or
// tapped: relationLabel's lines for a relative in its own bubble; for a
// bubble standing for relatives folded into it (members), each member's
// relations, the strongest member first, each relation's line led by the
// member's name ('name · type · weight w'), then its why. nameOf(id) names a
// member (the part of its id after 'tag:' by default).
function relativeLabel(relative, { width = 48, nameOf = tagName } = {}) {
  if (!relative) return '';
  if (!Array.isArray(relative.members)) return relationLabel(relative.relations, { width });
  const lines = [];
  for (const m of relative.members) {
    if (!m) continue;
    const name = nameOf(m.id);
    for (const r of m.relations || []) {
      if (!r) continue;
      const w = weightOf(r);
      lines.push(...wrapText(`${name} · ${w === null ? r.layer : `${r.layer} · weight ${w}`}`, width));
      const why = r.attrs && typeof r.attrs.why === 'string' ? r.attrs.why : '';
      if (why) lines.push(...wrapText(why, width));
    }
  }
  return lines.join('\n');
}

module.exports = {
  RELATION_LAYERS, STRONGEST, FOLDED_PREF, FOLDED_CHOICES, foldedChoice,
  isRelationEdge, relativesOf, drawnRelativesOf, relationLabel, relativeLabel, wrapText,
};

// ─── Relation edges ──────────────────────────────────────────────────────────
// Tag-to-tag edges from the stone's SKOS relations (feed._stone.relationList,
// written by lib/stone.js applyUniverse). A relation between two concepts
// becomes an edge between the two tag nodes that stand for them, so the graph
// can say that two tags are related, or that one is broader than the other,
// with no piece between them.
//
// Same GraphLink shape as buildEdges (source/target/directed/role/layer/attrs).
// `layer` and `role` are both the SKOS name of the relation, so each type is
// its own toggle in the viewer:
//   directed    broader, broadMatch: source is the narrower tag, target the
//               broader, so the arrow points at the broader concept
//   undirected  related, closeMatch, relatedMatch, exactMatch: once per
//               unordered pair
// narrower and narrowMatch are the same assertions read the other way and the
// stone does not write them; a relation of any other type is left alone.
//
// Direction follows how the stone writes the pair, and the stone writes both
// directed types the same way: `broader {a, b}` says a is broader than b
// (rosetta-tagz docs/FORMATS.md, "for broader, a ⊃ b"), and a `broadMatch`
// between two of its own concepts is a cross-scheme `broader` renamed with the
// pair kept (its lib/stone.js: "broadMatch {a,b} means b skos:broadMatch a"),
// so a is the broader there too. Either way the edge runs b → a and the arrow
// lands on the broader concept (docs/STONE-SEAM.md pins this). attrs keep the
// pair as written: concept is a's id, target is b's id, then weight, why and
// the PROV fields where the stone gave them.
//
// An endpoint is `tag:<label>`, the string the items' tag edges use (the
// concept's site prefLabel, which is item.tags as the stone rewrote it). A
// concept that is a tag on no joined item has no tag node and gets no edge.
// A container tag (settings.containment[].tag) is intercepted by containment
// in buildEdges and has no tag node either, so it gets none. A relation to an
// external vocabulary's concept is a mapping on its concept
// (_stone.concepts[].mappings), not an edge: its target is no tag here.
//
// No stone, or a stone with no relations → [].

const DIRECTED = new Set(['broader', 'broadMatch']);
const UNDIRECTED = new Set(['related', 'closeMatch', 'relatedMatch', 'exactMatch']);

// The tag label each concept is drawn under: the first item tag whose tag
// reference names the concept, skipping container tags, the same walk
// buildEdges makes when it emits a tag edge.
function tagLabelByConcept(items, options = {}) {
  const containerTags = new Set(
    (options.containment || []).map((c) => (c && c.tag !== undefined ? c.tag : null)).filter((t) => t !== null)
  );
  const labelOf = new Map();
  for (const item of items || []) {
    const refs = Array.isArray(item && item._references) ? item._references : null;
    if (!refs) continue;
    for (const tag of item.tags || []) {
      if (containerTags.has(tag)) continue;
      const ref = refs.find((r) => r && r.type === 'tag' && r.value === tag);
      if (!ref || ref.concept === undefined || ref.concept === null) continue;
      if (!labelOf.has(ref.concept)) labelOf.set(ref.concept, tag);
    }
  }
  return labelOf;
}

function relationEdges(stone, items, options = {}) {
  if (!stone || typeof stone !== 'object') return [];
  const relations = Array.isArray(stone.relationList) ? stone.relationList : [];
  if (!relations.length) return [];

  const labelOf = tagLabelByConcept(items, options);
  const edges = [];
  const seen = new Set();

  for (const r of relations) {
    if (!r || typeof r.type !== 'string') continue;
    const directed = DIRECTED.has(r.type);
    if (!directed && !UNDIRECTED.has(r.type)) continue;
    if (typeof r.a !== 'string' || typeof r.b !== 'string' || r.a === r.b) continue;
    const labelA = labelOf.get(r.a);
    const labelB = labelOf.get(r.b);
    if (labelA === undefined || labelB === undefined || labelA === labelB) continue;

    // broader and broadMatch {a, b}: a ⊃ b, drawn b → a. Undirected: a → b as
    // written, one edge per unordered pair; the first entry for a pair wins,
    // whatever a later one weighs.
    let source = labelA;
    let target = labelB;
    if (directed) { source = labelB; target = labelA; }
    const key = directed
      ? `${r.type}\u0000${source}\u0000${target}`
      : `${r.type}\u0000${source < target ? source : target}\u0000${source < target ? target : source}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const attrs = { concept: r.a, target: r.b };
    if (typeof r.weight === 'number' && Number.isFinite(r.weight)) attrs.weight = r.weight;
    if (typeof r.why === 'string' && r.why) attrs.why = r.why;
    if (r.wasDerivedFrom !== undefined && r.wasDerivedFrom !== null) attrs.wasDerivedFrom = r.wasDerivedFrom;
    if (r.wasGeneratedBy !== undefined && r.wasGeneratedBy !== null) attrs.wasGeneratedBy = r.wasGeneratedBy;

    edges.push({
      source: `tag:${source}`,
      target: `tag:${target}`,
      directed,
      role: r.type,
      layer: r.type,
      attrs,
    });
  }
  return edges;
}

module.exports = { relationEdges };

// tagReferences.js — an item's tag references, in one shape for both sides.
//
// The item's references of type 'tag' whose value is a non-empty string, in
// the order the item carries them, as they are (not copied). rosetta-tagz
// writes one per entry of item.tags, with concept, weight, origin, why and
// the PROV pair where it has them (docs/POST-PIPE-USES-RTAGZ.md, "What the
// feed carries"); an adapter writes {type, value} from the item's tags. When
// the item has none, each entry of item.tags that is a non-empty string
// becomes {type: 'tag', value}, so a caller sees one shape whether the feed
// was built with rosetta-tagz, without it, or by an older engine. An entry of
// item.tags that is not a string makes no reference.
//
// Reads item._references, else item.originalItem._references (a viewer node
// keeps the feed item there), and item.tags, else item.originalItem.tags.
//
// The build side (src/corpus/buildEdges.js, src/corpus/relationEdges.js) and
// the viewer (the graph's node, the reader's tag row) both read tags through
// this, so it stays free of React and of Node-only APIs. Pure, so it can be
// tested without the DOM.

function listOf(item, key) {
  if (!item || typeof item !== 'object') return [];
  if (Array.isArray(item[key])) return item[key];
  const original = item.originalItem;
  if (original && typeof original === 'object' && Array.isArray(original[key])) return original[key];
  return [];
}

function tagReferences(item) {
  const refs = listOf(item, '_references').filter(
    (r) => r && typeof r === 'object' && r.type === 'tag' && typeof r.value === 'string' && r.value !== ''
  );
  if (refs.length) return refs;
  return listOf(item, 'tags')
    .filter((t) => typeof t === 'string' && t !== '')
    .map((value) => ({ type: 'tag', value }));
}

module.exports = { tagReferences };

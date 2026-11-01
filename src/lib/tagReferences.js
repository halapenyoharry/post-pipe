// tagReferences.js — an item's tag references, in one shape for both sides.
//
// The item's references of type 'tag' that name a tag, in the order the item
// carries them, as they are (not copied). rosetta-tagz writes one per entry
// of item.tags, with concept, weight, origin, why and the PROV pair where it
// has them (docs/POST-PIPE-USES-RTAGZ.md, "What the feed carries"); an
// adapter writes {type, value} from the item's tags. When the item has none,
// each entry of item.tags that names a tag becomes {type: 'tag', value}, so
// a caller sees one shape whether the feed was built with rosetta-tagz,
// without it, or by an older engine.
//
// A value names a tag when it is a non-empty string, or a finite number,
// read as its string: gray-matter reads `tags: [2024, ai]` as a number and a
// string, and the number made its edge (`tag:2024`), sat in the node's tags
// and showed as a chip before this helper existed, so it still does. A
// reference whose value is a number is returned as a copy with the string;
// the reference itself is not changed. A boolean, null, an object or an
// empty string names no tag and makes no reference.
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

// The tag a value names, as a string, or null.
function tagValue(v) {
  if (typeof v === 'string') return v !== '' ? v : null;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return null;
}

function tagReferences(item) {
  const refs = [];
  for (const r of listOf(item, '_references')) {
    if (!r || typeof r !== 'object' || r.type !== 'tag') continue;
    const value = tagValue(r.value);
    if (value === null) continue;
    refs.push(value === r.value ? r : { ...r, value });
  }
  if (refs.length) return refs;
  const fromTags = [];
  for (const t of listOf(item, 'tags')) {
    const value = tagValue(t);
    if (value !== null) fromTags.push({ type: 'tag', value });
  }
  return fromTags;
}

module.exports = { tagReferences };

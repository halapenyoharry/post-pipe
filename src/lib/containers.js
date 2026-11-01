// containers.js — whether a piece belongs to a container.
//
// A container names the tag its pieces carry (settings.containment[].tag).
// When rosetta-tagz ran, the build resolves that tag to its concept id at
// corpus time (the container's `concept`, src/lib/rtagz.js
// resolveContainerConcepts), and a piece belongs when one of its tag
// references names that concept, whatever label the concept shows. Without a
// concept (a site without rosetta-tagz, a container tag no piece carries, or
// a piece rosetta-tagz did not join) membership is the tag string on the
// piece's tags, as it always was.
//
// Pure, so it can be tested without the DOM.

const hasString = (v) => typeof v === 'string' && v !== '';

// The concept a piece's tag stands for, from its tag reference, or null.
function conceptOfTag(item, tag) {
  const refs = item && Array.isArray(item._references) ? item._references : null;
  if (!refs) return null;
  const ref = refs.find((r) => r && r.type === 'tag' && r.value === tag);
  return ref && hasString(ref.concept) ? ref.concept : null;
}

// Whether the piece carries the container's tag: by concept when both the
// container and one of the piece's tag references name one, else by the
// tag string.
function containerHas(container, item) {
  if (!container || !item) return false;
  if (hasString(container.concept)) {
    const refs = Array.isArray(item._references) ? item._references : [];
    if (refs.some((r) => r && r.type === 'tag' && r.concept === container.concept)) return true;
  }
  return hasString(container.tag) && Array.isArray(item.tags) && item.tags.includes(container.tag);
}

// The container a piece's tag puts it in, or undefined: by the tag string
// (byTag, tag -> container), else by the concept the tag's reference names
// (byConcept, concept id -> container).
function containerOfTag(item, tag, byTag, byConcept) {
  const byString = byTag && byTag.get(tag);
  if (byString) return byString;
  if (!byConcept || byConcept.size === 0) return undefined;
  const concept = conceptOfTag(item, tag);
  return concept ? byConcept.get(concept) : undefined;
}

module.exports = { containerHas, containerOfTag, conceptOfTag };

// Measures over a subfield that more than one program needs: a card's tag
// weights, the tagz two cards share, the relations between two cards' tagz,
// degree, and hops between cards. Every number here is read from the subfield.
import { adjacencyOf, hopsFrom, hyperedgeId } from './subfield.js';

export { adjacencyOf, hopsFrom };

/** A card's tagz by hyperedge id with the reference weight (the largest, if a concept appears twice). */
export function tagWeightsOf(card) {
  const m = new Map();
  for (const ref of card.references || []) {
    if (ref.type !== 'tag') continue;
    const id = hyperedgeId(ref);
    const w = Number.isFinite(Number(ref.weight)) ? Number(ref.weight) : 1;
    if (!m.has(id) || m.get(id) < w) m.set(id, w);
  }
  return m;
}

/**
 * tag.shared, with `position` as the reference: for every tag both carry,
 * the smaller of the two reference weights, summed, over the position's
 * total reference weight. 1 when the card carries every tag of the position
 * at full weight, 0 when they share none. The bounding is the worker's.
 */
export function sharedTagz(position, card) {
  const a = tagWeightsOf(position);
  const b = tagWeightsOf(card);
  let total = 0;
  for (const w of a.values()) total += w;
  const ids = [];
  let sum = 0;
  for (const [id, wa] of a) {
    if (b.has(id)) {
      ids.push(id);
      sum += Math.min(wa, b.get(id));
    }
  }
  ids.sort();
  return { ids, value: total > 0 ? Math.min(1, sum / total) : 0 };
}

/**
 * rel.<type>: the weights of relations of each type between one of the
 * position's tagz and one of the card's tagz, summed and capped at 1. A tag
 * the two share is not a relation (that is tag.shared).
 */
export function relationSums(relations, position, card) {
  const a = tagWeightsOf(position);
  const b = tagWeightsOf(card);
  const sums = {};
  for (const r of relations || []) {
    const across = (a.has(r.a) && b.has(r.b)) || (a.has(r.b) && b.has(r.a));
    if (!across || r.a === r.b) continue;
    sums[r.type] = (sums[r.type] || 0) + (Number.isFinite(r.weight) ? r.weight : 1);
  }
  for (const k of Object.keys(sums)) sums[k] = Math.min(1, sums[k]);
  return sums;
}

/** Edges on each card in the subfield: its tag incidences plus the links it is an end of. */
export function degreesOf(sub) {
  const deg = new Map(sub.cards.map((c) => [c.id, 0]));
  for (const h of sub.tagz) for (const m of h.members) if (deg.has(m.card)) deg.set(m.card, deg.get(m.card) + 1);
  for (const l of sub.links) {
    if (deg.has(l.source)) deg.set(l.source, deg.get(l.source) + 1);
    if (deg.has(l.target) && l.target !== l.source) deg.set(l.target, deg.get(l.target) + 1);
  }
  return deg;
}

/** Hops between cards in the subfield, computed once per start card and remembered. */
export function hopsTable(sub) {
  const adj = adjacencyOf(sub);
  const cache = new Map();
  return {
    from(id) {
      if (!cache.has(id)) cache.set(id, hopsFrom(adj, id));
      return cache.get(id);
    },
    between(a, b) {
      const h = this.from(a);
      return h.has(b) ? h.get(b) : null;
    },
  };
}

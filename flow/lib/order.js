// flow-order: from scored cards to a sequence. `score` sorts by score (the
// design's rule); `walk` moves the position along the flow, offered beside
// it. Each step records its hops, the tagz shared with the card before, and
// whether it is a seam.
import { sharedTagz, hopsTable } from './graph.js';
import { weightOf } from './preset.js';
import { hyperedgeId } from './subfield.js';

function byScoreThenId(a, b) {
  if (b.score !== a.score) return b.score - a.score;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

function tagzOf(card) {
  const seen = new Set();
  const out = [];
  for (const ref of card.references || []) {
    if (ref.type !== 'tag') continue;
    const id = hyperedgeId(ref);
    if (seen.has(id)) continue;
    seen.add(id);
    const t = { id, label: ref.value, weight: Number.isFinite(Number(ref.weight)) ? Number(ref.weight) : 1, origin: ref.origin ?? null };
    if (typeof ref.why === 'string' && ref.why) t.why = ref.why;
    out.push(t);
  }
  return out;
}

/**
 * With a previous flow: start from its order (cards no longer present
 * dropped, new cards placed by score), then let a card pass its neighbour
 * only when their scores differ by more than the threshold. Repeated
 * adjacent passes; deterministic.
 */
function stabilise(sorted, previous, threshold) {
  const byId = new Map(sorted.map((c) => [c.id, c]));
  const prevIds = (previous.items || []).map((it) => it.id).filter((id) => byId.has(id));
  const seq = prevIds.map((id) => byId.get(id));
  const placed = new Set(prevIds);
  for (const c of sorted) {
    if (placed.has(c.id)) continue;
    let at = seq.findIndex((s) => s.score < c.score);
    if (at < 0) at = seq.length;
    seq.splice(at, 0, c);
    placed.add(c.id);
  }
  for (let pass = 0; pass < seq.length; pass++) {
    let swapped = false;
    for (let i = 0; i + 1 < seq.length; i++) {
      if (seq[i + 1].score - seq[i].score > threshold) {
        [seq[i], seq[i + 1]] = [seq[i + 1], seq[i]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return seq;
}

function walk(cards, scored, hops) {
  const preset = scored.preset;
  const wShared = weightOf(preset, 'tag.shared');
  const wDist = weightOf(preset, 'distance');
  const left = new Map(cards.map((c) => [c.id, c]));
  const out = [];
  let current = [...cards].sort(byScoreThenId)[0];
  if (!current) return out;
  out.push(current);
  left.delete(current.id);
  while (left.size) {
    const h = hops.from(current.id);
    let farthest = 0;
    for (const id of left.keys()) if (h.has(id) && h.get(id) > farthest) farthest = h.get(id);
    let best = null;
    let bestValue = -Infinity;
    for (const cand of left.values()) {
      const shared = sharedTagz(current, cand).value;
      const dist = h.has(cand.id) ? (farthest > 0 ? h.get(cand.id) / farthest : 0) : 1;
      const value = cand.score + wShared * shared + wDist * dist;
      if (value > bestValue || (value === bestValue && cand.id < best.id)) {
        best = cand;
        bestValue = value;
      }
    }
    out.push(best);
    left.delete(best.id);
    current = best;
  }
  return out;
}

/**
 * Order the scored subfield. Options: mode (score | walk), seam (hops),
 * stability (fraction of the score range), previous (a flow to hold to).
 */
export function orderFlow(scored, options = {}) {
  if (!scored || !Array.isArray(scored.cards)) throw new Error('scored input has no cards array');
  if (!scored.preset || !scored.preset.switches) throw new Error('scored input carries no preset; run flow-score first');
  const sw = scored.preset.switches;
  const mode = options.mode || sw.orderMode || 'score';
  const seam = Number.isFinite(options.seam) ? options.seam : Number(sw.seam);
  const stability = Number.isFinite(options.stability) ? options.stability : Number(sw.stability);
  const cards = scored.cards.filter((c) => Number.isFinite(c.score));
  const hops = hopsTable(scored);

  let seq;
  if (mode === 'walk') {
    seq = walk(cards, scored, hops);
  } else if (mode === 'score') {
    seq = [...cards].sort(byScoreThenId);
    if (options.previous && Array.isArray(options.previous.items)) {
      let lo = Infinity;
      let hi = -Infinity;
      for (const c of cards) {
        if (c.score < lo) lo = c.score;
        if (c.score > hi) hi = c.score;
      }
      const range = Number.isFinite(hi - lo) ? hi - lo : 0;
      seq = stabilise(seq, options.previous, stability * range);
    }
  } else {
    throw new Error(`unknown mode ${mode}; use score or walk`);
  }

  const items = [];
  let seams = 0;
  let hopSum = 0;
  let hopCount = 0;
  for (let i = 0; i < seq.length; i++) {
    const c = seq[i];
    const prev = i > 0 ? seq[i - 1] : null;
    const step = { from: prev ? prev.id : null, hops: null, shared: [], seam: false };
    if (prev) {
      const h = hops.between(prev.id, c.id);
      step.hops = h;
      step.shared = sharedTagz(prev, c).ids;
      step.seam = h === null || h > seam;
      if (step.seam) seams++;
      if (h !== null) {
        hopSum += h;
        hopCount++;
      }
    }
    const item = {
      rank: i + 1,
      id: c.id,
      title: c.title,
      url: c.url,
      source: c.source,
      date: c.date,
      score: c.score,
      terms: c.terms,
      top: c.top,
      tagz: tagzOf(c),
      step,
    };
    const untagged = (c.references || []).find((r) => r && r.type === 'untagged');
    if (untagged) item.untagged = untagged;
    items.push(item);
  }

  return {
    summary: {
      preset: scored.preset.name,
      mode,
      cards: items.length,
      steps: Math.max(0, items.length - 1),
      seams,
      meanHops: hopCount ? hopSum / hopCount : null,
      unreachableSteps: Math.max(0, items.length - 1) - hopCount,
      position: scored.position ?? null,
      selector: scored.selector ?? null,
      switches: {
        seam,
        stability,
        previous: Boolean(options.previous),
        degreePenalty: sw.degreePenalty,
        recencyClock: sw.recencyClock,
        recencyHalfLifeDays: sw.recencyHalfLifeDays,
      },
      weights: scored.preset.weights,
    },
    items,
  };
}

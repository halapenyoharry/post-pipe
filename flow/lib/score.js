// flow-score: each card gets a feature vector x, the preset gives the weight
// vector w, score = sum(w_i * x_i), and every term is kept and named. Each
// feature is bounded to 0..1 and reads one attribute of the subfield; the
// README says which, feature by feature.
import { sharedTagz, relationSums, degreesOf } from './graph.js';
import { weightOf } from './preset.js';
import { slugOf } from './io.js';

const DAY_MS = 86400000;

function penalise(n, how) {
  if (how === 'none') return n;
  if (how === 'log') return Math.log1p(n);
  return Math.sqrt(n);
}

/** The feature names for a subfield under a preset, in the order terms are listed. */
export function featureNames(sub, preset) {
  const schemes = [];
  for (const s of sub.schemes || []) if (!schemes.includes(s.id)) schemes.push(s.id);
  for (const k of Object.keys(preset.weights)) {
    if (k.startsWith('tag.') && k !== 'tag.shared') {
      const id = k.slice(4);
      if (!schemes.includes(id)) schemes.push(id);
    }
  }
  const relTypes = [];
  for (const r of sub.relations || []) if (!relTypes.includes(r.type)) relTypes.push(r.type);
  for (const k of Object.keys(preset.weights)) {
    if (k.startsWith('rel.')) {
      const t = k.slice(4);
      if (!relTypes.includes(t)) relTypes.push(t);
    }
  }
  relTypes.sort();
  return [
    ...schemes.map((s) => `tag.${s}`),
    'tag.shared',
    ...relTypes.map((t) => `rel.${t}`),
    'degree', 'recency', 'source', 'read', 'pin', 'distance',
  ];
}

function readStateOf(state, card) {
  if (!state || typeof state !== 'object') return { read: 0, pin: 0 };
  const inner = state.state && typeof state.state === 'object' ? state.state : state;
  const reading = inner.reading && typeof inner.reading === 'object' ? inner.reading : {};
  const nodes = inner.nodes && typeof inner.nodes === 'object' ? inner.nodes : {};
  const slug = slugOf(card.url);
  const r = reading[card.id] || (slug && reading[slug]) || null;
  const n = nodes[card.id] || (slug && nodes[slug]) || null;
  // unread 0, seen 0.5 (a seenAt), done 1 (read to the end): viewState.reading.
  const read = r ? (r.done === true ? 1 : (r.seenAt ? 0.5 : 0)) : 0;
  const pin = n && n.pinned === true ? 1 : 0;
  return { read, pin };
}

/**
 * Score every card. Returns the subfield passed through, with `preset` (name,
 * weights, the switches as used) added, and on each card `score`, `terms`
 * and `top`.
 */
export function scoreSubfield(sub, preset, { state = null, switches } = {}) {
  const sw = { ...preset.switches, ...(switches || {}) };
  const names = featureNames(sub, preset);
  const cards = sub.cards;
  const n = cards.length;
  const position = sub.position ? cards.find((c) => c.id === sub.position) || null : null;

  // degree: edges on the card, penalised, over the subfield's largest.
  const degRaw = degreesOf(sub);
  const degPen = new Map();
  let degMax = 0;
  for (const c of cards) {
    const v = penalise(degRaw.get(c.id) || 0, sw.degreePenalty);
    degPen.set(c.id, v);
    if (v > degMax) degMax = v;
  }

  // recency: calendar decays from the newest dated card in the subfield with
  // the half-life; session is the rank in the feed's item order, newest first.
  let newest = null;
  for (const c of cards) {
    const t = c.date ? Date.parse(c.date) : NaN;
    if (Number.isFinite(t) && (newest === null || t > newest)) newest = t;
  }
  const byIndex = [...cards].sort((a, b) => a.index - b.index || (a.id < b.id ? -1 : 1));
  const sessionRank = new Map(byIndex.map((c, i) => [c.id, i]));

  // distance: hops from the position over the subfield's largest finite hops.
  let distMax = 0;
  for (const c of cards) if (Number.isFinite(c.distance) && c.distance > distMax) distMax = c.distance;

  const scored = cards.map((card) => {
    const x = {};
    for (const name of names) {
      if (name.startsWith('tag.') && name !== 'tag.shared') {
        const scheme = name.slice(4);
        let best = 0;
        for (const ref of card.references || []) {
          if (ref.type !== 'tag') continue;
          if (!ref.prefLabel || typeof ref.prefLabel !== 'object' || !(scheme in ref.prefLabel)) continue;
          if (sw.tagMeasure === 'weight') {
            const w = Number.isFinite(Number(ref.weight)) ? Number(ref.weight) : 1;
            if (w > best) best = w;
          } else {
            best = 1;
            break;
          }
        }
        x[name] = Math.min(1, Math.max(0, best));
      }
    }
    x['tag.shared'] = position && position.id !== card.id ? sharedTagz(position, card).value : 0;
    const rel = position && position.id !== card.id ? relationSums(sub.relations, position, card) : {};
    for (const name of names) if (name.startsWith('rel.')) x[name] = rel[name.slice(4)] || 0;
    x.degree = degMax > 0 ? degPen.get(card.id) / degMax : 0;
    if (sw.recencyClock === 'session') {
      x.recency = n > 1 ? 1 - sessionRank.get(card.id) / (n - 1) : 1;
    } else {
      const t = card.date ? Date.parse(card.date) : NaN;
      x.recency = Number.isFinite(t) && newest !== null
        ? Math.pow(0.5, Math.max(0, newest - t) / DAY_MS / sw.recencyHalfLifeDays)
        : 0;
    }
    x.source = 1;
    const rs = readStateOf(state, card);
    x.read = rs.read;
    x.pin = rs.pin;
    x.distance = position && Number.isFinite(card.distance) && distMax > 0 ? card.distance / distMax : 0;

    const terms = {};
    let score = 0;
    for (const name of names) {
      const w = weightOf(preset, name, card.source);
      const xi = x[name] ?? 0;
      const term = w * xi;
      terms[name] = { x: xi, w, term };
      score += term;
    }
    const top = [...names].sort((a, b) => Math.abs(terms[b].term) - Math.abs(terms[a].term) || (a < b ? -1 : a > b ? 1 : 0));
    return { ...card, score, terms, top };
  });

  return {
    ...sub,
    preset: { name: preset.name, description: preset.description, weights: preset.weights, switches: sw },
    cards: scored,
  };
}

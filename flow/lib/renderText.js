// The text target: adjacency text for a model's window, in flow order. Every
// line is from the feed (titles, ids, sources, dates, tag labels, concept
// ids, weights, origins, why) or from the flow's own numbers (rank, score,
// terms, hops). Nothing is written that neither carries.
import { round } from './io.js';

function fmt(n, places) {
  return Number.isFinite(n) ? round(n, places).toFixed(places) : '';
}

function dateOf(item) {
  return item.date ? String(item.date).split('T')[0] : '';
}

function seamLine(item, byId) {
  const from = byId.get(item.step.from);
  const fromRank = from ? `#${from.rank}` : item.step.from;
  if (item.step.hops === null) return `-- seam: not reachable from ${fromRank} in the subfield --`;
  const shared = item.step.shared.length ? `shares ${item.step.shared.length} tag${item.step.shared.length === 1 ? '' : 'z'}` : 'no tag shared';
  return `-- seam: ${item.step.hops} hops from ${fromRank}, ${shared} --`;
}

/**
 * Render a flow as text. `full`: how many cards from the top are written in
 * full; the rest are one line each.
 */
export function renderText(flow, { full = 20 } = {}) {
  if (!flow || !Array.isArray(flow.items)) throw new Error('input is not a flow: no items array');
  const s = flow.summary || {};
  const items = flow.items;
  const byId = new Map(items.map((it) => [it.id, it]));

  // Which cards carry each tag, for the "also" list, by rank.
  const carriers = new Map();
  for (const it of items) {
    for (const t of it.tagz || []) {
      if (!carriers.has(t.id)) carriers.set(t.id, []);
      carriers.get(t.id).push(it);
    }
  }

  const lines = [];
  const mean = Number.isFinite(s.meanHops) ? `${fmt(s.meanHops, 2)} hops per step on average` : 'no reachable steps';
  const start = s.start && s.start.rule && s.start.rule !== 'heaviest'
    ? `, start ${s.start.title || s.start.id} (${s.start.rule})`
    : '';
  lines.push(`flow ${s.preset || ''}: ${s.cards} cards, mode ${s.mode}${start}, ${s.seams} seams, ${mean}`);
  const weights = Object.entries(s.weights || {})
    .filter(([k, v]) => k !== 'source' && Number.isFinite(v) && v !== 0)
    .map(([k, v]) => `${k} ${v}`);
  const src = s.weights && s.weights.source;
  const srcText = src && typeof src === 'object' && Object.keys(src).length
    ? Object.entries(src).map(([t, w]) => `source ${t} ${w}`).join(' · ')
    : `source ${typeof src === 'number' ? src : 1} (every source)`;
  lines.push(`weights: ${[...weights, srcText].join(' · ')}`);
  lines.push('');

  items.forEach((it, i) => {
    if (it.step && it.step.seam) lines.push(seamLine(it, byId));
    const labels = (it.tagz || []).map((t) => t.label);
    if (i >= full) {
      lines.push(`#${it.rank}  ${fmt(it.score, 3)}  ${it.title}  [${labels.join(' · ')}]`);
      return;
    }
    lines.push(`#${it.rank}  ${fmt(it.score, 3)}  ${it.title}  ${it.id}  ${it.source || ''}  ${dateOf(it)}`.replace(/\s+$/, ''));
    const top = (it.top || []).slice(0, 3).map((name) => `${name} ${fmt(it.terms[name].term, 2)}`);
    if (top.length) lines.push(`    ${top.join(' · ')}`);
    for (const t of it.tagz || []) {
      const others = (carriers.get(t.id) || []).filter((o) => o.id !== it.id).map((o) => `#${o.rank} ${o.title}`);
      const parts = [`tag ${t.label} (${t.id}) weight ${t.weight} ${t.origin || ''}`.replace(/\s+$/, '')];
      if (t.why) parts.push(`why: ${t.why}`);
      if (others.length) parts.push(`also ${others.join(', ')}`);
      lines.push(`    ${parts.join(' · ')}`);
    }
    if (it.untagged && Array.isArray(it.untagged.why) && it.untagged.why.length) {
      lines.push(`    untagged: ${it.untagged.why.join('; ')}`);
    }
    lines.push('');
  });
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
}

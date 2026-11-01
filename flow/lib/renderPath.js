// The path target: the flow as a polyline over the field, in the viewport the
// capture saw. Every card is a faint box with its short label at its captured
// place, every tag bubble a faint circle, then the flow as one segment per
// step through the card centres, a step number at each card, seams dashed,
// and a legend naming the preset. The colours are the worker's; this is a
// diagnostic picture, not a view of the site.
import { slugOf, round } from './io.js';

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function n(v) {
  return Number.isFinite(v) ? String(round(v, 1)) : '0';
}

/** Match each flow item to a captured card: by url, then by the viewer's slug. */
export function placeItems(flow, positions) {
  const byUrl = new Map();
  const bySlug = new Map();
  for (const c of positions.cards || []) {
    if (c.url && !byUrl.has(c.url)) byUrl.set(c.url, c);
    if (c.id && !bySlug.has(c.id)) bySlug.set(c.id, c);
  }
  return flow.items.map((it) => {
    const pos = (it.url && byUrl.get(it.url)) || bySlug.get(slugOf(it.url)) || bySlug.get(slugOf(it.id)) || null;
    return { item: it, pos: pos && !pos.hidden ? pos : null };
  });
}

/** The segments of the polyline, one per step with both ends placed, with their lengths. */
export function pathSegments(placed) {
  const segments = [];
  const skipped = [];
  for (let i = 0; i < placed.length; i++) {
    const { item, pos } = placed[i];
    if (!pos) skipped.push(item.id);
    if (i === 0 || !pos) continue;
    const prev = placed[i - 1];
    if (!prev.pos) continue;
    const a = prev.pos.centre;
    const b = pos.centre;
    segments.push({
      step: i,
      from: prev.item.id,
      to: item.id,
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      length: Math.hypot(b.x - a.x, b.y - a.y),
      seam: Boolean(item.step && item.step.seam),
    });
  }
  return { segments, skipped };
}

export function pathStats(flow, positions) {
  const vp = positions.viewport || { width: 0, height: 0 };
  const placed = placeItems(flow, positions);
  const { segments, skipped } = pathSegments(placed);
  const lengths = segments.map((s) => s.length).sort((a, b) => a - b);
  const total = lengths.reduce((a, b) => a + b, 0);
  const halfDiagonal = Math.hypot(vp.width, vp.height) / 2;
  const median = lengths.length
    ? (lengths.length % 2 ? lengths[(lengths.length - 1) / 2] : (lengths[lengths.length / 2 - 1] + lengths[lengths.length / 2]) / 2)
    : null;
  return {
    preset: flow.summary && flow.summary.preset,
    mode: flow.summary && flow.summary.mode,
    cards: flow.items.length,
    placed: placed.filter((p) => p.pos).length,
    notDrawn: skipped,
    steps: Math.max(0, flow.items.length - 1),
    segments: segments.length,
    seams: segments.filter((s) => s.seam).length,
    totalLength: total,
    meanLength: lengths.length ? total / lengths.length : null,
    medianLength: median,
    halfDiagonal,
    longerThanHalfDiagonal: lengths.filter((l) => l > halfDiagonal).length,
    viewport: vp,
  };
}

/** The overlay as an SVG string sized to the captured viewport. */
export function renderPathSvg(flow, positions) {
  if (!flow || !Array.isArray(flow.items)) throw new Error('input is not a flow: no items array');
  if (!positions || !positions.viewport || !Array.isArray(positions.cards)) throw new Error('positions.json has no viewport and cards; run flow-capture first');
  const W = positions.viewport.width;
  const H = positions.viewport.height;
  const placed = placeItems(flow, positions);
  const { segments, skipped } = pathSegments(placed);
  const s = flow.summary || {};
  const stats = pathStats(flow, positions);

  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="system-ui, sans-serif">`);
  out.push('<style>');
  out.push('.ground{fill:#1a1a2e}');
  out.push('.card{fill:none;stroke:rgba(255,255,255,0.28);stroke-width:1}');
  out.push('.card-label{fill:rgba(255,255,255,0.55);font-size:9px}');
  out.push('.tag{fill:none;stroke:rgba(255,255,255,0.22);stroke-width:1}');
  out.push('.step{stroke:#ff7a59;stroke-width:2;fill:none;stroke-linecap:round}');
  out.push('.step.seam{stroke-dasharray:7 5;stroke:#ffd166}');
  out.push('.mark{fill:#ff7a59;stroke:#1a1a2e;stroke-width:1}');
  out.push('.mark.first{fill:#ffffff}');
  out.push('.mark-text{fill:#1a1a2e;font-size:8px;font-weight:600;text-anchor:middle;dominant-baseline:central}');
  out.push('.legend-box{fill:rgba(26,26,46,0.85);stroke:rgba(255,255,255,0.35)}');
  out.push('.legend{fill:#ffffff;font-size:12px}');
  out.push('</style>');
  out.push(`<rect class="ground" x="0" y="0" width="${W}" height="${H}"/>`);

  out.push('<g class="cards">');
  for (const c of positions.cards) {
    if (c.hidden || !c.box) continue;
    out.push(`<rect class="card" x="${n(c.box.x)}" y="${n(c.box.y)}" width="${n(c.box.w)}" height="${n(c.box.h)}" rx="3"/>`);
    out.push(`<text class="card-label" x="${n(c.box.x + 3)}" y="${n(c.box.y + 10)}">${esc(c.label)}</text>`);
  }
  out.push('</g>');

  out.push('<g class="tagz">');
  for (const t of positions.tagz || []) {
    if (t.hidden || !t.box) continue;
    const r = Math.max(2, Math.min(t.box.w, t.box.h) / 2);
    out.push(`<circle class="tag" cx="${n(t.centre.x)}" cy="${n(t.centre.y)}" r="${n(r)}"/>`);
  }
  out.push('</g>');

  out.push('<g class="path">');
  for (const seg of segments) {
    out.push(`<line class="step${seg.seam ? ' seam' : ''}" data-step="${seg.step}" x1="${n(seg.x1)}" y1="${n(seg.y1)}" x2="${n(seg.x2)}" y2="${n(seg.y2)}"/>`);
  }
  out.push('</g>');

  out.push('<g class="marks">');
  placed.forEach(({ item, pos }, i) => {
    if (!pos) return;
    out.push(`<circle class="mark${i === 0 ? ' first' : ''}" cx="${n(pos.centre.x)}" cy="${n(pos.centre.y)}" r="7"/>`);
    out.push(`<text class="mark-text" x="${n(pos.centre.x)}" y="${n(pos.centre.y)}">${item.rank}</text>`);
  });
  out.push('</g>');

  const legend = [
    `preset ${s.preset || ''} · mode ${s.mode || ''} · ${flow.items.length} cards · ${s.seams ?? 0} seams (dashed) · ${segments.length} of ${Math.max(0, flow.items.length - 1)} steps drawn`,
    `path ${round(stats.totalLength, 0)} px · mean step ${round(stats.meanLength ?? 0, 0)} px · median ${round(stats.medianLength ?? 0, 0)} px · ${stats.longerThanHalfDiagonal} steps over half the diagonal${skipped.length ? ` · not drawn: ${skipped.length}` : ''}`,
  ];
  out.push('<g class="legend-group">');
  out.push(`<rect class="legend-box" x="10" y="10" width="${Math.min(W - 20, 760)}" height="44" rx="4"/>`);
  out.push(`<text class="legend" x="20" y="28">${esc(legend[0])}</text>`);
  out.push(`<text class="legend" x="20" y="45">${esc(legend[1])}</text>`);
  out.push('</g>');
  out.push('</svg>');
  return { svg: `${out.join('\n')}\n`, stats };
}

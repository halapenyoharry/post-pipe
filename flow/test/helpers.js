// A small synthetic feed for the flow tests: six cards, four tagz, one
// relation, one untagged card, one authored link. The shapes follow
// docs/POST-PIPE-USES-RTAGZ.md ("What the feed carries").
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const FLOW_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function ref(concept, value, weight, origin, prefLabel, why = null) {
  return { type: 'tag', value, concept, origin, weight, systems: [], via: 'known', why, prefLabel };
}

const ALPHA = { site: 'alpha', Journal: 'Alpha' };
const BETA_X = { site: 'beta', Journal: 'beta' };
const BETA_D = { site: 'beta', discovered: 'beta' };
const GAMMA = { site: 'gamma', Wire: 'gamma' };
const GAMMA_D = { site: 'gamma', discovered: 'gamma' };
const DELTA = { site: 'delta', Wire: 'delta' };
const DELTA_D = { site: 'delta', discovered: 'delta' };

const journal = { id: 'http://127.0.0.1/journal.xml', title: 'Journal', type: 'rss' };
const wire = { id: 'http://127.0.0.1/wire.xml', title: 'Wire', type: 'rss' };

export function syntheticFeed() {
  const items = [
    { id: 'https://example.test/c1', url: 'https://example.test/c1.html', title: 'Card one', kind: 'text', date_published: '2026-10-30T00:00:00.000Z', tags: ['alpha', 'beta'], _source: journal,
      _references: [ref('c_alpha', 'alpha', 1, 'explicit', ALPHA), ref('c_beta', 'beta', 0.5, 'discovered', BETA_D, 'recurs in 2 of 6 items; 3× here')] },
    { id: 'https://example.test/c2', url: 'https://example.test/c2.html', title: 'Card two', kind: 'text', date_published: '2026-10-29T00:00:00.000Z', tags: ['alpha', 'gamma'], _source: journal,
      _references: [ref('c_alpha', 'alpha', 1, 'explicit', ALPHA), ref('c_gamma', 'gamma', 0.45, 'discovered', GAMMA_D, 'recurs in 2 of 6 items; 2× here')] },
    { id: 'https://example.test/c3', url: 'https://example.test/c3.html', title: 'Card three', kind: 'text', date_published: '2026-10-20T00:00:00.000Z', tags: ['beta'], _source: journal,
      _references: [ref('c_beta', 'beta', 1, 'explicit', BETA_X)] },
    { id: 'https://example.test/c4', url: 'https://example.test/c4.html', title: 'Card four', kind: 'text', date_published: '2026-09-30T00:00:00.000Z', tags: ['gamma', 'delta'], _source: wire,
      _references: [ref('c_gamma', 'gamma', 1, 'explicit', GAMMA), ref('c_delta', 'delta', 1, 'explicit', DELTA)] },
    { id: 'https://example.test/c5', url: 'https://example.test/c5.html', title: 'Card five', kind: 'text', date_published: '2026-08-01T00:00:00.000Z', tags: ['delta'], _source: wire,
      _references: [ref('c_delta', 'delta', 0.4, 'discovered', DELTA_D, 'recurs in 2 of 6 items')] },
    { id: 'https://example.test/c6', url: 'https://example.test/c6.html', title: 'Card six', kind: 'text', tags: [], _source: wire,
      _references: [{ type: 'untagged', why: ['only tagz under the 1.6× source coherence bar: omega 1.2'], reason: 'underBar', reasons: ['underBar'], under: [{ concept: 'c_omega', label: 'omega', origin: 'discovered', sourceRatio: 1.2 }] }] },
  ];
  const edges = [];
  for (const it of items) {
    for (const r of it._references) {
      if (r.type !== 'tag') continue;
      edges.push({ source: it.id, target: `tag:${r.value}`, directed: false, role: 'tagged', layer: 'tag', attrs: { concept: r.concept, weight: r.weight, origin: r.origin } });
    }
  }
  edges.push({ source: 'tag:alpha', target: 'tag:beta', directed: false, role: 'related', layer: 'related', attrs: { concept: 'c_alpha', target: 'c_beta', weight: 0.6, why: '"alpha" and "beta" share 1 of their 2 and 2 items' } });
  edges.push({ source: 'https://example.test/c4', target: 'https://example.test/c5', directed: true, role: 'connected_to', layer: 'authored', attrs: { resolved: true } });
  const concept = (id, canonical, prefLabel, inScheme) => ({ id, canonical, pinned: false, discovered: false, items: 1, prefLabel, inScheme });
  return {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Synthetic',
    items,
    edges,
    _sources: [journal, wire],
    _rtagz: {
      built: '2026-11-01T00:00:00.000Z',
      schemes: [
        { id: 'site', label: 'Synthetic', kind: 'site' },
        { id: 'Journal', label: 'Journal', kind: 'system' },
        { id: 'Wire', label: 'Wire', kind: 'system' },
        { id: 'discovered', label: 'discovered', kind: 'discovered' },
      ],
      concepts: [
        concept('c_alpha', 'alpha', ALPHA, ['site', 'Journal']),
        concept('c_beta', 'beta', { site: 'beta', Journal: 'beta', discovered: 'beta' }, ['site', 'Journal', 'discovered']),
        concept('c_gamma', 'gamma', { site: 'gamma', Wire: 'gamma', discovered: 'gamma' }, ['site', 'Wire', 'discovered']),
        concept('c_delta', 'delta', { site: 'delta', Wire: 'delta', discovered: 'delta' }, ['site', 'Wire', 'discovered']),
      ],
      relationList: [{ a: 'c_alpha', b: 'c_beta', type: 'related', weight: 0.6 }],
      untagged: { bar: 1.6, count: 1, none: 0, items: [{ id: 'https://example.test/c6', source: 'Wire', reason: 'underBar' }] },
    },
  };
}

/** Captured positions for the six cards and four tagz, as flow-capture writes them. */
export function syntheticPositions() {
  const card = (slug, x, y) => ({ id: slug, url: `https://example.test/${slug}.html`, label: slug, title: slug, source: null, centre: { x, y }, box: { x: x - 40, y: y - 25, w: 80, h: 50 }, hidden: false });
  const tag = (label, x, y) => ({ id: `tag:${label}`, type: 'tag', label, concept: `c_${label}`, centre: { x, y }, box: { x: x - 20, y: y - 10, w: 40, h: 20 }, hidden: false });
  return {
    url: 'http://127.0.0.1:18000/',
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
    zoom: { k: 1, x: 0, y: 0, rotation: 0 },
    counts: { cards: 6, tagz: 4, others: 0 },
    cards: [card('c1', 100, 100), card('c2', 300, 100), card('c3', 100, 300), card('c4', 600, 100), card('c5', 600, 400), card('c6', 300, 500)],
    tagz: [tag('alpha', 200, 100), tag('beta', 100, 200), tag('gamma', 450, 100), tag('delta', 600, 250)],
    others: [],
  };
}

export const byWeightPreset = () => ({
  name: 'test-by-weight',
  weights: { 'tag.site': 1, degree: 1, recency: 1, source: {} },
  switches: { degreePenalty: 'sqrt', recencyClock: 'calendar', recencyHalfLifeDays: 30, orderMode: 'score', seam: 2, stability: 0.05 },
});

export const byNeighbourhoodPreset = () => ({
  name: 'test-by-neighbourhood',
  weights: { 'tag.site': 1, degree: 1, recency: 1, 'tag.shared': 1, distance: -1, source: {} },
  switches: { degreePenalty: 'sqrt', recencyClock: 'calendar', recencyHalfLifeDays: 30, orderMode: 'walk', seam: 2, stability: 0.05 },
});

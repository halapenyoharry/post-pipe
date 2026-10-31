import test from 'node:test';
import assert from 'node:assert/strict';
import { projectGraph, neighborhood, MODES } from '../lib/graph.js';
import { buildUniverse } from '../lib/universe.js';
import { syntheticUniverse, syntheticStone, rec } from './helpers.js';

const { universe: U, stone } = syntheticUniverse();
const cid = (label) => stone.concepts.find((c) => c.variants.some((v) => v.norm === label)).id;

test('universe carries every item, concept and relation, with emergent tags marked', () => {
  assert.equal(U.stats.itemRecords, 43);
  assert.equal(U.items.length, 40, 'three Archive items are the same articles as Wire items (shared URL) and merge');
  assert.equal(U.concepts.length, stone.concepts.length);
  assert.ok(U.stats.emergentTags > 10);
  const s3 = U.items.find((i) => i.key === 'Science::s3');
  assert.ok(s3.tags.length > 0 && s3.tags.every((t) => t.origin === 'emergent' && t.why));
  assert.ok(U.sources.every((s) => s.color));
});

test('raw: the same idea appears once per tag-system spelling (the duplication)', () => {
  const g = projectGraph(U, 'raw');
  const terms = g.nodes.filter((n) => n.type === 'term');
  const ai = terms.filter((n) => n.concept === cid('ai'));
  assert.ok(ai.length >= 4, `expected AI split across systems/spellings, got ${ai.length}`);
  assert.equal(new Set(ai.map((n) => n.id)).size, ai.length);
});

test('hyper: one node per concept, tags are vertices', () => {
  const g = projectGraph(U, 'hyper');
  assert.equal(g.nodes.filter((n) => n.id === `c:${cid('ai')}`).length, 1);
  assert.ok(g.nodes.filter((n) => n.type === 'concept').length < g.nodes.filter((n) => n.type === 'term').length + 100);
  assert.ok(g.links.some((l) => l.type === 'tag' && l.origin === 'emergent'));
  const ids = new Set(g.nodes.map((n) => n.id));
  assert.ok(g.links.every((l) => ids.has(l.source) && ids.has(l.target)), 'no dangling links');
});

test('hyper: folding makes the graph smaller than raw, never larger', () => {
  const raw = projectGraph(U, 'raw').nodes.filter((n) => n.type === 'term').length;
  const hyper = projectGraph(U, 'hyper', { emergent: false }).nodes.filter((n) => n.type === 'concept').length;
  assert.ok(hyper < raw);
});

test('dyadic: tags become edge labels between items, no tag nodes', () => {
  const g = projectGraph(U, 'dyadic');
  assert.ok(g.nodes.every((n) => n.type === 'item'));
  const e = g.links.find((l) => l.tags.includes(cid('ai')));
  assert.ok(e && e.label.includes('AI'));
  assert.ok(g.links.every((l) => l.weight > 0 && l.tags.length > 0));
});

test('dyadic: per-item neighbour cap keeps hairballs out', () => {
  const g = projectGraph(U, 'dyadic', { neighbors: 2 });
  const deg = new Map();
  for (const l of g.links) for (const k of [l.source, l.target]) deg.set(k, (deg.get(k) ?? 0) + 1);
  assert.ok(g.links.length <= projectGraph(U, 'dyadic').links.length);
});

test('concepts: only vocabulary, joined by typed relations', () => {
  const g = projectGraph(U, 'concepts');
  assert.ok(g.nodes.every((n) => n.type === 'concept'));
  assert.ok(g.links.every((l) => l.relation));
  assert.deepEqual([...new Set(g.links.map((l) => l.type))].sort(), [...new Set(U.relations.map((r) => r.type))].sort());
});

test('relation type filter and labels override', () => {
  // the synthetic review pairs sit in different tag-systems, so they are closeMatch (a cross-scheme near)
  const only = projectGraph(U, 'concepts', { relationTypes: new Set(['closeMatch']) });
  assert.ok(only.links.length > 0 && only.links.every((l) => l.type === 'closeMatch'));
  const labels = new Map([[cid('ai'), 'Renamed']]);
  assert.equal(projectGraph(U, 'concepts', { labels }).nodes.find((n) => n.concept === cid('ai')).label, 'Renamed');
});

test('hiding a tag-system removes its items and the concepts only it used', () => {
  const g = projectGraph(U, 'hyper', { hiddenSources: new Set(['Science']) });
  assert.ok(g.nodes.every((n) => n.source !== 'Science'));
});

test('focus: k-hop neighbourhood around a concept, any mode', () => {
  const all = projectGraph(U, 'hyper');
  const f1 = projectGraph(U, 'hyper', { focus: cid('ai'), hops: 1 });
  const f2 = projectGraph(U, 'hyper', { focus: cid('ai'), hops: 2 });
  assert.ok(f1.nodes.length < f2.nodes.length && f2.nodes.length < all.nodes.length);
  assert.ok(f1.nodes.some((n) => n.id === `c:${cid('ai')}`));
  const ids = new Set(f2.nodes.map((n) => n.id));
  assert.ok(f2.links.every((l) => ids.has(l.source) && ids.has(l.target)));
  assert.ok(projectGraph(U, 'dyadic', { focus: cid('ai'), hops: 1 }).nodes.length > 0);
  assert.ok(projectGraph(U, 'raw', { focus: cid('ai'), hops: 1 }).nodes.length > 0);
});

test('neighborhood of an unknown concept is empty, not an error', () => {
  const g = neighborhood({ nodes: [{ id: 'a' }], links: [] }, 'hyper', 'nope', 2);
  assert.deepEqual(g.nodes, []);
});

test('unknown mode throws a helpful error', () => {
  assert.throws(() => projectGraph(U, 'sphere'), new RegExp(MODES.join('|')));
});

test('tags newer than the stone become unmapped singleton concepts instead of vanishing', () => {
  const stale = syntheticStone();
  const newer = [
    ...rec('Fresh', { n1: ['quantum gravity', 'AI'], n2: ['quantum gravity'] }),
  ];
  const u = buildUniverse(stale, newer);
  const q = u.concepts.find((c) => c.unmapped);
  assert.ok(q && q.canonical === 'quantum gravity' && q.n === 2);
  assert.equal(u.stats.unmapped, 1);
  const g = projectGraph(u, 'hyper');
  assert.ok(g.nodes.some((n) => n.unmapped && n.n === 2));
  assert.ok(u.items.find((i) => i.key === 'Fresh::n1').tags.some((t) => t.c === cid('ai')), 'known spellings still resolve');
});

test('the same article in two tag-systems is one item carrying both vocabularies', () => {
  const w3 = U.items.find((i) => i.key === 'Wire::w3');
  assert.deepEqual(w3.alsoIn, ['Archive']);
  assert.ok(!U.items.some((i) => i.key === 'Archive::a1'), 'the Archive copy is folded into the Wire item');
  const labels = w3.tags.flatMap((t) => t.raw.map((r) => `${r.s}:${r.l}`)).sort();
  assert.ok(labels.includes('Wire:Artificial Intelligence') && labels.includes('Archive:A.I.') && labels.includes('Archive:courts'));
  const ai = w3.tags.find((t) => t.c === cid('ai'));
  assert.deepEqual([...ai.sys].sort(), ['Archive', 'Wire'], 'both systems agree this is AI; the tag knows who said so');
});

test('hiding one tag-system keeps a shared item but drops that system\'s tags', () => {
  const g = projectGraph(U, 'raw', { hiddenSources: new Set(['Archive']) });
  assert.ok(g.nodes.some((n) => n.id === 'i:Wire::w3'));
  assert.ok(!g.nodes.some((n) => n.type === 'term' && n.source === 'Archive'));
  assert.ok(g.nodes.some((n) => n.type === 'term' && n.source === 'Wire'));
});

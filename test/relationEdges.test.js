const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const { relationEdges } = require('../src/corpus/relationEdges');
const { buildEdges } = require('../src/corpus/buildEdges');
const { mergeOverrides, buildRecords, applyUniverse } = require('../src/lib/rtagz');

// Items as rosetta-tagz leaves them: item.tags rewritten to the concepts' site
// prefLabels, and one tag reference per tag naming its concept.
function item(id, tags) {
  return {
    id: `https://example.test/${id}.html`,
    url: `https://example.test/${id}.html`,
    tags: tags.map(([label]) => label),
    _references: tags.map(([label, concept]) => ({
      type: 'tag', value: label, concept, origin: 'explicit', weight: 1,
    })),
  };
}

const PROV = {
  wasDerivedFrom: [{ type: 'cooccurrence', items: 2 }],
  wasGeneratedBy: { activity: 'relate', parameters: { minNpmi: 0.25 } },
};

// Two pieces: one carries Alpha and Beta, the other Beta and Gamma. Delta is
// a concept on no joined item; Act is a container tag.
const ITEMS = [
  item('one', [['Alpha', 'c_alpha'], ['Beta', 'c_beta'], ['Act', 'c_act']]),
  item('two', [['Beta', 'c_beta'], ['Gamma', 'c_gamma']]),
];
const CONTAINMENT = [{ id: 'container:act', tag: 'Act' }];

const rtagzWith = (relationList) => ({ built: 'x', concepts: [], relationList });

test('relationEdges: no rtagz summary, or one with no relations, gives no edges', () => {
  assert.deepStrictEqual(relationEdges(null, ITEMS), []);
  assert.deepStrictEqual(relationEdges(undefined, ITEMS), []);
  assert.deepStrictEqual(relationEdges({}, ITEMS), []);
  assert.deepStrictEqual(relationEdges({ built: 'x', concepts: [], relations: { related: 1 } }, ITEMS), []);
  assert.deepStrictEqual(relationEdges(rtagzWith([]), ITEMS), []);
  assert.deepStrictEqual(relationEdges(rtagzWith([{ a: 'c_alpha', b: 'c_beta', type: 'related' }]), []), []);
});

test('relationEdges: a symmetric relation is one undirected edge per unordered pair, a → b as rosetta-tagz wrote it', () => {
  const edges = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'related', weight: 0.6 },
    { a: 'c_beta', b: 'c_alpha', type: 'related', weight: 0.6 },
    { a: 'c_alpha', b: 'c_beta', type: 'related', weight: 0.6 },
  ]), ITEMS);
  assert.deepStrictEqual(edges, [{
    source: 'tag:Alpha',
    target: 'tag:Beta',
    directed: false,
    role: 'related',
    layer: 'related',
    attrs: { concept: 'c_alpha', target: 'c_beta', weight: 0.6 },
  }]);
  // Each undirected type is its own edge on the same pair; each is once.
  const typed = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'closeMatch' },
    { a: 'c_beta', b: 'c_alpha', type: 'closeMatch' },
    { a: 'c_alpha', b: 'c_beta', type: 'relatedMatch' },
    { a: 'c_alpha', b: 'c_beta', type: 'exactMatch' },
  ]), ITEMS);
  assert.deepStrictEqual(typed.map((e) => [e.layer, e.role, e.directed]), [
    ['closeMatch', 'closeMatch', false],
    ['relatedMatch', 'relatedMatch', false],
    ['exactMatch', 'exactMatch', false],
  ]);
});

test('relationEdges: broader {a, b} (a is broader than b) is drawn from the narrower b to the broader a', () => {
  // The arrow points at the broader concept: source is the narrower tag,
  // target the broader. attrs keep the pair as rosetta-tagz wrote it.
  const edges = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'broader', weight: 1, why: 'every item with Beta also carries Alpha' },
  ]), ITEMS);
  assert.deepStrictEqual(edges, [{
    source: 'tag:Beta',
    target: 'tag:Alpha',
    directed: true,
    role: 'broader',
    layer: 'broader',
    attrs: { concept: 'c_alpha', target: 'c_beta', weight: 1, why: 'every item with Beta also carries Alpha' },
  }]);
  // The same assertion listed twice is one edge.
  assert.strictEqual(relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'broader' },
    { a: 'c_alpha', b: 'c_beta', type: 'broader' },
  ]), ITEMS).length, 1);
});

test('relationEdges: broadMatch {a, b} is written as broader is (a the broader concept), so it is drawn b → a too', () => {
  // rtz-stone renames a cross-scheme broader to broadMatch and keeps the
  // pair, so a is the broader concept in both (docs/POST-PIPE-USES-RTAGZ.md).
  const edges = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'broadMatch', weight: 0.7 },
  ]), ITEMS);
  assert.deepStrictEqual(edges, [{
    source: 'tag:Beta',
    target: 'tag:Alpha',
    directed: true,
    role: 'broadMatch',
    layer: 'broadMatch',
    attrs: { concept: 'c_alpha', target: 'c_beta', weight: 0.7 },
  }]);
});

test('relationEdges: the first entry for a pair wins when a later one disagrees on weight or why', () => {
  const [related] = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'related', weight: 0.6, why: 'first' },
    { a: 'c_beta', b: 'c_alpha', type: 'related', weight: 0.9, why: 'second' },
  ]), ITEMS);
  assert.deepStrictEqual(related.attrs, { concept: 'c_alpha', target: 'c_beta', weight: 0.6, why: 'first' });
  const [broader] = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'broader', weight: 1 },
    { a: 'c_alpha', b: 'c_beta', type: 'broader', weight: 0.8, why: 'later' },
  ]), ITEMS);
  assert.deepStrictEqual(broader.attrs, { concept: 'c_alpha', target: 'c_beta', weight: 1 });
});

test('relationEdges: an endpoint exists only where a tag edge does; a container tag or a concept on no joined item gives no edge', () => {
  const edges = relationEdges(rtagzWith([
    // Act is a container tag: intercepted by containment in buildEdges, no tag node.
    { a: 'c_act', b: 'c_alpha', type: 'broader' },
    { a: 'c_alpha', b: 'c_act', type: 'related' },
    // Delta is a tag on no joined item.
    { a: 'c_delta', b: 'c_beta', type: 'related' },
    { a: 'c_beta', b: 'c_delta', type: 'broader' },
    // Gamma and Beta are both tags on a joined item: this one is drawn.
    { a: 'c_gamma', b: 'c_beta', type: 'related' },
  ]), ITEMS, { containment: CONTAINMENT });
  assert.deepStrictEqual(edges.map((e) => [e.source, e.target]), [['tag:Gamma', 'tag:Beta']]);
  // Without the containment setting, Act is an ordinary tag and gets its edges.
  const noContainment = relationEdges(rtagzWith([
    { a: 'c_act', b: 'c_alpha', type: 'broader' },
  ]), ITEMS);
  assert.deepStrictEqual(noContainment.map((e) => [e.source, e.target]), [['tag:Alpha', 'tag:Act']]);
});

test('relationEdges: a relation to an external vocabulary\'s concept, or of a type that is not drawn, gives no edge', () => {
  const edges = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'voc:20000763', type: 'exactMatch', weight: 1 },
    { a: 'c_beta', b: 'voc:20000763', type: 'broadMatch', weight: 0.5 },
    { a: 'c_alpha', b: 'c_beta', type: 'narrower' },
    { a: 'c_alpha', b: 'c_beta', type: 'narrowMatch' },
    { a: 'c_alpha', b: 'c_beta', type: 'near' },
    { a: 'c_alpha', b: 'c_beta', type: 'adjacent' },
    { a: 'c_alpha', b: 'c_alpha', type: 'related' },
    { a: 'c_alpha', type: 'related' },
    null,
  ]), ITEMS);
  assert.deepStrictEqual(edges, []);
});

test('relationEdges: attrs carry weight, why and PROV where rosetta-tagz gave them, and only concept and target where it did not', () => {
  const [withProv, bare] = relationEdges(rtagzWith([
    { a: 'c_alpha', b: 'c_beta', type: 'related', weight: 0.6, why: 'co-occur on 2 of 4 items', ...PROV },
    { a: 'c_beta', b: 'c_gamma', type: 'related', weight: null, why: '', wasDerivedFrom: null, wasGeneratedBy: undefined },
  ]), ITEMS);
  assert.deepStrictEqual(withProv.attrs, {
    concept: 'c_alpha',
    target: 'c_beta',
    weight: 0.6,
    why: 'co-occur on 2 of 4 items',
    wasDerivedFrom: [{ type: 'cooccurrence', items: 2 }],
    wasGeneratedBy: { activity: 'relate', parameters: { minNpmi: 0.25 } },
  });
  assert.deepStrictEqual(bare.attrs, { concept: 'c_beta', target: 'c_gamma' });
});

// buildEdges: a tag edge's attrs gain the reference's why and PROV only when
// the reference has them. The exact three-field shape in buildEdges.test.js
// is the shape without them.
test('buildEdges: tag-edge attrs carry why and PROV from the reference when present, and the three fields alone when not', () => {
  const items = [{
    id: 'https://example.test/a.html',
    url: 'https://example.test/a.html',
    tags: ['Alpha', 'Beta', 'Gamma'],
    _references: [
      // Explicit: why is null, no PROV. The shape stays {concept, weight, origin}.
      { type: 'tag', value: 'Alpha', concept: 'c_alpha', origin: 'explicit', weight: 1, why: null },
      // Emergent with why and PROV.
      {
        type: 'tag', value: 'Beta', concept: 'c_beta', origin: 'emergent', weight: 0.7,
        why: 'text mentions "beta" ×2 (in title)',
        wasDerivedFrom: [{ type: 'text', phrase: 'beta', count: 2, inTitle: true }],
        wasGeneratedBy: { activity: 'emerge', parameters: { minDf: 2 } },
      },
      // Why without PROV.
      { type: 'tag', value: 'Gamma', concept: 'c_gamma', origin: 'discovered', weight: 0.5, why: 'recurs in 2 of 4 items' },
    ],
  }];
  const edges = buildEdges(items).filter((e) => e.layer === 'tag');
  assert.deepStrictEqual(edges.map((e) => e.attrs), [
    { concept: 'c_alpha', weight: 1, origin: 'explicit' },
    {
      concept: 'c_beta', weight: 0.7, origin: 'emergent',
      why: 'text mentions "beta" ×2 (in title)',
      wasDerivedFrom: [{ type: 'text', phrase: 'beta', count: 2, inTitle: true }],
      wasGeneratedBy: { activity: 'emerge', parameters: { minDf: 2 } },
    },
    { concept: 'c_gamma', weight: 0.5, origin: 'discovered', why: 'recurs in 2 of 4 items' },
  ]);
  // A tag with no rosetta-tagz reference keeps no attrs at all, as before.
  const [plain] = buildEdges([{ id: 'https://example.test/b.html', url: 'https://example.test/b.html', tags: ['Alpha'] }]);
  assert.ok(!('attrs' in plain));
});

// Through the seam: the canned universe applied to the fixture corpus, then
// both edge builders. Every relation edge joins two tag nodes the tag edges
// create; the mappings to the external vocabulary and the non-SKOS relation
// draw nothing.
test('relationEdges: from the canned universe, each relation edge joins two tags that have tag edges, broader drawn narrower → broader', () => {
  const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'rtagz');
  const corpus = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'corpus.json'), 'utf8'));
  const overrides = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'overrides.json'), 'utf8'));
  const universe = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'universe.json'), 'utf8'));
  const results = corpus.systems.map((sys) => ({
    ok: sys.ok !== false,
    color: sys.color || '#888888',
    config: { id: sys.id, title: sys.title },
    feedMeta: { id: sys.id, title: sys.title },
    items: JSON.parse(JSON.stringify(sys.items || [])),
  }));
  const containment = [{ id: 'container:act-1', tag: 'act-1' }];
  const { systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergeOverrides(overrides, containment));
  const { summary } = applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, { built: 'x', stages: [] }, { siteTitle: 'Fixture Site' });

  const items = results.flatMap((r) => r.items);
  const tagEdges = buildEdges(items, { containment });
  const edges = relationEdges(summary, items, { containment });

  assert.deepStrictEqual(edges.map((e) => [e.layer, e.source, e.target, e.directed]), [
    ['related', 'tag:Artificial Intelligence', 'tag:Machine Learning', false],
    ['broader', 'tag:neural hardware', 'tag:Artificial Intelligence', true],
  ]);
  const tagTargets = new Set(tagEdges.filter((e) => e.layer === 'tag').map((e) => e.target));
  for (const e of edges) {
    assert.ok(tagTargets.has(e.source), `${e.source} has a tag edge`);
    assert.ok(tagTargets.has(e.target), `${e.target} has a tag edge`);
  }
  assert.deepStrictEqual(edges[1].attrs, {
    concept: 'c_ai',
    target: 'u_neural_hardware',
    weight: 1,
    why: 'every item with neural hardware also carries Artificial Intelligence',
    wasDerivedFrom: [{ type: 'cooccurrence', items: 1 }],
    wasGeneratedBy: { activity: 'relate', parameters: { broaderP: 0.8, narrowerMaxP: 0.6, minSupport: 1 } },
  });
  // The emergent tag edges carry rosetta-tagz's why and PROV; an explicit one
  // carries the PROV the universe wrote on it (ingested categories) and no
  // why, its why being null; the fixture's act-1 tag entry has no PROV, and
  // act-1 is the container tag, so no tag edge is without a rosetta-tagz reference.
  const wire2Emergent = tagEdges.find((e) => e.source === 'wire-2' && e.target === 'tag:Artificial Intelligence');
  assert.ok(wire2Emergent, 'wire-2 has the emergent tag edge');
  assert.strictEqual(wire2Emergent.attrs.why, 'text mentions "artificial intelligence" ×2 (in title)');
  assert.deepStrictEqual(wire2Emergent.attrs.wasGeneratedBy, { activity: 'emerge', parameters: { minDf: 2 } });
  const explicit = tagEdges.find((e) => e.layer === 'tag' && e.attrs && e.attrs.origin === 'explicit');
  assert.deepStrictEqual(Object.keys(explicit.attrs), ['concept', 'weight', 'origin', 'wasDerivedFrom', 'wasGeneratedBy']);
  assert.deepStrictEqual(explicit.attrs.wasGeneratedBy, { activity: 'ingest' });
});

// The corpus → graph seam. buildEdges is the whole contract between what
// post-pipe knows about a body of work and what any renderer can draw, so it
// is the one function worth pinning down hardest.

const { test } = require('node:test');
const assert = require('node:assert');
const { buildEdges, nonTagReferences, referenceEdgeLabel } = require('../src/corpus/buildEdges');

const item = (slug, extra = {}) => ({
  id: `https://example.test/${slug}.html`,
  url: `https://example.test/${slug}.html`,
  title: slug,
  ...extra,
});

test('emits nothing for a corpus with no relations', () => {
  assert.deepStrictEqual(buildEdges([item('alone')]), []);
});

test('authored connected_to resolves a slug to the target item id', () => {
  const items = [item('a', { connected_to: ['b'] }), item('b')];
  const [edge] = buildEdges(items);
  assert.strictEqual(edge.source, 'https://example.test/a.html');
  assert.strictEqual(edge.target, 'https://example.test/b.html');
  assert.strictEqual(edge.role, 'connected_to');
  assert.strictEqual(edge.layer, 'authored');
  assert.strictEqual(edge.directed, true, 'A claims B; B need not reciprocate');
  assert.strictEqual(edge.attrs.resolved, true);
});

test('an authored edge to an unwritten piece survives as a slug', () => {
  // The case that broke the old bipartite renderer: three pieces point at
  // topology-method, which has no bundle. The edge must not be dropped —
  // a piece that is planned but unwritten still shapes the topology.
  const [edge] = buildEdges([item('a', { connected_to: ['not-yet-written'] })]);
  assert.strictEqual(edge.target, 'not-yet-written');
  assert.strictEqual(edge.attrs.resolved, false);
});

test('tags and topology are separate layers with separate roles', () => {
  const edges = buildEdges([item('a', { tags: ['x'], topology: ['y'] })]);
  const tag = edges.find((e) => e.layer === 'tag');
  const topo = edges.find((e) => e.layer === 'topology');
  assert.strictEqual(tag.target, 'tag:x');
  assert.strictEqual(tag.role, 'tagged');
  assert.strictEqual(tag.directed, false, 'membership has no direction');
  assert.strictEqual(topo.target, 'topology:y');
  assert.strictEqual(topo.role, 'exhibits');
  assert.notStrictEqual(tag.layer, topo.layer, 'they cluster differently, so they stay separable');
});

test('a series becomes an ordered path, not a cluster', () => {
  // The relation a serialized novel needs. Chapters arrive out of order.
  const items = [
    item('ch3', { series: 'series-a', series_part: 3 }),
    item('ch1', { series: 'series-a', series_part: 1 }),
    item('ch2', { series: 'series-a', series_part: 2 }),
  ];
  const seq = buildEdges(items).filter((e) => e.layer === 'sequence');
  assert.strictEqual(seq.length, 2, 'n chapters produce n-1 links, not n^2');
  assert.ok(seq.every((e) => e.directed && e.role === 'next'));
  assert.deepStrictEqual(
    seq.map((e) => [e.attrs.from_part, e.attrs.to_part]),
    [[1, 2], [2, 3]],
    'ordered by series_part regardless of corpus order',
  );
});

test('two series do not link into each other', () => {
  const items = [
    item('a1', { series: 'one', series_part: 1 }),
    item('b1', { series: 'two', series_part: 1 }),
  ];
  assert.strictEqual(buildEdges(items).filter((e) => e.layer === 'sequence').length, 0);
});

test('every edge carries the fields a renderer dispatches on', () => {
  const edges = buildEdges([item('a', { tags: ['x'], connected_to: ['b'] }), item('b')]);
  for (const e of edges) {
    assert.ok(typeof e.source === 'string' && e.source);
    assert.ok(typeof e.target === 'string' && e.target);
    assert.strictEqual(typeof e.directed, 'boolean');
    assert.ok(typeof e.role === 'string' && e.role);
    assert.ok(typeof e.layer === 'string' && e.layer);
  }
});

test('hierarchical containment connects parent to child and eliminates radial tag lines', () => {
  const containment = [
    { id: 'container:epic', label: 'The Epic', parent: null, tag: 'epic' },
    { id: 'container:act-1', label: 'Act 1', parent: 'container:epic', tag: 'act-1' },
  ];
  const items = [
    item('ch1', { tags: ['epic', 'act-1', 'philosophy'] }),
    item('ch2', { tags: ['epic', 'act-1'] }),
  ];

  const edges = buildEdges(items, { containment });
  const containmentEdges = edges.filter((e) => e.layer === 'containment');
  const tagEdges = edges.filter((e) => e.layer === 'tag');

  // Hierarchy edge: Epic contains Act 1
  const hierarchyEdge = containmentEdges.find(
    (e) => e.source === 'container:epic' && e.target === 'container:act-1'
  );
  assert.ok(hierarchyEdge, 'Epic must contain Act 1');
  assert.strictEqual(hierarchyEdge.role, 'contains');

  // Member edges: Act 1 contains each chapter
  const ch1Edge = containmentEdges.find(
    (e) => e.source === 'container:act-1' && e.target === 'https://example.test/ch1.html'
  );
  const ch2Edge = containmentEdges.find(
    (e) => e.source === 'container:act-1' && e.target === 'https://example.test/ch2.html'
  );
  assert.ok(ch1Edge, 'Act 1 contains ch1');
  assert.ok(ch2Edge, 'Act 1 contains ch2');

  // Tag lines to epic and act-1 are eliminated!
  assert.strictEqual(tagEdges.filter((e) => e.target === 'tag:epic').length, 0);
  assert.strictEqual(tagEdges.filter((e) => e.target === 'tag:act-1').length, 0);

  // But regular non-containment tags still get their tag edge
  assert.strictEqual(tagEdges.filter((e) => e.target === 'tag:philosophy').length, 1);
});


test('connected_to between series neighbours folds into the one next edge', () => {
  // prev/next written as connected_to both ways: three edges per pair before.
  const items = Array.from({ length: 11 }, (_, i) => item('ch' + (i + 1), {
    series: 'act', series_part: i + 1,
    connected_to: [i > 0 ? 'ch' + i : null, i < 10 ? 'ch' + (i + 2) : null].filter(Boolean),
  }));
  const edges = buildEdges(items);
  assert.strictEqual(edges.length, 10, 'eleven chapters, ten next edges, nothing else');
  assert.ok(edges.every((e) => e.layer === 'sequence' && e.role === 'next'));
  assert.deepStrictEqual([...edges[0].attrs.authored].sort(), ['backward', 'forward']);
});

test('connected_to that is not a series neighbour stays', () => {
  const items = [
    item('ch1', { series: 's', series_part: 1, connected_to: ['ch3'] }),
    item('ch2', { series: 's', series_part: 2 }),
    item('ch3', { series: 's', series_part: 3, connected_to: ['ch2'] }),
  ];
  const edges = buildEdges(items);
  const authored = edges.filter((e) => e.layer === 'authored');
  assert.strictEqual(authored.length, 1);
  assert.strictEqual(authored[0].target, 'https://example.test/ch3.html');
  assert.strictEqual(edges.filter((e) => e.layer === 'sequence').length, 2);
});

test('tag edges carry concept, weight, and origin attrs from _references when present', () => {
  const items = [
    item('a', {
      tags: ['Artificial Intelligence'],
      _references: [
        { type: 'tag', value: 'Artificial Intelligence', concept: 'c_ai', weight: 1, origin: 'explicit' },
      ],
    }),
  ];
  const [edge] = buildEdges(items);
  assert.deepStrictEqual(edge.attrs, { concept: 'c_ai', weight: 1, origin: 'explicit' });
});

test('non-tag _references emit reference edges with types and weights while keeping item.tags behaviour', () => {
  const items = [
    item('a', {
      tags: ['AI'],
      _references: [
        { type: 'tag', value: 'AI' },
        { type: 'image', value: 'covers/shared.png', weight: 0.75, why: 'shared diagram' },
        { type: 'person', value: 'Ada Lovelace' },
        { type: 'cite', value: 'b', weight: 0.9, directed: true },
      ],
    }),
    item('b', {
      tags: ['History'],
      _references: [
        { type: 'image', value: 'covers/shared.png', weight: 0.5 },
      ],
    }),
  ];

  assert.deepStrictEqual(nonTagReferences(items[0]), [
    { type: 'image', value: 'covers/shared.png', weight: 0.75, why: 'shared diagram' },
    { type: 'person', value: 'Ada Lovelace', weight: 1 },
    { type: 'cite', value: 'b', weight: 0.9, directed: true },
  ]);

  const edges = buildEdges(items);
  const tagEdges = edges.filter((e) => e.layer === 'tag');
  assert.strictEqual(tagEdges.length, 2, 'item.tags behaviour preserved for sites without rosetta-tagz');
  assert.strictEqual(tagEdges[0].target, 'tag:AI');
  assert.strictEqual(tagEdges[1].target, 'tag:History');

  const refEdges = edges.filter((e) => e.layer === 'reference');
  assert.strictEqual(refEdges.length, 4);

  const imgEdgeA = refEdges.find((e) => e.source === items[0].id && e.role === 'image');
  assert.strictEqual(imgEdgeA.target, 'image:covers/shared.png');
  assert.strictEqual(imgEdgeA.directed, false);
  assert.deepStrictEqual(imgEdgeA.attrs, {
    type: 'image',
    value: 'covers/shared.png',
    weight: 0.75,
    why: 'shared diagram',
  });
  assert.strictEqual(referenceEdgeLabel(imgEdgeA), 'image (0.75)\nshared diagram');

  const personEdge = refEdges.find((e) => e.role === 'person');
  assert.strictEqual(personEdge.target, 'person:Ada Lovelace');
  assert.deepStrictEqual(personEdge.attrs, {
    type: 'person',
    value: 'Ada Lovelace',
    weight: 1,
  });
  assert.strictEqual(referenceEdgeLabel(personEdge), 'person');

  const citeEdge = refEdges.find((e) => e.role === 'cite');
  assert.strictEqual(citeEdge.target, items[1].id, 'reference value matching an item slug resolves to that item id');
  assert.strictEqual(citeEdge.directed, true);
  assert.deepStrictEqual(citeEdge.attrs, {
    type: 'cite',
    value: 'b',
    weight: 0.9,
  });
});

// The tag references are the source of the tag edges (src/lib/tagReferences.js);
// item.tags stands in only when the item has none.
test('tag references with an empty tags list still make the tag edges, in the references\' order, with their attrs', () => {
  const containment = [{ id: 'container:act-1', tag: 'act-1', concept: 'c_act_1' }];
  const items = [item('a', {
    tags: [],
    _references: [
      { type: 'tag', value: 'Beta', concept: 'c_beta', weight: 0.7, origin: 'emergent', why: 'text mentions "beta" ×2' },
      { type: 'untagged', why: ['under the bar'], reason: 'underBar' },
      { type: 'tag', value: 'Act One', concept: 'c_act_1', weight: 1, origin: 'explicit', why: null },
      { type: 'tag', value: 'Alpha', concept: 'c_alpha', weight: 1, origin: 'explicit', why: null },
    ],
  })];
  const edges = buildEdges(items, { containment });
  assert.deepStrictEqual(edges.filter((e) => e.layer === 'tag').map((e) => [e.target, e.attrs]), [
    ['tag:Beta', { concept: 'c_beta', weight: 0.7, origin: 'emergent', why: 'text mentions "beta" ×2' }],
    ['tag:Alpha', { concept: 'c_alpha', weight: 1, origin: 'explicit' }],
  ]);
  // The reference naming the container's concept is containment, as it is from item.tags.
  assert.deepStrictEqual(
    edges.filter((e) => e.layer === 'containment').map((e) => [e.source, e.target]),
    [['container:act-1', items[0].id]]
  );
  // The same with no tags list at all, and an adapter's reference without rosetta-tagz's fields.
  const noList = buildEdges([item('b', { _references: [{ type: 'tag', value: 'Alpha' }] })]);
  assert.deepStrictEqual(noList.map((e) => e.target), ['tag:Alpha']);
  assert.ok(!('attrs' in noList[0]));
});

test('tags with no references still make the tag edges (the fallback), as before', () => {
  const containment = [{ id: 'container:act-1', tag: 'act-1' }];
  const edges = buildEdges([item('a', { tags: ['Gamma', 'act-1', 'Alpha'] })], { containment });
  assert.deepStrictEqual(edges.map((e) => [e.layer, e.target]), [
    ['tag', 'tag:Gamma'],
    ['tag', 'tag:Alpha'],
    ['containment', 'https://example.test/a.html'],
  ]);
  assert.ok(edges.filter((e) => e.layer === 'tag').every((e) => !('attrs' in e)));
  // References of other types do not stop the fallback.
  const withImage = buildEdges([item('b', { tags: ['Alpha'], _references: [{ type: 'image', value: 'covers/b.png' }] })]);
  assert.deepStrictEqual(withImage.map((e) => [e.layer, e.target]), [['tag', 'tag:Alpha'], ['reference', 'image:covers/b.png']]);
});

test('an item with both gets the same edges, in the same order, as its tags gave before', () => {
  const refs = [
    { type: 'tag', value: 'Alpha', concept: 'c_alpha', weight: 1, origin: 'explicit', why: null },
    { type: 'tag', value: 'Beta', concept: 'c_beta', weight: 0.7, origin: 'emergent', why: 'text mentions "beta" ×2', sourceRatio: 2.1 },
    { type: 'tag', value: 'Gamma', concept: 'c_gamma', weight: 0.5, origin: 'discovered', why: 'recurs in 2 of 4 items' },
  ];
  const both = item('a', { tags: ['Alpha', 'Beta', 'Gamma'], _references: refs, topology: ['loop'] });
  const edges = buildEdges([both]);
  assert.deepStrictEqual(edges.map((e) => [e.layer, e.target]), [
    ['tag', 'tag:Alpha'], ['tag', 'tag:Beta'], ['tag', 'tag:Gamma'], ['topology', 'topology:loop'],
  ]);
  assert.deepStrictEqual(edges.slice(0, 3).map((e) => e.attrs), [
    { concept: 'c_alpha', weight: 1, origin: 'explicit' },
    { concept: 'c_beta', weight: 0.7, origin: 'emergent', why: 'text mentions "beta" ×2', sourceRatio: 2.1 },
    { concept: 'c_gamma', weight: 0.5, origin: 'discovered', why: 'recurs in 2 of 4 items' },
  ]);
  // The same item with its tags list emptied, or without one, gives the same edges.
  assert.deepStrictEqual(buildEdges([{ ...both, tags: [] }]), edges);
  const { tags, ...noList } = both;
  assert.deepStrictEqual(buildEdges([noList]), edges);
});

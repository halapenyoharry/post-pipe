// A tag's network: its relatives through rosetta-tagz's relation edges, the
// strongest first, kept aside from the graph's links.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  RELATION_LAYERS, STRONGEST, isRelationEdge, relativesOf, relationLabel, wrapText,
} = require('../src/lib/tagNetwork');
const { relationEdges } = require('../src/corpus/relationEdges');

const rel = (source, target, layer, weight, why) => ({
  source: `tag:${source}`,
  target: `tag:${target}`,
  layer,
  role: layer,
  directed: layer === 'broader' || layer === 'broadMatch',
  attrs: { ...(weight === undefined ? {} : { weight }), ...(why ? { why } : {}) },
});

test('the relation layers are the SKOS names rosetta-tagz writes, and five show at first', () => {
  assert.deepStrictEqual(RELATION_LAYERS.slice().sort(), ['broadMatch', 'broader', 'closeMatch', 'exactMatch', 'related', 'relatedMatch']);
  assert.strictEqual(STRONGEST, 5);
});

test('a relation edge joins two tags on a relation layer; nothing else is one', () => {
  assert.ok(isRelationEdge(rel('a', 'b', 'related', 0.4)));
  assert.ok(isRelationEdge(rel('a', 'b', 'broader', 1)));
  assert.ok(!isRelationEdge({ source: 'i1', target: 'tag:a', layer: 'tag' }));
  assert.ok(!isRelationEdge({ source: 'i1', target: 'tag:a', layer: 'related' }), 'a piece at one end');
  assert.ok(!isRelationEdge({ source: 'tag:a', target: 'tag:a', layer: 'related' }), 'a tag to itself');
  assert.ok(!isRelationEdge({ source: 'tag:a', target: 'tag:b', layer: 'sequence' }));
  assert.ok(!isRelationEdge({ source: 'tag:a', target: 'tag:b', layer: 'narrower' }));
  assert.ok(!isRelationEdge(null));
});

test('every edge relationEdges writes is a relation edge', () => {
  const items = [
    { id: 'i1', tags: ['Alpha', 'Beta'], _references: [{ type: 'tag', value: 'Alpha', concept: 'c_a' }, { type: 'tag', value: 'Beta', concept: 'c_b' }] },
  ];
  const rtagz = { relationList: [{ a: 'c_a', b: 'c_b', type: 'broader', weight: 1 }, { a: 'c_a', b: 'c_b', type: 'related', weight: 0.3 }] };
  const edges = relationEdges(rtagz, items);
  assert.strictEqual(edges.length, 2);
  for (const e of edges) assert.ok(isRelationEdge(e), e.layer);
});

test('the strongest relatives first, five of them, the rest counted', () => {
  const relations = [
    rel('x', 'a', 'related', 0.1),
    rel('b', 'x', 'related', 0.9),
    rel('x', 'c', 'relatedMatch', 0.5),
    rel('x', 'd', 'related', 0.3),
    rel('e', 'x', 'related', 0.7),
    rel('x', 'f', 'related', 0.2),
    rel('x', 'g', 'related', 0.6),
    rel('q', 'r', 'related', 1),
  ];
  const net = relativesOf(relations, 'tag:x');
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:b', 'tag:e', 'tag:g', 'tag:c', 'tag:d']);
  assert.strictEqual(net.total, 7);
  assert.strictEqual(net.more, 2);
  const all = relativesOf(relations, 'tag:x', { limit: Infinity });
  assert.deepStrictEqual(all.relatives.map((r) => r.id), ['tag:b', 'tag:e', 'tag:g', 'tag:c', 'tag:d', 'tag:f', 'tag:a']);
  assert.strictEqual(all.more, 0);
});

test('a relative not drawn is left out before counting, so the five are five drawn ones', () => {
  const relations = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((t, i) => rel('x', t, 'related', 1 - i / 10));
  const hidden = new Set(['tag:a', 'tag:c']);
  const net = relativesOf(relations, 'tag:x', { visible: (id) => !hidden.has(id) });
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:b', 'tag:d', 'tag:e', 'tag:f', 'tag:g']);
  assert.strictEqual(net.total, 5);
  assert.strictEqual(net.more, 0);
});

test('two relations between one pair are one relative, at the stronger weight, strongest relation first', () => {
  const relations = [rel('x', 'a', 'related', 0.3, 'they co-occur'), rel('a', 'x', 'broader', 1, 'a is broader')];
  const net = relativesOf(relations, 'tag:x');
  assert.strictEqual(net.relatives.length, 1);
  assert.strictEqual(net.relatives[0].weight, 1);
  assert.deepStrictEqual(net.relatives[0].relations.map((r) => r.layer), ['broader', 'related']);
});

test('broader and broadMatch name the broader end: the edge\'s target', () => {
  const up = relativesOf([rel('x', 'a', 'broader', 1)], 'tag:x');
  assert.strictEqual(up.relatives[0].broader, 'tag:a', 'x is narrower than a: the arrow points at a');
  const down = relativesOf([rel('a', 'x', 'broadMatch', 1)], 'tag:x');
  assert.strictEqual(down.relatives[0].broader, 'tag:x', 'a is narrower than x: the arrow points at x');
  const flat = relativesOf([rel('x', 'a', 'related', 1)], 'tag:x');
  assert.strictEqual(flat.relatives[0].broader, null);
});

test('without a weight a relation comes after every weighted one; ties go by id, nothing else', () => {
  const relations = [rel('x', 'z', 'related'), rel('x', 'c', 'related', 0.5), rel('x', 'b', 'related', 0.5), rel('x', 'a', 'related')];
  const net = relativesOf(relations, 'tag:x', { limit: Infinity });
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:b', 'tag:c', 'tag:a', 'tag:z']);
  assert.strictEqual(net.relatives[2].weight, null);
});

test('where a tag came from does not order its relatives', () => {
  const a = rel('x', 'a', 'related', 0.5);
  const b = rel('x', 'b', 'related', 0.5);
  a.attrs.origin = 'explicit';
  b.attrs.origin = 'discovered';
  const one = relativesOf([b, a], 'tag:x').relatives.map((r) => r.id);
  b.attrs.origin = 'explicit';
  a.attrs.origin = 'discovered';
  const two = relativesOf([b, a], 'tag:x').relatives.map((r) => r.id);
  assert.deepStrictEqual(one, ['tag:a', 'tag:b']);
  assert.deepStrictEqual(two, one);
});

test('ends already bound to nodes are read through their ids; no relations, no tag, no relatives', () => {
  const r = { source: { id: 'tag:x' }, target: { id: 'tag:a' }, layer: 'related', attrs: { weight: 0.2 } };
  assert.deepStrictEqual(relativesOf([r], 'tag:x').relatives.map((e) => e.id), ['tag:a']);
  assert.deepStrictEqual(relativesOf([], 'tag:x'), { relatives: [], total: 0, more: 0 });
  assert.deepStrictEqual(relativesOf(undefined, 'tag:x'), { relatives: [], total: 0, more: 0 });
  assert.deepStrictEqual(relativesOf([r], null), { relatives: [], total: 0, more: 0 });
  assert.deepStrictEqual(relativesOf([{ ...r, layer: 'tag' }], 'tag:x').relatives, [], 'an edge on another layer');
});

test('the hover label: type and weight, then the why, for each relation', () => {
  const why = '"active" and "carrying" share 2 of their 6 and 5 items, more than chance predicts (NPMI 0.48)';
  const label = relationLabel([rel('active', 'carrying', 'related', 0.3206, why), rel('active', 'carrying', 'broader')]);
  const lines = label.split('\n');
  assert.strictEqual(lines[0], 'related · weight 0.3206');
  assert.strictEqual(lines.slice(1, -1).join(' '), why);
  for (const l of lines) assert.ok(l.length <= 48, `line within 48: ${l}`);
  assert.strictEqual(lines[lines.length - 1], 'broader', 'no weight, no why: the type alone');
  assert.strictEqual(relationLabel([]), '');
});

test('text wraps at spaces; a long word keeps a line of its own', () => {
  assert.deepStrictEqual(wrapText('one two three four', 9), ['one two', 'three', 'four']);
  assert.deepStrictEqual(wrapText('a supercalifragilistic b', 6), ['a', 'supercalifragilistic', 'b']);
  assert.deepStrictEqual(wrapText('', 10), []);
  assert.deepStrictEqual(wrapText('  spaced   out  ', 40), ['spaced out']);
});

// ── Relatives folded into other tags' bubbles (the depth chosen) ─────────

const {
  FOLDED_PREF, FOLDED_CHOICES, foldedChoice, drawnRelativesOf, relativeLabel,
} = require('../src/lib/tagNetwork');

// bubbleOf from a plain map of folded tag -> the tag whose bubble shows it.
const foldedInto = (map) => (id) => map[id];

test('the folded choice has a plain key; anything but omit is the default, the bubble', () => {
  assert.strictEqual(FOLDED_PREF, 'foldedRelatives');
  assert.deepStrictEqual(FOLDED_CHOICES, ['bubble', 'omit']);
  assert.strictEqual(foldedChoice(null), 'bubble');
  assert.strictEqual(foldedChoice(undefined), 'bubble');
  assert.strictEqual(foldedChoice('bubble'), 'bubble');
  assert.strictEqual(foldedChoice('nonsense'), 'bubble');
  assert.strictEqual(foldedChoice('omit'), 'omit');
});

test('with nothing folded the drawn relatives are relativesOf\'s, unchanged, and so are their labels', () => {
  const relations = [
    rel('x', 'a', 'related', 0.1, 'x and a'),
    rel('b', 'x', 'related', 0.9),
    rel('x', 'c', 'relatedMatch', 0.5),
    rel('x', 'd', 'broader', 0.3, 'd is broader'),
    rel('e', 'x', 'broadMatch', 0.7),
    rel('x', 'f', 'related'),
    rel('x', 'g', 'related', 0.6),
    rel('x', 'g', 'closeMatch', 0.2),
    rel('q', 'r', 'related', 1),
  ];
  const hidden = new Set(['tag:c']);
  const cases = [
    {},
    { limit: Infinity },
    { limit: 2 },
    { visible: (id) => !hidden.has(id) },
  ];
  for (const opts of cases) {
    const plain = relativesOf(relations, 'tag:x', opts);
    for (const extra of [{}, { bubbleOf: () => undefined }, { bubbleOf: (id) => id }, { folded: 'omit' }]) {
      const drawn = drawnRelativesOf(relations, 'tag:x', { ...opts, ...extra });
      assert.strictEqual(drawn.from, 'tag:x');
      assert.deepStrictEqual(drawn.relatives, plain.relatives, JSON.stringify(Object.keys({ ...opts, ...extra })));
      assert.strictEqual(drawn.total, plain.total);
      assert.strictEqual(drawn.more, plain.more);
      for (const r of drawn.relatives) {
        assert.strictEqual(r.members, undefined, 'a relative in its own bubble has no members');
        assert.strictEqual(relativeLabel(r), relationLabel(r.relations));
      }
    }
  }
  assert.deepStrictEqual(drawnRelativesOf(relations, null), { from: null, relatives: [], total: 0, more: 0 });
  assert.deepStrictEqual(drawnRelativesOf(undefined, 'tag:x'), { from: 'tag:x', relatives: [], total: 0, more: 0 });
});

test('several relatives folded into one bubble draw one line to it, at the strongest of their weights', () => {
  const relations = [
    rel('x', 'jazz', 'related', 0.2, 'x and jazz share pieces'),
    rel('blues', 'x', 'related', 0.6, 'x and blues share pieces'),
    rel('x', 'soul', 'relatedMatch'),
    rel('x', 'd', 'related', 0.4),
    rel('x', 'e', 'related', 0.9),
  ];
  const bubbleOf = foldedInto({ 'tag:jazz': 'tag:music', 'tag:blues': 'tag:music', 'tag:soul': 'tag:music' });
  const net = drawnRelativesOf(relations, 'tag:x', { bubbleOf });
  assert.strictEqual(net.from, 'tag:x');
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:e', 'tag:music', 'tag:d'], 'the bubble sits among the strongest at its strongest member\'s weight');
  assert.strictEqual(net.total, 3, 'one bubble counts once');
  assert.strictEqual(net.more, 0);
  const music = net.relatives[1];
  assert.strictEqual(music.weight, 0.6);
  assert.deepStrictEqual(music.members.map((m) => m.id), ['tag:blues', 'tag:jazz', 'tag:soul'], 'the members strongest first, the unweighted last');
  assert.deepStrictEqual(music.members.map((m) => m.weight), [0.6, 0.2, null]);
  assert.deepStrictEqual(music.relations.map((r) => r.layer), ['related', 'related', 'relatedMatch']);
  assert.strictEqual(music.broader, null, 'no directed relation, no arrow');

  // The hover label names each folded relative, with its type, weight and why.
  const lines = relativeLabel(music).split('\n');
  assert.deepStrictEqual(lines, [
    'blues · related · weight 0.6',
    'x and blues share pieces',
    'jazz · related · weight 0.2',
    'x and jazz share pieces',
    'soul · relatedMatch',
  ]);
  for (const l of relativeLabel(music, { width: 20 }).split('\n')) assert.ok(l.length <= 20 || !l.includes(' '), `wrapped: ${l}`);
  assert.strictEqual(relativeLabel(music, { nameOf: (id) => id.toUpperCase() }).split('\n')[0], 'TAG:BLUES · related · weight 0.6');
});

test('a bubble whose own tag is a relative lists it with the relatives folded into it', () => {
  const relations = [rel('x', 'music', 'related', 0.3, 'x and music'), rel('x', 'jazz', 'related', 0.5, 'x and jazz')];
  const net = drawnRelativesOf(relations, 'tag:x', { bubbleOf: foldedInto({ 'tag:jazz': 'tag:music' }) });
  assert.strictEqual(net.relatives.length, 1);
  assert.strictEqual(net.relatives[0].id, 'tag:music');
  assert.strictEqual(net.relatives[0].weight, 0.5);
  assert.deepStrictEqual(net.relatives[0].members.map((m) => m.id), ['tag:jazz', 'tag:music']);
  assert.deepStrictEqual(relativeLabel(net.relatives[0]).split('\n'), [
    'jazz · related · weight 0.5', 'x and jazz', 'music · related · weight 0.3', 'x and music',
  ]);
});

test('the omit choice leaves folded relatives out before counting; relatives in their own bubbles stay', () => {
  const relations = [
    rel('x', 'jazz', 'related', 0.95),
    rel('x', 'blues', 'related', 0.9),
    rel('x', 'music', 'related', 0.1),
    ...['a', 'b', 'c', 'd', 'e', 'f'].map((t, i) => rel('x', t, 'related', 0.8 - i / 10)),
  ];
  const bubbleOf = foldedInto({ 'tag:jazz': 'tag:music', 'tag:blues': 'tag:music' });
  const omitted = drawnRelativesOf(relations, 'tag:x', { bubbleOf, folded: 'omit' });
  assert.deepStrictEqual(omitted.relatives.map((r) => r.id), ['tag:a', 'tag:b', 'tag:c', 'tag:d', 'tag:e']);
  assert.strictEqual(omitted.total, 7, 'six own bubbles and music, which is a relative itself');
  assert.strictEqual(omitted.more, 2);
  const music = drawnRelativesOf(relations, 'tag:x', { bubbleOf, folded: 'omit', limit: Infinity }).relatives.find((r) => r.id === 'tag:music');
  assert.strictEqual(music.members, undefined, 'music is drawn for its own relation alone');
  assert.strictEqual(music.weight, 0.1);
  const drawn = drawnRelativesOf(relations, 'tag:x', { bubbleOf });
  assert.deepStrictEqual(drawn.relatives.map((r) => r.id), ['tag:music', 'tag:a', 'tag:b', 'tag:c', 'tag:d'], 'by default the bubble leads, at 0.95');
  assert.strictEqual(drawn.total, 7);
});

test('a selected tag folded into a bubble draws from that bubble; a relative in the same bubble draws nothing', () => {
  const relations = [
    rel('jazz', 'music', 'broader', 1, 'jazz is narrower than music'),
    rel('jazz', 'blues', 'related', 0.8, 'jazz and blues'),
    rel('jazz', 'improv', 'related', 0.4, 'jazz and improv'),
    rel('swing', 'jazz', 'broader', 0.7, 'swing is narrower than jazz'),
    rel('jazz', 'art', 'broader', 0.3, 'jazz is narrower than art'),
  ];
  const bubbleOf = foldedInto({ 'tag:jazz': 'tag:music', 'tag:blues': 'tag:music' });
  for (const folded of FOLDED_CHOICES) {
    const net = drawnRelativesOf(relations, 'tag:jazz', { bubbleOf, folded, limit: Infinity });
    assert.strictEqual(net.from, 'tag:music', folded);
    assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:swing', 'tag:improv', 'tag:art'], `${folded}: music (its own bubble) and blues (folded into it too) draw nothing`);
    const byId = new Map(net.relatives.map((r) => [r.id, r]));
    assert.strictEqual(byId.get('tag:swing').broader, 'tag:music', 'jazz is the broader end: the arrow lands on the bubble showing it');
    assert.strictEqual(byId.get('tag:art').broader, 'tag:art');
    assert.strictEqual(byId.get('tag:improv').broader, null);
    assert.strictEqual(byId.get('tag:improv').members, undefined);
  }
});

test('a relation between two tags folded into one bubble draws nothing, whichever of them is selected', () => {
  const relations = [rel('jazz', 'blues', 'related', 0.8), rel('music', 'blues', 'broader', 1)];
  const bubbleOf = foldedInto({ 'tag:jazz': 'tag:music', 'tag:blues': 'tag:music' });
  for (const tag of ['tag:jazz', 'tag:blues', 'tag:music']) {
    const net = drawnRelativesOf(relations, tag, { bubbleOf });
    assert.deepStrictEqual(net.relatives, [], tag);
    assert.strictEqual(net.total, 0);
  }
});

test('a folded relative whose bubble is not drawn is left out, as a hidden relative is', () => {
  const relations = [rel('x', 'jazz', 'related', 0.5), rel('x', 'a', 'related', 0.4)];
  const bubbleOf = foldedInto({ 'tag:jazz': 'tag:music' });
  const visibleIds = new Set(['tag:x', 'tag:a', 'tag:jazz']);
  const net = drawnRelativesOf(relations, 'tag:x', { bubbleOf, visible: (id) => visibleIds.has(id) });
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:a'], 'visible is asked of the bubble, not of the folded tag');
  assert.strictEqual(net.total, 1);
});

test('a bubble\'s arrow points where its members\' directed relations agree, and nowhere when they disagree', () => {
  const bubbleOf = foldedInto({ 'tag:jazz': 'tag:music', 'tag:blues': 'tag:music' });
  const up = drawnRelativesOf([rel('x', 'jazz', 'broader', 0.5), rel('x', 'blues', 'related', 0.4)], 'tag:x', { bubbleOf });
  assert.strictEqual(up.relatives[0].broader, 'tag:music', 'x is narrower than jazz: the arrow lands on the bubble');
  const down = drawnRelativesOf([rel('jazz', 'x', 'broadMatch', 0.5), rel('blues', 'x', 'broader', 0.4)], 'tag:x', { bubbleOf });
  assert.strictEqual(down.relatives[0].broader, 'tag:x', 'both are narrower than x: the arrow lands on x');
  const both = drawnRelativesOf([rel('x', 'jazz', 'broader', 0.5), rel('blues', 'x', 'broader', 0.4)], 'tag:x', { bubbleOf });
  assert.strictEqual(both.relatives[0].broader, null);
  assert.deepStrictEqual(relativeLabel(both.relatives[0]).split('\n'), ['jazz · broader · weight 0.5', 'blues · broader · weight 0.4'], 'the label still says each');
});

test('a tag that is not present (the panel\'s source coherence ratio hides it) draws no line, folded or not, and has none of its own', () => {
  const relations = [
    rel('x', 'jazz', 'related', 0.9),
    rel('x', 'blues', 'related', 0.8),
    rel('x', 'a', 'related', 0.7),
    rel('x', 'b', 'related', 0.6),
  ];
  const bubbleOf = foldedInto({ 'tag:jazz': 'tag:music', 'tag:blues': 'tag:music' });
  const gone = new Set(['tag:jazz', 'tag:a']);
  const present = (id) => !gone.has(id);
  const net = drawnRelativesOf(relations, 'tag:x', { bubbleOf, present, limit: Infinity });
  assert.deepStrictEqual(net.relatives.map((r) => r.id), ['tag:music', 'tag:b']);
  assert.deepStrictEqual(net.relatives[0].members.map((m) => m.id), ['tag:blues'], 'the bubble stands only for the folded tag that is present');
  assert.strictEqual(net.relatives[0].weight, 0.8);
  assert.strictEqual(net.total, 2);
  const none = drawnRelativesOf(relations, 'tag:jazz', { bubbleOf, present });
  assert.deepStrictEqual(none, { from: null, relatives: [], total: 0, more: 0 }, 'a selected tag not present has no lines');
  assert.deepStrictEqual(drawnRelativesOf(relations, 'tag:x', { bubbleOf, present: () => true }), drawnRelativesOf(relations, 'tag:x', { bubbleOf }), 'everything present is as without it');
});

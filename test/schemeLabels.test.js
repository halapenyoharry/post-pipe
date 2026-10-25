// What a tag is called through a scheme and a depth (src/lib/schemeLabels.js).
// The default, the site's scheme at depth 0, is today's label for every
// concept; anything else is a prefLabel the stone wrote or a vocabulary's own
// label, never an invention.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { schemesOf, labelFor, groupsFor, migrationPairs, SITE_SCHEME } = require('../src/lib/schemeLabels');

const universe = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/stone/universe.json'), 'utf8'));

// A feed._stone shaped as the seam writes it (src/lib/stone.js), hand-built
// from the fixture universe: concepts with id, canonical, inScheme, prefLabel,
// broader and mappings; schemes; external.
function stoneFromUniverse() {
  const broaderOf = new Map();
  for (const r of universe.relations) {
    if (r.type !== 'broader') continue;
    if (!broaderOf.has(r.b)) broaderOf.set(r.b, []);
    broaderOf.get(r.b).push(r.a);
  }
  const concepts = universe.concepts.map((c) => {
    const sc = {
      id: c.id,
      canonical: c.canonical,
      pinned: Boolean(c.pinned),
      discovered: Boolean(c.discovered),
      items: c.items,
      forms: {},
      rank: [],
      inScheme: c.inScheme,
      prefLabel: { ...c.prefLabel },
    };
    const b = broaderOf.get(c.id);
    if (b) sc.broader = b;
    const mappings = universe.relations
      .filter((r) => r.a === c.id && universe.external[r.b])
      .map((r) => ({ type: r.type, target: r.b, weight: r.weight, why: r.why }));
    if (mappings.length) sc.mappings = mappings;
    if (c.ledger) sc.ledger = { ...c.ledger };
    return sc;
  });
  return {
    built: universe.generated,
    systems: {
      Posts: { sourceId: 'posts', color: '#2ecc71' },
      ScienceWire: { sourceId: 'wire', color: '#3498db' },
      Journal: { sourceId: 'journal', color: '#e67e22' },
    },
    concepts,
    unjoined: [],
    skippedDuplicateIds: [],
    schemes: [
      { id: 'site', label: 'The Example Site', kind: 'site' },
      { id: 'Posts', label: 'Posts', kind: 'system', sourceId: 'posts' },
      { id: 'ScienceWire', label: 'ScienceWire', kind: 'system', sourceId: 'wire' },
      { id: 'Journal', label: 'Journal', kind: 'system', sourceId: 'journal' },
      { id: 'discovered', label: 'discovered', kind: 'discovered' },
      { id: 'iptc-mediatopics', label: 'IPTC Media Topics', kind: 'external', license: 'CC BY 4.0' },
    ],
    external: JSON.parse(JSON.stringify(universe.external)),
  };
}

const stone = stoneFromUniverse();
const feed = { items: [], edges: [], _stone: stone };

test('schemesOf: the stone\'s schemes, each with an id; nothing without a stone', () => {
  assert.deepStrictEqual(schemesOf(feed).map((s) => s.id), ['site', 'Posts', 'ScienceWire', 'Journal', 'discovered', 'iptc-mediatopics']);
  assert.deepStrictEqual(schemesOf({ items: [], edges: [] }), []);
  assert.deepStrictEqual(schemesOf(null), []);
  assert.deepStrictEqual(schemesOf({ _stone: { schemes: [{ id: 'a' }, { label: 'no id' }, null] } }).map((s) => s.id), ['a']);
});

test('the site scheme at depth 0 is today\'s label for every concept', () => {
  for (const c of stone.concepts) {
    const r = labelFor(stone, c.id, {});
    assert.strictEqual(r.label, c.canonical, c.id);
    assert.strictEqual(r.scheme, SITE_SCHEME);
    assert.strictEqual(r.fallback, false);
    assert.strictEqual(r.groupId, c.id);
  }
  // A feed stands in for its stone; an unknown scheme string is the site's.
  assert.strictEqual(labelFor(feed, 'c_ai', { scheme: null, depth: null }).label, 'Artificial Intelligence');
});

test('a system scheme shows that system\'s own spelling', () => {
  assert.deepStrictEqual(labelFor(stone, 'c_ai', { scheme: 'Journal' }), { label: 'AI', scheme: 'Journal', fallback: false, groupId: 'c_ai' });
  assert.deepStrictEqual(labelFor(stone, 'c_machine_learning', { scheme: 'Posts' }), { label: 'machine-learning', scheme: 'Posts', fallback: false, groupId: 'c_machine_learning' });
  assert.strictEqual(labelFor(stone, 'c_ai', { scheme: 'ScienceWire' }).label, 'A.I.');
});

test('fallback order: the chosen scheme, then the site\'s, then the majority system, then discovered', () => {
  // act-1 is only in Posts: in the Journal scheme the site's label stands in.
  const r = labelFor(stone, 'c_act_1', { scheme: 'Journal' });
  assert.deepStrictEqual(r, { label: 'act-1', scheme: 'site', fallback: true, groupId: 'c_act_1' });

  // A concept with no site label: the majority system's spelling, read
  // through the pieces' source ids, stands in.
  const bare = {
    concepts: [{ id: 'c_x', inScheme: ['Posts', 'Journal'], prefLabel: { Posts: 'x-posts', Journal: 'X Journal' } }],
    schemes: stone.schemes,
    systems: stone.systems,
  };
  assert.deepStrictEqual(
    labelFor(bare, 'c_x', { scheme: 'ScienceWire', systems: ['journal', 'journal', 'posts'] }),
    { label: 'X Journal', scheme: 'Journal', fallback: true, groupId: 'c_x' },
  );
  // Then the discovered scheme.
  const disc = {
    concepts: [{ id: 'c_y', inScheme: ['discovered'], prefLabel: { discovered: 'neural hardware' } }],
    schemes: stone.schemes,
  };
  assert.deepStrictEqual(
    labelFor(disc, 'c_y', { scheme: 'Posts' }),
    { label: 'neural hardware', scheme: 'discovered', fallback: true, groupId: 'c_y' },
  );
  // The majority system is never counted as a fallback when it is the chosen scheme.
  assert.strictEqual(labelFor(bare, 'c_x', { scheme: 'Posts', systems: ['posts'] }).fallback, false);
});

test('a concept the stone does not know keeps its label (null), and so does a missing stone', () => {
  assert.deepStrictEqual(labelFor(stone, 'c_nobody', {}), { label: null, scheme: null, fallback: false, groupId: 'c_nobody' });
  assert.deepStrictEqual(labelFor(null, 'c_ai', {}), { label: null, scheme: null, fallback: false, groupId: 'c_ai' });
  assert.deepStrictEqual(labelFor({ items: [] }, 'c_ai', {}), { label: null, scheme: null, fallback: false, groupId: 'c_ai' });
});

test('depth walks up skos:broader within the scheme and stops at a top concept', () => {
  // neural hardware is narrower than Artificial Intelligence.
  const one = labelFor(stone, 'u_neural_hardware', { depth: 1 });
  assert.deepStrictEqual(one, { label: 'Artificial Intelligence', scheme: 'site', fallback: false, groupId: 'c_ai' });
  // Artificial Intelligence has no broader concept: depth 2 stops there.
  const two = labelFor(stone, 'u_neural_hardware', { depth: 2 });
  assert.deepStrictEqual(two, one);
  assert.strictEqual(labelFor(stone, 'c_ai', { depth: 2 }).groupId, 'c_ai');
  // Read in another scheme, the broader concept's spelling there.
  assert.deepStrictEqual(labelFor(stone, 'u_neural_hardware', { scheme: 'Journal', depth: 1 }), { label: 'AI', scheme: 'Journal', fallback: false, groupId: 'c_ai' });
  // A broader concept not in the chosen scheme is not climbed to: the walk
  // stays where it is and the fallback applies.
  const narrow = {
    concepts: [
      { id: 'c_top', inScheme: ['Posts'], prefLabel: { Posts: 'Top' } },
      { id: 'c_leaf', inScheme: ['Journal'], prefLabel: { Journal: 'Leaf' }, broader: ['c_top'] },
    ],
    schemes: stone.schemes,
  };
  assert.deepStrictEqual(labelFor(narrow, 'c_leaf', { scheme: 'Journal', depth: 1 }), { label: 'Leaf', scheme: 'Journal', fallback: false, groupId: 'c_leaf' });
  assert.deepStrictEqual(labelFor(narrow, 'c_leaf', { scheme: 'Posts', depth: 1 }), { label: 'Top', scheme: 'Posts', fallback: false, groupId: 'c_top' });
});

test('an external scheme is reached through exactMatch, then broadMatch, and climbs the vocabulary', () => {
  const ext = 'iptc-mediatopics';
  assert.deepStrictEqual(labelFor(stone, 'c_ai', { scheme: ext }), {
    label: 'artificial intelligence', scheme: ext, fallback: false, groupId: 'iptc-mediatopics:20000763',
  });
  // Machine Learning has only a broadMatch there: the same target.
  assert.deepStrictEqual(labelFor(stone, 'c_machine_learning', { scheme: ext }), {
    label: 'artificial intelligence', scheme: ext, fallback: false, groupId: 'iptc-mediatopics:20000763',
  });
  // Depth climbs the vocabulary's own broader chain (_stone.external).
  assert.deepStrictEqual(labelFor(stone, 'c_ai', { scheme: ext, depth: 1 }), {
    label: 'technology and engineering', scheme: ext, fallback: false, groupId: 'iptc-mediatopics:20000756',
  });
  assert.strictEqual(labelFor(stone, 'c_ai', { scheme: ext, depth: 2 }).label, 'science and technology');
  // and stops at the top.
  assert.strictEqual(labelFor(stone, 'c_ai', { scheme: ext, depth: 5 }).groupId, 'iptc-mediatopics:13000000');
  // A concept with no mapping into the vocabulary falls back to the site's label.
  assert.deepStrictEqual(labelFor(stone, 'c_act_1', { scheme: ext }), { label: 'act-1', scheme: 'site', fallback: true, groupId: 'c_act_1' });
  // exactMatch wins over broadMatch when a concept has both.
  const both = {
    concepts: [{ id: 'c_b', canonical: 'B', prefLabel: { site: 'B' }, mappings: [
      { type: 'broadMatch', target: 'iptc-mediatopics:20000756' },
      { type: 'exactMatch', target: 'iptc-mediatopics:20000763' },
    ] }],
    schemes: stone.schemes,
    external: stone.external,
  };
  assert.strictEqual(labelFor(both, 'c_b', { scheme: ext }).groupId, 'iptc-mediatopics:20000763');
});

test('groupsFor: which tags fall together at a scheme and depth', () => {
  const ids = ['c_ai', 'c_machine_learning', 'u_neural_hardware', 'c_act_1', 'c_nobody'];
  const flat = groupsFor(stone, ids, {});
  assert.deepStrictEqual([...flat.entries()], ids.map((id) => [id, id]));
  const up = groupsFor(stone, ids, { depth: 1 });
  assert.strictEqual(up.get('u_neural_hardware'), 'c_ai');
  assert.strictEqual(up.get('c_ai'), 'c_ai');
  assert.strictEqual(up.get('c_nobody'), 'c_nobody');
  const ext = groupsFor(stone, ids, { scheme: 'iptc-mediatopics' });
  assert.strictEqual(ext.get('c_ai'), 'iptc-mediatopics:20000763');
  assert.strictEqual(ext.get('c_machine_learning'), 'iptc-mediatopics:20000763');
  assert.strictEqual(ext.get('c_act_1'), 'c_act_1');
});

test('migrationPairs: label keys to concept keys, bare and under each layout, from today\'s label and the ledger\'s', () => {
  const placeOf = (layout) => `${layout}@h::`;
  const nodes = [
    { id: 'tag:Machine Learning', label: 'Machine Learning', type: 'tag', concept: 'c_machine_learning', previousLabel: 'machine learning' },
    { id: 'tag:plain', label: 'plain', type: 'tag' },
    { id: 'piece-1', type: 'article', originalItem: { id: 'https://x/1' } },
  ];
  const pairs = migrationPairs(nodes, placeOf);
  assert.deepStrictEqual(pairs, [
    ['tag:Machine Learning', 'concept:c_machine_learning'],
    ['force@h::tag:Machine Learning', 'force@h::concept:c_machine_learning'],
    ['radial@h::tag:Machine Learning', 'radial@h::concept:c_machine_learning'],
    ['timeline@h::tag:Machine Learning', 'timeline@h::concept:c_machine_learning'],
    ['tag:machine learning', 'concept:c_machine_learning'],
    ['force@h::tag:machine learning', 'force@h::concept:c_machine_learning'],
    ['radial@h::tag:machine learning', 'radial@h::concept:c_machine_learning'],
    ['timeline@h::tag:machine learning', 'timeline@h::concept:c_machine_learning'],
  ]);
  assert.deepStrictEqual(migrationPairs(nodes), [
    ['tag:Machine Learning', 'concept:c_machine_learning'],
    ['tag:machine learning', 'concept:c_machine_learning'],
  ]);
  assert.deepStrictEqual(migrationPairs([{ id: 'tag:plain', label: 'plain', type: 'tag' }], placeOf), [], 'no stone, no pairs');
});

// Through the seam itself: the fixture corpus and universe run through
// buildRecords and applyUniverse (src/lib/stone.js), so the shape labelFor
// reads is the one the build writes, not this file's hand-made one. The
// default reading is today's canonical for every concept, and the majority
// fallback resolves a piece's source id through the schemes' sourceId.
test('labelFor reads the _stone the seam writes: the default is every canonical, and source ids reach the majority fallback', () => {
  const { mergeOverrides, buildRecords, applyUniverse } = require('../src/lib/stone');
  const corpus = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/stone/corpus.json'), 'utf8'));
  const overrides = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/stone/overrides.json'), 'utf8'));
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

  assert.ok(summary.concepts.length > 0);
  for (const c of summary.concepts) {
    const r = labelFor(summary, c.id, {});
    assert.strictEqual(r.label, c.canonical, c.id);
    assert.strictEqual(r.fallback, false, c.id);
    assert.strictEqual(r.groupId, c.id);
  }
  // Every scheme the build lists for a tag-system names its source id, and a
  // piece's _source.id is one of them.
  const systemSchemes = summary.schemes.filter((s) => s.kind === 'system');
  assert.ok(systemSchemes.length > 0);
  const sourceIds = new Set(results.flatMap((r) => r.items).map((it) => it._source && it._source.id).filter(Boolean));
  for (const s of systemSchemes) assert.ok(typeof s.sourceId === 'string' && s.sourceId, s.id);
  assert.ok(systemSchemes.some((s) => sourceIds.has(s.sourceId) || Object.values(summary.systems).some((info) => info.sourceId === s.sourceId)));
  // A system scheme's spelling, read through the build's shape, and the
  // same walk up broader as the hand-made stone gives.
  const ai = summary.concepts.find((c) => c.id === 'c_ai');
  const journal = systemSchemes.find((s) => Object.keys(ai.prefLabel || {}).includes(s.id));
  assert.ok(journal, 'c_ai has a system scheme label');
  assert.strictEqual(labelFor(summary, 'c_ai', { scheme: journal.id }).label, ai.prefLabel[journal.id]);
  assert.strictEqual(labelFor(summary, 'u_neural_hardware', { depth: 1 }).groupId, 'c_ai');
  // The majority fallback through real source ids: a concept with no label
  // in the chosen scheme, whose pieces come from one system.
  const act = summary.concepts.find((c) => c.id === 'c_act_1');
  const other = systemSchemes.find((s) => !(act.inScheme || []).includes(s.id));
  if (act && other) {
    const r = labelFor(summary, 'c_act_1', { scheme: other.id, systems: [...sourceIds] });
    assert.strictEqual(r.fallback, true);
    assert.strictEqual(r.label, 'act-1');
  }
});

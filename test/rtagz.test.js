const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { loadCorpus } = require('../src/aggregator');
const { buildEdges } = require('../src/corpus/buildEdges');
const {
  htmlToText,
  canonicalUrl,
  cacheDirForSite,
  mergeOverrides,
  buildConfig,
  buildRecords,
  checkContainerGuard,
  applyUniverse,
  rtagzSettings,
  runRtagzPhase,
} = require('../src/lib/rtagz');

const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'rtagz');
const CORPUS_FIXTURE = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'corpus.json'), 'utf8'));
const OVERRIDES_FIXTURE = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'overrides.json'), 'utf8'));
const UNIVERSE_FIXTURE = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'universe.json'), 'utf8'));

function cloneResults(systems = CORPUS_FIXTURE.systems) {
  return systems.map((sys) => ({
    ok: sys.ok !== false,
    color: sys.color || '#888888',
    config: { id: sys.id, title: sys.title },
    feedMeta: { id: sys.id, title: sys.title },
    items: JSON.parse(JSON.stringify(sys.items || [])),
  }));
}

function entriesFromResults(results) {
  return results.map((r) => ({
    adapter: {
      id: 'mock',
      load: async () => ({
        items: JSON.parse(JSON.stringify(r.items)),
        feedMeta: { id: r.feedMeta.id, title: r.feedMeta.title },
      }),
    },
    config: {
      id: r.config.id,
      title: r.config.title,
      customColor: r.color,
    },
  }));
}

test('rtagz: record writing handles untagged items, shared urls, duplicate feed titles, ignored tags, and duplicate item ids', () => {
  const results = cloneResults();
  // Add a second feed with the same title "Journal" to verify disambiguation
  results.push({
    ok: true,
    color: '#9b59b6',
    config: { id: 'https://journal2.test/atom', title: 'Journal' },
    feedMeta: { id: 'https://journal2.test/atom', title: 'Journal' },
    items: [
      {
        id: 'j2-1',
        url: 'https://journal2.test/a',
        title: 'Second Journal Piece',
        summary: 'Summary text.',
        date_published: '2026-10-07T00:00:00Z',
        kind: 'text',
        tags: ['AI'],
      },
    ],
  });
  // Add a failed source to verify it contributes nothing
  results.push({
    ok: false,
    color: '#000000',
    config: { id: 'https://failed.test/rss', title: 'Broken' },
    feedMeta: { id: 'https://failed.test/rss', title: 'Broken' },
    items: [],
  });

  const { records, systems, skippedDuplicateIds } = buildRecords(results, { ignore: ['UNTAGGED'] });

  assert.strictEqual(skippedDuplicateIds, 1, 'duplicate item id in Posts is skipped and counted');
  assert.ok(!systems.Broken, 'failed source is not a system');
  assert.ok(systems.Journal, 'first Journal keeps its title');
  assert.ok(systems['Journal (https://journal2.test/atom)'], 'second feed with same title gets (<feed id>) appended');
  assert.strictEqual(systems['Journal (https://journal2.test/atom)'].sourceId, 'https://journal2.test/atom');

  // HTML reduction on post-1
  const post1Item = records.find((r) => r.type === 'item' && r.source === 'Posts' && r.id === 'https://example.test/post-1.html');
  assert.ok(post1Item);
  assert.strictEqual(post1Item.text, "Notes on artificial intelligence & human memory. 'quoted' A");
  assert.strictEqual(post1Item.color, '#2ecc71');

  // Ignored tag "untagged" left out
  const post1Tags = records.filter((r) => r.type === 'tag' && r.source === 'Posts' && r.item === 'https://example.test/post-1.html');
  assert.deepStrictEqual(
    post1Tags.map((t) => ({ label: t.label, weight: t.weight, origin: t.origin })),
    [
      { label: 'act-1', weight: 1, origin: 'explicit' },
      { label: 'artificial intelligence', weight: 1, origin: 'explicit' },
      { label: 'AI', weight: 1, origin: 'explicit' },
    ]
  );

  // Item with no tags (wire-2) has an item record and zero tag records
  const wire2Item = records.find((r) => r.type === 'item' && r.source === 'ScienceWire' && r.id === 'wire-2');
  const wire2Tags = records.filter((r) => r.type === 'tag' && r.source === 'ScienceWire' && r.item === 'wire-2');
  assert.ok(wire2Item, 'untagged orphan item is written');
  assert.strictEqual(wire2Tags.length, 0, 'untagged item writes no tag records');
  assert.strictEqual(systems.ScienceWire.items, 2);
  assert.strictEqual(systems.ScienceWire.tagged, 1);

  // Shared article in two systems keeps its url in both records
  const wire1Item = records.find((r) => r.type === 'item' && r.source === 'ScienceWire' && r.id === 'wire-1');
  assert.strictEqual(canonicalUrl(post1Item.url), canonicalUrl(wire1Item.url));
});

test('rtagz: overrides merging combines site overrides with container pins, site pins winning', () => {
  const containment = [
    { id: 'container:epic', tag: 'epic' },
    { id: 'container:act-1', tag: 'act-1' },
  ];
  const merged = mergeOverrides(OVERRIDES_FIXTURE, containment);

  assert.deepStrictEqual(merged.ignore, ['untagged']);
  assert.deepStrictEqual(merged.same, [['ai', 'artificial intelligence']]);
  assert.deepStrictEqual(merged.pin, {
    ml: 'Machine Learning',
    'act-1': 'act-1',
    epic: 'epic',
  });
});

test('rtagz: build config carries the site\'s concept schemes and ledger as absolute paths', () => {
  const siteRoot = path.join(os.tmpdir(), 'postpipe-rtagz-site');
  const warned = [];
  const origWarn = console.warn;
  console.warn = (...args) => warned.push(args.join(' '));
  let cfg;
  try {
    cfg = buildConfig({
      emerge: true,
      discover: false,
      siteRoot,
      conceptSchemes: [
        { id: 'iptc-mediatopics', path: 'vocab/iptc-mediatopics.json' },
        { id: 'elsewhere', path: '/vocab/elsewhere.json' },
        { id: 'no-path' },
        null,
      ],
    });
  } finally {
    console.warn = origWarn;
  }
  // A malformed entry is one logged line naming what it lacks, not a silent drop.
  assert.deepStrictEqual(warned, [
    'rtagz: conceptSchemes[2] skipped, no path',
    'rtagz: conceptSchemes[3] skipped, no id or path',
  ]);
  assert.deepStrictEqual(cfg, {
    out: '.',
    sources: [{ adapter: 'jsonl', path: 'records.jsonl' }],
    overrides: 'overrides.json',
    emerge: true,
    discover: false,
    conceptSchemes: [
      { id: 'iptc-mediatopics', path: path.join(siteRoot, 'vocab', 'iptc-mediatopics.json') },
      { id: 'elsewhere', path: '/vocab/elsewhere.json' },
    ],
    ledger: path.join(siteRoot, 'rtagz-ids.json'),
  });

  // No schemes: the key is left out. A ledger path of the site's own is kept relative to the site.
  const plain = buildConfig({ siteRoot, ledger: 'local/ids.json' });
  assert.ok(!('conceptSchemes' in plain), 'conceptSchemes omitted when the site names none');
  assert.strictEqual(plain.ledger, path.join(siteRoot, 'local', 'ids.json'));
  assert.strictEqual(plain.emerge, true);
  assert.strictEqual(plain.discover, false);

  // ~ is the home folder, not a folder in the site.
  assert.strictEqual(buildConfig({ siteRoot, ledger: '~/ids.json' }).ledger, path.join(os.homedir(), 'ids.json'));

  // No site root: no ledger key, so nothing lands in post-pipe's own folder.
  assert.ok(!('ledger' in buildConfig({})), 'ledger omitted without a site root');
  assert.ok(!('ledger' in buildConfig({ ledger: 'ids.json' })), 'a relative ledger path needs a site root');
});

test('rtagz: the settings block is read from rtagz, and from stone, its name before 2026-10-31, with one logged line', () => {
  const warned = [];
  const origWarn = console.warn;
  console.warn = (...args) => warned.push(args.join(' '));
  try {
    assert.deepStrictEqual(rtagzSettings({ rtagz: { enabled: true } }), { enabled: true });
    assert.strictEqual(warned.length, 0, 'the current key logs nothing');
    assert.deepStrictEqual(rtagzSettings({ rtagz: { enabled: false }, stone: { enabled: true } }), { enabled: false });
    assert.strictEqual(warned.length, 0, 'rtagz wins over stone, silently');
    assert.strictEqual(rtagzSettings({ title: 'no block' }), undefined);
    assert.strictEqual(rtagzSettings(null), undefined);
    assert.strictEqual(warned.length, 0);
    assert.deepStrictEqual(rtagzSettings({ stone: { enabled: true, discover: true } }), { enabled: true, discover: true });
    assert.strictEqual(warned.length, 1);
    assert.match(warned[0], /^rtagz: the settings key "stone" is now "rtagz"/);
  } finally {
    console.warn = origWarn;
  }
});

test('rtagz: a site holding only stone.ledger.json or stone.overrides.json has them read, each with one logged line, until renamed', async () => {
  const siteRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'postpipe-rtagz-former-'));
  const warned = [];
  const origWarn = console.warn;
  console.warn = (...args) => warned.push(args.join(' '));
  try {
    // Neither file: the current names, nothing logged.
    assert.strictEqual(buildConfig({ siteRoot }).ledger, path.join(siteRoot, 'rtagz-ids.json'));
    assert.strictEqual(warned.length, 0);

    // Only the former ids file: it is the ledger, with one line.
    fs.writeFileSync(path.join(siteRoot, 'stone.ledger.json'), '{}', 'utf8');
    assert.strictEqual(buildConfig({ siteRoot }).ledger, path.join(siteRoot, 'stone.ledger.json'));
    assert.strictEqual(warned.length, 1);
    assert.match(warned[0], /^rtagz: read stone\.ledger\.json, whose name is now rtagz-ids\.json/);

    // Both: the current one, silently.
    fs.writeFileSync(path.join(siteRoot, 'rtagz-ids.json'), '{}', 'utf8');
    assert.strictEqual(buildConfig({ siteRoot }).ledger, path.join(siteRoot, 'rtagz-ids.json'));
    assert.strictEqual(warned.length, 1);

    // A ledger the settings name is used as named, whatever is in the site.
    assert.strictEqual(buildConfig({ siteRoot, ledger: 'stone.ledger.json' }).ledger, path.join(siteRoot, 'stone.ledger.json'));
    assert.strictEqual(warned.length, 1);

    // Only the former overrides file: its decisions reach rtz-build.
    fs.writeFileSync(path.join(siteRoot, 'stone.overrides.json'), JSON.stringify({ ignore: ['untagged'] }), 'utf8');
    const engine = path.join(siteRoot, 'engine');
    fs.mkdirSync(path.join(engine, 'bin'), { recursive: true });
    fs.writeFileSync(path.join(engine, 'bin', 'rtz-build'), `
      const fs = require('fs');
      fs.writeFileSync('universe.json', ${JSON.stringify(JSON.stringify(UNIVERSE_FIXTURE))});
      fs.writeFileSync('build.json', JSON.stringify({ built: '2026-10-31T12:00:00Z', stages: [] }));
    `, 'utf8');
    const cacheDir = path.join(siteRoot, 'cache');
    const res = await runRtagzPhase(cloneResults(), { rtagz: { enabled: true, engine }, siteRoot, cacheDir });
    assert.ok(res.ran, 'rosetta-tagz ran');
    assert.strictEqual(warned.length, 2);
    assert.match(warned[1], /^rtagz: read stone\.overrides\.json, whose name is now rtagz-overrides\.json/);
    const written = JSON.parse(fs.readFileSync(path.join(cacheDir, 'overrides.json'), 'utf8'));
    assert.deepStrictEqual(written.ignore, ['untagged']);
    // The cache holds the current ids file's path, now that both exist.
    const config = JSON.parse(fs.readFileSync(path.join(cacheDir, 'rtz.config.json'), 'utf8'));
    assert.strictEqual(config.ledger, path.join(siteRoot, 'rtagz-ids.json'));
  } finally {
    console.warn = origWarn;
    fs.rmSync(siteRoot, { recursive: true, force: true });
  }
});

test('rtagz: the cache folder for a site is under .feed-cache/rtagz', () => {
  const dir = cacheDirForSite('/sites/example');
  assert.strictEqual(path.dirname(dir), path.join('.feed-cache', 'rtagz'));
  assert.match(path.basename(dir), /^example-[0-9a-f]{8}$/);
});

test('rtagz: write-back from canned universe orders tags, resolves folded items, preserves unjoined, emits edge attrs, and builds feed._rtagz', () => {
  const results = cloneResults();
  const mergedOverrides = mergeOverrides(OVERRIDES_FIXTURE, [{ id: 'container:act-1', tag: 'act-1' }]);
  const { systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergedOverrides);

  const guard = checkContainerGuard(results, UNIVERSE_FIXTURE, [{ id: 'container:act-1', tag: 'act-1' }]);
  assert.strictEqual(guard.ok, true);

  const { summary } = applyUniverse(
    results,
    resultSystems,
    systems,
    skippedDuplicateIds,
    UNIVERSE_FIXTURE,
    {
      built: '2026-10-22T12:00:00.000Z',
      stages: [],
      ledger: { path: '/sites/fixture/rtagz-ids.json', minted: 4, reused: 0, retired: 0, splits: 0, merges: 0 },
    },
    { siteTitle: 'Fixture Site' }
  );

  // 1. Folded item in Posts (post-1) was folded into ScienceWire::wire-1 in universe.json,
  //    found via canonicalUrl, deduplicated, and ordered by original position:
  //    post-1 originally had ["act-1", "artificial intelligence", "AI", "untagged"].
  //    "act-1" is at index 0, "artificial intelligence"/"AI" -> "Artificial Intelligence" at index 1,
  //    and "Machine Learning" (from ScienceWire) has firstPos Infinity so it comes after post-1's own explicit tags.
  const post1 = results[0].items[0];
  assert.deepStrictEqual(post1.tags, ['act-1', 'Artificial Intelligence', 'Machine Learning']);
  assert.strictEqual(post1._references[0].type, 'image', 'non-tag reference is preserved');
  //    Each reference carries the concept's prefLabel per scheme (the external
  //    scheme's only through an exactMatch: c_ai has one, c_machine_learning's
  //    broadMatch adds nothing) and the PROV the universe wrote on the tag; the
  //    act-1 tag entry carries no PROV in the fixture, so its reference has none.
  const post1TagRefs = post1._references.filter((r) => r.type === 'tag');
  assert.deepStrictEqual(post1TagRefs, [
    {
      type: 'tag',
      value: 'act-1',
      concept: 'c_act_1',
      origin: 'explicit',
      weight: 1,
      systems: ['Posts'],
      forms: { Posts: ['act-1'] },
      via: 'known',
      why: null,
      prefLabel: { Posts: 'act-1', site: 'act-1' },
    },
    {
      type: 'tag',
      value: 'Artificial Intelligence',
      concept: 'c_ai',
      origin: 'explicit',
      weight: 1,
      systems: ['Posts', 'ScienceWire'],
      forms: { Posts: ['artificial intelligence', 'AI'], ScienceWire: ['A.I.'] },
      via: 'known',
      why: null,
      prefLabel: {
        Posts: 'artificial intelligence',
        ScienceWire: 'A.I.',
        Journal: 'AI',
        site: 'Artificial Intelligence',
        'iptc-mediatopics': 'artificial intelligence',
      },
      wasDerivedFrom: [
        { type: 'category', scheme: 'Posts', label: 'artificial intelligence' },
        { type: 'category', scheme: 'Posts', label: 'AI' },
        { type: 'category', scheme: 'ScienceWire', label: 'A.I.' },
      ],
      wasGeneratedBy: { activity: 'ingest' },
    },
    {
      type: 'tag',
      value: 'Machine Learning',
      concept: 'c_machine_learning',
      origin: 'explicit',
      weight: 1,
      systems: ['ScienceWire'],
      forms: { ScienceWire: ['Machine Learning'] },
      via: 'known',
      why: null,
      prefLabel: {
        Posts: 'machine-learning',
        ScienceWire: 'Machine Learning',
        Journal: 'ML',
        site: 'Machine Learning',
      },
      wasDerivedFrom: [{ type: 'category', scheme: 'ScienceWire', label: 'Machine Learning' }],
      wasGeneratedBy: { activity: 'ingest' },
    },
  ]);

  // 2. Journal item j-1 originally had ["ML", "AI"] -> ordered ["Machine Learning", "Artificial Intelligence"]
  //    even though universe.json lists c_ai before c_machine_learning.
  const j1 = results[2].items[0];
  assert.deepStrictEqual(j1.tags, ['Machine Learning', 'Artificial Intelligence']);

  // 3. Earned tags on wire-2 ordered by weight descending, ties alphabetical:
  //    c_ai (w: 0.7), then c_machine_learning (w: 0.5, "Machine Learning") before u_neural_hardware (w: 0.5, "neural hardware").
  const wire2 = results[1].items[1];
  assert.deepStrictEqual(wire2.tags, ['Artificial Intelligence', 'Machine Learning', 'neural hardware']);
  assert.strictEqual(wire2._references[0].origin, 'emergent');
  assert.strictEqual(wire2._references[0].why, 'text mentions "artificial intelligence" ×2 (in title)');
  assert.strictEqual(wire2._references[2].origin, 'discovered');
  //    Earned tags carry the PROV rosetta-tagz wrote: the text span and the stage.
  assert.deepStrictEqual(wire2._references[0].wasDerivedFrom, [
    { type: 'text', phrase: 'artificial intelligence', count: 2, inTitle: true },
  ]);
  assert.strictEqual(wire2._references[0].wasGeneratedBy.activity, 'emerge');
  assert.strictEqual(wire2._references[2].wasGeneratedBy.activity, 'discover');
  assert.strictEqual(wire2._references[2].wasGeneratedBy.parameters.items, 2);
  assert.deepStrictEqual(wire2._references[2].prefLabel, { discovered: 'neural hardware', site: 'neural hardware' });

  // 4. Unjoined item j-unjoined is untouched
  const jUnjoined = results[2].items[1];
  assert.deepStrictEqual(jUnjoined.tags, ['raw-only']);
  assert.strictEqual(summary.unjoined, 1);
  assert.strictEqual(summary.skippedDuplicateIds, 1);

  // 5. buildEdges emits attrs on tag edges and still intercepts container tags
  const allItems = results.flatMap((r) => r.items);
  const edges = buildEdges(allItems, {
    containment: [{ id: 'container:act-1', label: 'Act 1', parent: null, tag: 'act-1' }],
  });
  const aiEdge = edges.find((e) => e.source === post1.id && e.target === 'tag:Artificial Intelligence');
  assert.ok(aiEdge);
  //    The explicit tag's attrs carry the PROV the universe wrote on it (the
  //    categories it came from, ingested); its why is null and stays out.
  assert.deepStrictEqual(aiEdge.attrs, {
    concept: 'c_ai',
    weight: 1,
    origin: 'explicit',
    wasDerivedFrom: [
      { type: 'category', scheme: 'Posts', label: 'artificial intelligence' },
      { type: 'category', scheme: 'Posts', label: 'AI' },
      { type: 'category', scheme: 'ScienceWire', label: 'A.I.' },
    ],
    wasGeneratedBy: { activity: 'ingest' },
  });
  const act1TagEdge = edges.find((e) => e.target === 'tag:act-1');
  assert.strictEqual(act1TagEdge, undefined, 'pinned container tag is intercepted by containment');

  // 6. feed._rtagz summary has the expected shape and excludes 0-item concepts
  assert.strictEqual(summary.built, '2026-10-22T12:00:00.000Z');
  assert.deepStrictEqual(summary.systems.Posts, { sourceId: 'local://~/Posts', items: 2, tagged: 2 });
  assert.ok(!summary.concepts.some((c) => c.canonical === 'Unused Concept'), '0-item concept excluded');
  const aiConcept = summary.concepts.find((c) => c.canonical === 'Artificial Intelligence');
  assert.ok(aiConcept);
  assert.strictEqual(aiConcept.pinned, false);
  assert.strictEqual(aiConcept.discovered, false);
  assert.strictEqual(aiConcept.items, 3);
  assert.deepStrictEqual(aiConcept.forms, {
    Posts: { 'artificial intelligence': 1, AI: 1 },
    ScienceWire: { 'A.I.': 1 },
    Journal: { AI: 1 },
  });
  assert.strictEqual(aiConcept.rank[0].label, 'Artificial Intelligence');

  // 7. The SKOS side of the summary: the existing fields first, as they were,
  //    then the schemes and what the universe said about relations, mappings,
  //    untagged items, external concepts and the ledger.
  assert.deepStrictEqual(Object.keys(summary), [
    'built', 'systems', 'concepts', 'unjoined', 'skippedDuplicateIds',
    'schemes', 'relations', 'relationList', 'mappings', 'untagged', 'external', 'ledger',
  ]);

  //    schemes: the universe's list, the site scheme labelled with the site's
  //    title and each system scheme given its source id, rosetta-tagz not knowing
  //    either; the discovered scheme, which rosetta-tagz lists without a label,
  //    labelled with its id (no label is invented); the external scheme with
  //    the plan's keys only, its file path (a header key) left out of the feed.
  assert.deepStrictEqual(summary.schemes, [
    { id: 'site', label: 'Fixture Site', kind: 'site' },
    { id: 'Posts', label: 'Posts', kind: 'system', sourceId: 'local://~/Posts' },
    { id: 'ScienceWire', label: 'ScienceWire', kind: 'system', sourceId: 'https://wire.test/rss' },
    { id: 'Journal', label: 'Journal', kind: 'system', sourceId: 'https://journal.test/atom' },
    { id: 'discovered', label: 'discovered', kind: 'discovered' },
    {
      id: 'iptc-mediatopics',
      label: 'IPTC Media Topics',
      kind: 'external',
      iri: 'http://cv.iptc.org/newscodes/mediatopic/',
      license: 'CC BY 4.0',
      concepts: 3,
    },
  ]);

  //    Counts over the SKOS relations only: the adjacent one (skos: false) is not counted.
  assert.deepStrictEqual(summary.relations, { related: 1, broader: 1 });
  assert.deepStrictEqual(summary.mappings, { exactMatch: 1, broadMatch: 1 });

  //    relationList: each SKOS relation between two of rosetta-tagz's own
  //    concepts, the pair as written (broader {a, b}: a is broader than b),
  //    with its weight, why and PROV, for the relation edges. The two mappings
  //    to the external vocabulary and the adjacent relation (skos: false) are
  //    not in it.
  assert.deepStrictEqual(summary.relationList, [
    {
      a: 'c_ai',
      b: 'c_machine_learning',
      type: 'related',
      weight: 0.6,
      why: 'co-occur on 2 of 4 items (npmi 0.9)',
      wasDerivedFrom: [{ type: 'cooccurrence', items: 2 }],
      wasGeneratedBy: { activity: 'relate', parameters: { minNpmi: 0.25, minCooc: 2 } },
    },
    {
      a: 'c_ai',
      b: 'u_neural_hardware',
      type: 'broader',
      weight: 1,
      why: 'every item with neural hardware also carries Artificial Intelligence',
      wasDerivedFrom: [{ type: 'cooccurrence', items: 1 }],
      wasGeneratedBy: { activity: 'relate', parameters: { broaderP: 0.8, narrowerMaxP: 0.6, minSupport: 1 } },
    },
  ]);

  //    untagged: rosetta-tagz's note about j-unjoined, which no post-pipe item
  //    joined, keeps the id and source rosetta-tagz gave.
  assert.deepStrictEqual(summary.untagged, {
    count: 1,
    items: [{
      id: 'j-unjoined',
      source: 'Journal',
      why: ['no phrase recurs across Journal items', 'best candidate "short note" below minDf 2'],
    }],
  });

  assert.deepStrictEqual(summary.external, UNIVERSE_FIXTURE.external);
  assert.deepStrictEqual(summary.ledger, { minted: 4, reused: 0, retired: 0 });

  //    Concepts: id, inScheme, prefLabel (rosetta-tagz's own; the external label is
  //    reached through mappings and external), altLabel and mappings where they
  //    exist; broader as concept ids, from the broader relation a ⊃ b.
  assert.strictEqual(aiConcept.id, 'c_ai');
  assert.deepStrictEqual(aiConcept.inScheme, ['Posts', 'ScienceWire', 'Journal', 'site']);
  assert.deepStrictEqual(aiConcept.prefLabel, {
    Posts: 'artificial intelligence',
    ScienceWire: 'A.I.',
    Journal: 'AI',
    site: 'Artificial Intelligence',
  });
  assert.deepStrictEqual(aiConcept.altLabel, { Posts: ['AI'] });
  assert.deepStrictEqual(aiConcept.mappings, [{
    type: 'exactMatch',
    target: 'iptc-mediatopics:20000763',
    weight: 1,
    why: 'label "artificial intelligence" matches the vocabulary\'s prefLabel',
  }]);
  assert.ok(!('broader' in aiConcept), 'c_ai has nothing broader');
  //    The ledger's word on the concept, as the universe carries it.
  assert.deepStrictEqual(aiConcept.ledger, { since: '2026-10-22T12:00:00.000Z', event: 'minted' });

  const mlConcept = summary.concepts.find((c) => c.id === 'c_machine_learning');
  assert.deepStrictEqual(mlConcept.ledger, { since: '2026-10-20T12:00:00.000Z', event: 'reused', previousLabel: 'machine learning' });
  assert.deepStrictEqual(mlConcept.mappings, [{
    type: 'broadMatch',
    target: 'iptc-mediatopics:20000763',
    weight: 0.56,
    why: 'related to Artificial Intelligence, which matches artificial intelligence exactly',
  }]);
  assert.ok(!('altLabel' in mlConcept), 'an empty altLabel is not written');

  const nhConcept = summary.concepts.find((c) => c.id === 'u_neural_hardware');
  assert.deepStrictEqual(nhConcept.broader, ['c_ai']);
  assert.deepStrictEqual(nhConcept.inScheme, ['discovered', 'site']);
  assert.ok(!('mappings' in nhConcept));

  const act1Concept = summary.concepts.find((c) => c.id === 'c_act_1');
  assert.deepStrictEqual(Object.keys(act1Concept), ['canonical', 'pinned', 'discovered', 'items', 'forms', 'rank', 'id', 'inScheme', 'prefLabel']);
  assert.ok(!('ledger' in act1Concept) && !('ledger' in nhConcept), 'no ledger where the universe has none');
});

// The engine as it is today writes none of the SKOS or PROV fields. Read
// through the same code, such a universe adds the derived schemes to the
// summary and nothing else: no prefLabel or PROV on references, no relations,
// mappings, untagged, external or ledger on the summary.
function universeWithoutSkos() {
  const u = JSON.parse(JSON.stringify(UNIVERSE_FIXTURE));
  delete u.schemes;
  delete u.external;
  delete u.untagged;
  for (const r of u.relations) { delete r.skos; delete r.why; delete r.wasDerivedFrom; delete r.wasGeneratedBy; }
  for (const c of u.concepts) { delete c.inScheme; delete c.prefLabel; delete c.altLabel; delete c.ledger; }
  for (const it of u.items) for (const t of it.tags) { delete t.wasDerivedFrom; delete t.wasGeneratedBy; }
  return u;
}

test('rtagz: a universe from the current engine (no SKOS, no PROV) adds only the derived schemes', () => {
  const results = cloneResults();
  const { systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergeOverrides(OVERRIDES_FIXTURE, []));
  const { summary } = applyUniverse(
    results, resultSystems, systems, skippedDuplicateIds,
    universeWithoutSkos(),
    { built: '2026-10-22T12:00:00.000Z', stages: [] },
    { siteTitle: 'Fixture Site' }
  );

  assert.deepStrictEqual(Object.keys(summary), ['built', 'systems', 'concepts', 'unjoined', 'skippedDuplicateIds', 'schemes']);
  assert.deepStrictEqual(summary.schemes, [
    { id: 'site', label: 'Fixture Site', kind: 'site' },
    { id: 'Posts', label: 'Posts', kind: 'system', sourceId: 'local://~/Posts' },
    { id: 'ScienceWire', label: 'ScienceWire', kind: 'system', sourceId: 'https://wire.test/rss' },
    { id: 'Journal', label: 'Journal', kind: 'system', sourceId: 'https://journal.test/atom' },
  ]);
  for (const c of summary.concepts) {
    assert.deepStrictEqual(Object.keys(c), ['canonical', 'pinned', 'discovered', 'items', 'forms', 'rank', 'id'], c.canonical);
  }

  const post1 = results[0].items[0];
  assert.deepStrictEqual(post1.tags, ['act-1', 'Artificial Intelligence', 'Machine Learning']);
  assert.deepStrictEqual(post1._references.filter((r) => r.type === 'tag'), [
    { type: 'tag', value: 'act-1', concept: 'c_act_1', origin: 'explicit', weight: 1, systems: ['Posts'], forms: { Posts: ['act-1'] }, via: 'known', why: null },
    { type: 'tag', value: 'Artificial Intelligence', concept: 'c_ai', origin: 'explicit', weight: 1, systems: ['Posts', 'ScienceWire'], forms: { Posts: ['artificial intelligence', 'AI'], ScienceWire: ['A.I.'] }, via: 'known', why: null },
    { type: 'tag', value: 'Machine Learning', concept: 'c_machine_learning', origin: 'explicit', weight: 1, systems: ['ScienceWire'], forms: { ScienceWire: ['Machine Learning'] }, via: 'known', why: null },
  ]);
  const wire2 = results[1].items[1];
  for (const ref of wire2._references) {
    assert.ok(!('prefLabel' in ref) && !('wasDerivedFrom' in ref) && !('wasGeneratedBy' in ref), 'no null-valued SKOS or PROV fields');
  }
});

test('rtagz: untagged items come back on post-pipe ids through the join rule, a folded representative naming every item folded into it', () => {
  const results = cloneResults();
  const { systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergeOverrides(OVERRIDES_FIXTURE, []));
  const universe = {
    concepts: [{
      id: 'c_x', canonical: 'X', pinned: false, discovered: false, n: 1, nEmergent: 0,
      variants: [{ label: 'X', count: 1, formsBySource: { Posts: { X: 1 } } }], rank: [],
    }],
    items: [
      // post-1 (Posts) folds into this ScienceWire copy of the same article; neither carries a tag.
      { key: 'ScienceWire::wire-1', source: 'ScienceWire', url: 'https://www.EXAMPLE.test/shared-article/?utm=1#top', title: 'Thinking With Artificial Intelligence', tags: [] },
      { key: 'Posts::https://example.test/post-2.html', source: 'Posts', url: 'https://example.test/post-2.html', title: 'On Machine Learning and Systems', tags: [{ c: 'c_x', w: 1, origin: 'explicit', raw: [{ l: 'X', n: 'x', s: 'Posts' }], sys: ['Posts'], via: 'known' }] },
    ],
    relations: [],
    untagged: [
      { key: 'ScienceWire::wire-1', source: 'ScienceWire', why: ['no phrase recurs'] },
      { key: 'Journal::j-1', source: 'Journal', why: 'one reason, as a string' },
    ],
  };
  const { summary } = applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, { built: 'x', stages: [] }, { siteTitle: 'Fixture Site' });
  assert.deepStrictEqual(summary.untagged, {
    count: 3,
    items: [
      { id: 'https://example.test/post-1.html', source: 'Posts', why: ['no phrase recurs'] },
      { id: 'wire-1', source: 'ScienceWire', why: ['no phrase recurs'] },
      { id: 'j-1', source: 'Journal', why: ['one reason, as a string'] },
    ],
  });
  assert.ok(!('relations' in summary) && !('relationList' in summary) && !('mappings' in summary) && !('external' in summary) && !('ledger' in summary));
});

test('rtagz: a concept\'s own mappings[] win over the relations, and only an exactMatch lends a reference the external label', () => {
  const results = cloneResults();
  const { systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergeOverrides(OVERRIDES_FIXTURE, []));
  const universe = {
    concepts: [
      {
        id: 'c_ai', canonical: 'Artificial Intelligence', n: 1, nEmergent: 0, variants: [], rank: [],
        prefLabel: { site: 'Artificial Intelligence', Journal: 'AI' },
        mappings: [{ type: 'exactMatch', target: 'voc:1', weight: 0.9, why: 'same label' }],
      },
      {
        id: 'c_machine_learning', canonical: 'Machine Learning', n: 1, nEmergent: 0, variants: [], rank: [],
        prefLabel: { site: 'Machine Learning', Journal: 'ML' },
        mappings: [{ type: 'closeMatch', target: 'voc:1', weight: 0.5 }, { type: 'bad' }],
      },
    ],
    items: [{
      key: 'Journal::j-1', source: 'Journal', url: 'https://journal.test/ml-review', title: 'Review of Machine Learning',
      tags: [
        { c: 'c_ai', w: 1, origin: 'explicit', raw: [{ l: 'AI', n: 'ai', s: 'Journal' }], sys: ['Journal'], via: 'known' },
        { c: 'c_machine_learning', w: 1, origin: 'explicit', raw: [{ l: 'ML', n: 'ml', s: 'Journal' }], sys: ['Journal'], via: 'known' },
      ],
    }],
    // A relation that says otherwise is not consulted for a concept that carries its own mappings.
    relations: [{ a: 'c_ai', b: 'voc:2', type: 'closeMatch', weight: 0.4, skos: true }],
    external: { 'voc:1': { scheme: 'voc', prefLabel: 'One', broader: [] }, 'voc:2': { prefLabel: 'Two', broader: [] } },
  };
  const { summary } = applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, { built: 'x', stages: [] }, { siteTitle: 'Fixture Site' });

  const ai = summary.concepts.find((c) => c.id === 'c_ai');
  assert.deepStrictEqual(ai.mappings, [{ type: 'exactMatch', target: 'voc:1', weight: 0.9, why: 'same label' }]);
  const ml = summary.concepts.find((c) => c.id === 'c_machine_learning');
  assert.deepStrictEqual(ml.mappings, [{ type: 'closeMatch', target: 'voc:1', weight: 0.5 }]);
  // The counts are over the universe's relations, as the plan says.
  assert.deepStrictEqual(summary.mappings, { closeMatch: 1 });

  const j1 = results[2].items[0];
  assert.deepStrictEqual(j1.tags, ['Machine Learning', 'Artificial Intelligence']);
  const refs = j1._references.filter((r) => r.type === 'tag');
  assert.deepStrictEqual(refs[1].prefLabel, { site: 'Artificial Intelligence', Journal: 'AI', voc: 'One' });
  assert.deepStrictEqual(refs[0].prefLabel, { site: 'Machine Learning', Journal: 'ML' });
});

// A universe of two concepts in two tag-systems, built from the fixture's
// results, for reading relations back through the summary.
function twoConceptUniverse(relations, extra = {}) {
  const concept = (id, canonical, system, label, more = {}) => ({
    id, canonical, n: 1, nEmergent: 0, rank: [],
    variants: [{ label: canonical, count: 1, formsBySource: { [system]: { [label]: 1 } } }],
    inScheme: [system, 'site'], prefLabel: { [system]: label, site: canonical },
    ...more,
  });
  return {
    concepts: [
      concept('c_ai', 'Artificial Intelligence', 'Journal', 'AI', extra.ai || {}),
      concept('c_machine_learning', 'Machine Learning', 'Posts', 'machine-learning', extra.ml || {}),
    ],
    items: [{
      key: 'Journal::j-1', source: 'Journal', url: 'https://journal.test/ml-review', title: 'Review of Machine Learning',
      tags: [
        { c: 'c_ai', w: 1, origin: 'explicit', raw: [{ l: 'AI', n: 'ai', s: 'Journal' }], sys: ['Journal'], via: 'known' },
        { c: 'c_machine_learning', w: 1, origin: 'explicit', raw: [{ l: 'ML', n: 'ml', s: 'Journal' }], sys: ['Journal'], via: 'known' },
      ],
    }],
    relations,
    ...(extra.universe || {}),
  };
}

function summaryOf(universe, manifest = { built: 'x', stages: [] }) {
  const results = cloneResults();
  const { systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergeOverrides(OVERRIDES_FIXTURE, []));
  return applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, manifest, { siteTitle: 'Fixture Site' }).summary;
}

test('rtagz: an empty mappings[] or broader[] on a concept is no answer, and the relations are read', () => {
  const summary = summaryOf(twoConceptUniverse([
    { a: 'c_ai', b: 'voc:1', type: 'exactMatch', weight: 1, skos: true, why: 'same label' },
    { a: 'c_ai', b: 'c_machine_learning', type: 'broader', weight: 0.9, skos: true },
  ], {
    ai: { mappings: [] },
    ml: { broader: [] },
    universe: { external: { 'voc:1': { scheme: 'voc', prefLabel: 'One', broader: [] } } },
  }));
  const ai = summary.concepts.find((c) => c.id === 'c_ai');
  assert.deepStrictEqual(ai.mappings, [{ type: 'exactMatch', target: 'voc:1', weight: 1, why: 'same label' }]);
  const ml = summary.concepts.find((c) => c.id === 'c_machine_learning');
  assert.deepStrictEqual(ml.broader, ['c_ai']);
  assert.deepStrictEqual(summary.mappings, { exactMatch: 1 });
});

test('rtagz: a mapping listed twice is read once, and a match between two of rosetta-tagz\'s own concepts across schemes is a mapping on the first', () => {
  // broadMatch is written as broader is: a is the broader concept (AI).
  const summary = summaryOf(twoConceptUniverse([
    { a: 'c_ai', b: 'voc:1', type: 'exactMatch', weight: 1, skos: true },
    { a: 'c_ai', b: 'voc:1', type: 'exactMatch', weight: 1, skos: true },
    { a: 'c_ai', b: 'c_machine_learning', type: 'broadMatch', weight: 0.7, skos: true, why: 'every Posts item with machine-learning also carries AI' },
    { a: 'c_machine_learning', b: 'c_ai', type: 'closeMatch', weight: 0.5, skos: true },
    { a: 'c_machine_learning', b: 'c_ai', type: 'related', weight: 0.4, skos: true },
    // The same symmetric pairs the other way round: once each in the list.
    { a: 'c_ai', b: 'c_machine_learning', type: 'closeMatch', weight: 0.5, skos: true },
    { a: 'c_ai', b: 'c_machine_learning', type: 'related', weight: 0.9, skos: true, why: 'later' },
    // Not SKOS: ignored.
    { a: 'c_machine_learning', b: 'c_ai', type: 'near', weight: 0.4, skos: false },
  ], {
    ai: { mappings: [
      { type: 'closeMatch', target: 'voc:2', weight: 0.5 },
      { type: 'closeMatch', target: 'voc:2', weight: 0.5 },
    ] },
    universe: { external: { 'voc:1': { scheme: 'voc', prefLabel: 'One', broader: [] }, 'voc:2': { scheme: 'voc', prefLabel: 'Two', broader: [] } } },
  }));
  const ai = summary.concepts.find((c) => c.id === 'c_ai');
  assert.deepStrictEqual(ai.mappings, [{ type: 'closeMatch', target: 'voc:2', weight: 0.5 }], 'a concept\'s own list, read once');
  const ml = summary.concepts.find((c) => c.id === 'c_machine_learning');
  assert.deepStrictEqual(ml.mappings, [
    { type: 'closeMatch', target: 'c_ai', weight: 0.5 },
  ]);
  assert.ok(!('broader' in ml), 'a broadMatch is a mapping, not a broader concept');
  // Counts are over the relations as written, each mapping once, mappings apart from relations.
  assert.deepStrictEqual(summary.mappings, { exactMatch: 1, broadMatch: 1, closeMatch: 2 });
  assert.deepStrictEqual(summary.relations, { related: 2 });
  // The pair list holds the three between rosetta-tagz's own concepts, each
  // pair once (a symmetric one as first written, whatever a later entry
  // weighs), a cross-scheme mapping among them; the exactMatch to the
  // vocabulary and the near relation are not in it.
  assert.deepStrictEqual(summary.relationList, [
    { a: 'c_ai', b: 'c_machine_learning', type: 'broadMatch', weight: 0.7, why: 'every Posts item with machine-learning also carries AI' },
    { a: 'c_machine_learning', b: 'c_ai', type: 'closeMatch', weight: 0.5 },
    { a: 'c_machine_learning', b: 'c_ai', type: 'related', weight: 0.4 },
  ]);
});

test('rtagz: a concept flagged discovered with no inScheme still puts the discovered scheme on the list, and a bare scheme list is filled in', () => {
  const summary = summaryOf(twoConceptUniverse([], {
    ai: { discovered: true, inScheme: undefined, prefLabel: undefined },
    universe: { schemes: [{ id: 'Posts' }, { id: 'discovered' }, { id: 'site' }, { id: 'voc', label: 'A Vocabulary', path: '/x/voc.json' }] },
  }));
  assert.deepStrictEqual(summary.schemes, [
    { id: 'Posts', label: 'Posts', kind: 'system', sourceId: 'local://~/Posts' },
    { id: 'discovered', label: 'discovered', kind: 'discovered' },
    { id: 'site', label: 'Fixture Site', kind: 'site' },
    { id: 'voc', label: 'A Vocabulary' },
    { id: 'ScienceWire', label: 'ScienceWire', kind: 'system', sourceId: 'https://wire.test/rss' },
    { id: 'Journal', label: 'Journal', kind: 'system', sourceId: 'https://journal.test/atom' },
  ]);
  const ai = summary.concepts.find((c) => c.id === 'c_ai');
  assert.strictEqual(ai.discovered, true);
  assert.ok(!('inScheme' in ai));
});

test('rtagz: untagged is read from build.json when the universe lacks it, and an empty untagged list or external map writes nothing', () => {
  const fromManifest = summaryOf(twoConceptUniverse([]), {
    built: 'x', stages: [],
    untagged: [{ key: 'Journal::j-unjoined', source: 'Journal', why: ['no phrase recurs'] }],
  });
  assert.deepStrictEqual(fromManifest.untagged, {
    count: 1,
    items: [{ id: 'j-unjoined', source: 'Journal', why: ['no phrase recurs'] }],
  });

  const empty = summaryOf(twoConceptUniverse([], { universe: { untagged: [], external: {} } }), { built: 'x', stages: [], untagged: [] });
  assert.ok(!('untagged' in empty), 'an empty untagged list is not written');
  assert.ok(!('external' in empty), 'an empty external map is not written');
});

test('rtagz: with rosetta-tagz off, items and the corpus carry none of the new fields', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'postpipe-rtagz-off-'));
  try {
    const entries = entriesFromResults(cloneResults());
    const res = await loadCorpus(entries, { colorCachePath: path.join(tmpDir, 'colors.json'), siteRoot: tmpDir });
    assert.deepStrictEqual(Object.keys(res), ['items', 'sources']);
    const p1 = res.items.find((i) => i.id === 'https://example.test/post-1.html');
    assert.deepStrictEqual(p1.tags, ['act-1', 'artificial intelligence', 'AI', 'untagged']);
    assert.deepStrictEqual(p1._references, CORPUS_FIXTURE.systems[0].items[0]._references);
    for (const item of res.items) {
      for (const ref of item._references || []) {
        for (const k of ['concept', 'prefLabel', 'wasDerivedFrom', 'wasGeneratedBy', 'forms', 'systems']) {
          assert.ok(!(k in ref), `${item.id}: reference has no ${k}`);
        }
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('rtagz: skip paths (disabled, missing engine, non-zero exit, timeout, container guard) leave tags as written and log one line', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'postpipe-rtagz-skip-'));
  const colorCachePath = path.join(tmpDir, 'colors.json');

  const captureWarn = async (fn) => {
    const lines = [];
    const orig = console.warn;
    console.warn = (...args) => lines.push(args.join(' '));
    try {
      const res = await fn();
      return { res, lines };
    } finally {
      console.warn = orig;
    }
  };

  try {
    // 1. enabled: false -> no log, raw tags
    {
      const entries = entriesFromResults(cloneResults());
      const { res, lines } = await captureWarn(() =>
        loadCorpus(entries, { colorCachePath, rtagz: { enabled: false }, siteRoot: tmpDir })
      );
      assert.strictEqual(lines.length, 0);
      assert.strictEqual(res.rtagz, undefined);
      const p1 = res.items.find((i) => i.id === 'https://example.test/post-1.html');
      assert.deepStrictEqual(p1.tags, ['act-1', 'artificial intelligence', 'AI', 'untagged']);
    }

    // 2. engine path absent -> logs 1 line, raw tags
    {
      const entries = entriesFromResults(cloneResults());
      const missingEngine = path.join(tmpDir, 'no-such-engine');
      const { res, lines } = await captureWarn(() =>
        loadCorpus(entries, {
          colorCachePath,
          rtagz: { enabled: true, engine: missingEngine },
          siteRoot: tmpDir,
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /^rtagz: engine not found at .*, tags left as written$/);
      assert.strictEqual(res.rtagz, undefined);
      const p1 = res.items.find((i) => i.id === 'https://example.test/post-1.html');
      assert.deepStrictEqual(p1.tags, ['act-1', 'artificial intelligence', 'AI', 'untagged']);
    }

    // 3. non-zero exit -> logs 1 line, raw tags
    {
      const failEngine = path.join(tmpDir, 'engine-fail');
      fs.mkdirSync(path.join(failEngine, 'bin'), { recursive: true });
      fs.writeFileSync(
        path.join(failEngine, 'bin', 'rtz-build'),
        'process.stderr.write("boom\\n"); process.exit(2);\n',
        'utf8'
      );
      const entries = entriesFromResults(cloneResults());
      const { res, lines } = await captureWarn(() =>
        loadCorpus(entries, {
          colorCachePath,
          rtagz: { enabled: true, engine: failEngine },
          siteRoot: tmpDir,
          cacheDir: path.join(tmpDir, 'cache-fail'),
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /^rtagz: .*tags left as written$/);
      assert.strictEqual(res.rtagz, undefined);
      const p1 = res.items.find((i) => i.id === 'https://example.test/post-1.html');
      assert.deepStrictEqual(p1.tags, ['act-1', 'artificial intelligence', 'AI', 'untagged']);
    }

    // 4. timeout -> kills process group, logs 1 line, raw tags
    {
      const slowEngine = path.join(tmpDir, 'engine-slow');
      fs.mkdirSync(path.join(slowEngine, 'bin'), { recursive: true });
      fs.writeFileSync(
        path.join(slowEngine, 'bin', 'rtz-build'),
        'setInterval(() => {}, 1000);\n',
        'utf8'
      );
      const entries = entriesFromResults(cloneResults());
      const { res, lines } = await captureWarn(() =>
        loadCorpus(entries, {
          colorCachePath,
          rtagz: { enabled: true, engine: slowEngine, timeoutMs: 80 },
          siteRoot: tmpDir,
          cacheDir: path.join(tmpDir, 'cache-slow'),
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /timed out after 80ms.*, tags left as written/);
      assert.strictEqual(res.rtagz, undefined);
    }

    // 5. a SKOS file left in the cache by an earlier build is gone after a
    //    build that wrote none, and one this build wrote is there
    {
      const skosEngine = path.join(tmpDir, 'engine-skos');
      fs.mkdirSync(path.join(skosEngine, 'bin'), { recursive: true });
      fs.writeFileSync(path.join(skosEngine, 'bin', 'rtz-build'), `
        const fs = require('fs');
        fs.writeFileSync('universe.json', ${JSON.stringify(JSON.stringify(UNIVERSE_FIXTURE))});
        fs.writeFileSync('build.json', JSON.stringify({ built: '2026-10-22T12:00:00Z', stages: [] }));
        fs.writeFileSync('skos.ttl', '@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\\n');
      `, 'utf8');
      const cacheDir = path.join(tmpDir, 'cache-skos');
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(path.join(cacheDir, 'skos.jsonld'), '{"stale": true}', 'utf8');
      const entries = entriesFromResults(cloneResults());
      const { res, lines } = await captureWarn(() =>
        loadCorpus(entries, { colorCachePath, rtagz: { enabled: true, engine: skosEngine }, siteRoot: tmpDir, cacheDir })
      );
      assert.strictEqual(lines.length, 0);
      assert.ok(res.rtagz, 'rosetta-tagz ran');
      assert.ok(!fs.existsSync(path.join(cacheDir, 'skos.jsonld')), 'last build\'s skos.jsonld removed before the build');
      assert.ok(fs.existsSync(path.join(cacheDir, 'skos.ttl')), 'this build\'s skos.ttl kept');
    }

    // 6. container tag not canonical after build -> logs 1 line naming the tag, raw tags
    {
      const badCanonEngine = path.join(tmpDir, 'engine-bad-canon');
      fs.mkdirSync(path.join(badCanonEngine, 'bin'), { recursive: true });
      // Write a fake rtz-build that writes universe.json where c_act_1 has canonical "Act One" instead of "act-1"
      const brokenUniverse = JSON.parse(JSON.stringify(UNIVERSE_FIXTURE));
      brokenUniverse.concepts[0].canonical = 'Act One';
      const script = `
        const fs = require('fs');
        fs.writeFileSync('universe.json', ${JSON.stringify(JSON.stringify(brokenUniverse))});
        fs.writeFileSync('build.json', JSON.stringify({ built: '2026-10-22T12:00:00Z', stages: [] }));
      `;
      fs.writeFileSync(path.join(badCanonEngine, 'bin', 'rtz-build'), script, 'utf8');

      const entries = entriesFromResults(cloneResults());
      const { res, lines } = await captureWarn(() =>
        loadCorpus(entries, {
          colorCachePath,
          rtagz: { enabled: true, engine: badCanonEngine },
          containment: [{ id: 'container:act-1', tag: 'act-1' }],
          siteRoot: tmpDir,
          cacheDir: path.join(tmpDir, 'cache-guard'),
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /container tag "act-1" is not canonical after build, tags left as written/);
      assert.strictEqual(res.rtagz, undefined);
      const p1 = res.items.find((i) => i.id === 'https://example.test/post-1.html');
      assert.deepStrictEqual(p1.tags, ['act-1', 'artificial intelligence', 'AI', 'untagged']);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('rtagz: real engine integration builds universe.json and merges concepts across forms', async (t) => {
  const envEngine = process.env.POSTPIPE_RTAGZ_ENGINE;
  const fallbackEngine = path.join(__dirname, '..', 'rosetta-tagz');
  const engineDir = envEngine || fallbackEngine;
  const engineBin = path.join(engineDir, 'bin', 'rtz-build');

  if (!fs.existsSync(engineBin)) {
    t.skip(`rtz-build not found at ${engineBin}`);
    return;
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'postpipe-rtagz-real-'));
  try {
    const cacheDir = path.join(tmpDir, 'cache');
    const colorCachePath = path.join(tmpDir, 'colors.json');
    const overridesPath = path.join(tmpDir, 'rtagz-overrides.json');
    fs.writeFileSync(overridesPath, JSON.stringify({ ignore: ['untagged'] }), 'utf8');

    const entries = entriesFromResults(cloneResults());
    const { items, rtagz } = await loadCorpus(entries, {
      colorCachePath,
      siteRoot: tmpDir,
      cacheDir,
      containment: [{ id: 'container:act-1', tag: 'act-1' }],
      rtagz: {
        enabled: true,
        engine: engineDir,
        overrides: 'rtagz-overrides.json',
        emerge: true,
        discover: true,
        timeoutMs: 30000,
      },
    });

    assert.ok(fs.existsSync(path.join(cacheDir, 'universe.json')), 'universe.json written in cache');
    assert.ok(rtagz, 'loadCorpus returns the rtagz summary');
    assert.ok(Array.isArray(rtagz.concepts) && rtagz.concepts.length > 0, 'the rtagz summary has concepts');

    // Check that at least one concept has two forms across sources (e.g. AI / A.I. / artificial intelligence, or machine-learning / Machine Learning / ML)
    const multiFormConcept = rtagz.concepts.find((c) => {
      const allForms = new Set();
      for (const srcForms of Object.values(c.forms || {})) {
        for (const f of Object.keys(srcForms)) allForms.add(f);
      }
      return allForms.size >= 2;
    });
    assert.ok(multiFormConcept, 'at least one concept has two or more surface forms');

    // Container tag act-1 stayed canonical on post-1
    const post1 = items.find((i) => i.id === 'https://example.test/post-1.html');
    assert.ok(post1.tags.includes('act-1'), 'pinned container tag act-1 preserved on item');

    // What holds for the engine as it is and as it is planned: every summary
    // concept has its id, the schemes list the site and every tag-system, every
    // tag reference names a summary concept whose canonical is its value, and
    // a prefLabel, where the engine writes one, names the site scheme with the value.
    assert.ok(rtagz.concepts.every((c) => typeof c.id === 'string' && c.id), 'every summary concept carries its id');
    assert.ok(Array.isArray(rtagz.schemes), 'summary carries schemes');
    const schemeIds = rtagz.schemes.map((s) => s.id);
    for (const id of ['site', 'Posts', 'ScienceWire', 'Journal']) {
      assert.ok(schemeIds.includes(id), `scheme ${id} present`);
    }
    assert.ok(rtagz.schemes.every((s) => typeof s.label === 'string' && s.label && typeof s.kind === 'string' && s.kind));
    const canonicalById = new Map(rtagz.concepts.map((c) => [c.id, c.canonical]));
    for (const item of items) {
      for (const ref of item._references || []) {
        if (ref.type !== 'tag' || !ref.concept) continue;
        assert.strictEqual(canonicalById.get(ref.concept), ref.value, `${item.id}: ${ref.concept}`);
        if (ref.prefLabel) assert.strictEqual(ref.prefLabel.site, ref.value);
        assert.ok(ref.prefLabel !== null && ref.wasDerivedFrom !== null && ref.wasGeneratedBy !== null, 'never null-valued');
      }
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('rtagz: a discovered tag\'s sourceRatio reaches its reference, its tag edge and its concept, and only where the universe gives one', () => {
  const results = cloneResults();
  const { systems, resultSystems, skippedDuplicateIds } = buildRecords(results, mergeOverrides(OVERRIDES_FIXTURE, []));
  const concept = (id, canonical, more = {}) => ({
    id, canonical, pinned: false, discovered: false, n: 1, nEmergent: 0,
    variants: [{ label: canonical, count: 1, formsBySource: { Journal: { [canonical]: 1 } } }], rank: [], ...more,
  });
  const universe = {
    concepts: [
      concept('c_ml', 'ML'),
      concept('c_cancer', 'cancer', { discovered: true, sourceRatio: 2.964 }),
      concept('c_instead', 'instead', { discovered: true, sourceRatio: 1.008 }),
      concept('c_odd', 'odd', { discovered: true, sourceRatio: 'high' }),
    ],
    items: [{
      key: 'Journal::j-1', source: 'Journal', url: 'https://journal.test/ml-review', title: 'Review of Machine Learning',
      tags: [
        { c: 'c_ml', w: 1, origin: 'explicit', raw: [{ l: 'ML', n: 'ml', s: 'Journal' }], sys: ['Journal'], via: 'known' },
        { c: 'c_cancer', w: 0.4, origin: 'discovered', raw: [{ l: 'cancer', n: 'cancer', s: 'discovered' }], sys: ['Journal'], via: 'discovered', why: 'recurs', sourceRatio: 2.964 },
        { c: 'c_instead', w: 0.3, origin: 'discovered', raw: [{ l: 'instead', n: 'instead', s: 'discovered' }], sys: ['Journal'], via: 'discovered', why: 'recurs', sourceRatio: 1.008 },
        { c: 'c_odd', w: 0.2, origin: 'discovered', raw: [{ l: 'odd', n: 'odd', s: 'discovered' }], sys: ['Journal'], via: 'discovered', why: 'recurs', sourceRatio: 'high' },
      ],
    }],
    relations: [],
  };
  const { summary } = applyUniverse(results, resultSystems, systems, skippedDuplicateIds, universe, { built: 'x', stages: [] }, { siteTitle: 'Fixture Site' });
  const item = results.find((r) => r.feedMeta.id === 'journal' || r.feedMeta.title === 'Journal').items.find((i) => i.id === 'j-1');
  const refs = new Map(item._references.filter((r) => r.type === 'tag').map((r) => [r.value, r]));
  assert.strictEqual(refs.get('cancer').sourceRatio, 2.964);
  assert.strictEqual(refs.get('instead').sourceRatio, 1.008);
  assert.ok(!('sourceRatio' in refs.get('ML')), 'a tag a human wrote carries none');
  assert.ok(!('sourceRatio' in refs.get('odd')), 'anything but a number is no ratio');
  const concepts = new Map(summary.concepts.map((c) => [c.canonical, c]));
  assert.strictEqual(concepts.get('cancer').sourceRatio, 2.964);
  assert.strictEqual(concepts.get('instead').sourceRatio, 1.008);
  assert.ok(!('sourceRatio' in concepts.get('ML')));
  assert.ok(!('sourceRatio' in concepts.get('odd')));

  const edges = buildEdges([item]);
  const tagEdge = (label) => edges.find((e) => e.layer === 'tag' && e.target === `tag:${label}`);
  assert.strictEqual(tagEdge('cancer').attrs.sourceRatio, 2.964);
  assert.strictEqual(tagEdge('instead').attrs.sourceRatio, 1.008);
  assert.deepStrictEqual(tagEdge('ML').attrs, { concept: 'c_ml', weight: 1, origin: 'explicit' }, 'an explicit tag\'s attrs are as before');
  assert.ok(!('sourceRatio' in tagEdge('odd').attrs));
});

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
  mergeOverrides,
  buildRecords,
  checkContainerGuard,
  applyUniverse,
  runStonePhase,
} = require('../src/lib/stone');

const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'stone');
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

test('stone: record writing handles untagged items, shared urls, duplicate feed titles, ignored tags, and duplicate item ids', () => {
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

test('stone: overrides merging combines site overrides with container pins, site pins winning', () => {
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

test('stone: write-back from canned universe orders tags, resolves folded items, preserves unjoined, emits edge attrs, and builds feed._stone', () => {
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
    { built: '2026-10-22T12:00:00.000Z', stages: [] }
  );

  // 1. Folded item in Posts (post-1) was folded into ScienceWire::wire-1 in universe.json,
  //    found via canonicalUrl, deduplicated, and ordered by original position:
  //    post-1 originally had ["act-1", "artificial intelligence", "AI", "untagged"].
  //    "act-1" is at index 0, "artificial intelligence"/"AI" -> "Artificial Intelligence" at index 1,
  //    and "Machine Learning" (from ScienceWire) has firstPos Infinity so it comes after post-1's own explicit tags.
  const post1 = results[0].items[0];
  assert.deepStrictEqual(post1.tags, ['act-1', 'Artificial Intelligence', 'Machine Learning']);
  assert.strictEqual(post1._references[0].type, 'image', 'non-tag reference is preserved');
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
  assert.deepStrictEqual(aiEdge.attrs, { concept: 'c_ai', weight: 1, origin: 'explicit' });
  const act1TagEdge = edges.find((e) => e.target === 'tag:act-1');
  assert.strictEqual(act1TagEdge, undefined, 'pinned container tag is intercepted by containment');

  // 6. feed._stone summary has the expected shape and excludes 0-item concepts
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
});

test('stone: skip paths (disabled, missing engine, non-zero exit, timeout, container guard) leave tags as written and log one line', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'postpipe-stone-skip-'));
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
        loadCorpus(entries, { colorCachePath, stone: { enabled: false }, siteRoot: tmpDir })
      );
      assert.strictEqual(lines.length, 0);
      assert.strictEqual(res.stone, undefined);
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
          stone: { enabled: true, engine: missingEngine },
          siteRoot: tmpDir,
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /^stone: engine not found at .*, tags left as written$/);
      assert.strictEqual(res.stone, undefined);
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
          stone: { enabled: true, engine: failEngine },
          siteRoot: tmpDir,
          cacheDir: path.join(tmpDir, 'cache-fail'),
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /^stone: .*tags left as written$/);
      assert.strictEqual(res.stone, undefined);
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
          stone: { enabled: true, engine: slowEngine, timeoutMs: 80 },
          siteRoot: tmpDir,
          cacheDir: path.join(tmpDir, 'cache-slow'),
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /timed out after 80ms.*, tags left as written/);
      assert.strictEqual(res.stone, undefined);
    }

    // 5. container tag not canonical after build -> logs 1 line naming the tag, raw tags
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
          stone: { enabled: true, engine: badCanonEngine },
          containment: [{ id: 'container:act-1', tag: 'act-1' }],
          siteRoot: tmpDir,
          cacheDir: path.join(tmpDir, 'cache-guard'),
        })
      );
      assert.strictEqual(lines.length, 1);
      assert.match(lines[0], /container tag "act-1" is not canonical after build, tags left as written/);
      assert.strictEqual(res.stone, undefined);
      const p1 = res.items.find((i) => i.id === 'https://example.test/post-1.html');
      assert.deepStrictEqual(p1.tags, ['act-1', 'artificial intelligence', 'AI', 'untagged']);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('stone: real engine integration builds universe.json and merges concepts across forms', async (t) => {
  const envEngine = process.env.POSTPIPE_STONE_ENGINE;
  const fallbackEngine = path.join(__dirname, '..', 'rosetta-tagz');
  const engineDir = envEngine || fallbackEngine;
  const engineBin = path.join(engineDir, 'bin', 'rtz-build');

  if (!fs.existsSync(engineBin)) {
    t.skip(`rtz-build not found at ${engineBin}`);
    return;
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'postpipe-stone-real-'));
  try {
    const cacheDir = path.join(tmpDir, 'cache');
    const colorCachePath = path.join(tmpDir, 'colors.json');
    const overridesPath = path.join(tmpDir, 'stone.overrides.json');
    fs.writeFileSync(overridesPath, JSON.stringify({ ignore: ['untagged'] }), 'utf8');

    const entries = entriesFromResults(cloneResults());
    const { items, stone } = await loadCorpus(entries, {
      colorCachePath,
      siteRoot: tmpDir,
      cacheDir,
      containment: [{ id: 'container:act-1', tag: 'act-1' }],
      stone: {
        enabled: true,
        engine: engineDir,
        overrides: 'stone.overrides.json',
        emerge: true,
        discover: true,
        timeoutMs: 30000,
      },
    });

    assert.ok(fs.existsSync(path.join(cacheDir, 'universe.json')), 'universe.json written in cache');
    assert.ok(stone, 'loadCorpus returns stone summary');
    assert.ok(Array.isArray(stone.concepts) && stone.concepts.length > 0, 'stone summary has concepts');

    // Check that at least one concept has two forms across sources (e.g. AI / A.I. / artificial intelligence, or machine-learning / Machine Learning / ML)
    const multiFormConcept = stone.concepts.find((c) => {
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
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

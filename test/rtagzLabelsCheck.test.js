// tools/rtagz-labels-check.js: every label a built feed carries traces to a
// record's label, an item's text, the site's overrides or an enabled
// vocabulary (Harold's spec of 2026-10-25, the rule that does not move). Each
// origin, a label with none (exit 1), a feed from before 2026-10-31, and the
// cache folder named as the build names it.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const util = require('node:util');
const { spawnSync } = require('node:child_process');
const {
  main, phraseIn, readRecords, overrideLabels, vocabularyLabels, collectLabels, checkLabels, cacheCandidates,
} = require('../tools/rtagz-labels-check');
const { cacheDirForSite } = require('../src/lib/rtagz');

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'tools', 'rtagz-labels-check.js');

const BUILT = '2026-10-31T07:09:20.215Z';

// What post-pipe handed rosetta-tagz: two items, the categories sources wrote
// (Democracy, ai), and one earned tag record, which is output, not evidence.
const RECORDS = [
  { type: 'item', source: 'Alpha', id: 'i1', title: 'Democracy at stake', text: 'The vote is close.' },
  { type: 'tag', source: 'Alpha', item: 'i1', label: 'Democracy', weight: 1, origin: 'explicit' },
  { type: 'item', source: 'Beta', id: 'i2', title: 'Astronauts upgrade the station', text: 'Two astronauts install a new solar\n  array on the station. Jupiter has moons. An energy-efficient chip.' },
  { type: 'tag', source: 'Beta', item: 'i2', label: 'ai', weight: 1, origin: 'explicit' },
  { type: 'tag', source: 'Beta', item: 'i2', label: 'Planted', weight: 0.4, origin: 'discovered' },
];

// One label per origin, and two with none: "energy efficient" (the text
// says energy-efficient) and "Planted" (only an earned record has it).
//   Democracy, ai            record label, exact
//   AI                       record label, case-insensitive (the record says ai)
//   solar array              item text, exact case (across a line break)
//   jupiter                  item text, case-insensitive (the text says Jupiter)
//   Machine Learning, act-1  overrides, exact (a pin value; a container pin)
//   deep learning            overrides, case-insensitive (a same group says Deep Learning)
//   artificial intelligence  enabled vocabulary, exact (a prefLabel)
//   Economy                  enabled vocabulary, case-insensitive (an altLabel says economy)
function feed({ withUnfounded = true } = {}) {
  const concepts = [
    { id: 'c_democracy', canonical: 'Democracy', prefLabel: { Alpha: 'Democracy', site: 'Democracy' }, forms: { Alpha: { Democracy: 1 } }, rank: [{ label: 'Democracy', score: 1 }] },
    { id: 'c_ai', canonical: 'AI', prefLabel: { Beta: 'ai', site: 'AI' }, altLabel: { site: ['ai'] }, forms: { Beta: { ai: 1 } } },
    { id: 'c_solar_array', canonical: 'solar array', prefLabel: { discovered: 'solar array', site: 'solar array' } },
    { id: 'c_jupiter', canonical: 'jupiter', prefLabel: { discovered: 'jupiter', site: 'jupiter' } },
    { id: 'c_ml', canonical: 'Machine Learning', pinned: true },
    { id: 'c_dl', canonical: 'deep learning' },
    { id: 'c_act_1', canonical: 'act-1', pinned: true },
    { id: 'c_economy', canonical: 'Economy', mappings: [{ type: 'exactMatch', target: 'iptc:1' }] },
  ];
  const i1Tags = ['Democracy', 'Machine Learning', 'act-1'];
  const i2Tags = ['AI', 'solar array', 'jupiter', 'deep learning', 'Economy'];
  if (withUnfounded) {
    concepts.push({ id: 'c_energy_efficient', canonical: 'energy efficient', prefLabel: { discovered: 'energy efficient', site: 'energy efficient' } });
    i2Tags.push('energy efficient', 'Planted');
  }
  const ref = (value, extra = {}) => ({ type: 'tag', value, origin: 'explicit', weight: 1, why: null, ...extra });
  const items = [
    { id: 'i1', tags: i1Tags, _references: i1Tags.map((t) => ref(t, t === 'Democracy' ? { forms: { Alpha: ['Democracy'] } } : {})) },
    { id: 'i2', tags: i2Tags, _references: i2Tags.map((t) => ref(t, t === 'Economy' ? { prefLabel: { site: 'Economy', iptc: 'artificial intelligence' } } : (t === 'AI' ? { forms: { Beta: ['ai'] } } : {}))) },
  ];
  const edges = [];
  for (const it of items) for (const t of it.tags) edges.push({ source: it.id, target: `tag:${t}`, layer: 'tag' });
  edges.push({ source: 'tag:solar array', target: 'tag:jupiter', layer: 'related' });
  if (withUnfounded) edges.push({ source: 'tag:jupiter', target: 'tag:energy efficient', layer: 'related' });
  return { items, edges, _rtagz: { built: BUILT, concepts } };
}

// A site folder, its built feed, and the cache folder the build wrote.
function makeSite({ feedData = feed(), records = RECORDS, built = BUILT, overrides = { pin: { ml: 'Machine Learning' }, same: [['Deep Learning', 'DL']] }, vocabulary = true } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-rtagz-labels-'));
  const site = path.join(dir, 'site');
  const cache = path.join(dir, 'cache');
  fs.mkdirSync(path.join(site, '_site'), { recursive: true });
  fs.mkdirSync(path.join(site, 'vocab'), { recursive: true });
  fs.mkdirSync(cache, { recursive: true });
  const rtagz = { enabled: true, overrides: 'my-overrides.json' };
  if (vocabulary) rtagz.conceptSchemes = [{ id: 'iptc', path: 'vocab/iptc.jsonld' }];
  fs.writeFileSync(path.join(site, 'settings.json'), JSON.stringify({ site: { title: 'T' }, rtagz, containment: [{ id: 'container:act-1', tag: 'act-1' }] }));
  if (overrides) fs.writeFileSync(path.join(site, 'my-overrides.json'), JSON.stringify(overrides));
  fs.writeFileSync(path.join(site, 'vocab', 'iptc.jsonld'), JSON.stringify({
    '@context': { skos: 'http://www.w3.org/2004/02/skos/core#' },
    '@graph': [{ '@id': 'iptc:1', 'skos:prefLabel': { en: 'artificial intelligence' }, 'skos:altLabel': [{ '@value': 'economy', '@language': 'en' }] }],
  }));
  fs.writeFileSync(path.join(site, '_site', 'feed.json'), JSON.stringify(feedData));
  if (records) fs.writeFileSync(path.join(cache, 'records.jsonl'), records.map((r) => JSON.stringify(r)).join('\n') + '\n');
  if (built) fs.writeFileSync(path.join(cache, 'build.json'), JSON.stringify({ built, stages: [] }));
  return { dir, site, cache, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

function check(args) {
  const lines = [];
  const code = main(args, (...a) => lines.push(util.format(...a)));
  return { code, lines, text: lines.join('\n') };
}

test('each origin, tried in order, and a label with none: exit 1, with where it appeared', () => {
  const s = makeSite();
  try {
    const { code, lines, text } = check([s.site, '--cache', s.cache]);
    assert.strictEqual(code, 1);
    assert.match(text, /^labels checked: 12 distinct /m);
    const tier = (name) => Number((lines.find((l) => l.startsWith(`  ${name}: `)) || '').split(': ')[1]);
    assert.strictEqual(tier('record label, exact'), 2, 'Democracy, ai');
    assert.strictEqual(tier('record label, case-insensitive'), 1, 'AI');
    assert.strictEqual(tier('item text, exact case'), 1, 'solar array');
    assert.strictEqual(tier('item text, case-insensitive'), 1, 'jupiter');
    assert.strictEqual(tier('overrides, exact'), 2, 'Machine Learning, act-1');
    assert.strictEqual(tier('overrides, case-insensitive'), 1, 'deep learning');
    assert.strictEqual(tier('enabled vocabulary, exact'), 1, 'artificial intelligence');
    assert.strictEqual(tier('enabled vocabulary, case-insensitive'), 1, 'Economy');
    assert.strictEqual(tier('no origin'), 2);
    assert.match(text, /^case-insensitive only, item text: "jupiter"$/m);
    assert.match(text, /^case-insensitive only, record label: "AI"$/m);
    assert.match(text, /^overrides: .*my-overrides\.json read; container pins from settings\.containment: 1; \d+ labels$/m);
    assert.match(text, /^vocabularies:\n {2}iptc: .*vocab\/iptc\.jsonld {2}2 labels$/m);
    // Every label with no origin, sorted, each with where it appeared.
    const at = lines.indexOf('labels with no origin: 2');
    assert.ok(at > 0);
    assert.strictEqual(lines[at + 1], '  "Planted"');
    const ee = lines.indexOf('  "energy efficient"');
    assert.ok(ee > at);
    const where = lines.slice(ee + 1).filter((l) => l.startsWith('    '));
    assert.ok(where.includes('    concept canonical: 1 (c_energy_efficient)'));
    assert.ok(where.includes('    concept prefLabel.discovered: 1 (c_energy_efficient)'));
    assert.ok(where.includes('    item.tags: 1 (i2)'));
    assert.ok(where.includes('    _references value: 1 (i2)'));
    assert.ok(where.includes('    tag node, tag edge: 1 (i2)'));
    assert.ok(where.includes('    tag node, related edge: 1 (tag:jupiter)'));
  } finally {
    s.done();
  }
});

test('every label with an origin: exit 0', () => {
  const s = makeSite({ feedData: feed({ withUnfounded: false }) });
  try {
    const { code, text } = check([s.site, '--cache', s.cache]);
    assert.strictEqual(code, 0, text);
    assert.match(text, /^ {2}no origin: 0$/m);
    assert.match(text, /^every label has an origin$/m);
    assert.doesNotMatch(text, /^warning:/m);
  } finally {
    s.done();
  }
});

test('without the overrides or the vocabulary, the labels only they founded have no origin', () => {
  const s = makeSite({ feedData: feed({ withUnfounded: false }), overrides: null, vocabulary: false });
  try {
    const { code, lines, text } = check([s.site, '--cache', s.cache]);
    assert.strictEqual(code, 1);
    assert.match(text, /^overrides: .*my-overrides\.json absent; container pins from settings\.containment: 1; 1 labels$/m);
    assert.match(text, /^vocabularies: none enabled$/m);
    const at = lines.indexOf('labels with no origin: 4');
    assert.ok(at > 0, text);
    // act-1 still has the container pin post-pipe merges into the overrides.
    assert.deepStrictEqual(lines.slice(at + 1).filter((l) => /^ {2}"/.test(l)), ['  "Economy"', '  "Machine Learning"', '  "artificial intelligence"', '  "deep learning"']);
  } finally {
    s.done();
  }
});

test('the check cannot run without its records or its feed: exit 2; records from another build are said to be', () => {
  const s = makeSite({ records: null });
  try {
    const r = check([s.site, '--cache', s.cache]);
    assert.strictEqual(r.code, 2);
    assert.match(r.text, /^records: cannot read .*records\.jsonl \(ENOENT\); name the cache folder with --cache DIR$/m);
    const noFeed = check([s.site, '--cache', s.cache, '--feed', path.join(s.dir, 'nowhere.json')]);
    assert.strictEqual(noFeed.code, 2);
    assert.match(noFeed.text, /^feed: cannot read /);
    assert.strictEqual(check([]).code, 2);
    assert.strictEqual(check([s.site, '--nope']).code, 2);
  } finally {
    s.done();
  }
  const t = makeSite({ built: '2026-10-30T00:00:00.000Z' });
  try {
    assert.match(check([t.site, '--cache', t.cache]).text, /^warning: the records are from another build \(2026-10-30T00:00:00\.000Z\) than the feed \(2026-10-31T07:09:20\.215Z\)/m);
  } finally {
    t.done();
  }
});

test('a feed from before 2026-10-31 (feed._stone, no prefLabel, no altLabel) is read the same', () => {
  const old = {
    items: [{ id: 'i1', tags: ['Democracy', 'solar array'], _references: [{ type: 'tag', value: 'Democracy', origin: 'explicit', forms: { Alpha: ['Democracy'] } }, { type: 'tag', value: 'solar array', origin: 'discovered', why: 'recurs in 2 of 2 items' }] }],
    edges: [{ source: 'i1', target: 'tag:Democracy', layer: 'tag', attrs: { concept: 'c_democracy', weight: 1, origin: 'explicit' } }, { source: 'i1', target: 'tag:solar array', layer: 'tag' }],
    _stone: { built: BUILT, concepts: [{ canonical: 'Democracy', forms: { Alpha: { Democracy: 1 } }, rank: [{ label: 'Democracy' }] }, { canonical: 'solar array', forms: { discovered: { 'solar array': 1 } } }] },
  };
  const s = makeSite({ feedData: old });
  try {
    const { code, text } = check([s.site, '--cache', s.cache]);
    assert.strictEqual(code, 0, text);
    assert.match(text, /^feed: .*\(_stone, built 2026-10-31T07:09:20\.215Z\)$/m);
    assert.match(text, /^labels checked: 2 distinct \(appearances: concept canonical 2, concept forms 2, concept rank 1, item\.tags 2, _references value 2, _references forms 1, tag node 2\)$/m);
  } finally {
    s.done();
  }
});

test('the phrase search: word boundaries, any case only when asked, whitespace as given', () => {
  assert.strictEqual(phraseIn('a party at noon', 'art'), false);
  assert.strictEqual(phraseIn('she said so', 'ai'), false);
  assert.strictEqual(phraseIn('AI-driven tools', 'AI'), true);
  assert.strictEqual(phraseIn('AI-driven tools', 'ai'), false, 'case is the caller\'s to fold');
  assert.strictEqual(phraseIn('learn C++ today', 'C++'), true);
  assert.strictEqual(phraseIn('xC++ today', 'C++'), false);
  assert.strictEqual(phraseIn('the café', 'caf'), false);
  assert.strictEqual(phraseIn('the café', 'cafe'), false, 'a combining mark is part of the word');
  assert.strictEqual(phraseIn('solar arrays and a solar array.', 'solar array'), true, 'a later occurrence on the boundary counts');
  assert.strictEqual(phraseIn('anything', ''), false);
});

test('records: a source\'s categories and its items\' text; earned tag records are left out', () => {
  const r = readRecords(RECORDS.map((x) => JSON.stringify(x)).join('\n') + '\nnot json\n');
  assert.deepStrictEqual(r.tagLabels, ['Democracy', 'ai']);
  assert.strictEqual(r.items, 2);
  assert.strictEqual(r.earned, 1);
  assert.strictEqual(r.unreadable, 1);
  assert.strictEqual(r.texts[1].title, 'Astronauts upgrade the station');
});

test('the labels an overrides file names, and none from its weights or config', () => {
  assert.deepStrictEqual(overrideLabels({
    same: [['labor', 'labour']], notSame: [['ai', 'agi']], pin: { ml: 'Machine Learning' },
    relations: [{ a: 'cats', b: 'iptc:20000763', type: 'broadMatch' }], notRelated: [{ a: 'x', b: 'y' }],
    ignore: ['untagged'], sourceWeights: { ScienceDaily: 0.4 }, config: { mergeThreshold: 0.75 },
  }).sort(), ['Machine Learning', 'agi', 'ai', 'cats', 'iptc:20000763', 'labor', 'labour', 'ml', 'untagged', 'x', 'y'].sort());
  assert.deepStrictEqual(overrideLabels(null), []);
});

test('a vocabulary\'s prefLabel and altLabel values, from JSON, JSON-LD, JSON lines or Turtle', () => {
  assert.deepStrictEqual(vocabularyLabels(JSON.stringify({ concepts: [{ id: '1', prefLabel: 'economy', altLabel: ['economics'], definition: 'not a label' }] })), ['economy', 'economics']);
  assert.deepStrictEqual(vocabularyLabels(JSON.stringify({ '@graph': [{ 'http://www.w3.org/2004/02/skos/core#prefLabel': [{ '@value': 'health', '@language': 'en' }], 'skos:altLabel': { en: ['wellbeing'], de: 'Gesundheit' } }] })), ['health', 'wellbeing', 'Gesundheit']);
  assert.deepStrictEqual(vocabularyLabels('{"prefLabel":{"en":"sport"}}\n{"altLabel":["sports"]}\n'), ['sport', 'sports']);
  const ttl = '@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n<x:1> a skos:Concept ;\n  skos:prefLabel "arts, culture \\"and\\" entertainment"@en , "Kultur"@de ;\n  skos:altLabel "arts"@en .\n<x:2> <http://www.w3.org/2004/02/skos/core#prefLabel> "crime" .\n';
  assert.deepStrictEqual(vocabularyLabels(ttl), ['arts, culture "and" entertainment', 'Kultur', 'arts', 'crime']);
  assert.deepStrictEqual(vocabularyLabels('nothing here'), []);
});

test('the labels: concepts in every scheme, item tags, references and tag nodes, each counted where it appears', () => {
  const { labels, occurrences } = collectLabels(feed());
  assert.ok(labels.has('ai'), 'an altLabel');
  assert.ok(labels.has('artificial intelligence'), 'a reference\'s prefLabel in an external scheme');
  assert.strictEqual(labels.get('jupiter').get('tag node, related edge').n, 2);
  assert.strictEqual(occurrences['item.tags'], 10);
  assert.strictEqual(occurrences['concept canonical'], 9);
  const r = checkLabels({ feed: feed(), recordLabels: ['Democracy'], texts: [], overrides: [], vocabulary: [] });
  assert.strictEqual(r.counts['record-exact'], 1);
  assert.strictEqual(r.origins.get('Democracy'), 'record-exact');
  assert.strictEqual(r.origins.get('solar array'), null);
});

test('the cache folder is the one the build names for the site, then the former stone folder', () => {
  const site = path.join(os.tmpdir(), 'some-site');
  const c = cacheCandidates(site);
  assert.strictEqual(c[0], path.resolve(cacheDirForSite(site, path.join(ROOT, '.feed-cache'))));
  assert.match(c[0], /[/\\]\.feed-cache[/\\]rtagz[/\\]some-site-[0-9a-f]{8}$/);
  assert.ok(c.includes(path.join(ROOT, '.feed-cache', 'stone', path.basename(c[0]))));
});

test('the script runs from the command line and exits 1 for a label with no origin', () => {
  const s = makeSite();
  try {
    const r = spawnSync(process.execPath, [SCRIPT, s.site, '--cache', s.cache], { encoding: 'utf8' });
    assert.strictEqual(r.status, 1, r.stderr);
    assert.match(r.stdout, /\nlabels with no origin: 2\n/);
  } finally {
    s.done();
  }
});

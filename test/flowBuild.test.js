// The build runs Flow's programs for each preset a site lists (flow.presets,
// provisional; src/lib/flowBuild.js) and writes each order into feed.json as
// flows (provisional): the same orders as running the three programs on the
// written feed.json, the same bytes from one run to the next, a preset that
// fails one logged line and no order, and a site that lists none unchanged.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync, execFileSync } = require('node:child_process');
const { flowPresetList, presetFile, runFlows, FLOW_DIR } = require('../src/lib/flowBuild');

const ROOT = path.join(__dirname, '..');
const GENERATE = path.join(ROOT, 'generate-index.js');
const BIN = (name) => path.join(ROOT, 'flow', 'bin', name);
const PRESET = (name) => path.join(ROOT, 'flow', 'presets', `${name}.json`);

test('flow.presets: the names listed, trimmed; absent, empty or not a list is none', () => {
  assert.deepStrictEqual(flowPresetList({ flow: { presets: [' by-weight ', '', 7, 'mine.json'] } }), ['by-weight', 'mine.json']);
  assert.deepStrictEqual(flowPresetList({}), []);
  assert.deepStrictEqual(flowPresetList(null), []);
  assert.deepStrictEqual(flowPresetList({ flow: { presets: [] } }), []);
  assert.deepStrictEqual(flowPresetList({ flow: { presets: 'by-weight' } }), []);
});

test('a preset: a bare name is one in flow/presets/; anything else a path from the site', () => {
  assert.strictEqual(presetFile('by-weight', '/sites/a'), path.join(FLOW_DIR, 'presets', 'by-weight.json'));
  assert.strictEqual(presetFile('mine.json', '/sites/a'), path.resolve('/sites/a', 'mine.json'));
  assert.strictEqual(presetFile('presets/quiet.json', '/sites/a'), path.resolve('/sites/a', 'presets/quiet.json'));
  assert.strictEqual(presetFile('/abs/p.json', '/sites/a'), '/abs/p.json');
  assert.strictEqual(presetFile('~/p.json', '/sites/a'), path.join(os.homedir(), 'p.json'));
});

test('runFlows: nothing listed runs nothing; a list that is not one, or missing programs, is one line and no orders', async () => {
  const said = [];
  const warn = (m) => said.push(m);
  assert.strictEqual(await runFlows({ items: [] }, {}, { warn }), null);
  assert.strictEqual(await runFlows({ items: [] }, { flow: { presets: [] } }, { warn }), null);
  assert.deepStrictEqual(said, []);
  assert.strictEqual(await runFlows({ items: [] }, { flow: { presets: 'by-weight' } }, { warn }), null);
  assert.strictEqual(said.length, 1);
  assert.match(said[0], /^flow: flow\.presets is not a list/);
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-flow-nobin-'));
  try {
    assert.strictEqual(await runFlows({ items: [] }, { flow: { presets: ['by-weight'] } }, { warn, flowDir: empty }), null);
    assert.strictEqual(said.length, 2);
    assert.match(said[1], /^flow: flow-select not found/);
  } finally {
    fs.rmSync(empty, { recursive: true, force: true });
  }
});

// A site of six local pieces with tags and dates, built without the
// network: its outline carries a colour, so no home page is fetched, and it
// does not turn rosetta-tagz on.
const PIECES = [
  ['harbor-lights', 'Harbor lights', ['harbor', 'light'], '2026-01-05'],
  ['glass-and-light', 'Glass and light', ['glass', 'light'], '2026-02-10'],
  ['harbor-glass', 'Harbor glass', ['harbor', 'glass'], '2026-03-15'],
  ['tides', 'Tides', ['harbor', 'tide'], '2025-12-01'],
  ['lenses', 'Lenses', ['glass', 'lens'], '2026-03-20'],
  ['alone', 'Alone', [], '2026-01-01'],
];

function makeSite(prefix) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const put = (rel, text) => {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
  };
  put('feeds.opml', '<?xml version="1.0"?><opml version="2.0"><head><title>t</title></head><body>'
    + '<outline text="Pieces" title="Pieces" type="local" xmlUrl="local://pieces" customColor="#336699"/></body></opml>');
  for (const [slug, title, tags, written] of PIECES) {
    put(`pieces/${slug}/frontmatter.json`, JSON.stringify({ title, tags, meta: { written } }));
    put(`pieces/${slug}/index.md`, `${title}, a short piece.\n`);
  }
  const settings = (flow) => put('settings.json', JSON.stringify({
    site: { title: 'Flow test', base_url: 'https://flow.test' },
    theme: {},
    ...(flow === undefined ? {} : { flow }),
  }));
  const build = () => {
    const r = spawnSync(process.execPath, [GENERATE], { cwd: root, env: { ...process.env, POSTPIPE_SITE: root }, encoding: 'utf8' });
    assert.strictEqual(r.status, 0, r.stderr || r.stdout);
    const text = fs.readFileSync(path.join(root, '_site', 'feed.json'), 'utf8');
    return { out: r.stdout, err: r.stderr, text, feed: JSON.parse(text) };
  };
  return { root, put, settings, build, done: () => fs.rmSync(root, { recursive: true, force: true }) };
}

// The three programs run by hand on a written feed.json.
function byHand(feedText, presetPath) {
  const opts = (input) => ({ input, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const sub = execFileSync(process.execPath, [BIN('flow-select'), '--all'], opts(feedText));
  const scored = execFileSync(process.execPath, [BIN('flow-score'), '--preset', presetPath], opts(sub));
  return JSON.parse(execFileSync(process.execPath, [BIN('flow-order')], opts(scored)));
}

test('the build: one order per listed preset, as the three programs give on the written feed.json, the same bytes again', async () => {
  const site = makeSite('pp-flow-build-');
  try {
    site.settings({ presets: ['by-weight', 'by-neighbourhood'] });
    const first = site.build();
    const { feed } = first;
    const ids = feed.items.map((it) => it.id);
    assert.strictEqual(ids.length, PIECES.length);
    assert.ok(Array.isArray(feed.flows), 'feed.json carries flows');
    assert.deepStrictEqual(feed.flows.map((f) => f.name), ['by-weight', 'by-neighbourhood']);
    assert.deepStrictEqual(feed.flows.map((f) => Object.keys(f)), [['name', 'description', 'mode', 'order'], ['name', 'description', 'mode', 'order']]);
    assert.match(first.out, /flow: 2 orders \(by-weight, 6 cards; by-neighbourhood, 6 cards\)/);

    for (const written of feed.flows) {
      const preset = JSON.parse(fs.readFileSync(PRESET(written.name), 'utf8'));
      const flow = byHand(first.text, PRESET(written.name));
      assert.deepStrictEqual(written.order, flow.items.map((it) => it.id), `${written.name}: the order the programs give`);
      assert.strictEqual(written.mode, flow.summary.mode);
      assert.strictEqual(written.description, preset.description);
      // The ids are the feed's item ids, every card once.
      assert.deepStrictEqual([...written.order].sort(), [...ids].sort());
    }
    assert.strictEqual(feed.flows[0].mode, 'score');
    assert.strictEqual(feed.flows[1].mode, 'walk');
    // by-neighbourhood walks from the newest card.
    assert.strictEqual(feed.flows[1].order[0], feed.items.find((it) => it.title === 'Lenses').id);

    // The same feed gives the same orders, byte for byte: a second build,
    // and runFlows twice on the feed as written (without its flows).
    const second = site.build();
    assert.strictEqual(JSON.stringify(second.feed.flows), JSON.stringify(feed.flows));
    const bare = { ...feed };
    delete bare.flows;
    const settings = JSON.parse(fs.readFileSync(path.join(site.root, 'settings.json'), 'utf8'));
    const a = await runFlows(bare, settings, { siteRoot: site.root });
    const b = await runFlows(bare, settings, { siteRoot: site.root });
    assert.strictEqual(JSON.stringify(a), JSON.stringify(feed.flows));
    assert.strictEqual(JSON.stringify(b), JSON.stringify(a));
  } finally {
    site.done();
  }
});

test('a preset that fails is one logged line and no order; a site preset by path is read; the rest are kept', () => {
  const site = makeSite('pp-flow-fail-');
  try {
    site.put('mine.json', JSON.stringify({ name: 'mine' }));
    site.put('presets/quiet.json', JSON.stringify({ ...JSON.parse(fs.readFileSync(PRESET('by-weight'), 'utf8')), name: 'quiet', description: 'A quiet copy.' }));
    site.settings({ presets: ['by-weight', 'no-such-preset', 'mine.json', 'presets/quiet.json', 'by-weight'] });
    const r = site.build();
    assert.deepStrictEqual(r.feed.flows.map((f) => f.name), ['by-weight', 'quiet']);
    assert.strictEqual(r.feed.flows[1].description, 'A quiet copy.');
    const lines = r.err.split('\n').filter((l) => l.startsWith('flow:'));
    assert.strictEqual(lines.length, 3, r.err);
    assert.match(lines[0], /^flow: preset no-such-preset not found .*; built on without that order$/);
    assert.match(lines[1], /^flow: mine\.json: flow-score failed \(exit 1 \(preset has no weights object\)\); built on without that order$/);
    assert.match(lines[2], /^flow: by-weight: another listed preset is already named by-weight; built on without this one$/);

    // Every listed preset failing: no flows key, and the build goes on.
    site.settings({ presets: ['no-such-preset'] });
    const none = site.build();
    assert.ok(!('flows' in none.feed));
    assert.match(none.out, /flow: no order this build/);
  } finally {
    site.done();
  }
});

test('a site that lists no preset: no flows key, nothing about Flow in the log, the same feed.json as with an empty list', () => {
  const site = makeSite('pp-flow-none-');
  try {
    site.settings(undefined);
    const absent = site.build();
    assert.ok(!('flows' in absent.feed));
    assert.ok(!/flow:/.test(absent.out) && !/flow:/.test(absent.err), absent.out + absent.err);
    site.settings({ presets: [] });
    const empty = site.build();
    assert.ok(!('flows' in empty.feed));
    // Only the time the folder was read differs between the two builds.
    const timeless = (t) => t.replace(/"readAt": "[^"]*"/g, '"readAt": ""');
    assert.strictEqual(timeless(empty.text), timeless(absent.text));
  } finally {
    site.done();
  }
});

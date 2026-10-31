// tools/rtagz-report.js: the source coherence ratio filter (--ratio), the why
// check beside the comparison it already printed, and a feed from before
// 2026-10-31 (feed._stone, no sourceRatio, no PROV) read with n/a.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const util = require('node:util');
const { spawnSync } = require('node:child_process');
const { run, whyCheck, parseArgs } = require('../tools/rtagz-report');

const SCRIPT = path.join(__dirname, '..', 'tools', 'rtagz-report.js');

// Four items from two sources. Democracy: explicit on i1 and i2. solar:
// discovered on i1 and i3 (ratio 3), whose why says 2 of 4 items, and
// emergent on i4, so three items carry it. filler: discovered on i2 and i4
// (ratio 1.2), whose why says 3 of 4 items, one more than carry it.
function newFeed() {
  const A = { id: 'a', title: 'Alpha' };
  const B = { id: 'b', title: 'Beta' };
  const why = (N) => `recurs in ${N} of 4 items, which stay alike without it`;
  const prov = (phrase, ratio) => ({
    wasDerivedFrom: [{ type: 'text', phrase }],
    wasGeneratedBy: { activity: 'discover', parameters: { sourceCoherenceRatio: 1.6, sourceRatio: ratio } },
  });
  const ref = (value, origin, extra = {}) => ({ type: 'tag', value, concept: `c_${value}`, origin, weight: origin === 'explicit' ? 1 : 0.4, why: null, ...extra });
  const items = [
    { id: 'i1', _source: A, tags: ['Democracy', 'solar'], _references: [ref('Democracy', 'explicit'), ref('solar', 'discovered', { why: why(2), sourceRatio: 3, ...prov('solar', 3) })] },
    { id: 'i2', _source: A, tags: ['Democracy', 'filler'], _references: [ref('Democracy', 'explicit'), ref('filler', 'discovered', { why: why(3), sourceRatio: 1.2, ...prov('filler', 1.2) })] },
    { id: 'i3', _source: B, tags: ['solar'], _references: [ref('solar', 'discovered', { why: why(2), sourceRatio: 3, ...prov('solar', 3) })] },
    { id: 'i4', _source: B, tags: ['solar', 'filler'], _references: [ref('solar', 'emergent', { why: 'contains "solar"' }), ref('filler', 'discovered', { why: why(3), sourceRatio: 1.2, ...prov('filler', 1.2) })] },
  ];
  const edges = [];
  for (const it of items) {
    for (const r of it._references) {
      const attrs = { concept: r.concept, weight: r.weight, origin: r.origin };
      if (r.why) attrs.why = r.why;
      if (r.wasDerivedFrom) attrs.wasDerivedFrom = r.wasDerivedFrom;
      if (r.wasGeneratedBy) attrs.wasGeneratedBy = r.wasGeneratedBy;
      if (r.sourceRatio !== undefined) attrs.sourceRatio = r.sourceRatio;
      edges.push({ source: it.id, target: `tag:${r.value}`, directed: false, role: 'tagged', layer: 'tag', attrs });
    }
  }
  edges.push({ source: 'tag:solar', target: 'tag:filler', layer: 'related', attrs: { weight: 0.5 } });
  return {
    items,
    edges,
    _rtagz: {
      built: '2026-10-31T00:00:00.000Z',
      concepts: [{ id: 'c_Democracy', canonical: 'Democracy' }, { id: 'c_solar', canonical: 'solar' }, { id: 'c_filler', canonical: 'filler' }],
      schemes: [{ id: 'site' }, { id: 'Alpha' }, { id: 'Beta' }, { id: 'discovered' }],
      relations: { related: 1 },
    },
  };
}

// The same feed as a build before 2026-10-31 wrote it: feed._stone, tag
// edges with { concept, weight, origin } only, references with no
// sourceRatio and no PROV.
function oldFeed() {
  const f = newFeed();
  const s = f._rtagz;
  delete f._rtagz;
  f._stone = { built: s.built, concepts: s.concepts.map((c) => ({ canonical: c.canonical })), unjoined: 0, skippedDuplicateIds: 0 };
  for (const it of f.items) {
    for (const r of it._references) { delete r.sourceRatio; delete r.wasDerivedFrom; delete r.wasGeneratedBy; }
  }
  f.edges = f.edges.filter((e) => e.layer === 'tag');
  for (const e of f.edges) e.attrs = { concept: e.attrs.concept, weight: e.attrs.weight, origin: e.attrs.origin };
  return f;
}

function withFeed(feed, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-rtagz-report-'));
  const p = path.join(dir, 'feed.json');
  fs.writeFileSync(p, JSON.stringify(feed));
  try { return fn(p); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function report(args) {
  const lines = [];
  const code = run(args, (...a) => lines.push(util.format(...a)));
  return { code, lines };
}

const lineStarting = (lines, prefix) => lines.find((l) => l.startsWith(prefix)) || '';

test('without --ratio every tag edge counts, as before, and no ratio line is printed', () => {
  withFeed(newFeed(), (p) => {
    const { code, lines } = report([p]);
    assert.strictEqual(code, 0);
    assert.strictEqual(lineStarting(lines, 'source coherence ratio:'), '');
    assert.match(lineStarting(lines, 'tag edges (layer tag):'), /^tag edges \(layer tag\): 7 {2}by attrs\.origin: \{"explicit":2,"discovered":4,"emergent":1\} {2}dangling: 0$/);
    assert.match(lineStarting(lines, 'distinct tag nodes:'), /^distinct tag nodes: 3 /);
    assert.match(lineStarting(lines, 'item pairs sharing'), /: 5 of 6 /);
    assert.match(lineStarting(lines, '  Alpha (n=2):'), /: 1 of 1 /);
    assert.match(lineStarting(lines, '  Alpha x Beta:'), /: 3 of 4 /);
    assert.match(lineStarting(lines, '_rtagz: concepts 3'), /schemes site,Alpha,Beta,discovered {2}relations \{"related":1\} {2}mappings n\/a {2}untagged n\/a {2}ledger n\/a$/);
  });
});

test('--ratio V counts a tag edge only with no sourceRatio or one at or above V, the viewer\'s rule', () => {
  withFeed(newFeed(), (p) => {
    const { code, lines } = report([p, '--ratio', '1.6']);
    assert.strictEqual(code, 0);
    const ratioLine = lineStarting(lines, 'source coherence ratio:');
    assert.match(ratioLine, /^source coherence ratio: 1\.6 {2}tag edges left out \(sourceRatio under it\): 2 of 7 {2}tag nodes left out: 1 of 3 /);
    assert.match(ratioLine, /the viewer's slider runs 1\.2 to 3\.0, the build's bar 1\.6$/);
    // filler's two edges (1.2) are gone; the explicit and emergent edges, with no ratio, stay.
    assert.match(lineStarting(lines, 'tag edges (layer tag):'), /: 5 {2}by attrs\.origin: \{"explicit":2,"discovered":2,"emergent":1\}/);
    assert.match(lineStarting(lines, 'distinct tag nodes:'), /^distinct tag nodes: 2 /);
    // i2 and i4 shared only filler.
    assert.match(lineStarting(lines, 'item pairs sharing'), /: 4 of 6 /);
    assert.match(lineStarting(lines, 'discovered tags:'), /^discovered tags: 1 /);
    assert.match(lineStarting(lines, 'why check'), /discovered tags left out at ratio 1\.6: 1$/);
    // At the build's lowest ratio everything shows again; a value at the ratio itself shows (>=).
    const low = report([p, '--ratio', '1.2']).lines;
    assert.match(lineStarting(low, 'tag edges (layer tag):'), /: 7 /);
    assert.match(lineStarting(low, 'source coherence ratio:'), /left out \(sourceRatio under it\): 0 of 7/);
  });
});

test('a ratio outside the slider is applied as given and said to be outside it; a ratio that is not a number is refused', () => {
  withFeed(newFeed(), (p) => {
    const { lines } = report([p, '--ratio', '5']);
    assert.match(lineStarting(lines, 'source coherence ratio:'), /; 5 is outside it$/);
    assert.match(lineStarting(lines, 'tag edges (layer tag):'), /: 3 {2}by attrs\.origin: \{"explicit":2,"emergent":1\}/, 'only the edges with no ratio stay');
    for (const bad of [['--ratio', 'abc'], ['--ratio']]) {
      const r = report([p, ...bad]);
      assert.strictEqual(r.code, 2);
      assert.match(r.lines[0], /^--ratio needs a number/);
    }
  });
  assert.strictEqual(parseArgs(['f.json']).ratio, null);
  assert.strictEqual(parseArgs(['f.json', '--ratio', '1.6']).ratio, 1.6);
});

test('the why check sets N against the discovered assertions, beside the comparison against every item carrying the tag', () => {
  withFeed(newFeed(), (p) => {
    const { lines } = report([p]);
    // The comparison already printed counts every item: solar's N 2 against 3 items (one emergent), filler's 3 against 2.
    assert.match(lineStarting(lines, 'discovered tags:'), /^discovered tags: 2 {2}with a parsable N: 2 {2}N disagrees with items carrying the tag: 2 /);
    // The why check counts only discovered assertions: solar agrees, filler does not.
    const why = lineStarting(lines, 'why check');
    assert.match(why, /discovered tags: 2 {2}with a parsable N: 2 {2}N equals discovered assertions: 1 {2}mismatches: 1 \(50\.0%\) {2}discovered edges disagree with _references: 0$/);
    const i = lines.indexOf('  mismatches (largest gap first):');
    assert.ok(i > 0, 'the mismatches are listed');
    assert.deepStrictEqual(JSON.parse(lines[i + 1].trim()), {
      label: 'filler', N: '3', M: '4', discoveredAssertions: 2, discoveredEdges: 2, itemsCarrying: 2, origins: 'discovered',
    });
    assert.strictEqual(lines[i + 2], lines[lines.length - 1], 'one mismatch, then the summary line');
  });
});

test('whyCheck: every mismatch listed, largest gap first; an edge count is n/a when no tag edge says its origin; no why is n/a', () => {
  const items = [
    { id: 'x', _references: [{ type: 'tag', value: 'a', origin: 'discovered', why: 'recurs in 5 of 9 items' }, { type: 'tag', value: 'b', origin: 'discovered', why: 'recurs in 2 of 9 items' }] },
    { id: 'y', _references: [{ type: 'tag', value: 'b', origin: 'discovered', why: 'recurs in 2 of 9 items' }, { type: 'tag', value: 'c', origin: 'discovered', why: 'recurs in 4 of 9 items' }] },
  ];
  const edges = [
    { source: 'x', target: 'tag:a', layer: 'tag' },
    { source: 'x', target: 'tag:b', layer: 'tag' },
    { source: 'y', target: 'tag:b', layer: 'tag' },
    { source: 'y', target: 'tag:c', layer: 'tag' },
  ];
  const w = whyCheck(items, edges);
  assert.strictEqual(w.checked, 3);
  assert.strictEqual(w.agree, 1, 'b: N 2, two assertions');
  assert.deepStrictEqual(w.mismatches.map((r) => r.label), ['a', 'c'], 'a is 4 off, c 3 off');
  assert.strictEqual(w.edgesKnown, false);
  assert.strictEqual(w.mismatches[0].discoveredEdges, 'n/a');
  assert.strictEqual(w.mismatches[0].itemsCarrying, 1);

  const noWhy = whyCheck([{ id: 'x', _references: [{ type: 'tag', value: 'a', origin: 'discovered' }] }], []);
  assert.strictEqual(noWhy.checked, 1);
  assert.strictEqual(noWhy.withN, 0);
  assert.deepStrictEqual(noWhy.mismatches, []);

  // Edges that say their origin and disagree with the references are named.
  const said = whyCheck(items, [
    { source: 'x', target: 'tag:b', layer: 'tag', attrs: { origin: 'discovered' } },
    { source: 'y', target: 'tag:b', layer: 'tag', attrs: { origin: 'emergent' } },
  ]);
  assert.strictEqual(said.edgesKnown, true);
  assert.strictEqual(said.edgesDisagree, 3, 'b has one discovered edge of two; a and c have none');
  assert.deepStrictEqual(said.edgeMismatches.find((r) => r.label === 'b'), { label: 'b', discoveredAssertions: 2, discoveredEdges: 1 });
});

test('a feed from before 2026-10-31 (feed._stone, no sourceRatio, no PROV) reads the same, with n/a where a field is missing', () => {
  withFeed(oldFeed(), (p) => {
    const plain = report([p]).lines;
    const { code, lines } = report([p, '--ratio', '1.6']);
    assert.strictEqual(code, 0);
    assert.strictEqual(lineStarting(lines, 'source coherence ratio:'), 'source coherence ratio: 1.6  no tag edge carries a sourceRatio (n/a): nothing left out');
    // Nothing carries a ratio, so nothing is left out: the counts are those without --ratio.
    for (const prefix of ['tag edges (layer tag):', 'item pairs sharing', 'discovered tags:', 'why check']) {
      const a = lineStarting(plain, prefix);
      const b = lineStarting(lines, prefix);
      assert.ok(a, prefix);
      assert.strictEqual(b.replace(/ {2}discovered tags left out at ratio 1\.6: 0$/, ''), a, prefix);
    }
    assert.match(lineStarting(lines, 'tag edges (layer tag):'), /: 7 /);
    assert.match(lineStarting(lines, 'why check'), /N equals discovered assertions: 1 {2}mismatches: 1 /);
    assert.strictEqual(lineStarting(lines, '_stone:'), '_stone: concepts 3  schemes n/a  relations n/a  mappings n/a  untagged n/a  ledger n/a');
    // --scheme and --depth fall back to the labels as written when concepts carry no ids.
    assert.match(lineStarting(report([p, '--scheme', 'site', '--depth', '1']).lines, 'distinct tag nodes:'), /^distinct tag nodes: 3 /);
  });
});

test('the script runs from the command line', () => {
  withFeed(newFeed(), (p) => {
    const r = spawnSync(process.execPath, [SCRIPT, p, '--ratio', '1.6'], { encoding: 'utf8' });
    assert.strictEqual(r.status, 0, r.stderr);
    assert.match(r.stdout, /^feed: /);
    assert.match(r.stdout, /\nsource coherence ratio: 1\.6 /);
    assert.match(r.stdout, /\nwhy check /);
    const bad = spawnSync(process.execPath, [SCRIPT, p, '--ratio', 'x'], { encoding: 'utf8' });
    assert.strictEqual(bad.status, 2);
  });
});

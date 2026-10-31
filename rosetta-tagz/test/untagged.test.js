import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { discover } from '../lib/discover.js';
import { makeConfig } from '../lib/config.js';
import { buildStone } from '../lib/stone.js';
import { emerge } from '../lib/emerge.js';
import { buildUniverse } from '../lib/universe.js';
import { untaggedReport } from '../lib/untagged.js';
import { rec, tmpDir, ROOT } from './helpers.js';

// Two copies of one story that share nothing with anything else, a lone item whose words recur
// nowhere, an item with no text at all, three items about volcanoes, and filler so no phrase is
// everywhere. Nothing human-written.
const filler = Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`f${i}`, []]));
const fillerMeta = Object.fromEntries(Object.keys(filler).map((k, i) => [k, { title: `zorbl${i} flarn${i} wumpus${i}`, text: `grindle${i} plonk${i} vexor${i} snarf${i}` }]));
const story = 'tornado wellington granary silo harvest combine auctioneer bales sheriff deputies chapel steeple shelter cellar hailstones wheatfield';
const records = [
  ...rec('Wire', { v1: [], v2: [], v3: [], c1: [], c2: [], lone: [], blank: [] }, {
    v1: { title: 'Volcano eruption buried the city in ash', text: 'an ancient volcano erupted and ash covered every street' },
    v2: { title: 'Ash from a volcano eruption reveals old lives', text: 'the volcano eruption preserved ash layers in the city' },
    v3: { title: 'Volcano ash cloud grounds flights', text: 'ash from the volcano eruption closed the airport' },
    c1: { title: 'A storm flattened the county', text: `${story} ${story}` },
    c2: { title: 'What the storm left behind', text: `${story.split(' ').reverse().join(' ')} ${story}` },
    lone: { title: 'Pangolin conservation succeeds', text: 'pangolin numbers recover in a single reserve' },
    blank: { title: 'Q', text: '' },
  }),
  ...rec('Mine', { m1: ['physics'] }, { m1: { title: 'Notes on physics', text: 'measurement' } }),
  ...rec('Filler', filler, fillerMeta),
];
const info = {};
const found = discover(records, makeConfig(), info);
const all = [...records, ...found];
const stone = buildStone(all);
const universe = buildUniverse(stone, [...all, ...emerge(stone, all)]);
const report = untaggedReport(universe, { schema: 'rosetta-tagz/discover-report@1', ...info.untagged }, 1.6);
const entry = (key) => report.items.find((x) => x.key === key);

test('discovery reports what became of each candidate of every item no at-bar hub reached, and only those', () => {
  const fates = info.untagged.untagged;
  assert.equal(info.untagged.bar, 1.6);
  assert.ok(!fates['Mine::m1'], 'a tagged item is not reported');
  for (const k of ['Wire::v1', 'Wire::v2', 'Wire::v3']) assert.ok(!fates[k], `${k} carries a hub`);
  assert.deepEqual(fates['Wire::c1'].members, ['Wire::c1']);
  assert.ok(fates['Wire::c1'].nearCopy.some((x) => x.phrase === 'tornado' && x.items === 2 && x.df === 1), JSON.stringify(fates['Wire::c1'].nearCopy));
  assert.equal(fates['Wire::lone'].candidates, fates['Wire::lone'].single, 'every candidate of the lone item is on it alone');
  assert.equal(fates['Wire::blank'].candidates, 0);
});

test('the untagged report lists every item with no tag at the bar, each with its reason', () => {
  assert.equal(report.bar, 1.6);
  const keys = report.items.map((x) => x.key);
  for (const k of ['Wire::c1', 'Wire::c2', 'Wire::lone', 'Wire::blank']) assert.ok(keys.includes(k), `${k} is listed`);
  for (const k of ['Wire::v1', 'Mine::m1']) assert.ok(!keys.includes(k), `${k} has a tag`);
  assert.equal(report.count, report.items.length);
  assert.equal(report.none, report.items.filter((x) => !x.under.length).length);
  assert.equal(entry('Wire::c1').reason, 'nearCopy');
  assert.match(entry('Wire::c1').why.join(' '), /recur only in near-copies of one story, counted once: auctioneer \(2 items, 1 counting near-copies once\), .*, and \d+ more$/);
  assert.equal(entry('Wire::lone').reason, 'noRecurring');
  assert.match(entry('Wire::lone').why[0], /^none of its \d+ candidate phrases recurs on another item$/);
  assert.equal(entry('Wire::blank').reason, 'noCandidate');
  assert.deepEqual(entry('Wire::blank').why, ['its text has no candidate phrase']);
  for (const x of report.items) {
    assert.equal(x.id, x.key.split('::')[1]);
    assert.deepEqual(x.under, [], 'nothing below the bar in this corpus');
  }
});

test('nothing is forced onto an untagged item: the report reads the universe and changes nothing', () => {
  const before = JSON.stringify(universe);
  untaggedReport(universe, info.untagged, 1.6);
  assert.equal(JSON.stringify(universe), before);
  for (const k of ['Wire::lone', 'Wire::blank']) assert.deepEqual(universe.items.find((x) => x.key === k).tags, []);
});

// A canned universe for the cases a small corpus cannot make: tags under the bar, candidates under the
// floor, discovery off.
const canned = {
  concepts: [{ id: 'c_killed', canonical: 'killed' }, { id: 'c_indicate', canonical: 'indicate' }, { id: 'c_heat', canonical: 'heat' }],
  items: [
    { key: 'SD::a', source: 'SD', id: 'a', title: 'Snakebite', tags: [{ c: 'c_indicate', origin: 'discovered', sourceRatio: 1.444 }, { c: 'c_killed', origin: 'discovered', sourceRatio: 1.514 }] },
    { key: 'SD::b', source: 'SD', id: 'b', title: 'Cloak', tags: [{ c: 'c_heat', origin: 'discovered', sourceRatio: 1.7 }] },
    { key: 'SD::c', source: 'SD', id: 'c', title: 'Salamanders', tags: [] },
    { key: 'SD::d', source: 'SD', id: 'd', title: 'Shown', tags: [{ c: 'c_heat', origin: 'discovered' }] },
  ],
};
const cannedReport = {
  bar: 1.6, floor: 1, minDf: 2, maxDfRatio: 0.12, items: 4,
  untagged: {
    'SD::a': { members: ['SD::a'], candidates: 9, single: 6, nearCopy: [], tooCommon: [], incoherent: [], underFloor: [{ phrase: 'crisis', sourceRatio: 0.983 }], underBar: [{ phrase: 'killed', sourceRatio: 1.514, attached: true }, { phrase: 'indicate', sourceRatio: 1.444, attached: true }], dropped: [], notChosen: [] },
    'SD::c': { members: ['SD::c'], candidates: 4, single: 3, nearCopy: [], tooCommon: [{ phrase: 'hidden', df: 13, of: 4 }], incoherent: [], underFloor: [{ phrase: 'fire', sourceRatio: 0.968 }], underBar: [], dropped: [], notChosen: [] },
  },
};

test('tags under the bar are named with their ratios, highest first, and a viewer set lower shows them', () => {
  const r = untaggedReport(canned, cannedReport, 1.6);
  assert.deepEqual(r.items.map((x) => x.key), ['SD::a', 'SD::c']);
  assert.equal(r.count, 2);
  assert.equal(r.none, 1, 'only the salamander item has no tag at any ratio');
  const a = r.items[0];
  assert.deepEqual(a.under, [
    { concept: 'c_killed', label: 'killed', origin: 'discovered', sourceRatio: 1.514 },
    { concept: 'c_indicate', label: 'indicate', origin: 'discovered', sourceRatio: 1.444 },
  ]);
  assert.deepEqual(a.reasons, ['underBar', 'underFloor']);
  assert.deepEqual(a.why, ['only tagz under the 1.6× source coherence bar: killed 1.514, indicate 1.444', 'phrases under the 1× floor: crisis 0.983']);
  const c = r.items[1];
  assert.deepEqual(c.reasons, ['underFloor', 'tooCommon']);
  assert.deepEqual(c.candidates, { phrases: 4, single: 3, tooCommon: [{ phrase: 'hidden', df: 13, of: 4 }], underFloor: [{ phrase: 'fire', sourceRatio: 0.968 }] });
});

test('with discovery off every tag shows, and an item no system tagged says so', () => {
  const r = untaggedReport(canned, null, null);
  assert.equal(r.bar, null);
  assert.deepEqual(r.items.map((x) => x.key), ['SD::c']);
  assert.deepEqual(r.items[0].why, ['no tag-system tagged it, and discovery did not run']);
  assert.equal(r.items[0].reason, 'noDiscovery');
  assert.ok(!('candidates' in r.items[0]));
});

test('a long list is cut at eight in the sentence and kept whole in the candidates', () => {
  const many = Array.from({ length: 11 }, (_, i) => ({ phrase: `w${i}`, sourceRatio: Number((0.9 - i / 100).toFixed(2)) }));
  const r = untaggedReport({ concepts: [], items: [{ key: 'S::x', source: 'S', id: 'x', tags: [] }] }, {
    bar: 1.6, floor: 1, untagged: { 'S::x': { candidates: 11, single: 0, nearCopy: [], tooCommon: [], incoherent: [], underFloor: many, underBar: [], dropped: [], notChosen: [] } },
  }, 1.6);
  assert.match(r.items[0].why[0], /w7 0\.83, and 3 more$/);
  assert.equal(r.items[0].candidates.underFloor.length, 11);
});

test('rtz-build writes the untagged report into build.json, and with discovery on, discover.report.json beside it', () => {
  const dir = tmpDir();
  fs.writeFileSync(path.join(dir, 'in.jsonl'), records.map((r) => JSON.stringify(r)).join('\n') + '\n');
  const cfg = path.join(dir, 'rtz.config.json');
  fs.writeFileSync(cfg, JSON.stringify({ out: 'out', sources: [{ adapter: 'jsonl', path: 'in.jsonl' }], discover: true, ledger: false }));
  const r = spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stderr, /untagged: \d+ items with no tag at the 1\.6× bar, \d+ with none at any/);
  const build = JSON.parse(fs.readFileSync(path.join(dir, 'out', 'build.json'), 'utf8'));
  assert.equal(build.untagged.bar, 1.6);
  assert.ok(build.untagged.items.some((x) => x.key === 'Wire::c1' && x.reason === 'nearCopy'));
  assert.ok(fs.existsSync(path.join(dir, 'out', 'discover.report.json')));
  // without discovery: no report is read, and the reason says discovery did not run
  fs.writeFileSync(cfg, JSON.stringify({ out: 'out2', sources: [{ adapter: 'jsonl', path: 'in.jsonl' }], discover: false, ledger: false }));
  const r2 = spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' });
  assert.equal(r2.status, 0, r2.stderr);
  const build2 = JSON.parse(fs.readFileSync(path.join(dir, 'out2', 'build.json'), 'utf8'));
  assert.equal(build2.untagged.bar, null);
  assert.ok(build2.untagged.items.every((x) => x.reason === 'noDiscovery'));
  assert.equal(build2.untagged.count, 47, 'every item but the one a human tagged');
});

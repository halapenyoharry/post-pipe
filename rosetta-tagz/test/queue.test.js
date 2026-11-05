// The function-word gate, the overrides' ignore and accept lists as discovery reads them, and the queue
// (issues #20 and #32, 2026-11-04).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { discover } from '../lib/discover.js';
import { makeConfig } from '../lib/config.js';
import { buildStone } from '../lib/stone.js';
import { buildUniverse } from '../lib/universe.js';
import { untaggedReport, UNTAGGED_REASONS } from '../lib/untagged.js';
import { FUNCTION_WORDS, isFunctionWord, hasFunctionWord } from '../lib/stopwords.js';
import { STOPWORDS } from '../lib/text.js';
import { rec, tmpDir, ROOT } from './helpers.js';

// A wire with a quantum topic and a volcano topic, two items that share only function words and one
// ordinary word, a tagged note, and filler so nothing is everywhere. Nothing human-written.
const filler = Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`f${i}`, []]));
const fillerMeta = Object.fromEntries(Object.keys(filler).map((k, i) => [k, { title: `zorbl${i} flarn${i} wumpus${i}`, text: `grindle${i} plonk${i} vexor${i} snarf${i}` }]));
const wire = {
  q1: { title: 'Quantum computers solve a hard problem', text: 'a quantum computer uses qubits to search; officials told reporters it is early' },
  q2: { title: 'New quantum chip adds qubits', text: 'engineers built a quantum chip with more qubits; officials told reporters little' },
  q3: { title: 'Quantum error correction keeps qubits stable', text: 'stable qubits make a quantum machine useful; the lab told reporters nothing' },
  v1: { title: 'Volcano eruption buried the city in ash', text: 'an ancient volcano erupted and ash covered every street' },
  v2: { title: 'Ash from a volcano eruption reveals old lives', text: 'the volcano eruption preserved ash layers in the city' },
  o1: { title: 'Thimble', text: 'onto roughly allowing staying bramble thimble' },
  o2: { title: 'Drizzle', text: 'onto roughly allowing staying bramble drizzle' },
};
const records = [
  ...rec('Wire', Object.fromEntries(Object.keys(wire).map((k) => [k, []])), wire),
  ...rec('Mine', { m1: ['physics'] }, { m1: { title: 'Notes on physics', text: 'I keep thinking about quantum computing and qubits as a way to think about measurement' } }),
  ...rec('Filler', filler, fillerMeta),
];
const FUNCTION = ['onto', 'roughly', 'allowing', 'staying'];
const labels = (found) => new Set(found.map((t) => t.label));
const noBars = makeConfig({ discover: { sourceCoherenceRatio: 0, coherenceRatio: 0, minCoherence: 0 } });

test('the stop list is its own: the four words of issue #20 are in it and in no list that already kept words out', () => {
  for (const w of FUNCTION) {
    assert.ok(isFunctionWord(w), w);
    assert.ok(!STOPWORDS.has(w), `${w} was getting through before`);
  }
  assert.ok(hasFunctionWord('onto surfaces'));
  assert.ok(!hasFunctionWord('quantum chip'));
  for (const w of ['thinking', 'writing', 'learning', 'being', 'building', 'meaning']) assert.ok(!FUNCTION_WORDS.has(w), `${w} can be a topic`);
});

test('a function word is refused whatever its score, alone and inside a bigram, and the report names it', () => {
  const info = {};
  const found = discover(records, noBars, info);
  for (const t of found) assert.ok(!hasFunctionWord(t.label.toLowerCase()), `"${t.label}" holds a function word`);
  assert.ok(labels(found).has('bramble'), 'the ordinary word the same two items share is a hub');
  assert.ok(labels(found).has('quantum') || labels(found).has('qubits'));
  // the two items end with a tag (bramble), so the fates say nothing of them; refuse bramble too and they do
  const info2 = {};
  discover(records, noBars, info2, { overrides: { ignore: ['Bramble'] } });
  const fate = info2.untagged.untagged['Wire::o1'];
  assert.ok(fate, 'o1 ends with no tag');
  assert.deepEqual(fate.functionWord.map((x) => x.phrase), ['allowing', 'allowing staying', 'onto', 'onto roughly', 'roughly', 'roughly allowing', 'staying', 'staying bramble']);
  for (const x of fate.functionWord) assert.equal(x.df, 2);
  assert.deepEqual(fate.ignored, [{ phrase: 'bramble', df: 2 }]);
  assert.equal(fate.single, 2, '"thimble" and "bramble thimble" are on this item alone');
  const report = untaggedReport({ concepts: [], items: [{ key: 'Wire::o1', source: 'Wire', id: 'o1', tags: [] }] }, info2.untagged, 0);
  assert.deepEqual(report.items[0].reasons, ['functionWord', 'ignored']);
  assert.equal(report.items[0].why[0], 'function words, never a tag whatever their score: allowing (2), allowing staying (2), onto (2), onto roughly (2), roughly (2), roughly allowing (2), staying (2), staying bramble (2)');
  assert.equal(report.items[0].why[1], 'phrases the site\'s overrides ignore: bramble (2)');
  assert.deepEqual(Object.keys(report.items[0].candidates), ['phrases', 'single', 'functionWord', 'ignored']);
  for (const r of ['queued', 'functionWord', 'ignored']) assert.ok(UNTAGGED_REASONS.includes(r));
});

test('the queue: nothing becomes a tag; every hub that would have been attached is listed with its score, its items and why it passed', () => {
  const info = {};
  const found = discover(records, makeConfig(), info, { queue: true });
  assert.deepEqual(found, []);
  const q = info.queue;
  assert.equal(q.bar, 1.6);
  assert.equal(q.floor, 1);
  assert.ok(q.candidates.length >= 2, `got ${q.candidates.map((c) => c.label)}`);
  const scores = q.candidates.map((c) => c.score);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a), 'highest score first');
  const quantum = q.candidates.find((c) => c.label === 'quantum' || c.label === 'qubits');
  assert.ok(quantum, `got ${q.candidates.map((c) => c.label)}`);
  assert.deepEqual(Object.keys(quantum), ['label', 'score', 'sourceRatio', 'df', 'items', 'why']);
  assert.ok(quantum.items.some((x) => x.key === 'Wire::q1' && x.title === wire.q1.title));
  assert.match(quantum.why, /^recurs in \d+ of \d+ items, which stay alike without it/);
  assert.ok(!q.candidates.some((c) => hasFunctionWord(c.label.toLowerCase())), 'the gate holds in the queue too');
  // the fates say what is queued for each item, and the report sentence says so
  const fate = info.untagged.untagged['Wire::q1'];
  assert.ok(fate.queued.length >= 1);
  assert.deepEqual(Object.keys(fate.queued[0]), ['phrase', 'score', 'sourceRatio']);
  assert.equal(info.untagged.queue, true);
  const stone = buildStone(records);
  const universe = buildUniverse(stone, records);
  const report = untaggedReport(universe, info.untagged, 1.6);
  const q1 = report.items.find((x) => x.key === 'Wire::q1');
  assert.equal(q1.reason, 'queued');
  assert.match(q1.why[0], /^candidates queued, none a tag until accepted in the overrides: /);
  assert.ok(q1.candidates.queued.length >= 1);
  // the same run without the queue attaches what the queue lists
  const attached = discover(records);
  for (const c of q.candidates) assert.ok(labels(attached).has(c.label), `"${c.label}" is a tag when not queued`);
  assert.equal(new Set(attached.map((t) => t.label)).size, q.candidates.length, 'and nothing else is');
});

test('accept: a phrase the overrides accept is attached to every item whose text holds it, spelled as the human wrote it, with no bar to clear, in queue mode too', () => {
  for (const queue of [true, false]) {
    const info = {};
    const found = discover(records, makeConfig(), info, { queue, overrides: { accept: ['Qubits'] } });
    const got = found.filter((t) => t.label === 'Qubits');
    assert.deepEqual(got.map((t) => `${t.source}::${t.item}`).sort(), ['Mine::m1', 'Wire::q1', 'Wire::q2', 'Wire::q3'], 'every item that writes it, the tagged note included');
    for (const t of got) {
      assert.equal(t.origin, 'discovered');
      assert.ok(!('sourceRatio' in t), 'a human\'s choice always shows');
      assert.match(t.why, /^accepted from the queue by the site's overrides; recurs in 4 of \d+ items/);
      assert.equal(t.wasDerivedFrom[0].type, 'text');
      assert.deepEqual(t.wasDerivedFrom[1], { type: 'overrides', key: 'accept', label: 'Qubits' });
      assert.deepEqual(t.wasGeneratedBy, { activity: 'discover', parameters: { accepted: true, df: 4, items: 4 } });
    }
    assert.ok(!info.untagged.untagged['Wire::q1'], 'an item an accepted phrase lands on is tagged');
    if (queue) {
      assert.deepEqual(found, got, 'in queue mode only accepted phrases are tags');
      assert.ok(!info.queue.candidates.some((c) => c.label.toLowerCase() === 'qubits'), 'an accepted phrase is no longer queued');
    }
  }
  // a phrase no item writes is nothing; a function word a human accepts is theirs to accept
  const odd = discover(records, makeConfig(), null, { overrides: { accept: ['pangolin', 'roughly'] } });
  assert.ok(!odd.some((t) => t.label === 'pangolin'));
  assert.deepEqual(odd.filter((t) => t.label === 'roughly').map((t) => t.item).sort(), ['o1', 'o2']);
});

test('rtz-build with discover "queue" writes the queue beside the overrides, attaches only the accepted, and says so in build.json', () => {
  const dir = tmpDir();
  fs.writeFileSync(path.join(dir, 'in.jsonl'), records.map((r) => JSON.stringify(r)).join('\n') + '\n');
  fs.writeFileSync(path.join(dir, 'overrides.json'), JSON.stringify({ accept: ['volcano'] }));
  const cfg = path.join(dir, 'rtz.config.json');
  fs.writeFileSync(cfg, JSON.stringify({ out: 'out', sources: [{ adapter: 'jsonl', path: 'in.jsonl' }], overrides: 'overrides.json', discover: 'queue', ledger: false }));
  const r = spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const queuePath = path.join(dir, 'rtagz-queue.json');
  assert.ok(fs.existsSync(queuePath), 'the queue is beside the overrides file');
  const q = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  assert.equal(q.schema, 'rosetta-tagz/queue@1');
  assert.ok(q.candidates.length >= 1);
  assert.ok(!q.candidates.some((c) => c.label === 'volcano'), 'the accepted phrase is not queued');
  assert.match(r.stderr, /queue: \d+ candidates in .*rtagz-queue\.json, none attached; move one into the overrides' "accept" list to make it a tag/);
  const build = JSON.parse(fs.readFileSync(path.join(dir, 'out', 'build.json'), 'utf8'));
  assert.equal(build.discover, 'queue');
  assert.deepEqual(build.queue, { path: queuePath, candidates: q.candidates.length });
  const q1 = build.untagged.items.find((x) => x.key === 'Wire::q1');
  assert.equal(q1.reason, 'queued');
  const stone = JSON.parse(fs.readFileSync(path.join(dir, 'out', 'stone.json'), 'utf8'));
  assert.deepEqual(stone.concepts.filter((c) => c.discovered).map((c) => c.canonical), ['volcano'], 'only the accepted phrase reached the stone');
  const discovered = fs.readFileSync(path.join(dir, 'out', 'records.discovered.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((x) => x.origin === 'discovered');
  assert.ok(discovered.length === 2 && discovered.every((x) => x.label === 'volcano'));

  // the queue's own path, made relative to the config, folders made as needed; discover true writes none
  fs.writeFileSync(cfg, JSON.stringify({ out: 'out2', sources: [{ adapter: 'jsonl', path: 'in.jsonl' }], overrides: 'overrides.json', discover: 'queue', queue: 'sub/my-queue.json', ledger: false }));
  assert.equal(spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' }).status, 0);
  assert.ok(fs.existsSync(path.join(dir, 'sub', 'my-queue.json')));
  fs.writeFileSync(cfg, JSON.stringify({ out: 'out3', sources: [{ adapter: 'jsonl', path: 'in.jsonl' }], overrides: 'overrides.json', discover: true, ledger: false }));
  assert.equal(spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-build'), '--config', cfg, '--no-view'], { encoding: 'utf8' }).status, 0);
  const plain = JSON.parse(fs.readFileSync(path.join(dir, 'out3', 'build.json'), 'utf8'));
  assert.equal(plain.discover, true);
  assert.ok(!('queue' in plain));
  const plainStone = JSON.parse(fs.readFileSync(path.join(dir, 'out3', 'stone.json'), 'utf8'));
  assert.ok(plainStone.concepts.filter((c) => c.discovered).length > 1, 'with discover true the hubs are attached as before, the accepted one among them');
});

test('rtz-override accept records the choice in overrides.json', () => {
  const dir = tmpDir();
  const file = path.join(dir, 'overrides.json');
  const r = spawnSync(process.execPath, [path.join(ROOT, 'bin/rtz-override'), 'accept', 'Quantum Chip', 'volcano', '--file', file], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), { accept: ['Quantum Chip', 'volcano'] });
});

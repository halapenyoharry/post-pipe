// Runs the real bin/ programs as separate processes. This is the Unix contract under test.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, SYN, tmpDir } from './helpers.js';

const run = (bin, args = [], { input, cwd } = {}) => {
  const r = spawnSync(process.execPath, [`${ROOT}bin/${bin}`, ...args], { input, cwd, encoding: 'utf8', maxBuffer: 1 << 28 });
  return { out: r.stdout, err: r.stderr, status: r.status };
};
const lines = (s) => s.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));

const dir = tmpDir();
const records = [
  run('rtz-ingest', ['jsonfeed', `${SYN}journal.feed.json`]).out,
  run('rtz-ingest', ['jsonfeed', `${SYN}wire.feed.json`]).out,
  run('rtz-ingest', ['jsonfeed', `${SYN}science.feed.json`]).out,
  run('rtz-ingest', ['pairs', `${SYN}archive.tsv`, '--source', 'Archive']).out,
].join('');
fs.writeFileSync(path.join(dir, 'records.jsonl'), records);

test('rtz-ingest emits JSONL records and lists adapters', () => {
  assert.ok(lines(records).length > 100);
  const list = run('rtz-ingest', ['--list']);
  assert.match(list.out, /jsonfeed/);
  assert.equal(run('rtz-ingest', ['nope', 'x']).status, 1);
  assert.equal(run('rtz-ingest', []).status, 2);
});

test('rtz-norm adds normalization keys and passes items through', () => {
  const r = lines(run('rtz-norm', [], { input: records }).out);
  const tag = r.find((x) => x.type === 'tag' && x.label === 'A.I.');
  assert.equal(tag.norm, 'ai');
  assert.ok(r.some((x) => x.type === 'item'));
});

test('stdin and file input are equivalent', () => {
  const a = run('rtz-stone', ['-q'], { input: records });
  const b = run('rtz-stone', [path.join(dir, 'records.jsonl'), '-q']);
  assert.equal(a.status, 0);
  const strip = (s) => JSON.stringify({ ...JSON.parse(s), generated: null });
  assert.equal(strip(a.out), strip(b.out));
});

test('the fully piped form (rtz-pairs | rtz-stone --no-builtin) equals the built-in form', () => {
  const pairs = run('rtz-pairs', ['--no-seed'], { input: records });
  assert.equal(pairs.status, 0);
  const pairRows = lines(pairs.out);
  assert.ok(pairRows.length > 50 && pairRows.every((p) => p.a < p.b && typeof p.score === 'number' && p.signal));
  fs.writeFileSync(path.join(dir, 'pairs.jsonl'), pairs.out);
  const piped = JSON.parse(run('rtz-stone', ['--no-builtin', '--no-seed', '--pairs', path.join(dir, 'pairs.jsonl'), '-q'], { input: records }).out);
  const direct = JSON.parse(run('rtz-stone', ['--no-seed', '-q'], { input: records }).out);
  const shape = (s) => s.concepts.map((c) => c.variants.map((v) => v.norm).join('|')).sort();
  assert.deepEqual(shape(piped), shape(direct));
});

test('an external scorer can force a merge by emitting the same pair format', () => {
  const external = JSON.stringify({ a: 'courts', b: 'criminal justice', signal: 'embedding', score: 0.95, why: 'cosine 0.95 from some model' }) + '\n';
  fs.writeFileSync(path.join(dir, 'ext.jsonl'), external);
  const s = JSON.parse(run('rtz-stone', ['--pairs', path.join(dir, 'ext.jsonl'), '-q'], { input: records }).out);
  const c = s.concepts.find((x) => x.variants.some((v) => v.norm === 'courts'));
  assert.ok(c.variants.some((v) => v.norm === 'criminal justice'));
});

test('rtz-stone prefers ./overrides.json when present and honours --overrides', () => {
  const work = tmpDir();
  fs.writeFileSync(path.join(work, 'overrides.json'), JSON.stringify({ same: [['labor', 'labour']] }));
  const auto = JSON.parse(run('rtz-stone', ['-q'], { input: records, cwd: work }).out);
  assert.ok(auto.concepts.find((c) => c.variants.some((v) => v.norm === 'labour')).locked);
  const none = JSON.parse(run('rtz-stone', ['-q'], { input: records }).out);
  assert.ok(!none.concepts.find((c) => c.variants.some((v) => v.norm === 'labour')).locked);
});

const stoneFile = path.join(dir, 'stone.json');
fs.writeFileSync(stoneFile, run('rtz-stone', ['-q'], { input: records }).out);

test('rtz-translate rewrites known, stems unseen, and flags the unmapped', () => {
  const input = [
    { type: 'tag', source: 'New', item: '1', label: 'A.I.' },
    { type: 'tag', source: 'New', item: '1', label: 'Systems-Thinkings' },
    { type: 'tag', source: 'New', item: '1', label: 'quantum gravity' },
  ].map((r) => JSON.stringify(r)).join('\n');
  const t = lines(run('rtz-translate', [stoneFile], { input }).out);
  assert.deepEqual(t.map((x) => [x.canonical, x.via]), [['AI', 'known'], ['Systems Thinking', 'stem'], ['quantum gravity', 'unmapped']]);
  assert.ok(t.every((x, i) => x.label === ['A.I.', 'Systems-Thinkings', 'quantum gravity'][i]), 'original label untouched');
  const todo = lines(run('rtz-translate', [stoneFile, '--only-unmapped'], { input }).out);
  assert.deepEqual(todo.map((x) => x.label), ['quantum gravity']);
});

test('rtz-lookup: concept card explains the name; review queue prints the accept command', () => {
  const card = run('rtz-lookup', [stoneFile, 'a.i.']).out;
  assert.match(card, /^AI /);
  assert.match(card, /why this name/);
  assert.match(card, /Journal×3/);
  assert.match(run('rtz-lookup', [stoneFile, 'zzz']).out, /not in the stone/);
  const review = run('rtz-lookup', [stoneFile, '--review']).out;
  assert.match(review, /rtz-override same "Labor" "labour"/);
  assert.match(run('rtz-lookup', [stoneFile, '--merged']).out, /Systems Thinking/);
  assert.match(run('rtz-lookup', [stoneFile, '--systems']).out, /Science/);
  assert.equal(JSON.parse(run('rtz-lookup', [stoneFile, 'ai', '--json']).out).id, 'c_ai');
});

test('rtz-override writes only overrides.json and is idempotent', () => {
  const f = path.join(tmpDir(), 'overrides.json');
  run('rtz-override', ['--file', f, 'same', 'labor', 'labour']);
  run('rtz-override', ['--file', f, 'same', 'labor', 'labour']);
  run('rtz-override', ['--file', f, 'pin', 'ai', 'Artificial Intelligence']);
  run('rtz-override', ['--file', f, 'relate', 'ai', 'synergy', 'labor', 'care']);
  run('rtz-override', ['--file', f, 'trust', 'Science', '0.5']);
  run('rtz-override', ['--file', f, 'prefer', 'short']);
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  assert.deepEqual(data.same, [['labor', 'labour']]);
  assert.equal(data.pin.ai, 'Artificial Intelligence');
  assert.deepEqual(data.relations, [{ a: 'ai', type: 'synergy', b: 'labor', note: 'care' }]);
  assert.equal(data.sourceWeights.Science, 0.5);
  assert.equal(data.canon.prefer, 'short');
  assert.equal(run('rtz-override', ['--file', f, 'prefer', 'sideways']).status, 1);
  assert.equal(run('rtz-override', ['--file', f, 'bogus']).status, 2);
});

test('emerge -> universe -> graph (focus by any spelling) -> view', () => {
  const all = path.join(dir, 'all.jsonl');
  assert.equal(run('rtz-emerge', [stoneFile, path.join(dir, 'records.jsonl'), '--all', '-o', all]).status, 0);
  const uni = path.join(dir, 'universe.json');
  assert.equal(run('rtz-universe', [stoneFile, all, '-o', uni]).status, 0);
  const g = JSON.parse(run('rtz-graph', [uni, '--mode', 'dyadic', '--focus', 'A.I.', '--hops', '1']).out);
  assert.equal(g.meta.mode, 'dyadic');
  assert.ok(g.nodes.length > 0 && g.links.length > 0);
  assert.equal(run('rtz-graph', [uni, '--focus', 'no such tag']).status, 1);
  const html = path.join(dir, 'view.html');
  assert.equal(run('rtz-view', [uni, '-o', html]).status, 0);
  const text = fs.readFileSync(html, 'utf8');
  for (const token of ['/*__LIB__*/', '/*__CANON__*/', '/*__GRAPH__*/', '/*__UNIVERSE__*/']) assert.ok(!text.includes(token), token);
  for (const m of text.matchAll(/<script>([\s\S]*?)<\/script>/g)) assert.doesNotThrow(() => new Function(m[1]));
  assert.ok(!/(src|href)=["']https?:/i.test(text), 'viewer must not reference the network');
  // script 0 is the vendored 3D library (it contains loaders the viewer never calls); 1..3 are ours
  const ours = [...text.matchAll(/<script>([\s\S]*?)<\/script>/g)].slice(1).map((m) => m[1]).join('\n');
  assert.ok(!/\bfetch\(|XMLHttpRequest|WebSocket\(|sendBeacon|importScripts|https?:\/\//.test(ours.replace(/const U = [\s\S]*?;\n\(function/, '(function')), 'viewer code makes no network calls');
});

test('the viewer survives hostile text in tags, titles and excerpts', () => {
  const evil = '</script><img src=x onerror=alert(1)>';
  const hostile = [
    { type: 'item', source: 'X', id: '1', title: evil, text: evil, url: '', date: '', kind: '' },
    { type: 'tag', source: 'X', item: '1', label: evil, weight: 1 },
    { type: 'tag', source: 'X', item: '1', label: 'normal', weight: 1 },
  ].map((r) => JSON.stringify(r)).join('\n');
  const s = run('rtz-stone', ['-q'], { input: hostile }).out;
  const sf = path.join(dir, 'evil-stone.json');
  fs.writeFileSync(sf, s);
  const uf = path.join(dir, 'evil-universe.json');
  fs.writeFileSync(uf, run('rtz-universe', [sf], { input: hostile }).out);
  const html = run('rtz-view', [uf]).out;
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 4, 'a </script> inside data must not terminate the data script');
  assert.ok(!html.includes(evil), 'the closing script tag in data is neutralised in the embedded JSON');
});

test('rtz build runs the whole pipeline from a config file', () => {
  const out = path.join(tmpDir(), 'build');
  const cfg = path.join(tmpDir(), 'rtz.config.json');
  fs.writeFileSync(cfg, JSON.stringify({ out, sources: [{ adapter: 'jsonfeed', path: `${SYN}wire.feed.json` }, { adapter: 'pairs', path: `${SYN}archive.tsv`, source: 'Archive' }] }));
  const r = run('rtz', ['build', '--config', cfg]);
  assert.equal(r.status, 0, r.err);
  for (const f of ['records.jsonl', 'stone.json', 'records.all.jsonl', 'universe.json', 'view.html', 'build.json']) assert.ok(fs.existsSync(path.join(out, f)), f);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, 'build.json'), 'utf8')).stages.map((s) => s.name), ['ingest jsonfeed', 'ingest pairs', 'stone', 'emerge', 'universe', 'view']);
  assert.equal(run('rtz', ['build', '--config', path.join(out, 'nope.json')]).status, 1);
});

test('rtz dispatcher: help, unknown command, and error reporting', () => {
  assert.match(run('rtz', ['help']).out, /a Rosetta stone for tags/);
  assert.equal(run('rtz', ['frobnicate']).status, 2);
  const bad = run('rtz-stone', ['-q'], { input: '{"type":"item"}\nnot json\n' });
  assert.equal(bad.status, 1);
  assert.match(bad.err, /stdin:2: invalid JSON/);
  assert.equal(run('rtz-stone', ['--bogus-flag']).status, 2);
});

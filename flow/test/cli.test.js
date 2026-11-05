import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { syntheticFeed, syntheticPositions, FLOW_ROOT } from './helpers.js';

const bin = (name) => path.join(FLOW_ROOT, 'bin', name);
const preset = (name) => path.join(FLOW_ROOT, 'presets', `${name}.json`);

function run(name, args, input) {
  const r = spawnSync(process.execPath, [bin(name), ...args], { input, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

test('cli: select, score, order and render chain on stdin and stdout, deterministically', () => {
  const feed = JSON.stringify(syntheticFeed());
  const sub1 = run('flow-select', ['--all'], feed);
  const sub2 = run('flow-select', [], feed);
  assert.equal(sub1.code, 0, sub1.err);
  assert.equal(sub1.out, sub2.out);
  assert.equal(JSON.parse(sub1.out).cards.length, 6);

  const scored = run('flow-score', ['--preset', preset('by-weight')], sub1.out);
  assert.equal(scored.code, 0, scored.err);
  const scoredAgain = run('flow-score', ['--preset', preset('by-weight')], sub1.out);
  assert.equal(scored.out, scoredAgain.out);
  assert.equal(JSON.parse(scored.out).preset.name, 'by-weight');

  const flow = run('flow-order', [], scored.out);
  assert.equal(flow.code, 0, flow.err);
  const parsed = JSON.parse(flow.out);
  assert.equal(parsed.summary.mode, 'score');
  assert.equal(parsed.items.length, 6);

  const walk = run('flow-order', ['--mode', 'walk', '--seam', '3'], scored.out);
  assert.equal(walk.code, 0, walk.err);
  assert.equal(JSON.parse(walk.out).summary.mode, 'walk');
  assert.equal(JSON.parse(walk.out).summary.switches.seam, 3);

  const text = run('flow-render', ['--target', 'text', '--full', '2'], flow.out);
  assert.equal(text.code, 0, text.err);
  assert.match(text.out, /^flow by-weight: 6 cards/);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'flow-cli-'));
  const positions = path.join(dir, 'positions.json');
  fs.writeFileSync(positions, JSON.stringify(syntheticPositions()));
  const stats = path.join(dir, 'stats.json');
  const svg = run('flow-render', ['--target', 'path', '--positions', positions, '--stats', stats], flow.out);
  assert.equal(svg.code, 0, svg.err);
  assert.match(svg.out, /^<svg /);
  assert.equal(JSON.parse(fs.readFileSync(stats, 'utf8')).segments, 5);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('cli: the neighbourhood preset walks; --around and --set select; switches override the preset', () => {
  const feed = JSON.stringify(syntheticFeed());
  const around = run('flow-select', ['--around', 'https://example.test/c1', '--hops', '1'], feed);
  assert.equal(around.code, 0, around.err);
  assert.equal(JSON.parse(around.out).position, 'https://example.test/c1');
  assert.equal(JSON.parse(around.out).cards.length, 3);
  const set = run('flow-select', ['--set', 'https://example.test/c4,https://example.test/c5'], feed);
  assert.equal(JSON.parse(set.out).cards.length, 2);

  const scored = run('flow-score', ['--preset', preset('by-neighbourhood'), '--degree-penalty', 'none', '--half-life', '10', '--tag-measure', 'weight'], around.out);
  assert.equal(scored.code, 0, scored.err);
  const p = JSON.parse(scored.out).preset;
  assert.equal(p.switches.degreePenalty, 'none');
  assert.equal(p.switches.recencyHalfLifeDays, 10);
  assert.equal(p.switches.tagMeasure, 'weight');
  assert.equal(p.switches.orderMode, 'walk');
  assert.equal(p.switches.walkStart, 'newest');
  const flow = run('flow-order', [], scored.out);
  assert.equal(JSON.parse(flow.out).summary.mode, 'walk');
  assert.equal(JSON.parse(flow.out).summary.start.rule, 'newest');

  const explicit = run('flow-order', ['--start', 'https://example.test/c3'], scored.out);
  assert.equal(explicit.code, 0, explicit.err);
  assert.equal(JSON.parse(explicit.out).items[0].id, 'https://example.test/c3');
  assert.equal(JSON.parse(explicit.out).summary.start.rule, 'explicit');

  const sourceFallback = run('flow-order', ['--walk-start', 'newest', '--start-source', 'Absent'], scored.out);
  assert.equal(sourceFallback.code, 0, sourceFallback.err);
  assert.equal(JSON.parse(sourceFallback.out).summary.start.rule, 'newest (no card of Absent; whole subfield)');
});

test('cli: bad input exits 1 with one line on stderr', () => {
  const sub = run('flow-select', ['--all'], JSON.stringify(syntheticFeed())).out;
  const scored = run('flow-score', ['--preset', preset('by-neighbourhood')], sub).out;
  const cases = [
    run('flow-select', [], '{}'),
    run('flow-select', ['--all', '--set', 'a'], JSON.stringify(syntheticFeed())),
    run('flow-select', ['--hops', 'two'], JSON.stringify(syntheticFeed())),
    run('flow-select', ['--bogus'], ''),
    run('flow-score', [], '{}'),
    run('flow-score', ['--preset', '/nonexistent/preset.json'], '{}'),
    run('flow-score', ['--preset', preset('by-weight')], 'not json'),
    run('flow-score', ['--preset', preset('by-weight'), '--tag-measure', 'bogus'], sub),
    run('flow-order', [], '{"cards":[]}'),
    run('flow-order', ['--mode', 'spiral'], '{}'),
    run('flow-order', ['--walk-start', 'oldest'], scored),
    run('flow-order', ['--start', 'https://example.test/nope'], scored),
    run('flow-render', ['--target', 'path'], '{"items":[]}'),
    run('flow-render', ['--target', 'here'], '{"items":[]}'),
    run('flow-capture', [], ''),
    run('flow-capture', ['--url', 'https://example.com/'], ''),
  ];
  for (const c of cases) {
    assert.equal(c.code, 1, c.err || c.out);
    assert.equal(c.err.trim().split('\n').length, 1, c.err);
    assert.equal(c.out, '');
  }
});

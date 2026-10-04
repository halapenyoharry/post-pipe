import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runAdapter } from '../lib/adapters/index.js';
import { loadCorpus } from '../lib/corpus.js';
import { buildStone } from '../lib/stone.js';
import { buildUniverse } from '../lib/universe.js';
import { emerge } from '../lib/emerge.js';
import { readJSON } from '../lib/io.js';

export const ROOT = new URL('..', import.meta.url).pathname;
export const SYN = `${ROOT}examples/synthetic/`;

export function syntheticRecords() {
  return [
    ...runAdapter('jsonfeed', `${SYN}journal.feed.json`),
    ...runAdapter('jsonfeed', `${SYN}wire.feed.json`),
    ...runAdapter('jsonfeed', `${SYN}science.feed.json`),
    ...runAdapter('pairs', `${SYN}archive.tsv`, { source: 'Archive' }),
  ];
}

export const shippedSeed = () => readJSON(`${ROOT}seed/common.json`);

export function syntheticStone(opts = {}) {
  return buildStone(syntheticRecords(), { seeds: [shippedSeed()], ...opts });
}

export function syntheticUniverse(opts = {}) {
  const records = syntheticRecords();
  const stone = buildStone(records, { seeds: [shippedSeed()], ...opts });
  const all = [...records, ...emerge(stone, records)];
  return { stone, records: all, universe: buildUniverse(stone, all) };
}

// compact record builder: rec('Src', {i1: ['a','b']}) -> items + tags
export function rec(source, items, extra = {}) {
  const out = [];
  for (const [id, labels] of Object.entries(items)) {
    const meta = extra[id] ?? {};
    out.push({ type: 'item', source, id, title: meta.title ?? id, text: meta.text ?? '', url: meta.url ?? '', date: '', kind: '' });
    for (const label of labels) out.push({ type: 'tag', source, item: id, label, weight: 1, origin: 'explicit' });
  }
  return out;
}

export const corpusOf = (records) => loadCorpus(records);

export function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'rtz-test-'));
}

export const conceptOf = (stone, label) => {
  const norm = label.toLowerCase();
  return stone.concepts.find((c) => c.variants.some((v) => v.norm === norm || v.label.toLowerCase() === norm));
};

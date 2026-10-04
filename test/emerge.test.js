import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStone } from '../lib/stone.js';
import { emerge } from '../lib/emerge.js';
import { syntheticStone, syntheticRecords, rec } from './helpers.js';

const stone = syntheticStone();
const records = syntheticRecords();
const fresh = emerge(stone, records);
const tagsOf = (source, item) => fresh.filter((r) => r.source === source && r.item === item).map((r) => r.concept);
const id = (label) => stone.concepts.find((c) => c.variants.some((v) => v.norm === label.toLowerCase())).id;

test('untagged items earn concept tags from what their text says', () => {
  const s1 = tagsOf('Science', 's1');
  for (const l of ['machine learning', 'deep learning', 'neural networks']) assert.ok(s1.includes(id(l)), l);
  assert.ok(tagsOf('Science', 's3').includes(id('ai')), '"artificial intelligence" in the text earns the AI concept');
  assert.ok(tagsOf('Science', 's2').includes(id('global warming')), '"climate change" in the text earns the merged concept');
});

test('items that mention nothing known stay untagged', () => {
  assert.deepEqual(tagsOf('Science', 's8'), []);
  assert.deepEqual(tagsOf('Science', 's9'), []);
});

test('every emergent tag explains itself and stays below certainty', () => {
  assert.ok(fresh.length > 10);
  for (const t of fresh) {
    assert.equal(t.origin, 'emergent');
    assert.ok(t.why.startsWith('text mentions'));
    assert.ok(t.weight >= 0.25 && t.weight <= 0.9);
  }
});

test('never re-tags what a human already tagged (even under another spelling)', () => {
  const j1 = tagsOf('Journal', 'j1'); // tagged "ai"; its summary also says "artificial intelligence"
  assert.ok(!j1.includes(id('ai')));
});

test('acronyms only match in capitals, never as a lowercase fragment', () => {
  const s = buildStone(
    [
      ...rec('A', { 1: ['AI'], 2: ['AI'] }),
      ...rec('B', { x: [], y: [], z: [] }, { x: { title: 'The AI boom', text: '' }, y: { title: 'said the maid', text: 'she waited' }, z: { title: 'ai', text: 'plain lowercase ai' } }),
    ],
    {},
  );
  const out = emerge(s, [
    ...rec('A', { 1: ['AI'], 2: ['AI'] }),
    ...rec('B', { x: [], y: [], z: [] }, { x: { title: 'The AI boom', text: '' }, y: { title: 'said the maid', text: 'she waited' }, z: { title: 'ai', text: 'plain lowercase ai' } }),
  ]);
  const hit = out.map((t) => t.item);
  assert.ok(hit.includes('x'));
  assert.ok(!hit.includes('y'), '"maid"/"waited" contain the letters a-i');
  assert.ok(!hit.includes('z'), 'lowercase ai is not the acronym');
});

test('a phrase on too many items is too common to be evidence', () => {
  const base = rec('T', { t1: ['media'], t2: ['media'] });
  const many = {};
  for (let i = 0; i < 12; i++) many[`m${i}`] = [];
  const meta = Object.fromEntries(Object.keys(many).map((k) => [k, { title: 'the media says', text: 'media media' }]));
  const recs = [...base, ...rec('U', many, meta)];
  const s = buildStone(recs, {});
  assert.equal(emerge(s, recs).length, 0);
});

test('single short words and stopwords are never phrase-matched', () => {
  const recs = [...rec('T', { 1: ['art'], 2: ['art'] }), ...rec('U', { a: [] }, { a: { title: 'art and the art of art', text: '' } })];
  const s = buildStone(recs, {});
  assert.equal(emerge(s, recs).length, 0, '"art" is 3 letters: too short to match on its own');
});

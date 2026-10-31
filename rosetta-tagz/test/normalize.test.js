import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLabel, stem, looksLikeAcronym, initials } from '../lib/normalize.js';

test('stem makes plural/gerund/e-drop forms agree', () => {
  const same = [
    ['system', 'systems'], ['thinking', 'think'], ['category', 'categories'],
    ['study', 'studies'], ['box', 'boxes'], ['class', 'classes'], ['make', 'making'],
    ['run', 'running'], ['movie', 'movies'], ['analysis', 'analyses'],
    ['connect', 'connected'], ['person', 'people'],
  ];
  for (const [a, b] of same) assert.equal(stem(a), stem(b), `${a} ~ ${b}`);
});

test('stem leaves distinct words distinct', () => {
  assert.notEqual(stem('politics'), stem('political'));
  assert.notEqual(stem('thinker'), stem('think'));
  assert.equal(stem('news'), 'news');
  assert.equal(stem('ai'), 'ai');
  assert.equal(stem('2024'), '2024');
});

test('case, hyphen, underscore, hash and dots collapse to one norm', () => {
  for (const v of ['AI', 'ai', '#AI', 'A.I.', 'Ai']) assert.equal(normalizeLabel(v).norm, 'ai', v);
  for (const v of ['Systems Thinking', 'systems-thinking', 'systems_thinking', 'SystemsThinking']) {
    assert.equal(normalizeLabel(v).norm, 'systems thinking', v);
  }
});

test('accents fold and & becomes and', () => {
  assert.equal(normalizeLabel('Café Culture').norm, 'cafe culture');
  assert.equal(normalizeLabel('Law & Order').norm, 'law and order');
});

test('skey ignores plural/gerund and stopwords, tkey also ignores order', () => {
  const a = normalizeLabel('Theory of Mind');
  const b = normalizeLabel('theories mind');
  assert.equal(a.skey, b.skey);
  const c = normalizeLabel('mind theory');
  assert.notEqual(a.skey, c.skey);
  assert.equal(a.tkey, c.tkey);
});

test('acronym helpers', () => {
  assert.ok(looksLikeAcronym('AI'));
  assert.ok(looksLikeAcronym('A.I.'));
  assert.ok(!looksLikeAcronym('ai'));
  assert.ok(!looksLikeAcronym('Systems'));
  assert.equal(initials(normalizeLabel('artificial intelligence').content), 'ai');
  assert.equal(initials(normalizeLabel('machine learning').content), 'ml');
  assert.equal(initials(['single']), '');
});

test('empty and weird input does not throw', () => {
  assert.equal(normalizeLabel('').norm, '');
  assert.equal(normalizeLabel(null).norm, '');
  assert.equal(normalizeLabel('!!!').norm, '');
});

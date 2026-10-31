import test from 'node:test';
import assert from 'node:assert/strict';
import { makeConfig } from '../lib/config.js';
import { computeSignals } from '../lib/signals/index.js';
import { anchorSignals, canonicalUrl } from '../lib/signals/anchor.js';
import { textSignals } from '../lib/signals/textsim.js';
import { seedSignals } from '../lib/signals/seed.js';
import { corpusOf, rec } from './helpers.js';

const cfg = makeConfig();
const find = (signals, a, b, signal) => signals.find((s) => s.a === [a, b].sort()[0] && s.b === [a, b].sort()[1] && s.signal === signal);
const sig = (records, only) => computeSignals(corpusOf(records), cfg, { only });

test('stem: plural / gerund variants are the same term sequence', () => {
  const s = sig(rec('A', { 1: ['system thinking'], 2: ['systems thinking'] }), ['lexical']);
  assert.equal(find(s, 'system thinking', 'systems thinking', 'stem').score, cfg.signals.stem);
});

test('tokenset: same words, different order, is weaker than stem', () => {
  const s = sig(rec('A', { 1: ['theory of mind'], 2: ['mind theory'] }), ['lexical']);
  const hit = find(s, 'theory of mind', 'mind theory', 'tokenset');
  assert.equal(hit.score, cfg.signals.tokenset);
  assert.ok(!find(s, 'theory of mind', 'mind theory', 'stem'));
});

test('edit: spelling variants are found, derivational suffixes are not', () => {
  const s = sig(rec('A', { 1: ['labor', 'trade', 'color'], 2: ['labour', 'trader', 'colour'] }), ['lexical']);
  assert.ok(find(s, 'labor', 'labour', 'edit'), 'labor~labour');
  assert.ok(find(s, 'color', 'colour', 'edit'), 'color~colour');
  assert.ok(!find(s, 'trade', 'trader', 'edit'), 'trade/trader is a different word');
  assert.ok(find(s, 'labor', 'labour', 'edit').score < cfg.mergeThreshold, 'edit alone must not merge');
});

test('acronym: initials match but are deliberately too weak to merge alone', () => {
  const s = sig(rec('A', { 1: ['ai', 'ml'], 2: ['artificial intelligence', 'machine learning', 'art installation'] }), ['acronym']);
  assert.ok(find(s, 'ai', 'artificial intelligence', 'acronym'));
  assert.ok(find(s, 'ai', 'art installation', 'acronym'), 'ambiguity is real: AI is also art installation');
  assert.ok(find(s, 'ml', 'machine learning', 'acronym'));
  assert.ok(cfg.signals.acronym < cfg.mergeThreshold);
});

test('seed: only labels present in the corpus produce evidence', () => {
  const corpus = corpusOf(rec('A', { 1: ['ai'], 2: ['artificial intelligence'] }));
  const out = seedSignals(corpus, cfg.signals, [{ same: [['ai', 'artificial intelligence', 'a.i.', 'not present anywhere']] }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].score, cfg.signals.seed);
});

test('anchor: a shared URL aligns the tags of two systems, weighted by 1/max(tags)', () => {
  const records = [
    ...rec('Left', { a: ['alpha'] }, { a: { url: 'https://www.Example.org/post/1/?utm=x#frag' } }),
    ...rec('Right', { b: ['beta'] }, { b: { url: 'http://example.org/post/1' } }),
  ];
  const out = anchorSignals(corpusOf(records), cfg.signals);
  assert.equal(out.length, 1);
  // S = 1 (one clean 1-to-1 item): cap * 1 / 1.5
  assert.ok(Math.abs(out[0].score - (cfg.signals.anchor * 1) / 1.5) < 1e-9);
});

test('anchor: noisy multi-tag items give each pairing less weight', () => {
  const records = [
    ...rec('Left', { a: ['a1', 'a2', 'a3'] }, { a: { url: 'https://x.org/p' } }),
    ...rec('Right', { b: ['b1', 'b2'] }, { b: { url: 'https://x.org/p' } }),
  ];
  const out = anchorSignals(corpusOf(records), cfg.signals);
  assert.equal(out.length, 6);
  assert.ok(out.every((o) => o.score < 0.4));
});

test('anchor: same source never anchors to itself; unrelated URLs never anchor', () => {
  const same = [...rec('S', { a: ['x'] }, { a: { url: 'https://x.org/p' } }), ...rec('S', { b: ['y'] }, { b: { url: 'https://x.org/p' } })];
  assert.equal(anchorSignals(corpusOf(same), cfg.signals).length, 0);
  const diff = [...rec('L', { a: ['x'] }, { a: { url: 'https://x.org/p' } }), ...rec('R', { b: ['y'] }, { b: { url: 'https://x.org/q' } })];
  assert.equal(anchorSignals(corpusOf(diff), cfg.signals).length, 0);
  assert.equal(canonicalUrl('not a url'), '');
});

test('text: a tag with a single item has no distribution and yields no text evidence', () => {
  const records = [
    ...rec('A', { 1: ['cats'] }, { 1: { title: 'cats purr softly', text: 'felines purr and nap' } }),
    ...rec('B', { 2: ['kittens'] }, { 2: { title: 'kittens purr softly', text: 'felines purr and nap' } }),
  ];
  assert.equal(textSignals(corpusOf(records), cfg.signals).length, 0);
});

test('text: tags used on similar texts, at least twice each, produce capped evidence', () => {
  const t = 'felines purr nap sunbeam whiskers';
  const records = [
    ...rec('A', { 1: ['cats'], 2: ['cats'] }, { 1: { title: 'one', text: t }, 2: { title: 'two', text: t } }),
    ...rec('B', { 3: ['felines'], 4: ['felines'] }, { 3: { title: 'three', text: t }, 4: { title: 'four', text: t } }),
    ...rec('C', { 5: ['dogs'], 6: ['dogs'], 7: ['dogs'] }, { 5: { title: 'five', text: 'barking leash fetch bones' }, 6: { title: 'six', text: 'barking leash fetch bones' }, 7: { title: 'seven', text: 'barking leash fetch bones' } }),
  ];
  const out = textSignals(corpusOf(records), cfg.signals);
  const hit = find(out, 'cats', 'felines', 'text');
  assert.ok(hit);
  assert.ok(hit.score <= cfg.signals.text);
  assert.ok(!find(out, 'cats', 'dogs', 'text'));
});

test('acronym: a phrase that already contains the acronym is not what it abbreviates', () => {
  const s = sig(rec('A', { 1: ['ai'], 2: ['ai infrastructure', 'artificial intelligence'] }), ['acronym']);
  assert.ok(!find(s, 'ai', 'ai infrastructure', 'acronym'), '"ai infrastructure" contains "ai"');
  assert.ok(find(s, 'ai', 'artificial intelligence', 'acronym'));
});

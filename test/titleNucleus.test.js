// The label seam. A graph zoomed out has room for two words; which two decides
// whether the view is navigable or a smear.

const { test } = require('node:test');
const assert = require('node:assert');
const { nucleus, labelLadder } = require('../src/corpus/titleNucleus');

test('keeps a contiguous phrase, not scattered high-scoring words', () => {
  // The regression that motivated contiguity: picking the best n words
  // independently produced pairs that were individually defensible and
  // collectively meaningless.
  const out = nucleus('The Rising Baseball Star, a Fatal Car Crash and the Fixer', 2);
  assert.strictEqual(out, 'Rising Baseball');
});

test('prefers a proper-noun phrase when one is present', () => {
  assert.strictEqual(
    nucleus('Homeland Security Opens Child Exploitation Probe Into Banned Texas Volleyball Coach', 2),
    'Homeland Security',
  );
});

test('drops articles, prepositions and contractions', () => {
  assert.strictEqual(nucleus("Art Isn't Magic. It's Complexity.", 2), "Art Magic");
  const words = nucleus('Got a Connection to Dominican Baseball? Text Us on WhatsApp.', 2).split(' ');
  assert.ok(!words.includes('a'), 'the article is gone as a word, not as a letter');
  assert.ok(!words.includes('to'), words.join(' '));
});

test('strips sentence punctuation but keeps abbreviations intact', () => {
  assert.strictEqual(nucleus('Empty Seat: U.S. Absent as Western Powers Meet', 4), 'Empty Seat U.S. Absent');
});

test('a title shorter than the budget is returned whole', () => {
  assert.strictEqual(nucleus('Act or Ask', 4), 'Act or Ask');
  assert.strictEqual(nucleus('Egregores', 2), 'Egregores');
});

test('returns fewer words rather than padding with junk', () => {
  // Three content words, four asked for. Adding back the contractions we just
  // removed would make it worse, not longer.
  const out = nucleus("Art Isn't Magic. It's Complexity.", 4);
  assert.ok(!out.includes("Isn't"), out);
  assert.ok(!out.includes("It's"), out);
});

test('is deterministic', () => {
  const t = 'Scientists discover a hidden immune signal that helps spinal cords regrow';
  assert.strictEqual(nucleus(t, 2), nucleus(t, 2));
});

test('survives empty, missing and punctuation-only titles', () => {
  assert.strictEqual(nucleus('', 2), '');
  assert.strictEqual(nucleus(undefined, 2), '');
  assert.strictEqual(nucleus('!!! ???', 2), '');
});

test('an authored short_title wins over any heuristic', () => {
  const ladder = labelLadder({
    title: 'The Mechanics of Effortless Action vs. Calculated Compliance',
    short_title: 'Act or Ask',
  });
  assert.strictEqual(ladder.medium, 'Act or Ask', 'the writer already compressed it');
  assert.strictEqual(ladder.full, 'The Mechanics of Effortless Action vs. Calculated Compliance');
});

test('an authored short_title over budget is reduced, not truncated', () => {
  // Six words authored, four and two wanted. The reduction runs on the
  // author's own wording rather than falling back to the full title, so their
  // choice of words survives even when their length does not.
  const ladder = labelLadder({
    title: 'The Mechanics of Effortless Action vs. Calculated Compliance',
    short_title: 'Effortless Action vs. Calculated Compliance',
  });
  assert.strictEqual(ladder.short, 'Effortless Action');
  assert.strictEqual(ladder.medium, 'Effortless Action Calculated Compliance');
  assert.ok(!ladder.medium.includes('Mechanics'), 'reduced from the authored text, not the title');
});

test('the ladder degrades to the title when nothing is authored', () => {
  const ladder = labelLadder({ title: 'Regulators Knew This Drug Was Harming People' });
  assert.strictEqual(ladder.short.split(' ').length, 2);
  assert.strictEqual(ladder.medium.split(' ').length, 4);
  assert.strictEqual(ladder.full, 'Regulators Knew This Drug Was Harming People');
});

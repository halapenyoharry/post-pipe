// The line a card with no tagz carries (src/lib/untaggedBecause.js), from the
// facts rosetta-tagz reports and the site's switches; T46, 2026-11-04.
const test = require('node:test');
const assert = require('node:assert');
const { untaggedBecause, untaggedBecauseOf } = require('../src/lib/untaggedBecause');

const entry = (reasons, candidates) => ({ reason: reasons[0], reasons, why: [], under: [], ...(candidates ? { candidates } : {}) });

test('discovery off: the site switch, or rosetta-tagz saying so, whatever else the entry holds', () => {
  assert.strictEqual(untaggedBecause(entry(['noDiscovery']), { discover: false, emerge: true }), 'source gave none, discovery off');
  assert.strictEqual(untaggedBecause(entry(['noRecurring']), { discover: false, emerge: true }), 'source gave none, discovery off');
  assert.strictEqual(untaggedBecause(entry(['noDiscovery']), { discover: true, emerge: true }), 'source gave none, discovery off');
  assert.strictEqual(untaggedBecause(entry(['noDiscovery']), { discover: 'queue', emerge: false }), 'source gave none, discovery off');
  assert.strictEqual(untaggedBecause({}, {}), 'source gave none, discovery off', 'the defaults are discovery off');
});

test('queued: the count of candidates the queue holds for this card', () => {
  const queued = { phrases: 6, single: 2, queued: [{ phrase: 'quantum', score: 3.1, sourceRatio: 2.2 }, { phrase: 'qubits', score: 2.4, sourceRatio: 1.9 }] };
  assert.strictEqual(untaggedBecause(entry(['queued'], queued), { discover: 'queue', emerge: true }), 'source gave none, candidates queued (2)');
  assert.strictEqual(untaggedBecause(entry(['queued', 'functionWord'], queued), { discover: 'queue', emerge: false }), 'source gave none, candidates queued (2)');
  // nothing queued for it: the other lines apply as with discover true
  assert.strictEqual(untaggedBecause(entry(['noRecurring'], { phrases: 3, single: 3 }), { discover: 'queue', emerge: true }), 'source gave none, nothing recurred');
  assert.strictEqual(untaggedBecause(entry(['functionWord'], { phrases: 3, single: 1, functionWord: [{ phrase: 'onto', df: 4 }] }), { discover: 'queue', emerge: true }), 'emerge found no concept');
});

test('nothing recurred: no phrase of the text is on a second distinct item', () => {
  for (const reasons of [['noRecurring'], ['noCandidate'], ['nearCopy'], ['nearCopy', 'noRecurring']]) {
    assert.strictEqual(untaggedBecause(entry(reasons), { discover: true, emerge: true }), 'source gave none, nothing recurred', reasons.join());
    assert.strictEqual(untaggedBecause(entry(reasons), { discover: true, emerge: false }), 'source gave none, nothing recurred', reasons.join());
  }
});

test('phrases recurred and every one was refused: emergence, when it ran, found no concept; off, the refusal is the line', () => {
  for (const reasons of [['functionWord'], ['ignored'], ['tooCommon'], ['incoherent'], ['underFloor'], ['dropped'], ['notChosen'], ['underBar'], ['nearCopy', 'tooCommon']]) {
    assert.strictEqual(untaggedBecause(entry(reasons), { discover: true, emerge: true }), 'emerge found no concept', reasons.join());
    assert.strictEqual(untaggedBecause(entry(reasons), { discover: true, emerge: false }), 'source gave none, every phrase refused', reasons.join());
  }
});

test('an entry from an older engine, with a why but no codes, still gets a true line', () => {
  const bare = { why: ['no phrase recurs'] };
  assert.strictEqual(untaggedBecause(bare, { discover: true, emerge: true }), 'emerge found no concept');
  assert.strictEqual(untaggedBecause(bare, { discover: true, emerge: false }), 'source gave none, nothing recurred');
  assert.strictEqual(untaggedBecause({ reason: 'noRecurring' }, { discover: true, emerge: true }), 'source gave none, nothing recurred', 'a lone reason is read');
});

test('the viewer reads the line on the item, else on the feed item a node keeps as originalItem, else nothing', () => {
  assert.strictEqual(untaggedBecauseOf({ untaggedBecause: 'source gave none, discovery off' }), 'source gave none, discovery off');
  assert.strictEqual(untaggedBecauseOf({ id: 'n1', originalItem: { untaggedBecause: 'emerge found no concept' } }), 'emerge found no concept');
  assert.strictEqual(untaggedBecauseOf({ untaggedBecause: '' }), null);
  assert.strictEqual(untaggedBecauseOf({ tags: [] }), null);
  assert.strictEqual(untaggedBecauseOf(null), null);
});

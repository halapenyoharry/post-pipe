// How much of each card the reader shows before the next (readerWords.js):
// the choice and where it comes from, the cut at about N words on plain
// strings, the open card's progress, and the cards beneath the open one.
// The cut on HTML (excerptHtml) needs a DOM, which node has not; the browser
// checks it. Plain invented sentences only.

const test = require('node:test');
const assert = require('node:assert');
const {
  WORDS_CHOICES, DEFAULT_WORDS, FOLLOW_STEP, isWordsChoice, siteWords, wordsChoice,
  wordSpans, countWords, sentenceEnd, planCut, excerptText, lazyImages,
  cardProgress, cardScrollFor, followingCards,
} = require('../src/lib/readerWords');
const { createViewState, memoryBackend } = require('../src/lib/viewState');

// A text of `n` numbered words, each sentence `per` words long.
function sentences(n, per = 5) {
  const out = [];
  for (let i = 1; i <= n; i++) out.push(`w${i}${i % per === 0 ? '.' : ''}`);
  return out.join(' ');
}

// ── The choice ──────────────────────────────────────────────────────────────

test('the choices, in order, and the engine default of 100', () => {
  assert.deepStrictEqual(WORDS_CHOICES, [50, 100, 250, 500, 'whole', 'one']);
  assert.strictEqual(DEFAULT_WORDS, 100);
  assert.strictEqual(FOLLOW_STEP, 5);
  for (const v of WORDS_CHOICES) assert.ok(isWordsChoice(v));
  for (const v of [0, 99, '100', 'all', null, undefined, true]) assert.ok(!isWordsChoice(v));
});

test("the reader's choice wins, then the site's, then 100", () => {
  const site = { reader: { words: 250 } };
  assert.strictEqual(wordsChoice(site, 50), 50);
  assert.strictEqual(wordsChoice(site, 'one'), 'one');
  assert.strictEqual(wordsChoice(site, null), 250);
  assert.strictEqual(wordsChoice({ reader: { words: 'whole' } }, undefined), 'whole');
  assert.strictEqual(wordsChoice({}, null), 100);
  assert.strictEqual(wordsChoice(null, null), 100);
  assert.strictEqual(siteWords(site), 250);
  assert.strictEqual(siteWords({ reader: {} }), null);
});

test('a value that is not a choice falls through, the aid to the site, the site to 100', () => {
  assert.strictEqual(wordsChoice({ reader: { words: 500 } }, 75), 500);
  assert.strictEqual(wordsChoice({ reader: { words: 500 } }, 'all'), 500);
  assert.strictEqual(wordsChoice({ reader: { words: 'some' } }, 'all'), 100);
  assert.strictEqual(wordsChoice({ reader: { words: '100' } }, null), 100);
  assert.strictEqual(siteWords({ reader: { words: 120 } }), null);
});

// ── Counting ────────────────────────────────────────────────────────────────

test('a word is a run of non-space characters holding a letter or a digit', () => {
  assert.strictEqual(countWords('The cat — sat, on 2 mats.'), 6);
  assert.strictEqual(countWords('  ... -- !! '), 0);
  assert.strictEqual(countWords(''), 0);
  assert.deepStrictEqual(wordSpans('ab  cd'), [[0, 2], [4, 6]]);
});

// ── Sentence ends ───────────────────────────────────────────────────────────

test('a sentence ends at . ! ? or …, before a space or the end', () => {
  const t = 'One two three. Four five! Six?';
  assert.strictEqual(sentenceEnd(t, 0), 14);
  assert.strictEqual(sentenceEnd(t, 15), 25);
  assert.strictEqual(sentenceEnd(t, 26), t.length);
  assert.strictEqual(sentenceEnd('It trailed off… then went on.', 0), 15);
  assert.strictEqual(sentenceEnd('No end here', 0), 11);
  // A period inside a word ends nothing.
  assert.strictEqual(sentenceEnd('see v1.2 here. And more', 0), 14);
});

test('a closing quote or bracket after the mark belongs to the sentence', () => {
  assert.strictEqual(sentenceEnd('She said "go now." Then left.', 0), 18);
  assert.strictEqual(sentenceEnd('She said “go now.” Then left.', 0), 18);
  assert.strictEqual(sentenceEnd('(It was late.) Then dark.', 0), 14);
});

test('abbreviations and initials end no sentence', () => {
  const t = 'Mr. Gray met Dr. Lune at St. Ives. They talked.';
  assert.strictEqual(sentenceEnd(t, 0), t.indexOf('Ives.') + 5);
  const u = 'Apples, pears, etc. are fruit, e.g. these, i.e. those, vs. stones. Done.';
  assert.strictEqual(sentenceEnd(u, 0), u.indexOf('stones.') + 7);
  const v = 'A note by J. R. Moss on the hill. Next.';
  assert.strictEqual(sentenceEnd(v, 0), v.indexOf('hill.') + 5);
  assert.strictEqual(sentenceEnd('Ms. Ash and Mrs. Oak, Jr. and Sr. too. End.', 0), 38);
});

// ── The cut on strings ──────────────────────────────────────────────────────

test('the cut ends at the end of the sentence that holds the Nth word', () => {
  const text = sentences(60);
  const kept = excerptText(text, 12);
  // The 12th word is in the sentence of words 11 to 15.
  assert.strictEqual(kept, sentences(15));
  assert.strictEqual(countWords(kept), 15);
  // On a sentence's last word, the cut is right after it.
  assert.strictEqual(excerptText(text, 10), sentences(10));
});

test('the cut keeps an abbreviation and a closing quote inside the sentence', () => {
  const tail = ' ' + sentences(40);
  const text = 'One two Mr. Gray said "stop here." After that it went on.' + tail;
  assert.strictEqual(excerptText(text, 4), 'One two Mr. Gray said "stop here."');
});

test('the cut never runs past the end of the block that holds the Nth word', () => {
  const blocks = ['one two three four five six seven', sentences(40)];
  // The 3rd word's block ends before any sentence does.
  assert.strictEqual(excerptText(blocks, 3), 'one two three four five six seven');
  const plan = planCut(blocks.map((t, i) => ({ text: t, block: i })), 3);
  assert.deepStrictEqual({ seg: plan.seg, offset: plan.offset, runEnd: plan.runEnd }, { seg: 0, offset: blocks[0].length, runEnd: true });
  assert.strictEqual(plan.kept, 7);
  assert.strictEqual(plan.left, 40);
});

test('a word drawn in two text nodes of one block counts once', () => {
  // As in <p>un<em>usual</em> words ...</p>: three nodes, one block.
  const segs = [{ text: 'un', block: 'p' }, { text: 'usual', block: 'p' }, { text: ' words here. ' + sentences(40), block: 'p' }];
  const plan = planCut(segs, 2);
  assert.strictEqual(plan.seg, 2);
  assert.strictEqual(plan.offset, ' words here.'.length);
  assert.strictEqual(plan.kept, 3);
});

test('two blocks part two words even with no space between them', () => {
  const segs = [{ text: 'alpha', block: 1 }, { text: 'beta. ' + sentences(40), block: 2 }];
  assert.strictEqual(planCut(segs, 2).kept, 2);
});

test('a short remainder is not cut: the card shows whole', () => {
  // 14 words would be left: under 15.
  assert.strictEqual(excerptText(sentences(114), 100), null);
  // 15 left: cut.
  assert.strictEqual(countWords(excerptText(sentences(115), 100)), 100);
  // At 500, under 15% of N (75 words) is short too.
  assert.strictEqual(excerptText(sentences(570), 500), null);
  assert.strictEqual(countWords(excerptText(sentences(575), 500)), 500);
});

test('a text with no more than N words is shown whole', () => {
  assert.strictEqual(excerptText(sentences(40), 50), null);
  assert.strictEqual(excerptText(sentences(50), 50), null);
  assert.strictEqual(excerptText('', 50), null);
  assert.strictEqual(planCut([], 50), null);
  assert.strictEqual(planCut([{ text: sentences(200), block: 0 }], 'whole'), null);
});

test('a block with no sentence end is kept whole up to its end', () => {
  const blocks = [sentences(8, 100), sentences(60)];
  assert.strictEqual(excerptText(blocks, 5), sentences(8, 100));
});

test('images in a following card load lazily, an own loading attribute kept', () => {
  assert.strictEqual(lazyImages('<p>a</p><img src="x.png">'), '<p>a</p><img loading="lazy" src="x.png">');
  assert.strictEqual(lazyImages('<IMG src="y.png">'), '<img loading="lazy" src="y.png">');
  assert.strictEqual(lazyImages('<img loading="eager" src="z.png">'), '<img loading="eager" src="z.png">');
  assert.strictEqual(lazyImages(''), '');
});

// ── The open card's progress ────────────────────────────────────────────────

test("the open card's progress runs from its header's top to its text's end", () => {
  const span = { start: 40, end: 2040, clientHeight: 500 };
  assert.strictEqual(cardProgress({ ...span, scrollTop: 0 }), 0);
  assert.strictEqual(cardProgress({ ...span, scrollTop: 40 }), 0);
  assert.strictEqual(cardProgress({ ...span, scrollTop: 790 }), 0.5);
  assert.strictEqual(cardProgress({ ...span, scrollTop: 1540 }), 1);
  // Scrolled on into the cards beneath: still 1.
  assert.strictEqual(cardProgress({ ...span, scrollTop: 5000 }), 1);
  // A card no taller than the view is read once shown.
  assert.strictEqual(cardProgress({ start: 40, end: 400, clientHeight: 500, scrollTop: 0 }), 1);
  assert.strictEqual(cardScrollFor(0.5, span), 790);
  assert.strictEqual(cardScrollFor(0.5, { start: 40, end: 400, clientHeight: 500 }), null);
});

// ── The cards beneath ───────────────────────────────────────────────────────

const seqFeed = {
  items: [
    { id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }, { id: 'f' }, { id: 'g' },
    { id: 'h', _posted: 'title' }, { id: 'i' },
  ],
  edges: [
    { source: 'a', target: 'b', layer: 'sequence' },
    { source: 'b', target: 'c', layer: 'sequence' },
    { source: 'c', target: 'd', layer: 'sequence' },
    { source: 'd', target: 'e', layer: 'sequence' },
    { source: 'e', target: 'f', layer: 'sequence' },
    { source: 'f', target: 'g', layer: 'sequence' },
    { source: 'g', target: 'h', layer: 'sequence' },
    { source: 'h', target: 'i', layer: 'sequence' },
    { source: 'a', target: 'x', layer: 'tag' },
  ],
};

test('the cards beneath are those Next visits in turn, five at a time', () => {
  assert.deepStrictEqual(followingCards(seqFeed, 'a').map((i) => i.id), ['b', 'c', 'd', 'e', 'f']);
  assert.deepStrictEqual(followingCards(seqFeed, 'a', undefined, 2).map((i) => i.id), ['b', 'c']);
});

test('at the end of what can be read, a card not yet readable ends the list', () => {
  // Next from g has nowhere to go; the nav row shows h, title only.
  assert.deepStrictEqual(followingCards(seqFeed, 'a', undefined, 10).map((i) => i.id), ['b', 'c', 'd', 'e', 'f', 'g', 'h']);
  assert.deepStrictEqual(followingCards(seqFeed, 'g', undefined, 10).map((i) => i.id), ['h']);
  // The last card has none.
  assert.deepStrictEqual(followingCards(seqFeed, 'i', undefined, 10), []);
});

test('a repeat stops the list', () => {
  const loop = {
    items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    edges: [
      { source: 'a', target: 'b', layer: 'sequence' },
      { source: 'b', target: 'c', layer: 'sequence' },
      { source: 'c', target: 'a', layer: 'sequence' },
    ],
  };
  assert.deepStrictEqual(followingCards(loop, 'a', undefined, 10).map((i) => i.id), ['b', 'c']);
  const self = { items: [{ id: 'a' }], edges: [{ source: 'a', target: 'a', layer: 'sequence' }] };
  assert.deepStrictEqual(followingCards(self, 'a', undefined, 10), []);
});

test("in a flow, the cards beneath follow the order in force, passing what Next passes", () => {
  const feed = {
    items: [
      { id: 'p1' }, { id: 'p2', _posted: 'title' }, { id: 'p3' }, { id: 'about' }, { id: 'p4' },
      { id: 'link', kind: 'link', link: 'https://example.org/' }, { id: 'p5' },
    ],
    edges: [],
  };
  const opts = { order: ['p1', 'p2', 'p3', 'about', 'p4', 'link', 'p5'], skip: new Set(['about']) };
  assert.deepStrictEqual(followingCards(feed, 'p1', opts, 10).map((i) => i.id), ['p3', 'p4', 'p5']);
  assert.deepStrictEqual(followingCards(feed, 'p4', opts, 10).map((i) => i.id), ['p5']);
  assert.deepStrictEqual(followingCards(feed, 'p5', opts, 10), []);
  // A card the order does not hold has none.
  assert.deepStrictEqual(followingCards(feed, 'nowhere', opts, 10), []);
});

// ── The reader's own choice, kept ───────────────────────────────────────────
// (its round trip through the store is in viewState.test.js)

test("the reading aid 'words' chosen in the panel wins over the site's", async () => {
  const vs = createViewState({ backend: memoryBackend(), corpusId: 'c', debounceMs: 0 });
  await vs.ready();
  const site = { reader: { words: 50 } };
  assert.strictEqual(wordsChoice(site, vs.readerAid('words')), 50);
  vs.setReaderAid('words', 'one');
  assert.strictEqual(wordsChoice(site, vs.readerAid('words')), 'one');
  vs.setReaderAid('words', null);
  assert.strictEqual(wordsChoice(site, vs.readerAid('words')), 50);
  assert.strictEqual(wordsChoice({}, vs.readerAid('words')), 100);
});

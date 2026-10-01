const test = require('node:test');
const assert = require('node:assert');
const C = require('../src/lib/contributions');
const { layerLabels } = require('../src/lib/dimensionLabels');

const items = [
  { id: 'https://x.test/a1-one.html', url: 'https://x.test/a1-one.html' },
  { id: 'https://x.test/a1-two.html', url: 'https://x.test/a1-two.html' },
];
const base = { status: 'approved', author: 'Ana', created: '2026-09-30' };

test('no contributions setting, no contributions asked for', () => {
  assert.strictEqual(C.contributionsConfig({}), null);
  assert.strictEqual(C.contributionsConfig({ contributions: { enabled: false } }), null);
  const c = C.contributionsConfig({ contributions: {} });
  assert.strictEqual(c.submit, false);
  assert.strictEqual(c.showTest, false);
  assert.strictEqual(c.src, './contributions.json');
});

test('only approved, well formed, known chapters; test items only when asked', () => {
  const data = { contributions: [
    { ...base, id: '1', type: 'comment', anchor: { chapter: 'a1-one' }, body: 'yes' },
    { ...base, id: '2', type: 'comment', status: 'pending', anchor: { chapter: 'a1-one' }, body: 'no' },
    { ...base, id: '3', type: 'comment', anchor: { chapter: 'nowhere' }, body: 'no' },
    { ...base, id: '4', type: 'poem', anchor: { chapter: 'a1-one' }, body: 'no' },
    { ...base, id: '5', type: 'essay', test: true, anchor: { chapter: 'a1-two' }, body: 'test' },
    { ...base, id: '1', type: 'comment', anchor: { chapter: 'a1-one' }, body: 'duplicate id' },
    { ...base, id: '6', type: 'comment', anchor: { chapter: 'a1-one' }, body: '   ' },
    { ...base, id: '7', type: 'connection', anchor: { chapter: 'a1-one' }, to: 'a1-one', body: 'self' },
    { ...base, id: '8', type: 'comment', anchor: { chapter: 'https://x.test/a1-two.html' }, body: 'by item id' },
  ] };
  const shown = C.visibleContributions(data, { items });
  assert.deepStrictEqual(shown.map((c) => c.id), ['1', '8']);
  assert.strictEqual(shown[1].chapter, 'a1-two');
  const withTest = C.visibleContributions(data, { items, showTest: true });
  assert.deepStrictEqual(withTest.map((c) => c.id), ['1', '5', '8']);
  assert.strictEqual(withTest[1].test, true);
});

test('art only from the site\'s own asset store, never svg or another host', () => {
  assert.ok(C.isOwnAsset('reader-art/fox.png'));
  assert.ok(C.isOwnAsset('a.webp'));
  for (const bad of ['https://evil.test/a.png', '//evil.test/a.png', '/etc/a.png', '../a.png', 'x/../a.png', 'a.svg', 'javascript:alert(1)', 'data:image/png;base64,xx', 'a.png?x=1', '']) {
    assert.strictEqual(C.isOwnAsset(bad), false, bad);
  }
  const art = (asset) => ({ ...base, id: asset, type: 'art', anchor: { chapter: 'a1-one' }, asset });
  const shown = C.visibleContributions([art('ok.png'), art('https://evil.test/x.png'), art('x.svg')], { items });
  assert.deepStrictEqual(shown.map((c) => c.asset), ['ok.png']);
  assert.strictEqual(C.assetUrl('ok.png', { assetBase: './contributions/assets' }), './contributions/assets/ok.png');
});

test('connections count at both ends and make a layer of their own', () => {
  const list = C.visibleContributions([
    { ...base, id: 'c', type: 'connection', anchor: { chapter: 'a1-one' }, to: 'a1-two', body: 'mirror' },
    { ...base, id: 'k', type: 'comment', anchor: { chapter: 'a1-one' }, body: 'hi' },
  ], { items });
  const counts = C.countsByChapter(list);
  assert.strictEqual(counts.get('a1-one'), 2);
  assert.strictEqual(counts.get('a1-two'), 1);
  assert.deepStrictEqual(C.forChapter(list, 'a1-two').map((c) => c.id), ['c']);
  const edges = C.connectionEdges(list);
  assert.deepStrictEqual(edges, [{ id: 'c', source: 'a1-one', target: 'a1-two', layer: 'contribution', label: 'mirror', author: 'Ana' }]);
});

test('a quote is found by its words, with loose whitespace', () => {
  const ps = ['First line here.', 'She  knelt\nin front of the plant. Then she stood.', 'End.'];
  const r = C.resolveQuote(ps, { exact: 'knelt in front of the plant.' });
  assert.deepStrictEqual(r, { para: 1, offset: 4, length: 28 });
});

test('a repeated passage is told apart by its context, or not at all', () => {
  const ps = ['He said yes. Then rain.', 'She said yes. Then sun.'];
  assert.strictEqual(C.resolveQuote(ps, { exact: 'said yes.', prefix: 'She', suffix: 'Then sun.' }).para, 1);
  assert.strictEqual(C.resolveQuote(ps, { exact: 'said yes.', prefix: 'He' }).para, 0);
  // Context that fits neither, or both equally: no answer, not a guess.
  assert.strictEqual(C.resolveQuote(ps, { exact: 'said yes.' }), null);
  assert.strictEqual(C.resolveQuote(ps, { exact: 'said yes.', suffix: 'Then' }), null);
});

test('a passage no longer in the text resolves to nothing', () => {
  assert.strictEqual(C.resolveQuote(['A changed text.'], { exact: 'the old words' }), null);
  assert.strictEqual(C.resolveQuote(['A b.', 'c d.'], { exact: 'b. c' }), null, 'never across paragraphs');
  assert.strictEqual(C.resolveQuote(['x'], null), null);
});

test('an essay is split into text paragraphs, markup kept as text', () => {
  const ps = C.paragraphsOf('One <b>two</b>\n\n<img src=x onerror=alert(1)>\r\n\r\nthree');
  assert.deepStrictEqual(ps, ['One <b>two</b>', '<img src=x onerror=alert(1)>', 'three']);
});

test('a selection becomes a quote with a few words either side', () => {
  const t = 'one two three four five six seven eight nine ten';
  const q = C.quoteFromSelection(t, t.indexOf('five'), t.indexOf('five') + 'five six'.length, 2);
  assert.deepStrictEqual(q, { exact: 'five six', prefix: 'three four', suffix: 'seven eight' });
  assert.strictEqual(C.quoteFromSelection(t, 3, 3), null);
});

test('the form checks a submission before sending', () => {
  const ok = { author: 'Ana', type: 'comment', body: 'hi', anchor: { chapter: 'a1-one' } };
  assert.deepStrictEqual(C.checkSubmission(ok), []);
  assert.ok(C.checkSubmission({ ...ok, author: '' }).length);
  assert.ok(C.checkSubmission({ ...ok, author: 'x'.repeat(61) }).length);
  assert.ok(C.checkSubmission({ ...ok, type: 'art' }).length);
  assert.ok(C.checkSubmission({ ...ok, body: 'x'.repeat(8001) }).length);
  assert.ok(C.checkSubmission({ ...ok, type: 'connection' }).length);
  assert.deepStrictEqual(C.checkSubmission({ ...ok, type: 'connection', to: 'a1-two' }), []);
});

test('the readers dimension is named like the others', () => {
  assert.strictEqual(layerLabels({})[0].label, 'readers');
  assert.strictEqual(layerLabels({ dimensions: { labels: { readers: 'other readers' } } })[0].label, 'other readers');
});

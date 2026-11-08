'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { topBarConfig, topBarOrder, resumeTarget } = require('../src/lib/topBar');

const items = [
  { id: 'jacket', url: '/eoej-about.html', title: 'About' },
  { id: 'c1', url: '/c1.html', title: 'One' },
  { id: 'c2', url: '/c2.html', title: 'Two' },
  { id: 'c3', url: '/c3.html', title: 'Three' },
  { id: 'l1', kind: 'link', link: 'https://example.org', title: 'A link' },
];
const cfg = topBarConfig({ topBar: {
  resume: { label: 'read', icon: '<path d="M1 1"/>', start: 'c1' },
  pages: [{ id: 'eoej-about', label: 'about', hideFromGraph: true }],
  links: [{ id: 'coffee', label: 'coffee', href: 'https://example.org/coffee' }, { id: 'hy', label: 'author', href: 'author/' }],
  subscribe: { action: '/api/subscribe' },
  order: ['resume', 'coffee', 'eoej-about', 'hy', 'subscribe'],
} });

test('resume config: label, icon only, start', () => {
  assert.deepStrictEqual(cfg.resume, { id: 'resume', label: 'read', icon: '<path d="M1 1"/>', showLabel: false, start: 'c1' });
  assert.strictEqual(topBarConfig({ topBar: {} }).resume, null);
});

test('order: named first, the rest after in the default order', () => {
  assert.deepStrictEqual(topBarOrder(cfg), ['resume', 'link:coffee', 'page:eoej-about', 'link:hy', 'subscribe']);
  const partial = topBarConfig({ topBar: { ...{ pages: [{ id: 'p' }], links: [{ id: 'a', label: 'a', href: '/a' }] }, order: ['a', 'nope'] } });
  assert.deepStrictEqual(topBarOrder(partial), ['link:a', 'page:p']);
  assert.deepStrictEqual(topBarOrder(topBarConfig({ topBar: { pages: [{ id: 'p' }] } })), ['page:p']);
});

test('resume: the most recently read item, not a page, not one only seen', () => {
  const reading = {
    c1: { at: 0.5, max: 0.6, t: 100 },
    c2: { at: 0.2, max: 0.2, t: 300 },
    c3: { seenAt: 400, t: 400 },          // seen, never read
    jacket: { at: 0.9, max: 0.9, t: 500 }, // the about page does not count
  };
  assert.strictEqual(resumeTarget(items, reading, cfg).id, 'c2');
});

test('resume: no reading yet goes to the start, else the first item', () => {
  assert.strictEqual(resumeTarget(items, {}, cfg).id, 'c1');
  const noStart = topBarConfig({ topBar: { resume: {}, pages: [{ id: 'eoej-about' }] } });
  assert.strictEqual(resumeTarget(items, null, noStart).id, 'c1');
  assert.strictEqual(resumeTarget([], {}, cfg), null);
});

test('resume: a link item never counts', () => {
  const linkItems = [{ id: 'l1', kind: 'link', external_url: 'https://example.org' }, { id: 'c9', url: '/c9.html' }];
  assert.strictEqual(resumeTarget(linkItems, { l1: { at: 1, t: 9 } }, topBarConfig({ topBar: { resume: {} } })).id, 'c9');
});

// With Flow presets: the order in force (readingOrder.js chosenOrder) is
// where a reader with no place yet starts, when the site names no start.
test('resume with a reading order: no place yet and no start opens its first card that can be read', () => {
  const flowItems = [...items, { id: 'c4', url: '/c4.html', title: 'Four', _posted: 'title' }];
  const noStart = topBarConfig({ topBar: { resume: {}, pages: [{ id: 'eoej-about' }] } });
  // The about page (a top bar page), a link and a title-only card are passed over.
  const order = ['jacket', 'l1', 'c4', 'c3', 'c1', 'c2'];
  assert.strictEqual(resumeTarget(flowItems, {}, noStart, order).id, 'c3');
  assert.strictEqual(resumeTarget(flowItems, null, noStart, ['c2', 'c1']).id, 'c2');
  // Another order, another start.
  assert.strictEqual(resumeTarget(flowItems, {}, noStart, ['c1', 'c3']).id, 'c1');
});

test('resume with a reading order: a place, or a named start, wins as before; no order is as before', () => {
  const noStart = topBarConfig({ topBar: { resume: {} } });
  const order = ['c3', 'c1', 'c2'];
  assert.strictEqual(resumeTarget(items, { c2: { at: 0.4, max: 0.4, t: 5 } }, noStart, order).id, 'c2', 'where the reader was');
  assert.strictEqual(resumeTarget(items, {}, cfg, order).id, 'c1', 'the site\'s start');
  assert.strictEqual(resumeTarget(items, {}, noStart, null).id, 'jacket', 'no order: the first item, as before');
  assert.strictEqual(resumeTarget(items, {}, noStart, []).id, 'jacket');
  assert.strictEqual(resumeTarget(items, {}, noStart, ['gone']).id, 'jacket', 'an order naming nothing in the feed');
});

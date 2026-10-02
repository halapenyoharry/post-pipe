'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { shareMeta, iconLinks } = require('../src/lib/shareMeta');

test('without a share image the head keeps its five tags', () => {
  const out = shareMeta({ title: 'A', description: 'B' }, 'https://x.org');
  assert.strictEqual(out.split('\n').length, 5);
  assert.ok(!out.includes('og:image'));
});

test('a description with quotes and apostrophes is escaped', () => {
  const out = shareMeta({ title: 'T', description: `the world's great "race"` }, 'https://x.org');
  assert.ok(out.includes('content="the world&#39;s great &quot;race&quot;"'));
});

test('a share image is made absolute and carries the twitter card', () => {
  const out = shareMeta({ title: 'T', description: 'D', share_image: { src: 'og.png', width: 1200, height: 630, alt: 'a' } }, 'https://x.org/');
  assert.ok(out.includes('<meta property="og:image" content="https://x.org/og.png">'));
  assert.ok(out.includes('<meta property="og:image:width" content="1200">'));
  assert.ok(out.includes('<meta name="twitter:card" content="summary_large_image">'));
  assert.ok(out.includes('<meta name="twitter:image" content="https://x.org/og.png">'));
});

test('an absolute share image stays as it is', () => {
  const out = shareMeta({ share_image: { src: 'https://cdn.example/og.png' } }, 'https://x.org');
  assert.ok(out.includes('content="https://cdn.example/og.png"'));
});

test('icons: the old single svg link by default, the set when given', () => {
  assert.strictEqual(iconLinks({}), '<link rel="icon" type="image/svg+xml" href="./favicon.svg">');
  const out = iconLinks({ icons: { ico: 'favicon.ico', svg: 'favicon.svg?v=2', png: 'icon-192.png', apple_touch: 'apple-touch-icon.png' } });
  assert.deepStrictEqual(out.split('\n'), [
    '<link rel="icon" href="./favicon.ico" sizes="48x48">',
    '<link rel="icon" type="image/svg+xml" href="./favicon.svg?v=2">',
    '<link rel="icon" type="image/png" sizes="192x192" href="./icon-192.png">',
    '<link rel="apple-touch-icon" href="./apple-touch-icon.png">',
  ]);
});

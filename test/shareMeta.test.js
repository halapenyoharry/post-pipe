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

test('og:url ends with one slash', () => {
  assert.ok(shareMeta({}, 'https://x.org').includes('<meta property="og:url" content="https://x.org/">'));
  assert.ok(shareMeta({}, 'https://x.org//').includes('<meta property="og:url" content="https://x.org/">'));
});

// Every site gets a tab icon (faviconPlan, used by generate-index.js): its
// own icons untouched when it sets site.icons, else its favicon.svg copied,
// else a placeholder circle in its accent.
const { faviconPlan, faviconColor, placeholderFavicon, NEUTRAL_GREY } = require('../src/lib/shareMeta');

test('favicon: a site that sets site.icons keeps its own icons untouched', () => {
  assert.deepStrictEqual(faviconPlan({ site: { icons: { svg: 'favicon.svg?v=2' } } }, { hasSiteFavicon: true }), { action: 'keep' });
  assert.deepStrictEqual(faviconPlan({ site: { icons: { ico: 'favicon.ico' } } }, { hasSiteFavicon: false }), { action: 'keep' });
});

test('favicon: the site folder\'s own favicon.svg is copied', () => {
  assert.deepStrictEqual(faviconPlan({ site: {}, theme: { accent: '#64ffda' } }, { hasSiteFavicon: true }), { action: 'copy' });
});

test('favicon: with neither, a placeholder circle in the site\'s accent, else the theme\'s, else grey', () => {
  const p = faviconPlan({ site: {}, accent: '#c0392b', theme: { accent: '#64ffda' } });
  assert.strictEqual(p.action, 'placeholder');
  assert.strictEqual(p.color, '#c0392b', 'the site\'s accent first');
  assert.strictEqual(p.svg, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="#c0392b"/></svg>\n');
  assert.strictEqual(faviconPlan({ site: {}, accent: '', theme: { accent: '#64ffda' } }).color, '#64ffda', 'an empty accent leaves the theme\'s');
  assert.strictEqual(faviconPlan({ theme: {} }).color, NEUTRAL_GREY);
  assert.strictEqual(faviconPlan(null).color, NEUTRAL_GREY);
  assert.strictEqual(NEUTRAL_GREY, '#888888');
});

test('favicon: only a colour an SVG fill can take is used; nothing can break out of the attribute', () => {
  assert.strictEqual(faviconColor({ accent: 'rgb(10, 20, 30)' }), 'rgb(10, 20, 30)');
  assert.strictEqual(faviconColor({ accent: 'teal' }), 'teal');
  assert.strictEqual(faviconColor({ accent: '#abcd' }), '#abcd');
  assert.strictEqual(faviconColor({ accent: '"/><script>', theme: { accent: 'url(#x)' } }), NEUTRAL_GREY);
  assert.ok(!placeholderFavicon('"/><script>').includes('<script>'));
});

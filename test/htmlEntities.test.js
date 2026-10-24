// Feed text fields arrive with HTML character references still in them; the
// adapters decode them once, at ingest, with this.

const { test } = require('node:test');
const assert = require('node:assert');
const { decodeHtmlEntities } = require('../src/lib/htmlEntities');

test('numeric references, decimal and hex', () => {
  assert.strictEqual(decodeHtmlEntities('Sugar isn&#039;t the biggest culprit'), "Sugar isn't the biggest culprit");
  assert.strictEqual(decodeHtmlEntities('isn&#x27;t &#x2014; or &#8212;'), "isn't — or —");
});

test('the common named references', () => {
  assert.strictEqual(decodeHtmlEntities('Tom &amp; Jerry &lt;3 &quot;cats&quot; &apos;dogs&apos;'), 'Tom & Jerry <3 "cats" \'dogs\'');
  assert.strictEqual(decodeHtmlEntities('one&nbsp;two &ndash; three &mdash; four&hellip;'), 'one two – three — four…');
  assert.strictEqual(decodeHtmlEntities('&ldquo;caf&eacute;&rdquo; &copy; 2026'), '“café” © 2026');
});

test('one pass: an escaped entity becomes the entity text, not its character', () => {
  assert.strictEqual(decodeHtmlEntities('&amp;lt;p&amp;gt;'), '&lt;p&gt;');
  assert.strictEqual(decodeHtmlEntities('&amp;#039;'), '&#039;');
});

test('what is not a reference is left alone', () => {
  assert.strictEqual(decodeHtmlEntities('AT&T and R&D; &unknownthing; & more'), 'AT&T and R&D; &unknownthing; & more');
  assert.strictEqual(decodeHtmlEntities('&#0; &#xD800; &#1114112;'), '&#0; &#xD800; &#1114112;');
  assert.strictEqual(decodeHtmlEntities('plain'), 'plain');
  assert.strictEqual(decodeHtmlEntities(''), '');
});

test('a non-string comes back as it was', () => {
  assert.strictEqual(decodeHtmlEntities(undefined), undefined);
  assert.strictEqual(decodeHtmlEntities(null), null);
  assert.strictEqual(decodeHtmlEntities(42), 42);
});

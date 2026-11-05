// The lines the + pill shows for a pasted address: the feed route as it has
// always been, and the page route for an address that answered with a page
// naming no feed.

const { test } = require('node:test');
const assert = require('node:assert');
const { buildOutline, buildPageOutline, buildCommand, urlToLabel, shell } = require('../src/lib/addFeedLine');

test('the feed line is unchanged: no type attribute, the host as its name', () => {
  assert.strictEqual(
    buildOutline('https://www.example.org/feed.xml'),
    '<outline text="example.org" title="example.org" xmlUrl="https://www.example.org/feed.xml"/>',
  );
  assert.strictEqual(buildCommand('https://example.org/feed.xml'), "node add-feed.js 'https://example.org/feed.xml'");
  assert.strictEqual(buildCommand('https://example.org/feed.xml', 'feed', 'ignored for a feed'), "node add-feed.js 'https://example.org/feed.xml'");
});

test('the page line names type="page" and takes the page\'s own title when it has one', () => {
  assert.strictEqual(
    buildPageOutline('https://example.org/essays/kettle/', 'How a kettle knows it is done'),
    '<outline text="How a kettle knows it is done" title="How a kettle knows it is done" type="page" xmlUrl="https://example.org/essays/kettle/"/>',
  );
  assert.strictEqual(
    buildPageOutline('https://example.org/essays/kettle/'),
    '<outline text="example.org" title="example.org" type="page" xmlUrl="https://example.org/essays/kettle/"/>',
    'without a title, the host',
  );
  assert.strictEqual(
    buildPageOutline('https://example.org/a?b=1&c="2"', 'Q & "A" <here>'),
    '<outline text="Q &amp; &quot;A&quot; &lt;here>" title="Q &amp; &quot;A&quot; &lt;here>" type="page" xmlUrl="https://example.org/a?b=1&amp;c=&quot;2&quot;"/>',
    'attributes are escaped',
  );
});

test('the page command adds --type=page and the title, shell-quoted', () => {
  assert.strictEqual(
    buildCommand('https://example.org/essays/kettle/', 'page', "A kettle's click"),
    "node add-feed.js 'https://example.org/essays/kettle/' --type=page --title='A kettle'\\''s click'",
  );
  assert.strictEqual(buildCommand('https://example.org/p', 'page'), "node add-feed.js 'https://example.org/p' --type=page");
});

test('the helpers behind both lines', () => {
  assert.strictEqual(urlToLabel('https://www.example.org/x'), 'example.org');
  assert.strictEqual(urlToLabel('not a url'), 'not a url');
  assert.strictEqual(shell("it's"), "'it'\\''s'");
});

// The subscription seam. OPML is the format every feed reader exports, so this
// parser is how somebody else's reading list becomes a corpus here. Being
// forgiving about what arrives is the requirement.

const { test } = require('node:test');
const assert = require('node:assert');
const { parseOpml } = require('../src/lib/opml');

const wrap = (body) =>
  `<?xml version="1.0" encoding="UTF-8"?><opml version="2.0"><head><title>t</title></head><body>${body}</body></opml>`;

test('reads a NetNewsWire export unchanged', () => {
  // Verbatim shape of inbox/Subscriptions-OnMyMac.opml.
  const feeds = parseOpml(wrap(
    `<outline text="ProPublica" title="ProPublica" description="" type="rss" version="RSS"
              htmlUrl="https://www.propublica.org/" xmlUrl="https://www.propublica.org/feeds/propublica/main"/>`,
  ));
  assert.strictEqual(feeds.length, 1);
  assert.strictEqual(feeds[0].type, 'rss');
  assert.strictEqual(feeds[0].xmlUrl, 'https://www.propublica.org/feeds/propublica/main');
  assert.strictEqual(feeds[0].title, 'ProPublica');
});

test('the local:// scheme marks a folder rather than a network feed', () => {
  const [feed] = parseOpml(wrap(
    `<outline type="local" text="My Writing" xmlUrl="local://~/Posts" customColor="#2ecc71"/>`,
  ));
  assert.strictEqual(feed.type, 'local');
  assert.strictEqual(feed.customColor, '#2ecc71');
});

test('folders are preserved, not flattened away', () => {
  // Readers organize subscriptions into hierarchies. That structure is the
  // user's own topology and is worth keeping.
  const feeds = parseOpml(wrap(
    `<outline text="News"><outline text="Politics">
       <outline type="rss" text="A" xmlUrl="https://a.test/rss"/>
     </outline></outline>`,
  ));
  assert.strictEqual(feeds.length, 1);
  assert.strictEqual(feeds[0].folder, 'News/Politics');
});

test('a container without an xmlUrl is not mistaken for a feed', () => {
  const feeds = parseOpml(wrap(`<outline text="Empty Folder"></outline>`));
  assert.deepStrictEqual(feeds, []);
});

test('type is inferred when the export omits it', () => {
  const feeds = parseOpml(wrap(
    `<outline text="J" xmlUrl="https://x.test/feed.json"/>` +
    `<outline text="A" xmlUrl="https://x.test/atom.xml"/>`,
  ));
  assert.strictEqual(feeds[0].type, 'json', 'a .json feed is JSON Feed, not RSS');
  assert.ok(feeds[1].type, 'something is always inferred rather than left undefined');
});

test('an empty subscription list is not an error', () => {
  assert.deepStrictEqual(parseOpml(wrap('')), []);
});

test('a local folder is primary and a subscribed feed is secondary by default', () => {
  // Your own corpus and a subscribed firehose are not peers. This used to fall
  // out of the status field by accident, which meant your own drafts rendered
  // identically to somebody else's news.
  const feeds = parseOpml(wrap(
    `<outline type="local" text="Mine" xmlUrl="local://~/Posts"/>` +
    `<outline type="rss" text="Theirs" xmlUrl="https://x.test/rss"/>`,
  ));
  assert.strictEqual(feeds[0].prominence, 'primary');
  assert.strictEqual(feeds[1].prominence, 'secondary');
});

test('prominence can be set explicitly, including against the default', () => {
  const feeds = parseOpml(wrap(
    `<outline type="rss" text="Close reading" xmlUrl="https://x.test/rss" prominence="primary"/>` +
    `<outline type="local" text="Archive" xmlUrl="local://~/Old" prominence="secondary"/>`,
  ));
  assert.strictEqual(feeds[0].prominence, 'primary');
  assert.strictEqual(feeds[1].prominence, 'secondary');
});

test('an unrecognised prominence falls back to the default rather than through', () => {
  const [feed] = parseOpml(wrap(
    `<outline type="local" text="Mine" xmlUrl="local://~/Posts" prominence="loudest"/>`,
  ));
  assert.strictEqual(feed.prominence, 'primary');
});

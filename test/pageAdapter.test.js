// One article's page as one item (type="page"), and a local list of such
// pages (type="pages"). The page is read from a fixture on disk and the fetch
// is stubbed: nothing here touches the network.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { extractPage } = require('../src/lib/pageExtract');
const PageAdapter = require('../src/adapters/PageAdapter');
const PageListAdapter = require('../src/adapters/PageListAdapter');
const { loadCorpus } = require('../src/aggregator');

const FIXTURE = path.join(__dirname, 'fixtures', 'page', 'article.html');
const HTML = fs.readFileSync(FIXTURE, 'utf8');
const LISTED = 'https://quietkitchen.example/essays/kettle-switch/index.html';
const CANONICAL = 'https://quietkitchen.example/essays/kettle-switch/';

function scratch() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-page-'));
  return {
    root,
    opts: (extra) => ({ lastGoodDir: path.join(root, 'last-good'), colorCachePath: path.join(root, 'colors.json'), ...extra }),
  };
}

test('extractPage reads the title, author, date, canonical link and tags the page marks up', () => {
  const page = extractPage(HTML, LISTED);
  assert.strictEqual(page.title, 'How a kettle knows it is done');
  assert.strictEqual(page.author, 'Mira Okafor');
  assert.strictEqual(page.date_published, '2026-03-14T09:30:00.000Z');
  assert.strictEqual(page.canonical_link, CANONICAL, 'the canonical link as written');
  assert.strictEqual(page.url, CANONICAL);
  assert.deepStrictEqual(page.article_tags, ['kitchens', 'small machines']);
  assert.deepStrictEqual(page.keywords, ['kettles', 'thermostats', 'kitchens', 'steam'], 'meta keywords, then JSON-LD keywords, without repeats');
  assert.strictEqual(page.image, 'https://quietkitchen.example/images/kettle.jpg', 'og:image resolved against the page');
  assert.ok(page.summary.startsWith('A short piece on the click'), 'the description is the summary');
});

test('extractPage keeps the article\'s block and drops the page\'s chrome', () => {
  const page = extractPage(HTML, LISTED);
  const html = page.content_html;
  assert.ok(html.includes('does not measure the water at all'), 'first paragraph');
  assert.ok(html.includes('dry-boil cutout'), 'third paragraph');
  assert.ok(html.includes('<blockquote>'), 'the quote stays as markup');
  assert.ok(!html.includes('More essays'), 'the aside is not the article');
  assert.ok(!html.includes('Privacy'), 'nor the footer');
  assert.ok(!html.includes('dataLayer') && !html.includes('never shown'), 'nor scripts');
  assert.ok(!html.includes('class='), 'class attributes are dropped');
  assert.ok(html.includes('href="https://quietkitchen.example/essays/toaster-timer/"'), 'a relative link resolves against the page');
  assert.ok(html.includes('src="https://quietkitchen.example/images/strip.png"'), 'so does an image');
  assert.ok(page.content_text.includes('snaps across and breaks the circuit'));
  assert.ok(!page.content_text.includes('Published under'));
});

test('a page with no metadata still yields a title and its largest text block', () => {
  const bare = `<html><head><title>Plain page</title></head><body>
    <div id="nav"><a href="/a">one</a> <a href="/b">two</a></div>
    <div id="text"><h1>A plain heading</h1>
      <p>Here is a paragraph long enough to count, with a comma or two, saying something ordinary about an ordinary thing.</p>
      <p>And a second paragraph, so that the block has weight, which is how the block is chosen when nothing is marked up.</p>
    </div>
    <div id="foot"><p>short</p></div>
  </body></html>`;
  const page = extractPage(bare, 'https://plain.example/p');
  assert.strictEqual(page.title, 'A plain heading', 'the h1 in the block before the <title>');
  assert.strictEqual(page.author, '');
  assert.strictEqual(page.date_published, undefined);
  assert.strictEqual(page.canonical_link, null);
  assert.strictEqual(page.url, 'https://plain.example/p', 'the fetched address when there is no canonical');
  assert.ok(page.content_html.includes('second paragraph'));
  assert.ok(!page.content_html.includes('href="https://plain.example/a"'), 'the link row is not the block');
  assert.ok(page.summary.startsWith('A plain heading Here is a paragraph'), 'the text opens the summary when there is no description');
});

test('PageAdapter makes one item whose id is the address as listed and whose url is the canonical', async () => {
  const calls = [];
  const fetchText = async (url) => { calls.push(url); return HTML; };
  const out = await PageAdapter.load({ id: LISTED, title: 'Kettle piece', xmlUrl: LISTED }, { fetchText });
  assert.deepStrictEqual(calls, [LISTED], 'one fetch, of the listed address');
  assert.strictEqual(out.items.length, 1);
  const item = out.items[0];
  assert.strictEqual(item.id, LISTED);
  assert.strictEqual(item.url, CANONICAL);
  assert.strictEqual(item.canonical_url, CANONICAL);
  assert.strictEqual(item.title, 'How a kettle knows it is done');
  assert.deepStrictEqual(item.authors, [{ name: 'Mira Okafor' }]);
  assert.strictEqual(item.date_published, '2026-03-14T09:30:00.000Z');
  assert.deepStrictEqual(item.tags, ['kitchens', 'small machines', 'kettles', 'thermostats', 'steam']);
  assert.deepStrictEqual(item._references, item.tags.map((value) => ({ type: 'tag', value })));
  assert.deepStrictEqual(item._page, {
    listed_url: LISTED,
    canonical_link: CANONICAL,
    article_tags: ['kitchens', 'small machines'],
    keywords: ['kettles', 'thermostats', 'kitchens', 'steam'],
  });
  assert.strictEqual(item.kind, 'text');
  assert.strictEqual(item.attachments[0].url, 'https://quietkitchen.example/images/kettle.jpg');
  assert.strictEqual(out.feedMeta.title, 'Kettle piece', 'the entry\'s title is the source');
  assert.strictEqual(out.feedMeta.home_page_url, 'https://quietkitchen.example');
});

test('through the aggregator the item carries the entry\'s title as its source and the page is kept as a last good copy', async () => {
  const s = scratch();
  const entry = { adapter: PageAdapter, config: { id: LISTED, title: 'Kettle piece', xmlUrl: LISTED, customColor: '#336699' } };
  const first = await loadCorpus([entry], s.opts({ fetchText: async () => HTML, now: () => new Date('2026-11-04T10:00:00Z') }));
  assert.strictEqual(first.items.length, 1);
  assert.strictEqual(first.items[0]._source.title, 'Kettle piece');
  assert.strictEqual(first.items[0]._source.type, 'page');
  assert.strictEqual(first.sources[0].ok, true);
  assert.strictEqual(first.sources[0].stale, undefined);

  const second = await loadCorpus([entry], s.opts({ fetchText: async () => { throw new Error('HTTP 503 Service Unavailable'); } }));
  assert.strictEqual(second.items.length, 1, 'the card comes from the copy');
  assert.strictEqual(second.sources[0].stale, true);
  assert.strictEqual(second.sources[0].copyDate, '2026-11-04T10:00:00.000Z');
});

test('PageListAdapter reads addresses one per line, skips blanks, comments and repeats, and leaves out a page that fails', async () => {
  assert.deepStrictEqual(
    PageListAdapter.readList('# kept pages\nhttps://a.example/one\n\n  https://a.example/two  \nnot a url\nhttps://a.example/one\n'),
    ['https://a.example/one', 'https://a.example/two'],
  );
  const s = scratch();
  const list = path.join(s.root, 'pages.txt');
  fs.writeFileSync(list, `${LISTED}\nhttps://quietkitchen.example/essays/missing/\n`);
  const warnings = [];
  const warn = console.warn;
  console.warn = (m) => warnings.push(String(m));
  let out;
  try {
    out = await PageListAdapter.load({ id: 'pages.txt', title: 'Kept pages', path: list }, {
      fetchText: async (url) => { if (url === LISTED) return HTML; throw new Error('HTTP 404 Not Found'); },
    });
  } finally {
    console.warn = warn;
  }
  assert.strictEqual(out.items.length, 1);
  assert.strictEqual(out.items[0].id, LISTED);
  assert.strictEqual(out.feedMeta.title, 'Kept pages');
  assert.ok(warnings.some((w) => w.includes('missing') && w.includes('404')), 'the failed page is named');

  await assert.rejects(
    () => PageListAdapter.load({ id: 'x', title: 'x', path: path.join(s.root, 'nowhere.txt') }),
    /list file not found/,
  );
});

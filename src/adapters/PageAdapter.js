// PageAdapter — one article's page as one item. A feeds.opml entry
// type="page" names the page's address in xmlUrl; at build the page is
// fetched (it is a listed source, so the rule that nothing fetches beyond
// what feeds.opml names holds), and src/lib/pageExtract.js reads its title,
// author and date where marked up, its canonical link, its tags and its
// main text. The item's source is the entry's title. Emits a JSON Feed 1.1
// item like the feed adapters do.
//
// The item's id is the address as listed, as the other adapters use the
// item's url; its url is the page's canonical link resolved, else the same.
// The canonical link as written and the page's own tags (article:tag, meta
// keywords) are kept on the item (_page) so slug and tag work can read them.

const { fetchText } = require('./fetchText');
const { extractPage } = require('../lib/pageExtract');

const ID = 'page';

// deps.fetchText: how the page's text is fetched (the aggregator passes one
// that remembers the text, or one that hands back the last good copy after
// a failed fetch); the plain one by default.
async function load(config, { fetchText: fetchPage = fetchText } = {}) {
  const { id, title, xmlUrl } = config;
  const html = await fetchPage(xmlUrl);
  const item = pageItem(html, xmlUrl);
  return {
    items: [item],
    feedMeta: {
      id: id || xmlUrl,
      title: title || item.title || xmlUrl,
      home_page_url: homeOf(item.url || xmlUrl),
      favicon: null,
      icon: null,
    },
  };
}

// The item one page makes. listedUrl is the address as listed (the id).
function pageItem(html, listedUrl) {
  const page = extractPage(html, listedUrl);
  const tags = [...page.article_tags, ...page.keywords.filter((k) => !page.article_tags.some((t) => t.toLowerCase() === k.toLowerCase()))];
  const url = page.url || listedUrl;
  return {
    id: listedUrl,
    url,
    title: page.title || listedUrl,
    short_title: '',
    summary: page.summary,
    tldr: page.summary,
    image: page.image,
    content_html: page.content_html,
    content_text: page.content_text || null,
    date_published: page.date_published,
    tags,
    authors: page.author ? [{ name: page.author }] : [],
    canonical_url: page.canonical_link || url,
    kind: 'text',
    attachments: page.image ? [{ url: page.image, mime_type: 'image/*', _role: 'cover' }] : [],
    _references: tags.map((value) => ({ type: 'tag', value })),
    // What the page said about itself, as written, for later work on slugs
    // and tags: the address listed, its canonical link, its own tags.
    _page: {
      listed_url: listedUrl,
      canonical_link: page.canonical_link,
      article_tags: page.article_tags,
      keywords: page.keywords,
    },
  };
}

function homeOf(url) {
  try { return new URL(url).origin; } catch (_) { return null; }
}

module.exports = { id: ID, load, pageItem, homeOf };

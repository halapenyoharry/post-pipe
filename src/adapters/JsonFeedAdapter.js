// JsonFeedAdapter — fetches a JSON Feed 1.x document and returns its items.
// Pass-through with light validation: anything that doesn't look like a
// JSON Feed bails so the aggregator can keep going.

const { fetchText } = require('./fetchText');

const ID = 'json-feed';

async function load(config) {
  const { id, title, xmlUrl } = config;
  const text = await fetchText(xmlUrl);
  let feed;
  try { feed = JSON.parse(text); }
  catch (err) { throw new Error(`JsonFeedAdapter: invalid JSON at ${xmlUrl}: ${err.message}`); }

  if (!feed.items || !Array.isArray(feed.items)) {
    throw new Error(`JsonFeedAdapter: no items array in ${xmlUrl}`);
  }

  const items = feed.items.map(normalizeItem);

  return {
    items,
    feedMeta: {
      id: id || feed.feed_url || xmlUrl,
      title: title || feed.title || xmlUrl,
      home_page_url: feed.home_page_url || null,
      favicon: feed.favicon || null,
      icon: feed.icon || null,
    },
  };
}

function normalizeItem(it) {
  // JSON Feed items are already in our target shape; pass through and fill
  // common fallbacks.
  const url = it.url || it.external_url || '';
  return {
    id: it.id || url,
    url,
    title: it.title || '',
    short_title: it.short_title || '',
    summary: it.summary || '',
    tldr: it.summary || '',
    image: it.image || it.banner_image || '',
    content_html: it.content_html || null,
    content_text: it.content_text || null,
    date_published: it.date_published || undefined,
    tags: it.tags || [],
    authors: it.authors || (it.author ? [it.author] : []),
    canonical_url: it.url || it.external_url || '',
    kind: it._kind || it.kind || 'text',
  };
}

module.exports = { id: ID, load };

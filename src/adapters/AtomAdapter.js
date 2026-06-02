// AtomAdapter — Atom 1.0 fetcher + normalizer. Emits JSON Feed 1.1 items.

const { XMLParser } = require('fast-xml-parser');
const { fetchText } = require('./fetchText');

const ID = 'atom';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
  isArray: (name) => name === 'entry' || name === 'link' || name === 'category' || name === 'author',
});

async function load(config) {
  const { id, title, xmlUrl } = config;
  const xml = await fetchText(xmlUrl);
  const doc = parser.parse(xml);
  const feed = doc?.feed;
  if (!feed) throw new Error(`AtomAdapter: no <feed> root in ${xmlUrl}`);

  const items = (feed.entry || []).map(normalizeEntry);

  return {
    items,
    feedMeta: {
      id: id || feed.id || xmlUrl,
      title: title || extractText(feed.title) || xmlUrl,
      home_page_url: alternateLink(feed.link) || null,
      favicon: feed.icon || null,
      icon: feed.logo || feed.icon || null,
    },
  };
}

function normalizeEntry(e) {
  const url = alternateLink(e.link) || e.id || '';
  const summary = extractText(e.summary) || stripTags(extractText(e.content)).slice(0, 400);
  const contentHtml = extractText(e.content) || extractText(e.summary) || null;
  const authors = (e.author || []).map(a => ({ name: extractText(a.name) || '' })).filter(a => a.name);
  const image = extractImage(e);
  const tags  = (e.category || []).map(c => c['@_term']).filter(Boolean);

  return {
    id: e.id || url,
    url,
    title: extractText(e.title) || '',
    short_title: '',
    summary,
    tldr: summary,
    image,
    content_html: contentHtml,
    date_published: parseDate(e.published || e.updated),
    tags,
    authors,
    canonical_url: url,
    kind: 'text',
    attachments: image ? [{ url: image, mime_type: 'image/*', _role: 'cover' }] : [],
    _references: tags.map(value => ({ type: 'tag', value })),
  };
}

// Atom <link> entries have rel/type/href attributes. Find the alternate
// (the link a human follows) or the first available href.
function alternateLink(links) {
  if (!links) return '';
  const arr = Array.isArray(links) ? links : [links];
  const alt = arr.find(l => l['@_rel'] === 'alternate' || !l['@_rel']);
  return alt?.['@_href'] || arr[0]?.['@_href'] || '';
}

function extractText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  // <title type="html">…</title> or <content type="html">…</content>
  return node['#text'] || node.div || '';
}

function extractImage(e) {
  if (e['media:content']?.['@_url']) return e['media:content']['@_url'];
  if (e['media:thumbnail']?.['@_url']) return e['media:thumbnail']['@_url'];
  const html = extractText(e.content) || extractText(e.summary) || '';
  const m = typeof html === 'string' && html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : '';
}

function stripTags(s) {
  return typeof s === 'string' ? s.replace(/<[^>]+>/g, '') : '';
}

function parseDate(s) {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

module.exports = { id: ID, load };

const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');
const crypto = require('crypto');

const CACHE_DIR = path.join(process.cwd(), '.feed-cache');

async function fetchWithCache(url, ttl) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

  const hash = crypto.createHash('md5').update(url).digest('hex');
  const cachePath = path.join(CACHE_DIR, `${hash}.json`);

  if (fs.existsSync(cachePath)) {
    const stats = fs.statSync(cachePath);
    const age = (Date.now() - stats.mtimeMs) / 1000;
    if (age < ttl) {
      return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    }
  }

  const response = await fetch(url, { headers: { 'User-Agent': 'post-pipe/1.0' } });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  fs.writeFileSync(cachePath, JSON.stringify({ data: text }), 'utf8');
  return { data: text };
}

function parseFeedContent(xmlString) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    cdataPropName: '__cdata',
    allowBooleanAttributes: true
  });

  const parsed = parser.parse(xmlString);
  let items = [];

  // RSS 2.0
  if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
    items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
  } 
  // Atom
  else if (parsed.feed && parsed.feed.entry) {
    items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
  }

  return items.map(item => {
    // URL
    let itemUrl = item.link;
    if (Array.isArray(item.link)) {
      itemUrl = item.link.find(l => l['@_rel'] === 'alternate')?.['@_href'] || item.link[0]?.['@_href'] || item.link[0];
    } else if (typeof item.link === 'object') {
      itemUrl = item.link['@_href'] || item.link['#text'];
    }

    // Image
    let imageUrl = '';
    const mediaContent = item['media:content'];
    const mediaThumbnail = item['media:thumbnail'];
    if (mediaContent && typeof mediaContent === 'object' && mediaContent['@_url']) {
        imageUrl = mediaContent['@_url'];
    } else if (Array.isArray(mediaContent) && mediaContent[0]?.['@_url']) {
        imageUrl = mediaContent[0]['@_url'];
    } else if (mediaThumbnail && typeof mediaThumbnail === 'object' && mediaThumbnail['@_url']) {
        imageUrl = mediaThumbnail['@_url'];
    } else if (Array.isArray(mediaThumbnail) && mediaThumbnail[0]?.['@_url']) {
        imageUrl = mediaThumbnail[0]['@_url'];
    }

    // Title
    let title = item.title;
    if (title && typeof title === 'object') {
      title = title['#text'] || title.__cdata || '';
    }

    // Description
    let description = item.description || item.summary || item.content;
    if (description && typeof description === 'object') {
      description = description['#text'] || description.__cdata || '';
    }
    // Very basic strip tags for description
    description = description ? description.replace(/<[^>]+>/g, '').substring(0, 300) : '';

    // Date
    let datePublished = item.pubDate || item.published || item.updated;

    // Categories / Tags
    let tags = [];
    if (item.category) {
        if (Array.isArray(item.category)) {
            tags = item.category.map(c => typeof c === 'object' ? (c['#text'] || c['@_term']) : c);
        } else if (typeof item.category === 'object') {
            tags = [item.category['#text'] || item.category['@_term']];
        } else {
            tags = [item.category];
        }
    }

    return {
      title: title || 'Untitled',
      url: itemUrl,
      description: description,
      date_published: datePublished ? new Date(datePublished).toISOString() : undefined,
      tags: tags,
      image: imageUrl
    };
  }).filter(item => item.url);
}

async function loadFeedItems(settings) {
  if (!settings.feeds || !Array.isArray(settings.feeds)) {
    return [];
  }

  const ttl = settings.feed_cache_ttl || 3600;
  const allArticles = [];
  const seenUrls = new Set();

  for (const feedConfig of settings.feeds) {
    if (!feedConfig.enabled) continue;

    try {
      console.log(`Fetching feed: ${feedConfig.label} (${feedConfig.url})`);
      const { data } = await fetchWithCache(feedConfig.url, ttl);

      // Simple check for JSON Feed vs XML
      let items = [];
      if (data.trim().startsWith('{')) {
        const jsonFeed = JSON.parse(data);
        items = (jsonFeed.items || []).map(item => ({
            title: item.title,
            url: item.url,
            description: item.summary || item.content_text || '',
            date_published: item.date_published,
            tags: item.tags || [],
            image: item.image || ''
        }));
      } else {
        items = parseFeedContent(data);
      }

      for (const item of items) {
        if (seenUrls.has(item.url)) continue;
        seenUrls.add(item.url);

        const mergedTags = new Set([...(item.tags || []), ...(feedConfig.inject_tags || [])]);

        // Same shape as loadArticles in generate-index.js
        allArticles.push({
          id: item.url,
          url: item.url,
          title: item.title,
          short_title: feedConfig.label, // Fallback short title to the feed source name
          summary: item.description,
          tldr: '',
          image: item.image,
          date_published: item.date_published,
          reading_time: '',
          tags: Array.from(mergedTags).filter(Boolean),
          series: feedConfig.label, // Use source as series maybe?
          series_part: null,
          license: '',
          canonical_url: item.url,
          syndication: {},
          _status: 'published'
        });
      }
    } catch (e) {
      console.error(`Error processing feed ${feedConfig.label}: ${e.message}`);
    }
  }

  return allArticles;
}

module.exports = {
  loadFeedItems
};

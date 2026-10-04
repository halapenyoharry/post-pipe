// JSON Feed 1.1 (and post-pipe's extended feed.json): items[].tags[], summary/content_html.
// A feed may carry several tag-systems; post-pipe marks each item with _source.title, which wins
// over the feed title so one merged feed.json splits back into its real sources.
import { stripHtml } from '../text.js';

const MAX_TEXT = 3000;

export function fromJsonFeed(text, opts = {}) {
  const feed = JSON.parse(text);
  const records = [];
  for (const it of feed.items ?? []) {
    const source = opts.source || it._source?.title || feed.title || 'feed';
    const id = String(it.id ?? it.url);
    const body = [it.summary, it.tldr, stripHtml(it.content_html ?? it.content_text ?? '')].filter(Boolean).join(' ');
    records.push({
      type: 'item',
      source,
      id,
      title: it.title ?? id,
      text: body.slice(0, MAX_TEXT),
      url: it.canonical_url || it.url || '',
      date: it.date_published ?? '',
      kind: it.kind ?? '',
      ...(it._source?.color ? { color: it._source.color } : {}),
    });
    for (const label of it.tags ?? []) {
      if (typeof label === 'string' && label.trim()) records.push({ type: 'tag', source, item: id, label: label.trim(), weight: 1, origin: 'explicit' });
    }
  }
  return records;
}

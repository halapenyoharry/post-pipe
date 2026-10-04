// Plain "item<TAB>tag[<TAB>title<TAB>url]" lines. The lowest common denominator: anything
// (a spreadsheet, a Zotero export, `jq … | paste`) can be turned into this in one line.
export function fromPairs(text, opts = {}) {
  const source = opts.source || 'pairs';
  const records = [];
  const seen = new Set();
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\r$/, '');
    if (!line.trim() || line.startsWith('#')) continue;
    const [item, tag, title, url] = line.split('\t');
    if (!item || !tag) continue;
    if (!seen.has(item)) {
      seen.add(item);
      records.push({ type: 'item', source, id: item, title: title || item, text: '', url: url || '', date: '', kind: '' });
    }
    records.push({ type: 'tag', source, item, label: tag.trim(), weight: 1, origin: 'explicit' });
  }
  return records;
}

// Bookmarks as the settings panel lists them: what each is called, and which
// paragraph of the current text it lands on.

// The chapter a bookmark belongs to, and its first words.
function bookmarkLabel(b, title) {
  const chapter = title || decodeURIComponent(String(b.item || '').split('/').pop().replace(/\.html$/, '')).replace(/[-_]+/g, ' ');
  const para = b.para !== undefined ? b.para : b.paragraph;
  const where = b.quote ? `“${b.quote}…”` : (para != null ? `paragraph ${Number(para) + 1}` : '');
  return [chapter, where].filter(Boolean).join(' · ');
}

// The paragraph a bookmark points at in the item's current text: through the
// version map when the text has changed since the bookmark was made.
function placedParagraph(b, item) {
  const para = b.para !== undefined ? b.para : b.paragraph;
  if (para === undefined || para === null) return null;
  if (item && b.version && item.version && b.version !== item.version) {
    const map = item.version_maps && item.version_maps[b.version];
    if (map) {
      const mapped = map[para];
      if (mapped !== undefined && mapped !== -1) return mapped;
    }
  }
  return para;
}

// What a tap on Bookmark does, with this chapter's bookmarks and the
// paragraph now at the top of the reader: 'remove' when its bookmark is
// already there, else 'set' (one bookmark per chapter: the new one replaces
// any before it).
function bookmarkTap(marks, para) {
  const list = Array.isArray(marks) ? marks : [];
  const at = (b) => (b.para !== undefined ? b.para : b.paragraph);
  if (list.length && para !== null && para !== undefined && list.every((b) => at(b) === para)) return 'remove';
  return 'set';
}

module.exports = { bookmarkTap, bookmarkLabel, placedParagraph };

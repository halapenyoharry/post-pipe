// Whose name goes under the title: the reader's byline, kept for the piece's
// author. Where the piece came from is the source pill's to say, under the
// byline and date (src/lib/readingOrder.js readerSourcePill). The owner,
// 2026-11-10: "the by line should be reserved for the author of the piece if
// provided."
//
// A piece names its own authors, and they win. A piece from the site's own
// folder (its source is of type 'local', or it has no source stamp at all)
// that names no one takes the site's author (settings.author), which is what
// the build gives such a piece, so it is the piece's author. A piece from any
// other source (a publisher's feed) that names no one has no byline. Nothing
// to show gives null.
//
// Author names are shown lowercase, as the engine has always drawn them.

function sourceOf(article) {
  if (!article) return null;
  return article._source || (article.originalItem && article.originalItem._source) || null;
}

function pieceLink(article) {
  return article.canonical_url || article.url || null;
}

function byline(settings, article) {
  if (!article) return null;

  const authors = Array.isArray(article.authors) ? article.authors.filter((a) => a && a.name) : [];
  if (authors.length) {
    return {
      name: authors.map((a) => String(a.name).trim()).join(', ').toLowerCase(),
      url: authors[0].url || pieceLink(article),
    };
  }
  if (article.author && String(article.author).trim()) {
    return { name: String(article.author).trim().toLowerCase(), url: pieceLink(article) };
  }

  const source = sourceOf(article);
  const local = !source || source.type === 'local';
  if (!local) return null;
  const site = settings && settings.author;
  const name = ((site && (site.name || site.display)) || '').trim().toLowerCase();
  return name ? { name, url: (site && site.url) || null } : null;
}

module.exports = { byline };

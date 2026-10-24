// Whose name goes under the title: the reader's byline.
//
// A piece names its own authors, and they win. A piece that names no one
// takes a name from where it came from:
//   - from the site's own folder (its source is of type 'local', or it has
//     no source stamp at all), the site's author (settings.author), which is
//     also what the build gives such a piece;
//   - from any other source (a publisher's feed), that source's title, as
//     the site's feed list writes it, linking to the piece itself.
// Nothing to show gives null.
//
// Author names are shown lowercase, as the engine has always drawn them; a
// source's title is shown as written.

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
  if (local) {
    const site = settings && settings.author;
    const name = ((site && (site.name || site.display)) || '').trim().toLowerCase();
    return name ? { name, url: (site && site.url) || null } : null;
  }

  const title = (source.title || '').trim();
  return title ? { name: title, url: pieceLink(article) } : null;
}

module.exports = { byline };

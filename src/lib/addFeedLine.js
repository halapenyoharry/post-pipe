// addFeedLine — the lines the + pill shows for an address a reader pastes:
// the feeds.opml <outline> to add by hand and the add-feed.js command that
// adds it. Two routes: a feed (the address is, or led to, a feed; the type
// attribute is left off so the parser's own inference runs, as ever) and a
// page (autodiscovery found no feed at the address, so the page itself is
// listed as one item: type="page"). Pure, so the pill's text is testable
// without the component.

function urlToLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (_) {
    return url;
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// Shell-quote an address for the command line: single-quoted, with any
// single quote of its own escaped.
function shell(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

// The feed line, as the pill has always made it.
function buildOutline(url) {
  const safeUrl = url.replace(/"/g, '&quot;');
  return `<outline text="${urlToLabel(url)}" title="${urlToLabel(url)}" xmlUrl="${safeUrl}"/>`;
}

// The page line: one article's address as one item. Its title is the
// page's own when the pill learned it, else the host's name.
function buildPageOutline(url, title) {
  const label = escapeAttr((title || '').trim() || urlToLabel(url));
  return `<outline text="${label}" title="${label}" type="page" xmlUrl="${escapeAttr(url)}"/>`;
}

// The command for either route.
function buildCommand(url, kind = 'feed', title) {
  const parts = ['node add-feed.js', shell(url)];
  if (kind === 'page') {
    parts.push('--type=page');
    if (title && title.trim()) parts.push(`--title=${shell(title.trim())}`);
  }
  return parts.join(' ');
}

module.exports = { urlToLabel, shell, buildOutline, buildPageOutline, buildCommand };

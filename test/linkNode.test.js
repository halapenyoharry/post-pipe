// Link nodes: an item that names a link and has no text of its own. Its
// detection from front matter and from a feed item, the rule for where it
// opens (graph.links.newTab), its page, and the site's intro line.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  linkFromFrontMatter, blurbFromFrontMatter, hasBodyText, isLinkContent, isLinkItem, isLinkFeedItem, linkOf,
  newTabMode, linkTarget, resolveLink, redirectPage, introConfig, introHtml,
} = require('../src/lib/linkNode');

test('the link and the blurb from front matter', () => {
  assert.equal(linkFromFrontMatter({ link: ' https://a.example/ ' }), 'https://a.example/');
  assert.equal(linkFromFrontMatter({ external_url: 'https://b.example/' }), 'https://b.example/');
  assert.equal(linkFromFrontMatter({ link: 'https://a.example/', external_url: 'https://b.example/' }), 'https://a.example/', 'link first');
  assert.equal(linkFromFrontMatter({ link: 3 }), '');
  assert.equal(linkFromFrontMatter(null), '');
  assert.equal(blurbFromFrontMatter({ summary: 'S', blurb: 'B' }), 'S');
  assert.equal(blurbFromFrontMatter({ blurb: 'B' }), 'B');
  assert.equal(blurbFromFrontMatter({}), '');
});

test('a link node names a link and has no body text', () => {
  assert.equal(hasBodyText('  \n\t\n'), false);
  assert.equal(hasBodyText('a'), true);
  assert.equal(isLinkContent({ link: '../', body: '' }), true);
  assert.equal(isLinkContent({ link: '../', body: '\n\n  \n' }), true, 'blank lines are no text');
  assert.equal(isLinkContent({ link: '../', body: 'Some words.' }), false, 'a piece with text is read, not followed');
  assert.equal(isLinkContent({ link: '', body: '' }), false, 'nothing to follow');
  assert.equal(isLinkContent({ link: '../' }), true);
});

test('feed items: kind link with a link, and a JSON Feed item that is only external_url', () => {
  assert.equal(isLinkItem({ kind: 'link', external_url: 'https://a.example/' }), true);
  assert.equal(isLinkItem({ kind: 'link' }), false, 'nothing to follow');
  assert.equal(isLinkItem({ kind: 'essay', external_url: 'https://a.example/' }), false);
  assert.equal(isLinkItem({ originalItem: { kind: 'link', external_url: '../' } }), true, 'a graph node by its item');
  assert.equal(linkOf({ originalItem: { kind: 'link', external_url: '../' } }), '../');
  assert.equal(isLinkFeedItem({ external_url: 'https://a.example/' }), true);
  assert.equal(isLinkFeedItem({ external_url: 'https://a.example/', content_html: '<p>x</p>' }), false);
  assert.equal(isLinkFeedItem({ external_url: 'https://a.example/', content_text: ' ' }), true);
  assert.equal(isLinkFeedItem({ url: 'https://a.example/' }), false);
});

test('newTab: external by default, always and never as set', () => {
  assert.equal(newTabMode({}), 'external');
  assert.equal(newTabMode({ graph: { links: { newTab: 'always' } } }), 'always');
  assert.equal(newTabMode({ graph: { links: { newTab: 'never' } } }), 'never');
  assert.equal(newTabMode({ graph: { links: { newTab: 'sometimes' } } }), 'external');
  const base = 'https://site.example/author/index.html';
  assert.equal(linkTarget('../', { base }), '_self', 'this site: the same tab');
  assert.equal(linkTarget('https://site.example/other.html', { base }), '_self');
  assert.equal(linkTarget('https://elsewhere.example/', { base }), '_blank', 'another site: a new tab');
  assert.equal(linkTarget('http://site.example/', { base }), '_blank', 'another scheme is another origin');
  assert.equal(linkTarget('../', { base, mode: 'always' }), '_blank');
  assert.equal(linkTarget('https://elsewhere.example/', { base, mode: 'never' }), '_self');
  assert.equal(linkTarget('https://elsewhere.example/', { base: '' }), '_blank', 'no base: absolute is away');
  assert.equal(linkTarget('../', { base: '' }), '_self', 'no base: relative is here');
  assert.equal(resolveLink('../', base), 'https://site.example/');
});

test('a link node\'s page sends the visitor on, everything escaped', () => {
  const html = redirectPage({ title: 'a "b" <c>', href: 'https://a.example/?x=1&y=2', blurb: 'one & two' });
  assert.match(html, /<meta http-equiv="refresh" content="0; url=https:\/\/a\.example\/\?x=1&amp;y=2">/);
  assert.match(html, /<a href="https:\/\/a\.example\/\?x=1&amp;y=2">/);
  assert.match(html, /<title>a &quot;b&quot; &lt;c&gt;<\/title>/);
  assert.match(html, /<p>one &amp; two<\/p>/);
});

test('graph.intro: off when empty, plain by default, markdown when it says so', () => {
  assert.equal(introConfig({}), null);
  assert.equal(introConfig({ graph: { intro: '   ' } }), null);
  assert.deepStrictEqual(introConfig({ graph: { intro: ' a line ' } }), { text: 'a line', format: 'plain' });
  assert.deepStrictEqual(introConfig({ graph: { intro: { text: '*a*', format: 'markdown' } } }), { text: '*a*', format: 'markdown' });
  assert.equal(introConfig({ graph: { intro: { text: '' } } }), null);
  assert.equal(introHtml({ text: 'a <b>\n\nc', format: 'plain' }), '<p>a &lt;b&gt;</p><p>c</p>');
  const md = introHtml({ text: 'x', format: 'markdown' }, () => '<p onclick="no()">x</p><script>no()</script>');
  assert.equal(md, '<p>x</p>');
  assert.equal(introHtml(null), '');
});

test('the ingester: a folder whose index.md is front matter only is a link node; one with text is not', () => {
  const { ingestFolder } = require('../ingest');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-link-'));
  const put = (id, text) => { fs.mkdirSync(path.join(root, id)); fs.writeFileSync(path.join(root, id, 'index.md'), text); };
  put('away', '---\ntitle: away\nlink: https://a.example/\nblurb: a short line.\nsubtitle: a list\n---\n');
  put('home', '---\ntitle: home\nexternal_url: ../\nsummary: the main site.\n---\n\n\n');
  put('essay', '---\ntitle: an essay\nlink: https://a.example/\n---\n\nSome words.\n');
  const { contents } = ingestFolder(root);
  const by = Object.fromEntries(contents.map((c) => [c.id, c]));
  assert.equal(by.away.kind, 'link');
  assert.equal(by.away.link, 'https://a.example/');
  assert.equal(by.away.title, 'away');
  assert.equal(by.away.summary, 'a short line.');
  assert.equal(by.away.subtitle, 'a list');
  assert.equal(by.home.kind, 'link');
  assert.equal(by.home.link, '../');
  assert.equal(by.home.summary, 'the main site.');
  assert.notEqual(by.essay.kind, 'link');
  assert.equal(by.essay.title, 'an essay', 'its front matter still names it');
});

test('following a link: a new tab off the site, this tab on it, nothing without a link', () => {
  const { followLink } = require('../src/lib/linkNode');
  const calls = [];
  const win = {
    document: { baseURI: 'https://site.example/author/' },
    location: { href: 'https://site.example/author/', assign: (u) => calls.push(['assign', u]) },
    open: (u, t, f) => calls.push(['open', u, t, f]),
    SETTINGS: {},
  };
  assert.deepStrictEqual(followLink({ kind: 'link', external_url: '../' }, { win }), { href: 'https://site.example/', target: '_self' });
  assert.deepStrictEqual(followLink({ kind: 'link', external_url: 'https://away.example/x' }, { win }), { href: 'https://away.example/x', target: '_blank' });
  assert.deepStrictEqual(calls, [['assign', 'https://site.example/'], ['open', 'https://away.example/x', '_blank', 'noopener']]);
  assert.equal(followLink({ kind: 'essay' }, { win }), null);
  calls.length = 0;
  followLink({ kind: 'link', external_url: '../' }, { win, settings: { graph: { links: { newTab: 'always' } } } });
  assert.equal(calls[0][0], 'open');
});

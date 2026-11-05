const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const S = require('../src/lib/cardSlug');

const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cards-'));

test('discovery order: canonical, then DOI, then the url path, then the title', () => {
  const canonical = S.discoverSlug({ url: 'https://a.test/p/one.html', canonical_url: 'https://b.test/essays/the-real-one/', title: 'T' });
  assert.deepStrictEqual(canonical, { slug: 'the-real-one', source: 'canonical', identity: 'https://b.test/essays/the-real-one/' });

  const inHtml = S.discoverSlug({ url: 'https://a.test/p/one.html', content_html: '<p>x</p><link rel="canonical" href="https://b.test/from-html">', title: 'T' });
  assert.strictEqual(inHtml.slug, 'from-html');
  assert.strictEqual(inHtml.source, 'canonical');

  const doi = S.discoverSlug({ url: 'https://a.test/p/one.html', doi: '10.1038/s41586-024-07123-4', title: 'T' });
  assert.deepStrictEqual(doi, { slug: '10.1038-s41586-024-07123-4', source: 'doi', identity: '10.1038/s41586-024-07123-4' });

  // A canonical that is a DOI address is the DOI, whole, not its last path part.
  const doiCanonical = S.discoverSlug({ url: 'https://a.test/p/one.html', canonical_url: 'https://doi.org/10.5555/ABC.12', title: 'T' });
  assert.strictEqual(doiCanonical.source, 'doi');
  assert.strictEqual(doiCanonical.slug, '10.5555-abc.12');

  const url = S.discoverSlug({ url: 'https://a.test/p/one.html', canonical_url: 'https://a.test/p/one.html', title: 'T' });
  assert.deepStrictEqual(url, { slug: 'one', source: 'url', identity: 'https://a.test/p/one.html' });

  // A numeric path part is the identity as much as a worded one.
  const numeric = S.discoverSlug({ url: 'https://www.sciencedaily.com/releases/2026/09/260901070541.htm', title: 'Some headline' });
  assert.deepStrictEqual(numeric, { slug: '260901070541', source: 'url', identity: 'https://www.sciencedaily.com/releases/2026/09/260901070541.htm' });

  // Query and fragment are not the slug; the id stands in for a missing url.
  assert.strictEqual(S.discoverSlug({ url: 'https://a.test/x/Two%20Words?utm=1#top' }).slug, 'two-words');
  assert.deepStrictEqual(S.discoverSlug({ id: 'tag:a.test,2026:post-7', title: 'T' }), { slug: 'tag-a.test-2026-post-7', source: 'url', identity: 'tag:a.test,2026:post-7' });

  // A bare host has no path part, so the title is next.
  const title = S.discoverSlug({ url: 'https://a.test/', title: 'The Bend in the River' });
  assert.deepStrictEqual(title, { slug: 'the-bend-in-the-river', source: 'title', identity: 'The Bend in the River' });
  assert.deepStrictEqual(S.discoverSlug({ title: '  Café & Crème  ' }), { slug: 'café-crème', source: 'title', identity: 'Café & Crème' });
  assert.deepStrictEqual(S.discoverSlug({}), { slug: 'untitled', source: 'title', identity: '' });
});

test('every item gets slug and slugSource; ids are untouched', () => {
  const items = [
    { id: 'https://s.test/river-bend.html', url: 'https://s.test/river-bend.html', title: 'The Bend in the River' },
    { id: 'guid-1', url: 'https://pub.test/2026/loaf', title: 'Loaf' },
  ];
  const { ledger, changed, summary } = S.assignSlugs(items, null, { now: '2026-11-04T10:00:00Z' });
  assert.strictEqual(changed, true);
  assert.deepStrictEqual(summary, { known: 0, added: 2, suffixed: 0 });
  assert.deepStrictEqual(items.map((i) => [i.id, i.slug, i.slugSource]), [
    ['https://s.test/river-bend.html', 'river-bend', 'url'],
    ['guid-1', 'loaf', 'url'],
  ]);
  assert.strictEqual(ledger.schema, S.LEDGER_SCHEMA);
  assert.strictEqual(ledger.created, '2026-11-04');
  assert.deepStrictEqual(ledger.cards['river-bend'], { urls: ['https://s.test/river-bend.html'], titles: ['The Bend in the River'], firstSeen: '2026-11-04', source: 'url' });
  // A feed id that is not the url is kept apart from the urls.
  assert.deepStrictEqual(ledger.cards.loaf, { urls: ['https://pub.test/2026/loaf'], titles: ['Loaf'], firstSeen: '2026-11-04', source: 'url', ids: ['guid-1'] });
});

test('the freeze: a second build with a changed title keeps the slug, and the ledger holds both titles', () => {
  const first = [{ id: 'https://s.test/river-bend.html', url: 'https://s.test/river-bend.html', title: 'The Bend in the River' }];
  const b1 = S.assignSlugs(first, null, { now: '2026-11-04T10:00:00Z' });
  const second = [{ id: 'https://s.test/river-bend.html', url: 'https://s.test/river-bend.html', title: 'Where the River Bends' }];
  const b2 = S.assignSlugs(second, b1.ledger, { now: '2026-12-01T10:00:00Z' });
  assert.strictEqual(second[0].slug, 'river-bend');
  assert.strictEqual(second[0].slugSource, 'url');
  assert.deepStrictEqual(b2.ledger.cards['river-bend'].titles, ['The Bend in the River', 'Where the River Bends']);
  assert.strictEqual(b2.ledger.cards['river-bend'].firstSeen, '2026-11-04');
  assert.strictEqual(b2.ledger.created, '2026-11-04');
  assert.deepStrictEqual(b2.summary, { known: 1, added: 0, suffixed: 0 });

  // A url that moves, with the feed's own id kept, is still the same card.
  const moved = [{ id: 'guid-9', url: 'https://old.test/a/piece', title: 'P' }];
  const m1 = S.assignSlugs(moved, null, { now: '2026-11-04T10:00:00Z' });
  const movedAgain = [{ id: 'guid-9', url: 'https://new.test/b/piece-renamed', title: 'P' }];
  S.assignSlugs(movedAgain, m1.ledger, { now: '2026-11-05T10:00:00Z' });
  assert.strictEqual(movedAgain[0].slug, 'piece');

  // A card whose only identity is its title keeps its slug while the title holds.
  const titled = [{ title: 'Only a Title' }];
  const t1 = S.assignSlugs(titled, null, { now: '2026-11-04T10:00:00Z' });
  const titledAgain = [{ title: 'Only a Title' }];
  const t2 = S.assignSlugs(titledAgain, t1.ledger, { now: '2026-11-05T10:00:00Z' });
  assert.strictEqual(titledAgain[0].slug, 'only-a-title');
  assert.strictEqual(t2.changed, false);
});

test('the collision suffix: a different card with the same slug gets -2 on first sight, frozen after', () => {
  const items = [
    { id: 'https://a.test/essays/pattern.html', url: 'https://a.test/essays/pattern.html', title: 'Pattern, by A' },
    { id: 'https://b.test/notes/pattern', url: 'https://b.test/notes/pattern', title: 'Pattern, by B' },
    { id: 'https://c.test/pattern/', url: 'https://c.test/pattern/', title: 'Pattern, by C' },
  ];
  const b1 = S.assignSlugs(items, null, { now: '2026-11-04T10:00:00Z' });
  assert.deepStrictEqual(items.map((i) => i.slug), ['pattern', 'pattern-2', 'pattern-3']);
  assert.deepStrictEqual(b1.summary, { known: 0, added: 3, suffixed: 2 });
  assert.strictEqual(b1.ledger.cards['pattern-2'].disambiguatedFrom, 'pattern');
  assert.strictEqual(b1.ledger.cards.pattern.disambiguatedFrom, undefined);

  // The next build sees them in another order; each keeps the slug it was given.
  const reordered = [items[2], items[0], items[1]].map((i) => ({ id: i.id, url: i.url, title: i.title }));
  const b2 = S.assignSlugs(reordered, b1.ledger, { now: '2026-11-05T10:00:00Z' });
  assert.deepStrictEqual(reordered.map((i) => i.slug), ['pattern-3', 'pattern', 'pattern-2']);
  assert.strictEqual(b2.changed, false);

  // A title slug that collides with a url slug is suffixed the same way.
  const mixed = [{ url: 'https://a.test/loaf', title: 'x' }, { title: 'Loaf' }];
  S.assignSlugs(mixed, null, { now: '2026-11-04T10:00:00Z' });
  assert.deepStrictEqual(mixed.map((i) => [i.slug, i.slugSource]), [['loaf', 'url'], ['loaf-2', 'title']]);
});

test('one article from two sources is two cards with one slug, not a merge', () => {
  const items = [
    { id: 'https://pub.test/story', url: 'https://pub.test/story', title: 'Story', _source: { id: 'feed-a' } },
    { id: 'https://pub.test/story', url: 'https://pub.test/story', title: 'Story', _source: { id: 'feed-b' } },
  ];
  const { ledger } = S.assignSlugs(items, null, { now: '2026-11-04T10:00:00Z' });
  assert.deepStrictEqual(items.map((i) => i.slug), ['story', 'story']);
  assert.strictEqual(Object.keys(ledger.cards).length, 1);
});

test('the ledger grows without rewriting: known entries stay byte for byte, new ones are added', () => {
  const b1 = S.assignSlugs([
    { id: 'https://s.test/one.html', url: 'https://s.test/one.html', title: 'One' },
    { id: 'https://s.test/two.html', url: 'https://s.test/two.html', title: 'Two' },
  ], null, { now: '2026-11-04T10:00:00Z' });
  const before = JSON.stringify(b1.ledger.cards);

  // The same corpus again: nothing changes.
  const again = S.assignSlugs([
    { id: 'https://s.test/one.html', url: 'https://s.test/one.html', title: 'One' },
    { id: 'https://s.test/two.html', url: 'https://s.test/two.html', title: 'Two' },
  ], b1.ledger, { now: '2026-11-06T10:00:00Z' });
  assert.strictEqual(again.changed, false);
  assert.strictEqual(JSON.stringify(again.ledger), JSON.stringify(b1.ledger));

  // One more card, one card gone from the corpus: the gone card stays in the ledger.
  const b2 = S.assignSlugs([
    { id: 'https://s.test/two.html', url: 'https://s.test/two.html', title: 'Two' },
    { id: 'https://s.test/three.html', url: 'https://s.test/three.html', title: 'Three' },
  ], b1.ledger, { now: '2026-11-07T10:00:00Z' });
  assert.strictEqual(b2.changed, true);
  assert.deepStrictEqual(Object.keys(b2.ledger.cards), ['one', 'two', 'three']);
  assert.strictEqual(JSON.stringify({ one: b2.ledger.cards.one, two: b2.ledger.cards.two }), before);
  assert.strictEqual(b2.ledger.cards.three.firstSeen, '2026-11-07');
  // The prior ledger object was not changed in place.
  assert.deepStrictEqual(Object.keys(b1.ledger.cards), ['one', 'two']);
});

test('reading and writing the file: absent, ok, unreadable; written atomically and read back the same', () => {
  const dir = tmpDir();
  const file = path.join(dir, 'cards.json');
  assert.deepStrictEqual(S.readLedger(file), { ledger: null, status: 'absent' });
  const { ledger } = S.assignSlugs([{ id: 'https://s.test/a.html', url: 'https://s.test/a.html', title: 'A' }], null, { now: '2026-11-04T10:00:00Z' });
  S.writeLedger(file, ledger);
  assert.ok(!fs.existsSync(`${file}.tmp`));
  const read = S.readLedger(file);
  assert.strictEqual(read.status, 'ok');
  assert.deepStrictEqual(read.ledger, ledger);
  fs.writeFileSync(file, '{"cards": "no"}');
  assert.deepStrictEqual(S.readLedger(file), { ledger: null, status: 'unreadable' });
  fs.writeFileSync(file, 'not json');
  assert.strictEqual(S.readLedger(file).status, 'unreadable');
  // An unreadable prior is built over as if absent, never carried.
  const over = S.assignSlugs([{ url: 'https://s.test/a.html', title: 'A' }], { cards: 'no' }, { now: '2026-11-04T10:00:00Z' });
  assert.strictEqual(over.changed, true);
  assert.deepStrictEqual(Object.keys(over.ledger.cards), ['a']);
});

test('settings.cards.ledger: relative to the site, cards.json by default, false for none', () => {
  assert.strictEqual(S.cardsLedgerPath({}, '/site'), path.resolve('/site/cards.json'));
  assert.strictEqual(S.cardsLedgerPath({ cards: { ledger: 'data/slugs.json' } }, '/site'), path.resolve('/site/data/slugs.json'));
  assert.strictEqual(S.cardsLedgerPath({ cards: { ledger: '/abs/cards.json' } }, '/site'), '/abs/cards.json');
  assert.strictEqual(S.cardsLedgerPath({ cards: { ledger: false } }, '/site'), null);
  assert.strictEqual(S.cardsLedgerPath({ cards: { ledger: '' } }, '/site'), path.resolve('/site/cards.json'));
});

test('the feed adapters keep a canonical link and a DOI when the feed gives one', async () => {
  const Rss = require('../src/adapters/RssAdapter');
  const Atom = require('../src/adapters/AtomAdapter');
  const rssXml = `<?xml version="1.0"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:prism="http://prismstandard.org/namespaces/basic/2.0/" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>J</title><link>https://j.test</link>
    <item><title>With a DOI</title><link>https://j.test/articles/123</link><prism:doi>10.1000/xyz123</prism:doi></item>
    <item><title>With a canonical</title><link>https://j.test/articles/124</link><atom:link rel="canonical" href="https://canon.test/the-piece"/></item>
    <item><title>Plain</title><link>https://j.test/articles/125</link><dc:identifier>not-a-doi</dc:identifier></item>
  </channel></rss>`;
  const rss = await Rss.load({ id: 'j', title: 'J', xmlUrl: 'https://j.test/feed' }, { fetchText: async () => rssXml });
  assert.strictEqual(rss.items[0].doi, '10.1000/xyz123');
  assert.strictEqual(rss.items[1].canonical_url, 'https://canon.test/the-piece');
  assert.strictEqual(rss.items[2].doi, undefined);
  assert.strictEqual(rss.items[2].canonical_url, 'https://j.test/articles/125');
  assert.deepStrictEqual(rss.items.map((i) => { const d = S.discoverSlug(i); return [d.slug, d.source]; }), [
    ['10.1000-xyz123', 'doi'], ['the-piece', 'canonical'], ['125', 'url'],
  ]);

  const atomXml = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><title>A</title>
    <entry><id>e1</id><title>Canon</title><link rel="alternate" href="https://a.test/e/1"/><link rel="canonical" href="https://canon.test/first-entry"/></entry>
    <entry><id>e2</id><title>DOI</title><link href="https://a.test/e/2"/><dc:identifier>doi:10.2000/abc.9</dc:identifier></entry>
  </feed>`;
  const atom = await Atom.load({ id: 'a', title: 'A', xmlUrl: 'https://a.test/feed' }, { fetchText: async () => atomXml });
  assert.strictEqual(atom.items[0].url, 'https://a.test/e/1');
  assert.strictEqual(atom.items[0].canonical_url, 'https://canon.test/first-entry');
  assert.strictEqual(atom.items[1].doi, '10.2000/abc.9');
  assert.deepStrictEqual(atom.items.map((i) => S.discoverSlug(i).slug), ['first-entry', '10.2000-abc.9']);
});

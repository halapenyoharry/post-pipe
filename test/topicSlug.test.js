// The topic slug (issue #39, src/lib/topicSlug.js): the literal best two
// words for what a card is about, beside its slug, never in its place. The
// module first (its stemming, its stop list, the meeting of the subject set
// and the body set, the three changes of T49, the disambiguation over a
// corpus, the same answer every time), then the build in a site of its own,
// then the tool that prints them (tools/topic-slugs.js).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('node:child_process');
const T = require('../src/lib/topicSlug');
const tool = require('../tools/topic-slugs');

const GENERATE = path.join(__dirname, '..', 'generate-index.js');
const wordsOf = (r) => r.candidates.map((c) => c.word);

test('stemming: plurals, -ing and -ed, a final e or y, irregular plurals, words kept as they are', () => {
  assert.strictEqual(T.stem('studies'), 'studi');
  assert.strictEqual(T.stem('history'), T.stem('histories'));
  assert.strictEqual(T.stem('running'), 'run');
  assert.strictEqual(T.stem('stopped'), 'stop');
  assert.strictEqual(T.stem('glasses'), 'glass');
  assert.strictEqual(T.stem('boxes'), 'box');
  assert.strictEqual(T.stem('sciences'), T.stem('science'));
  assert.strictEqual(T.stem('people'), 'person');
  assert.strictEqual(T.stem('texas'), 'texas', 'a word that ends in s by nature keeps it');
  assert.strictEqual(T.stem('indigenous'), 'indigenous');
  assert.strictEqual(T.stem('the'), 'the', 'three letters or fewer are left alone');
  assert.strictEqual(T.stem('2026'), '2026');
});

test('the stop list: the issue\'s stop and form words, common verbs, framing words, contraction stubs; markup and entities are no words', () => {
  assert.deepStrictEqual(T.tokenize('Scientists have discovered how to prove the limitations of the approach'), []);
  assert.deepStrictEqual(T.tokenize('The study paper delivered evidence, researchers said'), []);
  assert.deepStrictEqual(T.tokenize('It doesn&#8217;t matter: caf&#233; &amp; tea&nbsp;garden'), ['matter', 'cafe', 'tea', 'garden']);
  assert.deepStrictEqual(T.tokenize('<p>Glass <svg><text>stroke</text></svg> optics</p>'), ['glass', 'optics']);
  // Only the verb forms that rarely name a subject: fear stays, feared goes.
  assert.deepStrictEqual(T.tokenize('fear feared fearing'), ['fear']);
  // Function words the issue's list missed.
  assert.deepStrictEqual(T.tokenize('not long ago, far away, despite it'), []);
});

test('the two sets: a candidate is in the subject and in the body; with fewer than two there, the union', () => {
  const both = T.topicSlug({ tags: ['glass', 'optics', 'harbor'], content_html: '<p>Glass bends light. The optics of glass. A glass lens.</p>' });
  assert.deepStrictEqual(wordsOf(both), ['glass', 'optics'], 'harbor is claimed but not developed; light and lens are developed but not claimed');
  assert.strictEqual(both.slug, 'glass-optics');

  const union = T.topicSlug({ tags: ['harbor'], content_html: '<p>glass glass optics</p>' });
  assert.deepStrictEqual(wordsOf(union).sort(), ['glass', 'harbor', 'optics']);

  // Metadata is a gradient: a title and a body are enough.
  assert.strictEqual(T.topicSlug({ title: 'Harbor lights', content_html: '<p>Harbor lights at night.</p>' }).slug, 'harbor-lights');
  assert.deepStrictEqual(T.topicSlug({}), { slug: 'untitled', words: [], candidates: [] });
  assert.deepStrictEqual(T.topicSlug(null), { slug: 'untitled', words: [], candidates: [] });
});

test('change a: a tag of several words that the body uses whole is one word of the pair, spelled as the tag', () => {
  // wu wei came out as wei: the tag is now whole, and the title gives the order.
  const wu = T.topicSlug({ title: 'Negentropic Wu Wei', tags: ['wu-wei'] });
  assert.strictEqual(wu.slug, 'negentropic-wu-wei');
  assert.deepStrictEqual(wu.words, ['negentropic', 'wu-wei']);

  const phrase = T.topicSlug({ tags: ['behavioral science', 'trust'], content_html: '<p>Behavioral science studies trust. Behavioral science again, and trust.</p>' });
  assert.deepStrictEqual(wordsOf(phrase), ['behavioral science', 'trust'], 'the tag is one candidate; its words are none apart from it');
  assert.strictEqual(phrase.slug, 'behavioral-science-trust');

  // A tag the body never uses whole is read as its words, as before.
  const apart = T.topicSlug({ tags: ['glass harbor', 'optics'], content_html: '<p>The glass sits by the harbor. Optics.</p>' });
  assert.deepStrictEqual(wordsOf(apart), ['glass', 'harbor', 'optics']);

  // Where one of its words scores higher than the phrase, the tag takes that score.
  const care = T.topicSlug({ tags: ['care-work', 'labor'], summary: 'Care workers hold the leverage.', content_html: '<p>Care is labor. Care work is care, and care workers care.</p>' });
  assert.strictEqual(care.candidates[0].word, 'care-work');
  assert.ok(!wordsOf(care).includes('care'));
  assert.strictEqual(care.slug, 'care-work-labor');

  // The two words never share a word: blood, a tag of its own, never pairs with blood pressure.
  const blood = T.topicSlug({ tags: ['blood', 'blood pressure', 'sodium'], content_html: '<p>Blood pressure rises with sodium. Blood flows. Blood pressure and blood vessels. Sodium again.</p>' });
  assert.deepStrictEqual(wordsOf(blood).slice(0, 2), ['blood', 'blood pressure']);
  assert.strictEqual(blood.slug, 'blood-sodium');

  // A tag too short for running text is kept; a form word carries a tag of several words.
  assert.strictEqual(T.topicSlug({ title: 'AI Oligarchs Are Driving Without Insurance', tags: ['AI', 'insurance'], summary: 'OpenAI is exempt from liability insurance.' }).slug, 'ai-insurance');
  assert.ok(wordsOf(T.topicSlug({ tags: ['systems-theory', 'philosophy'], content_html: '<p>Systems theory and philosophy. Philosophy of systems theory.</p>' })).includes('systems-theory'));
  // A tag of nothing but stop words is no tag.
  assert.ok(!wordsOf(T.topicSlug({ tags: ['uncovered evidence', 'frogs'], content_html: '<p>Frogs. Uncovered evidence about frogs and fungus.</p>' })).some((w) => /uncovered|evidence/.test(w)));
});

test('change b: verbs and framing words do not win', () => {
  // The Posts piece that came out indigenous-prove: prove was a discovered tag.
  const prove = T.topicSlug({
    title: 'How Footprints in Mud Exposed the Colonial Origins of Archeology',
    tags: ['archaeology', 'colonialism', 'indigenous-history', 'prove'],
    summary: 'Human footprints proved people lived in the Americas 23,000 years ago, exactly when Indigenous people said they did.',
  });
  assert.ok(!/prov/.test(prove.slug), prove.slug);
  assert.ok(!wordsOf(prove).some((w) => /prov/.test(w)));
  // limitations was its only tag.
  const gel = T.topicSlug({
    title: 'Goodbye, cavities? Scientists create gel that could regrow tooth enamel',
    tags: ['limitations'],
    summary: 'A gel could regrow lost tooth enamel, overcoming one of dentistry’s biggest limitations.',
    content_html: 'A gel could regrow lost tooth enamel, overcoming one of dentistry’s biggest limitations. The enamel gel uses saliva minerals.',
  });
  assert.strictEqual(gel.slug, 'gel-enamel');
  assert.ok(!wordsOf(gel).includes('limitations'));
});

test('change c: the pair keeps the order of the strongest zone holding both', () => {
  // The tag holds one of them; the title holds both.
  assert.strictEqual(T.topicSlug({ title: 'Solar Standard', tags: ['standards'] }).slug, 'solar-standards');
  // The tags hold both, and outrank the title.
  assert.strictEqual(T.topicSlug({ title: 'The Dread Signal: My Creative Resistance', tags: ['resistance', 'dread'] }).slug, 'resistance-dread');
  // The summary holds both, and outranks the title...
  const lake = { title: 'Lake pollution in Vermont', tags: ['lake', 'vermont'], summary: 'Pollution of the lake is the story here.', content_html: 'Lake pollution. Pollution of the lake.' };
  assert.strictEqual(T.topicSlug(lake).slug, 'pollution-lake');
  // ...and when the summary holds only one, the title gives the order.
  assert.strictEqual(T.topicSlug({ ...lake, summary: 'Pollution is the story here.' }).slug, 'lake-pollution');
});

// Change d: a tag rosetta-tagz found itself (its every reference discovered or
// emergent) is read as text unless options.foundTags is 'tags'.
const ref = (value, origin) => (origin ? { type: 'tag', value, origin } : { type: 'tag', value });
const glassAndOptics = {
  title: 'Glass and optics',
  summary: 'Optics of glass.',
  content_html: '<p>Glass bends light. The optics of glass. Optics again.</p>',
  tags: ['glass', 'optics'],
  _references: [ref('glass', 'explicit'), ref('optics', 'discovered')],
};
const zonesOf = (r, word) => r.candidates.find((c) => c.word === word).in;

test('change d, by default: a tag rosetta-tagz found is read as text, its words counted only where the text holds them', () => {
  const r = T.topicSlug(glassAndOptics);
  assert.deepStrictEqual(zonesOf(r, 'glass'), ['tags', 'summary', 'title', 'body'], 'the feed wrote glass: the card\'s own tag');
  assert.deepStrictEqual(zonesOf(r, 'optics'), ['summary', 'title', 'body'], 'rosetta-tagz found optics: no tag zone, no tag weight');
  assert.ok(r.candidates[1].score < r.candidates[0].score);
  // The tags hold only glass now, so the summary gives the order.
  assert.strictEqual(r.slug, 'optics-glass');
  // Emergent is found too.
  const emergent = { ...glassAndOptics, _references: [ref('glass', 'explicit'), ref('optics', 'emergent')] };
  assert.deepStrictEqual(zonesOf(T.topicSlug(emergent), 'optics'), ['summary', 'title', 'body']);
  assert.deepStrictEqual(T.topicSlugOptions({}), { foundTags: 'text' });
  assert.deepStrictEqual(T.topicSlugOptions({ cards: { topicSlugFoundTags: 'Tags' } }), { foundTags: 'text' }, 'anything but "tags" reads them as text');
});

test('change d, the switch: foundTags "tags" counts every tag as the card\'s own, as before', () => {
  const r = T.topicSlug(glassAndOptics, null, { foundTags: 'tags' });
  assert.deepStrictEqual(zonesOf(r, 'optics'), ['tags', 'summary', 'title', 'body']);
  assert.strictEqual(r.slug, 'glass-optics');
  assert.deepStrictEqual(T.topicSlugOptions({ cards: { topicSlugFoundTags: 'tags' } }), { foundTags: 'tags' });
  // As if no reference said where a tag came from.
  const items = [glassAndOptics, { title: 'Solar Standard', tags: ['standards'], _references: [ref('standards', 'discovered')] }];
  const unmarked = items.map((it) => ({ ...it, _references: it._references.map((x) => ref(x.value)) }));
  assert.deepStrictEqual(T.topicSlugs(items, { foundTags: 'tags' }), T.topicSlugs(unmarked));
});

test('change d: a tag the piece or its feed wrote is its own, even when rosetta-tagz found it too; so is a tag with no reference', () => {
  const mixed = { ...glassAndOptics, _references: [ref('glass', 'explicit'), ref('optics', 'discovered'), ref('optics', 'explicit')] };
  assert.deepStrictEqual(zonesOf(T.topicSlug(mixed), 'optics'), ['tags', 'summary', 'title', 'body']);
  assert.strictEqual(T.topicSlug(mixed).slug, 'glass-optics');
  // A site without rosetta-tagz: no reference, or a reference that names no origin.
  const none = { ...glassAndOptics, _references: undefined };
  const unmarked = { ...glassAndOptics, _references: [ref('glass'), ref('optics')] };
  assert.deepStrictEqual(zonesOf(T.topicSlug(none), 'optics'), ['tags', 'summary', 'title', 'body']);
  assert.deepStrictEqual(zonesOf(T.topicSlug(unmarked), 'optics'), ['tags', 'summary', 'title', 'body']);
});

test('change d: a card whose every tag rosetta-tagz found is read like a card without tags, and a found tag is never whole', () => {
  const solar = { title: 'Solar Standard', tags: ['standards'], _references: [ref('standards', 'discovered')] };
  assert.deepStrictEqual(T.topicSlug(solar), T.topicSlug({ title: 'Solar Standard' }));
  assert.strictEqual(T.topicSlug(solar).slug, 'solar-standard');
  assert.strictEqual(T.topicSlug(solar, null, { foundTags: 'tags' }).slug, 'solar-standards');
  // An emergent wu-wei is text, and wu is too short for running text.
  const wu = { title: 'Negentropic Wu Wei', tags: ['wu-wei'], _references: [ref('wu-wei', 'emergent')] };
  assert.strictEqual(T.topicSlug(wu).slug, 'negentropic-wei');
  assert.strictEqual(T.topicSlug(wu, null, { foundTags: 'tags' }).slug, 'negentropic-wu-wei');
  // Nor is a found tag counted across the corpus as a whole tag.
  const corpus = [wu, { title: 'Wu wei, again' }];
  assert.strictEqual(T.buildCorpusStats(corpus).df.get('wu wei'), undefined);
  assert.strictEqual(T.buildCorpusStats(corpus, { foundTags: 'tags' }).df.get('wu wei'), 2);
});

test('over a corpus: idf from every card, a pair already taken pairs first and third, then a numeric suffix', () => {
  const same = (id) => ({ id, tags: ['glass', 'optics', 'lens'], content_html: '<p>Glass, glass and glass. Optics and optics. A lens.</p>' });
  const items = [same('a'), same('b'), same('c'), { id: 'd', title: 'Harbor lights', content_html: '<p>Harbor lights at night.</p>' }];
  const stats = T.buildCorpusStats(items);
  assert.strictEqual(stats.N, 4);
  assert.strictEqual(stats.df.get('glass'), 3);
  const out = T.topicSlugs(items);
  assert.deepStrictEqual(out.map((r) => [r.id, r.slug]), [['a', 'glass-optics'], ['b', 'glass-lens'], ['c', 'glass-optics-2'], ['d', 'harbor-lights']]);
  // A whole tag is counted across the corpus by its stems.
  const wholes = T.buildCorpusStats([{ tags: ['wu-wei'] }, { title: 'Wu wei, again' }, { title: 'Nothing here' }]);
  assert.strictEqual(wholes.df.get('wu wei'), 2);
  assert.deepStrictEqual(T.topicSlugs(null), []);
});

test('the same input gives the same output, and the items are left as they were', () => {
  const items = [
    { id: '1', title: 'Negentropic Wu Wei', tags: ['wu-wei'] },
    { id: '2', title: 'Solar Standard', tags: ['standards', 'AI'], _references: [{ type: 'tag', value: 'standards', origin: 'discovered' }, { type: 'tag', value: 'solar power' }] },
    { id: '3', title: 'The Smile at the End of the World', tags: ['care-work', 'labor', 'AGI'], summary: 'Care workers hold the leverage; the AGI project rests on them.' },
  ];
  const before = JSON.stringify(items);
  const once = T.topicSlugs(items);
  assert.deepStrictEqual(T.topicSlugs(items), once);
  assert.deepStrictEqual(T.topicSlugs(JSON.parse(before)), once, 'a copy read back from JSON, as the tool reads feed.json');
  assert.deepStrictEqual(T.topicSlug(items[0]), T.topicSlug(items[0]));
  assert.strictEqual(JSON.stringify(items), before, 'nothing is written into an item, its tags or its references');
});

test('cards.topicSlug: on unless it is false', () => {
  assert.strictEqual(T.topicSlugOn({}), true);
  assert.strictEqual(T.topicSlugOn(null), true);
  assert.strictEqual(T.topicSlugOn({ cards: { topicSlug: true } }), true);
  assert.strictEqual(T.topicSlugOn({ cards: { topicSlug: false } }), false);
  assert.strictEqual(T.topicSlugOn({ cards: { listen: false } }), true);
});

test('the build: items carry topicSlug; cards.topicSlug false leaves them without it; slug the same either way', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-topicslug-'));
  try {
    const put = (rel, text) => {
      fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
      fs.writeFileSync(path.join(root, rel), text);
    };
    const settings = (cards) => JSON.stringify({ site: { title: 'Topic slugs', base_url: 'https://topics.test' }, theme: {}, ...(cards ? { cards } : {}) });
    put('feeds.opml', '<?xml version="1.0"?><opml version="2.0"><head><title>t</title></head><body>'
      + '<outline text="Items" title="Items" type="local" xmlUrl="local://items"/></body></opml>');
    put('items/wu-wei/frontmatter.json', JSON.stringify({ title: 'Negentropic Wu Wei', tags: ['wu-wei'] }));
    put('items/wu-wei/index.md', 'Wu wei is action without forcing.\n');
    put('items/solar/frontmatter.json', JSON.stringify({ title: 'Solar Standard', tags: ['standards'] }));
    put('items/solar/index.md', 'A standard for the sun.\n');
    put('items/gates/frontmatter.json', JSON.stringify({ title: 'Three gates', tags: ['texas', 'election', 'veto'], idea: { tldr: 'Texas after the election: the veto and the vote.', topology: ['state-power'] } }));
    put('items/gates/index.md', 'Texas votes.\n');
    const build = () => {
      const r = spawnSync(process.execPath, [GENERATE], { cwd: root, env: { ...process.env, POSTPIPE_SITE: root }, encoding: 'utf8' });
      assert.strictEqual(r.status, 0, r.stderr || r.stdout);
      return { log: r.stdout, items: JSON.parse(fs.readFileSync(path.join(root, '_site', 'feed.json'), 'utf8')).items };
    };

    put('settings.json', settings(null));
    const on = build();
    const ledger = fs.readFileSync(path.join(root, 'cards.json'), 'utf8');
    assert.strictEqual(on.items.length, 3);
    for (const it of on.items) assert.ok(typeof it.topicSlug === 'string' && it.topicSlug, `${it.title}: ${it.topicSlug}`);
    const topic = Object.fromEntries(on.items.map((it) => [it.title, it.topicSlug]));
    assert.strictEqual(topic['Negentropic Wu Wei'], 'negentropic-wu-wei');
    assert.strictEqual(topic['Solar Standard'], 'solar-standards');
    assert.strictEqual(topic['Three gates'], 'texas-election');
    assert.match(on.log, /topic slugs: 3, the tags rosetta-tagz found read as text/);
    // What the build wrote is what the module gives for the feed it wrote.
    assert.deepStrictEqual(on.items.map((it) => it.topicSlug), T.topicSlugs(on.items).map((r) => r.slug));

    // cards.topicSlugFoundTags reaches the build; without rosetta-tagz no tag
    // was found, so the words are the same.
    put('settings.json', settings({ topicSlugFoundTags: 'tags' }));
    const asTags = build();
    assert.match(asTags.log, /topic slugs: 3, the tags rosetta-tagz found read as tags/);
    assert.deepStrictEqual(asTags.items.map((it) => it.topicSlug), on.items.map((it) => it.topicSlug));

    put('settings.json', settings({ topicSlug: false }));
    const off = build();
    for (const it of off.items) assert.ok(!('topicSlug' in it), it.title);
    assert.match(off.log, /topic slugs: off/);
    assert.deepStrictEqual(off.items.map((it) => [it.title, it.slug, it.slugSource]), on.items.map((it) => [it.title, it.slug, it.slugSource]));
    assert.strictEqual(fs.readFileSync(path.join(root, 'cards.json'), 'utf8'), ledger, 'the cards ledger is untouched');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('tools/topic-slugs.js: one block per card from a path or stdin, --json the same, no file written', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-topicslugs-tool-'));
  try {
    const feed = {
      items: [
        { title: 'Negentropic Wu Wei', tags: ['wu-wei'], slug: 'negentropic_wu-wei', topicSlug: 'wei-negentropic', _source: { title: 'Posts' } },
        { title: 'Solar Standard', tags: ['standards'], _source: { title: 'Posts' } },
      ],
    };
    const p = path.join(dir, 'feed.json');
    fs.writeFileSync(p, JSON.stringify(feed));
    const lines = [];
    assert.strictEqual(tool.run([p], { log: (s) => lines.push(s) }), 0);
    const text = lines.join('\n');
    assert.match(text, /cards: 2/);
    assert.match(text, /Posts: Negentropic Wu Wei\n {2}slug {8}negentropic_wu-wei\n {2}topic slug {2}negentropic-wu-wei {3}\(the feed says wei-negentropic\)\n {2}candidates {2}wu-wei [\d.]+, negentropic [\d.]+/);
    assert.match(text, /Posts: Solar Standard\n {2}slug {8}\(none in this feed\)\n {2}topic slug {2}solar-standards\n/);

    const out = [];
    assert.strictEqual(tool.run(['--json'], { log: (s) => out.push(s), readStdin: () => JSON.stringify(feed), stdinIsTTY: false }), 0);
    const json = JSON.parse(out.join('\n'));
    assert.strictEqual(json.feed, '-');
    assert.deepStrictEqual(json.cards.map((c) => [c.title, c.slug, c.topicSlug]), [['Negentropic Wu Wei', 'negentropic_wu-wei', 'negentropic-wu-wei'], ['Solar Standard', null, 'solar-standards']]);
    assert.strictEqual(json.cards[0].builtTopicSlug, 'wei-negentropic');
    assert.ok(json.cards[0].candidates.length <= 4 && json.cards[0].candidates.every((c) => typeof c.word === 'string' && typeof c.score === 'number'));

    // --found-tags, text by default, as a default build.
    assert.strictEqual(json.foundTags, 'text');
    const found = { items: [{ title: 'Solar Standard', tags: ['standards'], _references: [{ type: 'tag', value: 'standards', origin: 'discovered' }], _source: { title: 'Posts' } }] };
    fs.writeFileSync(p, JSON.stringify(found));
    const asText = [];
    const asTags = [];
    assert.strictEqual(tool.run([p, '--json'], { log: (s) => asText.push(s) }), 0);
    assert.strictEqual(tool.run([p, '--json', '--found-tags', 'tags'], { log: (s) => asTags.push(s) }), 0);
    assert.strictEqual(JSON.parse(asText.join('\n')).cards[0].topicSlug, 'solar-standard');
    assert.strictEqual(JSON.parse(asTags.join('\n')).cards[0].topicSlug, 'solar-standards');
    assert.strictEqual(JSON.parse(asTags.join('\n')).foundTags, 'tags');
    const header = [];
    assert.strictEqual(tool.run([p, '--found-tags', 'text'], { log: (s) => header.push(s) }), 0);
    assert.match(header[0], /found tags read as: text/);
    assert.strictEqual(tool.run([p, '--found-tags', 'both'], { log: () => {} }), 2);
    assert.strictEqual(tool.run([p, '--found-tags'], { log: () => {} }), 2);

    assert.deepStrictEqual(fs.readdirSync(dir), ['feed.json'], 'the tool writes no file');
    assert.strictEqual(tool.run(['--nope'], { log: () => {} }), 2);
    assert.strictEqual(tool.run([], { log: () => {}, stdinIsTTY: true }), 2, 'no path and nothing on stdin');
    assert.strictEqual(tool.run([path.join(dir, 'missing.json')], { log: () => {} }), 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

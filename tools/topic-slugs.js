#!/usr/bin/env node
// Prints every card's topic slug (issue #39, src/lib/topicSlug.js) beside its
// slug, so the words can be judged. Reads one built feed.json, recomputes
// each card's topic slug over all of the feed's cards as the corpus, as the
// build does, and prints one short block per card: its source and title, its
// slug, its topic slug, and the four candidates that came closest with their
// scores. --json writes the same as JSON. It writes no file and reaches no
// network.
//
//   node tools/topic-slugs.js path/to/feed.json [--json] [--found-tags text|tags]
//   node tools/topic-slugs.js --json < path/to/feed.json
//
// --found-tags says how the tags rosetta-tagz found itself (discovered or
// emergent) are read, as the site's cards.topicSlugFoundTags does for its
// build: text (the default, as a default build reads them) or tags. For a
// site that sets it to tags, give --found-tags tags, or the recomputed topic
// slugs will not be the build's.
//
// The topic slug is recomputed, not read, so a feed built before topic slugs,
// or with cards.topicSlug false, prints all the same. When the feed carries a
// topicSlug that differs from the one recomputed (an older engine built it,
// or another --found-tags), the block says so.
'use strict';
const fs = require('fs');
const { topicSlugs } = require('../src/lib/topicSlug');

const USAGE = 'usage: node tools/topic-slugs.js [path/to/feed.json] [--json] [--found-tags text|tags]   (no path: the feed on stdin)';
const FOUND_TAGS = ['text', 'tags'];

function parseArgs(argv) {
  const opt = { json: false, foundTags: 'text', feed: null, error: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opt.json = true;
    else if (a === '--found-tags') {
      const v = argv[++i];
      if (FOUND_TAGS.includes(v)) opt.foundTags = v;
      else opt.error = `--found-tags takes text or tags, got ${v === undefined ? 'nothing' : JSON.stringify(v)}`;
    } else if (a.startsWith('--')) opt.error = `unknown option ${a}`;
    else if (opt.feed) opt.error = `one feed at a time: ${opt.feed} and ${a}`;
    else opt.feed = a;
  }
  return opt;
}

// One record per card, the same for the text and for --json. options as the
// module takes them: { foundTags: 'text' | 'tags' }.
function cardsOf(feed, options = {}) {
  const items = feed && Array.isArray(feed.items) ? feed.items : [];
  const topics = topicSlugs(items, options);
  return items.map((it, i) => {
    const card = {
      source: (it && it._source && (it._source.title || it._source.id)) || '',
      title: it && typeof it.title === 'string' ? it.title : '',
      slug: it && typeof it.slug === 'string' ? it.slug : null,
      topicSlug: topics[i].slug,
      candidates: topics[i].candidates.slice(0, 4).map((c) => ({ word: c.word, score: c.score })),
    };
    if (it && typeof it.topicSlug === 'string' && it.topicSlug !== card.topicSlug) card.builtTopicSlug = it.topicSlug;
    return card;
  });
}

function blockOf(card) {
  const lines = [
    `${card.source || '(no source)'}: ${card.title || '(untitled)'}`,
    `  slug        ${card.slug || '(none in this feed)'}`,
    `  topic slug  ${card.topicSlug}${card.builtTopicSlug ? `   (the feed says ${card.builtTopicSlug})` : ''}`,
    `  candidates  ${card.candidates.map((c) => `${c.word} ${c.score}`).join(', ') || '(none)'}`,
  ];
  return lines.join('\n');
}

// readStdin and stdinIsTTY are given by the tests; by default, this process's.
function run(argv, { log = console.log, readStdin = () => fs.readFileSync(0, 'utf8'), stdinIsTTY = process.stdin.isTTY } = {}) {
  const opt = parseArgs(argv);
  if (opt.error) {
    log(opt.error);
    log(USAGE);
    return 2;
  }
  if (!opt.feed && stdinIsTTY) {
    log(USAGE);
    return 2;
  }
  let feed;
  try {
    feed = JSON.parse(opt.feed ? fs.readFileSync(opt.feed, 'utf8') : readStdin());
  } catch (err) {
    log(`cannot read ${opt.feed || 'the feed on stdin'}: ${err.message}`);
    return 1;
  }
  const cards = cardsOf(feed, { foundTags: opt.foundTags });
  if (opt.json) {
    log(JSON.stringify({ feed: opt.feed || '-', foundTags: opt.foundTags, cards }, null, 2));
    return 0;
  }
  log(`feed: ${opt.feed || '(stdin)'}  cards: ${cards.length}  found tags read as: ${opt.foundTags}`);
  for (const card of cards) log(`\n${blockOf(card)}`);
  return 0;
}

module.exports = { parseArgs, cardsOf, blockOf, run };

if (require.main === module) process.exitCode = run(process.argv.slice(2));

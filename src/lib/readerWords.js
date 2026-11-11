// readerWords.js — how much of each card the reader shows before the next
// one, as it scrolls. Harold, 2026-11-10: "also the user should have the
// option, in reader view, or flow, to choose how much text they want to see
// as they scroll. by default they should see about 100 words before they see
// the next thing."
//
// The choice (the reading aid 'words', and the site's reader.words, both
// provisional):
//
//   50, 100, 250, 500  each card shows about that many words, then the next
//                      card follows beneath it in the same scroll;
//   'whole'            each card shows whole, and the next follows it, whole;
//   'one'              one card at a time, the reader as it was before: the
//                      open card whole, no cards beneath it.
//
// The reader's own choice wins, then the site's, then 100.
//
// The cut, "about N words": the words are counted through the card's text in
// document order (a word is a run of non-space characters holding a letter
// or a digit); the excerpt ends at the end of the sentence that holds the Nth
// word, and never past the end of the block (a paragraph, a list item, a
// heading...) that holds it. A period after Mr, Mrs, Ms, Dr, St, Jr, Sr, vs,
// etc, e.g or i.e, or after a single capital letter (an initial), ends no
// sentence. When what would be left is short (under 15 words, or under 15%
// of N), nothing is cut. The counting and the sentence ends are pure, on
// strings (planCut, sentenceEnd); excerptHtml applies them to HTML with a
// DOM Range, so an element the cut passes through stays well formed.
//
// The cards beneath the open one are the cards Next would visit in turn
// (followingCards, through readerNav's step), and, at the end, one that
// cannot be read yet, shown by its title and status as the nav row shows it.

const { step, neighbours, isReadable } = require('./readerNav');

const WORDS_CHOICES = [50, 100, 250, 500, 'whole', 'one'];
const DEFAULT_WORDS = 100;

// How many following cards the reader adds at a time.
const FOLLOW_STEP = 5;

// Nothing is cut when fewer words than this would be left, or fewer than
// this share of N.
const MIN_LEFT_WORDS = 15;
const MIN_LEFT_SHARE = 0.15;

function isWordsChoice(v) {
  return WORDS_CHOICES.includes(v);
}

// settings.reader.words (provisional): the site's choice, else null.
function siteWords(settings) {
  const v = settings && settings.reader && settings.reader.words;
  return isWordsChoice(v) ? v : null;
}

// The choice in force: the reader's own (aid, the reading aid 'words' from
// viewState) when it is one of the choices, else the site's when it is one,
// else 100.
function wordsChoice(settings, aid) {
  if (isWordsChoice(aid)) return aid;
  const site = siteWords(settings);
  return site !== null ? site : DEFAULT_WORDS;
}

// ── Counting ────────────────────────────────────────────────────────────────

const HAS_LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

// The words of a text, as [start, end) offsets.
function wordSpans(text) {
  const out = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(String(text || '')))) {
    if (HAS_LETTER_OR_DIGIT.test(m[0])) out.push([m.index, m.index + m[0].length]);
  }
  return out;
}

function countWords(text) {
  return wordSpans(text).length;
}

// ── Sentence ends ───────────────────────────────────────────────────────────

const ABBREVIATIONS = new Set(['mr', 'mrs', 'ms', 'dr', 'st', 'jr', 'sr', 'vs', 'etc', 'e.g', 'i.e']);
const OPENERS = /^["'“‘«‹(\[{]+/;
// Sentence-ending marks, then any closing quotes or brackets, then a space or
// the end of the text.
const SENTENCE_END = /[.!?…]+["'”’»›)\]}]*(?=\s|$)/g;

// Whether the single period at `at` follows an abbreviation or an initial,
// and so ends no sentence.
function periodEndsNothing(text, at) {
  let s = at;
  while (s > 0 && !/\s/.test(text[s - 1])) s--;
  const token = text.slice(s, at).replace(OPENERS, '');
  if (/^\p{Lu}$/u.test(token)) return true;
  return ABBREVIATIONS.has(token.toLowerCase());
}

// The offset just past the end of the first sentence that ends at or after
// `from` (its marks and any closing quotes or brackets), or the text's
// length when no sentence ends there.
function sentenceEnd(text, from) {
  const t = String(text || '');
  const re = new RegExp(SENTENCE_END.source, 'g');
  re.lastIndex = Math.max(0, from || 0);
  let m;
  while ((m = re.exec(t))) {
    const marks = m[0].match(/^[.!?…]+/)[0];
    if (marks === '.' && periodEndsNothing(t, m.index)) continue;
    return m.index + m[0].length;
  }
  return t.length;
}

// ── The cut ─────────────────────────────────────────────────────────────────

// segments: the text of a card in document order, [{ text, block }], one per
// text node, block naming the block element that holds it (equal values are
// the same block). n: about how many words to keep.
//
// Gives null when nothing is cut (n is not a number, the text has no more
// than n words, or what would be left is short), else { seg, offset, runEnd,
// kept, left }: the cut falls in segments[seg] at offset (everything before
// it is kept); runEnd says the cut is at the end of the block's text; kept
// and left are the words before and after it.
function planCut(segments, n) {
  if (typeof n !== 'number' || !(n > 0) || !Array.isArray(segments) || !segments.length) return null;
  // The segments joined as written (a word may run across two), a line break
  // between blocks; a run is the stretch of one block's text.
  let text = '';
  const starts = [];
  const runs = [];
  segments.forEach((seg, i) => {
    if (i === 0 || seg.block !== segments[i - 1].block) {
      if (runs.length) { runs[runs.length - 1].end = text.length; text += '\n'; }
      runs.push({ start: text.length, end: text.length });
    }
    starts.push(text.length);
    text += String(seg.text || '');
  });
  runs[runs.length - 1].end = text.length;

  const words = wordSpans(text);
  if (words.length <= n) return null;
  const nth = words[n - 1];
  const run = runs.find((r) => nth[0] >= r.start && nth[0] < r.end);
  if (!run) return null;
  const end = run.start + sentenceEnd(text.slice(run.start, run.end), nth[0] - run.start);
  const left = words.filter((w) => w[0] >= end).length;
  if (left < MIN_LEFT_WORDS || left < MIN_LEFT_SHARE * n) return null;

  // The segment the cut falls in: the first of the run's that reaches it.
  for (let i = 0; i < segments.length; i++) {
    const len = String(segments[i].text || '').length;
    if (starts[i] >= run.start && starts[i] <= end && end <= starts[i] + len) {
      return { seg: i, offset: end - starts[i], runEnd: end === run.end, kept: words.length - left, left };
    }
  }
  return null;
}

// A plain text cut at about n words, for one block or several (an array of
// strings, one per block): the text kept, or null when nothing is cut.
function excerptText(text, n) {
  const blocks = Array.isArray(text) ? text : [text];
  const segments = blocks.map((t, i) => ({ text: String(t || ''), block: i }));
  const plan = planCut(segments, n);
  if (!plan) return null;
  const kept = blocks.slice(0, plan.seg).map(String);
  kept.push(String(blocks[plan.seg]).slice(0, plan.offset));
  return kept.join('\n');
}

// ── The cut on HTML ─────────────────────────────────────────────────────────

const BLOCK_TAGS = new Set([
  'P', 'LI', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE', 'FIGCAPTION', 'DT', 'DD', 'TD', 'TH',
  'DIV', 'SECTION', 'ARTICLE', 'ASIDE', 'HEADER', 'FOOTER', 'MAIN', 'NAV', 'FIGURE', 'UL', 'OL', 'DL',
  'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'CAPTION', 'DETAILS', 'SUMMARY', 'ADDRESS', 'FORM', 'FIELDSET',
]);
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'SVG', 'MATH']);

// The nearest block element holding a node, else the root.
function blockOf(node, root) {
  for (let el = node.parentNode; el && el !== root; el = el.parentNode) {
    if (el.nodeType === 1 && BLOCK_TAGS.has(String(el.tagName).toUpperCase())) return el;
  }
  return root;
}

// Cut the content of root (an element) at about n words. Gives the excerpt's
// HTML, or null when nothing is cut. root is left as it was. The reader's
// own link out to a publisher's piece ([data-reader-link-out]) counts no
// words and follows the excerpt.
function cutElement(root, n) {
  if (!root || typeof n !== 'number') return null;
  const doc = root.ownerDocument;
  const nodes = [];
  const segments = [];
  const walk = (el) => {
    for (let c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) {
        if (c.nodeValue) { nodes.push(c); segments.push({ text: c.nodeValue, block: blockOf(c, root) }); }
      } else if (c.nodeType === 1) {
        const tag = String(c.tagName).toUpperCase();
        // A line break parts two words, as the voice reads it.
        if (tag === 'BR') { nodes.push(c); segments.push({ text: ' ', block: blockOf(c, root) }); continue; }
        if (SKIP_TAGS.has(tag) || c.hasAttribute('data-reader-link-out')) continue;
        walk(c);
      }
    }
  };
  walk(root);
  const plan = planCut(segments, n);
  if (!plan) return null;

  const range = doc.createRange();
  range.setStart(root, 0);
  const at = nodes[plan.seg];
  const block = segments[plan.seg].block;
  const lastOfBlock = plan.runEnd && block !== root
    && !nodes.slice(plan.seg + 1).some((nd) => block.contains(nd));
  if (lastOfBlock) range.setEndAfter(block);
  else if (at.nodeType === 1) range.setEndAfter(at);
  else range.setEnd(at, plan.offset);
  const box = doc.createElement('div');
  box.appendChild(range.cloneContents());
  const out = root.querySelector('[data-reader-link-out]');
  if (out && !box.querySelector('[data-reader-link-out]')) box.appendChild(out.cloneNode(true));
  return { html: box.innerHTML, kept: plan.kept, left: plan.left };
}

// The excerpt of a card's HTML at about n words: { html, kept, left }, or
// null when nothing is cut. doc: the document to read the HTML in; by
// default a new one from the browser's DOMParser, which loads nothing.
function excerptHtml(html, n, doc) {
  if (!html || typeof n !== 'number') return null;
  const d = doc || (typeof DOMParser !== 'undefined' ? new DOMParser().parseFromString('', 'text/html') : null);
  if (!d) return null;
  const root = d.createElement('div');
  root.innerHTML = String(html);
  if (d.body) d.body.appendChild(root);
  try {
    return cutElement(root, n);
  } finally {
    if (root.parentNode) root.parentNode.removeChild(root);
  }
}

// Images that load only as they come near the screen (a following card's).
function lazyImages(html) {
  return String(html || '').replace(/<img\b(?![^>]*\bloading\s*=)/gi, '<img loading="lazy"');
}

// ── The open card's progress ────────────────────────────────────────────────

// How far through the open card the reader is, 0..1, in a choice that is a
// scroll: the card is measured alone, from the top of its header (start) to
// the end of its text (end), in the scroll's own coordinates, as the whole
// scroll is measured when the reader shows one card at a time: 0 at its top,
// 1 once its end is in view, 1 for a card shorter than the view.
function cardProgress({ scrollTop, clientHeight, start, end }) {
  const room = (end - start) - clientHeight;
  if (!(room > 0)) return 1;
  return Math.max(0, Math.min(1, (scrollTop - start) / room));
}

// The scroll that puts the reader back at a fraction of the open card, or
// null when the card is no taller than the view.
function cardScrollFor(at, { clientHeight, start, end }) {
  const room = (end - start) - clientHeight;
  if (!(room > 0)) return null;
  return start + at * room;
}

// ── The cards beneath ───────────────────────────────────────────────────────

// The cards Next would visit in turn from the card id, up to count: step()
// from id, then from that card, and so on, stopping at a card already listed.
// Where Next has nowhere to go but the nav row shows a card that cannot be
// read yet, that card ends the list. opts as for readerNav (a flow's order).
function followingCards(feed, id, opts, count = FOLLOW_STEP) {
  const out = [];
  const seen = new Set([id]);
  let at = id;
  while (out.length < count) {
    const item = step(feed, at, 'next', opts);
    if (item) {
      if (seen.has(item.id)) break;
      seen.add(item.id);
      out.push(item);
      at = item.id;
      continue;
    }
    const locked = neighbours(feed, at, opts).next.find((it) => !isReadable(it) && !seen.has(it.id));
    if (locked) out.push(locked);
    break;
  }
  return out;
}

module.exports = {
  WORDS_CHOICES, DEFAULT_WORDS, FOLLOW_STEP,
  isWordsChoice, siteWords, wordsChoice,
  wordSpans, countWords, sentenceEnd, planCut, excerptText,
  cutElement, excerptHtml, lazyImages,
  cardProgress, cardScrollFor,
  followingCards,
};

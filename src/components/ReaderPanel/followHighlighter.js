// The follow-along highlighter: the sentence, and the word, under a finger or
// pointer in the reader. It never changes the text. Where the browser has the
// CSS Custom Highlight API the marks are ranges painted by ::highlight();
// elsewhere the whole paragraph is tinted instead.
//
// Like the voice's highlight, it is ambient: it marks the place, it never
// scrolls or moves anything.

import { spanAt } from '../../lib/followAlong';

const BLOCKS = 'p, li, blockquote, h1, h2, h3, h4, h5, h6, dd, dt, figcaption, td, th';
const SENTENCE = 'pp-follow-sentence';
const WORD = 'pp-follow-word';
const FALLBACK_CLASS = 'pp-follow-block';

const hasHighlights = () => typeof CSS !== 'undefined' && CSS.highlights && typeof Highlight !== 'undefined';

function caretAt(x, y) {
  if (document.caretPositionFromPoint) {
    const p = document.caretPositionFromPoint(x, y);
    if (p && p.offsetNode) return { node: p.offsetNode, offset: p.offset };
  }
  if (document.caretRangeFromPoint) {
    const r = document.caretRangeFromPoint(x, y);
    if (r) return { node: r.startContainer, offset: r.startOffset };
  }
  return null;
}

// The block's text nodes in order, skipping anything the reader drew into it
// (the bookmark ribbon).
function textNodesOf(block) {
  const out = [];
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const el = n.parentElement;
      if (el && el.closest('.bookmarkRibbon, [aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let n;
  while ((n = walker.nextNode())) out.push(n);
  return out;
}

function rangeFor(nodes, starts, s, e) {
  const find = (pos, isEnd) => {
    for (let i = 0; i < nodes.length; i++) {
      const len = nodes[i].nodeValue.length;
      if (pos < starts[i] + len || (isEnd && pos === starts[i] + len)) return [nodes[i], pos - starts[i]];
    }
    const last = nodes[nodes.length - 1];
    return [last, last.nodeValue.length];
  };
  const r = document.createRange();
  const [sn, so] = find(s, false);
  const [en, eo] = find(e, true);
  r.setStart(sn, so);
  r.setEnd(en, eo);
  return r;
}

export function clearFollow(body) {
  if (hasHighlights()) {
    CSS.highlights.delete(SENTENCE);
    CSS.highlights.delete(WORD);
  }
  if (body) {
    body.querySelectorAll('.' + FALLBACK_CLASS).forEach((el) => el.classList.remove(FALLBACK_CLASS));
    delete body.dataset.followSentence;
    delete body.dataset.followWord;
  }
}

// Highlight the sentence and word at screen point (x, y) inside body. Returns
// the text marked, or null when the point is not on text.
export function followAt(body, x, y) {
  const caret = caretAt(x, y);
  if (!caret || !body.contains(caret.node)) return null;
  const start = caret.node.nodeType === 3 ? caret.node.parentElement : caret.node;
  const block = start && start.closest(BLOCKS);
  if (!block || !body.contains(block)) return null;
  const nodes = textNodesOf(block);
  if (!nodes.length) return null;
  const starts = [];
  let text = '';
  let offset = null;
  for (const n of nodes) {
    starts.push(text.length);
    if (n === caret.node) offset = text.length + caret.offset;
    text += n.nodeValue;
  }
  if (offset === null) return null;
  const hit = spanAt(text, offset);
  if (!hit) return null;

  clearFollow(body);
  const sentence = text.slice(hit.sentence[0], hit.sentence[1]);
  const word = hit.word ? text.slice(hit.word[0], hit.word[1]) : '';
  if (hasHighlights()) {
    CSS.highlights.set(SENTENCE, new Highlight(rangeFor(nodes, starts, hit.sentence[0], hit.sentence[1])));
    if (hit.word) CSS.highlights.set(WORD, new Highlight(rangeFor(nodes, starts, hit.word[0], hit.word[1])));
  } else {
    block.classList.add(FALLBACK_CLASS);
  }
  body.dataset.followSentence = sentence;
  body.dataset.followWord = word;
  return { sentence, word };
}

// Tap or drag through the text: the mark follows. A vertical drag on a touch
// screen still scrolls (the body is touch-action: pan-y while following), so
// the mark stays where that drag began.
export function attachFollowAlong(body) {
  let tracking = false;
  let frame = 0;
  let last = null;
  const paint = () => { frame = 0; if (last) followAt(body, last.x, last.y); };
  const queue = (e) => {
    last = { x: e.clientX, y: e.clientY };
    if (!frame) frame = requestAnimationFrame(paint);
  };
  const down = (e) => {
    if (e.button > 0) return;
    if (e.target.closest && e.target.closest('a, button, input, select, textarea')) return;
    tracking = true;
    queue(e);
  };
  const move = (e) => { if (tracking) queue(e); };
  const up = () => { tracking = false; };
  body.addEventListener('pointerdown', down);
  body.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  return () => {
    if (frame) cancelAnimationFrame(frame);
    body.removeEventListener('pointerdown', down);
    body.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    clearFollow(body);
  };
}

// titleNucleus — reduce a title to the few words that carry it.
//
// A graph zoomed out far enough has room for two words per node, not twelve.
// Shrinking the title to fit is the wrong move: at that size the text is
// unreadable and the node is a smudge. The right move is to show *less text at
// a readable size*, which means deciding which words survive.
//
// The reduction is deterministic and runs at build time, so the viewer pays
// nothing at render and the same title always reduces the same way. An authored
// short_title always wins — the writer's own compression beats any heuristic.
//
// This is the no-key path. With a BYO-AI key configured, a model can refine
// these later; the feature works without one rather than disappearing.

// Words that almost never carry a title. Deliberately conservative: dropping a
// word that mattered is worse than keeping one that did not.
const STOP = new Set([
  'a', 'an', 'the',
  'and', 'or', 'but', 'nor', 'so', 'yet',
  'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'into', 'onto',
  'over', 'under', 'about', 'as', 'than', 'that', 'this', 'these', 'those',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
  'has', 'have', 'had', 'do', 'does', 'did',
  'it', 'its', 'their', 'his', 'her', 'our', 'your', 'my',
  'we', 'they', 'you', 'he', 'she', 'who', 'whom', 'which',
  'not', 'no', 'up', 'out', 'off', 'if', 'then', 'when', 'while', 'after',
  'before', 'during', 'via', 'per', 'vs', 'versus',
]);

// Split on whitespace, keep internal hyphens and apostrophes, drop surrounding
// punctuation. "U.S." survives as one token; "Star," loses the comma.
function tokenize(title) {
  return String(title || '')
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}.]+$/gu, ''))
    .filter(Boolean);
}

function isStop(word) {
  const bare = word.toLowerCase().replace(/\.$/, '');
  return STOP.has(bare) || CONTRACTIONS.has(bare);
}

// A capitalized word is usually a name, a place or an organization. In a
// Title Case headline everything is capitalized so the signal washes out, which
// is fine — it washes out evenly and the other scores decide.
function looksProper(word) {
  return /^[\p{Lu}]/u.test(word);
}

// Contractions are dropped outright rather than merely penalised. Left in the
// pool they poison whatever window they land in — "Art Isn't" and "Isn't Magic"
// are both worse than the "Art Magic" that dropping the contraction reveals.
const CONTRACTIONS = new Set([
  "isn't", "it's", "don't", "can't", "won't", "that's", "there's", "we're",
  "you're", "they're", "i'm", "he's", "she's", "didn't", "doesn't", "wasn't",
  "weren't", "aren't", "hasn't", "haven't", "wouldn't", "couldn't", "shouldn't",
  "let's", "we've", "you've", "they've", "i've",
]);

// Real words that simply carry little in a two-word label. Penalised, not
// dropped: sometimes they are all a title has.
const WEAK = new Set(['says', 'said', 'new', 'now', 'more', 'most', 'us', 'got']);

function wordScore(word, indexInTitle, titleLength) {
  const bare = word.toLowerCase().replace(/[.]$/, '');
  let score = 1;
  if (WEAK.has(bare)) score -= 0.8;
  if (looksProper(word)) score += 0.5;
  score += Math.min(bare.length, 12) / 20;
  // Headlines front-load, but only mildly — enough to break ties toward the
  // subject rather than the object.
  score += Math.max(0, 1 - indexInTitle / Math.max(1, titleLength)) * 0.6;
  return score;
}

/**
 * @param {string} title
 * @param {number} n            how many words to keep
 * @returns {string}            a contiguous run of n content words
 *
 * Contiguous on purpose. Picking the n highest-scoring words scattered through
 * a headline produces things like "Isn't Complexity" — each word defensible,
 * the pair meaningless. Real shortened titles are phrases, so the choice is
 * which phrase, not which words.
 */
function nucleus(title, n = 2) {
  const words = tokenize(title);
  if (!words.length) return '';
  if (words.length <= n) return words.map(clean).join(' ');

  const pool = words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => !isStop(word));

  // Fewer content words than asked for: return what there is. Padding back out
  // with the stopwords and contractions we just removed would trade a good
  // three-word label for a bad four-word one.
  if (!pool.length) return words.slice(0, n).map(clean).join(' ');
  if (pool.length <= n) return pool.map(({ word }) => clean(word)).join(' ');

  let best = null;
  for (let i = 0; i + n <= pool.length; i++) {
    const window = pool.slice(i, i + n);
    const score = window.reduce(
      (sum, { word, index }) => sum + wordScore(word, index, words.length),
      0,
    );
    if (!best || score > best.score) best = { score, window };
  }

  return best.window.map(({ word }) => clean(word)).join(' ');
}

// Trailing sentence punctuation is noise in a label; a period inside an
// abbreviation like "U.S." is not.
function clean(word) {
  return /^[\p{L}]\.([\p{L}]\.)+$/u.test(word) ? word : word.replace(/[.,;:!?]+$/, '');
}

/**
 * The label ladder for one item, shortest first. An authored short_title is
 * used verbatim wherever it already fits the budget.
 *
 * @returns {{ short: string, medium: string, full: string }}
 */
function labelLadder(item, { shortWords = 2, mediumWords = 4 } = {}) {
  const full = String(item.title || '').trim();
  const authored = String(item.short_title || '').trim();
  const authoredWords = authored ? tokenize(authored).length : 0;

  // One word of slack on an authored title. "Act or Ask" is three words against
  // a budget of two, and reducing it gives "Act Ask" — the budget enforced at
  // the cost of the thing it was protecting. A writer who already compressed a
  // title to three words meant those three words.
  const fits = (budget) => authored && authoredWords <= budget + 1;

  return {
    short: fits(shortWords) ? authored : nucleus(authored || full, shortWords),
    medium: fits(mediumWords) ? authored : nucleus(authored || full, mediumWords),
    full: full || authored,
  };
}

module.exports = { nucleus, labelLadder, tokenize };

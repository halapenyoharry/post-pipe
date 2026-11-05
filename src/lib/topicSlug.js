// topicSlug.js — the literal best two words for what a card is about (#39).
//
// A card's slug (cardSlug.js) is its identity: discovered, frozen in the
// cards ledger, never changed. Its topic slug stands beside it and never in
// its place: the words that say what the piece is about, so a poetic or
// metaphorical title keeps its slug and the subject is still said plainly
// ("Three gates: Texas after the 2026 election" -> texas-election).
//
// The words sit where two sets meet:
//   the subject set, what the card says it is about: its subtitle, tags,
//     topology (and lineage) and summary (or tldr); with no subtitle, tag or
//     topology, its title, summary and the opening of its body (metadata is
//     a gradient, not a gate);
//   the body set, what its text spends its words on: its body (text, body,
//     content_html or content_text) with markup and inline SVG stripped, or,
//     for a card that carries no body (a local piece's text is its own page,
//     not in feed.json), everything it does carry.
// Each candidate in both is scored
//   (1 + ln tf) x idf x boost
// tf its count in the body set; idf = ln((N + 1) / (df + 0.5)) + 1 over the
// N cards given as the corpus (1 for a card alone); boost 2.2 for a tag, 2.0
// for the subtitle, 1.4 for topology and 1.3 for the summary, multiplied for
// each it is in. The best two make the topic slug. Over a corpus
// (topicSlugs), a card whose pair another card already took pairs its first
// with its third, else takes a numeric suffix (-2, -3).
//
// That is the issue's code. Three changes since (T49, 2026-11-05):
//   a. A tag stays whole. A tag of several words that the body uses whole
//      (wu-wei, behavioral science) is one word of the pair, spelled as the
//      tag spells it, so a topic slug may have more than two parts
//      (negentropic-wu-wei). Its words are then no candidates apart from it,
//      unless one is a tag of its own; where one of them scores higher than
//      the phrase (care in care workers, for the tag care-work), the whole
//      tag takes that score, so a tag never costs a card its strongest word.
//      The two words of a pair never share a word. A tag too short for
//      running text (AI) is kept whole as well: the three-letter floor is
//      for running text, not for tags.
//   b. Verbs and framing words do not win. Beside the issue's stop words:
//      common English verbs in their forms (prove, delivered), words that
//      frame a claim, a study or a story rather than name a subject
//      (limitations, evidence, researchers), the stubs a contraction leaves
//      (doesn), and a few function words the issue's list misses (not, ago).
//      Generic English only: nothing about one site, author or corpus
//      belongs in these lists.
//   c. The two words keep the order the subject uses: the order they first
//      appear in, in the strongest zone holding both, the zones ranked
//      subtitle, tags, topology, summary, title, body (the issue's order of
//      the subject set, then the title and the body).
// And HTML entities (&nbsp;, &amp;, &#8217;) are read as the characters they
// stand for, so none of them is ever a word.
//
// Nothing here is frozen. idf and the suffixes depend on the corpus, so a
// card's topic slug may change from one build to the next as the cards
// around it change. The build (generate-index.js) writes it on every item as
// topicSlug (provisional) and keeps it out of the cards ledger.
//
// Pure, CommonJS, no dependency but cardSlug's slugify; it never imports
// rosetta-tagz/lib/. It reads a card's tags and its tag references
// (_references) and writes nothing into them.
//
// Exports:
//   topicSlug(item, corpusStats?) -> { slug, words, candidates }
//   topicSlugs(items)             -> Array<{ id, slug, words, candidates }>
//   buildCorpusStats(items)       -> { N, df }
//   topicSlugOn(settings)         -> settings.cards.topicSlug !== false
//   tokenize(text), stem(word)

const { slugify } = require('./cardSlug');

// The issue's stop words, as it gave them.
const STOP = new Set(`a about above across after again against all almost alone along already also although always
am among amongst an and another any anybody anyone anything anywhere apart appear appearing appears around as ask
asking asks at atop back be became because become becomes becoming been before began begin beginning begins behind
being below beneath beside besides between beyond both bring bringing brings brought build building builds built
but by call called calling calls came can cannot could did do does doing done dont down during each early either
else elsewhere end ending ends enough entirely especially etc even eventually ever every everybody everyone everything
everywhere except fairly far few find finding finds first firstly follow following follows for found four from full
fully further furthermore gave general generally get getting gets give given gives giving go goes going gone got
had has have having he help helped helping helps her here hers herself high higher highest him himself his hold
holding holds how however i if important in include included includes including indeed initial initially inside
instead into is it its itself just keep keeping keeps kept know known knows large largely last lastly late later
latest least leave leaving leaves left less let lets letting like likely little live lived lives living long longer
longest look looked looking looks lot lots made mainly make makes making many may maybe me mean meanwhile might
mine minus more moreover most mostly much must my myself namely near nearly neither never nevertheless next no
nobody none nonetheless nor notably nothing notwithstanding now nowhere obtain obtained obtaining obtains of off
offer offered offering offers often on once one ones oneself only onto open opened opening opens opposite or other
others otherwise our ours ourselves out outside over overall own part particularly past people per perhaps place
placed places placing plus point pointed pointing points possible possibly potential potentially pretty previous
previously probable probably provide provided provides providing put puts putting quite rather reach reached
reaches reaching read reading reads real really recent recently refer referred referring refers regard regarding
regards relate related relates relating relative relatively remain remained remaining remains replace replaced
replaces replacing report reported reportedly reporting reports represent represented representing represents
require required requires requiring respectively result resulted resulting results reveal revealed revealing
reveals right room round roughly run running runs said same saw say saying says second secondly see seeing seem
seemed seeming seems seen sees seldom send sending sends sent several shall she should show showed showing shown
shows side significant significantly similar similarly simple simply since small smaller smallest so some somebody
someone something sometime sometimes somewhat somewhere soon specifically start started starting starts
state stated states stating stay stayed staying stays still study studies such suggest suggested suggesting
subjects suggests sure surely take taken takes taking tell telling tells than that the their theirs them themselves
then there therefore these they thing things think thinking thinks third this those though three through throughout
thus till time times to today together too took toward towards tried tries true truly try trying turn turned
turning turns two typical typically under underneath unless unlike until unto up upon us use used uses using usual
usually various very via virtually want wanted wanting wants was way ways we week weeks well were what whatever
when whenever where whereas wherever whether which while whilst who whoever whole wholly whom whomever whose why
will with within without word words work worked working works would write writes writing written year years yet
you your yours yourself yourselves`.split(/\s+/));

// Generic document/archive meta-words that describe form rather than topic.
const ARCHIVE_META = new Set([
  'paper', 'papers', 'zpaper', 'zpapers', 'whitepaper', 'whitepapers',
  'article', 'articles', 'essay', 'essays', 'post', 'posts', 'chapter', 'chapters',
  'section', 'sections', 'figure', 'figures', 'table', 'tables',
  'model', 'models', 'system', 'systems', 'human', 'humans', 'machine', 'machines',
  'collaboration', 'argument', 'analysis', 'theory', 'theories',
  'book', 'books', 'press', 'university', 'edition', 'volume',
  'living', 'document', 'documents', 'version', 'versions', 'draft',
  'http', 'https', 'www', 'org', 'com', 'edu', 'net', 'html', 'htm', 'pdf', 'svg',
]);

// (b) Common English verbs in their forms, beside those STOP holds. A verb
// that as often names a subject is left out (act, care, change, cover, fear,
// play, power, support, test, vote), or only the forms that rarely do are
// in (acting, covered, feared, tested): a verb missed here costs a weaker
// pair, a subject wrongly here costs the subject.
const VERBS = new Set(`accept accepted accepting accepts according achieve achieved achieves achieving acted acting add added
adding adds affect affected affecting affects agree agreed agreeing agrees allow allowed allowing allows analyse
analysed analysing analyze analyzed analyzes analyzing announce announced announces announcing appeared apply applied
applies applying argue argued argues arguing arrive arrived arrives arriving asked associated assume assumed assumes
assuming attempt attempted attempting attempts avoid avoided avoiding avoids based begun believe believed believes
believing belong belonged belonging belongs boost boosted boosting boosts bought break breaking breaks broke broken buy
buying buys carried carries carry carrying catch catches catching caught cause caused causes causing choose chooses
choosing chose chosen claim claimed claiming claims close closed closes closing come comes coming compare compared
compares comparing concern concerned concerning concerns confirm confirmed confirming confirms consider considered
considering considers consume consumed consumes consuming contain contained containing contains continue continued
continues continuing covered covering create created creates creating decide decided decides deciding deliver delivered delivering
delivers demonstrate demonstrated demonstrates demonstrating depend depended depending depends describe described
describes describing detect detected detecting detects determine determined determines determining develop developed
developing develops discover discovered discovering discovers discuss discussed discusses discussing draw drawn draws
drew emerge emerged emerges emerging enable enabled enables enabling ensure ensured ensures ensuring establish
established establishes establishing evolve evolved evolves evolving examine examined examines examining exist existed
existing exists expect expected expecting expects explain explained explaining explains explore explored explores
exploring express expressed expresses expressing extend extended extending extends feared fearing feel feels felt
focus focused focuses focusing followed gain gained gaining gains generate generated generates generating gotten grew
grow growing grown grows happen happened happening happens hear heard hearing hears held hit hits hitting identified
identifies identify identifying improve improved improves improving increase increased increases increasing indicate
indicated indicates indicating install installed installing installs interact interacted interacting interacts
introduce introduced introduces introducing invent invented inventing invents investigate investigated investigates
investigating involve involved involves involving join joined joining joins knew knowing lack lacked lacking lacks
learn learned learns learnt linked lose loses losing lost maintain maintained maintaining maintains manage managed
manages managing mattered matters means meant meet meets met move moved moves moving need needed needing needs occur
occurred occurring occurs pass passed passes passing predict predicted predicting predicts prepare prepared prepares
preparing present presented presenting presents preserve preserved preserves preserving prevent prevented preventing
prevents produce produced produces producing propose proposed proposes proposing protect protected protecting protects
prove proved proven proves proving publish published publishes raise raised raises raising ran realise realised
realises realising realize realized realizes realizing receive received receives receiving recognise recognised
recognises recognising recognize recognized recognizes recognizing recreate recreated recreates recreating reduce
reduced reduces reducing reflect reflected reflecting reflects release released releases releasing remember remembered
remembering remembers remove removed removes removing repeat repeated repeating repeats respond responded responding
responds return returned returning rewrite rewrites rewriting rewritten rewrote seek seeking seeks sell selling sells
serve served serves serving set sets setting share shared shares sharing sold solve solved solves solving sought speak
speaking speaks spend spends spent spoke spoken stand standing stands stood stop stopped stopping stops studied
studying succeed succeeded succeeding succeeds talk talked talking talks tend tended tending tends tested thought told
trigger triggered triggering triggers uncover uncovered uncovering uncovers understand understanding understands
understood unlock unlocked unlocking unlocks wait waited waiting waits warn warned warning warns went win winning wins
won wonder wondered wondering wonders wrote`.split(/\s+/));

// (b) Words that frame a claim, a study or a story rather than name what it
// is about: its findings, limits and evidence, who found them, how striking
// they are, how many and how long.
const FRAMING = new Set(`abilities ability able actually advance advances alarming approach approaches area areas aspect
aspects assumption assumptions astonishing author authors bad best better billion billions breakthrough breakthroughs
capabilities capability challenge challenges clear clearly clue clues common commonly concept concepts conclusion
conclusions consequence consequences critical crucial currently day days decade decades detail details difference
differences different difficulties difficulty direct directly discoveries discovery dozen dozens dramatic dramatically
eight evidence example examples expert experts explanation explanations extent fact facts factor factors feature
features fifty finally finding findings five forty fundamental good group groups groundbreaking half haunting hidden
hour hours huge hundred hundreds idea ideas implication implications incredible incredibly individual individuals
insight insights instance instances issue issued issues journal journals key kind kinds limit limitation limitations
limits low lower lowest main major manner member members method methods million millions minor minute minutes moment
moments month months mysteries mysterious mystery nine notion notions official officials outcome outcomes percent
percentage person persons perspective perspectives possibilities possibility powerful problem problems promising
puzzling question questions quick quickly rarely reason reasons remarkable remarkably research researched researcher
researchers researching role roles scientist scientists sense seven shocking situation situations six slow slowly sort
sorts specific startling statement statements step steps stories story striking strong stronger strongest stunning
sudden suddenly surprise surprised surprises surprising surprisingly team teams ten thirty thousand thousands tiny
topic topics trillion troubling twenty twist twists type types unable unexpected unexpectedly unique unprecedented
vast vital weak weaker weakest widely worse worst`.split(/\s+/));

// (b) What a contraction leaves when its apostrophe splits it: doesn't is
// doesn and t, and t is too short to be a word anyway.
const CONTRACTION_STUBS = new Set([
  'ain', 'aren', 'couldn', 'didn', 'doesn', 'don', 'hadn', 'hasn', 'haven', 'isn',
  'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn',
]);

// (b) Function words the issue's list does not hold.
const FUNCTION_WORDS = new Set(['ago', 'amid', 'amidst', 'away', 'despite', 'hence', 'not', 'thereby', 'versus', 'yes']);

// The stop words change b adds.
const isAddedStop = (w) => VERBS.has(w) || FRAMING.has(w) || CONTRACTION_STUBS.has(w) || FUNCTION_WORDS.has(w);
const isStop = (w) => STOP.has(w) || ARCHIVE_META.has(w) || isAddedStop(w);

const IRREGULAR = new Map([
  ['people', 'person'], ['children', 'child'], ['men', 'man'], ['women', 'woman'],
  ['analyses', 'analysis'], ['theses', 'thesis'], ['phenomena', 'phenomenon'],
  ['criteria', 'criterion'], ['lives', 'life'], ['knives', 'knife'],
]);

const KEEP_FINAL_S = new Set([
  'news', 'series', 'species', 'lens', 'chaos', 'bias', 'canvas', 'atlas',
  'texas', 'ethics', 'mathematics', 'physics', 'economics', 'politics', 'dynamics', 'thermodynamics',
]);

function undouble(w) {
  const n = w.length;
  if (n > 2 && w[n - 1] === w[n - 2] && !'aeiouylsz'.includes(w[n - 1])) return w.slice(0, -1);
  return w;
}

function stem(tok) {
  if (tok.length <= 3 || /^\d+$/.test(tok)) return tok;
  let w = tok;
  const irregular = IRREGULAR.get(w);
  if (irregular) {
    w = irregular;
  } else if (!KEEP_FINAL_S.has(w) && !/(ss|us|is|ics|ous)$/.test(w)) {
    if (/ies$/.test(w) && w.length > 4) w = w.slice(0, -3) + 'y';
    else if (/(sses|xes|ches|shes|zes)$/.test(w)) w = w.slice(0, -2);
    else if (/s$/.test(w)) w = w.slice(0, -1);
  }
  if (w.length > 5 && w.endsWith('ing')) w = undouble(w.slice(0, -3));
  else if (w.length > 4 && w.endsWith('ed')) w = undouble(w.slice(0, -2));
  if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1);
  if (w.length > 2 && w.endsWith('y')) w = w.slice(0, -1) + 'i';
  return w;
}

// An HTML entity as the character it stands for: a number as its character,
// a name (nbsp, amp, rsquo) as a space, which is what each is to a word.
function decodeEntities(s) {
  return s.replace(/&(#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi, (m, e) => {
    if (e[0] !== '#') return ' ';
    const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ' ';
  });
}

function stripMarkup(raw) {
  return decodeEntities(String(raw ?? '')
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ' ')
    .replace(/<(svg|script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/`[^`]+`/g, ' ');
}

// Every token of a text, lower-cased, accents off, nothing dropped: what a
// tag's phrase is looked for in.
function rawTokens(text) {
  return stripMarkup(text)
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(' ')
    .filter(Boolean);
}

// A word of running text: three letters or more, not only digits, not a
// stop word.
const isWord = (w) => w.length >= 3 && !/^\d+$/.test(w) && !isStop(w);

function tokenize(text) {
  return rawTokens(text).filter(isWord);
}

function listOf(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => String(typeof x === 'string' ? x : (x && x.value) || ''));
}

function firstString(...values) {
  for (const v of values) if (typeof v === 'string' && v) return v;
  return '';
}

// A card's tags: its tags as written, then the value of any tag reference
// (_references) not among them.
function tagsOf(it) {
  const tags = listOf(it.tags);
  const have = new Set(tags.map((t) => t.trim()));
  if (Array.isArray(it._references)) {
    for (const r of it._references) {
      const v = r && r.type === 'tag' && typeof r.value === 'string' ? r.value.trim() : '';
      if (v && !have.has(v)) { have.add(v); tags.push(v); }
    }
  }
  return tags;
}

// Between two tags, or two zones: no phrase runs across it.
const SEP = null;

function joined(lists) {
  const out = [];
  lists.forEach((list, i) => {
    if (i) out.push(SEP);
    for (const t of list) out.push(t);
  });
  return out;
}

// (c) The zones, strongest first: the issue's order of the subject set, then
// the title and the body.
const ZONES = ['subtitle', 'tags', 'topology', 'summary', 'title', 'body'];

// (a) A word that carries a tag of several words: a word, or one of the
// archive's form words (system, theory), which name a subject inside a tag
// (systems theory, immune system) though never alone.
const carriesTag = (w) => w.length >= 3 && !/^\d+$/.test(w) && !STOP.has(w) && !isAddedStop(w);

// (a) A tag taken whole: several words, at least one of them carrying it;
// or one word too short for running text (AI), letters only, not a stop
// word.
function isWholeTag(t) {
  if (t.toks.length > 1) return t.toks.some(carriesTag);
  const w = t.toks[0];
  return w.length === 2 && /^\p{L}+$/u.test(w) && !isStop(w);
}

function extractZones(item) {
  const it = item && typeof item === 'object' ? item : {};
  const tagList = tagsOf(it);
  const topoList = [...listOf(it.topology), ...listOf(it.lineage)];

  // Each zone's tokens as they stand, where a phrase is looked for...
  const raw = {
    subtitle: rawTokens(firstString(it.subtitle)),
    tags: joined(tagList.map(rawTokens)),
    topology: joined(topoList.map(rawTokens)),
    summary: rawTokens(firstString(it.summary, it.tldr)),
    title: rawTokens(firstString(it.title)),
    body: rawTokens(firstString(it.text, it.body, it.content_html, it.content_text)),
  };
  // ...their stems, and their words (stop words out), as the issue reads them.
  const stems = {};
  const words = {};
  for (const zone of ZONES) {
    stems[zone] = raw[zone].map((t) => (t === SEP ? SEP : stem(t)));
    words[zone] = raw[zone].filter((t) => t !== SEP && isWord(t));
  }

  const tagPhrases = [];
  for (const text of tagList) {
    const toks = rawTokens(text);
    if (!toks.length) continue;
    const st = toks.map(stem);
    tagPhrases.push({ text: text.trim(), toks, stems: st, key: st.join(' ') });
  }

  // Subject set: prefer explicit subject metadata (subtitle, tags, topology,
  // summary). Fall back to title + body when metadata is absent (metadata is
  // a gradient, not a gate).
  const hasExplicitSubject = words.subtitle.length + words.tags.length + words.topology.length
    + tagPhrases.filter(isWholeTag).length > 0;
  const subjectSeq = hasExplicitSubject
    ? [...words.subtitle, ...words.tags, ...words.topology, ...words.summary]
    : [...words.title, ...words.summary, ...words.body.slice(0, 100)];
  const allDocWords = [...subjectSeq, ...words.title, ...words.body];

  // (a) Where a whole tag's uses are counted: the body, or for a card with
  // no body, all it carries, as the issue counts a word.
  const countStems = words.body.length
    ? stems.body
    : joined(hasExplicitSubject
      ? [stems.subtitle, stems.tags, stems.topology, stems.summary, stems.title, stems.body]
      : [stems.title, stems.summary, stems.title, stems.body]);
  // Everything the card carries, for the corpus count.
  const docStems = joined(ZONES.map((zone) => stems[zone]));

  return { raw, stems, words, tagPhrases, hasExplicitSubject, subjectSeq, allDocWords, countStems, docStems };
}

// Where a phrase (its stems) starts in a run of stems, looking from `from`;
// -1 if nowhere.
function indexOfPhrase(seq, phrase, from = 0) {
  const n = phrase.length;
  outer: for (let i = from; i + n <= seq.length; i++) {
    for (let j = 0; j < n; j++) if (seq[i + j] !== phrase[j]) continue outer;
    return i;
  }
  return -1;
}

function countPhrase(seq, phrase) {
  let count = 0;
  for (let i = indexOfPhrase(seq, phrase); i >= 0; i = indexOfPhrase(seq, phrase, i + phrase.length)) count += 1;
  return count;
}

function statsOf(zonesList) {
  const df = new Map();
  const bump = (k) => df.set(k, (df.get(k) || 0) + 1);
  for (const z of zonesList) {
    for (const s of new Set(z.allDocWords.map(stem))) bump(s);
  }
  // (a) Every whole tag any card carries, counted in each card holding it
  // anywhere, keyed by its stems (wu wei).
  const wholes = new Map(); // phrase length -> Map(first stem -> Set(key))
  for (const z of zonesList) {
    for (const t of z.tagPhrases) {
      if (!isWholeTag(t)) continue;
      const n = t.stems.length;
      if (!wholes.has(n)) wholes.set(n, new Map());
      const byFirst = wholes.get(n);
      if (!byFirst.has(t.stems[0])) byFirst.set(t.stems[0], new Set());
      byFirst.get(t.stems[0]).add(t.key);
    }
  }
  if (wholes.size) {
    for (const z of zonesList) {
      const seq = z.docStems;
      const seen = new Set();
      for (const [n, byFirst] of wholes) {
        for (let i = 0; i + n <= seq.length; i++) {
          const keys = byFirst.get(seq[i]);
          if (!keys) continue;
          const gram = seq.slice(i, i + n);
          if (gram.includes(SEP)) continue;
          const key = gram.join(' ');
          if (keys.has(key)) seen.add(key);
        }
      }
      for (const k of seen) bump(k);
    }
  }
  return { N: Math.max(1, zonesList.length), df };
}

function buildCorpusStats(items) {
  return statsOf((Array.isArray(items) ? items : []).map(extractZones));
}

// Every candidate of one card, best first.
function rank(z, corpusStats) {
  const N = corpusStats && corpusStats.N ? corpusStats.N : 1;
  const df = corpusStats && corpusStats.df ? corpusStats.df : null;
  const idfOf = (key) => {
    const docFreq = df ? (df.get(key) || 1) : 1;
    return { docFreq, idf: df && N > 1 ? Math.log((N + 1) / (docFreq + 0.5)) + 1 : 1 };
  };

  const subSet = new Set(z.words.subtitle.map(stem));
  const tagSet = new Set(z.words.tags.map(stem));
  const topoSet = new Set(z.words.topology.map(stem));
  const sumSet = new Set(z.words.summary.map(stem));
  const titleSet = new Set(z.words.title.map(stem));

  const subjectOrder = new Map();
  const surface = new Map();
  z.subjectSeq.forEach((w, idx) => {
    const s = stem(w);
    if (!subjectOrder.has(s)) subjectOrder.set(s, idx);
    if (!surface.has(s)) surface.set(s, w);
  });

  const countSource = z.words.body.length ? z.words.body : z.allDocWords;
  const bodyTf = new Map();
  for (const w of countSource) {
    const s = stem(w);
    bodyTf.set(s, (bodyTf.get(s) || 0) + 1);
    if (!surface.has(s)) surface.set(s, w);
  }

  // (a) The whole tags the body uses, each scored as its phrase. A tag's
  // place in the subject is where its first word stands among the subject's
  // words, or just before, when it begins with a word too short to count
  // (AI, wu).
  const wholes = [];
  let tagWordsBefore = 0;
  for (const t of z.tagPhrases) {
    const at = z.words.subtitle.length + tagWordsBefore - (isWord(t.toks[0]) ? 0 : 0.5);
    tagWordsBefore += t.toks.filter(isWord).length;
    if (!isWholeTag(t) || wholes.some((u) => u.key === t.key)) continue;
    const tf = countPhrase(z.countStems, t.stems);
    if (!tf) continue;
    const { docFreq, idf } = idfOf(t.key);
    const has = (zone) => indexOfPhrase(z.stems[zone], t.stems) >= 0;
    const inZones = [];
    if (has('subtitle')) inZones.push('subtitle');
    inZones.push('tags');
    if (has('topology')) inZones.push('topology');
    if (has('summary')) inZones.push('summary');
    if (has('title')) inZones.push('title');
    inZones.push('body');

    const boost = 2.2
      * (has('subtitle') ? 2.0 : 1.0)
      * (has('topology') ? 1.4 : 1.0)
      * (has('summary') ? 1.3 : 1.0);

    const score = Number(((1 + Math.log(tf)) * idf * boost).toFixed(2));
    const orders = [at, ...t.stems.filter((s) => subjectOrder.has(s)).map((s) => subjectOrder.get(s))];
    wholes.push({ key: t.key, stems: t.stems, word: t.text, score, tf, df: docFreq, order: Math.min(...orders), in: inZones, whole: true });
  }

  // (a) Each word of a whole tag is that tag's (the best-scoring one holding
  // it), unless the word is a tag of its own: no candidate apart from it,
  // and where the word scores higher than the phrase, the whole tag takes
  // the word's score.
  const oneWordTags = new Set(z.tagPhrases.filter((t) => t.stems.length === 1).map((t) => t.key));
  const ownerOf = new Map();
  for (const u of [...wholes].sort((a, b) => b.score - a.score)) {
    if (u.stems.length < 2) continue;
    for (const s of u.stems) if (!oneWordTags.has(s) && !ownerOf.has(s)) ownerOf.set(s, u);
  }

  let wordStems = [...subjectOrder.keys()].filter((s) => bodyTf.has(s));
  if (wordStems.filter((s) => !ownerOf.has(s)).length + wholes.length < 2) {
    wordStems = [...new Set([...subjectOrder.keys(), ...bodyTf.keys()])];
  }

  const candidates = [];
  wordStems.forEach((s, idx) => {
    const tf = bodyTf.get(s) || 1;
    const { docFreq, idf } = idfOf(s);
    const inZones = [];
    if (subSet.has(s)) inZones.push('subtitle');
    if (tagSet.has(s)) inZones.push('tags');
    if (topoSet.has(s)) inZones.push('topology');
    if (sumSet.has(s)) inZones.push('summary');
    if (titleSet.has(s)) inZones.push('title');
    if (bodyTf.has(s)) inZones.push('body');

    const boost = (tagSet.has(s) ? 2.2 : 1.0)
      * (subSet.has(s) ? 2.0 : 1.0)
      * (topoSet.has(s) ? 1.4 : 1.0)
      * (sumSet.has(s) ? 1.3 : 1.0);

    const score = Number(((1 + Math.log(tf)) * idf * boost).toFixed(2));
    const owner = ownerOf.get(s);
    if (owner) {
      if (score > owner.score) Object.assign(owner, { score, tf, df: docFreq, in: inZones });
      return;
    }
    const order = subjectOrder.has(s) ? subjectOrder.get(s) : 10000 + idx;
    candidates.push({ key: s, stems: [s], word: surface.get(s) || s, score, tf, df: docFreq, order, in: inZones, whole: false });
  });

  return [...candidates, ...wholes].sort((a, b) => b.score - a.score || a.order - b.order);
}

const disjoint = (a, b) => !a.stems.some((s) => b.stems.includes(s));

// The best candidate, the best after it sharing no word with it, and the
// next such (the issue's #1, #2 and #3).
function choose(ranked) {
  const first = ranked[0];
  if (!first) return { pair: [], third: null };
  const i2 = ranked.findIndex((c, i) => i > 0 && disjoint(c, first));
  if (i2 < 0) return { pair: [first], third: null };
  const third = ranked.find((c, i) => i > i2 && disjoint(c, first)) || null;
  return { pair: [first, ranked[i2]], third };
}

// (c) Where a candidate first appears in a zone: a whole tag where its
// phrase starts, a word where its first running-text form stands; -1 when
// the zone does not hold it.
function positionIn(z, zone, c) {
  const seq = z.stems[zone];
  if (c.whole) return indexOfPhrase(seq, c.stems);
  const raw = z.raw[zone];
  for (let i = 0; i < seq.length; i++) if (seq[i] === c.key && isWord(raw[i])) return i;
  return -1;
}

// (c) The pair in the order the subject uses: the order of first appearance
// in the strongest zone holding both. Held together by none, the issue's
// order: first appearance in the subject set.
function inSubjectOrder(pair, z) {
  if (pair.length < 2) return pair;
  const [a, b] = pair;
  for (const zone of ZONES) {
    const pa = positionIn(z, zone, a);
    const pb = pa < 0 ? -1 : positionIn(z, zone, b);
    if (pa >= 0 && pb >= 0) return pa <= pb ? [a, b] : [b, a];
  }
  return a.order <= b.order ? [a, b] : [b, a];
}

function slugOf(pair, z) {
  const words = inSubjectOrder(pair, z).map((c) => c.word);
  return { words, slug: slugify(words.join('-')) || 'untitled' };
}

const shown = (ranked) => ranked.slice(0, 8).map(({ word, score, tf, df: d, in: z }) => ({ word, score, tf, df: d, in: z }));

function topicSlug(item, corpusStats = null) {
  const z = extractZones(item);
  const ranked = rank(z, corpusStats);
  const { words, slug } = slugOf(choose(ranked).pair, z);
  return { slug, words, candidates: shown(ranked) };
}

function topicSlugs(items) {
  const list = Array.isArray(items) ? items : [];
  const zonesList = list.map(extractZones);
  const stats = statsOf(zonesList);
  const used = new Set();
  const out = [];

  list.forEach((item, i) => {
    const z = zonesList[i];
    const ranked = rank(z, stats);
    const { pair, third } = choose(ranked);
    let { slug, words } = slugOf(pair, z);

    if (used.has(slug) && third) {
      const alt = slugOf([pair[0], third], z);
      if (!used.has(alt.slug)) ({ slug, words } = alt);
    }
    if (used.has(slug)) {
      let k = 2;
      while (used.has(`${slug}-${k}`)) k += 1;
      slug = `${slug}-${k}`;
    }
    used.add(slug);
    const it = item && typeof item === 'object' ? item : {};
    out.push({ id: it.id || it.slug || it.title, slug, words, candidates: shown(ranked) });
  });
  return out;
}

// Whether the build gives each item its topicSlug (settings.cards.topicSlug,
// provisional): on unless it is false.
function topicSlugOn(settings) {
  const cards = settings && settings.cards && typeof settings.cards === 'object' ? settings.cards : {};
  return cards.topicSlug !== false;
}

module.exports = { topicSlug, topicSlugs, buildCorpusStats, topicSlugOn, tokenize, stem };

// Function words: the closed classes of English that are never a topic, whatever their score. Discovery
// (lib/discover.js) refuses a candidate phrase that holds one of them, and records it as turned away with
// the reason `functionWord`, so an item left with no tag can say "onto" and "roughly" recurred and were
// refused rather than counting them as topics it nearly had (issue #20: Luhn's middle band stays as the
// scoring; this is a gate in front of it, not a change to it).
//
// Distinct from the two lists that already exist: lib/normalize.js STOP (the dozen words a label is
// normalized without) and lib/text.js STOPWORDS with seed/generic-words.txt (words that carry no profile
// weight and are never scanned as candidates). A word here may also be there; the difference is that a
// word here is still scanned, counted and reported, so the report can name it. Words of three letters or
// fewer never become candidates anyway (discover's `ok`), and are listed only so the list reads whole.
//
// English only. Provisional file name and shape (2026-11-04). Participles are listed as written and only
// for verbs that are not also a topic noun: "allowing" and "staying" are here, "thinking", "writing",
// "learning", "being" and "building" are not, because a site may well have them as topics. A site that
// wants more words refused names them in its overrides file's `ignore` list, which discovery reads since
// the same date (reason `ignored`, docs/FORMATS.md).

const PREPOSITIONS = `aboard about above across after against along alongside amid amidst among amongst around
as at atop before behind below beneath beside besides between beyond by concerning despite down during except
excluding following for from in inside into like minus near of off on onto opposite out outside over past per
plus regarding round save since than through throughout till to toward towards under underneath unlike until
unto up upon versus via with within without`;

const CONJUNCTIONS = `and or nor but yet so although though because unless whereas whether while whilst if that
once lest`;

const DETERMINERS = `a an the this these those my your his her its our their some any no every each either neither
both all several many much few little enough such what which whose another other others`;

const PRONOUNS = `i me mine myself you yours yourself yourselves he him himself she hers herself it itself we us
ours ourselves they them theirs themselves who whom whoever whomever whatever whichever someone somebody
something anyone anybody anything everyone everybody everything nobody nothing none one ones oneself`;

const AUXILIARIES = `am is are was were be been have has had do does did will would shall should can could may
might must ought`;

const ADVERBS = `roughly approximately almost nearly quite rather fairly pretty very too just only even also still
already again always never ever often sometimes seldom rarely usually generally typically particularly
especially mostly mainly largely partly entirely wholly fully completely totally absolutely really truly
actually certainly surely perhaps maybe probably possibly likely apparently seemingly presumably reportedly
allegedly however therefore thus hence moreover furthermore nevertheless nonetheless otherwise meanwhile
instead anyway indeed else somewhat somehow somewhere anywhere everywhere nowhere here there where when
whenever wherever why how then now soon later earlier recently currently previously eventually finally
initially lastly firstly secondly simply merely virtually essentially basically literally increasingly
significantly relatively respectively accordingly consequently subsequently alternatively ultimately notably
arguably together apart elsewhere altogether overall mostly namely etc`;

// participles of light and linking verbs, which recur in any prose and name nothing
const PARTICIPLES = `allowing staying having doing going getting making taking giving using saying coming seeing
looking letting keeping becoming including according following regarding concerning involving resulting
remaining considering depending pending notwithstanding showing telling asking trying putting bringing
wanting needing turning helping calling causing enabling providing adding holding leaving sending starting
continuing beginning ending happening appearing seeming tending suggesting indicating containing consisting
comprising relating referring representing requiring ensuring maintaining obtaining offering receiving
reaching carrying occurring existing lacking owing given`;

export const FUNCTION_WORDS = new Set(
  [PREPOSITIONS, CONJUNCTIONS, DETERMINERS, PRONOUNS, AUXILIARIES, ADVERBS, PARTICIPLES].join(' ').split(/\s+/).filter(Boolean),
);

// Whether a word, as `words()` in lib/text.js reads it (lower case, no punctuation), is a function word.
export const isFunctionWord = (w) => FUNCTION_WORDS.has(w);

// Whether a phrase, one or more such words separated by spaces, holds a function word anywhere: "onto
// surfaces" and "roughly half" are refused with "onto" and "roughly".
export const hasFunctionWord = (phrase) => String(phrase ?? '').split(' ').some(isFunctionWord);

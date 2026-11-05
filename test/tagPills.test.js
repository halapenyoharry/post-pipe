// How the graph draws its tag nodes (src/lib/tagPills.js): the site's
// settings.graph.tag.show (on by default) and graph.tag.labels (on by
// default, each tag its pill; off, each tag a dot), the reader's choices kept
// in viewState
// (preferences showTags and showTagLabels), and Reset the view returning both
// to the site's own. Neither setting moves anything, so neither is part of
// the layout key.

const { test } = require('node:test');
const assert = require('node:assert');
const {
  PREF, LABELS_PREF, MARK_RADIUS, MARK_HIT_RADIUS,
  siteShowsTags, showTagsChosen, showTagsPrefFor,
  siteShowsTagLabels, showTagLabelsChosen, showTagLabelsPrefFor,
  tagDrawing, tagMarkRadius, tagMarkHitRadius,
} = require('../src/lib/tagPills');
const { createViewState, memoryBackend } = require('../src/lib/viewState');
const { layoutKey } = require('../src/components/GraphViewer/layoutKey');

const mk = (o = {}) => createViewState({ debounceMs: 0, ...o });
const SHOWN = { graph: { tag: { fontSize: 22, show: true } } };
const HIDDEN = { graph: { tag: { fontSize: 22, show: false } } };
const UNSET = { graph: { tag: { fontSize: 22 } } };
const LABELLED = { graph: { tag: { fontSize: 22, labels: true } } };
const UNLABELLED = { graph: { tag: { fontSize: 22, labels: false } } };

test('the preference keys are showTags and showTagLabels', () => {
  assert.strictEqual(PREF, 'showTags');
  assert.strictEqual(LABELS_PREF, 'showTagLabels');
});

test('site default: shown unless graph.tag.show is false', () => {
  assert.strictEqual(siteShowsTags(undefined), true);
  assert.strictEqual(siteShowsTags({}), true);
  assert.strictEqual(siteShowsTags(UNSET), true);
  assert.strictEqual(siteShowsTags(SHOWN), true);
  assert.strictEqual(siteShowsTags(HIDDEN), false);
  assert.strictEqual(siteShowsTags({ graph: { tag: { show: 'no' } } }), true, 'only false hides');
  assert.strictEqual(siteShowsTags({ graph: { tag: { show: 0 } } }), true, 'only false hides');
  assert.strictEqual(siteShowsTags({ tag: { show: false } }), false, 'the graph block alone');
});

test("the reader's choice wins over the site's, null means the site's", () => {
  assert.strictEqual(showTagsChosen(null, UNSET), true);
  assert.strictEqual(showTagsChosen(null, HIDDEN), false);
  assert.strictEqual(showTagsChosen(true, HIDDEN), true);
  assert.strictEqual(showTagsChosen(false, SHOWN), false);
  assert.strictEqual(showTagsChosen(false, UNSET), false);
  assert.strictEqual(showTagsChosen('false', UNSET), true, 'anything but a boolean is no choice');
});

test("a choice equal to the site's is stored as null", () => {
  assert.strictEqual(showTagsPrefFor(true, UNSET), null);
  assert.strictEqual(showTagsPrefFor(false, UNSET), false);
  assert.strictEqual(showTagsPrefFor(false, HIDDEN), null);
  assert.strictEqual(showTagsPrefFor(true, HIDDEN), true);
  assert.strictEqual(showTagsPrefFor(true, SHOWN), null);
  assert.strictEqual(showTagsPrefFor(false, SHOWN), false);
});

test('labels, site default: on unless graph.tag.labels is false', () => {
  assert.strictEqual(siteShowsTagLabels(undefined), true);
  assert.strictEqual(siteShowsTagLabels({}), true);
  assert.strictEqual(siteShowsTagLabels(UNSET), true);
  assert.strictEqual(siteShowsTagLabels(LABELLED), true);
  assert.strictEqual(siteShowsTagLabels(UNLABELLED), false);
  assert.strictEqual(siteShowsTagLabels({ graph: { tag: { labels: 'no' } } }), true, 'only false hides');
  assert.strictEqual(siteShowsTagLabels({ graph: { tag: { labels: 0 } } }), true, 'only false hides');
  assert.strictEqual(siteShowsTagLabels({ tag: { labels: false } }), false, 'the graph block alone');
});

test("labels: the reader's choice wins over the site's, null means the site's", () => {
  assert.strictEqual(showTagLabelsChosen(null, UNSET), true);
  assert.strictEqual(showTagLabelsChosen(null, UNLABELLED), false);
  assert.strictEqual(showTagLabelsChosen(true, UNLABELLED), true);
  assert.strictEqual(showTagLabelsChosen(false, UNSET), false);
  assert.strictEqual(showTagLabelsChosen(false, LABELLED), false);
  assert.strictEqual(showTagLabelsChosen('false', UNSET), true, 'anything but a boolean is no choice');
});

test("labels: a choice equal to the site's is stored as null", () => {
  assert.strictEqual(showTagLabelsPrefFor(true, UNSET), null);
  assert.strictEqual(showTagLabelsPrefFor(false, UNSET), false);
  assert.strictEqual(showTagLabelsPrefFor(false, UNLABELLED), null);
  assert.strictEqual(showTagLabelsPrefFor(true, UNLABELLED), true);
});

test('how the tags are drawn: pills by default, dots with labels off, nothing with show off', () => {
  assert.strictEqual(tagDrawing(null, null, UNSET), 'pills');
  assert.strictEqual(tagDrawing(null, null, undefined), 'pills');
  assert.strictEqual(tagDrawing(null, null, LABELLED), 'pills');
  assert.strictEqual(tagDrawing(null, null, UNLABELLED), 'marks');
  assert.strictEqual(tagDrawing(null, false, UNSET), 'marks');
  assert.strictEqual(tagDrawing(null, true, UNLABELLED), 'pills');
  assert.strictEqual(tagDrawing(null, null, HIDDEN), 'hidden');
  assert.strictEqual(tagDrawing(false, null, UNSET), 'hidden');
  assert.strictEqual(tagDrawing(true, null, HIDDEN), 'pills');
  // The labels count only while the tagz are shown.
  assert.strictEqual(tagDrawing(false, true, LABELLED), 'hidden');
  assert.strictEqual(tagDrawing(null, true, HIDDEN), 'hidden');
});

test("a dot's radius: graph.tag.markRadius, 7 by default; its hit circle 22 or the dot's own", () => {
  assert.strictEqual(MARK_RADIUS, 7);
  assert.strictEqual(tagMarkRadius(undefined), 7);
  assert.strictEqual(tagMarkRadius(UNSET), 7);
  assert.strictEqual(tagMarkRadius({ graph: { tag: { markRadius: 12 } } }), 12);
  assert.strictEqual(tagMarkRadius({ graph: { tag: { markRadius: '4.5' } } }), 4.5);
  for (const bad of [0, -3, 'big', null, '', NaN]) {
    assert.strictEqual(tagMarkRadius({ graph: { tag: { markRadius: bad } } }), 7, String(bad));
  }
  assert.strictEqual(MARK_HIT_RADIUS, 22);
  assert.strictEqual(tagMarkHitRadius(7), 22);
  assert.strictEqual(tagMarkHitRadius(30), 30, 'never smaller than the dot');
  assert.strictEqual(tagMarkHitRadius(undefined), 22);
});

test('both choices are kept on the device, and Reset the view returns both to the site default', async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c' });
  await a.ready();
  assert.strictEqual(tagDrawing(a.preference(PREF), a.preference(LABELS_PREF), UNSET), 'pills');
  a.setPreference(LABELS_PREF, showTagLabelsPrefFor(false, UNSET));
  await a.flush();

  const b = mk({ backend, corpusId: 'c' });
  await b.ready();
  assert.strictEqual(b.preference(LABELS_PREF), false);
  assert.strictEqual(tagDrawing(b.preference(PREF), b.preference(LABELS_PREF), UNSET), 'marks');
  b.setPreference(PREF, showTagsPrefFor(false, UNSET));
  assert.strictEqual(b.preference(PREF), false);
  assert.strictEqual(tagDrawing(b.preference(PREF), b.preference(LABELS_PREF), UNSET), 'hidden');

  b.setPreference('theme', 'paper');
  b.resetLayout({ prefs: [PREF, LABELS_PREF] });
  assert.strictEqual(b.preference(PREF), null);
  assert.strictEqual(b.preference(LABELS_PREF), null);
  assert.strictEqual(tagDrawing(b.preference(PREF), b.preference(LABELS_PREF), UNSET), 'pills');
  assert.strictEqual(b.preference('theme'), 'paper', 'other preferences stay');

  // One undo step brings both choices back with the rest of the reset.
  b.undo();
  assert.strictEqual(b.preference(PREF), false);
  assert.strictEqual(b.preference(LABELS_PREF), false);
});

test('resetLayout with no prefs leaves the choices alone', async () => {
  const a = mk({ backend: memoryBackend(), corpusId: 'c' });
  await a.ready();
  a.setPreference(PREF, false);
  a.setPreference(LABELS_PREF, true);
  a.resetLayout();
  assert.strictEqual(a.preference(PREF), false);
  assert.strictEqual(a.preference(LABELS_PREF), true);
});

test('showing the tagz, their labels or a dot of any size does not change the layout key', () => {
  const graph = (tag) => ({ tag: { fontSize: 22, ...tag } });
  for (const name of ['force', 'radial']) {
    const base = layoutKey(name, UNSET.graph);
    assert.strictEqual(layoutKey(name, SHOWN.graph), base);
    assert.strictEqual(layoutKey(name, HIDDEN.graph), base);
    assert.strictEqual(layoutKey(name, LABELLED.graph), base);
    assert.strictEqual(layoutKey(name, UNLABELLED.graph), base);
    assert.strictEqual(layoutKey(name, graph({ show: false, labels: true, markRadius: 30 })), base);
    assert.strictEqual(layoutKey(name, graph({ show: true, labels: false, markRadius: 3 })), base);
  }
});

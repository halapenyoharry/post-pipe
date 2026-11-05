// Whether the graph draws its tag pills (src/lib/tagPills.js): the site's
// settings.graph.tag.show, the reader's choice kept in viewState (preference
// showTags), and Reset the view returning to the site's own. The setting
// moves nothing, so it is not part of the layout key.

const { test } = require('node:test');
const assert = require('node:assert');
const { PREF, siteShowsTags, showTagsChosen, showTagsPrefFor } = require('../src/lib/tagPills');
const { createViewState, memoryBackend } = require('../src/lib/viewState');
const { layoutKey } = require('../src/components/GraphViewer/layoutKey');

const mk = (o = {}) => createViewState({ debounceMs: 0, ...o });
const SHOWN = { graph: { tag: { fontSize: 22, show: true } } };
const HIDDEN = { graph: { tag: { fontSize: 22, show: false } } };
const UNSET = { graph: { tag: { fontSize: 22 } } };

test('the preference key is showTags', () => {
  assert.strictEqual(PREF, 'showTags');
});

test('site default: hidden unless graph.tag.show is true', () => {
  assert.strictEqual(siteShowsTags(undefined), false);
  assert.strictEqual(siteShowsTags({}), false);
  assert.strictEqual(siteShowsTags(UNSET), false);
  assert.strictEqual(siteShowsTags(HIDDEN), false);
  assert.strictEqual(siteShowsTags(SHOWN), true);
  assert.strictEqual(siteShowsTags({ graph: { tag: { show: 'yes' } } }), false, 'only true shows');
  assert.strictEqual(siteShowsTags({ tag: { show: true } }), true, 'the graph block alone');
});

test("the reader's choice wins over the site's, null means the site's", () => {
  assert.strictEqual(showTagsChosen(null, UNSET), false);
  assert.strictEqual(showTagsChosen(null, SHOWN), true);
  assert.strictEqual(showTagsChosen(true, HIDDEN), true);
  assert.strictEqual(showTagsChosen(false, SHOWN), false);
  assert.strictEqual(showTagsChosen('true', HIDDEN), false, 'anything but a boolean is no choice');
});

test("a choice equal to the site's is stored as null", () => {
  assert.strictEqual(showTagsPrefFor(false, HIDDEN), null);
  assert.strictEqual(showTagsPrefFor(true, HIDDEN), true);
  assert.strictEqual(showTagsPrefFor(true, SHOWN), null);
  assert.strictEqual(showTagsPrefFor(false, SHOWN), false);
});

test('the choice is kept on the device, and Reset the view returns to the site default', async () => {
  const backend = memoryBackend();
  const a = mk({ backend, corpusId: 'c' });
  await a.ready();
  assert.strictEqual(showTagsChosen(a.preference(PREF), HIDDEN), false);
  a.setPreference(PREF, showTagsPrefFor(true, HIDDEN));
  await a.flush();

  const b = mk({ backend, corpusId: 'c' });
  await b.ready();
  assert.strictEqual(b.preference(PREF), true);
  assert.strictEqual(showTagsChosen(b.preference(PREF), HIDDEN), true);

  b.setPreference('theme', 'paper');
  b.resetLayout({ prefs: [PREF] });
  assert.strictEqual(b.preference(PREF), null);
  assert.strictEqual(showTagsChosen(b.preference(PREF), HIDDEN), false);
  assert.strictEqual(b.preference('theme'), 'paper', 'other preferences stay');

  // One undo step brings the choice back with the rest of the reset.
  b.undo();
  assert.strictEqual(b.preference(PREF), true);
});

test('resetLayout with no prefs leaves the choice alone', async () => {
  const a = mk({ backend: memoryBackend(), corpusId: 'c' });
  await a.ready();
  a.setPreference(PREF, true);
  a.resetLayout();
  assert.strictEqual(a.preference(PREF), true);
});

test('showing or hiding the pills does not change the layout key', () => {
  for (const name of ['force', 'radial']) {
    assert.strictEqual(layoutKey(name, SHOWN.graph), layoutKey(name, HIDDEN.graph));
    assert.strictEqual(layoutKey(name, UNSET.graph), layoutKey(name, SHOWN.graph));
  }
});

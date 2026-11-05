// Whether the graph draws its tag nodes (the tagz, drawn as pills): the
// site's settings.graph.tag.show (default false) and the reader's choice in
// the panel, kept on the device in viewState under the preference showTags
// (provisional). The reader's choice wins; null means the site's own.
//
// Hidden pills are only not drawn: the tag nodes stay in the simulation and
// keep pulling their cards, so the layout is the same either way, and the
// setting is not part of the layout key (layoutKey.js).
//
// Pure, so the panel, the graph and the tests agree.

// ViewState preference key (provisional).
const PREF = 'showTags';

// settings.graph.tag.show, from the whole settings, the graph block or the
// tag block: true only when it is true.
function siteShowsTags(settings) {
  if (!settings || typeof settings !== 'object') return false;
  const graph = settings.graph && typeof settings.graph === 'object' ? settings.graph : settings;
  const tag = graph.tag && typeof graph.tag === 'object' ? graph.tag : null;
  return Boolean(tag && tag.show === true);
}

// What is in force: the reader's choice (a boolean) when there is one, else
// the site's.
function showTagsChosen(pref, settings) {
  if (pref === true || pref === false) return pref;
  return siteShowsTags(settings);
}

// What to store for the reader's choice v: null when it is the site's own,
// so a later change to the site's default reaches a reader who never chose
// otherwise; else the boolean.
function showTagsPrefFor(v, settings) {
  const on = Boolean(v);
  return on === siteShowsTags(settings) ? null : on;
}

module.exports = { PREF, siteShowsTags, showTagsChosen, showTagsPrefFor };

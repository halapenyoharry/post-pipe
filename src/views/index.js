// The registry of views: every way the engine can draw a feed, as entries
// { id, label, component, props } (vision/VIEWS.md). A site lists the ones
// it offers in settings.views (src/lib/views.js); the page mounts the
// current entry's component with its props, and the top bar switches
// between them when a site lists more than one.
//
// The first two entries are one component, GraphViewer, drawn with each of
// its graph layouts (src/components/GraphViewer/layouts.js: cluster is the
// layout the code calls force, ring the one it calls radial). A later entry
// may be another component altogether (JSON Trees, vision/JSON-TREES.md).
// Every component takes the same props as GraphViewer: feedData, the
// settings, viewState, and onNodeSelect.

import { GraphViewer } from '../components/GraphViewer/GraphViewer';
import { DEFAULT_VIEWS, viewById, viewLayout, siteViews as siteViewsIn, viewFromSearch, currentView } from '../lib/views';

export const VIEWS = [
  { id: 'cluster', label: 'cluster', component: GraphViewer, props: { layout: 'force' } },
  { id: 'ring', label: 'ring', component: GraphViewer, props: { layout: 'radial' } },
];

// settings.views as entries of this registry (see src/lib/views.js).
export function siteViews(settings, registry = VIEWS, log) {
  return siteViewsIn(settings, registry, log);
}

export { DEFAULT_VIEWS, viewById, viewLayout, viewFromSearch, currentView };

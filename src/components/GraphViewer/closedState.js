// What a closed container hides: every member at any depth, and every edge
// with an end among them. Only the closed container's own blob is left to
// see and touch.

// The ids hidden by the closed containers. membersOf(id) lists a
// container's members at every depth.
function closedMemberSet(closedIds, membersOf) {
  const hidden = new Set();
  for (const id of closedIds) {
    for (const m of membersOf(id) || []) hidden.add(m);
  }
  return hidden;
}

const endId = (e) => (e && typeof e === 'object' ? e.id : e);

// An edge is hidden when either end is hidden.
function edgeHidden(edge, hidden) {
  return hidden.has(endId(edge.source)) || hidden.has(endId(edge.target));
}

// The containers closed from the start (and where Reset returns them).
// graph.containersStart: 'closed' closes every container inside another (a
// book's acts; every container when none is inside another), 'open' none.
// Without it, graph.initialCollapsed: 'all' or a list of container ids.
function initiallyClosed(containers, graph) {
  const all = containers || [];
  const G = graph || {};
  if (G.containersStart === 'open') return [];
  if (G.containersStart === 'closed') {
    const inner = all.filter((c) => c.parent);
    return (inner.length ? inner : all).map((c) => c.id);
  }
  if (G.initialCollapsed === 'all') return all.map((c) => c.id);
  return Array.isArray(G.initialCollapsed) ? G.initialCollapsed.slice() : [];
}

// What Close all closes: every container inside another (a book's acts), or
// every container when none is inside another; the ones they sit in are
// opened, so each closed one shows as its own small node. Open all opens all.
function closeAllPlan(containers) {
  const all = containers || [];
  const inner = all.filter((c) => c.parent);
  const close = (inner.length ? inner : all).map((c) => c.id);
  const closing = new Set(close);
  const open = all.filter((c) => !closing.has(c.id)).map((c) => c.id);
  return { close, open };
}

module.exports = { closedMemberSet, edgeHidden, initiallyClosed, closeAllPlan };

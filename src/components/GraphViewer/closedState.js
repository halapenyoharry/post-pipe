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

module.exports = { closedMemberSet, edgeHidden };

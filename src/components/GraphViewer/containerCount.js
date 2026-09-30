// Whether a container's title shows how many items it holds.
//
// settings.graph.containerCount (default true). When false, no count appears
// wherever a container title appears: the open container's label, the closed
// container's blob, and the source pill at the top.

function showContainerCount(graphSettings) {
  return !graphSettings || graphSettings.containerCount !== false;
}

// The text after a container title: " 28", or nothing when counts are off.
function containerCountText(graphSettings, n) {
  return showContainerCount(graphSettings) ? ` ${n}` : '';
}

module.exports = { showContainerCount, containerCountText };

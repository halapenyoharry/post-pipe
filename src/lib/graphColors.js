// The panel's colors for the graph: draft and published cards, tag and
// topology edges, and placeholder nodes. They color the graph only; the
// reader keeps the theme's own colors.

// Which of the five colors the graph actually draws. A card inside a
// container takes the container's color, so draft/published only count for
// cards outside one; tag, topology and placeholder only exist if there are
// such edges or nodes. feed is what the graph draws (an item kept out of the
// graph by the top bar is not counted: graphFeed in src/lib/topBar.js).
// Offering a picker that changes nothing on screen is the thing this avoids.
function colorKeysInUse(feed) {
  if (!feed || !Array.isArray(feed.items)) return null;
  const containers = feed.containers || [];
  const inContainer = (item) => containers.some((c) => c.parent && c.tag && (item.tags || []).includes(c.tag));
  const used = new Set();
  const ids = new Set(feed.items.map((i) => i.id));
  for (const item of feed.items) {
    if (inContainer(item)) continue;
    used.add(item._status === 'published' ? 'published' : 'draft');
  }
  for (const e of feed.edges || []) {
    if (e.layer === 'tag') used.add('tag');
    else if (e.layer === 'topology') used.add('topology');
    else if (e.layer === 'authored' && !ids.has(e.target)) used.add('placeholder');
  }
  return used;
}

module.exports = { colorKeysInUse };

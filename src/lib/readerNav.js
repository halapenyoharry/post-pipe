// Where the reader can go from a piece: the pieces before and after it along
// `sequence` edges (role next), in the order the edges give. A piece with no
// page to read (title-only, `_posted: 'title'`) is still listed, with the
// status line its container carries ("soon"), so the reader can say what is
// coming instead of linking to nothing.

function itemIndex(feed) {
  const byId = new Map();
  for (const item of (feed && feed.items) || []) byId.set(item.id, item);
  return byId;
}

function isReadable(item) {
  return !!item && item._posted !== 'title';
}

// The status line for a piece that cannot be read yet: its own container's
// status (the deepest container whose tag it carries), else `fallback`.
function navStatus(feed, item, fallback = 'not yet published') {
  if (isReadable(item)) return null;
  const containers = (feed && feed.containers) || [];
  const byId = new Map(containers.map((c) => [c.id, c]));
  const depth = (c) => { let n = 0; let p = c.parent; while (p && byId.has(p) && n < 20) { n++; p = byId.get(p).parent; } return n; };
  const mine = containers
    .filter((c) => c.tag && (item.tags || []).includes(c.tag))
    .sort((a, b) => depth(b) - depth(a));
  const withStatus = mine.find((c) => c.status);
  return withStatus ? String(withStatus.status) : fallback;
}

function neighbours(feed, id) {
  const byId = itemIndex(feed);
  const prev = [];
  const next = [];
  for (const e of (feed && feed.edges) || []) {
    if (e.layer !== 'sequence') continue;
    if (e.source === id && byId.has(e.target)) next.push(byId.get(e.target));
    if (e.target === id && byId.has(e.source)) prev.push(byId.get(e.source));
  }
  return { prev, next };
}

// The one place an arrow key or a swipe goes: the first readable neighbour.
function step(feed, id, dir) {
  const { prev, next } = neighbours(feed, id);
  const list = dir === 'prev' ? prev : next;
  return list.find(isReadable) || null;
}

module.exports = { neighbours, navStatus, isReadable, step };

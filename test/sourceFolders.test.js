const { test } = require('node:test');
const assert = require('node:assert');
const {
  groupByFolderEnabled,
  folderAncestors,
  matchesFolderFilter,
  filterSourcesByFolder,
  groupSourcesByFolder,
  toggleFolderSources,
} = require('../src/lib/sourceFolders');

const SOURCES = [
  { id: 'local:site', title: 'Site', folder: '', itemCount: 5 },
  { id: 'rss:nature', title: 'Nature', folder: 'Science/Biology', itemCount: 10 },
  { id: 'rss:cell', title: 'Cell', folder: 'Science/Biology', itemCount: 4 },
  { id: 'rss:physics', title: 'Physics', folder: 'Science/Physics', itemCount: 7 },
  { id: 'rss:hn', title: 'HN', folder: 'Tech', itemCount: 12 },
];

test('groupByFolderEnabled defaults to false and turns on only when true', () => {
  assert.strictEqual(groupByFolderEnabled({}), false);
  assert.strictEqual(groupByFolderEnabled({ topBar: {} }), false);
  assert.strictEqual(groupByFolderEnabled({ topBar: { groupByFolder: false } }), false);
  assert.strictEqual(groupByFolderEnabled({ topBar: { groupByFolder: true } }), true);
  assert.strictEqual(groupByFolderEnabled({ groupByFolder: true }), true);
});

test('groupSourcesByFolder groups sources in first-seen folder order and sums item counts', () => {
  const groups = groupSourcesByFolder(SOURCES);
  assert.deepStrictEqual(
    groups.map((g) => ({ folder: g.folder, label: g.label, depth: g.depth, count: g.sources.length, items: g.itemCount })),
    [
      { folder: '', label: '', depth: 0, count: 1, items: 5 },
      { folder: 'Science/Biology', label: 'Biology', depth: 2, count: 2, items: 14 },
      { folder: 'Science/Physics', label: 'Physics', depth: 2, count: 1, items: 7 },
      { folder: 'Tech', label: 'Tech', depth: 1, count: 1, items: 12 },
    ],
  );
});

test('filterSourcesByFolder and matchesFolderFilter match exact folders and nested descendants', () => {
  assert.deepStrictEqual(folderAncestors('Science/Biology/Genetics'), [
    'Science',
    'Science/Biology',
    'Science/Biology/Genetics',
  ]);
  assert.strictEqual(matchesFolderFilter(SOURCES[1], 'Science'), true);
  assert.strictEqual(matchesFolderFilter(SOURCES[1], 'Science/Biology'), true);
  assert.strictEqual(matchesFolderFilter(SOURCES[1], 'Tech'), false);

  assert.deepStrictEqual(
    filterSourcesByFolder(SOURCES, 'Science').map((s) => s.id),
    ['rss:nature', 'rss:cell', 'rss:physics'],
  );
});

test('toggleFolderSources hides visible folder members first and shows all when all are hidden', () => {
  // One of two in Science/Biology is already hidden -> hide the remaining visible one.
  const first = toggleFolderSources(SOURCES, 'Science/Biology', new Set(['rss:nature']));
  assert.deepStrictEqual(first, { action: 'hide', ids: ['rss:cell'] });

  // Both are hidden -> show both.
  const second = toggleFolderSources(SOURCES, 'Science/Biology', new Set(['rss:nature', 'rss:cell']));
  assert.deepStrictEqual(second, { action: 'show', ids: ['rss:nature', 'rss:cell'] });
});

const test = require('node:test');
const assert = require('node:assert');
const { dimensionLabels } = require('../src/lib/dimensionLabels');

test('the engine keeps its own names', () => {
  const d = dimensionLabels({});
  assert.deepStrictEqual(d.map((x) => x.label), ['published', 'commits', 'narrative', 'chronology']);
  assert.match(d[1].title, /commit/);
});

test('a site renames commits to revisions everywhere the word shows', () => {
  const d = dimensionLabels({ dimensions: { labels: { commits: 'revisions' } } });
  const c = d.find((x) => x.id === 'commits');
  assert.strictEqual(c.label, 'revisions');
  assert.doesNotMatch(c.title, /commit/i);
  assert.match(c.title, /revisions/);
  const t = dimensionLabels({ dimensions: { labels: { commits: { label: 'drafts', title: 'Every draft' } } } });
  assert.strictEqual(t[1].title, 'Every draft');
});

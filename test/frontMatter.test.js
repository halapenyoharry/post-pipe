const { test } = require('node:test');
const assert = require('node:assert');
const { marked } = require('marked');
const { splitFrontMatter, stripFrontMatter, isMetaCommit } = require('../src/lib/frontMatter');
const { paragraphTexts } = require('../src/lib/paragraphMap');

const BODY = 'First paragraph.\n\nSecond paragraph.\n\n---\n\nThird, after a break.\n';

test('a leading YAML block is stripped and parsed', () => {
  const r = splitFrontMatter('---\ntitle: Berry Thief\nstatus: drafted\n---\n\n' + BODY);
  assert.deepStrictEqual(r.data, { title: 'Berry Thief', status: 'drafted' });
  assert.strictEqual(r.body, BODY);
});

test('gaining front matter shifts no paragraph number', () => {
  const before = paragraphTexts(marked.parse(BODY));
  const after = paragraphTexts(marked.parse(stripFrontMatter('---\ntitle: x\ntags: [a, b]\n---\n' + BODY)));
  assert.deepStrictEqual(after, before);
  assert.strictEqual(before.length, 3);
});

test('prose between two rules is not front matter', () => {
  const prose = '---\nShe walked in.\n---\n\nMore.\n';
  assert.strictEqual(stripFrontMatter(prose), prose);
});

test('an unclosed fence is left alone', () => {
  const t = '---\ntitle: x\n\nNo closing fence.\n';
  assert.strictEqual(stripFrontMatter(t), t);
});

test('text without front matter is unchanged', () => {
  assert.strictEqual(stripFrontMatter(BODY), BODY);
  assert.strictEqual(stripFrontMatter(''), '');
});

test('meta: commits are recognised', () => {
  assert.ok(isMetaCommit('meta: world-building manifesto stays in Writing'));
  assert.ok(isMetaCommit('Meta: renamed files'));
  assert.ok(!isMetaCommit('metaphor pass on chapter 3'));
  assert.ok(!isMetaCommit('fixed a typo'));
});

test('meta: commits leave the revision timeline by default', () => {
  const commits = [
    { date: '2026-01-01T00:00:00Z', message: 'first draft' },
    { date: '2026-02-01T00:00:00Z', message: 'meta: moved to ACT1/' },
    { date: '2026-03-01T00:00:00Z', message: 'second pass' },
  ];
  const { commitTimes } = require('../src/lib/frontMatter');
  assert.deepStrictEqual(commitTimes(commits), ['2026-01-01T00:00:00Z', '2026-03-01T00:00:00Z']);
  assert.deepStrictEqual(commitTimes(commits, { hideMeta: false }).length, 3);
  assert.deepStrictEqual(commitTimes(null), []);
});

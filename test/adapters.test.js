import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fromJsonFeed } from '../lib/adapters/jsonfeed.js';
import { fromPairs } from '../lib/adapters/pairs.js';
import { runAdapter } from '../lib/adapters/index.js';
import { tmpDir } from './helpers.js';

test('jsonfeed: items and tags, source from _source.title, html stripped, color kept', () => {
  const feed = JSON.stringify({
    title: 'Fallback',
    items: [
      { id: 'a', title: 'A', summary: 'one', content_html: '<p>two &amp; <b>three</b></p>', tags: ['x', ' ', 7, 'y'], _source: { title: 'Real', color: '#123456' } },
      { id: 'b', title: 'B', tags: ['z'] },
    ],
  });
  const r = fromJsonFeed(feed);
  const items = r.filter((x) => x.type === 'item');
  assert.equal(items[0].source, 'Real');
  assert.equal(items[0].color, '#123456');
  assert.equal(items[0].text, 'one two & three');
  assert.equal(items[1].source, 'Fallback');
  assert.deepEqual(r.filter((x) => x.type === 'tag' && x.item === 'a').map((x) => x.label), ['x', 'y']);
});

test('jsonfeed: --source overrides everything', () => {
  const r = fromJsonFeed(JSON.stringify({ title: 't', items: [{ id: 1, tags: ['q'], _source: { title: 'S' } }] }), { source: 'Forced' });
  assert.ok(r.every((x) => x.source === 'Forced'));
});

test('pairs: skips comments and blanks, makes each item once', () => {
  const r = fromPairs('# c\n\ni1\talpha\tTitle\thttp://x\ni1\tbeta\ni2\tgamma\n', { source: 'P' });
  assert.equal(r.filter((x) => x.type === 'item').length, 2);
  assert.equal(r.find((x) => x.id === 'i1').title, 'Title');
  assert.equal(r.find((x) => x.id === 'i1').url, 'http://x');
  assert.deepEqual(r.filter((x) => x.type === 'tag').map((x) => x.label), ['alpha', 'beta', 'gamma']);
});

test('frontmatter dir: tags, dotted --field, tolerant of broken json', () => {
  const dir = tmpDir();
  fs.mkdirSync(path.join(dir, 'one'));
  fs.mkdirSync(path.join(dir, 'two'));
  fs.mkdirSync(path.join(dir, 'broken'));
  fs.writeFileSync(path.join(dir, 'one', 'frontmatter.json'), JSON.stringify({ id: 'one', title: 'One', tags: ['AI', 'labor'], idea: { topology: ['feedback loop'], seed: 'a seed' } }));
  fs.writeFileSync(path.join(dir, 'two', 'frontmatter.json'), JSON.stringify({ title: 'Two', tags: 'x, y' }));
  fs.writeFileSync(path.join(dir, 'broken', 'frontmatter.json'), '{nope');
  const tags = runAdapter('frontmatter', dir, { source: 'Posts' });
  assert.deepEqual(tags.filter((x) => x.type === 'tag').map((x) => x.label), ['AI', 'labor', 'x', 'y']);
  const topo = runAdapter('frontmatter', dir, { source: 'Posts', field: 'idea.topology' });
  assert.deepEqual(topo.filter((x) => x.type === 'tag').map((x) => x.label), ['feedback loop']);
  assert.equal(tags.find((x) => x.id === 'one').text, 'a seed');
});

test('markdown dir: yaml inline + block lists, inline hashtags only on request, headings are not tags', () => {
  const dir = tmpDir();
  fs.mkdirSync(path.join(dir, 'sub'));
  fs.writeFileSync(path.join(dir, 'a.md'), '---\ntitle: Note A\ntags: [alpha, "beta gamma"]\n---\n# Heading\nbody with #inline tag and a #second/nested one\n');
  fs.writeFileSync(path.join(dir, 'sub', 'b.md'), '---\ntags:\n  - one\n  - two\n---\ntext');
  const plain = runAdapter('markdown', dir, { source: 'V' });
  assert.deepEqual(plain.filter((x) => x.type === 'tag' && x.item === 'a').map((x) => x.label), ['alpha', 'beta gamma']);
  assert.deepEqual(plain.filter((x) => x.type === 'tag' && x.item === 'sub/b').map((x) => x.label), ['one', 'two']);
  const inline = runAdapter('markdown', dir, { source: 'V', inline: true });
  const a = inline.filter((x) => x.type === 'tag' && x.item === 'a').map((x) => x.label);
  assert.ok(a.includes('inline') && a.includes('second/nested'));
  assert.ok(!a.includes('Heading') && !a.includes(' Heading'));
});

test('runAdapter rejects wrong shapes with useful errors', () => {
  const dir = tmpDir();
  assert.throws(() => runAdapter('nope', dir), /unknown adapter/);
  assert.throws(() => runAdapter('jsonfeed', dir), /expected a file/);
  assert.throws(() => runAdapter('frontmatter', path.join(dir, 'missing')), /not found/);
});

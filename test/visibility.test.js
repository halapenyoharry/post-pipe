const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { ingestFolder } = require('../ingest');
const LocalFolderAdapter = require('../src/adapters/LocalFolderAdapter');

test('visibility flag', async (t) => {
  const rootPath = path.join(__dirname, '_test_visibility_root');
  fs.mkdirSync(rootPath, { recursive: true });
  
  const d1 = path.join(rootPath, 'item1');
  fs.mkdirSync(d1, { recursive: true });
  fs.writeFileSync(path.join(d1, 'frontmatter.json'), JSON.stringify({ posted: true, connected_to: ['item2', 'item3'] }));
  fs.writeFileSync(path.join(d1, 'index.md'), 'Link to [item2](item2) and [item3](./item3.html).');
  
  const d2 = path.join(rootPath, 'item2');
  fs.mkdirSync(d2, { recursive: true });
  fs.writeFileSync(path.join(d2, 'frontmatter.json'), JSON.stringify({ posted: false }));
  
  const d3 = path.join(rootPath, 'item3');
  fs.mkdirSync(d3, { recursive: true });
  fs.writeFileSync(path.join(d3, 'frontmatter.json'), JSON.stringify({}));
  
  const config = {
    id: 'local',
    title: 'test',
    path: rootPath,
    pagesBase: 'http://test',
    coversDir: path.join(__dirname, '_test_visibility_covers'),
    pagesDir: path.join(__dirname, '_test_visibility_pages'),
    visibilityDefault: 'public'
  };
  
  const { items } = await LocalFolderAdapter.load(config);
  
  const i1 = items.find(i => i.url.includes('item1.html'));
  assert.ok(i1, 'item1 exists');
  assert.deepStrictEqual(i1.connected_to, ['item3'], 'item2 should be stripped from connected_to');
  
  const p1 = fs.readFileSync(path.join(config.pagesDir, 'item1.html'), 'utf8');
  assert.ok(p1.includes('Link to item2 and <a href="./item3.html">item3</a>.'), 'markdown link to item2 should be stripped');
  
  const ids = items.map(i => i.id);
  assert.ok(ids.includes('http://test/item1.html'), 'item1 should be visible (posted: true)');
  assert.ok(!ids.includes('http://test/item2.html'), 'item2 should be hidden (posted: false)');
  assert.ok(ids.includes('http://test/item3.html'), 'item3 should be visible (default)');

  // cleanup
  fs.rmSync(rootPath, { recursive: true, force: true });
  fs.rmSync(config.coversDir, { recursive: true, force: true });
});

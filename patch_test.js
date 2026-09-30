const fs = require('fs');
let code = fs.readFileSync('test/visibility.test.js', 'utf8');

code = code.replace(/fs\.writeFileSync\(path\.join\(d1, 'frontmatter\.json'\), JSON\.stringify\(\{ posted: true \}\)\);/, `fs.writeFileSync(path.join(d1, 'frontmatter.json'), JSON.stringify({ posted: true, connected_to: ['item2', 'item3'] }));
  fs.writeFileSync(path.join(d1, 'index.md'), 'Link to [item2](item2) and [item3](./item3.html).');`);

code = code.replace(/const { items } = await LocalFolderAdapter\.load\(config\);/, `const { items } = await LocalFolderAdapter.load(config);
  
  const i1 = items.find(i => i.url.includes('item1.html'));
  assert.ok(i1, 'item1 exists');
  assert.deepStrictEqual(i1.connected_to, ['item3'], 'item2 should be stripped from connected_to');
  
  const p1 = fs.readFileSync(path.join(config.pagesDir, 'item1.html'), 'utf8');
  assert.ok(p1.includes('Link to item2 and <a href="./item3.html">item3</a>.'), 'markdown link to item2 should be stripped');`);

fs.writeFileSync('test/visibility.test.js', code);

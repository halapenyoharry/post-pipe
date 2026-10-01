const test = require('node:test');
const assert = require('node:assert');
const { rootShape, rootPath, rootSegments } = require('../src/components/GraphViewer/roots');

test('a root has the same shape for the same seed, and another for another', () => {
  const a = rootPath({ x: 0, y: 0 }, { x: 300, y: 100 }, rootShape('book|e:1>2'));
  const b = rootPath({ x: 0, y: 0 }, { x: 300, y: 100 }, rootShape('book|e:1>2'));
  const c = rootPath({ x: 0, y: 0 }, { x: 300, y: 100 }, rootShape('book|e:2>3'));
  assert.strictEqual(a.main, b.main);
  assert.strictEqual(a.fine, b.fine);
  assert.notStrictEqual(a.main, c.main);
  assert.ok(a.fine.length > 0, 'rootlets');
});

test('a root starts and ends on its two points, and follows them when they move', () => {
  const shape = rootShape('k');
  const p = rootPath({ x: 10, y: 20 }, { x: 410, y: 20 }, shape);
  assert.ok(p.main.startsWith('M10 20'));
  assert.ok(p.main.endsWith('L410 20'));
  const moved = rootPath({ x: 110, y: 20 }, { x: 510, y: 20 }, shape);
  assert.ok(moved.main.startsWith('M110 20'));
  assert.ok(moved.main.endsWith('L510 20'));
  assert.deepStrictEqual(rootPath(null, { x: 1, y: 1 }, shape), { main: '', fine: '' });
});

test('segments follow the reading path from the book down', () => {
  const segs = rootSegments({
    containers: [{ id: 'book' }, { id: 'act1', parent: 'book' }],
    memberOf: new Map([['a', 'act1'], ['b', 'act1']]),
    sequence: [{ source: 'a', target: 'b' }],
  });
  assert.deepStrictEqual(segs.map((s) => s.key), ['c:book>act1', 's:act1>a', 'e:a>b']);
  assert.deepStrictEqual(segs[2].reach, { node: 'b' });
});

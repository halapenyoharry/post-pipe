// graph.containerCount decides whether a container's title carries its
// member count. Default on; false turns it off everywhere a title appears.

const { test } = require('node:test');
const assert = require('node:assert');
const { showContainerCount, containerCountText } = require('../src/components/GraphViewer/containerCount');

test('containerCount defaults to true: the count follows the title', () => {
  for (const gs of [undefined, null, {}, { containerCount: undefined }]) {
    assert.strictEqual(showContainerCount(gs), true);
    assert.strictEqual(containerCountText(gs, 28), ' 28');
  }
});

test('containerCount true shows the count', () => {
  assert.strictEqual(showContainerCount({ containerCount: true }), true);
  assert.strictEqual(containerCountText({ containerCount: true }, 11), ' 11');
});

test('containerCount false shows no count and no digit', () => {
  const gs = { containerCount: false };
  assert.strictEqual(showContainerCount(gs), false);
  for (const n of [0, 1, 11, 28]) {
    assert.strictEqual(containerCountText(gs, n), '');
  }
});

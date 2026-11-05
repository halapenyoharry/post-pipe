// The feed fetch's connect wait: Node gives each of a host's addresses only
// 250 ms by default, too short for a slow link, so loading the fetch raises
// it (src/adapters/fetchText.js).

const { test } = require('node:test');
const assert = require('node:assert');
const net = require('net');

test('loading the feed fetch gives each address at least CONNECT_ATTEMPT_MS to connect', () => {
  const { CONNECT_ATTEMPT_MS } = require('../src/adapters/fetchText');
  assert.strictEqual(CONNECT_ATTEMPT_MS, 2500);
  assert.ok(net.getDefaultAutoSelectFamilyAttemptTimeout() >= CONNECT_ATTEMPT_MS);
});

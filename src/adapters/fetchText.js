// Tiny fetch wrapper for adapters. Returns text with sensible UA + timeout.
// Node 18+ provides global fetch. One attempt, no retries: a failure is
// thrown with a message that says what happened (the HTTP status, the
// network's own reason, or the time it waited), and the aggregator decides
// what to show instead.

const net = require('net');

const DEFAULT_TIMEOUT_MS = 15_000;
const UA = 'post-pipe/1.0 (+https://github.com/halapenyoharry/post-pipe)';

// Node's fetch tries a host's addresses in turn and by default gives each
// only 250 ms to connect before it moves to the next (network family
// autoselection). On a slow link every address runs out of time, and the
// fetch fails with ETIMEDOUT in about a second and a half though the host
// answers curl in three (seen 2026-11-05 on www.propublica.org from Harold's
// network). A build gives each address this long instead, never less than
// Node's own setting (a --network-family-autoselection-attempt-timeout flag
// still wins when it is longer); the whole fetch is still bounded by
// timeoutMs. It is set for the whole process, which is a build.
const CONNECT_ATTEMPT_MS = 2_500;
if (typeof net.setDefaultAutoSelectFamilyAttemptTimeout === 'function'
    && net.getDefaultAutoSelectFamilyAttemptTimeout() < CONNECT_ATTEMPT_MS) {
  net.setDefaultAutoSelectFamilyAttemptTimeout(CONNECT_ATTEMPT_MS);
}

async function fetchText(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      headers: { 'user-agent': UA, accept: '*/*' },
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`.trim());
    return await r.text();
  } catch (err) {
    if (err && err.name === 'AbortError') throw new Error(`no answer within ${Math.round(timeoutMs / 1000)} s`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { fetchText, CONNECT_ATTEMPT_MS };

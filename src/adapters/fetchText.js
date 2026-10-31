// Tiny fetch wrapper for adapters. Returns text with sensible UA + timeout.
// Node 18+ provides global fetch. One attempt, no retries: a failure is
// thrown with a message that says what happened (the HTTP status, the
// network's own reason, or the time it waited), and the aggregator decides
// what to show instead.

const DEFAULT_TIMEOUT_MS = 15_000;
const UA = 'post-pipe/1.0 (+https://github.com/halapenyoharry/post-pipe)';

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

module.exports = { fetchText };

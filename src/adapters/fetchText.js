// Tiny fetch wrapper for adapters. Returns text with sensible UA + timeout.
// Node 18+ provides global fetch.

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
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
    return await r.text();
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { fetchText };

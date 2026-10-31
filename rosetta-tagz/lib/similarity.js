// String and vector similarity. Pure.

export function jaroWinkler(a, b) {
  if (a === b) return 1;
  const la = a.length;
  const lb = b.length;
  if (!la || !lb) return 0;
  const range = Math.max(0, Math.floor(Math.max(la, lb) / 2) - 1);
  const ma = new Array(la).fill(false);
  const mb = new Array(lb).fill(false);
  let matches = 0;
  for (let i = 0; i < la; i++) {
    const lo = Math.max(0, i - range);
    const hi = Math.min(lb - 1, i + range);
    for (let j = lo; j <= hi; j++) {
      if (!mb[j] && a[i] === b[j]) {
        ma[i] = mb[j] = true;
        matches++;
        break;
      }
    }
  }
  if (!matches) return 0;
  let t = 0;
  let k = 0;
  for (let i = 0; i < la; i++) {
    if (!ma[i]) continue;
    while (!mb[k]) k++;
    if (a[i] !== b[k]) t++;
    k++;
  }
  const m = matches;
  const jaro = (m / la + m / lb + (m - t / 2) / m) / 3;
  let prefix = 0;
  while (prefix < 4 && prefix < la && prefix < lb && a[prefix] === b[prefix]) prefix++;
  return jaro + prefix * 0.1 * (1 - jaro);
}

// sparse vectors are Map<string, number>
export function dot(a, b) {
  if (a.size > b.size) [a, b] = [b, a];
  let s = 0;
  for (const [k, v] of a) {
    const w = b.get(k);
    if (w !== undefined) s += v * w;
  }
  return s;
}

export function norm2(v) {
  let s = 0;
  for (const x of v.values()) s += x * x;
  return Math.sqrt(s);
}

export function normalize(v) {
  const n = norm2(v);
  if (!n) return v;
  const out = new Map();
  for (const [k, x] of v) out.set(k, x / n);
  return out;
}

// both inputs already L2-normalised -> cosine is the dot product
export function cosine(a, b) {
  return dot(a, b);
}

export function topK(v, k) {
  return [...v.entries()].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1)).slice(0, k);
}

export function noisyOr(scores) {
  let miss = 1;
  for (const s of scores) miss *= 1 - Math.min(1, Math.max(0, s));
  return 1 - miss;
}

export function pairKey(a, b) {
  return a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
}

export function orderPair(a, b) {
  return a < b ? [a, b] : [b, a];
}

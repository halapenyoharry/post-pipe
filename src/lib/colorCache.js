// colorCache — disk-backed cache for resolved feed colors.
// Keyed by feed id (the OPML xmlUrl). One JSON file under .feed-cache/.
// .feed-cache/ is already in .gitignore.

const fs   = require('fs');
const path = require('path');

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

class ColorCache {
  constructor(cachePath, { ttlMs = 14 * ONE_DAY_MS } = {}) {
    this.path = cachePath;
    this.ttlMs = ttlMs;
    this.data = this.#read();
  }

  get(feedId) {
    const entry = this.data[feedId];
    if (!entry) return null;
    if (Date.now() - entry.at > this.ttlMs) return null;
    return entry.color;
  }

  set(feedId, color) {
    this.data[feedId] = { color, at: Date.now() };
    this.#write();
  }

  #read() {
    try {
      return JSON.parse(fs.readFileSync(this.path, 'utf8'));
    } catch (_) {
      return {};
    }
  }

  #write() {
    const dir = path.dirname(this.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
  }
}

module.exports = { ColorCache };

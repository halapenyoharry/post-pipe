// viewState — where the reader put things, what they have seen, how they want
// it arranged. The arrangement is the reader's work, and it has to survive a
// rebuild, or dragging a node is a sandcastle.
//
// Three properties do the load bearing:
//
//   Keyed by stable item id. Not by index, not by position in the corpus. A
//   feed can add sixty items overnight and reorder everything; the reader's
//   arrangement of the pieces they care about is untouched.
//
//   Backend-agnostic. The same store persists to localStorage in the static
//   page, to a Dockview panel's params inside a host that owns persistence, or
//   to nothing at all in a test. The store does not know which.
//
//   Bounded. A subscribed news feed churns daily. Left alone, per-item state
//   grows forever for items that no longer exist. prune() keeps that finite
//   without discarding state for anything currently present.

const VERSION = 1;

// Every key the engine writes to a browser's storage starts with this, so
// forgetting a reader's usage is one sweep by prefix rather than a list of
// keys that goes stale the first time someone adds one. A new key that does
// not start with it is a bug.
const STORAGE_PREFIX = 'post-pipe:';

function engineKeys(store) {
  const keys = [];
  if (!store) return keys;
  try {
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (typeof k === 'string' && k.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
  } catch (_) { /* storage refused; nothing of ours is in it */ }
  return keys;
}

/**
 * Remove everything the engine keeps in this browser: every localStorage and
 * sessionStorage key under STORAGE_PREFIX, and every IndexedDB database whose
 * name starts with it. Keys that are not the engine's are left alone.
 * Returns the keys it removed.
 */
async function forgetStorage(opts = {}) {
  const g = typeof globalThis !== 'undefined' ? globalThis : {};
  const pick = (name) => {
    if (opts[name] !== undefined) return opts[name];
    try { return g[name] || null; } catch (_) { return null; }
  };
  const removed = [];
  for (const store of [pick('localStorage'), pick('sessionStorage')]) {
    for (const k of engineKeys(store)) {
      try { store.removeItem(k); removed.push(k); } catch (_) { /* keep going */ }
    }
  }
  const idb = pick('indexedDB');
  if (idb && typeof idb.databases === 'function') {
    try {
      const dbs = await idb.databases();
      for (const db of dbs || []) {
        if (db && typeof db.name === 'string' && db.name.startsWith(STORAGE_PREFIX)) {
          try { idb.deleteDatabase(db.name); removed.push('indexedDB:' + db.name); } catch (_) { /* keep going */ }
        }
      }
    } catch (_) { /* not supported here */ }
  }
  return removed;
}

function emptyState(corpusId, layoutVersion) {
  return {
    version: VERSION,
    corpusId: corpusId || null,
    layoutVersion: layoutVersion || null,
    layout: 'force',
    hiddenSources: [],
    sourceColors: {},  // sourceId -> hex override, chosen from the pill's ring picker
    graphColors: {},   // e.g. draft/published/tag/topology/placeholder -> hex override
    colorProfileId: null, // which preset (if any) graphColors currently matches
    paragraphIndent: false,
    paragraphSpace: true,
    readerAids: {},    // reading aids the reader turned on: followAlong, boldStart, font, size
    prefs: {},         // how the page looks: theme, mode, timeOfDay
    nodes: {},      // id -> { x, y, w, h, pinned, t }
    // The time axis is a thing the reader positions and keeps, not a mode they
    // re-enable every visit. Orientation lives here too: left-to-right is one
    // culture's reading order, not a property of time.
    // Orientation defaults from settings.json (graph.timeAxis.orientation)
    // rather than being fixed here, so a fork that reads right-to-left is a
    // configuration rather than a patch.
    timeAxis: { on: false, x: 0, y: -1000 },
    reading: {},    // id -> { scroll, seenAt, t }
    bookmarks: [],  // array of { id, item, para, quote, note, t }
  };
}

// Structural clone that works everywhere we run, without pulling in a dep.
function clone(v) {
  return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
}

/** In-memory backend. The default, and what tests use. */
function memoryBackend(initial) {
  let saved = initial ? clone(initial) : null;
  return {
    id: 'memory',
    async load() { return clone(saved); },
    async save(state) { saved = clone(state); },
    async clear() { saved = null; },
  };
}

/**
 * Browser backend. Per-viewer, per-origin, survives reload.
 *
 * Every access is guarded: storage throws outright in some contexts (private
 * windows, embedded previews, browsers set to block site data) and returns
 * nothing in others. A reader whose browser refuses to store anything should
 * get a working page with no memory, not a broken one.
 */
function localStorageBackend(key, storage) {
  const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
  return {
    id: 'localStorage',
    async load() {
      if (!store) return null;
      try {
        const raw = store.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (_) {
        return null;
      }
    },
    async save(state) {
      if (!store) return;
      try {
        store.setItem(key, JSON.stringify(state));
      } catch (_) {
        // Quota exceeded, or storage disabled mid-session. Losing the
        // arrangement is bad; taking the page down with it is worse.
      }
    },
    async clear() {
      if (!store) return;
      try { store.removeItem(key); } catch (_) { /* nothing to remove */ }
    },
  };
}

/**
 * Host backend. For a panel inside something that owns persistence already —
 * Exoskeleton writes params to disk, so the arrangement rides along with the
 * workspace layout instead of living in a browser the host may not even be.
 */
function hostParamsBackend(api, field) {
  const key = field || 'viewState';
  return {
    id: 'hostParams',
    async load() {
      try {
        return (api && api.getParameters && api.getParameters()[key]) || null;
      } catch (_) {
        return null;
      }
    },
    async save(state) {
      try {
        if (api && api.updateParameters) {
          api.updateParameters({ ...(api.getParameters ? api.getParameters() : {}), [key]: state });
        }
      } catch (_) { /* host declined; keep running */ }
    },
  };
}

/**
 * @param {Object}  opts
 * @param {Object}  [opts.backend]      persistence adapter; defaults to memory
 * @param {string}  [opts.corpusId]     namespace, so two corpora do not collide
 * @param {number}  [opts.debounceMs]   coalesce writes during a drag
 * @param {number}  [opts.maxHistory]   undo depth
 * @param {Function}[opts.now]          injectable clock, for tests
 */
function createViewState(opts = {}) {
  const backend = opts.backend || memoryBackend();
  const debounceMs = opts.debounceMs === undefined ? 250 : opts.debounceMs;
  const maxHistory = opts.maxHistory === undefined ? 50 : opts.maxHistory;
  const now = opts.now || (() => Date.now());

  let state = emptyState(opts.corpusId, opts.layoutVersion);
  let past = [];
  let future = [];
  let listeners = [];
  let saveTimer = null;
  let pendingSave = null;
  // Set by forget(): nothing more is written until the page starts again.
  let forgotten = false;

  function notify() {
    for (const fn of listeners.slice()) fn(state);
  }

  function scheduleSave() {
    if (debounceMs <= 0) return flush();
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = null; flush(); }, debounceMs);
    if (saveTimer && typeof saveTimer.unref === 'function') saveTimer.unref();
  }

  async function flush() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (forgotten) return;
    pendingSave = backend.save(clone(state));
    await pendingSave;
    pendingSave = null;
  }

  // A change the reader could reasonably want to take back.
  function update(producer) {
    const before = clone(state);
    const next = clone(state);
    producer(next);
    state = next;
    past.push(before);
    if (past.length > maxHistory) past.shift();
    future = [];
    notify();
    scheduleSave();
  }

  // A change mid-gesture. Dragging a node emits a change per frame; one undo
  // should take back the whole drag, not one pixel of it. Callers make their
  // transient changes with this and call commit() when the gesture ends.
  function updateTransient(producer) {
    if (gestureBase === null) gestureBase = clone(state);
    const next = clone(state);
    producer(next);
    state = next;
    notify();
    scheduleSave();
  }

  // Baseline for an in-progress gesture; see updateTransient/commit below.
  let gestureBase = null;

  // A change the reader did not make, and therefore cannot want to take back:
  // the layout the simulation settled on, a migration, a default filled in.
  // Persisted, but invisible to history — and it must not disturb a gesture
  // in progress either, or the next commit() would fold it into the reader's
  // undo entry.
  function updateSilent(producer) {
    const next = clone(state);
    producer(next);
    state = next;
    // If a gesture is open, the silent change has to land in its baseline too.
    // commit() records the difference between baseline and now; without this,
    // a layout that settled mid-drag would be inside that difference, and
    // undoing the drag would throw the layout away with it.
    if (gestureBase !== null) {
      const base = clone(gestureBase);
      producer(base);
      gestureBase = base;
    }
    notify();
    scheduleSave();
  }

  function commit() {
    if (gestureBase === null) return false;
    const before = gestureBase;
    gestureBase = null;
    if (JSON.stringify(before) === JSON.stringify(state)) return false;
    past.push(before);
    if (past.length > maxHistory) past.shift();
    future = [];
    scheduleSave();
    return true;
  }

  function undo() {
    if (!past.length) return false;
    future.push(clone(state));
    const bookmarks = state.bookmarks;
    const reading = state.reading;
    state = past.pop();
    state.bookmarks = bookmarks;
    state.reading = reading;
    gestureBase = null;
    notify();
    scheduleSave();
    return true;
  }

  function redo() {
    if (!future.length) return false;
    past.push(clone(state));
    const bookmarks = state.bookmarks;
    const reading = state.reading;
    state = future.pop();
    state.bookmarks = bookmarks;
    state.reading = reading;
    gestureBase = null;
    notify();
    scheduleSave();
    return true;
  }

  return {
    get state() { return state; },
    get canUndo() { return past.length > 0; },
    get canRedo() { return future.length > 0; },
    backendId: backend.id,

    async ready() {
      const loaded = await backend.load();
      if (loaded && loaded.version === VERSION) {
        // If saved state has the old paragraphStyle, map 'indent' to indent on + space off,
        // and 'space' to indent off + space on.
        if (loaded.paragraphStyle !== undefined) {
          if (loaded.paragraphIndent === undefined) {
            loaded.paragraphIndent = loaded.paragraphStyle === 'indent';
          }
          if (loaded.paragraphSpace === undefined) {
            loaded.paragraphSpace = loaded.paragraphStyle === 'space';
          }
          delete loaded.paragraphStyle;
        }
        // A stored arrangement for a different corpus is not ours to apply.
        if (!opts.corpusId || !loaded.corpusId || loaded.corpusId === opts.corpusId) {
          state = {
            ...emptyState(opts.corpusId, opts.layoutVersion),
            ...loaded,
            corpusId: opts.corpusId || loaded.corpusId,
          };
          if (!Array.isArray(state.bookmarks)) {
            state.bookmarks = [];
          }
        }
      }

      // When the layout algorithm changes, positions it generated last time
      // are stale — restoring them would hide the change behind its own old
      // output. Positions the reader placed are theirs and survive, which is
      // the entire reason the two are distinguished.
      if (opts.layoutVersion && state.layoutVersion !== opts.layoutVersion) {
        const kept = {};
        for (const [id, node] of Object.entries(state.nodes)) {
          if (!node.auto) kept[id] = node;
        }
        state = { ...state, nodes: kept, layoutVersion: opts.layoutVersion };
        scheduleSave();
      }

      notify();
      return state;
    },

    /**
     * Forget this reader's usage: open and closed nodes, positions and sizes,
     * layout, theme and reading choices, bookmarks and notes, progress, and
     * anything else the engine stored in this browser. Distinct from
     * resetLayout, which only puts the view back and keeps the rest.
     * After this the store writes nothing; the page is expected to start
     * over. `where` names the storages to sweep (for tests); by default the
     * browser's own.
     */
    async forget(where) {
      forgotten = true;
      if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
      if (pendingSave) { try { await pendingSave; } catch (_) { /* gone anyway */ } }
      state = emptyState(state.corpusId, state.layoutVersion);
      past = [];
      future = [];
      gestureBase = null;
      if (backend.clear) { try { await backend.clear(); } catch (_) { /* swept below */ } }
      const removed = await forgetStorage(where || {});
      notify();
      return removed;
    },

    update,
    updateTransient,
    updateSilent,
    commit,
    undo,
    redo,
    flush,

    subscribe(fn) {
      listeners.push(fn);
      return () => { listeners = listeners.filter((f) => f !== fn); };
    },

    resetLayout() {
      update((s) => {
        s.nodes = {};
      });
    },

    // ── typed helpers ────────────────────────────────────────────────────────

    nodeState(id) { return state.nodes[id] || null; },

    // `silent` marks a position the layout chose, not one the reader did.
    // The distinction is what lets a better layout replace its own old output
    // without touching anything a person actually placed.
    setNodePosition(id, x, y, { transient = false, silent = false } = {}) {
      const apply = silent ? updateSilent : transient ? updateTransient : update;
      apply((s) => {
        const prev = s.nodes[id] || {};
        s.nodes[id] = { ...prev, x, y, t: now(), auto: silent ? true : undefined };
        if (!silent) delete s.nodes[id].auto;
      });
    },

    // Resizing is as much an act of arrangement as moving, so it clears the
    // generated flag too. Without this, a card the reader sized but never
    // dragged would still count as the layout's and be thrown away by the next
    // layout-version bump.
    setNodeSize(id, w, h, { transient = false, silent = false } = {}) {
      const apply = silent ? updateSilent : transient ? updateTransient : update;
      apply((s) => {
        s.nodes[id] = { ...(s.nodes[id] || {}), w, h, t: now() };
        if (!silent) delete s.nodes[id].auto;
      });
    },

    // Which nodes the reader has open. Kept with the node's other state so an
    // open chapter is still open on the next visit. Not an undoable act.
    setNodePinned(id, pinned) {
      updateTransient((s) => {
        const prev = s.nodes[id] || {};
        s.nodes[id] = { ...prev, pinned: !!pinned, t: now() };
        if (!pinned) delete s.nodes[id].pinned;
      });
    },

    setLayout(layout) { update((s) => { s.layout = layout; }); },

    resetLayout() {
      update((s) => {
        s.nodes = {};
        s.layout = 'force';
      });
      gestureBase = null;
    },

    timeAxis() {
      return state.timeAxis || { on: false, x: 0, y: -1000 };
    },

    setTimeAxis(patch, { transient = false } = {}) {
      (transient ? updateTransient : update)((s) => {
        s.timeAxis = { ...(s.timeAxis || {}), ...patch };
      });
    },

    toggleSource(sourceId) {
      update((s) => {
        const i = s.hiddenSources.indexOf(sourceId);
        if (i === -1) s.hiddenSources.push(sourceId);
        else s.hiddenSources.splice(i, 1);
      });
    },

    isHidden(sourceId) { return state.hiddenSources.indexOf(sourceId) !== -1; },

    // A color the reader chose for one feed's dot, from the pill's ring
    // picker — overrides whatever the build computed (theme-color/hash).
    sourceColor(sourceId) { return (state.sourceColors || {})[sourceId] || null; },
    setSourceColor(sourceId, color) {
      update((s) => { s.sourceColors = { ...(s.sourceColors || {}), [sourceId]: color }; });
    },

    // The graph's own palette (draft/published/tag/topology/placeholder).
    // A profile replaces the whole set at once; a single key can then be
    // nudged without losing the rest of the chosen profile. colorProfileId
    // is purely cosmetic — which preset button Settings highlights as
    // active — and is cleared the moment a single key is nudged, since at
    // that point the palette is no longer exactly that preset.
    graphColors() { return state.graphColors || {}; },
    colorProfileId() { return state.colorProfileId || null; },
    setGraphColor(key, value) {
      update((s) => {
        s.graphColors = { ...(s.graphColors || {}), [key]: value };
        s.colorProfileId = null;
      });
    },
    applyColorProfile(id, colors) {
      update((s) => { s.graphColors = { ...colors }; s.colorProfileId = id; });
    },

    // Paragraph style for every place text is read: the reader pane and an
    // open node's scrolling text. Two independent switches:
    // indent = book style first-line indent; space = gap between paragraphs.
    paragraphIndent() { return state.paragraphIndent === true; },
    setParagraphIndent(v) {
      update((s) => { s.paragraphIndent = Boolean(v); });
    },
    paragraphSpace() { return state.paragraphSpace !== false; },
    setParagraphSpace(v) {
      update((s) => { s.paragraphSpace = Boolean(v); });
    },
    paragraphStyle() {
      if (state.paragraphIndent && !state.paragraphSpace) return 'indent';
      return 'space';
    },
    setParagraphStyle(v) {
      update((s) => {
        s.paragraphIndent = v === 'indent';
        s.paragraphSpace = v === 'space';
      });
    },

    // Reading aids, chosen in the panel and kept across visits: followAlong
    // (a highlighter that follows the finger), boldStart (bold word
    // beginnings), font ('default' or another face the page ships).
    // size: the reader's text size, 'm' unless chosen ('s', 'm', 'l', 'xl').
    readerAid(key) {
      const aids = state.readerAids || {};
      if (key === 'font') return typeof aids.font === 'string' ? aids.font : 'default';
      if (key === 'size') return typeof aids.size === 'string' ? aids.size : 'm';
      return aids[key] === true;
    },
    setReaderAid(key, value) {
      update((s) => {
        if (!s.readerAids || typeof s.readerAids !== 'object') s.readerAids = {};
        s.readerAids[key] = key === 'font' ? String(value || 'default')
          : key === 'size' ? String(value || 'm') : Boolean(value);
      });
    },

    // How the page looks, chosen in the panel's View group and kept across
    // visits: theme (a theme name, or null for the site's own), mode
    // ('auto', 'light', 'dark'), timeOfDay (the background follows the
    // chapter's time of day; null means the site's default).
    preference(key) {
      const p = state.prefs || {};
      return p[key] === undefined ? null : p[key];
    },
    setPreference(key, value) {
      update((s) => {
        if (!s.prefs || typeof s.prefs !== 'object') s.prefs = {};
        if (value === null || value === undefined) delete s.prefs[key];
        else s.prefs[key] = value;
      });
    },

    // Reading position. Scrolling is continuous and not an undoable act, so it
    // never enters history — taking back a scroll is not a thing readers want.
    setReadingPosition(id, scroll) {
      updateTransient((s) => {
        s.reading[id] = { ...(s.reading[id] || {}), scroll, t: now() };
      });
      gestureBase = null;
    },

    // How far through a piece the reader is, as a fraction 0..1 (at), the
    // furthest they have been (max), and done once they reach the end
    // (max >= 0.98), which then stays set. A node's progress bar draws max.
    setReadingProgress(id, fraction) {
      const f = Math.max(0, Math.min(1, Number(fraction) || 0));
      updateTransient((s) => {
        const prev = s.reading[id] || {};
        const max = Math.max(Number(prev.max) || 0, f);
        s.reading[id] = { ...prev, at: f, max, done: prev.done === true || max >= 0.98, t: now() };
      });
      gestureBase = null;
    },
    readingProgress(id) {
      const r = state.reading[id] || {};
      return { at: Number(r.at) || 0, max: Number(r.max) || 0, done: r.done === true, seen: Boolean(r.seenAt) };
    },

    markSeen(id) {
      if (state.reading[id] && state.reading[id].seenAt) return;
      updateTransient((s) => {
        s.reading[id] = { ...(s.reading[id] || {}), seenAt: now(), t: now() };
      });
      gestureBase = null;
    },

    isSeen(id) { return Boolean(state.reading[id] && state.reading[id].seenAt); },
    readingPosition(id) { return (state.reading[id] && state.reading[id].scroll) || 0; },

    // ── bookmarks ────────────────────────────────────────────────────────────

    bookmarks(item) {
      const all = Array.isArray(state.bookmarks) ? state.bookmarks : [];
      if (item === undefined || item === null) {
        return all.slice();
      }
      return all
        .filter((b) => b.item === item)
        .sort((a, b) => (a.para ?? 0) - (b.para ?? 0) || (a.t ?? 0) - (b.t ?? 0));
    },

    addBookmark({ item, para, quote, note, version } = {}) {
      const id = 'bm-' + now() + '-' + Math.random().toString(36).slice(2, 8);
      const entry = {
        id,
        item,
        para: typeof para === 'number' ? para : (parseInt(para, 10) || 0),
        quote: quote ? String(quote) : '',
        note: note ? String(note) : '',
        t: now(),
      };
      if (version) entry.version = version;
      updateTransient((s) => {
        if (!Array.isArray(s.bookmarks)) s.bookmarks = [];
        s.bookmarks.push(entry);
      });
      gestureBase = null;
      return id;
    },

    setBookmarkNote(id, note) {
      updateTransient((s) => {
        if (!Array.isArray(s.bookmarks)) s.bookmarks = [];
        const bm = s.bookmarks.find((b) => b.id === id);
        if (bm) {
          bm.note = note !== undefined && note !== null ? String(note) : '';
        }
      });
      gestureBase = null;
    },

    removeBookmark(id) {
      updateTransient((s) => {
        if (!Array.isArray(s.bookmarks)) s.bookmarks = [];
        s.bookmarks = s.bookmarks.filter((b) => b.id !== id);
      });
      gestureBase = null;
    },

    /**
     * Keep per-item state finite without losing anything that still exists.
     *
     * Everything currently in the corpus is kept unconditionally. Entries for
     * items that have gone are kept too, up to `keep`, most-recently-touched
     * first — a feed item can disappear from a feed and come back, and a reader
     * who returns to a piece should find their place. Past that cap the oldest
     * go, because a daily news feed would otherwise accumulate state forever.
     */
    prune(validIds, { keep = 500 } = {}) {
      const valid = new Set(validIds);
      // Positions are filed per layout, as "<layout>::<item id>", because the
      // same node belongs in different places in a ring and on a timeline.
      // Pruning matches on the item, not the composite key, or every position
      // in every layout would look like it belonged to a node that no longer
      // exists.
      const itemOf = (key) => {
        const i = key.indexOf('::');
        return i === -1 ? key : key.slice(i + 2);
      };
      update((s) => {
        for (const bucket of ['nodes', 'reading']) {
          const entries = Object.entries(s[bucket]);
          const absent = entries
            .filter(([id]) => !valid.has(itemOf(id)))
            .sort((a, b) => (b[1].t || 0) - (a[1].t || 0));
          for (const [id] of absent.slice(keep)) delete s[bucket][id];
        }
      });
    },
  };
}

module.exports = {
  STORAGE_PREFIX,
  forgetStorage,
  createViewState,
  memoryBackend,
  localStorageBackend,
  hostParamsBackend,
  VERSION,
};

// Browser global, for the static page which inlines this file the way it
// inlines tts.js. Same module, no build step, no second copy.
if (typeof window !== "undefined") {
  window.ViewState = { createViewState, memoryBackend, localStorageBackend, hostParamsBackend, VERSION, STORAGE_PREFIX, forgetStorage };
}

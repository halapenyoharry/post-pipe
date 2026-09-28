/**
 * PostPipe Embed — drop-in entry point for any webpage.
 *
 * Usage:
 *   <div id="post-pipe"></div>
 *   <script src="post-pipe.embed.js"></script>
 *   <script>
 *     PostPipe.init('#post-pipe', {
 *       feed: './feed.json',                 // required: where the data lives
 *       features: { tts: true, rss: false }, // optional: toggle features
 *       theme: { bg: '#1a1a2e', ... },       // optional: color overrides
 *       persistence: 'localStorage',         // or 'memory' or 'none'
 *       settings: { ... },                   // optional: full settings.json equivalent
 *     });
 *   </script>
 *
 * With zero config beyond the feed URL, everything turns on with sensible
 * defaults. The ConfigPanel lets the user toggle features at runtime and
 * export a JSON config they can paste back into their init() call.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { GraphViewer } from './components/GraphViewer/GraphViewer';
import { ReaderPanel } from './components/ReaderPanel/ReaderPanel';
import { TTS } from './components/TTS/TTS';
import { FeedZ } from './components/FeedZ';
import { Settings } from './components/Settings';
import { ConfigPanel, DEFAULT_FEATURES } from './components/ConfigPanel';
import { createViewState } from './lib/viewState';

// ── Default settings (mirrors settings.json structure) ───────────────────────

const DEFAULT_THEME = {
  bg:           '#1a1a2e',
  surface:      '#0a0e1a',
  accent:       '#64ffda',
  text:         '#a8b2d1',
  text_bright:  '#ccd6f6',
  border:       'rgba(100, 255, 218, 0.2)',
  node_published: '#3498db',
  node_draft:   '#7f8c8d',
  tag_color:    '#f39c12',
};

const DEFAULT_SETTINGS = {
  site: {
    title: 'Post-Pipe Viewer',
    description: 'A corpus viewer',
    base_url: '',
  },
  author: {
    name: '',
    label: '',
    display: '',
  },
  theme: DEFAULT_THEME,
  tts: {
    enabled: true,
    default_engine: 'browser',
    engines: {
      browser: {
        label: 'Browser (Web Speech API)',
        voices: 'auto',
        available: true,
        exposed: true,
      },
    },
  },
  graph: {
    card: {
      width: 180, height: 140,
      hoverWidth: 200, hoverHeight: 160,
      pinnedWidth: 230, pinnedHeight: 190,
      minWidth: 110, minHeight: 80,
      maxWidth: 620, maxHeight: 520,
      cornerRadius: 10, glowPadding: 16,
      labelMinFontSize: 14, labelMaxFontSize: 36,
      compactHeight: 260, imageMarkSize: 22,
    },
    tag: {
      fontSize: 22, padding: 11,
      maxWidth: 150, maxLines: 3,
      cornerRadius: 9, opacity: 0.7,
    },
    timeAxis: {
      dock: 'left', inset: 54, endPadding: 70,
      connectorOpacity: 0.45, connectorWidth: 1.6,
      spineOpacity: 0.55, spineWidth: 3, tickFontSize: 13,
    },
    simulation: {
      linkDistance: 160, chargeStrength: -500,
      collidePadding: 10, velocityDecay: 0.7, alphaDecay: 0.028,
    },
  },
};

const LAYOUT_VERSION = 'per-layout-positions-3';

// ── ViewState factory (inline to avoid needing the CJS module at build) ──────

function createMemoryBackend() {
  let saved = null;
  return {
    id: 'memory',
    async load() { return saved ? JSON.parse(JSON.stringify(saved)) : null; },
    async save(state) { saved = JSON.parse(JSON.stringify(state)); },
  };
}

function createLocalStorageBackend(key) {
  const store = typeof localStorage !== 'undefined' ? localStorage : null;
  return {
    id: 'localStorage',
    async load() {
      if (!store) return null;
      try {
        const raw = store.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (_) { return null; }
    },
    async save(state) {
      if (!store) return;
      try { store.setItem(key, JSON.stringify(state)); } catch (_) { /* quota */ }
    },
  };
}

function pickBackend(mode, feedUrl) {
  if (mode === 'none') return createMemoryBackend();
  if (mode === 'memory') return createMemoryBackend();
  // Default: localStorage, namespaced by feed URL
  const ns = 'post-pipe:viewstate:' + (feedUrl || 'default');
  return createLocalStorageBackend(ns);
}

// ── Deep merge utility ───────────────────────────────────────────────────────

function deepMerge(target, source) {
  if (!source) return target;
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
      target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

// ── The embed app ────────────────────────────────────────────────────────────

function EmbedApp({ initialConfig, feedData }) {
  const [config, setConfig] = React.useState(initialConfig);

  const features = { ...DEFAULT_FEATURES, ...(config.features || {}) };
  const theme = deepMerge(DEFAULT_THEME, config.theme || {});
  const settings = deepMerge(DEFAULT_SETTINGS, config.settings || {});
  // Override settings theme with embed theme
  settings.theme = { ...settings.theme, ...theme };

  // Expose SETTINGS globally for components that read it (ReaderPanel, TTS)
  React.useEffect(() => {
    window.SETTINGS = settings;
  }, [settings]);

  // Set CSS custom properties from theme
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--surface', theme.surface);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--text-bright', theme.text_bright);
    root.style.setProperty('--border', theme.border || 'rgba(100, 255, 218, 0.2)');
    root.style.setProperty('--gv-node-draft', theme.node_draft || '#7f8c8d');
    root.style.setProperty('--gv-node-published', theme.node_published || '#3498db');
    root.style.setProperty('--gv-tag-color', theme.tag_color || '#f39c12');
    root.style.setProperty('--gv-accent', theme.accent);
    root.style.setProperty('--rp-bg', theme.bg);
    root.style.setProperty('--rp-surface', theme.surface);
    root.style.setProperty('--rp-border', theme.border || 'rgba(100, 255, 218, 0.2)');
    root.style.setProperty('--rp-accent', theme.accent);
    root.style.setProperty('--rp-text', theme.text);
    root.style.setProperty('--rp-text-bright', theme.text_bright);
    root.style.setProperty('--tts-accent', theme.accent);
    root.style.setProperty('--tts-text', theme.text);
  }, [theme]);

  // ViewState — recreated if persistence mode changes
  const viewStateRef = React.useRef(null);
  const [viewState, setViewState] = React.useState(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const backend = pickBackend(config.persistence, config.feed);

    // For the embed, we bundle viewState directly rather than relying on window
    const vs = createViewState({
      backend,
      corpusId: feedData.feed_url || feedData.home_page_url || 'corpus',
      layoutVersion: LAYOUT_VERSION,
    });
    viewStateRef.current = vs;
    vs.ready().then(() => {
      vs.prune((feedData.items || []).map((i) => i.id));
      if (vs.state.layout === 'timeline') vs.setLayout('force');
      setViewState(vs);
      setHydrated(true);
    });
  }, [config.persistence, feedData]);

  // Bump on viewState changes
  const [, bump] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => {
    if (!viewState) return;
    return viewState.subscribe(bump);
  }, [viewState]);

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!features.keyboardShortcuts || !viewState) return;
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta || e.key.toLowerCase() !== 'z') return;
      e.preventDefault();
      if (e.shiftKey) viewState.redo();
      else viewState.undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [features.keyboardShortcuts, viewState]);

  const [selectedArticle, setSelectedArticle] = React.useState(null);
      const [targetParagraph, setTargetParagraph] = React.useState(null);

  // Computed derived state
  
      React.useEffect(function () {
        function onHashChange() {
          const hash = window.location.hash;
          if (hash.startsWith('#read=')) {
            const parts = hash.substring(6).split('&p=');
            const id = parts[0];
            const p = parts[1] ? parseInt(parts[1], 10) : null;
            // The items are in feed.items (or feedData.items)
            const items = typeof feed !== 'undefined' ? (feed.items || []) : (typeof feedData !== 'undefined' ? (feedData.items || []) : []);
            const item = items.find(i => (i.id === decodeURIComponent(id)) || (i.url === decodeURIComponent(id)));
            if (item) {
              if (viewState) {
                viewState.markSeen(item.id);
              }
              setSelectedArticle(item);
              if (p !== null && !isNaN(p)) {
                setTargetParagraph(p);
              } else {
                setTargetParagraph(null);
              }
            }
          }
        }
        window.addEventListener('hashchange', onHashChange);
        onHashChange();
        return function () { window.removeEventListener('hashchange', onHashChange); };
      }, [typeof feed !== 'undefined' ? feed : feedData, viewState]);
  
      const hiddenSources = React.useMemo(() => {
    return viewState ? new Set(viewState.state.hiddenSources) : new Set();
  }, [viewState?.state?.hiddenSources]);

  const toggleSource = React.useCallback((sourceId) => {
    if (viewState) viewState.toggleSource(sourceId);
  }, [viewState]);

  const colorOverrides = React.useMemo(() => {
    if (!viewState) return {};
    const graphColors = viewState.graphColors();
    const keyToVar = {
      draft: '--nv-draft', published: '--nv-published', tag: '--gv-tag-color',
      topology: '--gv-topology-color', placeholder: '--gv-placeholder-color',
    };
    const out = {};
    for (const key of Object.keys(keyToVar)) {
      if (graphColors[key]) out[keyToVar[key]] = graphColors[key];
    }
    return out;
  }, [viewState?.state?.graphColors]);

  // Config update handler
  const handleConfigUpdate = React.useCallback((partial) => {
    setConfig((prev) => deepMerge(prev, partial));
  }, []);

  const handleConfigReset = React.useCallback(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  // TTS mount watcher
  React.useEffect(() => {
    if (!features.tts) return;
    const observer = new MutationObserver(() => {
      const ttsMount = document.getElementById('tts-mount-point');
      if (ttsMount && !ttsMount.dataset.mounted) {
        ttsMount.dataset.mounted = 'true';
        const ttsRoot = ReactDOM.createRoot(ttsMount);
        const readerBody = document.querySelector('[data-tts-target]');
        const ref = { current: readerBody };
        ttsRoot.render(React.createElement(TTS, { targetRef: ref }));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [features.tts]);

  if (!hydrated) return null;

  return (
    <>
      {/* The graph — always on */}
      <GraphViewer
        feedData={feedData}
        layout={viewState ? viewState.state.layout : 'force'}
        timeAxis={viewState ? viewState.state.timeAxis : { on: false }}
        graphSettings={settings.graph || {}}
        onNodeSelect={(article) => {
          if (features.readerPanel) {
            if (article && article.originalItem && viewState) {
              viewState.markSeen(article.originalItem.id);
            }
            setSelectedArticle(article);
          }
        }}
        hiddenSources={hiddenSources}
        viewState={viewState}
        colorOverrides={colorOverrides}
      />

      {/* Feed sources bar */}
      {features.feedBar && (
        <FeedZ
          sources={feedData._sources || []}
          hiddenSources={hiddenSources}
          onToggleSource={toggleSource}
          viewState={viewState}
          showAddButton={features.addFeed}
        />
      )}

      {/* Layout controls */}
      {features.layoutControls && viewState && (
        <LayoutControls viewState={viewState} />
      )}

      {/* Dimensions controls */}
      {features.dimensions && viewState && (
        <DimensionsControls viewState={viewState} />
      )}

      {/* Undo/redo */}
      {features.undoRedo && viewState && (
        <HistoryControls viewState={viewState} />
      )}

      {/* Color settings */}
      {features.colorSettings && viewState && (
        <Settings viewState={viewState} />
      )}

      {/* Config panel */}
      {features.configPanel && (
        <ConfigPanel
          config={config}
          onUpdate={handleConfigUpdate}
          onReset={handleConfigReset}
        />
      )}

      {/* Reader panel */}
      {features.readerPanel && (
        <ReaderPanel
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          settings={settings}
          viewState={viewState}
          targetParagraph={targetParagraph}
        />
      )}
    </>
  );
}

// ── Inline layout/dimensions/history controls ────────────────────────────────
// These are duplicated from generate-index.js because that file generates
// them as inline <script> content. Here they're proper React components.

const LAYOUTS = [
  { id: 'force', label: 'cluster', title: 'Force-directed: related pieces attract' },
  { id: 'radial', label: 'ring', title: 'Radial: pieces on the rim, tags in the middle' },
];

function LayoutControls({ viewState }) {
  const [, bump] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => viewState.subscribe(bump), [viewState]);
  const active = viewState.state.layout;

  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const dwellTimer = React.useRef(null);
  const DWELL_MS = 350;

  function clearDwell() {
    if (dwellTimer.current) { clearTimeout(dwellTimer.current); dwellTimer.current = null; }
  }
  function startDwell() {
    clearDwell();
    dwellTimer.current = setTimeout(() => setPopoverOpen(true), DWELL_MS);
  }
  function closePopover() { clearDwell(); setPopoverOpen(false); }

  React.useEffect(() => clearDwell, []);

  const RESET_ACTIONS = [
    { icon: '⊞', label: 'Zoom to Fit', event: 'graph:zoom-to-fit', title: 'Reset zoom and pan to frame all nodes' },
    { icon: '⊘', label: 'Unpin All', event: 'graph:unpin-all', title: 'Release all dragged nodes, re-run simulation' },
    { icon: '▣', label: 'Reset Sizes', event: 'graph:reset-sizes', title: 'Return all cards to their default dimensions' },
    { icon: '×', label: 'Reset Layout', event: 'graph:reset-layout', title: 'Completely clear remembered positions and reset layout' },
  ];

  const popoverBtnStyle = {
    border: 0, borderRadius: '5px', padding: '5px 9px',
    background: 'transparent', cursor: 'pointer',
    color: 'rgba(255,255,255,0.72)', font: '11px/1.3 system-ui, sans-serif',
    display: 'flex', alignItems: 'center', gap: '6px',
    width: '100%', textAlign: 'left', whiteSpace: 'nowrap',
  };

  const popover = !popoverOpen ? null : (
    <div
      onMouseEnter={clearDwell}
      onMouseLeave={closePopover}
      style={{
        position: 'absolute', bottom: '100%', left: 0, marginBottom: '6px',
        background: 'rgba(20,22,30,0.92)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)', borderRadius: '8px',
        padding: '4px', display: 'flex', flexDirection: 'column', gap: '2px',
        zIndex: 50, minWidth: '130px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {RESET_ACTIONS.map((a) => (
        <button
          key={a.event}
          title={a.title}
          onClick={() => { window.dispatchEvent(new CustomEvent(a.event)); closePopover(); }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          style={popoverBtnStyle}
        >
          <span style={{ fontSize: '13px', opacity: 0.6 }}>{a.icon}</span>
          <span>{a.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', bottom: '14px', left: '92px',
      display: 'flex', gap: '4px', zIndex: 40, alignItems: 'center',
      background: 'rgba(20,22,30,0.72)', backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.14)', borderRadius: '9px', padding: '3px',
    }}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        {popover}
        <span
          onMouseEnter={startDwell}
          onMouseLeave={() => { if (!popoverOpen) clearDwell(); else closePopover(); }}
          onTouchStart={(e) => { e.preventDefault(); startDwell(); }}
          onTouchEnd={() => { if (!popoverOpen) clearDwell(); }}
          style={{
            font: '10px/1 system-ui, sans-serif', letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: popoverOpen ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.32)',
            padding: '0 5px 0 6px', cursor: 'default', transition: 'color 0.15s ease',
          }}
        >
          layout
        </span>
      </span>
      {LAYOUTS.map((l) => {
        const on = active === l.id;
        return (
          <button
            key={l.id}
            title={l.title}
            onClick={() => { if (!on) viewState.setLayout(l.id); }}
            style={{
              border: 0, borderRadius: '6px', padding: '5px 10px',
              cursor: on ? 'default' : 'pointer',
              background: on ? 'rgba(255,255,255,0.14)' : 'transparent',
              color: on ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)',
              font: '12px/1 system-ui, sans-serif', letterSpacing: '0.02em',
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

function DimensionsControls({ viewState }) {
  const [, bump] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => viewState.subscribe(bump), [viewState]);
  const axis = viewState.timeAxis();

  // One rail at a time. Clicking the active dimension turns the rail off;
  // clicking another switches the rail to it.
  const pick = (dim) => {
    const current = axis.dimension || 'time';
    if (axis.on && current === dim) viewState.setTimeAxis({ on: false });
    else viewState.setTimeAxis({ on: true, dimension: dim });
  };
  const GRANULARITIES = ['auto', 'day', 'week', 'month', 'year'];
  const cycleGranularity = () => {
    const i = GRANULARITIES.indexOf(axis.granularity || 'auto');
    viewState.setTimeAxis({ granularity: GRANULARITIES[(i + 1) % GRANULARITIES.length] });
  };
  const isOn = (dim) => axis.on && (axis.dimension || 'time') === dim;

  function dimBtn(key, label, isActive, onClick, title) {
    return (
      <button
        key={key}
        title={title}
        onClick={onClick}
        style={{
          border: 0, borderRadius: '6px', padding: '5px 9px', cursor: 'pointer',
          background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
          color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)',
          font: '12px/1 system-ui, sans-serif',
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '14px', right: '14px',
      display: 'flex', gap: '2px', zIndex: 40, alignItems: 'center',
      background: 'rgba(20,22,30,0.72)', backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.14)', borderRadius: '9px', padding: '3px',
    }}>
      <span style={{
        font: '10px/1 system-ui, sans-serif', letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)',
        padding: '0 7px 0 4px',
      }}>
        dimensions
      </span>
      {dimBtn('time', 'published', isOn('time'), () => pick('time'), 'Published date')}
      {dimBtn('commits', 'commits', isOn('commits'), () => pick('commits'), 'Edit history: one link per commit bucket')}
      {dimBtn('narrative', 'narrative', isOn('narrative'), () => pick('narrative'), 'Narrative position: reading order, 0 to 1')}
      {dimBtn('chronology', 'chronology', isOn('chronology'), () => pick('chronology'), 'Chronological position in story-world time')}
      {(isOn('chronology') || isOn('commits'))
        ? dimBtn('granularity', '\u00b7 ' + (axis.granularity || 'auto'), false, cycleGranularity, 'Bucket size: auto, day, week, month, year')
        : null}
    </div>
  );
}

function HistoryControls({ viewState }) {
  const [, bump] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => viewState.subscribe(bump), [viewState]);

  function btn(label, title, enabled, onClick) {
    return (
      <button
        title={title}
        disabled={!enabled}
        onClick={onClick}
        style={{
          width: '30px', height: '30px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(20,22,30,0.72)',
          color: enabled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)',
          cursor: enabled ? 'pointer' : 'default',
          font: '15px/1 system-ui, sans-serif',
          backdropFilter: 'blur(6px)',
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '14px', left: '14px',
      display: 'flex', gap: '6px', zIndex: 40,
    }}>
      {btn('\u21A9', 'Undo (Cmd+Z)', viewState.canUndo, () => viewState.undo())}
      {btn('\u21AA', 'Redo (Cmd+Shift+Z)', viewState.canRedo, () => viewState.redo())}
    </div>
  );
}

// ── Public API ───────────────────────────────────────────────────────────────

const PostPipe = {
  /**
   * Initialize the post-pipe viewer inside a container element.
   *
   * @param {string|Element} selector  CSS selector or DOM element
   * @param {Object}         config    Configuration object
   * @param {string}         config.feed           URL to feed.json (default: './feed.json')
   * @param {Object}         config.features       Feature toggle map
   * @param {Object}         config.theme          Theme color overrides
   * @param {string}         config.persistence    'localStorage' | 'memory' | 'none'
   * @param {Object}         config.settings       Full settings.json equivalent
   * @returns {Promise<{ unmount: Function }>}
   */
  async init(selector, config = {}) {
    const container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!container) {
      throw new Error(`[PostPipe] Container not found: ${selector}`);
    }

    // Apply base styles to the container
    if (!container.style.position || container.style.position === 'static') {
      container.style.position = 'relative';
    }
    container.style.overflow = 'hidden';
    if (!container.style.width) container.style.width = '100%';
    if (!container.style.height) container.style.height = '100vh';
    container.style.background = (config.theme && config.theme.bg) || DEFAULT_THEME.bg;

    // Set up TTS config on window (for tts.js which reads it)
    window.TTS_CONFIG = window.TTS_CONFIG || {
      exposedEngines: ['browser'],
      defaultEngine: 'browser',
      kokoroMode: 'wasm',
      kokoroHost: '',
      kokoroVoices: [],
    };

    // Fetch the feed
    const feedUrl = config.feed || './feed.json';
    const res = await fetch(feedUrl + '?v=' + Date.now());
    if (!res.ok) throw new Error(`[PostPipe] Failed to load feed: HTTP ${res.status}`);
    const feedData = await res.json();

    // Mount
    const root = ReactDOM.createRoot(container);
    root.render(
      React.createElement(EmbedApp, {
        initialConfig: { ...config, feed: feedUrl },
        feedData,
      })
    );

    return {
      unmount() {
        root.unmount();
      },
    };
  },

  // Re-export components for advanced users who want to compose their own layout
  GraphViewer,
  ReaderPanel,
  TTS,
  FeedZ,
  Settings,
  ConfigPanel,
  React,
  ReactDOM,
};

// Expose globally — the UMD wrapper assigns the whole module namespace to
// window.PostPipe, but individual named exports are properties on it.
// This explicit assignment ensures `PostPipe.init()` works directly.
if (typeof window !== 'undefined') {
  window.PostPipe = PostPipe;
}

export { PostPipe, GraphViewer, ReaderPanel, TTS, FeedZ, Settings, ConfigPanel, React, ReactDOM };

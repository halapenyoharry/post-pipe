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
 * init() resolves to { unmount, openContainer(id), closeContainer(id),
 * toggleContainer(id), openAllContainers(), closeAllContainers(),
 * getContainerState() }. The generated page exposes the same methods as
 * window.PostPipeGraph, and both answer the window events
 * graph:open-container / graph:close-container / graph:toggle-container
 * ({ detail: { id } }) and graph:open-all-containers / graph:close-all-containers.
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
import { showContainerCount } from './components/GraphViewer/containerCount';
import { Settings } from './components/Settings';
import { TimeOfDay } from './components/TimeOfDay/TimeOfDay';
import { Toolbar } from './components/Toolbar/Toolbar';
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
      labelMinFontSize: 14, labelMaxFontSize: 26,
      imageMarkSize: 22,
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

const LAYOUT_VERSION = 'per-layout-positions-5';

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

function EmbedApp({ initialConfig, feedData, graphApiRef }) {
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

  const [focusedItem, setFocusedItem] = React.useState(null);
      const [targetParagraph, setTargetParagraph] = React.useState(null);

  // Computed derived state
  
      React.useEffect(function () {
        function onHashChange() {
          const hash = window.location.hash;
          if (hash.startsWith('#read=')) {
            const parts = hash.substring(6).split('&p=');
            const id = parts[0];
            const p = parts[1] ? parseInt(parts[1], 10) : null;
            const items = typeof feed !== 'undefined' ? (feed.items || []) : (typeof feedData !== 'undefined' ? (feedData.items || []) : []);
            const item = items.find(i => (i.id === decodeURIComponent(id)) || (i.url === decodeURIComponent(id)));
            if (item) {
              if (viewState) viewState.markSeen(item.id);
              setSelectedArticle(item);
              setTargetParagraph(p !== null && !isNaN(p) ? p : null);
            }
          } else {
            setSelectedArticle(null);
            setTargetParagraph(null);
          }
        }
        window.addEventListener('hashchange', onHashChange);
        onHashChange();
        
        const onKeyDown = (e) => {
          if (e.key === 'Escape') {
             history.replaceState(null, '', window.location.pathname + window.location.search);
             window.dispatchEvent(new Event('hashchange'));
          }
        };
        window.addEventListener('keydown', onKeyDown);
        const onResetLayout = () => {
             history.replaceState(null, '', window.location.pathname + window.location.search);
             window.dispatchEvent(new Event('hashchange'));
        };
        window.addEventListener('graph:reset-layout', onResetLayout);
        
        return function () { 
          window.removeEventListener('hashchange', onHashChange);
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('graph:reset-layout', onResetLayout);
        };
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
      {/* The background follows the time of day (settings.theme.timeOfDay) */}
      <TimeOfDay item={selectedArticle || focusedItem} settings={settings} viewState={viewState} />

      {/* The graph — always on */}
      <GraphViewer
        feedData={feedData}
        layout={viewState ? viewState.state.layout : 'force'}
        timeAxis={viewState ? viewState.state.timeAxis : { on: false }}
        graphSettings={settings.graph || {}}
        onNodeSelect={(article) => {
          if (!features.readerPanel) return;
          if (!article) {
             history.replaceState(null, '', window.location.pathname + window.location.search);
             window.dispatchEvent(new Event('hashchange'));
             return;
          }
          if (article && article.originalItem) {
            if (viewState) viewState.markSeen(article.originalItem.id);
            const id = encodeURIComponent(article.originalItem.id);
            if (window.location.hash === '#read=' + id) {
               history.replaceState(null, '', window.location.pathname + window.location.search);
            } else {
               history.pushState(null, '', '#read=' + id);
            }
            window.dispatchEvent(new Event('hashchange'));
          }
        }}
        hiddenSources={hiddenSources}
        viewState={viewState}
        colorOverrides={colorOverrides}
        apiRef={graphApiRef}
        onNodeFocus={setFocusedItem}
      />

      {/* Feed sources bar */}
      {features.feedBar && (
        <FeedZ
          sources={feedData._sources || []}
          hiddenSources={hiddenSources}
          onToggleSource={toggleSource}
          viewState={viewState}
          showAddButton={features.addFeed}
          showCount={showContainerCount(settings.graph)}
        />
      )}

      {/* The bottom bar: undo/redo, layout, dimensions, view actions */}
      {viewState && (features.layoutControls || features.dimensions || features.undoRedo) && (
        <Toolbar
          viewState={viewState}
          show={{ history: !!features.undoRedo, layout: !!features.layoutControls, dimensions: !!features.dimensions }}
        />
      )}

      {/* Color settings */}
      {features.colorSettings && viewState && (
        <Settings
          viewState={viewState}
          feedData={feedData}
          subject={selectedArticle || focusedItem}
          readerOpen={selectedArticle ? selectedArticle.id : null}
        />
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
          onClose={() => {
            if (window.location.hash.startsWith('#read=')) {
              history.pushState(null, '', window.location.pathname + window.location.search);
              window.dispatchEvent(new Event('hashchange'));
            }
            setSelectedArticle(null);
          }}
          settings={settings}
          viewState={viewState}
          targetParagraph={targetParagraph}
          feedData={feedData}
          onNavigate={(item) => {
            if (!item) return;
            if (viewState) viewState.markSeen(item.id);
            history.pushState(null, '', '#read=' + encodeURIComponent(item.id));
            window.dispatchEvent(new Event('hashchange'));
          }}
        />
      )}
    </>
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
    const browserTts = (config.settings && config.settings.tts && config.settings.tts.engines
      && config.settings.tts.engines.browser) || {};
    window.TTS_CONFIG = window.TTS_CONFIG || {
      exposedEngines: ['browser'],
      defaultEngine: 'browser',
      preferredVoices: browserTts.preferredVoices || [],
      maxVoices: browserTts.maxVoices || 5,
    };

    // Fetch the feed
    const feedUrl = config.feed || './feed.json';
    const res = await fetch(feedUrl + '?v=' + Date.now());
    if (!res.ok) throw new Error(`[PostPipe] Failed to load feed: HTTP ${res.status}`);
    const feedData = await res.json();

    // Mount
    const graphApiRef = { current: null };
    const root = ReactDOM.createRoot(container);
    root.render(
      React.createElement(EmbedApp, {
        initialConfig: { ...config, feed: feedUrl },
        feedData,
        graphApiRef,
      })
    );

    const call = (name) => (...args) => (graphApiRef.current ? graphApiRef.current[name](...args) : undefined);
    return {
      unmount() {
        root.unmount();
      },
      // Containers: open, close, toggle one by id, or all; and read the state.
      openContainer: call('openContainer'),
      closeContainer: call('closeContainer'),
      toggleContainer: call('toggleContainer'),
      openAllContainers: call('openAllContainers'),
      closeAllContainers: call('closeAllContainers'),
      getContainerState: () => (graphApiRef.current ? graphApiRef.current.getContainerState() : {}),
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

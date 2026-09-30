import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ConfigPanel.module.css';

/**
 * ConfigPanel — the runtime configuration surface for the embeddable viewer.
 *
 * The existing Settings component handles graph *colors*. This panel handles
 * everything else: which features are visible, how persistence works, the
 * feed URL, and theme-level overrides. It lives alongside Settings, not
 * instead of it.
 *
 * Props:
 *   config      — the current PostPipeConfig object
 *   onUpdate    — (partialConfig) => void; merges into the live config
 *   onReset     — () => void; resets to initial defaults
 *   visible     — boolean; whether the trigger button itself is shown
 */

// ── Default feature map ──────────────────────────────────────────────────────

export const DEFAULT_FEATURES = {
  readerPanel:     true,
  tts:             true,
  feedBar:         true,
  addFeed:         true,
  layoutControls:  true,
  dimensions:      true,
  undoRedo:        true,
  colorSettings:   true,
  configPanel:     true,
  keyboardShortcuts: true,
};

const FEATURE_META = [
  { key: 'readerPanel',      label: 'Reader Panel',       sub: 'Click a node to read the full article' },
  { key: 'tts',              label: 'Text-to-Speech',     sub: 'Read-aloud toolbar inside the reader' },
  { key: 'feedBar',          label: 'Feed Sources Bar',   sub: 'Pill bar to show/hide feed sources' },
  { key: 'addFeed',          label: 'Add Feed (+)',        sub: 'Button to add new RSS/Atom/JSON feeds' },
  { key: 'layoutControls',   label: 'Layout Controls',    sub: 'Cluster / ring layout picker' },
  { key: 'dimensions',       label: 'Dimensions',         sub: 'Time, narrative, chronology overlays' },
  { key: 'undoRedo',         label: 'Undo / Redo',        sub: 'History controls for arrangement' },
  { key: 'colorSettings',    label: 'Color Settings',     sub: 'Graph color scheme (gear icon)' },
  { key: 'keyboardShortcuts', label: 'Keyboard Shortcuts', sub: 'Cmd+Z undo, escape to close, etc.' },
];

const THEME_FIELDS = [
  { key: 'bg',           label: 'Background' },
  { key: 'surface',      label: 'Surface' },
  { key: 'accent',       label: 'Accent' },
  { key: 'text',         label: 'Text' },
  { key: 'text_bright',  label: 'Text Bright' },
];

const PERSISTENCE_OPTIONS = [
  { value: 'localStorage', label: 'Browser (localStorage)' },
  { value: 'memory',       label: 'Session only (memory)' },
  { value: 'none',         label: 'Disabled' },
];

// ── Component ────────────────────────────────────────────────────────────────

export function ConfigPanel({ config, onUpdate, onReset, visible = true }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSnippet, setShowSnippet] = useState(false);
  const fileInputRef = useRef(null);

  // Swipe-to-dismiss state
  const touchStartY = useRef(null);
  const panelRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    // If scrolling inside the panel content, don't dismiss immediately unless at top
    if (panelRef.current && panelRef.current.scrollTop > 0) return;

    if (diff > 80) { // Swipe down threshold
      setOpen(false);
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const features = { ...DEFAULT_FEATURES, ...(config.features || {}) };
  const theme = config.theme || {};

  const setFeature = useCallback((key, value) => {
    onUpdate({
      features: { ...features, [key]: value },
    });
  }, [features, onUpdate]);

  const setThemeColor = useCallback((key, value) => {
    onUpdate({
      theme: { ...theme, [key]: value },
    });
  }, [theme, onUpdate]);

  const setPersistence = useCallback((value) => {
    onUpdate({ persistence: value });
  }, [onUpdate]);

  const setFeedUrl = useCallback((value) => {
    onUpdate({ feed: value || undefined });
  }, [onUpdate]);

  // Export config as JSON
  const handleExport = useCallback(() => {
    const snippet = buildEmbedSnippet(config);
    navigator.clipboard.writeText(snippet).then(() => {
      setToast('Copied to clipboard');
      setTimeout(() => setToast(null), 1800);
    }).catch(() => {
      // Clipboard denied; toggle the snippet view so they can copy manually
      setShowSnippet(true);
    });
  }, [config]);

  // Import config from JSON file
  const handleImport = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        onUpdate(parsed);
        setToast('Config imported');
        setTimeout(() => setToast(null), 1800);
      } catch (_) {
        setToast('Invalid JSON');
        setTimeout(() => setToast(null), 2500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [onUpdate]);

  if (!visible) return null;

  return (
    <>
      <button
        className={`${styles.triggerBtn} ${open ? styles.open : ''}`}
        onClick={() => setOpen((o) => !o)}
        title="Configure viewer"
        aria-label="Configure viewer"
      >
        ⚡
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div 
            className={styles.panel} 
            role="dialog" 
            aria-label="Viewer Configuration"
            ref={panelRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.header}>
              <span className={styles.panelTitle}>Viewer Configuration</span>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {/* ── Features ────────────────────────────────────────────── */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Features</div>
              {FEATURE_META.map((f) => (
                <Toggle
                  key={f.key}
                  label={f.label}
                  sub={f.sub}
                  checked={features[f.key]}
                  onChange={(v) => setFeature(f.key, v)}
                />
              ))}
            </div>

            {/* ── Data ────────────────────────────────────────────────── */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Data</div>
              <div className={styles.textInputRow}>
                <input
                  type="url"
                  className={styles.textInput}
                  placeholder="Feed URL (default: ./feed.json)"
                  value={config.feed || ''}
                  onChange={(e) => setFeedUrl(e.target.value)}
                />
              </div>
              <div className={styles.selectRow}>
                <span className={styles.toggleLabel}>Persistence</span>
                <select
                  className={styles.select}
                  value={config.persistence || 'localStorage'}
                  onChange={(e) => setPersistence(e.target.value)}
                >
                  {PERSISTENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Theme ───────────────────────────────────────────────── */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Theme</div>
              {THEME_FIELDS.map((f) => (
                <div key={f.key} className={styles.colorRow}>
                  <span className={styles.colorLabel}>{f.label}</span>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={theme[f.key] || getDefaultThemeColor(f.key)}
                    onChange={(e) => setThemeColor(f.key, e.target.value)}
                  />
                  <span className={styles.colorHex}>
                    {theme[f.key] || getDefaultThemeColor(f.key)}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Actions ─────────────────────────────────────────────── */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Actions</div>
              <div className={styles.actions}>
                <button className={styles.actionBtnAccent} onClick={handleExport}>
                  Export Config
                </button>
                <button className={styles.actionBtn} onClick={handleImport}>
                  Import Config
                </button>
                <button className={styles.actionBtnDanger} onClick={onReset}>
                  Reset All
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {showSnippet && (
                <div className={styles.snippet}>
                  <code className={styles.snippetCode}>
                    {buildEmbedSnippet(config)}
                  </code>
                </div>
              )}
              {!showSnippet && (
                <button
                  className={styles.actionBtn}
                  onClick={() => setShowSnippet(true)}
                  style={{ marginTop: '6px', width: '100%' }}
                >
                  Show Embed Snippet
                </button>
              )}
              {showSnippet && (
                <button
                  className={styles.actionBtn}
                  onClick={() => setShowSnippet(false)}
                  style={{ marginTop: '4px', width: '100%' }}
                >
                  Hide Snippet
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}


// ── Toggle sub-component ─────────────────────────────────────────────────────

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>
        {label}
        {sub && <span className={styles.toggleSub}>{sub}</span>}
      </span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          className={styles.switchInput}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={styles.switchTrack} />
      </label>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultThemeColor(key) {
  const defaults = {
    bg: '#1a1a2e',
    surface: '#0a0e1a',
    accent: '#64ffda',
    text: '#a8b2d1',
    text_bright: '#ccd6f6',
  };
  return defaults[key] || '#888888';
}

function buildEmbedSnippet(config) {
  // Build a clean config, omitting defaults
  const clean = {};
  if (config.feed && config.feed !== './feed.json') {
    clean.feed = config.feed;
  }
  if (config.persistence && config.persistence !== 'localStorage') {
    clean.persistence = config.persistence;
  }
  if (config.features) {
    const nonDefaults = {};
    for (const [k, v] of Object.entries(config.features)) {
      if (v !== DEFAULT_FEATURES[k]) nonDefaults[k] = v;
    }
    if (Object.keys(nonDefaults).length) clean.features = nonDefaults;
  }
  if (config.theme && Object.keys(config.theme).length) {
    clean.theme = config.theme;
  }

  const configStr = Object.keys(clean).length
    ? '\n    ' + JSON.stringify(clean, null, 2).split('\n').join('\n    ') + '\n  '
    : '';

  return [
    `<div id="post-pipe"></div>`,
    `<script src="post-pipe.embed.js"></script>`,
    `<script>`,
    `  PostPipe.init('#post-pipe', {${configStr}});`,
    `</script>`,
  ].join('\n');
}

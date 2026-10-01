import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { readerFonts } from '../../lib/readerSettings';

/**
 * Settings — a compact popover (never full-screen; the canvas must always
 * stay visible) for the graph's color scheme. A handful of presets cover the
 * common cases so nobody has to configure five colors from scratch; any
 * preset can then be nudged one field at a time without losing the rest of
 * it. Values persist through viewState, the same store the graph's own
 * arrangement lives in.
 */

const ENGINE_COLORS = {
  draft: '#555555', published: '#2ecc71', tag: '#f39c12',
  topology: '#9b59b6', placeholder: '#7f8c8d',
};

// "Default" means the site's own theme (settings.theme), not the engine's.
function themeColors() {
  const t = (typeof window !== 'undefined' && window.SETTINGS && window.SETTINGS.theme) || {};
  return {
    ...ENGINE_COLORS,
    ...(t.node_draft ? { draft: t.node_draft } : {}),
    ...(t.node_published ? { published: t.node_published } : {}),
    ...(t.tag_color ? { tag: t.tag_color } : {}),
  };
}

// Which of the five colors this corpus actually draws. A card inside a
// container takes the container's color, so draft/published only count for
// cards outside one; tag, topology, and placeholder only exist if there are
// such nodes. Offering a picker that changes nothing on screen is the thing
// this avoids.
export function colorKeysInUse(feed) {
  if (!feed || !Array.isArray(feed.items)) return null;
  const containers = feed.containers || [];
  const inContainer = (item) => containers.some((c) => c.parent && c.tag && (item.tags || []).includes(c.tag));
  const used = new Set();
  const ids = new Set(feed.items.map((i) => i.id));
  for (const item of feed.items) {
    if (inContainer(item)) continue;
    used.add(item._status === 'published' ? 'published' : 'draft');
  }
  for (const e of feed.edges || []) {
    if (e.layer === 'tag') used.add('tag');
    else if (e.layer === 'topology') used.add('topology');
    else if (e.layer === 'authored' && !ids.has(e.target)) used.add('placeholder');
  }
  return used;
}

const DEFAULT_COLORS = themeColors();

const PRESETS = [
  { id: 'default', label: 'Default', colors: DEFAULT_COLORS },
  {
    id: 'highContrast', label: 'High Contrast',
    colors: { draft: '#8a8a8a', published: '#00ff9d', tag: '#ffb700', topology: '#c77dff', placeholder: '#b0b0b0' },
  },
  {
    id: 'warm', label: 'Warm',
    colors: { draft: '#6b5b4f', published: '#e07a5f', tag: '#f2cc8f', topology: '#d88c9a', placeholder: '#9c8b7a' },
  },
  {
    id: 'cool', label: 'Cool',
    colors: { draft: '#4a6fa5', published: '#00d4ff', tag: '#5eead4', topology: '#818cf8', placeholder: '#64748b' },
  },
];

const FIELDS = [
  { key: 'draft', label: 'Draft' },
  { key: 'published', label: 'Published' },
  { key: 'tag', label: 'Tags' },
  { key: 'topology', label: 'Topology' },
  { key: 'placeholder', label: 'Placeholder' },
];

// One reading aid: an on/off switch with a line saying what it does.
function ReadingAid({ viewState, aid, label, hint }) {
  const on = Boolean(viewState.readerAid && viewState.readerAid(aid));
  return (
    <button
      className={`${styles.aidBtn} ${on ? styles.aidOn : ''}`}
      role="switch"
      aria-checked={on}
      data-aid={aid}
      onClick={() => viewState.setReaderAid && viewState.setReaderAid(aid, !on)}
    >
      <span className={styles.aidLabel}>{label}<span className={styles.aidState}>{on ? 'on' : 'off'}</span></span>
      <span className={styles.aidHint}>{hint}</span>
    </button>
  );
}

export function Settings({ viewState, feedData }) {
  const [open, setOpen] = useState(false);
  const [, bump] = useState(0);

  useEffect(() => {
    if (!viewState) return;
    return viewState.subscribe(() => bump((n) => n + 1));
  }, [viewState]);

  // The paragraph style is applied as two attributes on <html>, so the reader
  // pane and every open node read the same choices from one place.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const indent = viewState.paragraphIndent ? viewState.paragraphIndent() : false;
      const space = viewState.paragraphSpace ? viewState.paragraphSpace() : true;
      document.documentElement.setAttribute('data-pp-indent', indent ? 'on' : 'off');
      document.documentElement.setAttribute('data-pp-space', space ? 'on' : 'off');
      document.documentElement.removeAttribute('data-pp-paragraph');
      const font = viewState.readerAid ? viewState.readerAid('font') : 'default';
      document.documentElement.setAttribute('data-pp-font', font);
    }
  });

  // The reader has its own settings button (the graph's sits under the
  // reader on a phone); it toggles the same panel.
  useEffect(() => {
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener('postpipe:toggle-settings', onToggle);
    return () => window.removeEventListener('postpipe:toggle-settings', onToggle);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!viewState) return null;

  const fonts = readerFonts(typeof window !== 'undefined' ? window.SETTINGS : null);
  const font = viewState.readerAid ? viewState.readerAid('font') : 'default';
  const current = { ...DEFAULT_COLORS, ...viewState.graphColors() };
  const activeProfile = viewState.colorProfileId();
  const inUse = colorKeysInUse(feedData);
  const fields = inUse ? FIELDS.filter((f) => inUse.has(f.key)) : FIELDS;

  return (
    <>
      <button
        className={styles.gearBtn}
        onClick={() => setOpen((o) => !o)}
        title="Settings"
        aria-label="Settings"
      >
        ⚙
      </button>

      {open && (
        <>
          {/* Invisible click-catcher — closes the popover on an outside
              click without ever covering the canvas itself. */}
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.popover} role="dialog" aria-label="Settings">
            <div className={styles.header}>
              <span className={styles.title}>{fields.length ? 'Color Scheme' : 'Settings'}</span>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>

            {fields.length > 0 && (<>

            <div className={styles.presetRow}>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.presetBtn} ${activeProfile === p.id ? styles.presetActive : ''}`}
                  onClick={() => viewState.applyColorProfile(p.id, p.colors)}
                  title={p.label}
                >
                  <span className={styles.presetSwatches}>
                    {fields.map((f) => (
                      <span key={f.key} className={styles.miniSwatch} style={{ background: p.colors[f.key] }} />
                    ))}
                  </span>
                  <span className={styles.presetLabel}>{p.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.hint}>Pick a preset, then adjust any color below if you like.</div>

            <div className={styles.fieldList}>
              {fields.map((f) => (
                <label key={f.key} className={styles.fieldRow}>
                  <span className={styles.fieldLabel}>{f.label}</span>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={current[f.key]}
                    onChange={(e) => viewState.setGraphColor(f.key, e.target.value)}
                  />
                  <span className={styles.hexLabel}>{current[f.key]}</span>
                </label>
              ))}
            </div>
            </>)}

            {feedData && Array.isArray(feedData.containers) && feedData.containers.length > 0 && (<>
              <div className={styles.hint} style={{ marginTop: '14px' }}>Containers</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={styles.resetBtn}
                  onClick={() => window.dispatchEvent(new CustomEvent('graph:open-all-containers'))}
                >
                  Open all
                </button>
                <button
                  className={styles.resetBtn}
                  onClick={() => window.dispatchEvent(new CustomEvent('graph:close-all-containers'))}
                >
                  Close all
                </button>
              </div>
            </>)}

            <div className={styles.hint} style={{ marginTop: '14px' }}>Paragraphs</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={styles.resetBtn}
                aria-pressed={viewState.paragraphIndent ? viewState.paragraphIndent() : false}
                style={viewState.paragraphIndent && viewState.paragraphIndent() ? { color: '#fff', borderColor: 'rgba(255,255,255,0.6)' } : undefined}
                onClick={() => viewState.setParagraphIndent && viewState.setParagraphIndent(!viewState.paragraphIndent())}
              >
                Indent first line
              </button>
              <button
                className={styles.resetBtn}
                aria-pressed={viewState.paragraphSpace ? viewState.paragraphSpace() : true}
                style={viewState.paragraphSpace && viewState.paragraphSpace() ? { color: '#fff', borderColor: 'rgba(255,255,255,0.6)' } : undefined}
                onClick={() => viewState.setParagraphSpace && viewState.setParagraphSpace(!viewState.paragraphSpace())}
              >
                Space between
              </button>
            </div>

            <div className={styles.hint} style={{ marginTop: '14px' }}>Reading</div>
            <div className={styles.fontRow} role="radiogroup" aria-label="Font">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  role="radio"
                  aria-checked={font === f.id}
                  data-font={f.id}
                  className={`${styles.fontBtn} ${font === f.id ? styles.aidOn : ''}`}
                  style={{ fontFamily: f.family }}
                  onClick={() => viewState.setReaderAid && viewState.setReaderAid('font', f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {fonts.filter((f) => f.license).map((f) => (
              <div key={f.id} className={styles.hint} style={{ marginTop: '4px' }}>
                {f.label} is under the <a className={styles.hintLink} href={`./fonts/${f.license}`} target="_blank" rel="noopener">{f.licenseName}</a>.
              </div>
            ))}
            <div className={styles.aidList}>
              <ReadingAid
                viewState={viewState}
                aid="followAlong"
                label="Follow along"
                hint="Tap or drag through the text to mark the sentence and word you are on."
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {fields.length > 0 && (
                <button
                  className={styles.resetBtn}
                  onClick={() => viewState.applyColorProfile('default', DEFAULT_COLORS)}
                >
                  Reset Colors
                </button>
              )}
              <button
                className={styles.resetBtn}
                style={{ color: '#e74c3c', borderColor: '#e74c3c4d' }}
                onClick={() => {
                  if (confirm('Reset all node positions and layout arrangements?')) {
                    viewState.resetLayout();
                    // Optional: force reload so the graph redraws from scratch
                    window.location.reload();
                  }
                }}
              >
                Reset Layout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

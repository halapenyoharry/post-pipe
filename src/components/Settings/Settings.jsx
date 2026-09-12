import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';

/**
 * Settings — a compact popover (never full-screen; the canvas must always
 * stay visible) for the graph's color scheme. A handful of presets cover the
 * common cases so nobody has to configure five colors from scratch; any
 * preset can then be nudged one field at a time without losing the rest of
 * it. Values persist through viewState, the same store the graph's own
 * arrangement lives in.
 */

const DEFAULT_COLORS = {
  draft: '#555555', published: '#2ecc71', tag: '#f39c12',
  topology: '#9b59b6', placeholder: '#7f8c8d',
};

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

export function Settings({ viewState }) {
  const [open, setOpen] = useState(false);
  const [, bump] = useState(0);

  useEffect(() => {
    if (!viewState) return;
    return viewState.subscribe(() => bump((n) => n + 1));
  }, [viewState]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!viewState) return null;

  const current = { ...DEFAULT_COLORS, ...viewState.graphColors() };
  const activeProfile = viewState.colorProfileId();

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
              <span className={styles.title}>Color Scheme</span>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>

            <div className={styles.presetRow}>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.presetBtn} ${activeProfile === p.id ? styles.presetActive : ''}`}
                  onClick={() => viewState.applyColorProfile(p.id, p.colors)}
                  title={p.label}
                >
                  <span className={styles.presetSwatches}>
                    {FIELDS.map((f) => (
                      <span key={f.key} className={styles.miniSwatch} style={{ background: p.colors[f.key] }} />
                    ))}
                  </span>
                  <span className={styles.presetLabel}>{p.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.hint}>Pick a preset, then adjust any color below if you like.</div>

            <div className={styles.fieldList}>
              {FIELDS.map((f) => (
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

            <button
              className={styles.resetBtn}
              onClick={() => viewState.applyColorProfile('default', DEFAULT_COLORS)}
            >
              Reset to Default
            </button>
          </div>
        </>
      )}
    </>
  );
}

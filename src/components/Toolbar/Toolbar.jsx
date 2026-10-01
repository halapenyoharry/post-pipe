import React, { useEffect, useReducer, useState } from 'react';
import styles from './Toolbar.module.css';
import { dimensionLabels } from '../../lib/dimensionLabels';

/**
 * Toolbar — the one bar along the bottom of the graph.
 *
 * Grouped: history (undo, redo), layout (cluster, ring), dimensions (the
 * time-axis rails), Reset (everything back to the site's defaults), and the
 * finer view actions (zoom to fit, unpin, sizes). A wide screen shows every group in the bar. A phone shows the
 * compact set (history, layout, More) and puts dimensions and the view
 * actions in a sheet one tap away, so nothing overlaps or runs off the edge
 * from 320px up. The bar keeps clear of the safe-area insets.
 *
 * Everything it does goes through viewState or the graph's window events
 * (graph:reset-all, graph:zoom-to-fit, graph:unpin-all, graph:reset-sizes),
 * so the generated page and the embed share it unchanged.
 */

export const LAYOUTS = [
  { id: 'force', label: 'cluster', title: 'Cluster: each container its own path' },
  { id: 'radial', label: 'ring', title: 'Ring: each container its own ring' },
];

// The dimensions, named by settings.dimensions.labels (src/lib/dimensionLabels.js).

const GRANULARITIES = ['auto', 'day', 'week', 'month', 'year'];

const VIEW_ACTIONS = [
  { event: 'graph:zoom-to-fit', label: 'Zoom to fit', title: 'Frame every node' },
  { event: 'graph:unpin-all', label: 'Unpin all', title: 'Release every dragged node' },
  { event: 'graph:reset-sizes', label: 'Reset sizes', title: 'Return every card to its default size' },
];

const fire = (name) => window.dispatchEvent(new CustomEvent(name));

export function Toolbar({ viewState, show = {}, layouts = LAYOUTS, settings }) {
  const DIMENSIONS = dimensionLabels(settings || (typeof window !== 'undefined' ? window.SETTINGS : null));
  const [, bump] = useReducer((n) => n + 1, 0);
  const [moreOpen, setMoreOpen] = useState(false);
  useEffect(() => (viewState ? viewState.subscribe(bump) : undefined), [viewState]);
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMoreOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moreOpen]);
  if (!viewState) return null;

  const showHistory = show.history !== false;
  const showLayout = show.layout !== false;
  const showDimensions = show.dimensions !== false;
  const active = viewState.state.layout;
  const axis = viewState.timeAxis();
  const current = axis.dimension || 'time';

  const pickDimension = (dim) => {
    if (axis.on && current === dim) viewState.setTimeAxis({ on: false });
    else viewState.setTimeAxis({ on: true, dimension: dim });
  };
  const cycleGranularity = () => {
    const i = GRANULARITIES.indexOf(axis.granularity || 'auto');
    viewState.setTimeAxis({ granularity: GRANULARITIES[(i + 1) % GRANULARITIES.length] });
  };
  const hasGranularity = axis.on && (axis.dimension === 'chronology' || axis.dimension === 'commits');

  const dimensionButtons = (
    <>
      {DIMENSIONS.map((d) => {
        const on = axis.on && current === d.id;
        return (
          <button
            key={d.id}
            className={`${styles.seg} ${on ? styles.on : ''}`}
            aria-pressed={on}
            title={d.title}
            onClick={() => pickDimension(d.id)}
          >
            {d.label}
          </button>
        );
      })}
      {hasGranularity && (
        <button className={styles.seg} title="Bucket size: auto, day, week, month, year" onClick={cycleGranularity}>
          · {axis.granularity || 'auto'}
        </button>
      )}
    </>
  );

  return (
    <>
      <div className={styles.bar} role="toolbar" aria-label="Graph controls" data-toolbar>
        {showHistory && (
          <div className={styles.group} data-group="history">
            <button className={styles.icon} title="Undo (Cmd+Z)" aria-label="Undo" disabled={!viewState.canUndo} onClick={() => viewState.undo()}>↩</button>
            <button className={styles.icon} title="Redo (Cmd+Shift+Z)" aria-label="Redo" disabled={!viewState.canRedo} onClick={() => viewState.redo()}>↪</button>
          </div>
        )}

        {showLayout && (
          <div className={styles.group} data-group="layout" role="radiogroup" aria-label="Layout">
            <span className={styles.label}>layout</span>
            {layouts.map((l) => {
              const on = active === l.id;
              return (
                <button
                  key={l.id}
                  className={`${styles.seg} ${on ? styles.on : ''}`}
                  role="radio"
                  aria-checked={on}
                  title={l.title}
                  onClick={() => { if (!on) viewState.setLayout(l.id); }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        )}

        {showDimensions && (
          <div className={`${styles.group} ${styles.wideOnly}`} data-group="dimensions" aria-label="Dimensions">
            <span className={styles.label}>dimensions</span>
            {dimensionButtons}
          </div>
        )}

        <div className={styles.spacer} />

        <div className={styles.group} data-group="view">
          <button
            className={styles.seg}
            title="Reset: layout, zoom, rotation, open and closed containers, and selection, back to how the site starts (Undo brings the arrangement back)"
            data-toolbar-reset
            onClick={() => { setMoreOpen(false); fire('graph:reset-all'); }}
          >
            Reset
          </button>
          <button
            className={`${styles.seg} ${styles.more} ${moreOpen ? styles.on : ''}`}
            aria-expanded={moreOpen}
            aria-controls="pp-toolbar-more"
            title="More: dimensions and view actions"
            aria-label="More"
            data-toolbar-more
            onClick={() => setMoreOpen((o) => !o)}
          >
            <span className={styles.moreText}>More </span><span aria-hidden="true" className={styles.moreMark}>{moreOpen ? '▾' : '▴'}</span>
          </button>
        </div>
      </div>

      {moreOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setMoreOpen(false)} />
          <div className={styles.sheet} id="pp-toolbar-more" role="dialog" aria-label="More graph controls" data-toolbar-sheet>
            {showDimensions && (
              <div className={`${styles.section} ${styles.narrowOnly}`}>
                <div className={styles.sectionTitle}>Dimensions</div>
                <div className={styles.wrapRow}>{dimensionButtons}</div>
              </div>
            )}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>View</div>
              <div className={styles.wrapRow}>
                {VIEW_ACTIONS.map((a) => (
                  <button
                    key={a.event}
                    className={styles.action}
                    title={a.title}
                    onClick={() => { fire(a.event); setMoreOpen(false); }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

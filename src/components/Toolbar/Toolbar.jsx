import React, { useEffect, useReducer, useRef, useState } from 'react';
import styles from './Toolbar.module.css';
import { dimensionLabels, layerLabels, dimensionGroupLabel } from '../../lib/dimensionLabels';
import { VIEW_ACTIONS, RESET_TITLE, hasGranularity as axisHasGranularity, toggleDimension, nextGranularity, menuModel, menuMove } from '../../lib/toolbar';
import { iconBody } from '../../lib/icons';
import { Icon } from '../Icon/Icon';

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
 *
 * placement 'top' (settings.toolbar.position, src/lib/toolbar.js): no bottom
 * bar; the same controls as four icon buttons for the top bar (undo, redo,
 * Reset, and a menu of the dimensions, the view actions and the layout).
 */

export const LAYOUTS = [
  { id: 'force', label: 'cluster', title: 'Cluster: each container its own path' },
  { id: 'radial', label: 'ring', title: 'Ring: each container its own ring' },
];

// The dimensions, named by settings.dimensions.labels (src/lib/dimensionLabels.js).

const fire = (name) => window.dispatchEvent(new CustomEvent(name));

// layers: the edge-layer dimensions that have something to draw, e.g.
// ['readers'] when readers have connected chapters. Each is its own switch.
export function Toolbar({ viewState, show = {}, layouts = LAYOUTS, settings, layers = [], placement = 'bottom' }) {
  if (placement === 'top') return <TopControls viewState={viewState} show={show} layouts={layouts} settings={settings} layers={layers} />;
  return <BottomBar viewState={viewState} show={show} layouts={layouts} settings={settings} layers={layers} />;
}

function BottomBar({ viewState, show, layouts, settings, layers }) {
  const S = settings || (typeof window !== 'undefined' ? window.SETTINGS : null);
  const DIMENSIONS = dimensionLabels(S);
  const GROUP = dimensionGroupLabel(S);
  const GROUP_TITLE = GROUP.charAt(0).toUpperCase() + GROUP.slice(1);
  const LAYER_DIMS = layerLabels(S).filter((d) => layers.includes(d.id));
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

  const pickDimension = (dim) => viewState.setTimeAxis(toggleDimension(axis, dim));
  const cycleGranularity = () => viewState.setTimeAxis({ granularity: nextGranularity(axis.granularity) });
  const hasGranularity = axisHasGranularity(axis);

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
      {LAYER_DIMS.map((d) => {
        const on = viewState.preference(d.id) === true;
        return (
          <button
            key={d.id}
            className={`${styles.seg} ${styles.layer} ${on ? styles.on : ''}`}
            aria-pressed={on}
            title={d.title}
            data-dimension={d.id}
            onClick={() => viewState.setPreference(d.id, on ? null : true)}
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
          <div className={`${styles.group} ${styles.wideOnly}`} data-group="dimensions" aria-label={GROUP_TITLE}>
            <span className={styles.label} data-group-label>{GROUP}</span>
            {dimensionButtons}
          </div>
        )}

        <div className={styles.spacer} />

        <div className={styles.group} data-group="view">
          <button
            className={styles.seg}
            title={RESET_TITLE}
            data-toolbar-reset
            onClick={() => { setMoreOpen(false); fire('graph:reset-all'); }}
          >
            Reset
          </button>
          <button
            className={`${styles.seg} ${styles.more} ${moreOpen ? styles.on : ''}`}
            aria-expanded={moreOpen}
            aria-controls="pp-toolbar-more"
            title={`More: ${GROUP} and view actions`}
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
                <div className={styles.sectionTitle} data-group-label>{GROUP_TITLE}</div>
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

// The controls in the top bar (settings.toolbar.position top): undo, redo,
// Reset and the dimensions menu, as icon buttons the height of the pills.
// The menu (role menu) opens under its button: the dimensions as checkbox
// rows (one on at a time), the bucket size when the one on has it, the view
// actions, and the layout when it is shown. Escape or a tap outside closes
// it; the arrow keys, Home and End move through it.
function TopControls({ viewState, show, layouts, settings, layers }) {
  const S = settings || (typeof window !== 'undefined' ? window.SETTINGS : null);
  const [, bump] = useReducer((n) => n + 1, 0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => (viewState ? viewState.subscribe(bump) : undefined), [viewState]);

  const items = () => (menuRef.current ? [...menuRef.current.querySelectorAll('[data-menu-item]')] : []);
  const close = (refocus) => {
    setOpen(false);
    if (refocus && buttonRef.current) buttonRef.current.focus();
  };

  // A tap outside closes it; on opening, the first row takes the focus.
  useEffect(() => {
    if (!open) return undefined;
    const first = items()[0];
    if (first) first.focus({ preventScroll: true });
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    // Escape closes it wherever the focus is (a tap on a row leaves the
    // focus on the page in some browsers).
    const onKey = (e) => {
      if (e.key !== 'Escape' || (menuRef.current && menuRef.current.contains(e.target))) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      close(true);
    };
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  if (!viewState) return null;

  const showHistory = show.history !== false;
  const GROUP = dimensionGroupLabel(S);
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const axis = viewState.timeAxis();
  const model = menuModel({
    dimensions: dimensionLabels(S),
    layers: layerLabels(S).filter((d) => layers.includes(d.id)),
    axis,
    preferences: Object.fromEntries(layerLabels(S).map((d) => [d.id, viewState.preference(d.id)])),
    show,
    layouts,
    layout: viewState.state.layout,
    group: GROUP,
  });
  const heading = cap(model.heading);

  const onMenuKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
    if (e.key === 'Tab') { setOpen(false); return; }
    const list = items();
    const next = menuMove(list.indexOf(document.activeElement), e.key, list.length);
    if (next === null) return;
    e.preventDefault();
    e.stopPropagation();
    list[next].focus();
  };

  const row = (r, i) => {
    if (r.kind === 'divider') return <div key={`d${i}`} role="separator" className={styles.menuDivider} />;
    if (r.kind === 'dimension' || r.kind === 'layer') {
      const toggle = r.kind === 'dimension'
        ? () => viewState.setTimeAxis(toggleDimension(axis, r.id))
        : () => viewState.setPreference(r.id, r.checked ? null : true);
      return (
        <button key={r.id} type="button" role="menuitemcheckbox" aria-checked={r.checked} title={r.title}
          className={`${styles.menuItem} ${r.kind === 'layer' ? styles.layer : ''}`}
          data-menu-item data-dimension={r.id} onClick={toggle}>
          <span className={styles.menuCheck} aria-hidden="true">{r.checked && <Icon body={iconBody('check')} size={14} />}</span>
          {r.label}
        </button>
      );
    }
    if (r.kind === 'granularity') {
      return (
        <button key="granularity" type="button" role="menuitem" className={styles.menuItem}
          title="Bucket size: auto, day, week, month, year" data-menu-item data-granularity
          onClick={() => viewState.setTimeAxis({ granularity: nextGranularity(axis.granularity) })}>
          <span className={styles.menuCheck} aria-hidden="true" />
          bucket size · {r.value}
        </button>
      );
    }
    if (r.kind === 'action') {
      return (
        <button key={r.event} type="button" role="menuitem" className={styles.menuItem} title={r.title}
          data-menu-item data-view-action={r.event} onClick={() => { fire(r.event); close(true); }}>
          <span className={styles.menuCheck} aria-hidden="true" />
          {r.label}
        </button>
      );
    }
    if (r.kind === 'layout') {
      return (
        <div key="layout" role="group" aria-label="Layout" className={styles.menuLayout} data-group="layout">
          {r.options.map((l) => (
            <button key={l.id} type="button" role="menuitemradio" aria-checked={l.checked} title={l.title}
              className={`${styles.menuSeg} ${l.checked ? styles.on : ''}`} data-menu-item data-layout={l.id}
              onClick={() => { if (!l.checked) viewState.setLayout(l.id); }}>
              {l.label}
            </button>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={wrapRef} className={styles.top} role="group" aria-label="Graph controls" data-top-graph-controls>
      {showHistory && (
        <>
          <button type="button" className={styles.topIcon} title="Undo (Cmd+Z)" aria-label="Undo" data-top-undo
            disabled={!viewState.canUndo} onClick={() => viewState.undo()}>
            <Icon body={iconBody('undo-2')} size={15} />
          </button>
          <button type="button" className={styles.topIcon} title="Redo (Cmd+Shift+Z)" aria-label="Redo" data-top-redo
            disabled={!viewState.canRedo} onClick={() => viewState.redo()}>
            <Icon body={iconBody('redo-2')} size={15} />
          </button>
        </>
      )}
      <button type="button" className={styles.topIcon} title={RESET_TITLE} aria-label="Reset" data-toolbar-reset
        onClick={() => { setOpen(false); fire('graph:reset-all'); }}>
        <Icon body={iconBody('rotate-ccw')} size={15} />
      </button>
      <button ref={buttonRef} type="button" className={`${styles.topIcon} ${open ? styles.on : ''}`}
        title={`${heading}: ${model.heading === 'view' ? 'view actions' : 'which to show, and the view actions'}`}
        aria-label={heading} aria-haspopup="menu" aria-expanded={open} aria-controls="pp-top-menu" data-top-menu-button
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true); } }}>
        <Icon body={iconBody('hourglass')} size={15} />
      </button>
      {open && (
        <div ref={menuRef} id="pp-top-menu" className={styles.menu} role="menu" aria-labelledby="pp-top-menu-heading"
          data-top-menu onKeyDown={onMenuKey}>
          <div id="pp-top-menu-heading" role="presentation" className={styles.menuHeading} data-group-label>{heading}</div>
          {model.rows.map(row)}
        </div>
      )}
    </div>
  );
}

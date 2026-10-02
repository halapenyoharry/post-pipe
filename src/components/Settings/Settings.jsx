import React, { useState, useEffect, useRef } from 'react';
import styles from './Settings.module.css';
import { readerFonts } from '../../lib/readerSettings';
import { TTSSettings } from '../TTS/TTS';
import { config as todConfig } from '../../lib/timeOfDay';
import { THEMES, themeName } from '../../lib/theme';
import { isLinkItem } from '../../lib/linkNode';
import { iconBody } from '../../lib/icons';
import { Icon } from '../Icon/Icon';
import { panelGroups, panelTitle, modeInReader, whereOf } from '../../lib/panels';
import { toolbarConfig, VIEW_ACTIONS } from '../../lib/toolbar';
import { colorKeysInUse } from '../../lib/graphColors';
import { graphFeed, topBarConfig } from '../../lib/topBar';

/**
 * Settings — the panel that slides out from the right edge. One surface,
 * split in two by where each group belongs (src/lib/panels.js):
 *
 *   where 'graph'   the main view's panel, from the sliders in the top bar:
 *                   Look (theme, the time of day background, the graph's
 *                   colors), View (zoom to fit, close or open all containers,
 *                   unpin, sizes, the layout when shown), and what this
 *                   device remembers (reset, forget)
 *   where 'reader'  the reader's panel, from the sliders in its header:
 *                   Reading (face, size, paragraphs, the reading aids),
 *                   Paper (light or dark, when only the reader changes with
 *                   it) and Listening (the voice and its speed)
 *
 * Bookmarks are not settings: they live in the reader. Both panels are the
 * same drawer, so they look the same wherever they open. One layout from a
 * phone to a desktop: at most the width of the screen, its rows wrap.
 *
 * A panel opens on postpipe:toggle-settings with detail { where, open };
 * opening one closes the other. It acts on the selected node (`subject`).
 * Everything it changes goes through viewState or the graph's window events.
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

const SIZES = [
  { id: 's', label: 'S', title: 'Small text' },
  { id: 'm', label: 'M', title: 'Medium text' },
  { id: 'l', label: 'L', title: 'Large text' },
  { id: 'xl', label: 'XL', title: 'Extra large text' },
];

// One switch: its name, its state, and a line saying what it does.
function Switch({ on, onChange, label, hint, ...rest }) {
  return (
    <button
      className={`${styles.aidBtn} ${on ? styles.aidOn : ''}`}
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      {...rest}
    >
      <span className={styles.aidLabel}>{label}<span className={styles.aidState}>{on ? 'on' : 'off'}</span></span>
      {hint && <span className={styles.aidHint}>{hint}</span>}
    </button>
  );
}

function ReadingAid({ viewState, aid, label, hint }) {
  const on = Boolean(viewState.readerAid && viewState.readerAid(aid));
  return (
    <Switch
      on={on}
      label={label}
      hint={hint}
      data-aid={aid}
      onChange={(v) => viewState.setReaderAid && viewState.setReaderAid(aid, v)}
    />
  );
}

// A row of choices, one of which is on.
function Choice({ label, options, value, onChange, name }) {
  return (
    <div className={styles.choiceRow} role="radiogroup" aria-label={label} data-choice={name}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.choices}>
        {options.map((o) => (
          <button
            key={o.id}
            role="radio"
            aria-checked={value === o.id}
            title={o.title || o.label}
            data-value={o.id}
            className={`${styles.choiceBtn} ${value === o.id ? styles.aidOn : ''}`}
            style={o.style}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </span>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section className={styles.section} data-section={id} aria-labelledby={`pp-settings-${id}`}>
      <h2 className={styles.sectionTitle} id={`pp-settings-${id}`}>{title}</h2>
      {children}
    </section>
  );
}


const fire = (name) => window.dispatchEvent(new CustomEvent(name));

// What a site calls its containers, for Close all / Open all
// (settings.graph.containersName, "containers" by default).
function containersName(S) {
  const n = S && S.graph && typeof S.graph.containersName === 'string' ? S.graph.containersName.trim() : '';
  return n || 'containers';
}

// The button that opens the main view's panel: the sliders, in the top bar
// when the graph's controls are there (src/components/Toolbar), or on its
// own at the top right when they are not.
export function SettingsButton({ className, size = 15, ...rest }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = (e) => setOpen(!!(e.detail && e.detail.where === 'graph' && e.detail.open));
    window.addEventListener('postpipe:settings-state', on);
    return () => window.removeEventListener('postpipe:settings-state', on);
  }, []);
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent('postpipe:toggle-settings', { detail: { where: 'graph' } }))}
      title="Things to change"
      aria-label="Things to change"
      aria-expanded={open}
      {...rest}
    >
      <Icon body={iconBody('sliders-horizontal')} size={size} />
    </button>
  );
}

// where: 'graph' (the main view's panel) or 'reader' (the reader's).
// ownButton: draw the panel's own button at the top right; by default the
// main view's panel does when the graph's controls are not in the top bar.
export function Settings({ viewState, feedData, subject, readerOpen, where = 'graph', ownButton }) {
  const W = whereOf(where);
  const [open, setOpen] = useState(false);
  const [confirmForget, setConfirmForget] = useState(false);
  const [, bump] = useState(0);
  const panelRef = useRef(null);
  const wantSection = useRef(null);
  const S = typeof window !== 'undefined' ? window.SETTINGS : null;

  useEffect(() => {
    if (!viewState) return;
    return viewState.subscribe(() => bump((n) => n + 1));
  }, [viewState]);

  // Reading choices are attributes on <html>, so the reader pane and every
  // open node read them from one place.
  useEffect(() => {
    if (typeof document === 'undefined' || !viewState || W !== 'reader') return;
    const indent = viewState.paragraphIndent ? viewState.paragraphIndent() : false;
    const space = viewState.paragraphSpace ? viewState.paragraphSpace() : true;
    const root = document.documentElement;
    root.setAttribute('data-pp-indent', indent ? 'on' : 'off');
    root.setAttribute('data-pp-space', space ? 'on' : 'off');
    root.removeAttribute('data-pp-paragraph');
    root.setAttribute('data-pp-font', viewState.readerAid ? viewState.readerAid('font') : 'default');
    root.setAttribute('data-pp-size', viewState.readerAid ? viewState.readerAid('size') : 'm');
  });

  // detail: { where, section, open }: open true always opens. Opening one
  // panel closes the other.
  useEffect(() => {
    const onToggle = (e) => {
      const d = (e && e.detail) || {};
      if (whereOf(d.where) !== W) { setOpen(false); return; }
      wantSection.current = d.section || null;
      setOpen((o) => (d.open ? true : !o));
    };
    window.addEventListener('postpipe:toggle-settings', onToggle);
    return () => window.removeEventListener('postpipe:toggle-settings', onToggle);
  }, [W]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('postpipe:settings-state', { detail: { where: W, open } }));
    if (!open) return;
    // Escape closes the panel first, and only the panel: caught before the
    // page's own Escape (which closes the reader under it).
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      setOpen(false);
    };
    window.addEventListener('keydown', onKey, true);
    setConfirmForget(false);
    if (wantSection.current && panelRef.current) {
      const el = panelRef.current.querySelector(`[data-section="${wantSection.current}"]`);
      if (el) panelRef.current.scrollTop = el.offsetTop - 8;
      wantSection.current = null;
    }
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open]);

  if (!viewState) return null;

  const showOwnButton = ownButton !== undefined ? ownButton : (W === 'graph' && toolbarConfig(S).position !== 'top');
  const fonts = readerFonts(S);
  const font = viewState.readerAid ? viewState.readerAid('font') : 'default';
  const size = viewState.readerAid ? viewState.readerAid('size') : 'm';
  const current = { ...DEFAULT_COLORS, ...viewState.graphColors() };
  const activeProfile = viewState.colorProfileId();
  // Counted on what the graph draws: an item only in the top bar has no card.
  const inUse = colorKeysInUse(graphFeed(feedData, topBarConfig(S)));
  const fields = inUse ? FIELDS.filter((f) => inUse.has(f.key)) : FIELDS;
  const hasContainers = !!(feedData && Array.isArray(feedData.containers) && feedData.containers.length);
  const hasVoice = typeof window !== 'undefined' && !!window.TTS;
  // A site whose every item is a link node has nothing to read: no groups
  // about reading.
  const items = (feedData && feedData.items) || [];
  const anyReadable = items.length === 0 || items.some((i) => !isLinkItem(i));
  const name = themeName(S, viewState.preference('theme'));
  const modes = THEMES[name].modes;
  const modePref = viewState.preference('mode');
  const groups = panelGroups(W, { settings: S, readable: anyReadable, voice: hasVoice, modes: modes.length });
  const TB = toolbarConfig(S);
  const noun = containersName(S);

  const modeChoice = modes.length > 1 && (
    <Choice
      label={W === 'reader' ? 'Light or dark' : 'Mode'}
      name="mode"
      options={[
        { id: 'auto', label: 'Auto', title: 'Follow this device' },
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
      ]}
      value={modePref && modes.includes(modePref) ? modePref : 'auto'}
      onChange={(v) => viewState.setPreference('mode', v === 'auto' ? null : v)}
    />
  );

  const body = {
    look: () => (<>
      <Choice
        label="Theme"
        name="theme"
        options={Object.values(THEMES).map((t) => ({ id: t.id, label: t.label }))}
        value={name}
        onChange={(v) => viewState.setPreference('theme', v === themeName(S, null) ? null : v)}
      />
      {!modeInReader(S) && modeChoice}
      {todConfig(S) && (
        <Switch
          on={viewState.preference('timeOfDay') !== false}
          onChange={(v) => viewState.setPreference('timeOfDay', v ? null : false)}
          label="narrative time of day background"
          data-pref="timeOfDay"
        />
      )}
      {fields.length > 0 && (<>
        <div className={styles.rowLabel}>Colors</div>
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
    </>),

    view: () => (<>
      <span className={styles.choices} data-view-actions>
        <button className={styles.choiceBtn} data-view-action="graph:zoom-to-fit" title="Every node on the screen, zoomed about its middle" onClick={() => fire('graph:zoom-to-fit')}>Zoom to fit</button>
        {hasContainers && (<>
          <button className={styles.choiceBtn} data-view-action="graph:close-all-containers" onClick={() => fire('graph:close-all-containers')}>Close all {noun}</button>
          <button className={styles.choiceBtn} data-view-action="graph:open-all-containers" onClick={() => fire('graph:open-all-containers')}>Open all {noun}</button>
        </>)}
        {VIEW_ACTIONS.filter((a) => a.event !== 'graph:zoom-to-fit').map((a) => (
          <button key={a.event} className={styles.choiceBtn} data-view-action={a.event} title={a.title} onClick={() => fire(a.event)}>{a.label}</button>
        ))}
      </span>
      {TB.show.layout && (
        <Choice
          label="Layout"
          name="layout"
          options={[{ id: 'force', label: 'cluster', title: 'Cluster: each container its own path' }, { id: 'radial', label: 'ring', title: 'Ring: each container its own ring' }]}
          value={viewState.state.layout}
          onChange={(v) => viewState.setLayout(v)}
        />
      )}
    </>),

    memory: () => (<>
      <button
        className={styles.resetBtn}
        data-settings-reset
        title="Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts"
        onClick={() => {
          setOpen(false);
          if (fields.length) viewState.applyColorProfile('default', DEFAULT_COLORS);
          fire('graph:reset-all');
        }}
      >
        Reset the view
      </button>
      <div className={styles.forgetBlock} data-forget>
        <div className={styles.hint} data-forget-note>
          What you open, arrange, choose, mark and read here is kept on this device only.
          Reset the view keeps your bookmarks and progress; Forget removes all of it.
        </div>
        {!confirmForget ? (
          <button className={styles.resetBtn} data-forget-ask onClick={() => setConfirmForget(true)}>
            Forget my usage on this site
          </button>
        ) : (
          <div className={styles.forgetConfirm} role="group" aria-label="Confirm forgetting" data-forget-confirm>
            <div className={styles.hint}>
              Remove your bookmarks and notes, reading progress, open cards, positions,
              and every choice made here, from this device? This can't be undone.
            </div>
            <span className={styles.choices}>
              <button
                className={styles.resetBtn}
                data-forget-yes
                onClick={async () => {
                  setConfirmForget(false);
                  setOpen(false);
                  if (viewState.forget) await viewState.forget();
                  window.dispatchEvent(new CustomEvent('postpipe:forgotten'));
                }}
              >
                Forget
              </button>
              <button className={styles.choiceBtn} data-forget-no onClick={() => setConfirmForget(false)}>
                Keep it
              </button>
            </span>
          </div>
        )}
      </div>
    </>),

    reading: () => (<>
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
        <div key={f.id} className={styles.hint}>
          {f.label} is under the <a className={styles.hintLink} href={`./fonts/${f.license}`} target="_blank" rel="noopener">{f.licenseName}</a>.
        </div>
      ))}
      <Choice label="Size" name="size" options={SIZES} value={size} onChange={(v) => viewState.setReaderAid('size', v)} />
      <div className={styles.choiceRow}>
        <span className={styles.rowLabel}>Paragraphs</span>
        <span className={styles.choices}>
          <button
            className={`${styles.choiceBtn} ${viewState.paragraphIndent() ? styles.aidOn : ''}`}
            aria-pressed={viewState.paragraphIndent()}
            onClick={() => viewState.setParagraphIndent(!viewState.paragraphIndent())}
          >
            Indent first line
          </button>
          <button
            className={`${styles.choiceBtn} ${viewState.paragraphSpace() ? styles.aidOn : ''}`}
            aria-pressed={viewState.paragraphSpace()}
            onClick={() => viewState.setParagraphSpace(!viewState.paragraphSpace())}
          >
            Space between
          </button>
        </span>
      </div>
      <div className={styles.aidList}>
        <ReadingAid viewState={viewState} aid="followAlong" label="Highlighter: follow along" hint="Tap or drag through the text to mark the sentence and word you are on." />
        <ReadingAid viewState={viewState} aid="boldStart" label="Bold word beginnings" hint="The first part of each word is bold, to lead the eye. The text itself is unchanged." />
      </div>
    </>),

    paper: () => modeChoice,

    listening: () => (<>
      <TTSSettings />
      <div className={styles.hint}>Play and pause are in the reader.</div>
    </>),
  };

  return (
    <>
      {showOwnButton && (
        <SettingsButton className={styles.gearBtn} size={18} aria-expanded={open} data-settings-gear />
      )}

      {open && (
        <>
          {/* A transparent click-catcher: closes the panel on a tap outside
              it, without dimming the canvas. */}
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <aside className={styles.drawer} role="dialog" aria-label={panelTitle(S, W)} ref={panelRef} data-settings-panel={W}>
            <div className={styles.header}>
              <span className={styles.title}>{panelTitle(S, W)}</span>
              {W === 'reader' && subject && <span className={styles.subject} data-settings-subject>{subject.title}</span>}
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
                <Icon body={iconBody('x')} size={18} />
              </button>
            </div>
            {groups.map((g) => (
              <Section key={g.id} id={g.id} title={g.title}>{body[g.id]()}</Section>
            ))}
          </aside>
        </>
      )}
    </>
  );
}

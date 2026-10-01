import React, { useState, useEffect, useRef } from 'react';
import styles from './Settings.module.css';
import { readerFonts } from '../../lib/readerSettings';
import { bookmarkLabel, placedParagraph } from '../../lib/bookmarkPlace';
import { TTSSettings } from '../TTS/TTS';
import { config as todConfig } from '../../lib/timeOfDay';

/**
 * Settings — the panel that slides out from the right edge, from the graph's
 * gear or the reader's own button. One layout from a phone to a desktop: it is
 * at most the width of the screen, its rows wrap, and nothing is special-cased.
 *
 * Four groups, each control in one place only:
 *   Reading     the text: font, size, paragraphs, follow along, bold beginnings
 *   Listening   the voice and its speed (play and pause stay in the reader)
 *   Your place  the selected piece's bookmarks, with a legend, then the rest
 *   View        theme, time of day, containers open or closed, colors, reset
 *
 * It acts on the selected node (`subject`): the piece open in the reader, or
 * else the card last opened on the graph. Everything it changes goes through
 * viewState or the graph's window events.
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

const itemTitle = (feed, id) => {
  const it = feed && Array.isArray(feed.items) ? feed.items.find((i) => i.id === id) : null;
  return it ? (it.title || '') : '';
};

function readHash(id, para) {
  return '#read=' + encodeURIComponent(id) + (para != null ? '&p=' + para : '');
}

// One saved place: where it is, its note, and what can be done with it.
function BookmarkRow({ b, feedData, viewState }) {
  const [editing, setEditing] = useState(false);
  const item = feedData && Array.isArray(feedData.items) ? feedData.items.find((i) => i.id === b.item) : null;
  const para = placedParagraph(b, item);
  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href.split('#')[0] + readHash(b.item, para)); } catch (_) {}
  };
  return (
    <div className={styles.markItem} data-bookmark-row>
      <div className={styles.markMain}>
        <div className={styles.markTitle}>{bookmarkLabel(b, itemTitle(feedData, b.item))}</div>
        {editing ? (
          <input
            type="text"
            value={b.note || ''}
            onChange={(e) => viewState.setBookmarkNote(b.id, e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false); }}
            className={styles.noteInput}
            aria-label="Note"
            autoFocus
          />
        ) : (
          <button className={styles.markNote} onClick={() => setEditing(true)}>
            {b.note || <em>Add a note</em>}
          </button>
        )}
      </div>
      <div className={styles.markActions}>
        <button onClick={() => { window.location.hash = readHash(b.item, para); }} title="Go back to this place">Jump</button>
        <button onClick={copy} title="Copy a link to this place">Copy link</button>
        <button onClick={() => viewState.removeBookmark(b.id)} title="Delete this bookmark" aria-label="Delete bookmark">Delete</button>
      </div>
    </div>
  );
}

export function Settings({ viewState, feedData, subject, readerOpen }) {
  const [open, setOpen] = useState(false);
  const [, bump] = useState(0);
  const panelRef = useRef(null);
  const wantSection = useRef(null);

  useEffect(() => {
    if (!viewState) return;
    return viewState.subscribe(() => bump((n) => n + 1));
  }, [viewState]);

  // Reading choices are attributes on <html>, so the reader pane and every
  // open node read them from one place.
  useEffect(() => {
    if (typeof document === 'undefined' || !viewState) return;
    const indent = viewState.paragraphIndent ? viewState.paragraphIndent() : false;
    const space = viewState.paragraphSpace ? viewState.paragraphSpace() : true;
    const root = document.documentElement;
    root.setAttribute('data-pp-indent', indent ? 'on' : 'off');
    root.setAttribute('data-pp-space', space ? 'on' : 'off');
    root.removeAttribute('data-pp-paragraph');
    root.setAttribute('data-pp-font', viewState.readerAid ? viewState.readerAid('font') : 'default');
    root.setAttribute('data-pp-size', viewState.readerAid ? viewState.readerAid('size') : 'm');
  });

  // The reader has its own settings button (the graph's gear sits under the
  // reader on a phone), and its Bookmarks button opens Your place.
  // detail: { section, open } — open true always opens.
  useEffect(() => {
    const onToggle = (e) => {
      const d = (e && e.detail) || {};
      wantSection.current = d.section || null;
      setOpen((o) => (d.open ? true : !o));
    };
    window.addEventListener('postpipe:toggle-settings', onToggle);
    return () => window.removeEventListener('postpipe:toggle-settings', onToggle);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    if (wantSection.current && panelRef.current) {
      const el = panelRef.current.querySelector(`[data-section="${wantSection.current}"]`);
      if (el) panelRef.current.scrollTop = el.offsetTop - 8;
      wantSection.current = null;
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!viewState) return null;

  const fonts = readerFonts(typeof window !== 'undefined' ? window.SETTINGS : null);
  const font = viewState.readerAid ? viewState.readerAid('font') : 'default';
  const size = viewState.readerAid ? viewState.readerAid('size') : 'm';
  const current = { ...DEFAULT_COLORS, ...viewState.graphColors() };
  const activeProfile = viewState.colorProfileId();
  const inUse = colorKeysInUse(feedData);
  const fields = inUse ? FIELDS.filter((f) => inUse.has(f.key)) : FIELDS;
  const hasContainers = !!(feedData && Array.isArray(feedData.containers) && feedData.containers.length);
  const hasVoice = typeof window !== 'undefined' && !!window.TTS;

  const subjectId = subject ? subject.id : null;
  const all = viewState.bookmarks();
  const mine = subjectId ? viewState.bookmarks(subjectId) : [];
  const others = all.filter((b) => b.item !== subjectId);
  const readable = subject && subject._posted !== 'title';
  const inReader = !!(subject && readerOpen && readerOpen === subjectId);

  return (
    <>
      <button
        className={styles.gearBtn}
        onClick={() => setOpen((o) => !o)}
        title="Settings"
        aria-label="Settings"
        aria-expanded={open}
        data-settings-gear
      >
        ⚙
      </button>

      {open && (
        <>
          {/* A transparent click-catcher: closes the panel on a tap outside
              it, without dimming the canvas. */}
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <aside className={styles.drawer} role="dialog" aria-label="Settings" ref={panelRef} data-settings-panel>
            <div className={styles.header}>
              <span className={styles.title}>Settings</span>
              {subject && <span className={styles.subject} data-settings-subject>{subject.title}</span>}
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>

            <Section id="reading" title="Reading">
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
              <Choice
                label="Size"
                name="size"
                options={SIZES}
                value={size}
                onChange={(v) => viewState.setReaderAid('size', v)}
              />
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
                <ReadingAid
                  viewState={viewState}
                  aid="followAlong"
                  label="Highlighter: follow along"
                  hint="Tap or drag through the text to mark the sentence and word you are on."
                />
                <ReadingAid
                  viewState={viewState}
                  aid="boldStart"
                  label="Bold word beginnings"
                  hint="The first part of each word is bold, to lead the eye. The text itself is unchanged."
                />
              </div>
            </Section>

            {hasVoice && (
              <Section id="listening" title="Listening">
                <TTSSettings />
                <div className={styles.hint}>Play and pause are in the reader.</div>
              </Section>
            )}

            <Section id="place" title="Your place">
              <div className={styles.legend} data-bookmark-legend>
                <strong>Mark here</strong>, in the reader, saves the paragraph at the top of the
                reader; a ribbon in the margin shows it, and tapping it again removes it. Each saved
                place below has <em>Jump</em> (go back to it), <em>Copy link</em> and <em>Delete</em>.
                Tap a note to write one.
              </div>
              {subject ? (
                <div className={styles.subjectBlock} data-place-subject>
                  <div className={styles.subjectTitle}>{subject.title}</div>
                  <div className={styles.choices}>
                    {readable && !inReader && (
                      <button className={styles.choiceBtn} onClick={() => { setOpen(false); window.location.hash = readHash(subject.id, null); }}>
                        Read
                      </button>
                    )}
                    {inReader && (
                      <button
                        className={`${styles.choiceBtn} ${mine.length ? styles.aidOn : ''}`}
                        aria-pressed={mine.length > 0}
                        data-place-mark
                        onClick={() => window.dispatchEvent(new CustomEvent('postpipe:reader-mark'))}
                      >
                        {mine.length ? 'Marked' : 'Mark here'}
                      </button>
                    )}
                  </div>
                  {mine.map((b) => <BookmarkRow key={b.id} b={b} feedData={feedData} viewState={viewState} />)}
                  {mine.length === 0 && <div className={styles.hint}>No bookmarks in this one yet.</div>}
                </div>
              ) : (
                <div className={styles.hint}>Open a chapter, or tap one on the graph, to see your place in it.</div>
              )}
              {others.length > 0 && (
                <>
                  <div className={styles.rowLabel}>{subject ? 'Elsewhere' : 'All bookmarks'}</div>
                  {others.map((b) => <BookmarkRow key={b.id} b={b} feedData={feedData} viewState={viewState} />)}
                </>
              )}
              {all.length === 0 && !subject && <div className={styles.noMarks}>No bookmarks yet.</div>}
            </Section>

            <Section id="view" title="View">
              {todConfig(typeof window !== 'undefined' ? window.SETTINGS : null) && (
                <Switch
                  on={viewState.preference('timeOfDay') !== false}
                  onChange={(v) => viewState.setPreference('timeOfDay', v ? null : false)}
                  label="Time of day background"
                  hint="The page behind the graph takes on the light of the chapter's time of day, tinted by its season."
                  data-pref="timeOfDay"
                />
              )}
              {hasContainers && (
                <div className={styles.choiceRow}>
                  <span className={styles.rowLabel}>Containers</span>
                  <span className={styles.choices}>
                    <button className={styles.choiceBtn} onClick={() => window.dispatchEvent(new CustomEvent('graph:open-all-containers'))}>Open all</button>
                    <button className={styles.choiceBtn} onClick={() => window.dispatchEvent(new CustomEvent('graph:close-all-containers'))}>Close all</button>
                  </span>
                </div>
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

              <button
                className={styles.resetBtn}
                data-settings-reset
                title="Layout, zoom, rotation, open and closed containers, selection and colors, back to how the site starts"
                onClick={() => {
                  setOpen(false);
                  if (fields.length) viewState.applyColorProfile('default', DEFAULT_COLORS);
                  window.dispatchEvent(new CustomEvent('graph:reset-all'));
                }}
              >
                Reset the view
              </button>
            </Section>
          </aside>
        </>
      )}
    </>
  );
}

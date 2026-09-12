import React, { useState, useRef, useEffect } from 'react';
import styles from './FeedZ.module.css';

/**
 * FeedZ — pill-shaped feed list across a side of the viewport.
 *
 * Each feed is a small dimmed pill: a color dot, the feed name, an
 * integrated item count. Tap a pill to hide/unhide that feed's items in
 * the graph (without rebuilding the layout). A "+" pill at the end lets
 * you paste a feed URL — the component generates the OPML snippet to
 * the clipboard so you can add it to feeds.opml and rerun the build.
 *
 * Editing remains an OPML-tool job; this component is just a helper for
 * the common "add one" case.
 *
 * Props:
 *   sources        — array from feed._sources
 *   hiddenSources  — Set<string> of source ids currently hidden
 *   onToggleSource — (sourceId) => void
 *   viewState      — optional; enables the dot's color-ring picker and
 *                    persists the reader's choice per source
 */
export function FeedZ({ sources, hiddenSources, onToggleSource, viewState }) {
  if (!sources || sources.length === 0) return null;

  const hidden = hiddenSources || new Set();

  return (
    <div className={styles.bar}>
      {sources.map(src => (
        <FeedPill
          key={src.id}
          source={src}
          hidden={hidden.has(src.id)}
          onToggle={() => onToggleSource && onToggleSource(src.id)}
          viewState={viewState}
        />
      ))}
      <AddPill />
    </div>
  );
}

// The pill is a div (not a <button>) because it hosts a real interactive
// control of its own — the dot's ring picker is a set of <button>s, and
// nesting <button> inside <button> is invalid HTML that browsers handle
// inconsistently (the outer control can silently stop receiving events).
// role="button" + a key handler keep it keyboard-operable regardless.
function FeedPill({ source, hidden, onToggle, viewState }) {
  const title = source.title || source.id;
  const ok = source.ok !== false;
  const color = (viewState && viewState.sourceColor(source.id)) || source.color;
  return (
    <div
      className={`${styles.pill} ${hidden ? styles.hidden : ''} ${!ok ? styles.failed : ''}`}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      role="button"
      tabIndex={0}
      title={hidden ? `Show ${title}` : `Hide ${title}`}
      style={{ '--pill-color': color }}
    >
      <FeedDot color={color} sourceId={source.id} viewState={viewState} />
      <span className={styles.title}>{title}</span>
      <span className={styles.count}>{source.itemCount}</span>
    </div>
  );
}

// A curated spread of hues, not a full wheel — easy to hit on a touch
// screen, wide enough to actually distinguish feeds from each other.
const RING_COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e84393',
];

// Dwell duration before hovering the dot opens the ring on its own, for
// anyone who doesn't want to click/tap at all.
const DWELL_MS = 650;

function FeedDot({ color, sourceId, viewState }) {
  const [ringOpen, setRingOpen] = useState(false);
  const dwellTimer = useRef(null);

  useEffect(() => () => { if (dwellTimer.current) clearTimeout(dwellTimer.current); }, []);

  const openRing = (e) => {
    e.stopPropagation();
    setRingOpen(true);
  };
  const closeRing = (e) => {
    if (e) e.stopPropagation();
    setRingOpen(false);
  };

  const handleMouseEnter = () => {
    dwellTimer.current = setTimeout(() => setRingOpen(true), DWELL_MS);
  };
  const handleMouseLeave = () => {
    if (dwellTimer.current) { clearTimeout(dwellTimer.current); dwellTimer.current = null; }
  };

  const pick = (c, e) => {
    e.stopPropagation();
    if (viewState) viewState.setSourceColor(sourceId, c);
    setRingOpen(false);
  };

  // A downward arc, not a full circle — the pill bar sits right at the top
  // edge of the viewport, so a ring centered on the dot would be clipped
  // above the browser window. Spanning just below the dot keeps every
  // swatch reachable no matter how close to the top the pill sits.
  const RADIUS = 30;
  const START_DEG = 15;
  const END_DEG = 165;
  const n = RING_COLORS.length;

  return (
    <span
      className={styles.dotWrap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={openRing}
      onTouchEnd={openRing}
    >
      <span
        className={`${styles.dot} ${ringOpen ? styles.dotActive : ''}`}
        aria-hidden="true"
      />
      {ringOpen && (
        <>
          <span className={styles.ringBackdrop} onClick={closeRing} onTouchEnd={closeRing} />
          <span className={styles.ring}>
            {RING_COLORS.map((c, i) => {
              const deg = n === 1 ? START_DEG : START_DEG + (i / (n - 1)) * (END_DEG - START_DEG);
              const rad = (deg * Math.PI) / 180;
              const dx = RADIUS * Math.cos(rad);
              const dy = RADIUS * Math.sin(rad);
              return (
                <button
                  key={c}
                  type="button"
                  className={`${styles.swatch} ${c.toLowerCase() === String(color).toLowerCase() ? styles.swatchCurrent : ''}`}
                  style={{ left: (dx - 8) + 'px', top: (dy - 8) + 'px', background: c }}
                  onClick={(e) => pick(c, e)}
                  title={c}
                />
              );
            })}
          </span>
        </>
      )}
    </span>
  );
}

function AddPill() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  // pendingUrl is the URL the user just submitted; the result panel stays
  // open (sticky) until they explicitly dismiss it. No auto-fade.
  const [pendingUrl, setPendingUrl] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const urlIsValid = isLikelyUrl(value);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!urlIsValid) return;
    setPendingUrl(value.trim());
    setValue('');
    setOpen(false);
  };

  const close = () => {
    setValue('');
    setOpen(false);
  };

  return (
    <>
      {!open ? (
        <button
          className={`${styles.pill} ${styles.addPill}`}
          onClick={() => setOpen(true)}
          title="Add a feed"
        >
          <span className={styles.plus}>+</span>
        </button>
      ) : (
        <form className={`${styles.pill} ${styles.addOpen}`} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="url"
            placeholder="paste a feed URL…"
            className={styles.addInput}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
          />
          <button
            type="button"
            className={styles.addClose}
            onClick={close}
            title="Cancel"
            aria-label="Cancel"
          >×</button>
          <button
            type="submit"
            className={`${styles.addSubmit} ${urlIsValid ? styles.ready : ''}`}
            disabled={!urlIsValid}
            title={urlIsValid ? 'Continue' : 'Enter a URL first'}
            aria-label="Add feed"
          >+</button>
        </form>
      )}
      {pendingUrl && (
        <AddResultPanel
          url={pendingUrl}
          onDismiss={() => setPendingUrl(null)}
        />
      )}
    </>
  );
}

// Sticky result panel — opens right below the pill bar (where the user
// just clicked) and stays until dismissed. Shows both ways to actually
// install the feed:
//   1. CLI command (runs add-feed.js, which appends to OPML and rebuilds)
//   2. OPML snippet (for hand-editing or external OPML tools)
// Each line has its own "Copy" button so there's no ambiguity about
// which one ended up on the clipboard.
function AddResultPanel({ url, onDismiss }) {
  const [copied, setCopied] = useState('');
  const snippet = buildOutline(url);
  const cliCommand = `node add-feed.js ${shell(url)}`;

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(c => c === label ? '' : c), 1500);
    } catch (_) { /* clipboard denied; user can copy manually */ }
  };

  return (
    <div className={styles.resultPanel}>
      <button
        className={styles.resultClose}
        onClick={onDismiss}
        title="Dismiss"
        aria-label="Dismiss"
      >×</button>
      <div className={styles.resultTitle}>Add this feed</div>
      <div className={styles.resultUrl} title={url}>{url}</div>

      <div className={styles.resultSection}>
        <div className={styles.resultLabel}>One-step (recommended)</div>
        <div className={styles.resultBox}>
          <code className={styles.code}>{cliCommand}</code>
          <button
            className={`${styles.copyBtn} ${copied === 'cli' ? styles.copied : ''}`}
            onClick={() => copy(cliCommand, 'cli')}
          >
            {copied === 'cli' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className={styles.resultHint}>
          Paste in your terminal — it appends to feeds.opml and rebuilds.
          Then refresh this page.
        </div>
      </div>

      <div className={styles.resultSection}>
        <div className={styles.resultLabel}>Or add manually</div>
        <div className={styles.resultBox}>
          <code className={styles.code}>{snippet}</code>
          <button
            className={`${styles.copyBtn} ${copied === 'opml' ? styles.copied : ''}`}
            onClick={() => copy(snippet, 'opml')}
          >
            {copied === 'opml' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className={styles.resultHint}>
          Paste before <code className={styles.codeInline}>&lt;/body&gt;</code>{' '}
          in feeds.opml, then run <code className={styles.codeInline}>node generate-index.js</code>.
        </div>
      </div>
    </div>
  );
}

function isLikelyUrl(s) {
  const trimmed = (s || '').trim();
  if (!trimmed) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Shell-quote a URL for safe inclusion in the CLI command suggestion.
// Single-quote everything and escape any embedded single quote.
function shell(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

// Construct an OPML <outline> for a URL. We leave the type attribute off
// so the parser's detectType() heuristic runs — that's usually right for
// well-known feed extensions, and the user can edit if it isn't.
function buildOutline(url) {
  const safeUrl = url.replace(/"/g, '&quot;');
  return `<outline text="${urlToLabel(url)}" title="${urlToLabel(url)}" xmlUrl="${safeUrl}"/>`;
}

function urlToLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (_) {
    return url;
  }
}

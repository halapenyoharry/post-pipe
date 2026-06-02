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
 */
export function FeedZ({ sources, hiddenSources, onToggleSource }) {
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
        />
      ))}
      <AddPill />
    </div>
  );
}

function FeedPill({ source, hidden, onToggle }) {
  const title = source.title || source.id;
  const ok = source.ok !== false;
  return (
    <button
      className={`${styles.pill} ${hidden ? styles.hidden : ''} ${!ok ? styles.failed : ''}`}
      onClick={onToggle}
      title={hidden ? `Show ${title}` : `Hide ${title}`}
      style={{ '--pill-color': source.color }}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.title}>{title}</span>
      <span className={styles.count}>{source.itemCount}</span>
    </button>
  );
}

function AddPill() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [toast, setToast] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const urlIsValid = isLikelyUrl(value);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!urlIsValid) return;
    const snippet = buildOutline(value.trim());
    try {
      await navigator.clipboard.writeText(snippet);
      setToast('Copied. Paste into feeds.opml and rerun the build.');
    } catch (_) {
      setToast(`Could not copy automatically. Snippet: ${snippet}`);
    }
    setValue('');
    setOpen(false);
  };

  const close = () => {
    setValue('');
    setOpen(false);
  };

  if (!open) {
    return (
      <>
        <button
          className={`${styles.pill} ${styles.addPill}`}
          onClick={() => setOpen(true)}
          title="Add a feed (clipboard helper)"
        >
          <span className={styles.plus}>+</span>
        </button>
        {toast && <div className={styles.toast}>{toast}</div>}
      </>
    );
  }

  return (
    <>
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
          title={urlIsValid ? 'Copy OPML snippet to clipboard' : 'Enter a URL first'}
          aria-label="Add feed"
        >+</button>
      </form>
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
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

import React, { useState } from 'react';
import styles from './ReaderPanel.module.css';
import { bookmarkLabel, placedParagraph } from '../../lib/bookmarkPlace';

// Every place the reader has bookmarked, in the reader under its header
// (bookmarks are not settings). This chapter's first, then the rest. Each
// has Jump (go back to it), Copy link and Delete; a tap on its note edits it.
// Shown only while settings.reader.bookmarksList is on (src/lib/readerSettings.js).

const itemTitle = (feed, id) => {
  const it = feed && Array.isArray(feed.items) ? feed.items.find((i) => i.id === id) : null;
  return it ? (it.title || '') : '';
};

const readHash = (id, para) => '#read=' + encodeURIComponent(id) + (para != null ? '&p=' + para : '');

function Row({ b, feedData, viewState }) {
  const [editing, setEditing] = useState(false);
  const item = feedData && Array.isArray(feedData.items) ? feedData.items.find((i) => i.id === b.item) : null;
  const para = placedParagraph(b, item);
  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href.split('#')[0] + readHash(b.item, para)); } catch (_) {}
  };
  return (
    <div className={styles.bmRow} data-bookmark-row>
      <div className={styles.bmMain}>
        <div className={styles.bmTitle}>{bookmarkLabel(b, itemTitle(feedData, b.item))}</div>
        {editing ? (
          <input
            type="text"
            value={b.note || ''}
            onChange={(e) => viewState.setBookmarkNote(b.id, e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditing(false); }}
            className={styles.bmNoteInput}
            aria-label="Note"
            autoFocus
          />
        ) : (
          <button className={styles.bmNote} onClick={() => setEditing(true)}>{b.note || <em>Add a note</em>}</button>
        )}
      </div>
      <div className={styles.bmActions}>
        <button onClick={() => { window.location.hash = readHash(b.item, para); }} title="Go back to this place">Jump</button>
        <button onClick={copy} title="Copy a link to this place">Copy link</button>
        <button onClick={() => viewState.removeBookmark(b.id)} title="Delete this bookmark">Delete</button>
      </div>
    </div>
  );
}

export function BookmarkList({ viewState, feedData, itemId }) {
  if (!viewState) return null;
  const all = viewState.bookmarks();
  const mine = all.filter((b) => b.item === itemId);
  const others = all.filter((b) => b.item !== itemId);
  return (
    <div className={styles.bmList} data-bookmarks-list>
      {[...mine, ...others].map((b) => <Row key={b.id} b={b} feedData={feedData} viewState={viewState} />)}
      {all.length === 0 && <div className={styles.bmEmpty}>No bookmarks yet.</div>}
    </div>
  );
}

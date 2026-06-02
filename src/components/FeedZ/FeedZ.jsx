import React, { useState } from 'react';
import styles from './FeedZ.module.css';

/**
 * FeedZ — read-only display of the feeds that compose the current corpus.
 *
 * Reads the `_sources` array embedded in feed.json by the build aggregator.
 * Shows each feed with its color swatch, title, item count, and link to
 * its home page. Folders (from OPML) are rendered as collapsible groups.
 *
 * Editing the OPML — adding, removing, renaming feeds — happens in
 * dedicated OPML tools (NetNewsWire, Reeder, Inoreader, hand-editing).
 * Run `node generate-index.js` to refresh after edits.
 *
 * Props:
 *   sources: array from feed._sources, each { id, title, type, color,
 *            home_page_url, folder, itemCount, ok }
 */
export function FeedZ({ sources }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!sources || sources.length === 0) return null;

  // Group by folder for display.
  const grouped = groupByFolder(sources);

  return (
    <div className={`${styles.panel} ${collapsed ? styles.collapsed : ''}`}>
      <button
        className={styles.handle}
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Show feeds' : 'Hide feeds'}
      >
        <span className={styles.handleLabel}>
          {sources.length} feed{sources.length === 1 ? '' : 's'}
        </span>
      </button>
      {!collapsed && (
        <div className={styles.body}>
          {grouped.map(({ folder, items }) => (
            <FolderGroup key={folder || '__root'} folder={folder} items={items} />
          ))}
        </div>
      )}
    </div>
  );
}

function FolderGroup({ folder, items }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.folder}>
      {folder && (
        <button
          className={styles.folderHeading}
          onClick={() => setOpen(o => !o)}
        >
          <span className={styles.folderChevron}>{open ? '▾' : '▸'}</span>
          <span>{folder}</span>
          <span className={styles.folderCount}>{items.length}</span>
        </button>
      )}
      {open && (
        <ul className={styles.list}>
          {items.map(src => (
            <SourceRow key={src.id} source={src} />
          ))}
        </ul>
      )}
    </div>
  );
}

function SourceRow({ source }) {
  const labelTitle = source.title || source.id;
  return (
    <li className={`${styles.row} ${source.ok === false ? styles.failed : ''}`}>
      <span
        className={styles.swatch}
        style={{ backgroundColor: source.color }}
        aria-hidden="true"
      />
      <div className={styles.rowText}>
        {source.home_page_url ? (
          <a
            className={styles.title}
            href={source.home_page_url}
            target="_blank"
            rel="noopener noreferrer"
            title={labelTitle}
          >
            {labelTitle}
          </a>
        ) : (
          <span className={styles.title} title={labelTitle}>{labelTitle}</span>
        )}
        <span className={styles.meta}>
          <span className={styles.type}>{source.type}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.count}>{source.itemCount}</span>
        </span>
      </div>
    </li>
  );
}

function groupByFolder(sources) {
  const buckets = new Map();
  for (const s of sources) {
    const key = s.folder || '';
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(s);
  }
  // Top-level (root) first, then folders alphabetically.
  return Array.from(buckets.entries())
    .sort(([a], [b]) => {
      if (a === '') return -1;
      if (b === '') return 1;
      return a.localeCompare(b);
    })
    .map(([folder, items]) => ({ folder, items }));
}

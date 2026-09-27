import React, { useState, useEffect, useRef } from 'react';
import styles from './ReaderPanel.module.css';
import { ICONS } from '../../utils/icons'; // We'll extract icons into a utility

export function ReaderPanel({ article, onClose, settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [floatingPos, setFloatingPos] = useState(null);
  const [showFrontmatter, setShowFrontmatter] = useState(false);
  const [contentHtml, setContentHtml] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  // Reader always leaves the graph visible — `wide` toggles between
  // narrow (540px) and wide (760px).
  const [wide, setWide] = useState(false);
  const bodyRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Derive initial state when article changes
  useEffect(() => {
    if (article) {
      setIsOpen(true);
      setIsMinimized(false);
      fetchContent(article);
    } else {
      setIsOpen(false);
      setIsMinimized(false);
      setContentHtml('');
      setScrollProgress(0);
      setShowFrontmatter(false);
    }
  }, [article]);

  const handleToolbarMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: floatingPos ? floatingPos.x : 0,
      posY: floatingPos ? floatingPos.y : 0,
    };
    window.addEventListener('mousemove', handleToolbarMouseMove);
    window.addEventListener('mouseup', handleToolbarMouseUp);
  };

  const handleToolbarMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setFloatingPos({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    });
  };

  const handleToolbarMouseUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener('mousemove', handleToolbarMouseMove);
    window.removeEventListener('mouseup', handleToolbarMouseUp);
  };

  const fetchContent = async (item) => {
    const kind = item.kind || 'essay';

    if (kind === 'placeholder' || item.substrate === 'placeholder') {
      const partNum = item.series_part || item.title || '';
      const actNum = Number(partNum) >= 21 ? '3' : '2';
      setContentHtml(`
        <div style="padding: 40px 24px; text-align: center; border: 1px dashed rgba(212, 175, 55, 0.35); border-radius: 12px; background: rgba(20, 24, 38, 0.6); margin-top: 24px;">
          <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.9;">📖</div>
          <div style="font-size: 20px; font-weight: 600; color: var(--rp-accent, #d4af37); margin-bottom: 8px;">Chapter ${partNum}</div>
          <div style="font-size: 13px; color: var(--rp-text, #a8b2d1); opacity: 0.8; letter-spacing: 0.5px;">Act ${actNum} · In Progress</div>
        </div>
      `);
      return;
    }

    if (kind === 'essay' || kind === 'multi') {
      try {
        const filename = (item.url || '').split('/').pop();
        let r;
        // If current origin differs from item.url (e.g. previewing on localhost),
        // try the local sibling file first
        try {
          const isSameOrigin = item.url && new URL(item.url, window.location.href).origin === window.location.origin;
          if (!isSameOrigin && filename) {
            r = await fetch('./' + filename);
          }
        } catch (_) {}

        if (!r || !r.ok) {
          try {
            r = await fetch(item.url);
          } catch (_) {}
        }

        if (!r || !r.ok) {
          if (filename) {
            r = await fetch('./' + filename);
          }
        }

        if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : 'failed'));
        const html = await r.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const h1 = doc.querySelector('h1');
        if (h1) h1.remove();
        let bodyHtml = doc.querySelector('body') ? doc.querySelector('body').innerHTML : html;
        setContentHtml(bodyHtml + renderCompanions(item));
      } catch (e) {
        setContentHtml(renderPlaceholder(item, 'Rendered article not yet published to GitHub Pages.'));
      }
    } else if (kind === 'image') {
      const img = item.image
        ? `<img src="${item.image}" style="max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;">`
        : `<p style="color:#666;">No image resolved.</p>`;
      setContentHtml(img + renderMetadata(item));
    } else {
      setContentHtml(renderPlaceholder(item) + renderMetadata(item));
    }
  };

  const handleScroll = () => {
    if (bodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(pct, 100));
    }
  };

  const handleCopy = async () => {
    if (!article || !bodyRef.current) return;
    const licenseHeader = settings?.export?.license_header || '';
    const license = licenseHeader.replace('{{canonical_url}}', article.canonical_url || article.url);
    const text = `${license}\n\n---\n\n${bodyRef.current.innerText}`;
    try {
      await navigator.clipboard.writeText(text);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch(e) {
      console.error('Copy failed:', e);
    }
  };

  const handleExport = () => {
    if (!article || !bodyRef.current) return;
    const licenseHeader = settings?.export?.license_header || '';
    const license = licenseHeader.replace('{{canonical_url}}', article.canonical_url || article.url);
    const text = `${license}\n\n---\n\n${bodyRef.current.innerText}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(article.id || article.url).split('/').pop().replace('.html', '') || 'article'}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleCopyUrl = async (e) => {
    e.preventDefault();
    if (!article) return;
    try {
      await navigator.clipboard.writeText(article.canonical_url || article.url);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch(err) {
      console.error('Copy URL failed:', err);
    }
  };

  if (!article) return null;

  const dateStr = article.date ? new Date(`${article.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const metaParts = [dateStr, article.reading_time].filter(Boolean);

  let authorName = (settings?.author?.name || settings?.author?.display || 'harold young').toLowerCase();
  let authorLink = settings?.author?.url;

  if (article.authors && article.authors.length > 0 && article.authors[0].name) {
    authorName = article.authors.map(a => a.name).join(', ').toLowerCase();
    authorLink = article.authors[0].url || article.canonical_url || article.url;
  } else if (article.author) {
    authorName = article.author.replace(/\s*\[humxn\]/i, '').trim().toLowerCase();
    authorLink = article.canonical_url || article.url;
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen && !isMinimized ? styles.open : ''}`}
        onClick={onClose}
      />
      <div
        className={`${styles.panel} ${isOpen && !isMinimized ? styles.open : ''} ${isMinimized ? styles.minimized : ''} ${wide ? styles.wide : ''}`}
        style={floatingPos ? { transform: `translate3d(${floatingPos.x}px, ${floatingPos.y}px, 0px)` } : undefined}
      >
        <div
          className={styles.toolbar}
          onMouseDown={handleToolbarMouseDown}
          onDoubleClick={() => setFloatingPos(null)}
          title="Drag toolbar to move window · Double-click to reset"
        >
          <div className={styles.dragGrip} title="Drag to move reading window">⋮⋮</div>
          {/* TTS Toolbar Placeholder */}
          <div id="tts-mount-point" className={styles.toolbarGroup}></div>

          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={`${styles.tb} ${showFrontmatter ? styles.active : ''}`}
              onClick={() => setShowFrontmatter(!showFrontmatter)}
              title="Article details"
              dangerouslySetInnerHTML={{ __html: `${ICONS.info}<span class="${styles.tbTooltip}">Details</span>` }}
            />
            <button
              className={styles.tb}
              onClick={handleExport}
              title="Export markdown"
              dangerouslySetInnerHTML={{ __html: `${ICONS.download}<span class="${styles.tbTooltip}">Export</span>` }}
            />
            <button
              className={styles.tb}
              onClick={handleCopy}
              title="Copy to clipboard"
              dangerouslySetInnerHTML={{ __html: `${ICONS.copy}<span class="${styles.tbTooltip}">Copy</span>` }}
            />
            <button
              className={`${styles.tb} ${wide ? styles.active : ''}`}
              onClick={() => setWide(w => !w)}
              title={wide ? 'Shrink reader' : 'Widen reader'}
              dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">${wide
                ? '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>'
                : '<polyline points="3 9 3 3 9 3"/><polyline points="21 15 21 21 15 21"/><line x1="3" y1="3" x2="10" y2="10"/><line x1="21" y1="21" x2="14" y2="14"/>'}</svg><span class="${styles.tbTooltip}">${wide ? 'Shrink' : 'Widen'}</span>` }}
            />
          </div>

          <div className={styles.toolbarSeparator}></div>

          <div className={styles.toolbarGroup}>
            <button
              className={`${styles.tb} ${styles.syndLink} ${styles.canonical}`}
              onClick={handleCopyUrl}
              dangerouslySetInnerHTML={{ __html: `${ICONS.link}<span class="${styles.tbTooltip}">Copy URL</span>` }}
            />
            {/* Other syndication links */}
            {Object.entries(article.syndication || {}).map(([platform, url]) => {
              if (!url) return null;
              const cfg = settings?.toolbar?.syndication_icons?.[platform];
              if (!cfg) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.tb} ${styles.syndLink}`}
                  dangerouslySetInnerHTML={{ __html: `${ICONS[cfg.icon] || ICONS.globe}<span class="${styles.tbTooltip}">${cfg.label}</span>` }}
                />
              );
            })}
          </div>

          <div className={styles.toolbarSpacer}></div>

          <div className={styles.windowControls}>
            <button
              className={`${styles.tb} ${styles.minimizeBtn}`}
              onClick={() => setIsMinimized(true)}
              title="Minimize reading window (turn off)"
              dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg><span class="${styles.tbTooltip}">Minimize</span>` }}
            />
            <button
              className={`${styles.tb} ${styles.closeBtn}`}
              onClick={onClose}
              title="Close reading window"
              dangerouslySetInnerHTML={{ __html: `${ICONS.close}<span class="${styles.tbTooltip}">Close</span>` }}
            />
          </div>
        </div>

        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${scrollProgress}%` }} />
        </div>

        {showFrontmatter && (
          <FrontmatterPanel article={article} settings={settings} />
        )}

        <div
          className={styles.body}
          data-tts-target
          ref={bodyRef}
          onScroll={handleScroll}
        >
          <div className={styles.articleHeader}>
            <div className={styles.articleTitle}>{article.title || article.label}</div>
            <div className={styles.articleByline}>
              by {authorLink ? (
                <a href={authorLink} target="_blank" rel="noopener noreferrer">{authorName}</a>
              ) : (
                authorName
              )}
            </div>
            {metaParts.length > 0 && (
              <div className={styles.articleMeta}>{metaParts.join(' · ')}</div>
            )}
            {article.kind && article.kind !== 'essay' && (
              <div className={styles.articleMeta} style={{ marginTop: 4, opacity: 0.7 }}>
                substrate: {article.kind}
              </div>
            )}
          </div>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </div>

      <div className={`${styles.copyToast} ${toastVisible ? styles.show : ''}`}>
        Copied to clipboard
      </div>

      {isMinimized && article && (
        <div
          className={styles.restorePill}
          onClick={() => setIsMinimized(false)}
          title="Bring reading window back"
        >
          <span className={styles.pillIcon}>📖</span>
          <span className={styles.pillLabel}>
            <span className={styles.pillTitle}>{article.title || article.label}</span>
            <span className={styles.pillAuthor}>by {authorName}</span>
          </span>
          <span className={styles.pillAction}>Restore ↗</span>
        </div>
      )}
    </>
  );
}

// Helpers
function renderPlaceholder(article, reason) {
  const r = reason || `This substrate ("${article.kind || 'unknown'}") is not yet renderable in the viewer.`;
  let html = `<div style="padding:24px;border:1px dashed var(--rp-border);border-radius:6px;background:rgba(17,24,39,0.4);">`;
  html += `<p style="color:var(--rp-accent);font-weight:600;margin-bottom:8px;">${r}</p>`;
  if (article.todos && article.todos.length) {
    html += `<p style="color:#f39c12;font-size:13px;">Pending: ${article.todos.join(', ')}</p>`;
  }
  const slug = (article.url || article.id || '').split('/').pop().replace('.html', '');
  const folderPath = article._source?.path || `chapters/${slug}`;
  html += `<p style="color:#888;font-size:13px;margin-top:12px;">The bundle exists at <code>${folderPath}</code>.</p>`;
  html += `</div>`;
  return html;
}

function renderCompanions(article) {
  const companions = (article.forms && article.forms.companions) || [];
  if (!companions.length) return '';
  let html = `<div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--rp-border);">`;
  html += `<div style="color:var(--rp-accent);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">also exists as</div>`;
  html += `<div style="color:var(--rp-text);font-size:14px;">${companions.map(c => `<span class="${styles.fmTag}">${c}</span>`).join(' ')}</div>`;
  html += `</div>`;
  return html;
}

function renderMetadata(article) {
  const rows = [];
  if (article.seed) rows.push(['seed', article.seed]);
  if (article.tldr) rows.push(['tldr', article.tldr]);
  if (article.topology && article.topology.length) rows.push(['topology', article.topology.join(' · ')]);
  if (article.energy) rows.push(['energy', article.energy]);
  if (article.note) rows.push(['note', article.note]);

  if (!rows.length) return '';

  let html = `<div style="margin-top:32px;padding:20px;background:rgba(17,24,39,0.4);border-radius:6px;">`;
  for (const [label, value] of rows) {
    html += `<div class="${styles.fmRow}"><span class="${styles.fmLabel}">${label}</span><span class="${styles.fmValue}">${value}</span></div>`;
  }
  html += `</div>`;
  return html;
}

function FrontmatterPanel({ article, settings }) {
  const fields = settings?.frontmatter_display || [];
  let hasData = false;

  const renderField = (field) => {
    let value = '';
    switch (field) {
      case 'publish_date':
        if (article.date) value = new Date(`${article.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        break;
      case 'updated_date':
        if (article.updated_date) value = article.updated_date;
        break;
      case 'reading_time':
        value = article.reading_time || '';
        break;
      case 'tags':
        if (article.tags && article.tags.length) {
          value = <>{article.tags.map(t => <span key={t} className={styles.fmTag}>{t}</span>)}</>;
        }
        break;
      case 'series':
        value = article.series || '';
        break;
      case 'license':
        value = article.license || '';
        break;
      case 'syndication':
        const synd = article.syndication || {};
        const links = Object.entries(synd).filter(([,url]) => url);
        if (links.length) {
          value = <>{links.map(([p, url], i) => (
            <React.Fragment key={p}>
              <a className={styles.fmSyndLink} href={url} target="_blank" rel="noopener noreferrer">{p}</a>
              {i < links.length - 1 ? ' · ' : ''}
            </React.Fragment>
          ))}</>;
        }
        break;
      default:
        break;
    }

    if (!value) return null;
    hasData = true;

    return (
      <div key={field} className={styles.fmRow}>
        <span className={styles.fmLabel}>{field.replace(/_/g, ' ')}</span>
        <span className={styles.fmValue}>{value}</span>
      </div>
    );
  };

  const content = fields.map(renderField);

  return (
    <div className={`${styles.frontmatterPanel} ${styles.open}`}>
      {hasData ? content : <div className={styles.fmRow}><span className={styles.fmValue} style={{color: '#666'}}>No metadata available.</span></div>}
    </div>
  );
}

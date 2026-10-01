import React, { useMemo, useState, useEffect } from 'react';
import styles from './Contributions.module.css';
import { forChapter, resolveQuote, paragraphsOf, assetUrl, slugOf } from '../../lib/contributions';

/**
 * Contributions — what readers brought to this chapter, under the chapter and
 * apart from it (settings.contributions). Never part of the text: its own
 * framed section, headed as from readers, with each one's name. Everything a
 * reader wrote is drawn as text, never as markup, and art only as an image
 * from the site's own asset store.
 *
 * A comment can be about a passage. Its words are looked for in the text as
 * it is now; when they can't be found (the text changed, or the words repeat
 * and their context can't decide), the comment says so and stays with the
 * chapter as a whole, rather than point at a paragraph it wasn't about.
 */

const HIGHLIGHT = 'pp-contrib-passage';
const hasHighlights = () => typeof CSS !== 'undefined' && CSS.highlights && typeof Highlight !== 'undefined';

function dateLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return isNaN(d) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function clip(s, n) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
}

// The text range of a resolved passage inside one paragraph element.
function rangeIn(p, offset, length) {
  const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const el = n.parentElement;
      return el && el.closest('.bookmarkRibbon, [aria-hidden="true"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  // resolveQuote counted with runs of whitespace squashed to one space; walk
  // the same way so the offsets agree.
  const r = document.createRange();
  let pos = 0;
  let prevSpace = false;
  let started = false;
  let n;
  const end = offset + length;
  while ((n = walker.nextNode())) {
    const v = n.nodeValue;
    for (let i = 0; i < v.length; i++) {
      const space = /\s/.test(v[i]);
      if (space && prevSpace) continue;
      prevSpace = space;
      if (!started && pos === offset) { r.setStart(n, i); started = true; }
      pos++;
      if (started && pos === end) { r.setEnd(n, i + 1); return r; }
    }
  }
  return started ? r : null;
}

export function Contributions({ article, contributions, config, feedData, textRef, textKey, onOpenChapter, children }) {
  const chapter = slugOf(article);
  const list = useMemo(() => forChapter(contributions, chapter), [contributions, chapter]);
  const [openEssay, setOpenEssay] = useState(null);
  const [placed, setPlaced] = useState({});

  const titleOf = useMemo(() => {
    const m = new Map();
    for (const it of (feedData && feedData.items) || []) m.set(slugOf(it), it);
    return m;
  }, [feedData]);

  // Where each passage is in the text as it is now.
  useEffect(() => {
    setOpenEssay(null);
    const t = setTimeout(() => {
      const el = textRef && textRef.current;
      const ps = el ? Array.from(el.querySelectorAll('p')) : [];
      const texts = ps.map((p) => p.textContent);
      const out = {};
      for (const c of list) {
        if (c.quote) out[c.id] = ps.length ? resolveQuote(texts, c.quote) : null;
      }
      setPlaced(out);
    }, 80);
    return () => clearTimeout(t);
  }, [list, article, textKey]);

  useEffect(() => () => { if (hasHighlights()) CSS.highlights.delete(HIGHLIGHT); }, [article]);

  const showPassage = (c) => {
    const at = placed[c.id];
    const el = textRef && textRef.current;
    if (!at || !el) return;
    const p = el.querySelectorAll('p')[at.para];
    if (!p) return;
    const scroller = el.closest('[data-tts-target]');
    if (scroller) {
      const top = p.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      scroller.scrollTop += top - 40;
    }
    const range = rangeIn(p, at.offset, at.length);
    el.querySelectorAll('[data-contrib-passage]').forEach((x) => x.removeAttribute('data-contrib-passage'));
    p.setAttribute('data-contrib-passage', c.id);
    if (range && hasHighlights()) {
      CSS.highlights.set(HIGHLIGHT, new Highlight(range));
    }
    setTimeout(() => {
      if (p.getAttribute('data-contrib-passage') === c.id) p.removeAttribute('data-contrib-passage');
      if (hasHighlights()) CSS.highlights.delete(HIGHLIGHT);
    }, 4000);
  };

  if (!list.length && !children) return null;

  const quoteLine = (c) => {
    if (!c.quote) return null;
    const at = placed[c.id];
    if (at) {
      return (
        <div className={styles.quote} data-contrib-anchor="found">
          <span className={styles.quoteText}>“{clip(c.quote.exact, 140)}”</span>
          <button type="button" className={styles.linkBtn} onClick={() => showPassage(c)} data-contrib-show>
            Show the passage
          </button>
        </div>
      );
    }
    if (at === null) {
      return (
        <div className={styles.fallback} data-contrib-anchor="fallback">
          This was about a passage that isn’t in the chapter as it reads now, so it stays with the chapter as a whole.
        </div>
      );
    }
    return null;
  };

  const byline = (c) => (
    <div className={styles.byline}>
      <span className={styles.author}>{c.author}</span>
      {dateLabel(c.created) && <span className={styles.date}> · {dateLabel(c.created)}</span>}
      {c.test && <span className={styles.testTag}> · test</span>}
    </div>
  );

  return (
    <aside className={styles.section} aria-label="From readers" data-contributions data-pp-not-text>
      <div className={styles.head}>
        <div className={styles.title}>From readers</div>
        <div className={styles.note}>Not part of the book. Written by readers, with their names.</div>
      </div>
      {list.length === 0 && <div className={styles.empty}>Nothing from readers on this chapter yet.</div>}
      <ul className={styles.list}>
        {list.map((c) => (
          <li key={c.id} className={styles.item} data-contrib={c.id} data-contrib-type={c.type}>
            <div className={styles.kind}>{
              c.type === 'essay' ? 'Essay' : c.type === 'art' ? 'Art' : c.type === 'connection' ? 'Connection' : 'Comment'
            }</div>
            {c.title && <div className={styles.itemTitle}>{c.title}</div>}
            {byline(c)}
            {quoteLine(c)}
            {c.type === 'comment' && paragraphsOf(c.body).map((p, i) => <div key={i} className={styles.para}>{p}</div>)}
            {c.type === 'connection' && (() => {
              const other = c.chapter === chapter ? c.to : c.chapter;
              const it = titleOf.get(other);
              return (
                <>
                  <div className={styles.para}>
                    Connects this chapter with{' '}
                    {it && onOpenChapter ? (
                      <button type="button" className={styles.linkBtn} onClick={() => onOpenChapter(it)} data-contrib-goto={other}>
                        {it.title || other}
                      </button>
                    ) : (it && it.title) || other}
                  </div>
                  {paragraphsOf(c.body).map((p, i) => <div key={i} className={styles.para}>{p}</div>)}
                </>
              );
            })()}
            {c.type === 'art' && (
              <figure className={styles.art}>
                <img src={assetUrl(c.asset, config)} alt={c.alt || `Art by ${c.author}`} loading="lazy" />
                {c.body && <figcaption className={styles.para}>{c.body}</figcaption>}
              </figure>
            )}
            {c.type === 'essay' && (() => {
              const ps = paragraphsOf(c.body);
              const open = openEssay === c.id;
              return (
                <div className={styles.essay} data-contrib-essay={open ? 'open' : 'closed'}>
                  {!open && <div className={styles.para}>{clip(ps[0] || '', 220)}</div>}
                  {open && ps.map((p, i) => <div key={i} className={styles.para}>{p}</div>)}
                  <button
                    type="button"
                    className={styles.linkBtn}
                    aria-expanded={open}
                    onClick={() => setOpenEssay(open ? null : c.id)}
                    data-contrib-open
                  >
                    {open ? 'Close the essay' : 'Read the essay'}
                  </button>
                </div>
              );
            })()}
          </li>
        ))}
      </ul>
      {children}
    </aside>
  );
}

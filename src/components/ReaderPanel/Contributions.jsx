import React, { useMemo, useState, useEffect } from 'react';
import styles from './Contributions.module.css';
import { forChapter, resolveQuote, paragraphsOf, assetUrl, slugOf, quoteFromSelection, checkSubmission } from '../../lib/contributions';

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

  if (!list.length && !children && !(config && config.submit)) return null;

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
      {config && config.submit && (
        <SubmitForm article={article} chapter={chapter} config={config} feedData={feedData} textRef={textRef} />
      )}
      {children}
    </aside>
  );
}

// The passage the reader has selected in the chapter's text, within one
// paragraph, as a quote with a few words either side; null otherwise.
function selectedQuote(textEl) {
  const sel = typeof window !== 'undefined' && window.getSelection ? window.getSelection() : null;
  if (!sel || sel.isCollapsed || !sel.rangeCount || !textEl) return null;
  const range = sel.getRangeAt(0);
  if (!textEl.contains(range.commonAncestorContainer)) return null;
  const startEl = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
  const p = startEl && startEl.closest('p');
  if (!p || !textEl.contains(p) || !p.contains(range.endContainer)) return { error: 'Choose a passage within one paragraph.' };
  const pre = document.createRange();
  pre.setStart(p, 0);
  pre.setEnd(range.startContainer, range.startOffset);
  const start = pre.toString().length;
  return quoteFromSelection(p.textContent, start, start + range.toString().length);
}

/**
 * The form a reader sends a contribution with (settings.contributions.submit).
 * A name to show, what it is, the text, and if they like a passage they
 * selected. Nothing else about them is asked for or sent. It goes to a queue;
 * nothing appears until it has been read and approved.
 */
function SubmitForm({ article, chapter, config, feedData, textRef }) {
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('comment');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [to, setTo] = useState('');
  const [quote, setQuote] = useState(null);
  const [lastSel, setLastSel] = useState(null);
  const [state, setState] = useState({ sending: false, errors: [], done: false });
  const limits = config.limits || {};

  useEffect(() => { setQuote(null); setLastSel(null); setState({ sending: false, errors: [], done: false }); }, [chapter]);

  // A tap on a button can clear a selection on a phone, so the last
  // selection made in the text is kept while the form is open.
  useEffect(() => {
    if (!open) return undefined;
    const onSel = () => {
      const q = selectedQuote(textRef && textRef.current);
      if (q) setLastSel(q);
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, [open, textRef]);

  const others = ((feedData && feedData.items) || [])
    .filter((it) => slugOf(it) !== chapter && it._posted !== 'title')
    .map((it) => ({ id: slugOf(it), title: it.title || slugOf(it) }));

  const submission = () => ({
    author: author.trim(),
    type,
    ...(type === 'essay' && title.trim() ? { title: title.trim() } : {}),
    body,
    anchor: { chapter, ...(quote && !quote.error ? quote : {}) },
    ...(type === 'connection' ? { to } : {}),
  });

  const send = async (e) => {
    e.preventDefault();
    const s = submission();
    const errors = checkSubmission(s, config);
    if (errors.length) { setState({ sending: false, errors, done: false }); return; }
    setState({ sending: true, errors: [], done: false });
    try {
      const r = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) {
        setState({ sending: false, errors: out.errors || [out.error || 'It could not be sent just now. Please try again later.'], done: false });
        return;
      }
      setBody(''); setTitle(''); setQuote(null);
      setState({ sending: false, errors: [], done: true });
    } catch (_) {
      setState({ sending: false, errors: ['It could not be sent just now. Please try again later.'], done: false });
    }
  };

  if (!open) {
    return (
      <div className={styles.addRow}>
        <button type="button" className={styles.addBtn} onClick={() => setOpen(true)} data-contrib-add>
          Add yours
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={send} data-contrib-form noValidate>
      <div className={styles.formTitle}>Add yours</div>
      <div className={styles.note}>
        It is read before it appears here. Only the name you give is kept with it; nothing else about you is asked for or stored.
      </div>
      <label className={styles.field}>
        <span>Name to show</span>
        <input value={author} maxLength={limits.name} onChange={(e) => setAuthor(e.target.value)} autoComplete="nickname" data-contrib-field="author" />
      </label>
      <label className={styles.field}>
        <span>What it is</span>
        <select value={type} onChange={(e) => setType(e.target.value)} data-contrib-field="type">
          <option value="comment">A comment</option>
          <option value="essay">An essay</option>
          <option value="connection">A connection to another chapter</option>
        </select>
      </label>
      {type === 'essay' && (
        <label className={styles.field}>
          <span>Title (optional)</span>
          <input value={title} maxLength={140} onChange={(e) => setTitle(e.target.value)} data-contrib-field="title" />
        </label>
      )}
      {type === 'connection' && (
        <label className={styles.field}>
          <span>The other chapter</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} data-contrib-field="to">
            <option value="">Choose…</option>
            {others.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
          </select>
        </label>
      )}
      <label className={styles.field}>
        <span>{type === 'connection' ? 'How they connect' : 'Your words'}</span>
        <textarea value={body} maxLength={limits.body} rows={type === 'essay' ? 10 : 4} onChange={(e) => setBody(e.target.value)} data-contrib-field="body" />
      </label>
      <div className={styles.passage}>
        {quote && !quote.error ? (
          <>
            <span className={styles.quoteText}>About: “{clip(quote.exact, 120)}”</span>
            <button type="button" className={styles.linkBtn} onClick={() => setQuote(null)}>Not about a passage</button>
          </>
        ) : (
          <>
            <span className={styles.note}>
              {quote && quote.error ? quote.error : 'To write about a passage, select it in the chapter, then:'}
            </span>
            <button
              type="button"
              className={styles.linkBtn}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setQuote(selectedQuote(textRef && textRef.current) || lastSel || { error: 'Select a passage in the chapter first.' })}
              data-contrib-use-selection
            >
              Use the passage I selected
            </button>
          </>
        )}
      </div>
      {state.errors.length > 0 && (
        <ul className={styles.errors} role="alert">
          {state.errors.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      )}
      {state.done && (
        <div className={styles.thanks} role="status" data-contrib-sent>
          Thank you. It will appear here once it has been read and approved.
        </div>
      )}
      <div className={styles.formActions}>
        <button type="submit" className={styles.addBtn} disabled={state.sending} data-contrib-send>
          {state.sending ? 'Sending…' : 'Send'}
        </button>
        <button type="button" className={styles.linkBtn} onClick={() => setOpen(false)}>Close</button>
      </div>
    </form>
  );
}

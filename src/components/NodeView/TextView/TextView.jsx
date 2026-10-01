import React from 'react';
import styles from './TextView.module.css';
import { ResizeHandles } from '../ResizeHandles';
import { numberToLowercaseWords } from '../../../lib/readerHeader';

/**
 * TextView — the lens that renders a text-substrate node (essay, fragment,
 * multi, or any kind whose primary content is read as text) as a card.
 *
 * Pure presentation: no event handlers, no D3, no state. Renders into any
 * container. The graph mounts one of these inside each article foreignObject;
 * future surfaces (search-result rows, companion strips) can mount the same
 * component without any change.
 *
 * Props:
 *   article: the corpus item (title, short_title, description, image, etc.)
 *   width, height: render dimensions in pixels
 *   viewState: { hovered, pinned, lod, zoomScale } — current display mode
 *     lod ∈ { 'slug' | 'title' | 'full' } — zoom-derived level of detail
 *     hovered/pinned promote the card to "expanded" (scrollable text)
 *   fullContent: optional pre-fetched article HTML; when present and pinned,
 *     replaces the summary as the scrollable body
 *   onResize: optional callback ({ width, height }) => void
 *   theme: optional { accent, publishedColor, draftColor } overrides; falls
 *     back to CSS-variable defaults declared in the module
 */
export function TextView({ article, width, height, viewState, fullContent, onResize, cardSettings }) {
  const { hovered = false, pinned = false, lod = 'full', zoomScale = 1 } = viewState || {};
  const expanded = hovered || pinned;
  const useFullArticle = pinned && !!fullContent;

  // The "draft vs published" distinction maps to the bucket the graph
  // ingester chose. Used to tint backgrounds. Per-source color (when
  // provided via article._source.color) overrides the border so each
  // feed has its own visual identity.
  const isDraft = !(
    article._status === 'published' ||
    article._status === 'bloomed' ||
    !!(article.syndication && article.syndication.canonical)
  );
  const sourceColor = article.containerColor || article.color || (article._source && article._source.color);
  const bookmarkCount = viewState?.bookmarkCount ?? (Array.isArray(viewState?.bookmarks) ? viewState.bookmarks.length : (Array.isArray(article?.bookmarks) ? article.bookmarks.length : 0));

  // Image-kind nodes are a different visual: photo card with caption.
  if (article.kind === 'image' && article.image) {
    return (
      <ImageCard
        article={article}
        width={width}
        height={height}
        pinned={pinned}
        hovered={hovered}
        isDraft={isDraft}
        zoomScale={zoomScale}
        bookmarkCount={bookmarkCount}
        onResize={onResize}
      />
    );
  }

  // A cover used to be painted across the whole card under an 85%-opaque tint.
  // At that opacity a photograph is a smudge and a diagram is noise — it read
  // as the card being badly rendered rather than as an image being present.
  // The cover now gets a band of its own at full opacity with the text below
  // it, so it is either legibly an image or not shown at all.
  // How loudly this card renders is a property of its source, not its status.
  // Before, `published` meant blue and everything else meant dark — so the
  // eighty subscribed items and eight of your own drafts rendered identically,
  // and your own unfinished work disappeared into somebody else's news.
  const prominence = (article._source && article._source.prominence)
    || (article.originalItem && article.originalItem._source && article.originalItem._source.prominence)
    || 'secondary';
  const isPrimary = prominence === 'primary';

  const bgColor = isPrimary
    ? (isDraft ? '#24304a' : '#1e3a5f')   // yours: finished, and still in progress
    : '#23232f';                          // subscribed: present, quieter

  // A cover is worth knowing about at a glance and not worth a third of the
  // card. A band took 59px of 140 and squeezed the text that the node exists
  // to show, so the image is a corner mark at rest; the reader panel is where
  // it gets shown properly.
  const hasImage = Boolean(article.image);
  const bandHeight = 0;

  // How far this viewer has read it: a thin bar along the bottom edge,
  // filling as they go, and a quiet mark once they reach the end.
  const progress = viewState && viewState.progress;
  const readMax = progress ? Math.max(0, Math.min(1, progress.max || 0)) : 0;
  const readDone = !!(progress && progress.done);

  const cardClassNames = [
    styles.card,
    readDone && styles.complete,
    sourceColor && !pinned && styles.glow,
    isDraft ? styles.draft : styles.published,
    expanded && styles.expanded,
    pinned && styles.pinned,
    viewState.lod === 'marker' && !expanded && styles.marker
  ].filter(Boolean).join(' ');

  const showHandles = viewState.lod !== 'marker';

  return (
    <div
      className={cardClassNames}
      style={{
        width,
        height,
        background: bgColor,
        // settings.graph.card.cornerRadius; a marker stays a dot.
        ...(cardSettings?.cornerRadius != null && !(viewState.lod === 'marker' && !expanded)
          ? { borderRadius: cardSettings.cornerRadius } : {}),
        // Provenance moves from a full coloured ring to a bar down one edge.
        // Ringing the whole card in a saturated feed colour competed with the
        // content for attention; an edge bar says the same thing quietly.
        // Pinned still wins outright, for selection clarity.
        // Provenance as a glow all the way round rather than a bar down one
        // edge or a saturated ring. The ring competed with the card's own
        // contents; a halo sits behind it. Rendered into the gutter the
        // GraphViewer leaves around the card for exactly this.
        ...(sourceColor && !pinned ? { '--nv-src': sourceColor } : {})
      }}
    >
      {bookmarkCount > 0 && (
        <div
          className={styles.bookmarkMark}
          title={bookmarkCount === 1 ? '1 bookmark' : `${bookmarkCount} bookmarks`}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M3 2v12l5-3 5 3V2z" />
          </svg>
          {bookmarkCount > 1 && (
            <span className={styles.bookmarkCount}>{bookmarkCount}</span>
          )}
        </div>
      )}
      {hasImage && (
        <div
          className={styles.imageMark}
          style={{
            backgroundImage: `url('${article.image}')`,
            ...(cardSettings?.imageMarkSize ? { width: cardSettings.imageMarkSize, height: cardSettings.imageMarkSize } : {}),
          }}
          title="has an image"
        />
      )}
      <CardContent
        article={article}
        width={width}
        height={height - bandHeight}
        bandHeight={bandHeight}
        viewState={viewState}
        expanded={expanded}
        useFullArticle={useFullArticle}
        fullContent={fullContent}
        cardSettings={cardSettings}
      />
      {showHandles && (readMax > 0 || readDone) && (
        <div
          className={styles.readBar}
          role="progressbar"
          aria-label="Read"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((readDone ? 1 : readMax) * 100)}
          data-read-progress={readDone ? 'done' : Math.round(readMax * 100)}
        >
          <div className={styles.readFill} style={{ width: `${(readDone ? 1 : readMax) * 100}%` }} />
        </div>
      )}
      {showHandles && readDone && (
        <div className={styles.readMark} title="Read to the end" aria-hidden="true">✓</div>
      )}
      {pinned && <PopoutButton />}
      {showHandles && (
        <ResizeHandles
          width={width}
          height={height}
          zoomScale={zoomScale}
          onResize={onResize}
        />
      )}
    </div>
  );
}

// Size a short label to actually fill the card it sits in.
//
// The label font was a fixed 18 units no matter how big the card was or how
// few words it held, so a card carrying two words spent ninety percent of
// itself on empty space. Reducing titles to two and four words freed that room
// and nothing claimed it.
//
// Tries laying the words out over one line, two, three, four; for each, asks
// how large the type could be before the longest line overflows the width or
// the stack overflows the height; keeps the best. Character width is estimated
// rather than measured — a measurement would need a layout pass per node per
// zoom change, and being a few percent conservative costs nothing here.
function fitFontSize(text, width, height, opts = {}) {
  const {
    min = 14, max = 36, lineHeight = 1.22, charRatio = 0.52, pad = 10, maxLines = 4,
  } = opts;
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length || !width || !height) return min;

  const boxW = Math.max(width - pad * 2, 8);
  const boxH = Math.max(height - pad * 2, 8);

  let best = min;
  for (let lines = 1; lines <= Math.min(maxLines, words.length); lines++) {
    const perLine = Math.ceil(words.length / lines);
    let longest = 0;
    let used = 0;
    for (let i = 0; i < words.length; i += perLine) {
      longest = Math.max(longest, words.slice(i, i + perLine).join(' ').length);
      used++;
    }
    const byWidth = boxW / Math.max(longest * charRatio, 1);
    const byHeight = boxH / Math.max(used * lineHeight, 1);
    best = Math.max(best, Math.min(byWidth, byHeight));
  }
  return Math.round(Math.max(min, Math.min(max, best)));
}

// Below this height, a title pinned above the body costs more than it gives:
// it takes a third of the card and leaves a slot too short to read in.
const COMPACT_HEIGHT = 260;

// English number words from 0 to 99, shared with the reader's header line.

function CardContent({ article, width, height, bandHeight = 0, viewState, expanded, useFullArticle, fullContent, cardSettings }) {
  // Expanded (hover or pin): title + scrollable body. Pin upgrades to the
  // full fetched article when available; otherwise we show the summary.
  if (expanded) {
    const body = useFullArticle ? fullContent : (article.description || '');
    const title = article.title || article.label;

    // In a small card the title scrolls away with the text instead of holding
    // a fixed band at the top. You have already read it by the time you start
    // scrolling, and the card is too short to spend 36px on remembering it.
    if (height && height < COMPACT_HEIGHT) {
      return (
        <div className={`${styles.scroll} ${styles.scrollFull} ${useFullArticle ? styles.full : ''} rp-scroll`}>
          <div className={styles.titleScrolling}>{title}</div>
          {body && <div dangerouslySetInnerHTML={{ __html: body }} />}
        </div>
      );
    }

    return (
      <>
        <div className={styles.title}>
          {title}
        </div>
        {body && (
          <div
            className={`${styles.scroll} ${useFullArticle ? styles.full : ''} rp-scroll`}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </>
    );
  }

  // Marker-LOD: small dot, empty content inside.
  if (viewState.lod === 'marker') {
    return null;
  }

  // In the unselected (not open) card: do not show the summary (the idea.tldr /
  // description text). Show the title large and bold, and under it a subtitle
  // in a smaller, lighter weight, with tight spacing between them (line-height
  // about 1.05, 2–4px gap), centered in the card.
  const subtitleTemplate = cardSettings?.subtitle || (typeof window !== 'undefined' && window.SETTINGS?.graph?.card?.subtitle);
  let subtitle = null;
  if (subtitleTemplate && article.series_part != null && article.series_part !== '') {
    const n = article.series_part;
    const n_words = numberToLowercaseWords(n);
    subtitle = subtitleTemplate
      .replace(/\{n\}/g, String(n))
      .replace(/\{n_words\}/g, n_words);
  }

  const title = (viewState.lod === 'slug')
    ? (article.label || article.labelMedium || article.title || '')
    : (article.title || article.label);

  const titleFontSize = fitFontSize(title, width, subtitle ? (height - 30) : height, {
    min: cardSettings?.labelMinFontSize ?? 14,
    max: cardSettings?.labelMaxFontSize ?? 26,
    lineHeight: 1.05,
    pad: 8,
  });
  const subtitleFontSize = Math.max(11, Math.round(titleFontSize * 0.62));

  return (
    <div className={styles.cardCenter}>
      <div
        className={styles.cardTitle}
        style={{ fontSize: `${titleFontSize}px` }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          className={styles.cardSubtitle}
          style={{ fontSize: `${subtitleFontSize}px` }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

function ImageCard({ article, width, height, pinned, hovered, isDraft, zoomScale, bookmarkCount = 0, onResize }) {
  // Photo-on-top, caption-below. Hover/pin slightly enlarges.
  const cardClassNames = [
    styles.imageCard,
    isDraft ? styles.draft : styles.published,
    pinned && styles.pinned
  ].filter(Boolean).join(' ');

  const imgH = pinned ? height - 24 : hovered ? height - 24 : height - 24;

  return (
    <div
      className={cardClassNames}
      style={{ width, height }}
    >
      {bookmarkCount > 0 && (
        <div
          className={styles.bookmarkMark}
          title={bookmarkCount === 1 ? '1 bookmark' : `${bookmarkCount} bookmarks`}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M3 2v12l5-3 5 3V2z" />
          </svg>
          {bookmarkCount > 1 && (
            <span className={styles.bookmarkCount}>{bookmarkCount}</span>
          )}
        </div>
      )}
      <div
        className={styles.imageFrame}
        style={{
          width,
          height: imgH,
          backgroundImage: `url('${article.image}')`
        }}
      />
      <div className={styles.imageCaption}>
        {article.short_title || article.title || article.label}
      </div>
      {pinned && <PopoutButton />}
      <ResizeHandles
        width={width}
        height={height}
        zoomScale={zoomScale}
        onResize={onResize}
      />
    </div>
  );
}

function PopoutButton() {
  return (
    <div
      data-popout="1"
      title="Open in reader"
      className={styles.popout}
    >
      <svg
        data-popout="1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        width="13"
        height="13"
        style={{ pointerEvents: 'none' }}
      >
        <path d="M14 3h7v7" />
        <path d="M21 3l-9 9" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </svg>
    </div>
  );
}

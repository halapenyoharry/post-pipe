import React, { useRef, useState, useEffect } from 'react';
import styles from './ResizeHandles.module.css';

const MIN_WIDTH = 140;
const MIN_HEIGHT = 80;
const MAX_WIDTH = 700;
const MAX_HEIGHT = 700;

export function ResizeHandles({ width, height, zoomScale = 1, onResize, onResizeEnd }) {
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef(null);

  const startResize = (direction, e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = width;
    const startH = height;
    const scale = zoomScale > 0 ? zoomScale : 1;

    dragRef.current = { direction, startX, startY, startW, startH, scale };

    const handlePointerMove = (moveEvt) => {
      if (!dragRef.current) return;
      const { direction, startX, startY, startW, startH, scale } = dragRef.current;
      const dx = (moveEvt.clientX - startX) / scale;
      const dy = (moveEvt.clientY - startY) / scale;

      let newW = startW;
      let newH = startH;

      if (direction.includes('e')) newW = startW + dx;
      if (direction.includes('w')) newW = startW - dx;
      if (direction.includes('s')) newH = startH + dy;
      if (direction.includes('n')) newH = startH - dy;

      newW = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.round(newW)));
      newH = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, Math.round(newH)));

      if (onResize) {
        onResize({ width: newW, height: newH });
      }
    };

    const handlePointerUp = (upEvt) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = '';
      setIsResizing(false);
      dragRef.current = null;

      if (onResizeEnd) {
        onResizeEnd();
      }
    };

    const cursorMap = {
      nw: 'nwse-resize',
      ne: 'nesw-resize',
      sw: 'nesw-resize',
      se: 'nwse-resize',
      n: 'ns-resize',
      s: 'ns-resize',
      w: 'ew-resize',
      e: 'ew-resize'
    };

    document.body.style.cursor = cursorMap[direction] || 'nwse-resize';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div className={isResizing ? styles.resizing : undefined}>
      {/* 4 Edges */}
      <div
        className={`${styles.handle} ${styles.handleN}`}
        onPointerDown={(e) => startResize('n', e)}
        title="Drag to resize height"
      />
      <div
        className={`${styles.handle} ${styles.handleS}`}
        onPointerDown={(e) => startResize('s', e)}
        title="Drag to resize height"
      />
      <div
        className={`${styles.handle} ${styles.handleW}`}
        onPointerDown={(e) => startResize('w', e)}
        title="Drag to resize width"
      />
      <div
        className={`${styles.handle} ${styles.handleE}`}
        onPointerDown={(e) => startResize('e', e)}
        title="Drag to resize width"
      />

      {/* 4 Corners */}
      <div
        className={`${styles.handle} ${styles.handleNW}`}
        onPointerDown={(e) => startResize('nw', e)}
        title="Drag to resize"
      />
      <div
        className={`${styles.handle} ${styles.handleNE}`}
        onPointerDown={(e) => startResize('ne', e)}
        title="Drag to resize"
      />
      <div
        className={`${styles.handle} ${styles.handleSW}`}
        onPointerDown={(e) => startResize('sw', e)}
        title="Drag to resize"
      />
      <div
        className={`${styles.handle} ${styles.handleSE}`}
        onPointerDown={(e) => startResize('se', e)}
        title="Drag to resize"
      />
    </div>
  );
}

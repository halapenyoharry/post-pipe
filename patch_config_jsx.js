const fs = require('fs');
let code = fs.readFileSync('src/components/ConfigPanel/ConfigPanel.jsx', 'utf8');

// The JSX returned currently looks like:
//   return (
//     <>
//       <button
//         className={`${styles.triggerBtn} ${open || extWin ? styles.open : ''}`}
//         onClick={() => extWin ? extWin.focus() : setOpen(!open)}
// ...

const jsxStart = code.indexOf('  return (\n    <>');
const jsxEnd = code.indexOf('// ── Toggle sub-component');

let jsx = `  return (
    <>
      <button
        className={\`\${styles.triggerBtn} \${open ? styles.open : ''}\`}
        onClick={() => setOpen((o) => !o)}
        title="Configure viewer"
        aria-label="Configure viewer"
      >
        ⚡
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div 
            className={styles.panel} 
            role="dialog" 
            aria-label="Viewer Configuration"
            ref={panelRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.header}>
              <span className={styles.panelTitle}>Viewer Configuration</span>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
`;

// Extract everything from {/* ── Features to the end of the return
const featuresStart = code.indexOf('            {/* ── Features');
const featuresEnd = code.indexOf('  );\n}', featuresStart) + 7;

code = code.slice(0, jsxStart) + jsx + code.slice(featuresStart, featuresEnd) + '\n\n' + code.slice(jsxEnd);

fs.writeFileSync('src/components/ConfigPanel/ConfigPanel.jsx', code);

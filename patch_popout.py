import re

with open('src/components/ConfigPanel/ConfigPanel.jsx', 'r') as f:
    content = f.read()

# Add createPortal to imports
content = content.replace("import React, { useState, useEffect, useCallback, useRef } from 'react';", "import React, { useState, useEffect, useCallback, useRef } from 'react';\nimport { createPortal } from 'react-dom';")

popout_code = """
  const [extWin, setExtWin] = useState(null);
  const containerRef = useRef(null);

  const openPopout = () => {
    const win = window.open('', '_blank', 'width=420,height=650,noopener,noreferrer');
    if (!win) return;
    
    // Copy all stylesheets from main window
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => {
      win.document.head.appendChild(el.cloneNode(true));
    });
    
    win.document.body.style.margin = '0';
    win.document.body.style.background = '#14161e';
    win.document.body.style.color = '#fff';
    
    const div = win.document.createElement('div');
    win.document.body.appendChild(div);
    containerRef.current = div;
    
    win.addEventListener('beforeunload', () => {
      setExtWin(null);
      containerRef.current = null;
    });
    
    setExtWin(win);
    setOpen(false);
  };
"""

content = re.sub(r'(  const fileInputRef = useRef\(null\);)', r'\1\n' + popout_code, content)

# Change header to include a pop-out button if not in extWin
header_repl = """            <div className={styles.panelTitle}>Config</div>
            <div style={{display: 'flex', gap: '8px'}}>
              {!extWin && <button className={styles.closeBtn} onClick={openPopout} title="Pop out">↗</button>}
              <button className={styles.closeBtn} onClick={() => extWin ? extWin.close() : setOpen(false)} title="Close">×</button>
            </div>
          </div>"""
content = re.sub(r"            <div className=\{styles\.panelTitle\}>Config</div>\n            <button className=\{styles\.closeBtn\} onClick=\{\(\) => setOpen\(false\)\}>\n              ×\n            </button>\n          </div>", header_repl, content)

# When returning panel
panel_render = """  const panelContent = (
    <div className={extWin ? '' : styles.panel} style={extWin ? { padding: '16px', overflowY: 'auto', height: '100vh' } : {}}>
"""

content = re.sub(r'  return \(\n    <>\n      \{\/\* Trigger \*\/\}\n      <button\n        className=\{`\$\{styles\.triggerBtn\} \$\{open \? styles\.open : \'\'\}`\}\n        onClick=\{\(\) => setOpen\(!open\)\}\n        title="Configuration"\n      >\n        ⚙\n      </button>\n\n      \{\/\* Panel \*\/\}\n      \{open && \(\n        <>\n          <div className=\{styles\.backdrop\} onClick=\{\(\) => setOpen\(false\)\} />\n          <div className=\{styles\.panel\}>', 
    r"""  const panelContent = (
    <div className={extWin ? '' : styles.panel} style={extWin ? { padding: '16px', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' } : {}}>
""", content)

# Close the panelContent tag
content = content.replace("            </div>\n          </div>\n        </>\n      )}\n    </>\n  );\n}", 
"""            </div>
    </div>
  );

  return (
    <>
      <button
        className={`${styles.triggerBtn} ${open || extWin ? styles.open : ''}`}
        onClick={() => extWin ? extWin.focus() : setOpen(!open)}
        title="Configuration"
      >
        ⚙
      </button>
      {open && !extWin && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          {panelContent}
        </>
      )}
      {extWin && containerRef.current && createPortal(panelContent, containerRef.current)}
    </>
  );
}""")

with open('src/components/ConfigPanel/ConfigPanel.jsx', 'w') as f:
    f.write(content)

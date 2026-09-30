import re

with open('src/components/ReaderPanel/ReaderPanel.jsx', 'r') as f:
    content = f.read()

replacement = """        )}
        {settings.rights && (
          <div style={{ padding: '1rem 2rem', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            &copy; {settings.rights.year} {settings.rights.holder}. {settings.rights.statement}
          </div>
        )}
      </div>
    </div>"""

content = re.sub(r'        \)}\n      </div>\n    </div>', replacement, content)

with open('src/components/ReaderPanel/ReaderPanel.jsx', 'w') as f:
    f.write(content)

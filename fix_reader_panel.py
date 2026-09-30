import re
with open('src/components/ReaderPanel/ReaderPanel.jsx', 'r') as f:
    content = f.read()

# Locate where the body is rendered
replacement = """    <div className="rp-scroll">
        {article._posted === 'title' ? (
          <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6, fontStyle: 'italic' }}>
             Not yet published
          </div>
        ) : (
          <div
            data-tts-target
            className="rp-body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>"""

content = re.sub(r'    <div className="rp-scroll">\s*<div\s*data-tts-target\s*className="rp-body"\s*dangerouslySetInnerHTML={{ __html: html }}\s*/>\s*</div>', replacement, content)

with open('src/components/ReaderPanel/ReaderPanel.jsx', 'w') as f:
    f.write(content)

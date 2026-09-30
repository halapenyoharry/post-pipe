import re

with open('src/embed.jsx', 'r') as f:
    content = f.read()

replacement = """          onClose={() => {
            if (window.location.hash.startsWith('#read=')) {
              history.pushState(null, '', window.location.pathname + window.location.search);
              window.dispatchEvent(new Event('hashchange'));
            }
            setSelectedArticle(null);
          }}"""

content = re.sub(r'          onClose=\{\(\) => setSelectedArticle\(null\)\}', replacement, content)

with open('src/embed.jsx', 'w') as f:
    f.write(content)

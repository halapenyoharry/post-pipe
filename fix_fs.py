import re

with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

content = content.replace("badge.select('.container-badge-text').attr('font-size', `${fs}px`);", "badge.select('.container-badge-text').attr('font-size', `${fs2}px`);")

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)

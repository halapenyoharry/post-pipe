import re

with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

replacement = """            const dist = Math.hypot(dx, dy);
            const spacing = graphSettings.containerSpacing !== undefined ? graphSettings.containerSpacing : -20;
            const minDist = circle1.r + circle2.r + spacing;"""

content = re.sub(r'            const dist = Math\.hypot\(dx, dy\);\n            const minDist = circle1\.r \+ circle2\.r;', replacement, content)

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)

import re

with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

replacement = """        const minX = Math.min(...hull.map((p) => p[0]));
        const maxX = Math.max(...hull.map((p) => p[0]));
        const hullW = maxX - minX;
        const minFs = graphSettings.labelSize?.min || 32;
        const maxFs = graphSettings.labelSize?.max || 96;
        const fs = Math.max(minFs, Math.min(maxFs, hullW / 8));

        const badge = group.select('.container-badge');
        badge.select('.container-badge-text').attr('font-size', `${fs}px`);
        badge.select('.label-count').text(` ${memberNodes.length}`);"""

content = re.sub(r"        const badge = group\.select\('\.container-badge'\);\n.*?badge\.select\('\.container-badge-count'\)\.text\(` \$\{memberNodes\.length\}`\);", replacement, content, flags=re.DOTALL)

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)

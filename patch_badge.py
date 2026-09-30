import re
with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

replacement = """        const badge = group.select('.container-badge');
        badge.select('.container-badge-text').attr('font-size', `${fs2}px`);
        badge.select('.label-count').text(` ${memberNodes.length}`);
        const center = d3.polygonCentroid(hull);
        const cx = Number.isFinite(center[0]) ? center[0] : hullAvgX;
        
        // Label position: horizontally centered, vertically about one third down from the top
        const hullH = maxY - minY;
        const cy = minY + (hullH / 3);
        
        badge.attr('transform', `translate(${cx}, ${cy})`);"""
        
content = re.sub(r'        const badge = group.select\(\'\.container-badge\'\);\n        badge\.select\(\'\.container-badge-text\'\)\.attr\(\'font-size\', `\$\{fs2\}px`\);\n        badge\.select\(\'\.label-count\'\)\.text\(` \$\{memberNodes\.length\}`\);\n        const center = d3\.polygonCentroid\(hull\);\n        const cx = Number\.isFinite\(center\[0\]\) \? center\[0\] : hullAvgX;\n        const cy = Number\.isFinite\(center\[1\]\) \? center\[1\] : d3\.mean\(hull, \(p\) => p\[1\]\);\n        badge\.attr\(\'transform\', `translate\(\$\{cx\}, \$\{cy\}\)`\);', replacement, content)

content = content.replace("const minY = Math.min(...hull.map((p) => p[1]));", "const minY = Math.min(...hull.map((p) => p[1]));\n        const maxY = Math.max(...hull.map((p) => p[1]));")

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)

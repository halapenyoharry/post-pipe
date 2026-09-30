import re

with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

# in createContainerSeparationForce
repl1 = """          const radius = maxDist + pad;
          
          const minFs = graphSettings.labelSize?.min || 32;
          const maxFs = graphSettings.labelSize?.max || 96;
          c._fs = Math.max(minFs, Math.min(maxFs, (radius * 2) / 8));

          containerCircles.set(c.id, {"""
content = re.sub(r'          const radius = maxDist \+ pad;\n\n          containerCircles\.set\(c\.id, \{', repl1, content)

repl2 = """            const minSize = Math.max(60, memberNodes.length * 15);
            const minFs = graphSettings.labelSize?.min || 32;
            const maxFs = graphSettings.labelSize?.max || 96;
            c._fs = Math.max(minFs, Math.min(maxFs, (minSize * 2) / 8));
            
            containerCircles.set(c.id, {"""
content = re.sub(r'            const minSize = Math\.max\(60, memberNodes\.length \* 15\);\n            containerCircles\.set\(c\.id, \{', repl2, content)

# in updateContainers
repl3 = """        const isClosed = closedContainers.has(c.id);
        const fs = c._fs || 52;

        if (isClosed) {
          group.style('display', null);
          group.select('.container-hull').style('display', 'none');
          group.select('.container-badge').style('display', 'none');
          group.select('.container-macro-text').attr('font-size', `${fs}px`);
          group.select('.container-macro-node')"""
content = re.sub(r'        const isClosed = closedContainers\.has\(c\.id\);\n        if \(isClosed\) \{\n          group\.style\(\'display\', null\);\n          group\.select\(\'\.container-hull\'\)\.style\(\'display\', \'none\'\);\n          group\.select\(\'\.container-badge\'\)\.style\(\'display\', \'none\'\);\n          group\.select\(\'\.container-macro-node\'\)', repl3, content)

repl4 = """        const badge = group.select('.container-badge');
        badge.select('.container-badge-text').attr('font-size', `${fs}px`);
        badge.select('.label-count').text(` ${memberNodes.length}`);"""

content = re.sub(r"        const badge = group\.select\('\.container-badge'\);\n        badge\.select\('\.container-badge-text'\)\.attr\('font-size', `\$\{fs\}px`\);\n        badge\.select\('\.label-count'\)\.text\(` \$\{memberNodes\.length\}`\);", repl4, content)

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)

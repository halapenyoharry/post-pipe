import re

with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

replacement = """          } else {
            // Click with < 4px movement: toggle collapse
            const now = Date.now();
            const lastTap = c._lastTap || 0;
            const gesture = graphSettings.collapseGesture || 'tap';

            if (gesture === 'doubletap') {
              if (now - lastTap < 400) {
                if (isCollapsed) closedContainers.delete(c.id);
                else {
                  if (closedContainers.has(c.id)) closedContainers.delete(c.id);
                  else closedContainers.add(c.id);
                }
                applyContainerVisibility();
                c._lastTap = 0;
              } else {
                c._lastTap = now;
              }
            } else {
              if (isCollapsed) closedContainers.delete(c.id);
              else {
                if (closedContainers.has(c.id)) closedContainers.delete(c.id);
                else closedContainers.add(c.id);
              }
              applyContainerVisibility();
            }
          }
        });
    }"""

content = re.sub(r'          \} else \{\n            // Click with < 4px movement: toggle collapse\n            if \(isCollapsed\) \{\n              closedContainers\.delete\(c\.id\);\n            \} else \{\n              if \(closedContainers\.has\(c\.id\)\) \{\n                closedContainers\.delete\(c\.id\);\n              \} else \{\n                closedContainers\.add\(c\.id\);\n              \}\n            \}\n            applyContainerVisibility\(\);\n          \}\n        \}\);\n    \}', replacement, content)

content = content.replace(
    ".attr('class', 'container-badge');",
    ".attr('class', 'container-badge')\n      .style('touch-action', 'manipulation');"
)
content = content.replace(
    ".attr('class', 'container-macro-node')\n      .style('display', 'none');",
    ".attr('class', 'container-macro-node')\n      .style('display', 'none')\n      .style('touch-action', 'manipulation');"
)

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)

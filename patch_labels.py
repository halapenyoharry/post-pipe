import re

with open('src/components/GraphViewer/GraphViewer.jsx', 'r') as f:
    content = f.read()

wrap_func = r"""
    function buildWrappedLabel(textSel, d, maxLineChars) {
      const label = d.label || d.id;
      // We'll update the count text in updateContainers
      const words = label.split(/\s+/);
      const lines = [];
      let currentLine = '';
      for (const w of words) {
        if (!currentLine) {
          currentLine = w;
        } else if (currentLine.length + 1 + w.length > maxLineChars) {
          lines.push(currentLine);
          currentLine = w;
        } else {
          currentLine += ' ' + w;
        }
      }
      if (currentLine) lines.push(currentLine);

      textSel.selectAll('*').remove();
      const nLines = lines.length;
      lines.forEach((line, i) => {
        const isLast = (i === nLines - 1);
        textSel.append('tspan')
          .attr('class', 'label-line')
          .attr('x', 0)
          .attr('dy', i === 0 ? `-${(nLines - 1) * 0.5}em` : '1em')
          .text(line);
        if (isLast) {
          textSel.append('tspan')
            .attr('class', 'label-count')
            .attr('font-weight', '500')
            .attr('dx', '12px')
            .attr('font-size', '0.5em')
            .text('');
        }
      });
    }
"""

content = content.replace("    function getContainerColor(c) {", wrap_func + "    function getContainerColor(c) {")

with open('src/components/GraphViewer/GraphViewer.jsx', 'w') as f:
    f.write(content)

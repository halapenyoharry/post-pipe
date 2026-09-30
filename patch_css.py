import re

with open('src/components/ReaderPanel/ReaderPanel.module.css', 'r') as f:
    content = f.read()

replacement = """  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, width 0.3s ease;
  transform: translate3d(calc(100vw + 40px), 0, 0);
  -webkit-transform: translate3d(calc(100vw + 40px), 0, 0);
  opacity: 0;
  pointer-events: none;
}

.panel.open {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  opacity: 1;
  pointer-events: auto;
}"""

content = re.sub(r'  transition: transform 0\.3s cubic-bezier\(0\.16, 1, 0\.3, 1\), opacity 0\.25s ease, width 0\.3s ease;\n  transform: translateX\(calc\(100% \+ 40px\)\) scale\(0\.96\);\n  opacity: 0;\n  pointer-events: none;\n\}\n\n\.panel\.open \{\n  transform: translateX\(0\) scale\(1\);\n  opacity: 1;\n  pointer-events: auto;\n\}', replacement, content)

with open('src/components/ReaderPanel/ReaderPanel.module.css', 'w') as f:
    f.write(content)

const fs = require('fs');
let code = fs.readFileSync('src/components/ConfigPanel/ConfigPanel.module.css', 'utf8');

// Replace triggerBtn z-index (currently 60) -> 102
code = code.replace(/z-index: 60;/g, 'z-index: 102;');
// Replace backdrop z-index (currently 59) -> 102 (or 103, panel is 104)
code = code.replace(/z-index: 59;/g, 'z-index: 103;');
// Replace panel z-index (currently 61) -> 104
code = code.replace(/z-index: 61;/g, 'z-index: 104;');

// Add bottom sheet styles for narrow screens
const mediaQuery = `
@media (max-width: 600px), (pointer: coarse) {
  .panel {
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    transform: translateY(0);
    border-radius: 20px 20px 0 0;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    max-height: calc(100vh - 60px);
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
`;

code += '\n' + mediaQuery;

fs.writeFileSync('src/components/ConfigPanel/ConfigPanel.module.css', code);

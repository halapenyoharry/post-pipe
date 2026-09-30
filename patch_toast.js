const fs = require('fs');
let code = fs.readFileSync('src/components/ConfigPanel/ConfigPanel.module.css', 'utf8');
code = code.replace(/z-index: 70;/g, 'z-index: 105;');
fs.writeFileSync('src/components/ConfigPanel/ConfigPanel.module.css', code);

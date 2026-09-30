const fs = require('fs');
let code = fs.readFileSync('/Users/harold/Projects/epicofelinorjones.com/scripts/build.js', 'utf8');

code = code.replace(
  /\/\/ Ensure companions/,
  `// Ensure companions
  const publishedActs = SETTINGS.site?.publishedActs;
  if (publishedActs) {
    const actFolder = ACTS.find(a => a.act === ch.act)?.folder;
    if (actFolder && !publishedActs.includes(actFolder)) {
      fm.posted = 'no';
    }
  }
`
);

fs.writeFileSync('/Users/harold/Projects/epicofelinorjones.com/scripts/build.js', code);

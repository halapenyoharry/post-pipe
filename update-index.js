require('dotenv').config({ path: require('path').join(__dirname, 'auth', '.env') });
const fs = require('fs');
const path = require('path');
const { pushFile } = require('./platforms/github-pages.js');

async function main() {
  console.log('Pushing feed.json...');
  const feedContent = fs.readFileSync(path.join(__dirname, '_site', 'feed.json'));
  await pushFile('feed.json', feedContent);

  console.log('Pushing index.html...');
  const indexContent = fs.readFileSync(path.join(__dirname, '_site', 'index.html'), 'utf8');
  await pushFile('index.html', indexContent);
  
  console.log('Done.');
}

async function pushCovers() {
  const coversDir = path.join(__dirname, '_site', 'covers');
  if (!fs.existsSync(coversDir)) return;
  
  const files = fs.readdirSync(coversDir);
  for (const file of files) {
    if (file.startsWith('.')) continue; // skip .DS_Store
    console.log(`Pushing cover: ${file}...`);
    const content = fs.readFileSync(path.join(coversDir, file));
    await pushFile(`covers/${file}`, content);
  }
}

main().then(pushCovers).catch(console.error);

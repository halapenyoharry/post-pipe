#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const platform = args[0];
const flags = args.slice(1);

const isDraft   = !flags.includes('--publish');
const isLogin   = flags.includes('--login');
const fileArg   = flags.find(f => !f.startsWith('--'));

const PLATFORMS = ['medium', 'substack', 'youtube'];

if (!platform || !PLATFORMS.includes(platform)) {
  console.error(`
post-pipe — markdown in, platform post out

  Usage:
    cat article.md | node index.js <platform> [--draft|--publish]
    node index.js <platform> [--draft|--publish] article.md
    node index.js <platform> --login

  Platforms: ${PLATFORMS.join(', ')}
  Default:   --draft (safe)
`);
  process.exit(1);
}

const mod = require(`./platforms/${platform}`);

async function main() {
  if (isLogin) {
    await mod.login();
    return;
  }

  let content;
  if (fileArg) {
    content = fs.readFileSync(path.resolve(fileArg), 'utf8');
  } else {
    content = fs.readFileSync(0, 'utf8'); // stdin
  }

  const result = await mod.post(content, { draft: isDraft });
  console.log(isDraft ? `draft: ${result.url}` : `published: ${result.url}`);
}

main().catch(err => {
  console.error('error:', err.message);
  process.exit(1);
});

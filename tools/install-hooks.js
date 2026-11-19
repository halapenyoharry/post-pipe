#!/usr/bin/env node
// Copies tools/hooks/pre-commit and tools/hooks/pre-push into the repository's
// shared hooks folder ($(git rev-parse --git-common-dir)/hooks) and makes them
// executable. Refuses to overwrite an existing pre-commit or pre-push that
// differs and was not installed by this script. Never touches any other hook.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ENGINE_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(__dirname, 'hooks');
const HOOKS = ['pre-commit', 'pre-push'];
const MARKER = '# installed by tools/install-hooks.js';

function getSharedHooksDir() {
  const commonDir = execFileSync('git', ['rev-parse', '--git-common-dir'], {
    cwd: ENGINE_ROOT,
    encoding: 'utf8',
  }).trim();
  return path.resolve(ENGINE_ROOT, commonDir, 'hooks');
}

function installHooks(hooksDir = getSharedHooksDir(), sourceDir = SOURCE_DIR) {
  for (const name of HOOKS) {
    const srcPath = path.join(sourceDir, name);
    const dstPath = path.join(hooksDir, name);
    const srcContent = fs.readFileSync(srcPath, 'utf8');

    if (fs.existsSync(dstPath)) {
      const dstContent = fs.readFileSync(dstPath, 'utf8');
      if (dstContent !== srcContent && !dstContent.includes(MARKER)) {
        throw new Error(
          `hooks:install: ${dstPath} already exists, differs from ${srcPath}, and was not installed by this script; refusing to overwrite`,
        );
      }
    }
  }

  let updated = 0;
  for (const name of HOOKS) {
    const srcPath = path.join(sourceDir, name);
    const dstPath = path.join(hooksDir, name);
    const srcContent = fs.readFileSync(srcPath, 'utf8');

    let sameContent = false;
    let executable = false;
    if (fs.existsSync(dstPath)) {
      sameContent = fs.readFileSync(dstPath, 'utf8') === srcContent;
      executable = (fs.statSync(dstPath).mode & 0o111) !== 0;
    }

    if (!sameContent) {
      fs.writeFileSync(dstPath, srcContent, { mode: 0o755 });
      fs.chmodSync(dstPath, 0o755);
      updated++;
    } else if (!executable) {
      fs.chmodSync(dstPath, 0o755);
      updated++;
    }
  }

  return { hooksDir, updated };
}

if (require.main === module) {
  try {
    const { hooksDir, updated } = installHooks();
    console.log(
      updated
        ? `hooks:install: installed ${HOOKS.join(', ')} into ${hooksDir}`
        : `hooks:install: ${HOOKS.join(', ')} already up to date in ${hooksDir}`,
    );
  } catch (err) {
    console.error(err && err.message ? err.message : String(err));
    process.exit(1);
  }
}

module.exports = { HOOKS, MARKER, getSharedHooksDir, installHooks };

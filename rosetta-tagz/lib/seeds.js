// Loading seed + config files shared by several bin/ programs.
import fs from 'node:fs';
import { readJSON } from './io.js';

export const SHIPPED_SEED = new URL('../seed/common.json', import.meta.url).pathname;

export function loadSeeds({ files = [], none = false } = {}) {
  const seeds = [];
  if (!none) seeds.push(readJSON(SHIPPED_SEED));
  for (const f of files) seeds.push(readJSON(f));
  return seeds;
}

export function loadJSONIfExists(file) {
  return file && fs.existsSync(file) ? readJSON(file) : {};
}

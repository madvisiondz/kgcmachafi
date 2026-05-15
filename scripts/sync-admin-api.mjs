/**
 * Copy canonical PHP APIs from `api/` into deploy mirrors:
 *   - deploy/api/
 *   - ready-to-deploy/public_html/api/
 *
 * Usage (repo root): node scripts/sync-admin-api.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'api');

const targets = [path.join(root, 'deploy', 'api'), path.join(root, 'ready-to-deploy', 'public_html', 'api')];

function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, name.name);
    const d = path.join(dest, name.name);
    if (name.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (!fs.existsSync(source)) {
  console.error('Missing source folder:', source);
  process.exit(1);
}

for (const dest of targets) {
  rmrf(dest);
  copyRecursive(source, dest);
  console.log('Synced →', path.relative(root, dest));
}

console.log('Done.');

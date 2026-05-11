#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const sourceIndexPath = path.join(rootDir, 'index.source.html');
const targetIndexPath = path.join(rootDir, 'index.html');
const sourceMainPath = path.join(rootDir, 'src', 'main.source.jsx');
const targetMainPath = path.join(rootDir, 'src', 'main.jsx');

if (!fs.existsSync(sourceIndexPath)) {
  console.error('Missing index.source.html. Cannot restore the Vite source template.');
  process.exit(1);
}

if (!fs.existsSync(sourceMainPath)) {
  console.error('Missing src/main.source.jsx. Cannot restore the React entry module.');
  process.exit(1);
}

fs.copyFileSync(sourceIndexPath, targetIndexPath);
fs.copyFileSync(sourceMainPath, targetMainPath);
console.log('Restored source index.html and src/main.jsx from their source templates');
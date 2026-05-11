#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const rootDir = process.cwd();
const viteCliPath = path.join(rootDir, 'node_modules', 'vite', 'dist', 'node', 'cli.js');
const indexPath = path.join(rootDir, 'index.html');
const mainPath = path.join(rootDir, 'src', 'main.jsx');

const backups = new Map();

function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    backups.set(filePath, fs.readFileSync(filePath, 'utf8'));
  } else {
    backups.set(filePath, null);
  }
}

function restoreBackups() {
  for (const [filePath, content] of backups.entries()) {
    if (content === null) {
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true });
      }
      continue;
    }

    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function runStep(command, args, { allowFailure = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0 && !allowFailure) {
    throw new Error(`Step failed: ${command} ${args.join(' ')}`);
  }
}

backupFile(indexPath);
backupFile(mainPath);

try {
  runStep('node', ['tools/restore-source-index.js']);
  runStep('node', ['tools/generate-llms.js'], { allowFailure: true });
  // Windows: `vite`/`npx` are often `.cmd` shims; spawnSync without a shell won't resolve them reliably.
  runStep(process.execPath, [viteCliPath, 'build']);
  runStep('node', ['tools/deploy-build.js']);
} catch (error) {
  restoreBackups();
  console.error('Build failed. Restored the previous live entry files.');
  throw error;
}

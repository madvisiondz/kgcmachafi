#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const distAssetsDir = path.join(distDir, 'assets');
const liveAssetsDir = path.join(rootDir, 'assets');
const distIndexPath = path.join(distDir, 'index.html');

function removePath(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function copyDirectory(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

function extractAssetPath(pattern, content, description) {
  const match = content.match(pattern);

  if (!match) {
    console.error(`Unable to find ${description} in dist/index.html.`);
    process.exit(1);
  }

  return match[1];
}

function writeLegacyEntryShim(jsAssetPath, cssAssetPath) {
  const shimPath = path.join(rootDir, 'src', 'main.jsx');
  const shimContent = `const cssHref = ${JSON.stringify(cssAssetPath)};
const scriptHref = ${JSON.stringify(jsAssetPath)};

if (cssHref && !document.querySelector(\`link[rel="stylesheet"][href="\${cssHref}"]\`)) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = cssHref;
  document.head.appendChild(stylesheet);
}

import(scriptHref);
`;

  fs.writeFileSync(shimPath, shimContent, 'utf8');
}

if (!fs.existsSync(distIndexPath)) {
  console.error('Missing dist/index.html. Run the build before deployment.');
  process.exit(1);
}

const distIndexContent = fs.readFileSync(distIndexPath, 'utf8');
const jsAssetPath = extractAssetPath(/<script[^>]*src="([^"]+\.js)"/i, distIndexContent, 'JS bundle path');
const cssAssetPath = extractAssetPath(/<link[^>]*href="([^"]+\.css)"/i, distIndexContent, 'CSS bundle path');

removePath(liveAssetsDir);
copyDirectory(distAssetsDir, liveAssetsDir);
fs.copyFileSync(distIndexPath, path.join(rootDir, 'index.html'));

const distHtaccessPath = path.join(distDir, '.htaccess');
if (fs.existsSync(distHtaccessPath)) {
  fs.copyFileSync(distHtaccessPath, path.join(rootDir, '.htaccess'));
}

writeLegacyEntryShim(jsAssetPath, cssAssetPath);

const readyPublicHtml = path.join(rootDir, 'ready-to-deploy', 'public_html');
if (fs.existsSync(readyPublicHtml)) {
  const rtdAssets = path.join(readyPublicHtml, 'assets');
  removePath(rtdAssets);
  copyDirectory(distAssetsDir, rtdAssets);
  fs.copyFileSync(distIndexPath, path.join(readyPublicHtml, 'index.html'));
  if (fs.existsSync(distHtaccessPath)) {
    fs.copyFileSync(distHtaccessPath, path.join(readyPublicHtml, '.htaccess'));
  }
  const apiSrc = path.join(rootDir, 'api');
  const apiDest = path.join(readyPublicHtml, 'api');
  if (fs.existsSync(apiSrc)) {
    removePath(apiDest);
    copyDirectory(apiSrc, apiDest);
  }
  console.log('Synced dist/ + api/ → ready-to-deploy/public_html/');
}

console.log('Published dist/ to the live document root.');
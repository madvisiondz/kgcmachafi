import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, '../public/favicon.svg');
const outPath = path.join(__dirname, '../public/favicon.png');

const t = fs.readFileSync(svgPath, 'utf8');
const m =
  t.match(/href="data:image\/png;base64,([^"]+)"/) ||
  t.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
if (!m) {
  console.error('No embedded PNG data URL found in favicon.svg');
  process.exit(1);
}
const buf = Buffer.from(m[1], 'base64');
fs.writeFileSync(outPath, buf);
console.log('Wrote', outPath, 'bytes=', buf.length);

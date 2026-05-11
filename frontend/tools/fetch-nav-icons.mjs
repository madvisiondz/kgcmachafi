import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT_DIR = path.resolve('public/nav-icons');

// Consistent icon set: Material Design Icons (mdi) via Iconify API.
// We request SVGs from the internet, then rasterize to PNG for the navbar.
const ICONS = [
  { key: 'home', icon: 'mdi/home-outline', color: '#ffffff' },
  { key: 'library', icon: 'mdi/book-open-page-variant-outline', color: '#facc15' }, // yellow-ish like legacy
  { key: 'pharmacies', icon: 'mdi/pharmacy', color: '#ffffff' },
  { key: 'ambulances', icon: 'mdi/ambulance', color: '#fecaca' }, // soft red
  { key: 'accommodation', icon: 'mdi/home-heart', color: '#bfdbfe' }, // soft blue
  { key: 'programs', icon: 'mdi/television-classic', color: '#ffffff' },
  { key: 'live', icon: 'mdi/radio-tower', color: '#ffffff' },
  // Branding-bar variants (white background): use colored glyphs to match legacy button text.
  { key: 'live-red', icon: 'mdi/radio-tower', color: '#dc2626' },
  { key: 'programs-blue', icon: 'mdi/television-classic', color: '#2563eb' },
  { key: 'services', icon: 'mdi/hand-heart-outline', color: '#ffffff' },
  { key: 'hospitals', icon: 'mdi/hospital-building', color: '#ffffff' },
  { key: 'consultations', icon: 'mdi/stethoscope', color: '#ffffff' },
  { key: 'donations', icon: 'mdi/hand-coin-outline', color: '#ffffff' },
  { key: 'news', icon: 'mdi/newspaper-variant-outline', color: '#ffffff' },
];

const SIZE = 18; // matches legacy-ish nav icon size (w-4 ~ 16px; this looks crisp)

function iconifySvgUrl(icon, color) {
  // Iconify API expects {prefix}/{name}.svg
  // icon is "mdi/home-outline" -> prefix "mdi", name "home-outline"
  const [prefix, name] = icon.split('/');
  const params = new URLSearchParams({
    color,
    width: String(SIZE),
    height: String(SIZE),
  });
  return `https://api.iconify.design/${prefix}/${name}.svg?${params.toString()}`;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { Accept: 'image/svg+xml' } });
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  return await res.text();
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const item of ICONS) {
    const svgUrl = iconifySvgUrl(item.icon, item.color);
    const svg = await fetchText(svgUrl);

    const png = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    const outPath = path.join(OUT_DIR, `${item.key}.png`);
    await fs.writeFile(outPath, png);
    process.stdout.write(`wrote ${path.relative(process.cwd(), outPath)}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


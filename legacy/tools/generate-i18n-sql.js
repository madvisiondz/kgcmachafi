#!/usr/bin/env node

/**
 * Plan B "first fill": generate SQL inserts for content_i18n from existing Arabic DB content.
 *
 * Usage:
 *   node tools/generate-i18n-sql.js --site "https://www.kgc-machafi.online" --out "i18n-seed.sql"
 *
 * Notes:
 * - This runs on YOUR machine (where outbound translation works).
 * - It calls LibreTranslate directly from Node (configurable via --translate).
 * - Then it outputs SQL you import with phpMyAdmin.
 */

const args = process.argv.slice(2);
const getArg = (name, fallback = '') => {
  const idx = args.indexOf(name);
  return idx >= 0 ? args[idx + 1] : fallback;
};

const SITE = (getArg('--site') || '').replace(/\/$/, '');
const OUT = getArg('--out', 'i18n-seed.sql');
const TRANSLATE = (getArg('--translate', 'https://libretranslate.com')).replace(/\/$/, '');

if (!SITE) {
  console.error('Missing --site "https://your-domain.com"');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SKIP_KEYS = new Set([
  'id', 'icon_key', 'color_class', 'bg_class', 'features', 'features_json',
  'image_url', 'video_url', 'file_path', 'lat', 'lng', 'rating', 'price', 'currency',
  'sort_order', 'is_active', 'created_at', 'updated_at', 'doctors_count',
]);

const isArabic = (s) => /[\u0600-\u06FF]/.test(s);

async function translateText(q, target) {
  const res = await fetch(`${TRANSLATE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ q, source: 'ar', target, format: 'text' }),
  });
  if (!res.ok) throw new Error(`translate_failed_${res.status}`);
  const data = await res.json();
  return data.translatedText || q;
}

function sqlEscape(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "''");
}

function addRow(rows, entityType, entityId, field, lang, text) {
  if (!text || !String(text).trim()) return;
  rows.push(
    `INSERT INTO content_i18n (entity_type, entity_id, field, lang, text) VALUES (` +
      `'${sqlEscape(entityType)}', ${Number(entityId) || 0}, '${sqlEscape(field)}', '${sqlEscape(lang)}', '${sqlEscape(text)}'` +
    `) ON DUPLICATE KEY UPDATE text = VALUES(text);`
  );
}

async function main() {
  const contentRes = await fetch(`${SITE}/api/public/site-content.php?lang=ar`);
  if (!contentRes.ok) throw new Error(`site_content_failed_${contentRes.status}`);
  const content = await contentRes.json();

  const rows = [];

  // site_settings (entity_id = 0)
  const hero = content?.settings?.hero_content || {};
  const footer = content?.settings?.footer_content || {};

  const siteFields = {
    'hero_content.badge': hero.badge,
    'hero_content.title_start': hero.title_start,
    'hero_content.title_end': hero.title_end,
    'hero_content.description': hero.description,
    'footer_content.brand_name': footer.brand_name,
    'footer_content.slogan': footer.slogan,
    'footer_content.description': footer.description,
    'footer_content.phone': footer.phone,
    'footer_content.email': footer.email,
    'footer_content.address': footer.address,
  };

  // translate EN/FR
  for (const [field, value] of Object.entries(siteFields)) {
    if (typeof value !== 'string' || !isArabic(value)) continue;
    // eslint-disable-next-line no-await-in-loop
    const en = await translateText(value, 'en');
    // eslint-disable-next-line no-await-in-loop
    const fr = await translateText(value, 'fr');
    addRow(rows, 'site_settings', 0, field, 'en', en);
    addRow(rows, 'site_settings', 0, field, 'fr', fr);
    // eslint-disable-next-line no-await-in-loop
    await sleep(150);
  }

  // hero_stats label
  for (const stat of content.hero_stats || []) {
    if (!stat?.id || typeof stat.label !== 'string' || !isArabic(stat.label)) continue;
    // eslint-disable-next-line no-await-in-loop
    addRow(rows, 'hero_stats', stat.id, 'label', 'en', await translateText(stat.label, 'en'));
    // eslint-disable-next-line no-await-in-loop
    addRow(rows, 'hero_stats', stat.id, 'label', 'fr', await translateText(stat.label, 'fr'));
    // eslint-disable-next-line no-await-in-loop
    await sleep(150);
  }

  // services: title/description/details + features_json
  for (const svc of content.services || []) {
    if (!svc?.id) continue;
    for (const key of ['title', 'description', 'details']) {
      const value = svc[key];
      if (typeof value !== 'string' || !isArabic(value)) continue;
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'services', svc.id, key, 'en', await translateText(value, 'en'));
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'services', svc.id, key, 'fr', await translateText(value, 'fr'));
      // eslint-disable-next-line no-await-in-loop
      await sleep(150);
    }
    if (Array.isArray(svc.features) && svc.features.length) {
      const ar = JSON.stringify(svc.features);
      // Translate each feature string, keep JSON structure
      const translateList = async (target) => {
        const out = [];
        for (const f of svc.features) {
          // eslint-disable-next-line no-await-in-loop
          out.push(typeof f === 'string' && isArabic(f) ? await translateText(f, target) : f);
          // eslint-disable-next-line no-await-in-loop
          await sleep(60);
        }
        return JSON.stringify(out);
      };
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'services', svc.id, 'features_json', 'en', await translateList('en'));
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'services', svc.id, 'features_json', 'fr', await translateList('fr'));
    }
  }

  // video programs: title/description
  for (const vp of content.video_programs || []) {
    if (!vp?.id) continue;
    for (const key of ['title', 'description']) {
      const value = vp[key];
      if (typeof value !== 'string' || !isArabic(value)) continue;
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'video_programs', vp.id, key, 'en', await translateText(value, 'en'));
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'video_programs', vp.id, key, 'fr', await translateText(value, 'fr'));
      // eslint-disable-next-line no-await-in-loop
      await sleep(150);
    }
  }

  // specialties: name
  for (const s of content.consultation_specialties || []) {
    if (!s?.id || typeof s.name !== 'string' || !isArabic(s.name)) continue;
    // eslint-disable-next-line no-await-in-loop
    addRow(rows, 'consultation_specialties', s.id, 'name', 'en', await translateText(s.name, 'en'));
    // eslint-disable-next-line no-await-in-loop
    addRow(rows, 'consultation_specialties', s.id, 'name', 'fr', await translateText(s.name, 'fr'));
    // eslint-disable-next-line no-await-in-loop
    await sleep(150);
  }

  // doctors: name/hospital/specialty_name
  for (const d of content.consultation_doctors || []) {
    if (!d?.id) continue;
    for (const key of ['name', 'hospital', 'specialty_name']) {
      const value = d[key];
      if (typeof value !== 'string' || !isArabic(value)) continue;
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'consultation_doctors', d.id, key, 'en', await translateText(value, 'en'));
      // eslint-disable-next-line no-await-in-loop
      addRow(rows, 'consultation_doctors', d.id, key, 'fr', await translateText(value, 'fr'));
      // eslint-disable-next-line no-await-in-loop
      await sleep(150);
    }
  }

  const header = [
    '-- Plan B i18n seed',
    '-- Import this into your MySQL database (phpMyAdmin).',
    'START TRANSACTION;',
    ...rows,
    'COMMIT;',
    '',
  ].join('\n');

  const fs = await import('node:fs');
  fs.writeFileSync(OUT, header, 'utf8');
  console.log(`Wrote ${rows.length} statements to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


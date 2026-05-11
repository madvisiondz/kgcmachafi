import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, '..');

const { wilayas, communes } = await import('../src/lib/algeria-data.js');

const ALLOWED = new Set([
  'Hospital',
  'General hospital',
  'University hospital',
  'Private hospital',
  'Military hospital',
]);

const normLatin = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

const normSimple = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

const GENERIC_TITLES = new Set(
  [
    'hospital',
    'general hospital',
    'university hospital',
    'private hospital',
    'military hospital',
    'hopital',
    'hôpital',
    'hopital general',
    'hôpital général',
    'military hospital',
    'public hospital',
    'government hospital',
    'مستشفى',
    'مستشفى عام',
    'مستشفى خاص',
    'مستشفى الجامعي',
    'مستشفى عسكري',
    'مستشفى الحكومي',
    'hospital général',
    'general',
  ].map(normSimple)
);

function isGenericTitle(title) {
  const t = String(title || '').trim();
  if (!t) return true;
  const ns = normSimple(t);
  if (GENERIC_TITLES.has(ns)) return true;
  if (t.length < 6) return true;
  if (t.startsWith('عيادة') || t.startsWith('العيادة')) return true;
  if (/^clinique\b/i.test(t) || /^clinic\b/i.test(t)) return true;
  if (/^a\s+military\s+hospital\.?$/i.test(t)) return true;
  if (/\bhealth\s+center\b/i.test(t)) return true;
  if (/^المستشفى\s+(الجديد|القديم|العام)$/u.test(t)) return true;
  if (/\bبيطر|veterinar|vétérinar|green vet\b/i.test(t)) return true;
  if (/\bwarehouse\b/i.test(t)) return true;
  return false;
}

function categoryToType(cat) {
  if (cat === 'Private hospital') return 'private';
  return 'public';
}

function rowScore(r) {
  let s = 0;
  if (r.phone && String(r.phone).trim()) s += 4;
  if (r.street && String(r.street).trim()) s += 3;
  if (r.totalScore != null && r.totalScore !== '') s += 2;
  if (r.reviewsCount != null && r.reviewsCount !== '') s += 1;
  return s;
}

/** city string -> wilaya id "01".."58" or null */
function buildLocationIndex() {
  const byKey = new Map(); // normKey -> [{ wilaya_id, label }]

  const add = (wilayaId, label) => {
    const k1 = normLatin(label);
    const k2 = normSimple(label);
    for (const k of new Set([k1, k2].filter(Boolean))) {
      if (!byKey.has(k)) byKey.set(k, []);
      byKey.get(k).push({ wilaya_id: wilayaId, label });
    }
  };

  for (const w of wilayas) {
    add(w.id, w.name);
    add(w.id, w.ar_name);
    const list = communes[w.id] || [];
    for (const c of list) {
      add(w.id, c.name);
      add(w.id, c.ar_name);
    }
  }

  return byKey;
}

const locationIndex = buildLocationIndex();

/** Commune list key as in algeria-data.js (`"01"` … `"58"`). */
function widKey(wilayaId) {
  return String(wilayaId ?? '').padStart(2, '0');
}

/** Latin place spellings from Google / French vs official French forms. */
function latinCityVariants(raw) {
  const t = normLatin(raw);
  if (!t) return [];
  const v = new Set([t]);
  v.add(t.replace(/^in\s+/, 'ain '));
  v.add(t.replace(/\s+in\s+/g, ' ain '));
  return [...v];
}

function communeNamesMatch(commune, rawCity) {
  const raw = String(rawCity || '').trim();
  if (!raw) return false;
  const rcL = normLatin(raw);
  const rcS = normSimple(raw);
  const names = [commune.name, commune.ar_name].filter(Boolean);
  for (const n of names) {
    if (normLatin(n) === rcL || normSimple(n) === rcS) return true;
    for (const v of latinCityVariants(raw)) {
      if (v && normLatin(n) === v) return true;
    }
  }
  return false;
}

/** Find official baladia (commune) for `wilaya_id`; prefer Arabic `ar_name` for frontend parity. */
function resolveBaladia(wilayaId, row) {
  const rawCity = String(row.city || '').trim();
  const street = String(row.street || '').trim();
  const title = String(row.title || '').trim();
  const list = communes[widKey(wilayaId)] || [];

  const display = (c) => String(c.ar_name || c.name || '').trim();

  const byCity = list.filter((c) => communeNamesMatch(c, rawCity));
  if (byCity.length === 1) {
    return { baladia: display(byCity[0]), commune_match: 'exact_city' };
  }
  if (byCity.length > 1) {
    return { baladia: rawCity, commune_match: 'ambiguous_city' };
  }

  const inferred = inferCommuneFromHaystack(wilayaId, rawCity, street, title);
  if (inferred) {
    return { baladia: display(inferred), commune_match: 'inferred_text' };
  }

  if (!rawCity) {
    return { baladia: rawCity, commune_match: 'empty_city' };
  }
  return { baladia: rawCity, commune_match: 'unresolved' };
}

/** When `city` is not a commune label, try `street` + `title` for a unique commune substring (same wilaya only). */
function inferCommuneFromHaystack(wilayaId, rawCity, street, title) {
  const list = communes[widKey(wilayaId)] || [];
  if (!list.length) return null;

  const hayLatin = normLatin(`${street} ${title} ${rawCity}`);
  const haySimple = normSimple(`${street} ${title} ${rawCity}`);
  const scored = [];

  for (const c of list) {
    let sc = 0;
    const nl = normLatin(c.name || '');
    const nsAr = normSimple(c.ar_name || '');
    const nsName = normSimple(c.name || '');

    if (nl.length >= 5 && hayLatin.includes(nl)) sc = Math.max(sc, 40 + nl.length);
    if (nsAr.length >= 4 && haySimple.includes(nsAr)) sc = Math.max(sc, 50 + nsAr.length);
    if (nsName.length >= 5 && haySimple.includes(nsName)) sc = Math.max(sc, 45 + nsName.length);

    if (sc > 0) scored.push({ c, sc });
  }

  if (!scored.length) return null;
  scored.sort((a, b) => b.sc - a.sc);
  if (scored.length === 1 || scored[0].sc > scored[1].sc) return scored[0].c;
  return null;
}

function resolveWilayaId(city, state) {
  const q = String(city || '').trim();
  if (!q) return null;
  const keys = [normLatin(q), normSimple(q)].filter(Boolean);
  const hits = new Map(); // wilaya_id -> count

  for (const k of keys) {
    const arr = locationIndex.get(k);
    if (!arr) continue;
    for (const { wilaya_id } of arr) {
      hits.set(wilaya_id, (hits.get(wilaya_id) || 0) + 1);
    }
  }

  if (hits.size === 0) return null;

  const ranked = [...hits.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length === 1) return ranked[0][0];

  const st = String(state || '').trim();
  if (st) {
    const sn = normLatin(st);
    const sn2 = normSimple(st);
    for (const w of wilayas) {
      if (normLatin(w.name) === sn || normSimple(w.ar_name) === sn2 || normLatin(w.ar_name) === sn) {
        if (hits.has(w.id)) return w.id;
      }
    }
  }

  return null;
}

/** Must match `hospitals` in kgcmachafi_madvision.sql (do not change that CREATE TABLE). */
const HOSPITAL_COL = {
  name: 255,
  type: 40,
  wilaya_id: 10,
  city: 255,
  address: 500,
  hours: 120,
  phone: 80,
  ratingMax: 9.99,
  reviewsMax: 4294967295,
};

function truncateCodepoints(str, max) {
  const s = String(str ?? '');
  const cp = [...s];
  if (cp.length <= max) return s;
  return cp.slice(0, max).join('');
}

function clampRating(n) {
  let v = Number(n);
  if (!Number.isFinite(v)) v = 0;
  if (v < 0) v = 0;
  if (v > HOSPITAL_COL.ratingMax) v = HOSPITAL_COL.ratingMax;
  return Math.round(v * 100) / 100;
}

function clampReviews(n) {
  let v = Math.floor(Number(n));
  if (!Number.isFinite(v) || v < 0) v = 0;
  return Math.min(HOSPITAL_COL.reviewsMax, v);
}

function sqlEscape(s) {
  return String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''");
}

function sqlString(s) {
  return `'${sqlEscape(s)}'`;
}

/** Empty → NULL (for columns that allow NULL in schema). */
function sqlStringOrNull(s) {
  const t = String(s ?? '').trim();
  return t === '' ? 'NULL' : `'${sqlEscape(t)}'`;
}

/** `city` is nullable — emit NULL when empty. */
function sqlCityColumn(s) {
  const t = truncateCodepoints(String(s ?? '').trim(), HOSPITAL_COL.city);
  return t === '' ? 'NULL' : sqlString(t);
}

function sqlRatingLiteral(n) {
  return clampRating(n).toFixed(2);
}

function sqlTimestamp(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `'${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}'`;
}

const rawPath = join(projectRoot, 'dataset raw.json');
const raw = JSON.parse(readFileSync(rawPath, 'utf8'));

const filtered = raw.filter((r) => ALLOWED.has(r.categoryName));
const nameCleaned = filtered.filter((r) => !isGenericTitle(r.title));

const dedupeMap = new Map();
for (const r of nameCleaned) {
  const nameKey = normSimple(r.title);
  const cityKey = normSimple(r.city);
  const key = `${nameKey}|${cityKey}`;
  const prev = dedupeMap.get(key);
  if (!prev || rowScore(r) > rowScore(prev)) dedupeMap.set(key, r);
}

const uniqueRows = [...dedupeMap.values()];

const out = [];
for (const r of uniqueRows) {
  const wilaya_id = resolveWilayaId(r.city, r.state);
  if (!wilaya_id) continue;

  const name = truncateCodepoints(String(r.title || '').trim(), HOSPITAL_COL.name);
  const google_city = String(r.city || '').trim();
  const { baladia: cityRaw, commune_match } = resolveBaladia(wilaya_id, r);
  const city = truncateCodepoints(String(cityRaw || '').trim(), HOSPITAL_COL.city);
  let address = truncateCodepoints(
    [r.street, city].filter(Boolean).join(', '),
    HOSPITAL_COL.address,
  );
  if (!address) address = truncateCodepoints(String(city || wilaya_id || '—'), HOSPITAL_COL.address);
  const phone = truncateCodepoints(String(r.phone || '').trim(), HOSPITAL_COL.phone);
  const rating = clampRating(
    r.totalScore != null && r.totalScore !== '' ? Number(r.totalScore) : 0,
  );
  const reviews_count = clampReviews(
    r.reviewsCount != null && r.reviewsCount !== '' ? parseInt(String(r.reviewsCount), 10) || 0 : 0,
  );
  const type = truncateCodepoints(categoryToType(r.categoryName), HOSPITAL_COL.type);
  const wilaya_id_s = truncateCodepoints(String(wilaya_id), HOSPITAL_COL.wilaya_id);

  const row = {
    name,
    wilaya_id: wilaya_id_s,
    city,
    commune_match,
    type,
    address,
    phone,
    rating,
    reviews_count,
  };
  if (google_city !== city) row.google_city = google_city;
  out.push(row);
}

const START_ID = 3;
out.forEach((h, i) => {
  h.id = START_ID + i;
  h.sort_order = i + 1;
});

writeFileSync(join(projectRoot, 'hospitals_cleaned.json'), JSON.stringify(out, null, 2), 'utf8');

const lines = [];
lines.push(
  '-- Values clamped to kgcmachafi_madvision.sql `hospitals` (decimal(3,2) rating, varchar(80) phone, …).',
);
lines.push('SET NAMES utf8mb4;');

const hospitalColsWithId =
  '`id`, `name`, `type`, `wilaya_id`, `city`, `address`, `specialties_json`, `rating`, `reviews_count`, `hours`, `phone`, `website`, `payment_methods_json`, `insurance_providers_json`, `features_json`, `sort_order`, `is_active`, `created_at`, `updated_at`';

const ts = sqlTimestamp(new Date());
const hoursSql = sqlString(truncateCodepoints('24/7', HOSPITAL_COL.hours));

const valueRows = out.map((h, i) => {
  const id = START_ID + i;
  const sortOrder = i + 1;
  const websiteSql = sqlStringOrNull('');
  return `(${id}, ${sqlString(h.name)}, ${sqlString(h.type)}, ${sqlString(h.wilaya_id)}, ${sqlCityColumn(h.city)}, ${sqlString(h.address)}, '[]', ${sqlRatingLiteral(h.rating)}, ${h.reviews_count}, ${hoursSql}, ${sqlString(h.phone)}, ${websiteSql}, '[]', '[]', '[]', ${sortOrder}, 1, ${ts}, ${ts})`;
});

lines.push(`INSERT INTO \`hospitals\` (${hospitalColsWithId}) VALUES`);
lines.push(`${valueRows.join(',\n')};`);

writeFileSync(join(projectRoot, 'hospitals_insert.sql'), lines.join('\n'), 'utf8');

console.log(JSON.stringify({ valid_hospitals: out.length }, null, 0));

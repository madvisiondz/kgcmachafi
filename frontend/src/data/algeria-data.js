import mapData from './Map.json';

const pad2 = (value) => String(value ?? '').padStart(2, '0');

const safeArray = (value) => (Array.isArray(value) ? value : []);

const clean = (value) => String(value ?? '').trim();

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
};

/**
 * Canonical wilayas list (updated source).
 * Data comes from `Map.json` (kept in this repo) so it can reflect the latest administrative updates.
 */
export const wilayas = safeArray(mapData)
  .map((w) => ({
    id: pad2(w?.code),
    name: clean(w?.name_fr),
    ar_name: clean(w?.name_ar),
  }))
  .filter((w) => w.id && w.name && w.ar_name)
  .sort((a, b) => Number(a.id) - Number(b.id));

const findWilaya = (wilayaId) => {
  const targetId = pad2(wilayaId);
  return safeArray(mapData).find((w) => pad2(w?.code) === targetId) || null;
};

const flattenCommunesFromWilaya = (wilaya) => {
  const dairas = safeArray(wilaya?.dairas);
  return dairas.flatMap((d) => safeArray(d?.communes));
};

/**
 * Canonical communes list per wilaya.
 *
 * - `id` is sourced from `slug` when present; otherwise a stable fallback.
 * - `name` is French (LTR); `ar_name` is Arabic (RTL).
 */
export const getCommunes = (wilayaId) => {
  const wilaya = findWilaya(wilayaId);
  if (!wilaya) return [];

  const code = pad2(wilaya.code);
  const raw = flattenCommunesFromWilaya(wilaya);

  const mapped = raw.map((c, idx) => ({
    id: String(c?.slug ?? `${code}-${idx + 1}`),
    name: clean(c?.name_fr),
    ar_name: clean(c?.name_ar),
  }));

  return uniqueBy(
    mapped.filter((c) => c.id && c.name && c.ar_name),
    (c) => c.id || `${c.name}|${c.ar_name}`,
  );
};


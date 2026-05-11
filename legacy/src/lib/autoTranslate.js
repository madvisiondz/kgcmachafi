const CACHE_PREFIX = 'kgc_translate_v1:';

// Server-ready default: same-origin translation proxy (avoids CORS in production).
// In dev you can override with VITE_TRANSLATE_ENDPOINT.
const DEFAULT_ENDPOINT = '/api/public/translate.php';

const SKIP_KEY_PARTS = new Set([
  'id',
  'icon',
  'icon_key',
  'color_class',
  'value',
  'time_slot',
  'days_of_week',
  'day_type',
  'day_of_week',
  'is_active',
  'is_archived',
  'created_at',
  'updated_at',
  'rating',
  'reviews',
  'lat',
  'lng',
  'url',
  'image_url',
  'video_url',
  'file_path',
  'pdf',
  'phone',
  'email',
]);

function djb2Hash(input) {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function hasArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function normalizeText(text) {
  return String(text ?? '').trim();
}

function getCacheKey({ source, target, text }) {
  return `${CACHE_PREFIX}${source}:${target}:${djb2Hash(text)}`;
}

function cacheGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function cacheSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // ignore
  }
}

function shouldSkipKey(key) {
  if (!key) return false;
  const lower = String(key).toLowerCase();
  for (const part of SKIP_KEY_PARTS) {
    if (lower === part || lower.endsWith(`_${part}`) || lower.includes(part)) {
      return true;
    }
  }
  return false;
}

async function libreTranslate({ text, source, target, endpoint, apiKey }) {
  const cleanEndpoint = String(endpoint || '').trim();
  const url = cleanEndpoint.endsWith('.php') || cleanEndpoint.includes('/translate.php')
    ? cleanEndpoint
    : `${cleanEndpoint.replace(/\/$/, '')}/translate`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: 'text',
      api_key: apiKey || undefined,
    }),
  });

  if (!res.ok) {
    throw new Error('translate_failed');
  }

  const payload = await res.json();
  const translatedText = payload?.translatedText;
  if (typeof translatedText !== 'string') {
    throw new Error('translate_invalid');
  }
  return translatedText;
}

/**
 * Translate a single string with cache. Intended for Arabic DB content -> target language.
 */
export async function translateText(text, { source = 'ar', target, endpoint, apiKey } = {}) {
  const clean = normalizeText(text);
  if (!clean) return text;
  if (!target || target === source) return text;
  if (!hasArabic(clean)) return text;

  const effectiveEndpoint = endpoint
    || (typeof import.meta !== 'undefined'
      ? (import.meta.env?.VITE_TRANSLATE_ENDPOINT || DEFAULT_ENDPOINT)
      : DEFAULT_ENDPOINT);
  const effectiveApiKey = apiKey || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_TRANSLATE_API_KEY : undefined);

  const cacheKey = getCacheKey({ source, target, text: clean });
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const translated = await libreTranslate({
    text: clean,
    source,
    target,
    endpoint: effectiveEndpoint,
    apiKey: effectiveApiKey,
  });

  cacheSet(cacheKey, translated);
  return translated;
}

/**
 * Deep-translate plain JSON-like structures (objects/arrays), skipping known non-text keys.
 */
export async function translateDeep(input, { source = 'ar', target } = {}) {
  if (!target || target === source) return input;
  if (input === null || input === undefined) return input;

  if (typeof input === 'string') {
    try {
      return await translateText(input, { source, target });
    } catch (error) {
      return input;
    }
  }

  if (Array.isArray(input)) {
    const out = [];
    for (const item of input) {
      // eslint-disable-next-line no-await-in-loop
      out.push(await translateDeep(item, { source, target }));
    }
    return out;
  }

  if (typeof input === 'object') {
    const out = {};
    const entries = Object.entries(input);
    for (const [key, value] of entries) {
      if (shouldSkipKey(key)) {
        out[key] = value;
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      out[key] = await translateDeep(value, { source, target });
    }
    return out;
  }

  return input;
}


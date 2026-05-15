/**
 * Health Services admin — PHP `/api/admin/*` helpers.
 * Supports `{ ok, data }` envelopes and legacy `{ items }` / `{ message }` bodies.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export function adminApiUrl(path) {
  if (!path) return API_BASE;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/**
 * @param {unknown} json
 * @param {Response} response
 * @returns {{ ok: boolean, data?: unknown, errorCode?: string, errorMessage?: string }}
 */
export function unwrapAdminJson(json, response) {
  if (json === null || typeof json !== 'object') {
    return {
      ok: false,
      errorCode: 'invalid_response',
      errorMessage: 'Empty or invalid server response.',
    };
  }

  if (json.ok === true) {
    return { ok: true, data: json.data };
  }

  if (json.ok === false) {
    const err = json.error && typeof json.error === 'object' ? json.error : {};
    return {
      ok: false,
      errorCode: typeof err.code === 'string' ? err.code : 'error',
      errorMessage: typeof err.message === 'string' ? err.message : 'Request failed.',
    };
  }

  const st = response.status;
  if (json.message && (st === 401 || st === 403 || st === 419 || st === 422)) {
    return {
      ok: false,
      errorCode: st === 419 ? 'csrf' : 'http',
      errorMessage: String(json.message),
    };
  }

  return { ok: true, data: json };
}

/**
 * @param {unknown} data
 * @returns {unknown[]}
 */
export function extractItemsList(data) {
  if (!data || typeof data !== 'object') return [];
  const d = /** @type {Record<string, unknown>} */ (data);
  if (Array.isArray(d.items)) return d.items;
  if (Array.isArray(d.rows)) return d.rows;
  if (Array.isArray(data)) return data;
  return [];
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown, csrfToken?: string | null, signal?: AbortSignal }} [opts]
 */
export async function adminFetch(path, opts = {}) {
  const { method = 'GET', body, csrfToken, signal } = opts;
  const headers = { Accept: 'application/json' };

  let reqBody = undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      reqBody = body;
    } else {
      headers['Content-Type'] = 'application/json';
      reqBody = JSON.stringify(body);
    }
  }

  if (csrfToken && method !== 'GET' && method !== 'HEAD') {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const res = await fetch(adminApiUrl(path), {
    method,
    credentials: 'include',
    headers,
    body: reqBody,
    signal,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text?.slice(0, 200) || 'Invalid JSON from server.' };
  }

  const un = unwrapAdminJson(json, res);
  return { response: res, ...un };
}

/**
 * Upload image or PDF to `/api/admin/uploads.php`.
 * @param {File} file
 * @param {{ category: string, kind?: 'image' | 'pdf', csrfToken: string }} opts
 */
export async function uploadAdminFile(file, { category, kind = 'image', csrfToken }) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('category', category);
  fd.append('kind', kind);
  return adminFetch('/admin/uploads.php', { method: 'POST', body: fd, csrfToken });
}

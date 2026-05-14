# API standard — GoDaddy + MySQL (SQL)

Companion to **`HOSTING_AND_DATABASE.md`**. All **new** and **revised** PHP endpoints should follow this shape so the future **`frontend/src/services/`** client stays thin and predictable.

## 1) URL layout

| Area | Base path | Auth |
|------|-----------|------|
| Public JSON | `/api/public/...` | None for reads; optional API key later for abuse control |
| Admin JSON | `/api/admin/...` | Session cookie or bearer (decide per module); **always server-side RBAC** |

Physical files remain under repo **`api/public/*.php`**, **`api/admin/*.php`** (Apache maps `/api` → `public_html/api` or equivalent).

## 2) JSON conventions

**Response (success):**

```json
{
  "ok": true,
  "data": { }
}
```

**Response (list):**

```json
{
  "ok": true,
  "data": {
    "items": [],
    "next_cursor": null,
    "meta": { "limit": 50 }
  }
}
```

**Response (error):**

```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

**HTTP status:** use **400** validation, **401/403** auth, **404** missing, **429** rate limit, **500** only for unexpected server faults.

## 3) Pagination & limits (shared hosting safe)

| Param | Meaning | Default | Max |
|-------|---------|---------|-----|
| `limit` | Page size | `25` | `100` |
| `cursor` | Opaque keyset cursor (preferred) | — | — |
| `offset` | Numeric offset (only if needed) | `0` | cap with `limit` |

Every `SELECT` used by a public list endpoint must be **bounded**.

## 4) Language / edition

| Product | Param |
|---------|--------|
| **Machafi Services** | `lang=ar|fr|en` on reads; SQL returns localized columns or joined `*_i18n` rows |
| **Machafi TV** | path segment **`/tv/{edition}/...`** mirrored in API as **`/api/public/tv/{edition}/...`** |

## 5) SQL hygiene

- **Indexes:** `(wilaya_code, commune_id)`, `(published_at)`, `(edition, status, published_at)`, `(slug, edition)` UNIQUE where applicable.
- **Migrations:** keep numbered `.sql` or PHP migration runner in repo (not only phpMyAdmin clicks).
- **Backups:** cPanel automated backups + periodic `mysqldump` off-server.

## 6) CORS

If SPA is ever served from a **different hostname** than API, set **specific** `Access-Control-Allow-Origin` — not `*`. Prefer **same origin** on GoDaddy to avoid preflight complexity.

---

*Trackers reference this file from their per-page “Full endpoint design” sections.*


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

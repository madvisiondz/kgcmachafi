# API deploy sync

**Canonical source:** `api/` (including `api/admin/`, `api/public/`, and `.htaccess`).

**Mirrors (overwrite):**

1. `deploy/api/`
2. `ready-to-deploy/public_html/api/`

## Automated sync

From the **repository root**:

```bash
node scripts/sync-admin-api.mjs
```

From **`frontend/`** (npm script):

```bash
npm run sync:admin-api
```

The script deletes each target `api` folder and recursively copies from `api/` so deploy trees cannot drift with stale PHP files.

## RBAC and JSON envelopes

Role matrix and capability notes: `PROJECT-EXPLAINER/HEALTH_SERVICES_ADMIN_RBAC.md`.

Admin handlers respond with **`{ ok: true, data: … }`** or **`{ ok: false, error: { code, message } }`** (HTTP status preserved, including `201` for creates where applicable).

## Log

- **2026-05-14** — Envelope + RBAC hardening across `api/admin/*.php`; optional SQL columns merged into `database/health_services_schema.sql`; `scripts/sync-admin-api.mjs` added; deploy trees refreshed via sync script.

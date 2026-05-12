# Machafi Services — admin panel (`/healthservices/admin/*`)

Single source of truth for **`HealthServicesAdminPage`** and the **future** Health Services control plane: directories, Services content, news moderation, donations/campaigns, and settings that feed the public **`/healthservices/*`** SPA.

## 1) Purpose

- **Operational truth**: editors maintain pharmacies, hospitals, ambulances, housing, programs, library metadata, consultations listings, donations campaigns, live player copy, and **Services** news (`/healthservices/news`) from one authenticated area.
- **Separation**: this admin tree is **not** Machafi TV editorial (`/machafitv/admin/*` — see **`../machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`**).

## 2) Routes (current)

| Path | Component | State |
|------|-----------|--------|
| **`/healthservices/admin`** | `HealthServicesAdminPage.jsx` | **Placeholder** — title, subtitle, link back to **`SERVICES_BASE`** |
| **`/healthservices/admin/*`** | Same element (wildcard) | No nested admin routes yet |

## 3) UX flow (target)

1. **Login** → session / JWT (or PHP session) scoped to `healthservices` admin role.
2. **Dashboard** → counts, pending moderation, broken listings.
3. **Modules** (sidebar): News, Donations, Directories (Hospitals, Pharmacies, …), Library, Live settings, Site copy, Users/RBAC.
4. **Edit** → form + preview where applicable; audit trail on save.

## 4) Data contracts (public vs admin)

- Public read models are documented per surface under **`../machafi-services/*_PAGE_MAP.md`** (e.g. news: **`../machafi-services/NEWS_PAGE_MAP.md`**).
- Admin writes extend the same tables or parallel `*_admin_drafts` workflows — align with existing PHP where present (`api/admin/news.php`, etc.).

## 5) Endpoint proposals

### Auth

- `POST /api/admin/auth/login` — email/password or SSO cookie; returns scoped token.
- `POST /api/admin/auth/logout`

### Core (illustrative — namespace under `api/admin/healthservices/` or reuse legacy tables)

- `GET/PUT /api/admin/settings` — site copy, live player fields, feature flags.
- **News**: extend **`api/admin/news.php`** (see **`../machafi-services/NEWS_PAGE_MAP.md`**) — list, create, update, archive, embargo, multilingual fields.
- **Donations**: `GET/POST/PUT /api/admin/donations/campaigns`, `GET /api/admin/donations/intents` (export).
- **Directories**: CRUD per entity type (`hospitals`, `pharmacies`, `ambulances`, `housing`, `consultations`, `programs`) + bulk CSV + coordinate validation.
- **Library**: `GET/POST/PUT/DELETE /api/admin/library/books` + categories.

### Audit

- `GET /api/admin/audit?entity=&id=` — who changed what (compliance).

## 6) Admin control panel (target modules)

| Module | Controls |
|--------|----------|
| News | Draft/review/publish, breaking/featured, wires, corrections, multilingual body |
| Donations | Campaigns, goals, receipts export, fraud holds |
| Directories | CRUD, verify badge, geo fields, night-shift flags (pharmacies), map pins |
| Library | Books, categories, cover assets |
| Live | Stream URL, poster, disclaimer HTML, “up next” rows |
| Users | Roles: `super`, `editor`, `directory_clerk`, `readonly` |
| Settings | i18n overrides, emergency banner, maintenance mode |

## 7) i18n (Rule #1)

- Placeholder UI: **`admin.healthTitle`**, **`admin.healthSub`**, **`admin.backToSite`** (`frontend/src/i18n/translations.ts`, AR/FR/EN).
- Full admin shell should use a dedicated `adminHealth.*` (or nested) key tree when UI grows.

## 8) File map

- `frontend/src/pages/admin/HealthServicesAdminPage.jsx`
- `frontend/src/App.tsx` — route **`/healthservices/admin/*`**
- `frontend/src/components/DocumentTitle.jsx` — `admin.healthTitle`
- `frontend/src/routes/paths.ts` — `SERVICES_BASE`

## 9) Safeguards

- **Never** expose raw ingest secrets or DB credentials in client bundles; stream keys only server-side.
- **RBAC**: directory clerks must not publish global homepage banners without elevated role.
- **CSRF** + **SameSite** cookies for session-based admin.

## 10) Changelog

- **2026-05-12**: Tracker created; documents placeholder route + target modules and API shape.

---

## Documentation sync (2026-05-12)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`.
- **Site chrome** / process: `../../PROJECT-EXPLAINER/PROMPT_LOG.md`.
- Related public trackers: **`../machafi-services/NEWS_PAGE_MAP.md`**, **`../machafi-services/DONATIONS_PAGE_MAP.md`**, directory `*_PAGE_MAP.md` files under **`../machafi-services/`**.

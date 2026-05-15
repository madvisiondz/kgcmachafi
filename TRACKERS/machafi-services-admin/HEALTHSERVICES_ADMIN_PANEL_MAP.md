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

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. This admin surface **aggregates** the PHP/SQL contracts defined in each **`../machafi-services/*_PAGE_MAP.md`** “Full endpoint design” section; do not fork conflicting paths.

### Auth (Health Services scope)

| Method | Path | PHP |
|--------|------|-----|
| POST | `/api/admin/auth/login` | **`api/admin/auth/login.php`** (existing pattern) |
| POST | `/api/admin/auth/logout` | **`api/admin/auth/logout.php`** |

### Module → primary PHP (**implemented** in `api/admin/`)

| Module | Admin PHP | Notes |
|--------|-----------|--------|
| Auth | `api/admin/auth/login.php`, `logout.php`, `session.php` | Login JSON includes **`csrf_token`** for mutating calls |
| News | `api/admin/news.php` | POST/PUT/DELETE need **`X-CSRF-Token`** |
| Pharmacies | `api/admin/pharmacies.php` | CSRF on writes |
| Hospitals | `api/admin/hospitals.php`, `api/admin/international-hospitals.php` | CSRF on writes |
| Ambulances | `api/admin/ambulances.php` | CSRF on writes |
| Accommodations | `api/admin/accommodations.php` | CSRF on writes |
| Programs | `api/admin/programs.php` | CSRF on writes |
| Library | `api/admin/books.php` | CSRF on writes |
| Services copy | `api/admin/services-content.php` | CSRF on writes |
| Site settings | `api/admin/site-settings.php` | CSRF on writes |
| Hero + home sections | `api/admin/hero-stats.php`, `api/admin/homepage-sections.php` | CSRF on writes |
| Video programs | `api/admin/video-programs.php` | CSRF on writes |
| Consultations | `api/admin/consultation-specialties.php`, `consultation-doctors.php`, `consultation-bookings.php` | Bookings: GET/PATCH/DELETE |
| Donations | `api/admin/donation-campaigns.php` | CSRF on writes |
| Live page | `api/admin/live-page.php` | CSRF on PUT |
| Contact inbox | `api/admin/contact-messages.php` | CSRF on DELETE |
| i18n / users | `api/admin/i18n.php`, `api/admin/public-users.php` | CSRF on writes |

**Full matrix + public `api/public/*`:** **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`** and **`HEALTH_SERVICES_BACKEND.md`**.

---

## Documentation sync (2026-05-12)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`.
- **Site chrome** / process: `../../PROJECT-EXPLAINER/PROMPT_LOG.md`.
- Related public trackers: **`../machafi-services/NEWS_PAGE_MAP.md`**, **`../machafi-services/DONATIONS_PAGE_MAP.md`**, directory `*_PAGE_MAP.md` files under **`../machafi-services/`**.

---

## 12) Health Services admin — session + CSRF (2026-05-14)

All **mutating** admin handlers touched in the Health Services pass call `require_admin_write()` → validate header **`X-CSRF-Token`** against the session value issued at login. Scripts or a future React admin must store `csrf_token` from `POST api/admin/auth/login.php` and send it on POST/PUT/PATCH/DELETE.

---

## Visual depth (2026-05-15)

Admin shell uses shared CSS utilities from `frontend/src/index.css` (`.machafi-subtle-emerald-bg`, `.machafi-soft-grid`, `.machafi-card-depth`, `.machafi-emerald-border`) via `adminUiClasses.js` — layout and routes unchanged. See **`PROJECT-EXPLAINER/HEALTH_SERVICES_ADMIN_UI_UPGRADE.md`**.

---

*Last updated: **2026-05-15** — Health Services visual depth (emerald gradient + grid + card glow); admin map synced.*

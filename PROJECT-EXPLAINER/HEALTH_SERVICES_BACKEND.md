# MACHAFI — Health Services backend (PHP / MySQL)

This document describes the **Machafi Services** (`/healthservices`) backend added or updated in this iteration: schema, public JSON APIs, admin APIs, security, and how the Vite SPA opts in via `VITE_*` flags. **Full path/method matrix (all trackers §12 point here):** **`API_ENDPOINT_REGISTRY.md`**.

## 1. Database schema and seed

| Artifact | Path |
|----------|------|
| **Full schema + seed** | `database/health_services_schema.sql` |

**Import (example):**

```bash
mysql -h 127.0.0.1 -P 3307 -u root -p your_database < database/health_services_schema.sql
```

**Default admin user (change password immediately):**

- Username: `admin`
- Password: `changeme`

**Existing deployments:** if `programs` predates this work and has **no** `is_active` column, public `programs.php` will error until you run:

```sql
ALTER TABLE programs ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER video_duration_label;
```

Same for new columns on `consultation_doctors` / `consultation_specialties` if you upgrade an old DB: compare `CREATE TABLE` in the SQL file with your live schema.

## 2. API response envelope (public)

Successful list:

```json
{ "ok": true, "data": { "items": [...], "pagination": { "page": 1, "per_page": 50, "total": 123, "total_pages": 3 } } }
```

Successful object:

```json
{ "ok": true, "data": { "item": { ... } } }
```

Error:

```json
{ "ok": false, "error": { "code": "not_found", "message": "..." } }
```

**Admin** endpoints still return legacy shapes (`message`, `items`, …) in many files; new admin modules follow the same loose JSON style as existing CRUD. Public surfaces listed below use the **envelope** consistently.

## 3. Public API (`/api/public/`)

| File | Methods | Purpose |
|------|---------|---------|
| `news.php` | GET | Paginated news list + single article by `id` |
| `pharmacies.php` | GET | Active pharmacies (paginated) |
| `hospitals.php` | GET | Algeria hospitals + filters (paginated) |
| `international-hospitals.php` | GET | Abroad hospitals (paginated) |
| `ambulances.php` | GET | **Read-only** ambulance directory (paginated). **POST removed** from public (was a security hole). |
| `accommodations.php` | GET | **Read-only** `patient_accommodations`. **POST removed** from public. |
| `programs.php` | GET | Active programs (`is_active = 1`) |
| `books.php` | GET | Library / books (paginated) |
| `library.php` | GET | Thin alias → `books.php` |
| `services.php` | GET | Active `services` rows + optional `lang` i18n overlay |
| `consultations.php` | GET, POST | GET: specialties + doctors. POST: create `consultation_bookings` (honeypot field `fax` must be empty). |
| `live.php` | GET | `live_page_settings` + recorded + up-next rows |
| `donations.php` | GET, POST | GET: stats + campaigns. POST: `donation_intents` (honeypot `website` empty). |
| `contact.php` | POST | `contact_messages` (honeypot `company` empty). |
| `home.php` | GET | Hero stats, homepage sections, latest news |
| `settings.php` | GET | **Safe** subset of `site_settings` keys only (`about`, `branding`, `footer`, `social`, `seo`) |

**Unchanged but still available:** `site-content.php` (composite bundle for legacy consumers).

## 4. Admin API (new / updated)

| File | Notes |
|------|--------|
| `consultation-bookings.php` | GET list, PATCH status, DELETE |
| `donation-campaigns.php` | GET, POST upsert, DELETE |
| `live-page.php` | GET / PUT row `live_page_settings` id=1 |
| `homepage-sections.php` | CRUD sections |
| `contact-messages.php` | GET list, DELETE |

**CSRF (breaking change for admin write clients):** all `POST` / `PUT` / `PATCH` / `DELETE` on existing admin CRUD now call `require_admin_write()`, which validates header **`X-CSRF-Token`** against the session value issued at login.

`api/admin/auth/login.php` response now includes **`csrf_token`**. Admin UI or scripts must:

1. `POST /api/admin/auth/login.php` with JSON credentials.
2. Store `csrf_token` from JSON.
3. Send `X-CSRF-Token: <token>` on every mutating request (same session cookie).

## 5. PDO / config

`api/admin/bootstrap.php` **DSN** now includes an explicit **port** (default `3306` if omitted in `admin-config.php`). `deploy/admin-config.php` uses `port` => `3307` for local dev.

## 6. Frontend integration

### Env flags (`frontend/.env.example`, `frontend/src/vite-env.d.ts`)

| Flag | When `true` |
|------|-------------|
| `VITE_NEWS_API` | News list + detail → `news.php` |
| `VITE_PHARMACIES_API` | Pharmacies → `pharmacies.php` |
| `VITE_HOSPITALS_API` | Hospitals → `hospitals.php` + `international-hospitals.php` |
| `VITE_AMBULANCES_API` | **Ambulances page** → `ambulances.php` |
| `VITE_ACCOMMODATIONS_API` | **Accommodations page** → `accommodations.php` |
| *(others declared)* | Reserved for wiring Programs, Library, Consultations, Live, Donations, Home, Services catalog, Settings |

### Services (`frontend/src/services/`)

| Module | Loader |
|--------|--------|
| `http.ts` | `getJson`, **`postJson`** |
| `news.ts`, `pharmacies.ts`, `hospitals.ts` | Already unwrap `data.items` / `data.item` where applicable |
| **`ambulances.ts`** | `loadAmbulancesForList()` |
| **`accommodations.ts`** | `loadAccommodationsForList()` |

### Pages wired in this pass

| Page | Backend when flag |
|------|---------------------|
| **Ambulances** | `VITE_AMBULANCES_API=true` → `loadAmbulancesForList` |
| **Accommodations** | `VITE_ACCOMMODATIONS_API=true` → `loadAccommodationsForList` + error banner |

Other pages keep mocks until the corresponding `VITE_*` loader is implemented the same way.

## 7. GoDaddy / Apache deployment

1. Upload `api/` to `public_html/api/` (or merge with `ready-to-deploy/public_html/api/` tree).
2. Place **`admin-config.php`** **outside** web root if possible; if it must live beside `api/`, deny HTTP access via `.htaccess` (deny from all).
3. Ensure PHP **PDO MySQL** extension enabled.
4. Import `database/health_services_schema.sql`.
5. Set `VITE_*` flags in the SPA build environment (Vercel env or `.env.production` at build time).
6. Same-origin `VITE_API_BASE_URL=/api` avoids CORS cookies issues.

## 8. Smoke checks (manual)

With DB imported and flags on:

- [ ] `GET /api/public/news.php?limit=5&archived=0` → `ok`, `data.items`
- [ ] `GET /api/public/pharmacies.php` → list
- [ ] `GET /api/public/ambulances.php` → list (no POST)
- [ ] `GET /api/public/accommodations.php` → list
- [ ] `GET /api/public/consultations.php` → specialties + doctors
- [ ] `POST /api/public/consultations.php` with JSON body + empty `fax`
- [ ] Admin login returns `csrf_token`; mutating admin call **fails** without header, **succeeds** with header

## 9. Risks / follow-ups

- **Admin CSRF:** breaks any legacy admin client that did not send `X-CSRF-Token`.
- **`programs.is_active`:** required by new public filter on upgraded DBs.
- **`deploy/api` / `ready-to-deploy`:** not auto-synced in this change set; copy `api/` when packaging a release.
- **CORS:** not added globally; same-origin SPA is assumed. If SPA and API differ by origin, configure Apache CORS + cookie `SameSite=None; Secure` deliberately.
- **Rate limiting:** donation/contact/booking POST endpoints rely on honeypots + validation only; add server-side rate limits (e.g. per IP table) before high traffic.

---

*Last updated: 2026-05-14*

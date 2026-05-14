# API endpoint registry (repo truth)

Single matrix for **`api/`** as implemented in this repository (Machafi Services + shared admin). **Machafi TV** public JSON (`/api/public/tv/...`) is **not** present yet; see **`TRACKERS/machafi-tv/`** for proposed shapes.

**Related:** **`HEALTH_SERVICES_BACKEND.md`** (iteration notes, smoke list), **`API_STANDARD_GODADDY_MYSQL.md`** (conventions), **`database/health_services_schema.sql`**.

**Base URL:** `{VITE_API_BASE_URL}` (typically `/api`) → browser calls `/api/public/...php` and `/api/admin/...php`.

---

## 1) Public JSON — `api/public/`

Unless noted, responses use **`{ "ok": true, "data": { ... } }`** or **`{ "ok": false, "error": { "code", "message" } }`** (see `api/admin/bootstrap.php`: `api_envelope_ok`, `api_envelope_list`, `api_envelope_error`).

| File | Methods | `data` shape / notes |
|------|---------|----------------------|
| `news.php` | GET | List: `data.items` + `data.pagination` (`page`, `per_page`, `total`, `total_pages`). Query: `archived` (0/1), `page`, `limit`. Single: `id` → `data.item`. |
| `pharmacies.php` | GET | Paginated active pharmacies (`is_active = 1`); default large `limit` per `request_pagination` in file. |
| `hospitals.php` | GET | Paginated Algeria hospitals + filters. |
| `international-hospitals.php` | GET | Paginated abroad hospitals. |
| `ambulances.php` | GET only | Paginated `ambulances` table; optional `wilaya`; public **POST removed**. |
| `accommodations.php` | GET only | Paginated `patient_accommodations` (public **POST removed**). |
| `programs.php` | GET | Active programs (`is_active = 1`); pagination (`page`, `limit`). |
| `books.php` | GET | Library rows; pagination. |
| `library.php` | GET | Thin include → same handler as `books.php`. |
| `services.php` | GET | `lang=ar|fr|en` → `data.items` + `data.lang`; i18n overlay for non-AR. |
| `consultations.php` | GET, POST | GET: `lang` → `data.specialties`, `data.doctors`, `data.lang`. POST: JSON `doctor_id`, `patient_name`, `patient_phone`, optional `preferred_date`, `notes`; honeypot **`fax`** must be empty → `data.id`, `data.received`. |
| `live.php` | GET | `live_page_settings`, recorded/up-next payload (see `HEALTH_SERVICES_BACKEND.md`). |
| `donations.php` | GET, POST | GET: `data.stats`, `data.campaigns`. POST: `campaign_id`, `amount`, `currency`, optional `is_monthly`, `donor_name`, `donor_email`, `message`; honeypot **`website`** empty. |
| `contact.php` | POST | `name`, `email`, `subject`, `message`, optional `phone`; honeypot **`company`** empty. |
| `home.php` | GET | `lang` → `hero_stats`, `homepage_sections`, `latest_news`, `lang`. |
| `settings.php` | GET | Public-safe keys only: `about`, `branding`, `footer`, `social`, `seo` → `data.settings`. |
| `site-content.php` | GET | Legacy composite bundle (unchanged). |
| `translate.php`, `translate-health.php` | varies | Legacy translation helpers. |
| `news-comments.php`, `news-ratings.php`, `reviews.php` | varies | Legacy/auxiliary; not used by current Services SPA loaders. |

### SPA feature flags (`frontend/.env.example`)

| Flag | PHP consumer |
|------|----------------|
| `VITE_NEWS_API` | `news.php` |
| `VITE_PHARMACIES_API` | `pharmacies.php` |
| `VITE_HOSPITALS_API` | `hospitals.php`, `international-hospitals.php` |
| `VITE_AMBULANCES_API` | `ambulances.php` |
| `VITE_ACCOMMODATIONS_API` | `accommodations.php` |
| `VITE_PROGRAMS_API` | `programs.php` (declared; wire in `services/` like other loaders) |
| `VITE_LIBRARY_API` | `books.php` / `library.php` |
| `VITE_CONSULTATIONS_API` | `consultations.php` |
| `VITE_LIVE_API` | `live.php` |
| `VITE_DONATIONS_API` | `donations.php` |
| `VITE_HOME_API` | `home.php` |
| `VITE_SETTINGS_API` | `settings.php` |
| `VITE_SERVICES_CATALOG_API` | `services.php` |

---

## 2) Admin JSON — `api/admin/`

**Auth:** `auth/login.php` (POST JSON credentials), `auth/logout.php`, `auth/session.php`.

**CSRF (mutating requests):** `POST` / `PUT` / `PATCH` / `DELETE` on CRUD modules use `require_admin_write()` → header **`X-CSRF-Token`** must match session value returned as **`csrf_token`** from login JSON.

| File | Typical methods | Domain |
|------|-----------------|--------|
| `news.php` | GET POST PUT DELETE | News CRUD |
| `pharmacies.php` | GET POST PUT DELETE | Pharmacies |
| `hospitals.php` | GET POST PUT DELETE | Algeria hospitals |
| `international-hospitals.php` | GET POST PUT DELETE | Abroad hospitals |
| `ambulances.php` | GET POST PUT DELETE | Ambulance directory |
| `accommodations.php` | GET POST PUT DELETE | Patient accommodations |
| `programs.php` | GET POST PUT DELETE | Programs |
| `books.php` | GET POST PUT DELETE | Library books |
| `services-content.php` | GET PUT | Services marketing copy |
| `site-settings.php` | GET PUT | `site_settings` blobs |
| `hero-stats.php` | GET POST PUT DELETE | Home hero metrics |
| `homepage-sections.php` | GET POST PUT DELETE | Home sections |
| `video-programs.php` | GET POST PUT DELETE | Video metadata |
| `consultation-specialties.php` | GET POST PUT DELETE | Consultation taxonomy |
| `consultation-doctors.php` | GET POST PUT DELETE | Consultation roster |
| `consultation-bookings.php` | GET PATCH DELETE | Public booking queue |
| `donation-campaigns.php` | GET POST DELETE | Campaigns + upsert |
| `live-page.php` | GET PUT | `live_page_settings` row |
| `contact-messages.php` | GET DELETE | Contact inbox |
| `i18n.php` | GET POST PUT DELETE | Translation rows |
| `public-users.php` | GET POST PUT DELETE | Admin-managed users |

Admin JSON shapes are **not** fully normalized to the public `{ ok, data }` envelope everywhere; treat per-file until a later pass.

---

## 3) Trackers

Each **`TRACKERS/**/_PAGE_MAP.md`** includes **§12 Implemented HTTP map** pointing here with route-specific rows. **Gateway** has no PHP. **Machafi TV** trackers reference mocks until `/api/public/tv/*` exists.

---

*Last updated: **2026-05-14** — Registry aligned with `api/public` + `api/admin` in repo; CSRF + honeypots per `HEALTH_SERVICES_BACKEND.md`.*

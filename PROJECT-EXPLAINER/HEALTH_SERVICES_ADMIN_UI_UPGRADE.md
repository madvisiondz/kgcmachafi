# Health Services Admin UI Upgrade

**Last updated:** 2026-05-15

## Overview

The `/healthservices/admin/*` control center uses a **dark emerald** design system: glassmorphism cards, animated gradient background, collapsible sidebar (drawer on mobile), premium dashboard KPIs, and reusable CRUD with upload fields.

Public `/healthservices/*` uses the same **depth utilities** on the Services shell and key cards (Machafi TV unchanged).

## Visual depth utilities (2026-05-15)

CSS-only enrichment — **no layout or UX redesign**. Defined in `frontend/src/index.css`:

| Utility | Purpose |
|---------|---------|
| `.machafi-subtle-emerald-bg` | Slow animated emerald wash (`::after` pseudo) |
| `.machafi-subtle-emerald-bg--light` | Light slate/emerald base for public `/healthservices` shell |
| `.machafi-soft-grid` | Low-opacity futuristic grid (`::before` pseudo) |
| `.machafi-gradient-orb` / `--a` / `--b` | Optional floating blur orbs (decorative) |
| `.machafi-card-depth` | Subtle hover lift + shadow transition |
| `.machafi-emerald-border` | Soft emerald edge glow on cards |

**Applied to:**

- `ServicesLayout.jsx` — public shell (`machafi-subtle-emerald-bg`, `machafi-soft-grid`, orbs)
- `adminUiClasses.js` — admin `shell`, `glassCard`, `kpiCard`, `tableWrap` (via `glassCard`)
- `healthAdminTheme.css` — admin grid/orb overrides under `.hsvc-admin-root`, glass card glow
- `HomePage.jsx` — stat/news/platform cards (solid `bg-slate-50` / `bg-white` preserved for readability)

**Accessibility:** `prefers-reduced-motion: reduce` disables gradient/orb animation and card hover lift.

## Design system (frontend)

| Piece | Location |
|-------|----------|
| CSS variables & background animation | `frontend/src/styles/healthAdminTheme.css` |
| Shared depth utilities (public + admin) | `frontend/src/index.css` |
| Tailwind class tokens | `frontend/src/components/admin/healthservices/adminUiClasses.js` |
| Shell layout | `frontend/src/pages/admin/healthservices/AdminLayout.jsx` |
| CRUD + uploads | `frontend/src/components/admin/healthservices/CrudResourcePage.jsx` |
| Upload widget | `frontend/src/components/admin/healthservices/AdminUploadField.jsx` |

Theme classes are scoped under `.hsvc-admin-root` so they do not affect the public site.

## Upload system

### Endpoint

`POST /api/admin/uploads.php`

- **Auth:** admin session + `X-CSRF-Token` (same as other admin writes)
- **Body:** `multipart/form-data`
  - `file` — the uploaded file
  - `category` — folder namespace (see below)
  - `kind` — `image` (default) or `pdf`

**Success envelope:**

```json
{ "ok": true, "data": { "url": "/uploads/healthservices/news/images/foo-abc123.jpg", "path": "...", "filename": "...", "kind": "image", "category": "news" } }
```

### Allowed types

| Kind | Extensions | Max size |
|------|------------|----------|
| image | jpg, jpeg, png, webp | 5 MB |
| pdf | pdf | 15 MB |

MIME is validated with `finfo` (not extension alone). Executable types (php, html, js, etc.) are rejected.

### Storage path (on server)

Files are stored under the project web root:

```
uploads/healthservices/{category}/images/{filename}
uploads/healthservices/{category}/documents/{filename}
```

Public URL matches path (e.g. `/uploads/healthservices/programs/images/...`).

**Categories:** `news`, `hospitals`, `international-hospitals`, `accommodations`, `services`, `programs`, `live`, `homepage`, `donations`, `books`, `general`.

### Folder permissions (GoDaddy / cPanel)

1. Create `public_html/uploads/healthservices/` (or copy from repo `uploads/healthservices/`).
2. Set directory permissions to **755** (or **775** if uploads fail).
3. Ensure PHP can write: owner should match the web server user for new files.
4. `.htaccess` in `uploads/healthservices/` blocks script execution (Apache).

### How admins use uploads

1. Open a CRUD module (e.g. Library, Programs).
2. In the form, click **Upload image** or **Upload PDF**.
3. After upload, the URL field is filled automatically; preview shows for images.
4. Click **Save** on the form to persist the URL in the database (existing JSON APIs).

**Modules with upload UI today:**

- **Programs** — cover image (`image_url`)
- **Library / books** — cover image + PDF (`image_url`, `file_path`)

Other modules can use URL text fields; optional DB columns for news/hospital images are documented in `database/health_services_admin_optional.sql` when you extend the API.

### Books note

`api/admin/books.php` still supports direct `$_FILES` on POST for legacy flows. The admin UI uses the central `uploads.php` endpoint and saves returned URLs via JSON.

## i18n

New keys under `admin.hsvc.*` in `frontend/src/i18n/translations.ts` (EN / FR / AR): upload labels, control center subtitle, status badges, dashboard welcome text.

## What changed (summary)

- Subtle emerald gradient + grid depth on public Services shell and admin shell (CSS only)
- Premium dark layout, sidebar icons, mobile drawer
- Dashboard KPI cards and glass panels
- CRUD tables: sticky header (desktop), card list (mobile), status badges
- `AdminUploadField` + `uploads.php`
- Auth, CSRF, and existing PHP CRUD logic preserved

## Remaining risks

- **Live site deploy:** upload folder must exist on production with write permissions.
- **nginx:** ensure `/uploads/` is served as static files (not routed to `index.html`).
- **Optional columns:** news/hospital `image_url` columns require optional SQL + small PHP field additions if you want DB persistence beyond URL-in-JSON.
- **Large files:** shared hosting `upload_max_filesize` / `post_max_size` may be lower than app limits — adjust in cPanel PHP settings if uploads fail.

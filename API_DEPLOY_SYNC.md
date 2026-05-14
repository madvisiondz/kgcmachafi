# API deploy sync log

**Date:** 2026-05-14 (session)

## What was synced

The entire source tree `api/` (including `api/admin/`, `api/public/`, `.htaccess`, and subfolders) was copied with **recursive overwrite** into:

1. `deploy/api/`
2. `ready-to-deploy/public_html/api/`

This brings deployment trees in line with the canonical backend under `api/` after Health Services integration and admin envelope/RBAC updates.

## Admin API changes (this session)

These endpoints now return **`{ ok: true, data: … }`** or **`{ ok: false, error: { code, message } }`** where noted:

| File | Notes |
|------|--------|
| `api/admin/donation-campaigns.php` | GET/POST/DELETE use envelope; **POST/DELETE** require `require_role('admin')`. |
| `api/admin/contact-messages.php` | GET/DELETE use envelope; **DELETE** requires `admin`. |
| `api/admin/i18n.php` | GET/PUT use envelope; **PUT** requires `admin`. |
| `api/admin/consultation-bookings.php` | GET/PATCH/DELETE use envelope; **PATCH/DELETE** require `admin`. |
| `api/admin/public-users.php` | **PUT** uses envelope + `require_role('admin')` (replaces inline role check). GET still returns legacy `{ items }` for minimal churn. |

## Admin endpoints still on legacy JSON (RBAC / envelope follow-up)

Non-exhaustive list still using bare `json_response([...])` without `{ ok, data }` and/or without `require_role` on mutating routes:

- `api/admin/news.php`, `books.php`, `programs.php`, `pharmacies.php`, `hospitals.php`, `ambulances.php`, `accommodations.php`, `consultation-doctors.php`, `consultation-specialties.php`, `hero-stats.php`, `homepage-sections.php`, `live-page.php`, `services-content.php`, `site-settings.php`, `video-programs.php`, `international-hospitals.php`
- `api/admin/auth/*.php` (login/session/logout — intentional human-oriented messages)

Review each mutating handler for **`require_admin_write()` + `require_role('admin')`** (or `editor` where appropriate) before multi-tenant or delegated-admin rollout.

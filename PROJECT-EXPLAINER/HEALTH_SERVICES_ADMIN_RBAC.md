# Health Services admin — roles and API access

Admin accounts use `admin_users.role`. Supported values: **`admin`** (full access) and **`editor`** (day-to-day content).

All `/api/admin/*.php` routes require a logged-in admin session. Mutating requests also require a valid **`X-CSRF-Token`** header (see session/bootstrap).

## Role matrix

| Area | Endpoints (examples) | `editor` | `admin` |
|------|----------------------|:--------:|:-------:|
| News | `news.php` | Yes | Yes |
| Directories (pharmacies, hospitals, intl, ambulances, accommodations) | `pharmacies.php`, `hospitals.php`, … | Yes | Yes |
| Media / catalog (programs, books, video programs, hero stats) | `programs.php`, `books.php`, … | Yes | Yes |
| Services catalog | `services-content.php` | Yes | Yes |
| Consultation config (specialties, doctors) | `consultation-specialties.php`, `consultation-doctors.php` | Yes | Yes |
| Consultation bookings — list / update status | `consultation-bookings.php` GET, PATCH | Yes | Yes |
| Consultation bookings — delete row | `consultation-bookings.php` DELETE | No | Yes |
| Donation campaigns | `donation-campaigns.php` | Yes | Yes |
| Donation intents — list / search | `donation-intents.php` GET | Yes | Yes |
| Donation intents — internal notes / workflow status | `donation-intents.php` PATCH | No | Yes |
| Contact messages — list / mark read | `contact-messages.php` GET, PATCH | Yes | Yes |
| Contact messages — delete | `contact-messages.php` DELETE | No | Yes |
| Homepage sections | `homepage-sections.php` | Yes | Yes |
| Live page + VOD + queue | `live-page.php`, `live-recorded-items.php`, `live-up-next.php` | Yes | Yes |
| Site settings — read | `site-settings.php` GET | Yes | Yes |
| Site settings — write | `site-settings.php` PUT | No | Yes |
| Public (Machafi) users directory | `public-users.php` | No | Yes |
| DB-backed translations (Plan B) | `i18n.php` GET | Yes | Yes |
| DB-backed translations — save | `i18n.php` PUT | No | Yes |
| Dashboard snapshot | `dashboard-stats.php` | Yes | Yes |
| Own password change | `profile-password.php` | Yes | Yes |
| Auth/session/logout | `auth/*` | Yes | Yes |

**Rule of thumb:** `editor` manages public-facing content and operational queues. `admin` additionally touches **site-wide JSON settings**, **registered public users**, **irreversible deletes** on sensitive queues, and **financial / PII workflow** on donation intents.

## PHP helpers

- `require_editor_or_admin()` — most CRUD and reads.
- `require_super_admin()` — same as `require_role('admin')` for privileged routes.

Defined in `api/admin/bootstrap.php` next to `require_role()`.

> **Archive (2026-05-13):** Copied from the removed `legacy/` tree so audit content stays in **`PROJECT-EXPLAINER/`**. Code paths in this document refer to the **old** layout; the active app is **`frontend/`**.

---

# Production-grade Technical Audit & Improvement Plan (KGC Machafi)

Date: 2026-04-28  
Scope: Vite/React SPA (`src/`) + PHP API (`api/`) + MariaDB/MySQL schema (`kgcmachafi_madvision.sql`) + Admin panel (roles + content management)

## 0) Executive summary (what must change to be production-grade)

This app is a solid functional prototype, but it is **not production-grade yet** mainly because:

- **Authorization is mostly client-side** (admin UI hides tabs), while most admin API endpoints only check “logged-in admin”, not **role/permission**.
- **Data integrity constraints are largely missing** (foreign keys for reviews/comments/ratings are not enforced; inconsistent datatypes for location fields; JSON-in-text patterns without validation).
- **Security hardening is incomplete** for a cookie-session API (CSRF protection, rate limits, audit logs, stronger headers, secrets management, environment separation).
- **Data pipeline is manual and ungoverned** (multiple JSON/SQL imports), creating long-term risk of duplicates/inconsistent hospital/location data.

The plan below is designed to reach production readiness in 4 phases and includes a **detailed RBAC + permissions model** (page-level and section-level), plus an exact step-by-step execution plan (files/DB/why).

---

## 1) System analysis

### 1.1 Frontend architecture (SPA)

#### What exists
- **Framework/build**: Vite + React + React Router (`src/App.jsx`), Tailwind UI.
- **Data access**: `src/lib/localApi.js`
  - Uses `fetch()` with `credentials: 'same-origin'` (cookie sessions).
  - One shared `request()` wrapper that tries to parse JSON and throws `payload.message` on non-2xx.
  - **Dev-mode fallbacks**:
    - Admin login can succeed locally even if backend is down (`admin/admin123` stored in `localStorage`).
    - Site content fetch has a fallback response to let UI render without API.
- **State/data flow**:
  - Context: `src/contexts/SiteContentContext.jsx` fetches `/api/public/site-content.php` on language changes.
  - Admin page: `src/pages/AdminPage.jsx` loads admin session and renders tabs that correspond to admin endpoints.

#### Data flow (state → API → UI)
- **Public pages**:
  - Page/component triggers `contentApi.*` calls → `request()` → `/api/public/*.php` → JSON payload → React state.
  - Site content uses a provider (`SiteContentProvider`) to cache `settings`, `hero_stats`, `services`, etc.
- **Admin pages**:
  - `adminApi.getSession()` hits `/api/admin/auth/session.php`
  - UI *hides* certain tabs based on `admin.role` (client-side gating).
  - CRUD calls go to `/api/admin/*.php` endpoints.

#### Reusability
- **Good**: centralized API client wrapper; context for site content; reusable UI components.
- **Weak**:
  - Permissions are encoded in UI logic (e.g., “editor can only see news”).
  - API methods list is large and flat (`adminApi` has many functions); no typed contracts; hard to evolve.

#### Scalability (frontend)
Key scalability risks for a healthcare directory:
- **No caching/invalidation strategy** beyond basic in-memory state. For directories (hospitals/pharmacies), requests can become heavy.
- **No pagination** in public endpoints (from what’s visible in `hospitals.php`), and admin endpoints frequently return `SELECT *` (unbounded growth risk).
- **No API versioning**; changes risk breaking old clients.
- **No structured error taxonomy** (all thrown as `Error(message)`).

---

### 1.2 Backend (PHP API)

#### API structure
- File-per-endpoint, split by audience:
  - `api/public/*` for public reads + some writes (reviews/comments/ratings/auth).
  - `api/admin/*` for admin CRUD.
  - Shared utilities in `api/admin/bootstrap.php` (DB connection, JSON response, method guard, session handling, i18n helper).
- Authentication:
  - **Admin** session stored in `$_SESSION['admin']` after `/api/admin/auth/login.php`.
  - **Public user** session stored in `$_SESSION['public_user']` after `/api/public/auth/login.php`.

#### Data consistency
- Uses PDO prepared statements in most places (good).
- Several tables store arrays in `*_json` fields (longtext), and endpoints encode/decode them.
- There is an i18n helper that can create a `content_i18n` table on demand (auto-migration behavior) which is convenient, but risky in restricted-production DB permission models.

#### Security posture (current)
**Strengths**
- Session cookies are `HttpOnly` and `SameSite=Lax` in `api/admin/bootstrap.php`.
- Admin/public login uses `password_verify` and does `session_regenerate_id(true)` (good).
- `api/.htaccess` denies access to `admin-config.php` and some sensitive files.

**Gaps**
- **No CSRF protection** visible for session-authenticated state-changing endpoints (POST/PUT/DELETE). With cookie sessions, CSRF must be addressed.
- **Authorization gap**: `require_admin()` checks only “is logged in”, not role/permissions for most admin endpoints.
  - Example: `api/admin/news.php`, `api/admin/hospitals.php`, etc. accept any authenticated admin.
  - Only `api/admin/public-users.php` restricts role changes to `role === 'admin'`.
- **No rate limiting** (login brute force, public writes like comments/ratings, and translation proxy).
- **No audit logging** (who changed what) which is critical for admin actions in healthcare-adjacent apps.
- **Secret management**: `admin-config.php` currently contains root DB credentials (dev) and is expected in web root (deployment doc). That’s fragile in production.
- **Input validation** is minimal for many endpoints (e.g., strings, numeric bounds, allowed enumerations).

---

### 1.3 Database (schema audit from `kgcmachafi_madvision.sql`)

#### High-level table groups
- **Admin**: `admin_users` (local admin accounts)
- **Public users**: `public_users` (site members + “role” field)
- **Directories**: `hospitals`, `pharmacies`, `ambulances`, `patient_accommodations`, `international_hospitals`
- **Content/CMS**: `news_articles`, `site_settings`, `services`, `video_programs`, `programs`, `books`
- **Engagement**: `news_comments`, `news_ratings`, `ambulance_reviews`, `accommodation_reviews`
- **i18n**: `content_i18n` (present in dump + also created dynamically in code)

#### Table design & relationships
**What’s good**
- Most tables use `InnoDB`, have primary keys, timestamps, and some helpful indexes.
- `news_ratings` has a uniqueness constraint (`news_id`,`user_id`) to prevent double rating (good).
- One FK exists: `consultation_doctors.specialty_id → consultation_specialties.id` (ON DELETE CASCADE).

**Weak points / missing constraints**
- **Most relational edges are missing foreign keys**:
  - `news_comments.news_id`, `news_comments.user_id` have indexes but no FKs.
  - `news_ratings.news_id`, `news_ratings.user_id` same.
  - `ambulance_reviews.ambulance_id`, `.user_id` no FKs.
  - `accommodation_reviews.accommodation_id`, `.user_id` no FKs.
  - Result: orphaned rows are likely over time; deletes won’t cascade; integrity depends on application correctness.
- **Inconsistent location types**
  - `hospitals.wilaya_id` is `varchar(10)` but logically a small integer or fixed code.
  - `pharmacies.wilaya` is `varchar(4)`, `commune` is `varchar(8)`.
  - `public_users.wilaya_id` is `varchar(10)`; `commune` is `varchar(255)` (different modeling than pharmacies).
  - Result: joining across entities by location becomes error-prone and slow.
- **JSON-in-text** fields (`*_json` as `longtext`) with no validation/check constraints.
  - Result: schema cannot guarantee valid JSON; queries on these fields are limited; migrations become hard.
- **Charset inconsistency**
  - `admin_users` uses `latin1` while most others are `utf8mb4`.
  - Result: potential encoding bugs (Arabic names), collation issues, and inconsistent comparisons.
- **Ratings types**
  - Some rating fields are `decimal(2,1)` or `decimal(3,2)`. Ensure bounds and consistent precision (and add checks at app layer).

---

### 1.4 Data pipeline (ingestion + dataset risks)

Observed artifacts:
- `hospitals_cleaned.json`, `hospitals_insert.sql`, `dataset raw.json`, `algiers_hospitals_insert_10.sql`
- This implies a semi-manual workflow: scrape/export → clean JSON → generate SQL inserts → import.

How data enters the system (current, inferred)
- **Manual SQL import** for hospitals and likely other directory datasets.
- **Admin CRUD** can add/edit data in tables via admin API.
- **User-generated content**: reviews/comments/ratings via public endpoints.

Key risks
- **Duplication**: no clear “source_id”/“external_id” for scraped hospitals; no uniqueness constraints on name+location; duplicates will accumulate.
- **Dirty data**: phone formats vary (empty strings vs `NULL`), websites without scheme, mixed languages, inconsistent city/wilaya codes.
- **Inconsistency**: multiple location representations (wilaya_id vs wilaya vs commune string).
- **No provenance**: cannot trace record origin (Google Maps vs manual vs admin edit) which blocks trust and moderation workflows.

---

## 2) Identified problems (precise list)

### 2.1 Structural issues
- **Authorization not enforced server-side** for admin operations:
  - Most `api/admin/*.php` endpoints only call `require_admin()` and allow any logged-in admin.
  - UI hides tabs for editor/moderator, but that is not a security control.
- **No API versioning** (`/api/v1/...`), making iterative evolution risky.
- **“SELECT *” patterns** in admin/public endpoints (scaling and backward-compat risks).
- **Mixed responsibilities** in `api/admin/bootstrap.php` (DB, sessions, JSON utilities, and i18n schema creation).
- **Dev-only auth fallback** (`localStorage` session) risks accidental exposure if build flags/config are misused.

### 2.2 Data integrity issues
- **Missing foreign keys** for almost all engagement tables and some directory relations.
- **Inconsistent datatypes for key fields** (wilaya/commune).
- **No uniqueness constraints** to prevent directory duplicates (hospitals/pharmacies).
- **Storing arrays as text JSON** without validation; no schema-level enforcement.
- **Charset mismatch** (`admin_users` latin1).

### 2.3 Scalability risks
- **No pagination / search indices strategy** for directory endpoints; future dataset growth will degrade response times.
- **No caching headers** for public read-heavy endpoints (everything is effectively dynamic).
- **No queue/background jobs** for expensive tasks (translation, imports, deduping, geocoding).
- **No file storage policy** for `uploads/` (retention, naming collisions, virus scanning).

### 2.4 Security issues (most critical)
- **CSRF risk** for cookie-based sessions (admin + public). State-changing requests can be forged.
- **No brute-force controls** on login endpoints.
- **No audit trail** for admin actions.
- **Secrets/config in web root** (deployment suggests `admin-config.php` under `public_html/`).
- **Insufficient permission granularity**: roles are strings; no flexible permission system; cannot restrict editor to “hospitals only” without code changes and DB support.

### 2.5 UX / admin limitations
- Current admin roles in UI (`AdminPage.jsx`) are implemented as simple conditions:
  - Editor: only `news` tab.
  - Moderator: everything except `users`.
  - Admin: everything.
- There is **no per-page/per-section permissions UI**.
- No workflow states:
  - Moderation/approval is not a first-class concept for directory records.
  - No “draft/pending/approved/rejected” for imported hospitals/pharmacies.
- No bulk operations for dataset management (merge duplicates, bulk activate/deactivate, import logs).

---

## 3) Improvement roadmap (production-grade)

### PHASE 1 — Stabilization (security + reliability baseline)

**Goals**
- Make admin/public APIs safe to expose on the internet.
- Establish environment separation (dev/staging/prod).
- Introduce observability + operational safety.

**Actions**
- **Server-side authorization enforcement**
  - Add a centralized authorization function (conceptually: `require_permission($perm)`), and enforce it in every `api/admin/*.php` endpoint.
  - Remove reliance on UI-only tab hiding as a security mechanism.
- **CSRF protection**
  - Implement CSRF tokens for cookie-session APIs (double-submit token or synchronizer token pattern).
  - Apply to all POST/PUT/DELETE for both admin and public user endpoints.
- **Rate limiting**
  - Per-IP/per-username on admin login and public login.
  - Per-IP/per-user on comment/rating/review endpoints.
- **Secrets management**
  - Move DB credentials out of web root; use environment variables; keep `admin-config.php` outside document root or generate it server-side.
- **Error handling & logging**
  - Standardize JSON error format (code, message, request_id).
  - Add minimal request logging + security event logging (login success/failure, role change, content changes).
- **Hardening headers**
  - Add consistent security headers for API responses (CSP where applicable, XFO, XCTO, Referrer-Policy).

**Expected result**
- Admin endpoints cannot be abused by a lower-privilege account.
- CSRF and brute-force risks are materially reduced.
- Deployments are safer (secrets not exposed; logs exist for incidents).

---

### PHASE 2 — Data integrity (schema + constraints + canonical data model)

**Goals**
- Make the database enforce correctness, not the app.
- Reduce duplicates and establish canonical location + directory entities.

**Actions**
- **Normalize locations**
  - Create canonical `wilayas` and `communes` tables.
  - Replace `varchar` location columns with FK references where feasible.
  - Add indexes optimized for directory filters.
- **Add foreign keys**
  - Add FKs for comments/ratings/reviews to their parent entities and `public_users`.
  - Decide cascade behaviors (generally: cascade on parent delete, restrict on user delete, or soft-delete users).
- **Introduce provenance + dedupe keys**
  - Add `source` and `external_id` columns for imported datasets.
  - Add uniqueness constraints based on `(source, external_id)` where available.
  - Add a `normalized_name` and `normalized_address` to help dedupe (or maintain a separate dedupe table).
- **Replace JSON longtext where critical**
  - For frequently queried structured fields (e.g., payment methods), model as join tables.
  - Keep JSON only for low-importance display-only fields, with app-level validation.
- **Fix charset consistency**
  - Migrate `admin_users` to `utf8mb4_unicode_ci`.

**Expected result**
- Orphans and duplicates are prevented or detectable.
- Location filters become reliable and performant.
- Data is trustworthy enough for moderation and search at scale.

---

### PHASE 3 — Admin system upgrade (RBAC + workflows + audit)

**Goals**
- Implement a flexible RBAC/permissions model: **page-level and section-level**.
- Add moderation workflows and auditable operations.

**Actions**
- **RBAC redesign**
  - Replace string roles in `admin_users` with a relational model:
    - users ↔ roles ↔ permissions (many-to-many)
    - optional user-specific overrides
  - Support “editor can edit ONLY hospitals page” and “moderator can approve data” precisely.
- **Workflow states**
  - For directory entities: `status = draft|pending|approved|rejected|archived`
  - Add `approved_by`, `approved_at`, `rejection_reason`
- **Audit log**
  - Record who changed what, from where (IP, user agent), and before/after diff for sensitive entities.
- **Admin UI upgrades**
  - Dedicated screens for:
    - Roles & permissions
    - User management (admin users + public users)
    - Moderation queue (pending approvals)
    - Import history + dedupe tools

**Expected result**
- Least-privilege access is enforced server-side.
- Moderation becomes a real process, not manual guesswork.
- Accountability exists (audit log).

---

### PHASE 4 — Automation & scaling (data pipeline + performance + ops)

**Goals**
- Turn the dataset workflow into a repeatable, safe pipeline.
- Improve performance under growth.

**Actions**
- **Ingestion pipeline**
  - Import jobs with validation + dedupe + mapping to canonical locations.
  - Store import runs (`import_runs`, `import_run_items`) with errors.
- **Search**
  - Add full-text search for hospitals/pharmacies (DB FULLTEXT or external search).
  - Add geo search (optional) for nearest hospitals/ambulances (spatial indexes).
- **Caching**
  - Cache public read endpoints (ETag/Last-Modified or server cache).
  - CDN caching for static assets and optionally for read-only API routes.
- **Ops**
  - Health endpoint, DB migrations tooling, backup strategy, monitoring dashboards.

**Expected result**
- You can refresh and grow datasets safely.
- The app remains fast and maintainable as traffic and data scale.

---

## 4) Admin panel redesign (DETAILED — roles, permissions, DB, UI)

### 4.1 Current admin system (what it does today)

**Admin accounts**
- Stored in `admin_users` with columns: `username`, `password_hash`, `role`, `is_active`.
- Login creates `$_SESSION['admin'] = {id, username, full_name, role}`.

**Public user role management**
- `public_users.role` exists and can be updated by admin via `api/admin/public-users.php`.
- Only `admin` can change public user roles (server-side enforced).

**Current enforcement model**
- **UI-level gating** in `src/pages/AdminPage.jsx`:
  - Editor restricted to “news” tab.
  - Moderator restricted from “users” tab.
- **API-level gating**:
  - Almost all admin endpoints only require a logged-in admin.
  - This is not acceptable for production RBAC.

---

### 4.2 Target role system (required roles)

You requested exactly these roles:
- `admin`
- `moderator`
- `editor`
- `user`

Important clarification for production-grade design:
- **These roles apply to the admin panel** (back-office users).
- Public site members (“regular users”) can remain in `public_users` and are not “admin panel users”.
  - If you want a single unified user system later, plan it in Phase 4/5.

#### Role → exact permissions (production-grade baseline)

Below is a concrete minimum set. Each permission is a string like `resource:action[:scope]`.

##### Admin
- **Identity & Access**
  - `admin_users:read`, `admin_users:create`, `admin_users:update`, `admin_users:disable`
  - `roles:read`, `roles:create`, `roles:update`, `roles:delete`
  - `permissions:read`, `permissions:assign`
- **Content management (all)**
  - `news:read`, `news:create`, `news:update`, `news:delete`, `news:publish`
  - `library:read`, `library:create`, `library:update`, `library:delete`
  - `programs:read`, `programs:create`, `programs:update`, `programs:delete`
  - `videos:read`, `videos:create`, `videos:update`, `videos:delete`
  - `site_settings:read`, `site_settings:update`
  - `services:read`, `services:create`, `services:update`, `services:delete`
  - `i18n:read`, `i18n:update`
- **Directories (all)**
  - `hospitals:read`, `hospitals:create`, `hospitals:update`, `hospitals:delete`, `hospitals:approve`
  - `pharmacies:read`, `pharmacies:create`, `pharmacies:update`, `pharmacies:delete`, `pharmacies:approve`
  - `ambulances:read`, `ambulances:create`, `ambulances:update`, `ambulances:delete`, `ambulances:approve`
  - `accommodations:read`, `accommodations:create`, `accommodations:update`, `accommodations:delete`, `accommodations:approve`
  - `international_hospitals:read`, `international_hospitals:create`, `international_hospitals:update`, `international_hospitals:delete`, `international_hospitals:approve`
- **Moderation**
  - `reviews:moderate`, `comments:moderate`, `ratings:moderate`
- **Ops**
  - `audit_log:read`, `imports:run`, `imports:review`

##### Moderator
- **Moderation + approval**
  - `hospitals:read`, `hospitals:approve`
  - `pharmacies:read`, `pharmacies:approve`
  - `ambulances:read`, `ambulances:approve`
  - `accommodations:read`, `accommodations:approve`
  - `international_hospitals:read`, `international_hospitals:approve`
  - `reviews:moderate`, `comments:moderate`, `ratings:moderate`
- **Content**
  - `news:read`, `news:update`, `news:publish`
  - `i18n:read`, `i18n:update`
- **Explicitly NOT allowed**
  - No access to role assignment: **no** `roles:*` or `permissions:assign`
  - No admin-user management: **no** `admin_users:*`

##### Editor
- **Page-limited editing**
  - Baseline: `news:read`, `news:create`, `news:update`
- Optional “Editor can edit ONLY hospitals page” example:
  - `hospitals:read`, `hospitals:update` (no create/delete/approve)
- **Explicitly NOT allowed**
  - No deletes for critical directories unless explicitly granted.
  - No moderation/approval actions unless explicitly granted.
  - No IAM permissions.

##### User
- This is typically a **public** role. For admin panel usage, “user” should mean:
  - `admin_panel:access` (dashboard read-only)
  - `news:read`, `hospitals:read` (view only)
  - No write permissions.

---

### 4.3 Permission model (flexible, page-level + section-level)

#### Design requirements
- Page-level access (“can open Hospitals page”)
- Section-level access inside a page (“can edit hospital contact fields but not delete”)
- Must be enforceable **server-side** and reusable in frontend UI.

#### Recommended model: RBAC + permission scopes
Use a flat permission namespace plus optional scope metadata:

- **Page permissions** (navigation/UI)
  - `page:admin.news:read`
  - `page:admin.hospitals:read`
  - `page:admin.users:read`
- **Section permissions** (fine-grained)
  - `hospitals:edit:basic` (name/type/address)
  - `hospitals:edit:contact` (phone/website/hours)
  - `hospitals:edit:features` (features_json/specialties_json)
  - `hospitals:delete`
  - `hospitals:approve`

This enables your examples precisely:
- “Editor can edit ONLY hospitals page”:
  - grant `page:admin.hospitals:read`, `hospitals:edit:basic`, `hospitals:edit:contact`
  - do not grant `page:admin.news:read` or other pages
- “Moderator can approve data”:
  - grant `*:approve` permissions and moderation permissions

#### Enforcement rule
Enforce authorization **twice**:

- **Backend (source of truth)**: every write/read-sensitive admin endpoint must check permissions derived from session user roles.
- **Frontend (UX only)**: hide/disable tabs and actions based on the same permissions returned by `/api/admin/auth/session.php` (or a dedicated `/api/admin/me.php`).

Rule: **UI checks are never security**. They exist to reduce confusion, not to block access.

---

### 4.4 User role management (exact procedures)

This section describes the *target* production workflows.

#### A) Create an admin-panel user
- **What**: Create an admin staff account that can log into `/admin`.
- **Where (DB)**: `admin_users` (or the upgraded `admin_identities` table described below).
- **How (process)**
  - Admin navigates to **Admin → Users (Admin staff)**.
  - Click **Create staff user**.
  - Enter username/email, full name, temp password (or invite link).
  - Assign one or more roles (e.g., `editor`).
  - Save; system:
    - hashes password
    - sets `is_active=1`
    - writes audit log record

#### B) Assign role(s)
- **What**: Give the staff user a role: `admin`, `moderator`, `editor`, `user`.
- **Where (DB)**:
  - `user_roles` (many-to-many) or `admin_users.role` (legacy, single role).
- **How (process)**
  - In staff user details screen, a **Roles** multi-select.
  - Add/remove roles.
  - Save; backend recalculates effective permissions and returns updated session view.

#### C) Change role(s)
- **What**: Promote/demote a staff user.
- **Where (DB)**: `user_roles` changes + audit log entry.
- **How (process)**
  - Only users with `roles:update` permission can do this (admins).
  - Moderator/editor cannot change roles.

#### D) Assign page permissions (fine-grained)
- **What**: Grant/deny specific pages or sections.
- **Where (DB)**:
  - `role_permissions` for role-wide defaults
  - `user_permission_overrides` for user-specific exceptions
- **How (process)**
  - Admin navigates to **Admin → Roles & Permissions**.
  - Select a role (e.g., `editor`), then:
    - Toggle pages (page-level)
    - Toggle actions/sections (section-level)
  - Save updates `role_permissions`.
  - Optional per-user overrides:
    - in staff user screen, open **Overrides** tab
    - grant `page:admin.hospitals:read` and deny others

---

### 4.5 Database design for roles/permissions (recommended schema)

You asked for tables like `roles`, `permissions`, `role_permissions`, `user_roles`. Below is the production-grade model.

#### Core tables
- **`admin_identities`** (replace or evolve `admin_users`)
  - `id` (PK)
  - `email` or `username` (unique)
  - `password_hash`
  - `full_name`
  - `is_active`
  - `created_at`, `updated_at`

- **`roles`**
  - `id` (PK)
  - `key` (unique) — one of `admin|moderator|editor|user`
  - `name` (display)
  - `description`

- **`permissions`**
  - `id` (PK)
  - `key` (unique) — e.g. `page:admin.hospitals:read`, `hospitals:approve`
  - `category` — e.g. `page`, `directory`, `content`, `iam`, `ops`
  - `description`

- **`role_permissions`** (many-to-many)
  - `role_id` (FK → `roles.id`)
  - `permission_id` (FK → `permissions.id`)
  - PK (`role_id`, `permission_id`)

- **`user_roles`** (many-to-many)
  - `user_id` (FK → `admin_identities.id`)
  - `role_id` (FK → `roles.id`)
  - PK (`user_id`, `role_id`)

#### Optional but strongly recommended tables
- **`user_permission_overrides`**
  - `user_id` (FK)
  - `permission_id` (FK)
  - `effect` ENUM(`allow`,`deny`)
  - PK (`user_id`, `permission_id`)
  - Purpose: exceptions like “this editor can edit hospitals but not news”.

- **`audit_log`**
  - `id` (PK)
  - `actor_user_id` (FK → `admin_identities.id`)
  - `action` (string) — e.g. `hospitals.update`
  - `entity_type`, `entity_id`
  - `before_json`, `after_json`
  - `ip`, `user_agent`
  - `created_at`

#### Relationship summary
- One `admin_identity` has many `roles` through `user_roles`.
- One `role` has many `permissions` through `role_permissions`.
- A user’s effective permissions:
  - union of all role permissions
  - then apply overrides (deny wins over allow).

---

### 4.6 Admin UI design (screens to add + interaction)

#### Screens (minimum)
- **1) Admin → Dashboard**
  - Summary cards: pending approvals, recent edits, imports status.
- **2) Admin → Staff Users**
  - List staff (`admin_identities`), create, disable, reset password.
  - Details page:
    - profile
    - roles multi-select
    - permission overrides
    - last login + audit trail snippet
- **3) Admin → Roles & Permissions**
  - Left: roles list (`admin`, `moderator`, `editor`, `user`)
  - Right: permission matrix grouped by category
  - Save updates `role_permissions`
- **4) Admin → Moderation Queue**
  - Tabs by entity: hospitals/pharmacies/ambulances/accommodations/international
  - Each item shows diff + provenance + duplicate suggestions
  - Actions: approve/reject/request changes
- **5) Admin → Audit Log**
  - Search by actor/entity/date/action
  - View before/after snapshots

#### How role assignment works in the UI
- In “Staff Users” details:
  - Roles shown as checkboxes (multi-role) or single-select (if you keep one role).
  - Changes require `roles:update`.
  - On save, show “effective permissions” preview (read-only list).

#### How to manage permissions visually
- In “Roles & Permissions”:
  - Group permissions by category (Pages, Content, Directories, IAM, Ops).
  - Each permission has:
    - checkbox (grant)
    - short description
  - Provide templates:
    - “Editor (News only)”
    - “Moderator (Approvals)”
    - “Read-only user”

---

## 5) Step-by-step implementation plan (exact order, where, why)

Constraint reminder: this document describes *what to do next*; it does not apply code changes.

### Step 1 — Inventory endpoints & define an API contract
- **What to do**
  - Create a list of all endpoints under `api/public/` and `api/admin/`.
  - For each: method(s), auth required, input fields, output shape, error codes.
- **Where**
  - Files: `api/public/*.php`, `api/admin/*.php`
- **Why**
  - You cannot enforce consistent auth/validation/versioning without a clear contract.

### Step 2 — Introduce API versioning and a consistent response format
- **What to do**
  - Decide: `/api/v1/public/...` and `/api/v1/admin/...` or keep current paths and add `X-API-Version`.
  - Define a standard JSON envelope:
    - success: `{ data, meta }`
    - error: `{ error: { code, message, details }, request_id }`
- **Where**
  - Backend: central response helpers in `api/admin/bootstrap.php`
  - Frontend: `src/lib/localApi.js` error parsing
- **Why**
  - Prevent breaking changes and improve debuggability/monitoring.

### Step 3 — Add CSRF protection for cookie-session APIs (admin + public)
- **What to do**
  - Implement CSRF tokens:
    - endpoint to fetch token (GET)
    - require token header (POST/PUT/DELETE)
  - Ensure SameSite/secure cookie settings are correct in production.
- **Where**
  - Backend: `api/admin/bootstrap.php` + all state-changing endpoints
  - Frontend: `src/lib/localApi.js` (add header)
- **Why**
  - Cookie-based sessions without CSRF protection are not safe on the public internet.

### Step 4 — Add rate limiting for login and write endpoints
- **What to do**
  - Implement per-IP and per-identity limits for:
    - `api/admin/auth/login.php`
    - `api/public/auth/login.php`
    - comments/ratings/reviews endpoints
- **Where**
  - Backend: middleware-like checks in `api/admin/bootstrap.php` or a shared include.
- **Why**
  - Prevent brute force and spam abuse.

### Step 5 — Enforce server-side authorization on every admin endpoint
- **What to do**
  - Define permissions (start with page-level + CRUD).
  - Implement `require_permission($key)` and call it in each `api/admin/*.php`.
  - Ensure “editor/moderator” restrictions are enforced in the backend, not only in `AdminPage.jsx`.
- **Where**
  - Backend: `api/admin/bootstrap.php` + each admin endpoint.
  - Frontend: keep UI gating but treat it as UX only.
- **Why**
  - This closes the largest production-grade security gap in the current app.

### Step 6 — RBAC schema migration (roles + permissions tables)
- **What to do**
  - Add tables: `roles`, `permissions`, `role_permissions`, `user_roles`, `user_permission_overrides`, `audit_log`.
  - Backfill:
    - existing `admin_users.role` into `user_roles`
    - seed default roles/permissions
- **Where**
  - DB migration scripts (create a `migrations/` folder or SQL files in `deploy/`).
- **Why**
  - Enables flexible page/section permissions and future growth without hardcoding.

### Step 7 — Add audit logging for admin actions
- **What to do**
  - Log create/update/delete actions for all admin-managed entities.
  - Log authentication events.
- **Where**
  - Backend: add `audit_log_write()` helper and call it from admin endpoints.
- **Why**
  - Required for traceability and incident response.

### Step 8 — Data integrity: add foreign keys and standardize charsets
- **What to do**
  - Add missing FKs for engagement tables to `public_users` and parent entities.
  - Migrate `admin_users` charset/collation to `utf8mb4`.
- **Where**
  - DB migrations.
- **Why**
  - Prevent orphans, enforce consistency, avoid encoding bugs.

### Step 9 — Canonicalize locations (wilayas/communes)
- **What to do**
  - Create `wilayas` and `communes` tables.
  - Migrate existing string fields to FK references.
  - Update endpoints to use the canonical model.
- **Where**
  - DB + `api/public/*` and `api/admin/*` directory endpoints.
- **Why**
  - Location-based browsing is core; inconsistent modeling will block scaling and quality.

### Step 10 — Add moderation workflow states to directory entities
- **What to do**
  - Add `status` and approval fields to hospitals/pharmacies/ambulances/accommodations.
  - Public endpoints return only `approved` records.
  - Admin endpoints support approve/reject with permissions.
- **Where**
  - DB + `api/public/*.php` + `api/admin/*.php` directory endpoints.
- **Why**
  - Enables safe ingestion/import and reduces public-facing data issues.

### Step 11 — Build “Roles & Permissions” admin UI
- **What to do**
  - Add screens described in section 4.6.
  - Use session endpoint to load effective permissions and drive UI.
- **Where**
  - Frontend: `src/pages/AdminPage.jsx` + new components under `src/components/admin/`
- **Why**
  - Makes permission management operationally usable (not hardcoded).

### Step 12 — Data pipeline automation (imports + dedupe + provenance)
- **What to do**
  - Add an import runner with validation and dedupe.
  - Store provenance (`source`, `external_id`) and import run logs.
- **Where**
  - Backend tooling under `tools/` or `script/` plus admin UI for imports.
- **Why**
  - Stops manual SQL inserts from becoming a permanent reliability risk.

---

## Appendix A — Immediate “must-fix” checklist (before any public launch)
- Enforce server-side RBAC on `api/admin/*`.
- Add CSRF protection to all state-changing endpoints.
- Add login rate limiting + spam protection on public writes.
- Remove/lock down dev-only admin auth fallback in production builds.
- Move secrets out of web root and remove root DB credentials from production config.



---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

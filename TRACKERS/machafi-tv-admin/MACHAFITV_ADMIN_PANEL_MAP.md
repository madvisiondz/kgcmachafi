# Machafi TV — admin panel (`/machafitv/admin/*`)

Single source of truth for **`MachafiTvAdminPage`** and the **future** Machafi TV control plane: per-edition editorial, wire queue, live/stream settings, schedule (EPG), and playout-related configuration for **`/tv/:edition/*`**.

## 1) Purpose

- **Broadcast operations**: journalists and producers manage stories, breaking flags, wire lines, rundowns, and **live** configuration without touching the Machafi Services directory admin.
- **Edition scope**: content and settings may be **per edition** (`ar` / `fr` / `en`) — not only translations; admin must filter or switch desk context safely.

## 2) Routes (current)

| Path | Component | State |
|------|-----------|--------|
| **`/machafitv/admin`** | `MachafiTvAdminPage.jsx` | **Placeholder** — title, subtitle, link to **`/tv/ar/`** (public TV home) |
| **`/machafitv/admin/*`** | Same element (wildcard) | No nested admin routes yet |

## 3) UX flow (target)

1. **Login** → roles: `tv_super`, `tv_editor`, `tv_producer`, `tv_readonly`.
2. **Edition switcher** → `ar` | `fr` | `en` (persist last desk).
3. **Home / dashboard** → breaking items, scheduled live windows, wire backlog counts.
4. **Modules**: Articles, Wire, Schedule, Live/stream, Ticker, Rights & legal, Users.

## 4) Data contracts (link to public TV)

- Public mocks and UI contracts: **`../machafi-tv/TV_HOME_PAGE_MAP.md`**, **`../machafi-tv/TV_ARTICLE_PAGE_MAP.md`**, **`../machafi-tv/TV_ACTIVITY_PAGE_MAP.md`**, **`../machafi-tv/TV_LIVE_PAGE_MAP.md`**, **`../machafi-tv/TV_SCHEDULE_PAGE_MAP.md`**, **`../machafi-tv/TV_SHELL_PAGE_MAP.md`** (ticker).
- Admin CMS tables should support **`TvLocalized`**-style fields (or JSON per locale) plus `status`, `embargo_until`, `breaking`, `published_at`.

## 5) Endpoint proposals

### Auth

- `POST /api/admin/machafitv/auth/login` — scoped TV admin only (separate from Health Services admin).

### Editorial

- `GET/POST/PUT/DELETE /api/admin/machafitv/editions/{edition}/articles`
- `GET/POST/PUT/DELETE /api/admin/machafitv/editions/{edition}/wire` — wire lines, `urgent`, retract.
- `GET/PUT /api/admin/machafitv/editions/{edition}/ticker` — breaking strip lines (see public **`../machafi-tv/TV_SHELL_PAGE_MAP.md`**).

### Live & schedule

- `GET/PUT /api/admin/machafitv/editions/{edition}/live` — HLS URL, poster, slate, geo rules (mirror concepts in **`../machafi-services/LIVE_PAGE_MAP.md`** but **TV-scoped**).
- `GET/POST/PUT/DELETE /api/admin/machafitv/editions/{edition}/schedule` — EPG slots, live vs tape flags.

### Playout / rights (later)

- `GET/POST /api/admin/machafitv/rights-cues` — music/archive reporting exports.

## 6) Admin control panel (target modules)

| Module | Controls |
|--------|----------|
| Articles | CRUD, slug, topic, editions fields, body blocks, breaking, embargo, reviewer |
| Wire | Create line, urgent flag, retract, order |
| Ticker | Per-edition strings, schedule windows, emergency override |
| Live | Stream keys (server-side only in responses), poster, status override |
| Schedule | Day grid, live badges, exceptions |
| Desk metadata | Style playbook snippets, disclaimer templates |
| Users | TV roles only; no access to Health Services admin unless dual-role |

## 7) i18n (Rule #1)

- Placeholder: **`admin.tvTitle`**, **`admin.tvSub`**, **`admin.backToTv`**.
- Full admin UI should ship **English-first** tooling with optional Arabic/French UI chrome for operators (product decision).

## 8) File map

- `frontend/src/pages/admin/MachafiTvAdminPage.jsx`
- `frontend/src/App.tsx` — **`/machafitv/admin/*`**
- `frontend/src/components/DocumentTitle.jsx` — `admin.tvTitle`
- `frontend/src/routes/paths.ts` — `tvEditionPath`

## 9) Safeguards

- **Stream URLs and signing keys** must never appear in client-side admin bundles unredacted; use short-lived tokens from server.
- **Embargo**: public `GET` for articles/wire must respect `embargo_until` and `draft` status.
- **Separation of duties**: deleting a published TV article should require elevated role + audit log.

## 10) Changelog

- **2026-05-12**: Tracker created; documents placeholder + target TV admin surface.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. All routes are **edition-scoped** where applicable (`ar` / `fr` / `en`). Public read contracts: **`../machafi-tv/TV_*_PAGE_MAP.md`**.

### Auth (TV-only)

| Method | Path | PHP |
|--------|------|-----|
| POST | `/api/admin/machafitv/auth/login` | **`api/admin/machafitv-auth-login.php`** — session scoped to TV roles |
| POST | `/api/admin/machafitv/auth/logout` | **`api/admin/machafitv-auth-logout.php`** |

### Editorial + playout (PHP map)

| Area | Admin PHP (suggested) | Tables |
|------|----------------------|--------|
| Articles | `api/admin/tv-articles.php` | `tv_articles` |
| Wire | `api/admin/tv-wire.php` | `tv_wire_items` |
| Ticker | `api/admin/tv-ticker.php` | `tv_ticker_lines` |
| Home layout | `api/admin/tv-home-layout.php` | `tv_home_layout` |
| Live | `api/admin/tv-live.php` | `tv_live_settings` |
| Schedule | `api/admin/tv-schedule.php` | `tv_schedule_slots` |
| Search config | `api/admin/tv-search-config.php` | JSON or `tv_search_config` |
| Style / desk | `api/admin/tv-style-guide.php` | `tv_style_guides` |

---

## Documentation sync (2026-05-12)

- Cross-route **dataset handoff**: `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`.
- Process / decisions: `../../PROJECT-EXPLAINER/PROMPT_LOG.md`.
- Related: **`../machafi-services/NEWS_PAGE_MAP.md`** (editorial patterns), **`../machafi-tv/`** public TV trackers.


---

## 12) Implemented HTTP map (Machafi TV admin — 2026-05-14)

There are **no** `api/admin/tv-*.php` (or `machafitv-auth-*.php`) files in this repository yet. The **§Full endpoint design** table below remains a **target** layout.

**Implemented today (shared host):** Health Services admin JSON under `api/admin/*` — see **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`** (same PHP tree; RBAC scopes are a product concern for when this panel is built).

---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

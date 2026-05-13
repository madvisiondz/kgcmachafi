# SERVICES page — map + architecture (UI-first, backend-ready)

Route (frontend): **`/service`**

Implementation: `frontend/src/pages/ServicesPage.jsx`

Mock data (UI-first, shaped like backend): `frontend/src/data/services.ts`

---

## 1) What this page is (product intent)

The Services page is the **coordination hub** for “practical help”:

- visitors can **discover what help exists** (home care, nursing, lab tests at home, oxygen, rehab, transport, guidance)
- understand **what the service covers** (details + highlights)
- follow the platform rule: **call first** to confirm availability, timing, and cost

This page is not “just marketing”: it is designed as a **directory of actionable services** that can be administered and updated frequently.

---

## 2) Value added (health community + society)

- **Faster access to care**: reduces the time lost searching across random numbers/ads by presenting services in one predictable place.
- **Less harm from misinformation**: sets a clear expectation (“call to confirm”) and encourages safe coordination.
- **Better continuity for families**: home-care + nursing + lab testing can reduce unnecessary travel and hospital crowding.
- **Local ecosystem visibility**: highlights suppliers and medical events (exhibitions) to connect professionals and improve procurement awareness.
- **Foundation for verified networks**: backend-ready structure enables “verified” providers, moderation, and deactivation workflows.

---

## 3) UI section map (what users see)

### 3.1 Services directory (cards + details modal)

- **Sticky panel**:
  - search input (client-side now)
  - results count + usage hint
- **Grid of service cards**
  - icon + title + description
  - open modal with “about” + “highlights”
- **How it works** (3 steps)
- **Contact CTA** (scrolls to footer contact section)

### 3.2 Medical suppliers directory (lightweight)

- A small directory of suppliers (equipment / lab / consumables / prosthetics)
- Each item includes: title, type, description, location, phone (call-first UX)

### 3.3 Health exhibitions agenda (tabs)

- Tabs: Algeria / Arab world / World
- Event cards: title, date, location, description

---

## 4) Data model (backend-ready)

This UI intentionally matches the existing PHP API schema so wiring is straightforward.

### 4.1 Services (matches `api/admin/services-content.php`)

Entity: `services`

Fields used by UI:
- `id`
- `icon_key`
- `title`
- `description`
- `details`
- `features` (array)
- `color_class` (Tailwind gradient tokens)
- `bg_class` (Tailwind background tokens)
- `sort_order`
- `is_active`

### 4.2 Services section content (matches `settings.services_content` in `site_settings`)

Shape (minimum):
- `section_title`
- `section_subtitle`

---

## 5) Proposed public endpoints (very important)

### Option A (recommended): lightweight dedicated endpoint

- **`GET /api/public/services?lang=ar`**
  - returns:
    - `section`: `{ section_title, section_subtitle }`
    - `items`: list of active services, already localized for `lang`
  - ensures the Services page can load without pulling unrelated site content

### Option B: reuse the existing site content endpoint

- **`GET /api/public/site-content.php?lang=ar`**
  - already returns `settings` + `services` among other datasets
  - trade-off: heavier payload and couples page load to extra datasets

### Optional map/search endpoints (future)

- **`GET /api/public/services/search?q=...&lang=...`**
  - if the dataset grows large or needs server-side search

---

## 6) Proposed admin controls (control panel)

### 6.1 Services manager (CRUD)

Admin operations:
- create / edit / reorder services
- toggle `is_active`
- manage `features` list
- set `icon_key`, theme (`color_class`, `bg_class`)

Admin endpoints (already exist in repo, keep stable):
- `GET /api/admin/services-content.php`
- `POST /api/admin/services-content.php`
- `PUT /api/admin/services-content.php?id=...`
- `DELETE /api/admin/services-content.php?id=...`

### 6.2 Services section content (settings)

Admin must be able to edit:
- section title/subtitle for AR/FR/EN

Suggested endpoints (if not already present through site settings manager):
- `GET /api/admin/site-settings.php` (read)
- `PUT /api/admin/site-settings.php` (write)
  - update `services_content`

### 6.3 Rule #1 enforcement (translations)

Because service titles/descriptions are user-visible:
- enforce AR/FR/EN completeness before publish (or apply explicit fallback policy)

Existing “Plan B” translation support is already present via `content_i18n` and `site-content.php` translation application.

---

## 7) Performance & safety notes

- “Call first” is an explicit UX guardrail to prevent wrong assumptions.
- Keep service cards lightweight; details appear in modal.
- If/when wiring backend, ensure list responses are limited to fields the UI needs (avoid large payloads).

---

## 8) Rule #0 compliance (documentation)

When this page changes:
- update `SERVICES_PAGE_MAP.md`
- update `../../PROJECT-EXPLAINER/PROMPT_LOG.md` (what changed)
- update `../../PROJECT-EXPLAINER/PROJECT_STATUS.md` (done/in progress/remaining)


---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

Reuse or align with existing **`services`** (or equivalent) table used by `api/public/site-content.php` / admin services endpoints. Typical shape:

```sql
CREATE TABLE services (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  icon_key VARCHAR(64) NULL,
  color_class VARCHAR(64) NULL,
  bg_class VARCHAR(64) NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE service_i18n (
  service_id BIGINT NOT NULL,
  lang CHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  features_json JSON NULL,
  PRIMARY KEY (service_id, lang),
  FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Section hero copy may live in **`site_settings`** JSON (`services_content`) keyed by locale.

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/services` | **`api/public/services.php`** (or bundle via **`api/public/site-content.php`**) | `SELECT` active services + `service_i18n` for `?lang=` |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/POST/PUT/DELETE | `/api/admin/services` | **`api/admin/services-content.php`** (existing) |
| GET/PUT | `/api/admin/site-settings` | **`api/admin/site-settings.php`** — section titles |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

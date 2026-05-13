# Pharmacies page — architecture + service value (directory-first)

This document is the **single source of truth** for the Pharmacies directory page rebuild in the new frontend.

## 1) Purpose (why this page matters)

The Pharmacies page is not “just another directory”.

Its primary value to visitors is:

- **Find the closest pharmacy fast**, with minimal steps.
- **Most important**: find the **night-shift (on-duty) pharmacy** when it’s late, urgent, or regular pharmacies are closed.

If we do this page correctly, MACHAFI becomes instantly useful in real life:

- Late-night fever / urgent medication
- Emergency prescriptions after hours
- Travelers in an unfamiliar city
- Families needing a clear “open now / night duty” answer instead of random social posts

The page must optimize for **speed, trust, and clarity**.

---

## 2) Product model (80% static directory + 20% weekly night-shift)

This page combines **two datasets**:

### A) Static directory (≈ 80%)

- Long-lived pharmacy “cards” for **every wilaya + city**.
- Changes slowly (new pharmacy, changed phone/address, corrected location).
- This dataset is what makes the page feel complete and browseable.

### B) Night-shift schedule (≈ 20%, changes weekly)

- A weekly “rotation” list that marks some pharmacies as **on duty at night**.
- Changes **week to week** (sometimes by local authority schedules).
- This dataset is what makes the page **life-saving**.

**Important rule**: night shift is not a property of a pharmacy “forever”.
It’s a **schedule assignment** that should be represented as a separate dataset.

---

## 3) UX principle (visitor flow)

Visitors should be able to answer one of these questions in < 20 seconds:

1) “I need a pharmacy **right now** (night duty).”
2) “I need the **closest** pharmacy in my wilaya/city.”
3) “I want to browse pharmacies in my area and save the contact.”

### Recommended flow

- See a clear title + subtitle emphasizing **night duty**.
- Choose **Wilaya** → choose **City** (optional).
- Toggle **Night shift only** (primary, high-importance).
- Results instantly update and show:
  - **Night shift this week** (prominent section)
  - **All results** (directory list)
- Each card offers 1-click actions:
  - **Call**
  - **Directions** (when coordinates exist)

---

## 4) Page architecture (new frontend)

### Route

- `/pharmacies`

### Files (UI-first stage)

- Page: `frontend/src/pages/PharmaciesPage.jsx`
- Mock data: `frontend/src/data/pharmacies.ts`
- Algeria location lists (canonical, updated):
  - Source data: `frontend/src/data/Map.json`
  - Adapter module: `frontend/src/data/algeria-data.js` (exports `wilayas`, `getCommunes`)
- i18n keys: `frontend/src/i18n/translations.ts` under `pharmacies.*`

### Layout structure (legacy-inspired, rebuild-safe)

The page intentionally mirrors the *legacy layout concept* (without legacy dependencies):

#### Left column: sticky “filters” panel

- Search input (name/wilaya/city/phone/address)
- Wilaya select
- City select (enabled once wilaya is chosen)
- Night shift toggle (high-emphasis)
- Result count + “week start” info (explains why night shift changes)

#### Right column: results

1) **Night shift this week** (highlight block)
   - Always visible to teach the visitor that “night duty is a weekly list”
   - Shows the on-duty pharmacies (if available)

2) **Directory results** (cards)
   - Shows the filtered set (all or night-only)
   - Has a strong empty state (what to try next)

3) **Map (bottom)** (filtered pins only)
   - Map is placed **after filters/results** so it always reflects the current selection.
   - Pins render only for listings that have coordinates.

### Card contract (what every pharmacy card should contain)

- **Name**
- **Wilaya + city**
- **Address** (optional in early data)
- **Phone** (optional, but recommended)
- **Night duty badge** (if on duty this week)
- **Actions**
  - Call (`tel:` link) when phone exists
  - Directions (Google Maps) when coordinates exist

---

## 5) Data architecture (future-proof, API wiring phase)

When wiring backend, keep this contract:

### A) Static directory entity: `Pharmacy`

Minimal fields (directory-first philosophy):

- `id`
- `name`
- `wilayaCode`
- `city`
- `address` (optional)
- `phone` (optional)
- `lat/lng` (optional but valuable)

### B) Weekly schedule entity: `NightShiftAssignment`

- `weekStart` (YYYY-MM-DD, Monday)
- `pharmacyId`
- Optional: `source` (authority/import/manual)

This separation is critical:

- Keeps pharmacy cards stable (don’t rewrite pharmacy records weekly)
- Makes schedules replaceable (new week = new assignments)

---

## 5.1) Proposed public API endpoints (for this page)

These are the endpoints the public Pharmacies page should rely on once wired (UI-first → contracts → API):

- `GET /api/pharmacies`
  - Query: `wilayaCode?`, `communeId?`, `q?`, `page?`, `limit?`
  - Returns: paged list of `Pharmacy` cards (static directory)

- `GET /api/pharmacies/night-shifts`
  - Query: `weekStart=YYYY-MM-DD`
  - Returns: list of `NightShiftAssignment` (or a `{ weekStart, pharmacyIds[] }` convenience response)

- (Optional) `GET /api/pharmacies/map`
  - Query: `wilayaCode?`, `communeId?`, `nightOnly?`, `weekStart?`
  - Returns: lightweight list of points for the map (id, name, lat/lng, phone, isNightDuty)
  - Reason: map view should be fast and not require loading full card bodies

- (Optional) `GET /api/pharmacies/:id`
  - Returns: full pharmacy details when we introduce a details view later

---

## 5.2) Admin Control Panel controls (to keep this page accurate)

The public value depends on data being correct. Admin must be able to manage **both** the static directory and the weekly night-shift layer.

### A) Pharmacy directory management

- **Create / edit / archive** a pharmacy card
  - Fields: name, wilayaCode, communeId, address, phone, lat/lng, verification status
- **Bulk import** pharmacies (CSV/JSON) with duplicate detection
- **Validate and normalize** location fields (wilaya/commune) against the canonical lists
- **Mark “verified”** and track `lastUpdatedAt` (trust signal)

### B) Night shift schedule management (weekly rotation)

- Choose `weekStart` (Monday) and manage assignments:
  - add/remove pharmacy from the week’s night duty list
  - bulk paste/import weekly lists (often provided as PDF/Excel by local authorities)
- Prevent mistakes:
  - warn when a pharmacy has no phone
  - warn when a pharmacy has no address/coordinates (optional)
  - prevent duplicates in the same week
- Publish workflow:
  - draft → publish for a given week (so public sees a consistent list)

### C) Support / corrections workflow (optional but high value)

- “Report wrong number / wrong location / closed” queue
- Admin review + quick edit + audit log

---

## 6) “Closest pharmacy” strategy (phased)

### Phase 1 (UI-first, current)

- “Closest” is approximated by **wilaya/city filtering** and quickly calling/directions.
- Coordinates exist for some cards; the UI supports directions when available.

### Phase 2 (visitor geolocation)

Add optional “Use my location”:

- Ask browser permission (explicitly).
- Compute distance to pharmacies with coordinates (Haversine).
- Allow a “Nearest only” view and/or sort by distance.

### Phase 3 (data quality)

To make “closest” truly reliable:

- Increase coordinate coverage (lat/lng for most pharmacies)
- Validate addresses and normalize wilaya/city names
- Add per-city indexes or server-side filtering/pagination for performance

---

## 7) Content + trust signals (what makes it glorious)

To be “glorious”, the page must feel **reliable**:

- Night duty clearly labeled as **weekly** and tied to a week start date
- Clear badge and strong emphasis for on-duty results
- Simple, fast filters (no complex forms)
- Strong empty states (don’t leave the visitor lost)
- Actions that work (tel + directions) and degrade gracefully when missing

**Optional future trust upgrades**

- “Verified” label (when validated by admin)
- “Last updated” timestamp per city/wilaya
- “Report wrong number” feedback channel

---

## 8) Implementation status (UI-first)

### Done (this rebuild step)

- Route `/pharmacies` created and mounted.
- Legacy-inspired layout:
  - Sticky filter panel
  - Night-shift highlight section
  - Directory card list with call/directions actions
- Mock data split:
  - Static directory list
  - Weekly schedule list (`weekStart` → `nightDutyIds`)
- i18n keys created for AR/FR/EN.
- Wilaya + city dropdowns now use the **legacy-proven** dataset (all wilayas + baladiyas/communes), so the filters work correctly even with partial pharmacy card data.

### Next (recommended)

- Expand mock dataset so the directory feels “national” (more wilayas/cities).
- Add “open hours” fields (display only; no business logic yet).
- Add optional geolocation + nearest sorting (phase 2).
- Create a backend contract for:
  - `GET /pharmacies?wilaya=&city=&q=`
  - `GET /night-shifts?weekStart=`

---

## 9) Rule #0 compliance (documentation)

Whenever we touch this page, we also update:

- This file: `PHARMACIES_PAGE_MAP.md`
- `../../PROJECT-EXPLAINER/HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`
- `../../PROJECT-EXPLAINER/LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`
- `../../PROJECT-EXPLAINER/PROJECT_STATUS.md`
- `../../PROJECT-EXPLAINER/project-explainer.md`
- `../../PROJECT-EXPLAINER/PROMPT_LOG.md`


---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

```sql
CREATE TABLE pharmacies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  wilaya_code VARCHAR(8) NOT NULL,
  commune_id VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  address VARCHAR(512) NULL,
  lat DECIMAL(10,7) NULL,
  lng DECIMAL(10,7) NULL,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  updated_at DATETIME NOT NULL,
  KEY idx_loc (wilaya_code, commune_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pharmacy_night_weeks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  week_start DATE NOT NULL,
  UNIQUE KEY uq_week (week_start)
);

CREATE TABLE pharmacy_night_assignments (
  week_id BIGINT NOT NULL,
  pharmacy_id BIGINT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (week_id, pharmacy_id),
  FOREIGN KEY (week_id) REFERENCES pharmacy_night_weeks(id),
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/pharmacies` | **`api/public/pharmacies.php`** (new) | Filter `pharmacies` by `wilaya_code`, `commune_id`, `q`, `nightOnly` (join assignments for active week) |
| GET | `/api/public/pharmacies/night-shift` | **`api/public/pharmacy-night-shift.php`** (new) | `week_start` → rows via `pharmacy_night_weeks` + `pharmacy_night_assignments` |

### HTTP — admin

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET/POST/PUT/DELETE | `/api/admin/pharmacies` | **`api/admin/pharmacies.php`** | CRUD `pharmacies` |
| PUT | `/api/admin/pharmacies/night-shift` | **`api/admin/pharmacy-night-shift.php`** | Upsert week + replace assignment rows |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-13** — evening session close (project-wide doc sync).*

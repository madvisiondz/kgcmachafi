# Housing (Accommodations) page — architecture + service value (directory-first)

This document is the **single source of truth** for the Patient Housing directory page in the new frontend.

## 1) Purpose (why this page matters)

Housing here is not “tourism accommodation”.

This page exists for a high‑stress visitor story:

- A patient (or companion) travels to a different wilaya for treatment.
- They need a **safe place to stay** quickly, ideally through:
  - volunteer families
  - associations/clubs
  - guesthouses offering patient discounts

The page must provide **human value**:

- reduce anxiety
- help people coordinate quickly (call-first)
- provide trust signals (verified listings)

---

## 2) Main idea: Map-supported directory (map after filters)

**The directory is the product** for this page:

- The visitor filters by wilaya/city and sees reliable cards first (call-first).
- The map is a **supporting view** shown **at the bottom** (after filters + results) to show pins for the **filtered** listings that have coordinates.

Volunteer/association housing remains a **major value point**, but it is primarily:

- a **trust + marketing narrative** for the page
- a way to encourage more listings and community participation

The core navigation must remain **map-first**.

---

## 3) UX variation (make it count)

We intentionally vary the feel vs other directories:

- Pharmacies: “night shift / urgent availability” (emerald + indigo)
- Ambulances: “emergency transport / call now” (red + neutral)
- Housing: “care & support / dignity” (blue + soft neutrals)

Key UX differences:

- **Map-first** section (pins + popup actions)
- “How it works” strip (3 steps) to guide stressed visitors.
- Emphasis on **verified** listings and clear conditions (companion, long stay).

---

## 4) Page architecture (new frontend)

### Route

- `/accommodations`

### Files (UI-first stage)

- Page: `frontend/src/pages/AccommodationsPage.jsx`
- Mock data: `frontend/src/data/housing.ts`
- Location lists (canonical, updated):
  - `frontend/src/data/Map.json`
  - `frontend/src/data/algeria-data.js` (exports `wilayas`, `getCommunes`)
- i18n keys: `frontend/src/i18n/translations.ts` under `housing.*`

### Sections (top → bottom)

1. **Hero + value statement**
2. **How it works** (3 cards)
3. **Filters** (search, wilaya/city, capacity, free-only, verified-only)
4. **Results cards** (call-first)
5. **Map (bottom)** — pins + popups + “nearest” (optional geolocation), filtered pins only

---

## 4) Card contract (what every listing must contain)

Minimum fields:

- Title
- Host/association name
- Phone (required)
- Wilaya + commune/city
- Capacity
- Free/paid + price (optional)
- Conditions: accepts companion, long/short stay
- Trust: verified yes/no

Primary action:

- **Call to coordinate** (`tel:`)

---

## 5) Proposed public API endpoints (for this page)

- `GET /api/housing`
  - Query: `wilayaCode?`, `communeId?`, `q?`, `freeOnly?`, `verifiedOnly?`, `minCapacity?`, `page?`, `limit?`
  - Returns: paged list of `HousingListing`

- (Optional) `GET /api/housing/map`
  - Query: `wilayaCode?`, `communeId?`, `freeOnly?`, `verifiedOnly?`
  - Returns: lightweight list of points for the map (id, title, lat/lng, verified, free/paid)
  - Reason: map view should be fast and not require loading full card bodies

- (Optional) `GET /api/housing/:id`
  - Details view later (photos, rules, directions, contact channels)

- (Optional) `GET /api/reports?type=housing&listingId=...`
  - for “report wrong number / unsafe listing” workflows

---

## 6) Admin Control Panel controls (to keep this page accurate)

Housing is trust-sensitive. Admin workflows are part of the product.

### A) Listings management

- Create / edit / archive listings
- Required: phone, wilayaCode, communeId, capacity, type (volunteer/association/guesthouse)
- Optional: address, price, conditions, description

### B) Verification and safety

- Verified toggle + `verifiedAt` + `verifiedBy`
- Quick disable if:
  - phone is wrong
  - host unavailable
  - unsafe report confirmed

### C) Intake workflow (recommended)

If you accept volunteer submissions:

- submissions queue (pending → approved → published)
- audit log of edits
- “translation completeness” per language (Rule #1)

### D) Quality enforcement

- Prevent publish if phone missing
- Prevent publish if translations missing (Rule #1 policy)

---

## 7) Implementation status (UI-first)

### Done

- `/accommodations` route created and mounted.
- Page created with care/support theme and value-first sections.
- Uses canonical 69-wilaya location dataset (`Map.json`).
- i18n keys created under `housing.*` (AR/FR/EN).

### Next

- Expand mock dataset (national coverage).
- Add optional “directions” when coordinates exist (later).
- Design an admin intake form with language tabs + verification workflow.

---

## 8) Rule #0 compliance (documentation)

Whenever we touch this page, we also update:

- `HOUSING_PAGE_MAP.md`
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
CREATE TABLE housing_listings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  listing_type ENUM('volunteer','association','guesthouse') NOT NULL,
  wilaya_code VARCHAR(8) NOT NULL,
  commune_id VARCHAR(32) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  capacity INT NULL,
  price_note VARCHAR(255) NULL,
  lat DECIMAL(10,7) NULL,
  lng DECIMAL(10,7) NULL,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  verified_at DATETIME NULL,
  status ENUM('pending','active','hidden') NOT NULL DEFAULT 'pending',
  updated_at DATETIME NOT NULL,
  KEY idx_loc (wilaya_code, commune_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE housing_listing_i18n (
  listing_id BIGINT NOT NULL,
  lang CHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  conditions TEXT NULL,
  description_md TEXT NULL,
  PRIMARY KEY (listing_id, lang),
  FOREIGN KEY (listing_id) REFERENCES housing_listings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/housing` | **`api/public/housing.php`** | Filter by wilaya/commune/q/type; `?lang=` |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/POST/PUT/DELETE | `/api/admin/housing` | **`api/admin/housing.php`** — verification + status |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

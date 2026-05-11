# Ambulances page — architecture + service value (directory-first)

This document is the **single source of truth** for the Ambulances / Medical Transport directory page rebuild.

## 1) Purpose (why this page matters)

This page is built for **urgent decision-making**.

Visitor needs are different from Pharmacies:

- They may be in **panic** (time-sensitive).
- The primary action is not “browse”, it’s **call now**.
- The page must quickly answer:
  - “Who can respond in my area?”
  - “Do they have ICU capability?”
  - “Is it free/paid, and what is the pricing model?”

The UI must be **calm but urgent**, with clear actions and no clutter.

---

## 2) UX design (how it should feel)

### Theme variation (intentional)

- Pharmacies: emerald/indigo “service directory” tone.
- Ambulances: **red + neutral** “emergency transport” tone (high urgency, high clarity).

### Navigation variation (intentional)

Instead of a sticky left filter panel (Pharmacies), Ambulances uses:

- A **top filter bar** (one-screen decision area)
- **Quick chips** for vehicle type switching (All / Standard / ICU / Medical transport)
- Cards optimized for “call now”

---

## 3) Page architecture (new frontend)

### Route

- `/ambulances`

### Files (UI-first stage)

- Page: `frontend/src/pages/AmbulancesPage.jsx`
- Mock data: `frontend/src/data/ambulances.ts`
- Location lists (canonical):
  - `frontend/src/data/Map.json`
  - `frontend/src/data/algeria-data.js` (exports `wilayas`, `getCommunes`)
- i18n keys: `frontend/src/i18n/translations.ts` under `ambulances.*`

### Component layout (top → bottom)

1. **Emergency hero header**
   - badge + title + subtitle
   - small stats pills (results/free/ICU)
2. **Top filter bar**
   - Search (provider name / phone)
   - Wilaya select
   - City/Baladiya select (enabled after wilaya)
   - Vehicle type select + quick chips
   - Free-only toggle
3. **Results list**
   - Cards with strong “Call now”
   - Helpful empty state

4. **Map (bottom)** (filtered pins only)
   - Map is placed **after filters/results** so it always reflects the current selection.
   - Pins render only for listings that have coordinates.

---

## 4) Card contract (what every ambulance listing must contain)

Minimum data per card:

- Provider / owner name
- Wilaya + commune/city
- Phone (required)
- Vehicle type: `standard | icu | medical-transport`
- Free vs paid indicator
- Optional price description
- Optional coordinates (for later “closest” feature)

Primary action:

- **Call now** (`tel:`)

---

## 5) Proposed public API endpoints (for this page)

- `GET /api/ambulances`
  - Query: `wilayaCode?`, `communeId?`, `q?`, `vehicleType?`, `freeOnly?`, `page?`, `limit?`
  - Returns: paged list of `AmbulanceListing`

- (Optional) `GET /api/ambulances/map`
  - Query: `wilayaCode?`, `communeId?`, `vehicleType?`, `freeOnly?`
  - Returns: lightweight list of points for the map (id, ownerName, lat/lng, phone, vehicleType)
  - Reason: map view should be fast and not require loading full card bodies

- (Optional) `GET /api/ambulances/:id`
  - Returns: listing details (future details view)

- (Optional) `GET /api/reviews?type=ambulance&targetId=...`
  - If we later reintroduce ratings/reviews safely (must be moderated)

---

## 6) Admin Control Panel controls (to keep this page accurate)

Ambulances data must be controlled carefully: wrong numbers here are harmful.

### A) Listings management

- Create / edit / archive listings
  - owner/provider name, phone (required), wilayaCode, communeId, vehicle type
  - free/paid + price description
  - active/inactive toggle
  - coordinates (optional)

### B) Trust + safety controls

- “Verified” status + `lastUpdatedAt`
- Quick disable (“phone is wrong”, “service closed”, “inactive”)
- Duplicate detection (same phone across multiple entries)

### C) Intake workflow (optional)

- If you allow submissions:
  - submissions queue (pending → approved → published)
  - audit log of approvals/edits

---

## 7) Future: closest + response-time UX

Phase plan:

- Phase 1 (current): wilaya/city filtering + call
- Phase 2: optional geolocation + nearest sorting (only when coordinates coverage is strong)
- Phase 3: response-time and availability signals (must be verified; avoid fake “available now” claims)

---

## 8) Implementation status (UI-first)

### Done

- `/ambulances` route created and mounted.
- Page created with theme + navigation variation vs Pharmacies.
- i18n keys added for AR/FR/EN.
- Uses canonical location lists (`Map.json` + adapter).

### Next

- Expand mock listings to feel national.
- Add optional directions button when coordinates exist (not required for the first useful version).

---

## 9) Rule #0 compliance (documentation)

Whenever we touch this page, we also update:

- `AMBULANCES_PAGE_MAP.md`
- `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`
- `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`
- `PROJECT_STATUS.md`
- `project-explainer.md`
- `PROMPT_LOG.md`


---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see root `PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in root `PROMPT_LOG.md` under **2026-04-30**.
- This page’s **API / admin contracts** below are unchanged unless product scope changes.

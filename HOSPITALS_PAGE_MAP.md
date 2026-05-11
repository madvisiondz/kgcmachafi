# Hospitals page — architecture + visitor & society value (directory-first)

This document is the **single source of truth** for the Hospitals directory page rebuild.

## 1) Purpose (why this page matters)

Hospitals is one of the most important pages because it reduces **time-to-care**.

### Value to visitors (client-friendly)

- Helps a patient quickly answer **“Where do I go?”**
- Makes it easy to **call first** (avoid wasted travel)
- Adds trust signals (verified) to reduce wrong information
- Clarifies the type of place (public/private/clinic/specialized)
- Surfaces basic capability hints (emergency / ICU / online consult / card payment)

### Value to society (public good)

- Reduces chaos and misinformation during urgent situations
- Encourages accurate, updated contact information (admin workflows)
- Improves care access by making discovery simple for everyone (including non-tech users)

---

## 2) UX design (legacy-inspired, slight theme variation)

Legacy inspiration:

- Strong cards + badges, clear “call” action
- Local vs abroad separation

Rebuild choices:

- Two tabs:
  - **In Algeria** (wilaya/commune/type filters)
  - **Treatment abroad** (country/specialty filters)
- Calm “medical trust” theme: **slate + emerald trust accents**
- UI-first mock data now; backend later through lightweight endpoints

---

## 3) Page architecture (new frontend)

### Route

- `/hospitals`

### Files (UI-first stage)

- Page: `frontend/src/pages/HospitalsPage.jsx`
- Mock data: `frontend/src/data/hospitals.ts`
- Location lists (canonical, updated):
  - `frontend/src/data/Map.json`
  - `frontend/src/data/algeria-data.js` (exports `wilayas`, `getCommunes`)
- i18n keys: `frontend/src/i18n/translations.ts` under `hospitals.*`

### Sections (top → bottom)

1. **Hero** (title + subtitle + basic stats)
2. **Tabs** (Algeria / Abroad)
3. **Filters** (per tab)
4. **Results grid** (cards)

---

## 4) Card contract (what every hospital listing should contain)

### A) Algeria listing (minimum)

- `id`, `name`
- `wilayaCode`, `communeId`, `address?`
- `type` (public/private/clinic/specialized)
- `phone?` (recommended to be required later)
- `hoursLabel?` (24/7 vs daytime)
- `isVerified`
- `features[]` (emergency/ICU/online consult/card payment/insurance…)
- `lat/lng?` (optional now, enables directions/map later)

Primary actions:

- **Call**
- **Directions** (when coordinates exist)

### B) Abroad listing (minimum)

- `id`, `name`
- `countryKey`, `specialtyKey`, `city?`
- `phone?`, `website?`
- `isVerified`, `features[]`

---

## 5.1) Proposed public API endpoints (lightweight by default)

### Local (Algeria)

- `GET /api/hospitals`
  - Query: `wilayaCode?`, `communeId?`, `type?`, `q?`, `verifiedOnly?`, `page?`, `limit?`
  - Returns: paged list of lightweight hospital cards

- (Optional) `GET /api/hospitals/map`
  - Query: same filters
  - Returns: lightweight points (id, name, lat/lng, type, phone, isVerified)

### Abroad

- `GET /api/international-hospitals`
  - Query: `country?`, `specialty?`, `q?`, `verifiedOnly?`, `page?`, `limit?`
  - Returns: paged list of cards

---

## 5.2) Admin Control Panel controls (to keep this page accurate)

### A) Algeria hospitals management

- Create / edit / archive listings
- Required fields (recommended):
  - name, wilayaCode, communeId, phone
- Optional fields:
  - address, hours, lat/lng, website, features, specialty tags
- Verification workflow:
  - verified toggle + `verifiedAt` + `verifiedBy`
  - “disable quickly” if phone is wrong or hospital closed

### B) International hospitals management

- Same create/edit/archive
- Country + specialty taxonomy (managed lists)
- Verification workflow + moderation

### C) Safety / quality controls (recommended)

- Duplicate detection (same phone across entries)
- Mandatory “last reviewed” timestamp for verified listings
- Audit log for edits (who changed phone, when)

---

## 6) Notes / open issues

- We can later add “closest” sorting and a map view (kept lightweight).
- When backend exists, enforce Rule #1 by requiring AR/FR/EN fields before publish (for any content fields shown publicly).


---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see root `PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in root `PROMPT_LOG.md` under **2026-04-30**.
- This page’s **API / admin contracts** below are unchanged unless product scope changes.

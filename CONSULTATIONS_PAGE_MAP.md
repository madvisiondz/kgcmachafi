# Consultations page — architecture + service value (remote-first + local doctors)

This document is the **single source of truth** for the Consultations page rebuild.

## 1) Purpose (why this page matters)

The Consultations page is built for two high-value outcomes:

1) **Distant / remote consultation when possible** (phone/video)
2) **Local private doctors directory** (regional availability)

### Value to visitors (client-friendly)

- If the visitor is far from a city/hospital, remote consultation saves time and money.
- If the visitor needs a private doctor quickly, the directory helps them **find + call** fast.
- Clear filters (specialty + wilaya/city + remote-only) reduce confusion.
- “Verified” badges reduce the risk of wrong contact data.

### Value to society

- Less unnecessary travel and overcrowding at hospitals.
- Better access for remote wilayas (equity).
- Encourages a clean, admin-maintained directory of professionals.

---

## 2) UX design (legacy-inspired, improved)

Legacy inspiration:

- Specialty tiles (big icons) → choose specialty → see available doctors
- Booking form pattern

Rebuild improvements:

- Keep specialty tiles, but also keep a full filter bar (search + wilaya/city + remote-only).
- Emphasize the “remote-first when possible” value with a dedicated highlight strip.
- Cards are call-first and booking-ready.

---

## 3) Page architecture (new frontend)

### Route

- `/consultations`

### Files (UI-first stage)

- Page: `frontend/src/pages/ConsultationsPage.jsx`
- Mock data: `frontend/src/data/consultations.ts`
- Location lists (canonical, updated):
  - `frontend/src/data/Map.json`
  - `frontend/src/data/algeria-data.js` (exports `wilayas`, `getCommunes`)
- i18n keys: `frontend/src/i18n/translations.ts` under `consultations.*`

### Sections (top → bottom)

1. **Hero + stats** (results / remote / verified)
2. **Value highlight** (Remote consult + local doctors)
3. **Specialty tiles** (quick filter)
4. **Filters** (search, wilaya/city, specialty, remote-only, verified-only)
5. **Results grid** (doctor cards)
6. **Booking modal** (request capture UI-first; backend later)

---

## 4) Card contract (doctor listing)

Minimum fields:

- `id`
- `name`
- `specialtyKey`
- `wilayaCode`, `communeId`
- `clinicName?`
- `experienceYears`
- `rating`
- `price`, `currency`
- `phone`
- `supportsRemote`, `supportsInPerson`
- `isVerified`
- `isActive`

Primary actions:

- **Call** (`tel:`)
- **Book** (opens modal; later becomes API call)

---

## 5.1) Proposed public API endpoints (lightweight by default)

- `GET /api/consultations/specialties`
  - Returns: list of specialties (id/key, translations or keys, icon, sort order)

- `GET /api/consultations/doctors`
  - Query: `specialty?`, `wilayaCode?`, `communeId?`, `q?`, `remoteOnly?`, `verifiedOnly?`, `page?`, `limit?`
  - Returns: lightweight cards list (only fields needed for list + call + price)

- `POST /api/consultations/requests`
  - Body: `doctorId`, `fullName`, `phone`, `notes?`, `preferredMode?` (remote/in-person)
  - Returns: request id + status

- (Optional) `GET /api/consultations/availability?doctorId=...`
  - For future calendar slotting (not required in UI-first stage)

---

## 5.2) Admin Control Panel controls (to keep this page accurate)

### A) Specialties management

- Create/edit specialties (AR/FR/EN labels)
- Icon + color theme + sort order
- Publish/unpublish

### B) Doctors directory management

- Create/edit/archive doctors
- Required: name, specialty, wilaya/commune, phone
- Optional: clinic, supportsRemote, supportsInPerson, fee, rating, experience
- Verification workflow:
  - verified toggle + `verifiedAt` + `verifiedBy`
  - quick disable if phone wrong / doctor unavailable

### C) Consultation requests inbox

- View incoming booking requests
- Assign status: new / contacted / scheduled / closed
- Optional: export/reporting

---

## 6) Notes / open issues

- Real remote consultation requires policy + terms + privacy controls.
- In early launch, “booking” can be a request form that triggers admin follow-up (phone/WhatsApp).


---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see root `PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in root `PROMPT_LOG.md` under **2026-04-30**.
- This page’s **API / admin contracts** below are unchanged unless product scope changes.

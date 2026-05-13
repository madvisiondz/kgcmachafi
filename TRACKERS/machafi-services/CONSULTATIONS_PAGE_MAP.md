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

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

```sql
CREATE TABLE consultation_specialties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  icon_key VARCHAR(64) NULL,
  color_class VARCHAR(64) NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE consultation_specialty_i18n (
  specialty_id INT NOT NULL,
  lang CHAR(2) NOT NULL,
  label VARCHAR(255) NOT NULL,
  PRIMARY KEY (specialty_id, lang),
  FOREIGN KEY (specialty_id) REFERENCES consultation_specialties(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE consultation_doctors (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  specialty_id INT NOT NULL,
  wilaya_code VARCHAR(8) NOT NULL,
  commune_id VARCHAR(32) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  supports_remote TINYINT(1) NOT NULL DEFAULT 0,
  supports_in_person TINYINT(1) NOT NULL DEFAULT 0,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  FOREIGN KEY (specialty_id) REFERENCES consultation_specialties(id),
  KEY idx_loc (wilaya_code, commune_id, specialty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE consultation_doctor_i18n (
  doctor_id BIGINT NOT NULL,
  lang CHAR(2) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  clinic_name VARCHAR(255) NULL,
  notes TEXT NULL,
  PRIMARY KEY (doctor_id, lang),
  FOREIGN KEY (doctor_id) REFERENCES consultation_doctors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE consultation_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at DATETIME NOT NULL,
  doctor_id BIGINT NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  notes TEXT NULL,
  preferred_mode ENUM('remote','in_person','any') NULL,
  status ENUM('new','contacted','scheduled','closed') NOT NULL DEFAULT 'new',
  FOREIGN KEY (doctor_id) REFERENCES consultation_doctors(id),
  KEY idx_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/consultations/specialties` | **`api/public/consultations-specialties.php`** | Join specialty + i18n |
| GET | `/api/public/consultations/doctors` | **`api/public/consultations-doctors.php`** | Filter specialty, wilaya, commune, mode |
| POST | `/api/public/consultations/requests` | **`api/public/consultation-request.php`** | `INSERT INTO consultation_requests` |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/POST/PUT/DELETE | `/api/admin/consultations/specialties` | **`api/admin/consultations-specialties.php`** |
| GET/POST/PUT/DELETE | `/api/admin/consultations/doctors` | **`api/admin/consultations-doctors.php`** |
| GET/PATCH | `/api/admin/consultations/requests` | **`api/admin/consultation-requests.php`** |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

# Programs page — architecture + service value (schedule-first, UI-first)

This document is the **single source of truth** for the Programs (Schedule) page rebuild.

## 1) Purpose (why this page matters)

The Programs page helps visitors answer:

- “What health programs are available today?”
- “What time does a program start?”
- “Is it live right now or available as replay?”

This page is **content + schedule navigation**, not a directory like Pharmacies/Ambulances.

---

## 2) UX design (legacy-inspired, rebuild-safe)

### Visitor flow (simple, fast)

1) Pick **day**
2) Optionally pick a **category**
3) Search by **title / host / category / time**
4) Open the **Live** page to watch

### Why this layout works

- It is **low cognitive load** (one screen, quick decision).
- It supports AR/FR/EN cleanly (Rule #1: all visible text is i18n keyed).
- It stays integration-ready because the UI is built around a simple schedule contract.

---

## 3) Page architecture (new frontend)

### Route

- `/programs`

### Files (UI-first stage)

- Page: `frontend/src/pages/ProgramsPage.jsx`
- Mock schedule data: `frontend/src/data/programs.ts`
- i18n keys: `frontend/src/i18n/translations.ts` under `programs.*`

### Sections (top → bottom)

1. **Hero**
   - Title + subtitle + small stats pills (results / live / replay)
2. **Featured (legacy-inspired)**
   - “Now / Next” cards (computed client-side for UI-first; later backed by `/api/live/now`)
3. **Filters**
   - Search
   - Day navigation (prev/next + day chips)
   - Category select
4. **Schedule results**
   - Grid cards (image-style header + time badge + live/replay/category badges + host)
5. **Bottom CTA**
   - “Open Live” (routes to `/live`)

---

## 4) Card contract (what every schedule row needs)

Minimum fields per row:

- `id`
- `day` (sat..fri)
- `startTime` (`HH:mm`)
- `durationMin`
- `category`
- `isLive`
- `isReplayAvailable`
- `programKey` (or translated `title/desc` from backend later)
- `hostKey` (or translated `hostName` from backend later)

Primary action:

- **Watch** (today: routes to `/live`; later: can deep-link to a specific stream/program page)

---

## 5) Data architecture (future-proof, API wiring phase)

### A) Recommended split: “schedule” vs “program details”

Professionally, we keep schedule endpoints lightweight:

- Schedule list returns only what is needed to render the list.
- Details endpoint returns rich content (images, long descriptions, chapters, related links).

---

## 5.1) Proposed public API endpoints (lightweight by default)

- `GET /api/programs/schedule`
  - Query: `day?`, `category?`, `q?`, `timezone?` (optional), `limit?`
  - Returns: lightweight list of schedule rows
    - `id, day, startTime, durationMin, category, isLive, isReplayAvailable, programId (or programKey), hostName`

- (Optional) `GET /api/programs/:id`
  - Returns: program details (rich fields for a future details view)

- (Optional) `GET /api/live/now`
  - Returns: what is live right now + where to watch (later integration)

---

## 5.2) Admin Control Panel controls (to keep this page accurate)

### A) Programs library

- Create / edit / archive program
  - Titles + descriptions in AR/FR/EN (Rule #1)
  - Category
  - Cover image / thumbnail
  - Host attribution
  - Replay availability policy

### B) Schedule management

- Weekly schedule editor
  - day + start time + duration
  - attach program
  - “Live now” override (only for admins)
  - publish/unpublish schedule rows

### C) Trust/safety (recommended)

- Hard kill-switch (stop showing a row if broadcast is wrong)
- Last updated timestamps + audit trail (who changed schedule)

---

## 6) Notes / open issues

- `/live` route is referenced as the watch target; we can later replace this with:
  - a dedicated program watch page, or
  - deep links into the live player.
- If we store translated fields in DB, enforce Rule #1 by requiring all languages before publish.


---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

```sql
CREATE TABLE programs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  program_key VARCHAR(64) NOT NULL UNIQUE,
  category VARCHAR(64) NOT NULL,
  host_name VARCHAR(160) NULL,
  replay_available TINYINT(1) NOT NULL DEFAULT 0,
  cover_url VARCHAR(512) NULL,
  status ENUM('active','archived') NOT NULL DEFAULT 'active',
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE program_i18n (
  program_id BIGINT NOT NULL,
  lang CHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description_md TEXT NULL,
  PRIMARY KEY (program_id, lang),
  FOREIGN KEY (program_id) REFERENCES programs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE program_schedule_slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  program_id BIGINT NOT NULL,
  day_of_week TINYINT NOT NULL,
  start_time TIME NOT NULL,
  duration_min INT NOT NULL,
  is_live TINYINT(1) NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (program_id) REFERENCES programs(id),
  KEY idx_day (day_of_week, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/programs/schedule` | **`api/public/programs-schedule.php`** | Join `program_schedule_slots` + `programs` + `program_i18n` for `?lang=&day=&category=&q=&limit=` |
| GET | `/api/public/programs/:id` | **`api/public/program-detail.php`** | Single program + i18n |

### HTTP — admin

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET/POST/PUT/DELETE | `/api/admin/programs` | **`api/admin/programs.php`** | CRUD `programs` + `program_i18n` |
| GET/POST/PUT/DELETE | `/api/admin/programs/schedule` | **`api/admin/programs-schedule.php`** | CRUD `program_schedule_slots` |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

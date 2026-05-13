# Machafi TV — program schedule (`/tv/:edition/schedule`)

Single source of truth for **`TvSchedulePage`**: linear grid for the day (time, program title, live vs tape).

## 1) Purpose

- **EPG-style clarity**: visitors see when live bulletins vs taped programs air.
- **Cross-link** from **Live** page “today on channel” peek.

## 2) Route

- **`/tv/:edition/schedule`**

## 3) UX flow

1. Page title + subtitle (syncs with EPG when API exists).
2. **Table**: start–end time, localized program name, badge **Live** or **Tape**.

## 4) Data contracts

### UI-first

- **`frontend/src/data/tvMock.ts`** — `tvScheduleDay[]`: `id`, `start`, `end`, `title` (`TvLocalized`), `isLive?`.

### Target production

- Multi-day grid, timezone (`Africa/Algiers`), exceptions/holidays, last-minute overrides.

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/schedule?from=YYYY-MM-DD&days=7`
  - Returns slots with `live`, `title`, `description`, `thumbnail`.

### Admin

- `GET/POST/PUT/DELETE /api/admin/tv/schedule` — CRUD slots, recurrence, override flags.
- Optional import from traffic **ICS** or playout system.

## 6) i18n

- **`tvApp.*`** — `scheduleHeadline`, `scheduleSub`, table headers, live/tape badges.

## 7) File map

- `frontend/src/pages/tv/TvSchedulePage.jsx`
- `frontend/src/data/tvMock.ts` — `tvScheduleDay`, `pick`

## 8) Safeguards

- Times must be explicit about **timezone** in production to avoid cross-border confusion.

## 9) Changelog

- **2026-05-12**: Tracker added for schedule table + mock slots.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

```sql
CREATE TABLE tv_schedule_slots (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  edition CHAR(2) NOT NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_live TINYINT(1) NOT NULL DEFAULT 0,
  program_ref VARCHAR(128) NULL,
  KEY idx_ed_date (edition, slot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/tv/editions/{edition}/schedule` | **`api/public/tv-schedule.php`** | `WHERE edition=? AND slot_date BETWEEN ? AND ?` |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/POST/PUT/DELETE | `/api/admin/machafitv/editions/{edition}/schedule` | **`api/admin/tv-schedule.php`** |

---

## Documentation sync (2026-05-12)

- **`TV_LIVE_PAGE_MAP.md`** (schedule peek), **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

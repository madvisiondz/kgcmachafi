# Machafi TV — shell layout (edition chrome + breaking bar)

Single source of truth for **shared UI** around all **`/tv/:edition/*`** routes: masthead, edition switcher, primary nav, footer, and the top **breaking ticker**.

> Distinct from **`../machafi-services/LIVE_PAGE_MAP.md`**, which covers **Machafi Services** `/healthservices/live`.

## 1) Purpose

- **Edition trees**: Arabic, French, and English each get their own URL prefix (`/tv/ar`, `/tv/fr`, `/tv/en`) and synced UI language via `I18nProvider` + `setLanguage(edition)`.
- **Broadcast identity**: breaking strip, utility row (weather placeholder, newsletter/alerts buttons), Machafi TV masthead, rail nav to all TV subpages.
- **Trust & exit paths**: links back to **Machafi Services** and the **gateway**; footer columns for standards and contact.

## 2) Routes wrapped

All nested routes under **`/tv/:edition`** (invalid edition → redirect **`/tv/ar`**).

| Concern | Implementation |
|--------|----------------|
| Breaking ticker | `frontend/src/components/tv/TvBreakingBar.jsx` — `tvBreakingLines[edition]` |
| Shell chrome | `frontend/src/layouts/TvShellLayout.jsx` |
| Child pages | `<Outlet />` — see individual **`TV_*_PAGE_MAP.md`** trackers |

## 3) UX flow

1. User picks edition from gateway or switches **ar | fr | en** in the utility strip.
2. **TvBreakingBar** shows edition-specific ticker lines (CSS marquee).
3. Primary nav: Home, four topics, Activity, Desk, Live, Schedule; masthead links include **Search**.

## 4) Masthead + footer branding

- **Logo tile**: `Link` to edition home wraps **`/branding/machafi-tv-logo.png`** inside a rounded **`bg-slate-950`** panel (ring + shadow) on the white masthead; image scales from **`h-9` / `max-w-[5.5rem]`** on phones to **`md:h-11` / `max-w-[7.75rem]`** on desktop.
- **Copy row**: red **Live** pill (`t('tvApp.navLive')`) + edition prefix; **headline** `t('tvApp.homeHeadline')` remains a second link to home for hierarchy and accessibility.
- **Masthead layout**: stacked **`flex-col`** on very narrow widths, then **`sm:flex-row`** with quick actions aligned to the trailing edge (`dir` respects RTL for `ar`).
- **Footer**: first column shows the same **`machafi-tv-logo.png`** beside the “Machafi TV” word line + tagline on the dark footer slab.

## 5) Data contracts (UI-first)

- **`frontend/src/data/tvMock.ts`** — `tvBreakingLines` keyed by `TvEdition`.
- **Target production**: ticker copy and “on/off” state from CMS; optional geo-specific ticker variants.

## 6) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/ticker` — ordered lines, optional `severity`, `expires_at`.

### Admin (`/machafitv/admin` — future)

- `GET/PUT /api/admin/tv/ticker` — per-edition lines, scheduling, emergency override.
- `GET/PUT /api/admin/tv/shell-copy` — weather template, CTA labels (if not fully i18n).

Map to PHP: settings JSON or `tv_ticker_lines` table with `edition`, `sort`, `body`, `active`.

## 7) i18n (Rule #1)

Shell strings under **`tvApp.*`** (nav, footer, utility, masthead). Ticker **body** is currently **per-edition static arrays** in `tvMock.ts` (editorial voice per tree).

## 8) File map

- `frontend/src/layouts/TvShellLayout.jsx`
- `frontend/public/branding/machafi-tv-logo.png` — masthead + footer raster lockup
- `frontend/src/components/tv/TvBreakingBar.jsx`
- `frontend/src/routes/paths.ts` — `tvEditionPath`, `isTvEdition`, `TV_EDITIONS`
- `frontend/src/data/tvMock.ts` — `tvBreakingLines`
- `frontend/src/components/DocumentTitle.jsx` — segment keys for TV subpaths

## 9) Safeguards

- **Invalid `:edition`**: always redirect to a known edition; never render with unknown param.
- **RTL**: `dir="rtl"` for `ar` only; verify nav overflow scroll does not clip focus rings.
- **Ticker**: avoid seizure-inducing flash rates; marquee speed tunable.

## 10) Changelog

- **2026-05-12**: Tracker added; shell + breaking bar documented (matches current `TvShellLayout` / `TvBreakingBar`).
- **2026-05-14**: Masthead + footer use **`/branding/machafi-tv-logo.png`**; LIVE chip label sourced from `tvApp.navLive`; responsive masthead stack documented.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

```sql
CREATE TABLE tv_ticker_lines (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  edition CHAR(2) NOT NULL,
  body VARCHAR(512) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  active TINYINT(1) NOT NULL DEFAULT 1,
  emergency TINYINT(1) NOT NULL DEFAULT 0,
  KEY idx_ed (edition, active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Optional: **`tv_shell_copy`** table for rare non-i18n strings; prefer **`tvApp.*`** keys + DB only for ticker.

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/tv/editions/{edition}/ticker` | **`api/public/tv-ticker.php`** | `SELECT * FROM tv_ticker_lines WHERE edition=? AND active=1` |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/PUT | `/api/admin/machafitv/editions/{edition}/ticker` | **`api/admin/tv-ticker.php`** |

---

## Documentation sync (2026-05-12)

- Cross-route dataset handoff: **`../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`** (when extended for TV).
- **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`** — Machafi TV desk/activity/topics/search + shell work.


---

## 12) Implemented HTTP map (TV shell — 2026-05-14)

**Breaking ticker** and shell copy are still **`frontend/src/data/tvMock.ts`** (no `GET /api/public/tv/.../ticker` PHP yet). See **§6 Endpoint proposals** for the target contract.

**Machafi Services** JSON that **is** shipped: **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`**.

---

*Last updated: **2026-05-14** — TV shell map: masthead/footer Machafi TV logo tile, responsive layout, changelog; see gateway map for site-level strip.*

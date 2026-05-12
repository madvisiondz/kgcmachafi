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

## 4) Data contracts (UI-first)

- **`frontend/src/data/tvMock.ts`** — `tvBreakingLines` keyed by `TvEdition`.
- **Target production**: ticker copy and “on/off” state from CMS; optional geo-specific ticker variants.

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/ticker` — ordered lines, optional `severity`, `expires_at`.

### Admin (`/machafitv/admin` — future)

- `GET/PUT /api/admin/tv/ticker` — per-edition lines, scheduling, emergency override.
- `GET/PUT /api/admin/tv/shell-copy` — weather template, CTA labels (if not fully i18n).

Map to PHP: settings JSON or `tv_ticker_lines` table with `edition`, `sort`, `body`, `active`.

## 6) i18n (Rule #1)

Shell strings under **`tvApp.*`** (nav, footer, utility, masthead). Ticker **body** is currently **per-edition static arrays** in `tvMock.ts` (editorial voice per tree).

## 7) File map

- `frontend/src/layouts/TvShellLayout.jsx`
- `frontend/src/components/tv/TvBreakingBar.jsx`
- `frontend/src/routes/paths.ts` — `tvEditionPath`, `isTvEdition`, `TV_EDITIONS`
- `frontend/src/data/tvMock.ts` — `tvBreakingLines`
- `frontend/src/components/DocumentTitle.jsx` — segment keys for TV subpaths

## 8) Safeguards

- **Invalid `:edition`**: always redirect to a known edition; never render with unknown param.
- **RTL**: `dir="rtl"` for `ar` only; verify nav overflow scroll does not clip focus rings.
- **Ticker**: avoid seizure-inducing flash rates; marquee speed tunable.

## 9) Changelog

- **2026-05-12**: Tracker added; shell + breaking bar documented (matches current `TvShellLayout` / `TvBreakingBar`).

---

## Documentation sync (2026-05-12)

- Cross-route dataset handoff: **`../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`** (when extended for TV).
- **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`** — Machafi TV desk/activity/topics/search + shell work.

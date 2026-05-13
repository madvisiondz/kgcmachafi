# Gateway (`/`) — path choice (KGC Machafi Services vs KGC Machafi TV)

## Purpose

Single **entry page** after the user lands on the site root: choose **KGC Machafi Services** (health directory under `/healthservices/*`) or **KGC Machafi TV** (edition shell under `/tv/:edition/*`). This is **not** a Services or TV inner page, so it lives in its own tracker folder **`TRACKERS/gateway/`**.

**File location (repo):** `TRACKERS/gateway/GATEWAY_PAGE_MAP.md`

---

## Route

| Path | Component | Role |
|------|-----------|------|
| **`/`** | `frontend/src/pages/GatewayPage.jsx` | Two cards + TV edition `<select>` + optional “remember my choice” |

Catch-all in `App.tsx` sends unknown paths → **`/`** (back to gateway).

---

## Behaviour

1. **Navigation**
   - **Services card** → `Link` to `SERVICES_BASE` (`/healthservices`) via `frontend/src/routes/paths.ts`.
   - **TV card** → `Link` to `tvEditionPath(tvEdition, '/')` (e.g. `/tv/ar`).

2. **`localStorage` key `kgc_shell_choice`** (module constant `STORAGE_SHELL` in `GatewayPage.jsx`)
   - **`/` always renders the gateway** (no auto-redirect to Services or TV — dev and production both show the choice page first).
   - If a past value `tv_ar` / `tv_fr` / `tv_en` exists, it is used only to **default the TV edition** `<select>`; `services` is still stored when the user checks “remember” and opens Services (for a future UX hint if needed).
   - On outbound click with “remember” checked: `services` or `tv_{edition}` is written before navigation (`persistShell` on the links).

3. **i18n (Rule #1)**  
   All copy under `gateway.*` in **`frontend/src/i18n/translations.ts`** (EN / FR / AR): `pageTitle`, `title`, `subtitle`, `servicesTitle` / `servicesBody` / `servicesCta`, `tvTitle` / `tvBody` / `tvCta`, `editionLabel`, `editions.*`, `rememberLabel`.

4. **Document title**  
   `frontend/src/components/DocumentTitle.jsx` — for `pathname === '/'`, uses `t('gateway.pageTitle')` with brand prefix `MACHAFI - …`.

---

## Files

| File | Notes |
|------|--------|
| `frontend/src/pages/GatewayPage.jsx` | UI + optional `localStorage` (no redirect off `/`) |
| `frontend/src/routes/paths.ts` | `SERVICES_BASE`, `tvEditionPath`, `TV_BASE` |
| `frontend/src/App.tsx` | Route `/` → `GatewayPage` |
| `frontend/src/components/DocumentTitle.jsx` | Tab title on `/` |
| `frontend/src/i18n/translations.ts` | `gateway.*` strings |

---

## API / database

**None on this page** (pure client routing + optional `localStorage`). No PHP/MySQL contract here. If product later adds analytics or server-side “default shell” resolution, extend this tracker with a **“Full endpoint design”** section per **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

---

## Follow-ups (optional)

- Third path on gateway (e.g. another product line) → new route + i18n + update this map.
- A11y: announce edition change for screen readers on `<select>` if needed.

---

## Changelog

- **2026-05-11**: Initial tracker (gateway was previously only described in `WEBAPP_PAGES_OVERVIEW.md` / `WORKING_PLAN.md` without a dedicated `*_PAGE_MAP.md`).
- **2026-05-11**: Removed auto-redirect from `/` on saved shell choice — root always shows gateway; saved `tv_*` only defaults the edition dropdown.

---

## Documentation sync

- **`../../PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md`** — routing table + link to this file.
- **`../../PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md`** — site shells overview.

---

*Last updated: **2026-05-11** — gateway `/` map + repo doc sync (emerald UI, Vite 5173, visual evals).*

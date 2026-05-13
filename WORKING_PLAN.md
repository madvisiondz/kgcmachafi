# WORKING PLAN — MACHAFI path-sheet (`kgcmachafi`)

**Purpose:** One living document: **what is done** (checkboxes marked), **where it lives** (paths), and **what comes next** (unchecked). Treat this file as the **path-sheet** for the team: after each meaningful session, **update checkboxes and add rows** so reality stays aligned with the repo.

**Companion docs**

| Doc | Role |
|-----|------|
| `PROJECT-EXPLAINER/PROMPT_LOG.md` | Verbatim prompt archive (append-only log). |
| `PROJECT-EXPLAINER/PROJECT_STATUS.md` | Official **done / in progress / remaining** product state. |
| `NEXT_STEPS_PRODUCTION.md` | Expanded production roadmap (phases A–J); mirrored below as **unchecked path**. |

**Legend**

| Mark | Meaning |
|------|---------|
| `[x]` | Done (as of last plan sync). |
| `[ ]` | Not started / not satisfied yet. |
| `[/]` | In progress (partially done; note in text if needed). |

---

## 1. How dates line up

| Timeline | Meaning |
|----------|---------|
| **2026-04-28 → 2026-05-12** | Rebuild + docs work recorded in `PROJECT-EXPLAINER/PROMPT_LOG.md`. |
| **2026-05-11** | First **Git** commits on `main` (full repo backup, GitHub, `dist` + `node_modules` tracking). |
| **2026-05-12** | Gateway + `/healthservices` + `/tv/:edition` + `TRACKERS/` + `PROJECT-EXPLAINER/` reorg pushed to remote. |

**Rebuild “day one” (written):** 2026-04-28. **First GitHub backup day:** 2026-05-11.

---

## 2. Completed path — 2026-04-28 (foundation)

### 2.1 Repo & stack

- [x] Legacy UI was archived under `legacy/`, then **removed from the repo (2026-05-13)**; audit + deploy notes live in **`PROJECT-EXPLAINER/ARCHIVE_LEGACY_*.md`**.
- [x] Scaffold **`frontend/`** — Vite + React + Tailwind (`frontend/package.json`, `frontend/vite.config.ts`).
- [x] App bootstrap: `frontend/src/main.tsx` → `StrictMode` → `I18nProvider` → `BrowserRouter` → `App.tsx`.
- [x] Global styles: `frontend/src/index.css` (nav tokens, marquee, gradients, shimmer); `frontend/src/App.css` as needed.

### 2.2 i18n & direction

- [x] Central provider: `frontend/src/i18n/I18nProvider.tsx` (`kgc_lang` in `localStorage`).
- [x] Languages: **ar**, **fr**, **en**; default **ar** if unset.
- [x] RTL for Arabic, LTR otherwise; `document.documentElement.lang` + `dir` updated on change.
- [x] String catalog: `frontend/src/i18n/translations.ts` (large nested tree; dot keys for `t('…')`).

### 2.3 Header (four bars) — `frontend/src/components/layout/Header.jsx`

- [x] **News ticker** — `frontend/src/components/layout/NewsTicker.jsx` (marquee, glow; RTL-aware).
- [x] **Utility bar** — social + utility links + language **FR / AR / EN** toggles.
- [x] **Branding bar** — Machafi mark, partner strip (policy evolved later), **Live** + **Programs** CTAs.
- [x] **Green navbar** — legacy-aligned items + **PNG icons** from `frontend/public/nav-icons/` (Iconify MDI → rasterized via `sharp`).
- [x] **Live / Programs** branding buttons: `live-red.png`, `programs-blue.png` for contrast on white.

### 2.4 Footer

- [x] `frontend/src/components/layout/Footer.jsx` — legacy-style layout, i18n strings only.
- [x] **X** (Twitter successor) icon + `header.social.x` in header and footer.

### 2.5 Home (first slice)

- [x] Tracker: `TRACKERS/machafi-services/HOMEPAGE_MAP.md` (was root `HOMEPAGE_MAP.md` before 2026-05-12 move).
- [x] Page: `frontend/src/pages/HomePage.jsx` — hero, ads, stats, drama, news showcase, platform grid (UI-first).
- [x] Media: `frontend/public/home/hero.jpg`; drama iframe **YouTube** `SbDeMQ26RM8`; `home.hero.imageAlt` i18n.

### 2.6 Process & memory (foundation day)

- [x] `PROJECT-EXPLAINER/LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` — blockers + rebuild rules + changelog.
- [x] `PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md` — scroll-collapse spec + QA + changelog.
- [x] Scroll implementation in `Header.jsx` (hysteresis + `requestAnimationFrame`, grid `0fr`/`1fr` collapse); `NewsTicker` receives `collapsed`.
- [x] `canvases/project-workflow.canvas.tsx` — workflow + DAG (`computeDAGLayout`, edges `from`/`to`).
- [x] Canvas repair: single default export; no angle-bracket text breaking JSX; SDK-aligned DAG.
- [x] `PROJECT-EXPLAINER/PROJECT_STATUS.md` — expanded with advice / next steps discipline.
- [x] Standing agreement: **per-page `*_PAGE_MAP.md`** + project memory updates each session (precursor to **Rule #0**).

---

## 3. Completed path — 2026-04-29 (directory product + rules + deploy)

### 3.1 Library

- [x] `frontend/src/pages/LibraryPage.jsx` — hero, grid, read modal (PDF iframe), download/read CTAs.
- [x] `frontend/src/data/libraryBooks.ts`.
- [x] Route (pre-gateway): wired in `App.tsx`; later lives under **`/healthservices/library`** (see §6).
- [x] **Search bar** — filter by localized title, author, category; keys `library.searchPlaceholder`, `library.searchAriaLabel`, `library.clearSearch`, `library.noSearchResults`.
- [x] `TRACKERS/machafi-services/LIBRARY_PAGE_MAP.md`.

### 3.2 Location data (69 wilayas)

- [x] `frontend/src/data/Map.json` — canonical wilayas/communes.
- [x] `frontend/src/data/algeria-data.js` — adapter: `wilayas`, `getCommunes` (Map.json-driven).

### 3.3 Pharmacies

- [x] `frontend/src/pages/PharmaciesPage.jsx` — sticky filters, night-shift block, directory cards.
- [x] `frontend/src/data/pharmacies.ts` — static list + `weekStart` → `nightDutyIds` rotation.
- [x] Map at bottom (Leaflet): pins for filtered rows with coordinates; `pharmacies.*` map i18n.
- [x] Dropdowns use **canonical** wilaya/commune (not mock-only list).
- [x] `TRACKERS/machafi-services/PHARMACIES_PAGE_MAP.md` + Rule #0 compliance section.

### 3.4 Ambulances

- [x] `frontend/src/pages/AmbulancesPage.jsx` — emergency-first theme, top bar + chips.
- [x] `frontend/src/data/ambulances.ts` — coords added for map demos.
- [x] Map at bottom (filtered pins).
- [x] `TRACKERS/machafi-services/AMBULANCES_PAGE_MAP.md`.

### 3.5 Housing (accommodations)

- [x] `frontend/src/pages/AccommodationsPage.jsx` — care/support UX, “How it works”, trust/conditions.
- [x] `frontend/src/data/housing.ts`.
- [x] Map: bottom placement → then **map-first** (react-leaflet + popups + optional geolocation “nearest”).
- [x] `TRACKERS/machafi-services/HOUSING_PAGE_MAP.md` — includes proposed `/api/housing/map` style notes.

### 3.6 Programs

- [x] `frontend/src/pages/ProgramsPage.jsx` — schedule-first; day nav; featured **Now/Next**; grid cards; amber/orange theme accent.
- [x] `frontend/src/data/programs.ts`.
- [x] `TRACKERS/machafi-services/PROGRAMS_PAGE_MAP.md`.

### 3.7 Hospitals

- [x] `frontend/src/pages/HospitalsPage.jsx` — Algeria / abroad tabs, filters, verified badges, call/directions.
- [x] `frontend/src/data/hospitals.ts`.
- [x] `TRACKERS/machafi-services/HOSPITALS_PAGE_MAP.md`.

### 3.8 Consultations

- [x] `frontend/src/pages/ConsultationsPage.jsx` — remote-first value, specialty tiles, filters, booking modal.
- [x] `frontend/src/data/consultations.ts`.
- [x] `TRACKERS/machafi-services/CONSULTATIONS_PAGE_MAP.md`.

### 3.9 Services (directory “service”)

- [x] `frontend/src/pages/ServicesPage.jsx` — search, cards, modal, suppliers + exhibitions tabs.
- [x] `frontend/src/data/services.ts` — aligned with PHP-shaped settings concept.
- [x] `TRACKERS/machafi-services/SERVICES_PAGE_MAP.md`.

### 3.10 Donations

- [x] `frontend/src/pages/DonationsPage.jsx` — currency EUR/DZD/USD, campaigns, progress, form one-time/monthly, slider + presets.
- [x] `frontend/src/data/donations.ts`.
- [x] `TRACKERS/machafi-services/DONATIONS_PAGE_MAP.md` — deep endpoint + admin mapping.

### 3.11 News

- [x] `frontend/src/pages/NewsPage.jsx`, `frontend/src/pages/NewsDetailPage.jsx`.
- [x] `frontend/src/data/news.ts` — multilingual; shaped toward PHP `news_articles`.
- [x] `newsroom.*`, `nav.newsBadge` i18n; **News** nav glow/shimmer (`kgc-nav-shimmer` in `index.css`).
- [x] `TRACKERS/machafi-services/NEWS_PAGE_MAP.md`.

### 3.12 About + contact

- [x] `frontend/src/pages/AboutContactPage.jsx` — `#about` press masthead, Komas partner block, `#contact` + enquiry form UI.
- [x] `about.*` i18n; `DocumentTitle` maps about → `header.whoWeAre`.
- [x] Header utility links → `/healthservices/about#about` (via `servicesPath` post-gateway; originally `/about#…`).
- [x] `TRACKERS/machafi-services/ABOUT_PAGE_MAP.md`.

### 3.13 Live

- [x] `frontend/src/pages/LivePage.jsx` — live vs recorded UX, player stage, up-next, theater toggle, share, fullscreen.
- [x] `frontend/src/data/live.ts`.
- [x] `live.*` i18n; `DocumentTitle` → `common.watchLive`.
- [x] `TRACKERS/machafi-services/LIVE_PAGE_MAP.md`.

### 3.14 Chrome: title + favicon + logo

- [x] `frontend/src/components/DocumentTitle.jsx` — `MACHAFI - <page>` from route + language.
- [x] `frontend/public/machafi-logo.svg`, `frontend/public/favicon.svg`.
- [x] `frontend/scripts/extract-favicon-png.mjs` → `frontend/public/favicon.png`; `frontend/index.html` prefers PNG + apple-touch-icon.

### 3.15 Navigation order (product decisions)

- [x] **Consultations** immediately after **Home**.
- [x] **Library** between **Housing** (`/accommodations`) and **Programs**.
- [x] **Hospitals** between **Library** and **Pharmacies**.

### 3.16 Home product contract

- [x] `TRACKERS/machafi-services/HOMEPAGE_MAP.md` — Home = **actuality feed hub**; endpoints spelled out (`GET /api/site/home-feed`, optional featured/pin APIs); admin moderation notes.

### 3.17 Rules

- [x] **Rule #0** — codified in `PROJECT-EXPLAINER/HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `PROJECT-EXPLAINER/LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `PROJECT-EXPLAINER/project-explainer.md`; sync `PROJECT_STATUS`, trackers, explainer after work.
- [x] **Rule #1** — `PROJECT-EXPLAINER/RULE_1_LANGUAGE_SWITCHING.md`; all visible UI via `t()`; static UI still keyed; linked from other memory files.

### 3.18 Page tracker standard

- [x] Trackers include **proposed public endpoints** + **admin control panel** sections (batch update Pharmacies, Library, Homepage trackers + guidance docs).

### 3.19 Header no-underlap

- [x] `Header.jsx` exposes `--app-header-height` via `ResizeObserver`.
- [x] `App.tsx` spacer uses `var(--app-header-height)` so content does not slide under fixed header.
- [x] `PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md` documents requirement.

### 3.20 Deploy bundle

- [x] `npm run build` → `frontend/dist/`.
- [x] Copy to `ready-to-deploy/public_html/` preserving `public_html/api/` + `.htaccess`; `ready-to-deploy/README.txt` updated.

### 3.21 Diagrams (architecture)

- [x] `canvases/frontend-block-diagram.canvas.tsx` + `PROJECT-EXPLAINER/FRONTEND_BLOCK_DIAGRAM.md` (Mermaid: runtime + future `services/` boundary).

### 3.22 README & canvas pointers

- [x] Root `README.md` — run instructions + links into project memory (evolved on 2026-05-12).
- [x] Workflow canvas: repo `canvases/project-workflow.canvas.tsx`; README documents managed path on original dev machine (update if your Cursor project path differs).

---

## 4. Completed path — 2026-04-30 (polish + handoff + tooling)

- [x] **Main nav gradient** — `:root` `--kgc-nav-*`, `.kgc-main-nav-gradient`, sheen/shadows in `frontend/src/index.css`; applied in `Header.jsx`.
- [x] **Partner logos** — experiments reverted; **`hidden lg:block`** (≥1024px only); tablet/mobile hide documented in `PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md`.
- [x] **`PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`** — each route → value + recommended DB/CMS columns (post-move path; was root then relocated).
- [x] **Data Builder** — implemented then **removed** (no route, no `dataBuilder*` i18n, no `localStorage` key dependency).
- [x] **Canvas TS** — `canvases/cursor-canvas.d.ts`, `canvases/tsconfig.json`; `tsc -p canvases` clean; `frontend-block-diagram` + `project-workflow` typings aligned.
- [x] **Dev server** — documented Vite port fallback (5173 → 5174) in log.
- [x] **Tracker footers** — “Documentation sync (2026-04-30)” on service `*_PAGE_MAP.md` files pointing to dataset reference + prompt log.
- [x] **Prompt log / status / dataset changelog** — batch sync entry in `PROMPT_LOG.md`.

---

## 5. Completed path — 2026-05-11 (Git + mirror policy)

Commits on `main` (chronological):

- [x] `63808677` — Initial commit: full backup (`frontend/`, `api/`, old `legacy/` tree since removed, `deploy/`, `ready-to-deploy/`, `uploads/`, docs…).
- [x] `13ca0df6` — Document GitHub backup + `gh repo create` workflow.
- [x] `08548d2f` — README: published GitHub link.
- [x] `4f57d2dd` — Track `frontend/dist` for deployment backup.
- [x] `2f06190c` — `frontend/.gitignore`: stop ignoring `dist/`.
- [x] `f8ed20fd` — Track `node_modules` (full clone parity policy — large repo).

**Cross-machine:** clone / pull / push workflows (no automatic agent push unless asked).

---

## 6. Completed path — 2026-05-12 (platform shell + gateway + TV + doc tree)

### 6.1 Documentation tree

- [x] Folder `PROJECT-EXPLAINER/` — moved root specs (kept root `README.md` only for GitHub landing).
- [x] Updated internal links: `TRACKERS/**` → `../../PROJECT-EXPLAINER/…`; `PROJECT-EXPLAINER/**` → `../TRACKERS/…`.
- [x] `PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md` — **https://kgc-machafi.net/** → gateway → Services vs TV editions + live + newsroom concept.
- [x] `PROJECT-EXPLAINER/ROUTING_SWITCH_BRIEFING.md` — URL map, touched files, deploy checklist.
- [x] `PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md` — route table for current `App.tsx`.
- [x] `README.md` — memory list + layout section + root **`WORKING_PLAN.md`** / **`NEXT_STEPS_PRODUCTION.md`** pointers (as added later).

### 6.2 `TRACKERS/` layout

- [x] `TRACKERS/machafi-services/` — 13 service maps (home, about, library, service, donations, news, live, pharmacies, ambulances, accommodations, programs, hospitals, consultations).
- [x] `TRACKERS/machafi-tv/` — 9 TV maps (`TV_SHELL`, `TV_HOME`, `TV_LIVE`, `TV_SCHEDULE`, `TV_ARTICLE`, `TV_DESK`, `TV_ACTIVITY`, `TV_TOPIC`, `TV_SEARCH`).
- [x] `TRACKERS/machafi-services-admin/HEALTHSERVICES_ADMIN_PANEL_MAP.md`.
- [x] `TRACKERS/machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`.
- [x] `TRACKERS/gateway/GATEWAY_PAGE_MAP.md` — **`/`** gateway (Services vs TV + optional `localStorage` remember).

### 6.3 Routing & shells — `frontend/src/App.tsx`

- [x] **`/`** → `frontend/src/pages/GatewayPage.jsx` — choose Services vs TV; optional `localStorage` `kgc_shell_choice` (persists choice / defaults TV edition only — **no** auto-redirect from `/`).
- [x] **`/healthservices`** → `frontend/src/layouts/ServicesLayout.jsx` — nested child routes.
- [x] **`/healthservices/admin/*`** → `frontend/src/pages/admin/HealthServicesAdminPage.jsx` (placeholder shell).
- [x] **`/machafitv/admin/*`** → `frontend/src/pages/admin/MachafiTvAdminPage.jsx` (placeholder shell).
- [x] **`/tv/:edition`** (`ar`|`fr`|`en`) → `frontend/src/layouts/TvShellLayout.jsx` + nested routes:
  - [x] index → `frontend/src/pages/tv/TvHomePage.jsx`
  - [x] `desk` → `TvDeskPage.jsx`
  - [x] `activity` → `TvActivityPage.jsx`
  - [x] `topics/:topicId` → `TvTopicPage.jsx`
  - [x] `search` → `TvSearchPage.jsx` (`?q=`)
  - [x] `live` → `TvLivePage.jsx`
  - [x] `schedule` → `TvSchedulePage.jsx`
  - [x] `article/:slug` → `TvArticlePage.jsx`
- [x] **Legacy redirects** — `/about`, `/library`, `/service`, `/donations`, `/news`, `/news/:id`, `/live`, `/pharmacies`, `/ambulances`, `/accommodations`, `/programs`, `/hospitals`, `/consultations` → `/healthservices/...` (see `App.tsx` for exact map).
- [x] **Catch-all** — unknown paths → `/` (gateway).

### 6.4 Path helpers

- [x] `frontend/src/routes/paths.ts` — `SERVICES_BASE`, `TV_BASE`, `TV_EDITIONS`, `isTvEdition`, `servicesPath()`, `tvEditionPath()`.

### 6.5 TV UI & data

- [x] `frontend/src/data/tvMock.ts` — mock feeds, wire, schedule, articles.
- [x] `frontend/src/components/tv/TvBreakingBar.jsx`, `TvStoryCard.jsx`.
- [x] `frontend/src/tv/useTvEdition.ts` — edition from URL params.
- [x] i18n buckets: `gateway.*`, `tvApp.*`, `admin.*` (AR/FR/EN) in `translations.ts`.

### 6.6 Chrome updates for switch

- [x] `Header.jsx`, `Footer.jsx`, internal `Link`s use `servicesPath()` where appropriate.
- [x] `DocumentTitle.jsx` — gateway, services, TV, admin titles.
- [x] `npm run build` green after routing switch + TV expansion.

### 6.7 Git on 2026-05-12

- [x] Docs commit: platform shell, Rule #0 sync across memory set.
- [x] Feature commit: TV editions, gateway, trackers, `PROJECT-EXPLAINER` reorg, admin maps, README.

---

## 7. Inventory — `frontend/src` (authoritative file list)

**Entry & shell**

- [x] `main.tsx` (includes **`RootErrorBoundary`** below router)
- [x] `App.tsx`
- [x] `config.ts` — `VITE_*` / `appConfig` (API base, site URL, TV flags)
- [x] `vite-env.d.ts` — `ImportMetaEnv` augmentation
- [x] `index.css`, `App.css` (legacy small), `declarations.d.ts`

**Layouts**

- [x] `layouts/ServicesLayout.jsx`
- [x] `layouts/TvShellLayout.jsx`

**i18n**

- [x] `i18n/I18nProvider.tsx`
- [x] `i18n/translations.ts`

**Routes**

- [x] `routes/paths.ts`

**Components**

- [x] `components/RootErrorBoundary.tsx`
- [x] `components/DocumentTitle.jsx`
- [x] `components/layout/Header.jsx`
- [x] `components/layout/Footer.jsx`
- [x] `components/layout/NewsTicker.jsx`
- [x] `components/tv/TvBreakingBar.jsx`
- [x] `components/tv/TvStoryCard.jsx`

**Pages — Services (under `/healthservices`)**

- [x] `pages/GatewayPage.jsx`
- [x] `pages/HomePage.jsx`
- [x] `pages/AboutContactPage.jsx`
- [x] `pages/LibraryPage.jsx`
- [x] `pages/ServicesPage.jsx`
- [x] `pages/DonationsPage.jsx`
- [x] `pages/NewsPage.jsx`, `pages/NewsDetailPage.jsx`
- [x] `pages/LivePage.jsx`
- [x] `pages/PharmaciesPage.jsx`
- [x] `pages/AmbulancesPage.jsx`
- [x] `pages/AccommodationsPage.jsx`
- [x] `pages/ProgramsPage.jsx`
- [x] `pages/HospitalsPage.jsx`
- [x] `pages/ConsultationsPage.jsx`

**Pages — TV**

- [x] `pages/tv/TvHomePage.jsx`, `TvLivePage.jsx`, `TvSchedulePage.jsx`, `TvArticlePage.jsx`
- [x] `pages/tv/TvDeskPage.jsx`, `TvActivityPage.jsx`, `TvTopicPage.jsx`, `TvSearchPage.jsx`

**Pages — Admin placeholders**

- [x] `pages/admin/HealthServicesAdminPage.jsx`
- [x] `pages/admin/MachafiTvAdminPage.jsx`

**Data mocks**

- [x] `data/algeria-data.js`, `data/Map.json`
- [x] `data/libraryBooks.ts`, `data/pharmacies.ts`, `data/ambulances.ts`, `data/housing.ts`
- [x] `data/programs.ts`, `data/hospitals.ts`, `data/consultations.ts`, `data/services.ts`
- [x] `data/donations.ts`, `data/news.ts`, `data/live.ts`
- [x] `data/tvMock.ts`

**TV hooks**

- [x] `tv/useTvEdition.ts`

---

## 8. Inventory — backend & ops (present in repo)

- [x] **`api/`** — PHP public + admin endpoints (`api/public/*.php`, `api/admin/*.php`, `api/.htaccess`) — **not yet fully consumed by new SPA**.
- [x] **`ready-to-deploy/public_html/`** — hosting-oriented bundle + preserved `api/` + `.htaccess`.
- [x] **`deploy/`** — additional deploy assets (review per host).
- [x] **`uploads/`** — media/assets.
- [x] **Former `legacy/` tree** — removed 2026-05-13; trackers point at **`frontend/`** + archived markdown in **`PROJECT-EXPLAINER/`**.

---

## 9. In progress & gaps (from `PROJECT_STATUS.md` — keep updated)

Mark here when you close items; mirror changes in `PROJECT-EXPLAINER/PROJECT_STATUS.md`.

- [/] **Pixel-perfect alignment** — icon baselines, spacing, buttons vs legacy screenshots (needs target screenshots or URL).
- [/] **Home full legacy parity** — micro-layout, optional reveal animations (isolated), **Health-in-Drama embed policy** (autoplay / privacy / consent).

---

## 10. Forward path — production & product (unchecked path-sheet)

Check boxes as you complete them. **Source of truth for execution status:** `NEXT_STEPS_PRODUCTION.md` (Sprint table + phases). Sync this section when that file changes.

### Phase A — Ship confidence

- [x] **A1** — Environments + `VITE_*` documented in **`frontend/.env.example`**.
- [x] **A2** — Central **`frontend/src/config.ts`** (+ **`frontend/src/vite-env.d.ts`** typings).
- [x] **A3** — **`RootErrorBoundary`** in **`frontend/src/components/RootErrorBoundary.tsx`**, wired in **`frontend/src/main.tsx`**; i18n `common.errorTitle` / `errorBody` / `reloadPage` / `backToGateway` (AR/FR/EN).
- [x] **A4** — Loading / empty / error list UX on **News**, **Pharmacies**, **Hospitals**, **Ambulances** (`ListGridSkeleton`, `ListFetchErrorBanner`, `useBootstrapList`, `common.list*` i18n).
- [x] **A5** — Smoke checklist template: **`PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md`** (fill Pass per release).
- [x] **A6** — **`frontend/.gitignore`** ignores `.env` / `.env.local` (secrets not committed).

### Phase B — UX & visual perfection

- [ ] **B1** — Run full `PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md` QA on iOS Safari + Android Chrome + desktop.
- [ ] **B2** — Close Home parity + drama embed policy.
- [ ] **B3** — Design tokens doc (spacing, radii, type) OR screenshot-driven pixel pass.
- [ ] **B4** — Extract **UI kit**: Card, Button, Input, Select, FilterPanel (from Hospitals pattern).
- [ ] **B5** — Arabic stress pass: truncation, modals, long titles in nav/cards.

### Phase C — Frontend architecture

- [x] **C1** — `frontend/src/services/` — `http.ts` (`apiUrl`, `getJson`, `ApiError`), `news.ts`, `pharmacies.ts`, **`hospitals.ts`**, `index.ts`; timeouts on fetch.
- [ ] **C2** — Auth model documented + implemented for admins (cookies vs bearer; CSRF if cookies).
- [ ] **C3** — `React.lazy` for TV + admin routes; verify loading boundaries.
- [ ] **C4** — Type API DTOs at boundary; tighten hooks typing.
- [ ] **C5** — CI uses `npm ci`; plan **untrack `node_modules`** or Git LFS for pipeline health.

### Phase D — Machafi Services + PHP API

- [/] **D1** — Read-only wiring: **`VITE_NEWS_API`** → news list + detail; **`VITE_PHARMACIES_API`** → pharmacies; **`VITE_HOSPITALS_API`** → Algeria + international hospital lists; next: **public settings** (if endpoint) or another directory + contract typing.
- [ ] **D2** — Real **`/healthservices/admin`** UI + RBAC per `TRACKERS/machafi-services-admin/HEALTHSERVICES_ADMIN_PANEL_MAP.md`.
- [ ] **D3** — Rate limits + server validation on writes (forms, donations intents, comments).
- [ ] **D4** — CORS + `SameSite` if SPA and API differ by origin.
- [ ] **D5** — Versioned DB migrations (not only manual SQL).

### Phase E — Machafi TV (broadcast)

- [ ] **E1** — HLS player (e.g. hls.js) + Safari vs Chrome test matrix.
- [ ] **E2** — Replace `tvMock` with API per edition + caching policy.
- [ ] **E3** — TV admin/CMS + auth per `TRACKERS/machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`.
- [ ] **E4** — CDN + cache headers for segments + thumbnails.

### Phase F — Security & compliance

- [ ] **F1** — CSP (report-only first), frame-ancestors / HSTS as appropriate.
- [ ] **F2** — Secrets out of repo; server proxy for private keys.
- [ ] **F3** — `npm audit` + Dependabot/Renovate.
- [ ] **F4** — Anti-spam for public forms (honeypot/CAPTCHA) + server validation.
- [ ] **F5** — Cookie consent + privacy links if analytics/marketing cookies.

### Phase G — Performance & resilience

- [ ] **G1** — Responsive images (`srcset`, modern formats) for hero + logos.
- [ ] **G2** — Bundle size budget in CI; monitor `vite build` output.
- [ ] **G3** — Cache policy review for HTML vs hashed assets.
- [ ] **G4** — `/health` or static uptime ping.
- [ ] **G5** — Service worker **only** if product has a clear offline/update strategy.

### Phase H — SEO & sharing

- [ ] **H1** — Per-route meta + OG; evaluate SSR/prerender if SEO is critical.
- [ ] **H2** — `robots.txt` + `sitemap.xml` (exclude admin).
- [ ] **H3** — Canonical URLs favor `/healthservices/...`.

### Phase I — Testing & automation

- [x] **I1** — CI: **`/.github/workflows/frontend-ci.yml`** — `npm ci`, `npm run lint`, `npm run build` on `frontend/**` pushes/PRs.
- [ ] **I2** — Playwright/Cypress minimal E2E (gateway → Services; gateway → TV; language persistence).
- [ ] **I3** — Optional visual regression (header + home).
- [ ] **I4** — API contract tests when JSON stable.

### Phase J — Observability

- [ ] **J1** — Client logging + correlation id to API.
- [ ] **J2** — Web Vitals / RUM.
- [ ] **J3** — Sentry (or equivalent) + source maps from CI.
- [ ] **J4** — Runbooks: rollback, secret rotation, emergency stream disable.

### Product “remaining” (from status doc — track here)

- [ ] **Machafi TV** — real rails/feeds, HLS, journalist workflows beyond mocks.
- [ ] **Health Services admin** — real panel + `/api/admin` RBAC.
- [ ] **Reusable layouts** — shared page shells / grid patterns beyond current layouts.
- [ ] **`services/` client** — aligns with `PROJECT-EXPLAINER/FRONTEND_BLOCK_DIAGRAM.md` future boundary.

---

## 11. Standing rules (do not “complete”; obey every session)

- [x] **Rule #0** — After work: update `PROMPT_LOG.md`, `PROJECT_STATUS.md`, active tracker(s), relevant `PROJECT-EXPLAINER/*`, canvas if needed.
- [x] **Rule #1** — No mixed-language UI; all strings via `t()`; Services vs TV edition rules as documented in `RULE_1_LANGUAGE_SWITCHING.md`.
- [x] **Trackers** — Each surface has a map under `TRACKERS/…` with endpoints + admin controls sections when applicable.

---

## 12. Sources for this path-sheet

- `PROJECT-EXPLAINER/PROMPT_LOG.md`
- `PROJECT-EXPLAINER/PROJECT_STATUS.md`
- `git log --reverse --format="%h|%ad|%s" --date=short`
- `frontend/src/App.tsx` (routing source of truth)
- `NEXT_STEPS_PRODUCTION.md` (forward phases A–J)

---

*Last structural expansion: path-sheet mode (detailed inventory + forward checklists). Amend sections 9–10 first when status changes.*


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

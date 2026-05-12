# Project Status (done vs remaining)

This file is kept current throughout the rebuild.

## Done
- **Legacy archived**: previous frontend moved under `legacy/` (kept intact).
- **New app scaffolded**: `frontend/` (Vite + React).
- **Tailwind added**: minimal Tailwind setup for pixel-aligned UI work.
- **Root repo README**: `README.md` links the canonical docs + run steps.
- **Central i18n**:
  - Languages: **AR / FR / EN**
  - Direction switching: **RTL/LTR** updates `document.documentElement.dir` and `lang`
- **Header rebuilt (UI only)**:
  - Top ticker bar (blue) with marquee + glowing badge
  - Dark top bar (social + links + language toggle)
  - Branding bar (logos) with **Live** + **Programs** exclusive buttons (desktop + mobile)
  - Green navbar with full legacy nav items + **PNG icons for every item**
  - Nav order tweak: **Consultations** placed right after Home; **Library** placed between Housing and Programs (per product navigation decision)
  - Branding bar includes **Live** + **Programs** emphasis buttons (desktop + mobile)
  - Branding-bar buttons use colored icon variants for visibility on white background (`live-red.png`, `programs-blue.png`)
  - **Scroll collapse** (legacy-aligned): on scroll down, **ticker + utility bar** collapse away; **branding bar** shrinks (smaller logo, partner logos hidden, Live/Programs icon-only on desktop); tracked in `HEADER_SCROLL_ANIMATION.md`
  - **No underlap fix**: header is fixed + app reserves `--app-header-height` so page content never scrolls underneath during collapse/expand.
- **Project workflow canvas**:
  - Managed (renders in Cursor Canvas preview): `C:\Users\Oasis-Mall\.cursor\projects\d-komas-kgcmachafiprodhome1-kgcmachafi\canvases\project-workflow.canvas.tsx`
  - Repo copy (versioned): `canvases/project-workflow.canvas.tsx`
  - Includes a **system block diagram** (DAG) for the current UI architecture.
  - **Canvas repair**: consolidated to one module, fixed DAG `from`/`to` API usage, and removed invalid JSX text that looked like HTML tags.
- **Footer rebuilt (UI only)**:
  - Legacy footer layout cloned into `frontend/src/components/layout/Footer.jsx` with i18n-only text.
- **Branding update**:
  - Replaced Twitter with **X** icon in header + footer social links.
- **Legacy lessons documented**:
  - `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` captures why the old stack blocked UI work (e.g. hospitals without backend datasets) and the rebuild rules we follow to avoid repeating it.
- **Home page mapping + scaffold (UI-only)**:
  - Created `HOMEPAGE_MAP.md` (legacy section map + rebuild plan).
  - Added `frontend/src/pages/HomePage.jsx` (hero + ads + stats + drama + news showcase + platform sections grid) with i18n-only text.
  - **Routing**: `HomePage` is the `/` route; app wrapped in `BrowserRouter` (`frontend/src/main.tsx`).
  - Future: Home becomes the **actuality feed hub** (“what’s new” across pages) with a lightweight `GET /api/site/home-feed` contract (documented in `HOMEPAGE_MAP.md`).
  - Imported legacy Home media:
    - Hero image stored locally at `frontend/public/home/hero.jpg`
    - Health-in-Drama iframe uses legacy embed URL (`SbDeMQ26RM8`)
- **Hospitals page (UI-only, directory-first, legacy-inspired)**:
  - Tracker: `HOSPITALS_PAGE_MAP.md`.
  - Page: `frontend/src/pages/HospitalsPage.jsx`; mock data: `frontend/src/data/hospitals.ts`; route **`/hospitals`**.
  - UX: two tabs (Algeria / abroad) + client-friendly filters + grid cards with call/directions + verified badges.
  - Location lists: canonical `Map.json` + `algeria-data.js` (69 wilayas).
  - i18n: `hospitals.*` keys (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).
- **Library page (UI-only, legacy-aligned)**:
  - Tracker: `LIBRARY_PAGE_MAP.md`.
  - Page: `frontend/src/pages/LibraryPage.jsx`; mock data: `frontend/src/data/libraryBooks.ts`; route **`/library`**.
  - **Search**: bar filters cards by title, author, and category in the **active UI language** (client-side only).
  - No API: replace mocks with a `services/` layer when wiring backend.
- **Pharmacies page (UI-only, legacy-inspired directory)**:
  - Tracker: `PHARMACIES_PAGE_MAP.md`.
  - Page: `frontend/src/pages/PharmaciesPage.jsx`; mock data: `frontend/src/data/pharmacies.ts`; route **`/pharmacies`**.
  - Location lists (canonical, updated): `frontend/src/data/Map.json` + adapter `frontend/src/data/algeria-data.js` (wilayas + `getCommunes`) used for the wilaya/city filters.
  - UX: sticky filter panel + “Night shift this week” highlight + directory cards + **map at bottom** for filtered results.
  - Data model: **80% static directory cards** + **20% weekly night-shift rotation** (`weekStart` → assignments).
  - Build verified: `npm run build` OK.
- **Ambulances page (UI-only, emergency-first directory)**:
  - Tracker: `AMBULANCES_PAGE_MAP.md`.
  - Page: `frontend/src/pages/AmbulancesPage.jsx`; mock data: `frontend/src/data/ambulances.ts`; route **`/ambulances`**.
  - UX variation: top filter bar + quick chips (not a Pharmacies clone); cards optimized for “Call now”; **map at bottom** for filtered results.
  - Location lists: canonical `Map.json` + `algeria-data.js`.
  - Build verified: `npm run build` OK.
- **Housing page (UI-only, care/support directory)**:
  - Tracker: `HOUSING_PAGE_MAP.md`.
  - Page: `frontend/src/pages/AccommodationsPage.jsx`; mock data: `frontend/src/data/housing.ts`; route **`/accommodations`**.
  - UX variation: filters + call-first cards + “How it works” strip + verified emphasis + conditions (companion/long stay) + **map at bottom** (pins + popups + optional nearest) for filtered results.
  - Location lists: canonical `Map.json` + `algeria-data.js` (69 wilayas).
  - Build verified: `npm run build` OK.

- **Programs page (UI-only, schedule-first content navigation)**:
  - Tracker: `PROGRAMS_PAGE_MAP.md`.
  - Page: `frontend/src/pages/ProgramsPage.jsx`; mock data: `frontend/src/data/programs.ts`; route **`/programs`**.
  - UX: legacy-inspired polish — **Featured “Now/Next”** block + day navigation (prev/next + chips) + schedule **grid cards** with live/replay badges; “Open Live” CTA.
  - i18n: `programs.*` keys (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).

- **Consultations page (UI-only, remote-first + local private doctors)**:
  - Tracker: `CONSULTATIONS_PAGE_MAP.md`.
  - Page: `frontend/src/pages/ConsultationsPage.jsx`; mock data: `frontend/src/data/consultations.ts`; route **`/consultations`**.
  - UX: value highlight (remote + local) + specialty tiles + filters (wilaya/city/remote/verified) + cards with call + booking modal.
  - Location lists: canonical `Map.json` + `algeria-data.js` (69 wilayas).
  - i18n: `consultations.*` keys (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).

- **Services page (UI-first, backend-ready)**:
  - Tracker: `SERVICES_PAGE_MAP.md`.
  - Page: `frontend/src/pages/ServicesPage.jsx`; mock data: `frontend/src/data/services.ts`; route **`/service`**.
  - UX: search + service cards + details modal (call-first), “How it works”, contact CTA.
  - Rich sections (legacy-inspired): Medical suppliers directory + Health exhibitions agenda (tabs).
  - Backend readiness: matches PHP schema (`services` + `settings.services_content`) and proposes a dedicated `GET /api/public/services?lang=...` endpoint (Rule #0).
  - i18n: `services.*` keys (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).

- **Donations page (UI-first, scalable for future payments)**:
  - Tracker: `DONATIONS_PAGE_MAP.md`.
  - Page: `frontend/src/pages/DonationsPage.jsx`; mock data: `frontend/src/data/donations.ts`; route **`/donations`**.
  - UX: currency selector, impact stats, campaigns with progress, and a donation form (one-time vs monthly) with slider + presets + trust row.
  - Backend readiness: proposes lightweight endpoints (`GET /api/public/donations`, `POST /api/public/donations/intents`) and admin campaign/intent management.
  - i18n: `donations.*` keys (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).

- **About + Contact (`/about`)**:
  - Tracker: `ABOUT_PAGE_MAP.md`.
  - Page: `frontend/src/pages/AboutContactPage.jsx`; route **`/about`**; utility bar links **`/about#about`** and **`/about#contact`** in `Header.jsx`.
  - Content: press-style “who we are” (Machafi mission + Komas Group partner framing informed by public business listings) + contact cards (footer phone/email/address) + enquiry form (UI demo).
  - i18n: `about.*` (AR/FR/EN) in `translations.ts`; tab title uses `header.whoWeAre` via `DocumentTitle.jsx`.

- **Live / “Watch live” page (UI-first, broadcast-grade)**:
  - Tracker: `LIVE_PAGE_MAP.md`.
  - Page: `frontend/src/pages/LivePage.jsx`; mock data: `frontend/src/data/live.ts`; route **`/live`** (header/footer CTAs already pointed here).
  - UX: legacy-inspired **live vs recorded** tabs, poster + play stage, HTML5 video with native controls, theater width toggle, share, fullscreen, “up next” sidebar, offline slate, links to Programs + Library.
  - i18n: `live.*` (AR/FR/EN) in `frontend/src/i18n/translations.ts`; tab title uses `common.watchLive` via `DocumentTitle.jsx` (Rule #1).

- **News (“newsroom”) page (UI-first, journalist/CMS-ready)**:
  - Tracker: `NEWS_PAGE_MAP.md`.
  - Pages: `frontend/src/pages/NewsPage.jsx`, `frontend/src/pages/NewsDetailPage.jsx`; mock data: `frontend/src/data/news.ts`; routes **`/news`** + **`/news/:id`**.
  - UX: featured/breaking module, wire/source + topic filters, search, desk standards sidebar, “routes to action”, detail page with share/print + disclaimer.
  - Backend readiness: aligns with existing `api/public/news.php` + `api/admin/news.php` and proposes expanded public/admin contracts for multilingual + moderation workflows.
  - i18n: `newsroom.*` + `nav.newsBadge` keys (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).
  - Header: `frontend/src/components/layout/Header.jsx` gives the **News** navbar item a distinctive badge + glow + shimmer treatment (desktop + mobile menu).
- **Deploy bundle refreshed**:
  - Frontend build output: `frontend/dist/`
  - Hosting-ready folder: `ready-to-deploy/public_html/` (contains latest `index.html`, `assets/`, and static folders; preserves `api/` + `.htaccess`)

- **2026-04-30 — documentation + site chrome**:
  - **`PAGE_DATASET_REFERENCE.md`**: single handoff doc for **every route** → brief value + recommended dataset columns (no backend change).
  - **`PROMPT_LOG.md`**: appended **2026-04-30** entries (canvas TS, Canvas open instructions, Data Builder lifecycle, dataset doc, dev server, **main nav gradient** `.kgc-main-nav-gradient`, partner-logo **revert** to legacy).
  - **Data Builder**: was implemented then **removed** (no `/data-builder` route; no `dataBuilderEntries` code paths).
  - **Header nav (desktop)**: green bar uses **custom gradient** in `frontend/src/index.css` (`--kgc-nav-a`…`--kgc-nav-f` tunable to final brand hex). **Partner logos** in branding bar: **`hidden lg:block`** only (desktop **≥1024px**); **mobile + tablet** hide partners — see `HEADER_SCROLL_ANIMATION.md` (“Branding bar — partner logos”) for tablet regression note.
  - **Page trackers**: each `*_PAGE_MAP.md` gets a short “Documentation sync (2026-04-30)” footer pointing to `PAGE_DATASET_REFERENCE.md` + `PROMPT_LOG.md`.

- **2026-05-12 — platform architecture (documentation, Rule #0)**:
  - **`PLATFORM_SHELL_LAYOUT.md`**: single master map for **[https://kgc-machafi.net/](https://kgc-machafi.net/)** — planned **gateway** (Services vs Machafi TV), current **Machafi Services** tree (`frontend/` + all `App.tsx` routes), planned **Machafi TV** shell with **edition routes** `/tv/ar`, `/tv/fr`, `/tv/en` (separate editorial worlds, not only translation), **live simulcast** slice (encoder → HLS → player), **journalist / newsroom panel** (desk-scoped), cross-links.
  - **Product split (planned)**: Services news (`/news`) stays the **development-track** newsroom for the directory app; **Machafi TV** is the **broadcast-style** news product with its own queues and routes.
  - **Code**: gateway and TV app **not implemented yet** — docs only until development starts.

## In progress
- **Pixel-perfect alignment tuning**:
  - Final micro-adjustments for icon baseline, spacing, and button sizing to match legacy screenshots exactly (if you provide a screenshot/target URL, we can match 1:1 faster).
- **Home page rebuild (full legacy parity, UI-only)**:
  - Pixel-tuning + optional reveal/scroll animations (kept isolated).
  - Decide final embed behavior (autoplay/controls/cookies) for the Health-in-Drama player.

## Remaining (planned)
- **Rebuild remaining UI pages** (UI only, no backend): (none — primary directory pages + Services + Donations + News are now scaffolded in the new frontend).
- **Domain gateway (product)**: first visit at `kgc-machafi.net` → user chooses **Machafi Services** vs **Machafi TV** (then optional “remember shell”).
- **Machafi TV (new shell, not started in code)**: BBC/CNN-style healthcare media UX; routes under **`/tv/ar`**, **`/tv/fr`**, **`/tv/en`**; web **live TV** (simulcast) + streaming pipeline; **journalist submit/review** panel per desk/edition; APIs/admin contracts TBD when implementation starts (add `TV_*` trackers then).
- **Reusable UI kit**: Card, buttons, inputs, selects, filter panels (clean separation UI vs data).
- **Layouts**: page shells, containers, responsive grid patterns.

## Advice (always kept current)
- **Next recommended focus (UI-only)**:
  - Validate the **header scroll collapse** on desktop + mobile (thresholds, no flicker): see `HEADER_SCROLL_ANIMATION.md` QA checklist.
  - Validate Home and **Library** (`/library`) in **AR (RTL)** and **FR/EN (LTR)**.
  - After that, optionally reintroduce `Reveal` animations (but keep them isolated so they can’t break language switching again).
  - Then build `pages/Hospitals` as the reference directory page (filters + cards + empty states), and clone patterns across the other directory pages.
- **Consistency rules to enforce early**:
  - Every visible string must go through i18n keys (AR/FR/EN).
  - RTL/LTR must be verified on every layout change (alignment, spacing, icons).
  - Keep components “dumb”: no data fetching, no business rules inside components.
- **Quality gate before moving to the next page**:
  - Desktop + mobile layouts verified.
  - Text overflow handled (Arabic tends to be longer/denser).
  - Icons aligned baseline with text in nav + buttons.

- **Backup / “sync” advice**:
  - Put the whole repo under **git** and push to a remote (GitHub/GitLab) so your progress is safely synced.
  - Treat these as the project’s memory: `PROMPT_LOG.md`, `PROJECT_STATUS.md`, `PLATFORM_SHELL_LAYOUT.md`, `HOMEPAGE_MAP.md`, `LIBRARY_PAGE_MAP.md`, `HEADER_SCROLL_ANIMATION.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, and the workflow canvas.

## How to view the workflow canvas
- Managed canvas (renders in Canvas preview):
  - `C:\Users\Oasis-Mall\.cursor\projects\d-komas-kgcmachafiprodhome1-kgcmachafi\canvases\project-workflow.canvas.tsx`
- Repo copy (versioned):
  - `canvases/project-workflow.canvas.tsx`

## Header structure (4 bars)
- **News ticker**: `frontend/src/components/layout/NewsTicker.jsx`
- **Utility bar**: top dark bar section inside `frontend/src/components/layout/Header.jsx`
- **Branding bar**: logo row section inside `frontend/src/components/layout/Header.jsx`
- **Nav bar**: green navbar section inside `frontend/src/components/layout/Header.jsx`

## Tracking rules (agreement)
- After every user prompt:
  - Update `PROMPT_LOG.md` with a brief “what I did”.
  - Update `PROJECT_STATUS.md` with “done / in progress / remaining”.
  - Update the active markdown memory set whenever relevant: `PLATFORM_SHELL_LAYOUT.md` (gateway / Machafi TV), `HOMEPAGE_MAP.md`, `HEADER_SCROLL_ANIMATION.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `project-explainer.md`, and future page-specific docs.
  - Update `HOMEPAGE_MAP.md` when homepage structure or section ownership changes.
  - Update `HEADER_SCROLL_ANIMATION.md` when sticky header collapse thresholds, layout, or behavior changes.
  - Update `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` when we confirm a new legacy constraint or change a rebuild principle.
  - When a new page is created, create a dedicated page tracker `.md` file for it and keep that file updated whenever we work on that page.
  - Each page tracker must include: **proposed public API endpoints** + **proposed Admin Control Panel controls** (so UI work stays integration-ready).
  - Keep the workflow canvas aligned with current status.
  - Add more detail over time (decisions, file paths, and the immediate next action).

## Rule #1 (non-negotiable): language switching completeness
- When language switches (AR/FR/EN), **every single visible text must switch** (no mixed-language UI).
- Strategy + enforcement notes live in `RULE_1_LANGUAGE_SWITCHING.md`.

### Machafi TV (planned) — edition routes vs Services i18n

- **Machafi Services** (`frontend/`): one route set; language toggle updates **`t()`** and content fields — Rule #1 as today.
- **Machafi TV** (planned): **three editorial editions** as **URL prefixes** (`/tv/ar`, `/tv/fr`, `/tv/en`). “Changing language” **navigates** to another edition’s pages and **content set** (pros per language), not only string swaps on the same URL. Within each edition, **all** visible text still follows Rule #1 for that edition’s UI language.


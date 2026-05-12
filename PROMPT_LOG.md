# Prompt Log (brief actions per prompt)

This file is updated after every user prompt.

## 2026-05-12

### Platform architecture — gateway, Machafi TV, editions, live broadcast (mapping)
- **Prompt**: Explain product update — domain entry chooses Services vs TV; TV = news-style site + journalist panel; three **routes per language** (separate editorial desks, not only translation); broadcast channel going live → web live stack.
- **What I did**: Captured maps in chat; created / consolidated **`PLATFORM_SHELL_LAYOUT.md`** (master tree: `https://kgc-machafi.net/` → gateway → Services SPA + TV shell with `/tv/ar|fr|en`, live player slice, newsroom panel); set **production domain** in that doc.

### Git push policy
- **Prompt**: Does the agent push automatically to the repo?
- **What I did**: Clarified — **no automatic push**; user asks when they want `commit` / `push`.

### Rule #0 — sync project memory after rules question
- **Prompt**: Did you read the project rules? If yes, update everything.
- **What I did**: Updated **`README.md`** (production domain + links to `PLATFORM_SHELL_LAYOUT.md`, `WEBAPP_PAGES_OVERVIEW.md`), **`PROJECT_STATUS.md`** (2026-05-12 done block, remaining gateway/TV items, Machafi TV vs Rule #1 note, memory list), **`project-explainer.md`**, **`RULE_1_LANGUAGE_SWITCHING.md`** (Machafi TV edition exception), **`HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`** (Rule #0 file list), **`LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`** (changelog), **`WEBAPP_PAGES_OVERVIEW.md`** (scope note); appended this **`PROMPT_LOG.md`** section.

## 2026-04-30

### Canvas TypeScript: `frontend-block-diagram.canvas.tsx` (+IDE errors)
- **Prompt**: Fix TypeScript / IDE errors on the frontend block diagram canvas (e.g. `cursor/canvas`, JSX).
- **What I did**: Added `canvases/cursor-canvas.d.ts` (ambient module for `cursor/canvas` + layout types); added `canvases/tsconfig.json` (`react-jsx`, include `*.tsx`/`*.d.ts`); aligned canvas code with SDK (`Code`, `computeDAGLayout`, etc.); extended typings where needed for `project-workflow.canvas.tsx`; verified `tsc -p canvases` / IDE clean.

### Cursor: how to open a Canvas preview
- **Prompt**: How to open the canvas / which button.
- **What I did**: Documented official flows: **Open Canvas** in Command Palette (View), chat **card** after agent creates a canvas, Agents window tab; noted canvases are often under `~/.cursor/projects/<workspace>/canvases/` for IDE detection.

### Data Builder (`/data-builder`) — built, explained, removed
- **Prompt**: Build `DataBuilderPage.jsx` (questionnaire, `localStorage` `dataBuilderEntries`, i18n, export/clear, modular schema). Later: **no server restore** — where does shared deploy data live? **Revoke** the builder.
- **What I did**:
  - Implemented page + `dataBuilderSchema.js` + `dataBuilderStorage.js`, route `/data-builder`, `nav.dataBuilder`, full **en/fr/ar** `dataBuilder.*` strings; storage was **browser `localStorage` only** (not on server).
  - **Removed** route, page, helpers, and all `dataBuilder` i18n; clarified team must **export JSON per browser** unless a backend is added later.

### Dataset reference doc (all routes → columns)
- **Prompt**: One final `.md`: each page — brief content/value + recommended dataset columns.
- **What I did**: Added root `PAGE_DATASET_REFERENCE.md` listing every `App.tsx` route with purpose and suggested DB/CMS fields (aligned with existing mocks).

### Dev server: run web view
- **Prompt**: Run the web view.
- **What I did**: Started `npm run dev` (Vite); when port **5173** was busy, dev server bound to **5174** (local + LAN URLs in terminal).

### Site chrome: logo-aligned nav gradient (+ optional header experiments)
- **Prompt**: Nav bar color as an attractive gradient matching the main logo chart; earlier asks for textured branding bar / sharper header-footer (before partner-logo revert).
- **What I did**:
  - **`index.css`**: `:root` `--kgc-nav-*` tokens + `.kgc-main-nav-gradient` (multi-stop emerald/teal gradient, inset highlight, `::after` sheen) + shadows.
  - **`Header.jsx`**: Desktop nav bar uses `kgc-main-nav-gradient` (replaces plain Tailwind gradient); container `relative z-[1]` so links sit above overlay.
  - Partner-logo-specific layout/shell experiments were **fully reverted** per user request (see next entry).

### Partner logos (mobile/tablet) — attempts then full revert
- **Prompts**: Partner logos embarrassing on mobile; offer asset sizes; **revert everything done on partner logos**.
- **What I did**:
  - **Reverted** partner block to **legacy behavior**: `hidden sm:block` (visible from `sm` ~640px+), compact-scroll `w-0 opacity-0 overflow-hidden`, original Machafi width classes, plain `drop-shadow-sm` images — **no** extra shells, no mobile-only duplicate row, no always-on-mobile partners.
  - **Recommended asset sizes** (if user supplies new files later): header strip ~**120–160px wide @1x** (or **240–320px @2x**) per partner mark; **max content height ~32–40px**; **SVG or transparent PNG**, sRGB.

### Prompt log + trackers sync (this prompt)
- **Prompt**: Update every user prompt + briefing into `PROMPT_LOG.md`; fix any gaps in page trackers.
- **What I did**: Appended this **2026-04-30** section; updated `PROJECT_STATUS.md` and `PAGE_DATASET_REFERENCE.md` changelog; appended a short **Documentation sync (2026-04-30)** note to each `*_PAGE_MAP.md` pointing at `PAGE_DATASET_REFERENCE.md` + `PROMPT_LOG.md`.

### Partner logos off on tablet; bug recorded in header tracker
- **Prompt**: Remove partner logos from tablet view (broken UI: image icon beside alt/filename text); save the bug in the header tracker.
- **What I did**: `Header.jsx` — partner blocks **`hidden sm:block` → `hidden lg:block`** (partners only from **1024px+**; mobile + tablet: Machafi + actions only). **`HEADER_SCROLL_ANIMATION.md`**: new section **Branding bar — partner logos (breakpoint policy)** + changelog row describing the tablet regression and decision.

## 2026-04-29

### Frontend block diagram (Canvas + Mermaid)
- **Prompt**: create a block diagram for this frontend.
- **What I did**:
  - Added interactive DAG canvas `canvases/frontend-block-diagram.canvas.tsx` (same file copied to Cursor project `canvases/` for IDE preview).
  - Added `FRONTEND_BLOCK_DIAGRAM.md` with Mermaid diagrams (runtime stack + future `services/` boundary).

### About + Contact page (`/about`): press-style copy + Komas research + utility bar wiring
- **Prompt**: utility bar “Who we are” + “Contact us” → real destinations; web research Komas Group; professional glorious press tone; contact on same page as about.
- **What I did**:
  - Added `frontend/src/pages/AboutContactPage.jsx` with `#about` press masthead + Komas partner block + `#contact` section (footer contact fields + enquiry form UI).
  - Added i18n `about.*` (AR/FR/EN); `DocumentTitle` maps `/about` → `header.whoWeAre`.
  - Updated `Header.jsx` utility links from `#` to `/about#about` and `/about#contact`; wired route in `App.tsx`.
  - Created `ABOUT_PAGE_MAP.md`; updated `PROJECT_STATUS.md` + `PROMPT_LOG.md`.
  - Verified `npm run build` OK.

### Live page (`/live`): legacy-inspired + professional stream UI + tracker
- **Prompt**: “Watch live” page from deep search of legacy + professional live app patterns.
- **What I did**:
  - Implemented `frontend/src/pages/LivePage.jsx` + `frontend/src/data/live.ts` (player config, VOD cards, up-next queue).
  - Added i18n `live.*` (AR/FR/EN) and wired route **`/live`** in `App.tsx`; `DocumentTitle.jsx` maps `/live` → `common.watchLive`.
  - Created `LIVE_PAGE_MAP.md` (value, UX, data contracts, endpoint proposals, safeguards).
  - Updated `PROJECT_STATUS.md` + `PROMPT_LOG.md`; verified `npm run build` OK.

### Favicon: Machafi glow PNG
- **Prompt**: use `favicon machafi glow.png` as the favicon.
- **What I did**: Copied Cursor-saved `favicon_machafi_glow.png` → `frontend/public/favicon.png` (replaces previous PNG).

### Favicon: official Machafi PNG asset
- **Prompt**: use provided `favicon machafi.png` as the new favicon.
- **What I did**: Copied Cursor-saved asset to `frontend/public/favicon.png` (replacing prior extract); `index.html` already links PNG icons only (removed SVG `rel="icon"` fallback).

### Favicon: tab icon not showing (PNG fallback)
- **Prompt**: logo did not appear in the browser tab; ensure it does.
- **What I did**:
  - Root cause: `favicon.svg` is mostly a **raster embedded as a giant base64 `data:` URL**; many browsers ignore or fail that for `rel="icon"`.
  - Added `frontend/scripts/extract-favicon-png.mjs` and generated **`frontend/public/favicon.png`** (~280KB) from the embedded PNG.
  - Updated `frontend/index.html` to prefer **`/favicon.png`** (`16` + `32` + `apple-touch-icon`) before the SVG fallback.
  - Verified `npm run build` OK.

### Branding: new Machafi logo + tab title + favicon
- **Prompt**: replace old main logo with `new machafi logo.svg`; show logo in browser tab with name `MACHAFI - (selected page)`.
- **What I did**:
  - Copied root `new machafi logo.svg` → `frontend/public/machafi-logo.svg` and `frontend/public/favicon.svg`.
  - Header main mark now uses `/machafi-logo.svg` (`frontend/src/components/layout/Header.jsx`).
  - Added `frontend/src/components/DocumentTitle.jsx` + wired in `App.tsx` to set `document.title` to `MACHAFI - <i18n page name>` on route/language change; `meta.pageTitle.newsArticle` for `/news/:id`.
  - `frontend/index.html` default `<title>MACHAFI</title>` (favicon already `/favicon.svg`).
  - Verified `npm run build` OK.

### News (“newsroom”) page: legacy-inspired + journalist-first + premium navbar emphasis + tracker
- **Prompt**: build the News page for a news-driven production company; make it future-ready for professional journalists; enhance UI/value; make the navbar News item uniquely attractive (“glow/shine”); follow Rule #0 and Rule #1
- **What I did**:
  - Implemented `frontend/src/pages/NewsPage.jsx` + `frontend/src/pages/NewsDetailPage.jsx` with `/news` and `/news/:id` routes in `frontend/src/App.tsx`.
  - Added mock multilingual dataset `frontend/src/data/news.ts` shaped for CMS expansion while aligning to existing PHP `news_articles` fields.
  - Added i18n keys `newsroom.*` + `nav.newsBadge` (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).
  - Enhanced `frontend/src/components/layout/Header.jsx` News nav styling (badge + glow + shimmer) + mobile menu emphasis; added `kgc-nav-shimmer` in `frontend/src/index.css`.
  - Created `NEWS_PAGE_MAP.md` with editorial workflow + detailed endpoint proposals + `.php` mapping notes (Rule #0).
  - Updated `PROJECT_STATUS.md` and `PROMPT_LOG.md`.
  - Verified `npm run build` OK.

### Donations page: legacy-inspired rebuild + scalable future payments + tracker
- **Prompt**: proceed with next page (Donations); same inspiration of legacy; keep design but make it user-friendly, attractive, and future scalable; follow Rule #0 and Rule #1
- **What I did**:
  - Implemented `frontend/src/pages/DonationsPage.jsx` (UI-first, trust-first):
    - Currency selector (EUR/DZD/USD), impact stats, and campaign cards with progress bars.
    - Donation form: one-time vs monthly, amount slider + quick presets, secure-payment trust row.
  - Added backend-ready mock dataset `frontend/src/data/donations.ts` with translated campaign content (AR/FR/EN).
  - Added i18n keys `donations.*` (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).
  - Wired route **`/donations`** in `frontend/src/App.tsx`.
  - Created `DONATIONS_PAGE_MAP.md` including community value, admin controls, and proposed endpoints (Rule #0).
  - Expanded `DONATIONS_PAGE_MAP.md` to match other trackers: legacy pointers, detailed endpoint proposals (REST + `.php` mappings), request/response examples, data contracts, i18n list, safeguards, changelog.
  - Verified `npm run build` OK.

### Services page: legacy-inspired rebuild + backend-ready tracker
- **Prompt**: proceed with the rest of pages, start with Services; inspire content from legacy; make it ready for backend + admin control panel; propose possible endpoints; follow Rule #0 and Rule #1
- **What I did**:
  - Implemented `frontend/src/pages/ServicesPage.jsx`:
    - Services directory with **search**, **service cards**, and a **details modal** (call-first UX).
    - Added “How it works” steps + contact CTA to footer.
    - Added two legacy-inspired rich sections: **Medical suppliers directory** + **Health exhibitions agenda** (tabs).
  - Added backend-ready mock dataset `frontend/src/data/services.ts` shaped like the existing PHP schema (`services` + `settings.services_content`) with AR/FR/EN fields.
  - Added i18n keys `services.*` (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).
  - Wired route **`/service`** in `frontend/src/App.tsx` (nav already points there).
  - Created `SERVICES_PAGE_MAP.md` including visitor/community value, UI map, proposed public endpoints, and admin controls (Rule #0).
  - Verified build will be run after changes (tsc + vite).

### Consultations page: legacy-inspired clone + remote-first value + tracker
- **Prompt**: consultations page should be inspired/almost cloned from legacy, but improved; highlight value: distant consultation if possible + private doctors in region; explain in tracker; follow Rule #0 & Rule #1
- **What I did**:
  - Implemented `frontend/src/pages/ConsultationsPage.jsx`:
    - Value highlight (remote consult + local private doctors)
    - Specialty tiles (legacy-inspired) + filters (wilaya/city/specialty/remote/verified)
    - Doctor cards with call + booking request modal (UI-first)
  - Added mock data `frontend/src/data/consultations.ts` (specialties + doctors; remote/in-person flags).
  - Added i18n keys `consultations.*` for AR/FR/EN in `frontend/src/i18n/translations.ts` (Rule #1).
  - Wired route **`/consultations`** in `frontend/src/App.tsx`.
  - Created `CONSULTATIONS_PAGE_MAP.md` including visitor/society value + endpoints + admin controls (Rule #0).
  - Verified `npm run build` OK.

### Header nav: swap Library and Consultations + place Library between Housing and Programs
- **Prompt**: switch places in nav-bar between consultation page and library page; library must be between housing and programs
- **What I did**:
  - Updated `frontend/src/components/layout/Header.jsx` nav order:
    - **Consultations** moved to the old **Library** position (right after Home).
    - **Library** moved to be between **Housing** (`/accommodations`) and **Programs** (`/programs`).
  - Verified `npm run build` OK.

### Hospitals page: nav order + legacy-inspired clone + tracker
- **Prompt**: move Hospitals between Library and Pharmacies in nav order; create Hospitals page cloned from legacy with slight theme variation; document value to visitors and society in tracker; follow Rule #0 and Rule #1
- **What I did**:
  - Reordered header nav in `frontend/src/components/layout/Header.jsx` so **Hospitals** is between **Library** and **Pharmacies**.
  - Implemented `frontend/src/pages/HospitalsPage.jsx` (UI-first, client-friendly):
    - Two tabs: **Algeria** and **Treatment abroad**
    - Filters per tab + grid cards with verified badge + call/directions (when coords exist)
  - Added mock data `frontend/src/data/hospitals.ts`.
  - Added i18n keys `hospitals.*` for AR/FR/EN in `frontend/src/i18n/translations.ts` (Rule #1).
  - Wired route **`/hospitals`** in `frontend/src/App.tsx`.
  - Created `HOSPITALS_PAGE_MAP.md` including visitor/society value + endpoints + admin controls (Rule #0).

### Home page: make it the actuality feed hub (endpoints certainty)
- **Prompt**: in `HOMEPAGE_MAP.md` endpoints section, remove uncertainty; make Home an actuality feed for existing pages (“what’s new”)
- **What I did**:
  - Updated `HOMEPAGE_MAP.md` to define Home as the **platform-wide actuality feed hub**.
  - Replaced the old “maybe aggregation” endpoints with a lightweight feed contract:
    - `GET /api/site/home-feed`
    - `GET /api/site/home-featured` (optional)
    - `GET /api/site/featured?...` (optional per-section pinning)
  - Updated Admin controls in `HOMEPAGE_MAP.md` to include pin/hide/section rules moderation.
  - Synced intent into `project-explainer.md` (Home as “what’s new” hub).

### Programs page: legacy-inspired clone + tracker
- **Prompt**: clone the programs page and write the details on the tracker
- **What I did**:
  - Implemented `frontend/src/pages/ProgramsPage.jsx` (schedule-first UX: day + category + search + cards + live/replay badges).
  - Added mock schedule data `frontend/src/data/programs.ts`.
  - Added full i18n keys `programs.*` (AR/FR/EN) in `frontend/src/i18n/translations.ts` (Rule #1).
  - Wired route **`/programs`** in `frontend/src/App.tsx` (nav link already existed in header).
  - Created `PROGRAMS_PAGE_MAP.md` including architecture, lightweight endpoints, and admin control panel controls (Rule #0).

### Programs page: bring more legacy inspiration (theme + featured)
- **Prompt**: proceed with programs page; keep the nice filters; bring inspiration from legacy with slight theme change; respect Rule #0 and Rule #1
- **What I did**:
  - Updated `frontend/src/pages/ProgramsPage.jsx` with legacy-inspired structure:
    - Added **Featured “Now / Next”** cards (UI-first computation for today).
    - Replaced day dropdown with **prev/next navigation + day chips**.
    - Switched schedule list to a **grid** with image-style card headers.
    - Applied a warm **amber/orange** theme variant (distinct but consistent).
  - Added new i18n keys needed for these UI elements under `programs.*` (AR/FR/EN).
  - Updated `PROGRAMS_PAGE_MAP.md` section map accordingly.
  - Verified `npm run build` OK.

### Housing: move map to bottom (after filters/results)
- **Prompt**: let the housing also have the map at the bottom
- **What I did**:
  - Refactored `frontend/src/pages/AccommodationsPage.jsx` so the map is **at the bottom**, after filters + results.
  - Map still uses **filtered results only** and renders pins only when coordinates exist (same robustness).
  - Updated `HOUSING_PAGE_MAP.md`, `PROJECT_STATUS.md`, and `project-explainer.md`.
  - Verified `npm run build` OK.

### Pharmacies + Ambulances: add maps at bottom (lightweight endpoints decision)
- **Prompt**: endpoints should be lightweight for all pages; add maps to Pharmacies and Ambulances; map must be at the bottom after filters
- **What I did**:
  - Added **map sections at the bottom** of `frontend/src/pages/PharmaciesPage.jsx` and `frontend/src/pages/AmbulancesPage.jsx`.
  - Maps render **pins only for the filtered results** (after selection filters are applied) and only when coordinates exist.
  - Added coordinates to `frontend/src/data/ambulances.ts` mocks (so map works immediately).
  - Added i18n keys for map UI under `pharmacies.*` and `ambulances.*` (Rule #1).
  - Updated `PHARMACIES_PAGE_MAP.md` and `AMBULANCES_PAGE_MAP.md` with optional lightweight `/map` endpoints + admin coordinate requirements.
  - Verified `npm run build` OK.
  - Updated Rule #0 docs: `PROJECT_STATUS.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `project-explainer.md`.

### Housing: make map the main idea
- **Prompt**: main idea is a map for patient housing (بيوت إيواء، فنادق، مراقد). volunteer part is marketing
- **What I did**:
  - Updated Housing page to be **map-first** using `react-leaflet` + `leaflet` (pins + popups + call/directions + optional nearest via geolocation).
  - Added coordinates to mock listings and added missing i18n keys for the map UI (Rule #1).
  - Updated `HOUSING_PAGE_MAP.md` to reflect “map is the product” + added a proposed `/api/housing/map` endpoint.
  - Verified `npm run build` OK.
  - Updated Rule #0 docs: `PROJECT_STATUS.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `project-explainer.md`.

### Housing page (Accommodations) — legacy-clone with volunteer value
- **Prompt**: proceed with next page (housing), clone from legacy, keep 69 wilayas, add slight variations according to visitor value (volunteer housing)
- **What I did**:
  - Implemented `frontend/src/pages/AccommodationsPage.jsx` with care/support theme + “How it works” value strip + trust badges and conditions.
  - Wired route **`/accommodations`** in `frontend/src/App.tsx`.
  - Added mock data `frontend/src/data/housing.ts`.
  - Added i18n keys `housing.*` for AR/FR/EN in `frontend/src/i18n/translations.ts` (Rule #1).
  - Uses canonical location lists (`Map.json` + `algeria-data.js`) so wilaya/city reflect the updated dataset.
  - Created `HOUSING_PAGE_MAP.md` including architecture, **proposed endpoints**, and **admin control panel controls** (Rule #0).
  - Verified `npm run build` OK.
  - Updated Rule #0 docs: `PROJECT_STATUS.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `project-explainer.md`.

### Rule #1 clarification: static UI still uses i18n keys
- **Prompt**: “UI part can be hardcoded since static; data-driven via admin?”
- **What I did**:
  - Clarified Rule #1 in `RULE_1_LANGUAGE_SWITCHING.md`: even “static UI” must use `t('...')` keys (no JSX literals); admin controls the data-driven content translations.

### Rule #1: language switching must switch all text
- **Prompt**: make this like rule #1 after rule #0; create an .md file seeking best solution so every text switches with language (UI/UX/DB/admin/plugins)
- **What I did**:
  - Created `RULE_1_LANGUAGE_SWITCHING.md` as the source of truth for the strategy (UI + UX + DB schema options + admin panel workflows + enforcement automation).
  - Linked Rule #1 into `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `PROJECT_STATUS.md`, and `project-explainer.md`.

### Deploy version (hosting bundle)
- **Prompt**: give me a deploy version
- **What I did**:
  - Refreshed the production build in `frontend/dist/`.
  - Copied `frontend/dist/*` into `ready-to-deploy/public_html/` (overwriting `index.html`, `assets/`, and static folders like `nav-icons/` and `home/`) while keeping `public_html/api/` and `.htaccess`.
  - Updated `ready-to-deploy/README.txt` with the correct build/copy instructions.
  - Updated Rule #0 docs: `PROJECT_STATUS.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `project-explainer.md`.

### Ambulances page (UI-first, emergency-first variation)
- **Prompt**: do the same for ambulances page; make it count; slight theme/navigation variation
- **What I did**:
  - Implemented `frontend/src/pages/AmbulancesPage.jsx` with an emergency-first theme (red/neutral) and a different navigation pattern (top filter bar + quick chips).
  - Added mock listings `frontend/src/data/ambulances.ts`.
  - Wired route **`/ambulances`** in `frontend/src/App.tsx`.
  - Added i18n keys `ambulances.*` for AR/FR/EN in `frontend/src/i18n/translations.ts`.
  - Created `AMBULANCES_PAGE_MAP.md` including: architecture, **proposed endpoints**, and **admin control panel controls**.
  - Verified `npm run build` OK.
  - Updated Rule #0 docs: `PROJECT_STATUS.md`, `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `project-explainer.md`.

### Page docs: add endpoints + admin controls mapping
- **Prompt**: make sure you map the endpoints proposed in every pages .md file along with the proposed controles by admin control panel
- **What I did**:
  - Standardized page tracker docs to include:
    - **Proposed public API endpoints**
    - **Admin Control Panel controls/workflows**
  - Updated existing page trackers:
    - `PHARMACIES_PAGE_MAP.md`
    - `LIBRARY_PAGE_MAP.md`
    - `HOMEPAGE_MAP.md`
  - Updated Rule #0 guidance in: `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `PROJECT_STATUS.md`, `project-explainer.md`.

### Update Algeria wilayas/communes to 69 (new project copy)
- **Prompt**: legacy list is outdated (58); user shared updated project folder with 69 wilayas; take wilayas & communes from it
- **What I did**:
  - Pulled the updated source dataset from `c:\Users\Oasis-Mall\Documents\kgcmachafi 2 69wilayas\...`:
    - Copied `Map.json` into `frontend/src/data/Map.json`
    - Replaced `frontend/src/data/algeria-data.js` with a `Map.json`-driven adapter exporting `wilayas` + `getCommunes`
  - Kept `frontend/src/pages/PharmaciesPage.jsx` using the canonical lists (no change needed).
  - Verified `npm run build` OK.
  - Updated Rule #0 docs: `PHARMACIES_PAGE_MAP.md`, `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `PROJECT_STATUS.md`, `project-explainer.md`.

### Header scroll collapse: prevent content underlap
- **Prompt**: update `HEADER_SCROLL_ANIMATION.md` — scrolling up is inconvenient; page content goes under the header during collapse and gets hidden
- **What I did**:
  - Updated `HEADER_SCROLL_ANIMATION.md` with the “no underlap” requirement and the chosen implementation.
  - Implemented a fixed header + dynamic spacer approach:
    - `frontend/src/components/layout/Header.jsx` now publishes `--app-header-height` via `ResizeObserver`.
    - `frontend/src/App.tsx` inserts a spacer using `var(--app-header-height)` so content never goes under the header.
  - Verified `npm run build` OK.
  - Updated Rule #0 docs: `PROJECT_STATUS.md` and `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`.

### Pharmacies: import wilaya + baladiya lists from legacy
- **Prompt**: problem with the pharmacies is the list of wilaya and city… bring the list from legacy project
- **What I did**:
  - Ported the legacy-proven Algeria location dataset into the new frontend: `frontend/src/data/algeria-data.js` (wilayas + communes + `getCommunes`).
  - Updated `frontend/src/pages/PharmaciesPage.jsx` so the wilaya and city dropdowns use the canonical lists (not the partial pharmacy mock list).
  - Verified with `npm run build`.
  - Updated Rule #0 docs: `PHARMACIES_PAGE_MAP.md`, `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `PROJECT_STATUS.md`, and `project-explainer.md`.

### Rule #0 — update docs after every prompt
- **Prompt**: from now on: update the status of the .md file of every page we do work on along with HOW_DOES..., LEGACY..., PROJECT_STATUS..., project-explainer... after every prompt; memorize as rule number 0
- **What I did**:
  - Codified **Rule #0** inside `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, and `project-explainer.md`.
  - Added a Rule #0 compliance section to `PHARMACIES_PAGE_MAP.md`.
  - Cleaned a duplicate “Remaining (planned)” line in `PROJECT_STATUS.md`.

### Pharmacies page (legacy-inspired directory + night shift focus)
- **Prompt**: create pharmacies clone the design from legacy project, and also create a .md file for it explaining the entire page's architecture...
- **What I did**:
  - Implemented `frontend/src/pages/PharmaciesPage.jsx` and wired route **`/pharmacies`**.
  - Cloned the **legacy layout concept** (sticky filters + prominent night shift section) without legacy dependencies (Tailwind + inline SVG icons).
  - Added mock data model: `frontend/src/data/pharmacies.ts` with:
    - **Static directory** list (80% concept)
    - **Weekly night shift schedule** (20% concept) keyed by `weekStart` (Monday) → `nightDutyIds`
  - Added i18n keys under `pharmacies.*` for **AR/FR/EN** in `frontend/src/i18n/translations.ts`.
  - Created `PHARMACIES_PAGE_MAP.md` documenting full page value, UX flow, and future API contract.
  - Ran `npm run build` successfully.

### Project read + “sync chat to written content”
- **Prompt**: read the project, sync this chat to the written content
- **What I did**:
  - Read the core “project memory” markdown set to confirm current rebuild direction (UI-first, directory-first, i18n/RTL/LTR).
  - Added a root `README.md` that links the canonical docs and explains how to run the frontend.
  - Restored the workflow canvas:
    - Managed canvas for Cursor preview: `C:\Users\Oasis-Mall\.cursor\projects\d-komas-kgcmachafiprodhome1-kgcmachafi\canvases\project-workflow.canvas.tsx`
    - Versioned repo copy: `canvases/project-workflow.canvas.tsx`
  - Updated `PROJECT_STATUS.md` and `project-explainer.md` to point to the correct canvas locations.

### Library search bar
- **Prompt**: Add a search bar to the library page.
- **What I did**: Filter input below the hero (icon + clear), filters mock books by localized title, author, and category; i18n `library.searchPlaceholder`, `library.searchAriaLabel`, `library.clearSearch`, `library.noSearchResults` (en/fr/ar); updated `LIBRARY_PAGE_MAP.md`; `npm run build` OK.

### Library page (legacy HealthLibrary clone, UI-only)
- **Prompt**: Clone the Library page design from the legacy project and create it in the new frontend.
- **What I did**:
  - Added `frontend/src/pages/LibraryPage.jsx` mirroring legacy `HealthLibrary` (hero, grid, empty state, read modal with PDF iframe, download vs read CTAs).
  - Added mock catalog `frontend/src/data/libraryBooks.ts` and `library.*` i18n (AR / FR / EN) in `frontend/src/i18n/translations.ts`.
  - Wired routing: `BrowserRouter` in `frontend/src/main.tsx`, `Routes` in `frontend/src/App.tsx` with `/` → `HomePage`, `/library` → `LibraryPage`.
  - Swapped in-app links to `react-router-dom` `Link` in header, footer, and home CTAs where routes exist.
  - Documented mapping in `LIBRARY_PAGE_MAP.md`.
  - Ran `npm run build` in `frontend/` (tsc + vite) successfully.

## 2026-04-28

### Header rebuild (clean)
- **Prompt**: Rebuild the legacy header cleanly with i18n (AR/FR/EN) and RTL/LTR.
- **What I did**:
  - Archived legacy frontend under `legacy/` (no deletion).
  - Created new Vite + React app under `frontend/`.
  - Implemented a clean header component and a centralized i18n provider that drives `dir`/`lang`.

### Add top news ticker (blue sliding bar)
- **Prompt**: Missing top blue bar ticker with sliding text + glowing headline.
- **What I did**:
  - Recreated the ticker as `frontend/src/components/layout/NewsTicker.jsx`.
  - Added marquee + glow animations in `frontend/src/index.css`.
  - Hooked it into the header above the top bar and ensured RTL/LTR affects scroll direction.

### Match full legacy navbar content
- **Prompt**: Get all nav-bar content from legacy.
- **What I did**:
  - Updated nav order/routes to match legacy and added missing i18n keys.

### Add icons for every nav item (from internet)
- **Prompt**: Find PNG icons for each navbar page and set them perfectly.
- **What I did**:
  - Pulled a consistent icon set from Iconify (MDI), rasterized to PNG with `sharp`, saved to `frontend/public/nav-icons/`.
  - Wired PNG icons into the green navbar with pixel-aligned sizing.

### Add “Live” + “Programs” exclusive buttons in branding bar
- **Prompt**: Branding bar needs two important buttons (Live streaming + Programs) like legacy.
- **What I did**:
  - Implemented the two buttons in the logo/branding bar (desktop: full buttons, mobile: icon-only).
  - Added `live.png` icon and `common.watchLive` i18n key.

### Project workflow canvas (block schemes)
- **Prompt**: Create a canvas for project development tracking (block schemes/workflows) alongside the two tracking markdown files.
- **What I did**:
  - Created a Cursor canvas file that visualizes phases, current focus, and next steps.

### How to open the canvas
- **Prompt**: How can I see it, or where can I find it?
- **What I did**:
  - Provided the exact file path and steps to open the canvas in Cursor.

### Header bars definition
- **Prompt**: Header contains all four bars (news-ticker, utility-bar, branding-bar, nav-bar).
- **What I did**:
  - Confirmed the header structure and documented where each bar lives in the new header component.

### Footer rebuild (legacy clone)
- **Prompt**: Start copying the footer content and design from the legacy.
- **What I did**:
  - Recreated the legacy footer design as `frontend/src/components/layout/Footer.jsx` (UI-only).
  - Added missing i18n keys (AR/FR/EN) for footer + common labels.
  - Mounted the footer in `frontend/src/App.tsx`.

### Canvas: add block diagram
- **Prompt**: Wanted a visible block diagram inside the workflow canvas.
- **What I did**:
  - Added a system block diagram (DAG) section into `canvases/project-workflow.canvas.tsx`.

### Canvas not showing (troubleshoot)
- **Prompt**: Canvas is not showing.
- **What I did**:
  - Verified canvas build status is rendered and provided exact steps to open the canvas preview in Cursor.

### Canvas diagram empty (fix)
- **Prompt**: Block diagram section is empty.
- **What I did**:
  - Fixed the DAG layout usage to match the Canvas SDK (`computeDAGLayout({ nodes, edges, ... })`) and rendered edges via source/target anchors.

### Tracking discipline + more detail + advice
- **Prompt**: Keep the canvas + the two markdown trackers updated, with more details; add step-by-step advice inside `PROJECT_STATUS.md`.
- **What I did**:
  - Confirmed this as a standing rule and expanded `PROJECT_STATUS.md` to include a dedicated advice section and more granular next steps.

### Project sync / chat persistence
- **Prompt**: Whether the project + chat can be synced “inside” the assistant.
- **What I did**:
  - Explained that there is no internal sync drive; recommended git/cloud + keeping the canvas and tracking markdowns as the durable project memory.

### Branding-bar icons missing on mobile (fix)
- **Prompt**: Live/Programs buttons missing icons on mobile branding bar; match legacy behavior.
- **What I did**:
  - Identified the cause: white PNG icons on white background.
  - Downloaded color variants (`live-red.png`, `programs-blue.png`) and wired them into branding-bar buttons (mobile + desktop).

### Replace Twitter with X
- **Prompt**: Update Twitter logo to X and fetch it from the web.
- **What I did**:
  - Replaced the Twitter bird icon with an X logo SVG (Bootstrap Icons `twitter-x`) in header + footer.
  - Updated i18n label key to `header.social.x` (AR/FR/EN).

### Home page (legacy map + new UI scaffold)
- **Prompt**: Bring the first page (Home) from legacy and map its sections in a separate `.md` file to track components/design.
- **What I did**:
  - Analyzed `legacy/src/pages/HomePage.jsx` and identified the full section order and dependencies (Hero, Ads, Stats, Drama, News, Platform grid).
  - Created `HOMEPAGE_MAP.md` to document the legacy structure and the planned rebuild component breakdown.
  - Added a new UI-only scaffold page at `frontend/src/pages/HomePage.jsx` using i18n keys only (AR/FR/EN), and mounted it in `frontend/src/App.tsx`.

### Home page missing sections (Stats + Drama + News showcase)
- **Prompt**: Stats counter, health-in-drama, and health news cards are not shown (old system had language-switch issues here).
- **What I did**:
  - Implemented UI-only (static) versions of the missing sections directly inside `frontend/src/pages/HomePage.jsx`.
  - Added new i18n keys under `home.stats.*`, `home.drama.*`, and `home.news.*` in `frontend/src/i18n/translations.ts` for AR/FR/EN.
  - Ensured RTL/LTR behavior is driven by the centralized i18n `dir` and applied to these sections.

### Home page media: legacy hero image + drama video URL
- **Prompt**: Bring the hero image used in legacy and use the Health-in-Drama video URL.
- **What I did**:
  - Downloaded the legacy hero image (Unsplash) into `frontend/public/home/hero.jpg` and rendered it in the hero card.
  - Embedded the legacy Health-in-Drama YouTube URL (`SbDeMQ26RM8`) in the Drama section iframe (UI-only).
  - Added i18n alt text key `home.hero.imageAlt` for AR/FR/EN.
  - Updated `HOMEPAGE_MAP.md` with the exact media sources/paths.

### Legacy problems memory (assistant + team)
- **Prompt**: Memorize in a `.md` file the old system problems (pages hard-tied to backend; could not create hospital datasets; full list for future work).
- **What I did**:
  - Created `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` (user-reported blocker + audit-backed issues + explicit rebuild rules + changelog).
  - Cross-linked from `HOMEPAGE_MAP.md`; updated `PROJECT_STATUS.md` + workflow canvas “files to watch”.

### Header scroll collapse (tracking doc + implementation)
- **Prompt**: Create a dedicated `.md` to track the important header scroll animation (collapse ticker + utility, shrink branding to nav-like height); match legacy.
- **What I did**:
  - Added `HEADER_SCROLL_ANIMATION.md` (spec, legacy pointers, QA checklist, changelog).
  - Ported legacy scroll logic (hysteresis + rAF) and grid `0fr`/`1fr` collapse into `frontend/src/components/layout/Header.jsx`.
  - Extended `NewsTicker.jsx` with `collapsed` prop using the same grid collapse pattern as legacy `UrgentNewsBanner`.
  - Cross-linked from `HOMEPAGE_MAP.md`; updated workflow canvas + status trackers.

### Canvas build fix (project-workflow.canvas.tsx)
- **Prompt**: Canvas errors from JSX parsing angle brackets inside `Text`, plus duplicate default exports / wrong `computeDAGLayout` edge shape.
- **What I did**:
  - Rewrote `canvases/project-workflow.canvas.tsx` as a single default export.
  - Updated `computeDAGLayout` usage to SDK shape (`edges: { from, to }`, `nodes: { id }`) and rendered edges via `sourceX/Y` → `targetX/Y`.
  - Removed JSX-breaking snippets like literal `<a>` / `<Link>` inside text nodes.

### Markdown memory rule for all future page work
- **Prompt**: From now on, update all `.md` files in every response, and whenever a page is created, create a dedicated `.md` file for that page and keep it updated whenever we work on it.
- **What I did**:
  - Recorded this as a standing workflow rule in the markdown memory docs and workflow canvas.
  - Clarified the intended behavior as: update the **project memory markdown set** every prompt, and create/maintain a **page-specific `.md` tracker** for each page we build.
  - This means Home keeps `HOMEPAGE_MAP.md`, and future pages will get their own equivalent mapping/tracking files when created.


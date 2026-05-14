# MACHAFI — Technical & product status report (handoff)

**Purpose:** Give another AI assistant (or engineer) a truthful, end-to-end picture of the **current** MACHAFI codebase so they can continue architecture, UX, and backend integration without rediscovering the tree.

**Scope:** This report is **analysis only** (no app rewrite). Primary runnable UI lives under **`frontend/`**. Public references in docs: **https://kgc-machafi.net/**, **https://kgcmachafi.vercel.app/** (Vite SPA). Backend PHP + MySQL surfaces live under **`api/`**, **`deploy/api/`**, and **`ready-to-deploy/public_html/api/`** (deployment copies).

**Report date:** 2026-05-14 (aligned with `NEXT_STEPS_PRODUCTION.md` footer).

---

## 1. Project overview

### 1.1 What MACHAFI is

**MACHAFI** is a dual-product web platform for **KGC / Komas Group** positioning:

1. **Machafi Services** — a **health and civic directory** SPA: hospitals, pharmacies, ambulances, housing/accommodations, programs, consultations, library, donations, newsroom, “watch live” hub, and institutional pages. It is optimized for **Algeria-centric** location data (wilayas/communes) and **AR / FR / EN** audiences.

2. **Machafi TV** — a **broadcast-style editorial shell** (separate chrome, topic rails, desk/activity/search/live/schedule/article routes) scoped by **language edition in the URL** (`/tv/ar`, `/tv/fr`, `/tv/en`), not only a translation toggle on the same URL.

A **gateway** at **`/`** lets users choose which product to enter and optionally remember that choice in `localStorage` (no forced auto-redirect off the gateway).

### 1.2 Main domain flow

- Visitor lands on **`/`** (`GatewayPage`).
- They choose **Machafi Services** → **`/healthservices`** (nested pages under `ServicesLayout`).
- Or **Machafi TV** → **`/tv/{ar|fr|en}`** (nested pages under `TvShellLayout`); gateway can pre-select edition from remembered shell choice.
- Legacy flat paths (`/news`, `/live`, …) **redirect** to canonical **`/healthservices/...`** routes.

### 1.3 Two main shells / routes

| Shell | Base path | Layout component | Purpose |
|--------|-----------|------------------|---------|
| **Health services (Machafi Services)** | `/healthservices/*` | `frontend/src/layouts/ServicesLayout.jsx` | Full **directory + institutional** experience: shared **Header** (ticker, utility, branding, green nav), **Footer**, fixed header height spacer (`--app-header-height`). |
| **TV channel (Machafi TV)** | `/tv/:edition/*` where `edition ∈ {ar,fr,en}` | `frontend/src/layouts/TvShellLayout.jsx` | **Editorial / broadcast** UX: slim utility row, masthead, pill nav, breaking bar, dark footer; **syncs global i18n language to the URL edition** so UI strings match the edition route. |

**Health Services admin (shipped v1):** **`/healthservices/admin/*`** — React admin app (**`frontend/src/pages/admin/HealthServicesAdminPage.jsx`**) with nested routes (login, dashboard, CRUD for directories/content/consultations/donations/messages, live + homepage tabs), session + **CSRF** via **`frontend/src/services/admin/healthAdminApi.js`** and **`api/admin/auth/*.php`**. Deploy + MySQL steps: **`PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`**. **`/machafitv/admin/*`** remains a **placeholder** shell until the TV admin build.

---

## 2. Current architecture

### 2.1 Frameworks and libraries

From `frontend/package.json`:

- **Build:** Vite 8, `@vitejs/plugin-react`
- **UI:** React 19, React DOM 19
- **Routing:** `react-router-dom` 7
- **Maps:** `leaflet`, `react-leaflet`
- **Styling:** Tailwind CSS 3.4, PostCSS, Autoprefixer
- **Tooling:** TypeScript ~6, ESLint 10 (+ typescript-eslint, react-hooks)

**Note:** Most page and layout files are **`.jsx`**; newer shared modules use **`.ts` / `.tsx`** (`config.ts`, `I18nProvider.tsx`, `services/*.ts`, `data/*.ts`).

### 2.2 Folder structure (high level)

```
kgcmachafi/
├── frontend/                 # Vite + React SPA (canonical UI)
│   ├── src/
│   │   ├── App.tsx           # Route table
│   │   ├── main.tsx          # Root render + providers
│   │   ├── config.ts         # import.meta.env VITE_* surface
│   │   ├── index.css         # DM Sans, Tailwind layers, nav gradient, marquee, motion prefs
│   │   ├── components/       # Shared UI (layout, lists, TV, error boundary, …)
│   │   ├── layouts/          # ServicesLayout, TvShellLayout
│   │   ├── pages/            # Gateway, Services pages, tv/*, admin/*
│   │   ├── routes/paths.ts   # servicesPath, tvEditionPath, bases
│   │   ├── i18n/             # I18nProvider + translations.ts
│   │   ├── services/         # HTTP client + news/pharmacies/hospitals loaders
│   │   ├── data/             # Mocks + Algeria geography adapters
│   │   └── tv/               # e.g. useTvEdition
│   ├── public/               # Static assets, branding, home media
│   └── dist/                 # Build output (may be tracked per team policy)
├── api/                      # PHP JSON API (source / dev reference)
├── deploy/api/               # Deploy sibling copy
├── ready-to-deploy/public_html/  # Hosting bundle + api mirror
├── TRACKERS/                 # Per-page endpoint + SQL design specs
├── PROJECT-EXPLAINER/        # Status, smoke checklist, webapp overview
└── *.md                      # Roadmaps, architecture %, working plan
```

### 2.3 Routing structure

**Source of truth:** `frontend/src/App.tsx`.

```37:91:frontend/src/App.tsx
export default function App() {
  return (
    <>
      <DocumentTitle />
      <Routes>
        <Route path="/" element={<GatewayPage />} />

        <Route path="/healthservices/admin/*" element={<HealthServicesAdminPage />} />
        <Route path="/machafitv/admin/*" element={<MachafiTvAdminPage />} />

        <Route path="/tv/:edition" element={<TvShellLayout />}>
          <Route index element={<TvHomePage />} />
          <Route path="desk" element={<TvDeskPage />} />
          <Route path="activity" element={<TvActivityPage />} />
          <Route path="topics/:topicId" element={<TvTopicPage />} />
          <Route path="search" element={<TvSearchPage />} />
          <Route path="live" element={<TvLivePage />} />
          <Route path="schedule" element={<TvSchedulePage />} />
          <Route path="article/:slug" element={<TvArticlePage />} />
        </Route>

        <Route path="/healthservices" element={<ServicesLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutContactPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="service" element={<ServicesPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="live" element={<LivePage />} />
          <Route path="pharmacies" element={<PharmaciesPage />} />
          <Route path="ambulances" element={<AmbulancesPage />} />
          <Route path="accommodations" element={<AccommodationsPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="hospitals" element={<HospitalsPage />} />
          <Route path="consultations" element={<ConsultationsPage />} />
          <Route path="*" element={<Navigate to="/healthservices" replace />} />
        </Route>

        <Route path="/about" element={<Navigate to="/healthservices/about" replace />} />
        {/* … additional legacy Navigate routes … */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
```

Path helpers (canonical URL building):

```1:35:frontend/src/routes/paths.ts
/** Base path for Machafi Services (directory platform SPA). */
export const SERVICES_BASE = '/healthservices';

/** Machafi TV public shell (edition-prefixed segments follow). */
export const TV_BASE = '/tv';

export type TvEdition = 'ar' | 'fr' | 'en';

export const TV_EDITIONS: TvEdition[] = ['ar', 'fr', 'en'];

export function isTvEdition(s: string | undefined): s is TvEdition {
  return s === 'ar' || s === 'fr' || s === 'en';
}

export function servicesPath(path: string): string {
  if (!path || path === '/') return SERVICES_BASE;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SERVICES_BASE}${normalized}`;
}

export function tvEditionPath(edition: TvEdition, path: string = '/'): string {
  if (!path || path === '/') return `${TV_BASE}/${edition}`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${TV_BASE}/${edition}${normalized}`;
}
```

### 2.4 Shell separation logic

- **Different layout components** and **different visual systems** (Services: legacy-inspired green nav + multi-bar header; TV: slate/emerald minimal SaaS + broadcast red accents).
- **TV edition in the URL** drives **`dir`** on the shell (`ar` → `rtl`) and **forces i18n language** to match edition when the shell mounts (`TvShellLayout` `useEffect`).
- **Services** uses the global **language toggle** in `Header` without changing the path prefix (all under `/healthservices`).

### 2.5 Shared components, layouts, services, utilities

| Area | Examples |
|------|-----------|
| **Layouts** | `frontend/src/layouts/ServicesLayout.jsx`, `TvShellLayout.jsx` |
| **Services chrome** | `frontend/src/components/layout/Header.jsx`, `Footer.jsx`, `NewsTicker.jsx` |
| **Cross-cutting** | `frontend/src/components/DocumentTitle.jsx`, `RootErrorBoundary.tsx` |
| **List UX** | `useBootstrapList`, `ListGridSkeleton`, `ListFetchErrorBanner` (per `PROJECT-EXPLAINER/PROJECT_STATUS.md` — used on News, Pharmacies, Hospitals, Ambulances) |
| **HTTP** | `frontend/src/services/http.ts` (`getJson`, timeouts, `ApiError`), `news.ts`, `pharmacies.ts`, `hospitals.ts`, `services/index.ts` |
| **Config** | `frontend/src/config.ts` — `apiBaseUrl`, `publicSiteUrl`, `tvStreamUrl`, `featureTvHls` |
| **Data / mocks** | `frontend/src/data/*` (e.g. `news.ts`, `pharmacies.ts`, `hospitals.ts`, `tvMock.ts`, `consultations.ts`, `algeria-data.js`, `Map.json`) |

### 2.6 Design system / theme rules (as implemented)

- **Typography:** Google **DM Sans** globally in `frontend/src/index.css` (`@import` + `* { font-family: 'DM Sans', … }`).
- **CSS framework:** Tailwind utility-first; **container** centered, `2xl` max width **1400px** (`frontend/tailwind.config.js`).
- **Motion:** Custom keyframes (`kgc-pop`, gateway orbs, marquee); **`prefers-reduced-motion`** disables decorative animations in `index.css`.
- **Services accent policy (documented):** prefer **emerald / teal / green** for secondary accents; purple strips removed from `frontend/src` for cohesion (`PROJECT-EXPLAINER/PROJECT_STATUS.md`).
- **Main nav:** tunable green gradient via CSS variables in `index.css` (see `PROJECT_STATUS` / `HEADER_SCROLL_ANIMATION.md` references).
- **No formal token package** yet — roadmap calls for a small UI kit (Card, Button, Input) in `NEXT_STEPS_PRODUCTION.md` Phase B4.

---

## 3. UI/UX status

### 3.1 Current pages / screens

**Gateway**

| Route | Component |
|-------|-----------|
| `/` | `frontend/src/pages/GatewayPage.jsx` |

**Machafi Services** (all under `ServicesLayout`)

| Route | Component |
|-------|-----------|
| `/healthservices` | `HomePage.jsx` |
| `/healthservices/about` | `AboutContactPage.jsx` |
| `/healthservices/library` | `LibraryPage.jsx` |
| `/healthservices/service` | `ServicesPage.jsx` |
| `/healthservices/donations` | `DonationsPage.jsx` |
| `/healthservices/news` | `NewsPage.jsx` |
| `/healthservices/news/:id` | `NewsDetailPage.jsx` |
| `/healthservices/live` | `LivePage.jsx` |
| `/healthservices/pharmacies` | `PharmaciesPage.jsx` |
| `/healthservices/ambulances` | `AmbulancesPage.jsx` |
| `/healthservices/accommodations` | `AccommodationsPage.jsx` |
| `/healthservices/programs` | `ProgramsPage.jsx` |
| `/healthservices/hospitals` | `HospitalsPage.jsx` |
| `/healthservices/consultations` | `ConsultationsPage.jsx` |

**Machafi TV** (nested under `TvShellLayout`)

| Route | Component |
|-------|-----------|
| `/tv/:edition` | `frontend/src/pages/tv/TvHomePage.jsx` |
| `/tv/:edition/desk` | `TvDeskPage.jsx` |
| `/tv/:edition/activity` | `TvActivityPage.jsx` |
| `/tv/:edition/topics/:topicId` | `TvTopicPage.jsx` |
| `/tv/:edition/search` | `TvSearchPage.jsx` |
| `/tv/:edition/live` | `TvLivePage.jsx` |
| `/tv/:edition/schedule` | `TvSchedulePage.jsx` |
| `/tv/:edition/article/:slug` | `TvArticlePage.jsx` |

**Admin routes**

| Route | Component |
|-------|-----------|
| `/healthservices/admin/*` | `frontend/src/pages/admin/HealthServicesAdminPage.jsx` — **nested admin app** (login, dashboard, CRUD modules; see **`PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`** for deploy). |
| `/machafitv/admin/*` | `frontend/src/pages/admin/MachafiTvAdminPage.jsx` — **placeholder** until TV CMS. |

### 3.2 User journey: landing → each shell

1. **`/`** — Gateway presents two paths (Services vs TV), optional “remember” checkbox, TV edition selector (`ar` / `fr` / `en`). Links use `SERVICES_BASE` and `tvEditionPath` from `routes/paths.ts`.
2. **Services** — `Link` to `/healthservices` (index = home). Full site nav in `Header.jsx` for all directory pages.
3. **TV** — `Link` to `/tv/{edition}`; inside TV shell, edition switcher links to `tvEditionPath(code, '/')`. **Invalid edition** in URL → redirect to `/tv/ar` (`TvShellLayout`).

### 3.3 Navigation behavior

- **Legacy paths** (`/about`, `/news`, …) → **`Navigate`** to `/healthservices/...` (`App.tsx`).
- **Unknown** routes outside defined prefixes → **`Navigate`** to **`/`** (gateway), except `/healthservices/*` catch-all → `/healthservices`.
- **News detail legacy:** `/news/:id` → redirects to `${servicesPath('/news')}/${id}` via `LegacyNewsDetailRedirect` in `App.tsx`.
- **Document titles:** `DocumentTitle.jsx` maps pathname to i18n keys; brand prefix `MACHAFI - …`.

### 3.4 Responsive behavior

- **Services `Header`:** mobile menu, scroll-collapse behavior (multi-bar header, ResizeObserver publishing `--app-header-height` — see `frontend/src/components/layout/Header.jsx` and `PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md`).
- **TV shell:** horizontal scroll primary nav on desktop; **md:hidden** mobile nav sheet; utility row wraps.
- **Directory pages:** generally **container + grid** patterns (cards, maps at bottom on several listings per `PROJECT_STATUS`).

### 3.5 RTL / Arabic support

- **Languages:** AR, FR, EN in `frontend/src/i18n/translations.ts`.
- **Direction:** `I18nProvider` sets `document.documentElement.lang` and **`dir`** to `rtl` for Arabic, `ltr` otherwise.

```15:63:frontend/src/i18n/I18nProvider.tsx
function getDir(lang: Language): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'ar' || stored === 'fr' || stored === 'en') return stored;
    return 'ar';
  });

  const dir = getDir(language);
  // … setLanguage persists to localStorage …

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [dir, language]);
```

- **TV shell** also sets `dir={dir}` on its root where `dir` comes from **edition** (`ar` → rtl).
- **Rule #1** (documented in `PROJECT-EXPLAINER/RULE_1_LANGUAGE_SWITCHING.md` and `PROJECT_STATUS.md`): no mixed-language visible strings when switching language.

### 3.6 Visual style (summary)

- **Services:** layered header (ticker, dark utility, white branding bar with logos, **green** main nav), **emerald** CTAs linking back from TV shell, footer matching legacy structure.
- **Gateway:** dark **#05070d** background, emerald/sky ambient orbs, grid + grain; motion-safe animations.
- **TV:** **slate-50** page background, **slate-900** / white masthead, **red** “live” motif, pill nav, **slate-950** footer.
- **Cards / buttons:** Tailwind-rounded-2xl cards, ring shadows, full-width map sections on directory pages; consultation booking modals and donation forms are **UI-level** (no production payment pipeline in frontend).

---

## 4. Health services shell

### 4.1 Existing pages

All routes listed in §3.1; trackers under **`TRACKERS/machafi-services/*_PAGE_MAP.md`** per `PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md`.

### 4.2 Features already implemented (honest summary)

- **Rich UI scaffolds** for home, directories, newsroom, live hub, consultations (filters + booking modal **UI**), donations (form **UI**), about/contact, library, services catalog, programs schedule UX, etc. — **client-side mocks** unless a `VITE_*` flag enables the matching **`frontend/src/services/`** loader (see **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`**).
- **Geodata:** Wilayas / communes via `frontend/src/data/algeria-data.js` + `Map.json` (69 wilayas) used across consultations, pharmacies, hospitals, ambulances, accommodations.
- **Maps:** Leaflet-based maps on applicable directory pages (per project status).
- **News / pharmacies / hospitals / ambulances / accommodations:** Optional **live JSON** when the corresponding **`VITE_*_API=true`** env flags are set (same-origin **`VITE_API_BASE_URL`**).
- **List loading UX:** Skeleton + error + retry for News, Pharmacies, Hospitals, Ambulances, Accommodations.

### 4.3 Planned features (from docs / code comments)

- **Home feed API:** `GET` **`api/public/home.php`** exists (`lang`); SPA wiring optional via **`VITE_HOME_API`**.
- **Wire remaining directories** to public PHP for Programs, Library, Consultations list UI, Live, Donations, Home, Services catalog, Settings — **`api/public/*.php`** exists for most; **`API_ENDPOINT_REGISTRY.md`** is canonical; SPA loaders follow the **`getJson` / `postJson`** pattern.
- **Forms:** Contact (**`api/public/contact.php`**), donation intents (**`donations.php` POST**), consultation booking (**`consultations.php` POST**) persist server-side with honeypots; SPA forms still mock-first until wired.
- **Admin panel (Health Services):** **`/healthservices/admin/*`** — authenticated **React** admin (**session + CSRF**); uses **`api/admin/*`**. **TV admin** route remains a placeholder.

### 4.4 Mock vs real data

- **Mocks:** `frontend/src/data/*.ts` (+ some `.js`).
- **Real (optional):** toggled by **`VITE_NEWS_API`**, **`VITE_PHARMACIES_API`**, **`VITE_HOSPITALS_API`**, **`VITE_AMBULANCES_API`**, **`VITE_ACCOMMODATIONS_API`** — see `frontend/.env.example`, **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`**, and `frontend/src/services/*.ts`.
- **Ambulances / accommodations:** Same loader pattern as other directories when flags are true.

### 4.5 Domain specifics

- **Consultations:** `ConsultationsPage.jsx` + `data/consultations.ts` — **UI** complete; **public** `api/public/consultations.php` (GET + POST booking) and admin consultation modules exist — **`VITE_CONSULTATIONS_API`** reserved for SPA wiring.
- **Clinics / hospitals:** Hospitals page with Algeria vs international tabs; optional PHP-backed lists.
- **Pharmacies:** Night-duty week highlight + directory + map.
- **Programs / live (Services):** `LivePage.jsx` uses mock **`frontend/src/data/live.ts`** — HTML5 video demo paths, not a guaranteed production stream.

---

## 5. TV channel shell

### 5.1 Existing pages

See §3.1 — `TvHomePage`, `TvDeskPage`, `TvActivityPage`, `TvTopicPage`, `TvSearchPage`, `TvLivePage`, `TvSchedulePage`, `TvArticlePage`.

### 5.2 Features already implemented

- Full **navigation chrome** (utility row, masthead, pill nav, mobile menu, footer links).
- **Edition switcher** (AR/FR/EN) as separate routes.
- **Topic rails** (`health`, `policy`, `research`, `community`) as routes.
- **Breaking bar** component (`TvBreakingBar.jsx`).
- **Placeholder live stage** on `TvLivePage.jsx` — “On air” UI, CTA button, sidebar schedule peek from **`tvMock`** (`frontend/src/data/tvMock.ts`).

### 5.3 Planned features

Per `NEXT_STEPS_PRODUCTION.md` **Phase E** and `PROJECT_STATUS.md`:

- **HLS playback** via `hls.js` (or similar) behind **`appConfig.featureTvHls`** + **`VITE_TV_STREAM_URL`** (`frontend/src/config.ts`).
- Replace **`tvMock`** with edition-scoped APIs (logical base documented as `/api/public/tv/{edition}/...` in `WEBAPP_PAGES_OVERVIEW.md`).
- **TV admin + CMS**, CDN cache discipline, encoder → HLS → player pipeline (ops).

### 5.4 Live TV / player status

- **`config.ts`:** `tvStreamUrl` and `featureTvHls` gate future player integration.

```13:28:frontend/src/config.ts
export const appConfig = {
  mode: import.meta.env.MODE,
  appEnv: readEnvString('VITE_APP_ENV', import.meta.env.MODE),
  publicSiteUrl: readEnvString('VITE_PUBLIC_SITE_URL', 'https://kgc-machafi.net'),
  apiBaseUrl: readEnvString('VITE_API_BASE_URL', '/api'),
  tvStreamUrl: readEnvString('VITE_TV_STREAM_URL', ''),
  featureTvHls: import.meta.env.VITE_FEATURE_TV_HLS === 'true',
} as const
```

- **`TvLivePage.jsx`:** visually complete **shell**; player is **not** wired to HLS in the snippet reviewed — placeholder gradient stage + static “go live” button.

### 5.5 Programs, schedule, news, media

- **Schedule / programs content:** driven by **`tvMock`** (`tvScheduleDay`, `pick()` helpers) for peeks and listings until API replaces it.
- **Articles:** `TvArticlePage` + slug route — editorial **placeholder** behavior until CMS-backed JSON exists (trackers under `TRACKERS/machafi-tv/`).

### 5.6 Streaming / API requirements (expectations)

- **HLS URL** from env or from **`/api/public/...`** settings endpoint.
- **Edition-aware feeds** for home rails, topic pages, search, desk, activity.
- **Auth** for journalist flows (admin namespace) — not implemented in SPA admin routes yet.

**Product clarification (from `PROJECT_STATUS`):** Services **`/healthservices/news`** remains the **directory/newsroom** track; Machafi TV is a **separate broadcast news product** with its own queues when backend lands.

---

## 6. Backend and endpoints

### 6.1 Hosting model (from project docs)

- **GoDaddy** Linux hosting, **Apache + PHP**, **MySQL/MariaDB**.
- SPA expects same-origin **`VITE_API_BASE_URL=/api`** in production (see `WEBAPP_PAGES_OVERVIEW.md`).

### 6.2 Existing PHP API (repo)

**Canonical matrix:** **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`** (every `api/public/*.php` and `api/admin/*.php`, methods, honeypots, **`VITE_*`** flags, CSRF on admin writes). **Iteration notes:** **`PROJECT-EXPLAINER/HEALTH_SERVICES_BACKEND.md`**.

At a glance:

- `api/public/*.php` — Machafi Services public JSON (envelope `{ ok, data }` on revised files) plus legacy helpers (`site-content.php`, `translate.php`, …).
- `api/admin/*.php` — session auth (`auth/login.php` returns **`csrf_token`**), CRUD modules; mutating routes require **`X-CSRF-Token`**.

| Concern | PHP (relative to API root) | Frontend consumer (when flag) |
|--------|------------------------------|--------------------------------|
| News list/detail | `/public/news.php` | `frontend/src/services/news.ts` |
| Pharmacies | `/public/pharmacies.php` | `frontend/src/services/pharmacies.ts` |
| Hospitals | `/public/hospitals.php`, `/public/international-hospitals.php` | `frontend/src/services/hospitals.ts` |
| Ambulances | `/public/ambulances.php` | `frontend/src/services/ambulances.ts` |
| Accommodations | `/public/accommodations.php` | `frontend/src/services/accommodations.ts` |
| Programs / books / services / home / live / donations / consultations / contact / settings | matching `/public/*.php` | loaders TBD except patterns above |

**News loader behavior (env-gated):**

```66:81:frontend/src/services/news.ts
export async function loadNewsArticlesForList(): Promise<NewsArticleMock[]> {
  if (import.meta.env.VITE_NEWS_API !== 'true') {
    return newsArticlesMock
  }

  const url = apiUrl('/public/news.php?limit=80&archived=0')
  const raw = await getJson<NewsPhpListResponse>(url)
  const envelopeItems = raw.data?.items
  const items = Array.isArray(raw.items) ? raw.items : Array.isArray(envelopeItems) ? envelopeItems : []

  if (items.length === 0) {
    return []
  }

  return items.map((row) => mapPhpNewsRow(row))
}
```

### 6.3 TV and remaining SPA wiring

- **Machafi TV** `/api/public/tv/*` — **not** in this repo; trackers describe target contracts.
- **Machafi Services** — many public files exist; SPA wiring is **incremental** (env flag + `services/` module per page). Trackers: **`TRACKERS/**`** §12 + **`WEBAPP_PAGES_OVERVIEW.md`**.

### 6.4 Data models / entities

- **SQL-backed entities** are specified in trackers (e.g. `news_articles`, `pharmacies`, `hospitals`, `ambulances`, `patient_accommodations`, `programs`, consultation doctors/specialties).
- **SPA models** are often **TypeScript types** next to mocks in `frontend/src/data/*.ts`, with **mappers** in `frontend/src/services/*.ts` normalizing PHP row shapes.

### 6.5 Auth status

- **PHP:** `api/admin/auth/*.php` for admin session; public reads generally unauthenticated.
- **SPA:** **Health Services admin** (`/healthservices/admin/*`) is a **cookie-session** app calling **`api/admin/*`** with **`X-CSRF-Token`** on writes (**`healthAdminApi.js`**). Cross-origin SPA vs API still needs **CORS / SameSite** alignment (`NEXT_STEPS_PRODUCTION.md` C2, D4).

### 6.6 Mock services

- Primary mocks: `frontend/src/data/*`.
- **HTTP helper:** `getJson` and **`postJson`** in `frontend/src/services/http.ts` — timeouts, JSON parse errors mapped to `ApiError`.

### 6.7 Future integration plan (condensed from `NEXT_STEPS_PRODUCTION.md`)

1. Finish **read-only** wiring for directories + settings (`D1`).
2. Harden **`services/`** client (C1) — types, envelopes, consistent errors.
3. **Admin follow-up:** envelope parity on all **`api/admin/*.php`**; surface **RBAC** in UI; optional lazy-loaded admin chunk (**C3**).
4. **TV HLS + tv API** (E1–E4).
5. Security / perf / SEO / observability phases **F–J**.

---

## 7. Current development state

### 7.1 Complete (high confidence)

- Vite SPA scaffold, Tailwind, routing for **gateway + services + TV + redirects + Health Services admin + TV admin placeholder**.
- **i18n** infrastructure + large translation surface.
- **Services** UI for all major directory and content pages (UI-first).
- **TV shell** pages and navigation **UI**.
- **CI:** GitHub Actions for `frontend` lint + build (`PROJECT_STATUS` references `.github/workflows/frontend-ci.yml`).
- **Error boundary**, central **config**, **`.env.example`**, list UX pattern for several pages.
- **Optional** news/pharmacies/hospitals/**ambulances**/**accommodations** PHP reads via env flags (`API_ENDPOINT_REGISTRY.md`).

### 7.2 Partially complete

- **Backend integration:** public PHP coverage is **broad** for Machafi Services; **SPA** still uses mocks unless the matching **`VITE_*`** loader exists (news, pharmacies, hospitals, ambulances, accommodations wired; others follow the same pattern).
- **TV:** shell + mocks; **no HLS** tied to `featureTvHls` in the player area observed.
- **Admin:** **Health Services** admin SPA (**`/healthservices/admin/*`**) + PHP **`api/admin/*`**; **Machafi TV** admin route still placeholder UI only.
- **A4 loading audit:** extended to several lists; **Programs / Accommodations** (and other lists) called out in `NEXT_STEPS_PRODUCTION.md` as optional next slices.

### 7.3 Broken or missing (known gaps)

- **Production streaming** not delivered as a secure, tested HLS path in the TV player UI.
- **Real consultations booking / payments / donation capture** — **Public PHP** accepts consultation bookings and donation intents; **payments** and full **SPA wiring** for those forms are still roadmap items per `PROJECT_STATUS`.
- **SSR/SEO:** SPA-only; meta/OG per route still a roadmap item (Phase H in `NEXT_STEPS_PRODUCTION.md`).

### 7.4 Known bugs / risks (from project docs, not runtime-tested here)

- **Header scroll collapse** may need cross-device QA (`HEADER_SCROLL_ANIMATION.md` — iOS/Android/desktop).
- **Tablet partner logos** visibility / regression called out in `PROJECT_STATUS` (branding bar behavior).
- **Arabic density / overflow** — explicit stress-testing recommended (Phase B5).

### 7.5 Technical debt (architectural)

- **Mixed JS/TS** in the same app (`App.tsx` imports many `.jsx` pages).
- **No unified design-system package** — duplication across pages likely.
- **PHP response envelope** inconsistency (`http.ts` comments) — mappers accept multiple shapes until unified.
- **`node_modules` / `dist` tracking** — team policy mentions full pushes including `frontend/dist`; may complicate CI/CD hygiene (Phase C5 in roadmap).

### 7.6 Important TODOs (from `NEXT_STEPS_PRODUCTION.md` / `PROJECT_STATUS.md`)

- Run **`PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md`** on staging builds.
- Implement **HLS** + replace **`tvMock`** with APIs.
- Expand **typed API client** + DTOs (C1/C4).
- **Security headers**, dependency automation, RUM/Sentry (F*, J*).

---

## 8. Files to inspect first

| File | Why |
|------|-----|
| `frontend/src/App.tsx` | **Route table** — single source of navigation truth. |
| `frontend/src/main.tsx` | App bootstrap: **Router**, **I18nProvider**, **RootErrorBoundary**. |
| `frontend/src/routes/paths.ts` | **`servicesPath`**, **`tvEditionPath`**, edition guards. |
| `frontend/src/config.ts` | All **`VITE_*`** runtime config in one place. |
| `frontend/.env.example` | Documented env flags for API wiring and TV. |
| `frontend/src/layouts/ServicesLayout.jsx` | Services shell — Header/Footer/Outlet. |
| `frontend/src/layouts/TvShellLayout.jsx` | TV shell — edition sync, dir, nav. |
| `frontend/src/pages/GatewayPage.jsx` | Entry UX + `localStorage` shell memory. |
| `frontend/src/components/layout/Header.jsx` | Full Services nav, language, scroll collapse, TV deep links. |
| `frontend/src/components/DocumentTitle.jsx` | `document.title` mapping for all shells. |
| `frontend/src/i18n/I18nProvider.tsx` | Language + **RTL** + persistence. |
| `frontend/src/i18n/translations.ts` | All user-visible strings (Rule #1). |
| `frontend/src/services/http.ts` | **`getJson`**, **`postJson`**, timeout, **`ApiError`**. |
| `frontend/src/services/news.ts` | Example **env-gated** PHP integration + mapping. |
| `frontend/src/services/pharmacies.ts`, `hospitals.ts`, **`ambulances.ts`**, **`accommodations.ts`** | Directory **PHP mappers**. |
| `frontend/src/data/tvMock.ts` | TV placeholder content. |
| `frontend/tailwind.config.js`, `frontend/src/index.css` | Theme, font, animations, nav gradient. |
| `PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md` | Page ↔ tracker map + readiness table. |
| `PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md` | **Canonical** PHP path ↔ method matrix. |
| `PROJECT-EXPLAINER/HEALTH_SERVICES_BACKEND.md` | Backend pass notes (CSRF, schema, smoke). |
| `frontend/src/pages/admin/HealthServicesAdminPage.jsx` | Health Services **admin router** (auth providers + nested **`/healthservices/admin/*`** routes). |
| `frontend/src/pages/admin/healthservices/*` | Admin layout, login, dashboard, CRUD configs, custom modules (live, homepage, messages, bookings, intents, campaigns, settings). |
| `frontend/src/components/admin/healthservices/*` | Reusable admin UI (**`CrudResourcePage`**, modals, toasts, pagination). |
| `frontend/src/services/admin/healthAdminApi.js` | Admin **`fetch`** + **`credentials: 'include'`** + response unwrapping (envelope + legacy). |
| `PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md` | Beginner **cPanel** deploy runbook (DB, **`api/`**, **`dist/`**, `.htaccess`). |
| `PROJECT-EXPLAINER/PROJECT_STATUS.md` | Done / in-progress / remaining narrative. |
| `NEXT_STEPS_PRODUCTION.md` | Phased roadmap with file references. |
| `TRACKERS/**` | **§12 HTTP map** + endpoint/SQL specs per page / admin surface. |

---

## 9. Recommended next steps

### 9.1 Immediate priorities

1. **Smoke pass:** Execute `PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md` on a **staging** build (gateway → Services → TV × languages × breakpoints); include **`/healthservices/admin/login`** once PHP API is reachable.
2. **Finish D1 slice:** Wire remaining read-only pages (**Programs**, **Library**, **Home**, **Live**, **Services catalog**, **Settings**) using the same `getJson` + mapper pattern; **`api/public/*.php`** already exists — see **`API_ENDPOINT_REGISTRY.md`**.
3. **RTL stress (B5):** Especially **Consultations** modals, **Donations** form, **Header** mobile drawer, **Health Services admin** tables/forms.
4. **Health Services admin follow-up:** Full **`{ ok, data|error }`** envelope parity on every legacy **`api/admin/*.php`** file; show **`editor` vs `admin`** limits in UI; optional **`React.lazy`** for admin chunks.
5. **TV Phase E spike:** Implement **`featureTvHls`** player path behind flag; validate **`VITE_TV_STREAM_URL`** with a test stream.

### 9.2 Suggested implementation order

1. Stabilize **list pages** (loading/error/empty) for remaining directories (**Programs**, **Accommodations** per `NEXT_STEPS_PRODUCTION.md`).
2. Expand **`services/`** coverage + normalize PHP envelopes (**admin** + public).
3. **Health Services admin** — v1 UI shipped; next: envelope parity, RBAC surfacing in UI, code-splitting.
4. **TV APIs** + HLS, then replace mocks.
5. **Security + SEO + observability** as traffic and ops maturity grow.

### 9.3 Risks / decisions to clarify

- **Single vs split deployments:** SPA on Vercel vs same-origin **`/api`** on GoDaddy affects **cookies, CORS, and absolute URLs** — confirm production topology before deep auth work.
- **Two news products:** Confirm editorial workflow split between **Services newsroom** and **Machafi TV** feeds to avoid duplicate CMS confusion.
- **Stream rights / geo:** Legal and CDN constraints for **live** and **replay** not represented in frontend code.
- **Donations/payments:** Provider choice (CIB, Stripe, etc.) drives form fields and **PCI** boundaries — not decided in frontend.

---

## Appendix — key code references (quick)

**Runtime config & TV flags:** `frontend/src/config.ts` (see §5.4).

**Routing & shells:** `frontend/src/App.tsx` (see §2.3).

**Path helpers:** `frontend/src/routes/paths.ts` (see §2.3).

**RTL / language:** `frontend/src/i18n/I18nProvider.tsx` (see §3.5).

**News API gate:** `frontend/src/services/news.ts` (see §6.2).

---

*This handoff document was generated to reflect the repository as of **2026-05-14** (includes **Health Services admin v1** + GoDaddy deploy guide). For living execution status, also read **`NEXT_STEPS_PRODUCTION.md`**, **`PROJECT-EXPLAINER/PROJECT_STATUS.md`**, and **`ARCHITECTURE_PRODUCTION_READINESS.md`**.*

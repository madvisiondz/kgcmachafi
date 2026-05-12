# Webapp pages overview

This document tracks **`frontend/src/App.tsx`** routing on **[https://kgc-machafi.net/](https://kgc-machafi.net/)**: **gateway**, **Machafi Services** under **`/healthservices/*`**, **Machafi TV** under **`/tv/:edition/*`**, and **admin placeholders**. Full product map: **`PLATFORM_SHELL_LAYOUT.md`**. Older copies under `legacy/` and `backupp/` are **not** counted here.

## Summary

| Metric | Value |
|--------|------:|
| Gateway | **`/`** → `GatewayPage.jsx` |
| Machafi Services page components (`frontend/src/pages/` root, shared by routes) | **14** |
| Services routes (canonical) | Under **`/healthservices/*`** (+ legacy redirects from old flat paths) |
| Machafi TV routes per edition | **index**, **`desk`**, **`activity`**, **`topics/:topicId`**, **`search`**, **`live`**, **`schedule`**, **`article/:slug`** |
| Admin placeholders | **`/healthservices/admin/*`**, **`/machafitv/admin/*`** (see admin trackers below) |

Path helpers: **`frontend/src/routes/paths.ts`** (`servicesPath`, `tvEditionPath`, `SERVICES_BASE`).

## App structure

```
BrowserRouter (main.tsx)
└── App.tsx
    ├── DocumentTitle (global — gateway, services, TV, admin)
    └── Routes
        ├── /                          → GatewayPage
        ├── /healthservices/admin/*    → HealthServicesAdminPage (placeholder)
        ├── /machafitv/admin/*         → MachafiTvAdminPage (placeholder)
        ├── /tv/:edition/*             → TvShellLayout → Outlet (Tv* pages)
        ├── /healthservices/*          → ServicesLayout → Outlet (all directory pages)
        ├── legacy redirects (/about → /healthservices/about, …)
        └── *                         → Navigate to /
```

**Machafi Services chrome** (header, spacer, footer) lives in **`ServicesLayout.jsx`**. **Machafi TV** uses **`TvShellLayout.jsx`**.

## Machafi Services — routes and pages

Canonical paths (legacy URLs without `/healthservices` **redirect**).

| # | Path | Page component | Primary data / notes |
|---|------|----------------|----------------------|
| 1 | `/healthservices` | `HomePage.jsx` | Inline copy, stats, links |
| 2 | `/healthservices/about` | `AboutContactPage.jsx` | i18n; contact form client-only |
| 3 | `/healthservices/library` | `LibraryPage.jsx` | `src/data/libraryBooks.ts` |
| 4 | `/healthservices/service` | `ServicesPage.jsx` | `src/data/services.ts` |
| 5 | `/healthservices/donations` | `DonationsPage.jsx` | `src/data/donations.ts` |
| 6 | `/healthservices/news` | `NewsPage.jsx` | `src/data/news.ts` |
| 7 | `/healthservices/news/:id` | `NewsDetailPage.jsx` | `getNewsArticleById` |
| 8 | `/healthservices/live` | `LivePage.jsx` | `src/data/live.ts` |
| 9 | `/healthservices/pharmacies` | `PharmaciesPage.jsx` | `pharmacies.ts`, maps |
| 10 | `/healthservices/ambulances` | `AmbulancesPage.jsx` | `ambulances.ts`, maps |
| 11 | `/healthservices/accommodations` | `AccommodationsPage.jsx` | `housing.ts`, maps |
| 12 | `/healthservices/programs` | `ProgramsPage.jsx` | `programs.ts` |
| 13 | `/healthservices/hospitals` | `HospitalsPage.jsx` | `hospitals.ts` |
| 14 | `/healthservices/consultations` | `ConsultationsPage.jsx` | `consultations.ts` |

## Machafi TV — routes + trackers

Edition is **`ar`**, **`fr`**, or **`en`** (`/tv/bad` → redirect **`/tv/ar`**). Shared chrome: **`../TRACKERS/machafi-tv/TV_SHELL_PAGE_MAP.md`**. Per-route trackers live under **`../TRACKERS/machafi-tv/`** (same pattern as **`../TRACKERS/machafi-services/*_PAGE_MAP.md`**).

| Path | Page | Tracker |
|------|------|---------|
| `/tv/:edition` | `pages/tv/TvHomePage.jsx` | `../TRACKERS/machafi-tv/TV_HOME_PAGE_MAP.md` |
| `/tv/:edition/desk` | `pages/tv/TvDeskPage.jsx` | `../TRACKERS/machafi-tv/TV_DESK_PAGE_MAP.md` |
| `/tv/:edition/activity` | `pages/tv/TvActivityPage.jsx` | `../TRACKERS/machafi-tv/TV_ACTIVITY_PAGE_MAP.md` |
| `/tv/:edition/topics/:topicId` | `pages/tv/TvTopicPage.jsx` | `../TRACKERS/machafi-tv/TV_TOPIC_PAGE_MAP.md` |
| `/tv/:edition/search` | `pages/tv/TvSearchPage.jsx` | `../TRACKERS/machafi-tv/TV_SEARCH_PAGE_MAP.md` |
| `/tv/:edition/live` | `pages/tv/TvLivePage.jsx` | `../TRACKERS/machafi-tv/TV_LIVE_PAGE_MAP.md` |
| `/tv/:edition/schedule` | `pages/tv/TvSchedulePage.jsx` | `../TRACKERS/machafi-tv/TV_SCHEDULE_PAGE_MAP.md` |
| `/tv/:edition/article/:slug` | `pages/tv/TvArticlePage.jsx` | `../TRACKERS/machafi-tv/TV_ARTICLE_PAGE_MAP.md` |

## Admin panels — routes + trackers

| Path | Page | Tracker |
|------|------|---------|
| `/healthservices/admin/*` | `pages/admin/HealthServicesAdminPage.jsx` | `../TRACKERS/machafi-services-admin/HEALTHSERVICES_ADMIN_PANEL_MAP.md` |
| `/machafitv/admin/*` | `pages/admin/MachafiTvAdminPage.jsx` | `../TRACKERS/machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md` |

## How “ready” pages are for backend endpoints

Readiness unchanged: **no shared HTTP client**; mocks in **`src/data/*.ts`**.

### Per-path readiness (high level)

| Readiness | Area | Meaning |
|-----------|------|---------|
| **Low — UI + mocks** | All Services pages under `/healthservices/*` | Swap mocks for API layer |
| **Low — forms** | `/healthservices/about`, `/donations`, `/consultations` | POST not wired |
| **Low — UI + mocks** | Machafi TV under `/tv/:edition/*` | `tvMock.ts` + i18n; wire HLS, CMS, **`/machafitv/admin`** per **`../TRACKERS/machafi-tv-admin/`** + public TV trackers |
| **Placeholder only** | Admin shells **`/healthservices/admin/*`**, **`/machafitv/admin/*`** | UI stub; RBAC + modules per **`../TRACKERS/machafi-services-admin/`** and **`../TRACKERS/machafi-tv-admin/`** |

## Practical next steps for endpoints

1. Add **`src/api/client.ts`** with `import.meta.env.VITE_API_URL`.
2. Map mocks to JSON contracts; add TanStack Query or similar if desired.
3. Wire Machafi TV **`/machafitv/admin`** and stream settings to PHP (namespaced **`api/admin/machafitv/...`**) when ready.

---

*Aligned with `frontend/src/App.tsx` after the gateway + `/healthservices` + `/tv` routing update.*

# Webapp pages overview

This document describes the **active React frontend** at `frontend/` (Vite + React Router). Older copies under `legacy/` and `backupp/` are **not** counted here.

## Summary

| Metric | Value |
|--------|------:|
| Page components (`frontend/src/pages/`) | **14** |
| Registered routes in `App.tsx` | **14** |
| Distinct URL patterns | **13** static + **`/news/:id`** (dynamic) |

## App structure

```
BrowserRouter (main.tsx)
└── App.tsx
    ├── DocumentTitle
    ├── Header (fixed)
    ├── Spacer (header offset)
    ├── <main>
    │   └── <Routes> … page components …
    └── Footer
```

All routed screens share the same chrome (header + footer). There is **no** nested layout router beyond this single `<Routes>` block.

## Routes and pages

Routes are defined in `frontend/src/App.tsx`.

| # | Path | Page component | Primary data / notes |
|---|------|----------------|----------------------|
| 1 | `/` | `HomePage.jsx` | Inline copy, stats, links; no `src/data` imports |
| 2 | `/about` | `AboutContactPage.jsx` | i18n strings; contact form is **client-only** (no POST) |
| 3 | `/library` | `LibraryPage.jsx` | `src/data/libraryBooks.ts` |
| 4 | `/service` | `ServicesPage.jsx` | `src/data/services.ts` |
| 5 | `/donations` | `DonationsPage.jsx` | `src/data/donations.ts`; pay button scrolls to footer (placeholder) |
| 6 | `/news` | `NewsPage.jsx` | `src/data/news.ts` |
| 7 | `/news/:id` | `NewsDetailPage.jsx` | `getNewsArticleById` from `src/data/news.ts` |
| 8 | `/live` | `LivePage.jsx` | `src/data/live.ts` |
| 9 | `/pharmacies` | `PharmaciesPage.jsx` | `src/data/pharmacies.ts`, `src/data/algeria-data.js`; Leaflet + OSM tiles |
| 10 | `/ambulances` | `AmbulancesPage.jsx` | `src/data/ambulances.ts`, `algeria-data`; maps |
| 11 | `/accommodations` | `AccommodationsPage.jsx` | `src/data/housing.ts`, `algeria-data`; maps + geolocation API |
| 12 | `/programs` | `ProgramsPage.jsx` | `src/data/programs.ts` |
| 13 | `/hospitals` | `HospitalsPage.jsx` | `src/data/hospitals.ts`, `algeria-data` |
| 14 | `/consultations` | `ConsultationsPage.jsx` | `src/data/consultations.ts`, `algeria-data`; booking modal **simulates** success |

Shared static reference data: `src/data/algeria-data.js` (wilayas / communes) is used on several listing pages for filters.

## How “ready” pages are for backend endpoints

Readiness is judged from the current codebase: **there is no shared HTTP client** (`fetch` / `axios` / React Query, etc.) under `frontend/src`, and list/detail UIs are driven by **local mocks** in `frontend/src/data/*.ts` (plus `algeria-data.js`).

### Overall

| Area | Status |
|------|--------|
| **Environment / API base URL** | No `VITE_*` API config pattern observed in source usage |
| **Auth / tokens** | Not implemented in the reviewed frontend |
| **Loading & errors** | Not wired for remote failures (data is synchronous imports) |
| **Forms → backend** | Contact, donations “checkout”, and consultation booking do **not** call an API yet |

### Per-page readiness (high level)

| Readiness | Pages | Meaning |
|-----------|-------|---------|
| **Low — UI + mocks only** | All 14 | Replace imports from `src/data/*` with API-driven hooks/services; add loading/error states |
| **Low — forms need endpoints** | `/about`, `/donations`, `/consultations` | Submit handlers are placeholders or UX-only |
| **Medium — clear swap points** | `/news`, `/news/:id`, `/library`, `/live`, listing pages with maps | Data structures already mimic domain entities; swap mock modules for `fetch` + types |

**Maps:** Several pages use **OpenStreetMap** tiles and **Google Maps** direction URLs. Those are third-party services, not your API—only **marker/listing data** would move to your backend.

## Practical next steps for endpoints

1. Add a small API layer (e.g. `src/api/client.ts` with base URL from `import.meta.env.VITE_API_URL`).
2. For each page, map the existing mock shape in `src/data/*.ts` to the real JSON contract (adjust types as needed).
3. Replace synchronous imports with `useEffect` + state, or a data library (TanStack Query, etc.) once endpoints exist.
4. Wire form `onSubmit` handlers to POST/PUT routes and surface validation and server errors in the UI.

---

*Generated from `frontend/src/App.tsx` and `frontend/src/pages/` as of the repo state used for this audit.*

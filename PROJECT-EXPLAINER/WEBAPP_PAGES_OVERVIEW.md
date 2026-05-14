# Webapp pages overview

This document tracks **`frontend/src/App.tsx`** routing on **[https://kgc-machafi.net/](https://kgc-machafi.net/)** (and the live **Vercel** build **[https://kgcmachafi.vercel.app](https://kgcmachafi.vercel.app/)**): **gateway**, **Machafi Services** under **`/healthservices/*`**, **Machafi TV** under **`/tv/:edition/*`**, and **admin placeholders**. Full product map: **`PLATFORM_SHELL_LAYOUT.md`**. Historical `legacy/` / `backupp/` trees were **removed** from the repo (2026-05-13); routing truth is **`frontend/`** only.

## Hosting & database (memorized constraint)

| Item | Decision |
|------|----------|
| **Server** | **GoDaddy** hosting (Linux + Apache + PHP) |
| **Database** | **SQL** = **MySQL** or **MariaDB** (cPanel typical) |
| **Detail** | **`HOSTING_AND_DATABASE.md`** |
| **JSON API rules** | **`API_STANDARD_GODADDY_MYSQL.md`** |
| **SPA → API** | Same origin **`VITE_API_BASE_URL=/api`** → `https://kgc-machafi.net/api/...` (see `frontend/src/config.ts`, `frontend/.env.example`) |

**Endpoint source of truth per page:** each data-backed route has a tracker under **`TRACKERS/`** with a section **“Full endpoint design — GoDaddy + MySQL (SQL)”** where APIs apply. **25** tracker files total: **gateway** (`../TRACKERS/gateway/GATEWAY_PAGE_MAP.md`), **13** Services maps, **9** TV maps, **2** admin maps. The gateway page is **UI + routing only** (no SQL section).

---

## Summary

| Metric | Value |
|--------|------:|
| Gateway | **`/`** → `GatewayPage.jsx` — tracker **`../TRACKERS/gateway/GATEWAY_PAGE_MAP.md`** |
| Machafi Services page components (`frontend/src/pages/` root, shared by routes) | **14** |
| Services routes (canonical) | Under **`/healthservices/*`** (+ legacy redirects from old flat paths) |
| Machafi TV routes per edition | **index**, **`desk`**, **`activity`**, **`topics/:topicId`**, **`search`**, **`live`**, **`schedule`**, **`article/:slug`** |
| Admin placeholders | **`/healthservices/admin/*`**, **`/machafitv/admin/*`** (see admin trackers below) |

Path helpers: **`frontend/src/routes/paths.ts`** (`servicesPath`, `tvEditionPath`, `SERVICES_BASE`).

---

## App structure

```
BrowserRouter (main.tsx)
└── App.tsx
    ├── DocumentTitle (global — gateway, services, TV, admin)
    └── Routes
        ├── /                          → GatewayPage  (see ../TRACKERS/gateway/GATEWAY_PAGE_MAP.md)
        ├── /healthservices/admin/*    → HealthServicesAdminPage (placeholder)
        ├── /machafitv/admin/*         → MachafiTvAdminPage (placeholder)
        ├── /tv/:edition/*             → TvShellLayout → Outlet (Tv* pages)
        ├── /healthservices/*          → ServicesLayout → Outlet (all directory pages)
        ├── legacy redirects (/about → /healthservices/about, …)
        └── *                         → Navigate to /
```

**Machafi Services chrome** (header, spacer, footer) lives in **`ServicesLayout.jsx`**. **Machafi TV** uses **`TvShellLayout.jsx`**.

---

## Machafi Services — routes, pages, endpoints (GoDaddy + MySQL)

Canonical paths (legacy URLs without `/healthservices` **redirect**). **PHP** paths are relative to repo **`api/`** tree on server **`public_html/api/`**.

| # | Path | Page | Primary data | Tracker (full SQL + HTTP design) |
|---|------|------|--------------|----------------------------------|
| 1 | `/healthservices` | `HomePage.jsx` | Home feed + stats | `../TRACKERS/machafi-services/HOMEPAGE_MAP.md` |
| 2 | `/healthservices/about` | `AboutContactPage.jsx` | Static + contact POST | `../TRACKERS/machafi-services/ABOUT_PAGE_MAP.md` |
| 3 | `/healthservices/library` | `LibraryPage.jsx` | `library_books` | `../TRACKERS/machafi-services/LIBRARY_PAGE_MAP.md` |
| 4 | `/healthservices/service` | `ServicesPage.jsx` | `services` + settings | `../TRACKERS/machafi-services/SERVICES_PAGE_MAP.md` |
| 5 | `/healthservices/donations` | `DonationsPage.jsx` | campaigns + intents | `../TRACKERS/machafi-services/DONATIONS_PAGE_MAP.md` |
| 6 | `/healthservices/news` | `NewsPage.jsx` | `news_articles` (+ i18n) | `../TRACKERS/machafi-services/NEWS_PAGE_MAP.md` |
| 7 | `/healthservices/news/:id` | `NewsDetailPage.jsx` | detail by id/slug | same |
| 8 | `/healthservices/live` | `LivePage.jsx` | stream + VOD meta | `../TRACKERS/machafi-services/LIVE_PAGE_MAP.md` |
| 9 | `/healthservices/pharmacies` | `PharmaciesPage.jsx` | `pharmacies` + night week | `../TRACKERS/machafi-services/PHARMACIES_PAGE_MAP.md` |
| 10 | `/healthservices/ambulances` | `AmbulancesPage.jsx` | `ambulance_providers` | `../TRACKERS/machafi-services/AMBULANCES_PAGE_MAP.md` |
| 11 | `/healthservices/accommodations` | `AccommodationsPage.jsx` | `housing_listings` | `../TRACKERS/machafi-services/HOUSING_PAGE_MAP.md` |
| 12 | `/healthservices/programs` | `ProgramsPage.jsx` | `programs` / schedule | `../TRACKERS/machafi-services/PROGRAMS_PAGE_MAP.md` |
| 13 | `/healthservices/hospitals` | `HospitalsPage.jsx` | `hospitals` | `../TRACKERS/machafi-services/HOSPITALS_PAGE_MAP.md` |
| 14 | `/healthservices/consultations` | `ConsultationsPage.jsx` | doctors + specialties | `../TRACKERS/machafi-services/CONSULTATIONS_PAGE_MAP.md` |

---

## Machafi TV — routes + endpoints

Edition **`ar`**, **`fr`**, **`en`**. Shared design: **`../TRACKERS/machafi-tv/TV_SHELL_PAGE_MAP.md`** (cross-route TV API + tables). Each page tracker adds route-specific methods.

| Path | Page | Tracker |
|------|------|---------|
| `/tv/:edition` | `TvHomePage.jsx` | `../TRACKERS/machafi-tv/TV_HOME_PAGE_MAP.md` |
| `/tv/:edition/desk` | `TvDeskPage.jsx` | `../TRACKERS/machafi-tv/TV_DESK_PAGE_MAP.md` |
| `/tv/:edition/activity` | `TvActivityPage.jsx` | `../TRACKERS/machafi-tv/TV_ACTIVITY_PAGE_MAP.md` |
| `/tv/:edition/topics/:topicId` | `TvTopicPage.jsx` | `../TRACKERS/machafi-tv/TV_TOPIC_PAGE_MAP.md` |
| `/tv/:edition/search` | `TvSearchPage.jsx` | `../TRACKERS/machafi-tv/TV_SEARCH_PAGE_MAP.md` |
| `/tv/:edition/live` | `TvLivePage.jsx` | `../TRACKERS/machafi-tv/TV_LIVE_PAGE_MAP.md` |
| `/tv/:edition/schedule` | `TvSchedulePage.jsx` | `../TRACKERS/machafi-tv/TV_SCHEDULE_PAGE_MAP.md` |
| `/tv/:edition/article/:slug` | `TvArticlePage.jsx` | `../TRACKERS/machafi-tv/TV_ARTICLE_PAGE_MAP.md` |

**TV API base (logical):** `/api/public/tv/{edition}/...` — PHP under `api/public/tv/` (new namespace; mirror patterns from `api/public/news.php`).

---

## Admin panels — routes + endpoints

| Path | Page | Tracker |
|------|------|---------|
| `/healthservices/admin/*` | `HealthServicesAdminPage.jsx` | `../TRACKERS/machafi-services-admin/HEALTHSERVICES_ADMIN_PANEL_MAP.md` |
| `/machafitv/admin/*` | `MachafiTvAdminPage.jsx` | `../TRACKERS/machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md` |

Admin JSON remains under **`/api/admin/...`** with **session + RBAC** (see **`API_STANDARD_GODADDY_MYSQL.md`**).

---

## Readiness vs implementation

| Layer | State |
|-------|--------|
| **UI** | Services + TV shells largely built (`frontend/src/pages/**`). |
| **HTTP client** | Planned `frontend/src/services/*` — use `appConfig.apiBaseUrl`. |
| **PHP + MySQL** | Specified per **tracker** “Full endpoint design” sections; implement on GoDaddy host. |

### Practical order (aligned with `NEXT_MOVES.md`)

1. Implement **read-only** public endpoints with **MySQL** + pagination (`news`, then **one directory** e.g. pharmacies).
2. Wire SPA through **`services/`** client.
3. Expand admin **`/api/admin/*`** with RBAC before enabling writes from the web.

---

*Aligned with `frontend/src/App.tsx` after the gateway + `/healthservices` + `/tv` routing update. Hosting + SQL constraint recorded **2026**.*


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

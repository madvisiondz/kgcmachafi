# Next steps — webapp perfection (production level)

Actionable roadmap to take **MACHAFI** from **UI-first + mocks** to **production-grade**: reliable, secure, fast, observable, and maintainable. Public surface: **https://kgc-machafi.net/** · primary code: **`frontend/`**.

**Companion documents**

| File | Role |
|------|------|
| **`NEXT_MOVES.md`** | Strategy: value, readiness study, tracker-informed **next moves** (above this checklist); **§10** = next-session **perfection** sprint order |
| **`ARCHITECTURE_PRODUCTION_READINESS.md`** | ASCII stack + **% to 100%** per layer (**L1–L13** + cross-cuts). Use it when reprioritising. |
| **`WORKING_PLAN.md`** | Path-sheet: what is done + unchecked forward rows. |
| **`PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md`** | Release smoke matrix (**Phase A5**). |
| **`PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`** | Beginner **GoDaddy cPanel** deploy: MySQL import, `api/` upload, **`admin-config.php`** path note, `npm run build` + **`dist/`** upload, `.htaccess`, admin login URL. |

Keep **`PROJECT-EXPLAINER/PROJECT_STATUS.md`** and **`PROJECT-EXPLAINER/PROMPT_LOG.md`** updated as you complete rows below.

---

## Readiness snapshot (from architecture doc)

**Holistic ~41%** = naive average of architectural layers (UI high, integration/ops rising). Raise **L6, L9, L13** next for “felt” production quality.

| Layer | ID | ~% | Primary phases that move it |
|-------|-----|-----|------------------------------|
| Edge & DNS | L1 | 28% | G3, F1, hosting runbooks (J) |
| Static hosting / deploy | L2 | 52% | A1, G3, G4, J4 |
| Client SPA runtime | L3 | 76% | A3, C3, C4, I1, G2 |
| Services UI | L4a | 80% | B*, A4 |
| TV UI / shell | L4b | 41% | B*, E*, A4 |
| Admin UI | L4c | **~50%** | D2 (v1 shipped), E3, C2, C3 |
| Client API boundary | L5 | 32% | **C1**, D1 |
| HTTP API (PHP) | L6 | 44% | D1–D5, I4 |
| Data tier | L7 | 35% | D5 |
| Media / uploads | L8 | 40% | G1, L8 ops |
| Security & compliance | L9 | 23% | **F*** |
| Performance | L10 | 46% | **G*** |
| SEO & sharing | L11 | 29% | **H*** |
| Quality & CI | L12 | 28% | **I1**–I3 |
| Observability | L13 | 12% | **J1**–J4 |
| i18n / RTL (cross-cut) | — | 74% | B5, A4, Rule #1 |
| Docs / trackers (cross-cut) | — | 82% | Rule #0 |

---

## Execution status — Sprint 1 (ship confidence kickoff)

Track quick wins here; mirror in **`WORKING_PLAN.md`** §10 if you use that as master.

| Step | Status | Deliverable in repo |
|------|--------|------------------------|
| **A1** Environments documented | **Done** | `frontend/.env.example` |
| **A2** Central config | **Done** | `frontend/src/config.ts`, `frontend/src/vite-env.d.ts` |
| **A3** Error boundary | **Done** | `frontend/src/components/RootErrorBoundary.tsx`, wired in `frontend/src/main.tsx`; i18n `common.error*` keys |
| **A4** Loading / empty audit | **Done** (extended slice) | News + Pharmacies + Hospitals + **Ambulances**: skeleton + `ListFetchErrorBanner` + `common.list*` i18n; optional **`VITE_LIST_BOOTSTRAP_MS`** for skeleton QA |
| **A5** Smoke checklist | **Done** (template) | `PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md` — fill **Pass** checkboxes per release |

**Also done:** `frontend/.gitignore` ignores `.env` / `.env.local` so secrets are not committed by mistake.

**Next execution slice:** run **A5** smoke on a staging build; extend **D1** — wire **`VITE_PROGRAMS_API`**, **`VITE_LIBRARY_API`**, **`VITE_HOME_API`**, **`VITE_LIVE_API`**, **`VITE_SETTINGS_API`**, **`VITE_SERVICES_CATALOG_API`**, **`VITE_CONSULTATIONS_API`**, **`VITE_DONATIONS_API`** using existing `api/public/*.php` (see **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`**); **news / pharmacies / hospitals / ambulances / accommodations** flags already have loaders where noted in **`PROJECT_STATUS.md`**.

---

## Phase A — Ship confidence (before “real” traffic)

**Goal:** Nothing embarrassing breaks; baseline quality is measurable. **Targets layers:** L2, L3, cross-cut docs.

| # | Step | Status | Why |
|---|------|--------|-----|
| A1 | **Define environments** — `dev` / `staging` / `prod` base URLs, API origin, TV stream origin | **Done** | `.env.example` removes “works on my machine” drift |
| A2 | **Central config** — read `import.meta.env.VITE_*` once | **Done** | `config.ts` — no scattered magic strings |
| A3 | **Error boundary** — shell fallback + reload + gateway link | **Done** | Avoid blank screen on runtime errors (**L3**) |
| A4 | **Loading & empty states audit** — lists/grids + future async routes | **In progress** (News, Pharmacies, Hospitals, **Ambulances** — bootstrap list UX) | Professional under slow networks (**L4a/L4b**) |
| A5 | **Smoke checklist** — gateway, Services home, TV edition, admins × RTL/LTR × breakpoints | **Template ready** | `PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md` |

---

## Phase B — UX & visual perfection

**Targets:** L4a (78% →), L4b (41% →), i18n cross-cut (74% →).

| # | Step | Why |
|---|------|-----|
| B1 | **Header scroll collapse** — full QA per **`PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md`** (iOS + Android + desktop) | Sticky header jank |
| B2 | **Home page** — legacy parity + Health-in-Drama embed policy | Credibility anchor |
| B3 | **Pixel pass** or **design tokens** doc | Visual consistency |
| B4 | **UI kit** — Card, Button, Input, Select, FilterPanel (from Hospitals pattern) | Velocity + fewer regressions |
| B5 | **Arabic stress** — overflow, modals, nav | RTL bugs |

---

## Phase C — Frontend architecture (production SPA)

**Targets:** L3, **L5 (14% →)**, L12.

| # | Step | Why |
|---|------|-----|
| C1 | **`services/` API client** — typed `fetch`, timeouts, normalized errors | Unlocks **L5** + clean **L6** consumption (**started**: `http.ts`, `news.ts`, **`pharmacies.ts`**, **`hospitals.ts`**, list loaders) |
| C2 | **Auth model** — cookies vs bearer; CSRF doc; align `api/admin/auth/*.php` | **L4c** + **L9** |
| C3 | **`React.lazy`** for TV + admin chunks | **L3** bundle (**G2**) |
| C4 | **Types at boundaries** — DTOs + hooks | Fewer integration bugs |
| C5 | **CI repo hygiene** — `npm ci`; plan to untrack `node_modules` for pipelines | **L12** |

---

## Phase D — Backend & data (Machafi Services)

**Targets:** **L6**, **L7**, **L5**.

| # | Step | Why |
|---|------|-----|
| D1 | **First read-only wiring** — settings + directories + news → `api/public/*.php` | **In progress / expanded**: news **`VITE_NEWS_API`** → `news.php`; pharmacies **`VITE_PHARMACIES_API`**; hospitals **`VITE_HOSPITALS_API`**; **ambulances** **`VITE_AMBULANCES_API`**; **accommodations** **`VITE_ACCOMMODATIONS_API`**. **Implemented PHP not yet SPA-wired:** programs, books/library, services, home, live, donations (GET), settings, consultations (GET), contact (POST) — matrix **`API_ENDPOINT_REGISTRY.md`**. |
| D2 | **Health Services admin** — nested **`/healthservices/admin/*`** SPA (login, CSRF, CRUD modules, dashboard) + PHP hardening (`auth` envelopes, optional columns). **Remaining:** envelope parity on every legacy admin PHP file, stricter RBAC UX for `editor` vs `admin`, **`React.lazy`** split (**C3**). Tracker: **`TRACKERS/machafi-services-admin/HEALTHSERVICES_ADMIN_PANEL_MAP.md`**. | **L4c** (**v1 done**) |
| D3 | **Rate limits + validation** on writes | **L9** |
| D4 | **CORS + `SameSite`** if SPA/API origins differ | Session reliability |
| D5 | **Migrations discipline** | **L7** |

---

## Phase E — Machafi TV (broadcast)

**Targets:** **L4b**, **L8**, edge (**L1**).

| # | Step | Why |
|---|------|-----|
| E1 | **HLS** (e.g. hls.js) behind `appConfig.featureTvHls` + `VITE_TV_STREAM_URL` | Core “live” promise |
| E2 | **Replace `tvMock`** with API per edition + cache policy | Editorial independence |
| E3 | **TV admin + CMS** per **`TRACKERS/machafi-tv-admin/`** | Operators (**L4c**) |
| E4 | **CDN + cache headers** for segments/thumbs | Cost + stability |

---

## Phase F — Security & compliance

**Target:** **L9** (23% →).

| # | Step | Why |
|---|------|-----|
| F1 | **Security headers** — CSP (report-only first), frame-ancestors, HSTS | XSS / clickjacking |
| F2 | **Secrets** — never in Git; proxy if needed | Hygiene |
| F3 | **Dependency automation** — audit, Dependabot/Renovate | CVE surface |
| F4 | **Forms** — spam controls + server validation | Abuse |
| F5 | **Privacy / cookies** if analytics | Compliance |

---

## Phase G — Performance & resilience

**Target:** **L10**, **L1/L2** delivery.

| # | Step | Why |
|---|------|-----|
| G1 | **Image pipeline** — `srcset`, modern formats | LCP |
| G2 | **Bundle budget** + code-split (**C3**) | Mobile |
| G3 | **Caching policy** — HTML vs hashed assets | Repeat visits |
| G4 | **`/health` or ping** | Uptime (**L2**) |
| G5 | **Service worker** | Only with a clear update strategy |

---

## Phase H — SEO & discoverability

**Target:** **L11** (29% →).

| # | Step | Why |
|---|------|-----|
| H1 | **Meta + OG** per route; SSR/prerender if SEO-critical | Sharing / search |
| H2 | **`robots.txt` + `sitemap.xml`** | Crawl hygiene |
| H3 | **Canonical URLs** — prefer `/healthservices/...` | Duplicate URLs |

---

## Phase I — Testing & automation

**Target:** **L12** (17% →).

| # | Step | Why |
|---|------|-----|
| I1 | **CI** — `npm run lint` + `npm run build` on push | Regression gate (**done**: `.github/workflows/frontend-ci.yml` on `frontend/**`) |
| I2 | **Playwright / Cypress** — gateway → Services; gateway → TV; language persists | E2E smoke |
| I3 | **Visual regression** (optional) | CSS drift |
| I4 | **API contract tests** | **L6** stability |

---

## Phase J — Observability & operations

**Target:** **L13** (12% →).

| # | Step | Why |
|---|------|-----|
| J1 | **Client logging** + correlation id | Debuggability |
| J2 | **RUM / Web Vitals** | Perf truth |
| J3 | **Sentry + source maps** | Prod stack traces |
| J4 | **Runbooks** — rollback, secrets, kill-switch TV | Ops |

---

## Suggested order (pragmatic)

1. **Finish A** — extend **A4** to remaining high-traffic lists; run and fill **`SMOKE_CHECKLIST_PRODUCTION.md`** on a staging build.  
2. **I1** — CI is live in GitHub Actions; keep green on every push touching `frontend/`.  
3. **B** + **B5** — UX and RTL before widening surface area.  
4. **C1** + **D1** — **`NewsDetailPage`** + news list use **`VITE_NEWS_API`**; **Pharmacies** uses **`VITE_PHARMACIES_API`**; **Hospitals** uses **`VITE_HOSPITALS_API`**; next: **settings** or tighten DTO types; keep **`config.apiBaseUrl`** as the single origin.
5. **C2** + **D2** — tighten **RBAC** + **admin PHP envelope** parity (Health Services admin **v1** is live under **`/healthservices/admin`**; sensitive actions already use **`require_role('admin')`** where noted in PHP).  
6. **F1–F3** in parallel as traffic approaches.  
7. **G** + **H** when marketing/SEO matters.  
8. **E** when TV is no longer “shell only.”  
9. **J** as soon as more than one person deploys or on-call exists.  

---

## Quick reference — files to keep updated

| Topic | File |
|-------|------|
| Readiness % / layers | **`ARCHITECTURE_PRODUCTION_READINESS.md`** |
| Path-sheet / done vs todo | **`WORKING_PLAN.md`** |
| Strategy & prioritisation | **`NEXT_MOVES.md`** |
| Product status | **`PROJECT-EXPLAINER/PROJECT_STATUS.md`** |
| Session log | **`PROJECT-EXPLAINER/PROMPT_LOG.md`** |
| Release smoke | **`PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md`** |
| Routing truth | **`frontend/src/App.tsx`**, **`PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md`** |
| Platform map | **`PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md`** |
| GoDaddy / cPanel deploy | **`PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`** |
| Env template | **`frontend/.env.example`** |
| Runtime config | **`frontend/src/config.ts`** |
| HTTP client (`services/`) | **`frontend/src/services/http.ts`**, **`frontend/src/services/news.ts`**, **`frontend/src/services/pharmacies.ts`**, **`frontend/src/services/hospitals.ts`** |

---

*Living checklist: tick execution table + phases in git; bump layer % in `ARCHITECTURE_PRODUCTION_READINESS.md` when milestones land.*


---

*Last updated: **2026-05-14** — Health Services **admin SPA v1** (`/healthservices/admin/*`), **`GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`**, auth/envelope PHP updates; Gateway + TV branding, Vercel https://kgcmachafi.vercel.app ; doc sync.*

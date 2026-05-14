# MACHAFI — ASCII architecture & production readiness by layer

This document mirrors the **same product story** as `WORKING_PLAN.md` and `NEXT_STEPS_PRODUCTION.md`, but as **ASCII diagrams** plus a **% toward 100% production level** for each architectural layer.

---

## What “100% production level” means here

**100%** = suitable for **sustained public traffic** on **https://kgc-machafi.net/** with **real data**, **secured admin**, **broadcast-grade TV** where promised, **observable** failures, **repeatable deploys**, and **defensible** security/privacy — not “UI demo complete.”

**Percentages are engineering estimates** (not automated metrics). Update them when you ship milestones; keep `PROJECT-EXPLAINER/PROJECT_STATUS.md` aligned.

---

## 1. High-level vertical stack (request → data)

Traffic flows **top → bottom**. Each box is one **layer**; the right column is **% to production** for that layer alone.

```
                                    ┌──────────────────────────────────────┐
                                    │  End user (browser / mobile web)      │
                                    └───────────────────┬──────────────────┘
                                                        │
    ┌───────────────────────────────────────────────────▼───────────────────────────────────────────────────┐
    │  L1  EDGE & DNS  (CDN, TLS, HTTP/2, caching rules, WAF)                                              28% │
    └───────────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                                        │
    ┌───────────────────────────────────────────────────▼───────────────────────────────────────────────────┐
    │  L2  STATIC HOSTING  (origin server, `ready-to-deploy/`, `.htaccess`, SPA fallback)                 52% │
    └───────────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                                        │
    ┌───────────────────────────────────────────────────▼───────────────────────────────────────────────────┐
    │  L3  CLIENT SPA  (Vite build → `frontend/dist/`, React Router, layouts, pages)                     76% │
    └───────────────────────────────────────────────────┬───────────────────────────────────────────────────┘
                                                        │
              ┌────────────────────────────┬────────────┴────────────┬────────────────────────────┐
              │                            │                         │
              ▼                            ▼                         ▼
    ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
    │ L4a Machafi Services UI │  │ L4b Machafi TV shell    │  │ L4c Admin shells        │
    │ /healthservices/*       │  │ /tv/:edition/*          │  │ placeholders only       │
    │ mocks + full page set   │  │ tvMock + routes         │  │ /healthservices/admin   │
    │ prod readiness:  78%    │  │ prod readiness:  41%    │  │ /machafitv/admin        │
    └────────────┬────────────┘  └────────────┬────────────┘  │ prod readiness:  12%    │
                 │                            │                └────────────┬────────────┘
                 │                            │                             │
                 └────────────────────────────┴─────────────────────────────┘
                                         │
    ┌────────────────────────────────────▼────────────────────────────────────────────────────────────────────┐
    │  L5  CLIENT API BOUNDARY  (`frontend/src/services/*` — `getJson`, timeouts, news loader)          32% │
    └────────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                           │
    ┌──────────────────────────────────────▼────────────────────────────────────────────────────────────────┐
    │  L6  HTTP API  (`api/` PHP — public + admin routes, sessions, validation)                            44% │
    └──────────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                           │
    ┌──────────────────────────────────────▼────────────────────────────────────────────────────────────────┐
    │  L7  DATA TIER  (MySQL or equivalent — schema, migrations, backups)                                  35% │
    └──────────────────────────────────────┬────────────────────────────────────────────────────────────────┘
                                           │
    ┌──────────────────────────────────────▼────────────────────────────────────────────────────────────────┐
    │  L8  MEDIA & UPLOADS  (`uploads/`, object storage, virus scan, size limits)                            40% │
    └────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Reading the stack:** today the SPA is **strong in L3 + L4a UI**; **L5 is underway** (`services/http.ts`, `services/news.ts`, list hooks — still no auth headers / full DTO coverage); **L6 exists** but is **not fully aligned** with the new router and product split; **L7–L8** are assumed from the legacy era — treat % as **“confidence for new product on prod”**, not “database exists.”

---

## 2. Horizontal view — two products on one domain

**SPA today:** also deployed at **https://kgcmachafi.vercel.app** (Vercel) with the same route tree as below; custom domain **kgc-machafi.net** remains the long-term production target.

```
  https://kgc-machafi.net/
           │
           ▼
  ┌────────────────────┐
  │   /  GatewayPage   │  72%  (UX done; prod: env, consent, error boundary)
  └─────────┬──────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
┌────────────────────────┐  ┌────────────────────────┐
│ /healthservices/*      │  │ /tv/:edition/*         │
│ ServicesLayout         │  │ TvShellLayout          │
│ prod readiness:  78%   │  │ prod readiness:  41% │
└────────────────────────┘  └────────────────────────┘
       │               │
       ▼               ▼
┌──────────────────────────────────────────────────────────────┐
│ Machafi Services detail:  UI 78% · API wiring 26% · admin 11% │
│ mocks: `frontend/src/data/*`                                  │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│ Machafi TV detail:  shell 41% · HLS + CMS + stream path 18%   │
│ mocks: `frontend/src/data/tvMock.ts`                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Layer table — % to 100% and what unlocks the rest

| ID | Layer | % | What exists today | What moves toward 100% |
|----|--------|---|-------------------|-------------------------|
| **L1** | Edge & DNS (CDN, TLS, cache, WAF) | **28%** | Domain known; repo does not define CDN/WAF | CDN in front of origin, TLS hardening, cache rules for HTML vs assets |
| **L2** | Static hosting & deploy path | **52%** | `frontend/dist/`, `ready-to-deploy/public_html/`, `.htaccess` patterns | Automated deploy, staged rollback, health checks |
| **L3** | Client SPA runtime (build, router, shell) | **76%** | Vite + React 19 + RR7 + `App.tsx` + layouts | Error boundaries, lazy routes, env-based config, bundle budget in CI |
| **L4a** | Machafi Services UI | **80%** | Full page set under `/healthservices/*`, trackers, i18n, list skeleton/error on News/Pharmacies/Hospitals | Pixel pass, RTL audit, extend async states to remaining lists |
| **L4b** | Machafi TV UI & editorial shell | **41%** | `/tv/ar|fr|en/*`, `TvShellLayout`, desk/activity/search/live/schedule/article | HLS player, real feeds, edition CMS, stream admin |
| **L4c** | Admin UI (both products) | **12%** | Placeholder routes only | Real panels + RBAC per `TRACKERS/*-admin/` |
| **L5** | Client API boundary (`services/`) | **32%** | `frontend/src/services/http.ts`, `news.ts`, `hooks/useBootstrapList.ts` | Auth headers, DTO coverage, no raw `fetch` in pages |
| **L6** | HTTP API (`api/` PHP) | **44%** | Many `public/` + `admin/` endpoints | Contract tests with SPA, versioning, rate limits, CORS/cookie policy |
| **L7** | Data tier | **35%** | Implied by legacy PHP | Migrations discipline, backup/restore runbooks, PII handling |
| **L8** | Media & uploads | **40%** | `uploads/` in repo | CDN for media, scanning, quotas, non-repo storage for prod |
| **L9** | Security & compliance | **23%** | Standard React app; no CSP doc in repo | CSP, secrets hygiene, form abuse controls, privacy/cookies if needed |
| **L10** | Performance & resilience | **46%** | Vite defaults, some image work | `srcset`, LCP budget, RUM, caching review |
| **L11** | SEO & shareability | **29%** | `DocumentTitle.jsx` | OG/meta per route, sitemap/robots, prerender/SSR if SEO-critical |
| **L12** | Quality & automation | **28%** | GitHub Actions `frontend-ci.yml` + local lint/build | E2E smoke, API contract tests, bundle budget in CI |
| **L13** | Observability & ops | **12%** | None in repo | Logging, metrics, Sentry/source maps, runbooks |

---

## 4. Cross-cutting concerns (not a separate “tier” but % each)

These span several layers; track them in `NEXT_STEPS_PRODUCTION.md`.

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  INTERNATIONALIZATION (AR / FR / EN, RTL, Rule #1)              74%     │
  │  · `I18nProvider` + `translations.ts` + `dir`/`lang` on <html>          │
  │  · Remaining: a11y + copy overflow audit on every new async view          │
  └─────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────────────────┐
  │  DOCUMENTATION & TRACKERS (Rule #0)                              82%     │
  │  · `PROJECT-EXPLAINER/`, `TRACKERS/`, `WORKING_PLAN.md`                │
  │  · Remaining: keep in lockstep with shipped code only                    │
  └─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Composite “how far is the whole webapp?”

**Naive average** of all **fifteen** numeric rows in §3 (L1–L4c + L5–L13): **~38%** holistic production readiness.

**Interpretation:** the project is **front-loaded** (UI + docs **high**); **integration, security, and ops** are **low** — typical for a deliberate **UI-first rebuild**. As **`L5` + `L6` + `L9` + `L12` + `L13`** rise, the **felt** production % climbs fastest for real users.

Suggested **weighting** if you prefer one KPI (example weights — adjust to your risk tolerance):

| Layer group | Weight | Notes |
|-------------|--------|--------|
| L3 + L4a + L4b (what users see) | 35% | High visibility |
| L5 + L6 + L7 (data truth) | 35% | Correctness |
| L9 + L12 + L13 (trust & repeatability) | 20% | Incidents & velocity |
| L1 + L2 + L8 + L10 + L11 (delivery & reach) | 10% | Scale & discovery |

Recompute your **weighted %** whenever you change weights or layer %.

---

## 6. ASCII — runtime inside the browser (SPA only)

```
  ┌─────────────────────────────────────────────────────────────┐
  │                        main.tsx                              │
  │   StrictMode > I18nProvider > BrowserRouter > App.tsx        │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  App.tsx · Routes                                            │
  │  · /              GatewayPage                         72%    │
  │  · /healthservices/*   ServicesLayout + pages       78%    │
  │  · /tv/:edition/*     TvShellLayout + pages        41%    │
  │  · /healthservices/admin/*  placeholder             12%    │
  │  · /machafitv/admin/*       placeholder             12%    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │  Data today: `frontend/src/data/*` + `tvMock.ts`     ~28%   │
  │  Data target: `services/*` ───────► HTTP ───────► `api/`     │
  └─────────────────────────────────────────────────────────────┘
```

---

## 7. Related files

| File | Role |
|------|------|
| `WORKING_PLAN.md` | Path-sheet: done vs todo checklists |
| `NEXT_STEPS_PRODUCTION.md` | Phased actions + execution status (Sprint 1) |
| `PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md` | Release smoke checklist (**L3** QA) |
| `frontend/src/config.ts` | `VITE_*` runtime config (**L5** prep) |
| `PROJECT-EXPLAINER/FRONTEND_BLOCK_DIAGRAM.md` | Mermaid view of runtime + future boundary |
| `PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md` | Domain → gateway → Services vs TV |

---

*Update the percentages when you merge features or change production scope; date the change in `PROJECT-EXPLAINER/PROMPT_LOG.md`.*


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

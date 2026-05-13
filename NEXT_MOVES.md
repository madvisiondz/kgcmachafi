# NEXT MOVES — strategic study & prioritized execution map

**Audience:** product owner, lead engineer, and AI assistants working the repo.  
**Inputs synthesized:** `PROJECT-EXPLAINER/project-explainer.md`, `PROJECT_STATUS.md`, `PLATFORM_SHELL_LAYOUT.md`, `WEBAPP_PAGES_OVERVIEW.md`, `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`, `PAGE_DATASET_REFERENCE.md`, `RULE_1_LANGUAGE_SWITCHING.md`, all **`TRACKERS/**`**, `ARCHITECTURE_PRODUCTION_READINESS.md`, `NEXT_STEPS_PRODUCTION.md`, `WORKING_PLAN.md`.

**How to use this file:** treat it as the **strategy layer** above `NEXT_STEPS_PRODUCTION.md` (tactics/phases). Revisit after any major release or when business priority shifts (directory vs TV).

---

## 1. Project value (what we are really building)

| Pillar | Source | Implication for “next moves” |
|--------|--------|-------------------------------|
| **Directory-first discovery** | `project-explainer.md` — “help users find health-related services easily”; each page ≈ directory | **Machafi Services** (`/healthservices/*`) is the **economic and trust core**: pharmacies, hospitals, ambulances, housing, consultations, programs, news, live, library, donations, about. |
| **Minimal practical datasets** | `project-explainer.md` — 6–8 essential fields per entity | Backend and admin work should **resist schema creep**; trackers’ endpoint sections should stay **thin JSON contracts**. |
| **Two public products, one domain** | `PLATFORM_SHELL_LAYOUT.md`, `WEBAPP_PAGES_OVERVIEW.md` | **Gateway** chooses **Services** vs **Machafi TV**; TV is **edition-routed** (`/tv/ar|fr|en`) — not the same i18n model as Services (Rule #1 exception). |
| **UI-first, then wire** | `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` | **`services/`** + optional **`VITE_NEWS_API`** are live; extend read paths per trackers before adding heavy client-side fetch in pages. |
| **Operational credibility** | `ARCHITECTURE_PRODUCTION_READINESS.md` (~**38%** holistic) | Highest ROI is **raising L6, L9, L12, L13** — contract tests, security, smoke discipline, observability — alongside **`services/`** coverage. |

**One-line value proposition:** MACHAFI is a **trusted health discovery surface** (directories + content) expanding into a **credible dual-brand web presence** (Services + TV) on **https://kgc-machafi.net/** — production value = **correct data + safe admin + stable UX under RTL and mobile**.

---

## 2. Readiness snapshot (evidence-based)

| Signal | State | Evidence |
|--------|--------|----------|
| **Services UI surface** | Strong | `PROJECT_STATUS.md` — full route set under `/healthservices/*`; trackers complete for 13 service maps. |
| **TV shell** | Mid | Routes + `tvMock`; **L4b ~41%** — no HLS, no CMS, no auth (`ARCHITECTURE_PRODUCTION_READINESS.md`). |
| **Admin** | Weak | **L4c ~12%** — placeholders only; trackers describe future RBAC (`TRACKERS/*-admin/`). |
| **Client ↔ API boundary** | Rising | **L5 ~32%** (layer %) — `services/*` + `useBootstrapList`; **news list + detail** (`VITE_NEWS_API`), **pharmacies** (`VITE_PHARMACIES_API`), **hospitals** (`VITE_HOSPITALS_API`) read PHP when flags on; other routes remain mocks-first until wired. |
| **PHP API** | Exists, growing SPA use | **L6 ~44%** (layer %) — `api/public/*` consumed for **news**, **pharmacies**, **hospitals** + **international_hospitals** when SPA flags enabled; home-feed / settings / remaining directories still ahead. |
| **Quality gates** | Stronger | Phase A list UX slice; **I1 CI** in `.github/workflows/frontend-ci.yml`; **A5** smoke template still needs filled passes per deploy. |
| **CI / observability** | Mid (CI only) | **L12 ~28%** — GitHub Actions lint+build; **L13 ~12%** — no pipeline or RUM in repo beyond CI. |
| **i18n / docs discipline** | Strong | Cross-cuts **~74%** / **~82%** per architecture doc — trackers + Rule #0 are an asset. |

**Strategic diagnosis:** the org has **invested heavily in narrative and UI structure** (trackers + i18n + gateway split). The **next marginal dollar** is **not** another static page — it is **truth on the wire** (read-only APIs + `services/`) + **mechanical quality** (CI + smoke + empty states).

---

## 3. Tracker map (how each cluster informs priority)

### Machafi Services (`TRACKERS/machafi-services/`)

| Tracker | Primary route | Why it matters for “next moves” |
|---------|----------------|----------------------------------|
| `HOMEPAGE_MAP.md` | `/healthservices` | Defines **home-feed** contracts (`GET /api/site/home-feed`, etc.) — **aggregation hub** once any child page is live on API. |
| `PHARMACIES_PAGE_MAP.md` | `/healthservices/pharmacies` | **High-frequency citizen use**; maps + wilaya data already canonical in UI — good **first live directory** candidate. |
| `HOSPITALS_PAGE_MAP.md` | `/healthservices/hospitals` | Explicitly cited in legacy pain (“could not create datasets”) — **high risk** until admin + **minimal schema** proven; do **after** simpler directory or **with** admin CRUD slice. |
| `NEWS_PAGE_MAP.md` | `/healthservices/news` | **Already aligned** in text to `api/public/news.php` / `api/admin/news.php` — **lowest-friction first JSON** integration for “real content” win. |
| `SERVICES_PAGE_MAP.md` | `/healthservices/service` | Aligns to `services` + `settings.services_content` — good **second** wire for “platform settings” narrative. |
| `LIBRARY_PAGE_MAP.md`, `PROGRAMS_PAGE_MAP.md`, `LIVE_PAGE_MAP.md` | library, programs, live | **Media / schedule / stream** complexity — batch after **news + one directory** unless product insists on live MVP. |
| `DONATIONS_PAGE_MAP.md` | `/healthservices/donations` | **Payments + trust** — defer until legal + PSP + server validation (**L9**). |
| `CONSULTATIONS_PAGE_MAP.md` | `/healthservices/consultations` | Sensitive PII / booking — after auth patterns stable (**C2**). |
| `AMBULANCES_PAGE_MAP.md`, `HOUSING_PAGE_MAP.md` | ambulances, accommodations | Maps + geo — reuse **same `services/` + map payload** patterns as pharmacies. |
| `ABOUT_PAGE_MAP.md` | `/healthservices/about` | Mostly static — optional CMS later. |

### Machafi TV (`TRACKERS/machafi-tv/`)

| Cluster | Note |
|---------|------|
| `TV_SHELL`, `TV_HOME`, … | Define **editorial + live** UX; execution depends on **stream URL + CMS** — prioritize only if **broadcast is near-term revenue or brand**. |

### Admin (`TRACKERS/machafi-services-admin/`, `TRACKERS/machafi-tv-admin/`)

| Tracker | Note |
|---------|------|
| `HEALTHSERVICES_ADMIN_PANEL_MAP.md` | **Gate** for trustworthy directory data — schedule **after** first public read API proves contracts. |
| `MACHAFITV_ADMIN_PANEL_MAP.md` | Same for TV — **parallel track** to TV HLS (`NEXT_STEPS` Phase E). |

---

## 4. Strategic forks (choose explicitly)

| Fork | Option A (recommended default) | Option B |
|------|--------------------------------|----------|
| **Primary throughput** | **Services directory truth-on-server** first (trust, SEO long-tail, aligns with `project-explainer.md`) | **TV-first** if broadcast launch is fixed-date |
| **First API** | **News list** (read-only, existing PHP, tracker-aligned) + **one directory** (pharmacies) | Settings-only API (less visible, less motivating) |
| **Hospitals** | **Later** or **with admin CRUD** from day one of wire | Early wire **only** if data governance is already solved |
| **Admin UI** | **After** public read path + `services/` + session story (**C2**) | Never expose placeholder routes on public host without auth |

**Default strategy encoded below:** **Option A** throughout Section 5.

---

## 5. Recommended next moves (ordered, with dependencies)

Each move lists **impact** (user/trust/velocity), **effort**, **unlocks layers**, and **phase** in `NEXT_STEPS_PRODUCTION.md`.

```
  Move 1 ──► Move 2 ──► Move 3
     │            │
     │            └──► Move 4 (parallel after Move 2 starts)
     └──► Move 0 (continuous)
```

### Move 0 — Continuous (always on)

| Action | Rationale | Trackers / memory |
|--------|-----------|-------------------|
| Run **smoke checklist** per deploy | Closes gap between “builds” and “ships” | `PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md` |
| Update **PROMPT_LOG** + **PROJECT_STATUS** + touched **TRACKERS** | Rule #0 | `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md` |

### Move 1 — **Close Phase A quality gate** (short horizon)

| ID | Action | Impact | Effort | Layers | Phase |
|----|--------|--------|--------|--------|-------|
| **1a** | **A4** — Loading / empty states on **3** high-traffic lists: **Pharmacies**, **News**, **Hospitals** (empty + error copy AR/FR/EN) | Trust under slow / empty data | M | L4a, i18n | **A4** |
| **1b** | Fill **smoke checklist** once on staging/prod candidate | Repeatable human gate | S | L2, L3 | **A5** |
| **1c** | **B1** — Header scroll QA on real devices (per `HEADER_SCROLL_ANIMATION.md`) | Removes flagship jank | M | L4a | **B1** |

**Why first:** `PROJECT_STATUS.md` **In progress** already calls out **header + home**; architecture says **L3/L4a** are high but **felt** quality fails if chrome flickers or lists have no empty state when API goes live.

### Move 2 — **Mechanical velocity** (CI)

**Status:** **I1 shipped** — `.github/workflows/frontend-ci.yml` (paths `frontend/**`).

| ID | Action | Impact | Effort | Layers | Phase |
|----|--------|--------|--------|--------|-------|
| **2a** | **I1** — CI: `npm run lint` + `npm run build` in `frontend/` on every push | Stops regressions; enables team scale | S | **L12** | **I1** |

**Why second:** Cheap; unblocks confident parallel work on **Move 3** without manual “did someone run build?”.

### Move 3 — **API beachhead** (the real inflection)

| ID | Action | Impact | Effort | Layers | Phase |
|----|--------|--------|--------|--------|-------|
| **3a** | **`frontend/src/services/`** — `getJson`, timeouts, `ApiError`, **`apiUrl`** from **`config.ts`** | **Shipped (baseline)** — extend to POST/auth + DTOs | M | **L5** | **C1** |
| **3b** | **D1 slice 1** — News list + detail per `NEWS_PAGE_MAP.md` / `news.php` | **Shipped** — **`VITE_NEWS_API`** → list + `?id=` detail; mocks when flag off | M–L | **L6**, L4a | **D1** |
| **3c** | **D1 slice 2** — Pharmacies read per `PHARMACIES_PAGE_MAP.md` | **Shipped** — **`VITE_PHARMACIES_API`** → `pharmacies.php` | L | **L6**, L4a | **D1** |
| **3d** | **News** list + detail use `services/` + bootstrap UX | **Shipped**; keep mocks when API flag off | M | L5, L4a | **C1+D1** |
| **3e** | **D1 slice 3** — Hospitals (Algeria + abroad) per `HOSPITALS_PAGE_MAP.md` | **Shipped** — **`VITE_HOSPITALS_API`** → `hospitals.php` + `international-hospitals.php` | L | **L6**, L4a | **D1** |

**Why this order:** news first (lowest contract risk), then pharmacies (directory + map pattern), then hospitals (richer filters + **commune/city alignment** with admin data). Next marginal win: **mechanical perfection** (B1/B5/A5) **or** next read path (**settings** / **home-feed** / another directory) per staging priority.

### Move 4 — **Home as hub** (after Move 3b succeeds)

| ID | Action | Impact | Effort | Layers | Phase |
|----|--------|--------|--------|--------|-------|
| **4a** | Implement **home-feed** client + UI sections consuming aggregated JSON per `HOMEPAGE_MAP.md` | Delivers “actuality” promise; reuses wired pages | L | L4a, L6 | **D1** + **B2** overlap |

### Move 5 — **Admin & governance** (after public read stable)

| ID | Action | Impact | Effort | Layers | Phase |
|----|--------|--------|--------|--------|-------|
| **5a** | **C2** + **D2** — Session model doc + `/healthservices/admin` real shell + RBAC per `HEALTHSERVICES_ADMIN_PANEL_MAP.md` | Data correctness + security | L | **L4c**, L9, L6 | **C2, D2** |

### Move 6 — **Machafi TV vertical** (parallel only if broadcast priority)

| ID | Action | Impact | Effort | Layers | Phase |
|----|--------|--------|--------|--------|-------|
| **6a** | **E1** HLS behind `appConfig.featureTvHls` + `VITE_TV_STREAM_URL` | Core TV promise | M–L | L4b, L1 | **E1** |
| **6b** | Replace `tvMock` with edition APIs per trackers | Editorial independence | L | L5, L6, L4b | **E2** |
| **6c** | **E3** TV admin per `MACHAFITV_ADMIN_PANEL_MAP.md` | Operations | L | L4c | **E3** |

### Move 7 — **Hardening wave** (after traffic or auth exists)

| Actions | Phase block |
|---------|-------------|
| CSP, secrets audit, rate limits, CORS/cookies, runbooks, RUM, Sentry | **F**, **G**, **H**, **J** |

---

## 6. Impact × effort matrix (prioritisation view)

|  | **Low effort** | **High effort** |
|--|----------------|-----------------|
| **High impact** | **I1** CI, **A5** smoke pass, **B1** header QA, **2a** | **3a–3e** services + wired reads; **B2** home hub |
| **Lower impact** (defer) | Token doc **B3** | Full **TV CMS** **6c**, **Donations** PSP |

---

## 7. Risk register (from memory, explicit)

| Risk | Mitigation | Source |
|------|------------|--------|
| UI blocked on backend again | Keep mocks + feature flag per route until API stable | `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` |
| Hospitals without datasets | Wire only with admin CRUD or defer | User-reported legacy pain + `HOSPITALS_PAGE_MAP.md` |
| RTL regressions on animation | No heavy animation without isolated module + QA | Legacy §2.1, `HEADER_SCROLL_ANIMATION.md` |
| Admin “fake security” | RBAC server-side before exposing write | Legacy §2.3, admin trackers |
| Schema creep | Enforce 6–8 fields discipline in reviews | `project-explainer.md` |

---

## 8. Document cross-reference (single map)

| Need | Open |
|------|------|
| Tactics & checkboxes | `NEXT_STEPS_PRODUCTION.md` |
| Layer % & ASCII stack | `ARCHITECTURE_PRODUCTION_READINESS.md` |
| Done history & path-sheet ticks | `WORKING_PLAN.md` |
| Product done/in progress | `PROJECT_STATUS.md` |
| Session log | `PROJECT-EXPLAINER/PROMPT_LOG.md` |
| Domain / gateway / TV | `PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md` |
| Route table | `PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md` |
| GoDaddy + MySQL + JSON API rules | `PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`, `PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md` |
| Route → columns | `PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` |
| Per-page contracts | `TRACKERS/**/*.md` |

---

## 9. Decision checkpoint (before coding the next epic)

Answer these; if any is “no,” adjust Section 5.

1. Is **public directory truth** the top business outcome for the next 4–6 weeks?  
2. Is there a **staging** host where `VITE_API_BASE_URL` can point safely?  
3. Who **owns** PHP contract changes vs SPA-only changes?  
4. Is **TV launch** date-driven enough to pull **Move 6** ahead of **Move 3c**?

Record answers in `PROJECT-EXPLAINER/PROMPT_LOG.md` when decided.

---

## 10. Next session — “perfection” sprint (recommended order)

**Intent:** raise **felt** quality on the existing surface before widening API scope — aligns **Phase B** + **A5** in `NEXT_STEPS_PRODUCTION.md` and **L4a / i18n** cross-cuts in `ARCHITECTURE_PRODUCTION_READINESS.md`.

| Order | Focus | Do this | Success signal |
|------:|--------|---------|----------------|
| 1 | **B1** Header | **Code:** responsive thresholds + collapsed **`aria-hidden`**, mobile menu a11y + **Escape** + scroll lock + **`prefers-reduced-motion`** on collapse transitions (`HEADER_SCROLL_ANIMATION.md` changelog 2026-05-13). **Still:** run full **QA checklist** on **iOS Safari**, **Android Chrome**, **desktop** × **AR** + **EN**. | Doc checklist passes on real devices; no flicker / underlap. |
| 2 | **A5** Smoke | Execute `PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md` on a **staging** build; fill **Pass** (or log defects). | Checklist reflects one real run, not template-only. |
| 3 | **B5** RTL / Arabic | Stress **long labels** on **News**, **Pharmacies**, **Hospitals** filters + cards; gateway + TV shell if time. | No clipped nav, no broken filter layout, marquee/ticker acceptable in RTL. |
| 4 | **B2** Home | Legacy parity + Health-in-Drama embed policy per `TRACKERS/machafi-services/HOMEPAGE_MAP.md` / product. | Home matches agreed “credibility anchor” bar. |
| 5 | **A4** extend | Same **skeleton + empty + `ListFetchErrorBanner`** on **Ambulances** (`useBootstrapList` + mock resolve today; swap loader when **`api/public/ambulances.php`** exists). **Next:** Programs, Accommodations, or other list-heavy routes. | Same UX class as News/Pharmacies/Hospitals under slow network. |
| 6 | **C4** tighten | Optional: stricter types at `services/*` boundaries where PHP JSON is stable. | Fewer `unknown` escapes; safer refactors. |

**After** this sprint (or in parallel if two agents): resume **D1** — **public settings** / **home-feed** client / next directory — per §5 Move **4a** and `NEXT_STEPS_PRODUCTION.md` “next execution slice.”

---

*This file is strategy, not execution logs. Update when priorities shift; keep `NEXT_STEPS_PRODUCTION.md` and `WORKING_PLAN.md` in sync with what you actually schedule.*


---

*Last updated: **2026-05-13** — §10: A4 extended to **Ambulances**; B1 code pass retained.*

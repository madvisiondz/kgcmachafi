# Legacy system problems — lessons for this rebuild (assistant + team memory)

This file records **what went wrong with the old (legacy) stack** and why the **new frontend** is being rebuilt the way it is. It is updated when we discover new constraints or when decisions change.

**Audience**: humans on the project **and** the coding assistant — treat this as non-negotiable context for future work.

---

## 1) Core pain you reported (authoritative)

### Pages were designed **hard against the backend**

- **Symptom**: Public pages assumed **live PHP API + database** data. Components called `fetch()` / `contentApi.*` / service modules and **expected real rows** to exist.
- **Concrete example you gave**: You **could not create datasets for hospitals** (or could not do so *practically*) to drive the Hospitals UI — the UI was blocked or empty without a populated backend, migrations, admin CRUD, and correct session/auth.
- **Why that hurt product work**:
  - **UI iteration was slow**: designers/engineers could not iterate on layout, filters, cards, RTL, and empty states without standing up full data.
  - **No stable “UI contract”**: the page shape depended on whatever the API returned that day; types and shapes were implicit.
  - **Environment fragility**: local dev depended on API availability, cookie sessions, CORS/same-origin behavior, and seed data quality.

**Rebuild rule (new frontend)**:

- **UI-first phases**: pages render from **static mock data** + **i18n** until an explicit “wire API” milestone.
- **Data boundary**: a thin `services/` (or similar) layer later; **no fetch inside presentational components**.

---

## 2) Other major problems observed in the legacy system (from codebase + audit)

These are drawn from `legacy/PRODUCTION_GRADE_AUDIT_AND_NEXT_STEPS.md`, legacy `src/` patterns, and known architecture — not guesswork about unrelated products.

### 2.1 Frontend ↔ API coupling

- **Site-wide content** (`SiteContentContext`, hero stats, settings) mixed **CMS-like data** into layout; language switches triggered refetches and were a **frequent source of RTL/layout bugs** when combined with animated sections.
- **Feature pages** (e.g. news, stats) returned **`null` or skeleton forever** when API failed or returned empty — no graceful “directory UI” without data.
- **Large flat API surface** (`adminApi`, `contentApi`) without typed contracts — hard to mock and hard to evolve safely.

### 2.2 Backend / data model friction (why “just add a dataset” was hard)

- **Directories** (hospitals, pharmacies, ambulances, housing) lived in **real tables** with **inconsistent location fields** (mixed `varchar` widths / semantics across entities) — joining and filtering correctly required backend truth, not a quick JSON file.
- **Governance gap**: imports / JSON dumps / manual SQL made it easy to get **duplicates or inconsistent rows**, so even “seed data” was not trivially trustworthy.
- **Pagination / bounds**: public directory endpoints risked **unbounded `SELECT *`** style payloads as data grew — bad for dev UX and production.

### 2.3 Security & permissions (blocked safe “fake admin” workflows)

- **Admin authorization** was largely **client-side tab hiding**; many admin endpoints only checked **“logged in as admin”**, not fine-grained RBAC.
- **Session cookie APIs** without full **CSRF** story for state-changing calls — risky pattern for quick admin tooling.
- **Secrets / config** patterns were oriented to **dev convenience** (e.g. config near web root) — fine for prototypes, painful for repeatable staging datasets.

### 2.4 Internationalization (i18n)

- Mixed **hardcoded strings** (especially in home sections and drama/news) with translated keys — **language switching** surfaced layout bugs and inconsistent copy.
- **RTL/LTR** correctness required re-testing many sections whenever copy or fetch timing changed.

### 2.5 Dependencies & delivery risk

- **Heavy UI dependencies** (e.g. animation libraries, icon packages) sometimes conflicted with **local environment issues** (OneDrive locks, install hangs) — blocking “just run the UI”.

---

## 3) What we are doing differently in the new frontend (explicit success criteria)

| Topic | Legacy tendency | New rebuild rule |
| --- | --- | --- |
| Data for UI | Must have API + DB | **Mock data modules** until wiring milestone |
| Text | Mixed hardcoded + i18n | **All visible strings** in `translations` (AR/FR/EN) |
| Direction | Fragile around async | **`dir`/`lang` from i18n provider** + verify per page |
| Components | fetch + business rules inside UI | **Dumb UI**; data injected or from hooks that wrap services |
| Hospitals page | Blocked without backend rows | **Build cards/filters/empty states** on static fixtures first |
| Location filters | Derived from incomplete datasets | Use a **canonical wilaya + commune list** so filters work before full directory data exists |
| Location data freshness | Stale admin boundaries break UX | Keep location source data updateable (e.g. `Map.json` + adapter) so new wilayas/communes can be updated without rewriting UI |
| Sticky header UX | Content can slip under chrome | Reserve header height (e.g. CSS var + spacer) so content never underlaps during collapse/expand |
| Documentation drift | Pages get built without backend/admin plan | Every page tracker must include proposed **public endpoints** + **admin controls** so integration stays aligned |
| UX sameness | Every directory feels identical | Reuse the directory skeleton but allow slight theme/navigation variations per domain (e.g. Ambulances = emergency-first) |
| Deploy drift | Build output not synced to hosting bundle | Keep `ready-to-deploy/public_html/` refreshed from `frontend/dist/` whenever shipping |
| Trust-sensitive directories | Wrong numbers/unsafe listings hurt users | Add verification + quick disable workflows in admin for Housing/Transport/Pharmacies |
| Map-first pages | Map is the core navigation | Provide a fast “map points” endpoint and keep coordinates coverage high; ensure map UI degrades gracefully when coordinates are missing |
| Endpoint weight | Public endpoints too heavy | Prefer lightweight list/map endpoints (return only fields needed for that UI), decide exact columns/types later |

---

## 4) Changelog (keep short; append newest first)

| Date | Note |
| --- | --- |
| 2026-05-12 | Cross-reference: planned **gateway + Machafi TV** (separate product surface, edition routes, live simulcast) documented in `PLATFORM_SHELL_LAYOUT.md`; Services rebuild rules unchanged. |
| 2026-04-29 | Initial document: captured user-reported “hard backend + no hospital datasets” blocker and consolidated legacy audit themes into rebuild rules. |

---

## 5) Related project docs

- Technical audit (legacy copy): `legacy/PRODUCTION_GRADE_AUDIT_AND_NEXT_STEPS.md`
- Homepage structure: `HOMEPAGE_MAP.md`
- Library page rebuild: `LIBRARY_PAGE_MAP.md`
- Sticky header collapse spec: `HEADER_SCROLL_ANIMATION.md`
- Professional execution plan: `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`
- Platform intent: `project-explainer.md`
- Day-to-day trackers: `PROJECT_STATUS.md`, `PROMPT_LOG.md`

## 6) Workflow memory rule

To avoid repeating legacy drift and forgetting important context:

- **Rule #0 (non-negotiable)**: the assistant updates the relevant **project markdown memory files** after every prompt.
- Every page built in the new frontend should get its own dedicated `.md` tracker file.
- That page-specific file must stay updated whenever work happens on that page.

## Rule #1 (non-negotiable): language switching completeness

When language switches (AR/FR/EN), **every single visible text** must switch (no mixed-language UI).

See `RULE_1_LANGUAGE_SWITCHING.md` for the full strategy (UI + UX + DB + admin panel + enforcement).

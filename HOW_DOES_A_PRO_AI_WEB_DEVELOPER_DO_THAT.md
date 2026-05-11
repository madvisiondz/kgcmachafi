# How does a pro (AI-assisted) web developer do that?

This document describes a **professional phased plan** that matches your intent:

1. **Ship pages one by one**, improving each as you learn.
2. **Finish UI + visitor value first** (what each page helps someone do).
3. **Then** gain control over **admin inputs/outputs**, **panel UX**, and **backend endpoints**.
4. **Non-negotiable**: **i18n + language switching must stay legible** (AR / FR / EN, RTL/LTR).

It is written so both **humans** and an **AI coding agent** can follow it without drifting into “rewrite everything” mode.

---

## 0) The guiding principle (why this order works)

Pros separate **product risk** from **integration risk**:

- **Product risk**: visitors cannot find value, cannot trust the UI, cannot read text in their language, cannot complete tasks on mobile.
- **Integration risk**: APIs, auth, admin roles, migrations, pagination, caching, observability.

If you wire the backend too early, you optimize for data plumbing while the **visitor experience** and **i18n layout** remain fragile. Your legacy pain (pages “hard backend”, hard to mock hospitals) is exactly this failure mode.

So: **UI contract first**, **API contract second**, **admin + hardening last** (with security gates).

---

## Public API principle — lightweight endpoints (decision)

For all pages, prefer **lightweight public endpoints**:

- Return only the fields needed for the current UI surface (cards vs map points vs details).
- Prefer dedicated “map points” endpoints (e.g. `/api/<page>/map`) so maps stay fast.
- We will decide the exact column types later; the contract starts as “minimal fields per view”.

---

## Rule #0 — Documentation discipline (non-negotiable)

After **every user prompt**, update the project memory so the repo stays synced to the chat:

- **Page-specific tracker** for any page touched (e.g. `HOMEPAGE_MAP.md`, `LIBRARY_PAGE_MAP.md`, `PHARMACIES_PAGE_MAP.md`, and future `*_PAGE_MAP.md` docs)
- `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md` (this plan)
- `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` (constraints + rules)
- `PROJECT_STATUS.md` (done / in progress / remaining)
- `project-explainer.md` (platform intent; keep links accurate)
- `PROMPT_LOG.md` (what changed per prompt)

This is treated as **Rule #0** because it prevents drift: the UI and decisions can move fast, but the documentation must always stay current.

---

## Rule #1 — Language switching completeness

When language switches (AR/FR/EN), **every single visible text** must switch.

Implementation strategy and enforcement options are documented in:

- `RULE_1_LANGUAGE_SWITCHING.md`

---

## 1) Phase A — Foundations that every page depends on (small, strict)

**Goal**: prevent rework across all pages.

### A.1 Information architecture

- **Route map** (names only): what exists, what order matches navigation, what is “directory” vs “content”.
- **One page template**: consistent container width, vertical rhythm, page title pattern, breadcrumbs (if any), empty/loading/error states.

### A.1.1 Canonical location lists (Algeria directories)

For directory pages that filter by geography (Pharmacies, Hospitals, Ambulances, Housing):

- Use **one canonical dataset** for **wilayas + communes/baladiyas**.
- Prefer keeping the raw source as a single JSON asset (e.g. `Map.json`) and a small adapter module (`algeria-data.js`) that exports `wilayas` and `getCommunes(wilayaId)`.
- Do not “derive the dropdown list” from whatever entities are currently in the directory table/mock dataset.
- This keeps the UI usable even when the directory content is incomplete (a known legacy blocker we are avoiding).

### A.2 i18n system (treat like a runtime dependency)

**Rules professionals enforce**:

- **No hardcoded user-visible strings** in components (including aria labels that matter, button titles, helper text).
- **Keys are stable** and grouped by feature (`nav.*`, `hospitals.*`, `common.*`), not by screen file name only.
- **RTL/LTR is verified per page**, not once globally:
  - Arabic often needs more horizontal space; truncation rules differ.
  - Icon + text alignment must be checked in both directions.

**Practical “legibility gate” before marking any page done**:

- Switch **AR → FR → EN → AR** on the same scroll position and confirm:
  - no clipped headlines,
  - no overlapping flex rows,
  - no buttons that grow out of viewport,
  - marquee/tickers still behave,
  - sticky header collapse still behaves.

### A.3 Design system (even if lightweight)

- **Typography scale**, spacing scale, button variants, card variants, form control sizes.
- **Accessibility defaults**: focus rings, hit targets, contrast on green nav / blue ticker.

**AI collaboration tip**: keep “design decisions” in markdown checklists so the agent does not invent a new button style on every page.

---

## 2) Phase B — Build pages one by one (UI-only, visitor-first)

**Goal**: each page answers: **who is visiting, what decision are they making, what is the next action?**

### B.1 Pick a repeatable page archetype order

A professional team usually sequences by **reuse**:

1. **Reference directory page** (often “Hospitals”): filters + list + detail preview pattern.
2. Clone patterns to **Pharmacies**, **Ambulances**, **Housing** (same directory intent; allow light UX/theme variation per domain).
3. **Programs / Library / News** (content browsing patterns).
4. **Services / Consultations / Donations** (forms + trust + explanation patterns).
5. **Live** (player/embed + legal/help + fallback states).

### B.2 Definition of Done (DoD) for every page (non-negotiable)

For each page, before moving on:

- **Visitor story**: 1–3 sentences: what problem this page solves.
- **Primary + secondary actions** obvious on mobile.
- **Empty state** (no data) is intentional and helpful.
- **Loading skeleton** (if later async) has a UI placeholder even now (static).
- **i18n**: all strings keyed; AR/FR/EN reviewed for length/line breaks.
- **RTL/LTR**: screenshot-level sanity (or checklist) on narrow + wide screens.

### B.3 “Modify along the process” without chaos

Pros avoid endless redesign by using:

- **Frozen sections**: once a section hits DoD, only fix bugs or true accessibility issues there.
- **Backlog bucket**: nice-to-haves go to “polish pass” so the page pipeline keeps moving.

### B.4 Documentation discipline per page

For professional AI-assisted execution, each page should have its own living markdown tracker.

Rules:

- When a page is created, create a **page-specific `.md` file** for it immediately.
- That file becomes the page’s source of truth for:
  - section order,
  - visitor purpose,
  - proposed public API endpoints (contracts),
  - proposed Admin Control Panel controls/workflows,
  - UI decisions,
  - i18n concerns,
  - open issues,
  - current build status.
- Update that page document **every time work is done on that page**.

**AI collaboration tip**: one page per change-set mentally; avoid mixing “Hospitals filters” with “global header animation” in the same iteration unless necessary.

---

## 3) Phase C — Data contracts (still before heavy backend work)

**Goal**: make backend replacement safe.

### C.1 Define DTOs (types) for each entity

Example: `Hospital`, `HospitalListFilters`, `PagedResult<T>`.

### C.2 Mock adapters

- `getHospitalsMock(filters)` returns deterministic fixtures.
- UI imports only through `services/hospitals` (or similar), never raw `fetch` in components.

### C.3 Swap implementation

Replace mock with real `fetch` behind the same function signatures.

**Why pros do this**: your UI stops depending on “whatever JSON happened to return”.

---

## 4) Phase D — Admin control panel + backend endpoints (controlled rollout)

**Goal**: admins can govern content without breaking public UX.

### D.1 Admin is a product, not a CRUD dump

- **Workflows**: publish/draft, preview, rollback (even if simple at first).
- **Validation**: server-side validation is the source of truth.
- **Permissions**: role checks on server, not only hidden tabs.

### D.2 API hardening checklist (minimum professional bar)

- Pagination + indexes for directory tables.
- Structured errors (codes + messages).
- Rate limits on auth + destructive actions.
- CSRF strategy for cookie sessions (if that is your model).
- Audit logs for admin mutations (health-adjacent trust).

### D.3 Release strategy

- **Feature flags** or environment-based toggles for “read new API” per module.
- **Shadow reads** optional: fetch new API but render old until validated (advanced).

---

## 5) Where AI assistance helps most (and where it hurts)

### Helps most

- Repetitive UI: tables, filters, cards, i18n key scaffolding.
- Generating **mock datasets** and keeping them consistent with types.
- Producing checklists, DoD, and migration notes.

### Hurts most (guardrails)

- Security decisions without explicit requirements.
- Guessing business rules for medical/legal sensitive flows.
- “While we’re here” refactors that expand scope.

**Pro workflow**: AI proposes diffs, human approves **scope** and **DoD**, AI implements narrowly.

---

## 6) Your “most important” requirement — i18n legibility (operationalized)

Treat i18n like performance: **measure, don’t assume**.

Minimum ongoing practices:

- **Pseudo-length test**: temporarily use longer French/Arabic placeholder strings to stress layout.
- **No absolute layout hacks** for text blocks; prefer wrapping, `min-w-0`, sensible `line-clamp` with “read more”.
- **Sticky header + marquee** re-tested after every header change (known fragile area).
- **Avoid mixing direction inside one flex row** without explicit `dir` on subtrees when needed.

---

## 7) What “done” looks like for the whole program

You are done with the UI-first program when:

- Every route exists with **visitor clarity** and **i18n-safe layouts**.
- Each domain has a **mock service** behind a stable interface.
- You have a written **API contract** list (even if not implemented yet).

You are done with the integration program when:

- Public pages read real endpoints with pagination and sane errors.
- Admin can manage the same entities with **server-enforced permissions** and auditability.

---

## 8) Changelog

| Date | Note |
| --- | --- |
| 2026-04-29 | Initial version: phased UI → contracts → admin/backend plan; emphasizes i18n legibility gates. |
| 2026-04-29 | Reminder: Cursor canvases are JSX — never put raw `<Component>`-looking snippets inside `<Text>` children without escaping (use string expressions or `Code`). |
| 2026-04-29 | Library page added in `frontend/` (legacy `HealthLibrary` UI clone, mock data, `/library`); tracker `LIBRARY_PAGE_MAP.md`. |

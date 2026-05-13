# MACHAFI — Project Explainer

This document is a permanent reference for the purpose, structure, and data philosophy of the MACHAFI platform.

## 1. Project Overview

MACHAFI is a complete health platform.

Its purpose is not to behave like a complex medical information system, a hospital ERP, or a deeply specialized healthcare operations tool.

MACHAFI is primarily a **directory-based platform**.

Its main goal is simple:

**Help users find health-related services easily.**

This means the platform should focus on discovery, navigation, clarity, and usefulness for visitors looking for health resources.

## 2. Core Concept

The platform is built around a simple idea:

**Each page is a directory.**

The system should not depend on complicated entities, deeply nested relationships, or heavy business logic for basic public usage.

Key principle:

- Use **simple directories**
- Avoid **complex data models**
- Avoid **heavy database structure**

The public-facing side of MACHAFI should be easy to understand, easy to browse, and easy to populate with useful information.

## 3. Data Philosophy

This is one of the most important principles of the project.

We are **simplifying the database**.

### Before

- 15 to 20 columns per entity
- Too many fields
- Too much friction when creating or cleaning datasets
- More chances for SQL and validation errors

### Now

- Only **6 to 8 essential fields** per entity
- Only the fields that are truly useful for visitors

### Why this matters

- Easier data collection from sources like **Apify**, scraping tools, or manual entry
- Fewer SQL issues and fewer inconsistent records
- Faster development
- Easier admin management
- More reliable system overall

The platform should prefer **practical, usable, minimal datasets** over large and difficult schemas.

## 4. Main Pages

MACHAFI is organized around 11 main directories or platform areas.

### 1. Home

- Briefing page
- Introduces the platform
- Presents key sections and visitor entry points
- Future: **actuality feed hub** — “what’s new” across existing pages (News, Programs, Library, Services, etc.) surfaced as Home sections.

### 2. Library

- Directory of health books
- Users can browse books
- Users can search books
- Simple content listing
- **Rebuild tracker**: `../TRACKERS/machafi-services/LIBRARY_PAGE_MAP.md` (UI-first route `/library` in `frontend/`)

### 3. Pharmacies

- Directory of pharmacies
- User selects:
  - wilaya
  - city
- System shows a list of pharmacies as cards
  - Note (rebuild): wilaya/city dropdowns should come from a **canonical Algeria location dataset** (wilayas + communes), not from whatever pharmacies happen to be present. Keep the raw source updateable (e.g. `Map.json` + adapter) so new wilayas can be reflected quickly.
  - Note (rebuild): include a **map at the bottom** (after filters/results) to show pins for the **filtered** pharmacies that have coordinates.

Each pharmacy card should contain:

- name
- location (city)
- phone
- working hours
- night shift status

Main goal:

**Build a useful pharmacy database that is easy to browse and easy to populate.**

### 4. Hospitals

- Same concept as pharmacies
- Directory of hospitals
- Displayed as cards
- Focus on easy browsing and clear presentation
  - Rebuild tracker: `../TRACKERS/machafi-services/HOSPITALS_PAGE_MAP.md` (route `/hospitals` in `frontend/`)

### 5. Ambulances

- Directory of ambulance services
- Same card-based listing concept
- Focus on quick access to essential service information
  - Rebuild emphasis: emergency-first UX (call-first), vehicle type clarity (standard vs ICU vs medical transport), and admin verification to avoid wrong numbers.
  - Note (rebuild): include a **map at the bottom** (after filters/results) to show pins for the **filtered** ambulance services that have coordinates.

### 6. Patient Housing

- Directory for patient accommodation
- Simple listing
- Built to help patients and companions find housing options
  - Rebuild emphasis: trust signals (verified) + clear call-first coordination + a **map at the bottom** (after filters/results) for pins of the **filtered** listings with coordinates. Volunteer listings are part of the value and growth narrative.

### 6.1 Consultations

- Directory + booking-request flow for private doctors
- Main value:
  - **remote/distant consultation when possible**
  - local private doctors by wilaya/city
- Rebuild tracker: `../TRACKERS/machafi-services/CONSULTATIONS_PAGE_MAP.md` (route `/consultations` in `frontend/`)

### 7. International Treatment

- Directory of clinics or treatment options abroad
- Filter by country
- Keep structure simple and easy to expand

### 8. News

- Health news directory
- Articles and updates
- Clear reading and browsing experience

### 9. Programs / Media

- Directory of health programs
- Can include video programs or media content
- Organized as simple browseable content
- Rebuild tracker: `../TRACKERS/machafi-services/PROGRAMS_PAGE_MAP.md` (route `/programs` in `frontend/`)

### 10. User Account

- Basic user interaction area
- Not meant to become an overcomplicated user management system
- Should support only the necessary user-facing actions

### 11. Admin Panel

- Central place to manage platform data
- Used to control directory entries and content
- Must stay practical and focused on data management

## 5. UI Principle

The UI must always be:

- simple
- clean
- fast
- consistent

Most pages should follow the same structural pattern:

**Filters (optional) -> Results (cards)**

This consistency helps users understand the platform quickly and helps development stay scalable without unnecessary redesign for every page.

## 6. Important Rules

### Rule 1

Do not overcomplicate data models.

### Rule 2

Always prefer simplicity.

### Rule 3

The UI must work even with incomplete data.

### Rule 4

Directories must be easy to populate.

### Rule 5

Focus on usability, not complexity.

## 7. Final Development Direction

MACHAFI should always be developed as a **clear, practical, directory-first health platform**.

The platform wins when:

- users can find services easily
- pages stay simple and understandable
- data remains lightweight and manageable
- the UI stays stable even before full backend complexity is introduced

Whenever a future development decision feels too complex, the team should return to this question:

**Does this make MACHAFI easier to use and easier to populate as a directory platform?**

If the answer is no, it should probably be simplified.

## 8) Related engineering docs

These files complement this explainer for day-to-day execution:

- **Production domain**: **[https://kgc-machafi.net/](https://kgc-machafi.net/)**
- `PLATFORM_SHELL_LAYOUT.md` — planned **gateway** (Machafi Services vs **Machafi TV**), Services SPA route tree, TV shell with **edition paths** `/tv/ar`, `/tv/fr`, `/tv/en`, live simulcast + journalist desk (logical map; implementation follows).
- `WEBAPP_PAGES_OVERVIEW.md` — current **Machafi Services** SPA routes in `frontend/src/App.tsx` only.
- `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md` — phased delivery plan (UI first, then contracts, then admin/API).
- `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` — why the old stack blocked UI iteration and what we avoid repeating.
- `PROJECT_STATUS.md` and `PROMPT_LOG.md` — current status and per-prompt actions.
- `PAGE_DATASET_REFERENCE.md` — all routes: brief purpose + recommended dataset columns (handoff to backend/CMS).
- `../TRACKERS/machafi-services/HOMEPAGE_MAP.md` — Home page section map (template for future per-page `*_PAGE_MAP.md` files under `../TRACKERS/machafi-services/`).
- `../TRACKERS/machafi-services-admin/HEALTHSERVICES_ADMIN_PANEL_MAP.md` — Health Services admin (`/healthservices/admin/*`).
- `../TRACKERS/machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md` — Machafi TV admin (`/machafitv/admin/*`).

**Machafi TV (planned)** is a **second product surface** on the same domain: broadcast-style news + web live + per-edition editorial pipelines. It does **not** replace the directory-first mission of **Machafi Services** in `frontend/`; cross-links between shells are optional product decisions.
- **Rule #0**: after every prompt, update the relevant page tracker under **`../TRACKERS/machafi-services/`**, **`../TRACKERS/machafi-tv/`**, **`../TRACKERS/machafi-services-admin/`**, or **`../TRACKERS/machafi-tv-admin/`** *and* the core project memory docs listed above so decisions never drift from the implementation.
  - Rule detail: each page tracker must include the **proposed public endpoints** and the **admin panel controls** needed to keep that page accurate.
- **Rule #1**: language switching must switch **all text** (AR/FR/EN). Strategy doc: `RULE_1_LANGUAGE_SWITCHING.md`.
- Deploy note: the hosting bundle lives at `ready-to-deploy/public_html/` and should be refreshed from `frontend/dist/` when shipping.
- Cursor workflow canvas:
  - **Managed (renders in Canvas preview)**: `C:\Users\Oasis-Mall\.cursor\projects\d-komas-kgcmachafiprodhome1-kgcmachafi\canvases\project-workflow.canvas.tsx`
  - **Repo copy (versioned)**: `canvases/project-workflow.canvas.tsx`
  - Purpose: visual workflow and “what to update after every prompt” checklist.


---

*Last updated: **2026-05-13** — evening session close (project-wide doc sync).*

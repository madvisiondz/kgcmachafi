# MACHAFI (kgcmachafi)

MACHAFI is a **directory-first health platform**. This repo pairs a **UI-first rebuild** in `frontend/` with a **thin `services/` client** (`getJson`, timeouts) so pages can call the same-origin **GoDaddy PHP + MySQL** API under **`VITE_API_BASE_URL`** (default `/api`) when flags like **`VITE_NEWS_API`** are enabled.

## Production domain

Public site: **[https://kgc-machafi.net/](https://kgc-machafi.net/)**

## Where the “project memory” lives

Product specs, status, routing maps, and logs live under **`PROJECT-EXPLAINER/`** (only **`README.md`** stays at the repo root for GitHub).

At the repo root (next to **`README.md`**):

- **`WORKING_PLAN.md`** — **path-sheet**: dated timeline + detailed inventory + forward checklists (tick as you go)
- **`NEXT_MOVES.md`** — **strategy**: value/readiness study, tracker-informed priorities, ordered moves vs `NEXT_STEPS` / architecture
- **`NEXT_STEPS_PRODUCTION.md`** — production roadmap + **Sprint execution table** (sync with `WORKING_PLAN.md`)
- **`.github/workflows/frontend-ci.yml`** — CI: `npm ci` + lint + build for `frontend/` on push/PR
- **`ARCHITECTURE_PRODUCTION_READINESS.md`** — ASCII architecture diagrams + **% to 100% production** per layer
- **`PROJECT-EXPLAINER/SMOKE_CHECKLIST_PRODUCTION.md`** — release smoke matrix (fill per deploy)
- **`MACHAFI_DATABASE_AND_API_PLAYBOOK.md`** — **beginner-friendly** step-by-step: MySQL/phpMyAdmin, schema updates, `api/public` ↔ `frontend/src/services/`, real project examples
- **`SERVICES_UI_VISUAL_EVALUATION.md`** — **Machafi Services** UI: visual critique + creative ideas log (`/healthservices/*`)
- **`TV_UI_VISUAL_EVALUATION.md`** — **Machafi TV** UI: visual critique + creative ideas log (`/tv/:edition/*`)

- **`PROJECT-EXPLAINER/project-explainer.md`** — product intent + directory philosophy
- **`PROJECT-EXPLAINER/PROJECT_STATUS.md`** — done vs remaining (keep current)
- **`PROJECT-EXPLAINER/PROMPT_LOG.md`** — one entry per prompt (keep current)
- **`PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md`** — domain → gateway → Machafi Services vs Machafi TV (planned editions, live TV, newsroom)
- **`PROJECT-EXPLAINER/ROUTING_SWITCH_BRIEFING.md`** — handoff: gateway + `/healthservices` + `/tv` routing switch (what was done)
- **`PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md`** — routes in `frontend/src/App.tsx` (gateway, services, TV, **Health Services admin v1**, TV admin placeholder)
- **`PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`** — GoDaddy + MySQL deploy assumptions for `api/` + SPA
- **`PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`** — **beginner cPanel** walkthrough: database import, `api/` upload, `admin-config.php` path, `npm run build` + `dist/` upload, `.htaccess`, admin URL + checklist
- **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`** — **canonical** list of every `api/public/*.php` and `api/admin/*.php` method, envelopes, honeypots, CSRF, and `VITE_*` flags.
- **`PROJECT-EXPLAINER/HEALTH_SERVICES_BACKEND.md`** — Health Services backend pass: schema path, smoke checks, deploy notes.
- **`PROJECT-EXPLAINER/HEALTH_SERVICES_ADMIN_UI_UPGRADE.md`** — Health Services admin UI + shared depth utilities (emerald gradient, grid, card glow).
- **`PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** — JSON response conventions for PHP on shared hosting
- **`PROJECT-EXPLAINER/ARCHIVE_LEGACY_*.md`** — archived copies of the former monolith **audit** + **deployment** notes (the `legacy/` tree was removed from the repo on 2026-05-13)
- **`PROJECT-EXPLAINER/LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`** — why the legacy system blocked UI work + rebuild rules
- **`PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md`** — sticky header collapse spec + QA checklist
- **`PROJECT-EXPLAINER/HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`** — phased execution plan
- **`PROJECT-EXPLAINER/RULE_1_LANGUAGE_SWITCHING.md`** — AR/FR/EN + RTL/LTR strategy
- **`PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`** — route → dataset column handoff
- **`PROJECT-EXPLAINER/FRONTEND_BLOCK_DIAGRAM.md`** — Mermaid diagrams (runtime stack + future `services/` boundary)
- **`PROJECT-EXPLAINER/general-animation.md`** — animation notes
- **`TRACKERS/`** — page trackers by product branch (see below).
- **Gateway** (`/`): `TRACKERS/gateway/GATEWAY_PAGE_MAP.md`
- **Machafi Services** (`/healthservices/*`): `TRACKERS/machafi-services/HOMEPAGE_MAP.md`, `TRACKERS/machafi-services/LIBRARY_PAGE_MAP.md`, and other `*_PAGE_MAP.md` files in that folder.
- **Machafi Services admin** (`/healthservices/admin/*`): `TRACKERS/machafi-services-admin/HEALTHSERVICES_ADMIN_PANEL_MAP.md`
- **Machafi TV** (`/tv/:edition/*`): `TRACKERS/machafi-tv/TV_SHELL_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_HOME_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_LIVE_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_SCHEDULE_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_ARTICLE_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_DESK_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_ACTIVITY_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_TOPIC_PAGE_MAP.md`, `TRACKERS/machafi-tv/TV_SEARCH_PAGE_MAP.md`
- **Machafi TV admin** (`/machafitv/admin/*`): `TRACKERS/machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`

## How to run (frontend)

The active app is in `frontend/` (Vite + React + Tailwind).

```bash
cd frontend
npm install
npm run dev
```

Build:

```bash
cd frontend
npm run build
```

## Workflow canvas (open beside chat)

Cursor canvases must live in Cursor’s managed canvases directory to render.

- Managed canvas (opens in Canvas preview): `C:\Users\Oasis-Mall\.cursor\projects\d-komas-kgcmachafiprodhome1-kgcmachafi\canvases\project-workflow.canvas.tsx`
- Versioned copy (kept in repo): `canvases/project-workflow.canvas.tsx`

## Repo layout (high-level)

- `frontend/`: new UI rebuild (current work)
- `PROJECT-EXPLAINER/`: project memory markdown (status, prompts, rules, routing maps, diagrams)
- `TRACKERS/`: per-surface tracker maps — **`gateway/`** (site entry `/`), **`machafi-services/`**, **`machafi-tv/`** (public apps), **`machafi-services-admin/`**, **`machafi-tv-admin/`** (admin panels)
- `deploy/`, `ready-to-deploy/`: deployment-related assets (review before using)
- `uploads/`: media/assets used by the app

## GitHub backup (push this folder to GitHub)

**Published repo:** [github.com/madvisiondz/kgcmachafi](https://github.com/madvisiondz/kgcmachafi)

This directory is a Git repo (`main` branch) with an initial commit. **GitHub CLI** (`gh`) is the fastest path.

1. **Sign in once** (browser flow):

   ```bash
   gh auth login
   ```

   Choose GitHub.com → HTTPS → authenticate via web browser.

2. **Create the remote repository and push** (pick your owner and repo name; example uses `YOUR_USER/kgcmachafi-backup`):

   ```bash
   gh repo create YOUR_USER/kgcmachafi-backup --public --source=. --remote=origin --push
   ```

   For an **organization**, use `ORG_NAME/repo-name` instead of `YOUR_USER/...`.

If the repo **already exists** on GitHub:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Optional: set your commit identity for this repo only (replace with your details):

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

Advanced: you can set a personal access token in the `GH_TOKEN` environment variable instead of `gh auth login` (use for automation only; keep the token secret).

## “Sync this chat to written content” rule

After every prompt/work session, update:

- **`PROJECT-EXPLAINER/PROMPT_LOG.md`** (what changed) — **append before every `git push`** so clones on other PCs include the latest chat/context.
- **`PROJECT-EXPLAINER/PROJECT_STATUS.md`** (done/in progress/remaining)
- any relevant tracker under **`TRACKERS/`** or spec docs under **`PROJECT-EXPLAINER/`**

**Push policy (owner preference):** commit and push **all tracked files** you rely on (including **`frontend/dist`** when it changes). Do **not** ask to omit large paths for “smaller” commits—the goal is **clone-and-work** on any machine.


---

*Last updated: **2026-05-14** — Root README sync: gateway/TV branding, Vercel, GitHub main.*

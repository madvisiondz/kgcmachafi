# MACHAFI (kgcmachafi)

MACHAFI is a **directory-first health platform**. This repo is in **UI-first rebuild mode**: we build pixel-perfect pages with **i18n (AR/FR/EN) + mock data** first, then wire APIs later via a thin `services/` boundary.

## Production domain

Public site: **[https://kgc-machafi.net/](https://kgc-machafi.net/)**

## Where the “project memory” lives

Product specs, status, routing maps, and logs live under **`PROJECT-EXPLAINER/`** (only **`README.md`** stays at the repo root for GitHub).

- **`PROJECT-EXPLAINER/project-explainer.md`** — product intent + directory philosophy
- **`PROJECT-EXPLAINER/PROJECT_STATUS.md`** — done vs remaining (keep current)
- **`PROJECT-EXPLAINER/PROMPT_LOG.md`** — one entry per prompt (keep current)
- **`PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md`** — domain → gateway → Machafi Services vs Machafi TV (planned editions, live TV, newsroom)
- **`PROJECT-EXPLAINER/ROUTING_SWITCH_BRIEFING.md`** — handoff: gateway + `/healthservices` + `/tv` routing switch (what was done)
- **`PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md`** — routes in `frontend/src/App.tsx` (gateway, services, TV, admin placeholders)
- **`PROJECT-EXPLAINER/LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`** — why the legacy system blocked UI work + rebuild rules
- **`PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md`** — sticky header collapse spec + QA checklist
- **`PROJECT-EXPLAINER/HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`** — phased execution plan
- **`PROJECT-EXPLAINER/RULE_1_LANGUAGE_SWITCHING.md`** — AR/FR/EN + RTL/LTR strategy
- **`PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md`** — route → dataset column handoff
- **`PROJECT-EXPLAINER/FRONTEND_BLOCK_DIAGRAM.md`** — Mermaid diagrams (runtime stack + future `services/` boundary)
- **`PROJECT-EXPLAINER/general-animation.md`** — animation notes
- **`TRACKERS/`** — page trackers by product branch (see below).
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
- `TRACKERS/`: per-surface tracker maps — **`machafi-services/`**, **`machafi-tv/`** (public apps), **`machafi-services-admin/`**, **`machafi-tv-admin/`** (admin panels)
- `legacy/`: archived old frontend (kept intact for reference)
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

- **`PROJECT-EXPLAINER/PROMPT_LOG.md`** (what changed)
- **`PROJECT-EXPLAINER/PROJECT_STATUS.md`** (done/in progress/remaining)
- any relevant tracker under **`TRACKERS/`** or spec docs under **`PROJECT-EXPLAINER/`**

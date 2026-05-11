# MACHAFI (kgcmachafi)

MACHAFI is a **directory-first health platform**. This repo is in **UI-first rebuild mode**: we build pixel-perfect pages with **i18n (AR/FR/EN) + mock data** first, then wire APIs later via a thin `services/` boundary.

## Where the “project memory” lives

These markdown files are the source of truth for decisions, progress, and page mapping:

- `project-explainer.md` — product intent + directory philosophy
- `PROJECT_STATUS.md` — done vs remaining (keep current)
- `PROMPT_LOG.md` — one entry per prompt (keep current)
- `LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md` — why the legacy system blocked UI work + rebuild rules
- `HEADER_SCROLL_ANIMATION.md` — sticky header collapse spec + QA checklist
- `HOMEPAGE_MAP.md` — home page section map + rebuild tracking
- `LIBRARY_PAGE_MAP.md` — library page map + rebuild tracking
- `HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md` — phased execution plan

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
- `legacy/`: archived old frontend (kept intact for reference)
- `deploy/`, `ready-to-deploy/`: deployment-related assets (review before using)
- `uploads/`: media/assets used by the app

## GitHub backup (push this folder to GitHub)

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

- `PROMPT_LOG.md` (what changed)
- `PROJECT_STATUS.md` (done/in progress/remaining)
- any relevant `*_MAP.md` or spec docs


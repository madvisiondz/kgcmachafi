# KGC Machafi — frontend (Vite + React)

Single-page app for **site gateway** (`/`), **Machafi Services** (`/healthservices/*`), and **Machafi TV** (`/tv/:edition/*`).

## Scripts

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server (Vite) |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Serve `dist` locally |
| `npm run lint` | ESLint |

## Stack

- React 19, React Router 7, TypeScript, Vite 8, Tailwind CSS 3
- i18n: `src/i18n/` (EN / FR / AR; Rule #1 in repo docs)

## Deploy

- **Vercel (current production SPA):** [https://kgcmachafi.vercel.app](https://kgcmachafi.vercel.app)  
- Project config: `vercel.json`, `.vercelignore` in this folder.

## Brand assets (public)

- `public/machafi-logo.svg` — Services header / gateway (invert on dark gateway)
- `public/branding/kgc.png`, `public/branding/komas.png` — partner marks
- `public/branding/machafi-tv-logo.png` — Machafi TV lockup (gateway strip, TV shell, gateway TV card)

## Docs (repo root)

See `TRACKERS/`, `PROJECT-EXPLAINER/`, and root `README.md` for routing maps and architecture.

---

*Last updated: **2026-05-14** — Replaced default Vite template README with Machafi frontend overview + deploy and branding paths.*

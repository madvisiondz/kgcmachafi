# Briefing — domain routing switch (gateway, `/healthservices`, `/tv`)

This note summarizes **what was implemented** when Machafi moved from a **single flat SPA** to a **multi-shell URL architecture** on **`https://kgc-machafi.net/`**.

---

## Why the switch

| Goal | Outcome |
|------|---------|
| **First visit** chooses product | **`/`** = gateway — **Machafi Services** (directory platform) vs **Machafi TV** (news/broadcast brand). |
| **Stable Services URLs** | All directory pages live under **`/healthservices/*`** so marketing and deep links are explicit. |
| **Machafi TV as its own product** | **`/tv/ar`**, **`/tv/fr`**, **`/tv/en`** — separate editorial “editions” (URL change, not only UI translation). |
| **Admin clarity (later)** | Placeholder routes for **`/healthservices/admin/*`** and **`/machafitv/admin/*`** until real panels + PHP APIs ship. |
| **Backward compatibility** | Old bookmarks (**`/about`**, **`/live`**, **`/news`**, …) **redirect** to the new **`/healthservices/...`** paths. |

---

## What changed in the frontend (high level)

1. **`frontend/src/routes/paths.ts`**  
   - **`SERVICES_BASE`** = `/healthservices`  
   - **`servicesPath('/live')`** → `/healthservices/live`  
   - **`tvEditionPath('ar', '/')`** → `/tv/ar`  
   - Helpers keep links consistent so Rule #1 strings stay in components without hardcoding base paths everywhere.

2. **`frontend/src/App.tsx`**  
   - **`/`** → **`GatewayPage`**  
   - **`/healthservices/*`** → **`ServicesLayout`** (existing header/footer + **`Outlet`**)  
   - **`/tv/:edition/*`** → **`TvShellLayout`** (stub TV chrome + **`Outlet`**)  
   - **`/healthservices/admin/*`**, **`/machafitv/admin/*`** → placeholder admin pages  
   - **Legacy `Navigate` routes** for old flat paths  
   - **Catch-all** `*` → **`/`** (gateway) for unknown paths; unknown segments under **`/healthservices/*`** fall through to a nested redirect to **`/healthservices`**.

3. **`DocumentTitle`** is **global** (one component at app root) and maps titles for gateway, services, TV, and admin placeholder routes.

4. **Header / Footer / page `Link`s** now use **`servicesPath(...)`** so navigation stays under **`/healthservices`**.

5. **New pages (stubs where noted)**  
   - **`GatewayPage.jsx`**  
   - **`layouts/ServicesLayout.jsx`**, **`layouts/TvShellLayout.jsx`**  
   - **`pages/tv/`** — `TvHomePage`, `TvLivePage`, `TvSchedulePage`, `TvArticlePage` (scaffold)  
   - **`pages/admin/`** — `HealthServicesAdminPage`, `MachafiTvAdminPage` (placeholders)

6. **i18n** — new groups **`gateway.*`**, **`tvApp.*`**, **`admin.*`** in **`translations.ts`** (AR / FR / EN).

7. **Gateway “remember”** — optional **`localStorage`** keys (`kgc_shell_choice`: `services` | `tv_ar` | `tv_fr` | `tv_en`) so repeat visitors can skip the chooser (same-origin only).

---

## Canonical URL map (after switch)

| Area | Pattern | Role |
|------|---------|------|
| Gateway | **`/`** | Pick Services vs TV (+ optional remember). |
| Machafi Services | **`/healthservices`**, **`/healthservices/about`**, … | Existing 14-page directory platform. |
| Machafi TV | **`/tv/ar`**, **`/tv/fr`**, **`/tv/en`** + **`live`**, **`schedule`**, **`article/:slug`** | TV shell (stubs beyond layout/navigation). |
| Services admin (placeholder) | **`/healthservices/admin/*`** | Until real panel + **`/api/admin`** wiring. |
| TV admin (placeholder) | **`/machafitv/admin/*`** | Until editorial + live settings APIs. |

**Legacy:** **`/about`** → **`/healthservices/about`**, etc.; **`/news/:id`** → **`/healthservices/news/:id`**.

---

## Docs updated (project memory)

- **`PLATFORM_SHELL_LAYOUT.md`** — master tree aligned with implemented routes.  
- **`WEBAPP_PAGES_OVERVIEW.md`** — route tables and structure.  
- **`PROJECT_STATUS.md`**, **`PROMPT_LOG.md`** — Rule #0 sync.

---

## Deploy / hosting checklist

- Rebuild: **`cd frontend && npm run build`**.  
- Sync **`frontend/dist/`** (and **`ready-to-deploy/public_html/`** if that is your bundle).  
- Server must **SPA-fallback** to **`index.html`** for **`/healthservices/*`**, **`/tv/*`**, and **`/`** so refresh/deep links work.  
- **`api/`** PHP layout unchanged by this React routing work — admin panels still need backend routes + auth when you implement them.

---

## Not in scope of this switch (next milestones)

- Real **Machafi TV** homepage/news rails, **HLS player** binding, **CMS**, journalist workflows.  
- Replacing admin **placeholders** with full UIs + **RBAC** + **`api/admin/machafitv/...`** (or your chosen namespace).  
- **`PAGE_DATASET_REFERENCE.md`** column-by-column updates for TV entities (optional follow-up).

---

*This briefing reflects the routing work completed in the session that introduced gateway + `/healthservices` + `/tv/:edition` + admin placeholder paths.*


---

*Last updated: **2026-05-13** — evening session close (project-wide doc sync).*

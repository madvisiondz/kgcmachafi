# Platform shell layout — all together

**Production domain:** [https://kgc-machafi.net/](https://kgc-machafi.net/)

One place for **domain → gateway → Machafi Services vs Machafi TV** (editions, live broadcast web, journalist desk). Same ASCII style as `WEBAPP_PAGES_OVERVIEW.md`.  
Implementation is **one Vite SPA** in **`frontend/`** (`BrowserRouter` without basename). This doc stays the **logical + URL** map.

---

## Master map (everything in one tree) — implemented routing

```
Main domain (https://kgc-machafi.net/)
└── BrowserRouter → App.tsx
    ├── DocumentTitle (global)
    └── Routes
        ├── /                                    GatewayPage — Services vs TV (+ optional remember-shell)
        │
        ├── /healthservices/admin/*               HealthServicesAdminPage (placeholder shell)
        ├── /machafitv/admin/*                    MachafiTvAdminPage (placeholder shell)
        │
        ├── /tv/:edition/*                        TvShellLayout — edition = ar | fr | en (invalid → /tv/ar)
        │   ├── (index)                           TvHomePage (stub)
        │   ├── live                              TvLivePage (stub player area)
        │   ├── schedule                          TvSchedulePage (stub)
        │   └── article/:slug                     TvArticlePage (stub)
        │
        ├── /healthservices/*                     ServicesLayout — Header + spacer + Outlet + Footer
        │   ├── (index)                           HomePage
        │   ├── about                             AboutContactPage
        │   ├── library … consultations           (same 14 pages as before; see WEBAPP_PAGES_OVERVIEW.md)
        │   └── *                                 unknown segment → redirect /healthservices
        │
        └── Legacy flat URLs → Navigate           /about → /healthservices/about, /live → …, etc.
```

**Switching TV “edition”** = **navigate** `/tv/ar|fr|en/...` — `TvShellLayout` syncs **i18n language** to the edition. Services shell keeps normal **AR/FR/EN** toggle via **`t()`** (Rule #1).

**Cross-links:** Services home canonical URL is **`/healthservices`**. TV edition home is **`/tv/{edition}`**. From TV shell: link **`/healthservices`** returns to the directory platform.

---

## Live broadcast (Machafi TV — technology slice)

Web **live** is the **player + status UI**; the signal chain sits upstream (encoder → ingest → transcode → CDN → **HLS** for browsers).

```
Studio / playout
└── Encoder (RTMP / SRT / …)
    └── Origin + transcoder → HLS (.m3u8) + CDN
        └── Public web: /tv/{edition}/live  →  player (hls.js / native) + off-air slate
```

Admin/API later: sanitized stream URL, schedule row, “on air” flag — aligned with a future TV settings contract (no secrets in the React bundle).

---

## Quick reference

| Piece | Role |
|--------|------|
| **Gateway** | On `kgc-machafi.net`, user chooses Services vs TV. |
| **Services** | **14** routes under **`/healthservices/*`**; i18n via `t()` + legacy URLs redirect (Rule #1). |
| **Machafi TV** | Three **route trees** (`/tv/ar`, `/tv/fr`, `/tv/en`) + shared shell chrome pattern. |
| **TV news** | Editorial queues per edition; journalist desk submits into scoped queues. |
| **TV live** | Simulcast page per edition + broadcast pipeline behind HTTPS/HLS. |

---

## Related docs

| Doc | Contents |
|-----|----------|
| `WEBAPP_PAGES_OVERVIEW.md` | Gateway + `/healthservices/*` + `/tv/*` route tables and readiness. |
| `project-explainer.md` | Directory-first product intent (Services). |
| `PROJECT_STATUS.md` | Done / in progress. |

---

*Routing scaffold implemented in `frontend/src/App.tsx`; TV/CMS/admin wiring continues in later milestones.*


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

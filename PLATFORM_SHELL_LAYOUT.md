# Platform shell layout — all together

**Production domain:** [https://kgc-machafi.net/](https://kgc-machafi.net/)

One place for **domain → gateway → Machafi Services vs Machafi TV** (editions, live broadcast web, journalist desk). Same ASCII style as `WEBAPP_PAGES_OVERVIEW.md`.  
Implementation may be one repo with multiple route trees or two SPAs—this doc is the **logical** map.

---

## Master map (everything in one tree)

```
Main domain (https://kgc-machafi.net/)
└── GatewayPage — first entry: pick shell (optional “remember my choice”)
    │
    ├── Machafi Services — directory platform (current `frontend/`)
    │   └── BrowserRouter (main.tsx)
    │       └── App.tsx
    │           ├── DocumentTitle
    │           ├── Header (fixed)
    │           ├── Spacer (header offset)
    │           ├── <main>
    │           │   └── <Routes>
    │           │       ├── / … HomePage
    │           │       ├── /about … AboutContactPage
    │           │       ├── /library … LibraryPage
    │           │       ├── /service … ServicesPage
    │           │       ├── /donations … DonationsPage
    │           │       ├── /news, /news/:id … NewsPage, NewsDetailPage  ← dev-track news (not TV editions)
    │           │       ├── /live … LivePage
    │           │       ├── /pharmacies … PharmaciesPage
    │           │       ├── /ambulances … AmbulancesPage
    │           │       ├── /accommodations … AccommodationsPage
    │           │       ├── /programs … ProgramsPage
    │           │       ├── /hospitals … HospitalsPage
    │           │       └── /consultations … ConsultationsPage
    │           └── Footer
    │
    └── Machafi TV — news + broadcast brand (to build)
        └── TvAppShell — edition in the URL (separate editorial worlds, not only translation)
            ├── TvDocumentTitle
            ├── TvHeader (fixed) — chrome per edition: ar | fr | en
            ├── TvSpacer (header offset)
            ├── <main>
            │   └── <Routes>
            │       ├── /tv/ar/...  Arabic edition (Arabic UI + Arabic desk content)
            │       ├── /tv/fr/...  French edition
            │       └── /tv/en/...  English edition
            ├── TvFooter
            │
            ├── (inside each edition, same route shapes — example /tv/ar)
            │   ├── /tv/ar              — edition homepage (BBC/Al Jazeera–style hub)
            │   ├── /tv/ar/live         — web simulcast of linear TV channel (HLS/player stack)
            │   ├── /tv/ar/schedule     — optional: what’s on / EPG
            │   ├── /tv/ar/:section    — section fronts
            │   ├── /tv/ar/article/:slug
            │   └── /tv/ar/desk         — optional: journalist UI under edition (or shared /tv/desk + scope)
            │
            └── TvNewsroomPanel (authenticated — may be /tv/desk or per-edition paths)
                ├── Edition / desk scope: ar | fr | en
                ├── Submit / edit article → queues into that edition’s pipeline
                ├── Editor review / publish
                └── Hooks for live / schedule metadata when broadcast goes on air
```

**Switching “language” on TV** = **navigate** to another edition prefix (`/tv/fr/...`), not only swapping strings on the same path.

**Cross-links (product):** Services may link “Watch Machafi TV” → `/tv/{edition}/live`; TV may link “Health directories” → Services home (`/` or `/services` when routing is finalized).

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
| **Services** | Existing 14 routes; i18n via `t()` on same routes (Rule #1). |
| **Machafi TV** | Three **route trees** (`/tv/ar`, `/tv/fr`, `/tv/en`) + shared shell chrome pattern. |
| **TV news** | Editorial queues per edition; journalist desk submits into scoped queues. |
| **TV live** | Simulcast page per edition + broadcast pipeline behind HTTPS/HLS. |

---

## Related docs

| Doc | Contents |
|-----|----------|
| `WEBAPP_PAGES_OVERVIEW.md` | Services-only route table and readiness notes. |
| `project-explainer.md` | Directory-first product intent (Services). |
| `PROJECT_STATUS.md` | Done / in progress. |

---

*Single planning map; route counts and file paths may change when implementation starts.*

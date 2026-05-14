# MACHAFI frontend — block diagram

Versioned overview of the **`frontend/`** app (Vite + React + React Router + Tailwind). For an interactive DAG, open **`canvases/frontend-block-diagram.canvas.tsx`** in Cursor Canvas preview.

## Runtime stack (top → bottom)

```mermaid
flowchart TB
  subgraph build["Build / dev"]
    Vite[Vite]
  end

  subgraph entry["Entry"]
    HTML[index.html]
    Main[main.tsx]
  end

  subgraph routing["Routing"]
    BR[BrowserRouter]
  end

  subgraph i18n["Internationalization"]
    I18N[I18nProvider]
    TR[translations.ts]
    TR --> I18N
  end

  subgraph shell["App shell — App.tsx"]
    DT[DocumentTitle]
    H[Header]
    R[Routes]
    F[Footer]
  end

  subgraph pages["Route → page components"]
    P[Home, About, Live, News, Programs, Library, Services, Donations, Hospitals, Consultations, Pharmacies, Ambulances, Accommodations]
  end

  subgraph data["UI-first data"]
    M[src/data/*.ts mocks]
    PUB[public/ static assets]
  end

  Vite --> HTML
  Vite --> Main
  HTML --> Main
  Main --> BR
  BR --> I18N
  I18N --> shell
  I18N --> H
  I18N --> DT
  I18N --> P
  R --> P
  M --> P
  PUB --> P
```

## Concise layer view

| Layer | Responsibility |
| --- | --- |
| **Vite** | Dev server, production bundle, copies `public/`. |
| **Entry** | Mount React root, import global CSS. |
| **Router** | URL → page component. |
| **I18n** | `language`, `dir`, `t()`; syncs `document.documentElement`. |
| **Shell** | Fixed header, scrollable main, footer; `DocumentTitle` sets tab title. |
| **Pages** | Feature UI; consume `t()` + mock data; no network layer yet. |
| **Data** | Typed mocks per domain; replace with `services/` + API later. |

## Future boundary (planned)

```mermaid
flowchart LR
  Pages[Pages] --> Svc[services/ API adapters]
  Svc --> API[PHP /api or REST]
```

---

_Changelog: 2026-04-29 — initial diagram for current frontend._


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

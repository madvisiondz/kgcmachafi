# Machafi TV — UI visual evaluation & ideas

**Purpose:** Living document for **visual** critique, direction, and experiments for **Machafi TV** (`/tv/:edition/*`) — broadcast chrome, edition personality (AR / FR / EN), typography, motion, and “newsroom / control room” feel. Pair with `TRACKERS/machafi-tv/*` for routes, shells, and data contracts.

**Canonical UI:** `frontend/src/layouts/TvShellLayout.jsx` · pages: `frontend/src/pages/tv/*.jsx` · breaking bar and TV-specific components under `frontend/src/components/tv/`.

---

## Visual pillars (what “good” looks like)

| Pillar | Notes |
|--------|--------|
| **Broadcast identity** | Strong masthead, wire/breaking strip, schedule/live contrast — readable at a glance like a channel site, not a generic blog. |
| **Edition tone** | Same layout skeleton per edition; optional future nuance: typographic or accent shifts per edition code (`ar`, `fr`, `en`) without breaking RTL rules. |
| **Density** | Rails + topic nav: horizontal scroll patterns must feel intentional; avoid clutter on small breakpoints. |
| **Motion** | Live pulse, ticker, shimmer — energetic but disableable (`prefers-reduced-motion`, `motion-safe:`). |
| **Cross-link to Services** | Header branding shortcuts and any future promos should feel like **one family** with Machafi Services (see sister doc below). |

---

## Quick evaluation checklist (per page or PR)

- [ ] **Edition** — `dir={edition === 'ar' ? 'rtl' : 'ltr'}` and copy align; no orphaned LTR chips in RTL.
- [ ] **Hierarchy** — breaking / live / article: urgency communicated without screaming color everywhere.
- [ ] **Touch targets** — edition switcher, nav rail, search — adequate size on mobile.
- [ ] **Player area** — live page: placeholder vs future stream UI has clear “coming soon” or branded empty state.
- [ ] **Typography** — headline scale for TV home vs article vs desk; consistent with `DM Sans` stack in `frontend/src/index.css`.

---

## Ideas backlog (newest first)

_Add dated bullets: problem → proposed direction → optional screenshot link or PR._

- _(Template)_ **YYYY-MM-DD —** _Short title._ _Idea / reference / “try X”._

---

## References

| Doc | Role |
|-----|------|
| `TRACKERS/machafi-tv/*` | Shell, home, live, schedule, article, desk, activity, topic, search maps. |
| `PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md` | TV route table. |
| `PROJECT-EXPLAINER/PLATFORM_SHELL_LAYOUT.md` | Gateway → Services vs TV. |
| `SERVICES_UI_VISUAL_EVALUATION.md` | Sister doc for Machafi Services (shared brand discipline). |

---

*Last updated: **2026-05-11** — TV visual evaluation log + repo doc sync + push.*

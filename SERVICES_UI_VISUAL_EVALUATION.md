# Machafi Services — UI visual evaluation & ideas

**Purpose:** Living document for **visual** critique, direction, and experiments for **Machafi Services** (`/healthservices/*`) — header chrome, nav gradient, page density, cards/maps, and “directory + trust” feel. Pair with `TRACKERS/machafi-services/*` for sections, endpoints, and rebuild mapping.

**Canonical UI:** `frontend/src/layouts/ServicesLayout.jsx` · chrome: `frontend/src/components/layout/Header.jsx`, `Footer.jsx` · pages: `frontend/src/pages/*.jsx` (and shared sections under `frontend/src/pages/home/` where applicable).

---

## Visual pillars (what “good” looks like)

| Pillar | Notes |
|--------|--------|
| **Brand continuity** | Emerald / forest nav (`kgc-main-nav-gradient` in `frontend/src/index.css`), partner strip, logo treatment — consistent with gateway and TV cousin surfaces. |
| **Directory clarity** | Listings (pharmacies, hospitals, …): scannable rows/cards, map + list harmony, clear filters when they land. |
| **Header behaviour** | Utility bar collapse, ticker, branding-bar actions (portal / TV links) — premium, not noisy; see `PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md`. |
| **States** | Loading / empty / error patterns should feel designed, not default browser grey boxes. |
| **i18n + RTL** | All user-facing strings via `translations.ts`; layout respects `dir` from `I18nProvider`. |

---

## Quick evaluation checklist (per page or PR)

- [ ] **Nav** — active state readable; news pill / shimmer not overwhelming in compact header.
- [ ] **Responsive** — tablet: partner logos policy respected; mobile menu and icon row usable.
- [ ] **Content width** — `container` + section padding consistent across pages.
- [ ] **Imagery** — hero and cards: aspect ratios, lazy load, alt text where meaningful.
- [ ] **Accessibility** — contrast on green nav, focus rings on interactive elements.

---

## Ideas backlog (newest first)

_Add dated bullets: problem → proposed direction → optional screenshot link or PR._

- _(Template)_ **YYYY-MM-DD —** _Short title._ _Idea / reference / “try X”._

---

## References

| Doc | Role |
|-----|------|
| `TRACKERS/machafi-services/*` | Per-page maps (home, about, library, live, news, …). |
| `PROJECT-EXPLAINER/WEBAPP_PAGES_OVERVIEW.md` | Services route table. |
| `PROJECT-EXPLAINER/HEADER_SCROLL_ANIMATION.md` | Sticky header + collapse QA. |
| `PROJECT-EXPLAINER/RULE_1_LANGUAGE_SWITCHING.md` | AR / FR / EN + RTL. |
| `TV_UI_VISUAL_EVALUATION.md` | Sister doc for Machafi TV (broadcast vs directory balance). |

---

*Last updated: **2026-05-11** — Services visual evaluation log + repo doc sync + push.*

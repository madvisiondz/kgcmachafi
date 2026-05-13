# Header scroll collapse — tracking document

This document is the **single source of truth** for the sticky header’s **scroll-driven collapse animation**. It is updated whenever behavior, thresholds, or implementation changes.

## Why this exists

The header has **four bars** (news ticker, utility bar, branding bar, nav bar). The **branding bar is intentionally tall** for identity. On scroll, the chrome must **compact** so content gets vertical space back:

1. **News ticker** — collapses away with scroll (same visual intent as the old monolith: “gone”, not a broken clip).
2. **Utility bar** (dark bar: social, links, language) — collapses away with scroll.
3. **Branding bar** — **shrinks**: smaller main logo, partner logos hidden, Live/Programs become **icon-only** on desktop where applicable; vertical padding tightens so the **combined branding + nav** reads as one slim sticky strip (aligned with the old monolith behavior).

## Legacy behavior (monolith files removed 2026-05-13)

The original React tree under `legacy/` was deleted from this repo. The bullets below describe **observed behavior** that was ported into the rebuild; the live implementation is **`frontend/src/components/layout/Header.jsx`** + **`NewsTicker.jsx`**.

- **Former monolith**: `Header.jsx` (scroll-driven compact strip).
- **State**: `isCompact` (boolean)
- **Mechanism**:
  - `window` `scroll` listener, **`requestAnimationFrame` throttling** (one update per frame max).
  - **Direction-aware hysteresis** (prevents mobile jitter / oscillation):
    - Enter compact when **scrolling down** and `scrollY > ENTER_AT`
    - Exit compact when **scrolling up** and `scrollY < EXIT_AT`
  - Thresholds (carried forward):
    - **Mobile** (`max-width: 768px`): `ENTER_AT = 220`, `EXIT_AT = 120`
    - **Desktop**: `ENTER_AT = 140`, `EXIT_AT = 90`
  - **Ticker**: the old `UrgentNewsBanner.jsx` used `collapsed` + CSS grid `grid-rows-[0fr]` / `[1fr]` for **true zero height** (reliable vs `max-height` hacks). **`NewsTicker.jsx`** mirrors that pattern.
  - **Utility bar**: wrapped in the same **grid `0fr` / `1fr`** pattern as the ticker row in `Header.jsx`.
  - **Branding**: transitions on **logo width**, **partner logo opacity/width**, **button sizes** (`h-8 w-8` compact vs larger expanded).

## Rebuild implementation (new frontend)

- **Header shell**: `frontend/src/components/layout/Header.jsx`
  - Owns `isCompact` + scroll effect (ported from the old monolith header).
  - Passes `collapsed={isCompact}` into the ticker.
  - **Scroll thresholds** use **`max-width: 768px`** on **each rAF frame** and on **`matchMedia('change')`**, so rotating/resizing across mobile/desktop does not stick to the wrong `ENTER_AT` / `EXIT_AT`.
  - **Collapsed** utility bar: **`aria-hidden`** in addition to **`pointer-events-none`** (matches ticker doc intent).
  - **Mobile menu**: **`aria-expanded` / `aria-controls`**, **`Escape`** closes, **`body { overflow: hidden }`** while open; **`motion-reduce:transition-none`** on key collapse transitions.
- **Ticker**: `frontend/src/components/layout/NewsTicker.jsx`
  - Accepts optional `collapsed` prop; outer wrapper uses **grid `0fr` / `1fr`** + `overflow-hidden` + `pointer-events-none` when collapsed (matches old `UrgentNewsBanner` pattern).
  - Collapsed inner region is **`aria-hidden`**; prefers-reduced-motion trims grid transition.

## UX / accessibility notes

- When collapsed, hidden regions must not remain focusable: **`pointer-events-none`** on the collapsed grid child (legacy pattern).
- Header remains “always visible” at the top with a high z-index while reading long pages.
- **RTL/LTR**: collapse is scroll-based only; direction comes from global i18n (`document.documentElement.dir`). Verify ticker marquee + utility alignment after any header refactor.

## Important UX requirement: page content must never go under the header

**Problem observed**: while scrolling (especially when the header collapses/expands), some page content can end up **under** the header, making reading and scrolling up feel inconvenient.

**Goal**: pages (the content between header and footer) must always start **below** the header. Even during the collapse animation, the visitor should keep seeing the entire page content — the header must not “take content with it”.

### Rebuild fix (new frontend)

- Header is rendered as **fixed** at the top (`position: fixed; top: 0`) so it does not affect normal layout flow.
- The app publishes the **live header height** to a CSS variable:
  - `--app-header-height`
  - Updated via `ResizeObserver` in `frontend/src/components/layout/Header.jsx`
- The app shell inserts a **spacer** right after `<Header />` with height `var(--app-header-height)`:
  - `frontend/src/App.tsx`

Result: the page content never scrolls underneath the collapsing header.

## QA checklist (run on every change)

- [ ] **Desktop**: scroll down past threshold → ticker + utility disappear; branding shrinks; nav usable.
- [ ] **Desktop**: scroll up → expands smoothly without flicker.
- [ ] **Tablet (`sm`–`lg`)**: branding bar shows **Machafi + actions only** — **no** partner logo strip (by design).
- [ ] **Mobile**: no rapid toggle near threshold; hysteresis feels stable.
- [ ] **AR / FR / EN**: switch language with header expanded and collapsed; no layout breakage.
- [ ] **No underlap**: content never appears underneath the header during collapse/expand.
- [ ] **Performance**: scroll handler does not schedule more than one rAF per frame.

## Branding bar — partner logos (breakpoint policy)

**2026-04-30 — Tablet regression (“shame” bug, saved here):** On **tablet widths** (between `sm` and `lg`), partner marks were shown (`hidden sm:block`) but the layout/CDN combo produced a **broken row**: broken image glyph **side-by-side with visible alt / filename-style text** instead of a clean logo lockup — poor brand presentation.

**Decision:** Partner logos render only from **`lg` (1024px) upward** — i.e. **desktop-wide branding bar**. **Mobile + tablet:** Machafi mark + actions only; **no** KGC/Komas images in the header.

**Implementation:** `frontend/src/components/layout/Header.jsx` — both partner wrappers use **`hidden lg:block`** (not `sm:block`). Compact scroll still collapses partner width to `0` when `isCompact` on desktop.

## Changelog

| Date (UTC+1) | Change |
| --- | --- |
| 2026-04-29 | Created this document; ported legacy scroll hysteresis + grid collapse to new `Header.jsx` / `NewsTicker.jsx`. |
| 2026-04-29 | Implemented: `isCompact` drives `NewsTicker collapsed`, utility bar grid collapse, branding logo shrink + partner hide + Live/Programs icon-only (desktop) + tighter branding padding. |
| 2026-04-29 | No header behavior change: workflow canvas JSX repair only (documentation cross-reference in `../TRACKERS/machafi-services/HOMEPAGE_MAP.md`). |
| 2026-04-29 | Fixed “content goes under header” inconvenience: header is fixed + app spacer uses `--app-header-height` (ResizeObserver) so content never underlaps during collapse/expand. |
| 2026-05-13 | **B1 code pass**: scroll thresholds re-evaluated per frame + on **`matchMedia`** breakpoint change; collapsed utility + ticker **`aria-hidden`**; mobile menu **`aria-expanded` / `aria-controls`**, **Escape** to close, **body scroll lock** while open; **`motion-reduce:transition-none`** on collapse-related transitions (`Header.jsx`, `NewsTicker.jsx`). |

## Open decisions / follow-ups

- Optional: mirror legacy **exact** branding vertical rhythm (pixel diff) using a screenshot overlay.
- Optional: extend **`prefers-reduced-motion`** to branding width/opacity transitions (partially applied: ticker + utility grid + branding padding).


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

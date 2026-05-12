# General animation reference (KGC Machafi frontend)

This document tracks the **custom “kgc” home/landing animations** added for the deploy build: definitions, timing, accessibility, and where they appear in code.

## Source of truth

| Location | Role |
|----------|------|
| `frontend/tailwind.config.js` | `keyframes` + `theme.extend.animation` for `animate-kgc-*` utilities |
| `frontend/src/index.css` | `prefers-reduced-motion` override for those utilities only |
| `frontend/src/pages/HomePage.jsx` | Primary usage (hero, stats, staff, news, platform cards) |

## Tailwind utilities (`motion-safe:animate-kgc-*`)

All on-page uses are wrapped with Tailwind’s **`motion-safe:`** variant so users with **“Reduce motion”** enabled do not get the decorative motion (the CSS file below also forces `animation: none` for the generated class names as a second layer).

| Utility | Keyframe | Duration / behavior | Purpose |
|---------|----------|---------------------|---------|
| `animate-kgc-pop` | `kgc-pop` | 0.75s, `cubic-bezier(0.22, 1, 0.36, 1)`, `both` | One-shot entrance: fade + rise + slight overshoot scale |
| `animate-kgc-float-soft` | `kgc-float-soft` | 7s, ease-in-out, **infinite** | Gentle vertical drift + tiny rotation (hero card) |
| `animate-kgc-wiggle` | `kgc-wiggle` | 2.2s, ease-in-out, **infinite** | Small left-right rotation (used **on hover** for live icon only) |
| `animate-kgc-blob` | `kgc-blob` | 18s, ease-in-out, **infinite** | Slow drift + scale for blurred hero background blobs |
| `animate-kgc-heart-soft` | `kgc-heart-soft` | 2.8s, ease-in-out, **infinite** | Soft “heartbeat” scale pulse (hero badge inner pill) |

### Keyframe summary (conceptual)

- **`kgc-pop`:** `opacity 0 → 1`, `translateY` up with a small **scale overshoot** at mid keyframe, settle at rest.
- **`kgc-float-soft`:** subtle `translateY` and ±0.8° rotation loop.
- **`kgc-wiggle`:** ±3° rotation oscillation.
- **`kgc-blob`:** combined `translate` + mild `scale` for organic background motion.
- **`kgc-heart-soft`:** two-step scale bump (~1.06) then back to 1.

## Accessibility (`prefers-reduced-motion`)

In `frontend/src/index.css`, inside `@media (prefers-reduced-motion: reduce)`, these classes are set to **`animation: none !important`**:

- `.animate-kgc-pop`
- `.animate-kgc-float-soft`
- `.animate-kgc-wiggle`
- `.animate-kgc-blob`
- `.animate-kgc-heart-soft`

Other site transitions (e.g. hover shadows) are **not** globally disabled—only these decorative utilities.

## Usage on `HomePage.jsx`

### Hero

- **Background:** three absolutely positioned blurred circles use **`motion-safe:animate-kgc-blob`**; two blobs use negative **`animationDelay`** (`-9s`, `-4s`) to desynchronize motion.
- **Badge:** outer wrapper **`motion-safe:animate-kgc-pop`**; inner pill **`motion-safe:animate-kgc-heart-soft`** (nested so two animations do not fight on one element).
- **Title / subtitle / CTA row:** **`motion-safe:animate-kgc-pop`** with staggered delays **`90ms`**, **`160ms`**, **`230ms`**.
- **Live CTA:** `group` on button; live PNG icon uses **`motion-safe:group-hover:animate-kgc-wiggle`** (wiggle **only on hover**). Button also uses **`motion-safe:hover:scale-[1.03]`**.
- **Hero media column:** column wrapper **`motion-safe:animate-kgc-pop`** with **`animationDelay: 120ms`**; white card **`motion-safe:animate-kgc-float-soft`**. The tilted green panel behind it is **static** (no float).

### Below the fold

- **`StatCard`:** **`motion-safe:animate-kgc-pop`** + optional **`enterDelay`** → `animationDelay` in ms (**`i * 95`** per card).
- **`StaffPill`:** same pop + **`i * 55`** ms stagger.
- **`NewsCard`:** pop + hover lift; **`i * 110`** ms stagger.
- **Platform grid links:** **`motion-safe:animate-kgc-pop`** with **`animationDelay: i * 48` ms** (and existing hover lift/scale patterns on the cards).

## Related animations (not in Tailwind `kgc-*` theme)

Defined in `frontend/src/index.css` and used elsewhere—listed here so “general animation” stays discoverable:

| Class / keyframes | File(s) | Role |
|-------------------|---------|------|
| `kgc-marquee-ltr` / `kgc-marquee-rtl` | `index.css`, `NewsTicker.jsx` | Directional news ticker scroll |
| `kgc-glow` | `index.css`, `Header.jsx`, `NewsTicker.jsx` | Pulsing glow on emphasis chips |
| `kgc-nav-shimmer` | `index.css`, `Header.jsx` | Shimmer overlay on main nav gradient |

---

*Last updated to match the home “adorable” motion pass and deploy bundle (Tailwind `kgc-*` set + `HomePage.jsx` wiring).*

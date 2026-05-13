# Smoke checklist — before each release (Phase A5)

Run this after `npm run build` and when deploying `frontend/dist` or `ready-to-deploy/public_html/`.

**Environments:** record results for `dev` (Vite), `staging` (if any), `prod`.

| # | Surface | URL | AR RTL | FR LTR | EN LTR | Mobile | Desktop | Pass |
|---|---------|-----|--------|--------|--------|--------|---------|------|
| 1 | Gateway | `/` | | | | 375px | 1280px | [ ] |
| 2 | Machafi Services home | `/healthservices` | | | | | | [ ] |
| 3 | Machafi TV (Arabic edition) | `/tv/ar` | | — | — | | | [ ] |
| 4 | Health Services admin shell | `/healthservices/admin` | | | | | | [ ] |
| 5 | Machafi TV admin shell | `/machafitv/admin` | | | | | | [ ] |
| 6 | Error boundary (optional) | Trigger a dev-only throw or break a child route in a branch build | | | | | | [ ] |

**Keyboard / focus**

- [ ] Tab reaches main CTAs on gateway (Services + TV).
- [ ] Language buttons in header remain usable after navigation Services → Home.

**Notes column** (optional): paste screenshot links or ticket IDs.

---

*Aligned with `NEXT_STEPS_PRODUCTION.md` Phase A and `ARCHITECTURE_PRODUCTION_READINESS.md` (gateway ~72%, Services UI ~78%).*


---

*Last updated: **2026-05-13** — evening session close (project-wide doc sync).*

# About + Contact (`/about`) — press desk + routing

## Purpose

Single page answering:

- **Who we are**: institutional story in **press-release tone** (Machafi mission + editorial standards + partner framing).
- **Contact**: same URL with **`#contact`** for the utility-bar shortcut; shows phone/email/address from existing i18n footer strings plus a **UI-first enquiry form** (wire to mail/API later).

## Legacy / product references

- Utility bar previously used `href="#"` for “Who we are” and “Contact” in `frontend/src/components/layout/Header.jsx` — now **`/about#about`** and **`/about#contact`**.
- Partner logos already present in header (`KGC`, `Komas Group`); copy aligns with that **published relationship**, informed by public listings that reference **Komas Group** as an Algerian business entity active in **business services / distribution-oriented commerce** (web sources vary; editorial disclaimer included on-page).

## Routes

- **`/about`** — full scroll page.
- Deep links: **`/about#about`**, **`/about#contact`** (hash scroll handled in `AboutContactPage.jsx`).

## i18n (Rule #1)

All prose under `about.press.*` and `about.contact.*` in **EN / FR / AR**.  
Document title uses `header.whoWeAre` for `/about` (`DocumentTitle.jsx`).

## Files

- `frontend/src/pages/AboutContactPage.jsx`
- `frontend/src/components/layout/Header.jsx` (utility links)
- `frontend/src/App.tsx` (route)
- `frontend/src/components/DocumentTitle.jsx`

## Follow-ups (optional)

- Connect enquiry form to `POST /api/public/contact` + admin inbox.
- Add `/about` to footer “read more” column if desired.
- Replace `#` social URLs in header/footer with real profiles.

## Changelog

- **2026-04-29**: Initial combined About + Contact page + header wiring + i18n.

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see root `PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in root `PROMPT_LOG.md` under **2026-04-30**.
- This page’s **API / admin contracts** below are unchanged unless product scope changes.

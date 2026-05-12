# Machafi TV — wire & activity (`/tv/:edition/activity`)

Single source of truth for **`TvActivityPage`**: public-safe **newswire-style** chronological updates (similar to live blogs / internal wire rendered for audience).

## 1) Purpose

- **Signal velocity**: time + label + short update body; urgent rows visually distinct.
- **Editorial boundary**: copy states updates are “public-safe” — not raw internal chat.

## 2) Route

- **`/tv/:edition/activity`**

## 3) UX flow

1. Title + subtitle (**`tvApp.activityTitle`**, **`tvApp.activitySub`**).
2. Link to **Desk** for workflow context.
3. **List** of `tvWireActivity` lines: time, localized label, localized body; `urgent` → tinted row.

## 4) Data contracts

### UI-first

- **`frontend/src/data/tvMock.ts`** — `tvWireActivity`: `id`, `time`, `label` (`TvLocalized`), `body` (`TvLocalized`), `urgent?`.

### Target production

- Append-only feed with moderation state, `published_at`, optional `related_article_slug`, edition scope.

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/wire?limit=50&cursor=`
  - Only `approved` lines; no internal reviewer names unless policy allows.

### Admin

- `GET/POST/PUT /api/admin/tv/wire` — create line, edit, retract, mark urgent.
- Audit log for who published each line.

## 6) i18n

- Page chrome: **`tvApp.activityTitle`**, **`tvApp.activitySub`**, **`tvApp.footerNote`** (footer disclaimer).
- Line **content** today: **`tvMock`** localized strings (per-edition editorial voice in data).

## 7) File map

- `frontend/src/pages/tv/TvActivityPage.jsx`
- `frontend/src/data/tvMock.ts` — `tvWireActivity`, `pick`
- `frontend/src/components/DocumentTitle.jsx` — `tvApp.activityTitle`

## 8) Safeguards

- **Retractions**: API must support `retracted_at` and client should hide or show “withdrawn” per policy.
- **Rate**: avoid flooding; throttle publish rate in admin.

## 9) Changelog

- **2026-05-12**: Tracker added for wire list UI + data model.

---

## Documentation sync (2026-05-12)

- **`TV_DESK_PAGE_MAP.md`**, **`TV_HOME_PAGE_MAP.md`** (“See wire” link), **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.

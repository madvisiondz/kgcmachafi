# Machafi TV — live broadcast (`/tv/:edition/live`)

Single source of truth for **`TvLivePage`** inside the **Machafi TV** shell (not Services **`/healthservices/live`** — see **`../machafi-services/LIVE_PAGE_MAP.md`**).

## 1) Purpose

- **Simulcast surface**: full-width stage placeholder, on-air sidebar, peek at **today’s schedule**, production toolkit list (studio/cue/rundown/rights).
- **Trust**: ties to `live.*` strings where reused (e.g. player CTA label); medical disclaimer line.

## 2) Route

- **`/tv/:edition/live`**

## 3) UX flow

1. Headline + subcopy explain stream wiring from admin when configured.
2. **Stage** — placeholder + “Start playback” button (UI-only until HLS URL bound).
3. **Sidebar** — “on air now” (sample from schedule mock), schedule peek + link to **Schedule**, production bullets.

## 4) Data contracts

### UI-first

- **`frontend/src/data/tvMock.ts`** — `tvScheduleDay`, `pick()` for localized slot titles.

### Target production

- Same as **`../machafi-services/LIVE_PAGE_MAP.md`** player config: `stream_url`, `poster`, `status`, geo rules, signed URLs.
- Edition-specific stream keys if desks publish different channels.

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/live` — `{ status, hls, poster, title, description, up_next[] }`.

### Admin

- `GET/PUT /api/admin/tv/live` — per-edition stream URLs, slate/disclaimer HTML, chat toggles.
- Optional: `POST /api/admin/tv/live-override` — “breaking into programming” title crawl.

## 6) i18n

- **`tvApp.*`** — `liveHeadline`, `liveSub`, `livePlaceholder`, sidebar titles, tool list.
- **`live.player.goLive`**, **`live.status.live`**, **`live.broadcast.description`** (shared with Services live copy where appropriate).

## 7) File map

- `frontend/src/pages/tv/TvLivePage.jsx`
- `frontend/src/data/tvMock.ts` — `tvScheduleDay`
- `frontend/src/components/DocumentTitle.jsx` — `tvApp.navLive`

## 8) Safeguards

- Emergency messaging: never imply the web player replaces **emergency services**.
- Autoplay / signed URLs: follow browser policy and CDN token rules in production.

## 9) Changelog

- **2026-05-12**: Tracker added; documents TV-scoped live page + schedule peek.

---

## Documentation sync (2026-05-12)

- **`../machafi-services/LIVE_PAGE_MAP.md`** — Services live (separate product surface).
- **`TV_SHELL_PAGE_MAP.md`**, **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.

# Live (“Watch live”) — architecture + broadcast value

Single source of truth for the **`/live`** experience in the new frontend.

## 1) Purpose

The Live page is the **primary attention surface** for the channel:

- **Trust**: clear “live / off air” semantics, medical disclaimer, and emergency guidance.
- **Quality**: theater layout, fullscreen, share, and metadata row (viewers, latency, quality) like professional apps (YouTube Live, Twitch, Vimeo Live).
- **Continuity**: bridges to **Programs** (schedule) and **Library** (long-form education).

Legacy parity: `legacy/src/pages/LivePage.jsx` + `legacy/src/components/VideoPlayer.jsx` (live vs recorded tabs, poster + play, recorded grid).

---

## 2) UX flow (visitor)

1. Land on `/live` → see **status strip** + **main stage** (poster until play).
2. Tap **Start playback** → HTML5 `<video>` with native controls (autoplay policy friendly via `playsInline` + `muted` initial path handled by starting unmuted after user gesture in demo).
3. Switch **Recorded shows** → pick a card → player loads same demo asset (UI-first) and scrolls to top.
4. Use **Theater width** / **Share** / **Fullscreen** / link to **Program schedule**.

---

## 3) Data contracts

### UI-first mocks

- `frontend/src/data/live.ts`
  - `livePlayerSettingsMock`: `streamUrl`, `posterUrl`, `viewerCountLabel`, `broadcastState`
  - `liveRecordedMock`: ties into existing `programs.items.*` i18n titles via `programKey`
  - `liveUpNextMock`: lightweight queue rows

### Target production (admin + API)

Mirror legacy `settings.live_player` (see legacy `VideoPlayer` default + `useSiteContent`):

```json
{
  "section_title": "…",
  "section_subtitle": "…",
  "live_title": "…",
  "live_description": "…",
  "preview_image_url": "https://…",
  "stream_url": "https://…m3u8|mp4"
}
```

Extend with:

- `hls_url`, `dash_url`, `backup_mp4_url`
- `geo_allow`, `geo_block`
- `preroll_disclaimer_html`
- `chat_enabled`, `chat_provider`, `moderation_level`

---

## 4) Endpoint proposals

### Public

- `GET /api/public/live`
  - Returns sanitized player config for the active locale (no secrets).
  - Example fields: `status`, `stream`, `poster`, `title`, `description`, `up_next[]`.

### Admin

- `GET /api/admin/live-settings`
- `PUT /api/admin/live-settings` (validate URLs, image hosts, HTTPS-only in prod)
- `POST /api/admin/live-events` (optional: scheduled windows, title overrides)

Map to PHP: extend existing settings table (legacy pattern) or dedicated `live_settings` row JSON.

---

## 5) i18n (Rule #1)

All visible strings under `live.*` except recorded card titles/descriptions, which reuse `programs.items.<key>.title|desc`.

Document title uses `common.watchLive` in `DocumentTitle.jsx` for `/live`.

---

## 6) File map

- `frontend/src/pages/LivePage.jsx`
- `frontend/src/data/live.ts`
- `frontend/src/App.tsx` — route **`/live`**
- `frontend/src/components/DocumentTitle.jsx` — tab title segment
- `frontend/src/i18n/translations.ts` — `live.*` (AR/FR/EN)

---

## 7) Safeguards

- Always surface **emergency guidance** (not a telemedicine triage channel unless licensed workflow exists).
- **Autoplay**: respect browser policies; prefer explicit user gesture before unmuted autoplay in production.
- **Chat**: placeholder until auth + moderation policies exist.

---

## 8) Changelog

- **2026-04-29**: Initial `/live` rebuild — broadcast UI, tabs, sidebar, mocks, i18n, tracker.

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- This page’s **API / admin contracts** below are unchanged unless product scope changes.

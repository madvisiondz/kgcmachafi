# Machafi TV — edition home (`/tv/:edition`)

Single source of truth for **`TvHomePage`**: hero + rails + story river + sidebar (trending, tools, trust).

## 1) Purpose

- **Front door** for each editorial tree: lead stories, topic pills, latest river, broadcast strip to **Live**.
- **Industry layout**: large hero, secondary grid, “latest” list, sidebar trending and cross-links to **Desk**, **Activity**, **Search**, TV admin.

## 2) Route

- **`/tv/:edition`** (index route under `TvShellLayout`) — `edition` ∈ `ar` | `fr` | `en`.

## 3) UX flow

1. **Live strip** (dark band) → CTA to `/tv/:edition/live`.
2. **Hero** + **secondary** cards from `getLeadStories(edition, 5)` (first = hero).
3. **Topic pills** → `/tv/:edition/topics/:id`.
4. **River** — remaining stories after lead block.
5. **Sidebar** — trending list, tools links, trust blurb.

## 4) Data contracts

### UI-first

- **`frontend/src/data/tvMock.ts`**
  - `getTvStories`, `getLeadStories`
  - `TvStory` — slug, topic, localized title/dek/kicker/byline, `heroTone`, optional `breaking`, optional `body`

### Target production

- Homepage modules: lead slots, topic ordering, “trending” algorithm, sponsored/disclosure flags (if any).

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/home` — `{ hero[], secondary[], river[], trending[], liveStrip? }`.

### Admin

- `GET/PUT /api/admin/tv/home-layout` — slot assignment, featured slugs, module visibility per edition.
- Reuse story admin (see **`TV_ARTICLE_PAGE_MAP.md`**) for underlying content.

## 6) i18n

- **`tvApp.*`** for section titles, CTAs, tools labels, trust copy.

## 7) File map

- `frontend/src/pages/tv/TvHomePage.jsx`
- `frontend/src/components/tv/TvStoryCard.jsx`
- `frontend/src/tv/useTvEdition.ts`
- `frontend/src/routes/paths.ts` — `tvEditionPath`

## 8) Safeguards

- Empty dataset: guard UI if API returns zero stories (placeholder + link to desk).
- **Breaking** badge only when editorial flag set.

## 9) Changelog

- **2026-05-12**: Tracker added for current home implementation (hero, river, sidebar, topic pills).

---

## Documentation sync (2026-05-12)

- **`TV_SHELL_PAGE_MAP.md`** — shared chrome.
- **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.

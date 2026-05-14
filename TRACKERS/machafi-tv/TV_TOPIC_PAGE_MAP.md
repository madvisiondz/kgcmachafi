# Machafi TV — topic hub (`/tv/:edition/topics/:topicId`)

Single source of truth for **`TvTopicPage`**: filtered story grid for **health**, **policy**, **research**, or **community**.

## 1) Purpose

- **Beat pages**: same taxonomy as home topic pills and primary nav.
- **Invalid guard**: unknown `topicId` redirects to **`/tv/:edition/`** (index).

## 2) Route

- **`/tv/:edition/topics/:topicId`**
- Valid `topicId`: `health` | `policy` | `research` | `community` (matches **`TvTopicId`** in `tvMock.ts`).

## 3) UX flow

1. Resolve topic label via i18n (`tvApp.topicHealth`, …).
2. `getTvStoriesByTopic(edition, topicId)` → grid of **`TvStoryCard`** (full cards).
3. Link back to **Home**.

## 4) Data contracts

### UI-first

- **`frontend/src/data/tvMock.ts`** — `getTvStoriesByTopic`, `TvStory.topic`.

### Target production

- Topic metadata (slug, title, SEO description, hero image) from CMS; stories many-to-many with topics.

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/topics/{topicId}/articles?limit=&cursor=`

### Admin

- Taxonomy CRUD, topic ordering per edition, featured story per topic.
- Prevent orphaned slugs: redirect map when topic merged/renamed.

## 6) i18n

- **`tvApp.topicPageTitle`** (section kicker), **`tvApp.topicHealth`**, **`topicPolicy`**, **`topicResearch`**, **`topicCommunity`**, **`navHome`**, **`breakingBadge`**, **`searchEmpty`** (empty state).

## 7) File map

- `frontend/src/pages/tv/TvTopicPage.jsx`
- `frontend/src/components/tv/TvStoryCard.jsx`
- `frontend/src/data/tvMock.ts`
- `frontend/src/layouts/TvShellLayout.jsx` — nav links to each topic

## 8) Safeguards

- **Only allowlisted topic slugs** on the client; server must validate too.

## 9) Changelog

- **2026-05-12**: Tracker added for topic grid + redirect behavior.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. Uses **`tv_articles.topic_key`** (+ **`TV_HOME_PAGE_MAP.md`** table DDL).

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/tv/editions/{edition}/topics/{topicId}/articles` | **`api/public/tv-topic-articles.php`** | `WHERE edition=? AND topic_key=? AND status='published' ORDER BY published_at DESC LIMIT` |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/PUT | `/api/admin/machafitv/taxonomy/topics` | **`api/admin/tv-topics.php`** — order, featured slug per topic |

---

## Documentation sync (2026-05-12)

- **`TV_HOME_PAGE_MAP.md`**, **`TV_SHELL_PAGE_MAP.md`**, **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

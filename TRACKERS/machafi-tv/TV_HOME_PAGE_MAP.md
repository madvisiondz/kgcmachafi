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

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. Public TV uses path param **`edition`** ∈ `{ar,fr,en}` (see API standard doc).

### MySQL (shared TV content)

```sql
CREATE TABLE tv_articles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  edition CHAR(2) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  topic_key VARCHAR(64) NOT NULL,
  status ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  breaking TINYINT(1) NOT NULL DEFAULT 0,
  published_at DATETIME NULL,
  embargo_until DATETIME NULL,
  reading_minutes INT NULL,
  body_md TEXT NULL,
  title VARCHAR(512) NOT NULL,
  dek VARCHAR(512) NULL,
  UNIQUE KEY uq_ed_slug (edition, slug),
  KEY idx_home (edition, status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tv_home_layout (
  edition CHAR(2) NOT NULL PRIMARY KEY,
  layout_json JSON NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/tv/editions/{edition}/home` | **`api/public/tv-home.php`** | `tv_home_layout` + top N from `tv_articles` |
| GET | `/api/public/tv/editions/{edition}/articles` | **`api/public/tv-articles.php`** | River / featured queries |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/PUT | `/api/admin/machafitv/editions/{edition}/home-layout` | **`api/admin/tv-home-layout.php`** |
| CRUD articles | `/api/admin/machafitv/editions/{edition}/articles` | **`api/admin/tv-articles.php`** |

---

## Documentation sync (2026-05-12)

- **`TV_SHELL_PAGE_MAP.md`** — shared chrome.
- **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.


---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

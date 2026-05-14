# Machafi TV — search (`/tv/:edition/search`)

Single source of truth for **`TvSearchPage`**: headline search across TV mock stories with **`?q=`** query string.

## 1) Purpose

- **Discovery**: keyword search over localized headline, dek, and kicker (client-side today).
- **Shareable results**: `?q=keyword` in URL; input syncs from `useSearchParams`.

## 2) Route

- **`/tv/:edition/search`**
- Optional query: **`?q=`** (trimmed; empty → prompt state, no results list).

## 3) UX flow

1. User types in field, submits → `setSearchParams({ q })`.
2. `searchTvStories(edition, q)` returns matching cards.
3. **Compact** `TvStoryCard` list; link home when browsing away.

## 4) Data contracts

### UI-first

- **`frontend/src/data/tvMock.ts`** — `searchTvStories(edition, q)` (case-insensitive substring).

### Target production

- Full-text index (DB or Elasticsearch), typo tolerance, facets (topic, date), rate limiting.

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/search?q=&limit=&cursor=`
  - Return story summaries + total count; highlight snippets optional.

### Admin

- Synonym map, blocked terms, “editor’s picks” for zero-result queries.
- Search analytics (aggregate only; GDPR-safe).

## 6) i18n

- **`tvApp.searchTitle`**, **`tvApp.searchPlaceholder`**, **`tvApp.searchSubmit`**, **`tvApp.searchEmpty`**, **`navHome`**.
- Subtitle reuses **`newsroom.filters.subtitle`** (Services newsroom parallel).

## 7) File map

- `frontend/src/pages/tv/TvSearchPage.jsx`
- `frontend/src/data/tvMock.ts` — `searchTvStories`
- `frontend/src/components/tv/TvStoryCard.jsx`
- `frontend/src/components/DocumentTitle.jsx` — `tvApp.searchTitle`

## 8) Safeguards

- **Injection**: sanitize `q` server-side; max length on client and server.
- **Empty query**: do not claim “no results” until user has submitted a non-empty search.

## 9) Changelog

- **2026-05-12**: Tracker added for `?q=` behavior + `searchTvStories` integration.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. Search reads **`tv_articles`** (see **`TV_HOME_PAGE_MAP.md`** DDL).

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/tv/editions/{edition}/search` | **`api/public/tv-search.php`** | `MATCH(title,dek,body_md) AGAINST (? IN BOOLEAN MODE)` or `LIKE` with length cap; `LIMIT` per API standard |

### HTTP — admin

| Method | Path | Purpose |
|--------|------|---------|
| GET/PUT | `/api/admin/machafitv/search-config` | synonyms, blocked terms, editor picks (optional JSON table) |

---

## Documentation sync (2026-05-12)

- **`../machafi-services/NEWS_PAGE_MAP.md`** (newsroom filters/search patterns), **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.


---

## 12) Implemented HTTP map (Machafi TV — 2026-05-14)

**Machafi TV** JSON under `/api/public/tv/...` is **not implemented** in this repository; the SPA still uses **`frontend/src/data/tvMock.ts`**. Target HTTP shapes remain in **§6 Endpoint proposals** above and in **`TV_SHELL_PAGE_MAP.md`**.

**Machafi Services** (directory app) public JSON that **is** implemented: **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`**.

**TV admin** (`/machafitv/admin/*`): no `api/admin/tv-*.php` modules yet — see **`../machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`**.

---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

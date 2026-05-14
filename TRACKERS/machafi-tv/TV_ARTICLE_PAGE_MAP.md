# Machafi TV — article / story detail (`/tv/:edition/article/:slug`)

Single source of truth for **`TvArticlePage`**: long-form story view with share/print/correction row and disclaimer.

## 1) Purpose

- **Read experience**: kicker, headline, byline, date, reading time, multi-paragraph body.
- **Accountability**: medical disclaimer, link to **Desk** for tools/corrections workflow narrative.

## 2) Route

- **`/tv/:edition/article/:slug`**
- Unknown `slug` → friendly empty state + link home (uses `tvApp.searchEmpty` copy for “not found” line).

## 3) UX flow

1. Resolve story via `getTvStoryBySlug(slug)`.
2. Render localized fields with `pick(..., edition)`.
3. **Body**: if `story.body` exists, split paragraphs on `\n\n`; else repeat lead (`dek`) as placeholder paragraphs (demo only).
4. Actions: Share / Print / Request a correction (buttons UI-only until wired).

## 4) Data contracts

### UI-first

- **`frontend/src/data/tvMock.ts`** — `getTvStoryBySlug`, `TvStory`, optional `body: TvLocalized`.

### Target production

- CMS blocks (paragraph, embed, pull quote), revision history, correction notes, canonical URL per edition.

## 5) Endpoint proposals

### Public

- `GET /api/public/tv/editions/{edition}/articles/{slug}` — full article with SEO fields.
- `GET /api/public/tv/editions/{edition}/articles` — list (for sitemap/feeds).

### Admin

- Full editorial CRUD, embargo, breaking flag, byline, reviewer, legal hold.
- Align with **`../machafi-services/NEWS_PAGE_MAP.md`** patterns (`news_articles` or parallel `tv_articles` namespace).

## 6) i18n

- **`tvApp.*`** — article actions, disclaimer, tools title.
- **`newsroom.detail.disclaimerTitle`** — reused for disclaimer box heading.

## 7) File map

- `frontend/src/pages/tv/TvArticlePage.jsx`
- `frontend/src/data/tvMock.ts`
- `frontend/src/components/DocumentTitle.jsx` — `tvApp.articlePlaceholder` (refine to story title later)

## 8) Safeguards

- **Not medical advice** — disclaimer visible on every article.
- **Corrections** — production workflow should append visible correction blocks, not silent edits.

## 9) Changelog

- **2026-05-12**: Tracker added; body vs dek fallback documented.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. Detail row = **`tv_articles`** (`TV_HOME_PAGE_MAP.md`); add optional `tv_article_seo(edition, slug, json)` if needed.

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/tv/editions/{edition}/articles/{slug}` | **`api/public/tv-article.php`** | `SELECT * FROM tv_articles WHERE edition=? AND slug=? AND status='published'` and `embargo_until` check |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/POST/PUT/DELETE | `/api/admin/machafitv/editions/{edition}/articles` | **`api/admin/tv-articles.php`** — full CRUD, embargo, breaking |

---

## Documentation sync (2026-05-12)

- **`../machafi-services/NEWS_PAGE_MAP.md`** — Services newsroom (related editorial patterns).
- **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.


---

## 12) Implemented HTTP map (Machafi TV — 2026-05-14)

**Machafi TV** JSON under `/api/public/tv/...` is **not implemented** in this repository; the SPA still uses **`frontend/src/data/tvMock.ts`**. Target HTTP shapes remain in **§6 Endpoint proposals** above and in **`TV_SHELL_PAGE_MAP.md`**.

**Machafi Services** (directory app) public JSON that **is** implemented: **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`**.

**TV admin** (`/machafitv/admin/*`): no `api/admin/tv-*.php` modules yet — see **`../machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`**.

---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

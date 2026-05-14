# News (“newsroom”) — architecture + editorial value (journalist-first)

This document is the **single source of truth** for the News experience rebuild in the new frontend.

## 1) Purpose (why this page matters)

Machafi is a **health channel** where journalism is a daily responsibility. The News section must earn attention by being **useful**, not loud:

- **Clarity**: headline + lead + “what to do next” (links to operational directories).
- **Credibility**: visible source, topic taxonomy, dates, reading time, and editorial disclaimers.
- **Operational fit**: stories should frequently route readers to **Programs**, **Library**, **Pharmacies**, **Ambulances**, and **Consultations** when relevant.

If we do this correctly, News becomes a **trust surface** for the whole platform — not a side widget.

---

## 2) Former monolith source (tree removed 2026-05-13)

### List page

- Old `NewsPage.jsx`
  - Source filters modeled as “wire agencies”
  - Client search across title + description
  - Grid cards with source pill + date + tag + “read more”

### Supporting UI

- Old `HealthNews.jsx` (home section teaser → `/news`)

### Data access pattern

- Old `news-service.js` maps DB fields (`description`) to UI fields (`desc`) via `contentApi`.

### Rebuild differences (new frontend)

- No external UI kit dependencies: **Tailwind + native controls**.
- **Multilingual content** is modeled explicitly in mocks (`ar/fr/en`) while UI chrome stays in i18n keys (Rule #1).
- Adds **journalist-facing structure**: featured/breaking, desk principles panel, “routes to action”, and a detail page route.
- Navbar **News** item gets a distinctive “broadcast” treatment (badge + glow + shimmer) while keeping RTL/LTR safe.

---

## 3) Product model (what we are building toward)

### A) Public stories (primary)

Each public story should be renderable in **AR/FR/EN** with:

- headline (`title`)
- lead (`description` / `lead` in mocks)
- body (`content` as structured blocks in CMS; paragraphs in mocks)
- topic tag(s) (`tag` today; becomes taxonomy later)
- wire/source attribution (`source` today; becomes controlled vocabulary + rights metadata later)
- scheduling metadata (`date`, later: `published_at`, `embargo_until`)
- flags: `featured`, `breaking` (new columns or `settings` JSON until migrated)
- editorial metadata: byline, reviewer, changelog (future tables)

### B) Editorial workflow (secondary, but non-negotiable for “professional journalists”)

Minimum viable workflow for a serious newsroom:

- **Draft → In review → Approved → Published → Updated → Archived**
- **Embargo** support (don’t leak on public endpoints)
- **Audit trail** (who changed what, when)
- **Corrections** (append a correction note without silently rewriting history)

### C) Distribution surfaces (future)

- Home teaser (`/`) linking to `/news` and `/news/:id`
- Optional RSS/Atom (`/feed/news.xml`) for partners (future)

---

## 4) UX principle (visitor flow)

Visitors should be able to answer these quickly:

1) “What matters right now?” → **featured + wire strip**
2) “Is this credible?” → **source + date + desk standards + disclaimer**
3) “What do I do next?” → **routes to action** + deep links to operational pages

### Routes implemented (UI-first)

- **`/news`**: listing + filters + featured module + desk sidebar
- **`/news/:id`**: story detail + share/print + disclaimer

---

## 5) Data contracts

### Current production DB (existing PHP API)

The repository already ships a minimal `news_articles` API:

- Public: `api/public/news.php`
  - `GET` list: `?limit=&archived=`
  - `GET` item: `?id=`
- Admin: `api/admin/news.php`
  - `GET` list (admin)
  - `POST` create
  - `PUT ?id=` update
  - `DELETE ?id=` delete

Current columns (as used by admin create/update):

- `title` (string)
- `description` (string) — public teaser / lead
- `content` (string|null) — long-form body
- `tag` (string)
- `source` (string)
- `date` (string)
- `is_archived` (int/boolean-like)

### Frontend mock contract (UI-first)

File: `frontend/src/data/news.ts`

- Uses multilingual fields for `title`, `lead`, and `body[]`
- Uses stable keys for `sourceKey` + `tagKey` mapped to i18n labels (`newsroom.sources.*`, `newsroom.tags.*`)

### Migration plan (DB + API) — recommended

Add columns (or a `news_article_i18n` table) instead of stuffing JSON into `content`:

**Option A (normalized, best for professional newsrooms)**

- `news_article_i18n(article_id, lang, title, lead, body_md, seo_title, seo_desc)`
- `news_article_topics(article_id, topic_key)`
- `news_article_versions(article_id, version, editor_id, diff_json, created_at)`

**Option B (fastest bridge)**

- Keep `news_articles` as canonical Arabic row
- Store FR/EN in `settings.news_i18n` keyed by article id until migration

---

## 6) Endpoint proposals (public + admin)

### Public read API (recommended contract)

> Note: today the repo exposes PHP files directly; these paths are the **logical** REST shape.

#### `GET /api/public/news`

Query params:

- `lang`: `ar|fr|en` (optional; determines which localized fields are returned)
- `q`: full-text query (optional)
- `tag`: topic key (optional)
- `source`: wire key (optional)
- `featured`: `0|1` (optional)
- `breaking`: `0|1` (optional)
- `archived`: `0|1` (optional; default `0`)
- `limit`, `cursor` (optional pagination)

Response (200):

```json
{
  "items": [
    {
      "id": 601,
      "slug": "national-digital-health-roadmap-2026",
      "published_at": "2026-04-28T09:30:00+01:00",
      "date": "2026-04-28",
      "featured": true,
      "breaking": true,
      "reading_minutes": 6,
      "source": { "key": "local", "label": "Machafi desk" },
      "topics": [{ "key": "national", "label": "National" }],
      "title": "…",
      "lead": "…",
      "url": "/news/601"
    }
  ],
  "next_cursor": null
}
```

#### `GET /api/public/news/{id}`

Response (200):

```json
{
  "item": {
    "id": 601,
    "slug": "national-digital-health-roadmap-2026",
    "published_at": "2026-04-28T09:30:00+01:00",
    "updated_at": "2026-04-28T11:10:00+01:00",
    "title": "…",
    "lead": "…",
    "body_html": "<p>…</p>",
    "topics": [{ "key": "national", "label": "National" }],
    "source": { "key": "local", "label": "Machafi desk" },
    "byline": { "key": "desk", "label": "Editorial desk" },
    "seo": { "title": "…", "description": "…", "canonical_path": "/news/601" },
    "corrections": []
  }
}
```

Errors:

- `404` unknown id/slug
- `409` embargoed (optional; or treat as 404 for public anonymity)

### Admin write API (recommended contract)

#### `GET /api/admin/news`

List + filters for desk UI:

- `status`, `author`, `q`, `from`, `to`, `tag`, `source`

#### `POST /api/admin/news`

Create draft:

```json
{
  "status": "draft",
  "i18n": {
    "ar": { "title": "…", "lead": "…", "body_md": "…" },
    "fr": { "title": "…", "lead": "…", "body_md": "…" },
    "en": { "title": "…", "lead": "…", "body_md": "…" }
  },
  "topics": ["national"],
  "source_key": "local",
  "featured": false,
  "breaking": false,
  "embargo_until": null
}
```

#### `PATCH /api/admin/news/{id}`

Partial updates, including publish transitions:

```json
{ "status": "in_review", "editor_note": "Verify hospital names" }
```

#### `POST /api/admin/news/{id}/publish`

Atomic publish:

- validates required locales (policy: AR required + FR/EN optional OR all required)
- sets `published_at`
- clears embargo

### Mapping to existing `.php` files (today)

- Replace/extend `api/public/news.php` to support filters + localized payloads.
- Replace/extend `api/admin/news.php` to support drafts, i18n payloads, and moderation states.
- Keep backwards compatibility during rollout:
  - If `lang` omitted, return legacy fields (`title`, `description`, `content`) as today.

---

## 7) i18n completeness (Rule #1)

### UI chrome

All visible UI strings live under:

- `newsroom.*`
- `nav.newsBadge`

### Dynamic labels (sources/tags)

Dynamic labels are translated via stable keys:

- `newsroom.sources.*`
- `newsroom.tags.*`

### Article text

Article `title/lead/body` remain multilingual objects in mocks until the API returns localized fields.

---

## 8) File map (frontend)

- `frontend/src/pages/NewsPage.jsx` — listing + filters + featured + desk sidebar
- `frontend/src/pages/NewsDetailPage.jsx` — detail + share/print + disclaimer
- `frontend/src/data/news.ts` — mock articles + desk principles
- `frontend/src/App.tsx` — routes `/news` and `/news/:id`
- `frontend/src/components/layout/Header.jsx` — premium News nav styling
- `frontend/src/index.css` — `kgc-nav-shimmer` animation helper
- `frontend/src/i18n/translations.ts` — `newsroom.*` + `nav.newsBadge`

---

## 9) Safeguards (health + journalism)

- Always show a **medical disclaimer** on article pages (not a substitute for clinical care).
- Prefer “**verify + link**” over sensationalism; breaking badge should be **rare** and policy-controlled.
- Any “urgent” health instruction must be reviewed by editorial/medical review roles before auto-publishing.

---

## 10) Changelog

- **2026-04-29**: Initial newsroom rebuild shipped (UI-first): `/news`, `/news/:id`, mocks, i18n, tracker, navbar emphasis.

---

## 11) Full endpoint design — GoDaddy + MySQL (SQL)

**Platform:** GoDaddy (Linux, Apache, PHP) + **MySQL/MariaDB**. JSON envelope, pagination, `lang`: **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. Deploy layout: **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**.

The **logical REST contract** is **§6 Endpoint proposals** above. Implement as PHP under `api/public/` and `api/admin/` with the standard `{ ok, data, error }` shape.

### MySQL (logical — extend or replace legacy `news_articles`)

| Table | Purpose |
|-------|---------|
| `news_articles` | `id`, `slug`, `status`, `published_at`, `embargo_until`, `featured`, `breaking`, `source_key`, `is_archived`, legacy `title` / `description` / `content` / `tag` / `source` / `date` |
| `news_article_i18n` | `(article_id, lang)` → `title`, `lead`, `body_md`, optional `seo_title`, `seo_description` |
| `news_article_topics` | `(article_id, topic_key)` |
| `news_article_versions` | Optional audit: `article_id`, `version`, `editor_id`, `payload_json`, `created_at` |

**Indexes:** `(status, published_at DESC)`, `(featured)`, `(breaking)`, `(source_key)`; optional `FULLTEXT` on `title`+`lead` per language table.

### PHP ↔ HTTP (map to repo files)

| Logical | PHP (extend in repo) |
|---------|----------------------|
| `GET /api/public/news` | `api/public/news.php` — query `lang`, `q`, `tag`, `source`, `featured`, `breaking`, `archived`, `limit`, `cursor` |
| `GET /api/public/news/{id}` | `api/public/news.php?id=` (or split `news-item.php`) |
| `GET/POST/PATCH/DELETE /api/admin/news` | `api/admin/news.php` — desk list, drafts, publish transitions per §6 |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

# Home Page Map (former monolith → rebuild)

Purpose: keep a **precise, engineer-friendly map** of the homepage sections and their corresponding components so we can rebuild and iterate without losing structure.

**File location (repo):** `TRACKERS/machafi-services/HOMEPAGE_MAP.md`

> **Note (2026-05-13):** The old `legacy/` tree was removed from the repository. Paths below that look like `…/src/components/Foo.jsx` refer to **former monolith filenames** for section parity only. The live homepage is **`frontend/src/pages/HomePage.jsx`**.

Reference order (former monolith): `HomePage.jsx`

Section order (top → bottom):

1. **Hero**
   - **Former monolith component**: `Hero.jsx`
   - **Role**: primary value prop + CTA buttons + hero image + hero stats (3 mini stats)
   - **Key UI traits**:
     - Light green gradient background
     - Badge pill + two-line headline
     - 2 CTAs (Live / Services)
     - Hero image card with rotated gradient backing
   - **Legacy hero image**:
     - **Legacy default URL**: `https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3`
     - **Rebuild local asset**: `frontend/public/home/hero.jpg` (downloaded from the legacy default URL for stability)
     - Row of 3 icon stats chips under CTAs

2. **Ad banner (slot 1234567890)**
   - **Former monolith component**: `AdBanner.jsx`
   - **Role**: AdSense placeholder block (728×90 look)

3. **Stats counter**
   - **Former monolith component**: `StatsCounter.jsx`
   - **Role**: animated counters + “staff roles” strip
   - **Note**: legacy pulls data via `fetchSiteStats()` (backend logic) → **must be mocked/static in rebuild**

4. **Health in Drama**
   - **Former monolith component**: `HealthInDrama.jsx`
   - **Role**: dark highlight section with YouTube embed + bullets
   - **Legacy video URL**: `https://www.youtube.com/embed/SbDeMQ26RM8`

5. **Health News (recent)**
   - **Former monolith component**: `HealthNews.jsx`
   - **Role**: recent news cards (3) + “Read more”
   - **Note**: legacy fetches via `fetchAllNews()` → **mock/static in rebuild**

6. **Platform Sections grid (cards linking to pages)**
   - **Former monolith inline section** in the old `HomePage.jsx`
   - **Role**: grid of feature cards with gradient icon box + title + description
   - **Cards (legacy order)**:
     - Live (`/live`)
     - Programs (`/programs`)
     - Services (`/service`)
     - Library (`/library`)
     - Pharmacies (`/pharmacies`)
     - Ambulances (`/ambulances`)
     - Accommodation (`/accommodations`)
     - Hospitals (`/hospitals`)
     - Consultations (`/consultations`)
     - Donations (`/donations`)

7. **Ad banner (slot 0987654321)**
   - **Former monolith component**: `AdBanner.jsx`

Cross-cutting wrappers:
- **Reveal** animation wrapper around most sections
  - **Former monolith component**: `Reveal.jsx` (Framer Motion + in-view)

---

## 2) Rebuild mapping (clean UI-only plan)

New app root: `frontend/`

### Rebuild page
- **Target file**: `frontend/src/pages/HomePage.jsx`
- **Rule**: UI only (no API), all strings via i18n (AR/FR/EN)

### Rebuild sections → components

1. Hero
   - **Rebuild component**: `frontend/src/pages/home/HeroSection.jsx`
   - **Data**: static mock content in `frontend/src/data/home.ts`

2. Ad banners
   - **Rebuild component**: `frontend/src/pages/home/AdBannerSection.jsx`
   - **Data**: static (slotId only for label), no AdSense script

3. Stats
   - **Rebuild component**: `frontend/src/pages/home/StatsSection.jsx`
   - **Data**: static mock counts + roles list

4. Health in Drama
   - **Rebuild component**: `frontend/src/pages/home/DramaSection.jsx`
   - **Data**: uses legacy embed URL (UI-only) + i18n copy

5. Health News
   - **Rebuild component**: `frontend/src/pages/home/NewsSection.jsx`
   - **Data**: static list of 3 cards

6. Platform Sections grid
   - **Rebuild component**: `frontend/src/pages/home/PlatformSections.jsx`
   - **Data**: static list mapping to routes; icons use `frontend/public/nav-icons/*.png` + `live-red.png` / `programs-blue.png`

### i18n keys (must exist)
- `home.hero.*`
- `home.sections.*`
- `home.stats.*`
- `home.drama.*`
- `home.news.*`
- `home.platform.*`

---

## 3) Implementation notes (pixel-perfect strategy)

- **First pass**: match layout, spacing, typography, and backgrounds (no animation).
- **Second pass**: reintroduce reveal/scroll animations only if needed (keep them isolated).
- **RTL/LTR**: validate every section in AR (RTL) and FR/EN (LTR).

## 4) Related: sticky header scroll collapse

The homepage sits under a **sticky header** whose **scroll collapse** behavior is documented separately (thresholds, hysteresis, grid collapse, changelog):

- See `HEADER_SCROLL_ANIMATION.md`

## 5) Related: why the rebuild avoids “hard backend” pages

Legacy pain (especially directory pages like Hospitals) and rebuild rules are summarized for ongoing reference:

- See `../../PROJECT-EXPLAINER/LEGACY_SYSTEM_PROBLEMS_AND_REBUILD_RULES.md`

## 6) Page tracker rule

`TRACKERS/machafi-services/HOMEPAGE_MAP.md` is the dedicated tracker for the Home page.

This establishes the pattern for all future pages:

- each new page gets its own `.md` tracker,
- that file is updated whenever work is done on that page.

Workflow canvas (DAG + phase timeline) lives in Cursor at `canvases/project-workflow.canvas.tsx` (managed project path). It must stay valid JSX: avoid raw `<tag>` text inside JSX children; use string expressions or `Code` when showing markup.

## 7) Related: client-side routes from Home

The app uses **React Router**. Internal navigation to the Library uses **`/library`** (see `LIBRARY_PAGE_MAP.md`). Home hero/platform links that point at implemented routes use `Link` from `react-router-dom`; nav items for pages not yet built may still use placeholder `href` values until those routes exist.

---

## 8) Proposed public API endpoints (for this page)

Home is the **actuality feed hub** for the whole platform.

Even if most of the UI is static early, the real Home page should eventually read from a small number of stable endpoints that power:

- “What’s new” across **all pages** (News, Programs, Library, Services, etc.)
- curated “featured” blocks (pinning)
- lightweight stats

- `GET /api/site/stats`
  - Returns: counts shown in the stats section (visitors, subscribers, registered, staff counts if applicable)

- `GET /api/site/home-feed?limit=20`
  - Returns: a lightweight, merged feed of “what’s new” across pages (ordered newest → oldest)
  - Each feed item should include only what Home needs:
    - `id`, `type`, `publishedAt`, `title`, `excerpt?`, `image?`, `href`
    - Optional: `badge`, `sourcePage` (e.g. `news`, `programs`, `library`)
  - Examples of `type`:
    - `news_post`, `program_episode`, `library_book`, `service_update`, `directory_notice`

- (Optional) `GET /api/site/home-featured`
  - Returns: curated Home configuration (hero headline, badges, featured video URL, featured sections order)
  - Useful if you want to change Home highlights without redeploying frontend

- (Optional) `GET /api/site/featured?key=home.news&limit=3`
  - Returns: pinned/curated items for a specific Home section (e.g. “Featured news”)

---

## 9) Admin Control Panel controls (to keep this page accurate)

### A) Home featured content

- Edit hero badge/title/subtitle (AR/FR/EN) if made CMS-driven
- Set / change the featured “Health in Drama” video URL
- Manage “Home feed” behavior:
  - pin/unpin items (curation)
  - hide items (moderation)
  - section rules (what types appear in each Home section)
  - limits (e.g. “max 3 items per source”)

### B) Site stats (if shown publicly)

- Define what counts mean (source of truth)
- Optional: hide/show stats modules to avoid misleading numbers

### C) Ad slots (placeholders now, real later)

- Manage ad slot IDs/labels (if you integrate AdSense or a managed ad system later)

---

## 10) Full endpoint design — GoDaddy + MySQL (SQL)

**Hosting:** **GoDaddy** (Linux, Apache, PHP). **Database:** **MySQL/MariaDB**. Cross-cutting rules: **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. SPA calls same-origin **`/api`** (`frontend/src/config.ts`).

### MySQL (logical DDL — adjust names to your existing prefix)

```sql
CREATE TABLE site_stats (
  id TINYINT PRIMARY KEY DEFAULT 1,
  visitors BIGINT NOT NULL DEFAULT 0,
  subscribers BIGINT NOT NULL DEFAULT 0,
  registered_users BIGINT NOT NULL DEFAULT 0,
  staff_count INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE site_home_config (
  id TINYINT PRIMARY KEY DEFAULT 1,
  hero_badge_json JSON NULL,
  drama_video_url VARCHAR(512) NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE home_feed_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  feed_type ENUM('news','program','library','service','directory_notice') NOT NULL,
  ref_id BIGINT NOT NULL,
  published_at DATETIME NOT NULL,
  title_json JSON NOT NULL,
  excerpt_json JSON NULL,
  href VARCHAR(512) NOT NULL,
  badge VARCHAR(64) NULL,
  KEY idx_published (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public (`api/public/`)

| Method | Path | PHP (on GoDaddy) | SQL |
|--------|------|------------------|-----|
| GET | `/api/public/site/stats` | **`api/public/site-stats.php`** (new) | `SELECT * FROM site_stats WHERE id=1` |
| GET | `/api/public/site/home-feed` | **`api/public/home-feed.php`** (new) | `SELECT * FROM home_feed_items ORDER BY published_at DESC LIMIT :limit` (+ optional `cursor`) |
| GET | `/api/public/site/home-featured` | **`api/public/home-featured.php`** (optional) | `site_home_config` + pinned joins |
| GET | `/api/public/site/featured` | **`api/public/home-featured-section.php`** (optional) | `?key=home.news&limit=3&lang=ar` |

**Query params:** `lang`, `limit` (max 100), `cursor` per API standard doc.

### HTTP — admin (`api/admin/`)

| Method | Path | Purpose |
|--------|------|---------|
| GET/PUT | `/api/admin/site/stats` | maintain hero counters |
| GET/PUT | `/api/admin/site/home-config` | hero / drama URL |
| POST | `/api/admin/site/home-feed/rebuild` | cron or manual refresh of `home_feed_items` |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.



---

*Last updated: **2026-05-13** — evening session close (project-wide doc sync).*

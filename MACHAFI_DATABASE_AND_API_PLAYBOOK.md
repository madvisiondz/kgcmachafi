# MACHAFI — Database & API playbook (read this like a beginner)

This guide is written for **you** if backend words feel new. You can read it **once**, in order, and you will know **where data lives**, **how the website talks to PHP**, and **what to click in phpMyAdmin** when you are ready. Every example uses **this repo’s real folders** (`frontend/`, `api/`, `PROJECT-EXPLAINER/`, …).

---

## Start here — three sentences

1. **MySQL** is the filing cabinet (tables and rows). **phpMyAdmin** is the web screen where you create or edit that cabinet.  
2. **PHP** in **`api/`** is the waiter: it reads the request, opens MySQL, and returns **JSON**.  
3. **React** in **`frontend/`** is the dining room: it shows the UI and **asks** the waiter for JSON. React **never** creates tables by itself.

You are **allowed** to build the UI first with **fake data** (mocks). When you want “real” rows, you turn on the env flags (see §8) and make sure MySQL + PHP are ready.

---

## Tiny glossary (plain words)

| Word | What it means here |
|------|---------------------|
| **Endpoint** | A URL that returns data for the app, usually **`/api/public/something.php`**. Example from this project: **`/api/public/news.php`**. |
| **JSON** | Text in a machine-readable shape `{ "items": [ ... ] }` that JavaScript can read. |
| **`admin-config.php`** | A small PHP file **on the server** with database password and host. **Do not** paste production passwords into GitHub. |
| **Table / row / column** | Excel-style: a **table** is one sheet, a **row** is one record, a **column** is one field (e.g. `phone`). |
| **Mock** | Fake data inside **`frontend/src/data/`** so pages look real **before** MySQL exists. |

---

## How the pieces fit (this repo only)

| Piece | Folder | What it does |
|-------|--------|----------------|
| **Website UI** | **`frontend/`** | React + Vite. Uses **`frontend/src/services/`** to `fetch` JSON. |
| **API (PHP)** | **`api/`** | `api/public/*.php` = mostly **read** for visitors; `api/admin/*.php` = **write** for admins (login required). |
| **DB connection** | **`api/admin/bootstrap.php`** | Builds PDO connection using **`admin-config.php`** on the server. |
| **MySQL** | (GoDaddy / phpMyAdmin) | Stores **`news_articles`**, **`pharmacies`**, **`hospitals`**, etc. |
| **Deploy instructions** | **`ready-to-deploy/README.txt`** | How `index.html`, `assets/`, and **`api/`** should sit on hosting. |

**One real journey (News list):**  
Someone opens the site → React loads **`NewsPage.jsx`** → if **`VITE_NEWS_API=true`**, code in **`frontend/src/services/news.ts`** calls  
`GET {your site}/api/public/news.php?limit=80` → **`api/public/news.php`** runs SQL on **`news_articles`** → JSON `{ "items": [...] }` returns → the page draws cards.

---

## Map: “if I touch X, what file is it?”

### Frontend (where you add `fetch` logic)

| Job | File |
|-----|------|
| API base (`/api` vs full URL) | **`frontend/src/config.ts`** (`VITE_API_BASE_URL`) |
| Shared `fetch` + timeout + errors | **`frontend/src/services/http.ts`** (`apiUrl`, `getJson`, `ApiError`) |
| News list + article detail | **`frontend/src/services/news.ts`** (`loadNewsArticlesForList`, `loadNewsArticleForDetail`) — flag **`VITE_NEWS_API`** |
| Pharmacies list + map | **`frontend/src/services/pharmacies.ts`** (`loadPharmaciesForList`) — flag **`VITE_PHARMACIES_API`** |
| Hospitals directory (Algeria + abroad tabs) | **`frontend/src/services/hospitals.ts`** (`loadHospitalDatasets`) — flag **`VITE_HOSPITALS_API`** |
| Copy-paste env names | **`frontend/.env.example`** |
| Pages that already show loading / retry | **`NewsPage.jsx`**, **`NewsDetailPage.jsx`**, **`PharmaciesPage.jsx`**, **`HospitalsPage.jsx`** |

### PHP (where SQL runs)

| Job | File |
|-----|------|
| Public news JSON | **`api/public/news.php`** → table **`news_articles`** |
| Public pharmacies JSON | **`api/public/pharmacies.php`** → table **`pharmacies`** |
| Public hospitals JSON | **`api/public/hospitals.php`** → table **`hospitals`** |
| Public international hospitals JSON | **`api/public/international-hospitals.php`** → table **`international_hospitals`** |
| Admin create/edit news | **`api/admin/news.php`** |
| Admin create/edit pharmacies | **`api/admin/pharmacies.php`** |
| DB bootstrapping | **`api/admin/bootstrap.php`** |

### Docs (ideas, not executed code)

| Job | Folder |
|-----|--------|
| Product + routing memory | **`PROJECT-EXPLAINER/`** |
| Per-page specs (often example `CREATE TABLE` for the future) | **`TRACKERS/`** |

---

## All **`api/public/`** scripts in this repo (so nothing feels “hidden”)

When the browser calls **`/api/public/<file>.php`** (with **`VITE_API_BASE_URL=/api`**), it maps to **`api/public/<file>.php`** on disk:

| File | What it’s for (short) |
|------|------------------------|
| `news.php` | News: list; `?id=` = one article → **`news_articles`** |
| `pharmacies.php` | Pharmacies list → **`pharmacies`** |
| `hospitals.php` | Hospitals filters (`wilaya`, `type`, `city`) |
| `programs.php` | Programs |
| `books.php` | Library / books |
| `accommodations.php` | Housing |
| `ambulances.php` | Ambulances |
| `international-hospitals.php` | International hospitals |
| `site-content.php` | **Big bundle**: settings, hero stats, services, video programs, consultations, … |
| `reviews.php` | Reviews |
| `news-comments.php`, `news-ratings.php` | News extras |
| `auth/login.php`, `register.php`, `session.php`, `logout.php` | Auth |
| `translate.php`, `translate-health.php` | Translation helpers |

**Writes** (add/change rows) almost always go through **`api/admin/...`** after login — not through these public files.

---

## phpMyAdmin — your first database (you can do this **later**)

You do **not** have to create MySQL on day one. The app can use **mocks** until you flip **`VITE_NEWS_API`** / **`VITE_PHARMACIES_API`** / **`VITE_HOSPITALS_API`**.

### A) Create the empty database

1. Log into hosting → open **phpMyAdmin**.  
2. **Databases** → create a database (example name: **`web_app`** — use the same name in **`admin-config.php`**).  
3. Create a **user** + password; grant **all privileges** on that database (good enough to start).

### B) Tell PHP where MySQL is

1. On the server, copy **`ready-to-deploy/admin-config.php.example`** → **`admin-config.php`**.  
2. Fill **host**, **database name**, **username**, **password**, **charset** (`utf8mb4`).  
3. PHP code that reads it: see **`api/admin/bootstrap.php`** (it `require`s `admin-config.php` from the site root area).

### C) Create tables (two ways)

**Way 1 — Paste SQL**  
phpMyAdmin → select your database → **SQL** tab → paste the script from §5 below → **Go**.

**Way 2 — Import a file**  
**Import** tab → choose a `.sql` file → **Go**.

**Recommended habit:** create a folder in the repo **`database/`** and save the same SQL there (e.g. `001_initial.sql`) so you remember what you ran. This repo does **not** ship that folder yet — you create it when you want.

---

## Example SQL that matches **our** PHP (minimal starter)

If your future export from phpMyAdmin looks different, **trust phpMyAdmin** and adjust PHP / **`frontend/src/services/*`** mappers to match.

### Table **`news_articles`** (used by **`api/public/news.php`** + **`api/admin/news.php`**)

```sql
CREATE TABLE news_articles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  content LONGTEXT NULL,
  tag VARCHAR(120) NOT NULL DEFAULT 'وطني',
  source VARCHAR(120) NOT NULL DEFAULT 'محلي',
  date DATE NOT NULL,
  is_archived TINYINT(1) NOT NULL DEFAULT 0,
  slug VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_news_date (date),
  KEY idx_news_archived (is_archived)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table **`pharmacies`** (used by **`api/public/pharmacies.php`** + **`api/admin/pharmacies.php`**)

```sql
CREATE TABLE pharmacies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  wilaya VARCHAR(120) NOT NULL,
  commune VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  latitude DOUBLE NULL,
  longitude DOUBLE NULL,
  is_night_duty TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_pharmacies_active (is_active),
  KEY idx_pharmacies_wilaya (wilaya)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table **`hospitals`**

The formatter in **`api/public/hospitals.php`** expects several `*_json` columns. Before inventing a full `CREATE TABLE`, open that PHP file (and **`api/admin/hospitals.php`** if you use it) **or** export structure from phpMyAdmin after you design the first row by hand.

---

## Updating the database later (no panic checklist)

| I want to… | I do… |
|------------|--------|
| Add a new column | phpMyAdmin → table → **Structure** → **Add column**, *or* run `ALTER TABLE ... ADD ...`. |
| Rename / resize a column | **Structure** → **Change** on that column. |
| Remember what we did | Save the same `ALTER` into **`database/00x_description.sql`** in the repo. |
| Copy production → laptop | Production phpMyAdmin **Export** → dev database **Import** (never the other way around by mistake). |

**Golden rule:** If MySQL columns change, update **PHP** (if it selects those names) **and** the **TypeScript mapper** in **`frontend/src/services/`** so the UI still understands the JSON.

---

## Adding a **new** endpoint (copy this recipe)

1. **Think in rows:** decide the **table** and columns in phpMyAdmin.  
2. **Public read:** add **`api/public/my-feature.php`**, `require` bootstrap, run `SELECT`, `json_response(['items' => …])`.  
3. **Sanity test in browser:** open `https://YOUR-SITE/api/public/my-feature.php` — you should see JSON.  
4. **Frontend service:** add **`frontend/src/services/myFeature.ts`** with `apiUrl('/public/my-feature.php')` + `getJson`.  
5. **Optional safety switch:** add **`VITE_MY_FEATURE_API`** to **`frontend/.env.example`** + **`vite-env.d.ts`**, like news/pharmacies.  
6. **UI:** call your loader from a page (same pattern as **`PharmaciesPage.jsx`** + **`useBootstrapList`**).

Admin-only create/update = **`api/admin/my-feature.php`** + login checks — wire the admin UI when you build it (see **`TRACKERS/machafi-services-admin/`**).

---

## Turn on “real” data in the SPA (copy-paste)

Create **`frontend/.env.local`**:

```env
VITE_API_BASE_URL=/api
VITE_NEWS_API=true
VITE_PHARMACIES_API=true
VITE_HOSPITALS_API=true
```

Then:

```bash
cd frontend
npm run dev
```

If it fails: open browser **DevTools → Network**, click the failed request, read status code. Compare URL with **`ready-to-deploy/README.txt`** (is **`api/`** really next to the built site?).

---

## Troubleshooting (only what you need first)

| What you see | First thing to check |
|----------------|----------------------|
| HTTP 500 / empty | Wrong DB password in **`admin-config.php`**; or table missing. |
| HTTP 404 on `/api/public/...` | Hosting path: **`api/`** not uploaded or URL base wrong (`VITE_API_BASE_URL`). |
| React shows **Retry** banner | `getJson` threw — not JSON, timeout, or wrong URL. **`frontend/src/services/http.ts`**. |
| Wrong text on cards | Column names ≠ mapper — compare phpMyAdmin columns with **`mapPhpNewsRow`** / **`mapPhpPharmacyRow`**. |

---

## After you read this — “am I ready?” checklist

Check each box mentally (or on paper):

- [ ] I know **MySQL** holds data; **phpMyAdmin** is where I create tables.  
- [ ] I know **`api/public/*.php`** returns JSON; **`frontend/src/services/`** calls it.  
- [ ] I know **`admin-config.php`** is server-only secrets.  
- [ ] I can run the app **without** a database (mocks) **or** flip **`VITE_NEWS_API` / `VITE_PHARMACIES_API` / `VITE_HOSPITALS_API`** when MySQL is ready.  
- [ ] I know where to read deeper: **`PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`** (step-by-step cPanel), **`API_STANDARD_GODADDY_MYSQL.md`**, **`API_ENDPOINT_REGISTRY.md`**, **`NEXT_STEPS_PRODUCTION.md`**, **`TRACKERS/`**.

If those are true, you are ready for the next build day without feeling lost.

---

## Read next (same project, more detail)

- **`PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`** — GoDaddy + folder layout.  
- **`PROJECT-EXPLAINER/GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`** — beginner **cPanel** deploy (MySQL import, `api/`, `dist/`, `.htaccess`, first admin login).  
- **`PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** — how JSON responses should look.  
- **`NEXT_STEPS_PRODUCTION.md`** — ordered production work.  
- **`ARCHITECTURE_PRODUCTION_READINESS.md`** — “how close to production are we?”  
- **`TRACKERS/machafi-services/*_PAGE_MAP.md`** — per-page ideas (including example SQL for future tables).

---

*This playbook is yours to edit when reality changes. Keep examples pointing at real paths in this repo.*

---
*Last updated: **2026-05-14** — **`GODADDY_CPANEL_DEPLOYMENT_GUIDE.md`** + Health Services **admin v1**; Gateway + TV branding, Vercel https://kgcmachafi.vercel.app ; doc sync.*

# Library page map (former monolith → rebuild)

## Purpose

Directory-style **health books** listing: browse cards, category label, e-book vs physical, optional read (PDF iframe) or download CTA.

## Former monolith source (removed 2026-05-13)

- **Page shell**: old `LibraryPage.jsx` (rendered `HealthLibrary` only).
- **UI + behavior**: old `HealthLibrary.jsx`
  - Fetched books via `contentApi.listBooks()`.
  - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, card height ~380px skeleton.
  - Card: cover image, category, type badge (ebook / physical), title, author, pages + icon, CTA (Read / Download).
  - E-book: opens **Dialog** with PDF `iframe`.
  - Download: programmatic `<a download>` + toasts (legacy `toast`).

## Rebuild (new frontend)

| Item | Location |
| --- | --- |
| Route | `/library` — `frontend/src/App.tsx` (`react-router-dom`) |
| Page | `frontend/src/pages/LibraryPage.jsx` |
| Mock data | `frontend/src/data/libraryBooks.ts` (UI-only; replace with service later) |
| i18n | `frontend/src/i18n/translations.ts` → `library.*` (AR / FR / EN) |

### Section order (top → bottom)

1. **Page chrome** — `section#library`, `py-16 bg-slate-50`, `dir` from i18n.
2. **Optional feedback banner** — inline status when download/read blocked (replaces legacy toast for UI-only phase).
3. **Hero header** — blue circle + `BookOpen` icon, gradient title, subtitle (centered).
4. **Search bar** — filters the grid by **localized** title, author, and category (`toLocaleLowerCase` substring match); clear control; `library.noSearchResults` when the query matches nothing.
5. **Empty state** — dashed card when the catalog is empty (i18n `library.empty`).
6. **Book grid** — 4 columns on large screens; cards match legacy layout (image 48 height, body, footer row).
7. **Read modal** — full-screen overlay + `iframe` for PDF when `filePath` is valid; backdrop click / Escape closes.

### Data fields (mock / future API)

Per card: `id`, `bookKey` (i18n `library.books.*`), `categoryKey` (`library.categories.*`), `bookType` (`ebook` | `physical`), `pages`, `imageUrl`, `filePath` (`#` = no file).

---

## Proposed public API endpoints (for this page)

- `GET /api/library/books`
  - Query: `q?`, `category?`, `type?`, `page?`, `limit?`
  - Returns: paged list of book cards (with stable ids)

- `GET /api/library/books/:id`
  - Returns: full details for one book (optional; useful for a future details page)

- (Optional) `GET /api/library/categories`
  - Returns: the list of categories if we want categories to be admin-managed instead of hardcoded i18n keys

---

## Admin Control Panel controls (to keep this page accurate)

### A) Book catalog management

- Create / edit / archive book entries
  - title (AR/FR/EN), author (AR/FR/EN) or translation keys strategy
  - category, type (ebook/physical), pages, cover image
- Upload / link the PDF (for ebooks) and manage file URLs safely

### B) Quality + trust

- Mark “verified source” / “trusted reference”
- Track `lastUpdatedAt`
- Bulk import (CSV/JSON) + duplicate detection by title/author

### C) Public moderation controls

- Hide broken file links quickly (disable download/read)
- Optional “report broken file” queue for user feedback

### i18n keys

- `library.title`, `library.subtitle`
- `library.searchPlaceholder`, `library.searchAriaLabel`, `library.clearSearch`, `library.noSearchResults`
- `library.download`, `library.read`, `library.startDownload`, `library.downloadSuccess`
- `library.empty`, `library.typeEbook`, `library.typePhysical`
- `library.noFileTitle`, `library.noFileDesc`, `library.close`
- `library.categories.*`, `library.books.b1` … `b4` (`title`, `author`)

## Changelog

| Date (UTC+1) | Note |
| --- | --- |
| 2026-04-29 | Initial rebuild: UI clone of `HealthLibrary`, mock catalog, routing + `Link` in shell; no `contentApi`. |
| 2026-04-29 | Quality gate: `frontend` `npm run build` (tsc + vite) passed; project trackers synced. |
| 2026-04-29 | Search bar: client-side filter on title + author + category (current language); new i18n keys above. |

## Related

- Platform intent: `../../PROJECT-EXPLAINER/project-explainer.md` (Library section).
- Process: `../../PROJECT-EXPLAINER/HOW_DOES_A_PRO_AI_WEB_DEVELOPER_DO_THAT.md`.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

```sql
CREATE TABLE library_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_key VARCHAR(64) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE library_books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  book_type ENUM('ebook','physical') NOT NULL,
  pages INT NULL,
  image_url VARCHAR(512) NULL,
  file_path VARCHAR(512) NULL,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (category_id) REFERENCES library_categories(id),
  KEY idx_cat (category_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE library_book_i18n (
  book_id BIGINT NOT NULL,
  lang CHAR(2) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  PRIMARY KEY (book_id, lang),
  FOREIGN KEY (book_id) REFERENCES library_books(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/public/library/books` | **`api/public/library-books.php`** | List + filters `?lang=&q=&category=&type=&limit=&cursor=` |
| GET | `/api/public/library/books/:id` | **`api/public/library-book.php`** | Single row + i18n |
| GET | `/api/public/library/categories` | **`api/public/library-categories.php`** | Optional if categories are DB-driven |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/POST/PUT/DELETE | `/api/admin/library/books` | **`api/admin/library-books.php`** |
| GET/POST/PUT/DELETE | `/api/admin/library/categories` | **`api/admin/library-categories.php`** |

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

# About + Contact (`/about`) — press desk + routing

## Purpose

Single page answering:

- **Who we are**: institutional story in **press-release tone** (Machafi mission + editorial standards + partner framing).
- **Contact**: same URL with **`#contact`** for the utility-bar shortcut; shows phone/email/address from existing i18n footer strings plus a **UI-first enquiry form** (wire to mail/API later).

## Legacy / product references

- Utility bar previously used `href="#"` for “Who we are” and “Contact” in `frontend/src/components/layout/Header.jsx` — now **`/about#about`** and **`/about#contact`**.
- Partner logos already present in header (`KGC`, `Komas Group`); copy aligns with that **published relationship**, informed by public listings that reference **Komas Group** as an Algerian business entity active in **business services / distribution-oriented commerce** (web sources vary; editorial disclaimer included on-page).

## Routes

- **`/about`** — full scroll page.
- Deep links: **`/about#about`**, **`/about#contact`** (hash scroll handled in `AboutContactPage.jsx`).

## i18n (Rule #1)

All prose under `about.press.*` and `about.contact.*` in **EN / FR / AR**.  
Document title uses `header.whoWeAre` for `/about` (`DocumentTitle.jsx`).

## Files

- `frontend/src/pages/AboutContactPage.jsx`
- `frontend/src/components/layout/Header.jsx` (utility links)
- `frontend/src/App.tsx` (route)
- `frontend/src/components/DocumentTitle.jsx`

## Follow-ups (optional)

- Connect enquiry form to `POST /api/public/contact` + admin inbox.
- Add `/about` to footer “read more” column if desired.
- Replace `#` social URLs in header/footer with real profiles.

## Changelog

- **2026-04-29**: Initial combined About + Contact page + header wiring + i18n.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**Hosting:** GoDaddy Linux + Apache + PHP + **MySQL**. See **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**.

### MySQL

```sql
CREATE TABLE contact_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at DATETIME NOT NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  lang CHAR(2) NOT NULL DEFAULT 'ar',
  ip_hash CHAR(64) NULL,
  spam_score TINYINT NULL,
  status ENUM('new','reviewed','archived') NOT NULL DEFAULT 'new',
  KEY idx_created (created_at),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### HTTP — public

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| POST | `/api/public/contact` | **`api/public/contact.php`** (new) | `INSERT INTO contact_messages (...)` |

**Request JSON:** `{ "name","email","phone?","subject","body","lang" }` — validate length server-side; **rate limit** by IP on GoDaddy (file-based or DB counter).

### HTTP — admin

| Method | Path | PHP | SQL |
|--------|------|-----|-----|
| GET | `/api/admin/contact-messages` | **`api/admin/contact-messages.php`** (new) | `SELECT ... WHERE status=? ORDER BY id DESC LIMIT ?` |
| PATCH | `/api/admin/contact-messages/:id` | same | `UPDATE contact_messages SET status=?` |

**Auth:** reuse **`api/admin/auth/session.php`** pattern — never expose list publicly.

---

## Documentation sync (2026-04-30)

- Cross-route **dataset handoff**: see `../../PROJECT-EXPLAINER/PAGE_DATASET_REFERENCE.md` (purpose + suggested columns per route).
- **Site chrome** (header, desktop nav gradient `.kgc-main-nav-gradient`, partner logo rules) is global; details in `../../PROJECT-EXPLAINER/PROMPT_LOG.md` under **2026-04-30**.
- Endpoint contracts in this tracker stay aligned with **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`** unless product scope changes.


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

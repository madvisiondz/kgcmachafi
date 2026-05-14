# Hosting & database — project constraint (memorized)

This document records the **authoritative deployment assumption** for Machafi backend work: **GoDaddy** hosting and a **SQL** database (**MySQL** or **MariaDB** on typical shared/cPanel plans).

## 1) GoDaddy — what we assume

| Topic | Assumption for API + SPA design |
|--------|-----------------------------------|
| **Stack** | **Linux** hosting, **Apache** (`.htaccess` supported), **PHP** (8.x target where available), **MySQL/MariaDB** |
| **Web root** | `public_html/` — SPA build (`index.html`, `assets/`) co-resident with **`api/`** PHP tree (same pattern as `ready-to-deploy/public_html/`) |
| **TLS** | Managed certificate (GoDaddy / AutoSSL); all public JSON **HTTPS only** |
| **Process model** | **Short-lived PHP requests only** — no long workers, no WebSockets on basic shared hosting unless explicitly upgraded |
| **Cron** | Use cPanel **Cron Jobs** for nightly tasks (feed aggregation, archive jobs, cache warm) — keep jobs **idempotent** and **< 5 min** |
| **Limits** | Respect connection and CPU limits: **paginate every list**, **cap `limit`**, avoid `SELECT *` without `LIMIT`, use **indexes** on filter columns |
| **SPA routing** | Apache must rewrite unknown paths to `index.html` except real files and `/api/*` |

## 2) SQL database — role

- **Single primary OLTP database** (MySQL/MariaDB) backing **`api/public/*`** and **`api/admin/*`**.
- **UTF8MB4** charset for Arabic and emoji in user content.
- Prefer **explicit tables** per domain (news, pharmacies, tv_*, …) over one giant JSON blob — aligns with **`project-explainer.md`** (6–8 essential columns per public “card” where possible).

## 3) PHP ↔ MySQL access pattern

- **PDO** with prepared statements, **one connection per request**, closed at end of script.
- **No** DB credentials in Git — use `api/admin/bootstrap.php` / env outside web root pattern already common on GoDaddy.

## 4) Frontend alignment

- **`frontend/src/config.ts`** — `VITE_API_BASE_URL` defaults to **`/api`** (same origin on GoDaddy).
- Future **`frontend/src/services/*`** — all JSON calls go through this base.

## 5) Related docs

- **`API_STANDARD_GODADDY_MYSQL.md`** — JSON envelope, errors, pagination, auth notes.
- **`WEBAPP_PAGES_OVERVIEW.md`** — route → endpoint summary table.
- **`TRACKERS/**/*.md`** — per-page **Full endpoint design (GoDaddy + MySQL)** sections.

---

*Update this file if you move off GoDaddy or add a separate DB host (still SQL).*


---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

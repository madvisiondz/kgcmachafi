# Machafi TV — newsroom desk (`/tv/:edition/desk`)

Single source of truth for **`TvDeskPage`**: production/journalism “services” cards and cross-links (wire, search, Services news, TV admin).

## 1) Purpose

- **Transparency**: explain how Machafi TV intends to run wire intake, tips, rundowns, rights, and style playbooks.
- **Handoff hub**: links to **Activity** (wire feed), **Search**, **Machafi Services** `/healthservices/news`, **`/machafitv/admin`**.

## 2) Route

- **`/tv/:edition/desk`**

## 3) UX flow

1. Title + subtitle from **`tvApp.deskTitle`**, **`tvApp.deskSub`**.
2. **Five cards**: wire intake, submit tip, rundown & cues, rights & compliance, style & language — each title/body from **`tvApp.desk*`** keys.
3. Footer row of text links to Activity, Search, Services news, TV admin placeholder.

## 4) Data contracts

### UI-first

- Static copy via i18n only (no mock dataset file).

### Target production

- Optional: embed real queue counts, SLA status, or links to authenticated CMS (not public).

## 5) Endpoint proposals

### Public (optional)

- `GET /api/public/tv/desk-summary` — non-sensitive counters (“last updated”, public-facing standards PDF URL).

### Admin (primary for desk semantics)

- Wire lanes, tip inbox, rundown builder, rights checklist, playbook versioning — see **`/machafitv/admin`** product scope.
- Suggested namespaces: `tv_wire_items`, `tv_rundowns`, `tv_rights_cases`, `tv_style_guides` (design with engineering).

## 6) i18n

- **`tvApp.deskTitle`**, **`tvApp.deskSub`**, **`tvApp.deskWireTitle`**, … **`tvApp.deskPlaybookBody`**
- **`nav.news`** for Services news link label.

## 7) File map

- `frontend/src/pages/tv/TvDeskPage.jsx`
- `frontend/src/routes/paths.ts` — `tvEditionPath`, `SERVICES_BASE`
- `frontend/src/components/DocumentTitle.jsx` — `tvApp.deskTitle`

## 8) Safeguards

- **Tips**: never claim “secure” until real encrypted channel + policy exist.
- **Legal**: rights/compliance card must stay aligned with actual counsel workflow.

## 9) Changelog

- **2026-05-12**: Tracker added for desk page + card model.

---

## Full endpoint design — GoDaddy + MySQL (SQL)

**References:** **`../../PROJECT-EXPLAINER/HOSTING_AND_DATABASE.md`**, **`../../PROJECT-EXPLAINER/API_STANDARD_GODADDY_MYSQL.md`**. The public **`/tv/:edition/desk`** page is mostly **static UX + links**; operational data lives under **Machafi TV admin** (wire, rights, playbook).

### MySQL (admin-heavy; optional public read)

```sql
CREATE TABLE tv_style_guides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  edition CHAR(2) NOT NULL,
  body_md MEDIUMTEXT NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uq_ed (edition)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Wire + rights tables: align with **`TV_ACTIVITY_PAGE_MAP.md`** and **`../machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`**.

### HTTP — public (optional)

| Method | Path | PHP |
|--------|------|-----|
| GET | `/api/public/tv/editions/{edition}/desk/playbook` | **`api/public/tv-desk-playbook.php`** — public-safe excerpt only |

### HTTP — admin

| Method | Path | PHP |
|--------|------|-----|
| GET/PUT | `/api/admin/machafitv/editions/{edition}/style-guide` | **`api/admin/tv-style-guide.php`** |

---

## Documentation sync (2026-05-12)

- **`TV_ACTIVITY_PAGE_MAP.md`**, **`../machafi-services/NEWS_PAGE_MAP.md`**, **`../../PROJECT-EXPLAINER/PROMPT_LOG.md`**.


---

## 12) Implemented HTTP map (Machafi TV — 2026-05-14)

**Machafi TV** JSON under `/api/public/tv/...` is **not implemented** in this repository; the SPA still uses **`frontend/src/data/tvMock.ts`**. Target HTTP shapes remain in **§6 Endpoint proposals** above and in **`TV_SHELL_PAGE_MAP.md`**.

**Machafi Services** (directory app) public JSON that **is** implemented: **`PROJECT-EXPLAINER/API_ENDPOINT_REGISTRY.md`**.

**TV admin** (`/machafitv/admin/*`): no `api/admin/tv-*.php` modules yet — see **`../machafi-tv-admin/MACHAFITV_ADMIN_PANEL_MAP.md`**.

---

*Last updated: **2026-05-14** — Gateway + TV branding (Machafi TV logo in shell and gateway strip), Services masthead mint/grid, `frontend/public/branding/`, Vercel https://kgcmachafi.vercel.app ; doc sync.*

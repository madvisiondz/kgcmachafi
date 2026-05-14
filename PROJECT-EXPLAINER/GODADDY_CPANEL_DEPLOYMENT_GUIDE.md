# GoDaddy cPanel — beginner deployment guide (MACHAFI Health Services)

This guide is written for **non-developers** who use **GoDaddy shared hosting** with **cPanel**, **Apache**, **PHP**, and **MySQL**. Follow the steps in order. If something fails, jump to **Section E — Common mistakes**.

---

## What you are deploying (three parts)

1. **Database** — MySQL tables and the default admin user.
2. **PHP API** — the `api/` folder (JSON endpoints under `/api/...`).
3. **React website** — the built files from `frontend/dist/` (HTML, JS, CSS).

These three parts work together: the website in the browser talks to the PHP API, and the API reads/writes the database.

---

## A. Database deployment

### A1. Open cPanel

1. Sign in to your GoDaddy account.
2. Open your hosting product and click **Manage** (or open cPanel directly if you have the URL).
3. Find and open **cPanel**.

### A2. Create a MySQL database

1. In cPanel, open **MySQL® Databases** (name may vary slightly).
2. Under **Create New Database**, type a short database name (for example `machafi_hs`).
3. Click **Create Database**.
4. **Write down the full database name** — on many hosts it looks like `youruser_machafi_hs` (a prefix is added automatically).

### A3. Create a MySQL user

1. On the same page, find **MySQL Users** → **Add New User**.
2. Choose a **username** and a **strong password** (use a password manager).
3. Click **Create User**.
4. **Write down the full username** (often `youruser_dbuser`).

### A4. Add the user to the database (privileges)

1. Find **Add User To Database**.
2. Select the **user** and the **database** you just created.
3. Click **Add**.
4. On the **Manage User Privileges** screen, choose **ALL PRIVILEGES** (for this project, the app needs to create/read/update tables).
5. Click **Make Changes**.

### A5. Open phpMyAdmin

1. In cPanel, open **phpMyAdmin**.
2. In the left sidebar, click your **database name** so it is selected.

### A6. Import the main SQL file

1. Click the **Import** tab.
2. Click **Choose File** and select:

   `database/health_services_schema.sql`

3. Click **Go** at the bottom.
4. Wait until you see a **success** message.

### A7. (Recommended) Import optional admin patches

After the main import, you can run (same Import flow, or paste in **SQL** tab):

`database/health_services_admin_optional.sql`

If a column already exists, MySQL may show an error for that line — you can ignore it or run statements one by one. This file adds small columns used by the admin panel (for example contact “read” status, donation notes/status, and optional `services` columns).

### A8. Check that tables exist

In phpMyAdmin, click your database. You should see many tables, including:

- `admin_users`
- `news_articles`
- `pharmacies`
- `contact_messages`
- … and others from the schema file.

### A9. Change the default admin password (very important)

The schema creates a default admin:

- **Username:** `admin`
- **Password:** `changeme`

**You must change this immediately after first login** (Health Services admin → **Settings** → change password), or use phpMyAdmin / SQL if you prefer (advanced).

### A10. Store database credentials safely

Keep a private note (password manager) of:

- Database **host** (often `localhost` on shared hosting)
- **Database name** (full prefixed name)
- **Database username** (full prefixed name)
- **Database password**

You will paste these into `admin-config.php` on the server (see section B).

---

## B. API (`api/`) deployment

### B1. Where to upload

On cPanel **File Manager**:

1. Open `public_html` (this is your website root).
2. Upload the project’s **`api`** folder so the result is:

   `public_html/api/`

   Example: `public_html/api/admin/news.php` must exist.

### B2. Configure `admin-config.php`

The PHP bootstrap (`api/admin/bootstrap.php`) loads:

`admin-config.php` from **three levels above** the `api/admin` folder.

Example: if on the server your API file is:

`/home/user/public_html/api/admin/bootstrap.php`

then `dirname(__DIR__, 3)` points to `/home/user/` and PHP will load:

`/home/user/admin-config.php`

**Practical options:**

1. **Recommended:** copy `deploy/admin-config.php` from this project to that **expected** location on the server, then edit DB credentials.
2. **Alternative:** if your host only allows files inside `public_html`, ask your host or adjust the `require` path in `bootstrap.php` once so it points to a path you control (advanced).

Fill in the **database** section with the values from step A10.

### B3. Test an API endpoint in the browser

Try opening (replace `yourdomain.com`):

`https://yourdomain.com/api/admin/auth/session.php`

- You should see **JSON** (not a blank white page).
- Before login, it should say you are not authenticated (exact text depends on version).

### B4. If you see error 500

1. In cPanel open **Errors** / **Metrics** if available, or enable logging (hosting dependent).
2. In cPanel open **Select PHP Version** (or **MultiPHP INI Editor**).
3. Confirm PHP is **8.1+** (recommended for this codebase).
4. Confirm extensions include **pdo_mysql** (PDO MySQL).

### B5. PHP version and extensions (short checklist)

In **Select PHP Version**:

- PHP **8.1 or newer**
- Extensions: **pdo_mysql**, **json**, **mbstring** (common defaults on GoDaddy)

---

## C. React web app (`frontend/dist/`) deployment

### C1. Production environment file

On your computer, in the `frontend` folder, create `.env.production` (or edit it) with at least:

```env
VITE_API_BASE_URL=/api
VITE_PUBLIC_SITE_URL=https://yourdomain.com
```

Use your real domain in `VITE_PUBLIC_SITE_URL`.

### C2. Install and build (on your computer)

Open a terminal in the `frontend` folder:

```bash
npm install
npm run build
```

This creates a **`dist`** folder. **`dist` is the compiled website** (static files only).

### C3. Upload the **contents** of `dist/`

**Important:** upload **the files inside** `dist`, not the `dist` folder itself as the only item.

In `public_html` you should end up with:

- `public_html/index.html`
- `public_html/assets/...` (JS/CSS bundles)

### C4. Do not delete `/api`

After upload, confirm `public_html/api/` still exists alongside `index.html`.

### C5. Add `.htaccess` for React Router (Apache)

In `public_html`, create or edit `.htaccess` with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This fixes “404 when I refresh the page” on routes like `/healthservices/admin/news`.

### C6. Test URLs

In your browser:

- `https://yourdomain.com/` — gateway / home
- `https://yourdomain.com/healthservices` — public Health Services site
- `https://yourdomain.com/healthservices/admin` — admin panel (login)
- `https://yourdomain.com/tv/ar` — Machafi TV (should still work; we did not change TV)

---

## D. Admin panel — first login

1. Open: `https://yourdomain.com/healthservices/admin/login`
2. Sign in with the default account from the database import:
   - **Username:** `admin`
   - **Password:** `changeme`
3. Immediately go to **Settings** and **change the password**.

### Simple explanation of session + CSRF (for beginners)

- **Session:** after login, the server remembers you in a small browser cookie. That is why you stay logged in while you work.
- **CSRF token:** a hidden “security stamp” for **save / delete / logout** actions so random websites cannot trick your browser into changing your site.

If your session expires, the admin panel will ask you to sign in again.

---

## E. Common beginner mistakes

1. **Uploaded the `dist` folder** instead of its **contents** → homepage looks empty or wrong.
2. **Deleted `public_html/api`** while uploading the frontend → API calls fail.
3. **Wrong database username/password** in `admin-config.php` → API error 500.
4. **Forgot to import SQL** → API errors about missing tables.
5. **Forgot `.htaccess`** → refresh on `/healthservices/...` shows 404.
6. **Wrong API base URL** in `.env.production` → browser cannot reach `/api`.
7. **White page after deploy** → open browser **Developer Tools → Console**; usually a missing file path or JS error.
8. **Admin login works locally but not on production** → check HTTPS, cookie path, and that frontend and API are on the **same site** (simplest setup).
9. **Optional SQL not applied** → some admin features (contact read flag, donation status column) show errors until optional SQL is applied.

---

## F. Deployment checklist

- [ ] MySQL database created  
- [ ] MySQL user created and added with **ALL PRIVILEGES**  
- [ ] `health_services_schema.sql` imported in phpMyAdmin  
- [ ] (Recommended) `health_services_admin_optional.sql` applied  
- [ ] `public_html/api/` uploaded  
- [ ] `admin-config.php` updated with real DB credentials  
- [ ] `npm run build` completed  
- [ ] `public_html` contains `index.html` + `assets/` from `dist/` contents  
- [ ] `.htaccess` rewrite present for SPA  
- [ ] `.env.production` values correct before build  
- [ ] Default admin password changed  
- [ ] Tested `/healthservices` and `/healthservices/admin`  
- [ ] **Backup:** export database + download `public_html` copy  

---

## Screenshots

You can add screenshots here later (cPanel MySQL page, phpMyAdmin Import, File Manager showing `public_html/api` + `index.html`).

---

## Support note

If your host blocks outbound features or has strict mod_security rules, some API paths may need allowlisting. That is rare on standard GoDaddy shared hosting for simple JSON endpoints.

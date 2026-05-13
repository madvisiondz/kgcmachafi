> **Archive (2026-05-13):** Copied from the removed `legacy/DEPLOYMENT.md`. Treat **`frontend/`** + **`ready-to-deploy/`** / **`deploy/`** as the current deploy story unless superseded by other explainer docs.

---

## Server-ready deployment (Vite + PHP API)

This project is:
- **Frontend**: Vite build output in `dist/`
- **Backend API**: PHP endpoints under `api/` (expects MySQL from `admin-config.php`)
- **Translation plugin**: browser calls same-origin `api/public/translate.php` which proxies to LibreTranslate (avoids CORS issues)

### 1) Build frontend

```bash
npm install
npm run build
```

Deploy the **generated** `dist/` folder as your site root.

> `public/.htaccess` is copied to `dist/.htaccess` automatically on build (Apache SPA routing + caching).

### 2) Deploy PHP API

Your server must serve the `api/` folder at:

- `https://your-domain.com/api/...`

For Apache: place the `api/` folder next to `dist/` in the web root.

Example (shared hosting):

```
public_html/
  index.html  (from dist)
  assets/     (from dist)
  .htaccess   (from dist)
  api/
    admin/
    public/
    .htaccess
  admin-config.php
```

### 3) Configure DB

Update `admin-config.php` with production DB credentials.

### 4) Configure translation upstream (recommended)

`api/public/translate.php` proxies to LibreTranslate.

Set environment variables on the server:

- `LIBRETRANSLATE_URL` (example: `https://translate.your-domain.com`)
- `LIBRETRANSLATE_API_KEY` (optional)

If you don’t set `LIBRETRANSLATE_URL`, it defaults to `https://libretranslate.com`.

### 5) Nginx (optional snippet)

If you’re using Nginx, you need:
- SPA fallback to `index.html`
- PHP handling for `/api`

Pseudo-config (adjust paths):

```
location / {
  try_files $uri $uri/ /index.html;
}

location ~ \.php$ {
  include fastcgi_params;
  fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
  fastcgi_pass unix:/run/php/php8.2-fpm.sock;
}
```



---

*Last updated: **2026-05-11** — full repo doc sync (emerald Services UI, gateway art + tracker, Vite 5173 strictPort, Header TV/portal, visual eval logs) + GitHub push.*

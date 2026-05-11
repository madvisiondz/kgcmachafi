Upload this folder contents to your hosting.

From the repo root:
- Build the new frontend: run `npm run build` inside `frontend/` to refresh `frontend/dist/`.
- Then copy `frontend/dist/*` into this folder’s `public_html/` (overwriting `index.html`, `assets/`, and static folders like `nav-icons/`).

1) Upload everything inside `public_html/` to your hosting web root (often `public_html/`).
2) Copy `admin-config.php.example` to `admin-config.php` and set production DB credentials.
3) Ensure PHP is enabled and `/api/*` routes to the `api/` folder.

Sanity checks after upload:
- / loads the app (no /src/main.jsx in page source)
- /assets/*.js returns JavaScript (not HTML)
- /api/public/translate.php returns JSON (POST)


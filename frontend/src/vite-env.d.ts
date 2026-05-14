/// <reference types="vite/client" />

/** Extend here when adding new `VITE_*` variables (keep in sync with `.env.example`). */
interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string
  readonly VITE_PUBLIC_SITE_URL?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_TV_STREAM_URL?: string
  readonly VITE_FEATURE_TV_HLS?: string
  /** When `true`, newsroom list calls `GET {VITE_API_BASE_URL}/public/news.php` (GoDaddy PHP + MySQL). */
  readonly VITE_NEWS_API?: string
  /** When `true`, pharmacies directory calls `GET {VITE_API_BASE_URL}/public/pharmacies.php`. */
  readonly VITE_PHARMACIES_API?: string
  /** When `true`, hospitals directory loads `hospitals.php` + `international-hospitals.php` under public API. */
  readonly VITE_HOSPITALS_API?: string
  readonly VITE_AMBULANCES_API?: string
  readonly VITE_ACCOMMODATIONS_API?: string
  readonly VITE_PROGRAMS_API?: string
  readonly VITE_LIBRARY_API?: string
  readonly VITE_CONSULTATIONS_API?: string
  readonly VITE_LIVE_API?: string
  readonly VITE_DONATIONS_API?: string
  readonly VITE_HOME_API?: string
  readonly VITE_SETTINGS_API?: string
  readonly VITE_SERVICES_CATALOG_API?: string
  /** Optional delay in ms before list loaders resolve (dev-only UI review of skeletons). */
  readonly VITE_LIST_BOOTSTRAP_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

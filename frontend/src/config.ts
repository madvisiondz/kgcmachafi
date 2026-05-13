/**
 * Single import for deployment-facing settings (NEXT_STEPS A2).
 * Values come from `.env` / `.env.production` — see `frontend/.env.example`.
 */
function readEnvString(key: string, fallback: string): string {
  const env = import.meta.env as unknown as Record<string, string | boolean | undefined>
  const raw = env[key]
  if (typeof raw !== 'string') return fallback
  const t = raw.trim()
  return t.length > 0 ? t : fallback
}

export const appConfig = {
  /** Vite mode: `development` | `production` */
  mode: import.meta.env.MODE,
  /** Logical deploy lane: defaults to Vite `MODE`; override with `VITE_APP_ENV`. */
  appEnv: readEnvString('VITE_APP_ENV', import.meta.env.MODE),
  /** Canonical public site (links, OG later, absolute URLs if needed). */
  publicSiteUrl: readEnvString('VITE_PUBLIC_SITE_URL', 'https://kgc-machafi.net'),
  /**
   * Base URL for JSON APIs consumed by the future `services/` client.
   * Default `/api` = same-origin (typical when SPA and PHP share the host).
   */
  apiBaseUrl: readEnvString('VITE_API_BASE_URL', '/api'),
  /** Optional HLS / stream URL for Machafi TV player (empty until admin wires it). */
  tvStreamUrl: readEnvString('VITE_TV_STREAM_URL', ''),
  /** Gate HLS player integration (Phase E) without removing placeholder UI. */
  featureTvHls: import.meta.env.VITE_FEATURE_TV_HLS === 'true',
} as const

export type AppConfig = typeof appConfig

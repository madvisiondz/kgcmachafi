/** Base path for Machafi Services (directory platform SPA). */
export const SERVICES_BASE = '/healthservices';

/** Machafi TV public shell (edition-prefixed segments follow). */
export const TV_BASE = '/tv';

export type TvEdition = 'ar' | 'fr' | 'en';

export const TV_EDITIONS: TvEdition[] = ['ar', 'fr', 'en'];

export function isTvEdition(s: string | undefined): s is TvEdition {
  return s === 'ar' || s === 'fr' || s === 'en';
}

/**
 * Build a path under Machafi Services.
 * @example servicesPath('/') → '/healthservices'
 * @example servicesPath('/live') → '/healthservices/live'
 */
export function servicesPath(path: string): string {
  if (!path || path === '/') return SERVICES_BASE;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SERVICES_BASE}${normalized}`;
}

/**
 * Build a path under a Machafi TV edition.
 * @example tvEditionPath('ar', '/') → '/tv/ar'
 * @example tvEditionPath('fr', '/live') → '/tv/fr/live'
 */
export function tvEditionPath(edition: TvEdition, path: string = '/'): string {
  if (!path || path === '/') return `${TV_BASE}/${edition}`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${TV_BASE}/${edition}${normalized}`;
}

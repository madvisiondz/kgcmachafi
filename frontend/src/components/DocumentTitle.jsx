import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

const BRAND = 'MACHAFI';

function titleKeyForPath(pathname) {
  if (pathname === '/') return 'nav.home';
  if (pathname.startsWith('/news/')) return 'meta.pageTitle.newsArticle';
  const exact = {
    '/about': 'header.whoWeAre',
    '/live': 'common.watchLive',
    '/library': 'nav.library',
    '/service': 'nav.services',
    '/donations': 'nav.donations',
    '/news': 'nav.news',
    '/pharmacies': 'nav.pharmacies',
    '/ambulances': 'nav.ambulances',
    '/accommodations': 'nav.accommodation',
    '/programs': 'nav.programs',
    '/hospitals': 'nav.hospitals',
    '/consultations': 'nav.consultations',
  };
  return exact[pathname] ?? null;
}

/**
 * Sets `document.title` to `MACHAFI - <page name>` using i18n for the page segment.
 */
export default function DocumentTitle() {
  const { pathname } = useLocation();
  const { t, language } = useI18n();

  useEffect(() => {
    const key = titleKeyForPath(pathname);
    const pageName = key ? t(key) : pathname.replace(/^\//, '') || t('nav.home');
    document.title = `${BRAND} - ${pageName}`;
  }, [pathname, language, t]);

  return null;
}

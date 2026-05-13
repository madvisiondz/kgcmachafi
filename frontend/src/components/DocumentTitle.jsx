import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { SERVICES_BASE } from '../routes/paths';

const BRAND = 'MACHAFI';

function stripServicesBase(pathname) {
  if (pathname === SERVICES_BASE || pathname === `${SERVICES_BASE}/`) return '/';
  if (pathname.startsWith(`${SERVICES_BASE}/`)) return pathname.slice(SERVICES_BASE.length);
  return pathname;
}

function titleKeyForPath(pathname) {
  if (pathname === '/') return 'gateway.pageTitle';
  if (pathname.startsWith('/tv/')) {
    if (pathname.includes('/desk')) return 'tvApp.deskTitle';
    if (pathname.includes('/activity')) return 'tvApp.activityTitle';
    if (pathname.includes('/search')) return 'tvApp.searchTitle';
    const topicMatch = pathname.match(/\/topics\/(health|policy|research|community)(?:\/|$)/);
    if (topicMatch) {
      const map = {
        health: 'tvApp.topicHealth',
        policy: 'tvApp.topicPolicy',
        research: 'tvApp.topicResearch',
        community: 'tvApp.topicCommunity',
      };
      return map[topicMatch[1]] ?? 'tvApp.topicPageTitle';
    }
    if (pathname.includes('/live')) return 'tvApp.navLive';
    if (pathname.includes('/schedule')) return 'tvApp.navSchedule';
    if (pathname.includes('/article')) return 'tvApp.articlePlaceholder';
    return 'tvApp.homeHeadline';
  }
  if (pathname.startsWith('/healthservices/admin')) return 'admin.healthTitle';
  if (pathname.startsWith('/machafitv/admin')) return 'admin.tvTitle';

  const p = stripServicesBase(pathname);
  if (p === '/') return 'nav.home';
  if (p.startsWith('/news/')) return 'meta.pageTitle.newsArticle';
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
  return exact[p] ?? null;
}

/**
 * Sets document.title for gateway, Machafi Services (/healthservices/*), Machafi TV (/tv/...), and admin placeholders.
 */
export default function DocumentTitle() {
  const { pathname } = useLocation();
  const { t, language } = useI18n();

  useEffect(() => {
    const key = titleKeyForPath(pathname);
    let pageName;
    if (pathname === '/') {
      pageName = t('gateway.pageTitle');
    } else {
      pageName = key ? t(key) : pathname.replace(/^\//, '') || t('nav.home');
    }
    document.title = `${BRAND} - ${pageName}`;
  }, [pathname, language, t]);

  return null;
}

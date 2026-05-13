import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { useBootstrapList } from '../hooks/useBootstrapList';
import ListGridSkeleton from '../components/ListGridSkeleton';
import ListFetchErrorBanner from '../components/ListFetchErrorBanner';
import { servicesPath } from '../routes/paths';
import { newsArticlesMock, newsDeskPrinciplesMock } from '../data/news';
import { loadNewsArticlesForList } from '../services/news';

function pickText(text, language) {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[language] ?? text.en ?? text.ar ?? text.fr ?? '';
}

function formatTpl(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? String(vars[key]) : `{${key}}`));
}

function Icon({ children, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const Icons = {
  search: (props) => (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  ),
  spark: (props) => (
    <Icon {...props}>
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="m4.93 4.93 2.83 2.83" />
      <path d="m16.24 16.24 2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="m16.24 7.76 2.83-2.83" />
    </Icon>
  ),
  radio: (props) => (
    <Icon {...props}>
      <path d="M4.9 19.1A1 1 0 0 1 3.5 18" />
      <path d="M7.9 16.1a1 1 0 0 1-.6-1.8" />
      <path d="M11.6 13.6a1 1 0 0 1-.7-1.7" />
      <path d="M15.7 11.7a1 1 0 0 1-.9-1.9" />
      <path d="M19.6 9.6a1 1 0 0 1-.8-1.8" />
      <path d="M4.9 4.9A1 1 0 0 1 6.3 6.3" />
    </Icon>
  ),
  clock: (props) => (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icon>
  ),
  shield: (props) => (
    <Icon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </Icon>
  ),
};

const SOURCE_ORDER = ['local', 'aps', 'spa', 'afp', 'reuters', 'aljazeera', 'bbc'];

const TAG_ORDER = ['national', 'public_health', 'hospitals', 'awareness', 'emergency', 'research'];

function formatDate(iso, language) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-GB';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
}

function articleMatchesQuery(a, q, language) {
  const qq = q.trim().toLowerCase();
  if (!qq) return true;
  const hay = [
    pickText(a.title, language),
    pickText(a.lead, language),
    ...a.body[language],
    ...a.body.en,
  ]
    .join('\n')
    .toLowerCase();
  return hay.includes(qq);
}

export default function NewsPage() {
  const { t, language, dir } = useI18n();
  const { status, data, error, reload } = useBootstrapList(loadNewsArticlesForList);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [tag, setTag] = useState('all');

  const displayArticles = useMemo(() => {
    if (status === 'ready') return data ?? [];
    if (status === 'error') return newsArticlesMock;
    return newsArticlesMock;
  }, [data, status]);

  const showSkeleton = status === 'loading';

  const active = useMemo(() => {
    return displayArticles
      .filter((a) => !a.isArchived)
      .filter((a) => (source === 'all' ? true : a.sourceKey === source))
      .filter((a) => (tag === 'all' ? true : a.tagKey === tag))
      .filter((a) => articleMatchesQuery(a, query, language))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id));
  }, [displayArticles, language, query, source, tag]);

  const featured = useMemo(() => active.find((a) => a.featured) ?? active[0], [active]);
  const wire = useMemo(() => active.filter((a) => a.breaking || a.featured).slice(0, 3), [active]);

  const stats = useMemo(() => {
    const pool = displayArticles.filter((a) => !a.isArchived);
    return {
      stories: pool.length,
      breaking: pool.filter((a) => a.breaking).length,
      wires: new Set(pool.map((a) => a.sourceKey)).size,
    };
  }, [displayArticles]);

  return (
    <div className="container mx-auto px-4 py-10" dir={dir}>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 shadow-sm">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
        </div>

        <div className="relative p-6 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
                <Icons.radio className="w-4 h-4 text-emerald-700" />
                <span>{t('newsroom.hero.kicker')}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700">{t('newsroom.hero.kickerSub')}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                {t('newsroom.hero.title')}
              </h1>
              <p className="text-slate-700 text-base md:text-lg leading-relaxed">{t('newsroom.hero.subtitle')}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  to={servicesPath('/programs')}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-4 py-2 text-sm font-bold shadow hover:bg-emerald-800 transition-colors"
                >
                  {t('newsroom.hero.ctaPrograms')}
                </Link>
                <Link
                  to={servicesPath('/library')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  {t('newsroom.hero.ctaLibrary')}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full lg:w-[420px]">
              <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur px-3 py-3 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">{t('newsroom.stats.stories')}</div>
                <div className="text-2xl font-extrabold text-slate-900">{stats.stories}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur px-3 py-3 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">{t('newsroom.stats.breaking')}</div>
                <div className="text-2xl font-extrabold text-rose-700">{stats.breaking}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 backdrop-blur px-3 py-3 shadow-sm">
                <div className="text-xs font-semibold text-slate-500">{t('newsroom.stats.wires')}</div>
                <div className="text-2xl font-extrabold text-emerald-800">{stats.wires}</div>
              </div>
            </div>
          </div>

          {wire.length > 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur px-4 py-3 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <span className="inline-flex items-center rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-black text-white">
                    {t('newsroom.wire.badge')}
                  </span>
                  <span className="text-slate-600 font-semibold">{t('newsroom.wire.title')}</span>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed">
                  {wire
                    .map((a) => pickText(a.title, language))
                    .filter(Boolean)
                    .join(' — ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {status === 'error' ? (
        <div className="mt-4">
          <ListFetchErrorBanner message={error?.message} onRetry={reload} />
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {showSkeleton ? (
            <>
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
                <p className="text-sm font-extrabold text-slate-700">{t('common.listLoadingTitle')}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t('common.listLoadingHint')}</p>
                <div className="mt-6 h-24 rounded-2xl bg-slate-100 animate-pulse" />
              </div>
              <ListGridSkeleton columnsClass="md:grid-cols-2" count={4} />
            </>
          ) : (
            <>
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">{t('newsroom.filters.title')}</h2>
                <p className="text-sm text-slate-600 mt-1">{t('newsroom.filters.subtitle')}</p>
              </div>
              <div className="relative w-full md:max-w-md">
                <Icons.search
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${
                    dir === 'rtl' ? 'right-3' : 'left-3'
                  }`}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 ${
                    dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'
                  }`}
                  placeholder={t('newsroom.filters.searchPlaceholder')}
                  aria-label={t('newsroom.filters.searchAria')}
                />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="text-xs font-bold text-slate-500">{t('newsroom.filters.sourceLabel')}</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSource('all')}
                  className={`rounded-full px-3 py-1.5 text-xs font-extrabold border transition-colors ${
                    source === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t('newsroom.filters.all')}
                </button>
                {SOURCE_ORDER.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSource(k)}
                    className={`rounded-full px-3 py-1.5 text-xs font-extrabold border transition-colors ${
                      source === k
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t(`newsroom.sources.${k}`)}
                  </button>
                ))}
              </div>

              <div className="pt-2 text-xs font-bold text-slate-500">{t('newsroom.filters.tagLabel')}</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTag('all')}
                  className={`rounded-full px-3 py-1.5 text-xs font-extrabold border transition-colors ${
                    tag === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t('newsroom.filters.all')}
                </button>
                {TAG_ORDER.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTag(k)}
                    className={`rounded-full px-3 py-1.5 text-xs font-extrabold border transition-colors ${
                      tag === k
                        ? 'bg-cyan-700 text-white border-cyan-700'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t(`newsroom.tags.${k}`)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {featured && (
            <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  {featured.breaking && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-black">
                      <Icons.spark className="w-3.5 h-3.5" />
                      {t('newsroom.card.breaking')}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-black border border-white/15">
                    {t('newsroom.card.featured')}
                  </span>
                  <span className="text-xs font-bold text-emerald-100/90">
                    {t(`newsroom.sources.${featured.sourceKey}`)} • {formatDate(featured.date, language)}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  {pickText(featured.title, language)}
                </h2>
                <p className="mt-3 text-emerald-50/95 leading-relaxed">{pickText(featured.lead, language)}</p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to={`${servicesPath('/news')}/${featured.id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-white text-emerald-900 px-5 py-3 text-sm font-black hover:bg-emerald-50 transition-colors"
                  >
                    {t('newsroom.card.open')}
                  </Link>
                  <div className="text-xs font-bold text-emerald-100/90 inline-flex items-center gap-2">
                    <Icons.clock className="w-4 h-4" />
                    {formatTpl(t('newsroom.card.readingMinutes'), { minutes: String(featured.readingMinutes) })}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">{t('newsroom.grid.title')}</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {formatTpl(t('newsroom.grid.subtitle'), { count: String(active.length) })}
                </p>
              </div>
            </div>

            {active.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icons.search className="w-6 h-6" />
                </div>
                <div className="text-lg font-extrabold text-slate-900">{t('newsroom.empty.title')}</div>
                <div className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">{t('newsroom.empty.desc')}</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {active.map((a) => (
                  <article
                    key={a.id}
                    className={`rounded-3xl border bg-white shadow-sm overflow-hidden flex flex-col ${
                      featured && a.id === featured.id ? 'border-emerald-300' : 'border-slate-200'
                    }`}
                  >
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {a.breaking && (
                            <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 text-[11px] font-black">
                              {t('newsroom.card.breaking')}
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-800 border border-slate-200 px-2 py-0.5 text-[11px] font-black">
                            {t(`newsroom.tags.${a.tagKey}`)}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
                          {formatDate(a.date, language)}
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-extrabold text-slate-900 leading-snug">{pickText(a.title, language)}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{pickText(a.lead, language)}</p>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="text-xs font-bold text-slate-600">
                          {t(`newsroom.sources.${a.sourceKey}`)} •{' '}
                          {formatTpl(t('newsroom.card.readingMinutes'), { minutes: String(a.readingMinutes) })}
                        </div>
                        <Link
                          to={`${servicesPath('/news')}/${a.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-emerald-700 text-white px-3 py-2 text-xs font-black hover:bg-emerald-800 transition-colors"
                        >
                          {t('newsroom.card.open')}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
            </>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-2">
              <Icons.shield className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-extrabold text-slate-900">{t('newsroom.desk.title')}</h2>
            </div>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{t('newsroom.desk.subtitle')}</p>
            <ul className="mt-4 space-y-3">
              {newsDeskPrinciplesMock.map((p, idx) => (
                <li key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-sm font-extrabold text-slate-900">{pickText(p.title, language)}</div>
                  <div className="text-xs text-slate-600 mt-1 leading-relaxed">{pickText(p.desc, language)}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-slate-900">{t('newsroom.routes.title')}</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{t('newsroom.routes.subtitle')}</p>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Link className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50" to={servicesPath('/pharmacies')}>
                {t('newsroom.routes.pharmacies')}
              </Link>
              <Link className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50" to={servicesPath('/ambulances')}>
                {t('newsroom.routes.ambulances')}
              </Link>
              <Link className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50" to={servicesPath('/consultations')}>
                {t('newsroom.routes.consultations')}
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="text-sm font-extrabold text-emerald-950">{t('newsroom.admin.title')}</div>
            <div className="text-xs text-emerald-950/80 mt-2 leading-relaxed">{t('newsroom.admin.body')}</div>
          </section>
        </aside>
      </div>
    </div>
  );
}

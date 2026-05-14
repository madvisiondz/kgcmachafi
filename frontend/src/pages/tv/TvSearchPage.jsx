import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { searchTvStories } from '../../data/tvMock';
import TvStoryCard from '../../components/tv/TvStoryCard.jsx';
import { tvEditionPath } from '../../routes/paths';

export default function TvSearchPage() {
  const edition = useTvEdition();
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [input, setInput] = useState(initialQ);

  const q = searchParams.get('q')?.trim() ?? '';

  useEffect(() => {
    setInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  const results = useMemo(() => searchTvStories(edition, q), [edition, q]);

  function onSubmit(e) {
    e.preventDefault();
    const next = input.trim();
    if (next) setSearchParams({ q: next });
    else setSearchParams({});
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
      <header className="max-w-2xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t('tvApp.navSearch')}
        </span>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
          {t('tvApp.searchTitle')}
        </h1>
        <p className="mt-3 text-[14px] text-slate-600 leading-relaxed">
          {t('newsroom.filters.subtitle')}
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="mt-8 group relative flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-stretch rounded-2xl sm:bg-white sm:border sm:border-slate-200/70 sm:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-1.5 focus-within:sm:border-slate-300 transition-colors"
      >
        <label className="sr-only" htmlFor="tv-search-q">
          {t('tvApp.searchPlaceholder')}
        </label>
        <div className="relative flex-1">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id="tv-search-q"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tvApp.searchPlaceholder')}
            className="w-full rounded-xl border border-slate-200 bg-white ps-10 pe-4 py-3 text-[14px] font-medium text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 sm:rounded-lg sm:border-transparent sm:shadow-none sm:ring-0 sm:focus:ring-0"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          {t('tvApp.searchSubmit')}
        </button>
      </form>

      <section className="mt-10">
        {!q ? (
          <EmptyState
            tone="neutral"
            title={t('newsroom.filters.searchPlaceholder')}
            description={t('tvApp.searchPlaceholder')}
          />
        ) : results.length === 0 ? (
          <EmptyState
            tone="muted"
            title={t('tvApp.searchEmpty')}
            description={`"${q}"`}
            action={
              <Link
                to={tvEditionPath(edition, '/')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                {t('tvApp.navHome')}
              </Link>
            }
          />
        ) : (
          <>
            <p className="mb-5 text-[12px] uppercase tracking-[0.14em] font-semibold text-slate-500">
              {results.length} · {t('tvApp.navSearch')}
            </p>
            <ul className="space-y-3">
              {results.map(({ story, title, kicker, dek, byline }) => (
                <li key={story.slug}>
                  <TvStoryCard
                    edition={edition}
                    slug={story.slug}
                    kicker={kicker}
                    title={title}
                    dek={dek}
                    byline={byline}
                    publishedAt={story.publishedAt}
                    readingMinutes={story.readingMinutes}
                    tone={story.heroTone}
                    compact
                    breaking={!!story.breaking}
                    breakingLabel={t('tvApp.breakingBadge')}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="mt-12 text-sm">
        <Link
          to={tvEditionPath(edition, '/')}
          className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span aria-hidden="true" className="rtl:rotate-180">←</span>
          {t('tvApp.navHome')}
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ title, description, action, tone = 'neutral' }) {
  return (
    <div className="flex flex-col items-center text-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-12 md:py-16">
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
          tone === 'muted' ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-500'
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
      {description ? (
        <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

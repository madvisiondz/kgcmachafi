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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t('tvApp.searchTitle')}</h1>
      <p className="mt-2 text-slate-600 text-sm">{t('newsroom.filters.subtitle')}</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="tv-search-q">
          {t('tvApp.searchPlaceholder')}
        </label>
        <input
          id="tv-search-q"
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('tvApp.searchPlaceholder')}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-slate-800"
        >
          {t('tvApp.searchSubmit')}
        </button>
      </form>

      <div className="mt-10">
        {!q ? (
          <p className="text-sm text-slate-500">{t('newsroom.filters.searchPlaceholder')}</p>
        ) : results.length === 0 ? (
          <p className="text-slate-600">{t('tvApp.searchEmpty')}</p>
        ) : (
          <ul className="space-y-6">
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
        )}
      </div>

      <div className="mt-10 text-sm font-bold">
        <Link to={tvEditionPath(edition, '/')} className="text-red-800 hover:underline">
          ← {t('tvApp.navHome')}
        </Link>
      </div>
    </div>
  );
}

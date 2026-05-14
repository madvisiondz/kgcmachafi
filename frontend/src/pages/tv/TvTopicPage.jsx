import { Link, Navigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { getTvStoriesByTopic } from '../../data/tvMock';
import TvStoryCard from '../../components/tv/TvStoryCard.jsx';
import { tvEditionPath } from '../../routes/paths';

const TOPIC_IDS = ['health', 'policy', 'research', 'community'];

function isTvTopicId(id) {
  return TOPIC_IDS.includes(id);
}

export default function TvTopicPage() {
  const { topicId } = useParams();
  const edition = useTvEdition();
  const { t } = useI18n();

  if (!isTvTopicId(topicId)) {
    return <Navigate to={tvEditionPath(edition, '/')} replace />;
  }

  const topicLabelKey = {
    health: 'tvApp.topicHealth',
    policy: 'tvApp.topicPolicy',
    research: 'tvApp.topicResearch',
    community: 'tvApp.topicCommunity',
  }[topicId];

  const rows = getTvStoriesByTopic(edition, topicId);

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('tvApp.topicPageTitle')}
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            {t(topicLabelKey)}
          </h1>
        </div>
        <Link
          to={tvEditionPath(edition, '/')}
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span aria-hidden="true" className="rtl:rotate-180">←</span>
          {t('tvApp.navHome')}
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center text-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-16">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M4 6h16M4 12h16M4 18h10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-900">
            {t('tvApp.searchEmpty')}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-sm">
            {t(topicLabelKey)}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-5 sm:grid-cols-2">
          {rows.map(({ story, title, kicker, dek, byline }) => (
            <TvStoryCard
              key={story.slug}
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
          ))}
        </div>
      )}
    </div>
  );
}

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-red-800">{t('tvApp.topicPageTitle')}</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-900">{t(topicLabelKey)}</h1>
        </div>
        <Link to={tvEditionPath(edition, '/')} className="text-sm font-bold text-slate-600 hover:text-red-800">
          ← {t('tvApp.navHome')}
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-600">{t('tvApp.searchEmpty')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
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
              breaking={!!story.breaking}
              breakingLabel={t('tvApp.breakingBadge')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

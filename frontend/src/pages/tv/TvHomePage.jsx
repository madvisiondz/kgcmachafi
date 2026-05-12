import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { getLeadStories, getTvStories } from '../../data/tvMock';
import TvStoryCard from '../../components/tv/TvStoryCard.jsx';
import { tvEditionPath } from '../../routes/paths';

export default function TvHomePage() {
  const edition = useTvEdition();
  const { t } = useI18n();
  const lead = getLeadStories(edition, 5);
  const [hero, ...restLead] = lead;
  const river = getTvStories(edition).slice(5);
  const trending = getTvStories(edition).slice(0, 5);

  const topics = [
    { id: 'health', label: t('tvApp.topicHealth') },
    { id: 'policy', label: t('tvApp.topicPolicy') },
    { id: 'research', label: t('tvApp.topicResearch') },
    { id: 'community', label: t('tvApp.topicCommunity') },
  ];

  return (
    <div className="bg-slate-100/80">
      {/* Live strip */}
      <section className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">{t('tvApp.homeLiveStrip')}</div>
            <p className="mt-1 text-sm text-slate-200 max-w-xl">{t('tvApp.homeLiveStripSub')}</p>
          </div>
          <Link
            to={tvEditionPath(edition, '/live')}
            className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-500 px-5 py-2.5 text-sm font-black uppercase tracking-wide shrink-0"
          >
            {t('tvApp.homeLiveCta')}
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-12">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero */}
          {hero ? (
            <TvStoryCard
              edition={edition}
              slug={hero.story.slug}
              kicker={hero.kicker}
              title={hero.title}
              dek={hero.dek}
              byline={hero.byline}
              publishedAt={hero.story.publishedAt}
              readingMinutes={hero.story.readingMinutes}
              tone={hero.story.heroTone}
              breaking={!!hero.story.breaking}
              breakingLabel={t('tvApp.breakingBadge')}
            />
          ) : null}

          {/* Secondary leads */}
          <div className="grid gap-4 sm:grid-cols-2">
            {restLead.map(({ story, title, kicker, dek, byline }) => (
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

          {/* Topic rails */}
          <section>
            <div className="flex items-end justify-between gap-4 mb-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{t('tvApp.homeSectionsTitle')}</h2>
              <Link to={tvEditionPath(edition, '/activity')} className="text-xs font-bold text-red-800 hover:underline">
                {t('tvApp.homeSeeWire')}
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {topics.map((tp) => (
                <Link
                  key={tp.id}
                  to={tvEditionPath(edition, `/topics/${tp.id}`)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 hover:border-red-400 hover:text-red-900"
                >
                  {tp.label}
                </Link>
              ))}
            </div>
          </section>

          {/* River */}
          <section>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">{t('tvApp.homeLatestTitle')}</h2>
            <div className="space-y-4">
              {river.map(({ story, title, kicker, dek, byline }) => (
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
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{t('tvApp.homeTrendingTitle')}</h3>
            <ol className="mt-4 space-y-3">
              {trending.map(({ story, title }, i) => (
                <li key={story.slug} className="flex gap-3">
                  <span className="text-2xl font-black text-red-200 leading-none w-6 shrink-0">{i + 1}</span>
                  <Link to={tvEditionPath(edition, `/article/${story.slug}`)} className="text-sm font-bold text-slate-900 hover:text-red-800 leading-snug">
                    {title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-red-400">{t('tvApp.homeToolsTitle')}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to={tvEditionPath(edition, '/desk')} className="hover:text-red-300 font-semibold">
                  → {t('tvApp.navDesk')}
                </Link>
              </li>
              <li>
                <Link to={tvEditionPath(edition, '/activity')} className="hover:text-red-300 font-semibold">
                  → {t('tvApp.navActivity')}
                </Link>
              </li>
              <li>
                <Link to={tvEditionPath(edition, '/search')} className="hover:text-red-300 font-semibold">
                  → {t('tvApp.navSearch')}
                </Link>
              </li>
              <li>
                <Link to="/machafitv/admin" className="hover:text-red-300 font-semibold">
                  → {t('tvApp.homeAdminLink')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-sm text-emerald-950">
            <p className="font-bold">{t('tvApp.homeTrustTitle')}</p>
            <p className="mt-2 text-emerald-900/90 leading-relaxed">{t('tvApp.homeTrustBody')}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

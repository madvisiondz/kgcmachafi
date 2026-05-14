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
    <div>
      {/* ── Live strip ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(239,68,68,0.18), transparent 60%),' +
              'radial-gradient(ellipse 50% 80% at 100% 50%, rgba(56,189,248,0.10), transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-4 py-6 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300 ring-1 ring-inset ring-red-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              {t('tvApp.homeLiveStrip')}
            </span>
            <p className="mt-3 text-sm md:text-[15px] text-slate-300 leading-relaxed">
              {t('tvApp.homeLiveStripSub')}
            </p>
          </div>
          <Link
            to={tvEditionPath(edition, '/live')}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(239,68,68,0.6)] transition-all hover:bg-red-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            {t('tvApp.homeLiveCta')}
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 rtl:rotate-180" aria-hidden="true">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Main grid ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-10 md:py-14 grid gap-10 lg:grid-cols-12">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-10">
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

          {/* Topics */}
          <section>
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Sections
                </span>
                <h2 className="mt-1 text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
                  {t('tvApp.homeSectionsTitle')}
                </h2>
              </div>
              <Link
                to={tvEditionPath(edition, '/activity')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
              >
                {t('tvApp.homeSeeWire')}
                <span aria-hidden="true" className="rtl:rotate-180">→</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((tp) => (
                <Link
                  key={tp.id}
                  to={tvEditionPath(edition, `/topics/${tp.id}`)}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  {tp.label}
                </Link>
              ))}
            </div>
          </section>

          {/* River */}
          <section>
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Wire
                </span>
                <h2 className="mt-1 text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
                  {t('tvApp.homeLatestTitle')}
                </h2>
              </div>
            </div>
            <div className="space-y-3">
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

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-[10.5rem] lg:self-start">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 md:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t('tvApp.homeTrendingTitle')}
            </h3>
            <ol className="mt-4 space-y-3.5">
              {trending.map(({ story, title }, i) => (
                <li key={story.slug} className="flex gap-3 items-start group">
                  <span className="text-[15px] font-semibold text-slate-300 group-hover:text-red-500 transition-colors leading-tight w-5 shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Link
                    to={tvEditionPath(edition, `/article/${story.slug}`)}
                    className="text-[14px] font-medium text-slate-800 group-hover:text-slate-950 leading-snug transition-colors"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white p-5 md:p-6 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)]">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(circle at 20% 0%, rgba(239,68,68,0.18), transparent 50%),' +
                  'radial-gradient(circle at 90% 100%, rgba(56,189,248,0.12), transparent 50%)',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                {t('tvApp.homeToolsTitle')}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { to: tvEditionPath(edition, '/desk'), label: t('tvApp.navDesk') },
                  { to: tvEditionPath(edition, '/activity'), label: t('tvApp.navActivity') },
                  { to: tvEditionPath(edition, '/search'), label: t('tvApp.navSearch') },
                  { to: '/machafitv/admin', label: t('tvApp.homeAdminLink') },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-2 text-slate-200 hover:text-white font-medium transition-colors"
                    >
                      <span className="h-1 w-1 rounded-full bg-red-400" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5 md:p-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {t('tvApp.homeTrustTitle')}
            </h3>
            <p className="mt-3 text-[14px] text-emerald-900/85 leading-relaxed">
              {t('tvApp.homeTrustBody')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

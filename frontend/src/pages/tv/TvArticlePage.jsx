import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { getTvStoryBySlug, pick } from '../../data/tvMock';
import { tvEditionPath } from '../../routes/paths';

const toolBtn =
  'inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2';

function IconShare({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3v9m0-9-3 3m3-3 3 3M5 14v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconPrint({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 7V3h8v4M6 15H4v-5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5h-2m-8 0v3h8v-3m-8 0h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconFlag({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 17V4m0 0h9l-2 3 2 3H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TvArticlePage() {
  const { slug } = useParams();
  const edition = useTvEdition();
  const { t } = useI18n();
  const story = getTvStoryBySlug(slug);

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md text-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-16">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 7v3.5m0 2.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-900">
            {t('tvApp.searchEmpty')}
          </h3>
          <Link
            to={tvEditionPath(edition, '/')}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            {t('tvApp.navHome')}
          </Link>
        </div>
      </div>
    );
  }

  const title = pick(story.title, edition);
  const kicker = pick(story.kicker, edition);
  const byline = pick(story.byline, edition);
  const bodyText = story.body ? pick(story.body, edition) : null;
  const paragraphs = bodyText
    ? bodyText.split(/\n\n/).filter(Boolean)
    : [pick(story.dek, edition), pick(story.dek, edition), pick(story.dek, edition)];

  return (
    <article className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
      <header>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {kicker}
          </span>
          {story.breaking ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700 ring-1 ring-inset ring-red-100">
              <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              {t('tvApp.breakingBadge')}
            </span>
          ) : null}
        </div>

        <h1 className="mt-3 text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-slate-900 leading-[1.1]">
          {title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
          <span className="font-medium text-slate-700">{byline}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={story.publishedAt}>{story.publishedAt}</time>
          <span aria-hidden="true">·</span>
          <span>{story.readingMinutes} min read</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" className={toolBtn}>
            <IconShare className="h-3.5 w-3.5" />
            {t('tvApp.articleShare')}
          </button>
          <button type="button" className={toolBtn}>
            <IconPrint className="h-3.5 w-3.5" />
            {t('tvApp.articlePrint')}
          </button>
          <button type="button" className={toolBtn}>
            <IconFlag className="h-3.5 w-3.5" />
            {t('tvApp.articleCorrection')}
          </button>
        </div>
      </header>

      <div className="mt-10 space-y-5">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[17px] leading-[1.75] text-slate-700">
            {p}
          </p>
        ))}
      </div>

      <aside className="mt-12 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 md:p-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M10 6.5v4m0 2.5h.01M3.5 16h13L10 4 3.5 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong className="text-amber-900 font-semibold">
            {t('newsroom.detail.disclaimerTitle')}
          </strong>
        </div>
        <p className="mt-2 text-amber-950/85 leading-relaxed">
          {t('tvApp.articleDisclaimer')}
        </p>
      </aside>

      <footer className="mt-10 pt-6 border-t border-slate-200/70">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t('tvApp.articleToolsTitle')}
        </h2>
        <Link
          to={tvEditionPath(edition, '/desk')}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          {t('tvApp.navDesk')}
          <span aria-hidden="true" className="rtl:rotate-180">→</span>
        </Link>
      </footer>
    </article>
  );
}

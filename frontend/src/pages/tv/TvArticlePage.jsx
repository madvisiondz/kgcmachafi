import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { useTvEdition } from '../../tv/useTvEdition';
import { getTvStoryBySlug, pick } from '../../data/tvMock';
import { tvEditionPath } from '../../routes/paths';

export default function TvArticlePage() {
  const { slug } = useParams();
  const edition = useTvEdition();
  const { t } = useI18n();
  const story = getTvStoryBySlug(slug);

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-slate-600">{t('tvApp.searchEmpty')}</p>
        <Link to={tvEditionPath(edition, '/')} className="mt-4 inline-block font-bold text-red-800 hover:underline">
          {t('tvApp.navHome')}
        </Link>
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
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-xs font-bold uppercase tracking-wide text-red-800">{kicker}</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-black text-slate-900 leading-tight">{title}</h1>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        <span className="font-semibold text-slate-800">{byline}</span>
        <time dateTime={story.publishedAt}>{story.publishedAt}</time>
        <span>·</span>
        <span>{story.readingMinutes} min</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold hover:bg-slate-50">
          {t('tvApp.articleShare')}
        </button>
        <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold hover:bg-slate-50">
          {t('tvApp.articlePrint')}
        </button>
        <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold hover:bg-slate-50">
          {t('tvApp.articleCorrection')}
        </button>
      </div>

      <div className="mt-10 prose prose-slate max-w-none">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-slate-800 mb-4">
            {p}
          </p>
        ))}
      </div>

      <aside className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>{t('newsroom.detail.disclaimerTitle')}</strong>
        <p className="mt-1">{t('tvApp.articleDisclaimer')}</p>
      </aside>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h2 className="text-xs font-black uppercase text-slate-500">{t('tvApp.articleToolsTitle')}</h2>
        <Link to={tvEditionPath(edition, '/desk')} className="mt-2 inline-block text-sm font-bold text-red-800 hover:underline">
          {t('tvApp.navDesk')} →
        </Link>
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';
import { tvEditionPath } from '../../routes/paths';

const toneRing = {
  red: 'ring-red-200/80 bg-red-50/30',
  amber: 'ring-amber-200/80 bg-amber-50/30',
  emerald: 'ring-emerald-200/80 bg-emerald-50/30',
  slate: 'ring-slate-200/80 bg-slate-50/80',
};

/**
 * @param {import('../../routes/paths').TvEdition} edition
 */
export default function TvStoryCard({
  edition,
  slug,
  kicker,
  title,
  dek,
  byline,
  publishedAt,
  readingMinutes,
  tone,
  compact,
  breaking,
  breakingLabel,
}) {
  const path = tvEditionPath(edition, `/article/${slug}`);

  if (compact) {
    return (
      <Link
        to={path}
        className={`group block rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-shadow ring-1 ${toneRing[tone] ?? toneRing.slate}`}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-red-700">{kicker}</span>
          {breaking ? (
            <span className="shrink-0 text-[10px] font-black uppercase bg-red-600 text-white px-1.5 py-0.5 rounded">
              {breakingLabel}
            </span>
          ) : null}
        </div>
        <h3 className="mt-1.5 text-sm font-bold text-slate-900 group-hover:text-red-800 line-clamp-2 leading-snug">{title}</h3>
        <p className="mt-1 text-xs text-slate-600 line-clamp-2">{dek}</p>
        <div className="mt-2 flex flex-wrap gap-x-2 text-[10px] text-slate-500">
          <span>{byline}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedAt}>{publishedAt}</time>
          <span>·</span>
          <span>{readingMinutes} min</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={path}
      className={`group grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all md:grid-cols-12 ring-1 ${toneRing[tone] ?? toneRing.slate}`}
    >
      <div className="md:col-span-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wide text-red-800">{kicker}</span>
          {breaking ? (
            <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">{breakingLabel}</span>
          ) : null}
        </div>
        <h2 className="mt-2 text-xl md:text-2xl font-black text-slate-900 group-hover:text-red-900 leading-tight">{title}</h2>
        <p className="mt-2 text-slate-600 text-sm md:text-base leading-relaxed line-clamp-3">{dek}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{byline}</span>
          <time dateTime={publishedAt}>{publishedAt}</time>
          <span>·</span>
          <span>{readingMinutes} min read</span>
        </div>
      </div>
      <div className="md:col-span-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white/90 min-h-[120px]">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Machafi TV</span>
      </div>
    </Link>
  );
}

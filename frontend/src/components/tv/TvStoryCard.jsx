import { Link } from 'react-router-dom';
import { tvEditionPath } from '../../routes/paths';

/** Small colored dot used as the only chromatic tone signal on the card. */
const toneDot = {
  red: 'bg-red-500',
  amber: 'bg-amber-400',
  emerald: 'bg-emerald-500',
  slate: 'bg-slate-400',
};

const cardBase =
  'group block rounded-2xl border border-slate-200/70 bg-white p-5 md:p-6 ' +
  'shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] ' +
  'transition-all duration-200 ease-out ' +
  'hover:-translate-y-0.5 hover:border-slate-300 ' +
  'hover:shadow-[0_2px_4px_rgba(15,23,42,0.04),0_16px_32px_-12px_rgba(15,23,42,0.12)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2';

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
  const dot = toneDot[tone] ?? toneDot.slate;

  if (compact) {
    return (
      <Link to={path} className={cardBase}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`h-1.5 w-1.5 rounded-full ${dot} shrink-0`} aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 truncate">
              {kicker}
            </span>
          </div>
          {breaking ? (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700 ring-1 ring-inset ring-red-100">
              <span className="h-1 w-1 rounded-full bg-red-500" aria-hidden="true" />
              {breakingLabel}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2.5 text-[15px] font-semibold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] text-slate-500 line-clamp-2 leading-relaxed">{dek}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
          <span className="font-medium text-slate-500">{byline}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedAt}>{publishedAt}</time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes} min</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={path} className={`${cardBase} grid gap-5 md:grid-cols-12 md:gap-6 md:p-7`}>
      <div className="md:col-span-7 lg:col-span-8 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {kicker}
          </span>
          {breaking ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700 ring-1 ring-inset ring-red-100">
              <span className="h-1 w-1 rounded-full bg-red-500" aria-hidden="true" />
              {breakingLabel}
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 text-xl md:text-2xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors leading-[1.2] tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed line-clamp-3">{dek}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
          <span className="font-medium text-slate-700">{byline}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedAt}>{publishedAt}</time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes} min read</span>
        </div>
      </div>
      <div className="md:col-span-5 lg:col-span-4 relative overflow-hidden rounded-xl min-h-[140px] md:min-h-[200px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
        {/* Decorative subtle pattern + brand mark */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(248,113,113,0.35), transparent 45%),' +
              'radial-gradient(circle at 80% 80%, rgba(56,189,248,0.18), transparent 45%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ring-1 ring-inset ring-white/15">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              Machafi TV
            </span>
            <span className="text-[11px] font-medium text-white/50">{publishedAt}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

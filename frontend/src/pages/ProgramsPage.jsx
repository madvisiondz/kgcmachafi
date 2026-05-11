import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { programScheduleMock } from '../data/programs';

function Icon({ children, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const Icons = {
  calendar: (props) => (
    <Icon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </Icon>
  ),
  chevronLeft: (props) => (
    <Icon {...props}>
      <path d="M15 18 9 12l6-6" />
    </Icon>
  ),
  chevronRight: (props) => (
    <Icon {...props}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  ),
  search: (props) => (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </Icon>
  ),
  play: (props) => (
    <Icon {...props}>
      <polygon points="8 5 19 12 8 19 8 5" />
    </Icon>
  ),
  clock: (props) => (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icon>
  ),
  spark: (props) => (
    <Icon {...props}>
      <path d="M12 2l1.1 3.6L17 7l-3.9 1.4L12 12l-1.1-3.6L7 7l3.9-1.4L12 2Z" />
      <path d="M5 14l.7 2.2L8 17l-2.3.8L5 20l-.7-2.2L2 17l2.3-.8L5 14Z" />
    </Icon>
  ),
  x: (props) => (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  ),
};

function normalize(s) {
  return s.trim().toLocaleLowerCase();
}

const DAY_KEYS = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
const CATEGORY_KEYS = ['all', 'awareness', 'nutrition', 'mental-health', 'family', 'emergency', 'chronic-care'];

function getTodayKey() {
  const d = new Date();
  const js = d.getDay(); // 0..6 (Sun..Sat)
  const map = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
  return map[js] ?? 'sat';
}

function dayIndexOf(key) {
  return DAY_KEYS.indexOf(key);
}

function addMinutesToTimeLabel(timeHHMM, minutesToAdd) {
  const [h, m] = String(timeHHMM).split(':').map((x) => Number(x));
  const base = (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
  const total = base + Math.max(0, Number(minutesToAdd) || 0);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export default function ProgramsPage() {
  const { t, dir } = useI18n();

  const [day, setDay] = useState(getTodayKey());
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const todayKey = useMemo(() => getTodayKey(), []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return programScheduleMock.filter((row) => {
      if (day && row.day !== day) return false;
      if (category !== 'all' && row.category !== category) return false;
      if (!q) return true;

      const title = t(`programs.items.${row.programKey}.title`);
      const host = t(`programs.hosts.${row.hostKey}`);
      const cat = t(`programs.categories.${row.category}`);
      const hay = normalize([title, host, cat, row.startTime].join(' '));
      return hay.includes(q);
    });
  }, [category, day, query, t]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const live = filtered.filter((x) => x.isLive).length;
    const replay = filtered.filter((x) => x.isReplayAvailable).length;
    return { total, live, replay };
  }, [filtered]);

  const featured = useMemo(() => {
    // Legacy-inspired: show “Now / Next” for *today* based on time only (UI-first).
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const todayRows = programScheduleMock
      .filter((r) => r.day === todayKey)
      .map((r) => {
        const [hh, mm] = String(r.startTime).slice(0, 5).split(':').map((x) => Number(x));
        const startMinutes = (Number.isFinite(hh) ? hh : 0) * 60 + (Number.isFinite(mm) ? mm : 0);
        return { ...r, startMinutes };
      })
      .filter((r) => Number.isFinite(r.startMinutes))
      .sort((a, b) => a.startMinutes - b.startMinutes);

    if (todayRows.length === 0) return { now: null, next: null };

    const current =
      todayRows.find((r) => nowMinutes >= r.startMinutes && nowMinutes < r.startMinutes + Math.max(1, Number(r.durationMin) || 1)) || null;
    const next = todayRows.find((r) => r.startMinutes > nowMinutes) || null;
    return { now: current, next };
  }, [todayKey]);

  const navDayLabel = useMemo(() => t(`programs.days.${day}`), [day, t]);

  return (
    <div className="space-y-12" dir={dir}>
      <section className="border-y border-amber-100 bg-gradient-to-b from-amber-50/70 via-white to-white py-14">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-extrabold text-amber-700">
              {Icons.calendar({ className: 'h-4 w-4' })}
              {t('programs.badge')}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-600 text-white">
                    {Icons.calendar({ className: 'h-6 w-6' })}
                  </span>
                  {t('programs.title')}
                </h1>
                <p className="mt-3 text-slate-600 text-lg">{t('programs.subtitle')}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatPill label={t('programs.stats.total')} value={String(stats.total)} tone="slate" />
                <StatPill label={t('programs.stats.live')} value={String(stats.live)} tone="rose" />
                <StatPill label={t('programs.stats.replay')} value={String(stats.replay)} tone="blue" />
              </div>
            </div>
          </div>

          {/* Featured (legacy-inspired “Now / Next”) */}
          <div className="mb-8 grid gap-4 lg:grid-cols-2">
            <FeaturedCard kind="now" row={featured.now} t={t} />
            <FeaturedCard kind="next" row={featured.next} t={t} />
          </div>

          {/* Filters */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr] lg:items-end">
              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="programs-search">
                  {t('programs.searchLabel')}
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {Icons.search({ className: 'h-5 w-5' })}
                  </span>
                  <input
                    id="programs-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('programs.searchPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                  />
                  {query.trim() ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label={t('programs.clearSearch')}
                      title={t('programs.clearSearch')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      {Icons.x({ className: 'h-4 w-4' })}
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="programs-day">
                  {t('programs.dayLabel')}
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-amber-200 bg-white text-amber-800 hover:bg-amber-50"
                    aria-label={t('programs.prevDay')}
                    title={t('programs.prevDay')}
                    onClick={() => {
                      const idx = dayIndexOf(day);
                      const nextIdx = (idx - 1 + DAY_KEYS.length) % DAY_KEYS.length;
                      setDay(DAY_KEYS[nextIdx]);
                    }}
                  >
                    {Icons.chevronRight({ className: 'h-5 w-5' })}
                  </button>

                  <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-extrabold text-slate-800">
                    {navDayLabel}
                  </div>

                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center rounded-xl border border-amber-200 bg-white text-amber-800 hover:bg-amber-50"
                    aria-label={t('programs.nextDay')}
                    title={t('programs.nextDay')}
                    onClick={() => {
                      const idx = dayIndexOf(day);
                      const nextIdx = (idx + 1) % DAY_KEYS.length;
                      setDay(DAY_KEYS[nextIdx]);
                    }}
                  >
                    {Icons.chevronLeft({ className: 'h-5 w-5' })}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {DAY_KEYS.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setDay(k)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-extrabold transition ${
                        day === k
                          ? 'border-amber-200 bg-amber-50 text-amber-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {t(`programs.daysShort.${k}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="programs-category">
                  {t('programs.categoryLabel')}
                </label>
                <select
                  id="programs-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORY_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {k === 'all' ? t('programs.categories.all') : t(`programs.categories.${k}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-500">
                  {Icons.calendar({ className: 'h-7 w-7' })}
                </div>
                <h3 className="text-lg font-extrabold text-slate-700">{t('programs.emptyTitle')}</h3>
                <p className="mt-2 text-sm text-slate-500">{t('programs.emptyDesc')}</p>
              </div>
            ) : (
              filtered.map((row) => <ProgramRow key={row.id} row={row} t={t} />)
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-white p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-extrabold text-amber-800">{t('programs.ctaTitle')}</div>
                <div className="mt-1 text-sm text-slate-600">{t('programs.ctaDesc')}</div>
              </div>
              <Link
                to="/live"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-amber-700"
              >
                {Icons.play({ className: 'h-4 w-4' })}
                {t('programs.watchLive')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatPill({ label, value, tone }) {
  const toneClass =
    tone === 'rose'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : tone === 'blue'
        ? 'border-blue-200 bg-blue-50 text-blue-900'
        : 'border-slate-200 bg-white text-slate-900';

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="text-xl font-black leading-none">{value}</div>
      <div className="mt-1 text-[12px] font-bold opacity-80">{label}</div>
    </div>
  );
}

function ProgramRow({ row, t }) {
  const title = t(`programs.items.${row.programKey}.title`);
  const desc = t(`programs.items.${row.programKey}.desc`);
  const host = t(`programs.hosts.${row.hostKey}`);
  const category = t(`programs.categories.${row.category}`);

  const endTime = addMinutesToTimeLabel(row.startTime, row.durationMin);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative aspect-[4/2] overflow-hidden bg-slate-100">
        <div className="flex h-full w-full items-end bg-gradient-to-br from-amber-700 via-orange-600 to-rose-600 p-5">
          <div className="max-w-[85%] text-white">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/75">{t('programs.brandTag')}</p>
            <h3 className="mt-2 text-xl font-black leading-tight">{title}</h3>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
        <div className="absolute end-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-900 shadow-lg">
          <span dir="ltr">{row.startTime}</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {row.isLive ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700">
              {Icons.spark({ className: 'h-4 w-4' })}
              {t('programs.liveNow')}
            </span>
          ) : null}
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">{category}</span>
          {row.isReplayAvailable ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">{t('programs.replay')}</span>
          ) : null}
        </div>

        <p className="text-sm leading-6 text-slate-600">{desc}</p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="text-xs font-bold text-slate-600">
            {t('programs.timeRange').replace('{start}', row.startTime).replace('{end}', endTime)}
          </div>
          <div className="text-xs font-bold text-slate-500">{t('programs.hostLabel').replace('{host}', host)}</div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500">
            {t('programs.durationLabel').replace('{min}', String(row.durationMin))}
          </span>
          <Link to="/live" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-orange-700">
            {Icons.play({ className: 'h-4 w-4' })}
            {t('programs.watch')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ kind, row, t }) {
  const isNow = kind === 'now';
  const title = row ? t(`programs.items.${row.programKey}.title`) : '';
  const host = row ? t(`programs.hosts.${row.hostKey}`) : '';
  const category = row ? t(`programs.categories.${row.category}`) : '';

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className={`relative p-5 ${isNow ? 'bg-gradient-to-br from-orange-50 via-white to-rose-50' : 'bg-gradient-to-br from-amber-50 via-white to-white'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-extrabold text-white">
              {Icons.calendar({ className: 'h-4 w-4' })}
              {isNow ? t('programs.featuredNow') : t('programs.featuredNext')}
            </div>
            <div className="mt-4 text-lg font-black text-slate-900">{row ? title : t('programs.featuredEmptyTitle')}</div>
            <div className="mt-1 text-sm text-slate-600">
              {row ? t('programs.featuredEmptyDescFilled').replace('{host}', host) : t('programs.featuredEmptyDesc')}
            </div>
          </div>

          <Link
            to="/live"
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${
              isNow ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {Icons.play({ className: 'h-4 w-4' })}
            {t('programs.watchLive')}
          </Link>
        </div>

        {row ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-700">
              {t('programs.featuredTime').replace('{time}', row.startTime)}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-700">{category}</span>
            {row.isLive ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700">
                {Icons.spark({ className: 'h-4 w-4' })}
                {t('programs.liveNow')}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}


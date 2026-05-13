import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { servicesPath } from '../routes/paths';

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-lg text-slate-600">{subtitle}</p>
    </div>
  );
}

function StatCard({ value, label, tone, enterDelay = 0 }) {
  const toneClasses =
    tone === 'blue'
      ? 'bg-blue-100 text-blue-600'
      : tone === 'green'
        ? 'bg-green-100 text-green-600'
        : 'bg-emerald-100 text-emerald-700';

  const icon =
    tone === 'blue' ? '/nav-icons/news.png' : tone === 'green' ? '/nav-icons/services.png' : '/nav-icons/library.png';

  return (
    <div
      className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow motion-safe:animate-kgc-pop"
      style={enterDelay ? { animationDelay: `${enterDelay}ms` } : undefined}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${toneClasses}`}>
        <img src={icon} alt="" aria-hidden="true" className="w-8 h-8" draggable="false" />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-gray-600 font-medium">{label}</p>
      </div>
    </div>
  );
}

function StaffPill({ value, label, icon, tone, enterDelay = 0 }) {
  const toneClass =
    tone === 'red'
      ? 'text-red-600'
      : tone === 'teal'
        ? 'text-teal-600'
        : tone === 'cyan'
          ? 'text-cyan-600'
          : tone === 'pink'
            ? 'text-pink-600'
            : tone === 'green'
              ? 'text-green-600'
              : tone === 'orange'
                ? 'text-orange-600'
                : 'text-blue-600';

  return (
    <div
      className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group motion-safe:animate-kgc-pop"
      style={enterDelay ? { animationDelay: `${enterDelay}ms` } : undefined}
    >
      <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 mb-3 transition-colors">
        <img src={icon} alt="" aria-hidden="true" className={`w-6 h-6 ${toneClass}`} draggable="false" />
      </div>
      <span className="text-2xl font-bold mb-1">{value}</span>
      <span className="text-xs text-gray-400 text-center font-medium">{label}</span>
    </div>
  );
}

function NewsCard({ tag, date, title, desc, cta, enterDelay = 0 }) {
  return (
    <div
      className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col motion-safe:animate-kgc-pop hover:-translate-y-0.5 duration-300"
      style={enterDelay ? { animationDelay: `${enterDelay}ms` } : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <img src="/nav-icons/news.png" alt="" aria-hidden="true" className="w-3 h-3" draggable="false" />
          {tag}
        </span>
        <span className="text-gray-500 text-xs flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300" aria-hidden="true" />
          {date}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 min-h-[3.5rem]">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-grow">{desc}</p>

      <Link to={servicesPath('/news')} className="mt-auto inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800">
        {cta}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const cards = useMemo(
    () => [
      {
        title: t('common.watchLive'),
        desc: t('home.platform.liveDesc'),
        href: servicesPath('/live'),
        icon: '/nav-icons/live-red.png',
        color: 'from-red-500 to-rose-600',
      },
      {
        title: t('nav.programs'),
        desc: t('home.platform.programsDesc'),
        href: servicesPath('/programs'),
        icon: '/nav-icons/programs-blue.png',
        color: 'from-blue-500 to-cyan-600',
      },
      {
        title: t('nav.services'),
        desc: t('home.platform.servicesDesc'),
        href: servicesPath('/service'),
        icon: '/nav-icons/services.png',
        color: 'from-emerald-500 to-green-600',
      },
      {
        title: t('nav.library'),
        desc: t('home.platform.libraryDesc'),
        href: servicesPath('/library'),
        icon: '/nav-icons/library.png',
        color: 'from-teal-600 to-emerald-700',
      },
      {
        title: t('nav.pharmacies'),
        desc: t('home.platform.pharmaciesDesc'),
        href: servicesPath('/pharmacies'),
        icon: '/nav-icons/pharmacies.png',
        color: 'from-amber-500 to-orange-600',
      },
      {
        title: t('nav.ambulances'),
        desc: t('home.platform.ambulancesDesc'),
        href: servicesPath('/ambulances'),
        icon: '/nav-icons/ambulances.png',
        color: 'from-rose-500 to-red-600',
      },
      {
        title: t('nav.accommodation'),
        desc: t('home.platform.accommodationDesc'),
        href: servicesPath('/accommodations'),
        icon: '/nav-icons/accommodation.png',
        color: 'from-sky-500 to-blue-600',
      },
      {
        title: t('nav.hospitals'),
        desc: t('home.platform.hospitalsDesc'),
        href: servicesPath('/hospitals'),
        icon: '/nav-icons/hospitals.png',
        color: 'from-slate-600 to-slate-800',
      },
      {
        title: t('nav.consultations'),
        desc: t('home.platform.consultationsDesc'),
        href: servicesPath('/consultations'),
        icon: '/nav-icons/consultations.png',
        color: 'from-lime-500 to-emerald-600',
      },
      {
        title: t('nav.donations'),
        desc: t('home.platform.donationsDesc'),
        href: servicesPath('/donations'),
        icon: '/nav-icons/donations.png',
        color: 'from-emerald-600 to-teal-700',
      },
    ],
    [t],
  );

  const mainStats = useMemo(
    () => [
      { value: t('home.stats.visitorsValue'), label: t('home.stats.visitorsLabel'), tone: 'blue' },
      { value: t('home.stats.subscribersValue'), label: t('home.stats.subscribersLabel'), tone: 'green' },
      { value: t('home.stats.registeredValue'), label: t('home.stats.registeredLabel'), tone: 'emerald' },
    ],
    [t],
  );

  const staffStats = useMemo(
    () => [
      { value: t('home.stats.staff.managerValue'), label: t('home.stats.staff.managerLabel'), icon: '/nav-icons/hospitals.png', tone: 'red' },
      { value: t('home.stats.staff.consultantValue'), label: t('home.stats.staff.consultantLabel'), icon: '/nav-icons/consultations.png', tone: 'teal' },
      { value: t('home.stats.staff.newsManagerValue'), label: t('home.stats.staff.newsManagerLabel'), icon: '/nav-icons/news.png', tone: 'cyan' },
      { value: t('home.stats.staff.supportManagerValue'), label: t('home.stats.staff.supportManagerLabel'), icon: '/nav-icons/services.png', tone: 'pink' },
      { value: t('home.stats.staff.editorValue'), label: t('home.stats.staff.editorLabel'), icon: '/nav-icons/library.png', tone: 'green' },
      { value: t('home.stats.staff.technicianValue'), label: t('home.stats.staff.technicianLabel'), icon: '/nav-icons/ambulances.png', tone: 'orange' },
      { value: t('home.stats.staff.supervisorValue'), label: t('home.stats.staff.supervisorLabel'), icon: '/nav-icons/pharmacies.png', tone: 'blue' },
    ],
    [t],
  );

  const newsItems = useMemo(
    () => [
      { tag: t('home.news.items.0.tag'), date: t('home.news.items.0.date'), title: t('home.news.items.0.title'), desc: t('home.news.items.0.desc') },
      { tag: t('home.news.items.1.tag'), date: t('home.news.items.1.date'), title: t('home.news.items.1.title'), desc: t('home.news.items.1.desc') },
      { tag: t('home.news.items.2.tag'), date: t('home.news.items.2.date'), title: t('home.news.items.2.title'), desc: t('home.news.items.2.desc') },
    ],
    [t],
  );

  return (
    <div className="space-y-16">
      {/* Hero — soft “adorable” motion: blobs, pop-in, gentle float (honors prefers-reduced-motion via Tailwind motion-safe) */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-8 right-[8%] h-44 w-44 rounded-full bg-emerald-300/30 blur-3xl motion-safe:animate-kgc-blob" />
          <div
            className="absolute bottom-0 left-[4%] h-56 w-56 rounded-full bg-teal-200/35 blur-3xl motion-safe:animate-kgc-blob"
            style={{ animationDelay: '-9s' }}
          />
          <div
            className="absolute top-1/3 left-1/4 h-24 w-24 rounded-full bg-lime-200/25 blur-2xl motion-safe:animate-kgc-blob"
            style={{ animationDelay: '-4s' }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1 text-center lg:text-start">
              <div className="mb-4 motion-safe:animate-kgc-pop">
                <div className="inline-block rounded-full bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-2 shadow-sm motion-safe:animate-kgc-heart-soft">
                  <span className="font-semibold text-green-700">{t('home.hero.badge')}</span>
                </div>
              </div>
              <h1
                className="mb-6 text-4xl font-bold leading-tight motion-safe:animate-kgc-pop lg:text-6xl"
                style={{ animationDelay: '90ms' }}
              >
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {t('home.hero.titleStart')}
                </span>
                <br />
                <span className="text-gray-800">{t('home.hero.titleEnd')}</span>
              </h1>
              <p
                className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-gray-600 motion-safe:animate-kgc-pop lg:mx-0"
                style={{ animationDelay: '160ms' }}
              >
                {t('home.hero.description')}
              </p>

              <div
                className="flex flex-wrap justify-center gap-4 motion-safe:animate-kgc-pop lg:justify-start"
                style={{ animationDelay: '230ms' }}
              >
                <Link
                  to={servicesPath('/live')}
                  className="group inline-flex h-12 items-center gap-2 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-8 text-lg text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl motion-safe:hover:scale-[1.03] active:scale-[0.98]"
                >
                  <img
                    src="/nav-icons/live-red.png"
                    alt=""
                    aria-hidden="true"
                    className="h-[18px] w-[18px] motion-safe:group-hover:animate-kgc-wiggle"
                    draggable="false"
                  />
                  <span className="font-bold">{t('common.watchLive')}</span>
                </Link>
                <Link
                  to={servicesPath('/service')}
                  className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-green-600 px-8 text-lg text-green-700 transition-all duration-300 hover:bg-green-50 hover:shadow-md motion-safe:hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="font-bold">{t('home.hero.discoverServices')}</span>
                </Link>
              </div>
            </div>

            <div className="w-full flex-1 motion-safe:animate-kgc-pop" style={{ animationDelay: '120ms' }}>
              <div className="relative">
                <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 opacity-20" />
                <div className="relative rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-emerald-100/50 motion-safe:animate-kgc-float-soft">
                  <img
                    className="h-96 w-full rounded-2xl object-cover"
                    alt={t('home.hero.imageAlt')}
                    src="/home/hero.jpg"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad placeholder */}
      <section className="container mx-auto px-4">
        <div className="w-full my-8 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{t('home.ad.label')}</span>
          <div className="w-full max-w-[728px] h-[90px] bg-gray-100 border border-gray-200 border-dashed rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-gray-400 text-sm font-medium">{t('home.ad.placeholderTitle')}</p>
              <p className="text-gray-300 text-xs mt-1">{t('home.ad.placeholderSubtitle')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats counter (UI-only mock) */}
      <section className="py-12 bg-white" dir={dir}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {mainStats.map((s, i) => (
              <StatCard key={s.label} value={s.value} label={s.label} tone={s.tone} enterDelay={i * 95} />
            ))}
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-white/5" aria-hidden="true">
                  <img src="/nav-icons/hospitals.png" alt="" aria-hidden="true" className="w-4 h-4" draggable="false" />
                </span>
                {t('home.stats.staffTitle')}
              </h3>
              <span className="text-gray-400 text-sm">{t('home.stats.staffSubtitle')}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {staffStats.map((s, i) => (
                <StaffPill key={s.label} value={s.value} label={s.label} icon={s.icon} tone={s.tone} enterDelay={i * 55} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Health in Drama (UI-only) */}
      <section className="py-16 bg-slate-900 text-white overflow-hidden relative" dir={dir}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className={`lg:w-1/3 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
                <span className="font-bold text-sm">{t('home.drama.badge')}</span>
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                {t('home.drama.titleStart')} <span className="text-red-500">{t('home.drama.titleEmphasis')}</span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">{t('home.drama.description')}</p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="inline-flex w-7 h-7 items-center justify-center rounded-md bg-white/5" aria-hidden="true">
                    <img src="/nav-icons/library.png" alt="" aria-hidden="true" className="w-4 h-4" draggable="false" />
                  </span>
                  <span className="text-sm text-gray-300">{t('home.drama.point1')}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="inline-flex w-7 h-7 items-center justify-center rounded-md bg-white/5" aria-hidden="true">
                    <img src="/nav-icons/services.png" alt="" aria-hidden="true" className="w-4 h-4" draggable="false" />
                  </span>
                  <span className="text-sm text-gray-300">{t('home.drama.point2')}</span>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 w-full">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/SbDeMQ26RM8"
                  title={t('home.drama.videoTitle')}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-center text-gray-500 text-sm mt-4 font-medium">{t('home.drama.caption')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Health News (static cards) */}
      <section className="container mx-auto px-4">
        <div className="py-12 bg-white rounded-2xl shadow-sm border border-slate-100 px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4" dir={dir}>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <img src="/nav-icons/news.png" alt="" aria-hidden="true" className="w-8 h-8" draggable="false" />
                {t('home.news.title')}
              </h2>
              <p className="text-gray-600 text-lg">{t('home.news.subtitle')}</p>
            </div>
            <Link
              to={servicesPath('/news')}
              className="inline-flex items-center gap-2 rounded-md border border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 h-10 font-semibold"
            >
              {t('common.readMore')}
              <span aria-hidden="true">{isRtl ? '←' : '→'}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir={dir}>
            {newsItems.map((n, i) => (
              <NewsCard key={n.title} tag={n.tag} date={n.date} title={n.title} desc={n.desc} cta={t('common.readMore')} enterDelay={i * 110} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform sections */}
      <section className="container mx-auto px-4">
        <SectionTitle title={t('home.platform.title')} subtitle={t('home.platform.subtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <Link
              key={c.href}
              to={c.href}
              className="motion-safe:animate-kgc-pop block h-full"
              style={{ animationDelay: `${i * 48}ms` }}
            >
              <div className="group h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <img src={c.icon} alt="" aria-hidden="true" className="w-7 h-7" draggable="false" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{c.title}</h3>
                <p className="text-slate-600 leading-7">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad placeholder (slot 2) */}
      <section className="container mx-auto px-4">
        <div className="w-full my-8 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{t('home.ad.label')}</span>
          <div className="w-full max-w-[728px] h-[90px] bg-gray-100 border border-gray-200 border-dashed rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-gray-400 text-sm font-medium">{t('home.ad.placeholderTitle')}</p>
              <p className="text-gray-300 text-xs mt-1">{t('home.ad.placeholderSubtitle')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


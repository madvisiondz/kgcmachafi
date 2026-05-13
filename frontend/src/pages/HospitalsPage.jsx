import React, { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useBootstrapList } from '../hooks/useBootstrapList';
import ListGridSkeleton from '../components/ListGridSkeleton';
import ListFetchErrorBanner from '../components/ListFetchErrorBanner';
import { getCommunes, wilayas } from '../data/algeria-data';
import { hospitalsAlgeriaMock, hospitalsInternationalMock } from '../data/hospitals';
import { loadHospitalDatasets } from '../services';

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
  hospital: (props) => (
    <Icon {...props}>
      <path d="M12 6v4" />
      <path d="M10 8h4" />
      <path d="M3 20V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13" />
      <path d="M7 20v-5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5" />
    </Icon>
  ),
  globe: (props) => (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </Icon>
  ),
  search: (props) => (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </Icon>
  ),
  phone: (props) => (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z" />
    </Icon>
  ),
  nav: (props) => (
    <Icon {...props}>
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </Icon>
  ),
  shield: (props) => (
    <Icon {...props}>
      <path d="M12 2 20 6v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Z" />
      <path d="m9 12 2 2 4-5" />
    </Icon>
  ),
  star: (props) => (
    <Icon {...props}>
      <path d="M12 2l3.1 6.4L22 9.3l-5 4.8 1.2 6.9L12 18.7 5.8 21l1.2-6.9-5-4.8 6.9-.9L12 2Z" />
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

function buildGoogleMapsDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

const LOCAL_TYPES = ['all', 'public', 'private', 'clinic', 'specialized'];
const ABROAD_COUNTRIES = ['all', 'turkey', 'tunisia', 'france', 'germany', 'jordan', 'egypt'];
const ABROAD_SPECIALTIES = ['all', 'oncology', 'cardiology', 'neurology', 'transplants', 'fertility', 'orthopedics'];

export default function HospitalsPage() {
  const { t, dir } = useI18n();
  const isRTL = dir === 'rtl';

  const { status, data, error, reload } = useBootstrapList(loadHospitalDatasets);
  const localSource = data?.local ?? hospitalsAlgeriaMock;
  const abroadSource = data?.abroad ?? hospitalsInternationalMock;
  const showSkeleton = status === 'loading';

  const [tab, setTab] = useState('algeria'); // algeria|abroad

  // Algeria filters
  const [wilaya, setWilaya] = useState('');
  const [communeId, setCommuneId] = useState('');
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Abroad filters
  const [country, setCountry] = useState('all');
  const [specialty, setSpecialty] = useState('all');
  const [queryAbroad, setQueryAbroad] = useState('');
  const [verifiedOnlyAbroad, setVerifiedOnlyAbroad] = useState(false);

  const communeOptions = useMemo(() => {
    if (!wilaya) return [];
    return getCommunes(wilaya)
      .map((c) => ({ id: c.id, label: isRTL ? c.ar_name : c.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [isRTL, wilaya]);

  const filteredLocal = useMemo(() => {
    const q = normalize(query);
    return localSource.filter((h) => {
      if (!h.isActive) return false;
      if (wilaya && h.wilayaCode !== wilaya) return false;
      if (communeId && h.communeId !== communeId) return false;
      if (type !== 'all' && h.type !== type) return false;
      if (verifiedOnly && !h.isVerified) return false;
      if (!q) return true;
      const hay = normalize([h.name, h.phone ?? '', h.address ?? '', h.wilayaCode].join(' '));
      return hay.includes(q);
    });
  }, [communeId, localSource, query, type, verifiedOnly, wilaya]);

  const filteredAbroad = useMemo(() => {
    const q = normalize(queryAbroad);
    return abroadSource.filter((h) => {
      if (!h.isActive) return false;
      if (country !== 'all' && h.countryKey !== country) return false;
      if (specialty !== 'all' && h.specialtyKey !== specialty) return false;
      if (verifiedOnlyAbroad && !h.isVerified) return false;
      if (!q) return true;
      const hay = normalize([h.name, h.city ?? '', h.phone ?? '', h.countryKey, h.specialtyKey].join(' '));
      return hay.includes(q);
    });
  }, [abroadSource, country, queryAbroad, specialty, verifiedOnlyAbroad]);

  const stats = useMemo(() => {
    const list = tab === 'algeria' ? filteredLocal : filteredAbroad;
    const total = list.length;
    const verified = list.filter((x) => x.isVerified).length;
    return { total, verified };
  }, [filteredAbroad, filteredLocal, tab]);

  return (
    <div className="space-y-12" dir={dir}>
      <section className="border-y border-slate-200 bg-gradient-to-b from-slate-50/70 via-white to-white py-14">
        <div className="container mx-auto px-4">
          {status === 'error' ? (
            <div className="mb-6">
              <ListFetchErrorBanner message={error?.message} onRetry={reload} />
            </div>
          ) : null}
          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700">
              {Icons.hospital({ className: 'h-4 w-4' })}
              {t('hospitals.badge')}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
                    {Icons.hospital({ className: 'h-6 w-6' })}
                  </span>
                  {t('hospitals.title')}
                </h1>
                <p className="mt-3 text-slate-600 text-lg">{t('hospitals.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatPill label={t('hospitals.stats.total')} value={String(stats.total)} tone="slate" />
                <StatPill label={t('hospitals.stats.verified')} value={String(stats.verified)} tone="emerald" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab('algeria')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold transition ${
                tab === 'algeria' ? 'border-slate-200 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {Icons.hospital({ className: 'h-4 w-4' })}
              {t('hospitals.tabs.algeria')}
            </button>
            <button
              type="button"
              onClick={() => setTab('abroad')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold transition ${
                tab === 'abroad' ? 'border-slate-200 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {Icons.globe({ className: 'h-4 w-4' })}
              {t('hospitals.tabs.abroad')}
            </button>
          </div>

          {/* Filters */}
          {tab === 'algeria' ? (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] lg:items-end">
                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="hospitals-search">
                    {t('hospitals.searchLabel')}
                  </label>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {Icons.search({ className: 'h-5 w-5' })}
                    </span>
                    <input
                      id="hospitals-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('hospitals.searchPlaceholder')}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/25"
                    />
                    {query.trim() ? (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label={t('hospitals.clearSearch')}
                        title={t('hospitals.clearSearch')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        {Icons.x({ className: 'h-4 w-4' })}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="hospitals-wilaya">
                    {t('hospitals.selectWilaya')}
                  </label>
                  <select
                    id="hospitals-wilaya"
                    value={wilaya}
                    onChange={(e) => {
                      setWilaya(e.target.value);
                      setCommuneId('');
                    }}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">{t('hospitals.anyWilaya')}</option>
                    {wilayas.map((w) => (
                      <option key={w.id} value={w.id}>
                        {isRTL ? `${w.id} - ${w.ar_name}` : `${w.id} - ${w.name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="hospitals-commune">
                    {t('hospitals.selectCity')}
                  </label>
                  <select
                    id="hospitals-commune"
                    value={communeId}
                    onChange={(e) => setCommuneId(e.target.value)}
                    disabled={!wilaya}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">{wilaya ? t('hospitals.anyCity') : t('hospitals.chooseWilayaFirst')}</option>
                    {communeOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="hospitals-type">
                    {t('hospitals.typeLabel')}
                  </label>
                  <select
                    id="hospitals-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-slate-500"
                  >
                    {LOCAL_TYPES.map((k) => (
                      <option key={k} value={k}>
                        {k === 'all' ? t('hospitals.types.all') : t(`hospitals.types.${k}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifiedOnly((v) => !v)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                      verifiedOnly ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {Icons.shield({ className: 'h-4 w-4' })}
                    {t('hospitals.verifiedOnly')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:items-end">
                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="hospitals-abroad-search">
                    {t('hospitals.searchLabel')}
                  </label>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {Icons.search({ className: 'h-5 w-5' })}
                    </span>
                    <input
                      id="hospitals-abroad-search"
                      type="search"
                      value={queryAbroad}
                      onChange={(e) => setQueryAbroad(e.target.value)}
                      placeholder={t('hospitals.searchPlaceholderAbroad')}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/25"
                    />
                    {queryAbroad.trim() ? (
                      <button
                        type="button"
                        onClick={() => setQueryAbroad('')}
                        aria-label={t('hospitals.clearSearch')}
                        title={t('hospitals.clearSearch')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        {Icons.x({ className: 'h-4 w-4' })}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="hospitals-country">
                    {t('hospitals.countryLabel')}
                  </label>
                  <select
                    id="hospitals-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-slate-500"
                  >
                    {ABROAD_COUNTRIES.map((k) => (
                      <option key={k} value={k}>
                        {k === 'all' ? t('hospitals.countries.all') : t(`hospitals.countries.${k}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="hospitals-specialty">
                    {t('hospitals.specialtyLabel')}
                  </label>
                  <select
                    id="hospitals-specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-slate-500"
                  >
                    {ABROAD_SPECIALTIES.map((k) => (
                      <option key={k} value={k}>
                        {k === 'all' ? t('hospitals.specialties.all') : t(`hospitals.specialties.${k}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifiedOnlyAbroad((v) => !v)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                      verifiedOnlyAbroad ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {Icons.shield({ className: 'h-4 w-4' })}
                    {t('hospitals.verifiedOnly')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {showSkeleton ? (
              <div className="md:col-span-2 xl:col-span-3 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-extrabold text-slate-700">{t('common.listLoadingTitle')}</p>
                  <p className="text-xs text-slate-500 mt-2">{t('common.listLoadingHint')}</p>
                  <div className="mt-6 h-32 rounded-2xl bg-slate-100 animate-pulse" />
                </div>
                <ListGridSkeleton columnsClass="md:grid-cols-2 xl:grid-cols-3" count={6} />
              </div>
            ) : tab === 'algeria' ? (
              filteredLocal.length === 0 ? (
                <EmptyState title={t('hospitals.emptyTitle')} desc={t('hospitals.emptyDesc')} />
              ) : (
                filteredLocal.map((h) => <HospitalCard key={h.id} item={h} t={t} tone="local" />)
              )
            ) : filteredAbroad.length === 0 ? (
              <EmptyState title={t('hospitals.emptyTitle')} desc={t('hospitals.emptyDescAbroad')} />
            ) : (
              filteredAbroad.map((h) => <HospitalCard key={h.id} item={h} t={t} tone="abroad" />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatPill({ label, value, tone }) {
  const toneClass =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : 'border-slate-200 bg-white text-slate-900';

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="text-xl font-black leading-none">{value}</div>
      <div className="mt-1 text-[12px] font-bold opacity-80">{label}</div>
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center md:col-span-2 xl:col-span-3">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-500">
        {Icons.hospital({ className: 'h-7 w-7' })}
      </div>
      <h3 className="text-lg font-extrabold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function HospitalCard({ item, t, tone }) {
  const isAbroad = tone === 'abroad';

  const title = item.name;
  const rating = typeof item.rating === 'number' ? item.rating.toFixed(1) : null;
  const reviews = item.reviewsCount ?? null;
  const phone = item.phone ?? null;

  const hasCoords = Number.isFinite(item.latitude) && Number.isFinite(item.longitude);
  const directionsUrl = hasCoords ? buildGoogleMapsDirectionsUrl(item.latitude, item.longitude) : null;

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div
        className={`relative p-5 ${
          isAbroad ? 'bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold text-white">
              {isAbroad ? Icons.globe({ className: 'h-4 w-4' }) : Icons.hospital({ className: 'h-4 w-4' })}
              {isAbroad ? t(`hospitals.countries.${item.countryKey}`) : t(`hospitals.types.${item.type}`)}
            </div>
            <h3 className="mt-4 text-xl font-black leading-tight">{title}</h3>
          </div>

          <div className="flex flex-col items-end gap-2">
            {item.isVerified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-50">
                {Icons.shield({ className: 'h-4 w-4' })}
                {t('hospitals.verified')}
              </span>
            ) : null}
            {rating ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold text-white">
                {Icons.star({ className: 'h-4 w-4' })}
                <span>{rating}</span>
                {reviews != null ? <span className="opacity-80">({reviews})</span> : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="text-sm text-slate-700">
          {isAbroad ? (
            <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">{t(`hospitals.specialties.${item.specialtyKey}`)}</span>
              {item.city ? <span className="rounded-full bg-slate-100 px-3 py-1">{item.city}</span> : null}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600">
              {(item.specialtyTags || []).slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">
                  {t(`hospitals.tags.${tag}`)}
                </span>
              ))}
              {(item.specialtyTags || []).length > 3 ? (
                <span className="rounded-full bg-slate-100 px-3 py-1">+{(item.specialtyTags || []).length - 3}</span>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="text-xs font-bold text-slate-500">
            {t('hospitals.hoursLabel').replace('{hours}', item.hoursLabel || t('hospitals.hoursUnknown'))}
          </div>
          {phone ? (
            <a className="text-xs font-extrabold text-slate-800 hover:underline" href={`tel:${phone}`} dir="ltr">
              {phone}
            </a>
          ) : (
            <span className="text-xs font-bold text-slate-400">{t('hospitals.noPhone')}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(item.features || []).includes('emergency') ? <Chip tone="rose" label={t('hospitals.chips.emergency')} /> : null}
            {(item.features || []).includes('icu') ? <Chip tone="emerald" label={t('hospitals.chips.icu')} /> : null}
            {(item.features || []).includes('online_consult') ? <Chip tone="teal" label={t('hospitals.chips.onlineConsult')} /> : null}
            {(item.features || []).includes('card_payment') ? <Chip tone="amber" label={t('hospitals.chips.cardPayment')} /> : null}
          </div>

          <div className="flex gap-2">
            {phone ? (
              <a className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-xs font-extrabold text-white hover:bg-slate-800" href={`tel:${phone}`}>
                {Icons.phone({ className: 'h-4 w-4' })}
                {t('hospitals.call')}
              </a>
            ) : null}
            {directionsUrl ? (
              <a
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {Icons.nav({ className: 'h-4 w-4' })}
                {t('hospitals.directions')}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, tone }) {
  const cls =
    tone === 'rose'
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : tone === 'emerald'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : tone === 'teal'
          ? 'border-teal-200 bg-teal-50 text-teal-800'
          : 'border-amber-200 bg-amber-50 text-amber-800';

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${cls}`}>{label}</span>;
}


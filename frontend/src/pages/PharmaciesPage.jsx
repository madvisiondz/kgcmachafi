import React, { useCallback, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useI18n } from '../i18n/I18nProvider';
import { useBootstrapList } from '../hooks/useBootstrapList';
import ListGridSkeleton from '../components/ListGridSkeleton';
import ListFetchErrorBanner from '../components/ListFetchErrorBanner';
import { getWeekStartIso, nightShiftScheduleMock, pharmaciesDirectoryMock } from '../data/pharmacies';
import { loadPharmaciesForList } from '../services';
import { getCommunes, wilayas } from '../data/algeria-data';

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
  mapPin: (props) => (
    <Icon {...props}>
      <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  ),
  search: (props) => (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </Icon>
  ),
  moon: (props) => (
    <Icon {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
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

const ALGERIA_CENTER = [28.2167, 2.2167];
const ALGERIA_BOUNDS = [
  [18.0, -8.7],
  [37.3, 12.2],
];

export default function PharmaciesPage() {
  const { t, dir, language } = useI18n();
  const isRTL = dir === 'rtl';

  const loadDirectory = useCallback(() => loadPharmaciesForList(), []);

  const { status, data, error, reload } = useBootstrapList(loadDirectory);
  const directory = data ?? pharmaciesDirectoryMock;
  const showSkeleton = status === 'loading';

  const [wilaya, setWilaya] = useState('');
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');
  const [nightOnly, setNightOnly] = useState(false);

  const weekStart = useMemo(() => getWeekStartIso(new Date()), []);
  const nightDutySet = useMemo(() => {
    const fromApi = directory.filter((p) => p.isNightDuty).map((p) => p.id);
    if (fromApi.length > 0) return new Set(fromApi);
    const nightDutyIds = nightShiftScheduleMock[weekStart]?.nightDutyIds ?? [];
    return new Set(nightDutyIds);
  }, [directory, weekStart]);

  const wilayaOptions = useMemo(() => {
    return wilayas
      .map((w) => ({
        wilayaCode: w.id,
        label: isRTL ? `${w.id} - ${w.ar_name}` : `${w.id} - ${w.name}`,
      }))
      .sort((a, b) => a.wilayaCode.localeCompare(b.wilayaCode));
  }, [isRTL]);

  const cityOptions = useMemo(() => {
    if (!wilaya) return [];
    const communes = getCommunes(wilaya);
    return communes.map((c) => (isRTL ? c.ar_name : c.name)).sort((a, b) => a.localeCompare(b));
  }, [isRTL, wilaya]);

  const filtered = useMemo(() => {
    const q = normalize(query);

    return directory.filter((p) => {
      const matchesWilaya = !wilaya || p.wilayaCode === wilaya;
      const displayCity = isRTL ? p.cityAr : p.cityFr;
      const matchesCity = !city || displayCity === city;
      const matchesNight = !nightOnly || nightDutySet.has(p.id);

      if (!matchesWilaya || !matchesCity || !matchesNight) return false;
      if (!q) return true;

      const parts = [
        p.name,
        p.wilayaCode,
        p.wilayaNameAr,
        p.wilayaNameFr,
        p.cityAr,
        p.cityFr,
        p.addressAr ?? '',
        p.addressFr ?? '',
        p.phone ?? '',
      ];
      return normalize(parts.join(' ')).includes(q);
    });
  }, [city, directory, isRTL, nightDutySet, nightOnly, query, wilaya]);

  const nightDutyList = useMemo(() => {
    const list = directory.filter((p) => nightDutySet.has(p.id));
    // Prefer showing the closest relevance: selected wilaya/city first.
    return list.sort((a, b) => {
      const score = (p) => {
        let s = 0;
        if (wilaya && p.wilayaCode === wilaya) s += 2;
        const displayCity = isRTL ? p.cityAr : p.cityFr;
        if (city && displayCity === city) s += 1;
        return -s; // higher score first
      };
      return score(a) - score(b);
    });
  }, [city, directory, isRTL, nightDutySet, wilaya]);

  const mappable = useMemo(() => {
    return filtered
      .map((p) => ({
        ...p,
        lat: Number(p.latitude),
        lng: Number(p.longitude),
      }))
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  }, [filtered]);

  const title = t('pharmacies.title');
  const subtitle = t('pharmacies.subtitle');

  return (
    <div className="space-y-12" dir={dir}>
      <section className="border-y border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white py-14">
        <div className="container mx-auto px-4">
          {status === 'error' ? (
            <div className="mb-6">
              <ListFetchErrorBanner message={error?.message} onRetry={reload} />
            </div>
          ) : null}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Sticky filters */}
            <aside className="w-full lg:w-[360px] lg:sticky lg:top-24">
              <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                    {Icons.mapPin({ className: 'h-6 w-6' })}
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
                    <p className="text-sm text-emerald-700">{subtitle}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700" htmlFor="pharmacies-search">
                      {t('pharmacies.searchLabel')}
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {Icons.search({ className: 'h-5 w-5' })}
                      </span>
                      <input
                        id="pharmacies-search"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('pharmacies.searchPlaceholder')}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                      />
                      {query.trim() ? (
                        <button
                          type="button"
                          onClick={() => setQuery('')}
                          aria-label={t('pharmacies.clearSearch')}
                          title={t('pharmacies.clearSearch')}
                          className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        >
                          {Icons.x({ className: 'h-4 w-4' })}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Wilaya */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700" htmlFor="pharmacies-wilaya">
                      {t('pharmacies.selectWilaya')}
                    </label>
                    <select
                      id="pharmacies-wilaya"
                      value={wilaya}
                      onChange={(e) => {
                        setWilaya(e.target.value);
                        setCity('');
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{t('pharmacies.anyWilaya')}</option>
                      {wilayaOptions.map((w) => (
                        <option key={w.wilayaCode} value={w.wilayaCode}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700" htmlFor="pharmacies-city">
                      {t('pharmacies.selectCity')}
                    </label>
                    <select
                      id="pharmacies-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!wilaya}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">{wilaya ? t('pharmacies.anyCity') : t('pharmacies.chooseWilayaFirst')}</option>
                      {cityOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Night duty toggle */}
                  <button
                    type="button"
                    onClick={() => setNightOnly((v) => !v)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-3 transition ${
                      nightOnly ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl ${
                          nightOnly ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {Icons.moon({ className: 'h-4 w-4' })}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{t('pharmacies.nightOnly')}</span>
                    </span>
                    <span
                      className={`relative h-5 w-10 rounded-full transition-colors ${
                        nightOnly ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                      aria-hidden="true"
                    >
                      <span
                        className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${
                          nightOnly ? (isRTL ? 'left-1' : 'right-1') : isRTL ? 'right-1' : 'left-1'
                        }`}
                      />
                    </span>
                  </button>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-950">
                    <p className="font-extrabold">{t('pharmacies.resultsCount').replace('{count}', String(filtered.length))}</p>
                    <p className="mt-1 text-emerald-800">{t('pharmacies.valueHint')}</p>
                    <p className="mt-2 text-[12px] text-emerald-700">
                      {t('pharmacies.weekLabel').replace('{week}', weekStart)}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="w-full lg:flex-1 space-y-6">
              {showSkeleton ? (
                <>
                  <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <p className="text-sm font-extrabold text-slate-700">{t('common.listLoadingTitle')}</p>
                    <p className="text-xs text-slate-500 mt-2">{t('common.listLoadingHint')}</p>
                    <div className="mt-6 h-40 rounded-2xl bg-slate-100 animate-pulse" />
                  </div>
                  <ListGridSkeleton columnsClass="md:grid-cols-2" count={4} />
                </>
              ) : (
                <>
              {/* Night shift highlight */}
              <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b bg-indigo-50/70 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
                      {Icons.moon({ className: 'h-4 w-4' })}
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">{t('pharmacies.nightShiftTitle')}</h2>
                      <p className="text-xs text-indigo-700">{t('pharmacies.nightShiftSubtitle')}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                    {t('pharmacies.nightShiftCount').replace('{count}', String(nightDutyList.length))}
                  </span>
                </div>

                <div className="p-5 grid gap-4 md:grid-cols-2">
                  {nightDutyList.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 md:col-span-2">
                      {t('pharmacies.nightShiftEmpty')}
                    </div>
                  ) : (
                    nightDutyList.map((p) => (
                      <PharmacyCard
                        key={p.id}
                        pharmacy={p}
                        isNight
                        t={t}
                        isRTL={isRTL}
                        language={language}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* All results */}
              <div className="grid gap-4">
                {filtered.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center">
                    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-500">
                      {Icons.search({ className: 'h-7 w-7' })}
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-700">{t('pharmacies.emptyTitle')}</h3>
                    <p className="mt-2 text-sm text-slate-500">{t('pharmacies.emptyDesc')}</p>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <PharmacyCard
                      key={p.id}
                      pharmacy={p}
                      isNight={nightDutySet.has(p.id)}
                      t={t}
                      isRTL={isRTL}
                      language={language}
                    />
                  ))
                )}
              </div>

              {/* Map (bottom, filtered results only) */}
              <div className="mt-10 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b bg-emerald-50/70 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
                      {Icons.mapPin({ className: 'h-4 w-4' })}
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">{t('pharmacies.mapTitle')}</h2>
                      <p className="text-xs text-emerald-700">{t('pharmacies.mapSubtitle')}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                    {t('pharmacies.mapCount').replace('{count}', String(mappable.length))}
                  </span>
                </div>

                <div className="h-[420px] w-full">
                  <MapContainer
                    center={ALGERIA_CENTER}
                    zoom={6}
                    minZoom={5}
                    maxBounds={ALGERIA_BOUNDS}
                    maxBoundsViscosity={1}
                    scrollWheelZoom
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {mappable.map((p) => (
                      <CircleMarker
                        key={p.id}
                        center={[p.lat, p.lng]}
                        radius={10}
                        pathOptions={{
                          color: nightDutySet.has(p.id) ? '#4338ca' : '#047857',
                          fillColor: nightDutySet.has(p.id) ? '#6366f1' : '#10b981',
                          fillOpacity: 0.85,
                          weight: 2,
                        }}
                      >
                        <Popup>
                          <div className="space-y-2" dir={dir}>
                            <div className="font-extrabold text-slate-900">{p.name}</div>
                            <div className="text-xs text-slate-600" dir="ltr">
                              {p.phone || t('pharmacies.noPhone')}
                            </div>
                            <div className="flex gap-2 pt-1">
                              {p.phone ? (
                                <a
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white"
                                  href={`tel:${p.phone}`}
                                >
                                  {Icons.phone({ className: 'h-4 w-4' })}
                                  {t('pharmacies.call')}
                                </a>
                              ) : null}
                              <a
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700"
                                href={buildGoogleMapsDirectionsUrl(p.lat, p.lng)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {Icons.nav({ className: 'h-4 w-4' })}
                                {t('pharmacies.directions')}
                              </a>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PharmacyCard({ pharmacy, isNight, t, isRTL }) {
  const city = isRTL ? pharmacy.cityAr : pharmacy.cityFr;
  const wilayaName = isRTL ? pharmacy.wilayaNameAr : pharmacy.wilayaNameFr;
  const address = isRTL ? pharmacy.addressAr : pharmacy.addressFr;

  return (
    <div
      className={`group flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center ${
        isNight ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-100'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`grid h-14 w-14 place-items-center rounded-2xl transition-colors ${
            isNight ? 'bg-indigo-600 text-white' : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
          }`}
        >
          <span className="text-xl font-black" aria-hidden="true">
            💊
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 truncate">{pharmacy.name}</h3>
            {isNight ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-extrabold text-indigo-700">
                {Icons.moon({ className: 'h-3 w-3' })}
                {t('pharmacies.nightBadge')}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600">
                {t('pharmacies.dayBadge')}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
            {Icons.mapPin({ className: 'h-4 w-4 text-slate-400' })}
            <span className="truncate">
              {wilayaName} — {city}
              {address ? ` • ${address}` : ''}
            </span>
          </p>

          <p className="mt-1 text-sm text-slate-600 flex items-center gap-1" dir="ltr">
            {Icons.phone({ className: 'h-4 w-4 text-slate-400' })}
            <span className="truncate">{pharmacy.phone || t('pharmacies.noPhone')}</span>
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {t('pharmacies.dataSplitHint').replace('{static}', '80%').replace('{dynamic}', '20%')}
          </p>
        </div>
      </div>

      <div className="mt-2 flex w-full gap-2 sm:mt-0 sm:w-auto sm:ms-auto">
        {pharmacy.latitude != null && pharmacy.longitude != null ? (
          <a
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            href={buildGoogleMapsDirectionsUrl(pharmacy.latitude, pharmacy.longitude)}
            target="_blank"
            rel="noreferrer"
            aria-label={t('pharmacies.directions')}
            title={t('pharmacies.directions')}
          >
            {Icons.nav({ className: 'h-4 w-4' })}
            <span className="ms-2">{t('pharmacies.directions')}</span>
          </a>
        ) : null}

        {pharmacy.phone ? (
          <a
            className={`inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-extrabold text-white shadow-md ${
              isNight ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
            }`}
            href={`tel:${pharmacy.phone}`}
            aria-label={t('pharmacies.call')}
          >
            {Icons.phone({ className: 'h-4 w-4' })}
            <span className="ms-2">{t('pharmacies.call')}</span>
          </a>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-400">
            {t('pharmacies.noPhone')}
          </div>
        )}
      </div>
    </div>
  );
}


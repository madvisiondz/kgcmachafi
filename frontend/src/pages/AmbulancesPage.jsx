import React, { useCallback, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useI18n } from '../i18n/I18nProvider';
import { useBootstrapList } from '../hooks/useBootstrapList';
import ListGridSkeleton from '../components/ListGridSkeleton';
import ListFetchErrorBanner from '../components/ListFetchErrorBanner';
import { getCommunes, wilayas } from '../data/algeria-data';
import { ambulanceListingsMock } from '../data/ambulances';
import { loadAmbulancesForList } from '../services';

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
  ambulance: (props) => (
    <Icon {...props}>
      <path d="M10 17h4" />
      <path d="M3 17h2a2 2 0 0 0 4 0h6a2 2 0 0 0 4 0h1" />
      <path d="M3 10h11V6a2 2 0 0 0-2-2H3v13" />
      <path d="M14 10h3l4 4v3h-7v-7Z" />
      <path d="M7.5 6.5v3" />
      <path d="M6 8h3" />
    </Icon>
  ),
  phone: (props) => (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z" />
    </Icon>
  ),
  pin: (props) => (
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
  alert: (props) => (
    <Icon {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
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

const ALGERIA_CENTER = [28.2167, 2.2167];
const ALGERIA_BOUNDS = [
  [18.0, -8.7],
  [37.3, 12.2],
];

function buildGoogleMapsDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

const VEHICLE_TYPES = ['all', 'standard', 'icu', 'medical-transport'];

export default function AmbulancesPage() {
  const { t, dir } = useI18n();
  const isRTL = dir === 'rtl';

  const loadListings = useCallback(() => loadAmbulancesForList(), []);
  const { status, data, error, reload } = useBootstrapList(loadListings);
  const listings = data ?? ambulanceListingsMock;
  const showSkeleton = status === 'loading';

  const [wilaya, setWilaya] = useState('');
  const [communeId, setCommuneId] = useState('');
  const [query, setQuery] = useState('');
  const [vehicleType, setVehicleType] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);

  const communeOptions = useMemo(() => {
    if (!wilaya) return [];
    return getCommunes(wilaya)
      .map((c) => ({ id: c.id, label: isRTL ? c.ar_name : c.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [isRTL, wilaya]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return listings.filter((a) => {
      if (!a.isActive) return false;
      if (wilaya && a.wilayaCode !== wilaya) return false;
      if (communeId && a.communeId !== communeId) return false;
      if (freeOnly && !a.isFree) return false;
      if (vehicleType !== 'all' && a.vehicleType !== vehicleType) return false;
      if (!q) return true;
      const hay = normalize([a.ownerName, a.phone, a.wilayaCode].join(' '));
      return hay.includes(q);
    });
  }, [communeId, freeOnly, listings, query, vehicleType, wilaya]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const free = filtered.filter((a) => a.isFree).length;
    const icu = filtered.filter((a) => a.vehicleType === 'icu').length;
    return { total, free, icu };
  }, [filtered]);

  const mappable = useMemo(() => {
    return filtered
      .map((a) => ({
        ...a,
        lat: Number(a.latitude),
        lng: Number(a.longitude),
      }))
      .filter((a) => Number.isFinite(a.lat) && Number.isFinite(a.lng));
  }, [filtered]);

  return (
    <div className="space-y-12" dir={dir}>
      <section className="border-y border-red-100 bg-gradient-to-b from-red-50/70 via-white to-white py-14">
        <div className="container mx-auto px-4">
          {status === 'error' ? (
            <div className="mb-6">
              <ListFetchErrorBanner message={error?.message} onRetry={reload} />
            </div>
          ) : null}
          {/* Hero (different from Pharmacies: emergency-first tone) */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-extrabold text-red-700">
              {Icons.alert({ className: 'h-4 w-4' })}
              {t('ambulances.emergencyBadge')}
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-600 text-white">
                    {Icons.ambulance({ className: 'h-6 w-6' })}
                  </span>
                  {t('ambulances.title')}
                </h1>
                <p className="mt-3 text-slate-600 text-lg">{t('ambulances.subtitle')}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatPill label={t('ambulances.stats.total')} value={String(stats.total)} tone="slate" />
                <StatPill label={t('ambulances.stats.free')} value={String(stats.free)} tone="emerald" />
                <StatPill label={t('ambulances.stats.icu')} value={String(stats.icu)} tone="red" />
              </div>
            </div>
          </div>

          {/* Filter bar (variation: top bar + chips, not sticky left panel) */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-end">
              <div className="lg:col-span-1">
                <label className="text-sm font-bold text-slate-700" htmlFor="ambulances-search">
                  {t('ambulances.searchLabel')}
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {Icons.search({ className: 'h-5 w-5' })}
                  </span>
                  <input
                    id="ambulances-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('ambulances.searchPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25"
                  />
                  {query.trim() ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label={t('ambulances.clearSearch')}
                      title={t('ambulances.clearSearch')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      {Icons.x({ className: 'h-4 w-4' })}
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="ambulances-wilaya">
                  {t('ambulances.selectWilaya')}
                </label>
                <select
                  id="ambulances-wilaya"
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setCommuneId('');
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-500"
                >
                  <option value="">{t('ambulances.anyWilaya')}</option>
                  {wilayas.map((w) => (
                    <option key={w.id} value={w.id}>
                      {isRTL ? `${w.id} - ${w.ar_name}` : `${w.id} - ${w.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="ambulances-commune">
                  {t('ambulances.selectCity')}
                </label>
                <select
                  id="ambulances-commune"
                  value={communeId}
                  onChange={(e) => setCommuneId(e.target.value)}
                  disabled={!wilaya}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">{wilaya ? t('ambulances.anyCity') : t('ambulances.chooseWilayaFirst')}</option>
                  {communeOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="ambulances-type">
                  {t('ambulances.vehicleType')}
                </label>
                <select
                  id="ambulances-type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-red-500"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`ambulances.vehicleTypes.${type}`)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setFreeOnly((v) => !v)}
                className={`mt-2 lg:mt-0 inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                  freeOnly ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('ambulances.freeOnly')}
              </button>
            </div>

            {/* Quick chips (small navigation variation) */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip active={!vehicleType || vehicleType === 'all'} onClick={() => setVehicleType('all')}>
                {t('ambulances.vehicleTypes.all')}
              </Chip>
              <Chip active={vehicleType === 'standard'} onClick={() => setVehicleType('standard')}>
                {t('ambulances.vehicleTypes.standard')}
              </Chip>
              <Chip active={vehicleType === 'icu'} onClick={() => setVehicleType('icu')}>
                {t('ambulances.vehicleTypes.icu')}
              </Chip>
              <Chip active={vehicleType === 'medical-transport'} onClick={() => setVehicleType('medical-transport')}>
                {t('ambulances.vehicleTypes.medical-transport')}
              </Chip>
            </div>
          </div>

          {/* Results (cards) + map */}
          {showSkeleton ? (
            <>
              <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-extrabold text-slate-700">{t('common.listLoadingTitle')}</p>
                <p className="text-xs text-slate-500 mt-2">{t('common.listLoadingHint')}</p>
                <div className="mt-6 h-40 rounded-2xl bg-slate-100 animate-pulse" />
              </div>
              <ListGridSkeleton columnsClass="md:grid-cols-2" count={4} />
              <div className="mt-10 overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
                <div className="h-[420px] w-full animate-pulse bg-red-50/50" aria-hidden />
              </div>
            </>
          ) : (
            <>
          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-500">
                  {Icons.search({ className: 'h-7 w-7' })}
                </div>
                <h3 className="text-lg font-extrabold text-slate-700">{t('ambulances.emptyTitle')}</h3>
                <p className="mt-2 text-sm text-slate-500">{t('ambulances.emptyDesc')}</p>
              </div>
            ) : (
              filtered.map((a) => <AmbulanceCard key={a.id} item={a} t={t} isRTL={isRTL} />)
            )}
          </div>

          {/* Map (bottom, filtered results only) */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b bg-red-50/70 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-600 text-white">
                  {Icons.pin({ className: 'h-4 w-4' })}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{t('ambulances.mapTitle')}</h2>
                  <p className="text-xs text-red-700">{t('ambulances.mapSubtitle')}</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                {t('ambulances.mapCount').replace('{count}', String(mappable.length))}
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

                {mappable.map((a) => (
                  <CircleMarker
                    key={a.id}
                    center={[a.lat, a.lng]}
                    radius={10}
                    pathOptions={{
                      color: a.vehicleType === 'icu' ? '#b91c1c' : '#dc2626',
                      fillColor: a.vehicleType === 'icu' ? '#ef4444' : '#f97316',
                      fillOpacity: 0.85,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="space-y-2" dir={dir}>
                        <div className="font-extrabold text-slate-900">{a.ownerName}</div>
                        <div className="text-xs text-slate-600">
                          {t('ambulances.vehicleType')}: {t(`ambulances.vehicleTypes.${a.vehicleType}`)}
                        </div>
                        <div className="flex gap-2 pt-1">
                          <a
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-extrabold text-white"
                            href={`tel:${a.phone}`}
                          >
                            {Icons.phone({ className: 'h-4 w-4' })}
                            {t('ambulances.call')}
                          </a>
                          <a
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700"
                            href={buildGoogleMapsDirectionsUrl(a.lat, a.lng)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {Icons.nav({ className: 'h-4 w-4' })}
                            {t('ambulances.directions')}
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
      </section>
    </div>
  );
}

function StatPill({ label, value, tone }) {
  const toneClass =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : tone === 'red'
        ? 'border-red-200 bg-red-50 text-red-900'
        : 'border-slate-200 bg-white text-slate-900';

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="text-xl font-black leading-none">{value}</div>
      <div className="mt-1 text-[12px] font-bold opacity-80">{label}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-extrabold transition ${
        active ? 'border-red-200 bg-red-50 text-red-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function AmbulanceCard({ item, t, isRTL }) {
  const wilayaName = isRTL ? wilayas.find((w) => w.id === item.wilayaCode)?.ar_name : wilayas.find((w) => w.id === item.wilayaCode)?.name;
  const communeName = (() => {
    const c = getCommunes(item.wilayaCode).find((x) => x.id === item.communeId);
    return c ? (isRTL ? c.ar_name : c.name) : item.communeId;
  })();

  const typeLabel = t(`ambulances.vehicleTypes.${item.vehicleType}`);

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-600 text-white">
          {Icons.ambulance({ className: 'h-6 w-6' })}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 truncate">{item.ownerName}</h3>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-extrabold ${
                item.isFree ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              {item.isFree ? t('ambulances.freeBadge') : t('ambulances.paidBadge')}
            </span>
            <span className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-extrabold text-red-800">
              {typeLabel}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
            {Icons.pin({ className: 'h-4 w-4 text-slate-400' })}
            <span className="truncate">
              {wilayaName || item.wilayaCode} — {communeName}
            </span>
          </p>

          {item.priceDescription && !item.isFree ? (
            <p className="mt-1 text-sm text-slate-600">{item.priceDescription}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">{t('ambulances.quickNote')}</p>
          )}

          <p className="mt-1 text-sm text-slate-600" dir="ltr">
            <span className="inline-flex items-center gap-1">
              {Icons.phone({ className: 'h-4 w-4 text-slate-400' })}
              {item.phone}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-2 flex w-full gap-2 sm:mt-0 sm:w-auto sm:ms-auto">
        <a
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-extrabold text-white shadow-md shadow-red-100 hover:bg-red-700 sm:flex-none"
          href={`tel:${item.phone}`}
          aria-label={t('ambulances.call')}
        >
          {Icons.phone({ className: 'h-4 w-4' })}
          <span className="ms-2">{t('ambulances.call')}</span>
        </a>
      </div>
    </div>
  );
}


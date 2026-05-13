import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useI18n } from '../i18n/I18nProvider';
import { getCommunes, wilayas } from '../data/algeria-data';
import { housingListingsMock } from '../data/housing';

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
  homeHeart: (props) => (
    <Icon {...props}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" />
      <path d="M12 12.5c-1.7-1.8-3.5-.9-3.5.8 0 1.9 2 3 3.5 4.2 1.5-1.2 3.5-2.3 3.5-4.2 0-1.7-1.8-2.6-3.5-.8Z" />
    </Icon>
  ),
  search: (props) => (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </Icon>
  ),
  pin: (props) => (
    <Icon {...props}>
      <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  ),
  phone: (props) => (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z" />
    </Icon>
  ),
  shield: (props) => (
    <Icon {...props}>
      <path d="M12 2 20 6v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Z" />
      <path d="m9 12 2 2 4-5" />
    </Icon>
  ),
  users: (props) => (
    <Icon {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  ),
  locate: (props) => (
    <Icon {...props}>
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <circle cx="12" cy="12" r="6" />
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

function calculateDistanceKm(from, to) {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((to.lat - from.lat) * Math.PI) / 180;
  const longitudeDelta = ((to.lng - from.lng) * Math.PI) / 180;
  const fromLatitude = (from.lat * Math.PI) / 180;
  const toLatitude = (to.lat * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2) * Math.cos(fromLatitude) * Math.cos(toLatitude);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
}

function formatDistance(distanceInKm, t) {
  if (distanceInKm == null || !Number.isFinite(distanceInKm)) return t('housing.distanceUnknown');
  if (distanceInKm < 1) return t('housing.distanceMeters').replace('{m}', String(Math.round(distanceInKm * 1000)));
  return t('housing.distanceKm').replace('{km}', String(distanceInKm.toFixed(1)));
}

function HousingMapViewport({ userLocation, points, focused }) {
  const map = useMap();

  useEffect(() => {
    if (focused?.lat && focused?.lng) {
      map.flyTo([focused.lat, focused.lng], 13, { animate: true, duration: 0.9 });
      return;
    }

    const coords = points
      .map((p) => [p.lat, p.lng])
      .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));

    if (userLocation) coords.unshift([userLocation.lat, userLocation.lng]);

    if (coords.length === 0) {
      map.setView(ALGERIA_CENTER, 6, { animate: true });
      return;
    }
    if (coords.length === 1) {
      map.setView(coords[0], userLocation ? 12 : 10, { animate: true });
      return;
    }

    map.fitBounds(coords, { padding: [40, 40] });
  }, [focused, map, points, userLocation]);

  return null;
}

export default function AccommodationsPage() {
  const { t, dir } = useI18n();
  const isRTL = dir === 'rtl';
  const popupRefs = useRef({});

  const [wilaya, setWilaya] = useState('');
  const [communeId, setCommuneId] = useState('');
  const [query, setQuery] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minCapacity, setMinCapacity] = useState('1');
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle|loading|success|denied|unsupported
  const [focusedId, setFocusedId] = useState(null);

  const communeOptions = useMemo(() => {
    if (!wilaya) return [];
    return getCommunes(wilaya)
      .map((c) => ({ id: c.id, label: isRTL ? c.ar_name : c.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [isRTL, wilaya]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    const cap = Math.max(1, Number(minCapacity || 1));
    return housingListingsMock.filter((h) => {
      if (!h.isActive) return false;
      if (wilaya && h.wilayaCode !== wilaya) return false;
      if (communeId && h.communeId !== communeId) return false;
      if (freeOnly && !h.isFree) return false;
      if (verifiedOnly && !h.isVerified) return false;
      if (Number.isFinite(cap) && h.capacity < cap) return false;
      if (!q) return true;
      const hay = normalize([h.title, h.hostName, h.phone, h.address ?? '', h.wilayaCode].join(' '));
      return hay.includes(q);
    });
  }, [communeId, freeOnly, minCapacity, query, verifiedOnly, wilaya]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus('success');
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  const points = useMemo(() => {
    return filtered
      .map((h) => {
        const lat = Number(h.latitude);
        const lng = Number(h.longitude);
        const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
        const distanceKm = userLocation && hasCoords ? calculateDistanceKm(userLocation, { lat, lng }) : null;
        return {
          id: h.id,
          lat,
          lng,
          distanceKm,
          item: h,
          hasCoords,
        };
      })
      .filter((p) => p.hasCoords);
  }, [filtered, userLocation]);

  const nearest = useMemo(() => {
    const withDistance = points.filter((p) => p.distanceKm != null && Number.isFinite(p.distanceKm));
    if (withDistance.length === 0) return null;
    return [...withDistance].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [points]);

  const focused = useMemo(() => {
    if (!focusedId) return null;
    const p = points.find((x) => x.id === focusedId);
    return p ? { lat: p.lat, lng: p.lng } : null;
  }, [focusedId, points]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const free = filtered.filter((x) => x.isFree).length;
    const verified = filtered.filter((x) => x.isVerified).length;
    return { total, free, verified };
  }, [filtered]);

  return (
    <div className="space-y-12" dir={dir}>
      <section className="border-y border-blue-100 bg-gradient-to-b from-blue-50/70 via-white to-white py-14">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-extrabold text-blue-700">
              {Icons.homeHeart({ className: 'h-4 w-4' })}
              {t('housing.kindnessBadge')}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white">
                    {Icons.homeHeart({ className: 'h-6 w-6' })}
                  </span>
                  {t('housing.title')}
                </h1>
                <p className="mt-3 text-slate-600 text-lg">{t('housing.subtitle')}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatPill label={t('housing.stats.total')} value={String(stats.total)} tone="slate" />
                <StatPill label={t('housing.stats.free')} value={String(stats.free)} tone="emerald" />
                <StatPill label={t('housing.stats.verified')} value={String(stats.verified)} tone="blue" />
              </div>
            </div>
          </div>

          {/* How it works (value section) */}
          <div className="mb-8 grid gap-4 lg:grid-cols-3">
            <InfoCard
              title={t('housing.how.step1Title')}
              desc={t('housing.how.step1Desc')}
              tone="blue"
              icon={Icons.search({ className: 'h-5 w-5' })}
            />
            <InfoCard
              title={t('housing.how.step2Title')}
              desc={t('housing.how.step2Desc')}
              tone="teal"
              icon={Icons.users({ className: 'h-5 w-5' })}
            />
            <InfoCard
              title={t('housing.how.step3Title')}
              desc={t('housing.how.step3Desc')}
              tone="emerald"
              icon={Icons.shield({ className: 'h-5 w-5' })}
            />
          </div>

          {/* Filters */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] lg:items-end">
              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="housing-search">
                  {t('housing.searchLabel')}
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {Icons.search({ className: 'h-5 w-5' })}
                  </span>
                  <input
                    id="housing-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('housing.searchPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                  />
                  {query.trim() ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label={t('housing.clearSearch')}
                      title={t('housing.clearSearch')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      {Icons.x({ className: 'h-4 w-4' })}
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="housing-wilaya">
                  {t('housing.selectWilaya')}
                </label>
                <select
                  id="housing-wilaya"
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setCommuneId('');
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('housing.anyWilaya')}</option>
                  {wilayas.map((w) => (
                    <option key={w.id} value={w.id}>
                      {isRTL ? `${w.id} - ${w.ar_name}` : `${w.id} - ${w.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="housing-commune">
                  {t('housing.selectCity')}
                </label>
                <select
                  id="housing-commune"
                  value={communeId}
                  onChange={(e) => setCommuneId(e.target.value)}
                  disabled={!wilaya}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">{wilaya ? t('housing.anyCity') : t('housing.chooseWilayaFirst')}</option>
                  {communeOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="housing-capacity">
                  {t('housing.minCapacity')}
                </label>
                <select
                  id="housing-capacity"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {['1', '2', '3', '4', '5+'].map((v) => (
                    <option key={v} value={v === '5+' ? '5' : v}>
                      {v === '5+' ? t('housing.capacity5Plus') : v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setFreeOnly((v) => !v)}
                  className={`inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                    freeOnly ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('housing.freeOnly')}
                </button>

                <button
                  type="button"
                  onClick={() => setVerifiedOnly((v) => !v)}
                  className={`inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                    verifiedOnly ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('housing.verifiedOnly')}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-500">
                  {Icons.search({ className: 'h-7 w-7' })}
                </div>
                <h3 className="text-lg font-extrabold text-slate-700">{t('housing.emptyTitle')}</h3>
                <p className="mt-2 text-sm text-slate-500">{t('housing.emptyDesc')}</p>
              </div>
            ) : (
              filtered.map((h) => <HousingCard key={h.id} item={h} t={t} isRTL={isRTL} />)
            )}
          </div>

          {/* Map (bottom, filtered results only) */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b bg-blue-50/60 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
                  {Icons.pin({ className: 'h-4 w-4' })}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{t('housing.mapTitle')}</h2>
                  <p className="text-xs text-blue-700">{t('housing.mapSubtitle')}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                  {t('housing.mapCount').replace('{count}', String(points.length))}
                </span>
                <button
                  type="button"
                  disabled={!userLocation || !nearest}
                  onClick={() => {
                    if (!nearest) return;
                    setFocusedId(nearest.id);
                    window.setTimeout(() => popupRefs.current[nearest.id]?.openOn?.(popupRefs.current[nearest.id]._map), 150);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-extrabold text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  title={t('housing.nearest')}
                >
                  {Icons.locate({ className: 'h-4 w-4' })}
                  {t('housing.nearest')}
                </button>
                <span className="text-[12px] text-slate-500">
                  {locationStatus === 'loading' ? t('housing.locationLoading') : null}
                  {locationStatus === 'denied' ? t('housing.locationDenied') : null}
                  {locationStatus === 'unsupported' ? t('housing.locationUnsupported') : null}
                </span>
              </div>
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
                <HousingMapViewport userLocation={userLocation} points={points} focused={focused} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation ? (
                  <Circle center={userLocation} radius={500} pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 0.12 }} />
                ) : null}

                {points.map((p) => (
                  <CircleMarker
                    key={p.id}
                    center={[p.lat, p.lng]}
                    radius={10}
                    pathOptions={{
                      color: p.item.isVerified ? '#1d4ed8' : '#64748b',
                      fillColor: p.item.isVerified ? '#2563eb' : '#94a3b8',
                      fillOpacity: 0.85,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => setFocusedId(p.id),
                    }}
                  >
                    <Popup
                      ref={(el) => {
                        if (el) popupRefs.current[p.id] = el;
                      }}
                    >
                      <div className="space-y-2" dir={dir}>
                        <div className="font-extrabold text-slate-900">{p.item.title}</div>
                        <div className="text-sm text-slate-700">{p.item.hostName}</div>
                        <div className="text-xs text-slate-600">
                          {t('housing.distanceLabel').replace('{distance}', formatDistance(p.distanceKm, t))}
                        </div>
                        <div className="flex gap-2 pt-1">
                          <a
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-extrabold text-white"
                            href={`tel:${p.item.phone}`}
                          >
                            {Icons.phone({ className: 'h-4 w-4' })}
                            {t('housing.call')}
                          </a>
                          <a
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-700"
                            href={buildGoogleMapsDirectionsUrl(p.lat, p.lng)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {Icons.nav({ className: 'h-4 w-4' })}
                            {t('housing.directions')}
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
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

function InfoCard({ title, desc, tone, icon }) {
  const toneCls =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50/50'
      : tone === 'teal'
        ? 'border-teal-200 bg-teal-50/50'
        : 'border-blue-200 bg-blue-50/50';

  const iconCls =
    tone === 'emerald' ? 'bg-emerald-600' : tone === 'teal' ? 'bg-teal-600' : 'bg-blue-600';

  return (
    <div className={`rounded-3xl border p-5 ${toneCls}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl text-white ${iconCls}`}>{icon}</span>
        <div>
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function HousingCard({ item, t, isRTL }) {
  const wilayaName = isRTL
    ? wilayas.find((w) => w.id === item.wilayaCode)?.ar_name
    : wilayas.find((w) => w.id === item.wilayaCode)?.name;
  const communeName = (() => {
    const c = getCommunes(item.wilayaCode).find((x) => x.id === item.communeId);
    return c ? (isRTL ? c.ar_name : c.name) : item.communeId;
  })();

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white">
          {Icons.homeHeart({ className: 'h-6 w-6' })}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-slate-900 truncate">{item.title}</h3>
            {item.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-extrabold text-blue-800">
                {Icons.shield({ className: 'h-3 w-3' })}
                {t('housing.verifiedBadge')}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
                {t('housing.unverifiedBadge')}
              </span>
            )}

            <span
              className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-extrabold ${
                item.isFree ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              {item.isFree ? t('housing.freeBadge') : t('housing.paidBadge').replace('{price}', String(item.pricePerNightDzd ?? 0))}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
            {Icons.pin({ className: 'h-4 w-4 text-slate-400' })}
            <span className="truncate">
              {wilayaName || item.wilayaCode} — {communeName}
              {item.address ? ` • ${item.address}` : ''}
            </span>
          </p>

          <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
            {Icons.users({ className: 'h-4 w-4 text-slate-400' })}
            {t('housing.capacityLabel').replace('{count}', String(item.capacity))}
          </p>

          {item.description ? <p className="mt-1 text-sm text-slate-500">{item.description}</p> : null}

          <div className="mt-2 flex flex-wrap gap-2">
            {item.acceptsCompanion ? (
              <Tag tone="emerald">{t('housing.acceptsCompanion')}</Tag>
            ) : (
              <Tag tone="slate">{t('housing.patientOnly')}</Tag>
            )}
            {item.suitableForLongStay ? <Tag tone="teal">{t('housing.longStay')}</Tag> : <Tag tone="slate">{t('housing.shortStay')}</Tag>}
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full gap-2 sm:mt-0 sm:w-auto sm:ms-auto">
        <a
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow-md shadow-blue-100 hover:bg-blue-700 sm:flex-none"
          href={`tel:${item.phone}`}
          aria-label={t('housing.call')}
        >
          {Icons.phone({ className: 'h-4 w-4' })}
          <span className="ms-2">{t('housing.call')}</span>
        </a>
      </div>
    </div>
  );
}

function Tag({ tone, children }) {
  const cls =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : tone === 'teal'
        ? 'border-teal-200 bg-teal-50 text-teal-800'
        : 'border-slate-200 bg-slate-50 text-slate-700';

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-extrabold ${cls}`}>{children}</span>;
}


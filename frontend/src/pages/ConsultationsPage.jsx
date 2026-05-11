import React, { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { getCommunes, wilayas } from '../data/algeria-data';
import { consultationDoctorsMock, consultationSpecialtiesMock } from '../data/consultations';

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
  steth: (props) => (
    <Icon {...props}>
      <path d="M4 2v6a4 4 0 0 0 8 0V2" />
      <path d="M8 15a5 5 0 0 0 10 0v-3" />
      <path d="M20 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </Icon>
  ),
  phone: (props) => (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z" />
    </Icon>
  ),
  video: (props) => (
    <Icon {...props}>
      <path d="M15 10l5-3v10l-5-3V10Z" />
      <rect x="2" y="7" width="13" height="10" rx="2" />
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
  star: (props) => (
    <Icon {...props}>
      <path d="M12 2l3.1 6.4L22 9.3l-5 4.8 1.2 6.9L12 18.7 5.8 21l1.2-6.9-5-4.8 6.9-.9L12 2Z" />
    </Icon>
  ),
  shield: (props) => (
    <Icon {...props}>
      <path d="M12 2 20 6v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4Z" />
      <path d="m9 12 2 2 4-5" />
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

export default function ConsultationsPage() {
  const { t, dir } = useI18n();
  const isRTL = dir === 'rtl';

  const [specialtyKey, setSpecialtyKey] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [communeId, setCommuneId] = useState('');
  const [query, setQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const communeOptions = useMemo(() => {
    if (!wilaya) return [];
    return getCommunes(wilaya)
      .map((c) => ({ id: c.id, label: isRTL ? c.ar_name : c.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [isRTL, wilaya]);

  const specialtyOptions = useMemo(() => {
    return consultationSpecialtiesMock.map((s) => ({
      key: s.key,
      label: t(`consultations.specialties.${s.key}`),
      iconEmoji: s.iconEmoji,
      colorClass: s.colorClass,
    }));
  }, [t]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return consultationDoctorsMock.filter((d) => {
      if (!d.isActive) return false;
      if (specialtyKey && d.specialtyKey !== specialtyKey) return false;
      if (wilaya && d.wilayaCode !== wilaya) return false;
      if (communeId && d.communeId !== communeId) return false;
      if (remoteOnly && !d.supportsRemote) return false;
      if (verifiedOnly && !d.isVerified) return false;
      if (!q) return true;
      const hay = normalize([d.name, d.clinicName ?? '', d.phone, d.wilayaCode].join(' '));
      return hay.includes(q);
    });
  }, [communeId, query, remoteOnly, specialtyKey, verifiedOnly, wilaya]);

  const selectedDoctor = useMemo(() => filtered.find((d) => d.id === selectedDoctorId) || null, [filtered, selectedDoctorId]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const remote = filtered.filter((d) => d.supportsRemote).length;
    const verified = filtered.filter((d) => d.isVerified).length;
    return { total, remote, verified };
  }, [filtered]);

  const closeModal = () => {
    setBookingOpen(false);
    setSelectedDoctorId(null);
  };

  const submitBooking = (e) => {
    e.preventDefault();
    closeModal();
    setFeedback({ tone: 'success', title: t('consultations.bookingSuccessTitle'), desc: t('consultations.bookingSuccessDesc') });
    window.setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-12" dir={dir}>
      <section className="border-y border-emerald-100 bg-gradient-to-b from-emerald-50/60 via-white to-white py-14">
        <div className="container mx-auto px-4">
          {feedback ? (
            <div
              role="status"
              className={`mb-8 rounded-2xl border px-4 py-3 text-sm ${
                feedback.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
            >
              <div className="font-extrabold">{feedback.title}</div>
              <div className="opacity-90">{feedback.desc}</div>
            </div>
          ) : null}

          {/* Hero */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-extrabold text-emerald-800">
              {Icons.video({ className: 'h-4 w-4' })}
              {t('consultations.badge')}
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white">
                    {Icons.steth({ className: 'h-6 w-6' })}
                  </span>
                  {t('consultations.title')}
                </h1>
                <p className="mt-3 text-slate-600 text-lg">{t('consultations.subtitle')}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatPill label={t('consultations.stats.total')} value={String(stats.total)} tone="slate" />
                <StatPill label={t('consultations.stats.remote')} value={String(stats.remote)} tone="emerald" />
                <StatPill label={t('consultations.stats.verified')} value={String(stats.verified)} tone="blue" />
              </div>
            </div>
          </div>

          {/* Value highlight (remote + local private) */}
          <div className="mb-8 grid gap-4 lg:grid-cols-2">
            <ValueCard
              icon={Icons.video({ className: 'h-5 w-5' })}
              title={t('consultations.value.remoteTitle')}
              desc={t('consultations.value.remoteDesc')}
              tone="emerald"
            />
            <ValueCard
              icon={Icons.pin({ className: 'h-5 w-5' })}
              title={t('consultations.value.localTitle')}
              desc={t('consultations.value.localDesc')}
              tone="blue"
            />
          </div>

          {/* Specialties quick grid (legacy-inspired) */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-slate-900">{t('consultations.specialtiesTitle')}</h2>
              <button
                type="button"
                onClick={() => setSpecialtyKey('')}
                className="text-sm font-extrabold text-emerald-700 hover:underline"
              >
                {t('consultations.clearSpecialty')}
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {specialtyOptions.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSpecialtyKey(s.key)}
                  className={`rounded-2xl border bg-white p-4 text-start shadow-sm transition hover:shadow-md ${
                    specialtyKey === s.key ? 'border-emerald-200 ring-2 ring-emerald-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${s.colorClass} text-2xl text-white shadow-sm`}>
                      {s.iconEmoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900">{s.label}</div>
                      <div className="mt-1 text-xs font-bold text-slate-500">{t('consultations.tapToFilter')}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] lg:items-end">
              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="consult-search">
                  {t('consultations.searchLabel')}
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {Icons.search({ className: 'h-5 w-5' })}
                  </span>
                  <input
                    id="consult-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('consultations.searchPlaceholder')}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                  />
                  {query.trim() ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label={t('consultations.clearSearch')}
                      title={t('consultations.clearSearch')}
                      className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      {Icons.x({ className: 'h-4 w-4' })}
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="consult-wilaya">
                  {t('consultations.selectWilaya')}
                </label>
                <select
                  id="consult-wilaya"
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setCommuneId('');
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t('consultations.anyWilaya')}</option>
                  {wilayas.map((w) => (
                    <option key={w.id} value={w.id}>
                      {isRTL ? `${w.id} - ${w.ar_name}` : `${w.id} - ${w.name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="consult-commune">
                  {t('consultations.selectCity')}
                </label>
                <select
                  id="consult-commune"
                  value={communeId}
                  onChange={(e) => setCommuneId(e.target.value)}
                  disabled={!wilaya}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {wilaya ? t('consultations.anyCity') : t('consultations.chooseWilayaFirst')}
                  </option>
                  {communeOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700" htmlFor="consult-specialty">
                  {t('consultations.specialtyLabel')}
                </label>
                <select
                  id="consult-specialty"
                  value={specialtyKey}
                  onChange={(e) => setSpecialtyKey(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">{t('consultations.anySpecialty')}</option>
                  {specialtyOptions.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setRemoteOnly((v) => !v)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                    remoteOnly ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {Icons.video({ className: 'h-4 w-4' })}
                  {t('consultations.remoteOnly')}
                </button>

                <button
                  type="button"
                  onClick={() => setVerifiedOnly((v) => !v)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition ${
                    verifiedOnly ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {Icons.shield({ className: 'h-4 w-4' })}
                  {t('consultations.verifiedOnly')}
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.length === 0 ? (
              <EmptyState title={t('consultations.emptyTitle')} desc={t('consultations.emptyDesc')} />
            ) : (
              filtered.map((d) => (
                <DoctorCard
                  key={d.id}
                  item={d}
                  t={t}
                  onBook={() => {
                    setSelectedDoctorId(d.id);
                    setBookingOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {bookingOpen && selectedDoctor ? (
        <Modal onClose={closeModal} title={t('consultations.bookWith').replace('{name}', selectedDoctor.name)} dir={dir}>
          <form className="space-y-4" onSubmit={submitBooking}>
            <div>
              <label className="text-sm font-bold text-slate-700" htmlFor="bk-name">
                {t('consultations.fullName')}
              </label>
              <input
                id="bk-name"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={t('consultations.fullNamePlaceholder')}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700" htmlFor="bk-phone">
                {t('consultations.phoneNumber')}
              </label>
              <input
                id="bk-phone"
                type="tel"
                required
                dir="ltr"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+213..."
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700" htmlFor="bk-notes">
                {t('consultations.notes')}
              </label>
              <textarea
                id="bk-notes"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
                placeholder={t('consultations.notesPlaceholder')}
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-700">
              {t('consultations.confirmBooking')}
            </button>
          </form>
        </Modal>
      ) : null}
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

function ValueCard({ icon, title, desc, tone }) {
  const cls =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50/50'
      : 'border-blue-200 bg-blue-50/50';
  const iconCls = tone === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600';

  return (
    <div className={`rounded-3xl border p-5 ${cls}`}>
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

function DoctorCard({ item, t, onBook }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative p-5 bg-gradient-to-br from-emerald-700 via-green-600 to-teal-600 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold text-white">
              {Icons.steth({ className: 'h-4 w-4' })}
              {t(`consultations.specialties.${item.specialtyKey}`)}
            </div>
            <h3 className="mt-4 text-xl font-black leading-tight">{item.name}</h3>
            <div className="mt-1 text-sm text-white/90">{item.clinicName ? item.clinicName : t('consultations.privatePractice')}</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {item.isVerified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-extrabold text-emerald-50">
                {Icons.shield({ className: 'h-4 w-4' })}
                {t('consultations.verified')}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold text-white">
              {Icons.star({ className: 'h-4 w-4' })}
              <span>{item.rating.toFixed(1)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2">
          {item.supportsRemote ? <Chip tone="indigo" label={t('consultations.chips.remote')} /> : null}
          {item.supportsInPerson ? <Chip tone="slate" label={t('consultations.chips.inPerson')} /> : null}
          <Chip tone="amber" label={t('consultations.experienceLabel').replace('{years}', String(item.experienceYears))} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="text-sm font-black text-emerald-800">
            {t('consultations.feeLabel')
              .replace('{price}', String(item.price))
              .replace('{currency}', item.currency)}
          </div>
          <a className="text-xs font-extrabold text-slate-700 hover:underline" href={`tel:${item.phone}`} dir="ltr">
            {item.phone}
          </a>
        </div>

        <div className="flex items-center justify-between gap-2">
          <a className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700" href={`tel:${item.phone}`}>
            {Icons.phone({ className: 'h-4 w-4' })}
            {t('consultations.call')}
          </a>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
          >
            {Icons.video({ className: 'h-4 w-4' })}
            {t('consultations.bookNow')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, tone }) {
  const cls =
    tone === 'indigo'
      ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-slate-200 bg-slate-50 text-slate-700';

  return <span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${cls}`}>{label}</span>;
}

function EmptyState({ title, desc }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center md:col-span-2 xl:col-span-3">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-500">
        {Icons.steth({ className: 'h-7 w-7' })}
      </div>
      <h3 className="text-lg font-extrabold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function Modal({ title, children, onClose, dir }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl" dir={dir}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            {Icons.x({ className: 'h-4 w-4' })}
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}


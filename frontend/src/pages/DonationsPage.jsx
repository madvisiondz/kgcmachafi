import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import {
  campaignsMock,
  currenciesMock,
  donationStatsMock,
  donationsSectionMock,
} from '../data/donations';

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
  heart: (props) => (
    <Icon {...props}>
      <path d="M12 21s8-4 8-11a4 4 0 0 0-7-2 4 4 0 0 0-7 2c0 7 8 11 8 11Z" />
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
  trendingUp: (props) => (
    <Icon {...props}>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M14 7h6v6" />
    </Icon>
  ),
  check: (props) => (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
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
  card: (props) => (
    <Icon {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </Icon>
  ),
  calendar: (props) => (
    <Icon {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </Icon>
  ),
};

function pickText(text, language) {
  if (!text) return '';
  return text[language] ?? text.en ?? text.fr ?? text.ar ?? '';
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? '');
  return num.toLocaleString();
}

function StatCard({ icon, tone, value, label }) {
  const toneClass =
    tone === 'red'
      ? 'from-red-500 to-pink-600'
      : tone === 'green'
        ? 'from-green-500 to-emerald-600'
        : tone === 'blue'
          ? 'from-blue-500 to-cyan-600'
          : tone === 'emerald'
            ? 'from-emerald-600 to-teal-600'
            : 'from-blue-500 to-cyan-600';
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${toneClass} flex items-center justify-center mb-4 shadow-md text-white`}>
        {icon}
      </div>
      <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1 truncate" dir="ltr">
        {value}
      </p>
      <p className="text-gray-600 font-semibold">{label}</p>
    </div>
  );
}

export default function DonationsPage() {
  const { t, dir, language } = useI18n();
  const isRTL = dir === 'rtl';

  const [currency, setCurrency] = useState('EUR');
  const [mode, setMode] = useState('one-time'); // one-time | monthly
  const [amount, setAmount] = useState(20);
  const [activeCampaignId, setActiveCampaignId] = useState(null);

  const currencyConfig = currenciesMock[currency] ?? currenciesMock.EUR;
  const presets = mode === 'monthly' ? currencyConfig.subPresets : currencyConfig.presets;

  useEffect(() => {
    setAmount(presets[1] ?? presets[0] ?? currencyConfig.step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, mode]);

  const campaigns = useMemo(() => campaignsMock, []);

  const sectionTitle = pickText(donationsSectionMock.title, language);
  const sectionSubtitle = pickText(donationsSectionMock.subtitle, language);

  const stats = useMemo(() => {
    return [
      {
        tone: 'red',
        icon: Icons.heart({ className: 'w-7 h-7' }),
        value: donationStatsMock.helpedValue,
        label: pickText(donationStatsMock.helpedLabel, language),
      },
      {
        tone: 'green',
        icon: (
          <span className="text-2xl font-black" aria-hidden="true">
            €
          </span>
        ),
        value: `${donationStatsMock.totalValueEur} €`,
        label: pickText(donationStatsMock.totalLabel, language),
      },
      {
        tone: 'blue',
        icon: Icons.users({ className: 'w-7 h-7' }),
        value: donationStatsMock.donorsValue,
        label: pickText(donationStatsMock.donorsLabel, language),
      },
      {
        tone: 'emerald',
        icon: Icons.trendingUp({ className: 'w-7 h-7' }),
        value: donationStatsMock.successValue,
        label: pickText(donationStatsMock.successLabel, language),
      },
    ];
  }, [language]);

  const handleContributeToCampaign = (campaignId) => {
    setActiveCampaignId(campaignId);
    const target = document.getElementById('donation-form');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setAmount(presets[0] ?? amount);
  };

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) ?? null;

  const themeGradient = (theme) =>
    theme === 'red'
      ? 'from-red-500 to-pink-600'
      : theme === 'emerald'
        ? 'from-emerald-600 to-teal-600'
        : 'from-blue-500 to-cyan-600';

  const convertFromEur = (eur) => {
    // UI-only: keep base in EUR like legacy; convert display for selected currency.
    if (currency === 'EUR') return eur;
    if (currency === 'USD') return Math.round(eur * 1.08);
    if (currency === 'DZD') return Math.round(eur * 150);
    return eur;
  };

  const payLabel = mode === 'monthly' ? t('donations.form.confirmMonthly') : t('donations.form.confirmOneTime');

  return (
    <div className="space-y-12" dir={dir}>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                {sectionTitle}
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-6">{sectionSubtitle}</p>

            {/* Currency selector */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {Object.values(currenciesMock).map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrency(curr.code)}
                  className={`rounded-full px-5 h-11 font-extrabold border transition ${
                    currency === curr.code
                      ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-200 hover:text-emerald-700'
                  }`}
                  aria-pressed={currency === curr.code}
                >
                  {pickText(curr.label, language)} ({curr.symbol})
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((s) => (
              <StatCard key={s.label} icon={s.icon} tone={s.tone} value={s.value} label={s.label} />
            ))}
          </div>

          {/* Campaigns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {campaigns.map((c) => {
              const progress = clamp((c.raisedEur / c.goalEur) * 100, 0, 100);
              const raised = convertFromEur(c.raisedEur);
              const goal = convertFromEur(c.goalEur);
              const grad = themeGradient(c.theme);

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col"
                >
                  <div className={`relative aspect-video overflow-hidden shrink-0 bg-gradient-to-br ${grad}`}>
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 text-white/90 mb-2">
                        {Icons.users({ className: 'w-4 h-4' })}
                        <span className="text-sm">
                          {c.donors} {t('donations.campaign.donors')}
                        </span>
                      </div>
                      <div className="text-lg font-extrabold drop-shadow-sm">{pickText(c.title, language)}</div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">
                      {pickText(c.description, language)}
                    </p>

                    <div className="mb-4 mt-auto">
                      <div className="flex justify-between text-sm mb-2 font-semibold" dir="ltr">
                        <span className="text-emerald-700">
                          {formatNumber(raised)} {currencyConfig.symbol}
                        </span>
                        <span className="text-gray-500">
                          {formatNumber(goal)} {currencyConfig.symbol}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${grad} rounded-full shadow-md`} style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        {t('donations.campaign.complete').replace('{p}', String(Math.round(progress)))}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleContributeToCampaign(c.id)}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${grad} hover:opacity-95 shadow-lg text-white font-extrabold h-12`}
                    >
                      {Icons.heart({ className: 'w-4 h-4' })}
                      {t('donations.campaign.contribute')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donation form */}
          <div
            id="donation-form"
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto border border-gray-100"
          >
            <div className="p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{t('donations.form.title')}</h2>
                <p className="text-gray-500">{t('donations.form.subtitle')}</p>
              </div>

              {activeCampaign ? (
                <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                  <div className="text-sm font-extrabold text-rose-900">{t('donations.form.forCampaign')}</div>
                  <div className="mt-1 text-sm text-rose-800">{pickText(activeCampaign.title, language)}</div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('one-time')}
                  className={`rounded-lg py-3 text-base font-extrabold transition ${
                    mode === 'one-time' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-700 hover:text-emerald-700'
                  }`}
                  aria-pressed={mode === 'one-time'}
                >
                  <span className="inline-flex items-center gap-2 justify-center">
                    {Icons.heart({ className: 'w-4 h-4' })}
                    {t('donations.form.oneTime')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('monthly')}
                  className={`rounded-lg py-3 text-base font-extrabold transition ${
                    mode === 'monthly' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-700 hover:text-emerald-700'
                  }`}
                  aria-pressed={mode === 'monthly'}
                >
                  <span className="inline-flex items-center gap-2 justify-center">
                    {Icons.calendar({ className: 'w-4 h-4' })}
                    {t('donations.form.monthly')}
                  </span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 mb-6">
                <div className="text-center mb-7">
                  <span className="text-gray-500 text-sm block mb-2">
                    {mode === 'one-time' ? t('donations.form.amountOneTime') : t('donations.form.amountMonthly')}
                  </span>
                  <p className="text-5xl font-extrabold text-gray-900 flex items-center justify-center gap-2" dir="ltr">
                    <span className="text-3xl text-gray-400 font-normal">{currencyConfig.symbol}</span>
                    {formatNumber(amount)}
                  </p>
                </div>

                <input
                  type="range"
                  min={0}
                  max={currencyConfig.max}
                  step={currencyConfig.step}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                  aria-label={t('donations.form.amountSlider')}
                />

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(p)}
                      className={`h-12 rounded-xl text-lg font-extrabold border-2 transition ${
                        amount === p
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white hover:border-emerald-200 hover:text-emerald-700'
                      }`}
                    >
                      {formatNumber(p)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  // UI-first: later this triggers payment flow or creates a pledge intent.
                  // For now: scroll to footer contact as “human confirmation” path (matches project phase).
                  const footer = document.getElementById('footer');
                  if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full h-14 text-lg font-extrabold inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-xl transition-all"
              >
                {mode === 'one-time' ? Icons.heart({ className: 'w-5 h-5 text-white' }) : Icons.check({ className: 'w-5 h-5 text-white' })}
                <span className="text-white">{payLabel}</span>
                <span className="ms-auto text-white/90" aria-hidden="true">
                  {isRTL ? '←' : '→'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-5">
                {Icons.globe({ className: 'w-4 h-4' })}
                <span>{t('donations.form.secure')}</span>
                <span className="mx-2">•</span>
                {Icons.card({ className: 'w-4 h-4' })}
                <span>{t('donations.form.cards')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


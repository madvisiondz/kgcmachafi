import React, { useCallback, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import {
  exhibitionsMock,
  servicesMock,
  servicesSectionMock,
  suppliersMock,
} from '../data/services';
import { useBootstrapList } from '../hooks/useBootstrapList';
import ListFetchErrorBanner from '../components/ListFetchErrorBanner';
import { loadServicesCatalog } from '../services';

function pickText(text, language) {
  if (!text) return '';
  return text[language] ?? text.en ?? text.fr ?? text.ar ?? '';
}

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
  search: (props) => (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </Icon>
  ),
  x: (props) => (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  ),
  check: (props) => (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  ),
  phone: (props) => (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z" />
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
  pin: (props) => (
    <Icon {...props}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
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
};

function ServiceGlyph({ iconKey, className = '' }) {
  const glyph = (() => {
    switch (iconKey) {
      case 'home-care':
        return (
          <>
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 10v10h14V10" />
            <path d="M9 20v-6h6v6" />
          </>
        );
      case 'lab':
        return (
          <>
            <path d="M10 2v6l-4.5 8A4 4 0 0 0 9 22h6a4 4 0 0 0 3.5-6L14 8V2" />
            <path d="M8 14h8" />
          </>
        );
      case 'nurse':
        return (
          <>
            <path d="M12 2v6" />
            <path d="M9 5h6" />
            <path d="M7 22h10" />
            <path d="M8 22V11a4 4 0 0 1 8 0v11" />
          </>
        );
      case 'rehab':
        return (
          <>
            <path d="M4 20c2-2 4-3 8-3s6 1 8 3" />
            <path d="M12 14V3" />
            <path d="M7 8l5-5 5 5" />
          </>
        );
      case 'oxygen':
        return (
          <>
            <path d="M10 2h4" />
            <path d="M10 2v4h4V2" />
            <path d="M9 6h6" />
            <path d="M10 6v5a2 2 0 0 0 4 0V6" />
            <path d="M9 22h6" />
            <path d="M9 22v-6a3 3 0 0 1 6 0v6" />
          </>
        );
      case 'transport':
        return (
          <>
            <path d="M3 16V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8" />
            <path d="M3 12h16" />
            <path d="M7 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
            <path d="M15 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
          </>
        );
      case 'support':
        return (
          <>
            <path d="M12 21s8-4 8-11a4 4 0 0 0-7-2 4 4 0 0 0-7 2c0 7 8 11 8 11Z" />
            <path d="M9 13h6" />
            <path d="M12 10v6" />
          </>
        );
      default:
        return (
          <>
            <path d="M12 21s8-4 8-11a4 4 0 0 0-7-2 4 4 0 0 0-7 2c0 7 8 11 8 11Z" />
          </>
        );
    }
  })();

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
      {glyph}
    </svg>
  );
}

function normalize(s) {
  return String(s ?? '').trim().toLocaleLowerCase();
}

function Modal({ open, onClose, title, children, closeLabel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
            <div className="min-w-0">
              <div className="text-lg font-extrabold text-slate-900 truncate">{title}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label={closeLabel}
              title={closeLabel}
            >
              {Icons.x({ className: 'h-5 w-5' })}
            </button>
          </div>
          <div className="px-5 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { t, dir, language } = useI18n();
  const isRTL = dir === 'rtl';

  const loadCatalog = useCallback(() => loadServicesCatalog(language), [language]);
  const { status, data, error, reload } = useBootstrapList(loadCatalog);
  const catalog = data ?? servicesMock;
  const showSkeleton = status === 'loading';

  const sectionTitle = pickText(servicesSectionMock.section_title, language);
  const sectionSubtitle = pickText(servicesSectionMock.section_subtitle, language);

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [exTab, setExTab] = useState('algeria');

  const activeServices = useMemo(
    () => catalog.filter((s) => s.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [catalog],
  );

  const filteredServices = useMemo(() => {
    const q = normalize(query);
    if (!q) return activeServices;
    return activeServices.filter((s) => {
      const text = [
        pickText(s.title, language),
        pickText(s.description, language),
        pickText(s.details, language),
        ...s.features.map((f) => pickText(f, language)),
      ].join(' ');
      return normalize(text).includes(q);
    });
  }, [activeServices, language, query]);

  const suppliers = useMemo(() => suppliersMock, []);

  const exhibitions = useMemo(() => {
    return exhibitionsMock.filter((e) => e.region === exTab);
  }, [exTab]);

  const steps = useMemo(
    () => [
      {
        title: t('services.how.step1Title'),
        desc: t('services.how.step1Desc'),
      },
      {
        title: t('services.how.step2Title'),
        desc: t('services.how.step2Desc'),
      },
      {
        title: t('services.how.step3Title'),
        desc: t('services.how.step3Desc'),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-16" dir={dir}>
      {/* Hero + directory */}
      <section className="border-y border-cyan-100 bg-gradient-to-b from-cyan-50/70 to-white py-14">
        <div className="container mx-auto px-4">
          {error ? (
            <div className="mb-6">
              <ListFetchErrorBanner message={error.message} onRetry={reload} />
            </div>
          ) : null}
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-start">
            <aside className="rounded-3xl border border-cyan-100 bg-white shadow-lg p-6 lg:sticky lg:top-24">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-3 shadow-lg">
                  <ServiceGlyph iconKey="support" className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-extrabold text-slate-900">{sectionTitle}</h1>
                  <p className="mt-1 text-sm text-cyan-700">{sectionSubtitle}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700" htmlFor="services-search">
                    {t('services.searchLabel')}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {Icons.search({ className: 'h-5 w-5' })}
                    </span>
                    <input
                      id="services-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('services.searchPlaceholder')}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-11 pe-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/25"
                    />
                    {query.trim() ? (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label={t('services.clearSearch')}
                        title={t('services.clearSearch')}
                        className="absolute end-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        {Icons.x({ className: 'h-4 w-4' })}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-900">
                  <p className="font-extrabold">
                    {t('services.resultsCount').replace('{count}', String(filteredServices.length))}
                  </p>
                  <p className="mt-1 text-cyan-900/80">{t('services.valueHint')}</p>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {showSkeleton
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={`svc-sk-${i}`} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" aria-hidden="true" />
                    ))
                  : filteredServices.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelected(s)}
                    className={`text-start rounded-2xl border border-transparent p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${s.bg_class} hover:border-black/5`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color_class} text-white grid place-items-center shadow-lg mb-4`}>
                      <ServiceGlyph iconKey={s.icon_key} className="h-7 w-7" />
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mb-2">{pickText(s.title, language)}</div>
                    <div className="text-sm text-slate-700/80 leading-relaxed line-clamp-3">{pickText(s.description, language)}</div>
                    <div className="mt-4 inline-flex items-center justify-center w-full rounded-xl bg-white/70 border border-white/70 hover:bg-white text-slate-900 font-extrabold px-4 h-11">
                      {t('services.request')}
                    </div>
                  </button>
                ))
                }
              </div>

              {/* How it works */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">{t('services.how.title')}</h2>
                    <p className="text-sm text-slate-600 mt-1">{t('services.how.subtitle')}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {steps.map((st) => (
                    <div key={st.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="text-sm font-extrabold text-slate-900">{st.title}</div>
                      <div className="mt-2 text-sm text-slate-600 leading-relaxed">{st.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-16 -start-16 h-48 w-48 bg-cyan-500 rounded-full blur-[70px]" />
                  <div className="absolute -bottom-16 -end-16 h-48 w-48 bg-blue-500 rounded-full blur-[70px]" />
                </div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-lg font-extrabold">{t('services.cta.title')}</div>
                    <div className="mt-1 text-sm text-white/75">{t('services.cta.subtitle')}</div>
                  </div>
                  <a
                    href="#footer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-5 h-11 font-extrabold hover:bg-slate-100"
                  >
                    {Icons.phone({ className: 'h-4 w-4' })}
                    {t('services.cta.contact')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical suppliers directory */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-blue-50 text-blue-700 p-3">
                  <ServiceGlyph iconKey="lab" className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{t('services.suppliers.title')}</h2>
                  <p className="mt-1 text-sm text-slate-600">{t('services.suppliers.subtitle')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {suppliers.map((s) => (
                <div key={s.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:shadow-md transition-shadow flex flex-col">
                  <div
                    className={`w-14 h-14 rounded-xl grid place-items-center mb-5 ${
                      s.tone === 'blue'
                        ? 'bg-blue-100 text-blue-700'
                        : s.tone === 'emerald'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    <ServiceGlyph iconKey="support" className="h-7 w-7" />
                  </div>

                  <div className="text-lg font-extrabold text-slate-900">{pickText(s.title, language)}</div>
                  <div className="mt-2 inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-700 border border-slate-200">
                    {pickText(s.type, language)}
                  </div>
                  <div className="mt-3 text-sm text-slate-600 leading-relaxed flex-grow">{pickText(s.desc, language)}</div>

                  <div className="mt-5 pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {Icons.pin({ className: 'h-4 w-4 text-slate-400' })}
                      <span className="truncate">{pickText(s.location, language)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600" dir="ltr">
                      {Icons.phone({ className: 'h-4 w-4 text-slate-400' })}
                      <span className="truncate">{s.phone}</span>
                    </div>

                    <a
                      className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-white border border-slate-200 px-4 h-11 text-sm font-extrabold text-slate-800 hover:bg-slate-100"
                      href={`tel:${s.phone}`}
                      aria-label={t('services.suppliers.call')}
                    >
                      {t('services.suppliers.call')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Health exhibitions agenda */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-sm overflow-hidden">
            <div className="px-6 py-6 border-b border-emerald-100/60">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white text-emerald-700 p-3 shadow-sm border border-emerald-100">
                  {Icons.globe({ className: 'h-7 w-7' })}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-emerald-950">{t('services.exhibitions.title')}</h2>
                  <p className="mt-1 text-sm text-emerald-900/70">{t('services.exhibitions.subtitle')}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { key: 'algeria', label: t('services.exhibitions.tabs.algeria') },
                  { key: 'arab', label: t('services.exhibitions.tabs.arab') },
                  { key: 'world', label: t('services.exhibitions.tabs.world') },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setExTab(tab.key)}
                    className={`rounded-xl px-4 h-10 text-sm font-extrabold border transition ${
                      exTab === tab.key
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white/80 text-emerald-900 border-emerald-100 hover:bg-white'
                    }`}
                    aria-pressed={exTab === tab.key}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {exhibitions.map((e) => (
                <div key={e.id} className="rounded-2xl bg-white p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-emerald-50 text-emerald-700 p-3">
                      {Icons.calendar({ className: 'h-6 w-6' })}
                    </div>
                    <span className="text-xs font-extrabold bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                      {pickText(e.date, language)}
                    </span>
                  </div>

                  <div className="mt-4 text-xl font-extrabold text-slate-900">{pickText(e.title, language)}</div>
                  <div className="mt-3 text-sm text-slate-600 leading-relaxed">{pickText(e.desc, language)}</div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-slate-600">
                    {Icons.pin({ className: 'h-4 w-4 text-emerald-500' })}
                    <span className="truncate">{pickText(e.location, language)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-emerald-700 font-extrabold hover:text-emerald-900"
              >
                {t('services.exhibitions.more')}
                <span aria-hidden="true">{isRTL ? '←' : '→'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? pickText(selected.title, language) : ''}
        closeLabel={t('services.modal.close')}
      >
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.color_class} text-white grid place-items-center shadow-lg`}>
                <ServiceGlyph iconKey={selected.icon_key} className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900">{t('services.modal.about')}</div>
                <div className="mt-1 text-sm text-slate-600 leading-relaxed">{pickText(selected.details, language)}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-extrabold text-slate-900 mb-3">{t('services.modal.features')}</div>
              <div className="space-y-2">
                {selected.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                      {Icons.check({ className: 'h-3 w-3' })}
                    </span>
                    <span className="leading-relaxed">{pickText(f, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 h-11 text-sm font-extrabold text-slate-800 hover:bg-slate-50"
              >
                {t('services.modal.close')}
              </button>
              <a
                href="#footer"
                onClick={() => setSelected(null)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 h-11 text-sm font-extrabold text-white hover:bg-cyan-700"
              >
                {Icons.phone({ className: 'h-4 w-4' })}
                {t('services.modal.contact')}
              </a>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}


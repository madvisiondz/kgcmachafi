import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { servicesPath } from '../routes/paths';
import { ApiError, submitContactMessage } from '../services';

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
  phone: (props) => (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" />
    </Icon>
  ),
  mail: (props) => (
    <Icon {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Icon>
  ),
  pin: (props) => (
    <Icon {...props}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  ),
  send: (props) => (
    <Icon {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </Icon>
  ),
};

export default function AboutContactPage() {
  const { t, dir, language } = useI18n();
  const location = useLocation();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (location.hash === '#contact') {
      window.setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    if (location.hash === '#about') {
      window.setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.hash, location.pathname]);

  async function onSubmit(e) {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    const subject = String(fd.get('subject') ?? '').trim() || t('about.contact.defaultSubject');
    const company = String(fd.get('company') ?? '').trim();

    if (import.meta.env.VITE_SETTINGS_API !== 'true') {
      setSent(true);
      window.setTimeout(() => setSent(false), 4000);
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage({ name, email, phone, subject, message, company });
      setSent(true);
      form.reset();
      window.setTimeout(() => setSent(false), 6000);
    } catch (err) {
      let msg = err instanceof Error ? err.message : String(err);
      if (err instanceof ApiError && err.body && typeof err.body === 'object' && err.body.error && typeof err.body.error.message === 'string') {
        msg = err.body.error.message;
      }
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-emerald-50/40" dir={dir}>
      <div className="container mx-auto px-4 py-10 md:py-14 max-w-4xl">
        {/* Press-style masthead */}
        <header id="about" className="border-b border-slate-200 pb-8 mb-10 scroll-mt-28">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">{t('about.press.kicker')}</p>
          <p className="mt-2 text-sm font-semibold text-slate-500">{t('about.press.dateline')}</p>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            {t('about.press.headline')}
          </h1>
          <p className="mt-4 text-lg md:text-xl font-medium text-slate-700 leading-relaxed">{t('about.press.subhead')}</p>
        </header>

        <article className="prose prose-slate max-w-none">
          <p className="text-base md:text-lg leading-relaxed text-slate-800 font-medium">{t('about.press.lead')}</p>
          <p className="mt-6 text-base leading-relaxed text-slate-700">{t('about.press.body1')}</p>
          <p className="mt-6 text-base leading-relaxed text-slate-700">{t('about.press.body2')}</p>

          <blockquote className="mt-10 border-s-4 border-emerald-600 bg-emerald-50/80 pl-6 pr-4 py-5 rounded-r-2xl not-italic">
            <p className="text-sm font-black uppercase tracking-wide text-emerald-900">{t('about.press.komasLabel')}</p>
            <p className="mt-2 text-base leading-relaxed text-slate-800">{t('about.press.komasBody')}</p>
          </blockquote>

          <p className="mt-8 text-sm leading-relaxed text-slate-500">{t('about.press.note')}</p>
        </article>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link
            to={servicesPath('/live')}
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-black text-white hover:bg-emerald-800"
          >
            {t('common.watchLive')}
          </Link>
          <Link
            to={servicesPath('/news')}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-900 hover:bg-slate-50"
          >
            {t('nav.news')}
          </Link>
        </div>

        {/* Contact — same page */}
        <section id="contact" className="mt-20 pt-12 border-t border-slate-200 scroll-mt-28">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">{t('about.contact.title')}</h2>
          <p className="mt-2 text-slate-600 max-w-2xl leading-relaxed">{t('about.contact.subtitle')}</p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Icons.phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t('common.phone')}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900" dir="ltr">
                    {t('footer.phone')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Icons.mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t('common.email')}</p>
                  <a className="mt-1 text-lg font-bold text-emerald-800 hover:underline break-all" href={`mailto:${t('footer.email')}`}>
                    {t('footer.email')}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Icons.pin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t('common.address')}</p>
                  <p className="mt-1 text-base font-semibold text-slate-800 leading-relaxed">{t('footer.address')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <form className="space-y-4 relative" onSubmit={onSubmit}>
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute start-0 top-0 h-px w-px overflow-hidden opacity-0"
                  aria-hidden="true"
                />
                <input type="hidden" name="subject" key={language} defaultValue={t('about.contact.defaultSubject')} />
                <div>
                  <label htmlFor="ac-name" className="block text-xs font-bold text-slate-600 mb-1">
                    {t('about.contact.formName')}
                  </label>
                  <input
                    id="ac-name"
                    name="name"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="ac-email" className="block text-xs font-bold text-slate-600 mb-1">
                    {t('about.contact.formEmail')}
                  </label>
                  <input
                    id="ac-email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label htmlFor="ac-phone" className="block text-xs font-bold text-slate-600 mb-1">
                    {t('about.contact.formPhone')}
                  </label>
                  <input
                    id="ac-phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label htmlFor="ac-msg" className="block text-xs font-bold text-slate-600 mb-1">
                    {t('about.contact.formMessage')}
                  </label>
                  <textarea
                    id="ac-msg"
                    name="message"
                    required
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-y min-h-[120px]"
                  />
                </div>
                {formError ? (
                  <p className="text-center text-sm font-bold text-rose-700" role="alert">
                    {formError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icons.send className="h-4 w-4" />
                  {submitting ? t('about.contact.formSending') : t('about.contact.formSubmit')}
                </button>
                {sent ? (
                  <p className="text-center text-sm font-bold text-emerald-700" role="status">
                    {import.meta.env.VITE_SETTINGS_API === 'true' ? t('about.contact.formThanksApi') : t('about.contact.formThanks')}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 text-center">{t('about.contact.formHint')}</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

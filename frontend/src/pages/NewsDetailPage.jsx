import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { getNewsArticleById } from '../data/news';

function pickText(text, language) {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[language] ?? text.en ?? text.ar ?? text.fr ?? '';
}

function formatTpl(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? String(vars[key]) : `{${key}}`));
}

function formatDate(iso, language) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-GB';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
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
  back: (props) => (
    <Icon {...props}>
      <path d="m15 18-6-6 6-6" />
    </Icon>
  ),
  share: (props) => (
    <Icon {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </Icon>
  ),
  print: (props) => (
    <Icon {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" />
    </Icon>
  ),
};

export default function NewsDetailPage() {
  const { id } = useParams();
  const { t, language, dir } = useI18n();
  const [toast, setToast] = useState('');

  const article = useMemo(() => getNewsArticleById(id), [id]);
  const url = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/news/${id}`;
  }, [id]);

  async function onShare() {
    setToast('');
    try {
      if (navigator.share) {
        await navigator.share({
          title: article ? pickText(article.title, language) : 'Machafi',
          text: article ? pickText(article.lead, language) : '',
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(t('newsroom.detail.copied'));
      window.setTimeout(() => setToast(''), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setToast(t('newsroom.detail.copied'));
        window.setTimeout(() => setToast(''), 2000);
      } catch {
        setToast(t('newsroom.detail.copyFailed'));
        window.setTimeout(() => setToast(''), 2500);
      }
    }
  }

  function onPrint() {
    window.print();
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-14" dir={dir}>
        <div className="max-w-2xl mx-auto rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="text-2xl font-black text-slate-900">{t('newsroom.detail.notFoundTitle')}</div>
          <div className="text-sm text-slate-600 mt-3">{t('newsroom.detail.notFoundDesc')}</div>
          <Link
            to="/news"
            className="inline-flex items-center justify-center mt-6 rounded-2xl bg-emerald-700 text-white px-5 py-3 text-sm font-black hover:bg-emerald-800"
          >
            {t('newsroom.detail.backToNews')}
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.body[language] ?? article.body.en ?? [];

  return (
    <div className="container mx-auto px-4 py-10" dir={dir}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-black text-emerald-800 hover:text-emerald-900"
        >
          <Icons.back className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          {t('newsroom.detail.back')}
        </Link>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-900 hover:bg-slate-50"
          >
            <Icons.share className="w-4 h-4" />
            {t('newsroom.detail.share')}
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-900 hover:bg-slate-50 print:hidden"
          >
            <Icons.print className="w-4 h-4" />
            {t('newsroom.detail.print')}
          </button>
        </div>
      </div>

      {toast ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-950 print:hidden">
          {toast}
        </div>
      ) : null}

      <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            {article.breaking && (
              <span className="inline-flex items-center rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-black text-white">
                {t('newsroom.card.breaking')}
              </span>
            )}
            {article.featured && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 text-[11px] font-black">
                {t('newsroom.card.featured')}
              </span>
            )}
            <span className="text-xs font-black text-slate-600">
              {t(`newsroom.sources.${article.sourceKey}`)} • {formatDate(article.date, language)}
            </span>
            <span className="text-xs font-black text-slate-500">
              • {formatTpl(t('newsroom.card.readingMinutes'), { minutes: String(article.readingMinutes) })}
            </span>
          </div>

          <h1 className="mt-5 text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            {pickText(article.title, language)}
          </h1>

          <p className="mt-4 text-lg text-slate-700 leading-relaxed">{pickText(article.lead, language)}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-[11px] font-black text-slate-500">{t('newsroom.detail.meta.tag')}</div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">{t(`newsroom.tags.${article.tagKey}`)}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-[11px] font-black text-slate-500">{t('newsroom.detail.meta.byline')}</div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">{t(`newsroom.byline.${article.bylineKey}`)}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-[11px] font-black text-slate-500">{t('newsroom.detail.meta.id')}</div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">#{article.id}</div>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-slate-800 leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-base">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-sm font-black text-amber-950">{t('newsroom.detail.disclaimerTitle')}</div>
            <div className="text-xs text-amber-950/85 mt-2 leading-relaxed">{t('newsroom.detail.disclaimerBody')}</div>
          </div>
        </div>
      </article>
    </div>
  );
}

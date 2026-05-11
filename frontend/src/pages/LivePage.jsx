import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { livePlayerSettingsMock, liveRecordedMock, liveUpNextMock } from '../data/live';

function formatTpl(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? String(vars[key]) : `{${key}}`));
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
  play: (props) => (
    <Icon {...props}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </Icon>
  ),
  max: (props) => (
    <Icon {...props}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </Icon>
  ),
  share: (props) => (
    <Icon {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </Icon>
  ),
  radio: (props) => (
    <Icon {...props}>
      <path d="M4.9 19.1A1 1 0 0 1 3.5 18" />
      <path d="M7.9 16.1a1 1 0 0 1-.6-1.8" />
      <path d="M11.6 13.6a1 1 0 0 1-.7-1.7" />
      <path d="M15.7 11.7a1 1 0 0 1-.9-1.9" />
      <path d="M19.6 9.6a1 1 0 0 1-.8-1.8" />
    </Icon>
  ),
  layout: (props) => (
    <Icon {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
    </Icon>
  ),
};

const CATEGORY_BG = {
  awareness: 'from-emerald-600 to-teal-500',
  nutrition: 'from-amber-500 to-orange-600',
  'mental-health': 'from-violet-600 to-indigo-600',
  family: 'from-sky-600 to-blue-600',
  emergency: 'from-rose-600 to-red-600',
  'chronic-care': 'from-fuchsia-600 to-pink-600',
};

function programTitle(t, programKey) {
  const v = t(`programs.items.${programKey}.title`);
  return v && !v.includes('programs.items') ? v : programKey;
}

function programDesc(t, programKey) {
  const v = t(`programs.items.${programKey}.desc`);
  return v && !v.includes('programs.items') ? v : '';
}

export default function LivePage() {
  const { t, dir } = useI18n();
  const cfg = livePlayerSettingsMock;
  const [tab, setTab] = useState('stream');
  /** Once true, keep the `<video>` mounted (native pause must not tear down the stage). */
  const [playerStarted, setPlayerStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [vodSrc, setVodSrc] = useState('');
  const [theater, setTheater] = useState(false);
  const [shareToast, setShareToast] = useState('');
  const stageRef = useRef(null);

  const onAir = cfg.broadcastState === 'live';
  const activeSrc = useMemo(() => vodSrc || cfg.streamUrl, [vodSrc, cfg.streamUrl]);

  const goBroadcast = useCallback(() => {
    setVodSrc('');
    setPlayerStarted(true);
    // Muted autoplay is the most reliable cross-browser default; viewers unmute via native controls.
    setMuted(true);
  }, []);

  const playVod = useCallback((item) => {
    setVodSrc(item.videoUrl);
    setPlayerStarted(true);
    setMuted(true);
    setTab('stream');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const backToPreview = useCallback(() => {
    setPlayerStarted(false);
    setVodSrc('');
    setMuted(true);
  }, []);

  const onShare = useCallback(async () => {
    setShareToast('');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'MACHAFI', text: t('live.share.subject'), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareToast(t('live.share.copied'));
      window.setTimeout(() => setShareToast(''), 2200);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setShareToast(t('live.share.copied'));
        window.setTimeout(() => setShareToast(''), 2200);
      } catch {
        setShareToast(t('live.share.failed'));
        window.setTimeout(() => setShareToast(''), 2500);
      }
    }
  }, [t]);

  const onFullscreen = useCallback(() => {
    const el = stageRef.current;
    if (!el?.requestFullscreen) return;
    el.requestFullscreen().catch(() => {});
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white" dir={dir}>
      <div className={`mx-auto px-4 py-8 transition-[max-width] duration-300 ${theater ? 'max-w-[min(1600px,100%)]' : 'max-w-6xl'}`}>
        {/* Top meta row — pro apps: status + signal strip */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-emerald-200/90">
              <Icons.radio className="w-3.5 h-3.5" />
              {t('live.hero.badge')}
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">{t('live.hero.title')}</h1>
            <p className="mt-2 text-slate-300 max-w-2xl leading-relaxed">{t('live.hero.subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {onAir ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-black uppercase tracking-wide shadow-lg shadow-rose-900/40 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-white" />
                {t('live.status.live')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1.5 text-xs font-black uppercase tracking-wide">
                {t('live.status.offline')}
              </span>
            )}
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200">
              {t('live.meta.viewers')}: {cfg.viewerCountLabel}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200">
              {t('live.meta.latency')}: {t('live.meta.latencyValue')}
            </span>
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
              {t('live.meta.quality')}: {t('live.meta.qualityAuto')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main stage */}
          <div className="xl:col-span-8 space-y-4">
            <div
              ref={stageRef}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/50 ring-1 ring-white/5"
            >
              <div className="relative aspect-video bg-black">
                {playerStarted && onAir ? (
                  <video
                    key={activeSrc}
                    className="h-full w-full object-contain"
                    src={activeSrc}
                    controls
                    autoPlay
                    playsInline
                    muted={muted}
                  />
                ) : (
                  <>
                    <img
                      src={cfg.posterUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    {onAir ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                        <button
                          type="button"
                          onClick={goBroadcast}
                          className="group inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-emerald-700 shadow-2xl ring-4 ring-white/20 transition hover:scale-105"
                          aria-label={t('live.player.goLive')}
                        >
                          <Icons.play className="h-9 w-9 translate-x-0.5" />
                        </button>
                        <p className="max-w-md text-sm font-semibold text-white/90">{t('live.player.tapToWatch')}</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                        <p className="text-lg font-black text-white">{t('live.offline.title')}</p>
                        <p className="max-w-md text-sm text-slate-300">{t('live.offline.body')}</p>
                        <Link
                          to="/programs"
                          className="inline-flex rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-black text-slate-950 hover:bg-emerald-400"
                        >
                          {t('live.scheduleCta')}
                        </Link>
                      </div>
                    )}
                    {onAir && (
                      <div className={`absolute top-3 flex gap-2 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          {t('live.status.live')}
                        </span>
                      </div>
                    )}
                  </>
                )}

              </div>

              <div className="border-t border-white/10 bg-slate-950/80 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h2 className="text-lg md:text-xl font-black text-white">{t('live.broadcast.title')}</h2>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">{t('live.broadcast.description')}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setTheater((v) => !v)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10"
                    >
                      <Icons.layout className="h-4 w-4" />
                      {theater ? t('live.player.defaultLayout') : t('live.player.theater')}
                    </button>
                    <button
                      type="button"
                      onClick={onShare}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10"
                    >
                      <Icons.share className="h-4 w-4" />
                      {t('live.share.button')}
                    </button>
                    {playerStarted ? (
                      <button
                        type="button"
                        onClick={backToPreview}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10"
                      >
                        {t('live.player.backToPreview')}
                      </button>
                    ) : null}
                    <Link
                      to="/programs"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400"
                    >
                      {t('live.scheduleCta')}
                    </Link>
                  </div>
                </div>
                {shareToast ? <p className="mt-3 text-xs font-bold text-emerald-300">{shareToast}</p> : null}
              </div>
            </div>

            {/* Tabs — legacy parity */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTab('stream')}
                  className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                    tab === 'stream' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {t('live.tabs.stream')}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('recorded')}
                  className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                    tab === 'recorded' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {t('live.tabs.recorded')}
                </button>
              </div>
            </div>

            {tab === 'recorded' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {liveRecordedMock.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => playVod(item)}
                    className="group text-left rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden hover:border-emerald-500/40 hover:bg-slate-900 transition"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br opacity-90 ${
                          CATEGORY_BG[item.category] || CATEGORY_BG.awareness
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/40 ring-2 ring-white/30 group-hover:scale-110 transition">
                          <Icons.play className="h-7 w-7 text-white translate-x-0.5" />
                        </span>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white">
                        {formatTpl(t('live.recorded.duration'), { min: String(item.durationMin) })}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-white group-hover:text-emerald-300 transition">
                        {programTitle(t, item.programKey)}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">{programDesc(t, item.programKey)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {tab === 'stream' && (
              <p className="text-center text-xs text-slate-500">{t('live.disclaimer')}</p>
            )}
          </div>

          {/* Sidebar — pro dashboards: queue + ops notes */}
          <aside className="xl:col-span-4 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-black uppercase tracking-wide text-emerald-300/90">{t('live.sidebar.upNext')}</h3>
              <ul className="mt-4 space-y-3">
                {liveUpNextMock.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{programTitle(t, row.programKey)}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{programDesc(t, row.programKey)}</div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-black text-emerald-200">
                      {row.startTime}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/programs"
                className="mt-4 block text-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-black text-emerald-200 hover:bg-emerald-500/20"
              >
                {t('live.scheduleCta')}
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <h3 className="text-sm font-black text-white">{t('live.sidebar.tipsTitle')}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{t('live.sidebar.tipsBody')}</p>
            </div>

            <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-5">
              <h3 className="text-sm font-black text-slate-300">{t('live.sidebar.chatTitle')}</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">{t('live.sidebar.chatPlaceholder')}</p>
            </div>

            <Link
              to="/library"
              className="block rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-900/40 to-slate-900 p-5 text-center text-sm font-black text-white hover:from-emerald-800/50"
            >
              {t('live.libraryCta')}
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

/**
 * When `collapsed` is true, the ticker animates to **true zero height** using CSS grid
 * `0fr` / `1fr` (same pattern as legacy `UrgentNewsBanner`).
 */
export default function NewsTicker({ collapsed = false }) {
  const { dir, t } = useI18n();

  const marqueeText = useMemo(() => t('ticker.marquee'), [t]);

  return (
    <div
      className={`relative z-[1] grid min-h-0 transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
        collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
      }`}
    >
      <div
        className={`min-h-0 overflow-hidden ${collapsed ? 'pointer-events-none' : ''}`}
        aria-hidden={collapsed}
      >
        <div className="bg-blue-700 text-white border-b border-blue-800 shadow-md">
          <div className="container mx-auto px-3 sm:px-4 py-1.5 sm:py-2">
            <div className="flex items-center gap-3 min-h-0">
              {/* LEFT: sliding text */}
              <div className="relative h-5 flex-1 overflow-hidden">
                <div
                  className={`absolute inset-y-0 flex items-center whitespace-nowrap will-change-transform ${
                    dir === 'rtl' ? 'kgc-marquee-rtl' : 'kgc-marquee-ltr'
                  }`}
                >
                  <span className="font-bold text-[11px] sm:text-xs md:text-sm inline-block px-2 tracking-wide text-white drop-shadow-md leading-none">
                    {marqueeText}
                    <span className="mx-8 text-blue-200">✦</span>
                    {marqueeText}
                    <span className="mx-8 text-blue-200">✦</span>
                    {marqueeText}
                  </span>
                </div>
              </div>

              {/* RIGHT: glowing headline */}
              <div className="shrink-0">
                <div className="kgc-glow inline-flex items-center rounded-full bg-blue-800/80 px-3 py-0.5 shadow-sm leading-none border border-white/10">
                  <span className="font-extrabold text-[10px] sm:text-xs tracking-wide text-yellow-200">
                    {t('ticker.headline')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


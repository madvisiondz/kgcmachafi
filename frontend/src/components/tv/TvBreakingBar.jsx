import { tvBreakingLines } from '../../data/tvMock';

/** @param {{ edition: import('../../routes/paths').TvEdition }} props */
export default function TvBreakingBar({ edition }) {
  const lines = tvBreakingLines[edition];
  const text = lines.join('   ·   ');
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white text-[12px] md:text-[13px] shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)]">
      <div className="container mx-auto px-4 flex items-center gap-3 min-h-[2.25rem]">
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm ring-1 ring-inset ring-white/15">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
          Live
        </span>
        <div className="flex-1 min-w-0 relative overflow-hidden">
          <div className="whitespace-nowrap animate-[tv-marquee_42s_linear_infinite] inline-block">
            <span className="pe-16 font-medium text-white/95">{text}</span>
            <span className="pe-16 font-medium text-white/95">{text}</span>
          </div>
          {/* Subtle fade edges */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-0 w-8 bg-gradient-to-r from-red-700 to-transparent"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 end-0 w-8 bg-gradient-to-l from-red-700 to-transparent"
          />
        </div>
      </div>
      <style>{`
        @keyframes tv-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        [dir="rtl"] .animate-\\[tv-marquee_42s_linear_infinite\\] {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}

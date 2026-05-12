import { tvBreakingLines } from '../../data/tvMock';

/** @param {{ edition: import('../../routes/paths').TvEdition }} props */
export default function TvBreakingBar({ edition }) {
  const lines = tvBreakingLines[edition];
  const text = lines.join('   •   ');
  return (
    <div className="bg-red-900 text-white text-xs md:text-sm overflow-hidden border-b border-red-950">
      <div className="flex items-center gap-3 min-h-[2.25rem] px-3 md:px-4">
        <span className="shrink-0 rounded bg-white/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">Live</span>
        <div className="flex-1 min-w-0 relative overflow-hidden">
          <div className="whitespace-nowrap animate-[tv-marquee_40s_linear_infinite] inline-block">
            <span className="pr-16">{text}</span>
            <span className="pr-16">{text}</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes tv-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

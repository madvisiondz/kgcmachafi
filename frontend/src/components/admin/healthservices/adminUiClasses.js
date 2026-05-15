/** Shared Tailwind class strings for Health Services admin UI (dark emerald theme) */

export const shell =
  'hsvc-admin-root hsvc-admin-bg machafi-subtle-emerald-bg machafi-soft-grid min-h-screen text-slate-100';

export const glassCard =
  'hsvc-glass machafi-card-depth machafi-emerald-border rounded-2xl border border-emerald-500/15 shadow-xl shadow-black/20';

export const section = `${glassCard} p-4 space-y-3`;

export const sidebar =
  'hsvc-sidebar hsvc-glass fixed inset-y-0 z-40 flex w-72 max-w-[88vw] flex-col border-e border-emerald-500/20 transition-transform duration-300 lg:static lg:translate-x-0';

export const sidebarBrand = 'text-sm font-black tracking-tight text-emerald-200';

export const sidebarSub = 'text-[10px] text-slate-400';

export const navLink = ({ isActive }) =>
  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
    isActive
      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40'
      : 'text-slate-200 hover:bg-emerald-950/60 hover:text-white'
  }`;

export const navGroupTitle =
  'px-3 text-[10px] font-black uppercase tracking-widest text-emerald-400/90';

export const topBar =
  'sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-emerald-500/15 hsvc-glass px-4';

export const main = 'flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto';

export const pageTitle = 'text-2xl font-black tracking-tight text-white';

export const pageSub = 'text-sm text-slate-300 mt-1';

export const sectionTitle = 'text-lg font-bold text-emerald-50';

export const btnPrimary =
  'hsvc-btn rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 disabled:text-white/80 transition-all';

export const btnGhost =
  'hsvc-btn rounded-xl border border-emerald-500/30 bg-emerald-950/50 px-4 py-2.5 text-sm font-semibold text-emerald-50 hover:bg-emerald-900/60 hover:text-white disabled:opacity-60 transition-colors';

export const btnDanger =
  'hsvc-btn rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-900/50 disabled:opacity-60';

export const btnSecondary =
  'hsvc-btn rounded-xl bg-slate-800/80 border border-slate-600/40 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-slate-700/80 disabled:opacity-60';

export const input =
  'hsvc-input w-full rounded-xl border border-emerald-500/25 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 disabled:text-slate-400 disabled:opacity-70 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25';

export const select = `${input} hsvc-select`;

export const textarea =
  'hsvc-input w-full min-h-[100px] rounded-xl border border-emerald-500/25 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 disabled:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25';

export const textareaMono = `${textarea} min-h-[240px] font-mono text-xs`;

export const tableWrap = `${glassCard} overflow-hidden overflow-x-auto`;

export const table = 'min-w-full text-sm';

export const tableHead = 'sticky top-0 z-10 bg-slate-900/98 text-emerald-100 backdrop-blur';

export const tableTh = 'text-start font-bold px-4 py-3 whitespace-nowrap text-xs uppercase tracking-wide text-emerald-100/95';

export const tableTd = 'px-4 py-3 align-top text-sm text-slate-200';

export const tableRow = 'border-t border-emerald-500/10 hover:bg-emerald-950/35 transition-colors';

export const emptyState = 'px-4 py-12 text-center text-slate-300 text-sm';

export const loadingState = 'px-4 py-12 text-center text-emerald-300/90 text-sm animate-pulse';

export const kpiCard =
  'hsvc-kpi-card hsvc-glass machafi-card-depth machafi-emerald-border block rounded-2xl p-4 border border-emerald-500/15 hover:border-emerald-400/40';

export const kpiLabel = 'text-xs font-bold uppercase tracking-wide text-emerald-200/90';

export const kpiValue = 'mt-1 text-3xl font-black text-white';

export const alertWarn =
  'rounded-2xl border border-amber-500/45 bg-amber-950/50 px-4 py-3 text-sm text-amber-100 font-medium';

export const fieldLabel = 'text-sm font-semibold text-slate-100';

export const fieldHelper = 'text-xs text-slate-400 leading-snug';

export const fieldError = 'text-xs text-red-300 font-medium';

export const mobileCard =
  'hsvc-glass rounded-xl border border-emerald-500/15 p-4 space-y-2 md:hidden';

export const muted = 'text-sm text-slate-300';

export const mutedXs = 'text-xs text-slate-400';

export const link = 'text-sm font-semibold text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline';

export const linkAction = 'text-sm font-bold text-emerald-300 hover:text-emerald-100';

export const linkDanger = 'text-sm font-bold text-red-300 hover:text-red-200';

export const tabActive = 'rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow';

export const tabInactive =
  'rounded-full border border-emerald-500/25 bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-emerald-950/50 hover:text-white';

export const paginationBar = 'border-t border-emerald-500/15 px-4 py-3 bg-slate-900/40';

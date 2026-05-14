import React from 'react'

/** Placeholder cards while directory / news lists load from the API. */
export default function ListGridSkeleton({ columnsClass = 'md:grid-cols-2 xl:grid-cols-3', count = 6 }) {
  return (
    <div className={`grid gap-4 ${columnsClass}`} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]"
        >
          <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-50" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-[68%] rounded-md bg-slate-200" />
            <div className="h-3 w-full rounded-md bg-slate-100" />
            <div className="h-3 w-[83%] rounded-md bg-slate-100" />
            <div className="mt-4 flex gap-2">
              <div className="h-9 flex-1 rounded-xl bg-slate-100" />
              <div className="h-9 w-24 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

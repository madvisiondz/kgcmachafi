import React from 'react'

/** Placeholder cards while directory / news lists load from the API. */
export default function ListGridSkeleton({ columnsClass = 'md:grid-cols-2 xl:grid-cols-3', count = 6 }) {
  return (
    <div className={`grid gap-4 ${columnsClass}`} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-28 bg-gradient-to-br from-slate-200 to-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
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

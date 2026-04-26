// Shared empty-state and loading-skeleton primitives. Use these across
// dashboard pages so loading/empty UX is consistent and intentional.

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Skeleton({ className = '', ...rest }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-800/60 ${className}`}
      {...rest}
    />
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-24" />
      <Skeleton className="mt-2 h-2 w-32" />
    </div>
  );
}

export function CardSkeleton({ rows = 3 }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
      <div className="grid grid-cols-5 gap-4 border-b border-gray-800 bg-gray-900/50 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid grid-cols-5 gap-4 border-b border-gray-800 p-4 last:border-0">
          {Array.from({ length: 5 }).map((_, c) => (
            <Skeleton key={c} className="h-3 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, primaryCta, secondaryCta }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-900/40 px-6 py-16 text-center">
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/40">
          <Icon className="h-6 w-6 text-emerald-400" />
        </div>
      )}
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-400 leading-relaxed">{description}</p>
      )}
      {(primaryCta || secondaryCta) && (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {primaryCta && (
            <Link
              to={primaryCta.to}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
            >
              {primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {secondaryCta && (
            <Link
              to={secondaryCta.to}
              className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:border-gray-600 hover:text-white transition"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong.', description, retry }) {
  return (
    <div className="rounded-2xl border border-red-900/30 bg-red-950/10 px-6 py-12 text-center">
      <h3 className="text-lg font-bold text-red-300">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-400">{description}</p>}
      {retry && (
        <button
          onClick={retry}
          className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
        >
          Try again
        </button>
      )}
    </div>
  );
}

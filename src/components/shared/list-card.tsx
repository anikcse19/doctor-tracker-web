import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Card wrapper for list pages: toolbar on top, thin progress bar while refetching. */
export function ListCard({
  toolbar,
  isFetching,
  children,
}: {
  toolbar?: ReactNode;
  isFetching?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="bg-card relative overflow-hidden rounded-xl border shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div
        aria-hidden="true"
        className={cn(
          'bg-primary/70 absolute inset-x-0 top-0 h-0.5 origin-left transition-opacity',
          isFetching ? 'animate-pulse opacity-100' : 'opacity-0',
        )}
      />
      {toolbar && <div className="border-b p-3 sm:p-4">{toolbar}</div>}
      {children}
    </section>
  );
}

export function TableSkeleton({ rows = 8, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="divide-y" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex items-center gap-4 px-4 py-3.5">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-40 max-w-full" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>
          {Array.from({ length: Math.max(0, columns - 2) }, (_, col) => (
            <Skeleton key={col} className="hidden h-3.5 w-24 md:block" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** "Showing results for…" + clear-all, shown only when filters are active. */
export function ActiveFilters({ count, onReset }: { count: number; onReset: () => void }) {
  if (count === 0) return null;
  return (
    <button
      type="button"
      onClick={onReset}
      className="text-primary hover:text-primary/80 h-9 shrink-0 rounded-md px-2 text-sm font-medium whitespace-nowrap"
    >
      Clear filters ({count})
    </button>
  );
}

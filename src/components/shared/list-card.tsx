import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Glass card for list pages: toolbar on top, animated progress line while refetching. */
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
    <section className="glass page-enter relative overflow-hidden rounded-2xl">
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent transition-opacity duration-300',
          isFetching ? 'animate-pulse opacity-100' : 'opacity-0',
        )}
      />
      {toolbar && <div className="border-b px-3 py-3 sm:px-4">{toolbar}</div>}
      {children}
    </section>
  );
}

export function TableSkeleton({ rows = 8, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="divide-y" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
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

/** Toolbar row layout shared by list pages: search left, chips middle, sort/reset right. */
export function ListToolbar({
  search,
  filters,
  end,
}: {
  search: ReactNode;
  filters: ReactNode;
  end: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="md:w-72">{search}</div>
      <div className="flex flex-1 flex-wrap items-center gap-1.5">{filters}</div>
      <div className="flex items-center gap-1 self-end md:self-auto">{end}</div>
    </div>
  );
}

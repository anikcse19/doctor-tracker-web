import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from './list-card';

export function ListPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="mb-6 flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="flex gap-2 border-b p-4">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="hidden h-9 w-40 sm:block" />
          <Skeleton className="hidden h-9 w-40 sm:block" />
        </div>
        <TableSkeleton />
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="bg-card flex items-center gap-4 rounded-xl border p-6">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

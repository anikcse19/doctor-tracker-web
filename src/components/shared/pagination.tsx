'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS } from '@/lib/constants';
import type { PaginationMeta } from '@/lib/api/types';
import { formatNumber } from '@/lib/format';

export function Pagination({
  meta,
  onPageChange,
  onLimitChange,
  isFetching,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isFetching?: boolean;
}) {
  const start = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
      <p className="text-muted-foreground text-sm" aria-live="polite">
        Showing <span className="text-foreground tabular font-medium">{formatNumber(start)}</span>–
        <span className="text-foreground tabular font-medium">{formatNumber(end)}</span> of{' '}
        <span className="text-foreground tabular font-medium">{formatNumber(meta.total)}</span>
      </p>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-muted-foreground text-sm">Rows</span>
          <Select value={String(meta.limit)} onValueChange={(value) => onLimitChange(Number(value))}>
            <SelectTrigger size="sm" className="w-[72px]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="tabular text-sm">
          Page {meta.page} of {meta.totalPages}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(meta.page - 1)}
            disabled={!meta.hasPrevPage || isFetching}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(meta.page + 1)}
            disabled={!meta.hasNextPage || isFetching}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

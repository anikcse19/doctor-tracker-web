'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TREND_RANGES = [
  { value: 30, label: '30D' },
  { value: 90, label: '90D' },
  { value: 180, label: '6M' },
] as const;

/** Range switcher: re-renders the server dashboard via the URL, inside a transition. */
export function RangeTabs({ current }: { current: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {pending && <Loader2 className="text-muted-foreground size-4 animate-spin" aria-label="Updating" />}
      <div role="tablist" aria-label="Trend range" className="bg-muted inline-flex rounded-lg p-0.5">
        {TREND_RANGES.map((range) => (
          <button
            key={range.value}
            role="tab"
            type="button"
            aria-selected={current === range.value}
            onClick={() =>
              startTransition(() => router.replace(`/dashboard?range=${range.value}`, { scroll: false }))
            }
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              current === range.value
                ? 'text-foreground bg-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatNumber } from '@/lib/format';
import { ChartEmpty } from './chart-card';

/**
 * Ranked horizontal bars as an HTML list: every value is direct-labelled (no hover needed to
 * read it), names stay legible at any length, and rows can be links.
 */
export function BarList({
  items,
  emptyMessage,
}: {
  items: { key: string; label: ReactNode; sublabel?: string; value: number; href?: string }[];
  emptyMessage?: string;
}) {
  if (items.length === 0) return <ChartEmpty message={emptyMessage} />;
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ol className="space-y-1">
      {items.map((item) => {
        const content = (
          <>
            <div className="relative min-w-0 flex-1">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-md bg-gradient-to-r from-teal-500/25 to-teal-500/5 dark:from-teal-400/25 dark:to-teal-400/5"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
              <div className="relative flex min-w-0 items-baseline gap-2 px-2.5 py-1.5">
                <span className="truncate text-sm font-medium">{item.label}</span>
                {item.sublabel && (
                  <span className="text-muted-foreground hidden truncate text-xs sm:inline">
                    {item.sublabel}
                  </span>
                )}
              </div>
            </div>
            <span className="tabular w-10 shrink-0 text-right text-sm font-semibold">
              {formatNumber(item.value)}
            </span>
          </>
        );
        return (
          <li key={item.key}>
            {item.href ? (
              <Link
                href={item.href}
                className="group hover:bg-muted/60 -mx-1 flex items-center gap-3 rounded-lg px-1 transition-colors"
              >
                {content}
              </Link>
            ) : (
              <div className="flex items-center gap-3">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

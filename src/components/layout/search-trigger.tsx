'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { openCommandMenu } from './command-menu';

export function SearchTrigger({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={openCommandMenu}
      aria-label="Search (Ctrl+K)"
      className={cn(
        'border-border bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring/60 flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors outline-none focus-visible:ring-2',
        compact && 'size-9 justify-center px-0',
        className,
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden="true" />
      {!compact && (
        <>
          <span className="flex-1 text-left">Search…</span>
          <kbd className="border-border bg-background/60 rounded border px-1.5 font-mono text-[10px] tracking-wider">
            Ctrl K
          </kbd>
        </>
      )}
    </button>
  );
}

'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-input bg-muted/50 focus-within:border-primary/50 focus-within:ring-ring/25 focus-within:bg-background/40 relative flex h-8 items-center rounded-lg border transition-all focus-within:ring-3',
        className,
      )}
    >
      <Search
        className="text-muted-foreground pointer-events-none ml-2.5 size-3.5 shrink-0"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={100}
        className="placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-muted-foreground hover:text-foreground hover:bg-muted mr-1 grid size-6 place-items-center rounded-md"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

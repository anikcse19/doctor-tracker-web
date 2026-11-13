'use client';

import { useId, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

/** Searchable single-select (Popover + cmdk) — replaces long native-style dropdowns. */
export function Combobox({
  id,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = 'Search…',
  invalid,
  disabled,
}: {
  id?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder: string;
  searchPlaceholder?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={invalid}
          disabled={disabled}
          className={cn(
            'border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex h-8 w-full items-center justify-between gap-2 rounded-lg border bg-transparent px-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50',
            !selected && 'text-muted-foreground',
          )}
        >
          <span className="truncate">
            {selected ? (
              <>
                {selected.label}
                {selected.hint && <span className="text-muted-foreground"> · {selected.hint}</span>}
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronsUpDown className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0" align="start">
        <Command className="bg-transparent">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList id={listId} className="max-h-64">
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.hint ?? ''}`}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'size-3.5',
                      option.value === value ? 'text-primary opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{option.label}</span>
                  {option.hint && (
                    <span className="text-muted-foreground ml-auto truncate text-xs">
                      {option.hint}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** Segmented single choice for small option sets (e.g. gender). Keyboard: arrow keys via radio group. */
export function SegmentedControl({
  id,
  value,
  onChange,
  options,
  invalid,
  label,
}: {
  id?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  invalid?: boolean;
  label: string;
}) {
  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={label}
      aria-invalid={invalid}
      className={cn(
        'border-input bg-muted/50 grid h-8 auto-cols-fr grid-flow-col gap-0.5 rounded-lg border p-0.5',
        invalid && 'border-destructive',
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'focus-visible:ring-ring/60 rounded-md text-[13px] font-medium transition-all outline-none focus-visible:ring-2',
              active
                ? 'bg-background text-foreground shadow-sm ring-1 ring-black/5 dark:bg-white/12 dark:ring-white/10'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { ArrowDownUp, CalendarDays, Check, CirclePlus, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SORT_OPTIONS, type SortOption } from '@/lib/constants';
import { cn } from '@/lib/utils';

/* Shared chip look: dashed when empty, solid & tinted when active. */
const chipClass = (active: boolean) =>
  cn(
    'h-8 gap-1.5 rounded-lg border px-2.5 text-[13px] font-medium shadow-none transition-colors',
    active
      ? 'border-primary/40 bg-accent text-accent-foreground hover:bg-accent/80'
      : 'text-muted-foreground hover:text-foreground border-dashed bg-transparent hover:bg-muted',
  );

function SelectedBadges({ values, labels }: { values: string[]; labels: Map<string, string> }) {
  if (values.length === 0) return null;
  return (
    <>
      <span className="bg-primary/30 mx-0.5 h-4 w-px" aria-hidden="true" />
      {values.length > 2 ? (
        <span className="bg-primary/15 rounded px-1.5 py-px text-xs">{values.length} selected</span>
      ) : (
        values.map((value) => (
          <span
            key={value}
            className="bg-primary/15 max-w-28 truncate rounded px-1.5 py-px text-xs"
          >
            {labels.get(value) ?? value}
          </span>
        ))
      )}
    </>
  );
}

/**
 * Faceted multi-select filter: a chip that opens a searchable checklist.
 * Selected values are shown inline on the chip; the API receives them as `a,b,c`.
 */
export function FacetedFilter({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const labels = new Map(options.map((option) => [option.value, option.label]));
  const selectedSet = new Set(selected);

  const toggle = (value: string) => {
    const next = new Set(selectedSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange([...next]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={chipClass(selected.length > 0)}>
          <CirclePlus className="size-3.5" aria-hidden="true" />
          {title}
          <SelectedBadges values={selected} labels={labels} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command className="bg-transparent">
          <CommandInput placeholder={`Filter ${title.toLowerCase()}…`} />
          <CommandList className="max-h-72">
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggle(option.value)}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input bg-transparent',
                      )}
                    >
                      {isSelected && <Check className="size-3" strokeWidth={3} />}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => onChange([])} className="justify-center text-center">
                    Clear {title.toLowerCase()}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const DATE_PRESETS = [
  { label: 'Today', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
] as const;

const toKey = (date: Date) => format(date, 'yyyy-MM-dd');

/** Creation-date range chip with presets + calendar. Values are local `yyyy-MM-dd` days. */
export function DateRangeChip({
  title,
  from,
  to,
  onChange,
}: {
  title: string;
  from: string | null;
  to: string | null;
  onChange: (range: { from: string | null; to: string | null }) => void;
}) {
  const [open, setOpen] = useState(false);
  const today = toKey(new Date());
  const preset = DATE_PRESETS.find(
    (item) => to === today && from === toKey(subDays(new Date(), item.days - 1)),
  );
  const selected: DateRange | undefined = from
    ? { from: parseISO(from), to: to ? parseISO(to) : undefined }
    : undefined;
  const summary = preset
    ? preset.label
    : from
      ? `${format(parseISO(from), 'd MMM')} – ${to ? format(parseISO(to), 'd MMM') : '…'}`
      : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={chipClass(!!from)}>
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {title}
          {summary && (
            <>
              <span className="bg-primary/30 mx-0.5 h-4 w-px" aria-hidden="true" />
              <span className="bg-primary/15 rounded px-1.5 py-px text-xs">{summary}</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-wrap gap-1 border-b p-2 sm:w-40 sm:flex-col sm:flex-nowrap sm:border-r sm:border-b-0">
            {DATE_PRESETS.map((item) => (
              <button
                key={item.days}
                type="button"
                onClick={() => {
                  onChange({ from: toKey(subDays(new Date(), item.days - 1)), to: today });
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm whitespace-nowrap transition-colors',
                  preset === item ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                )}
              >
                {item.label}
                {preset === item && <Check className="size-3.5" strokeWidth={2.5} />}
              </button>
            ))}
            {from && (
              <button
                type="button"
                onClick={() => {
                  onChange({ from: null, to: null });
                  setOpen(false);
                }}
                className="text-destructive hover:bg-destructive/10 rounded-md px-2.5 py-1.5 text-left text-sm sm:mt-auto"
              >
                Clear dates
              </button>
            )}
          </div>
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={selected}
            defaultMonth={selected?.from}
            disabled={{ after: new Date() }}
            className="bg-transparent"
            onSelect={(range) =>
              onChange({
                from: range?.from ? toKey(range.from) : null,
                to: range?.to ? toKey(range.to) : range?.from ? toKey(range.from) : null,
              })
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Compact sort menu. */
export function SortMenu({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  const current = SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-8 gap-1.5 px-2.5 text-[13px]"
        >
          <ArrowDownUp className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{current.label}</span>
          <span className="sr-only sm:hidden">Sort: {current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-muted-foreground text-xs">Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as SortOption)}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ResetFiltersButton({ count, onReset }: { count: number; onReset: () => void }) {
  if (count === 0) return null;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onReset}
      className="text-muted-foreground hover:text-foreground h-8 gap-1 px-2 text-[13px]"
    >
      Reset <X className="size-3.5" aria-hidden="true" />
    </Button>
  );
}

/** Converts local `yyyy-MM-dd` day keys to an inclusive ISO range for the API. */
export function toApiDateRange(from: string | null, to: string | null) {
  return {
    from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
    to: to ? new Date(`${to}T23:59:59.999`).toISOString() : undefined,
  };
}

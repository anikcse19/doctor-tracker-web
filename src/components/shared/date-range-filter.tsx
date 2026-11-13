'use client';

import { useState } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { CalendarDays, Check } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
] as const;

const toKey = (date: Date) => format(date, 'yyyy-MM-dd');

/** Creation-date range filter. Values are local calendar days as `yyyy-MM-dd` strings. */
export function DateRangeFilter({
  from,
  to,
  onChange,
  label = 'Created',
}: {
  from: string | null;
  to: string | null;
  onChange: (range: { from: string | null; to: string | null }) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected: DateRange | undefined = from
    ? { from: parseISO(from), to: to ? parseISO(to) : undefined }
    : undefined;

  const today = toKey(new Date());
  const activePreset = PRESETS.find(
    (preset) => to === today && from === toKey(subDays(new Date(), preset.days - 1)),
  );

  const summary = activePreset
    ? activePreset.label
    : from
      ? `${format(parseISO(from), 'd MMM')} – ${to ? format(parseISO(to), 'd MMM yyyy') : '…'}`
      : `${label}: any time`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-9 w-full justify-start bg-white font-normal',
            from ? 'border-primary/40 bg-accent/40' : 'text-muted-foreground',
          )}
          aria-label={`Filter by ${label.toLowerCase()} date`}
        >
          <CalendarDays className="text-muted-foreground" />
          <span className="truncate">{summary}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row gap-1 border-b p-2 sm:w-40 sm:flex-col sm:border-r sm:border-b-0">
            {PRESETS.map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => {
                  onChange({ from: toKey(subDays(new Date(), preset.days - 1)), to: today });
                  setOpen(false);
                }}
                className="hover:bg-muted flex items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm whitespace-nowrap"
              >
                {preset.label}
                {activePreset === preset && <Check className="text-primary size-4" strokeWidth={2.5} />}
              </button>
            ))}
            {from && (
              <button
                type="button"
                onClick={() => {
                  onChange({ from: null, to: null });
                  setOpen(false);
                }}
                className="text-destructive hover:bg-destructive/5 rounded-md px-2.5 py-1.5 text-left text-sm sm:mt-auto"
              >
                Clear
              </button>
            )}
          </div>
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={selected}
            defaultMonth={selected?.from}
            disabled={{ after: new Date() }}
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

/** Converts local `yyyy-MM-dd` day keys to an inclusive ISO range for the API. */
export function toApiDateRange(from: string | null, to: string | null) {
  return {
    from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
    to: to ? new Date(`${to}T23:59:59.999`).toISOString() : undefined,
  };
}

'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = '__all__';

/** Select for list filters. `null` = no filter ("All …"). */
export function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
  label,
  className,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  options: readonly { value: string; label: string }[];
  allLabel: string;
  label: string;
  className?: string;
}) {
  return (
    <Select value={value ?? ALL} onValueChange={(next) => onChange(next === ALL ? null : next)}>
      <SelectTrigger
        aria-label={label}
        className={cn('h-9 w-full bg-white data-[placeholder]:text-muted-foreground', value && 'border-primary/40 bg-accent/40', className)}
      >
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

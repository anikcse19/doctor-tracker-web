import { cn } from '@/lib/utils';
import { GENDER_LABELS, type Gender } from '@/lib/constants';
import { initials } from '@/lib/format';

/** Neutral pill for specialization — text carries meaning, not colour. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'bg-secondary text-secondary-foreground ring-border inline-flex max-w-full items-center truncate rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ConditionTag({ condition }: { condition: string }) {
  return (
    <Tag className="bg-accent text-accent-foreground ring-primary/20 gap-1.5">
      <span className="bg-primary size-1.5 shrink-0 rounded-full" aria-hidden="true" />
      {condition}
    </Tag>
  );
}

export function GenderLabel({ gender }: { gender: Gender }) {
  return <span className="text-muted-foreground text-sm">{GENDER_LABELS[gender]}</span>;
}

/** Deterministic gradient avatar so the same person always gets the same tile. */
const AVATAR_TINTS = [
  'from-teal-400/25 to-teal-600/10 text-teal-700 dark:text-teal-200',
  'from-sky-400/25 to-sky-600/10 text-sky-700 dark:text-sky-200',
  'from-indigo-400/25 to-indigo-600/10 text-indigo-700 dark:text-indigo-200',
  'from-amber-400/30 to-amber-600/10 text-amber-800 dark:text-amber-200',
  'from-rose-400/25 to-rose-600/10 text-rose-700 dark:text-rose-200',
  'from-emerald-400/25 to-emerald-600/10 text-emerald-700 dark:text-emerald-200',
];

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (
    <span
      aria-hidden="true"
      className={cn(
        'ring-border grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[11px] font-semibold ring-1',
        AVATAR_TINTS[hash % AVATAR_TINTS.length],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

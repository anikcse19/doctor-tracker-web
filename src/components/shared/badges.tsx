import { cn } from '@/lib/utils';
import { GENDER_LABELS, type Gender } from '@/lib/constants';
import { initials } from '@/lib/format';

/** Neutral pill for specialization / condition — text carries meaning, not color. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'bg-secondary text-secondary-foreground inline-flex max-w-full items-center truncate rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-black/5 ring-inset',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ConditionTag({ condition }: { condition: string }) {
  return <Tag className="bg-accent text-accent-foreground ring-primary/10">{condition}</Tag>;
}

export function GenderLabel({ gender }: { gender: Gender }) {
  return <span className="text-muted-foreground text-sm">{GENDER_LABELS[gender]}</span>;
}

/** Deterministic tinted avatar so the same person always gets the same tile. */
const AVATAR_TINTS = [
  'bg-teal-100 text-teal-800',
  'bg-sky-100 text-sky-800',
  'bg-indigo-100 text-indigo-800',
  'bg-amber-100 text-amber-900',
  'bg-rose-100 text-rose-800',
  'bg-emerald-100 text-emerald-800',
];

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold',
        AVATAR_TINTS[hash % AVATAR_TINTS.length],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

import { cn } from '@/lib/utils';

/** Brand mark: a pulse line inside a glowing gradient tile. */
export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid size-8 place-items-center rounded-[10px] bg-gradient-to-br from-teal-300 via-teal-500 to-emerald-700 shadow-[0_0_24px_-4px] ring-1 shadow-teal-500/60 ring-white/20">
        <svg viewBox="0 0 24 24" className="size-[18px] text-white" fill="none" aria-hidden="true">
          <path
            d="M3 12h4l2.5-6 4 12 2.5-6H21"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withText && (
        <span className="text-foreground text-[15px] font-semibold tracking-tight">
          Doctor<span className="text-primary">Tracker</span>
        </span>
      )}
    </span>
  );
}

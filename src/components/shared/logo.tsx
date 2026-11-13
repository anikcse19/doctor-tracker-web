import { cn } from '@/lib/utils';

/** Brand mark: a pulse line inside a rounded tile. */
export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-700 shadow-sm ring-1 ring-white/10">
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" aria-hidden="true">
          <path
            d="M3 12h4l2.5-6 4 12 2.5-6H21"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withText && (
        <span className="text-[15px] font-semibold tracking-tight">
          Doctor<span className="text-teal-500">Tracker</span>
        </span>
      )}
    </span>
  );
}

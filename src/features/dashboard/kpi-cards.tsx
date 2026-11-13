import { ArrowDownRight, ArrowUpRight, Building2, Sparkles, Stethoscope, UserRoundPlus, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DashboardStats } from '@/lib/api/types';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

export function KpiCards({ stats }: { stats: DashboardStats }) {
  const { totals, newPatients } = stats;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi
        icon={Users}
        label="Total patients"
        value={formatNumber(totals.patients)}
        footer={`${formatNumber(newPatients.last30Days)} registered in the last 30 days`}
        accent
      />
      <Kpi
        icon={Stethoscope}
        label="Total doctors"
        value={formatNumber(totals.doctors)}
        footer={
          <span className="inline-flex items-center gap-1">
            <Building2 className="size-3.5" aria-hidden="true" /> across {totals.hospitals} hospitals
          </span>
        }
      />
      <Kpi
        icon={UserRoundPlus}
        label="New patients · 30 days"
        value={formatNumber(newPatients.last30Days)}
        footer={<Delta changePct={newPatients.changePct} previous={newPatients.previous30Days} />}
      />
      <Kpi
        icon={Sparkles}
        label="Avg. patients per doctor"
        value={totals.avgPatientsPerDoctor.toFixed(1)}
        footer="Current caseload per doctor"
      />
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  footer,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  footer: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-5',
        accent ? 'border-transparent bg-gradient-to-br from-teal-700 to-teal-900 text-white' : 'bg-card',
      )}
    >
      {accent && (
        <div aria-hidden="true" className="absolute -top-10 -right-10 size-36 rounded-full bg-white/10 blur-2xl" />
      )}
      <div className="relative flex items-center justify-between">
        <p className={cn('text-sm font-medium', accent ? 'text-teal-50/90' : 'text-muted-foreground')}>{label}</p>
        <span
          className={cn(
            'grid size-8 place-items-center rounded-lg',
            accent ? 'bg-white/15 text-white' : 'bg-accent text-primary',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="relative mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <div className={cn('relative mt-1.5 text-xs', accent ? 'text-teal-50/80' : 'text-muted-foreground')}>
        {footer}
      </div>
    </div>
  );
}

/** Change vs. the previous 30 days — arrow + sign + text, so it never relies on color alone. */
function Delta({ changePct, previous }: { changePct: number | null; previous: number }) {
  if (changePct === null) return <span>No registrations in the previous 30 days</span>;
  const up = changePct >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold',
          up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
        )}
      >
        <Arrow className="size-3" aria-hidden="true" />
        {up ? '+' : ''}
        {changePct}%
      </span>
      vs. previous 30 days ({formatNumber(previous)})
    </span>
  );
}

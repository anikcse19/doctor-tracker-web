import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Gauge,
  Stethoscope,
  UserRoundPlus,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CountUp } from '@/components/shared/count-up';
import type { DashboardStats } from '@/lib/api/types';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

export function KpiCards({ stats }: { stats: DashboardStats }) {
  const { totals, newPatients, trend } = stats;
  const last30 = trend.unit === 'day' ? trend.points.slice(-30) : trend.points.slice(-5);

  return (
    <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Kpi
        icon={Users}
        label="Total patients"
        value={<CountUp value={totals.patients} />}
        footer={`${formatNumber(newPatients.last30Days)} registered in the last 30 days`}
        accent
        sparkline={last30.map((point) => point.count)}
      />
      <Kpi
        icon={Stethoscope}
        label="Total doctors"
        value={<CountUp value={totals.doctors} />}
        footer={
          <span className="inline-flex items-center gap-1">
            <Building2 className="size-3.5" aria-hidden="true" /> across {totals.hospitals}{' '}
            hospitals
          </span>
        }
      />
      <Kpi
        icon={UserRoundPlus}
        label="New patients · 30 days"
        value={<CountUp value={newPatients.last30Days} />}
        footer={<Delta changePct={newPatients.changePct} previous={newPatients.previous30Days} />}
      />
      <Kpi
        icon={Gauge}
        label="Avg. patients per doctor"
        value={<CountUp value={totals.avgPatientsPerDoctor} decimals={1} />}
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
  sparkline,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  footer: React.ReactNode;
  accent?: boolean;
  sparkline?: number[];
}) {
  return (
    <div
      className={cn(
        'glass-hover relative overflow-hidden rounded-2xl p-5',
        accent
          ? 'border border-teal-300/30 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-800 text-white shadow-[0_12px_40px_-12px] shadow-teal-500/50'
          : 'glass',
      )}
    >
      {accent && (
        <>
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-12 size-44 rounded-full bg-white/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 [background-image:radial-gradient(white_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom_left,black,transparent_60%)] [background-size:14px_14px] opacity-20"
          />
        </>
      )}
      <div className="relative flex items-center justify-between">
        <p
          className={cn(
            'text-[13px] font-medium',
            accent ? 'text-white/85' : 'text-muted-foreground',
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            'grid size-8 place-items-center rounded-lg',
            accent
              ? 'bg-white/15 text-white ring-1 ring-white/20'
              : 'bg-accent text-primary ring-primary/15 ring-1',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <p className="text-[32px] leading-none font-semibold tracking-tight">{value}</p>
        {sparkline && sparkline.length > 1 && <Sparkline values={sparkline} />}
      </div>
      <div
        className={cn(
          'relative mt-2.5 text-xs',
          accent ? 'text-white/80' : 'text-muted-foreground',
        )}
      >
        {footer}
      </div>
    </div>
  );
}

/** Tiny decorative trend line (the full, labelled chart is below). */
function Sparkline({ values }: { values: number[] }) {
  const width = 96;
  const height = 32;
  const max = Math.max(...values, 1);
  const step = width / (values.length - 1);
  const points = values.map(
    (value, index) => [index * step, height - (value / max) * (height - 4) - 2] as const,
  );
  const line = points
    .map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${width},${height} L0,${height} Z`} fill="url(#spark-fill)" />
      <path
        d={line}
        fill="none"
        stroke="white"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Change vs. the previous 30 days — arrow + sign + text, so it never relies on colour alone. */
function Delta({ changePct, previous }: { changePct: number | null; previous: number }) {
  if (changePct === null) return <span>No registrations in the previous 30 days</span>;
  const up = changePct >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold ring-1',
          up
            ? 'bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300'
            : 'bg-red-500/12 text-red-700 ring-red-500/25 dark:text-red-300',
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

import { GENDER_LABELS, GENDERS } from '@/lib/constants';
import type { DashboardStats } from '@/lib/api/types';
import { formatNumber } from '@/lib/format';
import { ChartEmpty } from './chart-card';

/** Categorical slots 1–3 in fixed order (validated palette); each segment is also labelled. */
const GENDER_COLORS = {
  male: 'var(--chart-1)',
  female: 'var(--chart-2)',
  other: 'var(--chart-3)',
} as const;

export function GenderSplit({ data }: { data: DashboardStats['genders'] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) return <ChartEmpty />;

  const rows = GENDERS.map((gender) => {
    const count = data.find((item) => item.gender === gender)?.count ?? 0;
    return { gender, count, pct: (count / total) * 100 };
  }).filter((row) => row.count > 0);

  return (
    <div className="space-y-4">
      <div
        className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full"
        role="img"
        aria-label={rows
          .map((row) => `${GENDER_LABELS[row.gender]} ${row.pct.toFixed(0)}%`)
          .join(', ')}
      >
        {rows.map((row) => (
          <div
            key={row.gender}
            title={`${GENDER_LABELS[row.gender]}: ${formatNumber(row.count)} (${row.pct.toFixed(1)}%)`}
            style={{ width: `${row.pct}%`, background: GENDER_COLORS[row.gender] }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {rows.map((row) => (
          <li key={row.gender} className="min-w-0">
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: GENDER_COLORS[row.gender] }}
              />
              {GENDER_LABELS[row.gender]}
            </p>
            <p className="mt-0.5 text-sm font-semibold">
              {row.pct.toFixed(0)}%
              <span className="text-muted-foreground tabular ml-1 text-xs font-normal">
                ({formatNumber(row.count)})
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

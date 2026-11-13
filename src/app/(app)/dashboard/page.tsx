import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { serverGet } from '@/lib/api/server';
import type { DashboardStats } from '@/lib/api/types';
import { formatNumber } from '@/lib/format';
import { BarList } from '@/features/dashboard/bar-list';
import { ChartCard } from '@/features/dashboard/chart-card';
import { AgeDistributionChart, RegistrationTrendChart, SpecializationChart } from '@/features/dashboard/charts';
import { GenderSplit } from '@/features/dashboard/gender-split';
import { KpiCards } from '@/features/dashboard/kpi-cards';
import { RangeTabs, TREND_RANGES } from '@/features/dashboard/range-tabs';
import { RecentPatients } from '@/features/dashboard/recent-patients';

export const metadata: Metadata = { title: 'Dashboard' };

/**
 * The page shell (header) is static and prerendered; everything that needs the session or
 * the `range` search param streams in behind Suspense, so the frame paints instantly.
 */
export default function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {
  return (
    <>
      <PageHeader title="Dashboard" description="Live overview of your care network — all figures computed from current records." />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function DashboardContent({ searchParams }: { searchParams: PageProps<'/dashboard'>['searchParams'] }) {
  const { range: rawRange } = await searchParams;
  const range = TREND_RANGES.find((r) => String(r.value) === rawRange)?.value ?? 90;
  const stats = await serverGet<DashboardStats>(`/dashboard/stats?range=${range}`);
  const trendTotal = stats.trend.points.reduce((sum, point) => sum + point.count, 0);

  return (
    <div className="space-y-4">
      <KpiCards stats={stats} />

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Patient registrations"
          description={
            <>
              <span className="text-foreground tabular font-semibold">{formatNumber(trendTotal)}</span> new patients
              in the last {range === 180 ? '6 months' : `${range} days`} · {stats.trend.unit === 'week' ? 'weekly' : 'daily'}
            </>
          }
          action={<RangeTabs current={range} />}
        >
          <RegistrationTrendChart trend={stats.trend} />
        </ChartCard>

        <ChartCard title="Recent registrations" description="Latest patients added to the system">
          <RecentPatients patients={stats.recentPatients} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Patients per doctor" description="Doctors with the highest current caseload">
          <BarList
            emptyMessage="No patients assigned yet"
            items={stats.topDoctors.map((doctor) => ({
              key: doctor.doctorId,
              label: doctor.name,
              sublabel: doctor.specialization,
              value: doctor.count,
              href: `/doctors/${doctor.doctorId}`,
            }))}
          />
        </ChartCard>

        <ChartCard title="Doctors by specialization" description={`${stats.totals.doctors} doctors across ${stats.specializations.length} specialties`}>
          <SpecializationChart data={stats.specializations} />
        </ChartCard>

        <ChartCard title="Top medical conditions" description="Most common primary diagnoses" className="lg:col-span-2 xl:col-span-1">
          <BarList
            emptyMessage="No conditions recorded yet"
            items={stats.conditions.map((item) => ({
              key: item.condition,
              label: item.condition,
              value: item.count,
              href: `/patients?condition=${encodeURIComponent(item.condition)}`,
            }))}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Patient demographics" description="Gender split across all patients">
          <GenderSplit data={stats.genders} />
          <div className="mt-6 border-t pt-5">
            <p className="mb-3 text-sm font-medium">Age distribution</p>
            <AgeDistributionChart data={stats.ageGroups} />
          </div>
        </ChartCard>
        <ChartCard title="Care network at a glance" description="Derived from current records">
          <NetworkFacts stats={stats} />
        </ChartCard>
      </div>
    </div>
  );
}

function NetworkFacts({ stats }: { stats: DashboardStats }) {
  const busiest = stats.topDoctors[0];
  const topSpecialty = stats.specializations[0];
  const topCondition = stats.conditions[0];
  const largestAgeGroup = stats.ageGroups.reduce((a, b) => (b.count > a.count ? b : a), stats.ageGroups[0]!);
  const share = (n: number) => (stats.totals.patients ? Math.round((n / stats.totals.patients) * 100) : 0);

  const facts = [
    busiest && { label: 'Highest caseload', value: busiest.name, detail: `${busiest.count} patients · ${busiest.specialization}` },
    topSpecialty && { label: 'Largest specialty', value: topSpecialty.specialization, detail: `${topSpecialty.count} doctors` },
    topCondition && { label: 'Most common condition', value: topCondition.condition, detail: `${topCondition.count} patients · ${share(topCondition.count)}% of all` },
    largestAgeGroup && largestAgeGroup.count > 0 && { label: 'Largest age group', value: `${largestAgeGroup.label} years`, detail: `${share(largestAgeGroup.count)}% of patients` },
    { label: 'Hospitals represented', value: String(stats.totals.hospitals), detail: 'Distinct hospitals with registered doctors' },
  ].filter(Boolean) as { label: string; value: string; detail: string }[];

  return (
    <dl className="divide-y">
      {facts.map((fact) => (
        <div key={fact.label} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <dt className="text-muted-foreground text-sm">{fact.label}</dt>
          <dd className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold">{fact.value}</p>
            <p className="text-muted-foreground truncate text-xs">{fact.detail}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[124px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-[372px] rounded-xl xl:col-span-2" />
        <Skeleton className="h-[372px] rounded-xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[360px] rounded-xl" />
        <Skeleton className="h-[360px] rounded-xl" />
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
    </div>
  );
}

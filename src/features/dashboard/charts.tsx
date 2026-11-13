'use client';

import { format, parseISO } from 'date-fns';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { DashboardStats } from '@/lib/api/types';
import { ChartEmpty } from './chart-card';

/*
 * Chart conventions (dataviz checklist): single-series magnitude → one brand hue; 2px lines;
 * rounded data-ends anchored to the baseline; recessive dashed grid; hover tooltip on every
 * chart; text stays in ink tokens, never series colors.
 */

const AXIS_TICK = { fill: 'var(--chart-axis)', fontSize: 12 };

const trendConfig = {
  count: { label: 'Registrations', color: 'var(--chart-brand)' },
} satisfies ChartConfig;

export function RegistrationTrendChart({ trend }: { trend: DashboardStats['trend'] }) {
  if (trend.points.every((point) => point.count === 0)) {
    return <ChartEmpty message="No registrations in this period" />;
  }

  const tickFormat = (value: string) => format(parseISO(value), 'd MMM');
  const labelFormat = (value: string) =>
    trend.unit === 'week'
      ? `Week of ${format(parseISO(value), 'd MMM yyyy')}`
      : format(parseISO(value), 'EEE, d MMM yyyy');

  return (
    <ChartContainer config={trendConfig} className="aspect-auto h-[280px] w-full">
      <AreaChart data={trend.points} margin={{ left: -12, right: 8, top: 8 }} accessibilityLayer>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-count)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--color-count)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={36}
          tickFormatter={tickFormat}
          tick={AXIS_TICK}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={44}
          tick={AXIS_TICK}
        />
        <ChartTooltip
          cursor={{ stroke: 'var(--chart-axis)', strokeWidth: 1, strokeDasharray: '4 4' }}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(value) => labelFormat(String(value))}
            />
          }
        />
        <Area
          dataKey="count"
          type="monotone"
          stroke="var(--color-count)"
          strokeWidth={2}
          fill="url(#trendFill)"
          activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--card)' }}
          animationDuration={600}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const doctorsConfig = {
  count: { label: 'Doctors', color: 'var(--chart-brand)' },
} satisfies ChartConfig;

export function SpecializationChart({ data }: { data: DashboardStats['specializations'] }) {
  if (data.length === 0) return <ChartEmpty message="No doctors registered yet" />;

  return (
    <ChartContainer
      config={doctorsConfig}
      className="aspect-auto w-full"
      style={{ height: Math.max(220, data.length * 26 + 16) }}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 16 }}
        barCategoryGap={4}
        accessibilityLayer
      >
        <CartesianGrid horizontal={false} stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
        />
        <YAxis
          type="category"
          dataKey="specialization"
          tickLine={false}
          axisLine={false}
          width={150}
          interval={0}
          tick={{ ...AXIS_TICK, fill: 'var(--muted-foreground)' }}
        />
        <ChartTooltip
          cursor={{ fill: 'var(--muted)' }}
          content={<ChartTooltipContent hideIndicator />}
        />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[0, 4, 4, 0]}
          maxBarSize={16}
          animationDuration={600}
        />
      </BarChart>
    </ChartContainer>
  );
}

const ageConfig = {
  count: { label: 'Patients', color: 'var(--chart-brand)' },
} satisfies ChartConfig;

export function AgeDistributionChart({ data }: { data: DashboardStats['ageGroups'] }) {
  if (data.every((group) => group.count === 0)) return <ChartEmpty />;

  return (
    <ChartContainer config={ageConfig} className="aspect-auto h-[200px] w-full">
      <BarChart
        data={data}
        margin={{ left: -16, right: 4, top: 8 }}
        barCategoryGap="18%"
        accessibilityLayer
      >
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={AXIS_TICK} />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={44}
          tick={AXIS_TICK}
        />
        <ChartTooltip
          cursor={{ fill: 'var(--muted)' }}
          content={<ChartTooltipContent hideIndicator labelFormatter={(label) => `Age ${label}`} />}
        />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
          animationDuration={600}
        />
      </BarChart>
    </ChartContainer>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('glass flex flex-col rounded-2xl p-5', className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-muted-foreground mt-0.5 text-[13px]">{description}</p>}
        </div>
        {action}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function ChartEmpty({ message = 'No data yet' }: { message?: string }) {
  return (
    <div className="text-muted-foreground grid h-full min-h-40 place-items-center rounded-xl border border-dashed text-sm">
      {message}
    </div>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm font-medium"
    >
      <ArrowLeft className="size-4" aria-hidden="true" /> {children}
    </Link>
  );
}

export function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="bg-muted text-muted-foreground grid size-8 shrink-0 place-items-center rounded-lg">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-muted-foreground text-xs">{label}</dt>
        <dd className="truncate text-sm font-medium">{children}</dd>
      </div>
    </div>
  );
}

export function MiniStat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="glass glass-hover rounded-2xl p-4">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        {label}
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <p className="mt-2 truncate text-xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="text-muted-foreground mt-0.5 truncate text-xs">{hint}</p>}
    </div>
  );
}

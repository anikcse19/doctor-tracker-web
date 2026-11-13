import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div className="page-enter mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        {eyebrow}
        <h1 className="from-foreground to-foreground/70 bg-gradient-to-br bg-clip-text text-[26px] leading-tight font-semibold tracking-tight text-balance text-transparent">
          {title}
        </h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Small pill above a page title, e.g. "● Live data". */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="border-primary/25 bg-accent text-accent-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
      <span className="relative flex size-1.5">
        <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none" />
        <span className="bg-primary relative inline-flex size-1.5 rounded-full" />
      </span>
      {children}
    </span>
  );
}

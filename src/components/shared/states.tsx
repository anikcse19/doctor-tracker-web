import type { ReactNode } from 'react';
import { AlertTriangle, RotateCw, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api/errors';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="bg-accent text-primary ring-primary/10 mb-4 grid size-12 place-items-center rounded-full ring-8">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm text-balance">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="bg-destructive/10 text-destructive mb-4 grid size-12 place-items-center rounded-full">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold">Couldn&apos;t load this data</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        {getErrorMessage(error, 'An unexpected error occurred.')}
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCw /> Try again
        </Button>
      )}
    </div>
  );
}

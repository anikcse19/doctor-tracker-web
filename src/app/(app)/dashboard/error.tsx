'use client';

import { ErrorState } from '@/components/shared/states';
import { ApiError } from '@/lib/api/errors';

const dashboardError = new ApiError(
  503,
  'DASHBOARD_UNAVAILABLE',
  'The dashboard could not be loaded. The server may be waking up — please try again.',
);

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="bg-card rounded-xl border">
      <ErrorState error={dashboardError} onRetry={reset} />
    </div>
  );
}

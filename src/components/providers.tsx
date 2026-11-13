'use client';

import { useState, type ReactNode } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ApiError } from '@/lib/api/errors';

/** Any 401 from the API means the session is gone → send the user to sign in again. */
function handleUnauthorized(error: unknown) {
  if (error instanceof ApiError && error.isUnauthorized && window.location.pathname !== '/login') {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    // Intentionally a full reload (not router.push): it discards every in-memory React/query
    // state so no patient data from the expired session survives.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?session=expired&next=${next}`);
  }
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleUnauthorized }),
    mutationCache: new MutationCache({ onError: handleUnauthorized }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Retry transient failures (e.g. a cold-starting server), never auth/validation errors.
        retry: (failureCount, error) =>
          failureCount < 2 && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  // One client per browser session (useState keeps it stable across re-renders).
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </TooltipProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { Admin } from '@/lib/api/types';

export const authKeys = { me: ['auth', 'me'] as const };

export function useCurrentAdmin() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: ({ signal }) => api.get<{ admin: Admin }>('/auth/me', undefined, signal),
    select: (data) => data.admin,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.post<{ admin: Admin }>('/auth/login', credentials),
    onSuccess: (data) => queryClient.setQueryData(authKeys.me, data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => api.post<void>('/auth/logout'),
    onSettled: () => {
      // Drop every cached record so no patient data survives in memory after sign-out.
      queryClient.clear();
      router.replace('/login');
      toast.success('You have been signed out');
    },
  });
}

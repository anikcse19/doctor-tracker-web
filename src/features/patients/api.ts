'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Patient } from '@/lib/api/types';
import { doctorKeys } from '@/features/doctors/api';
import type { PatientEditValues } from './schema';

type Query = Record<string, string | number | undefined | null>;

export const patientKeys = {
  all: ['patients'] as const,
  list: (query: Query) => [...patientKeys.all, 'list', query] as const,
  detail: (id: string) => [...patientKeys.all, 'detail', id] as const,
  conditions: () => [...patientKeys.all, 'conditions'] as const,
};

export function usePatients(query: Query) {
  return useQuery({
    queryKey: patientKeys.list(query),
    queryFn: ({ signal }) => api.getPaginated<Patient>('/patients', query, signal),
    placeholderData: keepPreviousData,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: ({ signal }) => api.get<Patient>(`/patients/${id}`, undefined, signal),
  });
}

export function useConditions() {
  return useQuery({
    queryKey: patientKeys.conditions(),
    queryFn: ({ signal }) => api.get<string[]>('/patients/conditions', undefined, signal),
    staleTime: 5 * 60_000,
  });
}

/** Patient changes affect doctor counts/stats too, so both trees are invalidated. */
function useInvalidateCareData() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: patientKeys.all }),
      queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
    ]);
}

export function useUpdatePatient(id: string) {
  const invalidate = useInvalidateCareData();
  return useMutation({
    mutationFn: (values: Partial<PatientEditValues>) =>
      api.patch<Patient>(`/patients/${id}`, values),
    onSuccess: invalidate,
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateCareData();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/patients/${id}`),
    onSuccess: (_data, id) => {
      // Drop the deleted record's detail so it isn't refetched (and 404'd) mid-navigation.
      queryClient.removeQueries({ queryKey: patientKeys.detail(id) });
      return invalidate();
    },
  });
}

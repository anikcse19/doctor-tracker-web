'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { DoctorDetail, DoctorListItem, DoctorOption, Doctor, Patient } from '@/lib/api/types';
import type { DoctorFormValues } from './schema';
import type { PatientFormValues } from '@/features/patients/schema';

type Query = Record<string, string | number | undefined | null>;

/** Hierarchical keys: invalidating ['doctors'] refreshes every doctor list, detail and option. */
export const doctorKeys = {
  all: ['doctors'] as const,
  list: (query: Query) => [...doctorKeys.all, 'list', query] as const,
  detail: (id: string) => [...doctorKeys.all, 'detail', id] as const,
  patients: (id: string, query: Query) => [...doctorKeys.all, 'detail', id, 'patients', query] as const,
  options: () => [...doctorKeys.all, 'options'] as const,
  hospitals: () => [...doctorKeys.all, 'hospitals'] as const,
};

export function useDoctors(query: Query) {
  return useQuery({
    queryKey: doctorKeys.list(query),
    queryFn: ({ signal }) => api.getPaginated<DoctorListItem>('/doctors', query, signal),
    // Keep showing the current page while the next one loads — no table flicker.
    placeholderData: keepPreviousData,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: ({ signal }) => api.get<DoctorDetail>(`/doctors/${id}`, undefined, signal),
  });
}

export function useDoctorPatients(id: string, query: Query) {
  return useQuery({
    queryKey: doctorKeys.patients(id, query),
    queryFn: ({ signal }) => api.getPaginated<Patient>(`/doctors/${id}/patients`, query, signal),
    placeholderData: keepPreviousData,
  });
}

export function useDoctorOptions(enabled = true) {
  return useQuery({
    queryKey: doctorKeys.options(),
    queryFn: ({ signal }) => api.get<DoctorOption[]>('/doctors/options', undefined, signal),
    staleTime: 5 * 60_000,
    enabled,
  });
}

export function useHospitals() {
  return useQuery({
    queryKey: doctorKeys.hospitals(),
    queryFn: ({ signal }) => api.get<string[]>('/doctors/hospitals', undefined, signal),
    staleTime: 5 * 60_000,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: DoctorFormValues) => api.post<DoctorListItem>('/doctors', values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
  });
}

export function useUpdateDoctor(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<DoctorFormValues>) => api.patch<Doctor>(`/doctors/${id}`, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
  });
}

export function useAddPatientToDoctor(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PatientFormValues) => api.post<Patient>(`/doctors/${doctorId}/patients`, values),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
      ]),
  });
}

export function useRemoveDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => api.delete(`/doctors/${doctorId}/patients/${patientId}`),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
      ]),
  });
}

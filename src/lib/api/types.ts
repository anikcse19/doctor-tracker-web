import type { Gender, Specialization } from '@/lib/constants';

/** Mirrors the backend response envelope and resource shapes. */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: Specialization;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorListItem extends Doctor {
  patientCount: number;
}

export interface DoctorDetail extends Doctor {
  stats: {
    patientCount: number;
    topConditions: { condition: string; count: number }[];
    genders: { gender: Gender; count: number }[];
    lastPatientAt: string | null;
  };
}

export interface DoctorOption {
  _id: string;
  name: string;
  specialization: Specialization;
}

export type DoctorSummary = Pick<Doctor, '_id' | 'name' | 'specialization' | 'hospital'> &
  Partial<Pick<Doctor, 'phone' | 'email'>>;

export interface Patient {
  _id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email?: string;
  condition: string;
  notes?: string;
  doctor: DoctorSummary;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totals: { doctors: number; patients: number; hospitals: number; avgPatientsPerDoctor: number };
  newPatients: { last30Days: number; previous30Days: number; changePct: number | null };
  trend: { rangeDays: number; unit: 'day' | 'week'; points: { date: string; count: number }[] };
  specializations: { specialization: Specialization; count: number }[];
  topDoctors: { doctorId: string; name: string; specialization: Specialization; count: number }[];
  conditions: { condition: string; count: number }[];
  genders: { gender: Gender; count: number }[];
  ageGroups: { label: string; count: number }[];
  recentPatients: (Pick<
    Patient,
    '_id' | 'name' | 'gender' | 'condition' | 'dateOfBirth' | 'createdAt'
  > & {
    doctor: Pick<Doctor, '_id' | 'name' | 'specialization'>;
  })[];
}

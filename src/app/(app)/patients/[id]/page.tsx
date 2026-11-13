import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PatientDetailView } from '@/features/patients/patient-detail-view';
import { DetailPageSkeleton } from '@/components/shared/page-skeletons';

export const metadata: Metadata = { title: 'Patient record' };

export default function PatientDetailPage() {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <PatientDetailView />
    </Suspense>
  );
}

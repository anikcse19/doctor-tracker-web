import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PatientsView } from '@/features/patients/patients-view';
import { ListPageSkeleton } from '@/components/shared/page-skeletons';

export const metadata: Metadata = { title: 'Patients' };

export default function PatientsPage() {
  return (
    <Suspense fallback={<ListPageSkeleton />}>
      <PatientsView />
    </Suspense>
  );
}

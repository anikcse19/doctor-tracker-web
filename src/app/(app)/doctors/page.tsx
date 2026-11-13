import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DoctorsView } from '@/features/doctors/doctors-view';
import { ListPageSkeleton } from '@/components/shared/page-skeletons';

export const metadata: Metadata = { title: 'Doctors' };

export default function DoctorsPage() {
  return (
    <Suspense fallback={<ListPageSkeleton />}>
      <DoctorsView />
    </Suspense>
  );
}

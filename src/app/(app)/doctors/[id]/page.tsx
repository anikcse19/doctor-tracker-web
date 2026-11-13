import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DoctorDetailView } from '@/features/doctors/doctor-detail-view';
import { DetailPageSkeleton } from '@/components/shared/page-skeletons';

export const metadata: Metadata = { title: 'Doctor profile' };

export default function DoctorDetailPage() {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <DoctorDetailView />
    </Suspense>
  );
}

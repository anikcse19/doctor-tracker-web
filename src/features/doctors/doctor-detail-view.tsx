'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Activity,
  Building2,
  CalendarClock,
  CalendarPlus,
  Mail,
  Pencil,
  Phone,
  Plus,
  SearchX,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackLink, InfoItem, MiniStat } from '@/components/shared/detail-bits';
import { InitialsAvatar, Tag } from '@/components/shared/badges';
import { ListCard, TableSkeleton } from '@/components/shared/list-card';
import { Pagination } from '@/components/shared/pagination';
import { DetailPageSkeleton } from '@/components/shared/page-skeletons';
import { EmptyState, ErrorState } from '@/components/shared/states';
import { ApiError } from '@/lib/api/errors';
import { GENDER_LABELS } from '@/lib/constants';
import { formatDate, formatPhone, formatRelative } from '@/lib/format';
import { PatientFilters } from '@/features/patients/patient-filters';
import { PatientFormDialog } from '@/features/patients/patient-form-dialog';
import { PatientsTable } from '@/features/patients/patients-table';
import { usePatientActions } from '@/features/patients/use-patient-actions';
import { usePatientListParams } from '@/features/patients/use-patient-list-params';
import { useDoctor, useDoctorPatients, useRemoveDoctorPatient } from './api';
import { DoctorFormDialog } from './doctor-form-dialog';

export function DoctorDetailView() {
  const { id } = useParams<{ id: string }>();
  const doctorQuery = useDoctor(id);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  if (doctorQuery.isPending) return <DetailPageSkeleton />;

  if (doctorQuery.isError) {
    const notFound =
      doctorQuery.error instanceof ApiError && [400, 404, 422].includes(doctorQuery.error.status);
    return (
      <>
        <BackLink href="/doctors">All doctors</BackLink>
        <div className="glass page-enter rounded-2xl">
          {notFound ? (
            <EmptyState
              icon={SearchX}
              title="Doctor not found"
              description="This doctor may have been removed, or the link is incorrect."
              action={
                <Button asChild variant="outline">
                  <Link href="/doctors">Back to doctors</Link>
                </Button>
              }
            />
          ) : (
            <ErrorState error={doctorQuery.error} onRetry={() => doctorQuery.refetch()} />
          )}
        </div>
      </>
    );
  }

  const doctor = doctorQuery.data;
  const { stats } = doctor;
  const topCondition = stats.topConditions[0];
  const genderSummary = stats.genders
    .toSorted((a, b) => b.count - a.count)
    .map((g) => `${g.count} ${GENDER_LABELS[g.gender].toLowerCase()}`)
    .join(' · ');

  return (
    <>
      <BackLink href="/doctors">All doctors</BackLink>

      {/* Profile */}
      <section className="glass page-enter mb-4 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <InitialsAvatar name={doctor.name} className="size-14 text-base" />
            <div className="min-w-0 space-y-1.5">
              <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                {doctor.name}
              </h1>
              <Tag>{doctor.specialization}</Tag>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil /> Edit
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <UserPlus /> Add patient
            </Button>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem icon={Building2} label="Hospital">
            {doctor.hospital}
          </InfoItem>
          <InfoItem icon={Phone} label="Phone">
            <a href={`tel:${doctor.phone}`} className="hover:underline">
              {formatPhone(doctor.phone)}
            </a>
          </InfoItem>
          <InfoItem icon={Mail} label="Email">
            <a href={`mailto:${doctor.email}`} className="hover:underline">
              {doctor.email}
            </a>
          </InfoItem>
          <InfoItem icon={CalendarPlus} label="Joined">
            {formatDate(doctor.createdAt)}
          </InfoItem>
        </dl>
      </section>

      {/* Stats */}
      <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
        <MiniStat
          icon={Users}
          label="Patients"
          value={stats.patientCount}
          hint={genderSummary || 'No patients yet'}
        />
        <MiniStat
          icon={Activity}
          label="Most common condition"
          value={topCondition?.condition ?? '—'}
          hint={
            topCondition ? `${topCondition.count} of ${stats.patientCount} patients` : 'No data yet'
          }
        />
        <MiniStat
          icon={CalendarClock}
          label="Latest registration"
          value={stats.lastPatientAt ? formatRelative(stats.lastPatientAt) : '—'}
          hint={stats.lastPatientAt ? formatDate(stats.lastPatientAt) : 'No registrations yet'}
        />
      </div>

      <DoctorPatients
        doctorId={doctor._id}
        doctorName={doctor.name}
        onAdd={() => setAddOpen(true)}
      />

      <DoctorFormDialog open={editOpen} onOpenChange={setEditOpen} doctor={doctor} />
      <PatientFormDialog
        mode="create"
        open={addOpen}
        onOpenChange={setAddOpen}
        doctorId={doctor._id}
        doctorName={doctor.name}
      />
    </>
  );
}

function DoctorPatients({
  doctorId,
  doctorName,
  onAdd,
}: {
  doctorId: string;
  doctorName: string;
  onAdd: () => void;
}) {
  const listState = usePatientListParams();
  const { apiQuery, setParams, reset, activeFilterCount } = listState;
  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } =
    useDoctorPatients(doctorId, apiQuery);
  const removePatient = useRemoveDoctorPatient(doctorId);
  const actions = usePatientActions({
    deletePatient: (id, options) => removePatient.mutate(id, options),
    isDeleting: removePatient.isPending,
    onDeleted: () => {
      if (data && data.items.length === 1 && apiQuery.page > 1)
        setParams({ page: apiQuery.page - 1 });
    },
  });

  const patients = data?.items ?? [];

  return (
    <>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Patient list</h2>
          <p className="text-muted-foreground text-sm">
            Patients currently under {doctorName}&apos;s care
          </p>
        </div>
      </div>
      <ListCard
        isFetching={isFetching && (isPlaceholderData || !isPending)}
        toolbar={<PatientFilters state={listState} />}
      >
        {isPending ? (
          <TableSkeleton rows={5} />
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : patients.length === 0 ? (
          activeFilterCount > 0 ? (
            <EmptyState
              icon={SearchX}
              title="No patients match your filters"
              action={
                <Button variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No patients yet"
              description={`${doctorName} doesn't have any patients assigned. Add the first one.`}
              action={
                <Button onClick={onAdd}>
                  <Plus /> Add patient
                </Button>
              }
            />
          )
        ) : (
          <>
            <PatientsTable
              patients={patients}
              showDoctor={false}
              onEdit={actions.onEdit}
              onDelete={actions.onDelete}
            />
            {data && (
              <Pagination
                meta={data.meta}
                isFetching={isFetching}
                onPageChange={(page) => setParams({ page })}
                onLimitChange={(limit) => setParams({ limit, page: 1 })}
              />
            )}
          </>
        )}
      </ListCard>
      {actions.dialogs}
    </>
  );
}

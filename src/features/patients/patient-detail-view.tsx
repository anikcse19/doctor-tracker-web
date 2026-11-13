'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  Cake,
  CalendarPlus,
  ChevronRight,
  Mail,
  NotebookPen,
  Pencil,
  Phone,
  SearchX,
  Trash2,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BackLink, InfoItem } from '@/components/shared/detail-bits';
import { ConditionTag, InitialsAvatar, Tag } from '@/components/shared/badges';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { DetailPageSkeleton } from '@/components/shared/page-skeletons';
import { EmptyState, ErrorState } from '@/components/shared/states';
import { ApiError, getErrorMessage } from '@/lib/api/errors';
import { GENDER_LABELS } from '@/lib/constants';
import { ageFromDob, formatDate, formatDateTime, formatPhone } from '@/lib/format';
import { useDeletePatient, usePatient } from './api';
import { PatientFormDialog } from './patient-form-dialog';

export function PatientDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: patient, isPending, isError, error, refetch } = usePatient(id);
  const deletePatient = useDeletePatient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isPending) return <DetailPageSkeleton />;

  if (isError) {
    const notFound = error instanceof ApiError && [400, 404, 422].includes(error.status);
    return (
      <>
        <BackLink href="/patients">All patients</BackLink>
        <div className="bg-card rounded-xl border">
          {notFound ? (
            <EmptyState
              icon={SearchX}
              title="Patient not found"
              description="This record may have been deleted, or the link is incorrect."
              action={<Button asChild variant="outline"><Link href="/patients">Back to patients</Link></Button>}
            />
          ) : (
            <ErrorState error={error} onRetry={() => refetch()} />
          )}
        </div>
      </>
    );
  }

  const onConfirmDelete = () =>
    deletePatient.mutate(patient._id, {
      onSuccess: () => {
        toast.success(`${patient.name} was removed`);
        router.replace('/patients');
      },
      onError: (err) => toast.error(getErrorMessage(err, 'Could not delete the patient')),
    });

  return (
    <>
      <BackLink href="/patients">All patients</BackLink>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <section className="bg-card rounded-xl border p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <InitialsAvatar name={patient.name} className="size-14 text-base" />
              <div className="min-w-0 space-y-1.5">
                <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{patient.name}</h1>
                <p className="text-muted-foreground text-sm">
                  {ageFromDob(patient.dateOfBirth)} years · {GENDER_LABELS[patient.gender]}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil /> Edit
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </div>

          <div className="mt-6 border-t pt-5">
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              Medical condition
            </p>
            <ConditionTag condition={patient.condition} />
          </div>

          <dl className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">
            <InfoItem icon={Cake} label="Date of birth">{formatDate(patient.dateOfBirth)}</InfoItem>
            <InfoItem icon={User} label="Gender">{GENDER_LABELS[patient.gender]}</InfoItem>
            <InfoItem icon={Phone} label="Phone">
              <a href={`tel:${patient.phone}`} className="hover:underline">{formatPhone(patient.phone)}</a>
            </InfoItem>
            <InfoItem icon={Mail} label="Email">
              {patient.email ? (
                <a href={`mailto:${patient.email}`} className="hover:underline">{patient.email}</a>
              ) : (
                <span className="text-muted-foreground font-normal">Not provided</span>
              )}
            </InfoItem>
            <InfoItem icon={CalendarPlus} label="Registered">{formatDateTime(patient.createdAt)}</InfoItem>
          </dl>

          <div className="mt-6 border-t pt-5">
            <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
              <NotebookPen className="size-3.5" aria-hidden="true" /> Clinical notes
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {patient.notes || <span className="text-muted-foreground">No notes recorded.</span>}
            </p>
          </div>
        </section>

        <aside className="bg-card h-fit rounded-xl border p-5">
          <p className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">Assigned doctor</p>
          <Link
            href={`/doctors/${patient.doctor._id}`}
            className="hover:bg-muted/50 -m-2 flex items-center gap-3 rounded-lg p-2"
          >
            <InitialsAvatar name={patient.doctor.name} className="size-11" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{patient.doctor.name}</p>
              <Tag className="mt-1">{patient.doctor.specialization}</Tag>
            </div>
            <ChevronRight className="text-muted-foreground size-4" aria-hidden="true" />
          </Link>
          <dl className="mt-5 space-y-4 border-t pt-5">
            <InfoItem icon={Building2} label="Hospital">{patient.doctor.hospital}</InfoItem>
            {patient.doctor.phone && (
              <InfoItem icon={Phone} label="Phone">{formatPhone(patient.doctor.phone)}</InfoItem>
            )}
            {patient.doctor.email && <InfoItem icon={Mail} label="Email">{patient.doctor.email}</InfoItem>}
          </dl>
        </aside>
      </div>

      <PatientFormDialog mode="edit" open={editOpen} onOpenChange={setEditOpen} patient={patient} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete patient?"
        description={
          <>
            <span className="text-foreground font-medium">{patient.name}</span>&apos;s record will be permanently
            removed. This cannot be undone.
          </>
        }
        confirmLabel="Delete patient"
        pending={deletePatient.isPending}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}

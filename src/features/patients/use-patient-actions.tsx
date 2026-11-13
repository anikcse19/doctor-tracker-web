'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import type { Patient } from '@/lib/api/types';
import { getErrorMessage } from '@/lib/api/errors';
import { PatientFormDialog } from './patient-form-dialog';

/**
 * Edit + delete flow for a patient, shared by every page that lists patients.
 * `deletePatient` lets the caller choose the endpoint (global vs. scoped to a doctor).
 */
export function usePatientActions({
  deletePatient,
  isDeleting,
  onDeleted,
}: {
  deletePatient: (id: string, options: { onSuccess: () => void; onError: (e: unknown) => void }) => void;
  isDeleting: boolean;
  onDeleted?: () => void;
}) {
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState<Patient | null>(null);

  const confirmDelete = () => {
    if (!deleting) return;
    const name = deleting.name;
    deletePatient(deleting._id, {
      onSuccess: () => {
        toast.success(`${name} was removed`);
        setDeleting(null);
        onDeleted?.();
      },
      onError: (error) => toast.error(getErrorMessage(error, 'Could not delete the patient')),
    });
  };

  const dialogs = (
    <>
      {editing && (
        <PatientFormDialog
          mode="edit"
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          patient={editing}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete patient?"
        description={
          <>
            <span className="text-foreground font-medium">{deleting?.name}</span> and their record will be
            permanently removed from {deleting?.doctor.name}&apos;s patient list. This cannot be undone.
          </>
        }
        confirmLabel="Delete patient"
        pending={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  );

  return { onEdit: setEditing, onDelete: setDeleting, dialogs };
}

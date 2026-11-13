'use client';

import { useEffect, useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/shared/form-field';
import { GENDERS, GENDER_LABELS } from '@/lib/constants';
import type { Patient } from '@/lib/api/types';
import { applyServerErrors } from '@/lib/forms';
import { useAddPatientToDoctor, useDoctorOptions } from '@/features/doctors/api';
import { useConditions, useUpdatePatient } from './api';
import {
  PATIENT_FIELDS,
  patientEditSchema,
  type PatientEditValues,
  type PatientFormInput,
} from './schema';

type Props = { open: boolean; onOpenChange: (open: boolean) => void } & (
  | { mode: 'create'; doctorId: string; doctorName: string; patient?: never }
  | { mode: 'edit'; patient: Patient; doctorId?: never; doctorName?: never }
);

const today = () => format(new Date(), 'yyyy-MM-dd');

export function PatientFormDialog(props: Props) {
  const { open, onOpenChange, mode } = props;
  const isEdit = mode === 'edit';
  const conditionListId = useId();

  const create = useAddPatientToDoctor(props.doctorId ?? '');
  const update = useUpdatePatient(props.patient?._id ?? '');
  const { data: conditions } = useConditions();
  const { data: doctors, isPending: doctorsLoading } = useDoctorOptions(isEdit && open);

  const form = useForm<PatientFormInput, unknown, PatientEditValues>({
    // One schema for both modes: in create mode `doctor` is pre-filled from the page's doctor
    // and stripped before submit (the API takes it from the URL instead).
    resolver: zodResolver(patientEditSchema),
  });

  useEffect(() => {
    if (!open) return;
    const patient = props.patient;
    form.reset({
      name: patient?.name ?? '',
      dateOfBirth: patient ? format(parseISO(patient.dateOfBirth), 'yyyy-MM-dd') : '',
      gender: patient?.gender ?? ('' as never),
      phone: patient?.phone ?? '',
      email: patient?.email ?? '',
      condition: patient?.condition ?? '',
      notes: patient?.notes ?? '',
      doctor: patient?.doctor._id ?? props.doctorId ?? '',
    });
  }, [open, props.patient, props.doctorId, form]);

  const pending = create.isPending || update.isPending;

  const onSubmit = form.handleSubmit((values) => {
    const onError = (error: unknown) => applyServerErrors(error, form.setError, PATIENT_FIELDS);
    if (isEdit) {
      update.mutate(values, {
        onError,
        onSuccess: (patient) => {
          toast.success(`${patient.name}'s record was updated`);
          onOpenChange(false);
        },
      });
    } else {
      const { doctor: _doctor, ...body } = values;
      create.mutate(body, {
        onError,
        onSuccess: (patient) => {
          toast.success(`${patient.name} was added to ${props.doctorName}`);
          onOpenChange(false);
        },
      });
    }
  });

  const { errors } = form.formState;

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit patient' : 'Add patient'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update personal details, condition or the assigned doctor.'
              : `Register a new patient under ${props.doctorName}.`}
          </DialogDescription>
        </DialogHeader>

        <form id="patient-form" onSubmit={onSubmit} noValidate>
          <FieldGroup className="gap-4">
            <FormField label="Full name" error={errors.name?.message} htmlFor="patient-name">
              <Input id="patient-name" placeholder="Nusrat Jahan" autoFocus aria-invalid={!!errors.name} {...form.register('name')} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date of birth" error={errors.dateOfBirth?.message} htmlFor="patient-dob">
                <Input id="patient-dob" type="date" max={today()} aria-invalid={!!errors.dateOfBirth} {...form.register('dateOfBirth')} />
              </FormField>
              <FormField label="Gender" error={errors.gender?.message} htmlFor="patient-gender">
                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger id="patient-gender" className="w-full" aria-invalid={!!errors.gender}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map((gender) => (
                          <SelectItem key={gender} value={gender}>{GENDER_LABELS[gender]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone" error={errors.phone?.message} htmlFor="patient-phone">
                <Input id="patient-phone" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" aria-invalid={!!errors.phone} {...form.register('phone')} />
              </FormField>
              <FormField label="Email" optional error={errors.email?.message} htmlFor="patient-email">
                <Input id="patient-email" type="email" placeholder="name@example.com" aria-invalid={!!errors.email} {...form.register('email')} />
              </FormField>
            </div>

            <FormField label="Medical condition" error={errors.condition?.message} htmlFor="patient-condition">
              <Input
                id="patient-condition"
                list={conditionListId}
                placeholder="e.g. Hypertension"
                aria-invalid={!!errors.condition}
                {...form.register('condition')}
              />
              <datalist id={conditionListId}>
                {conditions?.map((condition) => <option key={condition} value={condition} />)}
              </datalist>
            </FormField>

            {isEdit && (
              <FormField label="Assigned doctor" error={errors.doctor?.message} htmlFor="patient-doctor">
                <Controller
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange} disabled={doctorsLoading}>
                      <SelectTrigger id="patient-doctor" className="w-full" aria-invalid={!!errors.doctor}>
                        <SelectValue placeholder={doctorsLoading ? 'Loading doctors…' : 'Select a doctor'} />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {doctors?.map((doctor) => (
                          <SelectItem key={doctor._id} value={doctor._id}>
                            {doctor.name}
                            <span className="text-muted-foreground"> · {doctor.specialization}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            )}

            <FormField label="Clinical notes" optional error={errors.notes?.message} htmlFor="patient-notes">
              <Textarea id="patient-notes" rows={3} placeholder="Relevant history, follow-up plan…" aria-invalid={!!errors.notes} {...form.register('notes')} />
            </FormField>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="patient-form" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {isEdit ? 'Save changes' : 'Add patient'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

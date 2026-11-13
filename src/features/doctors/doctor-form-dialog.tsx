'use client';

import { useEffect, useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { FormField } from '@/components/shared/form-field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPECIALIZATIONS } from '@/lib/constants';
import type { Doctor } from '@/lib/api/types';
import { applyServerErrors } from '@/lib/forms';
import { useCreateDoctor, useHospitals, useUpdateDoctor } from './api';
import {
  DOCTOR_FIELDS,
  doctorFormSchema,
  type DoctorFormInput,
  type DoctorFormValues,
} from './schema';

const EMPTY: DoctorFormInput = { name: '', specialization: '' as never, hospital: '', phone: '', email: '' };

export function DoctorFormDialog({
  open,
  onOpenChange,
  doctor,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits this doctor; otherwise it creates a new one. */
  doctor?: Doctor;
  onCreated?: (doctor: Doctor) => void;
}) {
  const isEdit = !!doctor;
  const create = useCreateDoctor();
  const update = useUpdateDoctor(doctor?._id ?? '');
  const { data: hospitals } = useHospitals();
  const hospitalListId = useId();

  const form = useForm<DoctorFormInput, unknown, DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        doctor
          ? {
              name: doctor.name,
              specialization: doctor.specialization,
              hospital: doctor.hospital,
              phone: doctor.phone,
              email: doctor.email,
            }
          : EMPTY,
      );
    }
  }, [open, doctor, form]);

  const pending = create.isPending || update.isPending;

  const onSubmit = form.handleSubmit((values) => {
    const options = {
      onError: (error: unknown) => applyServerErrors(error, form.setError, DOCTOR_FIELDS),
    };
    if (isEdit) {
      update.mutate(values, {
        ...options,
        onSuccess: () => {
          toast.success('Doctor details updated');
          onOpenChange(false);
        },
      });
    } else {
      create.mutate(values, {
        ...options,
        onSuccess: (created) => {
          toast.success(`${created.name} has been added`);
          onOpenChange(false);
          onCreated?.(created);
        },
      });
    }
  });

  const { errors } = form.formState;

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit doctor' : 'Add a new doctor'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update this doctor’s professional and contact details.'
              : 'Register a doctor so patients can be assigned to them.'}
          </DialogDescription>
        </DialogHeader>

        <form id="doctor-form" onSubmit={onSubmit} noValidate>
          <FieldGroup className="gap-4">
            <FormField label="Full name" error={errors.name?.message} htmlFor="doctor-name">
              <Input id="doctor-name" placeholder="Dr. Farhana Rahman" autoFocus aria-invalid={!!errors.name} {...form.register('name')} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Specialization" error={errors.specialization?.message} htmlFor="doctor-specialization">
                <Controller
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger id="doctor-specialization" className="w-full" aria-invalid={!!errors.specialization}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {SPECIALIZATIONS.map((specialization) => (
                          <SelectItem key={specialization} value={specialization}>
                            {specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Hospital" error={errors.hospital?.message} htmlFor="doctor-hospital">
                <Input
                  id="doctor-hospital"
                  list={hospitalListId}
                  placeholder="Hospital name"
                  aria-invalid={!!errors.hospital}
                  {...form.register('hospital')}
                />
                <datalist id={hospitalListId}>
                  {hospitals?.map((hospital) => <option key={hospital} value={hospital} />)}
                </datalist>
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone" error={errors.phone?.message} htmlFor="doctor-phone">
                <Input id="doctor-phone" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" aria-invalid={!!errors.phone} {...form.register('phone')} />
              </FormField>
              <FormField label="Email" error={errors.email?.message} htmlFor="doctor-email">
                <Input id="doctor-email" type="email" placeholder="name@hospital.com" aria-invalid={!!errors.email} {...form.register('email')} />
              </FormField>
            </div>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="doctor-form" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {isEdit ? 'Save changes' : 'Add doctor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

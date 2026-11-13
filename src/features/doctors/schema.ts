import { z } from 'zod';
import { BD_PHONE_REGEX, SPECIALIZATIONS } from '@/lib/constants';

/** Mirrors the API validator so users get instant feedback; the API re-validates regardless. */
export const doctorFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  specialization: z.enum(SPECIALIZATIONS, { error: 'Select a specialization' }),
  hospital: z.string().trim().min(2, 'Hospital is required').max(150),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ''))
    .pipe(
      z.string().regex(BD_PHONE_REGEX, 'Enter a valid Bangladeshi mobile number (01XXXXXXXXX)'),
    ),
  email: z.email('Enter a valid email address').max(254),
});

export type DoctorFormInput = z.input<typeof doctorFormSchema>;
export type DoctorFormValues = z.output<typeof doctorFormSchema>;
export const DOCTOR_FIELDS = ['name', 'specialization', 'hospital', 'phone', 'email'] as const;

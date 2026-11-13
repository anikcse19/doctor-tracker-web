import { z } from 'zod';
import { BD_PHONE_REGEX, GENDERS } from '@/lib/constants';

/** Mirrors the API validator so users get instant feedback; the API re-validates regardless. */
export const patientFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid date')
    .refine((value) => new Date(value) <= new Date(), 'Date of birth cannot be in the future'),
  gender: z.enum(GENDERS, { error: 'Select a gender' }),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ''))
    .pipe(
      z.string().regex(BD_PHONE_REGEX, 'Enter a valid Bangladeshi mobile number (01XXXXXXXXX)'),
    ),
  email: z.union([z.literal(''), z.email('Enter a valid email address')]),
  condition: z
    .string()
    .trim()
    .min(2, 'Medical condition is required')
    .max(100)
    .refine((value) => !value.includes(','), 'Enter a single primary condition (no commas)'),
  notes: z.string().trim().max(1000, 'Notes must be under 1000 characters'),
});

/** Editing additionally allows reassigning the patient to a different doctor. */
export const patientEditSchema = patientFormSchema.extend({
  doctor: z.string().min(1, 'Select a doctor'),
});

export type PatientFormInput = z.input<typeof patientEditSchema>;
export type PatientFormValues = z.output<typeof patientFormSchema>;
export type PatientEditValues = z.output<typeof patientEditSchema>;
export const PATIENT_FIELDS = [
  'name',
  'dateOfBirth',
  'gender',
  'phone',
  'email',
  'condition',
  'notes',
  'doctor',
] as const;

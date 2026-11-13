export const SPECIALIZATIONS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'ENT',
  'Gastroenterology',
  'General Medicine',
  'Gynecology & Obstetrics',
  'Nephrology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Urology',
] as const;
export type Specialization = (typeof SPECIALIZATIONS)[number];

export const GENDERS = ['male', 'female', 'other'] as const;
export type Gender = (typeof GENDERS)[number];
export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number]['value'];

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

/** Mirrors the backend validator: 01XXXXXXXXX with optional +88 prefix. */
export const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

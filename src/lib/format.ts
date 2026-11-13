import { differenceInYears, format, formatDistanceToNowStrict, parseISO } from 'date-fns';

const toDate = (value: string | Date) => (typeof value === 'string' ? parseISO(value) : value);

export const formatDate = (value: string | Date) => format(toDate(value), 'd MMM yyyy');
export const formatDateTime = (value: string | Date) => format(toDate(value), 'd MMM yyyy, h:mm a');
export const formatRelative = (value: string | Date) =>
  formatDistanceToNowStrict(toDate(value), { addSuffix: true });

export const ageFromDob = (dob: string | Date) => differenceInYears(new Date(), toDate(dob));

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

/** "Dr. Farhana Rahman" → "FR" */
export function initials(name: string) {
  const parts = name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '')).toUpperCase();
}

/** Display 01712345678 as 01712-345678 for readability. */
export function formatPhone(phone: string) {
  const local = phone.replace(/^\+?88/, '');
  return local.length === 11 ? `${local.slice(0, 5)}-${local.slice(5)}` : phone;
}

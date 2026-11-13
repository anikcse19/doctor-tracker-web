import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/errors';

/**
 * Maps API validation (422) and conflict (409) errors onto form fields so the user sees the
 * server's message next to the right input. Anything else becomes a toast.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields: readonly string[],
) {
  if (error instanceof ApiError && error.details?.length) {
    let mapped = false;
    for (const issue of error.details) {
      if (knownFields.includes(issue.field)) {
        setError(issue.field as Path<T>, { message: issue.message }, { shouldFocus: !mapped });
        mapped = true;
      }
    }
    if (mapped) return;
  }
  toast.error(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.');
}

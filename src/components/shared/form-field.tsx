import type { ReactNode } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

/** Label + control + error message, wired for accessibility via the shadcn Field primitives. */
export function FormField({
  label,
  error,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <Field data-invalid={!!error} className="gap-1.5">
      <FieldLabel htmlFor={htmlFor}>
        {label}
        {optional && <span className="text-muted-foreground font-normal">(optional)</span>}
      </FieldLabel>
      {children}
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}

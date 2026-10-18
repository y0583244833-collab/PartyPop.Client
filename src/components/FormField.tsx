import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

/** תווית + שדה + הודעת ולידציה. משותף לכל הטפסים. */
export function FormField({ label, error, children }: { label: string; error?: FieldError; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error.message}</small>}
    </label>
  );
}

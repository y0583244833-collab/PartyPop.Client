import { ApiError } from '../api/client';
import { ConflictAlert } from './ConflictAlert';

/**
 * הצגה אחידה של כל שגיאה מהשרת.
 * 409 מקבל תצוגה מיוחדת (ConflictAlert), כי זה המקרה שבו המשאב נתפס.
 */
export function ErrorMessage({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  if (!error) return null;

  if (error instanceof ApiError && error.isConflict)
    return <ConflictAlert error={error} onRetry={onRetry} />;

  const message = error instanceof ApiError ? error.message : 'אירעה שגיאה לא צפויה';
  const fieldErrors = error instanceof ApiError ? Object.values(error.body.errors ?? {}).flat() : [];

  return (
    <div className="alert alert-error" role="alert">
      <strong>{message}</strong>
      {fieldErrors.length > 0 && (
        <ul>{fieldErrors.map((e) => <li key={e}>{e}</li>)}</ul>
      )}
    </div>
  );
}

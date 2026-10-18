import type { ErrorBody } from './types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7151';
const TOKEN_KEY = 'partypop.token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/** שגיאה מהשרת, עם הקוד וה-JSON האחיד שלו. */
export class ApiError extends Error {
  constructor(public readonly status: number, public readonly body: ErrorBody) {
    super(body.message);
  }

  /** 409: המשאב נתפס או השתנה. */
  get isConflict() {
    return this.status === 409;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

/**
 * כל הקריאות לשרת עוברות כאן: כתובת בסיס, JSON, ‏Token ב-Header, וטיפול אחיד בשגיאות.
 * כך אין שכפול קוד בכל קריאה.
 */
export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Query; form?: FormData } = {},
): Promise<T> {
  const url = new URL(path, BASE_URL);
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== false) url.searchParams.set(key, String(value));
  });

  // FormData (העלאת קובץ): הדפדפן קובע לבד את ה-Content-Type עם ה-boundary
  const headers: Record<string, string> = options.form ? {} : { 'Content-Type': 'application/json' };
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.form ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
    });
  } catch {
    throw new ApiError(0, { status: 0, message: 'אין חיבור לשרת. האם ה-API רץ?' });
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorBody | null;
    throw new ApiError(response.status, body ?? { status: response.status, message: 'אירעה שגיאה' });
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export interface FieldIssue {
  field: string;
  message: string;
}

/** Typed error thrown for any non-2xx API response (or a network failure, status 0). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: FieldIssue[],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized() {
    return this.status === 401;
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof ApiError) return error.message;
  return fallback;
}

import { ApiError, type FieldIssue } from './errors';
import type { Paginated, PaginationMeta } from './types';

/**
 * Browser-side API client. Requests go to the same origin (`/api/v1/...`) and are rewritten
 * by Next.js to the Express backend, so the HttpOnly session cookie is sent automatically
 * and is never readable from JavaScript.
 */
const BASE = '/api/v1';

type QueryValue = string | number | undefined | null;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

interface Envelope<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  error?: { code: string; message: string; details?: FieldIssue[] };
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<Envelope<T>> {
  const { method = 'GET', body, query, signal } = options;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  }
  const url = `${BASE}${path}${params.size ? `?${params}` : ''}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'Unable to reach the server. Check your connection.');
  }

  if (response.status === 204) return { success: true, data: undefined as T };

  const json = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok || !json?.success) {
    throw new ApiError(
      response.status,
      json?.error?.code ?? 'UNKNOWN_ERROR',
      json?.error?.message ??
        (response.status >= 500
          ? 'The server is unavailable. It may be waking up — please try again in a moment.'
          : 'Request failed'),
      json?.error?.details,
    );
  }

  return json;
}

export const api = {
  get: async <T>(path: string, query?: RequestOptions['query'], signal?: AbortSignal) =>
    (await request<T>(path, { query, signal })).data,

  getPaginated: async <T>(path: string, query?: RequestOptions['query'], signal?: AbortSignal) => {
    const { data, meta } = await request<T[]>(path, { query, signal });
    return { items: data, meta: meta! } satisfies Paginated<T>;
  },

  post: async <T>(path: string, body?: unknown) =>
    (await request<T>(path, { method: 'POST', body })).data,

  patch: async <T>(path: string, body: unknown) =>
    (await request<T>(path, { method: 'PATCH', body })).data,

  delete: async (path: string) => {
    await request<void>(path, { method: 'DELETE' });
  },
};

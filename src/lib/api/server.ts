import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError } from './errors';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';
const SESSION_COOKIE = 'dt_session';

/**
 * Server-side GET for Server Components. Forwards only the session cookie to the API
 * (server-to-server, so it never touches client JS) and never caches — the data is
 * per-admin and contains patient information.
 */
export async function serverGet<T>(path: string): Promise<T> {
  const session = (await cookies()).get(SESSION_COOKIE);
  if (!session) redirect('/login');

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      headers: { cookie: `${SESSION_COOKIE}=${session.value}`, accept: 'application/json' },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'The API server could not be reached.');
  }

  if (response.status === 401) redirect('/login?session=expired');

  const json = (await response.json().catch(() => null)) as
    | { success: true; data: T }
    | { success: false; error: { code: string; message: string } }
    | null;

  if (!response.ok || !json || !json.success) {
    const err = json && !json.success ? json.error : undefined;
    throw new ApiError(response.status, err?.code ?? 'UNKNOWN_ERROR', err?.message ?? 'Request failed');
  }
  return json.data;
}

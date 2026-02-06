import { emitAuthInvalid } from '@/utils/authEvents';
import { useAuthStore } from '@/store/authStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestOptions = {
  method: HttpMethod;
  path: string;
  body?: unknown;
  auth?: boolean;
};

const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!envBaseUrl && import.meta.env.PROD) {
  throw new Error('VITE_API_BASE_URL is required in production builds');
}

const baseUrl = envBaseUrl || 'http://localhost:4000/api';

async function request<T>({ method, path, body, auth = true }: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && auth) {
      // Explicit policy: any 401 after startup invalidates auth and logs the user out.
      // Refresh-on-401 is intentionally not performed here.
      emitAuthInvalid();
    }
    const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
    const message = errorBody?.message || 'Request failed';
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, auth = true) => request<T>({ method: 'GET', path, auth }),
  post: <T>(path: string, body?: unknown, auth = true) => request<T>({ method: 'POST', path, body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) => request<T>({ method: 'PUT', path, body, auth }),
  delete: <T>(path: string, auth = true) => request<T>({ method: 'DELETE', path, auth }),
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestOptions = {
  method: HttpMethod;
  path: string;
  body?: unknown;
  auth?: boolean;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function getStoredToken() {
  const raw = localStorage.getItem('auth-storage');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
    return parsed.state?.accessToken || null;
  } catch {
    return null;
  }
}

async function request<T>({ method, path, body, auth = true }: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
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

import { User } from '@/types';
import { LoginFormData, RegisterFormData } from '@/schemas';
import { apiClient } from '@/services/apiClient';

type AuthResponse = {
  user: User;
  accessToken: string;
};

function normalizeAuthResponse(response: AuthResponse): AuthResponse {
  return {
    ...response,
    user: {
      ...response.user,
      createdAt: new Date(response.user.createdAt),
    },
  };
}

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data, false);
    return normalizeAuthResponse(response);
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data, false);
    return normalizeAuthResponse(response);
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', undefined, false);
  },

  async refresh(): Promise<AuthResponse | null> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AuthResponse;
    return normalizeAuthResponse(data);
  },
};

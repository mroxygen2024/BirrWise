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

  async refresh(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', undefined, false);
    return normalizeAuthResponse(response);
  },
};

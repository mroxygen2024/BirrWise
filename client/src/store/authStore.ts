import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { LoginFormData, RegisterFormData } from '@/schemas';
import { onAuthInvalid } from '@/utils/authEvents';

let authInvalidListenerAttached = false;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  refresh: () => Promise<void>;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => {
  if (!authInvalidListenerAttached && typeof window !== 'undefined') {
    authInvalidListenerAttached = true;
    onAuthInvalid(() => {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false, isAuthReady: true });
    });
  }

  return {
    user: null,
    isAuthenticated: false,
    isAuthReady: false,
    isLoading: false,
    error: null,
    accessToken: null,

    login: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const result = await authService.login(data);
        set({ user: result.user, accessToken: result.accessToken, isAuthenticated: true, isLoading: false, isAuthReady: true });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Login failed',
          isLoading: false,
          isAuthReady: true,
        });
        throw err;
      }
    },

    register: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const result = await authService.register(data);
        set({ user: result.user, accessToken: result.accessToken, isAuthenticated: true, isLoading: false, isAuthReady: true });
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Registration failed',
          isLoading: false,
          isAuthReady: true,
        });
        throw err;
      }
    },

    refresh: async () => {
      set({ isLoading: true });
      const result = await authService.refresh();
      if (!result) {
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        return;
      }
      set({ user: result.user, accessToken: result.accessToken, isAuthenticated: true, isLoading: false });
    },

    initialize: async () => {
      await get().refresh();
      set({ isAuthReady: true });
    },

    logout: async () => {
      set({ isLoading: true });
      await authService.logout();
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false, isAuthReady: true });
    },

    clearError: () => set({ error: null }),
  };
});

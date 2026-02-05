import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { LoginFormData, RegisterFormData } from '@/schemas';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.login(data);
          set({ user: result.user, accessToken: result.accessToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Login failed',
            isLoading: false 
          });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authService.register(data);
          set({ user: result.user, accessToken: result.accessToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : 'Registration failed',
            isLoading: false 
          });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        await authService.logout();
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);

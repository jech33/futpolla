/**
 * Authentication state store using Zustand
 * This store manages ONLY the auth state - side effects are handled in useInitializeAuth hook
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AuthUser } from '@/ports/outbound/AuthProvider';

interface AuthState {
  firebaseUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;

  // Actions to update state (not side effects)
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      isAuthenticated: false,
      isLoadingSession: true,

      setUser: (user) =>
        set({
          firebaseUser: user,
          isAuthenticated: !!user,
          isLoadingSession: false,
        }),

      clearUser: () =>
        set({
          firebaseUser: null,
          isAuthenticated: false,
          isLoadingSession: false,
        }),

      setLoading: (loading) =>
        set({
          isLoadingSession: loading,
        }),
    }),
    { name: 'user-storage' }
  )
);

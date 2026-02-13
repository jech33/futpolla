/**
 * Authentication state store using Zustand
 * This store manages ONLY the auth state - side effects are handled in useInitializeAuth hook
 */
import { User } from 'firebase/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;

  // Actions to update state (not side effects)
  setUser: (user: User | null) => void;
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

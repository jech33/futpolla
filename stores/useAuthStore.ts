import { create } from 'zustand';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { persist } from 'zustand/middleware';

interface AuthState {
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;

  initializeSession: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      isAuthenticated: false,
      isLoadingSession: true,

      initializeSession: () => {
        return onAuthStateChanged(auth, (user) => {
          set({
            firebaseUser: user,
            isAuthenticated: !!user,
            isLoadingSession: false,
          });
        });
      },
    }),
    { name: 'user-storage' }
  )
);

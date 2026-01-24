import { create } from 'zustand';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { UserProfile, UserRole } from '@/types';

interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;

  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,

  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, firebaseUser: null });
  },

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser);
      set({ isLoading: true });

      if (!currentUser) {
        set({ user: null, firebaseUser: null, isLoading: false });
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        let userProfile: UserProfile;

        if (userSnap.exists()) {
          userProfile = userSnap.data() as UserProfile;
        } else {
          userProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Jugador',
            photoURL: currentUser.photoURL || '',
            totalPoints: 0,
            ranking: 999, // Ranking temporal
            role: UserRole.USER,
          };

          await setDoc(userRef, userProfile);
        }

        set({
          firebaseUser: currentUser,
          user: userProfile,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error syncing user profile:', error);
        set({ user: null, firebaseUser: null, isLoading: false });
      }
    });

    return unsubscribe;
  },
}));

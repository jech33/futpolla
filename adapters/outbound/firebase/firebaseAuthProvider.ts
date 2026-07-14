import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from '@/adapters/outbound/firebase/config';
import { handleFirestoreError } from '@/adapters/outbound/shared/errorHandler';
import { logger } from '@/lib/logger';
import { AuthProvider, AuthUser } from '@/ports/outbound/AuthProvider';

const toAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export function makeFirebaseAuthProvider(): AuthProvider {
  return {
    async signInWithGoogle() {
      try {
        logger.debug('Initiating Google login', { context: 'firebaseAuthProvider' });

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        logger.info('Google login successful', {
          context: 'firebaseAuthProvider',
          data: { uid: result.user.uid },
        });

        return toAuthUser(result.user);
      } catch (error) {
        logger.error('Google login failed', { context: 'firebaseAuthProvider', data: error });
        return handleFirestoreError(error, 'signInWithGoogle');
      }
    },

    async signOut() {
      try {
        logger.debug('Initiating logout', { context: 'firebaseAuthProvider' });

        await signOut(auth);

        logger.info('Logout successful', { context: 'firebaseAuthProvider' });
      } catch (error) {
        logger.error('Logout failed', { context: 'firebaseAuthProvider', data: error });
        return handleFirestoreError(error, 'signOut');
      }
    },

    onAuthStateChanged(onChange, onError) {
      return onAuthStateChanged(auth, (user) => onChange(user ? toAuthUser(user) : null), onError);
    },
  };
}

import { GoogleAuthProvider, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { FIRESTORE_COLLECTIONS } from '@/lib/constants/firestore';
import { auth, db } from '@/lib/firebase/config';
import { handleFirestoreError } from '@/lib/helpers/errorHandler';
import { logger } from '@/lib/helpers/logger';
import { userProfileSchema } from '@/lib/validators/firebase';
import { UserProfile, UserRole } from '@/types';

/**
 * Sign in with Google OAuth popup
 * @returns Firebase UserCredential
 * @throws FirestoreError if sign-in fails
 */
export const loginWithGoogle = async () => {
  try {
    logger.debug('Initiating Google login', { context: 'authService' });

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log('Google sign-in result:', result); // Debug log for sign-in result
    await syncUserProfile(result.user);

    logger.info('Google login successful', {
      context: 'authService',
      data: { uid: result.user.uid },
    });

    return result;
  } catch (error) {
    logger.error('Google login failed', { context: 'authService', data: error });
    return handleFirestoreError(error, 'loginWithGoogle');
  }
};

/**
 * Sign out the current user
 * @throws FirestoreError if sign-out fails
 */
export const logoutFirebase = async (): Promise<void> => {
  try {
    logger.debug('Initiating logout', { context: 'authService' });

    await signOut(auth);

    logger.info('Logout successful', { context: 'authService' });
  } catch (error) {
    logger.error('Logout failed', { context: 'authService', data: error });
    return handleFirestoreError(error, 'logoutFirebase');
  }
};

/**
 * Get user profile from Firestore
 * @param uid User's Firebase UID
 * @returns UserProfile or null if not found
 * @throws FirestoreError if the query fails or data is invalid
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    logger.debug('Fetching user profile', { context: 'authService', data: { uid } });

    const docRef = doc(db, FIRESTORE_COLLECTIONS.users, uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      logger.info('User profile not found', { context: 'authService', data: { uid } });
      return null;
    }

    // Validate with Zod
    const profile = userProfileSchema.parse(snap.data());

    logger.info('User profile fetched', { context: 'authService', data: { uid } });

    return profile;
  } catch (error) {
    logger.error('Failed to fetch user profile', { context: 'authService', data: error });
    return handleFirestoreError(error, 'getUserProfile');
  }
};

/**
 * Sync user profile - creates a new profile if it doesn't exist
 * @param currentUser Firebase User object
 * @returns UserProfile (existing or newly created)
 * @throws FirestoreError if the operation fails
 */
export const syncUserProfile = async (currentUser: User): Promise<UserProfile> => {
  try {
    logger.debug('Syncing user profile', {
      context: 'authService',
      data: { uid: currentUser.uid },
    });

    const userRef = doc(db, FIRESTORE_COLLECTIONS.users, currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      logger.info('User profile already exists', {
        context: 'authService',
        data: {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Anonymous',
        },
      });

      setDoc(userRef, {
        ...userSnap.data(),
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || undefined,
      });

      // Validate existing profile
      return userProfileSchema.parse(userSnap.data());
    }

    // Create new user profile
    const newUser: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || 'Anonymous',
      photoURL: currentUser.photoURL || undefined,
      totalPoints: 0,
      ranking: 999,
      role: UserRole.USER,
    };

    await setDoc(userRef, newUser);

    logger.info('New user profile created', {
      context: 'authService',
      data: { uid: currentUser.uid },
    });

    return newUser;
  } catch (error) {
    logger.error('Failed to sync user profile', { context: 'authService', data: error });
    return handleFirestoreError(error, 'syncUserProfile');
  }
};

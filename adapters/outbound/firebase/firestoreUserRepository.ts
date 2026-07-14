import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/adapters/outbound/firebase/config';
import { userProfileSchema } from '@/adapters/outbound/firebase/validators';
import { handleFirestoreError } from '@/adapters/outbound/shared/errorHandler';
import { FIRESTORE_COLLECTIONS } from '@/adapters/outbound/shared/firestorePaths';
import { UserProfile, UserRole } from '@/domain/entities';
import { logger } from '@/lib/logger';
import { AuthUser } from '@/ports/outbound/AuthProvider';
import { UserRepository } from '@/ports/outbound/UserRepository';

export function makeFirestoreUserRepository(): UserRepository {
  return {
    async getById(uid: string): Promise<UserProfile | null> {
      try {
        logger.debug('Fetching user profile', {
          context: 'firestoreUserRepository',
          data: { uid },
        });

        const docRef = doc(db, FIRESTORE_COLLECTIONS.users, uid);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          logger.info('User profile not found', {
            context: 'firestoreUserRepository',
            data: { uid },
          });
          return null;
        }

        const profile = userProfileSchema.parse(snap.data());

        logger.info('User profile fetched', { context: 'firestoreUserRepository', data: { uid } });

        return profile;
      } catch (error) {
        logger.error('Failed to fetch user profile', {
          context: 'firestoreUserRepository',
          data: error,
        });
        return handleFirestoreError(error, 'getById');
      }
    },

    async sync(authUser: AuthUser): Promise<UserProfile> {
      try {
        logger.debug('Syncing user profile', {
          context: 'firestoreUserRepository',
          data: { uid: authUser.uid },
        });

        const userRef = doc(db, FIRESTORE_COLLECTIONS.users, authUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          logger.info('User profile already exists', {
            context: 'firestoreUserRepository',
            data: {
              uid: authUser.uid,
              email: authUser.email || '',
              displayName: authUser.displayName || 'Anonymous',
            },
          });

          setDoc(userRef, {
            ...userSnap.data(),
            email: authUser.email || '',
            displayName: authUser.displayName || '',
            photoURL: authUser.photoURL || undefined,
          });

          return userProfileSchema.parse(userSnap.data());
        }

        const newUser: UserProfile = {
          uid: authUser.uid,
          email: authUser.email || '',
          displayName: authUser.displayName || 'Anonymous',
          photoURL: authUser.photoURL || undefined,
          totalPoints: 0,
          ranking: 999,
          role: UserRole.USER,
        };

        await setDoc(userRef, newUser);

        logger.info('New user profile created', {
          context: 'firestoreUserRepository',
          data: { uid: authUser.uid },
        });

        return newUser;
      } catch (error) {
        logger.error('Failed to sync user profile', {
          context: 'firestoreUserRepository',
          data: error,
        });
        return handleFirestoreError(error, 'sync');
      }
    },
  };
}

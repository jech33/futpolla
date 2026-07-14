/**
 * Hook to initialize Firebase authentication state
 * This hook handles the side effect of listening to auth changes
 * and syncing with the Zustand store
 */

'use client';

import { useEffect } from 'react';

import { authProvider } from '@/composition/client';
import { logger } from '@/lib/logger';
import { useAuthStore } from '@/stores/useAuthStore';

import { useSyncUserProfile } from './mutations/useSyncUserProfile';

/**
 * Initialize Firebase authentication listener
 * This should be called once at the app root level
 */
export const useInitializeAuth = () => {
  const { setUser, clearUser, setLoading } = useAuthStore();
  const { mutateAsync: handleSyncUserProfile } = useSyncUserProfile();

  useEffect(() => {
    logger.debug('Initializing auth listener', { context: 'useInitializeAuth' });

    setLoading(true);

    const unsubscribe = authProvider.onAuthStateChanged(
      (user) => {
        if (user) {
          logger.info('User authenticated', {
            context: 'useInitializeAuth',
            data: { uid: user.uid },
          });
          setUser(user);
          handleSyncUserProfile(user);
        } else {
          logger.info('User not authenticated', { context: 'useInitializeAuth' });
          clearUser();
        }
      },
      (error) => {
        logger.error('Auth state change error', {
          context: 'useInitializeAuth',
          data: error,
        });
        clearUser();
      }
    );

    return () => {
      logger.debug('Cleaning up auth listener', { context: 'useInitializeAuth' });
      unsubscribe();
    };
  }, [setUser, clearUser, setLoading, handleSyncUserProfile]);
};

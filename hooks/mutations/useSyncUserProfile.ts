/**
 * Mutation hook for syncing user profile
 * Creates a new user profile if it doesn't exist
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants/query';
import { logger } from '@/lib/helpers/logger';
import { syncUserProfile } from '@/services/authServices';

export function useSyncUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncUserProfile,
    onSuccess: (data) => {
      logger.info('User profile synced successfully', {
        context: 'useSyncUserProfile',
        data: { uid: data.uid },
      });

      // Update the query cache with the new profile
      queryClient.setQueryData(QUERY_KEYS.userProfile(data.uid), data);
    },
    onError: (error) => {
      logger.error('Failed to sync user profile', {
        context: 'useSyncUserProfile',
        data: error,
      });
    },
  });
}

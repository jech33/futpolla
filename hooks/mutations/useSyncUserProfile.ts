/**
 * Mutation hook for syncing user profile
 * Creates a new user profile if it doesn't exist
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { syncUserProfileUseCase } from '@/composition/client';
import { QUERY_KEYS } from '@/hooks/queryConfig';
import { logger } from '@/lib/logger';

export function useSyncUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncUserProfileUseCase.execute,
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

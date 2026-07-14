import { useQuery } from '@tanstack/react-query';

import { getUserProfileUseCase } from '@/composition/client';
import { QUERY_CONFIG, QUERY_KEYS } from '@/hooks/queryConfig';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Hook to fetch the current user's profile
 * Note: User profile creation is now handled by the useSyncUserProfile mutation
 */
export function useCurrentUser() {
  const { firebaseUser, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.userProfile(firebaseUser?.uid),
    queryFn: async () => {
      if (!firebaseUser?.uid) return null;
      return await getUserProfileUseCase.execute(firebaseUser.uid);
    },
    enabled: isAuthenticated && !!firebaseUser?.uid,
    ...QUERY_CONFIG.userProfile,
  });
}

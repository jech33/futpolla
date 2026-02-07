import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { getUserProfile, syncUserProfile } from '@/services/authServices';

export function useCurrentUser() {
  const { firebaseUser, isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: ['user-profile', firebaseUser?.uid],

    enabled: isAuthenticated && !!firebaseUser?.uid,

    queryFn: async () => {
      if (!firebaseUser) return null;

      const profile = await getUserProfile(firebaseUser.uid);

      if (!profile) {
        return await syncUserProfile(firebaseUser);
      }

      return profile;
    },

    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: true,
  });

  return query;
}

/**
 * React Query configuration constants
 */

/**
 * Query keys for TanStack Query
 */
export const QUERY_KEYS = {
  fixtures: ['fixtures'] as const,
  standings: ['standings'] as const,
  userProfile: (uid: string | undefined) => ['user-profile', uid] as const,
} as const;

/**
 * Query configuration presets for different data types
 */
export const QUERY_CONFIG = {
  fixtures: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  },
  standings: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  },
  userProfile: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: true,
    retry: 3,
  },
} as const;

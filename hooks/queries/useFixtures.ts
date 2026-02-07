import { useQuery } from '@tanstack/react-query';
import { getFixtures } from '@/services/fixturesServices';

export const FIXTURES_QUERY_KEY = ['fixtures'] as const;

export function useFixtures() {
  return useQuery({
    queryKey: FIXTURES_QUERY_KEY,
    queryFn: getFixtures,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

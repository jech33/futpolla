import { useQuery } from '@tanstack/react-query';
import { getStandings } from '@/services/standingsServices';

export const STANDINGS_QUERY_KEY = ['standings'] as const;

export function useStandings() {
  return useQuery({
    queryKey: STANDINGS_QUERY_KEY,
    queryFn: getStandings,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

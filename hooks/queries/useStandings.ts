import { useQuery } from '@tanstack/react-query';

import { QUERY_CONFIG, QUERY_KEYS } from '@/lib/constants/query';
import { getStandings } from '@/services/standingsServices';

export function useStandings() {
  return useQuery({
    queryKey: QUERY_KEYS.standings,
    queryFn: getStandings,
    ...QUERY_CONFIG.standings,
  });
}

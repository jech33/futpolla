import { useQuery } from '@tanstack/react-query';

import { getStandingsUseCase } from '@/composition/client';
import { QUERY_CONFIG, QUERY_KEYS } from '@/hooks/queryConfig';

export function useStandings() {
  return useQuery({
    queryKey: QUERY_KEYS.standings,
    queryFn: () => getStandingsUseCase.execute(),
    ...QUERY_CONFIG.standings,
  });
}

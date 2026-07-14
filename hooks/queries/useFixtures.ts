import { useQuery } from '@tanstack/react-query';

import { getFixturesUseCase } from '@/composition/client';
import { QUERY_CONFIG, QUERY_KEYS } from '@/hooks/queryConfig';

export function useFixtures() {
  return useQuery({
    queryKey: QUERY_KEYS.fixtures,
    queryFn: () => getFixturesUseCase.execute(),
    ...QUERY_CONFIG.fixtures,
  });
}

import { useQuery } from '@tanstack/react-query';

import { QUERY_CONFIG, QUERY_KEYS } from '@/lib/constants/query';
import { getFixtures } from '@/services/fixturesServices';

export function useFixtures() {
  return useQuery({
    queryKey: QUERY_KEYS.fixtures,
    queryFn: getFixtures,
    ...QUERY_CONFIG.fixtures,
  });
}

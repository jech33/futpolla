import { collection, getDocs, query } from 'firebase/firestore';

import { db } from '@/adapters/outbound/firebase/config';
import { groupTableSchema } from '@/adapters/outbound/firebase/validators';
import { handleFirestoreError } from '@/adapters/outbound/shared/errorHandler';
import { getStandingsPath } from '@/adapters/outbound/shared/firestorePaths';
import { GroupTable } from '@/domain/entities';
import { APP_CONFIG } from '@/lib/appConfig';
import { logger } from '@/lib/logger';
import { StandingsRepository } from '@/ports/outbound/StandingsRepository';

export function makeFirestoreStandingsRepository(): StandingsRepository {
  return {
    async getAll(): Promise<GroupTable[]> {
      try {
        logger.debug('Fetching standings', { context: 'firestoreStandingsRepository' });

        const standingsPath = getStandingsPath(APP_CONFIG.tournament.competitionId);
        const standingsQuery = query(collection(db, standingsPath));

        const querySnapshot = await getDocs(standingsQuery);

        const standings = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return groupTableSchema.parse(data);
        });

        logger.info(`Fetched ${standings.length} group standings`, {
          context: 'firestoreStandingsRepository',
        });

        return standings;
      } catch (error) {
        logger.error('Failed to fetch standings', {
          context: 'firestoreStandingsRepository',
          data: error,
        });
        return handleFirestoreError(error, 'getAll');
      }
    },
  };
}

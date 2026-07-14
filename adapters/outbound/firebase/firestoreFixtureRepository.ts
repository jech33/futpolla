import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from '@/adapters/outbound/firebase/config';
import { fixtureSchema } from '@/adapters/outbound/firebase/validators';
import { handleFirestoreError } from '@/adapters/outbound/shared/errorHandler';
import { getMatchesPath } from '@/adapters/outbound/shared/firestorePaths';
import { Fixture } from '@/domain/entities';
import { APP_CONFIG } from '@/lib/appConfig';
import { logger } from '@/lib/logger';
import { FixtureRepository } from '@/ports/outbound/FixtureRepository';

export function makeFirestoreFixtureRepository(): FixtureRepository {
  return {
    async getAll(): Promise<Fixture[]> {
      try {
        logger.debug('Fetching fixtures', { context: 'firestoreFixtureRepository' });

        const matchesPath = getMatchesPath(APP_CONFIG.tournament.competitionId);
        const fixturesQuery = query(collection(db, matchesPath), orderBy('date', 'asc'));

        const querySnapshot = await getDocs(fixturesQuery);

        const fixtures = querySnapshot.docs.map((doc) => {
          const data = { id: doc.id, ...doc.data() };
          return fixtureSchema.parse(data);
        });

        logger.info(`Fetched ${fixtures.length} fixtures`, {
          context: 'firestoreFixtureRepository',
        });

        return fixtures;
      } catch (error) {
        logger.error('Failed to fetch fixtures', {
          context: 'firestoreFixtureRepository',
          data: error,
        });
        return handleFirestoreError(error, 'getAll');
      }
    },
  };
}

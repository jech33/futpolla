import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { APP_CONFIG } from '@/lib/constants/app';
import { getMatchesPath } from '@/lib/constants/firestore';
import { db } from '@/lib/firebase/config';
import { handleFirestoreError } from '@/lib/helpers/errorHandler';
import { logger } from '@/lib/helpers/logger';
import { fixtureSchema } from '@/lib/validators/firebase';
import { Fixture } from '@/types';

/**
 * Fetch all fixtures for the current competition
 * @returns Array of validated fixtures ordered by date
 * @throws FirestoreError if the query fails or data is invalid
 */
export const getFixtures = async (): Promise<Fixture[]> => {
  try {
    logger.debug('Fetching fixtures', { context: 'fixturesService' });

    const matchesPath = getMatchesPath(APP_CONFIG.tournament.competitionId);
    const fixturesQuery = query(collection(db, matchesPath), orderBy('date', 'asc'));

    const querySnapshot = await getDocs(fixturesQuery);

    // Validate each document with Zod
    const fixtures = querySnapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return fixtureSchema.parse(data);
    });

    logger.info(`Fetched ${fixtures.length} fixtures`, { context: 'fixturesService' });

    return fixtures;
  } catch (error) {
    logger.error('Failed to fetch fixtures', { context: 'fixturesService', data: error });
    return handleFirestoreError(error, 'getFixtures');
  }
};

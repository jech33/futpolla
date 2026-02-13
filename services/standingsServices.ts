import { collection, getDocs, query } from 'firebase/firestore';

import { APP_CONFIG } from '@/lib/constants/app';
import { getStandingsPath } from '@/lib/constants/firestore';
import { db } from '@/lib/firebase/config';
import { handleFirestoreError } from '@/lib/helpers/errorHandler';
import { logger } from '@/lib/helpers/logger';
import { groupTableSchema } from '@/lib/validators/firebase';
import { GroupTable } from '@/types';

/**
 * Fetch all group standings for the current competition
 * @returns Array of validated group tables
 * @throws FirestoreError if the query fails or data is invalid
 */
export const getStandings = async (): Promise<GroupTable[]> => {
  try {
    logger.debug('Fetching standings', { context: 'standingsService' });

    const standingsPath = getStandingsPath(APP_CONFIG.tournament.competitionId);
    const standingsQuery = query(collection(db, standingsPath));

    const querySnapshot = await getDocs(standingsQuery);

    // Validate each document with Zod
    const standings = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return groupTableSchema.parse(data);
    });

    logger.info(`Fetched ${standings.length} group standings`, { context: 'standingsService' });

    return standings;
  } catch (error) {
    logger.error('Failed to fetch standings', { context: 'standingsService', data: error });
    return handleFirestoreError(error, 'getStandings');
  }
};

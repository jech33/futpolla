/**
 * Firestore collection and path constants
 */

export const FIRESTORE_COLLECTIONS = {
  competitions: 'competitions',
  users: 'users',
  predictions: 'predictions',
} as const;

/**
 * Get the path to a competition document
 */
export const getCompetitionPath = (competitionId: string) =>
  `${FIRESTORE_COLLECTIONS.competitions}/${competitionId}`;

/**
 * Get the path to the matches subcollection for a competition
 */
export const getMatchesPath = (competitionId: string) =>
  `${getCompetitionPath(competitionId)}/matches`;

/**
 * Get the path to the standings subcollection for a competition
 */
export const getStandingsPath = (competitionId: string) =>
  `${getCompetitionPath(competitionId)}/standings`;

/**
 * Get the path to a user's predictions
 */
export const getUserPredictionsPath = (userId: string) =>
  `${FIRESTORE_COLLECTIONS.predictions}/${userId}`;

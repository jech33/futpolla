import { adminDb } from '@/adapters/outbound/firebase-admin/admin';
import { getMatchesPath, getStandingsPath } from '@/adapters/outbound/shared/firestorePaths';
import { APP_CONFIG } from '@/lib/appConfig';
import { TournamentDataRepository } from '@/ports/outbound/TournamentDataRepository';

export function makeFirestoreTournamentDataRepository(): TournamentDataRepository {
  return {
    async saveSnapshot({ matches, standings }) {
      const competitionId = APP_CONFIG.tournament.competitionId;
      const batch = adminDb.batch();
      let updatesCount = 0;

      const matchesCollectionRef = adminDb.collection(getMatchesPath(competitionId));
      matches.forEach((match) => {
        const docRef = matchesCollectionRef.doc(String(match.id));
        batch.set(docRef, match, { merge: true });
        updatesCount++;
      });

      const standingsCollectionRef = adminDb.collection(getStandingsPath(competitionId));
      standings.forEach((standing) => {
        const docRef = standingsCollectionRef.doc(standing.group);
        batch.set(docRef, standing);
        updatesCount++;
      });

      await batch.commit();

      return { updatesCount };
    },
  };
}

import { makeFirestoreTournamentDataRepository } from '@/adapters/outbound/firebase-admin/firestoreTournamentDataRepository';
import { makeFootballDataSportsDataProvider } from '@/adapters/outbound/football-data/footballDataSportsDataProvider';
import { makeSyncTournamentDataUseCase } from '@/application/syncTournamentData.usecase';

const sportsDataProvider = makeFootballDataSportsDataProvider();
const tournamentDataRepository = makeFirestoreTournamentDataRepository();

export const syncTournamentDataUseCase = makeSyncTournamentDataUseCase(
  sportsDataProvider,
  tournamentDataRepository
);

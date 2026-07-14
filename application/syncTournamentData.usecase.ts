import { SyncTournamentDataUseCase } from '@/ports/inbound/SyncTournamentDataUseCase';
import { SportsDataProvider } from '@/ports/outbound/SportsDataProvider';
import { TournamentDataRepository } from '@/ports/outbound/TournamentDataRepository';

export function makeSyncTournamentDataUseCase(
  sportsDataProvider: SportsDataProvider,
  tournamentDataRepository: TournamentDataRepository
): SyncTournamentDataUseCase {
  return {
    async execute() {
      const [matches, standings] = await Promise.all([
        sportsDataProvider.getMatches(),
        sportsDataProvider.getStandings(),
      ]);

      return tournamentDataRepository.saveSnapshot({ matches, standings });
    },
  };
}

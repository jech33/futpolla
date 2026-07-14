import { GetStandingsUseCase } from '@/ports/inbound/GetStandingsUseCase';
import { StandingsRepository } from '@/ports/outbound/StandingsRepository';

export function makeGetStandingsUseCase(
  standingsRepository: StandingsRepository
): GetStandingsUseCase {
  return {
    execute: () => standingsRepository.getAll(),
  };
}

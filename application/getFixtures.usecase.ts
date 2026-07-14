import { GetFixturesUseCase } from '@/ports/inbound/GetFixturesUseCase';
import { FixtureRepository } from '@/ports/outbound/FixtureRepository';

export function makeGetFixturesUseCase(fixtureRepository: FixtureRepository): GetFixturesUseCase {
  return {
    execute: () => fixtureRepository.getAll(),
  };
}

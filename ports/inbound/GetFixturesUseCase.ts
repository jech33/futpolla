import { Fixture } from '@/domain/entities';

export interface GetFixturesUseCase {
  execute(): Promise<Fixture[]>;
}

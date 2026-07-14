import { Fixture } from '@/domain/entities';

export interface FixtureRepository {
  getAll(): Promise<Fixture[]>;
}

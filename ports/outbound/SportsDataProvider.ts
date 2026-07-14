import { Fixture, GroupTable } from '@/domain/entities';

export interface SportsDataProvider {
  getMatches(): Promise<Partial<Fixture>[]>;
  getStandings(): Promise<GroupTable[]>;
}

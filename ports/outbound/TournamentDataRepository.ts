import { Fixture, GroupTable } from '@/domain/entities';

export interface TournamentDataRepository {
  saveSnapshot(data: {
    matches: Partial<Fixture>[];
    standings: GroupTable[];
  }): Promise<{ updatesCount: number }>;
}

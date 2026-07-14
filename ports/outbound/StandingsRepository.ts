import { GroupTable } from '@/domain/entities';

export interface StandingsRepository {
  getAll(): Promise<GroupTable[]>;
}

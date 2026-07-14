import { GroupTable } from '@/domain/entities';

export interface GetStandingsUseCase {
  execute(): Promise<GroupTable[]>;
}

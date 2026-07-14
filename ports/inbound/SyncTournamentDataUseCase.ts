export interface SyncTournamentDataUseCase {
  execute(): Promise<{ updatesCount: number }>;
}

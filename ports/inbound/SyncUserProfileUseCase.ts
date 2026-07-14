import { UserProfile } from '@/domain/entities';
import { AuthUser } from '@/ports/outbound/AuthProvider';

export interface SyncUserProfileUseCase {
  execute(authUser: AuthUser): Promise<UserProfile>;
}

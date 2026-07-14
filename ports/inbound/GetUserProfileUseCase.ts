import { UserProfile } from '@/domain/entities';

export interface GetUserProfileUseCase {
  execute(uid: string): Promise<UserProfile | null>;
}

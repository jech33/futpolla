import { UserProfile } from '@/domain/entities';
import { AuthUser } from '@/ports/outbound/AuthProvider';

export interface UserRepository {
  getById(uid: string): Promise<UserProfile | null>;
  sync(authUser: AuthUser): Promise<UserProfile>;
}

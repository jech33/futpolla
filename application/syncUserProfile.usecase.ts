import { SyncUserProfileUseCase } from '@/ports/inbound/SyncUserProfileUseCase';
import { AuthUser } from '@/ports/outbound/AuthProvider';
import { UserRepository } from '@/ports/outbound/UserRepository';

export function makeSyncUserProfileUseCase(userRepository: UserRepository): SyncUserProfileUseCase {
  return {
    execute: (authUser: AuthUser) => userRepository.sync(authUser),
  };
}

import { GetUserProfileUseCase } from '@/ports/inbound/GetUserProfileUseCase';
import { UserRepository } from '@/ports/outbound/UserRepository';

export function makeGetUserProfileUseCase(userRepository: UserRepository): GetUserProfileUseCase {
  return {
    execute: (uid: string) => userRepository.getById(uid),
  };
}

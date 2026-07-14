import { AuthenticateUserUseCase } from '@/ports/inbound/AuthenticateUserUseCase';
import { AuthProvider } from '@/ports/outbound/AuthProvider';
import { UserRepository } from '@/ports/outbound/UserRepository';

export function makeAuthenticateUserUseCase(
  authProvider: AuthProvider,
  userRepository: UserRepository
): AuthenticateUserUseCase {
  return {
    async execute() {
      const authUser = await authProvider.signInWithGoogle();
      await userRepository.sync(authUser);
      return authUser;
    },
  };
}

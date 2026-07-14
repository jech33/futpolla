import { SignOutUseCase } from '@/ports/inbound/SignOutUseCase';
import { AuthProvider } from '@/ports/outbound/AuthProvider';

export function makeSignOutUseCase(authProvider: AuthProvider): SignOutUseCase {
  return {
    execute: () => authProvider.signOut(),
  };
}

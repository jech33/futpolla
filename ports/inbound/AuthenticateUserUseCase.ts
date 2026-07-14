import { AuthUser } from '@/ports/outbound/AuthProvider';

export interface AuthenticateUserUseCase {
  execute(): Promise<AuthUser>;
}

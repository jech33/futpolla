import { makeFirebaseAuthProvider } from '@/adapters/outbound/firebase/firebaseAuthProvider';
import { makeFirestoreFixtureRepository } from '@/adapters/outbound/firebase/firestoreFixtureRepository';
import { makeFirestoreStandingsRepository } from '@/adapters/outbound/firebase/firestoreStandingsRepository';
import { makeFirestoreUserRepository } from '@/adapters/outbound/firebase/firestoreUserRepository';
import { makeAuthenticateUserUseCase } from '@/application/authenticateUser.usecase';
import { makeGetFixturesUseCase } from '@/application/getFixtures.usecase';
import { makeGetStandingsUseCase } from '@/application/getStandings.usecase';
import { makeGetUserProfileUseCase } from '@/application/getUserProfile.usecase';
import { makeSignOutUseCase } from '@/application/signOutUser.usecase';
import { makeSyncUserProfileUseCase } from '@/application/syncUserProfile.usecase';

const authProvider = makeFirebaseAuthProvider();
const fixtureRepository = makeFirestoreFixtureRepository();
const standingsRepository = makeFirestoreStandingsRepository();
const userRepository = makeFirestoreUserRepository();

export { authProvider };

export const getFixturesUseCase = makeGetFixturesUseCase(fixtureRepository);
export const getStandingsUseCase = makeGetStandingsUseCase(standingsRepository);
export const getUserProfileUseCase = makeGetUserProfileUseCase(userRepository);
export const syncUserProfileUseCase = makeSyncUserProfileUseCase(userRepository);
export const authenticateUserUseCase = makeAuthenticateUserUseCase(authProvider, userRepository);
export const signOutUseCase = makeSignOutUseCase(authProvider);

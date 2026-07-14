export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  ranking: number;
  role: UserRole;
};

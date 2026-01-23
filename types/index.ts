export type Team = {
  id?: string;
  name: string;
  code: string;
  logo?: string;
};

export type Penalties = {
  home: number;
  away: number;
};

export interface Fixture {
  id: string;
  competitionId: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  stadium?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  penalties?: Penalties | null;
}

export interface Prediction {
  id?: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  penalties?: Penalties | null;
  points?: number;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  ranking: number;
  role: UserRole;
}

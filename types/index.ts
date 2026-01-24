export type Competition = {
  id: string;
  name: string;
  code: string;
  logo: string;
};

export type Season = {
  id: string;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner?: string | null;
};

export type Team = {
  id?: string;
  name: string;
  code: string;
  type?: string;
  logo?: string;
};

export type Score = {
  winner: string | null;
  duration: string;
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
  regularTime: {
    home: number | null;
    away: number | null;
  };
  penalties: {
    home: number | null;
    away: number | null;
  } | null;
};

export type GroupTable = {
  group: string;
  table: Array<{
    position: number;
    team: Team;
    playedGames: number;
    form: string | null;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  }>;
};

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  TIMED = 'TIMED',
  IN_PLAY = 'IN_PLAY',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  POSTPONED = 'POSTPONED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  AWARDED = 'AWARDED',
}

export type Fixture = {
  id: string;
  competition: Competition;
  season: Season;
  status: MatchStatus;
  date: string;
  matchDay?: number | null;
  stage?: string | null;
  group?: string | null;
  awayTeam: Team;
  homeTeam: Team;
  score: Score;
};

export type Prediction = {
  id?: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  penalties?: Score | null;
  points?: number;
};

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

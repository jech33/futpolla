import { Score } from '@/domain/entities/fixture';

export type Prediction = {
  id?: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  penalties?: Score | null;
  points?: number;
};

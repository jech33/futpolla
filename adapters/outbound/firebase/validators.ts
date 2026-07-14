/**
 * Zod schemas for Firebase/Firestore data validation
 * These provide runtime type safety for data read from Firestore
 */
import { z } from 'zod';

import { MatchStatus, UserRole } from '@/domain/entities';

/**
 * Team schema
 */
export const teamSchema = z.object({
  id: z.string().or(z.number()).nullable().optional(),
  name: z.string().min(1).nullable(),
  code: z.string().length(3).nullable(),
  type: z.string().optional(),
  logo: z.string().optional().nullable(),
});

/**
 * Competition schema
 */
export const competitionSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  code: z.string(),
  logo: z.string(),
});

/**
 * Score schema
 */
export const scoreSchema = z.object({
  winner: z.string().nullable(),
  duration: z.string(),
  fullTime: z.object({
    home: z.number().nullable(),
    away: z.number().nullable(),
  }),
  halfTime: z.object({
    home: z.number().nullable(),
    away: z.number().nullable(),
  }),
  regularTime: z.object({
    home: z.number().nullable(),
    away: z.number().nullable(),
  }),
  penalties: z
    .object({
      home: z.number().nullable(),
      away: z.number().nullable(),
    })
    .nullable(),
});

/**
 * Fixture/Match schema
 */
export const fixtureSchema = z.object({
  id: z.string().or(z.number()),
  competition: competitionSchema,
  status: z.nativeEnum(MatchStatus),
  date: z.string(),
  matchDay: z.number().nullable().optional(),
  stage: z.string().nullable().optional(),
  group: z.string().nullable().optional(),
  homeTeam: teamSchema.nullable(),
  awayTeam: teamSchema.nullable(),
  score: scoreSchema,
});

/**
 * Group table entry schema
 */
export const groupTableEntrySchema = z.object({
  position: z.number(),
  team: teamSchema,
  playedGames: z.number(),
  form: z.string().nullable(),
  won: z.number(),
  draw: z.number(),
  lost: z.number(),
  points: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
});

/**
 * Group table schema
 */
export const groupTableSchema = z.object({
  group: z.string(),
  table: z.array(groupTableEntrySchema),
});

/**
 * User profile schema
 */
export const userProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
  totalPoints: z.number().min(0),
  ranking: z.number().min(0),
  role: z.nativeEnum(UserRole),
});

/**
 * Prediction schema
 */
export const predictionSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  matchId: z.string(),
  homeScore: z.number().min(0).max(15),
  awayScore: z.number().min(0).max(15),
  penalties: scoreSchema.nullable().optional(),
  points: z.number().optional(),
});

/**
 * Inferred types from schemas (for convenience)
 */
export type ValidatedFixture = z.infer<typeof fixtureSchema>;
export type ValidatedGroupTable = z.infer<typeof groupTableSchema>;
export type ValidatedUserProfile = z.infer<typeof userProfileSchema>;
export type ValidatedPrediction = z.infer<typeof predictionSchema>;

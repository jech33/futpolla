/**
 * Zod schemas for Football-Data.org API responses
 * These provide runtime type safety for external API data
 */
import { z } from 'zod';

/**
 * Football-Data.org Team schema
 */
export const footballDataTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortName: z.string().optional(),
  tla: z.string(), // Three-letter abbreviation
  crest: z.string().nullable().optional(), // Team logo URL
});

/**
 * Football-Data.org Score schema
 */
export const footballDataScoreSchema = z.object({
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
  regularTime: z
    .object({
      home: z.number().nullable(),
      away: z.number().nullable(),
    })
    .optional(),
  penalties: z
    .object({
      home: z.number().nullable(),
      away: z.number().nullable(),
    })
    .nullable()
    .optional(),
});

/**
 * Football-Data.org Match schema
 */
export const footballDataMatchSchema = z.object({
  id: z.number(),
  utcDate: z.string(),
  status: z.string(),
  matchday: z.number().nullable().optional(),
  stage: z.string().nullable().optional(),
  group: z.string().nullable().optional(),
  homeTeam: footballDataTeamSchema,
  awayTeam: footballDataTeamSchema,
  score: footballDataScoreSchema,
  competition: z
    .object({
      id: z.number(),
      name: z.string(),
      code: z.string(),
      emblem: z.string().nullable().optional(),
    })
    .optional(),
  season: z
    .object({
      id: z.number(),
      startDate: z.string(),
      endDate: z.string(),
      currentMatchday: z.number().nullable().optional(),
    })
    .optional(),
});

/**
 * Football-Data.org Standing table entry schema
 */
export const footballDataTableEntrySchema = z.object({
  position: z.number(),
  team: footballDataTeamSchema,
  playedGames: z.number(),
  form: z.string().nullable().optional(),
  won: z.number(),
  draw: z.number(),
  lost: z.number(),
  points: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
});

/**
 * Football-Data.org Standing schema
 */
export const footballDataStandingSchema = z.object({
  stage: z.string(),
  type: z.string(),
  group: z.string().nullable().optional(),
  table: z.array(footballDataTableEntrySchema),
});

/**
 * Football-Data.org Matches response schema
 */
export const footballDataMatchesResponseSchema = z.object({
  filters: z.object({}).passthrough().optional(),
  resultSet: z
    .object({
      count: z.number(),
      first: z.string(),
      last: z.string(),
      played: z.number(),
    })
    .optional(),
  competition: z
    .object({
      id: z.number(),
      name: z.string(),
      code: z.string(),
      emblem: z.string().nullable().optional(),
    })
    .optional(),
  matches: z.array(footballDataMatchSchema),
});

/**
 * Football-Data.org Standings response schema
 */
export const footballDataStandingsResponseSchema = z.object({
  filters: z.object({}).passthrough().optional(),
  competition: z
    .object({
      id: z.number(),
      name: z.string(),
      code: z.string(),
      emblem: z.string().nullable().optional(),
    })
    .optional(),
  season: z
    .object({
      id: z.number(),
      startDate: z.string(),
      endDate: z.string(),
      currentMatchday: z.number().nullable().optional(),
    })
    .optional(),
  standings: z.array(footballDataStandingSchema),
});

/**
 * Inferred types from schemas
 */
export type FootballDataMatch = z.infer<typeof footballDataMatchSchema>;
export type FootballDataStanding = z.infer<typeof footballDataStandingSchema>;
export type FootballDataMatchesResponse = z.infer<typeof footballDataMatchesResponseSchema>;
export type FootballDataStandingsResponse = z.infer<typeof footballDataStandingsResponseSchema>;

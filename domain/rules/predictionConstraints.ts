/**
 * Validation constraints for predictions and game rules
 */

export const PREDICTION_CONSTRAINTS = {
  minScore: 0,
  maxScore: 15,
  lockMinutesBeforeKickoff: 5,
} as const;

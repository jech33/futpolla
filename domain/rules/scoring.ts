import { Fixture, Prediction } from '@/domain/entities';

/**
 * Computes the points a user's prediction earns against the final result of a fixture.
 * TODO: point scheme not yet defined — see CLAUDE.md follow-up notes.
 */
export function calculatePredictionPoints(prediction: Prediction, fixture: Fixture): number {
  throw new Error('calculatePredictionPoints is not implemented yet');
}

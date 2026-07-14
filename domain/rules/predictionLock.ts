import { Fixture, MatchStatus } from '@/domain/entities';

const OPEN_STATUSES = [MatchStatus.SCHEDULED, MatchStatus.TIMED];

/**
 * A prediction can no longer be changed once the match has kicked off or the
 * data provider has moved it out of a pre-match status.
 */
export function isMatchLocked(match: Fixture, now: Date = new Date()): boolean {
  if (!OPEN_STATUSES.includes(match.status)) {
    return true;
  }

  return new Date(match.date).getTime() <= now.getTime();
}

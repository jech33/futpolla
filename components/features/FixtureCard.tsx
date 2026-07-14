import { Clock } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';

import { Fixture } from '@/domain/entities';
import { isMatchLocked } from '@/domain/rules/predictionLock';
import { cn, specialCharsToSpace } from '@/lib/utils';

import { PredictionStepper } from './PredictionStepper';

type FixtureCardProps = {
  match: Fixture;
};

export function FixtureCard({ match }: FixtureCardProps) {
  const homeTeam = {
    name: match.homeTeam?.name || 'TBD',
    code: match.homeTeam?.code || 'TBD',
    logo: match.homeTeam?.logo || null,
  };
  const awayTeam = {
    name: match.awayTeam?.name || 'TBD',
    code: match.awayTeam?.code || 'TBD',
    logo: match.awayTeam?.logo || null,
  };

  const fixtureTime = new Date(match.date).toLocaleTimeString(undefined, {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  console.log('FixtureCard match:', match);
  const homePenalties = match.score.penalties?.home ?? null;
  const awayPenalties = match.score.penalties?.away ?? null;
  const decidedByPenalties = homePenalties !== null && awayPenalties !== null;

  const homeScore = decidedByPenalties ? match.score.regularTime.home : match.score.fullTime.home;
  const awayScore = decidedByPenalties ? match.score.regularTime.away : match.score.fullTime.away;
  const hasResult = homeScore !== null && awayScore !== null;

  const homeWinning =
    hasResult &&
    (homeScore! > awayScore! || (decidedByPenalties && homePenalties! > awayPenalties!));
  const awayWinning =
    hasResult &&
    (awayScore! > homeScore! || (decidedByPenalties && awayPenalties! > homePenalties!));
  const isLocked = isMatchLocked(match);

  return (
    <Card className="gap-3 pt-3 pb-2">
      <CardHeader className="flex w-full items-center justify-between px-3 text-[11px] tracking-widest capitalize">
        <span className="flex items-center">
          <Clock size={12} className="mr-2 inline-block" /> {fixtureTime}
        </span>
        <span>{match.group && `${specialCharsToSpace(match.group || '')}`}</span>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="flex items-center justify-center gap-3 sm:gap-5 md:text-lg">
          <div className="flex flex-1 flex-wrap-reverse items-center justify-end gap-2">
            <span className="md:hidden">{homeTeam.code}</span>
            <span className="hidden md:block">{homeTeam.name}</span>
            {homeTeam.logo && (
              <Image
                src={homeTeam.logo}
                alt={homeTeam.name}
                width={12}
                height={12}
                className="h-auto w-7 sm:w-8"
              />
            )}
            {hasResult && (
              <span className="ml-1 flex items-center gap-1">
                {decidedByPenalties && (
                  <span className="text-xs text-gray-400">({homePenalties})</span>
                )}
                <span
                  className={cn(
                    'min-w-3.5 border-b-4 border-transparent text-center text-2xl',
                    homeWinning && 'border-green-600',
                    awayWinning && 'text-gray-400'
                  )}
                >
                  {homeScore}
                </span>
              </span>
            )}
          </div>
          <div className="text-center text-gray-500">{'-'}</div>
          <div className="flex flex-1 items-center justify-start gap-2">
            {hasResult && (
              <span className="mr-1 flex items-center gap-1">
                <span
                  className={cn(
                    'min-w-3.5 border-b-4 border-transparent text-center text-2xl',
                    awayWinning && 'border-green-600',
                    homeWinning && 'text-gray-400'
                  )}
                >
                  {awayScore}
                </span>
                {decidedByPenalties && (
                  <span className="text-xs text-gray-400">({awayPenalties})</span>
                )}
              </span>
            )}
            {awayTeam.logo && (
              <Image
                src={awayTeam.logo}
                alt={awayTeam.name}
                width={12}
                height={12}
                className="h-auto w-7 sm:w-8"
              />
            )}
            <span className="md:hidden">{awayTeam.code}</span>
            <span className="hidden md:block">{awayTeam.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center px-0 text-center text-xs tracking-widest capitalize">
        <PredictionStepper matchId={match.id} isLocked={isLocked} />
      </CardFooter>
    </Card>
  );
}
